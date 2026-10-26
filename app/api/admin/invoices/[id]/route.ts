import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { getInvoice } from "@/lib/ops/invoices";
import { renderInvoiceDocPdf } from "@/lib/pdf/invoice-doc";

export const runtime = "nodejs";

// GET /api/admin/invoices/[id] — the invoice PDF, rendered from the stored (frozen) row.
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { id } = await params;
  const inv = await getInvoice(id);
  if (!inv) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const pdf = await renderInvoiceDocPdf(inv);
  return new NextResponse(new Uint8Array(pdf), {
    headers: { "Content-Type": "application/pdf", "Content-Disposition": `inline; filename="${inv.number}.pdf"` },
  });
}
