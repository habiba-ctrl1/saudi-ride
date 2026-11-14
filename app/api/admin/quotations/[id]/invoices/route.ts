import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createInvoice, listInvoices, voidInvoice, type NewInvoice } from "@/lib/ops/invoices";

const UUID = /^[0-9a-f-]{36}$/i;

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { id } = await params;
  if (!UUID.test(id)) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true, invoices: await listInvoices(id) });
}

// POST — issue an invoice (frozen document). Never emails anyone.
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { id } = await params;
  if (!UUID.test(id)) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const b = (await request.json().catch(() => null)) as NewInvoice | null;
  if (!b) return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  try {
    const inv = await createInvoice(id, b, auth.email);
    return NextResponse.json({ success: true, id: inv.id, number: inv.number, total: inv.total, balance: inv.balance_at_issue });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Could not issue invoice" }, { status: 400 });
  }
}

// PATCH { invoice_id, reason } — void an invoice issued in error (it stays on file, stamped VOID).
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { id } = await params;
  const b = (await request.json().catch(() => null)) as { invoice_id?: string; reason?: string } | null;
  if (!b?.invoice_id || !UUID.test(b.invoice_id)) return NextResponse.json({ error: "invoice_id required" }, { status: 400 });
  try {
    await voidInvoice(b.invoice_id, b.reason ?? "", auth.email, id);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Could not void invoice" }, { status: 400 });
  }
}
