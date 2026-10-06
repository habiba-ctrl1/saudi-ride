import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { prisma } from "@/lib/prisma";
import { getQuotationWithDriver } from "@/lib/supabase/quotations";

// POST /api/admin/quotations/[id]/receipt-doc — issue (save) a receipt for a completed, paid ride.
// A frozen snapshot of the record is stored, so the receipt never changes if the booking is edited later.
// Does not email anything — sending is a separate, explicit action.
export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { id } = await params;
  const { row, error } = await getQuotationWithDriver(id);
  if (error || !row) return NextResponse.json({ error: error ?? "Quotation not found" }, { status: 404 });
  if (row.status !== "completed") return NextResponse.json({ error: "Mark the ride Completed before generating a receipt" }, { status: 400 });
  if (row.actual_amount_paid == null || row.actual_amount_paid <= 0) return NextResponse.json({ error: "Record the amount paid first" }, { status: 400 });

  const ins = await prisma.$queryRawUnsafe<{ id: string }[]>(
    `INSERT INTO documents (quotation_id, kind, number, amount, snapshot) VALUES ($1::uuid,'receipt',$2,$3::numeric,$4::jsonb) RETURNING id::text`,
    id, row.quote_reference, row.actual_amount_paid, JSON.stringify(row),
  );
  return NextResponse.json({ success: true, documentId: ins[0].id });
}
