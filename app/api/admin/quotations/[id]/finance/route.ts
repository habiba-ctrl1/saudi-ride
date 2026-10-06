import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { prisma } from "@/lib/prisma";
import { logEvent } from "@/lib/ops/events";

type Body = {
  partner_id?: string | null;
  partner_share_pct?: number | null;
  driver_name?: string | null;
  driver_phone?: string | null;
  vehicle_plate?: string | null;
  vehicle_detail?: string | null;
  actual_amount_paid?: number | null;
  payment_method_used?: string | null;
  payment_status?: "unpaid" | "partial" | "paid";
  driver_cost?: number | null;
  extra_cost?: number | null;
};

const NUM = ["partner_share_pct", "actual_amount_paid", "driver_cost", "extra_cost"] as const;

// PATCH /api/admin/quotations/[id]/finance — driver/vendor assignment + payment + costs for one ride.
// Margin is never typed: it is always customer paid − driver cost − extra cost (computed everywhere).
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { id } = await params;
  const b = (await request.json().catch(() => null)) as Body | null;
  if (!b) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  for (const k of NUM) {
    const v = b[k];
    if (v !== undefined && v !== null && (typeof v !== "number" || !Number.isFinite(v) || v < 0)) {
      return NextResponse.json({ error: `${k} must be a non-negative number` }, { status: 400 });
    }
  }
  if (b.partner_share_pct != null && b.partner_share_pct > 100) return NextResponse.json({ error: "Share cannot exceed 100%" }, { status: 400 });
  if (b.payment_status && !["unpaid", "partial", "paid"].includes(b.payment_status)) return NextResponse.json({ error: "Invalid payment status" }, { status: 400 });

  const cur = await prisma.$queryRawUnsafe<{ id: string }[]>(`SELECT id::text FROM quotations WHERE id=$1::uuid`, id);
  if (!cur.length) return NextResponse.json({ error: "Quotation not found" }, { status: 404 });

  // Assigning a driver from the directory fills name/phone and the default share unless overridden.
  let driverName = b.driver_name, driverPhone = b.driver_phone, share = b.partner_share_pct;
  if (b.partner_id) {
    const p = await prisma.$queryRawUnsafe<{ name: string; phone: string | null; default_share_pct: number }[]>(
      `SELECT name, phone, default_share_pct::float FROM partners WHERE id=$1::uuid`, b.partner_id);
    if (!p.length) return NextResponse.json({ error: "Driver not found" }, { status: 404 });
    driverName ??= p[0].name;
    driverPhone ??= p[0].phone;
    share ??= p[0].default_share_pct;
  }

  const sets: string[] = [];
  const vals: unknown[] = [id];
  const add = (col: string, v: unknown, cast = "") => { vals.push(v); sets.push(`${col}=$${vals.length}${cast}`); };
  if (b.partner_id !== undefined) add("partner_id", b.partner_id, "::uuid");
  if (driverName !== undefined) add("driver_name", driverName);
  if (driverPhone !== undefined) add("driver_phone", driverPhone);
  if (share !== undefined) add("partner_share_pct", share, "::numeric");
  if (b.vehicle_plate !== undefined) add("vehicle_plate", b.vehicle_plate || null);
  if (b.vehicle_detail !== undefined) add("vehicle_detail", b.vehicle_detail || null);
  if (b.actual_amount_paid !== undefined) add("actual_amount_paid", b.actual_amount_paid, "::numeric");
  if (b.payment_method_used !== undefined) add("payment_method_used", b.payment_method_used || null);
  if (b.extra_cost !== undefined) add("extra_cost", b.extra_cost ?? 0, "::numeric");
  if (b.driver_cost !== undefined) {
    add("driver_cost", b.driver_cost, "::numeric");
    sets.push(`financial_status='${b.driver_cost == null ? "required" : "confirmed"}'`);
  }
  const status = b.payment_status ?? (b.actual_amount_paid != null && b.actual_amount_paid > 0 ? "paid" : undefined);
  if (status) add("payment_status", status, "::quotation_payment_status");
  if (!sets.length) return NextResponse.json({ error: "Nothing to update" }, { status: 400 });

  sets.push("updated_at=now()");
  await prisma.$executeRawUnsafe(`UPDATE quotations SET ${sets.join(", ")} WHERE id=$1::uuid`, ...vals);
  // keep the legacy `profit` column equal to the computed margin (second statement: sees the new values)
  await prisma.$executeRawUnsafe(
    `UPDATE quotations SET profit = CASE WHEN driver_cost IS NOT NULL THEN COALESCE(actual_amount_paid,0)-driver_cost-extra_cost END WHERE id=$1::uuid`, id);
  if (b.partner_id !== undefined) await logEvent(id, "driver_assigned", driverName ?? null);
  if (b.actual_amount_paid !== undefined) await logEvent(id, "payment_recorded", `SAR ${b.actual_amount_paid ?? 0}${b.payment_method_used ? ` (${b.payment_method_used})` : ""}`);
  if (b.driver_cost !== undefined) await logEvent(id, "costs_saved", b.driver_cost == null ? "cost cleared" : `driver cost SAR ${b.driver_cost}${b.extra_cost ? `, extra SAR ${b.extra_cost}` : ""}`);
  return NextResponse.json({ success: true });
}
