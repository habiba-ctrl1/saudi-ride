import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ ref: string }> }
) {
  try {
    const { ref } = await params;
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get("phone");

    if (!ref || !phone) {
      return NextResponse.json(
        { error: "Booking reference and phone number are required" },
        { status: 400 }
      );
    }

    // Query booking by ref
    const booking = await db.booking.findUnique({
      where: { bookingRef: ref },
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

    return NextResponse.json({
      success: true,
      booking: {
        id: booking.id,
        bookingRef: booking.bookingRef,
        status: booking.status,
        pickupLocation: booking.pickupLocation,
        dropoffLocation: booking.dropoffLocation,
        pickupDateTime: booking.pickupDateTime,
        returnDateTime: booking.returnDateTime,
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
        createdAt: booking.createdAt,
        vehicle: {
          name: booking.vehicle.name,
          nameAr: booking.vehicle.nameAr,
          image: booking.vehicle.image,
          type: booking.vehicle.type
        }
      }
    });
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
  { params }: { params: Promise<{ ref: string }> }
) {
  try {
    const { ref } = await params;
    const body = await request.json();
    const { action, driverName, driverPhone } = body;

    // Retrieve booking
    const booking = await db.booking.findUnique({
      where: { bookingRef: ref }
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
        where: { bookingRef: ref },
        data: { status: "CANCELLED" }
      });

      return NextResponse.json({ success: true, booking: updated });
    }

    if (action === "ASSIGN_DRIVER") {
      if (!driverName || !driverPhone) {
        return NextResponse.json({ error: "Driver name and phone are required" }, { status: 400 });
      }

      const updated = await db.booking.update({
        where: { bookingRef: ref },
        data: {
          status: "DRIVER_ASSIGNED",
          driverName,
          driverPhone
        }
      });

      return NextResponse.json({ success: true, booking: updated });
    }

    if (action === "UPDATE_STATUS") {
      const { status } = body;
      if (!status) {
        return NextResponse.json({ error: "Status is required" }, { status: 400 });
      }

      const updated = await db.booking.update({
        where: { bookingRef: ref },
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
