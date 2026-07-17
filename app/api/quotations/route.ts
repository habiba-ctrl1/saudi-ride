import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createQuotation, listQuotations, type QuotationFilters, type TripType } from "@/lib/supabase/quotations";
import type { DriverVehicleType } from "@/lib/supabase/drivers";
import { sendEmail } from "@/lib/notifications";
import { adminQuotationEmail, clientQuotationEmail } from "@/lib/email/templates";

const adminEmail = process.env.ADMIN_EMAIL || "infotaxisaudiarabia@gmail.com";

const TRIP_TYPES: TripType[] = ["one_way", "round_trip", "event", "multi_day", "airport_transfer", "hourly"];
const VEHICLE_TYPES: DriverVehicleType[] = ["sedan", "suv", "van", "bus", "limousine"];

// Public: customer requests a quote (homepage booking form, route pages)
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const customerName = String(body.customerName ?? body.customer_name ?? "").trim();
    const customerPhone = String(body.customerPhone ?? body.customer_phone ?? "").trim();
    const pickup = String(body.pickup ?? body.pickup_location ?? "").trim();
    const dropoff = String(body.dropoff ?? body.drop_location ?? "").trim();
    const tripDate = String(body.travelDate ?? body.trip_date ?? "").trim();

    if (!customerName || !customerPhone || !pickup || !dropoff || !tripDate) {
      return NextResponse.json(
        { error: "Missing required fields: customerName, customerPhone, pickup, dropoff, travelDate" },
        { status: 400 }
      );
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(tripDate)) {
      return NextResponse.json({ error: "travelDate must be YYYY-MM-DD" }, { status: 400 });
    }
    if (!/^\+?[0-9\s-]{8,20}$/.test(customerPhone)) {
      return NextResponse.json({ error: "Invalid phone number" }, { status: 400 });
    }

    const tripType = TRIP_TYPES.includes(body.tripType) ? (body.tripType as TripType) : "one_way";
    const vehicleType = VEHICLE_TYPES.includes(body.vehicleType) ? (body.vehicleType as DriverVehicleType) : null;
    const passengers = Number(body.passengers ?? body.passengers_count);

    const { row, error } = await createQuotation({
      customer_name: customerName,
      customer_phone: customerPhone,
      customer_email: body.customerEmail ? String(body.customerEmail).trim() : null,
      pickup_location: pickup,
      drop_location: dropoff,
      trip_type: tripType,
      trip_date: tripDate,
      trip_time: body.travelTime ? String(body.travelTime) : null,
      return_date: body.returnDate ? String(body.returnDate) : null,
      passengers_count: Number.isFinite(passengers) && passengers >= 1 ? passengers : null,
      luggage_notes: body.notes ? String(body.notes).slice(0, 500) : null,
      vehicle_type_requested: vehicleType,
      source: "website",
    });

    if (error || !row) {
      console.error("createQuotation failed:", error);
      return NextResponse.json({ error: "Could not save your request. Please try again or contact us on WhatsApp." }, { status: 500 });
    }

    // Notifications — best-effort, never fail the request
    const emailData = {
      quoteReference: row.quote_reference ?? "",
      customerName,
      customerPhone,
      customerEmail: body.customerEmail ? String(body.customerEmail).trim() : null,
      pickup,
      dropoff,
      tripDate,
      tripTime: body.travelTime ? String(body.travelTime) : null,
      passengers: Number.isFinite(passengers) && passengers >= 1 ? passengers : null,
    };
    const adminMail = adminQuotationEmail(emailData);
    const sends = [sendEmail(adminEmail, adminMail.subject, adminMail.html)];
    if (emailData.customerEmail) {
      const clientMail = clientQuotationEmail(emailData);
      sends.push(sendEmail(emailData.customerEmail, clientMail.subject, clientMail.html));
    }
    await Promise.allSettled(sends);

    return NextResponse.json(
      { success: true, quoteReference: row.quote_reference, id: row.id },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}

// Admin: list quotations (needs SUPABASE_SERVICE_ROLE_KEY + admin session)
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const filters: QuotationFilters = {
    status: (searchParams.get("status") as QuotationFilters["status"]) ?? undefined,
    search: searchParams.get("search") ?? undefined,
    page: Number(searchParams.get("page")) || 1,
    limit: Number(searchParams.get("limit")) || 25,
  };
  const { rows, total, error } = await listQuotations(filters);
  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ rows, total });
}
