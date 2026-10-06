import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { prisma } from "@/lib/prisma";

// PATCH /api/admin/clients/[id] { notes?, email? } — client-level notes / email.
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { id } = await params;
  const b = (await request.json().catch(() => ({}))) as { notes?: string | null; email?: string | null };
  if (b.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email.trim())) return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  const exists = await prisma.$queryRawUnsafe<{ id: string }[]>(`SELECT id::text FROM clients WHERE id=$1::uuid`, id);
  if (!exists.length) return NextResponse.json({ error: "Client not found" }, { status: 404 });
  if (b.notes !== undefined) await prisma.$executeRawUnsafe(`UPDATE clients SET notes=$2, updated_at=now() WHERE id=$1::uuid`, id, b.notes?.trim() || null);
  if (b.email !== undefined) await prisma.$executeRawUnsafe(`UPDATE clients SET email=$2, updated_at=now() WHERE id=$1::uuid`, id, b.email?.trim() || null);
  return NextResponse.json({ success: true });
}
