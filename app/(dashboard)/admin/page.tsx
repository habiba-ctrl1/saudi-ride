import { Metadata } from "next";
import { CreditCard, Car, Users, CalendarDays, ArrowUpRight, TrendingUp, Clock } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Admin Dashboard | Taxi Saudi Arabia",
};

export default async function AdminDashboardPage() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    todaysBookings,
    totalRevenue,
    activeDrivers,
    pendingBookings,
    last30Revenue,
    recentBookings,
    totalCustomers,
  ] = await Promise.all([
    prisma.booking.count({ where: { createdAt: { gte: today } } }),
    prisma.booking.aggregate({
      where: { paymentStatus: "PAID" },
      _sum: { totalPrice: true },
    }),
    prisma.user.count({ where: { role: "DRIVER" } }),
    prisma.booking.count({ where: { status: "PENDING" } }),
    prisma.booking.aggregate({
      where: { paymentStatus: "PAID", createdAt: { gte: thirtyDaysAgo } },
      _sum: { totalPrice: true },
    }),
    prisma.booking.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      include: { vehicle: { select: { name: true, type: true } } },
    }),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
  ]);

  const revenue     = totalRevenue._sum.totalPrice ?? 0;
  const rev30       = last30Revenue._sum.totalPrice ?? 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-sm text-gray-500 mt-0.5">Welcome back. Here&apos;s what&apos;s happening today.</p>
        </div>
        <Link
          href="/admin/bookings"
          className="inline-flex items-center gap-2 bg-[#C9A84C] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#b8963b] transition-colors"
        >
          <CalendarDays className="h-4 w-4" /> View Bookings
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Today's Bookings"
          value={todaysBookings}
          icon={CalendarDays}
          color="blue"
          sub={pendingBookings > 0 ? `${pendingBookings} pending` : "All confirmed"}
        />
        <StatCard
          title="Total Revenue"
          value={`SAR ${revenue.toLocaleString("en-SA", { maximumFractionDigits: 0 })}`}
          icon={CreditCard}
          color="gold"
          sub={`SAR ${rev30.toLocaleString("en-SA", { maximumFractionDigits: 0 })} last 30 days`}
        />
        <StatCard
          title="Active Drivers"
          value={activeDrivers}
          icon={Users}
          color="green"
          sub="Available fleet"
        />
        <StatCard
          title="Total Customers"
          value={totalCustomers}
          icon={Car}
          color="purple"
          sub="Registered accounts"
        />
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4">
          <div className="p-3 bg-amber-50 rounded-lg">
            <Clock className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Pending Confirmations</p>
            <p className="text-2xl font-bold text-gray-900">{pendingBookings}</p>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4">
          <div className="p-3 bg-green-50 rounded-lg">
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">30-Day Revenue</p>
            <p className="text-2xl font-bold text-gray-900">
              {rev30.toLocaleString("en-SA", { maximumFractionDigits: 0 })} <span className="text-sm text-gray-400">SAR</span>
            </p>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-lg">
            <Users className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Registered Customers</p>
            <p className="text-2xl font-bold text-gray-900">{totalCustomers}</p>
          </div>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">Recent Bookings</h2>
          <Link
            href="/admin/bookings"
            className="text-xs font-semibold text-[#C9A84C] hover:text-[#b8963b] flex items-center gap-1"
          >
            View all <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-3 text-left">Reference</th>
                <th className="px-6 py-3 text-left">Customer</th>
                <th className="px-6 py-3 text-left">Route</th>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentBookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-400">
                    No bookings yet. New bookings will appear here.
                  </td>
                </tr>
              ) : (
                recentBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs font-semibold text-[#C9A84C] bg-amber-50 px-2 py-1 rounded">
                        {b.bookingRef.slice(0, 16)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{b.customerName}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{b.customerPhone}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-600 max-w-[180px]">
                      <p className="truncate text-xs">
                        {b.pickupLocation.substring(0, 18)}…
                        <span className="text-[#C9A84C] mx-1">→</span>
                        {b.dropoffLocation.substring(0, 18)}…
                      </p>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs whitespace-nowrap">
                      {new Date(b.pickupDateTime).toLocaleDateString("en-SA", {
                        day: "2-digit", month: "short", year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={b.status} />
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-gray-900 whitespace-nowrap">
                      {b.currency} {b.totalPrice.toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ── Sub-components ──────────────────────────────────────── */

import { LucideIcon } from "lucide-react";

const colorMap = {
  blue:   { bg: "bg-blue-50",   icon: "text-blue-600",   num: "text-blue-700"  },
  gold:   { bg: "bg-amber-50",  icon: "text-amber-600",  num: "text-amber-700" },
  green:  { bg: "bg-green-50",  icon: "text-green-600",  num: "text-green-700" },
  purple: { bg: "bg-purple-50", icon: "text-purple-600", num: "text-purple-700"},
};

function StatCard({
  title, value, icon: Icon, color, sub,
}: {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: keyof typeof colorMap;
  sub?: string;
}) {
  const c = colorMap[color];
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{title}</p>
        <div className={`p-2 rounded-lg ${c.bg}`}>
          <Icon className={`h-4 w-4 ${c.icon}`} />
        </div>
      </div>
      <p className={`text-2xl font-bold ${c.num}`}>{value}</p>
      {sub && <p className="text-xs text-gray-400">{sub}</p>}
    </div>
  );
}

const STATUS_STYLES: Record<string, string> = {
  PENDING:         "bg-amber-100 text-amber-800",
  CONFIRMED:       "bg-blue-100 text-blue-800",
  DRIVER_ASSIGNED: "bg-indigo-100 text-indigo-800",
  IN_PROGRESS:     "bg-cyan-100 text-cyan-800",
  COMPLETED:       "bg-green-100 text-green-800",
  CANCELLED:       "bg-red-100 text-red-800",
  REFUNDED:        "bg-gray-100 text-gray-600",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wide ${STATUS_STYLES[status] ?? "bg-gray-100 text-gray-600"}`}>
      {status.replace("_", " ")}
    </span>
  );
}
