import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { num, requireVendorOrAdmin, routeKeyOf } from "@/lib/vendor/ledger";

// Vendor: may change vendor_cost (and note) only. Admin: may also correct client/route/quote fields.
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const a = await requireVendorOrAdmin();
  if (!a.ok) return NextResponse.json({ error: a.error }, { status: a.status });
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return NextResponse.json({ error: "Bad id" }, { status: 400 });
  const b = await req.json().catch(() => ({}));
  const sets: string[] = []; const vals: unknown[] = [id];
  const add = (col: string, v: unknown, cast = "") => { vals.push(v); sets.push(`${col} = $${vals.length}${cast}`); };

  if ("vendor_cost" in b) {
    const c = num(b.vendor_cost);
    if (Number.isNaN(c) || (c !== null && c < 0)) return NextResponse.json({ error: "Cost must be a number" }, { status: 400 });
    add("vendor_cost", c, "::numeric"); // null clears it back to the route rate
  }
  if ("note" in b) add("note", String(b.note ?? "").trim() || null);
  if (a.role === "ADMIN") {
    if ("route" in b) { const r = String(b.route ?? "").trim(); if (!r) return NextResponse.json({ error: "Route required" }, { status: 400 }); add("route", r); add("route_key", routeKeyOf(r)); }
    if ("client_phone" in b) add("client_phone", String(b.client_phone ?? "").trim() || null);
    if ("date_label" in b) add("date_label", String(b.date_label ?? "").trim() || null);
    if ("vat" in b) add("vat", !!b.vat);
    if ("quoted_amount" in b) { const q = num(b.quoted_amount); if (q === null || Number.isNaN(q) || q < 0) return NextResponse.json({ error: "Bad quoted amount" }, { status: 400 }); add("quoted_amount", q, "::numeric"); }
  }
  if (!sets.length) return NextResponse.json({ error: "Nothing to update (vendors can only change cost)" }, { status: 400 });
  await prisma.$executeRawUnsafe(`UPDATE vendor_rides SET ${sets.join(", ")}, updated_at = now() WHERE id = $1::uuid`, ...vals);
  return NextResponse.json({ ok: true });
}
