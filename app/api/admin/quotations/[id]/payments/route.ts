import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { listPayments, recordPayment, voidPayment, type NewPayment } from "@/lib/ops/payments";

const UUID = /^[0-9a-f-]{36}$/i;

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { id } = await params;
  if (!UUID.test(id)) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true, payments: await listPayments(id) });
}

// POST — record a payment that was actually received. Booking payment status is derived from the ledger.
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { id } = await params;
  if (!UUID.test(id)) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const b = (await request.json().catch(() => null)) as (NewPayment & { amount: unknown }) | null;
  if (!b) return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  try {
    const r = await recordPayment(id, { ...b, amount: Number(b.amount) }, auth.email);
    return NextResponse.json({ success: true, ...r });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Could not record payment" }, { status: 400 });
  }
}

// PATCH { payment_id, reason } — void a payment recorded in error. History is kept; receipts already issued stay on file.
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { id } = await params;
  const b = (await request.json().catch(() => null)) as { payment_id?: string; reason?: string } | null;
  if (!b?.payment_id || !UUID.test(b.payment_id)) return NextResponse.json({ error: "payment_id required" }, { status: 400 });
  try {
    await voidPayment(b.payment_id, b.reason ?? "", auth.email, id);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Could not void payment" }, { status: 400 });
  }
}
