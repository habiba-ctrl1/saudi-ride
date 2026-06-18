import { NextResponse } from "next/server";
import { PRICING_CONFIG, matchFixedRoute } from "@/lib/pricing";
import { VehicleType } from "@prisma/client";
import { rateLimit, FARES_LIMIT } from "@/lib/rate-limit";

const FIXED_ROUTE_DETAILS: Record<string, { distance: number; duration: number }> = {
  "jeddah-airport-makkah":   { distance: 85,  duration: 75  },
  "makkah-madinah":          { distance: 450, duration: 270 },
  "madinah-jeddah-airport":  { distance: 410, duration: 250 },
  "riyadh-dammam":           { distance: 400, duration: 240 },
  "riyadh-jeddah":           { distance: 950, duration: 570 },
  "riyadh-dubai":            { distance: 1000,duration: 600 },
  "dammam-doha":             { distance: 380, duration: 230 },
  "jeddah-taif":             { distance: 140, duration: 105 },
};

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 1.2 * 10) / 10;
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  const rl = rateLimit({ key: `fares:${ip}`, ...FARES_LIMIT });
  if (!rl.success) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  try {
    const body = await request.json();
    const {
      pickup,
      dropoff,
      pickup_lat,
      pickup_lng,
      dropoff_lat,
      dropoff_lng,
      vehicle_class,
      service_type,
      is_round_trip = false,
      pickup_datetime,
      promo_code,
    } = body as {
      pickup?: string;
      dropoff?: string;
      pickup_lat?: number;
      pickup_lng?: number;
      dropoff_lat?: number;
      dropoff_lng?: number;
      vehicle_class?: string;
      service_type?: string;
      is_round_trip?: boolean;
      pickup_datetime?: string;
      promo_code?: string;
    };

    if (!vehicle_class) {
      return NextResponse.json({ error: "vehicle_class is required" }, { status: 400 });
    }

    // Map spec vehicle_class values (sedan/suv/cabin/elite/coaster) to DB enum
    const classMap: Record<string, VehicleType> = {
      sedan: "SEDAN",
      suv: "SUV",
      cabin: "VAN",
      van: "VAN",
      elite: "LUXURY",
      luxury: "LUXURY",
      coaster: "BUS",
      bus: "BUS",
    };
    const vType: VehicleType = classMap[vehicle_class.toLowerCase()] ?? "SEDAN";

    // Resolve distance & base price
    let fixedRouteKey: string | null = null;

    if (
      pickup_lat !== undefined &&
      pickup_lng !== undefined &&
      dropoff_lat !== undefined &&
      dropoff_lng !== undefined
    ) {
      // Try coordinate-based route match (within 15 km tolerance)
      const FIXED_COORDS: Record<string, { p: [number, number]; d: [number, number] }> = {
        "jeddah-airport-makkah":  { p: [21.6796, 39.1565], d: [21.3891, 39.8579] },
        "makkah-madinah":         { p: [21.3891, 39.8579], d: [24.4672, 39.6112] },
        "madinah-jeddah-airport": { p: [24.4672, 39.6112], d: [21.6796, 39.1565] },
        "riyadh-dammam":          { p: [24.7136, 46.6753], d: [26.4207, 50.0888] },
        "riyadh-jeddah":          { p: [24.7136, 46.6753], d: [21.6796, 39.1565] },
        "riyadh-dubai":           { p: [24.7136, 46.6753], d: [25.2048, 55.2708] },
        "dammam-doha":            { p: [26.4207, 50.0888], d: [25.2854, 51.5310] },
        "jeddah-taif":            { p: [21.5433, 39.1728], d: [21.2854, 40.4258] },
      };

      for (const [key, coords] of Object.entries(FIXED_COORDS)) {
        const dp = haversineKm(pickup_lat, pickup_lng, coords.p[0], coords.p[1]);
        const dd = haversineKm(dropoff_lat, dropoff_lng, coords.d[0], coords.d[1]);
        if (dp <= 15 && dd <= 15) {
          fixedRouteKey = key;
          break;
        }
      }
    }

    if (!fixedRouteKey && pickup && dropoff) {
      fixedRouteKey = matchFixedRoute(pickup, dropoff);
    }

    let distanceKm: number;
    let durationMinutes: number;
    let baseFare: number;

    const rates = PRICING_CONFIG.perKm as Record<string, number>;
    const minFares = PRICING_CONFIG.minimumFare as Record<string, number>;

    if (fixedRouteKey && fixedRouteKey in PRICING_CONFIG.fixedRoutes) {
      const key = fixedRouteKey as keyof typeof PRICING_CONFIG.fixedRoutes;
      baseFare = PRICING_CONFIG.fixedRoutes[key][vType];
      distanceKm = FIXED_ROUTE_DETAILS[key]?.distance ?? 85;
      durationMinutes = FIXED_ROUTE_DETAILS[key]?.duration ?? 75;
    } else {
      if (
        pickup_lat !== undefined &&
        pickup_lng !== undefined &&
        dropoff_lat !== undefined &&
        dropoff_lng !== undefined
      ) {
        distanceKm = haversineKm(pickup_lat, pickup_lng, dropoff_lat, dropoff_lng);
      } else {
        distanceKm = 35;
      }
      durationMinutes = Math.round(distanceKm * 0.9);
      const rawFare = PRICING_CONFIG.baseFare + distanceKm * (rates[vType] ?? 3.5);
      baseFare = Math.max(minFares[vType] ?? 80, Math.round(rawFare));
    }

    // Surcharges
    const bookingDate = pickup_datetime ? new Date(pickup_datetime) : new Date();
    const hour = bookingDate.getHours();
    const isNight = hour >= 23 || hour < 5;
    const nightSurcharge = isNight ? Math.round(baseFare * PRICING_CONFIG.nightSurcharge) : 0;
    const month = bookingDate.getMonth();
    const day = bookingDate.getDate();
    const isRamadan = (month === 1 && day >= 18) || (month === 2 && day <= 19);
    const ramadanSurcharge = isRamadan ? Math.round(baseFare * PRICING_CONFIG.ramadanSurcharge) : 0;

    let subtotal = baseFare + nightSurcharge + ramadanSurcharge;
    if (is_round_trip) subtotal = subtotal * 2;

    const roundTripDiscount = is_round_trip
      ? Math.round(subtotal * PRICING_CONFIG.roundTripDiscount)
      : 0;
    subtotal -= roundTripDiscount;

    // Promo discount
    let promoDiscount = 0;
    let promoError: string | null = null;
    if (promo_code) {
      const { prisma } = await import("@/lib/prisma");
      const promo = await prisma.promoCode.findUnique({ where: { code: promo_code.toUpperCase() } });

      if (!promo || !promo.isActive) {
        promoError = "Invalid or expired promo code";
      } else {
        const now = new Date();
        const expired = (promo.validUntil && now > promo.validUntil) || (promo.validFrom && now < promo.validFrom);
        const exhausted = promo.maxUses !== null && promo.usedCount >= promo.maxUses;
        if (expired || exhausted) {
          promoError = "Promo code is no longer valid";
        } else if (subtotal < promo.minOrderValue) {
          promoError = `Minimum order value is SAR ${promo.minOrderValue}`;
        } else {
          promoDiscount =
            promo.discountType === "PERCENTAGE"
              ? Math.round(subtotal * (promo.discountValue / 100))
              : Math.min(promo.discountValue, subtotal);
        }
      }
    }

    const discountTotal = roundTripDiscount + promoDiscount;
    const afterDiscount = subtotal - promoDiscount;
    const vat15 = Math.round(afterDiscount * 0.15 * 100) / 100;
    const totalFare = Math.round((afterDiscount + vat15) * 100) / 100;

    const roundTripFare = is_round_trip
      ? null
      : Math.round((totalFare * 2 * (1 - PRICING_CONFIG.roundTripDiscount)) * 100) / 100;

    const validUntil = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    return NextResponse.json({
      distance_km: distanceKm,
      duration_minutes: durationMinutes,
      base_fare: baseFare,
      vat_15_pct: vat15,
      discount: discountTotal,
      total_fare: totalFare,
      currency: "SAR",
      round_trip_fare: roundTripFare,
      breakdown: {
        base: baseFare,
        night_surcharge: nightSurcharge,
        ramadan_surcharge: ramadanSurcharge,
        round_trip_discount: roundTripDiscount,
        promo_discount: promoDiscount,
        vat: vat15,
      },
      valid_until: validUntil,
      ...(promoError ? { promo_error: promoError } : {}),
    });
  } catch (error) {
    console.error("POST /api/fares/calculate error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
