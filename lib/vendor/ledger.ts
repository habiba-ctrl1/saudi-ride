// Vendor ledger: rides fulfilled by the vendor, per-route cost rates, and payments the vendor has made.
// Profit per ride = quoted amount - effective cost. VAT is charged on top of the quote and never part of profit.
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type VendorRole = "ADMIN" | "VENDOR";
export type VendorAuth = { ok: true; role: VendorRole; email: string } | { ok: false; status: 401 | 403; error: string };

export async function requireVendorOrAdmin(): Promise<VendorAuth> {
  const session = await getServerSession(authOptions);
  const user = session?.user as { role?: string; email?: string } | undefined;
  if (!user) return { ok: false, status: 401, error: "Unauthorized" };
  if (user.role !== "ADMIN" && user.role !== "VENDOR") return { ok: false, status: 403, error: "Forbidden" };
  return { ok: true, role: user.role, email: user.email ?? user.role.toLowerCase() };
}

const CITY_ALIASES: Record<string, string> = { qatar: "doha", abudhabi: "abudhabi", "abu dhabi": "abudhabi", "al ahsa": "alahsa", riyad: "riyadh", kafd: "riyadh", damman: "dammam" };

function cityKey(raw: string): string {
  const c = raw.toLowerCase().replace(/\(.*?\)/g, "").replace(/[^a-z ]/g, "").trim();
  return CITY_ALIASES[c] ?? c.replace(/\s+/g, "");
}

/** 'Riyadh → Doha' and 'Doha → Riyadh' both give 'doha-riyadh'. Null when the route does not have exactly two ends. */
export function routeKeyOf(route: string): string | null {
  const parts = route.split(/→|->| to /i).map(cityKey).filter(Boolean);
  return parts.length === 2 ? [...parts].sort().join("-") : null;
}

export type RideRow = {
  id: string; ride_no: number; date_label: string | null; route: string; route_key: string | null; client_phone: string | null;
  quoted_amount: number; vat: boolean; vendor_cost: number | null; note: string | null;
  rate_cost: number | null; cost: number | null; cost_source: "ride" | "rate" | "missing"; profit: number | null;
};
export type RateRow = { route_key: string; label: string; cost: number };
export type PaymentRow = { id: string; amount: number; paid_at: string | null; note: string | null; recorded_by: string | null; created_at: string };

export async function loadLedger() {
  const rides = await prisma.$queryRawUnsafe<RideRow[]>(
    `SELECT r.id::text, r.ride_no, r.date_label, r.route, r.route_key, r.client_phone, r.quoted_amount::float, r.vat, r.vendor_cost::float, r.note,
            v.cost::float rate_cost,
            COALESCE(r.vendor_cost, v.cost)::float cost,
            CASE WHEN r.vendor_cost IS NOT NULL THEN 'ride' WHEN v.cost IS NOT NULL THEN 'rate' ELSE 'missing' END cost_source,
            (r.quoted_amount - COALESCE(r.vendor_cost, v.cost))::float profit
       FROM vendor_rides r LEFT JOIN vendor_rates v ON v.route_key = r.route_key ORDER BY r.ride_no`);
  const rates = await prisma.$queryRawUnsafe<RateRow[]>(`SELECT route_key, label, cost::float FROM vendor_rates ORDER BY label`);
  const payments = await prisma.$queryRawUnsafe<PaymentRow[]>(
    `SELECT id::text, amount::float, paid_at::text, note, recorded_by, created_at::text FROM vendor_payments WHERE voided_at IS NULL ORDER BY COALESCE(paid_at, created_at::date), created_at`);
  const totalProfit = rides.reduce((s, r) => s + (r.profit ?? 0), 0);
  const received = payments.reduce((s, p) => s + p.amount, 0);
  return { rides, rates, payments, totals: { totalProfit, received, balance: totalProfit - received, missingCost: rides.filter((r) => r.cost_source === "missing").length } };
}

export function num(v: unknown): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : NaN;
}
