import { NextResponse } from "next/server";
import { db, ensureVehiclesSeeded } from "@/lib/db";
import { BookingStatus, PaymentStatus, VehicleType } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Auto seed vehicles first
    await ensureVehiclesSeeded();

    const {
      pickup,
      dropoff,
      dateTime,
      isRoundTrip,
      returnDateTime,
      passengers,
      vehicleType, // SEDAN, SUV, VAN, LUXURY, BUS
      customerName,
      customerPhone,
      customerEmail,
      notes,
      flightNumber,
      paymentMethod,
      totalPrice
    } = body;

    if (!pickup || !dropoff || !dateTime || !passengers || !vehicleType || !customerName || !customerPhone || !totalPrice) {
      return NextResponse.json(
        { error: "Missing required booking details (pickup, dropoff, dateTime, passengers, vehicleType, customerName, customerPhone, totalPrice)" },
        { status: 400 }
      );
    }

    // Lookup vehicle by type
    let vehicle = await db.vehicle.findFirst({
      where: { type: vehicleType as VehicleType }
    });

    if (!vehicle) {
      // Fallback: seed and fetch
      await ensureVehiclesSeeded();
      vehicle = await db.vehicle.findFirst({
        where: { type: vehicleType as VehicleType }
      });
      if (!vehicle) {
        return NextResponse.json(
          { error: `Vehicle type ${vehicleType} not configured or available` },
          { status: 404 }
        );
      }
    }

    // Generate unique human-readable bookingRef e.g. RLT-8924-SA
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const bookingRef = `RLT-${randomSuffix}-SA`;

    // Retrieve active session to link user
    let sessionUserEmail = "";
    try {
      const session = await getServerSession(authOptions);
      if (session?.user?.email) {
        sessionUserEmail = session.user.email;
      }
    } catch (sessionErr) {
      console.warn("Session check skipped or failed:", sessionErr);
    }

    let userId: string | undefined = undefined;
    if (sessionUserEmail) {
      const dbUser = await db.user.findUnique({ where: { email: sessionUserEmail } });
      if (dbUser) {
        userId = dbUser.id;
      }
    }

    // Create the booking in DB
    const booking = await db.booking.create({
      data: {
        bookingRef,
        pickupLocation: pickup,
        dropoffLocation: dropoff,
        pickupDateTime: new Date(dateTime),
        returnDateTime: returnDateTime ? new Date(returnDateTime) : null,
        isRoundTrip: Boolean(isRoundTrip),
        passengers: Number(passengers),
        totalPrice: Number(totalPrice),
        vehicleId: vehicle.id,
        customerName,
        customerPhone,
        customerEmail: customerEmail || null,
        notes: notes || null,
        flightNumber: flightNumber || null,
        paymentMethod: paymentMethod || "arrival",
        paymentStatus: PaymentStatus.UNPAID,
        status: BookingStatus.PENDING,
        userId: userId || null
      }
    });

    return NextResponse.json({
      success: true,
      bookingRef: booking.bookingRef,
      bookingId: booking.id,
      message: "Booking registered successfully"
    }, { status: 201 });

  } catch (error) {
    console.error("Create booking error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(_request: Request) {
  try {
    let sessionUserEmail = "";
    try {
      const session = await getServerSession(authOptions);
      if (session?.user?.email) {
        sessionUserEmail = session.user.email;
      }
    } catch (sessionErr) {
      console.warn("Session check failed in GET route:", sessionErr);
    }

    // If signed in, return only their bookings
    if (sessionUserEmail) {
      const bookings = await db.booking.findMany({
        where: {
          user: {
            email: sessionUserEmail
          }
        },
        include: { vehicle: true },
        orderBy: { createdAt: "desc" }
      });
      return NextResponse.json({ success: true, bookings });
    }

    // Otherwise, return empty or recent bookings
    const bookings = await db.booking.findMany({
      include: { vehicle: true },
      orderBy: { createdAt: "desc" },
      take: 20
    });
    
    return NextResponse.json({ success: true, bookings });

  } catch (error) {
    console.error("List bookings error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
