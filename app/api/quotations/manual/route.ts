import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createManualQuotation, type ManualQuotationInput } from "@/lib/supabase/quotations";

// Admin: manually add a quotation that never went through the public form or
// the /book bridge — a WhatsApp-only lead typed straight into the system.
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const user = session?.user as { role?: string } | undefined;
  if (user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid request body" }, { status: 400 });

  const required: Array<keyof ManualQuotationInput> = [
    "customer_name", "customer_phone", "pickup_location", "drop_location", "trip_date",
  ];
  for (const field of required) {
    if (!body[field] || !String(body[field]).trim()) {
      return NextResponse.json({ error: `${field} is required` }, { status: 400 });
    }
  }

  const quotedPrice = body.quoted_price !== undefined && body.quoted_price !== null && body.quoted_price !== ""
    ? Number(body.quoted_price)
    : null;
  if (quotedPrice !== null && (!Number.isFinite(quotedPrice) || quotedPrice < 0)) {
    return NextResponse.json({ error: "Invalid price" }, { status: 400 });
  }

  const input: ManualQuotationInput = {
    customer_name: String(body.customer_name).trim(),
    customer_phone: String(body.customer_phone).trim(),
    customer_email: body.customer_email ? String(body.customer_email).trim() : null,
    pickup_location: String(body.pickup_location).trim(),
    drop_location: String(body.drop_location).trim(),
    trip_type: body.trip_type || undefined,
    trip_date: String(body.trip_date),
    trip_time: body.trip_time || null,
    passengers_count: body.passengers_count ? Number(body.passengers_count) : null,
    luggage_notes: body.luggage_notes || null,
    vehicle_type_requested: body.vehicle_type_requested || null,
    quoted_price: quotedPrice,
    source: body.source || undefined,
  };

  const { row, error } = await createManualQuotation(input);
  if (error || !row) return NextResponse.json({ error: error ?? "Could not create quotation" }, { status: 500 });

  return NextResponse.json({ success: true, row });
}
