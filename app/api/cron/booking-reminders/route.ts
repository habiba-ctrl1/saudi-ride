import { NextResponse } from "next/server";
import { sendDueReminders } from "@/lib/ops/reminders";

export const dynamic = "force-dynamic";

// GET /api/cron/booking-reminders — Vercel Cron target (see vercel.json), runs daily 08:00 Riyadh time.
// Emails the owner every confirmed/assigned ride that is 2 days (and again 1 day) away. Safe to re-run: dedupes via booking_events.
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const result = await sendDueReminders();
  return NextResponse.json({ success: !result.error, ...result }, { status: result.error ? 500 : 200 });
}
