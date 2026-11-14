// What should the operator do next with this record? Derived purely from the record — shown as the primary row action.
import type { ListRow } from "@/lib/ops/list-shared";

export type NextKey = "set_price" | "send_quote" | "follow_up" | "await" | "convert" | "assign_driver" | "send_pickup" | "complete" | "add_cost" | "record_payment" | "receipt" | "none";

export function nextAction(r: ListRow, today: string): { key: NextKey; label: string; urgent?: boolean } {
  if (r.status === "cancelled" || r.quote_stage === "rejected") return { key: "none", label: "" };
  if (r.status === "completed") {
    if (r.financial_status !== "confirmed") return { key: "add_cost", label: "Add driver cost", urgent: true };
    if (r.payment_status !== "paid" && !(r.actual_amount_paid === 0)) return { key: "record_payment", label: "Record payment", urgent: true };
    if ((r.actual_amount_paid ?? 0) > 0 && !r.has_receipt) return { key: "receipt", label: "Generate receipt" };
    return { key: "none", label: "" };
  }
  if (r.status === "confirmed" || r.status === "assigned") {
    if (r.trip_date < today) return { key: "complete", label: "Mark completed", urgent: true };
    if (!r.partner_id && !r.driver_name) return { key: "assign_driver", label: "Assign driver", urgent: r.trip_date <= addDays(today, 3) };
    if (!r.pickup_sent && r.trip_date <= addDays(today, 1) && r.customer_email) return { key: "send_pickup", label: "Send pickup details" };
    return { key: "none", label: "" };
  }
  // new / quoted
  if (r.quoted_price == null) return { key: "set_price", label: "Set price" };
  if (r.quote_stage === "draft" || r.quote_stage === "ready" || r.quote_stage === "expired") return { key: "send_quote", label: "Send quotation" };
  if (r.quote_stage === "accepted") return { key: "convert", label: "Convert to booking" };
  const last = r.followup_at ?? r.sent_at;
  if (last && Date.now() - new Date(last.replace(" ", "T").replace(/([+-]\d{2})$/, "$1:00")).getTime() > 2 * 24 * 3600 * 1000) return { key: "follow_up", label: "Follow up", urgent: true };
  return { key: "await", label: "Awaiting reply" };
}

function addDays(d: string, n: number) {
  const x = new Date(`${d}T00:00:00Z`);
  x.setUTCDate(x.getUTCDate() + n);
  return x.toISOString().slice(0, 10);
}
