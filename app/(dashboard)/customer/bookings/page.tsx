import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { MapPin, CalendarDays, Car, ReceiptText, Ban, RefreshCw, Navigation } from "lucide-react";

export const metadata: Metadata = {
  title: "My Bookings | Customer Dashboard",
};

export default async function CustomerBookingsPage(props: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const searchParams = await props.searchParams;
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const filter = searchParams.filter || "upcoming";

  // Determine status filter based on selection
  let statusFilter: Record<string, unknown> = {};
  if (filter === "upcoming") {
    statusFilter = { status: { in: ["PENDING", "CONFIRMED", "DRIVER_ASSIGNED", "IN_PROGRESS"] } };
  } else if (filter === "past") {
    statusFilter = { status: "COMPLETED" };
  } else if (filter === "cancelled") {
    statusFilter = { status: "CANCELLED" };
  }

  const bookings = await prisma.booking.findMany({
    where: {
      userId: (session.user as { id?: string }).id,
      ...statusFilter,
    },
    include: {
      vehicle: true,
    },
    orderBy: {
      pickupDateTime: filter === "upcoming" ? "asc" : "desc",
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-bold text-[#F5F0E8]">My Bookings</h1>
        <p className="text-[#A1A1A6] mt-1 text-sm">Manage your past and upcoming luxury transport reservations.</p>
      </div>

      {/* FILTER TABS */}
      <div className="flex gap-2 border-b border-[#C9A84C]/20 pb-px">
        <Link 
          href="/customer/bookings?filter=upcoming" 
          className={`px-4 py-2 text-sm font-bold uppercase tracking-wider transition-colors ${filter === 'upcoming' ? 'text-[#C9A84C] border-b-2 border-[#C9A84C]' : 'text-[#7C8088] hover:text-[#F5F0E8]'}`}
        >
          Upcoming
        </Link>
        <Link 
          href="/customer/bookings?filter=past" 
          className={`px-4 py-2 text-sm font-bold uppercase tracking-wider transition-colors ${filter === 'past' ? 'text-[#C9A84C] border-b-2 border-[#C9A84C]' : 'text-[#7C8088] hover:text-[#F5F0E8]'}`}
        >
          Past
        </Link>
        <Link 
          href="/customer/bookings?filter=cancelled" 
          className={`px-4 py-2 text-sm font-bold uppercase tracking-wider transition-colors ${filter === 'cancelled' ? 'text-[#C9A84C] border-b-2 border-[#C9A84C]' : 'text-[#7C8088] hover:text-[#F5F0E8]'}`}
        >
          Cancelled
        </Link>
      </div>

      {/* BOOKINGS LIST */}
      <div className="space-y-4">
        {bookings.length === 0 ? (
          <div className="bg-[#111] border border-[#C9A84C]/10 rounded-2xl p-12 text-center">
            <CalendarDays className="h-12 w-12 text-[#C9A84C]/50 mx-auto mb-4" />
            <h3 className="text-[#F5F0E8] font-bold text-lg mb-2">No {filter} bookings</h3>
            <p className="text-[#A1A1A6] text-sm mb-6">You don&apos;t have any {filter} reservations at the moment.</p>
            <Link href="/book" className="inline-flex bg-[#C9A84C] text-[#0A0A0A] font-bold uppercase tracking-wider text-xs px-6 py-3 rounded-xl hover:bg-[#B8963B] transition-colors">
              Book a Ride
            </Link>
          </div>
        ) : (
          bookings.map((booking) => {
            const isCancellable = new Date(booking.pickupDateTime).getTime() > Date.now() + 24 * 60 * 60 * 1000;

            return (
              <div key={booking.id} className="bg-[#111] border border-[#C9A84C]/20 rounded-2xl p-6 flex flex-col md:flex-row gap-6 hover:border-[#C9A84C]/40 transition-colors">
                
                {/* Details Section */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[#C9A84C] text-xs font-bold bg-[#C9A84C]/10 px-2 py-1 rounded">
                      {booking.bookingRef}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded text-[0.65rem] font-bold uppercase tracking-wider ${
                      booking.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
                      booking.status === 'CONFIRMED' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                      booking.status === 'IN_PROGRESS' || booking.status === 'DRIVER_ASSIGNED' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                      booking.status === 'COMPLETED' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                      'bg-red-500/10 text-red-500 border border-red-500/20'
                    }`}>
                      {booking.status.replace("_", " ")}
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-[#7C8088] text-xs font-bold uppercase mb-1 flex items-center gap-1"><MapPin className="h-3 w-3" /> Route</p>
                      <p className="text-[#F5F0E8] text-sm font-medium truncate" title={booking.pickupLocation}>{booking.pickupLocation}</p>
                      <p className="text-[#A1A1A6] text-xs truncate" title={booking.dropoffLocation}>To: {booking.dropoffLocation}</p>
                    </div>
                    <div>
                      <p className="text-[#7C8088] text-xs font-bold uppercase mb-1 flex items-center gap-1"><CalendarDays className="h-3 w-3" /> Date & Time</p>
                      <p className="text-[#F5F0E8] text-sm font-medium">{new Date(booking.pickupDateTime).toLocaleDateString()}</p>
                      <p className="text-[#A1A1A6] text-xs">{new Date(booking.pickupDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm bg-[#1A1A1A] p-3 rounded-xl border border-[#C9A84C]/10">
                    <div className="flex items-center gap-2 text-[#A1A1A6]">
                      <Car className="h-4 w-4 text-[#C9A84C]" /> {booking.vehicle.name}
                    </div>
                    <div className="h-4 w-px bg-[#C9A84C]/20"></div>
                    <div className="text-[#F5F0E8] font-bold">
                      {booking.currency} {booking.totalPrice}
                    </div>
                  </div>
                </div>

                {/* Actions Section */}
                <div className="flex flex-row md:flex-col gap-2 shrink-0 justify-center">
                  {filter === "upcoming" && (
                    <>
                      <Link href={`/track-booking?ref=${booking.bookingRef}`} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#C9A84C] text-[#0A0A0A] font-bold uppercase tracking-wider text-[0.65rem] px-4 py-3 rounded-xl hover:bg-[#B8963B] transition-colors">
                        <Navigation className="h-4 w-4" /> Track Ride
                      </Link>
                      {isCancellable && booking.status !== "CANCELLED" && (
                        <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#1A1A1A] border border-red-500/30 text-red-400 font-bold uppercase tracking-wider text-[0.65rem] px-4 py-3 rounded-xl hover:bg-red-500/10 transition-colors">
                          <Ban className="h-4 w-4" /> Cancel
                        </button>
                      )}
                    </>
                  )}
                  {filter === "past" && (
                    <>
                      <Link href={`/book?rebook=${booking.id}`} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#C9A84C] text-[#0A0A0A] font-bold uppercase tracking-wider text-[0.65rem] px-4 py-3 rounded-xl hover:bg-[#B8963B] transition-colors">
                        <RefreshCw className="h-4 w-4" /> Rebook
                      </Link>
                      <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#1A1A1A] border border-[#C9A84C]/20 text-[#A1A1A6] font-bold uppercase tracking-wider text-[0.65rem] px-4 py-3 rounded-xl hover:bg-[#C9A84C]/10 hover:text-[#F5F0E8] transition-colors">
                        <ReceiptText className="h-4 w-4" /> Invoice
                      </button>
                    </>
                  )}
                  {filter === "cancelled" && (
                    <Link href={`/book?rebook=${booking.id}`} className="w-full flex items-center justify-center gap-2 bg-[#1A1A1A] border border-[#C9A84C]/20 text-[#C9A84C] font-bold uppercase tracking-wider text-[0.65rem] px-4 py-3 rounded-xl hover:bg-[#C9A84C]/10 transition-colors">
                      <RefreshCw className="h-4 w-4" /> Rebook
                    </Link>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
