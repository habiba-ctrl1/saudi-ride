// ── COST MODEL ────────────────────────────────────────────────────────────────
// Inputs used to estimate what a trip actually COSTS us (fuel + driver + wear +
// overhead). Edit these numbers in ONE place; every cost floor recomputes.
//
// ⚠ All values are PROVISIONAL placeholders — replace with your real figures.
// The build FAILS (verify-pricing) if any configured fare drops below the floor
// these produce, so we never quietly sell a trip at a loss.

export const COST_MODEL = {
  PROVISIONAL: true,
  lastReviewed: "2026-08-05",

  fuelPricePerLitre: 2.33, // SAR — Saudi 91 petrol (provisional)
  driverHourlyCost: 35, // SAR/hr — driver pay + time (provisional)
  maintenancePerKm: 0.25, // SAR/km — tyres, service, wear (provisional)
  insuranceAndOverheadPerDay: 120, // SAR/day — insurance, licence, admin (provisional)
  workingHoursPerDay: 10, // hrs a vehicle is productive per day (for overhead share)
} as const;

export const VAT_RATE = 0.15; // ZATCA standard rate — an explicit line item, never baked in.
