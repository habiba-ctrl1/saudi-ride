import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendBookingConfirmation, sendAdminNotification } from "@/lib/notifications";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    console.log("📥 Received Moyasar Webhook Payload:", JSON.stringify(payload, null, 2));

    // Support both direct payment objects and wrapped webhook events
    const eventType = payload.type;
    const paymentData = payload.data || payload;

    // We only process successful/paid events
    const isPaid = 
      paymentData.status === "paid" || 
      paymentData.status === "captured" ||
      eventType === "payment.paid" ||
      eventType === "invoice.paid";

    if (!isPaid) {
      console.log(`ℹ️ Ignoring webhook event status: ${paymentData.status || eventType}`);
      return NextResponse.json({ received: true, ignored: true });
    }

    // Resolve bookingRef from metadata or parsed from payment description
    let bookingRef = paymentData.metadata?.bookingRef || paymentData.metadata?.booking_ref;

    if (!bookingRef && paymentData.description) {
      // Fallback: parse ref from description e.g. "Riyadh Taxi Booking Ref: RT-2026-0001"
      const match = paymentData.description.match(/(RT-\d{4}-\d+|LXT-\d{4}-\d+|RT-[A-Za-z0-9-]+)/);
      if (match) {
        bookingRef = match[0];
      }
    }

    if (!bookingRef) {
      console.error("❌ Unable to resolve booking reference from webhook payload metadata or description.");
      return NextResponse.json(
        { error: "Could not resolve booking reference" },
        { status: 400 }
      );
    }

    // Normalize reference to match database
    let normalizedRef = bookingRef;
    if (bookingRef.startsWith("RT-")) {
      // In case DB has legacy prefix, match both
      normalizedRef = bookingRef;
    }

    // Locate booking in the database
    const booking = await prisma.booking.findFirst({
      where: {
        OR: [
          { bookingRef: normalizedRef },
          { bookingRef: normalizedRef.replace("RT-", "LXT-") }
        ]
      },
      include: { vehicle: true }
    });

    if (!booking) {
      console.error(`❌ Booking with reference ${normalizedRef} not found in database.`);
      return NextResponse.json(
        { error: `Booking not found: ${normalizedRef}` },
        { status: 404 }
      );
    }

    // Prevent double processing (idempotency check)
    if (booking.paymentStatus === "PAID") {
      console.log(`ℹ️ Booking ${booking.bookingRef} is already marked as PAID.`);
      return NextResponse.json({ success: true, duplicated: true });
    }

    // 1. Update Booking payment status
    const updatedBooking = await prisma.booking.update({
      where: { id: booking.id },
      data: {
        paymentStatus: "PAID",
        status: "CONFIRMED" // Automatically confirm booking upon payment capture
      },
      include: { vehicle: true }
    });

    console.log(`✔ Updated booking payment status to PAID for Reference: ${updatedBooking.bookingRef}`);

    // 2. Award loyalty points to user account if registered (1 point per 10 SAR spent)
    const pointsAwarded = Math.floor(Number(updatedBooking.totalPrice) / 10);
    if (pointsAwarded > 0) {
      try {
        // Look up user by phone or email
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { phone: updatedBooking.customerPhone },
              { email: updatedBooking.customerEmail }
            ]
          }
        });

        if (user) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              loyaltyPoints: {
                increment: pointsAwarded
              }
            }
          });
          console.log(`✨ Awarded ${pointsAwarded} loyalty points to User: ${user.name || user.email}`);
        } else {
          console.log(`ℹ️ Customer is a guest. Loyalty points not allocated.`);
        }
      } catch (userErr) {
        console.error("⚠️ Failed to update loyalty points:", userErr);
      }
    }

    // 3. Dispatch multi-channel notifications (Emails & SMS)
    try {
      // Sends Confirmation Email (to customer) + Admin Alert Email + Booking Confirmed SMS
      await sendBookingConfirmation(updatedBooking as unknown as Parameters<typeof sendBookingConfirmation>[0]);
      
      // Sends Admin details notification explicitly
      await sendAdminNotification(updatedBooking as unknown as Parameters<typeof sendAdminNotification>[0]);
      
      console.log(`✉ Notifications triggered successfully for Booking: ${updatedBooking.bookingRef}`);
    } catch (notifErr) {
      console.error("⚠️ Failed to dispatch booking notifications:", notifErr);
    }

    return NextResponse.json({
      success: true,
      message: "Webhook processed, payment status updated, and notifications sent."
    });

  } catch (error) {
    console.error("Moyasar webhook processing error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
