// Booking timeline. Merges: creation, audit_logs status changes, booking_events (driver/payment/stage/receipt),
// communication_log (emails / WhatsApp), documents (receipts). Read-only view; writers call logEvent().
import { prisma } from "@/lib/prisma";

export type EventKind = "driver_assigned" | "payment_recorded" | "costs_saved" | "stage_changed" | "receipt_generated" | "details_edited" | "price_set";

export async function logEvent(quotationId: string, kind: EventKind, detail?: string | null) {
  try {
    await prisma.$executeRawUnsafe(`INSERT INTO booking_events (quotation_id, kind, detail) VALUES ($1::uuid,$2,$3)`, quotationId, kind, detail ?? null);
  } catch (e) {
    console.error("logEvent failed (non-fatal):", e);
  }
}

export type TimelineItem = { at: string; label: string; detail?: string | null; tone: "ok" | "warn" | "bad" | "info" };

const STATUS_LABEL: Record<string, string> = {
  new: "Enquiry received", quoted: "Priced / quoted", confirmed: "Booking confirmed", assigned: "Driver assigned (status)", completed: "Ride completed", cancelled: "Cancelled",
};
const EVENT_LABEL: Record<EventKind, string> = {
  driver_assigned: "Driver assigned", payment_recorded: "Payment recorded", costs_saved: "Driver cost / margin recorded", stage_changed: "Quote stage changed",
  receipt_generated: "Receipt generated", details_edited: "Details edited", price_set: "Price updated",
};
const TEMPLATE_LABEL: Record<string, string> = {
  quotation: "Quotation", followup: "Follow-up", confirmation: "Booking confirmation", pickup: "Driver / pickup details", thankyou: "Thank-you", receipt: "Receipt",
};

export async function getTimeline(quotationId: string, createdAt: string): Promise<TimelineItem[]> {
  const [audit, events, comms, docs] = await Promise.all([
    prisma.$queryRawUnsafe<{ old_value: string | null; new_value: string; actor: string | null; created_at: string }[]>(
      `SELECT old_value, new_value, actor, created_at::text FROM audit_logs WHERE entity_type='quotations' AND entity_id=$1 AND action='status_change'`, quotationId),
    prisma.$queryRawUnsafe<{ kind: EventKind; detail: string | null; created_at: string }[]>(`SELECT kind, detail, created_at::text FROM booking_events WHERE quotation_id=$1::uuid`, quotationId),
    prisma.$queryRawUnsafe<{ channel: string; template: string; recipient: string | null; status: string; error: string | null; created_at: string }[]>(
      `SELECT channel, template, recipient, status, error, created_at::text FROM communication_log WHERE quotation_id=$1::uuid`, quotationId),
    prisma.$queryRawUnsafe<{ kind: string; created_at: string }[]>(`SELECT kind, created_at::text FROM documents WHERE quotation_id=$1::uuid`, quotationId),
  ]);

  const items: TimelineItem[] = [{ at: createdAt, label: "Record created", tone: "info" }];
  for (const a of audit) {
    items.push({ at: a.created_at, label: STATUS_LABEL[a.new_value] ?? `Status → ${a.new_value}`, detail: a.actor && a.actor !== "system" ? `by ${a.actor}` : null, tone: a.new_value === "cancelled" ? "bad" : "ok" });
  }
  for (const e of events) {
    // receipt_generated is also in documents; skip the duplicate source
    if (e.kind === "receipt_generated") continue;
    items.push({ at: e.created_at, label: EVENT_LABEL[e.kind] ?? e.kind, detail: e.detail, tone: "info" });
  }
  for (const c of comms) {
    const what = `${TEMPLATE_LABEL[c.template] ?? c.template} ${c.channel === "whatsapp" ? "sent on WhatsApp (marked by you)" : "emailed"}`;
    items.push({ at: c.created_at, label: c.status === "sent" ? what : `${TEMPLATE_LABEL[c.template] ?? c.template} email FAILED`, detail: c.status === "sent" ? c.recipient : c.error, tone: c.status === "sent" ? "ok" : "bad" });
  }
  for (const d of docs) items.push({ at: d.created_at, label: d.kind === "receipt" ? "Receipt generated" : "Quotation document saved", tone: "ok" });
  return items.sort((a, b) => a.at.localeCompare(b.at));
}

/** Operational lifecycle (owner's list). Each step is derived from real data — nothing is ticked by hand. */
export const LIFECYCLE = ["Enquiry", "Quotation", "Accepted", "Confirmed", "Driver assigned", "Pickup details sent", "Ride completed", "Payment completed", "Receipt generated", "Financials closed"] as const;

export type LifecycleInput = {
  quoted: boolean;
  accepted: boolean;
  confirmed: boolean;
  driverAssigned: boolean;
  pickupSent: boolean;
  completed: boolean;
  paid: boolean;
  receipt: boolean;
  financialsClosed: boolean;
};

export function lifecycleState(i: LifecycleInput): { done: boolean[]; currentIndex: number } {
  const done = [true, i.quoted, i.accepted, i.confirmed, i.driverAssigned, i.pickupSent, i.completed, i.paid, i.receipt, i.financialsClosed];
  const firstOpen = done.findIndex((d) => !d);
  return { done, currentIndex: firstOpen === -1 ? done.length - 1 : firstOpen };
}
