// Invoices: frozen documents linked to a booking. Totals come from invoice-math (halala-exact); "paid" comes from the payments ledger.
import { prisma } from "@/lib/prisma";
import { getQuotationWithDriver } from "@/lib/supabase/quotations";
import { logEvent } from "@/lib/ops/events";
import { computeTotals, outstanding, validateLines, type InvoiceLine, type VatMode } from "@/lib/ops/invoice-math";
import { VAT_RATE } from "@/lib/pdf/eagle-eyes";

export type BillTo = { name: string; company?: string | null; vat_no?: string | null; address?: string | null; email?: string | null; phone?: string | null };
export type InvoiceTrip = { quote_reference: string; pickup: string; drop: string; trip_date: string; trip_time: string | null; vehicle: string | null; passengers: number | null };

export type InvoiceRow = {
  id: string; quotation_id: string; number: string; status: "issued" | "void"; issue_date: string; currency: string; vat_mode: VatMode; vat_rate: number;
  lines: InvoiceLine[]; subtotal: number; vat_amount: number; total: number; paid_at_issue: number; balance_at_issue: number; settled_at_issue: boolean;
  bill_to: BillTo; po_reference: string | null; payment_terms: string | null; notes: string | null; trip: InvoiceTrip; issued_by: string | null;
  created_at: string; voided_at: string | null; void_reason: string | null;
};

const COLS = `id::text, quotation_id::text, number, status, issue_date::text, currency, vat_mode, vat_rate::float, lines, subtotal::float, vat_amount::float, total::float,
  paid_at_issue::float, balance_at_issue::float, settled_at_issue, bill_to, po_reference, payment_terms, notes, trip, issued_by, created_at::text, voided_at::text, void_reason`;

export const DEFAULT_TERMS = "Payable in cash to the driver, or by bank transfer. Free cancellation up to 24 hours before pickup.";

export async function listInvoices(quotationId: string): Promise<InvoiceRow[]> {
  return prisma.$queryRawUnsafe<InvoiceRow[]>(`SELECT ${COLS} FROM invoices WHERE quotation_id=$1::uuid ORDER BY created_at DESC`, quotationId);
}

export async function getInvoice(id: string): Promise<InvoiceRow | null> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  return (await prisma.$queryRawUnsafe<InvoiceRow[]>(`SELECT ${COLS} FROM invoices WHERE id=$1::uuid`, id))[0] ?? null;
}

export type NewInvoice = {
  vat_mode: VatMode; lines: unknown; bill_to?: Partial<BillTo>; po_reference?: string | null; payment_terms?: string | null; notes?: string | null;
};

export async function createInvoice(quotationId: string, input: NewInvoice, actor: string): Promise<InvoiceRow> {
  if (!["none", "inclusive", "exclusive"].includes(input.vat_mode)) throw new Error("Choose how VAT is treated");
  const lines = validateLines(input.lines);
  const { row: q, error } = await getQuotationWithDriver(quotationId);
  if (error || !q) throw new Error(error ?? "Quotation not found");
  if (q.status === "cancelled") throw new Error("This booking is cancelled — no invoice can be issued");

  const rate = input.vat_mode === "none" ? 0 : VAT_RATE;
  const t = computeTotals(lines, input.vat_mode, rate);
  if (t.total <= 0) throw new Error("Invoice total must be greater than zero");

  const paid = (await prisma.$queryRawUnsafe<{ s: number }[]>(`SELECT COALESCE(SUM(amount),0)::float s FROM payments WHERE quotation_id=$1::uuid AND voided_at IS NULL`, quotationId))[0].s;
  const settled = q.payment_status === "paid";
  const balance = outstanding(t.total, paid, settled);

  const bt = input.bill_to ?? {};
  const billTo: BillTo = {
    name: String(bt.name ?? q.customer_name).trim() || q.customer_name,
    company: bt.company?.trim() || null, vat_no: bt.vat_no?.trim() || null, address: bt.address?.trim() || null,
    email: (bt.email ?? q.customer_email)?.trim() || null, phone: (bt.phone ?? q.customer_phone)?.trim() || null,
  };
  const trip: InvoiceTrip = {
    quote_reference: q.quote_reference, pickup: q.pickup_location, drop: q.drop_location, trip_date: q.trip_date, trip_time: q.trip_time,
    vehicle: q.vehicle_type_requested ?? null, passengers: q.passengers_count ?? null,
  };

  const year = Number(new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Riyadh" }).slice(0, 4));
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Riyadh" });
  const c = await prisma.$queryRawUnsafe<{ counter: number }[]>(
    `INSERT INTO invoice_counters (year, counter) VALUES ($1, 1) ON CONFLICT (year) DO UPDATE SET counter = invoice_counters.counter + 1 RETURNING counter`, year);
  const number = `TSA-INV-${year}-${String(c[0].counter).padStart(4, "0")}`;

  const ins = await prisma.$queryRawUnsafe<{ id: string }[]>(
    `INSERT INTO invoices (quotation_id, number, issue_date, currency, vat_mode, vat_rate, lines, subtotal, vat_amount, total, paid_at_issue, balance_at_issue, settled_at_issue,
        bill_to, po_reference, payment_terms, notes, trip, issued_by)
     VALUES ($1::uuid,$2,$3::date,$4,$5,$6::numeric,$7::jsonb,$8::numeric,$9::numeric,$10::numeric,$11::numeric,$12::numeric,$13,$14::jsonb,$15,$16,$17,$18::jsonb,$19) RETURNING id::text`,
    quotationId, number, today, q.currency || "SAR", input.vat_mode, rate, JSON.stringify(lines), t.subtotal, t.vat, t.total, paid, balance, settled,
    JSON.stringify(billTo), input.po_reference?.trim() || null, input.payment_terms?.trim() || DEFAULT_TERMS, input.notes?.trim() || null, JSON.stringify(trip), actor);
  await logEvent(quotationId, "invoice_issued", `${number} · total ${q.currency || "SAR"} ${t.total} (${input.vat_mode === "none" ? "no VAT" : `VAT ${t.vat}`}) · outstanding ${balance}`);
  return (await getInvoice(ins[0].id))!;
}

export async function voidInvoice(id: string, reason: string, actor: string, expectedQuotationId?: string): Promise<void> {
  if (!reason.trim()) throw new Error("A reason is required to void an invoice");
  const inv = await getInvoice(id);
  if (!inv) throw new Error("Invoice not found");
  if (expectedQuotationId && inv.quotation_id !== expectedQuotationId) throw new Error("Invoice does not belong to this booking");
  if (inv.status === "void") throw new Error("Invoice is already void");
  await prisma.$executeRawUnsafe(`UPDATE invoices SET status='void', voided_at=now(), void_reason=$2 WHERE id=$1::uuid`, id, `${reason.trim()} (by ${actor})`);
  await logEvent(inv.quotation_id, "invoice_issued", `${inv.number} VOIDED: ${reason.trim()}`);
}
