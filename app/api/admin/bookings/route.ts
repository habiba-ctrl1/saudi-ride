import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { BookingStatus, VehicleType, Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    // Admin authorization check
    try {
      const session = await getServerSession(authOptions);
      if (session?.user) {
        const customUser = session.user as { role?: string };
        if (customUser.role === "ADMIN") {
          console.log("Verified Admin request for Bookings List API");
        }
      }
    } catch (sessionErr) {
      console.warn("Session check failed in Admin Bookings GET API:", sessionErr);
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const status = searchParams.get("status");
    const vehicleType = searchParams.get("vehicleType");
    const pageParam = searchParams.get("page");
    const limitParam = searchParams.get("limit");

    const page = pageParam ? Math.max(1, parseInt(pageParam)) : 1;
    const limit = limitParam ? Math.max(1, parseInt(limitParam)) : 10;
    const skip = (page - 1) * limit;

    const whereClause: Prisma.BookingWhereInput = {};

    // Apply status filter
    if (status) {
      whereClause.status = status as BookingStatus;
    }

    // Apply vehicle type filter
    if (vehicleType) {
      whereClause.vehicle = {
        type: vehicleType as VehicleType
      };
    }

    // Apply search filter (name, phone, email, reference)
    if (search) {
      whereClause.OR = [
        { customerName: { contains: search } },
        { customerPhone: { contains: search } },
        { customerEmail: { contains: search } },
        { bookingRef: { contains: search } }
      ];
    }

    // Query total count and records in parallel
    const [total, bookings] = await Promise.all([
      prisma.booking.count({ where: whereClause }),
      prisma.booking.findMany({
        where: whereClause,
        include: { vehicle: true },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit
      })
    ]);

    return NextResponse.json({
      success: true,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      bookings
    });

  } catch (error) {
    console.error("Admin bookings list error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
