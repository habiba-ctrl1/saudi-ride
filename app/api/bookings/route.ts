import { NextResponse } from "next/server";
import { db, ensureVehiclesSeeded } from "@/lib/db";
import { BookingStatus, PaymentStatus, VehicleType, Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notifyNewBooking } from "@/lib/notifications";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Auto seed vehicles first
    await ensureVehiclesSeeded();

    const {
      pickup,
      pickupLocation,
      dropoff,
      dropoffLocation,
      dateTime,
      pickupDateTime,
      isRoundTrip,
      returnDateTime,
      passengers,
      vehicleType, // SEDAN, SUV, VAN, LUXURY, BUS
      vehicleId,
      customerName,
      customerPhone,
      customerEmail,
      notes,
      flightNumber,
      paymentMethod,
      pickupLat,
      pickupLng,
      dropoffLat,
      dropoffLng
    } = body;

    const finalPickup = pickup || pickupLocation;
    const finalDropoff = dropoff || dropoffLocation;
    const finalDateTime = dateTime || pickupDateTime;

    if (!finalPickup || !finalDropoff || !finalDateTime || !passengers || (!vehicleId && !vehicleType) || !customerName || !customerPhone) {
      return NextResponse.json(
        { error: "Missing required booking details (pickupLocation, dropoffLocation, pickupDateTime, passengers, vehicleId or vehicleType, customerName, customerPhone)" },
        { status: 400 }
      );
    }

    // Lookup vehicle
    let vehicle = null;
    if (vehicleId) {
      vehicle = await db.vehicle.findUnique({
        where: { id: vehicleId }
      });
    }

    if (!vehicle && vehicleType) {
      vehicle = await db.vehicle.findFirst({
        where: { type: vehicleType as VehicleType }
      });
    }

    if (!vehicle) {
      // Seed & retry
      await ensureVehiclesSeeded();
      if (vehicleId) {
        vehicle = await db.vehicle.findUnique({
          where: { id: vehicleId }
        });
      }
      if (!vehicle && vehicleType) {
        vehicle = await db.vehicle.findFirst({
          where: { type: vehicleType as VehicleType }
        });
      }
      // Ultimate fallback if still no match
      if (!vehicle) {
        vehicle = await db.vehicle.findFirst();
      }
    }

    if (!vehicle) {
      return NextResponse.json(
        { error: "No vehicle classes configured or available in system" },
        { status: 404 }
      );
    }

    // Price is never computed or accepted from the client — a wrong
    // automated fare has directly embarrassed the business with a real
    // customer before. Every booking starts at 0/PENDING; an admin sets the
    // real price manually (see /admin/bookings) before it's ever quoted.
    const finalPrice = 0;
    const distance = null;
    const duration = null;

    // Generate unique human-readable bookingRef matching the brand (e.g. TSA-2026-001234 style)
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const currentYear = new Date(finalDateTime).getFullYear() || 2026;
    const bookingRef = `TSA-${currentYear}-${randomSuffix}`;

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
        pickupLocation: finalPickup,
        dropoffLocation: finalDropoff,
        pickupLat: pickupLat ? Number(pickupLat) : null,
        pickupLng: pickupLng ? Number(pickupLng) : null,
        dropoffLat: dropoffLat ? Number(dropoffLat) : null,
        dropoffLng: dropoffLng ? Number(dropoffLng) : null,
        pickupDateTime: new Date(finalDateTime),
        returnDateTime: returnDateTime ? new Date(returnDateTime) : null,
        isRoundTrip: Boolean(isRoundTrip),
        passengers: Number(passengers),
        totalPrice: Number(finalPrice),
        vehicleId: vehicle.id,
        customerName,
        customerPhone,
        customerEmail: customerEmail || null,
        notes: notes || null,
        flightNumber: flightNumber || null,
        paymentMethod: paymentMethod || "arrival",
        paymentStatus: PaymentStatus.UNPAID,
        status: BookingStatus.PENDING,
        userId: userId || null,
        distance: distance ? Number(distance) : null,
        duration: duration ? Number(duration) : null
      }
    });

    // Fire real notifications. The booking is already saved above; any channel
    // that fails is logged to notification_failures, never silently dropped.
    // We report the true per-channel result — never a fake "sent".
    const notified = await notifyNewBooking({
      bookingRef: booking.bookingRef,
      customerName: booking.customerName,
      customerPhone: booking.customerPhone,
      customerEmail: booking.customerEmail ?? "",
      pickupLocation: booking.pickupLocation,
      dropoffLocation: booking.dropoffLocation,
      pickupDateTime: booking.pickupDateTime,
      totalPrice: booking.totalPrice,
      passengers: booking.passengers,
      vehicle: vehicle
        ? { name: vehicle.name, capacity: vehicle.capacity, luggage: vehicle.luggage }
        : null,
    });

    return NextResponse.json({
      bookingRef: booking.bookingRef,
      totalPrice: booking.totalPrice,
      currency: "SAR",
      status: "PENDING",
      message: "Booking request received. Our team will confirm your price shortly.",
      notified,
      success: true,
      bookingId: booking.id
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
    const { searchParams } = new URL(_request.url);
    const statusFilter = searchParams.get("status");
    const dateFilter = searchParams.get("date");
    const pageParam = searchParams.get("page");
    const limitParam = searchParams.get("limit");

    const page = pageParam ? Math.max(1, parseInt(pageParam)) : 1;
    const limit = limitParam ? Math.max(1, parseInt(limitParam)) : 20;
    const skip = (page - 1) * limit;

    const whereClause: Prisma.BookingWhereInput = {};

    let sessionUserEmail = "";
    let sessionUserRole = "";
    try {
      const session = await getServerSession(authOptions);
      if (session?.user) {
        sessionUserEmail = session.user.email || "";
        const customUser = session.user as { role?: string };
        sessionUserRole = customUser.role || "";
      }
    } catch (sessionErr) {
      console.warn("Session check failed in GET route:", sessionErr);
    }

    // Role-based scoping: non-admins can only see their own bookings if logged in
    if (sessionUserRole !== "ADMIN" && sessionUserEmail) {
      whereClause.user = { email: sessionUserEmail };
    }

    // Apply status filter if provided
    if (statusFilter) {
      whereClause.status = statusFilter as BookingStatus;
    }

    // Apply date filter if provided (matching pickupDateTime for that day)
    if (dateFilter) {
      const parsedDate = new Date(dateFilter);
      if (!isNaN(parsedDate.getTime())) {
        const startOfDay = new Date(parsedDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(parsedDate);
        endOfDay.setHours(23, 59, 59, 999);

        whereClause.pickupDateTime = {
          gte: startOfDay,
          lte: endOfDay
        };
      }
    }

    // Query both total count and paginated list
    const [totalBookings, bookings] = await Promise.all([
      db.booking.count({ where: whereClause }),
      db.booking.findMany({
        where: whereClause,
        include: { vehicle: true },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit
      })
    ]);

    return NextResponse.json({
      success: true,
      total: totalBookings,
      page,
      limit,
      totalPages: Math.ceil(totalBookings / limit),
      bookings
    });

  } catch (error) {
    console.error("List bookings error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
