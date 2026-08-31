import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { BookingsClient } from "./BookingsClient";

export const metadata: Metadata = {
  title: "Bookings | Admin Dashboard",
};

export const dynamic = "force-dynamic";

const LIMIT = 25;

// Each stage tab maps to a real, distinct where-clause — "Quote Sent" is
// PENDING bookings that already have a quotation generated (quotationRef
// set), not a separate BookingStatus value (the schema doesn't have one).
function stageWhere(stage: string | undefined): Prisma.BookingWhereInput {
  switch (stage) {
    case "pending": return { status: "PENDING", quotationRef: null };
    case "quote_sent": return { status: "PENDING", quotationRef: { not: null } };
    case "confirmed": return { status: { in: ["CONFIRMED", "DRIVER_ASSIGNED"] } };
    case "in_progress": return { status: "IN_PROGRESS" };
    case "completed": return { status: "COMPLETED" };
    case "cancelled": return { status: { in: ["CANCELLED", "REFUNDED"] } };
    default: return {};
  }
}

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const page = sp.page ? Math.max(1, Number(sp.page) || 1) : 1;
  const stage = sp.stage || "all";
  const search = sp.search || undefined;

  const whereClause: Prisma.BookingWhereInput = { ...stageWhere(stage) };
  if (search) {
    whereClause.OR = [
      { customerName: { contains: search } },
      { customerPhone: { contains: search } },
      { customerEmail: { contains: search } },
      { bookingRef: { contains: search } },
    ];
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
  const now = new Date();
  const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  // Same definition the /api/cron/urgent-bookings re-alert job uses: still
  // Pending, no price set, pickup within 24h or already overdue.
  const urgentWhere: Prisma.BookingWhereInput = {
    status: "PENDING",
    totalPrice: 0,
    isTest: false,
    pickupDateTime: { lt: in24h },
  };

  const [
    total,
    bookings,
    vehicles,
    totalAllTime,
    todayRevenueAgg,
    activeJobsToday,
    countPending,
    countQuoteSent,
    countConfirmed,
    countInProgress,
    countCompleted,
    countCancelled,
    urgentBookings,
  ] = await Promise.all([
    prisma.booking.count({ where: whereClause }),
    prisma.booking.findMany({
      where: whereClause,
      include: { vehicle: true },
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
      skip: (page - 1) * LIMIT,
      take: LIMIT,
    }),
    prisma.vehicle.findMany({ where: { available: true }, select: { id: true, name: true, type: true }, orderBy: { name: "asc" } }),
    prisma.booking.count(),
    prisma.booking.aggregate({ where: { paymentStatus: "PAID", createdAt: { gte: today } }, _sum: { totalPrice: true } }),
    prisma.booking.count({ where: { status: { in: ["DRIVER_ASSIGNED", "IN_PROGRESS"] }, pickupDateTime: { gte: today, lt: tomorrow } } }),
    prisma.booking.count({ where: stageWhere("pending") }),
    prisma.booking.count({ where: stageWhere("quote_sent") }),
    prisma.booking.count({ where: stageWhere("confirmed") }),
    prisma.booking.count({ where: stageWhere("in_progress") }),
    prisma.booking.count({ where: stageWhere("completed") }),
    prisma.booking.count({ where: stageWhere("cancelled") }),
    prisma.booking.findMany({ where: urgentWhere, select: { id: true, bookingRef: true, customerName: true, customerPhone: true, pickupDateTime: true }, orderBy: { pickupDateTime: "asc" } }),
  ]);

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
        isUrgent: b.status === "PENDING" && b.totalPrice === 0 && !b.isTest && b.pickupDateTime.getTime() < in24h.getTime(),
      }))}
      total={total}
      page={page}
      limit={LIMIT}
      vehicles={vehicles}
      stats={{
        totalAllTime,
        todayRevenue: todayRevenueAgg._sum.totalPrice ?? 0,
        activeJobsToday,
      }}
      urgentBookings={urgentBookings.map((b) => ({
        id: b.id,
        bookingRef: b.bookingRef,
        customerName: b.customerName,
        customerPhone: b.customerPhone,
        pickupDateTime: b.pickupDateTime.toISOString(),
      }))}
      stageCounts={{
        all: totalAllTime,
        pending: countPending,
        quote_sent: countQuoteSent,
        confirmed: countConfirmed,
        in_progress: countInProgress,
        completed: countCompleted,
        cancelled: countCancelled,
      }}
    />
  );
}
