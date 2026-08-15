import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { BookingStatus, PaymentStatus, Prisma } from "@prisma/client";
import { requireAdmin } from "@/lib/auth/requireAdmin";

const BOOKING_STATUSES: BookingStatus[] = [
  "PENDING",
  "CONFIRMED",
  "DRIVER_ASSIGNED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
  "REFUNDED",
];

const PAYMENT_STATUSES: PaymentStatus[] = ["UNPAID", "PAID", "REFUNDED", "PARTIALLY_REFUNDED"];

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const { id } = await params;
    const body = await request.json();

    const {
      status,
      driverName,
      driverPhone,
      notes,
      totalPrice,
      paymentStatus,
      paymentMethod,
      pickupLocation,
      dropoffLocation,
      pickupDateTime,
      returnDateTime,
      passengers,
      flightNumber,
      isTest
    } = body;

    if (status !== undefined && !BOOKING_STATUSES.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    if (paymentStatus !== undefined && !PAYMENT_STATUSES.includes(paymentStatus)) {
      return NextResponse.json({ error: "Invalid paymentStatus" }, { status: 400 });
    }

    // Verify booking exists
    const booking = await prisma.booking.findUnique({
      where: { id }
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    // Build strong dynamic update object
    const updateData: Prisma.BookingUpdateInput = {};

    if (status !== undefined) updateData.status = status as BookingStatus;
    if (driverName !== undefined) updateData.driverName = driverName;
    if (driverPhone !== undefined) updateData.driverPhone = driverPhone;
    if (notes !== undefined) updateData.notes = notes;
    if (totalPrice !== undefined) updateData.totalPrice = Number(totalPrice);
    if (paymentStatus !== undefined) updateData.paymentStatus = paymentStatus as PaymentStatus;
    if (paymentMethod !== undefined) updateData.paymentMethod = paymentMethod;
    if (pickupLocation !== undefined) updateData.pickupLocation = pickupLocation;
    if (dropoffLocation !== undefined) updateData.dropoffLocation = dropoffLocation;
    if (pickupDateTime !== undefined) updateData.pickupDateTime = new Date(pickupDateTime);
    if (returnDateTime !== undefined) updateData.returnDateTime = returnDateTime ? new Date(returnDateTime) : null;
    if (passengers !== undefined) updateData.passengers = Number(passengers);
    if (flightNumber !== undefined) updateData.flightNumber = flightNumber;
    if (isTest !== undefined) updateData.isTest = Boolean(isTest);

    const updated = await prisma.booking.update({
      where: { id },
      data: updateData,
      include: { vehicle: true }
    });

    return NextResponse.json({
      success: true,
      message: "Booking updated successfully",
      booking: updated
    });

  } catch (error) {
    console.error("Admin booking update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/bookings/[id] — only ever allowed for bookings explicitly
// marked isTest=true. This check is enforced here, server-side, regardless of
// what the calling UI shows — the client is never trusted for this decision.
// There is deliberately no bulk/"delete all" variant.
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const { id } = await params;
    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    if (!booking.isTest) {
      return NextResponse.json(
        { error: "Only bookings marked as TEST can be deleted here." },
        { status: 403 }
      );
    }

    await prisma.booking.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin booking delete error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
