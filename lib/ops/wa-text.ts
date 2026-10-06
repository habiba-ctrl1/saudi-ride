// Client-safe WhatsApp message text built from the quotation record (operator sends it manually).
import type { QuotationRow } from "@/lib/supabase/quotations";
import type { OpsTemplate } from "@/lib/email/ops-templates";

const VEH: Record<string, string> = { sedan: "Executive sedan", suv: "Full-size SUV", van: "Van", bus: "Coach", limousine: "Limousine" };

export function waText(t: OpsTemplate, q: QuotationRow): string {
  const first = q.customer_name.trim().split(/\s+/)[0];
  const trip = [
    `• From: ${q.pickup_location}`,
    `• To: ${q.drop_location}`,
    `• Date & time: ${q.trip_date}${q.trip_time ? ` ${q.trip_time.slice(0, 5)}` : ""}`,
    q.vehicle_type_requested ? `• Vehicle: ${VEH[q.vehicle_type_requested] ?? q.vehicle_type_requested}` : null,
    q.passengers_count ? `• Passengers: ${q.passengers_count}` : null,
  ].filter(Boolean).join("\n");
  const fare = q.quoted_price != null ? `• Fare: ${q.currency || "SAR"} ${q.quoted_price.toLocaleString("en-US")}` : null;
  const policy = "Free cancellation up to 24 hours before pickup. Pay in cash to the driver or by bank transfer.";

  switch (t) {
    case "quotation":
      return `Hello ${first}, your quotation ${q.quote_reference} from Taxi Saudi Arabia:\n${trip}\n${fare ?? ""}\n\n${policy}\nReply "confirm" and we will book it for you.`;
    case "followup":
      return `Hello ${first}, following up on quotation ${q.quote_reference}:\n${trip}\n${fare ?? ""}\n\nWould you like to go ahead? If anything has changed, tell us and we will update it.`;
    case "confirmation":
      return `Hello ${first}, your booking ${q.quote_reference} is confirmed:\n${trip}\n${fare ?? ""}\n\nWe will send your driver details before pickup.`;
    case "pickup": {
      const d = q.driver_name ?? q.drivers?.full_name;
      const ph = q.driver_phone ?? q.drivers?.phone;
      return `Hello ${first}, your driver for booking ${q.quote_reference}:\n${d ? `• Driver: ${d}${ph ? ` (${ph})` : ""}\n` : ""}${q.vehicle_plate ? `• Plate: ${q.vehicle_plate}\n` : ""}${trip}\n\nYour driver will contact you before arrival.`;
    }
    case "receipt":
      return `Hello ${first}, thank you for travelling with Taxi Saudi Arabia. Payment received${q.actual_amount_paid != null ? `: ${q.currency || "SAR"} ${q.actual_amount_paid.toLocaleString("en-US")}` : ""} for booking ${q.quote_reference} (${q.pickup_location} to ${q.drop_location}). Your receipt is attached.`;
    default:
      return `Hello ${first}, thank you for travelling with Taxi Saudi Arabia (${q.quote_reference}). We hope the trip went well — see you next time.`;
  }
}

export function waLink(phone: string, text: string) {
  return `https://wa.me/${phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(text)}`;
}
