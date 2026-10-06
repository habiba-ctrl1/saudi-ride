import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { prisma } from "@/lib/prisma";

// POST /api/admin/partners/[id]/settlements { direction, amount, note?, settled_on? }
// Records money moved between the owner and a driver/vendor.
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { id } = await params;
  const b = (await request.json().catch(() => ({}))) as { direction?: string; amount?: number; note?: string; settled_on?: string };
  if (!["received_from_partner", "paid_to_partner"].includes(b.direction ?? "")) return NextResponse.json({ error: "Invalid direction" }, { status: 400 });
  if (typeof b.amount !== "number" || !Number.isFinite(b.amount) || b.amount <= 0) return NextResponse.json({ error: "Amount must be greater than 0" }, { status: 400 });
  const p = await prisma.$queryRawUnsafe<{ id: string }[]>(`SELECT id::text FROM partners WHERE id=$1::uuid`, id);
  if (!p.length) return NextResponse.json({ error: "Driver not found" }, { status: 404 });
  await prisma.$executeRawUnsafe(
    `INSERT INTO partner_settlements (partner_id, direction, amount, settled_on, note) VALUES ($1::uuid,$2,$3::numeric,COALESCE($4::date, current_date),$5)`,
    id, b.direction, b.amount, b.settled_on || null, b.note?.trim() || null);
  return NextResponse.json({ success: true });
}
