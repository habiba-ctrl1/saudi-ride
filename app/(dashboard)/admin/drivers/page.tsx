import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Users, Plus, Phone, Star, Car, ToggleRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Driver Management | Admin Dashboard",
};

export const dynamic = 'force-dynamic';

export default async function AdminDriversPage() {
  const drivers = await prisma.user.findMany({
    where: { role: "DRIVER" },
    include: {
      _count: {
        select: { bookings: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-8">
      {/* ─── HEADER ───────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-[#F5F0E8]">Driver Management</h1>
          <p className="text-[#A1A1A6] mt-1 text-sm">{drivers.length} drivers registered in the system.</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-[#C9A84C] text-[#0A0A0A] font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-lg hover:bg-[#B8963B] transition-colors w-fit">
          <Plus className="h-4 w-4" /> Add Driver
        </button>
      </div>

      {/* ─── DRIVER CARDS ─────────────────────────────────────────── */}
      {drivers.length === 0 ? (
        <div className="bg-[#111] border border-[#C9A84C]/15 rounded-2xl p-12 text-center">
          <Users className="h-12 w-12 text-[#7C8088] mx-auto mb-4" />
          <h3 className="font-heading text-xl font-bold text-[#F5F0E8] mb-2">No Drivers Found</h3>
          <p className="text-sm text-[#A1A1A6]">Add your first driver to start managing your fleet team.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {drivers.map((driver) => (
            <div key={driver.id} className="bg-[#111] border border-[#C9A84C]/15 rounded-2xl p-6 hover:border-[#C9A84C]/30 transition-colors">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-[#C9A84C]/20 flex items-center justify-center text-[#C9A84C] font-bold text-lg shrink-0">
                    {driver.name?.charAt(0) || "D"}
                  </div>
                  <div>
                    <h3 className="font-bold text-[#F5F0E8]">{driver.name || "Unknown"}</h3>
                    <p className="text-xs text-[#A1A1A6]">{driver.email}</p>
                  </div>
                </div>
                <span className="inline-flex items-center px-2 py-1 rounded text-[0.55rem] font-bold uppercase tracking-wider bg-green-500/10 text-green-500 border border-green-500/20">
                  Active
                </span>
              </div>

              <div className="space-y-3 mb-6 pb-6 border-b border-[#C9A84C]/10">
                <div className="flex items-center gap-3 text-sm text-[#A1A1A6]">
                  <Phone className="h-4 w-4 text-[#7C8088]" />
                  {driver.phone || "No phone"}
                </div>
                <div className="flex items-center gap-3 text-sm text-[#A1A1A6]">
                  <Star className="h-4 w-4 text-[#C9A84C]" />
                  4.8 / 5.0 Rating
                </div>
                <div className="flex items-center gap-3 text-sm text-[#A1A1A6]">
                  <Car className="h-4 w-4 text-[#7C8088]" />
                  {driver._count.bookings} total trips
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button className="text-xs font-bold text-[#C9A84C] uppercase tracking-wider hover:text-[#B8963B] transition-colors">
                  Edit
                </button>
                <button className="flex items-center gap-1.5 text-xs font-bold text-[#A1A1A6] uppercase tracking-wider hover:text-[#F5F0E8] transition-colors">
                  <ToggleRight className="h-4 w-4 text-green-500" /> Available
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
