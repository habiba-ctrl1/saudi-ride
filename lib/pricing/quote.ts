// ── quote(): the ONE pure function that computes a fare ─────────────────────
// Identical output server-side and client-side (no I/O, no globals). VAT is an
// explicit line item, never baked silently into a number.

import { VAT_RATE } from "./data/costModel";
import { getVehicle, LEGACY_VEHICLE_MAP, type VehicleSlug } from "./data/vehicles";
import { getRoute } from "./data/routes";
import { AUTO_RULES, OPTION_RULES, isRuleActive, type FareRule } from "./data/rules";

export interface QuoteOptions {
  roundTrip?: boolean;
  childSeat?: boolean;
  meetGreet?: boolean;
  extraStops?: number;
  waitingHours?: number;
  borderCrossing?: boolean;
}

export interface QuoteInput {
  routeSlug?: string;
  vehicleSlug: VehicleSlug | string;
  datetime?: string | Date;
  options?: QuoteOptions;
  /** For ad-hoc trips not in the route table (e.g. the free-text calculator). */
  distanceKmOverride?: number;
  durationMinutesOverride?: number;
  /** Skip time/season surcharges & options — used for the stable "From" price. */
  baseOnly?: boolean;
}

export interface QuoteLine {
  label: string;
  amount: number;
}

export interface Quote {
  currency: "SAR";
  vehicleSlug: VehicleSlug;
  distanceKm: number;
  base: number; // minimum-fare floor for the class
  distanceComponent: number; // distance × perKmRate (× 2 if round trip)
  surcharges: QuoteLine[];
  subtotal: number; // pre-VAT
  vat: number;
  total: number; // incl VAT
  breakdown: QuoteLine[];
  validUntilISO: string;
}

function resolveVehicle(slug: VehicleSlug | string): VehicleSlug {
  return (LEGACY_VEHICLE_MAP[slug as string] ?? slug) as VehicleSlug;
}

export function quote(input: QuoteInput): Quote {
  const vehicleSlug = resolveVehicle(input.vehicleSlug);
  const v = getVehicle(vehicleSlug);
  const route = input.routeSlug ? getRoute(input.routeSlug) : undefined;

  const distanceKm = input.distanceKmOverride ?? route?.distanceKm ?? 0;
  const when = input.datetime ? new Date(input.datetime) : new Date();
  const roundTrip = !input.baseOnly && !!input.options?.roundTrip;

  const chargedDistance = distanceKm * (roundTrip ? 2 : 1);
  const distanceComponent = Math.round(chargedDistance * v.perKmRate);
  const base = v.minimumFare;

  // Starting point = the greater of the distance charge and the class minimum.
  let running = Math.max(base, distanceComponent);
  const surcharges: QuoteLine[] = [];

  if (!input.baseOnly) {
    // Auto (time/season) rules, then option rules — in priority order.
    const optionRules: FareRule[] = [];
    const o = input.options ?? {};
    if (roundTrip) optionRules.push({ ...OPTION_RULES.roundTrip, validFrom: null, validTo: null });
    if (o.childSeat) optionRules.push({ ...OPTION_RULES.childSeat, validFrom: null, validTo: null });
    if (o.meetGreet) optionRules.push({ ...OPTION_RULES.meetGreet, validFrom: null, validTo: null });
    if (o.borderCrossing) optionRules.push({ ...OPTION_RULES.borderCrossing, validFrom: null, validTo: null });
    if (o.extraStops && o.extraStops > 0)
      optionRules.push({ ...OPTION_RULES.extraStop, value: OPTION_RULES.extraStop.value * o.extraStops, validFrom: null, validTo: null });
    if (o.waitingHours && o.waitingHours > 0)
      optionRules.push({ ...OPTION_RULES.waitingHour, value: OPTION_RULES.waitingHour.value * o.waitingHours, validFrom: null, validTo: null });

    const applicable = [...AUTO_RULES.filter((r) => isRuleActive(r, when)), ...optionRules].sort(
      (a, b) => a.priority - b.priority,
    );

    for (const rule of applicable) {
      const amount = rule.kind === "percent" ? Math.round(running * rule.value) : rule.value;
      if (amount === 0) continue;
      running += amount;
      surcharges.push({ label: rule.label, amount });
    }
  }

  const subtotal = Math.max(0, running);
  const vat = Math.round(subtotal * VAT_RATE);
  const total = subtotal + vat;

  const breakdown: QuoteLine[] = [
    { label: `${v.displayName} — base`, amount: Math.max(base, distanceComponent) },
    ...surcharges,
    { label: `VAT (${Math.round(VAT_RATE * 100)}%)`, amount: vat },
  ];

  return {
    currency: "SAR",
    vehicleSlug,
    distanceKm,
    base,
    distanceComponent,
    surcharges,
    subtotal,
    vat,
    total,
    breakdown,
    validUntilISO: new Date(when.getTime() + 24 * 60 * 60 * 1000).toISOString(),
  };
}
