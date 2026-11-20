import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireVendorOrAdmin } from "@/lib/vendor/ledger";

// Payments are never hard-deleted — a wrong entry is voided so the history stays auditable.
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const a = await requireVendorOrAdmin();
  if (!a.ok) return NextResponse.json({ error: a.error }, { status: a.status });
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return NextResponse.json({ error: "Bad id" }, { status: 400 });
  await prisma.$executeRawUnsafe(`UPDATE vendor_payments SET voided_at = now() WHERE id = $1::uuid AND voided_at IS NULL`, id);
  return NextResponse.json({ ok: true });
}
