import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/admin/promo-codes — list all promo codes
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const active = searchParams.get("active");
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "25")));
    const skip = (page - 1) * limit;

    const where = {
      ...(active !== null ? { isActive: active === "true" } : {}),
    };

    const [total, promoCodes] = await Promise.all([
      prisma.promoCode.count({ where }),
      prisma.promoCode.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
    ]);

    return NextResponse.json({ success: true, total, page, limit, total_pages: Math.ceil(total / limit), promo_codes: promoCodes });
  } catch (error) {
    console.error("GET /api/admin/promo-codes error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/admin/promo-codes — create a new promo code
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      code,
      discount_type,
      discount_value,
      min_order_value = 0,
      max_uses,
      per_user_limit = 1,
      valid_from,
      valid_until,
      applicable_services = [],
    } = body as {
      code?: string;
      discount_type?: string;
      discount_value?: number;
      min_order_value?: number;
      max_uses?: number;
      per_user_limit?: number;
      valid_from?: string;
      valid_until?: string;
      applicable_services?: string[];
    };

    if (!code || !discount_type || discount_value === undefined) {
      return NextResponse.json(
        { error: "code, discount_type, and discount_value are required" },
        { status: 400 }
      );
    }

    if (!["PERCENTAGE", "FIXED"].includes(discount_type.toUpperCase())) {
      return NextResponse.json({ error: "discount_type must be PERCENTAGE or FIXED" }, { status: 400 });
    }

    if (discount_type.toUpperCase() === "PERCENTAGE" && (discount_value <= 0 || discount_value > 100)) {
      return NextResponse.json({ error: "Percentage discount must be between 1 and 100" }, { status: 400 });
    }

    const existing = await prisma.promoCode.findUnique({ where: { code: code.toUpperCase() } });
    if (existing) {
      return NextResponse.json({ error: "Promo code already exists" }, { status: 409 });
    }

    const promo = await prisma.promoCode.create({
      data: {
        code: code.toUpperCase().trim(),
        discountType: discount_type.toUpperCase() as "PERCENTAGE" | "FIXED",
        discountValue: discount_value,
        minOrderValue: min_order_value,
        maxUses: max_uses ?? null,
        perUserLimit: per_user_limit,
        validFrom: valid_from ? new Date(valid_from) : null,
        validUntil: valid_until ? new Date(valid_until) : null,
        applicableServices: applicable_services.map((s) => s.toUpperCase()),
      },
    });

    return NextResponse.json({ success: true, promo_code: promo }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/promo-codes error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
