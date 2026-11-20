import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const driver = await prisma.driver.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
            image: true,
            nationality: true,
            preferredLang: true,
            createdAt: true,
          },
        },
      },
    });

    if (!driver) {
      return NextResponse.json({ error: "Driver not found" }, { status: 404 });
    }

    // Load vehicle separately (driver.vehicleId is a loose FK, not a relation in schema)
    const vehicle = driver.vehicleId
      ? await prisma.vehicle.findUnique({
          where: { id: driver.vehicleId },
          select: {
            id: true,
            name: true,
            type: true,
            capacity: true,
            luggage: true,
            make: true,
            model: true,
            year: true,
            color: true,
            plateNumber: true,
            hasWifi: true,
            hasChildSeat: true,
            hasWheelchair: true,
          },
        })
      : null;

    // Load aggregate review stats
    const bookingIds = await prisma.booking.findMany({
      where: { driverId: id },
      select: { id: true },
    });
    const reviewStats = await prisma.review.aggregate({
      where: { bookingId: { in: bookingIds.map((b) => b.id) }, approved: true },
      _avg: { rating: true },
      _count: { id: true },
    });

    return NextResponse.json({
      success: true,
      driver: {
        id: driver.id,
        name: driver.user.name,
        image: driver.user.image,
        nationality: driver.user.nationality,
        rating: driver.rating,
        total_trips: driver.totalTrips,
        languages: driver.languages,
        ihram_status: driver.ihramStatus,
        tga_certified: driver.tgaCertified,
        status: driver.status,
        member_since: driver.user.createdAt,
        vehicle,
        review_stats: {
          average: reviewStats._avg.rating ?? driver.rating,
          count: reviewStats._count.id,
        },
      },
    });
  } catch (error) {
    console.error("GET /api/drivers/[id]/profile error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
