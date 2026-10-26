import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { prisma } from "@/lib/prisma";
import { renderInvoicePdf } from "@/lib/pdf/invoice";
import type { QuotationRow } from "@/lib/supabase/quotations";

export const runtime = "nodejs";

// GET /api/admin/quotation-versions/[id] — the quotation PDF exactly as that version read (rendered from its frozen snapshot).
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const d = await prisma.$queryRawUnsafe<{ version_no: number; snapshot: QuotationRow }[]>(`SELECT version_no, snapshot FROM quotation_versions WHERE id=$1::uuid`, id);
  if (!d.length) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const pdf = await renderInvoicePdf(d[0].snapshot, "quotation");
  return new NextResponse(new Uint8Array(pdf), {
    headers: { "Content-Type": "application/pdf", "Content-Disposition": `inline; filename="quotation-${d[0].snapshot.quote_reference}-v${d[0].version_no}.pdf"` },
  });
}
