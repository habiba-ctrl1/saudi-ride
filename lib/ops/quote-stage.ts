import type { QuoteStage, QuotationStatus } from "@/lib/supabase/quotations";

export const QUOTE_STAGES: QuoteStage[] = ["draft", "ready", "sent", "follow_up", "accepted", "rejected", "expired"];

export const STAGE_LABEL: Record<QuoteStage, string> = {
  draft: "Draft",
  ready: "Ready",
  sent: "Sent",
  follow_up: "Follow-up",
  accepted: "Accepted",
  rejected: "Rejected",
  expired: "Expired",
};

export const STAGE_CLASS: Record<QuoteStage, string> = {
  draft: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  ready: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  sent: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  follow_up: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  accepted: "bg-green-500/10 text-green-500 border-green-500/20",
  rejected: "bg-red-500/10 text-red-400 border-red-500/20",
  expired: "bg-gray-500/10 text-gray-500 border-gray-500/20",
};

/** "Converted to Booking" is not a stage — it is status >= confirmed (one row, one record). */
export function isConvertedToBooking(status: QuotationStatus) {
  return status === "confirmed" || status === "assigned" || status === "completed";
}

/** Effective stage shown in the UI: a sent/follow-up quote past its valid_until date reads as Expired. */
export function effectiveStage(stage: QuoteStage, validUntil: string | null, today = new Date().toISOString().slice(0, 10)): QuoteStage {
  if ((stage === "sent" || stage === "follow_up" || stage === "ready") && validUntil && validUntil < today) return "expired";
  return stage;
}
