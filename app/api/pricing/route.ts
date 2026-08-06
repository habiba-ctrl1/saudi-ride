import { NextResponse } from "next/server";
import { quote } from "@/lib/pricing";
import { LEGACY_VEHICLE_MAP } from "@/lib/pricing";

// Distance resolution stays here (Google Distance Matrix + graceful fallback);
// the FARE itself now comes exclusively from the pricing engine (lib/pricing),
// so the calculator, route cards, schema and emails can never drift.

const LEGACY_KEYS = Object.keys(LEGACY_VEHICLE_MAP);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { pickup, dropoff, vehicleType, dateTime, isRoundTrip } = body as {
      pickup: string;
      dropoff: string;
      vehicleType: string;
      dateTime: string;
      isRoundTrip: boolean;
    };

    if (!pickup || !dropoff || !vehicleType || !dateTime) {
      return NextResponse.json(
        { error: "Missing required fields (pickup, dropoff, vehicleType, dateTime)" },
        { status: 400 },
      );
    }
    if (!LEGACY_KEYS.includes(vehicleType) && !LEGACY_VEHICLE_MAP[vehicleType]) {
      return NextResponse.json(
        { error: `Invalid vehicleType. Must be one of: ${LEGACY_KEYS.join(", ")}` },
        { status: 400 },
      );
    }

    // ── Resolve distance/duration ──────────────────────────────────────────
    let distance = 0;
    let duration = 0;
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
    let apiSuccess = false;

    if (apiKey && apiKey.trim() !== "") {
      try {
        const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(
          pickup,
        )}&destinations=${encodeURIComponent(dropoff)}&key=${apiKey}`;
        const response = await fetch(url);
        const data = (await response.json()) as {
          status: string;
          rows?: Array<{ elements?: Array<{ status: string; distance?: { value: number }; duration?: { value: number } }> }>;
        };
        const el = data.status === "OK" ? data.rows?.[0]?.elements?.[0] : undefined;
        if (el && el.status === "OK") {
          distance = Math.round(((el.distance?.value ?? 0) / 1000) * 10) / 10;
          duration = Math.round((el.duration?.value ?? 0) / 60);
          apiSuccess = true;
        }
      } catch (err) {
        console.error("Google Distance Matrix failed, using fallback:", err);
      }
    }
    if (!apiSuccess) {
      const charSum = pickup.length + dropoff.length;
      distance = Math.max(30, Math.min(650, charSum * 4.5));
      duration = Math.round(distance * 0.9);
    }

    // ── Fare from the engine (single source of truth) ──────────────────────
    const q = quote({
      vehicleSlug: vehicleType,
      distanceKmOverride: distance,
      durationMinutesOverride: duration,
      datetime: dateTime,
      options: { roundTrip: !!isRoundTrip },
    });

    const find = (needle: string) =>
      q.surcharges.filter((s) => s.label.toLowerCase().includes(needle)).reduce((a, s) => a + s.amount, 0);
    const nightSurcharge = find("night");
    const seasonSurcharge = find("ramadan") + find("hajj") + find("season") + find("weekend");
    const discount = Math.abs(q.surcharges.filter((s) => s.amount < 0).reduce((a, s) => a + s.amount, 0));

    return NextResponse.json({
      price: q.total,
      distance,
      duration,
      isFixed: false,
      currency: q.currency,
      breakdown: {
        baseFare: Math.max(q.base, q.distanceComponent),
        nightSurcharge,
        ramadanSurcharge: seasonSurcharge,
        isNight: nightSurcharge > 0,
        isRamadan: seasonSurcharge > 0,
        subtotal: q.subtotal,
        vat: q.vat,
        discount,
        isRoundTrip: !!isRoundTrip,
      },
    });
  } catch (error) {
    console.error("Pricing calculator API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
