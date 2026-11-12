import { NextResponse } from "next/server";
import { sendDueReminders } from "@/lib/ops/reminders";
import { sendDueFollowUpReminders } from "@/lib/ops/followups";

export const dynamic = "force-dynamic";

// GET /api/cron/booking-reminders — Vercel Cron target (see vercel.json), runs daily 08:00 Riyadh time.
// Emails the owner every confirmed/assigned ride that is 2 days (and again 1 day) away. Safe to re-run: dedupes via booking_events.
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const result = await sendDueReminders();
  // Same daily call also emails the owner the unconfirmed-quote follow-ups whose trip is within 3 days.
  let followUps: Awaited<ReturnType<typeof sendDueFollowUpReminders>> | { error: string };
  try { followUps = await sendDueFollowUpReminders(); } catch (e) { followUps = { error: e instanceof Error ? e.message : "follow-up reminders failed" }; }
  const failed = !!result.error || !!followUps.error;
  return NextResponse.json({ success: !failed, ...result, followUps }, { status: failed ? 500 : 200 });
}
