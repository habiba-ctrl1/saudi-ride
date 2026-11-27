import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { issueReceipt } from "@/lib/ops/payments";

// POST /api/admin/quotations/[id]/receipt-doc { payment_id? } — issue (save) a receipt for ONE recorded payment.
// Defaults to the latest valid payment. A frozen snapshot is stored, so the receipt never changes if the booking is edited later.
// The PAID stamp is printed only when payments to date settle the fare. Issuing a receipt never changes payment status.
// Does not email anything — sending is a separate, explicit action.
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { id } = await params;
  const b = (await request.json().catch(() => ({}))) as { payment_id?: string };
  const pid = b.payment_id && /^[0-9a-f-]{36}$/i.test(b.payment_id) ? b.payment_id : null;
  try {
    const r = await issueReceipt(id, pid);
    return NextResponse.json({ success: true, documentId: r.documentId, fullyPaid: r.info.fullyPaid, balance: r.info.balance });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Could not issue receipt" }, { status: 400 });
  }
}
