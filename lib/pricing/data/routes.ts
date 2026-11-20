// ── ROUTE PRICING DATA ──────────────────────────────────────────────────────
// Distances/durations are geographic facts and stay in lib/data/routes.ts (one
// source, reused here). This file adds the PRICING-relevant fields: originType
// and deadheadFactor (the empty-return multiplier used for the COST floor — a
// visible, editable field, not a magic number).
//
// ⚠ deadheadFactor values are PROVISIONAL.

import { ROUTES_DATA } from "@/lib/data/routes";

export type OriginType = "city" | "airport" | "landmark";

export interface PricingRoute {
  slug: string;
  originLabel: string;
  destinationLabel: string;
  originType: OriginType;
  distanceKm: number;
  durationMinutes: number;
  deadheadFactor: number; // 1 = no empty return; 2 = driver returns fully empty
  provisional: boolean;
}

// Busy two-way corridors where the driver often gets a return fare, so the empty
// leg is partial. Everything else defaults by distance below. PROVISIONAL.
const DEADHEAD_OVERRIDES: Record<string, number> = {
  "jeddah-airport-to-makkah": 1.5,
  "jeddah-to-makkah": 1.5,
  "makkah-to-jeddah-airport": 1.5,
  "makkah-to-madinah": 1.6,
  "madinah-to-makkah": 1.6,
  "madinah-airport-to-city": 1.4,
  "riyadh-airport-to-city": 1.4,
};

function inferOriginType(slug: string, fromCity: string): OriginType {
  const s = `${slug} ${fromCity}`.toLowerCase();
  if (s.includes("airport")) return "airport";
  if (s.includes("haram") || s.includes("nabawi") || s.includes("clock") || s.includes("station")) return "landmark";
  return "city";
}

function defaultDeadhead(distanceKm: number): number {
  if (distanceKm <= 40) return 1.3; // short city hops — often round-ish
  if (distanceKm <= 200) return 1.7;
  return 1.9; // long intercity — return usually empty
}

export const PRICING_ROUTES: readonly PricingRoute[] = ROUTES_DATA.map((r) => ({
  slug: r.slug,
  originLabel: r.fromCity,
  destinationLabel: r.toCity,
  originType: inferOriginType(r.slug, r.fromCity),
  distanceKm: r.distance,
  durationMinutes: r.duration,
  deadheadFactor: DEADHEAD_OVERRIDES[r.slug] ?? defaultDeadhead(r.distance),
  provisional: true,
}));

const BY_SLUG = new Map(PRICING_ROUTES.map((r) => [r.slug, r]));

export function getRoute(slug: string): PricingRoute | undefined {
  return BY_SLUG.get(slug);
}
