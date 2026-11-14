import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user as { id?: string } | undefined;

    if (!sessionUser?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const driver = await prisma.driver.findFirst({
      where: { userId: sessionUser.id },
    });

    if (!driver) {
      return NextResponse.json({ error: "Driver profile not found" }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") ?? "10")));
    const skip = (page - 1) * limit;

    const where = {
      driverId: driver.id,
      ...(status ? { status: status.toUpperCase() as "PENDING" | "CONFIRMED" | "DRIVER_ASSIGNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" } : {}),
    };

    const [total, bookings] = await Promise.all([
      prisma.booking.count({ where }),
      prisma.booking.findMany({
        where,
        include: { vehicle: { select: { name: true, type: true } } },
        orderBy: { pickupDateTime: "asc" },
        skip,
        take: limit,
      }),
    ]);

    return NextResponse.json({
      success: true,
      total,
      page,
      limit,
      total_pages: Math.ceil(total / limit),
      trips: bookings,
    });
  } catch (error) {
    console.error("GET /api/drivers/trips error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
