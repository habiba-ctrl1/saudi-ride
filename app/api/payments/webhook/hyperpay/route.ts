import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { generateAndSubmitInvoice } from "@/lib/zatca";
import { sendEmail } from "@/lib/notifications";

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get("x-signature") ?? "";

    // Verify HyperPay webhook signature if secret is configured
    const webhookSecret = process.env.HYPERPAY_WEBHOOK_SECRET;
    if (webhookSecret) {
      const expected = crypto
        .createHmac("sha256", webhookSecret)
        .update(body)
        .digest("hex");
      if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
      }
    }

    const payload = JSON.parse(body);
    const { result, merchantTransactionId, id: transactionId } = payload;

    if (!merchantTransactionId) {
      return NextResponse.json({ error: "Missing merchantTransactionId" }, { status: 400 });
    }

    const booking = await prisma.booking.findFirst({
      where: { bookingRef: merchantTransactionId },
      include: { vehicle: true },
    });

    if (!booking) {
      console.warn(`HyperPay webhook: booking not found for ref ${merchantTransactionId}`);
      return NextResponse.json({ received: true });
    }

    // HyperPay success codes start with "000.000." or "000.100."
    const isSuccess =
      result?.code && (result.code.startsWith("000.000.") || result.code.startsWith("000.100."));

    if (isSuccess) {
      const payment = await prisma.payment.upsert({
        where: { bookingId: booking.id },
        create: {
          bookingId: booking.id,
          customerId: booking.userId ?? undefined,
          amount: booking.totalPrice,
          currency: "SAR",
          paymentMethod: "CARD",
          gateway: "HYPERPAY",
          gatewayTransactionId: transactionId,
          gatewayResponse: payload,
          status: "CAPTURED",
          paidAt: new Date(),
        },
        update: {
          status: "CAPTURED",
          gatewayTransactionId: transactionId,
          gatewayResponse: payload,
          paidAt: new Date(),
        },
      });

      await prisma.booking.update({
        where: { id: booking.id },
        data: { paymentStatus: "PAID", status: "CONFIRMED" },
      });

      // Generate ZATCA invoice
      const { qrCode, zatcaId } = await generateAndSubmitInvoice(booking, payment);
      await prisma.payment.update({
        where: { id: payment.id },
        data: { zatcaQrCode: qrCode, zatcaInvoiceId: zatcaId },
      });

      // Email confirmation
      if (booking.customerEmail) {
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://saudi-ride.vercel.app";
        await sendEmail(
          booking.customerEmail,
          `Payment Confirmed — ${booking.bookingRef}`,
          `<p>Your payment of SAR ${booking.totalPrice} for booking <strong>${booking.bookingRef}</strong> has been confirmed.</p>
           <p>Track your booking: <a href="${siteUrl}/track-booking?ref=${booking.bookingRef}">${siteUrl}/track-booking</a></p>`
        );
      }
    } else {
      await prisma.payment.upsert({
        where: { bookingId: booking.id },
        create: {
          bookingId: booking.id,
          amount: booking.totalPrice,
          currency: "SAR",
          paymentMethod: "CARD",
          gateway: "HYPERPAY",
          gatewayTransactionId: transactionId,
          gatewayResponse: payload,
          status: "FAILED",
        },
        update: { status: "FAILED", gatewayResponse: payload },
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("HyperPay webhook error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
