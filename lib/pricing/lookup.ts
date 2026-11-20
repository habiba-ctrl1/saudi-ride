// Pricing Book lookup (admin quotation workflow). Reads route_price_approvals (= the pricing
// rules) and past quotations. NEVER invents a price: when no rule/price exists the result says so.
import { prisma } from "@/lib/prisma";

// Canonical city names must match the route_family strings stored in route_price_approvals.
const PLACES: { city: string; re: RegExp }[] = [
  { city: "Riyadh", re: /riyadh|\bruh\b|king khalid|diriyah|malham|olaya|ad diriyah|riyad/i },
  { city: "Jeddah", re: /jeddah|jiddah|\bjed\b|king abdulaziz air/i },
  { city: "Makkah", re: /makkah|mecca|haram/i },
  { city: "Madinah", re: /madinah|medina|\bmed\b|prince mohammad/i },
  { city: "Dammam", re: /dammam|\bdmm\b|king fahd int/i },
  { city: "Dhahran", re: /dhahran|dharan/i },
  { city: "Khobar", re: /khobar|alkhobar|al khobar/i },
  { city: "Abha", re: /\babha\b/i },
  { city: "Jazan", re: /jazan|jizan/i },
  { city: "Tabuk", re: /tabuk/i },
  { city: "Yanbu", re: /yanbu/i },
  { city: "Al-Ula", re: /al-?ula|alula/i },
  { city: "Hail", re: /\bhail\b|ha'il/i },
  { city: "Al Qasim", re: /qasim|qassim|buraidah|buraydah/i },
  { city: "Doha/Qatar", re: /doha|qatar/i },
  { city: "Bahrain", re: /bahrain|manama/i },
  { city: "Dubai", re: /dubai|\buae\b|abu dhabi/i },
  { city: "Aqaba/Jordan", re: /aqaba|jordan|amman/i },
  { city: "NEOM/Oxagon", re: /neom|oxagon/i },
  { city: "Rijal Almaa", re: /rijal/i },
  { city: "Taif", re: /\btaif\b/i },
  { city: "Red Sea (RSI)", re: /red sea|\brsi\b|shura/i },
  { city: "AMAALA", re: /amaala|amala/i },
  { city: "Umluj", re: /umluj|ummlej/i },
  { city: "Hanak", re: /hanak/i },
];

export function detectCity(text: string | null | undefined): string | null {
  if (!text) return null;
  for (const p of PLACES) if (p.re.test(text)) return p.city;
  return null;
}

const VEHICLE_CATEGORY: Record<string, string> = { sedan: "Sedan", suv: "GMC/SUV", van: "Staria" };

export type RuleRow = {
  id: string;
  route_family: string;
  vehicle_category: string;
  trip_type: string;
  category: string | null;
  cross_border: boolean;
  lowest_observed: number | null;
  highest_observed: number | null;
  source_count: number;
  pricing_status: string;
  final_approved_price: number | null;
  range_low: number | null;
  range_high: number | null;
  price_min: number | null;
  est_cost: number | null;
  border_fee: number | null;
  approval_notes: string | null;
};

export type HistoryRow = {
  quote_reference: string;
  customer_name: string;
  trip_date: string;
  vehicle: string | null;
  quoted_price: number | null;
  paid: number | null;
  driver_cost: number | null;
  margin: number | null;
};

export type LookupResult = {
  state: "match" | "reverse_match" | "no_price" | "no_rule";
  message: string;
  from_city: string | null;
  to_city: string | null;
  route_family: string | null;
  rule: (RuleRow & {
    range_low_effective: number | null;
    range_high_effective: number | null;
    range_source: "owner" | "observed" | null;
    expected_margin: number | null;
    conflict: boolean;
  }) | null;
  alternatives: RuleRow[];
  history: HistoryRow[];
};

function effective(r: RuleRow) {
  const low = r.range_low ?? r.lowest_observed;
  const high = r.range_high ?? r.highest_observed;
  const src = r.range_low != null || r.range_high != null ? "owner" : low != null ? "observed" : null;
  const cost = r.est_cost != null ? r.est_cost + (r.border_fee ?? 0) : null;
  return {
    ...r,
    range_low_effective: low,
    range_high_effective: high,
    range_source: src as "owner" | "observed" | null,
    expected_margin: r.final_approved_price != null && cost != null ? r.final_approved_price - cost : null,
    conflict: r.pricing_status === "CONFLICTING",
  };
}

export async function lookupPricing(input: { pickup: string; drop: string; vehicle?: string | null; tripType?: string | null }): Promise<LookupResult> {
  const from = detectCity(input.pickup);
  const to = detectCity(input.drop);
  const empty = { alternatives: [], history: [], rule: null, route_family: null, from_city: from, to_city: to };
  if (!from || !to) {
    return { state: "no_rule", message: "No exact pricing rule found — could not recognise both cities. Enter a custom price.", ...empty };
  }

  const zi = /ziyarat|ziyara/i.test(`${input.pickup} ${input.drop}`);
  const family = zi ? `${from === to ? from : to} Ziyarat` : from === to ? `${from} (local / airport transfer)` : `${from} → ${to}`;
  const reverse = zi || from === to ? null : `${to} → ${from}`;
  const vehicleCat = input.vehicle ? VEHICLE_CATEGORY[input.vehicle] ?? null : null;
  const tripType = input.tripType === "round_trip" ? "Round-trip" : "One-way";

  const rules = await prisma.$queryRawUnsafe<RuleRow[]>(
    `SELECT id, route_family, vehicle_category, trip_type, category, cross_border, lowest_observed, highest_observed, source_count, pricing_status,
            final_approved_price, range_low, range_high, price_min, est_cost, border_fee, approval_notes
       FROM route_price_approvals WHERE route_family = ANY($1::text[])`,
    reverse ? [family, reverse] : [family],
  );

  const exactFamily = rules.filter((r) => r.route_family === family);
  const useRules = exactFamily.length ? exactFamily : rules;
  const isReverse = !exactFamily.length && rules.length > 0;
  const hit = useRules.find((r) => r.vehicle_category === vehicleCat && r.trip_type === tripType);
  const alternatives = useRules.filter((r) => r !== hit);

  const hist = await prisma.$queryRawUnsafe<(HistoryRow & { pickup_location: string; drop_location: string })[]>(
    `SELECT quote_reference, customer_name, trip_date::text, vehicle_type_requested::text vehicle, quoted_price::float, actual_amount_paid::float paid,
            driver_cost::float, pickup_location, drop_location,
            CASE WHEN driver_cost IS NOT NULL THEN (COALESCE(actual_amount_paid,0)-driver_cost-extra_cost)::float END margin
       FROM quotations WHERE status NOT IN ('cancelled') AND NOT is_test ORDER BY trip_date DESC`,
  );
  const history = hist
    .filter((h) => {
      const a = detectCity(h.pickup_location);
      const b = detectCity(h.drop_location);
      return (a === from && b === to) || (a === to && b === from);
    })
    .slice(0, 6)
    .map((h) => ({ quote_reference: h.quote_reference, customer_name: h.customer_name, trip_date: h.trip_date, vehicle: h.vehicle, quoted_price: h.quoted_price, paid: h.paid, driver_cost: h.driver_cost, margin: h.margin }));

  if (!rules.length) {
    return { state: "no_rule", message: `No exact pricing rule found for ${family}. Enter a custom price (nothing is auto-priced).`, from_city: from, to_city: to, route_family: family, rule: null, alternatives: [], history };
  }
  if (!hit) {
    return {
      state: "no_rule",
      message: `Route ${isReverse ? reverse : family} exists, but not for ${vehicleCat ?? "this vehicle"} / ${tripType}. See other rules below or enter a custom price.`,
      from_city: from, to_city: to, route_family: family, rule: null, alternatives, history,
    };
  }
  const rule = effective(hit);
  if (rule.range_low_effective == null && rule.final_approved_price == null) {
    return { state: "no_price", message: "Pricing rule exists but has no price yet — set one in the Pricing Book or enter a custom price.", from_city: from, to_city: to, route_family: hit.route_family, rule, alternatives, history };
  }
  return {
    state: isReverse ? "reverse_match" : "match",
    message: isReverse ? `Pricing match found (reverse direction ${hit.route_family}).` : "Pricing match found.",
    from_city: from, to_city: to, route_family: hit.route_family, rule, alternatives, history,
  };
}
