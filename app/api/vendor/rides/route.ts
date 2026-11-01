import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { num, requireVendorOrAdmin, routeKeyOf } from "@/lib/vendor/ledger";

// Adding a ride (client number, route, quote) is admin-only; the vendor can only set costs and payments.
export async function POST(req: Request) {
  const a = await requireVendorOrAdmin();
  if (!a.ok) return NextResponse.json({ error: a.error }, { status: a.status });
  if (a.role !== "ADMIN") return NextResponse.json({ error: "Only the owner can add rides" }, { status: 403 });
  const b = await req.json().catch(() => ({}));
  const route = String(b.route ?? "").trim();
  const quoted = num(b.quoted_amount);
  if (!route || quoted === null || Number.isNaN(quoted) || quoted < 0) return NextResponse.json({ error: "Route and a valid quoted amount are required" }, { status: 400 });
  const next = (await prisma.$queryRawUnsafe<{ n: number }[]>(`SELECT COALESCE(MAX(ride_no),0)+1 n FROM vendor_rides`))[0].n;
  await prisma.$executeRawUnsafe(
    `INSERT INTO vendor_rides (ride_no, date_label, route, route_key, client_phone, quoted_amount, vat) VALUES ($1,$2,$3,$4,$5,$6::numeric,$7)`,
    next, String(b.date_label ?? "").trim() || null, route, routeKeyOf(route), String(b.client_phone ?? "").trim() || null, quoted, !!b.vat);
  return NextResponse.json({ ok: true, ride_no: next });
}
