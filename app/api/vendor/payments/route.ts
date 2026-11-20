import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { num, requireVendorOrAdmin } from "@/lib/vendor/ledger";

export async function POST(req: Request) {
  const a = await requireVendorOrAdmin();
  if (!a.ok) return NextResponse.json({ error: a.error }, { status: a.status });
  const b = await req.json().catch(() => ({}));
  const amount = num(b.amount);
  if (amount === null || Number.isNaN(amount) || amount <= 0) return NextResponse.json({ error: "Amount must be greater than zero" }, { status: 400 });
  const paidAt = String(b.paid_at ?? "").trim();
  if (paidAt && !/^\d{4}-\d{2}-\d{2}$/.test(paidAt)) return NextResponse.json({ error: "Date must be YYYY-MM-DD" }, { status: 400 });
  await prisma.$executeRawUnsafe(
    `INSERT INTO vendor_payments (amount, paid_at, note, recorded_by) VALUES ($1::numeric, $2::date, $3, $4)`,
    amount, paidAt || null, String(b.note ?? "").trim() || null, `${a.role.toLowerCase()}:${a.email}`);
  return NextResponse.json({ ok: true });
}
