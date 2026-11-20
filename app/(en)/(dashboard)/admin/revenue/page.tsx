import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DollarSign, TrendingUp, XCircle, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = { title: "Revenue Reports | Admin Dashboard" };
export const dynamic = "force-dynamic";

const PERIODS = ["daily", "monthly", "yearly"] as const;

export default async function AdminRevenuePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const period = (PERIODS as readonly string[]).includes(sp.period ?? "") ? (sp.period as (typeof PERIODS)[number]) : "monthly";

  const now = new Date();
  let startDate: Date;
  if (period === "daily") {
    startDate = new Date(now);
    startDate.setHours(0, 0, 0, 0);
  } else if (period === "yearly") {
    startDate = new Date(now.getFullYear(), 0, 1);
  } else {
    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  }
  const whereBase = { createdAt: { gte: startDate, lte: now } };

  const [totalBookings, completedBookings, cancelledBookings, revenueAgg, byServiceType, byVehicleType, topRoutes] = await Promise.all([
    prisma.booking.count({ where: whereBase }),
    prisma.booking.count({ where: { ...whereBase, status: "COMPLETED" } }),
    prisma.booking.count({ where: { ...whereBase, status: "CANCELLED" } }),
    prisma.booking.aggregate({ where: { ...whereBase, paymentStatus: "PAID" }, _sum: { totalPrice: true }, _avg: { totalPrice: true } }),
    prisma.booking.groupBy({ by: ["serviceType"], where: whereBase, _count: { id: true }, _sum: { totalPrice: true }, orderBy: { _count: { id: "desc" } } }),
    prisma.booking.groupBy({ by: ["vehicleId"], where: whereBase, _count: { id: true }, _sum: { totalPrice: true } }),
    prisma.booking.groupBy({ by: ["pickupLocation", "dropoffLocation"], where: { ...whereBase, status: "COMPLETED" }, _count: { id: true }, orderBy: { _count: { id: "desc" } }, take: 5 }),
  ]);

  const totalRevenue = revenueAgg._sum.totalPrice ?? 0;
  const avgFare = revenueAgg._avg.totalPrice ?? 0;
  const vehicleIds = byVehicleType.map((r) => r.vehicleId);
  const vehicles = await prisma.vehicle.findMany({ where: { id: { in: vehicleIds } }, select: { id: true, type: true, name: true } });
  const vehicleMap = Object.fromEntries(vehicles.map((v) => [v.id, v]));

  const completionRate = totalBookings > 0 ? ((completedBookings / totalBookings) * 100).toFixed(1) : "0.0";

  const cardClass = "bg-[#111] border border-[#C9A84C]/15 rounded-2xl p-5";

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-[#F5F0E8]">Revenue Reports</h1>
          <p className="text-[#A1A1A6] mt-1 text-sm">
            {startDate.toLocaleDateString()} – {now.toLocaleDateString()} (real bookings/payment data)
          </p>
        </div>
        <div className="flex gap-2">
          {PERIODS.map((p) => (
            <Link
              key={p}
              href={`/admin/revenue?period=${p}`}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition capitalize ${
                period === p ? "border-[#C9A84C] bg-[#C9A84C]/10 text-[#C9A84C]" : "border-[#333] text-[#A1A1A6] hover:border-[#C9A84C]/40"
              }`}
            >
              {p}
            </Link>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className={cardClass}>
          <div className="flex items-center gap-2 text-[#7C8088] text-[10px] uppercase tracking-wide"><TrendingUp className="h-3.5 w-3.5" /> Total Bookings</div>
          <p className="mt-2 text-2xl font-bold text-[#F5F0E8]">{totalBookings}</p>
        </div>
        <div className={cardClass}>
          <div className="flex items-center gap-2 text-[#7C8088] text-[10px] uppercase tracking-wide"><CheckCircle2 className="h-3.5 w-3.5" /> Completed</div>
          <p className="mt-2 text-2xl font-bold text-[#F5F0E8]">{completedBookings} <span className="text-xs font-normal text-[#A1A1A6]">({completionRate}%)</span></p>
        </div>
        <div className={cardClass}>
          <div className="flex items-center gap-2 text-[#7C8088] text-[10px] uppercase tracking-wide"><XCircle className="h-3.5 w-3.5" /> Cancelled</div>
          <p className="mt-2 text-2xl font-bold text-[#F5F0E8]">{cancelledBookings}</p>
        </div>
        <div className={cardClass}>
          <div className="flex items-center gap-2 text-[#7C8088] text-[10px] uppercase tracking-wide"><DollarSign className="h-3.5 w-3.5" /> Paid Revenue</div>
          <p className="mt-2 text-2xl font-bold text-[#C9A84C]">SAR {totalRevenue.toLocaleString()}</p>
          <p className="text-[10px] text-[#7C8088] mt-1">Avg fare: SAR {avgFare.toFixed(0)}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className={cardClass}>
          <h3 className="font-heading text-sm font-bold text-[#F5F0E8] mb-4">By Service Type</h3>
          {byServiceType.length === 0 ? (
            <p className="text-xs text-[#7C8088]">No data for this period.</p>
          ) : (
            <div className="space-y-2">
              {byServiceType.map((r) => (
                <div key={r.serviceType ?? "unspecified"} className="flex items-center justify-between text-sm border-b border-[#222] pb-2">
                  <span className="text-[#A1A1A6]">{r.serviceType ?? "Unspecified"}</span>
                  <span className="text-[#F5F0E8]">{r._count.id} bookings · SAR {(r._sum.totalPrice ?? 0).toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={cardClass}>
          <h3 className="font-heading text-sm font-bold text-[#F5F0E8] mb-4">By Vehicle</h3>
          {byVehicleType.length === 0 ? (
            <p className="text-xs text-[#7C8088]">No data for this period.</p>
          ) : (
            <div className="space-y-2">
              {byVehicleType.map((r) => (
                <div key={r.vehicleId} className="flex items-center justify-between text-sm border-b border-[#222] pb-2">
                  <span className="text-[#A1A1A6]">{vehicleMap[r.vehicleId]?.name ?? r.vehicleId}</span>
                  <span className="text-[#F5F0E8]">{r._count.id} bookings · SAR {(r._sum.totalPrice ?? 0).toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className={cardClass}>
        <h3 className="font-heading text-sm font-bold text-[#F5F0E8] mb-4">Top Completed Routes</h3>
        {topRoutes.length === 0 ? (
          <p className="text-xs text-[#7C8088]">No completed trips yet for this period.</p>
        ) : (
          <div className="space-y-2">
            {topRoutes.map((r, i) => (
              <div key={i} className="flex items-center justify-between text-sm border-b border-[#222] pb-2">
                <span className="text-[#A1A1A6]">{r.pickupLocation} → {r.dropoffLocation}</span>
                <span className="text-[#F5F0E8]">{r._count.id} trips</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
