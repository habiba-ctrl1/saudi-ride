import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendDriverAssignment } from "@/lib/notifications";

// PATCH /api/admin/bookings/[id]/assign — assign a driver to a booking
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { driverId } = body as { driverId?: string };

    if (!driverId) {
      return NextResponse.json({ error: "driverId is required" }, { status: 400 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { vehicle: true },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (["COMPLETED", "CANCELLED", "REFUNDED"].includes(booking.status)) {
      return NextResponse.json(
        { error: `Cannot assign driver to a ${booking.status.toLowerCase()} booking` },
        { status: 400 }
      );
    }

    const driver = await prisma.driver.findUnique({
      where: { id: driverId },
      include: { user: { select: { name: true, phone: true } } },
    });

    if (!driver) {
      return NextResponse.json({ error: "Driver not found" }, { status: 404 });
    }

    if (driver.status === "SUSPENDED") {
      return NextResponse.json({ error: "Cannot assign a suspended driver" }, { status: 400 });
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: {
        driverId: driver.id,
        driverName: driver.user.name ?? "Assigned Driver",
        driverPhone: driver.user.phone ?? "",
        status: "DRIVER_ASSIGNED",
      },
      include: { vehicle: true },
    });

    // Send driver assignment notifications
    if (booking.customerEmail || booking.customerPhone) {
      await sendDriverAssignment(updated as Parameters<typeof sendDriverAssignment>[0]).catch((err) =>
        console.error("Driver assignment notification failed:", err)
      );
    }

    return NextResponse.json({
      success: true,
      booking: {
        id: updated.id,
        bookingRef: updated.bookingRef,
        status: updated.status,
        driverId: updated.driverId,
        driverName: updated.driverName,
        driverPhone: updated.driverPhone,
      },
    });
  } catch (error) {
    console.error("PATCH /api/admin/bookings/[id]/assign error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
