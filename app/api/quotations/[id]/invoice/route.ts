import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getQuotationById } from "@/lib/supabase/quotations";
import { renderInvoicePdf } from "@/lib/pdf/invoice";

export const runtime = "nodejs";

// Admin: download a branded PDF invoice for a priced quotation
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { row, error } = await getQuotationById(id);
  if (error || !row) {
    return NextResponse.json({ error: error ?? "Quotation not found" }, { status: 404 });
  }
  if (row.quoted_price === null) {
    return NextResponse.json({ error: "Set a quoted price before generating the invoice" }, { status: 400 });
  }

  const pdfBuffer = await renderInvoicePdf(row);

  return new NextResponse(new Uint8Array(pdfBuffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="invoice-${row.quote_reference}.pdf"`,
    },
  });
}
