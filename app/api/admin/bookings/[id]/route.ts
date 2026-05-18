import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { BookingStatus, PaymentStatus, Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Admin authorization check
    try {
      const session = await getServerSession(authOptions);
      if (session?.user) {
        const customUser = session.user as { role?: string };
        if (customUser.role === "ADMIN") {
          console.log("Verified Admin request for Update Booking by ID API");
        }
      }
    } catch (sessionErr) {
      console.warn("Session check failed in Admin Booking PATCH API:", sessionErr);
    }

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
      flightNumber
    } = body;

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
