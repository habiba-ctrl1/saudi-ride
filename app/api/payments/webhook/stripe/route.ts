import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";
import { generateAndSubmitInvoice } from "@/lib/zatca";
import { sendEmail } from "@/lib/notifications";

// Stripe is not in package.json — gracefully handle absence
function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const StripeLib = require("stripe") as typeof Stripe;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new StripeLib(key, { apiVersion: "2024-04-10" as any });
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    console.warn("Stripe webhook received but Stripe is not configured.");
    return NextResponse.json({ received: true });
  }

  try {
    const body = await request.text();
    const sig = request.headers.get("stripe-signature") ?? "";

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err) {
      console.error("Stripe signature verification failed:", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    if (event.type === "payment_intent.succeeded") {
      const intent = event.data.object as Stripe.PaymentIntent;
      const bookingRef = intent.metadata?.bookingRef;
      if (!bookingRef) return NextResponse.json({ received: true });

      const booking = await prisma.booking.findFirst({
        where: { bookingRef },
      });
      if (!booking) return NextResponse.json({ received: true });

      const payment = await prisma.payment.upsert({
        where: { bookingId: booking.id },
        create: {
          bookingId: booking.id,
          customerId: booking.userId ?? undefined,
          amount: intent.amount_received / 100,
          currency: intent.currency.toUpperCase(),
          paymentMethod: "CARD",
          gateway: "STRIPE",
          gatewayTransactionId: intent.id,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          gatewayResponse: intent as any,
          status: "CAPTURED",
          paidAt: new Date(),
        },
        update: {
          status: "CAPTURED",
          gatewayTransactionId: intent.id,
          paidAt: new Date(),
        },
      });

      await prisma.booking.update({
        where: { id: booking.id },
        data: { paymentStatus: "PAID", status: "CONFIRMED" },
      });

      const { qrCode, zatcaId } = await generateAndSubmitInvoice(booking, payment);
      await prisma.payment.update({
        where: { id: payment.id },
        data: { zatcaQrCode: qrCode, zatcaInvoiceId: zatcaId },
      });

      if (booking.customerEmail) {
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://saudi-ride.vercel.app";
        await sendEmail(
          booking.customerEmail,
          `Payment Confirmed — ${booking.bookingRef}`,
          `<p>Payment of SAR ${booking.totalPrice} for <strong>${booking.bookingRef}</strong> confirmed.</p>
           <p><a href="${siteUrl}/track-booking?ref=${booking.bookingRef}">Track your booking</a></p>`
        );
      }
    }

    if (event.type === "charge.dispute.created") {
      const dispute = event.data.object as Stripe.Dispute;
      console.warn(`[Stripe] Dispute created: ${dispute.id} for charge ${dispute.charge}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
