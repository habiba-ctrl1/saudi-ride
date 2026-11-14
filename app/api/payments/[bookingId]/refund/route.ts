import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  try {
    const { bookingId } = await params;
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user as { role?: string } | undefined;

    if (sessionUser?.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const payment = await prisma.payment.findUnique({
      where: { bookingId },
      include: { booking: { select: { id: true, bookingRef: true, totalPrice: true } } },
    });

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    if (!["CAPTURED", "AUTHORIZED"].includes(payment.status)) {
      return NextResponse.json(
        { error: `Cannot refund a payment with status: ${payment.status}` },
        { status: 400 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { amount, reason } = body as { amount?: number; reason?: string };

    const refundAmount = amount ?? payment.amount;
    const isPartial = refundAmount < payment.amount;

    // Attempt gateway refund
    let gatewayRefundId: string | null = null;

    if (payment.gateway === "MOYASAR" && payment.gatewayTransactionId) {
      const moyasarKey = process.env.MOYASAR_API_KEY;
      if (moyasarKey) {
        const auth = `Basic ${Buffer.from(`${moyasarKey}:`).toString("base64")}`;
        const res = await fetch(
          `https://api.moyasar.com/v1/payments/${payment.gatewayTransactionId}/refund`,
          {
            method: "POST",
            headers: { Authorization: auth, "Content-Type": "application/json" },
            body: JSON.stringify({ amount: Math.round(refundAmount * 100) }),
          }
        );
        if (res.ok) {
          const data = await res.json();
          gatewayRefundId = data.id ?? null;
        } else {
          console.error("Moyasar refund failed:", await res.text());
        }
      }
    }

    const [updatedPayment] = await prisma.$transaction([
      prisma.payment.update({
        where: { bookingId },
        data: {
          status: isPartial ? "PARTIALLY_REFUNDED" : "REFUNDED",
          refundAmount,
          refundReason: reason ?? null,
          gatewayTransactionId: gatewayRefundId ?? payment.gatewayTransactionId,
        },
      }),
      prisma.booking.update({
        where: { id: bookingId },
        data: {
          paymentStatus: isPartial ? "PARTIALLY_REFUNDED" : "REFUNDED",
          status: isPartial ? undefined : "REFUNDED",
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      refund_amount: refundAmount,
      gateway_refund_id: gatewayRefundId,
      payment: updatedPayment,
    });
  } catch (error) {
    console.error("POST /api/payments/[bookingId]/refund error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
