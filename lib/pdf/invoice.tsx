import { Document, Page, Text, View, renderToBuffer } from "@react-pdf/renderer";
import { EAGLE_EYES } from "@/lib/pdf/eagle-eyes";
import type { QuotationRow } from "@/lib/supabase/quotations";
import type { ReceiptInfo } from "@/lib/ops/payments";
import { C, Foot, Header, ItemsTable, KV, Party, PayCard, Strip, Terms, Totals, VehicleCard, fmtDate, fmtDow, money, px, s, type Item } from "@/lib/pdf/tsa-design";

// Quotation + receipt documents, in the approved client-PDF design (see lib/pdf/tsa-design.tsx).
// Quotation = what the customer is being offered; receipt = proof of ONE recorded payment (PAID stamp only if the fare is settled).

type TripExtras = {
  vehicleLabel?: string;
  purpose?: string;
  serviceHours?: string;
  itinerary?: string[];
  itineraryNote?: string;
  included?: string[];
  excluded?: string[];
  customTerms?: string[];
  validUntil?: string;
  notes?: string;
  paymentMethod?: string;
};

const SINGLE_LINE_MARKERS = {
  "VEHICLE:": "vehicleLabel",
  "FOR:": "purpose",
  "SERVICE HOURS:": "serviceHours",
  "ITINERARY_NOTE:": "itineraryNote",
  "VALID UNTIL:": "validUntil",
  "PAYMENT:": "paymentMethod",
} as const;
const LIST_MARKERS = {
  "ITINERARY:": "itinerary",
  "NOT INCLUDED:": "excluded",
  "INCLUDED:": "included",
  "TERMS:": "customTerms",
} as const;

/**
 * luggage_notes is a plain free-text column shared by every quotation type. Multi-stop tour quotes additionally encode a
 * structured block of "MARKER: value" / "MARKER:" + bullet lines inside it (itinerary, exclusions, custom terms, validity,
 * payment method) — no schema change; a quotation without markers simply shows its text as notes.
 */
function parseTripExtras(luggageNotes: string | null): TripExtras {
  if (!luggageNotes) return {};
  const allMarkers = [...Object.keys(SINGLE_LINE_MARKERS), ...Object.keys(LIST_MARKERS)];
  if (!allMarkers.some((h) => luggageNotes.includes(h))) return { notes: luggageNotes };

  const extras: TripExtras = {};
  let current: (typeof LIST_MARKERS)[keyof typeof LIST_MARKERS] | null = null;
  const leftover: string[] = [];
  for (const rawLine of luggageNotes.split("\n")) {
    const line = rawLine.trim();
    if (!line) continue;
    const singleMatch = (Object.keys(SINGLE_LINE_MARKERS) as Array<keyof typeof SINGLE_LINE_MARKERS>).find((m) => line.startsWith(m));
    if (singleMatch) { extras[SINGLE_LINE_MARKERS[singleMatch]] = line.slice(singleMatch.length).trim(); current = null; continue; }
    const listMatch = (Object.keys(LIST_MARKERS) as Array<keyof typeof LIST_MARKERS>).find((m) => line.startsWith(m));
    if (listMatch) { current = LIST_MARKERS[listMatch]; extras[current] = extras[current] ?? []; continue; }
    const bullet = line.replace(/^[-•\d.]+\s*/, "");
    if (current) extras[current]!.push(bullet); else leftover.push(line);
  }
  if (leftover.length) extras.notes = leftover.join(" ");
  return extras;
}

const VEH: Record<string, string> = { sedan: "Executive sedan", suv: "Full-size SUV", van: "Van", bus: "Coach", limousine: "Limousine / VIP" };
const TRIP: Record<string, string> = { one_way: "one way", round_trip: "round trip", airport_transfer: "airport transfer", hourly: "hourly hire", multi_day: "multi-day", event: "event transfer" };

const addDays = (d: string, n: number) => { const t = new Date(`${d.slice(0, 10)}T12:00:00`); t.setDate(t.getDate() + n); return t; };

export function InvoiceDocument({ q, mode = "quotation", receipt }: { q: QuotationRow; mode?: "quotation" | "receipt"; receipt?: ReceiptInfo | null }) {
  const isReceipt = mode === "receipt";
  const cur = q.currency || "SAR";
  const fare = q.quoted_price ?? 0;
  const extras = parseTripExtras(q.luggage_notes);

  // Receipt facts come from the payments ledger (ReceiptInfo). Older frozen receipts fall back to the booking's own totals.
  const paidSoFar = q.actual_amount_paid ?? 0;
  const ri: ReceiptInfo = receipt ?? {
    paymentId: null, amount: paidSoFar, currency: cur, method: q.payment_method_used ?? "Not specified", reference: null, paidAt: null,
    paidToDate: paidSoFar, total: q.quoted_price, fullyPaid: q.payment_status === "paid" && paidSoFar > 0,
    balance: q.payment_status === "paid" ? 0 : q.quoted_price != null ? Math.max(q.quoted_price - paidSoFar, 0) : null, paymentNo: 1,
  };

  const veh = extras.vehicleLabel || (q.vehicle_type_requested ? VEH[q.vehicle_type_requested] : null);
  const pax = q.passengers_count;
  const tripWord = TRIP[q.trip_type] ?? "one way";
  const issueDate = isReceipt && ri.paidAt ? fmtDate(ri.paidAt) : fmtDate(q.updated_at ?? q.created_at);
  const validUntil = q.valid_until ? fmtDate(q.valid_until) : extras.validUntil ? fmtDate(extras.validUntil) : fmtDate(addDays(q.trip_date, 7));
  const isBank = !isReceipt && (extras.paymentMethod ?? "").toLowerCase().includes("bank");
  const confirmed = q.status === "confirmed" || q.status === "assigned";

  const dates = `${fmtDow(q.trip_date)}${q.trip_time ? ` — ${q.trip_time.slice(0, 5)}` : ""}${q.return_date ? ` · return ${fmtDate(q.return_date)}` : ""}`;
  const service = `Private ${q.trip_type === "airport_transfer" ? "airport transfer" : "transfer"}${q.trip_type === "airport_transfer" ? "" : ` — ${tripWord}`}`;

  const subParts = [
    `Pickup ${fmtDate(q.trip_date)}${q.trip_time ? `, ${q.trip_time.slice(0, 5)}` : ""}`,
    pax ? `${pax} passenger${pax > 1 ? "s" : ""}${extras.notes ? ` + ${extras.notes}` : ""}` : extras.notes ?? null,
    tripWord,
    veh,
    extras.itinerary?.length ? `Itinerary: ${extras.itinerary.join(" · ")}` : null,
    extras.excluded?.length ? `Not included: ${extras.excluded.join(", ")}` : null,
  ].filter(Boolean) as string[];
  const items: Item[] = [{
    desc: extras.itinerary?.length && extras.vehicleLabel ? `${extras.vehicleLabel} — full-day private service` : `Private transfer — ${q.pickup_location} to ${q.drop_location}`,
    sub: subParts.join(" · "), rate: money(fare), qty: "1", amount: money(fare),
  }];

  const vehName = veh ?? "Private vehicle";
  const assigned = q.vehicle_detail ? ` Assigned vehicle: ${q.vehicle_detail}.` : "";
  const vehDesc = `${vehName}${pax ? ` for ${pax} passenger${pax > 1 ? "s" : ""}` : ""} — private transfer, driver included.${assigned}`;

  // ── header text ──
  const title = isReceipt ? "RECEIPT" : "QUOTATION";
  const titleAr = isReceipt ? "إيصال دفع — تم استلام المبلغ" : confirmed ? "عرض سعر / تأكيد حجز" : "عرض سعر";
  const badge = isReceipt
    ? ri.fullyPaid ? "Payment Received" : "Part Payment Received"
    : q.status === "cancelled" ? "Cancelled" : q.status === "completed" ? "Completed" : confirmed ? `Booking Confirmed${q.payment_status === "paid" ? "" : " — Pending Payment"}` : "Quotation — Awaiting Your Confirmation";

  const partyRows: [string, string][] = isReceipt
    ? [["Receipt No.", q.quote_reference + (ri.paymentNo > 1 ? `-P${ri.paymentNo}` : "")], ["Date", issueDate], ["Status", ri.fullyPaid ? "Paid in Full" : "Part Payment"]]
    : [["Quotation No.", q.quote_reference], ["Date", issueDate], ["Valid Until", validUntil]];
  const clientRows: [string, string][] = [["Phone", q.customer_phone]];
  if (q.customer_email) clientRows.push(["Email", q.customer_email]);

  const terms = extras.customTerms?.length
    ? extras.customTerms
    : isReceipt
      ? ["Price is all inclusive; payment method shown above.", "Trip scheduled for the date and route above.", "Thank you for traveling with Taxi Saudi Arabia."]
      : [
          "This price includes the driver and fuel for the trip described above.",
          "Any change in date, time, route, pickup point or vehicle may adjust the price.",
          "Free cancellation up to 24 hours before pickup.",
          "Extra stops, waiting beyond 30 minutes, or additional passengers/luggage not listed above may be charged separately.",
        ];

  const stampColor = ri.fullyPaid ? C.green : C.amber;
  const mt = isReceipt ? px(22) : px(12);

  return (
    <Document title={`${isReceipt ? "Receipt" : "Quotation"} ${q.quote_reference}`}>
      <Page size="A4" style={s.page}>
        <Header title={title} titleAr={titleAr} badge={badge} tick={isReceipt && ri.fullyPaid} />
        <View style={s.body}>
          <View style={s.parties}>
            <Party title="Service Provider" name="Taxi Saudi Arabia (TSA)" nameAr="تاكسي السعودية — إدارة وتنظيم النقل" rows={partyRows} />
            <View style={s.partyGap} />
            <Party title="Client" name={q.customer_name} rows={clientRows} />
          </View>

          <Strip service={service} dates={dates} route={[q.pickup_location, q.drop_location]} />
          <VehicleCard name={vehName} desc={vehDesc} plate={q.vehicle_plate} marginTop={mt} />
          <ItemsTable items={items} marginTop={mt} />

          {isReceipt ? (
            <Totals
              marginTop={px(16)}
              rows={!ri.fullyPaid || ri.paymentNo > 1 ? [["Trip total", `${cur} ${money(fare)}`], ["Received to date", `${cur} ${money(ri.paidToDate)}`], ["Balance remaining", ri.balance == null ? "Fare not set" : `${cur} ${money(ri.balance)}`]] : undefined}
              grandLabel={ri.fullyPaid && ri.paymentNo === 1 ? "Amount Paid" : "Amount Received"} grandValue={`${cur} ${money(ri.amount)}`}
            />
          ) : (
            <Totals marginTop={px(10)} grandLabel={isBank ? "Total (bank transfer)" : "Total (cash)"} grandValue={`${cur} ${money(fare)}`} />
          )}

          {isReceipt ? (
            <PayCard
              marginTop={px(24)} padV={px(14)}
              rows={[["Method", `${ri.method}${ri.reference ? ` — ref ${ri.reference}` : ""}`], ["Status", ri.fullyPaid ? "Received in full" : "Part payment"]]}
              after={ri.fullyPaid ? "Payment for this transfer has been received in full. No balance is due." : ri.balance == null ? "Part payment received." : `Part payment received — a balance of ${cur} ${money(ri.balance)} remains payable.`}
            />
          ) : isBank ? (
            <PayCard
              marginTop={px(14)}
              rows={[["Method", "Bank transfer"], ["Account name", EAGLE_EYES.accountName], ["Bank", EAGLE_EYES.bankName], ["IBAN", EAGLE_EYES.iban], ["SWIFT/BIC", EAGLE_EYES.swift]]}
              after="Please transfer the total above and share the payment confirmation on WhatsApp."
            />
          ) : (
            <PayCard marginTop={px(14)} rows={[["Method", "Cash on pickup, paid directly to the driver"]]} />
          )}

          <Terms items={terms} marginTop={isReceipt ? px(20) : px(12)} />
          <Foot
            marginTop={isReceipt ? px(14) : px(8)}
            en={isReceipt
              ? "This receipt confirms payment received by Taxi Saudi Arabia (TSA) for the private transfer described above."
              : "This quotation is issued by Taxi Saudi Arabia (TSA) for the private transfer described above."}
            ar={isReceipt ? "هذا الإيصال يؤكد استلام الدفع من تاكسي السعودية مقابل النقل الخاص الموضح أعلاه" : "عرض سعر صادر من تاكسي السعودية للنقل الخاص الموضح أعلاه"}
          />
        </View>

        {isReceipt ? (
          <View style={[s.stamp, { borderColor: stampColor }]}>
            <Text style={[s.stampMain, { color: stampColor }, ri.fullyPaid ? {} : { fontSize: px(22), letterSpacing: px(3) }]}>{ri.fullyPaid ? "PAID" : "PART PAYMENT"}</Text>
            <Text style={[s.stampSub, { color: stampColor }]}>{ri.fullyPaid ? "RECEIVED IN FULL" : ri.balance == null ? "BALANCE OPEN" : `BALANCE ${cur} ${money(ri.balance)}`}</Text>
          </View>
        ) : null}
      </Page>
    </Document>
  );
}

// Re-exported for convenience: KV is used by the invoice document.
export { KV };

export async function renderInvoicePdf(q: QuotationRow, mode: "quotation" | "receipt" = "quotation", receipt?: ReceiptInfo | null): Promise<Buffer> {
  return renderToBuffer(<InvoiceDocument q={q} mode={mode} receipt={receipt} />);
}
