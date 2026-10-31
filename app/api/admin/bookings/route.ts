import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { BookingStatus, VehicleType, Prisma } from "@prisma/client";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { isEmailedBookingStatus, sendBookingStatusEmail } from "@/lib/email/booking-status";

export async function GET(request: Request) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const status = searchParams.get("status");
    const vehicleType = searchParams.get("vehicleType");
    const pageParam = searchParams.get("page");
    const limitParam = searchParams.get("limit");

    const page = pageParam ? Math.max(1, parseInt(pageParam)) : 1;
    const limit = limitParam ? Math.max(1, parseInt(limitParam)) : 10;
    const skip = (page - 1) * limit;

    const whereClause: Prisma.BookingWhereInput = {};

    // Apply status filter
    if (status) {
      whereClause.status = status as BookingStatus;
    }

    // Apply vehicle type filter
    if (vehicleType) {
      whereClause.vehicle = {
        type: vehicleType as VehicleType
      };
    }

    // Apply search filter (name, phone, email, reference)
    if (search) {
      whereClause.OR = [
        { customerName: { contains: search } },
        { customerPhone: { contains: search } },
        { customerEmail: { contains: search } },
        { bookingRef: { contains: search } }
      ];
    }

    // Query total count and records in parallel
    const [total, bookings] = await Promise.all([
      prisma.booking.count({ where: whereClause }),
      prisma.booking.findMany({
        where: whereClause,
        include: { vehicle: true },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit
      })
    ]);

    return NextResponse.json({
      success: true,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      bookings
    });

  } catch (error) {
    console.error("Admin bookings list error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

const CREATE_STATUSES: BookingStatus[] = ["PENDING", "CONFIRMED", "DRIVER_ASSIGNED"];

// POST /api/admin/bookings - an admin logs a booking taken over WhatsApp/phone.
// Unlike the public /api/bookings, this never sends the "request received / price
// pending" email: the admin chooses the status + price up front and optionally
// emails the customer the matching status email.
export async function POST(request: Request) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const b = await request.json();
    const {
      customerName, customerPhone, customerEmail, vehicleId,
      pickupLocation, dropoffLocation, pickupDateTime, passengers,
      totalPrice, status, notes, paymentMethod, flightNumber, notifyCustomer,
    } = b;

    if (!customerName || !customerPhone || !vehicleId || !pickupLocation || !dropoffLocation || !pickupDateTime || !passengers) {
      return NextResponse.json({ error: "Name, phone, vehicle, pickup, drop-off, date/time and passengers are required" }, { status: 400 });
    }
    const st: BookingStatus = CREATE_STATUSES.includes(status) ? status : "PENDING";
    const when = new Date(pickupDateTime);
    if (Number.isNaN(when.getTime())) return NextResponse.json({ error: "Invalid pickup date/time" }, { status: 400 });

    const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
    if (!vehicle) return NextResponse.json({ error: "Vehicle not found" }, { status: 400 });

    const bookingRef = `TSA-${when.getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const created = await prisma.booking.create({
      data: {
        bookingRef,
        vehicleId: vehicle.id,
        status: st,
        pickupLocation: String(pickupLocation).trim(),
        dropoffLocation: String(dropoffLocation).trim(),
        pickupDateTime: when,
        passengers: Number(passengers),
        totalPrice: Number(totalPrice) || 0,
        customerName: String(customerName).trim(),
        customerPhone: String(customerPhone).trim(),
        customerEmail: customerEmail ? String(customerEmail).trim() : null,
        notes: notes ? String(notes) : null,
        flightNumber: flightNumber || null,
        paymentMethod: paymentMethod || "arrival",
      },
      include: { vehicle: true },
    });

    let email: { sent: boolean; to?: string; error?: string } = { sent: false };
    if (notifyCustomer && isEmailedBookingStatus(st)) {
      if (!created.customerEmail) {
        email = { sent: false, error: "No customer email on this booking" };
      } else {
        const r = await sendBookingStatusEmail({
          bookingRef: created.bookingRef,
          customerName: created.customerName,
          customerPhone: created.customerPhone,
          customerEmail: created.customerEmail,
          pickupLocation: created.pickupLocation,
          dropoffLocation: created.dropoffLocation,
          pickupDateTime: created.pickupDateTime,
          passengers: created.passengers,
          vehicleName: created.vehicle?.name ?? null,
          totalPrice: created.totalPrice,
          currency: created.currency,
          paymentMethod: created.paymentMethod,
          status: st,
        });
        email = r.ok ? { sent: true, to: created.customerEmail } : { sent: false, error: r.error };
      }
    }

    return NextResponse.json({ success: true, bookingRef: created.bookingRef, id: created.id, email }, { status: 201 });
  } catch (error) {
    console.error("Admin create booking error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
