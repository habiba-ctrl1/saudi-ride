import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/requireAdmin";

// GET /api/admin/pricing-book — list price book entries, optionally filtered by route
export async function GET(request: Request) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const { searchParams } = new URL(request.url);
    const fromCity = searchParams.get("from");
    const toCity = searchParams.get("to");
    const active = searchParams.get("active");

    const where = {
      ...(fromCity ? { fromCity: { contains: fromCity, mode: "insensitive" as const } } : {}),
      ...(toCity ? { toCity: { contains: toCity, mode: "insensitive" as const } } : {}),
      ...(active !== null ? { isActive: active === "true" } : {}),
    };

    const entries = await prisma.priceBookEntry.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, total: entries.length, entries });
  } catch (error) {
    console.error("GET /api/admin/pricing-book error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/admin/pricing-book — add a new quoted price for a route + vehicle
export async function POST(request: Request) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const body = await request.json();
    const {
      from_city,
      to_city,
      vehicle_type,
      price,
      currency = "SAR",
      trip_type = "ONE_WAY",
      notes,
      source = "manual",
    } = body as {
      from_city?: string;
      to_city?: string;
      vehicle_type?: string;
      price?: number;
      currency?: string;
      trip_type?: string;
      notes?: string;
      source?: string;
    };

    if (!from_city || !to_city || !vehicle_type || price === undefined || price === null) {
      return NextResponse.json(
        { error: "from_city, to_city, vehicle_type, and price are required" },
        { status: 400 }
      );
    }

    if (typeof price !== "number" || price <= 0) {
      return NextResponse.json({ error: "price must be a positive number" }, { status: 400 });
    }

    const entry = await prisma.priceBookEntry.create({
      data: {
        fromCity: from_city.trim(),
        toCity: to_city.trim(),
        vehicleType: vehicle_type.trim(),
        price,
        currency,
        tripType: trip_type,
        notes: notes || null,
        source,
      },
    });

    return NextResponse.json({ success: true, entry }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/pricing-book error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
