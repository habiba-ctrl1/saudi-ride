import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { prisma } from "@/lib/prisma";
import { renderInvoicePdf } from "@/lib/pdf/invoice";
import type { QuotationRow } from "@/lib/supabase/quotations";

export const runtime = "nodejs";

// GET /api/admin/documents/[id] — re-render an issued document from its frozen snapshot.
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const d = await prisma.$queryRawUnsafe<{ kind: "quotation" | "receipt"; number: string; snapshot: QuotationRow }[]>(
    `SELECT kind, number, snapshot FROM documents WHERE id=$1::uuid`, id);
  if (!d.length) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const pdf = await renderInvoicePdf(d[0].snapshot, d[0].kind);
  return new NextResponse(new Uint8Array(pdf), {
    headers: { "Content-Type": "application/pdf", "Content-Disposition": `inline; filename="${d[0].kind}-${d[0].number}.pdf"` },
  });
}
