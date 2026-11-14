"use client";

import { useMemo, useState } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";
import type { QuotationRow } from "@/lib/supabase/quotations";
import type { InvoiceRow } from "@/lib/ops/invoices";
import { computeTotals, outstanding, VAT_MODE_LABEL, type InvoiceLine, type VatMode } from "@/lib/ops/invoice-math";

const DEFAULT_TERMS = "Payable in cash to the driver, or by bank transfer. Free cancellation up to 24 hours before pickup.";
const field = "mt-1 w-full rounded-lg border border-[#333] bg-black/40 px-2 py-1.5 text-sm text-[#F5F0E8] outline-none focus:border-[#C9A84C]";
const lbl = "text-[0.65rem] text-[#7C8088]";
const btn = "inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-bold disabled:opacity-40 transition";
const sar = (n: number, c = "SAR") => `${c} ${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/** Issue / list / void invoices for one booking. Invoices are frozen documents: mistakes are voided and re-issued. */
export function InvoicesCard({ q, invoices, paid, settled, busy, setBusy, setMsg, refresh }: {
  q: QuotationRow; invoices: InvoiceRow[]; paid: number; settled: boolean; busy: string | null; setBusy: (b: string | null) => void;
  setMsg: (m: { ok: boolean; text: string } | null) => void; refresh: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<VatMode>("none");
  const [lines, setLines] = useState<{ description: string; qty: string; unit: string }[]>([
    { description: `Private transfer: ${q.pickup_location} → ${q.drop_location} (${q.trip_date})`, qty: "1", unit: q.quoted_price != null ? String(q.quoted_price) : "" },
  ]);
  const [company, setCompany] = useState(false);
  const [bt, setBt] = useState({ company: "", vat_no: "", address: "", po: "" });
  const [terms, setTerms] = useState(DEFAULT_TERMS);
  const [notes, setNotes] = useState("");

  const parsed: InvoiceLine[] = lines.map((l) => ({ description: l.description, qty: Number(l.qty), unit: Number(l.unit) }));
  const valid = lines.every((l) => l.description.trim() && l.unit !== "" && Number(l.qty) > 0 && Number.isFinite(Number(l.unit)) && Number(l.unit) >= 0);
  const t = useMemo(() => (valid ? computeTotals(parsed, mode, mode === "none" ? 0 : 0.15) : null), [valid, mode, lines]); // eslint-disable-line react-hooks/exhaustive-deps
  const owed = t ? outstanding(t.total, paid, settled) : null;
  const cur = q.currency || "SAR";

  async function call(key: string, method: "POST" | "PATCH", body: unknown, ok: string) {
    setBusy(key); setMsg(null);
    try {
      const r = await fetch(`/api/admin/quotations/${q.id}/invoices`, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) setMsg({ ok: false, text: j.error || "Action failed" });
      else {
        setMsg({ ok: true, text: key === "inv-new" ? `Invoice ${j.number} issued (total ${sar(j.total, cur)}, outstanding ${sar(j.balance, cur)}). Nothing was sent.` : ok });
        if (key === "inv-new") setOpen(false);
        refresh();
      }
    } catch { setMsg({ ok: false, text: "Network error" }); } finally { setBusy(null); }
  }
  const issue = () => call("inv-new", "POST", {
    vat_mode: mode, lines: parsed, payment_terms: terms, notes: notes || null, po_reference: company ? bt.po || null : null,
    bill_to: company ? { company: bt.company, vat_no: bt.vat_no, address: bt.address } : undefined,
  }, "");
  const voidIt = (inv: InvoiceRow) => {
    const reason = window.prompt(`Void invoice ${inv.number}? It stays on file stamped VOID. Reason (required):`);
    if (reason && reason.trim()) call(`inv-void-${inv.id}`, "PATCH", { invoice_id: inv.id, reason }, `${inv.number} voided.`);
  };
  const set = (i: number, k: "description" | "qty" | "unit", v: string) => setLines((ls) => ls.map((l, j) => (j === i ? { ...l, [k]: v } : l)));

  return (
    <div>
      {invoices.length === 0 && <p className="text-xs text-[#7C8088]">No invoice issued for this booking yet.</p>}
      <ul className="space-y-2">
        {invoices.map((inv) => (
          <li key={inv.id} className={`rounded-lg border border-[#222] p-2 text-xs ${inv.status === "void" ? "opacity-60" : ""}`}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-bold text-[#F5F0E8]">{inv.number}{inv.status === "void" && <span className="ml-2 rounded border border-red-500/40 px-1 text-[0.6rem] text-red-400">VOID</span>}</span>
              <span className="text-[#7C8088]">{inv.issue_date} · {VAT_MODE_LABEL[inv.vat_mode]}</span>
            </div>
            <div className="mt-1 text-[#A1A1A6]">
              Total <b className="text-[#F5F0E8]">{sar(inv.total, inv.currency)}</b>{inv.vat_mode !== "none" ? ` (VAT ${sar(inv.vat_amount, inv.currency)})` : ""} · paid at issue {sar(inv.paid_at_issue, inv.currency)} ·
              {" "}outstanding <b className={inv.balance_at_issue > 0 ? "text-orange-400" : "text-green-500"}>{sar(inv.balance_at_issue, inv.currency)}</b>
              {inv.bill_to.company ? ` · billed to ${inv.bill_to.company}` : ""}
            </div>
            {inv.void_reason && <div className="mt-0.5 text-red-400">Voided: {inv.void_reason}</div>}
            <div className="mt-1 flex gap-3">
              <a className="font-bold text-[#C9A84C] hover:underline" href={`/api/admin/invoices/${inv.id}`} target="_blank" rel="noreferrer">Open PDF</a>
              {inv.status === "issued" && <button className="text-red-400 hover:underline disabled:opacity-40" disabled={busy !== null} onClick={() => voidIt(inv)}>Void</button>}
            </div>
          </li>
        ))}
      </ul>

      {!open && q.status !== "cancelled" && <button className={`${btn} mt-3 border-[#C9A84C]/40 text-[#C9A84C] hover:bg-[#C9A84C]/10`} onClick={() => setOpen(true)}>Create invoice</button>}

      {open && (
        <div className="mt-3 space-y-3 rounded-lg border border-[#222] p-3">
          <label className={lbl}>VAT treatment
            <select className={field} value={mode} onChange={(e) => setMode(e.target.value as VatMode)}>
              {(Object.keys(VAT_MODE_LABEL) as VatMode[]).map((m) => <option key={m} value={m}>{VAT_MODE_LABEL[m]}</option>)}
            </select>
          </label>
          {mode !== "none" && <p className="text-[0.65rem] text-orange-300">With VAT, the invoice is issued on behalf of the registered VAT billing partner (15%) and says its official tax invoice follows after payment — same as the corporate proforma.</p>}

          <div className="space-y-2">
            {lines.map((l, i) => (
              <div key={i} className="grid grid-cols-12 gap-2">
                <label className={`${lbl} col-span-12 sm:col-span-7`}>Description<input className={field} value={l.description} onChange={(e) => set(i, "description", e.target.value)} /></label>
                <label className={`${lbl} col-span-4 sm:col-span-1`}>Qty<input type="number" min={1} className={field} value={l.qty} onChange={(e) => set(i, "qty", e.target.value)} /></label>
                <label className={`${lbl} col-span-6 sm:col-span-3`}>Unit price{mode === "inclusive" ? " (incl. VAT)" : ""}<input type="number" min={0} step="0.01" className={field} value={l.unit} onChange={(e) => set(i, "unit", e.target.value)} /></label>
                <div className="col-span-2 flex items-end sm:col-span-1">{lines.length > 1 && <button type="button" aria-label="Remove line" className="mb-1 text-red-400" onClick={() => setLines((ls) => ls.filter((_, j) => j !== i))}><Trash2 className="h-4 w-4" /></button>}</div>
              </div>
            ))}
            {lines.length < 12 && <button type="button" className="inline-flex items-center gap-1 text-xs font-bold text-[#C9A84C]" onClick={() => setLines((ls) => [...ls, { description: "", qty: "1", unit: "" }])}><Plus className="h-3.5 w-3.5" /> Add line</button>}
          </div>

          <label className="flex items-center gap-2 text-xs text-[#A1A1A6]"><input type="checkbox" checked={company} onChange={(e) => setCompany(e.target.checked)} /> Bill a company (adds company name, VAT no., address, PO)</label>
          {company && (
            <div className="grid gap-2 sm:grid-cols-2">
              <label className={lbl}>Company name<input className={field} value={bt.company} onChange={(e) => setBt({ ...bt, company: e.target.value })} /></label>
              <label className={lbl}>Client VAT no. (as given by the client)<input className={field} value={bt.vat_no} onChange={(e) => setBt({ ...bt, vat_no: e.target.value })} /></label>
              <label className={lbl}>Address<input className={field} value={bt.address} onChange={(e) => setBt({ ...bt, address: e.target.value })} /></label>
              <label className={lbl}>PO reference<input className={field} value={bt.po} onChange={(e) => setBt({ ...bt, po: e.target.value })} /></label>
            </div>
          )}
          <label className={lbl}>Payment terms<textarea rows={2} className={field} value={terms} onChange={(e) => setTerms(e.target.value)} /></label>
          <label className={lbl}>Notes (optional)<input className={field} value={notes} onChange={(e) => setNotes(e.target.value)} /></label>

          <div className="rounded-lg border border-[#333] p-3 font-mono text-xs text-[#F5F0E8]">
            {t ? (
              <>
                <div className="flex justify-between"><span>{mode === "none" ? "Subtotal" : "Subtotal (excl. VAT)"}</span><span>{sar(t.subtotal, cur)}</span></div>
                <div className="flex justify-between"><span>VAT</span><span>{mode === "none" ? "not charged" : sar(t.vat, cur)}</span></div>
                <div className="flex justify-between font-bold"><span>Total payable</span><span>{sar(t.total, cur)}</span></div>
                <div className="flex justify-between text-[#7C8088]"><span>Paid so far (payments list)</span><span>{sar(paid, cur)}</span></div>
                <div className={`flex justify-between font-bold ${owed ? "text-orange-400" : "text-green-500"}`}><span>Outstanding{settled ? " (booking settled)" : ""}</span><span>{sar(owed ?? 0, cur)}</span></div>
              </>
            ) : <span className="text-[#7C8088]">Fill every line (description, quantity, price) to see the totals.</span>}
          </div>
          <div className="flex gap-2">
            <button className={`${btn} border-transparent bg-[#C9A84C] text-black`} disabled={busy !== null || !t} onClick={issue}>{busy === "inv-new" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Issue invoice"}</button>
            <button className={`${btn} border-[#333] text-[#A1A1A6]`} onClick={() => setOpen(false)}>Cancel</button>
          </div>
          <p className="text-[0.65rem] text-[#7C8088]">Issuing saves a frozen invoice and a number. It does not email anyone or change payment status.</p>
        </div>
      )}
    </div>
  );
}
