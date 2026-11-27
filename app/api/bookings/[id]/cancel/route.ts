import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user as { id?: string; role?: string } | undefined;

    const booking = await prisma.booking.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true,
        status: true,
        pickupDateTime: true,
        customerPhone: true,
        paymentStatus: true,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Owners or admins may cancel
    const isAdmin = sessionUser?.role === "ADMIN";
    const isOwner = sessionUser?.id && booking.userId === sessionUser.id;
    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (["CANCELLED", "COMPLETED", "REFUNDED"].includes(booking.status)) {
      return NextResponse.json(
        { error: `Booking is already ${booking.status.toLowerCase()}` },
        { status: 400 }
      );
    }

    // Enforce 24-hour cancellation window (admins bypass)
    if (!isAdmin) {
      const hoursToPickup =
        (new Date(booking.pickupDateTime).getTime() - Date.now()) / (1000 * 60 * 60);
      if (hoursToPickup < 24) {
        return NextResponse.json(
          { error: "Bookings can only be cancelled at least 24 hours before pickup." },
          { status: 400 }
        );
      }
    }

    const body = await request.json().catch(() => ({}));
    const reason = (body as { reason?: string }).reason ?? null;

    const updated = await prisma.booking.update({
      where: { id },
      data: {
        status: "CANCELLED",
        cancellationReason: reason,
        cancelledAt: new Date(),
      },
      select: {
        id: true,
        bookingRef: true,
        status: true,
        cancelledAt: true,
        cancellationReason: true,
      },
    });

    return NextResponse.json({ success: true, booking: updated });
  } catch (error) {
    console.error("PATCH /api/bookings/[id]/cancel error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
