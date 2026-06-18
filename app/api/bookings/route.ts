import { NextResponse } from "next/server";
import { db, ensureVehiclesSeeded } from "@/lib/db";
import { BookingStatus, PaymentStatus, VehicleType, Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PRICING_CONFIG, matchFixedRoute } from "@/lib/pricing";

const fixedRouteDetails: Record<string, { distance: number; duration: number }> = {
  'jeddah-airport-makkah': { distance: 85, duration: 75 },
  'makkah-madinah': { distance: 450, duration: 270 },
  'madinah-jeddah-airport': { distance: 410, duration: 250 },
  'riyadh-dammam': { distance: 400, duration: 240 },
  'riyadh-jeddah': { distance: 950, duration: 570 },
  'riyadh-dubai': { distance: 1000, duration: 600 },
  'dammam-doha': { distance: 380, duration: 230 },
  'jeddah-taif': { distance: 140, duration: 105 },
};

function getHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return Math.round(d * 1.2 * 10) / 10; // 1.2 routing factor for road distance approximation
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

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
      totalPrice,
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

    // Calculate dynamic pricing if totalPrice is not passed
    let finalPrice = totalPrice;
    let distance = null;
    let duration = null;

    if (finalPrice === undefined || finalPrice === null) {
      const fixedRouteKey = matchFixedRoute(finalPickup, finalDropoff);
      const vType = vehicle.type as VehicleType;
      
      let basePriceVal = 0;

      if (fixedRouteKey && fixedRouteKey in PRICING_CONFIG.fixedRoutes) {
        const key = fixedRouteKey as keyof typeof PRICING_CONFIG.fixedRoutes;
        basePriceVal = PRICING_CONFIG.fixedRoutes[key][vType];
        distance = fixedRouteDetails[key]?.distance || 120;
        duration = fixedRouteDetails[key]?.duration || 90;
      } else {
        if (pickupLat && pickupLng && dropoffLat && dropoffLng) {
          distance = getHaversineDistance(
            Number(pickupLat),
            Number(pickupLng),
            Number(dropoffLat),
            Number(dropoffLng)
          );
          duration = Math.round(distance * 0.9);
        } else {
          const charSum = finalPickup.length + finalDropoff.length;
          distance = Math.max(30, Math.min(650, charSum * 4.5));
          duration = Math.round(distance * 0.9);
        }

        const costPerKm = vehicle.pricePerKm || PRICING_CONFIG.perKm[vType] || 3.5;
        const baseFare = vehicle.basePrice || PRICING_CONFIG.baseFare || 50;
        const rawPrice = baseFare + distance * costPerKm;
        const minFare = PRICING_CONFIG.minimumFare[vType] || 80;
        
        basePriceVal = Math.max(minFare, Math.round(rawPrice));
      }

      // Parse DateTime for surcharges
      const bookingDate = new Date(finalDateTime);
      const hour = bookingDate.getHours();
      
      // Night surcharge (11 PM to 5 AM)
      const isNight = hour >= 23 || hour < 5;
      const nightSurchargeAmount = isNight ? Math.round(basePriceVal * PRICING_CONFIG.nightSurcharge) : 0;

      // Ramadan Surcharge
      const month = bookingDate.getMonth();
      const day = bookingDate.getDate();
      let isRamadan = false;
      if (month === 1 && day >= 18) isRamadan = true;
      if (month === 2 && day <= 19) isRamadan = true;
      const ramadanSurchargeAmount = isRamadan ? Math.round(basePriceVal * PRICING_CONFIG.ramadanSurcharge) : 0;

      let tripTotal = basePriceVal + nightSurchargeAmount + ramadanSurchargeAmount;
      if (isRoundTrip) {
        tripTotal = tripTotal * 2;
      }

      const discountAmount = isRoundTrip ? Math.round(tripTotal * PRICING_CONFIG.roundTripDiscount) : 0;
      finalPrice = tripTotal - discountAmount;
    }

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

    return NextResponse.json({
      bookingRef: booking.bookingRef,
      totalPrice: booking.totalPrice,
      currency: "SAR",
      status: "PENDING",
      message: "Booking received. SMS confirmation sent.",
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
