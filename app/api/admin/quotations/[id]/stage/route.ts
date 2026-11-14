import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { prisma } from "@/lib/prisma";
import { QUOTE_STAGES } from "@/lib/ops/quote-stage";
import { logEvent } from "@/lib/ops/events";

// PATCH /api/admin/quotations/[id]/stage { stage?, valid_until? } — quote lifecycle only (no emails, no ride status change).
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { id } = await params;
  const b = (await request.json().catch(() => ({}))) as { stage?: string; valid_until?: string | null };

  if (b.stage !== undefined) {
    if (!QUOTE_STAGES.includes(b.stage as never)) return NextResponse.json({ error: "Invalid stage" }, { status: 400 });
    if (b.stage === "ready") {
      const r = await prisma.$queryRawUnsafe<{ quoted_price: number | null }[]>(`SELECT quoted_price::float FROM quotations WHERE id=$1::uuid`, id);
      if (!r.length) return NextResponse.json({ error: "Quotation not found" }, { status: 404 });
      if (r[0].quoted_price == null) return NextResponse.json({ error: "Set a price before marking Ready" }, { status: 400 });
    }
    await prisma.$executeRawUnsafe(`UPDATE quotations SET quote_stage=$2, updated_at=now() WHERE id=$1::uuid`, id, b.stage);
    await logEvent(id, "stage_changed", `Quote marked ${b.stage}`);
  }
  if (b.valid_until !== undefined) {
    await prisma.$executeRawUnsafe(`UPDATE quotations SET valid_until=$2::date, updated_at=now() WHERE id=$1::uuid`, id, b.valid_until || null);
  }
  return NextResponse.json({ success: true });
}
