import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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
            totalPrice: true,
            currency: true,
            status: true,
            customerName: true,
          },
        },
      },
    });

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    // Only owner or admin can view
    const isAdmin = sessionUser?.role === "ADMIN";
    const isOwner = sessionUser?.id && payment.booking.userId === sessionUser.id;
    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ success: true, payment });
  } catch (error) {
    console.error("GET /api/payments/[bookingId] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
