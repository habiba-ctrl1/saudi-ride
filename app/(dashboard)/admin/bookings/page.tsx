import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Prisma, BookingStatus } from "@prisma/client";
import { BookingsClient } from "./BookingsClient";

export const metadata: Metadata = {
  title: "Bookings | Admin Dashboard",
};

export const dynamic = "force-dynamic";

const STAGE_STATUS_MAP: Record<string, BookingStatus[]> = {
  needs_price: ["PENDING"],
  confirmed: ["CONFIRMED", "DRIVER_ASSIGNED", "IN_PROGRESS"],
  completed: ["COMPLETED"],
  cancelled: ["CANCELLED", "REFUNDED"],
};

const LIMIT = 25;

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const page = sp.page ? Math.max(1, Number(sp.page) || 1) : 1;
  const stage = sp.stage && STAGE_STATUS_MAP[sp.stage] ? sp.stage : undefined;
  const search = sp.search || undefined;

  const whereClause: Prisma.BookingWhereInput = {};
  if (stage) whereClause.status = { in: STAGE_STATUS_MAP[stage] };
  if (search) {
    whereClause.OR = [
      { customerName: { contains: search } },
      { customerPhone: { contains: search } },
      { customerEmail: { contains: search } },
      { bookingRef: { contains: search } },
    ];
  }

  const [total, bookings] = await Promise.all([
    prisma.booking.count({ where: whereClause }),
    prisma.booking.findMany({
      where: whereClause,
      include: { vehicle: true },
      // Bookings still needing a price (created via the removed automatic
      // calculator flow, always PENDING/totalPrice 0) surface first so the
      // admin can't miss a customer waiting on a WhatsApp quote.
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
      skip: (page - 1) * LIMIT,
      take: LIMIT,
    }),
  ]);

  const needsPriceCount = await prisma.booking.count({
    where: { status: "PENDING", totalPrice: 0 },
  });

  return (
    <BookingsClient
      bookings={bookings.map((b) => ({
        id: b.id,
        bookingRef: b.bookingRef,
        status: b.status,
        pickupLocation: b.pickupLocation,
        dropoffLocation: b.dropoffLocation,
        pickupDateTime: b.pickupDateTime.toISOString(),
        passengers: b.passengers,
        totalPrice: b.totalPrice,
        currency: b.currency,
        customerName: b.customerName,
        customerPhone: b.customerPhone,
        customerEmail: b.customerEmail,
        notes: b.notes,
        driverName: b.driverName,
        driverPhone: b.driverPhone,
        vehicleName: b.vehicle.name,
        createdAt: b.createdAt.toISOString(),
        isTest: b.isTest,
        quotationId: b.quotationId,
        quotationRef: b.quotationRef,
      }))}
      total={total}
      page={page}
      limit={LIMIT}
      needsPriceCount={needsPriceCount}
    />
  );
}
