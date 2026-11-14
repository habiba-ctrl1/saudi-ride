// ── FARE RULES ──────────────────────────────────────────────────────────────
// Surcharges, discounts and add-ons. Each has validFrom/validTo (ISO or null =
// always) and a priority (lower applies first). Percentages act on the running
// subtotal; flat amounts are added once. ⚠ PROVISIONAL.

export type RuleKind = "percent" | "flat";

export interface FareRule {
  id: string;
  label: string;
  kind: RuleKind;
  value: number; // percent as 0.15 = +15%, or flat SAR
  priority: number;
  validFrom: string | null;
  validTo: string | null;
  provisional: boolean;
}

// Time/season rules applied automatically from the trip datetime.
export const AUTO_RULES: readonly FareRule[] = [
  { id: "night", label: "Night surcharge (23:00–05:00)", kind: "percent", value: 0.15, priority: 10, validFrom: null, validTo: null, provisional: true },
  { id: "weekend", label: "Weekend (Thu/Fri)", kind: "percent", value: 0.05, priority: 20, validFrom: null, validTo: null, provisional: true },
  { id: "ramadan", label: "Ramadan season", kind: "percent", value: 0.2, priority: 30, validFrom: "2026-02-18", validTo: "2026-03-19", provisional: true },
  { id: "hajj", label: "Hajj season", kind: "percent", value: 0.25, priority: 30, validFrom: "2026-05-24", validTo: "2026-06-02", provisional: true },
] as const;

// Optional add-ons / discounts, applied only when passed in quote options.
export const OPTION_RULES = {
  roundTrip: { id: "round_trip", label: "Round-trip discount", kind: "percent", value: -0.1, priority: 40, provisional: true },
  childSeat: { id: "child_seat", label: "Child seat", kind: "flat", value: 30, priority: 50, provisional: true },
  meetGreet: { id: "meet_greet", label: "Airport meet & greet", kind: "flat", value: 20, priority: 50, provisional: true },
  extraStop: { id: "extra_stop", label: "Extra stop (each)", kind: "flat", value: 40, priority: 50, provisional: true },
  waitingHour: { id: "waiting", label: "Waiting time (per hour)", kind: "flat", value: 35, priority: 50, provisional: true },
  borderCrossing: { id: "border", label: "GCC border crossing", kind: "flat", value: 150, priority: 50, provisional: true },
} as const;

export function isRuleActive(rule: FareRule, at: Date): boolean {
  if (rule.validFrom && at < new Date(rule.validFrom)) return false;
  if (rule.validTo && at > new Date(`${rule.validTo}T23:59:59`)) return false;
  return true;
}
