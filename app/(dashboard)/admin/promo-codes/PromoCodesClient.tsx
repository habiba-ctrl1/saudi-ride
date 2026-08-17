"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, ToggleRight, Trash2, Loader2, Tag } from "lucide-react";

type PromoCode = {
  id: string;
  code: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  minOrderValue: number;
  maxUses: number | null;
  usedCount: number;
  validUntil: string | null;
  isActive: boolean;
  createdAt: string;
};

const inputClass = "rounded-lg border border-[#333] bg-black/40 px-3 py-2 text-xs text-[#F5F0E8] outline-none focus:border-[#C9A84C]";

export function PromoCodesClient({ promoCodes }: { promoCodes: PromoCode[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ code: "", discount_type: "PERCENTAGE", discount_value: "", min_order_value: "", max_uses: "" });

  async function createCode(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setError("");
    try {
      const res = await fetch("/api/admin/promo-codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: form.code,
          discount_type: form.discount_type,
          discount_value: Number(form.discount_value),
          min_order_value: form.min_order_value ? Number(form.min_order_value) : 0,
          max_uses: form.max_uses ? Number(form.max_uses) : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not create code");
        return;
      }
      setForm({ code: "", discount_type: "PERCENTAGE", discount_value: "", min_order_value: "", max_uses: "" });
      setShowForm(false);
      router.refresh();
    } catch {
      setError("Network error");
    } finally {
      setCreating(false);
    }
  }

  async function toggleActive(id: string, isActive: boolean) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/promo-codes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !isActive }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Update failed");
        return;
      }
      router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  async function deleteCode(id: string, code: string) {
    if (!confirm(`Delete promo code "${code}"? This cannot be undone.`)) return;
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/promo-codes/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Delete failed");
        return;
      }
      router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowForm((v) => !v)}
          className="inline-flex items-center gap-2 bg-[#C9A84C] text-[#0A0A0A] font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-lg hover:bg-[#B8963B] transition-colors w-fit"
        >
          <Plus className="h-4 w-4" /> {showForm ? "Cancel" : "New Promo Code"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={createCode} className="bg-[#111] border border-[#C9A84C]/15 rounded-2xl p-5 grid gap-3 sm:grid-cols-5">
          <input required placeholder="CODE" value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))} className={inputClass} />
          <select value={form.discount_type} onChange={(e) => setForm((f) => ({ ...f, discount_type: e.target.value }))} className={inputClass}>
            <option value="PERCENTAGE" className="bg-[#121212]">Percentage %</option>
            <option value="FIXED" className="bg-[#121212]">Fixed SAR</option>
          </select>
          <input required type="number" min={0} placeholder="Value" value={form.discount_value} onChange={(e) => setForm((f) => ({ ...f, discount_value: e.target.value }))} className={inputClass} />
          <input type="number" min={0} placeholder="Min order (SAR)" value={form.min_order_value} onChange={(e) => setForm((f) => ({ ...f, min_order_value: e.target.value }))} className={inputClass} />
          <input type="number" min={0} placeholder="Max uses" value={form.max_uses} onChange={(e) => setForm((f) => ({ ...f, max_uses: e.target.value }))} className={inputClass} />
          <div className="sm:col-span-5 flex items-center gap-3">
            <button disabled={creating} type="submit" className="rounded-lg bg-[#C9A84C]/15 border border-[#C9A84C]/25 px-3 py-2 text-xs font-bold text-[#C9A84C] hover:bg-[#C9A84C]/25 disabled:opacity-40">
              {creating ? "Creating…" : "Create"}
            </button>
          </div>
        </form>
      )}

      {error && <p className="text-xs text-red-400">{error}</p>}

      <div className="bg-[#111] border border-[#C9A84C]/15 rounded-2xl overflow-hidden">
        {promoCodes.length === 0 ? (
          <div className="p-12 text-center">
            <Tag className="h-12 w-12 text-[#7C8088] mx-auto mb-4" />
            <h3 className="font-heading text-xl font-bold text-[#F5F0E8] mb-2">No Promo Codes Yet</h3>
            <p className="text-sm text-[#A1A1A6]">Create one above to offer a discount.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#1A1A1A] border-b border-[#C9A84C]/10 text-[0.65rem] uppercase tracking-widest text-[#7C8088]">
                  <th className="p-4 font-bold">Code</th>
                  <th className="p-4 font-bold">Discount</th>
                  <th className="p-4 font-bold">Min Order</th>
                  <th className="p-4 font-bold">Uses</th>
                  <th className="p-4 font-bold">Status</th>
                  <th className="p-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#C9A84C]/5">
                {promoCodes.map((p) => {
                  const busy = busyId === p.id;
                  return (
                    <tr key={p.id} className="hover:bg-[#1A1A1A]/50 transition-colors">
                      <td className="p-4 font-mono text-sm font-bold text-[#C9A84C]">{p.code}</td>
                      <td className="p-4 text-sm text-[#F5F0E8]">
                        {p.discountType === "PERCENTAGE" ? `${p.discountValue}%` : `SAR ${p.discountValue}`}
                      </td>
                      <td className="p-4 text-sm text-[#A1A1A6]">SAR {p.minOrderValue}</td>
                      <td className="p-4 text-sm text-[#A1A1A6]">{p.usedCount}{p.maxUses ? ` / ${p.maxUses}` : ""}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded text-[0.55rem] font-bold uppercase tracking-wider border ${p.isActive ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"}`}>
                          {p.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button disabled={busy} onClick={() => toggleActive(p.id, p.isActive)} className="p-2 rounded-lg border border-[#333] text-[#A1A1A6] hover:border-[#C9A84C]/40 disabled:opacity-40">
                            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ToggleRight className={`h-4 w-4 ${p.isActive ? "text-green-500" : "text-red-500"}`} />}
                          </button>
                          <button disabled={busy} onClick={() => deleteCode(p.id, p.code)} className="p-2 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 disabled:opacity-40">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
