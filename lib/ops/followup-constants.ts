// Client-safe follow-up types + WhatsApp message builder (no DB imports).
export const FU_STATUSES = ["quoted", "followed_up", "confirmed", "lost"] as const;
export type FuStatus = (typeof FU_STATUSES)[number];
export const FU_LABEL: Record<FuStatus, string> = { quoted: "Price sent", followed_up: "Followed up", confirmed: "Confirmed", lost: "Lost" };

export type FollowUp = {
  id: string; customer_name: string; customer_phone: string | null; customer_email: string | null;
  pickup: string | null; dropoff: string | null; trip_date: string | null; trip_time: string | null; trip_type: string | null;
  vehicle: string | null; passengers: string | null; luggage: string | null; quoted_price: number | null; currency: string;
  price_sent_at: string | null; status: FuStatus; last_followup_at: string | null; followup_count: number;
  remind_days_before: number; reminder_sent_at: string | null; notes: string | null; created_at: string;
  days_left: number | null;
};

/** Human, professional follow-up text built from the stored form details. Handles past/undated trips. */
export function followUpMessage(f: Pick<FollowUp, "customer_name" | "pickup" | "dropoff" | "trip_date" | "trip_time" | "trip_type" | "vehicle" | "passengers" | "luggage" | "quoted_price" | "currency" | "days_left">): string {
  const first = f.customer_name.trim().split(/\s+/)[0] || "there";
  const when = f.trip_date ? `${f.trip_date}${f.trip_time ? `, ${f.trip_time.slice(0, 5)}` : ""}` : null;
  const lines = [
    f.pickup ? `- From: ${f.pickup}` : null,
    f.dropoff ? `- To: ${f.dropoff}` : null,
    when ? `- Date & time: ${when}` : null,
    f.passengers ? `- Passengers: ${f.passengers}${f.luggage ? `, ${f.luggage} bag(s)` : ""}` : null,
    f.vehicle ? `- Vehicle: ${f.vehicle}` : null,
  ].filter(Boolean).join("\n");
  // Only say "one way" when the form said so; a round-trip lead just gets the amount (owner confirms what it covers).
  const oneWay = /one/i.test(f.trip_type ?? "") ? ", one way" : "";
  const fare = f.quoted_price != null ? `\nFare: ${f.currency || "SAR"} ${f.quoted_price.toLocaleString("en-US")}${oneWay}, fixed.\n` : "\n";
  const past = f.days_left != null && f.days_left < 0;
  const tail = past
    ? "The date you selected has already passed. If you still need this transfer, please send us your new date and pickup time and we will confirm it right away."
    : f.trip_date
      ? "Shall we go ahead and confirm your booking? If anything has changed, just let us know and we will update it."
      : "Please let us know your travel date and we will confirm availability for you.";
  return `Hello ${first}, this is Taxi Saudi Arabia, following up on your request:\n\n${lines}\n${fare}\n${tail}`;
}
