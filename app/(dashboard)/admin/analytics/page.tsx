"use client";

import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { TrendingUp, Globe, Car, Map } from "lucide-react";

// ─── MOCK DATA ──────────────────────────────────────────────────
const monthlyTrends = [
  { month: "Jan", bookings: 42, revenue: 18500 },
  { month: "Feb", bookings: 56, revenue: 24200 },
  { month: "Mar", bookings: 73, revenue: 31800 },
  { month: "Apr", bookings: 68, revenue: 29400 },
  { month: "May", bookings: 91, revenue: 42100 },
  { month: "Jun", bookings: 85, revenue: 38700 },
  { month: "Jul", bookings: 110, revenue: 51200 },
  { month: "Aug", bookings: 98, revenue: 46300 },
  { month: "Sep", bookings: 120, revenue: 55800 },
  { month: "Oct", bookings: 134, revenue: 61200 },
  { month: "Nov", bookings: 145, revenue: 67400 },
  { month: "Dec", bookings: 160, revenue: 74100 },
];

const popularRoutes = [
  { route: "JED → Makkah", bookings: 342 },
  { route: "RUH → Dammam", bookings: 218 },
  { route: "MED → Haram", bookings: 195 },
  { route: "Makkah → Madinah", bookings: 167 },
  { route: "JED → Madinah", bookings: 134 },
  { route: "RUH → City", bookings: 112 },
];

const revenueByVehicle = [
  { name: "Sedan", value: 35 },
  { name: "SUV", value: 30 },
  { name: "Luxury", value: 20 },
  { name: "Van", value: 10 },
  { name: "Bus", value: 5 },
];

const customerCountries = [
  { country: "Saudi Arabia", customers: 480 },
  { country: "United Kingdom", customers: 120 },
  { country: "Pakistan", customers: 95 },
  { country: "Egypt", customers: 78 },
  { country: "India", customers: 65 },
  { country: "Indonesia", customers: 52 },
  { country: "UAE", customers: 41 },
];

const PIE_COLORS = ["#C9A84C", "#B8963B", "#A0822E", "#886E22", "#6F5A16"];

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      {/* ─── HEADER ───────────────────────────────────────────────── */}
      <div>
        <h1 className="font-heading text-3xl font-bold text-[#F5F0E8]">Analytics</h1>
        <p className="text-[#A1A1A6] mt-1 text-sm">In-depth performance insights across all operations.</p>
      </div>

      {/* ─── MONTHLY TRENDS (AREA) ────────────────────────────────── */}
      <div className="bg-[#111] border border-[#C9A84C]/15 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-[#C9A84C]/10">
            <TrendingUp className="h-5 w-5 text-[#C9A84C]" />
          </div>
          <div>
            <h3 className="font-heading text-lg font-bold text-[#F5F0E8]">Monthly Trends</h3>
            <p className="text-xs text-[#7C8088]">Bookings &amp; Revenue over 12 months</p>
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
              <Tooltip
                contentStyle={{ backgroundColor: "#1A1A1A", border: "1px solid rgba(201,168,76,0.3)", borderRadius: "12px", color: "#F5F0E8" }}
                labelStyle={{ color: "#C9A84C", fontWeight: "bold" }}
              />
              <Legend wrapperStyle={{ fontSize: "12px", color: "#A1A1A6" }} />
              <Area type="monotone" dataKey="bookings" stroke="#C9A84C" strokeWidth={2} fillOpacity={1} fill="url(#colorBookings)" />
              <Area type="monotone" dataKey="revenue" stroke="#6366F1" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* ─── POPULAR ROUTES (BAR) ───────────────────────────────── */}
        <div className="bg-[#111] border border-[#C9A84C]/15 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-[#C9A84C]/10">
              <Map className="h-5 w-5 text-[#C9A84C]" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-[#F5F0E8]">Popular Routes</h3>
              <p className="text-xs text-[#7C8088]">Top booked route combinations</p>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={popularRoutes} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
                <XAxis type="number" stroke="#7C8088" fontSize={12} />
                <YAxis type="category" dataKey="route" stroke="#7C8088" fontSize={11} width={120} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1A1A1A", border: "1px solid rgba(201,168,76,0.3)", borderRadius: "12px", color: "#F5F0E8" }}
                />
                <Bar dataKey="bookings" fill="#C9A84C" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ─── REVENUE BY VEHICLE (PIE) ───────────────────────────── */}
        <div className="bg-[#111] border border-[#C9A84C]/15 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-[#C9A84C]/10">
              <Car className="h-5 w-5 text-[#C9A84C]" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-[#F5F0E8]">Revenue by Vehicle</h3>
              <p className="text-xs text-[#7C8088]">Share of revenue per vehicle class</p>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={revenueByVehicle}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  dataKey="value"
                  stroke="#0A0A0A"
                  strokeWidth={3}
                  label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                >
                  {revenueByVehicle.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#1A1A1A", border: "1px solid rgba(201,168,76,0.3)", borderRadius: "12px", color: "#F5F0E8" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ─── CUSTOMER COUNTRY BREAKDOWN ───────────────────────────── */}
      <div className="bg-[#111] border border-[#C9A84C]/15 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-[#C9A84C]/10">
            <Globe className="h-5 w-5 text-[#C9A84C]" />
          </div>
          <div>
            <h3 className="font-heading text-lg font-bold text-[#F5F0E8]">Customer Country Breakdown</h3>
            <p className="text-xs text-[#7C8088]">Where your customers are booking from</p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {customerCountries.map((c, i) => (
            <div key={i} className="bg-[#0A0A0A] border border-[#C9A84C]/10 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-[#F5F0E8]">{c.country}</p>
                <p className="text-xs text-[#7C8088]">{c.customers} customers</p>
              </div>
              <div className="text-2xl font-bold text-[#C9A84C]">{i + 1}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
