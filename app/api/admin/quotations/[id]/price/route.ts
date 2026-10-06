import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { prisma } from "@/lib/prisma";
import { logEvent } from "@/lib/ops/events";

// PATCH /api/admin/quotations/[id]/price { quoted_price?, est_driver_cost?, valid_until? }
// Only before the ride is completed/cancelled. Never emails the client.
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { id } = await params;
  const b = (await request.json().catch(() => ({}))) as { quoted_price?: number | null; est_driver_cost?: number | null; valid_until?: string | null };
  for (const k of ["quoted_price", "est_driver_cost"] as const) {
    const v = b[k];
    if (v !== undefined && v !== null && (typeof v !== "number" || !Number.isFinite(v) || v < 0)) return NextResponse.json({ error: `${k} must be a non-negative number` }, { status: 400 });
  }
  const cur = await prisma.$queryRawUnsafe<{ status: string; quoted_price: number | null }[]>(`SELECT status::text, quoted_price::float FROM quotations WHERE id=$1::uuid`, id);
  if (!cur.length) return NextResponse.json({ error: "Quotation not found" }, { status: 404 });
  if (cur[0].status === "completed" || cur[0].status === "cancelled") return NextResponse.json({ error: "Price is locked once the ride is completed or cancelled" }, { status: 400 });

  const sets: string[] = [];
  const vals: unknown[] = [id];
  const add = (col: string, v: unknown, cast = "") => { vals.push(v); sets.push(`${col}=$${vals.length}${cast}`); };
  if (b.quoted_price !== undefined) add("quoted_price", b.quoted_price, "::numeric");
  if (b.est_driver_cost !== undefined) add("est_driver_cost", b.est_driver_cost, "::numeric");
  if (b.valid_until !== undefined) add("valid_until", b.valid_until || null, "::date");
  if (!sets.length) return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  // a price on a brand-new enquiry makes it "quoted" (same convention as the rest of the system)
  if (b.quoted_price != null) sets.push(`status = CASE WHEN status='new' THEN 'quoted'::quotation_status ELSE status END`);
  sets.push("updated_at=now()");
  await prisma.$executeRawUnsafe(`UPDATE quotations SET ${sets.join(", ")} WHERE id=$1::uuid`, ...vals);
  if (b.quoted_price !== undefined) await logEvent(id, "price_set", b.quoted_price == null ? "price cleared" : `SAR ${b.quoted_price}${cur[0].quoted_price != null && cur[0].quoted_price !== b.quoted_price ? ` (was ${cur[0].quoted_price})` : ""}`);
  return NextResponse.json({ success: true });
}
