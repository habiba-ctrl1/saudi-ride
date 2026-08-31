import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendUrgentBookingAlert, recordNotificationFailure } from "@/lib/notifications";

export const dynamic = "force-dynamic";

// GET /api/cron/urgent-bookings — Vercel Cron target (see vercel.json).
// Re-alerts the admin (email + WhatsApp) for any booking that's still
// PENDING with no price set, within 24h of pickup or already overdue, and
// hasn't been re-alerted in the last 3 hours — a second, louder notice for
// exactly the "first email got buried" failure mode this was built to catch.
export async function GET(request: Request) {
  const auth = request.headers.get("authorization");
  const secret = process.env.CRON_SECRET;
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const cooldownCutoff = new Date(now.getTime() - 3 * 60 * 60 * 1000);

  const urgent = await db.booking.findMany({
    where: {
      status: "PENDING",
      totalPrice: 0,
      isTest: false,
      pickupDateTime: { lt: in24h },
      OR: [{ lastUrgentAlertAt: null }, { lastUrgentAlertAt: { lt: cooldownCutoff } }],
    },
    include: { vehicle: true },
  });

  const results: Array<{ bookingRef: string; email: boolean; whatsapp: boolean }> = [];

  for (const booking of urgent) {
    const hoursUntilPickup = (booking.pickupDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    try {
      const r = await sendUrgentBookingAlert({
        bookingRef: booking.bookingRef,
        customerName: booking.customerName,
        customerPhone: booking.customerPhone,
        customerEmail: booking.customerEmail ?? "",
        pickupLocation: booking.pickupLocation,
        dropoffLocation: booking.dropoffLocation,
        pickupDateTime: booking.pickupDateTime,
        totalPrice: booking.totalPrice,
        passengers: booking.passengers,
        vehicle: booking.vehicle ? { name: booking.vehicle.name } : null,
        hoursUntilPickup,
      });
      results.push({ bookingRef: booking.bookingRef, email: !!r.email, whatsapp: !!r.whatsapp });
      if (!r.email) {
        await recordNotificationFailure({ channel: "urgent_admin_email", bookingRef: booking.bookingRef, error: "sendEmail returned null" });
      }
      await db.booking.update({ where: { id: booking.id }, data: { lastUrgentAlertAt: now } });
    } catch (err) {
      await recordNotificationFailure({ channel: "urgent_admin_email", bookingRef: booking.bookingRef, error: String(err) });
    }
  }

  return NextResponse.json({ success: true, checked: urgent.length, alerted: results });
}
