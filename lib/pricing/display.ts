// Display helpers — the ONLY way the site should render a "From SAR X".
// Uses baseOnly quotes so the number is stable (no drift by time of day) and
// identical in every locale (same engine call → same number, always).

import { quote } from "./quote";
import { VEHICLES, type VehicleSlug } from "./data/vehicles";
import { getRoute } from "./data/routes";

export interface FromPrice {
  total: number; // cheapest eligible vehicle, incl VAT
  vehicleSlug: VehicleSlug;
  currency: "SAR";
}

/** Cheapest eligible vehicle's total for a route. Null if route unknown. */
export function getFromPrice(routeSlug: string): FromPrice | null {
  if (!getRoute(routeSlug)) return null;
  let cheapest: FromPrice | null = null;
  for (const v of VEHICLES) {
    const q = quote({ routeSlug, vehicleSlug: v.slug, baseOnly: true });
    if (!cheapest || q.total < cheapest.total) {
      cheapest = { total: q.total, vehicleSlug: v.slug, currency: "SAR" };
    }
  }
  return cheapest;
}

/** "From SAR 249" for a known route, or "Request a quote" when unknown. */
export function formatFromPrice(routeSlug: string): string {
  const p = getFromPrice(routeSlug);
  return p ? `From SAR ${p.total.toLocaleString("en")}` : "Request a quote";
}

/** Just the number (e.g. for schema Offer priceSpecification). */
export function getFromPriceValue(routeSlug: string): number | null {
  return getFromPrice(routeSlug)?.total ?? null;
}
