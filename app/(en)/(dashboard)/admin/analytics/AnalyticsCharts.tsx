"use client";

import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { TrendingUp, Globe, Car, Map } from "lucide-react";

const PIE_COLORS = ["#C9A84C", "#B8963B", "#A0822E", "#886E22", "#6F5A16"];

const tooltipStyle = { backgroundColor: "#1A1A1A", border: "1px solid rgba(201,168,76,0.3)", borderRadius: "12px", color: "#F5F0E8" };

function EmptyState({ label }: { label: string }) {
  return <p className="flex h-full items-center justify-center text-xs text-[#7C8088]">{label}</p>;
}

export function AnalyticsCharts({
  monthlyTrends,
  popularRoutes,
  revenueByVehicle,
  customerNationalities,
}: {
  monthlyTrends: { month: string; bookings: number; revenue: number }[];
  popularRoutes: { route: string; bookings: number }[];
  revenueByVehicle: { name: string; value: number }[];
  customerNationalities: { country: string; customers: number }[];
}) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-bold text-[#F5F0E8]">Analytics</h1>
        <p className="text-[#A1A1A6] mt-1 text-sm">Real performance data from your live bookings — a quiet chart means genuinely no bookings yet, not missing data.</p>
      </div>

      <div className="bg-[#111] border border-[#C9A84C]/15 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-[#C9A84C]/10"><TrendingUp className="h-5 w-5 text-[#C9A84C]" /></div>
          <div>
            <h3 className="font-heading text-lg font-bold text-[#F5F0E8]">Monthly Trends</h3>
            <p className="text-xs text-[#7C8088]">Bookings &amp; paid revenue over the last 12 months</p>
          </div>
        </div>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyTrends}>
              <defs>
                <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C9A84C" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#C9A84C" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="month" stroke="#7C8088" fontSize={12} />
              <YAxis stroke="#7C8088" fontSize={12} />
              <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: "#C9A84C", fontWeight: "bold" }} />
              <Legend wrapperStyle={{ fontSize: "12px", color: "#A1A1A6" }} />
              <Area type="monotone" dataKey="bookings" stroke="#C9A84C" strokeWidth={2} fillOpacity={1} fill="url(#colorBookings)" />
              <Area type="monotone" dataKey="revenue" stroke="#6366F1" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-[#111] border border-[#C9A84C]/15 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-[#C9A84C]/10"><Map className="h-5 w-5 text-[#C9A84C]" /></div>
            <div>
              <h3 className="font-heading text-lg font-bold text-[#F5F0E8]">Popular Routes</h3>
              <p className="text-xs text-[#7C8088]">Top booked pickup → drop-off pairs, all time</p>
            </div>
          </div>
          <div className="h-[300px]">
            {popularRoutes.length === 0 ? (
              <EmptyState label="No bookings yet." />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={popularRoutes} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
                  <XAxis type="number" stroke="#7C8088" fontSize={12} allowDecimals={false} />
                  <YAxis type="category" dataKey="route" stroke="#7C8088" fontSize={11} width={140} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="bookings" fill="#C9A84C" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="bg-[#111] border border-[#C9A84C]/15 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-[#C9A84C]/10"><Car className="h-5 w-5 text-[#C9A84C]" /></div>
            <div>
              <h3 className="font-heading text-lg font-bold text-[#F5F0E8]">Revenue by Vehicle Type</h3>
              <p className="text-xs text-[#7C8088]">Share of paid revenue per vehicle class, all time</p>
            </div>
          </div>
          <div className="h-[300px]">
            {revenueByVehicle.length === 0 ? (
              <EmptyState label="No paid bookings yet." />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={revenueByVehicle}
                    cx="50%" cy="50%" innerRadius={70} outerRadius={110}
                    dataKey="value" stroke="#0A0A0A" strokeWidth={3}
                    label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                  >
                    {revenueByVehicle.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      <div className="bg-[#111] border border-[#C9A84C]/15 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-[#C9A84C]/10"><Globe className="h-5 w-5 text-[#C9A84C]" /></div>
          <div>
            <h3 className="font-heading text-lg font-bold text-[#F5F0E8]">Customer Nationalities</h3>
            <p className="text-xs text-[#7C8088]">Registered accounts only — most bookings are guests with no account, so this will be sparse</p>
          </div>
        </div>
        {customerNationalities.length === 0 ? (
          <EmptyState label="No registered customers with a nationality on file yet." />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {customerNationalities.map((c, i) => (
              <div key={i} className="bg-[#0A0A0A] border border-[#C9A84C]/10 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-[#F5F0E8]">{c.country}</p>
                  <p className="text-xs text-[#7C8088]">{c.customers} customer{c.customers === 1 ? "" : "s"}</p>
                </div>
                <div className="text-2xl font-bold text-[#C9A84C]">{i + 1}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
