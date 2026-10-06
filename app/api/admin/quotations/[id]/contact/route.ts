import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { prisma } from "@/lib/prisma";
import { logEvent } from "@/lib/ops/events";
import { normPhone } from "@/lib/ops/quotations";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// PATCH /api/admin/quotations/[id]/contact { customer_email?, customer_phone? }
// Contact details stay editable even after a ride is completed (the details RPC locks the trip record, but a
// missing email must still be fixable to send a receipt). Also updates the linked client.
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { id } = await params;
  const b = (await request.json().catch(() => ({}))) as { customer_email?: string | null; customer_phone?: string };
  const email = b.customer_email === undefined ? undefined : (b.customer_email ?? "").trim() || null;
  if (email && !EMAIL_RE.test(email)) return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  const phone = b.customer_phone === undefined ? undefined : b.customer_phone.trim();
  if (phone !== undefined && !normPhone(phone)) return NextResponse.json({ error: "Invalid phone number" }, { status: 400 });

  const row = await prisma.$queryRawUnsafe<{ client_id: string | null }[]>(`SELECT client_id::text FROM quotations WHERE id=$1::uuid`, id);
  if (!row.length) return NextResponse.json({ error: "Quotation not found" }, { status: 404 });

  if (email !== undefined) await prisma.$executeRawUnsafe(`UPDATE quotations SET customer_email=$2, updated_at=now() WHERE id=$1::uuid`, id, email);
  if (phone !== undefined) await prisma.$executeRawUnsafe(`UPDATE quotations SET customer_phone=$2, updated_at=now() WHERE id=$1::uuid`, id, phone);
  if (row[0].client_id) {
    if (email !== undefined) await prisma.$executeRawUnsafe(`UPDATE clients SET email=$2, updated_at=now() WHERE id=$1::uuid`, row[0].client_id, email);
  }
  await logEvent(id, "details_edited", [email !== undefined ? "email" : null, phone !== undefined ? "phone" : null].filter(Boolean).join(" + ") + " updated");
  return NextResponse.json({ success: true });
}
