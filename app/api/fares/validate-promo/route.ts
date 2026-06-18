import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit, FARES_LIMIT } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  const rl = rateLimit({ key: `promo:${ip}`, ...FARES_LIMIT });
  if (!rl.success) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  try {
    const body = await request.json();
    const { code, order_value, service_type } = body as {
      code?: string;
      order_value?: number;
      service_type?: string;
    };

    if (!code) {
      return NextResponse.json({ error: "Promo code is required" }, { status: 400 });
    }

    const promo = await prisma.promoCode.findUnique({
      where: { code: code.trim().toUpperCase() },
    });

    if (!promo || !promo.isActive) {
      return NextResponse.json({ valid: false, error: "Invalid promo code" });
    }

    const now = new Date();
    if (promo.validFrom && now < promo.validFrom) {
      return NextResponse.json({ valid: false, error: "Promo code is not yet active" });
    }
    if (promo.validUntil && now > promo.validUntil) {
      return NextResponse.json({ valid: false, error: "Promo code has expired" });
    }
    if (promo.maxUses !== null && promo.usedCount >= promo.maxUses) {
      return NextResponse.json({ valid: false, error: "Promo code usage limit reached" });
    }
    if (order_value !== undefined && order_value < promo.minOrderValue) {
      return NextResponse.json({
        valid: false,
        error: `Minimum order value is SAR ${promo.minOrderValue}`,
      });
    }
    if (
      service_type &&
      promo.applicableServices.length > 0 &&
      !promo.applicableServices.includes(service_type.toUpperCase())
    ) {
      return NextResponse.json({
        valid: false,
        error: "Promo code is not applicable to this service type",
      });
    }

    const discountAmount =
      promo.discountType === "PERCENTAGE"
        ? order_value !== undefined
          ? Math.round(order_value * (promo.discountValue / 100) * 100) / 100
          : null
        : promo.discountValue;

    return NextResponse.json({
      valid: true,
      code: promo.code,
      discount_type: promo.discountType,
      discount_value: promo.discountValue,
      discount_amount: discountAmount,
      min_order_value: promo.minOrderValue,
      valid_until: promo.validUntil?.toISOString() ?? null,
    });
  } catch (error) {
    console.error("POST /api/fares/validate-promo error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
