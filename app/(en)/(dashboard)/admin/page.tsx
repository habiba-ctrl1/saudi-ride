import { Metadata } from "next";
import { CreditCard, Users, CalendarDays, ArrowUpRight, TrendingUp, Flag, XCircle } from "lucide-react";
import Link from "next/link";
import { listQuotations, getDashboardSummary } from "@/lib/supabase/quotations";
import { listDrivers } from "@/lib/supabase/drivers";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Admin Dashboard | Taxi Saudi Arabia",
};

export const dynamic = "force-dynamic";

async function getPaidRevenue() {
  const supabase = getSupabaseServerClient();
  if (!supabase) return 0;
  const { data } = await supabase.from("quotations").select("quoted_price").eq("payment_status", "paid");
  return (data ?? []).reduce((sum, r) => sum + Number(r.quoted_price ?? 0), 0);
}

export default async function AdminDashboardPage() {
  const [
    { summary },
    { rows: recentQuotations, total: totalQuotations },
    { total: pendingCount },
    { total: confirmedCount },
    { total: cancelledCount },
    { total: activeDrivers },
    revenue,
  ] = await Promise.all([
    getDashboardSummary(),
    listQuotations({ limit: 8 }),
    listQuotations({ status: ["new", "quoted"], limit: 1 }),
    listQuotations({ status: ["confirmed", "assigned", "completed"], limit: 1 }),
    listQuotations({ status: "cancelled", limit: 1 }),
    listDrivers({ status: "approved", limit: 1 }),
    getPaidRevenue(),
  ]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-sm text-gray-500 mt-0.5">Welcome back. Here&apos;s what&apos;s happening today.</p>
        </div>
        <Link
          href="/admin/quotations"
          className="inline-flex items-center gap-2 bg-[#C9A84C] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#b8963b] transition-colors"
        >
          <CalendarDays className="h-4 w-4" /> View Quotations
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Quotations"
          value={totalQuotations}
          icon={CalendarDays}
          color="blue"
          sub={`${summary?.new_quotations ?? 0} new`}
        />
        <StatCard
          title="Pending Quotations"
          value={pendingCount}
          icon={Flag}
          color="gold"
          sub="Awaiting quote or confirmation"
        />
        <StatCard
          title="Confirmed Rides"
          value={confirmedCount}
          icon={Users}
          color="green"
          sub="Confirmed, assigned or completed"
        />
        <StatCard
          title="Cancelled Rides"
          value={cancelledCount}
          icon={XCircle}
          color="purple"
          sub="All time"
        />
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4">
          <div className="p-3 bg-green-50 rounded-lg">
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Revenue (Paid)</p>
            <p className="text-2xl font-bold text-gray-900">
              SAR {revenue.toLocaleString("en-SA", { maximumFractionDigits: 0 })}
            </p>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-lg">
            <Users className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Active Drivers</p>
            <p className="text-2xl font-bold text-gray-900">{activeDrivers}</p>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4">
          <div className="p-3 bg-amber-50 rounded-lg">
            <Flag className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Needs Follow-up</p>
            <p className="text-2xl font-bold text-gray-900">{summary?.needs_followup ?? 0}</p>
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">Recent Activity</h2>
          <Link
            href="/admin/quotations"
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
                <th className="px-6 py-3 text-right">Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentQuotations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-400">
                    No quotations yet. New requests will appear here.
                  </td>
                </tr>
              ) : (
                recentQuotations.map((q) => (
                  <tr key={q.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs font-semibold text-[#C9A84C] bg-amber-50 px-2 py-1 rounded">
                        {q.quote_reference}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{q.customer_name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{q.customer_phone}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-600 max-w-[180px]">
                      <p className="truncate text-xs">
                        {q.pickup_location.substring(0, 18)}…
                        <span className="text-[#C9A84C] mx-1">→</span>
                        {q.drop_location.substring(0, 18)}…
                      </p>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs whitespace-nowrap">
                      {new Date(q.trip_date).toLocaleDateString("en-SA", {
                        day: "2-digit", month: "short", year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={q.status} />
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-gray-900 whitespace-nowrap">
                      {q.quoted_price !== null ? `${q.currency} ${q.quoted_price.toLocaleString()}` : "—"}
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
  new:       "bg-amber-100 text-amber-800",
  quoted:    "bg-blue-100 text-blue-800",
  confirmed: "bg-indigo-100 text-indigo-800",
  assigned:  "bg-purple-100 text-purple-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wide ${STATUS_STYLES[status] ?? "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
}
