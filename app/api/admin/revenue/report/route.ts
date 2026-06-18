import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") ?? "monthly"; // daily | monthly | yearly
    const dateFrom = searchParams.get("date_from");
    const dateTo = searchParams.get("date_to");

    const now = new Date();
    let startDate: Date;
    let endDate: Date = now;

    if (dateFrom) {
      startDate = new Date(dateFrom);
    } else if (period === "daily") {
      startDate = new Date(now);
      startDate.setHours(0, 0, 0, 0);
    } else if (period === "yearly") {
      startDate = new Date(now.getFullYear(), 0, 1);
    } else {
      // monthly
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    if (dateTo) endDate = new Date(dateTo);

    const whereBase = {
      createdAt: { gte: startDate, lte: endDate },
    };

    const [
      totalBookings,
      completedBookings,
      cancelledBookings,
      revenueAgg,
      byServiceType,
      byVehicleType,
      topRoutes,
    ] = await Promise.all([
      prisma.booking.count({ where: whereBase }),

      prisma.booking.count({ where: { ...whereBase, status: "COMPLETED" } }),

      prisma.booking.count({ where: { ...whereBase, status: "CANCELLED" } }),

      prisma.booking.aggregate({
        where: { ...whereBase, paymentStatus: "PAID" },
        _sum: { totalPrice: true },
        _avg: { totalPrice: true },
      }),

      prisma.booking.groupBy({
        by: ["serviceType"],
        where: whereBase,
        _count: { id: true },
        _sum: { totalPrice: true },
        orderBy: { _count: { id: "desc" } },
      }),

      prisma.booking.groupBy({
        by: ["vehicleId"],
        where: whereBase,
        _count: { id: true },
        _sum: { totalPrice: true },
      }),

      prisma.booking.groupBy({
        by: ["pickupLocation", "dropoffLocation"],
        where: { ...whereBase, status: "COMPLETED" },
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
        take: 5,
      }),
    ]);

    const totalRevenue = revenueAgg._sum.totalPrice ?? 0;
    const avgFare = revenueAgg._avg.totalPrice ?? 0;

    // Enrich vehicle type breakdown with vehicle names
    const vehicleIds = byVehicleType.map((r) => r.vehicleId);
    const vehicles = await prisma.vehicle.findMany({
      where: { id: { in: vehicleIds } },
      select: { id: true, type: true, name: true },
    });
    const vehicleMap = Object.fromEntries(vehicles.map((v) => [v.id, v]));

    const vehicleBreakdown = byVehicleType.map((r) => ({
      vehicle_type: vehicleMap[r.vehicleId]?.type ?? "UNKNOWN",
      vehicle_name: vehicleMap[r.vehicleId]?.name ?? r.vehicleId,
      bookings: r._count.id,
      revenue: r._sum.totalPrice ?? 0,
    }));

    return NextResponse.json({
      success: true,
      period,
      date_from: startDate.toISOString(),
      date_to: endDate.toISOString(),
      summary: {
        total_bookings: totalBookings,
        completed: completedBookings,
        cancelled: cancelledBookings,
        completion_rate: totalBookings > 0 ? ((completedBookings / totalBookings) * 100).toFixed(1) + "%" : "0%",
        total_revenue_sar: Math.round(totalRevenue * 100) / 100,
        avg_fare_sar: Math.round(avgFare * 100) / 100,
        vat_collected_sar: Math.round(totalRevenue * (0.15 / 1.15) * 100) / 100,
        net_revenue_sar: Math.round(totalRevenue * (1 / 1.15) * 100) / 100,
      },
      by_service_type: byServiceType.map((r) => ({
        service_type: r.serviceType ?? "UNSPECIFIED",
        bookings: r._count.id,
        revenue: r._sum.totalPrice ?? 0,
      })),
      by_vehicle_type: vehicleBreakdown,
      top_routes: topRoutes.map((r) => ({
        pickup: r.pickupLocation,
        dropoff: r.dropoffLocation,
        trips: r._count.id,
      })),
    });
  } catch (error) {
    console.error("GET /api/admin/revenue/report error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
