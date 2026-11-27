import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/requireAdmin";

export async function GET(request: Request) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    // Query metrics in parallel
    const [
      todayBookings,
      todayPaidRevenue,
      pendingBookings,
      activeDrivers,
      last30DaysBookings,
      last30DaysPaidRevenue,
      avgRatingAgg
    ] = await Promise.all([
      prisma.booking.count({
        where: { createdAt: { gte: today } }
      }),
      prisma.booking.aggregate({
        where: {
          createdAt: { gte: today },
          paymentStatus: "PAID"
        },
        _sum: { totalPrice: true }
      }),
      prisma.booking.count({
        where: { status: "PENDING" }
      }),
      prisma.user.count({
        where: { role: "DRIVER" }
      }),
      prisma.booking.count({
        where: { createdAt: { gte: thirtyDaysAgo } }
      }),
      prisma.booking.aggregate({
        where: {
          createdAt: { gte: thirtyDaysAgo },
          paymentStatus: "PAID"
        },
        _sum: { totalPrice: true }
      }),
      prisma.review.aggregate({
        _avg: { rating: true }
      })
    ]);

    // Real database state only. 0 is a legitimate answer (e.g. no bookings
    // today) and must be returned as 0, not swapped for a "nicer" invented
    // number — a fresh/empty database is not the same thing as "no data".
    const todayRevenue = todayPaidRevenue._sum.totalPrice ?? 0;
    const last30DaysRevenue = last30DaysPaidRevenue._sum.totalPrice ?? 0;
    // Average of zero reviews is genuinely undefined, not "4.9" — Prisma
    // returns null in that case, which we pass through honestly.
    const avgRating = avgRatingAgg._avg.rating !== null
      ? Math.round(avgRatingAgg._avg.rating * 10) / 10
      : null;

    const responsePayload = {
      todayBookings,
      todayRevenue,
      pendingBookings,
      activeDrivers,
      last30Days: {
        bookings: last30DaysBookings,
        revenue: last30DaysRevenue,
        avgRating
      }
    };

    return NextResponse.json(responsePayload);

  } catch (error) {
    console.error("Fetch admin stats error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
