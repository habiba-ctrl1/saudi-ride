import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { AnalyticsCharts } from "./AnalyticsCharts";

export const metadata: Metadata = { title: "Analytics | Admin Dashboard" };
export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const now = new Date();
  const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);

  const [recentBookings, routeGroups, vehicleGroups, vehicles, nationalityGroups] = await Promise.all([
    prisma.booking.findMany({
      where: { createdAt: { gte: twelveMonthsAgo } },
      select: { createdAt: true, totalPrice: true, paymentStatus: true },
    }),
    prisma.booking.groupBy({
      by: ["pickupLocation", "dropoffLocation"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 6,
    }),
    prisma.booking.groupBy({
      by: ["vehicleId"],
      _count: { id: true },
      _sum: { totalPrice: true },
    }),
    prisma.vehicle.findMany({ select: { id: true, type: true } }),
    prisma.user.groupBy({
      by: ["nationality"],
      where: { role: "CUSTOMER", nationality: { not: null } },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 7,
    }),
  ]);

  // Bucket the last 12 months, including months with zero bookings.
  const monthlyTrends: { month: string; bookings: number; revenue: number }[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = d.toLocaleDateString("en-US", { month: "short" });
    const inMonth = recentBookings.filter(
      (b) => b.createdAt.getFullYear() === d.getFullYear() && b.createdAt.getMonth() === d.getMonth()
    );
    monthlyTrends.push({
      month: label,
      bookings: inMonth.length,
      revenue: inMonth.filter((b) => b.paymentStatus === "PAID").reduce((sum, b) => sum + b.totalPrice, 0),
    });
  }

  const popularRoutes = routeGroups.map((r) => ({
    route: `${r.pickupLocation} → ${r.dropoffLocation}`,
    bookings: r._count.id,
  }));

  const vehicleTypeMap = Object.fromEntries(vehicles.map((v) => [v.id, v.type]));
  const revenueByTypeMap = new Map<string, number>();
  for (const g of vehicleGroups) {
    const type = vehicleTypeMap[g.vehicleId] ?? "UNKNOWN";
    revenueByTypeMap.set(type, (revenueByTypeMap.get(type) ?? 0) + (g._sum.totalPrice ?? 0));
  }
  const revenueByVehicle = Array.from(revenueByTypeMap.entries())
    .filter(([, value]) => value > 0)
    .map(([name, value]) => ({ name, value }));

  const customerNationalities = nationalityGroups
    .filter((g) => g.nationality)
    .map((g) => ({ country: g.nationality as string, customers: g._count.id }));

  return (
    <AnalyticsCharts
      monthlyTrends={monthlyTrends}
      popularRoutes={popularRoutes}
      revenueByVehicle={revenueByVehicle}
      customerNationalities={customerNationalities}
    />
  );
}
