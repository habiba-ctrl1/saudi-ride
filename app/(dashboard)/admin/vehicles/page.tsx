import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { Car, Plus, ToggleRight, Edit, Users, Gauge } from "lucide-react";

export const metadata: Metadata = {
  title: "Fleet Management | Admin Dashboard",
};

export const dynamic = 'force-dynamic';

export default async function AdminVehiclesPage() {
  const vehicles = await prisma.vehicle.findMany({
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
          <h1 className="font-heading text-3xl font-bold text-[#F5F0E8]">Fleet Management</h1>
          <p className="text-[#A1A1A6] mt-1 text-sm">{vehicles.length} vehicles in the fleet.</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-[#C9A84C] text-[#0A0A0A] font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-lg hover:bg-[#B8963B] transition-colors w-fit">
          <Plus className="h-4 w-4" /> Add Vehicle
        </button>
      </div>

      {/* ─── VEHICLE GRID ─────────────────────────────────────────── */}
      {vehicles.length === 0 ? (
        <div className="bg-[#111] border border-[#C9A84C]/15 rounded-2xl p-12 text-center">
          <Car className="h-12 w-12 text-[#7C8088] mx-auto mb-4" />
          <h3 className="font-heading text-xl font-bold text-[#F5F0E8] mb-2">No Vehicles Found</h3>
          <p className="text-sm text-[#A1A1A6]">Add your first vehicle to start managing your fleet.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="bg-[#111] border border-[#C9A84C]/15 rounded-2xl overflow-hidden hover:border-[#C9A84C]/30 transition-colors group">
              {/* Vehicle Image */}
              <div className="relative h-48 bg-[#1A1A1A]">
                <Image 
                  src={vehicle.image} 
                  alt={vehicle.name} 
                  fill 
                  className="object-cover transition-transform duration-500 group-hover:scale-105" 
                />
                <div className="absolute top-3 right-3">
                  <span className={`inline-flex items-center px-2 py-1 rounded text-[0.55rem] font-bold uppercase tracking-wider ${
                    vehicle.available 
                      ? 'bg-green-500/10 text-green-500 border border-green-500/20 backdrop-blur-md' 
                      : 'bg-red-500/10 text-red-500 border border-red-500/20 backdrop-blur-md'
                  }`}>
                    {vehicle.available ? "Available" : "Unavailable"}
                  </span>
                </div>
                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center px-2 py-1 rounded text-[0.55rem] font-bold uppercase tracking-wider bg-[#0A0A0A]/80 text-[#C9A84C] border border-[#C9A84C]/20 backdrop-blur-md">
                    {vehicle.type}
                  </span>
                </div>
              </div>

              {/* Vehicle Info */}
              <div className="p-6">
                <h3 className="font-heading text-lg font-bold text-[#F5F0E8] mb-4">{vehicle.name}</h3>
                
                <div className="grid grid-cols-3 gap-4 mb-6 pb-6 border-b border-[#C9A84C]/10">
                  <div className="text-center">
                    <Users className="h-4 w-4 text-[#7C8088] mx-auto mb-1" />
                    <p className="text-xs text-[#7C8088] font-bold uppercase tracking-wider">Capacity</p>
                    <p className="text-sm font-bold text-[#F5F0E8]">{vehicle.capacity} pax</p>
                  </div>
                  <div className="text-center">
                    <Gauge className="h-4 w-4 text-[#7C8088] mx-auto mb-1" />
                    <p className="text-xs text-[#7C8088] font-bold uppercase tracking-wider">Price/km</p>
                    <p className="text-sm font-bold text-[#C9A84C]">{vehicle.pricePerKm} SAR</p>
                  </div>
                  <div className="text-center">
                    <Car className="h-4 w-4 text-[#7C8088] mx-auto mb-1" />
                    <p className="text-xs text-[#7C8088] font-bold uppercase tracking-wider">Bookings</p>
                    <p className="text-sm font-bold text-[#F5F0E8]">{vehicle._count.bookings}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <button className="flex items-center gap-1.5 text-xs font-bold text-[#C9A84C] uppercase tracking-wider hover:text-[#B8963B] transition-colors">
                    <Edit className="h-3.5 w-3.5" /> Edit
                  </button>
                  <button className="flex items-center gap-1.5 text-xs font-bold text-[#A1A1A6] uppercase tracking-wider hover:text-[#F5F0E8] transition-colors">
                    <ToggleRight className={`h-4 w-4 ${vehicle.available ? 'text-green-500' : 'text-red-500'}`} /> 
                    {vehicle.available ? "Active" : "Inactive"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
