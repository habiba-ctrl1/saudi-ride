// Operator-triggered client emails for the ops workflow. Every value is pulled from the quotation row —
// nothing is typed twice. Only confirmed business facts are stated (free cancellation up to 24h before
// pickup, cash to driver or bank transfer, electronic receipt on request). No model names unless a
// driver/vehicle was actually assigned on the record.
// Look: same as the customer PDFs (logo header band, grey cards, green total box, yellow payment card).
import { wrapper, row, table, strip, totalBox, payCard, termsList, cta, para, esc, receiptEmail } from "@/lib/email/templates";
import type { ReceiptInfo } from "@/lib/ops/payments";
import { TRUSTPILOT_REVIEW_URL } from "@/lib/reviews";
import { contactConfig } from "@/lib/config/contact";
import type { QuotationRow } from "@/lib/supabase/quotations";

import type { OpsTemplate } from "@/lib/email/ops-template-labels";
export { OPS_TEMPLATE_LABEL, type OpsTemplate } from "@/lib/email/ops-template-labels";

const VEHICLE_LABEL: Record<string, string> = {
  sedan: "Executive sedan",
  suv: "Full-size SUV",
  van: "Van",
  bus: "Coach",
  limousine: "Limousine",
};
const TRIP_LABEL: Record<string, string> = { one_way: "one way", round_trip: "round trip", airport_transfer: "airport transfer", hourly: "hourly hire", multi_day: "multi-day", event: "event transfer" };

const fmtMoney = (n: number, cur: string) => `${cur} ${Number.isInteger(n) ? n.toLocaleString("en-US") : n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const fmtDate = (d: string) => {
  const dt = new Date(`${d}T00:00:00Z`);
  return Number.isNaN(dt.getTime()) ? d : dt.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
};
const fmtTime = (t: string | null) => (t ? t.slice(0, 5) : null);

/** Service / Dates / Route strip + a small details card (reference, vehicle, passengers). */
function tripBlock(q: QuotationRow) {
  const when = fmtDate(q.trip_date) + (q.trip_time ? ` — ${fmtTime(q.trip_time)}` : "") + (q.return_date ? ` · return ${fmtDate(q.return_date)}` : "");
  const veh = q.vehicle_type_requested ? VEHICLE_LABEL[q.vehicle_type_requested] ?? q.vehicle_type_requested : null;
  const svc = `Private ${q.trip_type === "airport_transfer" ? "airport transfer" : `transfer — ${TRIP_LABEL[q.trip_type] ?? "one way"}`}`;
  return (
    strip(esc(svc), esc(when), `${esc(q.pickup_location)}<br/><span style="color:#16A34A;">→</span> ${esc(q.drop_location)}`) +
    table(
      row("Reference", `<strong style="color:#16A34A;">${esc(q.quote_reference)}</strong>`) +
      (veh ? row("Vehicle", esc(veh)) : "") +
      (q.passengers_count ? row("Passengers", String(q.passengers_count)) : ""),
    )
  );
}

const waLink = (text: string) => `${contactConfig.whatsappLink}?text=${encodeURIComponent(text)}`;
const POLICY = [
  "This price includes the driver and fuel for the trip described above.",
  "Free cancellation up to 24 hours before pickup.",
  "Any change in date, time, route, pickup point or vehicle may adjust the price.",
];
const PAY_CASH = row("Method", "Cash on pickup, paid directly to the driver, or by bank transfer");

export function opsEmail(template: OpsTemplate, q: QuotationRow, receipt?: ReceiptInfo | null): { subject: string; html: string; attachQuotationPdf: boolean } {
  const name = esc(q.customer_name.trim());
  const cur = q.currency || "SAR";
  const ref = q.quote_reference;

  if (template === "quotation") {
    const body =
      para(`Dear <strong>${name}</strong>,`) +
      para("Thank you for your enquiry. Your quotation for a private chauffeur transfer is below and attached as a PDF.") +
      tripBlock(q) +
      totalBox("Total (cash)", fmtMoney(q.quoted_price ?? 0, cur), q.valid_until ? `Valid until ${esc(fmtDate(q.valid_until))}` : undefined) +
      payCard(PAY_CASH) +
      termsList(POLICY) +
      `<p style="margin:18px 0 4px;">${cta("Confirm on WhatsApp", waLink(`Hello, I would like to confirm quotation ${ref}.`))}</p>` +
      para(`<span style="font-size:12px;color:#6B7280;">Or simply reply to this email. Electronic receipt available on request.</span>`);
    return {
      subject: `Your Quotation ${ref} — Taxi Saudi Arabia`,
      html: wrapper("Your quotation is ready", body, "You are receiving this email because you requested a quotation from Taxi Saudi Arabia.", { docTitle: "QUOTATION", docTitleAr: "عرض سعر", badge: "Quotation — Awaiting Your Confirmation" }),
      attachQuotationPdf: true,
    };
  }

  if (template === "followup") {
    const body =
      para(`Dear <strong>${name}</strong>,`) +
      para("We wanted to follow up on the quotation we sent for your trip. Would you like to go ahead? If your plans have changed or you need a different vehicle or time, tell us and we will update it.") +
      tripBlock(q) +
      (q.quoted_price != null ? totalBox("Total (cash)", fmtMoney(q.quoted_price, cur)) : "") +
      termsList(POLICY) +
      `<p style="margin:18px 0 4px;">${cta("Yes, please book it", waLink(`Hello, please go ahead with quotation ${ref}.`))}</p>`;
    return {
      subject: `Following up on your quotation ${ref} — Taxi Saudi Arabia`,
      html: wrapper("Would you like to proceed?", body, "You are receiving this email because you requested a quotation from Taxi Saudi Arabia.", { docTitle: "FOLLOW-UP", docTitleAr: "متابعة عرض السعر" }),
      attachQuotationPdf: true,
    };
  }

  if (template === "confirmation") {
    const body =
      para(`Dear <strong>${name}</strong>,`) +
      para("Your booking is confirmed. Details are below; we will share your driver and vehicle details before pickup.") +
      tripBlock(q) +
      (q.quoted_price != null ? totalBox("Total (cash)", fmtMoney(q.quoted_price, cur)) : "") +
      payCard(PAY_CASH) +
      termsList(POLICY) +
      `<p style="margin:18px 0 4px;">${cta("Change something? WhatsApp us", waLink(`Hello, about my booking ${ref}:`))}</p>`;
    return {
      subject: `Booking Confirmed — ${ref} — Taxi Saudi Arabia`,
      html: wrapper("Your booking is confirmed", body, "You are receiving this email because you have a booking with Taxi Saudi Arabia.", { docTitle: "BOOKING", docTitleAr: "تأكيد حجز", badge: "Booking Confirmed" }),
      attachQuotationPdf: false,
    };
  }

  if (template === "pickup") {
    const dName = q.driver_name ?? q.drivers?.full_name ?? null;
    const dPhone = q.driver_phone ?? q.drivers?.phone ?? null;
    const dVeh = q.vehicle_detail ?? (q.drivers ? [q.drivers.vehicle_model, q.drivers.vehicle_type?.toUpperCase()].filter(Boolean).join(" — ") : null);
    const dPlate = q.vehicle_plate ?? q.drivers?.vehicle_plate_number ?? null;
    const driverRows =
      (dName ? row("Driver", `<strong>${esc(dName)}</strong>`) : "") +
      (dPhone ? row("Driver phone", `<a href="tel:${esc(dPhone).replace(/[^0-9+]/g, "")}" style="color:#16A34A;text-decoration:none;">${esc(dPhone)}</a>`) : "") +
      (dVeh ? row("Vehicle", esc(dVeh)) : "") +
      (dPlate ? row("Plate", `<strong>${esc(dPlate)}</strong>`) : "");
    const body =
      para(`Dear <strong>${name}</strong>,`) +
      para("Here are your driver and pickup details for the trip below. Your driver will contact you before arrival.") +
      (driverRows ? `<div style="margin-bottom:12px;">${table(driverRows)}</div>` : "") +
      tripBlock(q) +
      `<p style="margin:18px 0 4px;">${cta("Any change on the day? WhatsApp us", waLink(`Hello, about my trip ${ref}:`))}</p>`;
    return {
      subject: `Your driver & pickup details — ${ref} — Taxi Saudi Arabia`,
      html: wrapper("Your driver &amp; pickup details", body, "You are receiving this email because you have a booking with Taxi Saudi Arabia.", { docTitle: "PICKUP DETAILS", docTitleAr: "تفاصيل السائق", badge: "Driver Assigned" }),
      attachQuotationPdf: false,
    };
  }

  if (template === "receipt") {
    const r = receiptEmail({
      quoteReference: ref, customerName: q.customer_name, pickup: q.pickup_location, dropoff: q.drop_location, tripDate: q.trip_date, tripTime: q.trip_time,
      amountPaid: receipt?.amount ?? q.actual_amount_paid ?? 0, currency: cur, paymentMethod: receipt?.method ?? q.payment_method_used ?? "Not specified",
      partial: receipt && !receipt.fullyPaid ? { balance: receipt.balance } : null,
      running: receipt ? { total: receipt.total, paidToDate: receipt.paidToDate, paymentNo: receipt.paymentNo } : null,
      driverName: q.driver_name ?? q.drivers?.full_name ?? null, driverPhone: q.driver_phone ?? q.drivers?.phone ?? null,
      vehicleLabel: q.vehicle_detail ?? null, vehiclePlate: q.vehicle_plate ?? null,
      reviewUrl: TRUSTPILOT_REVIEW_URL,
    });
    return { ...r, attachQuotationPdf: false };
  }

  // thankyou
  const body =
    para(`Dear <strong>${name}</strong>,`) +
    para(`Thank you for travelling with Taxi Saudi Arabia. We hope your journey from ${esc(q.pickup_location)} to ${esc(q.drop_location)} was comfortable.`) +
    para("If you need a transfer again, or would like a receipt for this trip, just reply to this email.") +
    para("We would be grateful to hear how it went.") +
    `<p style="margin:18px 0 4px;">${cta("Message us on WhatsApp", waLink(`Hello, about my trip ${ref}:`))}</p>`;
  return {
    subject: `Thank you for travelling with us — ${ref}`,
    html: wrapper("Thank you for riding with us", body, "You are receiving this email because you completed a trip with Taxi Saudi Arabia.", { docTitle: "THANK YOU", docTitleAr: "شكراً لك", badge: "Trip Completed" }),
    attachQuotationPdf: false,
  };
}
