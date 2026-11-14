"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";

const inputClass = "w-full rounded-lg border border-[#333] bg-black/40 px-3 py-2.5 text-xs text-[#F5F0E8] outline-none focus:border-[#C9A84C]";
const labelClass = "block text-[10px] uppercase tracking-wider text-[#7C8088] mb-1.5 font-bold";

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export function CorporateInvoiceForm() {
  const [form, setForm] = useState({
    invoiceNo: "",
    invoiceDate: todayIso(),
    clientCompany: "",
    clientContact: "",
    clientVatNo: "",
    clientAddress: "",
    poReference: "",
    serviceDescription: "",
    totalAmount: "",
    currency: "SAR",
    notes: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/corporate-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, totalAmount: Number(form.totalAmount) }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Could not generate invoice");
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `proforma-${form.invoiceNo || "invoice"}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#111] border border-[#C9A84C]/15 rounded-2xl p-6 space-y-5 max-w-3xl">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Invoice No. *</label>
          <input required placeholder="e.g. EE-2026-0011" value={form.invoiceNo} onChange={set("invoiceNo")} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Invoice Date *</label>
          <input required type="date" value={form.invoiceDate} onChange={set("invoiceDate")} className={inputClass} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Client Company *</label>
          <input required placeholder="e.g. Dania AI" value={form.clientCompany} onChange={set("clientCompany")} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Client Contact Person</label>
          <input placeholder="Name (optional)" value={form.clientContact} onChange={set("clientContact")} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Client VAT No.</label>
          <input placeholder="Optional" value={form.clientVatNo} onChange={set("clientVatNo")} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>PO Reference</label>
          <input placeholder="Optional" value={form.poReference} onChange={set("poReference")} className={inputClass} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Client Address</label>
          <input placeholder="Optional" value={form.clientAddress} onChange={set("clientAddress")} className={inputClass} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Service Description *</label>
        <textarea
          required
          rows={3}
          placeholder="e.g. Private chauffeur transfers, Riyadh, 14-19 Oct 2026, 2 vehicles"
          value={form.serviceDescription}
          onChange={set("serviceDescription")}
          className={inputClass}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Total Amount (VAT-inclusive) *</label>
          <input required type="number" min="0" step="0.01" placeholder="e.g. 5000" value={form.totalAmount} onChange={set("totalAmount")} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Currency</label>
          <input value={form.currency} onChange={set("currency")} className={inputClass} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Notes</label>
        <textarea rows={2} placeholder="Optional" value={form.notes} onChange={set("notes")} className={inputClass} />
      </div>

      <p className="text-[11px] text-[#7C8088] leading-relaxed">
        This generates a proforma invoice with Arabian Eagle Eyes&apos; VAT/CR/bank details for the client to arrange payment.
        It is not the official ZATCA tax invoice — that follows from Eagle Eyes after payment.
      </p>

      {error && <p className="text-xs text-red-400">{error}</p>}

      <button
        disabled={saving}
        type="submit"
        className="inline-flex items-center gap-2 rounded-lg bg-[#C9A84C]/15 border border-[#C9A84C]/25 px-5 py-2.5 text-xs font-bold text-[#C9A84C] hover:bg-[#C9A84C]/25 disabled:opacity-40"
      >
        {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
        {saving ? "Generating…" : "Generate PDF"}
      </button>
    </form>
  );
}
