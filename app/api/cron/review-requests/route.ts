import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendReviewRequest, recordNotificationFailure } from "@/lib/notifications";

export const dynamic = "force-dynamic";

const REVIEW_DELAY_MINUTES = 30;
const MAX_LOOKBACK_HOURS = 72; // don't blast very old completions if the cron was down for a while

// GET /api/cron/review-requests — hit every 30 min by an external scheduler
// (cron-job.org; this project is on Vercel Hobby, which only allows
// daily-or-slower native crons). Sends the Trustpilot review-request email
// once per booking, REVIEW_DELAY_MINUTES after it was marked COMPLETED.
// Because the check itself only runs every 30 min, actual delivery lands
// somewhere between REVIEW_DELAY_MINUTES and REVIEW_DELAY_MINUTES + 30min
// after completion — never sent twice, thanks to reviewRequestedAt below.
export async function GET(request: Request) {
  const auth = request.headers.get("authorization");
  const secret = process.env.CRON_SECRET;
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const cutoff = new Date(now.getTime() - REVIEW_DELAY_MINUTES * 60 * 1000);
  const lookback = new Date(now.getTime() - MAX_LOOKBACK_HOURS * 60 * 60 * 1000);

  const due = await db.booking.findMany({
    where: {
      status: "COMPLETED",
      isTest: false,
      reviewRequestedAt: null,
      customerEmail: { not: null },
      completedAt: { lte: cutoff, gte: lookback },
    },
    include: { vehicle: true },
  });

  const results: Array<{ bookingRef: string; email: boolean }> = [];

  for (const booking of due) {
    try {
      const r = await sendReviewRequest({
        bookingRef: booking.bookingRef,
        customerName: booking.customerName,
        customerPhone: booking.customerPhone,
        customerEmail: booking.customerEmail ?? "",
        pickupLocation: booking.pickupLocation,
        dropoffLocation: booking.dropoffLocation,
        pickupDateTime: booking.pickupDateTime,
        totalPrice: booking.totalPrice,
        passengers: booking.passengers,
        driverName: booking.driverName,
        vehicle: booking.vehicle ? { name: booking.vehicle.name } : null,
      });
      results.push({ bookingRef: booking.bookingRef, email: !!r.email });
      if (!r.email) {
        await recordNotificationFailure({ channel: "review_request_email", target: booking.customerEmail, bookingRef: booking.bookingRef, error: "sendEmail returned null" });
      }
      // Mark as requested even on failure — recordNotificationFailure keeps the
      // failure visible, and we don't want a permanently-broken address to be
      // retried forever every 30 minutes.
      await db.booking.update({ where: { id: booking.id }, data: { reviewRequestedAt: now } });
    } catch (err) {
      await recordNotificationFailure({ channel: "review_request_email", target: booking.customerEmail, bookingRef: booking.bookingRef, error: String(err) });
    }
  }

  return NextResponse.json({ success: true, checked: due.length, sent: results });
}
