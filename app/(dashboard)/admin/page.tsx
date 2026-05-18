import { Metadata } from "next";
import { 
  CreditCard, 
  Car, 
  Users, 
  CalendarDays, 
  Plus, 
  ArrowUpRight 
} from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Admin Dashboard | Riyadh Luxe Taxi",
};

export default async function AdminDashboardPage() {
  // Fetch real stats
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    todaysBookings,
    totalRevenue,
    activeDrivers,
    pendingBookings,
    recentBookings
  ] = await Promise.all([
    prisma.booking.count({ where: { createdAt: { gte: today } } }),
    prisma.booking.aggregate({ 
      where: { paymentStatus: "PAID" },
      _sum: { totalPrice: true } 
    }),
    prisma.user.count({ where: { role: "DRIVER" } }),
    prisma.booking.count({ where: { status: "PENDING" } }),
    prisma.booking.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: { vehicle: true }
    })
  ]);

  const revenue = totalRevenue._sum.totalPrice || 0;

  return (
    <div className="space-y-8">
      {/* ─── HEADER & QUICK ACTIONS ───────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-[#F5F0E8]">Dashboard Overview</h1>
          <p className="text-[#A1A1A6] mt-1 text-sm">Welcome back to the command center.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/bookings/new" className="inline-flex items-center gap-2 bg-[#C9A84C] text-[#0A0A0A] font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-lg hover:bg-[#B8963B] transition-colors">
            <Plus className="h-4 w-4" /> New Booking
          </Link>
          <Link href="/admin/drivers/new" className="inline-flex items-center gap-2 bg-[#111] border border-[#C9A84C]/20 text-[#F5F0E8] font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-lg hover:bg-[#1A1A1A] transition-colors">
            <Users className="h-4 w-4" /> Add Driver
          </Link>
        </div>
      </div>

      {/* ─── STATS CARDS ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard title="Today's Bookings" value={todaysBookings} icon={CalendarDays} trend="+12% from yesterday" />
        <StatCard title="Total Revenue (SAR)" value={`SAR ${revenue.toLocaleString()}`} icon={CreditCard} trend="+5% this month" />
        <StatCard title="Active Drivers" value={activeDrivers} icon={Users} />
        <StatCard title="Pending Confirmations" value={pendingBookings} icon={Car} alert={pendingBookings > 0} />
      </div>

      {/* ─── CHARTS AREA ──────────────────────────────────────────── */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-[#111] border border-[#C9A84C]/15 rounded-2xl p-6 h-[400px] flex flex-col">
          <h3 className="font-heading text-lg font-bold mb-4 text-[#F5F0E8]">Bookings (30 Days)</h3>
          <div className="flex-1 flex items-center justify-center border border-dashed border-[#333] rounded-xl text-[#7C8088] text-sm">
            {/* Recharts AreaChart Placeholder */}
            [Area Chart rendering client-side...]
          </div>
        </div>
        <div className="bg-[#111] border border-[#C9A84C]/15 rounded-2xl p-6 h-[400px] flex flex-col">
          <h3 className="font-heading text-lg font-bold mb-4 text-[#F5F0E8]">Revenue by Vehicle</h3>
          <div className="flex-1 flex items-center justify-center border border-dashed border-[#333] rounded-xl text-[#7C8088] text-sm">
            {/* Recharts BarChart Placeholder */}
            [Bar Chart rendering client-side...]
          </div>
        </div>
      </div>

      {/* ─── RECENT BOOKINGS TABLE ────────────────────────────────── */}
      <div className="bg-[#111] border border-[#C9A84C]/15 rounded-2xl overflow-hidden flex flex-col">
        <div className="p-6 flex items-center justify-between border-b border-[#C9A84C]/10">
          <h3 className="font-heading text-lg font-bold text-[#F5F0E8]">Recent Bookings</h3>
          <Link href="/admin/bookings" className="text-xs font-bold text-[#C9A84C] hover:text-[#B8963B] flex items-center gap-1 uppercase tracking-wider">
            View All <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#1A1A1A] border-b border-[#C9A84C]/10 text-[0.65rem] uppercase tracking-widest text-[#7C8088]">
                <th className="p-4 font-bold">Ref</th>
                <th className="p-4 font-bold">Customer</th>
                <th className="p-4 font-bold">Route</th>
                <th className="p-4 font-bold">Date</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold text-right">Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#C9A84C]/5">
              {recentBookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-sm text-[#A1A1A6]">No bookings found.</td>
                </tr>
              ) : recentBookings.map((b) => (
                <tr key={b.id} className="hover:bg-[#1A1A1A]/50 transition-colors">
                  <td className="p-4 text-xs font-mono text-[#C9A84C]">{b.bookingRef}</td>
                  <td className="p-4 text-sm text-[#F5F0E8]">
                    <div className="font-medium">{b.customerName}</div>
                    <div className="text-xs text-[#A1A1A6]">{b.customerPhone}</div>
                  </td>
                  <td className="p-4 text-sm text-[#A1A1A6]">
                    {b.pickupLocation.substring(0, 15)}... <span className="text-[#C9A84C]">→</span> {b.dropoffLocation.substring(0, 15)}...
                  </td>
                  <td className="p-4 text-sm text-[#A1A1A6]">
                    {new Date(b.pickupDateTime).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded text-[0.65rem] font-bold uppercase tracking-wider ${
                      b.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
                      b.status === 'CONFIRMED' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                      b.status === 'COMPLETED' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                      'bg-[#333] text-[#A1A1A6] border border-[#444]'
                    }`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm font-bold text-[#F5F0E8] text-right">
                    {b.currency} {b.totalPrice}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import { LucideIcon } from "lucide-react";

function StatCard({ title, value, icon: Icon, trend, alert }: { title: string, value: string | number, icon: LucideIcon, trend?: string, alert?: boolean }) {
  return (
    <div className={`bg-[#111] border ${alert ? 'border-red-500/30' : 'border-[#C9A84C]/15'} rounded-2xl p-6 flex flex-col justify-between`}>
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-sm font-medium text-[#A1A1A6]">{title}</h3>
        <div className={`p-2 rounded-lg ${alert ? 'bg-red-500/10' : 'bg-[#C9A84C]/10'}`}>
          <Icon className={`h-5 w-5 ${alert ? 'text-red-500' : 'text-[#C9A84C]'}`} />
        </div>
      </div>
      <div>
        <p className="font-heading text-3xl font-bold text-[#F5F0E8]">{value}</p>
        {trend && <p className="text-xs text-green-400 mt-2 font-medium">{trend}</p>}
      </div>
    </div>
  );
}
