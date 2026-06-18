import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { buildZATCAInvoice, generateZATCAQR } from "@/lib/zatca";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  try {
    const { bookingId } = await params;
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user as { id?: string; role?: string } | undefined;

    const payment = await prisma.payment.findUnique({
      where: { bookingId },
      include: {
        booking: {
          select: {
            id: true,
            bookingRef: true,
            userId: true,
            customerName: true,
            customerEmail: true,
            pickupLocation: true,
            dropoffLocation: true,
            serviceType: true,
            baseFare: true,
            discountAmount: true,
            vatAmount: true,
            totalPrice: true,
            currency: true,
            pickupDateTime: true,
            status: true,
          },
        },
      },
    });

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    const isAdmin = sessionUser?.role === "ADMIN";
    const isOwner = sessionUser?.id && payment.booking.userId === sessionUser.id;
    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Build ZATCA invoice if not already stored
    let qrCode = payment.zatcaQrCode;
    let zatcaId = payment.zatcaInvoiceId;

    if (!qrCode) {
      const invoice = buildZATCAInvoice(payment.booking, payment);
      qrCode = generateZATCAQR(invoice);
      zatcaId = `RLT-INV-${payment.id}`;

      await prisma.payment.update({
        where: { id: payment.id },
        data: { zatcaQrCode: qrCode, zatcaInvoiceId: zatcaId },
      });
    }

    const booking = payment.booking;

    return NextResponse.json({
      success: true,
      invoice: {
        invoice_number: zatcaId,
        booking_ref: booking.bookingRef,
        invoice_date: payment.paidAt?.toISOString() ?? payment.createdAt.toISOString(),
        seller: {
          name: "Riyadh Luxe Transportation Co.",
          vat_number: process.env.ZATCA_VAT_NUMBER ?? "300000000000003",
        },
        buyer: {
          name: booking.customerName,
          email: booking.customerEmail,
        },
        line_items: [
          {
            description: `Transfer — ${booking.pickupLocation} to ${booking.dropoffLocation}`,
            quantity: 1,
            unit_price: booking.baseFare ?? booking.totalPrice / 1.15,
            vat_rate: 0.15,
            vat_amount: booking.vatAmount ?? Math.round(booking.totalPrice * (0.15 / 1.15) * 100) / 100,
            total: booking.totalPrice,
          },
        ],
        subtotal: booking.baseFare ?? Math.round(booking.totalPrice / 1.15 * 100) / 100,
        discount: booking.discountAmount ?? 0,
        vat_15_pct: booking.vatAmount ?? Math.round(booking.totalPrice * (0.15 / 1.15) * 100) / 100,
        total: booking.totalPrice,
        currency: booking.currency,
        qr_code: qrCode,
        payment_status: payment.status,
        payment_method: payment.paymentMethod,
      },
    });
  } catch (error) {
    console.error("GET /api/payments/[bookingId]/invoice error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
