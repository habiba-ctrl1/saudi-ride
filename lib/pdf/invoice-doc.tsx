import { Document, Page, Text, View, renderToBuffer } from "@react-pdf/renderer";
import { EAGLE_EYES } from "@/lib/pdf/eagle-eyes";
import type { InvoiceRow } from "@/lib/ops/invoices";
import { C, Foot, Header, ItemsTable, Party, PayCard, Strip, Terms, fmtDate, fmtDow, money, px, s, type Item } from "@/lib/pdf/tsa-design";

// Invoice document in the same design as the quotation / receipt (lib/pdf/tsa-design.tsx).
// Every number is read from the stored (frozen) invoice row — nothing is recalculated here.

export function InvoiceDocumentPdf({ inv }: { inv: InvoiceRow }) {
  const cur = inv.currency;
  const hasVat = inv.vat_mode !== "none";
  const owes = inv.balance_at_issue > 0;
  const t = inv.trip;
  const bt = inv.bill_to;
  const isVoid = inv.status === "void";

  const items: Item[] = inv.lines.map((l) => ({ desc: l.description, rate: money(l.unit), qty: String(l.qty), amount: money(Math.round(l.qty * l.unit * 100) / 100) }));
  const clientRows: [string, string][] = [];
  if (bt.company) clientRows.push(["Contact", bt.name]);
  if (bt.vat_no) clientRows.push(["VAT No.", bt.vat_no]);
  if (bt.address) clientRows.push(["Address", bt.address]);
  if (bt.phone) clientRows.push(["Phone", bt.phone]);
  if (bt.email) clientRows.push(["Email", bt.email]);
  const providerRows: [string, string][] = [["Invoice No.", inv.number], ["Date", fmtDate(inv.issue_date)], ["Booking", t.quote_reference]];
  if (inv.po_reference) providerRows.push(["PO Ref.", inv.po_reference]);

  const terms = [inv.payment_terms ?? "", ...(inv.notes ? [inv.notes] : [])].filter(Boolean);
  const badge = isVoid ? "VOID" : !owes ? "Paid in Full" : inv.paid_at_issue > 0 ? "Part Paid — Balance Due" : "Payment Due";

  return (
    <Document title={`Invoice ${inv.number}`}>
      <Page size="A4" style={s.page}>
        <Header title="INVOICE" titleAr="فاتورة" badge={badge} tick={!isVoid && !owes} />
        <View style={s.body}>
          <View style={s.parties}>
            <Party title="Service Provider" name="Taxi Saudi Arabia (TSA)" nameAr="تاكسي السعودية — إدارة وتنظيم النقل" rows={providerRows} />
            <View style={s.partyGap} />
            <Party title={bt.company ? "Billed To (Company)" : "Client"} name={bt.company || bt.name} rows={clientRows} />
          </View>

          <Strip
            service={`Private transfer${t.passengers ? ` — ${t.passengers} pax` : ""}`}
            dates={`${fmtDow(t.trip_date)}${t.trip_time ? ` — ${t.trip_time.slice(0, 5)}` : ""}`}
            route={[t.pickup, t.drop]}
          />

          <ItemsTable items={items} marginTop={px(12)} />

          <View style={[s.totals, { marginTop: px(10) }]} wrap={false}>
            <View style={s.tRow}><Text style={s.tRowK}>{hasVat ? "Subtotal (excl. VAT)" : "Subtotal"}</Text><Text style={s.tRowV}>{cur} {money(inv.subtotal)}</Text></View>
            <View style={s.tRow}><Text style={s.tRowK}>{hasVat ? `VAT (${Math.round(inv.vat_rate * 100)}%)` : "VAT"}</Text><Text style={s.tRowV}>{hasVat ? `${cur} ${money(inv.vat_amount)}` : "Not charged"}</Text></View>
            <View style={s.grand}><Text style={s.grandT}>Total Payable</Text><Text style={s.grandT}>{cur} {money(inv.total)}</Text></View>
            <View style={s.tRow}><Text style={s.tRowK}>Paid to date (at issue)</Text><Text style={s.tRowV}>{cur} {money(inv.paid_at_issue)}</Text></View>
            <View style={[s.tRow, { borderTopWidth: 0.75, borderTopColor: C.line }]}>
              <Text style={[s.tRowK, { fontWeight: 700, color: owes ? C.amber : C.green }]}>Balance outstanding</Text>
              <Text style={[s.tRowV, { fontWeight: 700, color: owes ? C.amber : C.green }]}>{cur} {money(inv.balance_at_issue)}</Text>
            </View>
          </View>

          {hasVat && owes ? (
            <PayCard
              marginTop={px(14)}
              rows={[["Bank", `${EAGLE_EYES.bankName} — ${EAGLE_EYES.accountName}`], ["IBAN", EAGLE_EYES.iban], ["SWIFT/BIC", EAGLE_EYES.swift]]}
              after="Please share the payment confirmation on WhatsApp."
            />
          ) : null}

          {hasVat ? (
            <View style={[s.pay, { marginTop: px(12) }]} wrap={false}>
              <Text style={s.payH}>VAT billing partner</Text>
              <Text style={{ fontSize: px(11), lineHeight: 1.5, color: C.ink }}>
                Issued by Taxi Saudi Arabia on behalf of the registered VAT billing partner, {EAGLE_EYES.nameEn} (VAT No. {EAGLE_EYES.vatNo}, CR No. {EAGLE_EYES.crNo}). Its official ZATCA-compliant tax invoice (with QR code) is issued directly after payment is received.
              </Text>
            </View>
          ) : null}

          <Terms items={terms} marginTop={px(12)} />
          <Foot contact={false} marginTop={px(8)} en="This invoice is issued by Taxi Saudi Arabia (TSA) for the private transfer described above." ar="فاتورة صادرة من تاكسي السعودية للنقل الخاص الموضح أعلاه" />
        </View>

        {isVoid ? (
          <View style={[s.stamp, { borderColor: "#B91C1C", top: 300, left: 110, paddingHorizontal: 30, transform: "rotate(-18deg)" }]} fixed>
            <Text style={[s.stampMain, { color: "#B91C1C", fontSize: 64, letterSpacing: 8 }]}>VOID</Text>
          </View>
        ) : null}
      </Page>
    </Document>
  );
}

export async function renderInvoiceDocPdf(inv: InvoiceRow): Promise<Buffer> {
  return renderToBuffer(<InvoiceDocumentPdf inv={inv} />);
}
