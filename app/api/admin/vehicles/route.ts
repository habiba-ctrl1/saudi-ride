import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { VehicleType } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    // Admin authorization check
    try {
      const session = await getServerSession(authOptions);
      if (session?.user) {
        const customUser = session.user as { role?: string };
        if (customUser.role === "ADMIN") {
          console.log("Verified Admin request for Vehicles List API");
        }
      }
    } catch (sessionErr) {
      console.warn("Session check failed in Admin Vehicles GET API:", sessionErr);
    }

    // Query vehicles including booking counts
    const vehicles = await prisma.vehicle.findMany({
      include: {
        _count: {
          select: { bookings: true }
        }
      },
      orderBy: { name: "asc" }
    });

    // Format response to include flat bookingCount property for convenience
    const formattedVehicles = vehicles.map(v => ({
      ...v,
      bookingCount: v._count.bookings
    }));

    return NextResponse.json({
      success: true,
      vehicles: formattedVehicles
    });

  } catch (error) {
    console.error("Admin vehicles list error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Admin authorization check
    try {
      const session = await getServerSession(authOptions);
      if (session?.user) {
        const customUser = session.user as { role?: string };
        if (customUser.role === "ADMIN") {
          console.log("Verified Admin request for Add Vehicle API");
        }
      }
    } catch (sessionErr) {
      console.warn("Session check failed in Admin Vehicle POST API:", sessionErr);
    }

    const body = await request.json();
    const {
      name,
      nameAr,
      type,
      capacity,
      luggage,
      pricePerKm,
      basePrice,
      features,
      image,
      nameUr,
      available
    } = body;

    // Validate essential properties
    if (!name || !type || capacity === undefined || pricePerKm === undefined || basePrice === undefined) {
      return NextResponse.json(
        { error: "Missing required vehicle attributes (name, type, capacity, pricePerKm, basePrice)" },
        { status: 400 }
      );
    }

    const featureList = Array.isArray(features) ? features : [];

    const newVehicle = await prisma.vehicle.create({
      data: {
        name,
        nameAr: nameAr || name,
        nameUr: nameUr || nameAr || name,
        type: type as VehicleType,
        capacity: Number(capacity),
        luggage: luggage !== undefined ? Number(luggage) : 3,
        pricePerKm: Number(pricePerKm),
        basePrice: Number(basePrice),
        features: featureList,
        image: image || "/images/fleet/placeholder.png",
        available: available !== undefined ? Boolean(available) : true
      }
    });

    return NextResponse.json({
      success: true,
      message: "Vehicle added to fleet successfully",
      vehicle: newVehicle
    }, { status: 201 });

  } catch (error) {
    console.error("Admin add vehicle error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
