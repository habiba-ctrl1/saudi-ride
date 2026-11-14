import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { num, requireVendorOrAdmin, routeKeyOf } from "@/lib/vendor/ledger";

// Create or change a route's cost. Applies to every ride that has no cost of its own; rides with their own cost are untouched.
export async function PUT(req: Request) {
  const a = await requireVendorOrAdmin();
  if (!a.ok) return NextResponse.json({ error: a.error }, { status: a.status });
  const b = await req.json().catch(() => ({}));
  const cost = num(b.cost);
  if (cost === null || Number.isNaN(cost) || cost < 0) return NextResponse.json({ error: "Cost must be a number" }, { status: 400 });
  let key = String(b.route_key ?? "").trim();
  let label = String(b.label ?? "").trim();
  if (!key) {
    const k = routeKeyOf(label);
    if (!k) return NextResponse.json({ error: "Write the route like 'Riyadh ↔ Doha'" }, { status: 400 });
    key = k; label = label.replace(/->|→/g, "↔");
  }
  await prisma.$executeRawUnsafe(
    `INSERT INTO vendor_rates (route_key, label, cost) VALUES ($1,$2,$3::numeric)
     ON CONFLICT (route_key) DO UPDATE SET cost = EXCLUDED.cost, updated_at = now()`, key, label || key, cost);
  return NextResponse.json({ ok: true });
}
