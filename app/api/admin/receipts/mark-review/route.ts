import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { prisma } from "@/lib/prisma";

// POST /api/admin/receipts/mark-review { ids: string[] }
// Records that the operator ALREADY asked for a Trustpilot review (we cannot see WhatsApp). Only completed + paid rides.
// Nothing is sent to anyone; an existing request date is never overwritten.
export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const b = (await request.json().catch(() => ({}))) as { ids?: unknown };
  const ids = Array.isArray(b.ids) ? b.ids.filter((x): x is string => typeof x === "string" && /^[0-9a-f-]{36}$/i.test(x)) : [];
  if (ids.length === 0 || ids.length > 200) return NextResponse.json({ error: "Select between 1 and 200 rides" }, { status: 400 });
  const n = await prisma.$executeRawUnsafe(
    `UPDATE quotations SET review_invited_at = COALESCE(review_invited_at, now())
      WHERE id = ANY($1::uuid[]) AND NOT is_test AND status='completed' AND payment_status='paid'`, ids);
  return NextResponse.json({ success: true, updated: n });
}
