import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createQuotationFromBooking } from "@/lib/supabase/quotations";
import type { DriverVehicleType } from "@/lib/supabase/drivers";

const VEHICLE_MAP: Record<string, DriverVehicleType> = {
  SEDAN: "sedan",
  SUV: "suv",
  VAN: "van",
  BUS: "bus",
  LUXURY: "limousine",
};

// POST /api/admin/bookings/[id]/quotation — generate (or return the existing)
// quotation PDF record for a booking, reusing the real quotations system.
export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { id } = await params;
  const booking = await prisma.booking.findUnique({ where: { id }, include: { vehicle: true } });
  if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

  // Already generated — idempotent, never creates a duplicate quotation.
  if (booking.quotationId && booking.quotationRef) {
    return NextResponse.json({ quotationId: booking.quotationId, quotationRef: booking.quotationRef });
  }

  if (!booking.totalPrice || booking.totalPrice <= 0) {
    return NextResponse.json({ error: "Set a confirmed price before generating a quotation" }, { status: 400 });
  }

  const { row, error } = await createQuotationFromBooking({
    customer_name: booking.customerName,
    customer_phone: booking.customerPhone,
    customer_email: booking.customerEmail,
    pickup_location: booking.pickupLocation,
    drop_location: booking.dropoffLocation,
    trip_type: booking.isRoundTrip ? "round_trip" : "one_way",
    trip_date: booking.pickupDateTime.toISOString().slice(0, 10),
    trip_time: booking.pickupDateTime.toISOString().slice(11, 16),
    passengers_count: booking.passengers,
    vehicle_type_requested: VEHICLE_MAP[booking.vehicle.type] ?? null,
    quoted_price: booking.totalPrice,
    currency: booking.currency,
    luggage_notes: `Linked booking: ${booking.bookingRef}`,
  });

  if (error || !row) {
    return NextResponse.json({ error: error ?? "Could not create quotation" }, { status: 500 });
  }

  await prisma.booking.update({
    where: { id },
    data: { quotationId: row.id, quotationRef: row.quote_reference },
  });

  return NextResponse.json({ quotationId: row.id, quotationRef: row.quote_reference });
}
