// Invoice arithmetic. Pure and client-safe. All maths is done in whole halalas (cents) so totals always add up exactly.
export type VatMode = "none" | "inclusive" | "exclusive";
export type InvoiceLine = { description: string; qty: number; unit: number };

export const VAT_MODE_LABEL: Record<VatMode, string> = {
  none: "No VAT charged",
  inclusive: "VAT included in the amounts",
  exclusive: "VAT added on top of the amounts",
};

const cents = (n: number) => Math.round((n + Math.sign(n) * Number.EPSILON) * 100);
const fromCents = (c: number) => c / 100;

export type Totals = { lineAmounts: number[]; subtotal: number; vat: number; total: number };

/** lines are entered as shown to the customer: for "inclusive" they already contain VAT, otherwise they do not. */
export function computeTotals(lines: InvoiceLine[], mode: VatMode, rate: number): Totals {
  const lineC = lines.map((l) => cents(l.qty * l.unit));
  const sum = lineC.reduce((a, b) => a + b, 0);
  let sub: number, vat: number, total: number;
  if (mode === "none") { sub = sum; vat = 0; total = sum; }
  else if (mode === "exclusive") { sub = sum; vat = Math.round(sum * rate); total = sub + vat; }
  else { total = sum; sub = Math.round(sum / (1 + rate)); vat = total - sub; }
  return { lineAmounts: lineC.map(fromCents), subtotal: fromCents(sub), vat: fromCents(vat), total: fromCents(total) };
}

/** Outstanding balance on the invoice. A booking explicitly settled (agreed discount / write-off) owes nothing. */
export function outstanding(total: number, paid: number, settled: boolean): number {
  return settled ? 0 : fromCents(Math.max(cents(total) - cents(paid), 0));
}

export function validateLines(lines: unknown): InvoiceLine[] {
  if (!Array.isArray(lines) || lines.length < 1 || lines.length > 12) throw new Error("An invoice needs 1–12 line items");
  return lines.map((l, i) => {
    const o = l as Partial<InvoiceLine>;
    const description = String(o.description ?? "").trim();
    const qty = Number(o.qty), unit = Number(o.unit);
    if (!description) throw new Error(`Line ${i + 1}: description is required`);
    if (description.length > 200) throw new Error(`Line ${i + 1}: description is too long`);
    if (!Number.isFinite(qty) || qty <= 0 || qty > 1000) throw new Error(`Line ${i + 1}: quantity must be greater than zero`);
    if (!Number.isFinite(unit) || unit < 0 || unit > 10_000_000) throw new Error(`Line ${i + 1}: unit price must be zero or more`);
    return { description, qty, unit };
  });
}
