import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Phone, Mail, MapPin, Car, CreditCard, FileText, MessageSquare } from "lucide-react";

export const metadata: Metadata = {
  title: "Booking Detail | Admin Dashboard",
};

export const dynamic = 'force-dynamic';

export default async function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { vehicle: true, user: true },
  });

  if (!booking) return notFound();

  return (
    <div className="space-y-8">
      {/* ─── HEADER ───────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/bookings" className="p-2 rounded-lg border border-[#C9A84C]/20 hover:bg-[#C9A84C]/10 transition-colors">
            <ArrowLeft className="h-5 w-5 text-[#C9A84C]" />
          </Link>
          <div>
            <h1 className="font-heading text-2xl font-bold text-[#F5F0E8]">Booking Detail</h1>
            <p className="text-sm text-[#A1A1A6] font-mono mt-1">Ref: {booking.bookingRef}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider ${
            booking.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
            booking.status === 'CONFIRMED' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
            booking.status === 'COMPLETED' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
            booking.status === 'CANCELLED' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
            'bg-[#333] text-[#A1A1A6] border border-[#444]'
          }`}>
            {booking.status}
          </span>
          <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider ${
            booking.paymentStatus === 'PAID' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
            booking.paymentStatus === 'REFUNDED' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
            'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
          }`}>
            {booking.paymentStatus}
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ─── LEFT: MAIN INFO ────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Info */}
          <div className="bg-[#111] border border-[#C9A84C]/15 rounded-2xl p-6">
            <h3 className="font-heading text-lg font-bold mb-6 text-[#F5F0E8] flex items-center gap-2">
              <Mail className="h-5 w-5 text-[#C9A84C]" /> Customer Information
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <InfoRow label="Name" value={booking.customerName} />
              <InfoRow label="Phone" value={booking.customerPhone} />
              <InfoRow label="Email" value={booking.customerEmail || "Not provided"} />
              <InfoRow label="Flight Number" value={booking.flightNumber || "N/A"} />
            </div>
          </div>

          {/* Route Info */}
          <div className="bg-[#111] border border-[#C9A84C]/15 rounded-2xl p-6">
            <h3 className="font-heading text-lg font-bold mb-6 text-[#F5F0E8] flex items-center gap-2">
              <MapPin className="h-5 w-5 text-[#C9A84C]" /> Route Details
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <InfoRow label="Pickup" value={booking.pickupLocation} />
              <InfoRow label="Dropoff" value={booking.dropoffLocation} />
              <InfoRow label="Distance" value={booking.distance ? `${booking.distance} km` : "Not calculated"} />
              <InfoRow label="Duration" value={booking.duration ? `${booking.duration} mins` : "Not calculated"} />
              <InfoRow label="Round Trip" value={booking.isRoundTrip ? "Yes" : "No"} />
              <InfoRow label="Passengers" value={String(booking.passengers)} />
            </div>
          </div>

          {/* Vehicle & Driver */}
          <div className="bg-[#111] border border-[#C9A84C]/15 rounded-2xl p-6">
            <h3 className="font-heading text-lg font-bold mb-6 text-[#F5F0E8] flex items-center gap-2">
              <Car className="h-5 w-5 text-[#C9A84C]" /> Vehicle &amp; Driver
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <InfoRow label="Vehicle" value={booking.vehicle.name} />
              <InfoRow label="Type" value={booking.vehicle.type} />
              <InfoRow label="Driver Name" value={booking.driverName || "Not assigned"} />
              <InfoRow label="Driver Phone" value={booking.driverPhone || "Not assigned"} />
            </div>
          </div>

          {/* Notes */}
          <div className="bg-[#111] border border-[#C9A84C]/15 rounded-2xl p-6">
            <h3 className="font-heading text-lg font-bold mb-4 text-[#F5F0E8] flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-[#C9A84C]" /> Customer Notes
            </h3>
            <p className="text-sm text-[#A1A1A6] leading-relaxed">{booking.notes || "No notes provided by the customer."}</p>
          </div>
        </div>

        {/* ─── RIGHT: ACTIONS SIDEBAR ─────────────────────────────── */}
        <div className="space-y-6">
          {/* Pricing */}
          <div className="bg-[#111] border border-[#C9A84C]/15 rounded-2xl p-6">
            <h3 className="font-heading text-lg font-bold mb-4 text-[#F5F0E8] flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-[#C9A84C]" /> Pricing
            </h3>
            <div className="text-3xl font-bold text-[#C9A84C] mb-4">{booking.currency} {booking.totalPrice.toLocaleString()}</div>
            <InfoRow label="Payment Method" value={booking.paymentMethod || "Cash"} />
          </div>

          {/* Status Update */}
          <div className="bg-[#111] border border-[#C9A84C]/15 rounded-2xl p-6">
            <h3 className="font-heading text-sm font-bold mb-4 text-[#F5F0E8] uppercase tracking-wider">Update Status</h3>
            <form>
              <select 
                name="status" 
                defaultValue={booking.status}
                className="w-full bg-[#0A0A0A] border border-[#C9A84C]/20 rounded-lg px-4 py-3 text-sm text-[#F5F0E8] focus:border-[#C9A84C] outline-none mb-4"
              >
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="DRIVER_ASSIGNED">Driver Assigned</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
              <button type="button" className="w-full bg-[#C9A84C] text-[#0A0A0A] font-bold text-xs uppercase tracking-wider py-3 rounded-lg hover:bg-[#B8963B] transition-colors">
                Save Status
              </button>
            </form>
          </div>

          {/* Assign Driver */}
          <div className="bg-[#111] border border-[#C9A84C]/15 rounded-2xl p-6">
            <h3 className="font-heading text-sm font-bold mb-4 text-[#F5F0E8] uppercase tracking-wider">Assign Driver</h3>
            <input 
              type="text" 
              placeholder="Driver Name" 
              defaultValue={booking.driverName || ""}
              className="w-full bg-[#0A0A0A] border border-[#C9A84C]/20 rounded-lg px-4 py-3 text-sm text-[#F5F0E8] focus:border-[#C9A84C] outline-none mb-3"
            />
            <input 
              type="text" 
              placeholder="Driver Phone" 
              defaultValue={booking.driverPhone || ""}
              className="w-full bg-[#0A0A0A] border border-[#C9A84C]/20 rounded-lg px-4 py-3 text-sm text-[#F5F0E8] focus:border-[#C9A84C] outline-none mb-4"
            />
            <button type="button" className="w-full border border-[#C9A84C]/30 text-[#C9A84C] font-bold text-xs uppercase tracking-wider py-3 rounded-lg hover:bg-[#C9A84C]/10 transition-colors">
              Assign Driver
            </button>
          </div>

          {/* Action Buttons */}
          <div className="bg-[#111] border border-[#C9A84C]/15 rounded-2xl p-6 space-y-3">
            <h3 className="font-heading text-sm font-bold mb-4 text-[#F5F0E8] uppercase tracking-wider">Quick Actions</h3>
            <button type="button" className="w-full flex items-center justify-center gap-2 border border-[#C9A84C]/20 text-[#F5F0E8] text-xs font-bold uppercase tracking-wider py-3 rounded-lg hover:bg-[#1A1A1A] transition-colors">
              <Phone className="h-4 w-4" /> Send SMS to Customer
            </button>
            <button type="button" className="w-full flex items-center justify-center gap-2 border border-[#C9A84C]/20 text-[#F5F0E8] text-xs font-bold uppercase tracking-wider py-3 rounded-lg hover:bg-[#1A1A1A] transition-colors">
              <FileText className="h-4 w-4" /> Download Invoice
            </button>
            <button type="button" className="w-full flex items-center justify-center gap-2 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-wider py-3 rounded-lg hover:bg-red-500/10 transition-colors">
              <CreditCard className="h-4 w-4" /> Issue Refund
            </button>
          </div>

          {/* Timeline */}
          <div className="bg-[#111] border border-[#C9A84C]/15 rounded-2xl p-6">
            <h3 className="font-heading text-sm font-bold mb-4 text-[#F5F0E8] uppercase tracking-wider">Timeline</h3>
            <div className="space-y-4">
              <TimelineItem time={booking.createdAt.toISOString()} event="Booking Created" />
              {booking.status !== 'PENDING' && <TimelineItem time={booking.updatedAt.toISOString()} event={`Status → ${booking.status}`} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[0.65rem] text-[#7C8088] font-bold uppercase tracking-wider mb-1">{label}</p>
      <p className="text-sm text-[#F5F0E8]">{value}</p>
    </div>
  );
}

function TimelineItem({ time, event }: { time: string; event: string }) {
  return (
    <div className="flex gap-3 items-start">
      <div className="mt-1.5 h-2 w-2 rounded-full bg-[#C9A84C] shrink-0" />
      <div>
        <p className="text-sm text-[#F5F0E8]">{event}</p>
        <p className="text-xs text-[#7C8088]">{new Date(time).toLocaleString()}</p>
      </div>
    </div>
  );
}
