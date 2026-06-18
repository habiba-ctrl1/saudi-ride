import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { sendDriverAssignment } from "@/lib/notifications";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get("phone");

    if (!id || !phone) {
      return NextResponse.json(
        { error: "Booking reference and phone number are required" },
        { status: 400 }
      );
    }

    // Query booking by ref
    const booking = await db.booking.findUnique({
      where: { bookingRef: id },
      include: { vehicle: true }
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    // Security check: Normalize phone numbers to check match
    const normalizedPhoneInput = phone.replace(/[\s\-\+]/g, "");
    const normalizedBookingPhone = booking.customerPhone.replace(/[\s\-\+]/g, "");

    if (normalizedPhoneInput !== normalizedBookingPhone && !booking.customerPhone.includes(normalizedPhoneInput)) {
      return NextResponse.json(
        { error: "Access denied. Phone number does not match booking records." },
        { status: 403 }
      );
    }

    // Generate dynamic timeline based on booking status and dates
    const timeline = [];
    const createdAtTime = new Date(booking.createdAt).toISOString();
    const updatedAtTime = new Date(booking.updatedAt).toISOString();

    // 1. Pending (always present)
    timeline.push({
      status: "PENDING",
      time: createdAtTime,
      label: "Booking received"
    });

    // 2. Confirmed
    if (booking.status !== "PENDING" && booking.status !== "CANCELLED") {
      const confirmTime = new Date(booking.createdAt.getTime() + 15 * 60000).toISOString();
      timeline.push({
        status: "CONFIRMED",
        time: booking.status === "CONFIRMED" ? updatedAtTime : confirmTime,
        label: "Booking confirmed"
      });
    }

    // 3. Driver Assigned
    if (
      booking.status === "DRIVER_ASSIGNED" ||
      booking.status === "IN_PROGRESS" ||
      booking.status === "COMPLETED"
    ) {
      const assignTime = new Date(booking.createdAt.getTime() + 45 * 60000).toISOString();
      timeline.push({
        status: "DRIVER_ASSIGNED",
        time: booking.status === "DRIVER_ASSIGNED" ? updatedAtTime : assignTime,
        label: "Driver assigned"
      });
    }

    // 4. In Progress
    if (booking.status === "IN_PROGRESS" || booking.status === "COMPLETED") {
      const progressTime = new Date(booking.pickupDateTime.getTime()).toISOString();
      timeline.push({
        status: "IN_PROGRESS",
        time: booking.status === "IN_PROGRESS" ? updatedAtTime : progressTime,
        label: "Journey in progress"
      });
    }

    // 5. Completed
    if (booking.status === "COMPLETED") {
      timeline.push({
        status: "COMPLETED",
        time: updatedAtTime,
        label: "Journey completed"
      });
    }

    // 6. Cancelled
    if (booking.status === "CANCELLED") {
      timeline.push({
        status: "CANCELLED",
        time: updatedAtTime,
        label: "Booking cancelled"
      });
    }

    const payload = {
      bookingRef: booking.bookingRef,
      status: booking.status,
      vehicle: {
        name: booking.vehicle.name,
        type: booking.vehicle.type
      },
      pickupDateTime: booking.pickupDateTime.toISOString(),
      pickupLocation: booking.pickupLocation,
      dropoffLocation: booking.dropoffLocation,
      totalPrice: booking.totalPrice,
      driverName: booking.driverName || null,
      driverPhone: booking.driverPhone || null,
      timeline,
      
      // Keep backwards compatibility for the existing frontend tracking client
      success: true,
      booking: {
        id: booking.id,
        bookingRef: booking.bookingRef,
        status: booking.status,
        pickupLocation: booking.pickupLocation,
        dropoffLocation: booking.dropoffLocation,
        pickupDateTime: booking.pickupDateTime.toISOString(),
        returnDateTime: booking.returnDateTime ? booking.returnDateTime.toISOString() : null,
        isRoundTrip: booking.isRoundTrip,
        passengers: booking.passengers,
        distance: booking.distance,
        duration: booking.duration,
        totalPrice: booking.totalPrice,
        currency: booking.currency,
        paymentStatus: booking.paymentStatus,
        paymentMethod: booking.paymentMethod,
        customerName: booking.customerName,
        customerPhone: booking.customerPhone,
        customerEmail: booking.customerEmail,
        notes: booking.notes,
        driverName: booking.driverName || null,
        driverPhone: booking.driverPhone || null,
        flightNumber: booking.flightNumber || null,
        createdAt: booking.createdAt.toISOString(),
        vehicle: {
          name: booking.vehicle.name,
          nameAr: booking.vehicle.nameAr,
          image: booking.vehicle.image,
          type: booking.vehicle.type
        }
      }
    };

    return NextResponse.json(payload);
  } catch (error) {
    console.error("Fetch booking error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { action, driverName, driverPhone } = body;

    // Retrieve booking
    const booking = await db.booking.findUnique({
      where: { bookingRef: id }
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Actions: CANCEL or ASSIGN_DRIVER or UPDATE_STATUS
    if (action === "CANCEL") {
      // Validate cancellation time (>24 hours)
      const hoursToPickup = (new Date(booking.pickupDateTime).getTime() - Date.now()) / (1000 * 60 * 60);
      if (hoursToPickup < 24) {
        return NextResponse.json(
          { error: "Booking can only be cancelled up to 24 hours prior to pick-up." },
          { status: 400 }
        );
      }

      const updated = await db.booking.update({
        where: { bookingRef: id },
        data: { status: "CANCELLED" }
      });

      return NextResponse.json({ success: true, booking: updated });
    }

    if (action === "ASSIGN_DRIVER") {
      if (!driverName || !driverPhone) {
        return NextResponse.json({ error: "Driver name and phone are required" }, { status: 400 });
      }

      const updated = await db.booking.update({
        where: { bookingRef: id },
        data: {
          status: "DRIVER_ASSIGNED",
          driverName,
          driverPhone
        },
        include: { vehicle: true }
      });

      // Securely trigger driver assignment notifications (emails & SMS)
      try {
        await sendDriverAssignment(updated as unknown as Parameters<typeof sendDriverAssignment>[0]);
      } catch (err) {
        console.error("⚠️ Driver assignment notifications failed:", err);
      }

      return NextResponse.json({ success: true, booking: updated });
    }

    if (action === "UPDATE_STATUS") {
      const { status } = body;
      if (!status) {
        return NextResponse.json({ error: "Status is required" }, { status: 400 });
      }

      const updated = await db.booking.update({
        where: { bookingRef: id },
        data: { status }
      });

      return NextResponse.json({ success: true, booking: updated });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });

  } catch (error) {
    console.error("Modify booking error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, driverName, driverPhone } = body;

    // Retrieve booking
    const booking = await db.booking.findUnique({
      where: { bookingRef: id }
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const updateData: Prisma.BookingUpdateInput = {};
    if (status !== undefined) {
      updateData.status = status;
    }
    if (driverName !== undefined) {
      updateData.driverName = driverName;
    }
    if (driverPhone !== undefined) {
      updateData.driverPhone = driverPhone;
    }

    const updated = await db.booking.update({
      where: { bookingRef: id },
      data: updateData,
      include: { vehicle: true }
    });

    // Securely trigger driver assignment notifications if chauffeur details are assigned
    if (updated.driverName && updated.driverPhone && (driverName !== undefined || driverPhone !== undefined || status === "DRIVER_ASSIGNED")) {
      try {
        await sendDriverAssignment(updated as unknown as Parameters<typeof sendDriverAssignment>[0]);
      } catch (err) {
        console.error("⚠️ Driver assignment notifications failed during PATCH:", err);
      }
    }

    return NextResponse.json({
      success: true,
      booking: updated,
      // Conforming standard fields
      bookingRef: updated.bookingRef,
      status: updated.status,
      driverName: updated.driverName,
      driverPhone: updated.driverPhone
    });

  } catch (error) {
    console.error("Modify booking error (PATCH):", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
