// ── VEHICLE CLASSES ─────────────────────────────────────────────────────────
// Each class has its OWN perKmRate + minimumFare (NOT a multiplier on the sedan —
// fuel and driver-hours scale differently across classes). Ordering by price is
// sedan < van < suv < luxury; the bus has its own rate + minimum, never a scale.
//
// ⚠ PROVISIONAL numbers — tune against the margin table in the reconciliation doc.
// consumptionPer100km feeds the cost floor (see costFloor.ts).

export type VehicleSlug = "sedan" | "suv" | "van" | "luxury" | "bus";

export interface VehicleClass {
  slug: VehicleSlug;
  displayName: string;
  seats: number;
  luggage: number;
  perKmRate: number; // SAR/km charged to the customer
  minimumFare: number; // SAR floor (pre-VAT)
  consumptionPer100km: number; // litres — for cost floor only
  provisional: boolean;
}

export const VEHICLES: readonly VehicleClass[] = [
  { slug: "sedan",  displayName: "Sedan (Toyota Camry class)",   seats: 3,  luggage: 2,  perKmRate: 3.0, minimumFare: 90,  consumptionPer100km: 9,  provisional: true },
  { slug: "van",    displayName: "Van (Hyundai Staria class)",   seats: 7,  luggage: 7,  perKmRate: 4.0, minimumFare: 130, consumptionPer100km: 12, provisional: true },
  { slug: "suv",    displayName: "SUV (GMC Yukon class)",        seats: 6,  luggage: 5,  perKmRate: 4.6, minimumFare: 150, consumptionPer100km: 15, provisional: true },
  { slug: "luxury", displayName: "Luxury (Mercedes S-Class)",    seats: 3,  luggage: 3,  perKmRate: 8.0, minimumFare: 250, consumptionPer100km: 13, provisional: true },
  { slug: "bus",    displayName: "Bus / Coaster",                seats: 18, luggage: 15, perKmRate: 6.5, minimumFare: 350, consumptionPer100km: 22, provisional: true },
] as const;

export function getVehicle(slug: VehicleSlug): VehicleClass {
  const v = VEHICLES.find((x) => x.slug === slug);
  if (!v) throw new Error(`Unknown vehicle class: ${slug}`);
  return v;
}

// Maps the legacy UPPERCASE keys used by the old calculator/API to the new slugs.
export const LEGACY_VEHICLE_MAP: Record<string, VehicleSlug> = {
  SEDAN: "sedan",
  SUV: "suv",
  VAN: "van",
  LUXURY: "luxury",
  BUS: "bus",
};
