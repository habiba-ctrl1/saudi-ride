// Operator-triggered client emails for the ops workflow. Every value is pulled from the quotation row —
// nothing is typed twice. Only confirmed business facts are stated (free cancellation up to 24h before
// pickup, cash to driver or bank transfer, electronic receipt on request). No model names unless a
// driver/vehicle was actually assigned on the record.
import { wrapper, row, table, esc, receiptEmail } from "@/lib/email/templates";
import { contactConfig } from "@/lib/config/contact";
import type { QuotationRow } from "@/lib/supabase/quotations";

const GREEN = "#16A34A";
const YELLOW = "#FACC15";

export type OpsTemplate = "quotation" | "followup" | "confirmation" | "pickup" | "thankyou" | "receipt";

export const OPS_TEMPLATE_LABEL: Record<OpsTemplate, string> = {
  quotation: "New Quotation",
  followup: "Quotation Follow-up",
  confirmation: "Booking Confirmation",
  pickup: "Driver / Pickup Details",
  thankyou: "Ride Completion / Thank You",
  receipt: "Payment / Receipt",
};

const VEHICLE_LABEL: Record<string, string> = {
  sedan: "Executive sedan",
  suv: "Full-size SUV",
  van: "Van",
  bus: "Coach",
  limousine: "Limousine",
};

const money = (n: number, cur: string) => `${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${cur}`;
const fmtDate = (d: string) => {
  const dt = new Date(`${d}T00:00:00Z`);
  return Number.isNaN(dt.getTime()) ? d : dt.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
};
const fmtTime = (t: string | null) => (t ? t.slice(0, 5) : null);

function tripRows(q: QuotationRow) {
  const when = fmtDate(q.trip_date) + (q.trip_time ? ` · ${fmtTime(q.trip_time)}` : "");
  const veh = q.vehicle_type_requested ? VEHICLE_LABEL[q.vehicle_type_requested] ?? q.vehicle_type_requested : null;
  return (
    row("Reference", `<strong style="color:${GREEN};">${esc(q.quote_reference)}</strong>`) +
    row("Pick-up", esc(q.pickup_location)) +
    row("Drop-off", esc(q.drop_location)) +
    row("Date &amp; time", esc(when)) +
    (q.return_date ? row("Return", esc(fmtDate(q.return_date))) : "") +
    (veh ? row("Vehicle", esc(veh)) : "") +
    (q.passengers_count ? row("Passengers", String(q.passengers_count)) : "")
  );
}

const TERMS = `
  <p style="color:#5B6B60;font-size:12px;line-height:1.7;margin-top:16px;">
    Free cancellation up to 24 hours before pickup · Pay in cash to your driver or by bank transfer ·
    Electronic receipt available on request.
  </p>`;

const ASK = `
  <p style="color:#49505a;font-size:13px;line-height:1.7;margin-top:16px;">
    To confirm, simply reply to this email or message us on
    <a href="${contactConfig.whatsappLink}" style="color:${GREEN};font-weight:bold;">WhatsApp ${contactConfig.primaryPhoneDisplay}</a>.
  </p>`;

export function opsEmail(template: OpsTemplate, q: QuotationRow): { subject: string; html: string; attachQuotationPdf: boolean } {
  const name = esc(q.customer_name.trim());
  const cur = q.currency || "SAR";
  const ref = q.quote_reference;

  if (template === "quotation") {
    const valid = q.valid_until ? `<p style="color:#5B6B60;font-size:12px;margin:8px 0 0;">Valid until ${esc(fmtDate(q.valid_until))}.</p>` : "";
    const body = `
      <p style="color:#49505a;font-size:14px;line-height:1.7;">Dear <strong>${name}</strong>,<br/><br/>
        Thank you for your enquiry. Your quotation for a private chauffeur transfer is below and attached as a PDF.</p>
      <div style="background:${GREEN};border-radius:10px;padding:16px 20px;margin:18px 0;text-align:center;">
        <div style="color:#d9f5d7;font-size:11px;letter-spacing:1px;">TOTAL FARE</div>
        <div style="color:${YELLOW};font-size:24px;font-weight:bold;margin-top:4px;">${money(q.quoted_price ?? 0, cur)}</div>
        ${valid}
      </div>
      ${table(tripRows(q))}${ASK}${TERMS}`;
    return {
      subject: `Your Quotation ${ref} — Taxi Saudi Arabia`,
      html: wrapper("Your quotation is ready", body, "You are receiving this email because you requested a quotation from Taxi Saudi Arabia."),
      attachQuotationPdf: true,
    };
  }

  if (template === "followup") {
    const body = `
      <p style="color:#49505a;font-size:14px;line-height:1.7;">Dear <strong>${name}</strong>,<br/><br/>
        We wanted to follow up on the quotation we sent for your trip. Would you like to go ahead? If your plans have changed or you need a different vehicle or time, tell us and we will update it.</p>
      ${table(tripRows(q) + (q.quoted_price != null ? row("Fare", `<strong>${money(q.quoted_price, cur)}</strong>`) : ""))}${ASK}${TERMS}`;
    return {
      subject: `Following up on your quotation ${ref} — Taxi Saudi Arabia`,
      html: wrapper("Would you like to proceed?", body, "You are receiving this email because you requested a quotation from Taxi Saudi Arabia."),
      attachQuotationPdf: true,
    };
  }

  if (template === "confirmation") {
    const body = `
      <p style="color:#49505a;font-size:14px;line-height:1.7;">Dear <strong>${name}</strong>,<br/><br/>
        Your booking is confirmed. Details are below; we will share your driver and vehicle details before pickup.</p>
      ${table(tripRows(q) + (q.quoted_price != null ? row("Fare", `<strong>${money(q.quoted_price, cur)}</strong>`) : ""))}${TERMS}
      <p style="color:#49505a;font-size:13px;line-height:1.7;margin-top:12px;">
        Need to change anything? <a href="${contactConfig.whatsappLink}" style="color:${GREEN};font-weight:bold;">WhatsApp us</a>.</p>`;
    return {
      subject: `Booking Confirmed — ${ref} — Taxi Saudi Arabia`,
      html: wrapper("Your booking is confirmed ✔", body, "You are receiving this email because you have a booking with Taxi Saudi Arabia."),
      attachQuotationPdf: false,
    };
  }

  if (template === "pickup") {
    const dName = q.driver_name ?? q.drivers?.full_name ?? null;
    const dPhone = q.driver_phone ?? q.drivers?.phone ?? null;
    const dVeh = q.vehicle_detail ?? (q.drivers ? [q.drivers.vehicle_model, q.drivers.vehicle_type?.toUpperCase()].filter(Boolean).join(" — ") : null);
    const dPlate = q.vehicle_plate ?? q.drivers?.vehicle_plate_number ?? null;
    const body = `
      <p style="color:#49505a;font-size:14px;line-height:1.7;">Dear <strong>${name}</strong>,<br/><br/>
        Here are your driver and pickup details for the trip below. Your driver will contact you before arrival.</p>
      ${table(
        tripRows(q) +
        (dName ? row("Driver", esc(dName) + (dPhone ? ` — ${esc(dPhone)}` : "")) : "") +
        (dVeh ? row("Vehicle", esc(dVeh)) : "") +
        (dPlate ? row("Plate", esc(dPlate)) : ""),
      )}
      <p style="color:#49505a;font-size:13px;line-height:1.7;margin-top:16px;">
        Any change on the day? <a href="${contactConfig.whatsappLink}" style="color:${GREEN};font-weight:bold;">WhatsApp us</a> and we will coordinate immediately.</p>`;
    return {
      subject: `Your driver & pickup details — ${ref} — Taxi Saudi Arabia`,
      html: wrapper("Your driver &amp; pickup details", body, "You are receiving this email because you have a booking with Taxi Saudi Arabia."),
      attachQuotationPdf: false,
    };
  }

  if (template === "receipt") {
    const r = receiptEmail({
      quoteReference: ref, customerName: q.customer_name, pickup: q.pickup_location, dropoff: q.drop_location, tripDate: q.trip_date, tripTime: q.trip_time,
      amountPaid: q.actual_amount_paid ?? 0, currency: cur, paymentMethod: q.payment_method_used ?? "Cash",
      driverName: q.driver_name ?? q.drivers?.full_name ?? null, driverPhone: q.driver_phone ?? q.drivers?.phone ?? null,
      vehicleLabel: q.vehicle_detail ?? null, vehiclePlate: q.vehicle_plate ?? null,
      reviewUrl: process.env.NEXT_PUBLIC_TRUSTPILOT_URL || "https://www.trustpilot.com/review/taxisaudiarabia.com",
    });
    return { ...r, attachQuotationPdf: false };
  }

  // thankyou
  const body = `
    <p style="color:#49505a;font-size:14px;line-height:1.7;">Dear <strong>${name}</strong>,<br/><br/>
      Thank you for travelling with Taxi Saudi Arabia. We hope your journey from ${esc(q.pickup_location)} to ${esc(q.drop_location)} was comfortable.
      If you need a transfer again, or would like a receipt for this trip, just reply to this email.</p>
    <p style="color:#49505a;font-size:13px;line-height:1.7;margin-top:12px;">
      We would be grateful to hear how it went — message us on <a href="${contactConfig.whatsappLink}" style="color:${GREEN};font-weight:bold;">WhatsApp</a>.</p>`;
  return {
    subject: `Thank you for travelling with us — ${ref}`,
    html: wrapper("Thank you ✔", body, "You are receiving this email because you completed a trip with Taxi Saudi Arabia."),
    attachQuotationPdf: false,
  };
}
