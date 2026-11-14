// Payments ledger. A payment is an actual receipt of money; booking payment_status is DERIVED from the ledger,
// never set because a receipt was generated. quotations.actual_amount_paid is kept equal to the sum of valid payments.
import { prisma } from "@/lib/prisma";
import { logEvent } from "@/lib/ops/events";
import { getQuotationWithDriver, type QuotationRow } from "@/lib/supabase/quotations";

export type PaymentRow = {
  id: string; quotation_id: string; amount: number; currency: string; method: string | null; reference: string | null; paid_at: string | null;
  closes_balance: boolean; note: string | null; source: string; recorded_by: string | null; created_at: string; voided_at: string | null; void_reason: string | null;
  receipt_doc_id: string | null;
};

export type ReceiptInfo = {
  paymentId: string | null;
  amount: number; currency: string; method: string; reference: string | null; paidAt: string | null;
  paidToDate: number; total: number | null; balance: number | null; fullyPaid: boolean; paymentNo: number;
};

export const PAYMENT_METHODS = ["Cash", "Bank transfer", "Card", "Other"] as const;

export async function listPayments(quotationId: string): Promise<PaymentRow[]> {
  return prisma.$queryRawUnsafe<PaymentRow[]>(
    `SELECT p.id::text, p.quotation_id::text, p.amount::float, p.currency, p.method, p.reference, p.paid_at::text, p.closes_balance, p.note, p.source, p.recorded_by,
            p.created_at::text, p.voided_at::text, p.void_reason,
            (SELECT d.id::text FROM documents d WHERE d.payment_id = p.id AND d.kind='receipt' ORDER BY d.created_at DESC LIMIT 1) receipt_doc_id
       FROM payments p WHERE p.quotation_id = $1::uuid ORDER BY p.created_at`, quotationId);
}

/** Re-derive the denormalised quotation fields from the ledger. */
export async function recomputeFromLedger(quotationId: string): Promise<{ paid: number; status: "unpaid" | "partial" | "paid" }> {
  const r = (await prisma.$queryRawUnsafe<{ sum: number; closes: boolean; price: number | null; method: string | null; n: number }[]>(
    `SELECT COALESCE(SUM(p.amount) FILTER (WHERE p.voided_at IS NULL),0)::float sum,
            COALESCE(bool_or(p.closes_balance) FILTER (WHERE p.voided_at IS NULL),false) closes,
            q.quoted_price::float price,
            (SELECT method FROM payments x WHERE x.quotation_id=q.id AND x.voided_at IS NULL AND x.method IS NOT NULL ORDER BY x.created_at DESC LIMIT 1) method,
            count(p.id)::int n
       FROM quotations q LEFT JOIN payments p ON p.quotation_id = q.id WHERE q.id = $1::uuid GROUP BY q.id`, quotationId))[0];
  if (!r) throw new Error("Quotation not found");
  const status = r.sum <= 0 ? "unpaid" : r.closes || (r.price != null && r.sum >= r.price) ? "paid" : "partial";
  await prisma.$executeRawUnsafe(
    `UPDATE quotations SET actual_amount_paid = $2::numeric, payment_status = $3::quotation_payment_status, payment_method_used = $4, updated_at = now() WHERE id = $1::uuid`,
    quotationId, r.n === 0 ? null : r.sum, status, r.method);
  await prisma.$executeRawUnsafe(
    `UPDATE quotations SET profit = CASE WHEN driver_cost IS NOT NULL THEN COALESCE(actual_amount_paid,0)-driver_cost-extra_cost END WHERE id = $1::uuid`, quotationId);
  return { paid: r.sum, status };
}

export type NewPayment = { amount: number; method?: string | null; reference?: string | null; paid_at?: string | null; closes_balance?: boolean; note?: string | null };

export async function recordPayment(quotationId: string, p: NewPayment, actor: string): Promise<{ id: string; status: "unpaid" | "partial" | "paid"; balance: number | null }> {
  if (!Number.isFinite(p.amount) || p.amount <= 0) throw new Error("Amount must be greater than zero");
  if (p.paid_at && !/^\d{4}-\d{2}-\d{2}$/.test(p.paid_at)) throw new Error("Payment date must be YYYY-MM-DD");
  const method = p.method?.trim() || null;
  if (method && !(PAYMENT_METHODS as readonly string[]).includes(method)) throw new Error("Invalid payment method");
  const q = (await prisma.$queryRawUnsafe<{ price: number | null; status: string; currency: string | null; paid: number }[]>(
    `SELECT q.quoted_price::float price, q.status::text status, q.currency,
            COALESCE((SELECT SUM(amount) FROM payments WHERE quotation_id=q.id AND voided_at IS NULL),0)::float paid
       FROM quotations q WHERE q.id = $1::uuid`, quotationId))[0];
  if (!q) throw new Error("Quotation not found");
  if (q.status === "cancelled") throw new Error("This booking is cancelled — payments cannot be recorded");
  if (q.price != null && q.paid + p.amount > q.price + 0.005) {
    throw new Error(`This would take payments to SAR ${(q.paid + p.amount).toLocaleString()}, above the agreed fare of SAR ${q.price.toLocaleString()}. Change the agreed fare first if it really changed.`);
  }
  const ins = await prisma.$queryRawUnsafe<{ id: string }[]>(
    `INSERT INTO payments (quotation_id, amount, currency, method, reference, paid_at, closes_balance, note, recorded_by)
     VALUES ($1::uuid,$2::numeric,$3,$4,$5,$6::date,$7,$8,$9) RETURNING id::text`,
    quotationId, p.amount, q.currency || "SAR", method, p.reference?.trim() || null, p.paid_at || null, !!p.closes_balance, p.note?.trim() || null, actor);
  const { paid, status } = await recomputeFromLedger(quotationId);
  await logEvent(quotationId, "payment_recorded", `SAR ${p.amount}${method ? ` (${method})` : ""} → total received SAR ${paid}, ${status}`);
  return { id: ins[0].id, status, balance: q.price != null && status !== "paid" ? Math.max(q.price - paid, 0) : status === "paid" ? 0 : null };
}

export async function voidPayment(paymentId: string, reason: string, actor: string, expectedQuotationId?: string): Promise<string> {
  if (!reason.trim()) throw new Error("A reason is required to void a payment");
  const p = (await prisma.$queryRawUnsafe<{ quotation_id: string; amount: number; voided_at: string | null }[]>(
    `SELECT quotation_id::text, amount::float, voided_at::text FROM payments WHERE id = $1::uuid`, paymentId))[0];
  if (!p) throw new Error("Payment not found");
  if (expectedQuotationId && p.quotation_id !== expectedQuotationId) throw new Error("Payment does not belong to this booking");
  if (p.voided_at) throw new Error("Payment is already voided");
  await prisma.$executeRawUnsafe(`UPDATE payments SET voided_at = now(), void_reason = $2 WHERE id = $1::uuid`, paymentId, `${reason.trim()} (by ${actor})`);
  const { status } = await recomputeFromLedger(p.quotation_id);
  await logEvent(p.quotation_id, "payment_recorded", `VOIDED SAR ${p.amount}: ${reason.trim()} → now ${status}`);
  return p.quotation_id;
}

/** Everything a receipt for one payment needs: what was received now, received to date, balance, and whether the stamp is earned. */
export async function buildReceiptInfo(paymentId: string): Promise<ReceiptInfo> {
  const p = (await prisma.$queryRawUnsafe<PaymentRow[]>(
    `SELECT id::text, quotation_id::text, amount::float, currency, method, reference, paid_at::text, closes_balance, note, source, recorded_by, created_at::text, voided_at::text, void_reason, NULL::text receipt_doc_id
       FROM payments WHERE id = $1::uuid`, paymentId))[0];
  if (!p) throw new Error("Payment not found");
  if (p.voided_at) throw new Error("This payment was voided — no receipt can be issued for it");
  const q = (await prisma.$queryRawUnsafe<{ price: number | null }[]>(`SELECT quoted_price::float price FROM quotations WHERE id=$1::uuid`, p.quotation_id))[0];
  const upTo = await prisma.$queryRawUnsafe<{ amount: number; closes_balance: boolean; created_at: string }[]>(
    `SELECT amount::float, closes_balance, created_at::text FROM payments WHERE quotation_id=$1::uuid AND voided_at IS NULL AND created_at <= $2::timestamptz ORDER BY created_at`, p.quotation_id, p.created_at);
  const paidToDate = upTo.reduce((a, x) => a + x.amount, 0);
  const closes = upTo.some((x) => x.closes_balance);
  const total = q?.price ?? null;
  const fullyPaid = paidToDate > 0 && (closes || (total != null && paidToDate >= total));
  return {
    paymentId: p.id, amount: p.amount, currency: p.currency, method: p.method ?? "Not specified", reference: p.reference, paidAt: p.paid_at,
    paidToDate, total, balance: fullyPaid ? 0 : total != null ? Math.max(total - paidToDate, 0) : null, fullyPaid, paymentNo: upTo.length,
  };
}

export type IssuedReceipt = { documentId: string; snapshot: QuotationRow & { receipt_info?: ReceiptInfo }; info: ReceiptInfo; reused: boolean };

/** The payment a receipt should cover when none is named: the latest valid one. */
export async function latestPaymentId(quotationId: string): Promise<string | null> {
  const r = await prisma.$queryRawUnsafe<{ id: string }[]>(`SELECT id::text FROM payments WHERE quotation_id=$1::uuid AND voided_at IS NULL ORDER BY created_at DESC LIMIT 1`, quotationId);
  return r[0]?.id ?? null;
}

/**
 * Issue (freeze) a receipt for ONE recorded payment. A receipt can only exist for a real, non-voided payment.
 * `reuse`: return the existing receipt for that payment instead of creating another.
 */
export async function issueReceipt(quotationId: string, paymentId: string | null, opts: { reuse?: boolean } = {}): Promise<IssuedReceipt> {
  const pid = paymentId ?? (await latestPaymentId(quotationId));
  if (!pid) throw new Error("Record a payment first — a receipt can only be issued for a payment that was actually received");
  const own = await prisma.$queryRawUnsafe<{ q: string }[]>(`SELECT quotation_id::text q FROM payments WHERE id=$1::uuid`, pid);
  if (!own.length || own[0].q !== quotationId) throw new Error("Payment does not belong to this booking");
  const { row, error } = await getQuotationWithDriver(quotationId);
  if (error || !row) throw new Error(error ?? "Quotation not found");
  const info = await buildReceiptInfo(pid);
  if (opts.reuse) {
    const ex = await prisma.$queryRawUnsafe<{ id: string; snapshot: IssuedReceipt["snapshot"] }[]>(
      `SELECT id::text, snapshot FROM documents WHERE payment_id=$1::uuid AND kind='receipt' ORDER BY created_at DESC LIMIT 1`, pid);
    if (ex.length) return { documentId: ex[0].id, snapshot: ex[0].snapshot, info: ex[0].snapshot.receipt_info ?? info, reused: true };
  }
  const snapshot = { ...row, receipt_info: info };
  const ins = await prisma.$queryRawUnsafe<{ id: string }[]>(
    `INSERT INTO documents (quotation_id, kind, number, amount, snapshot, payment_id) VALUES ($1::uuid,'receipt',$2,$3::numeric,$4::jsonb,$5::uuid) RETURNING id::text`,
    quotationId, `${row.quote_reference}${info.paymentNo > 1 ? `-P${info.paymentNo}` : ""}`, info.amount, JSON.stringify(snapshot), pid);
  await logEvent(quotationId, "receipt_generated", `${info.fullyPaid ? "PAID in full" : "Part payment"} receipt for SAR ${info.amount}`);
  return { documentId: ins[0].id, snapshot, info, reused: false };
}
