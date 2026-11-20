import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { renderCorporateProformaPdf, type CorporateProformaInput } from "@/lib/pdf/corporate-proforma";

export const runtime = "nodejs";

// Admin: generate a branded corporate proforma invoice PDF (Path B / Eagle
// Eyes VAT billing partner) from manually entered fields. Stateless — not
// tied to a Quotation DB row, since corporate leads don't create one today.
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));

  const invoiceNo = String(body.invoiceNo ?? "").trim();
  const invoiceDate = String(body.invoiceDate ?? "").trim();
  const clientCompany = String(body.clientCompany ?? "").trim();
  const serviceDescription = String(body.serviceDescription ?? "").trim();
  const totalAmount = Number(body.totalAmount);
  const currency = String(body.currency ?? "SAR").trim().slice(0, 8) || "SAR";

  if (!invoiceNo || !invoiceDate || !clientCompany || !serviceDescription || !Number.isFinite(totalAmount) || totalAmount <= 0) {
    return NextResponse.json(
      { error: "Missing required fields: invoiceNo, invoiceDate, clientCompany, serviceDescription, totalAmount" },
      { status: 400 }
    );
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(invoiceDate)) {
    return NextResponse.json({ error: "invoiceDate must be YYYY-MM-DD" }, { status: 400 });
  }

  const input: CorporateProformaInput = {
    invoiceNo,
    invoiceDate,
    clientCompany,
    clientContact: body.clientContact ? String(body.clientContact).trim() : undefined,
    clientVatNo: body.clientVatNo ? String(body.clientVatNo).trim() : undefined,
    clientAddress: body.clientAddress ? String(body.clientAddress).trim() : undefined,
    serviceDescription,
    totalAmount,
    currency,
    poReference: body.poReference ? String(body.poReference).trim() : undefined,
    notes: body.notes ? String(body.notes).trim() : undefined,
  };

  const pdfBuffer = await renderCorporateProformaPdf(input);

  return new NextResponse(new Uint8Array(pdfBuffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="proforma-${invoiceNo}.pdf"`,
    },
  });
}
