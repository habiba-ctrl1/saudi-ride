"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Search, MapPin } from "lucide-react";

type RouteRow = {
  id: string;
  routeFamily: string;
  tripType: string;
  vehicleCategory: string;
  crossBorder: boolean;
  countryFrom: string | null;
  countryTo: string | null;
  lowestObserved: number | null;
  highestObserved: number | null;
  sourceCount: number;
  pricingStatus: string;
  finalApprovedPrice: number | null;
  approvalNotes: string | null;
};

const STATUS_OPTIONS = ["SINGLE_SOURCE", "MULTIPLE_SOURCES", "CONFLICTING", "NEEDS_CONFIRMATION", "APPROVED"];
const STATUS_LABEL: Record<string, { label: string; className: string }> = {
  SINGLE_SOURCE: { label: "Single Source", className: "bg-gray-500/10 text-gray-400 border-gray-500/20" },
  MULTIPLE_SOURCES: { label: "Multiple Sources", className: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  CONFLICTING: { label: "Conflicting Prices", className: "bg-red-500/10 text-red-400 border-red-500/20" },
  NEEDS_CONFIRMATION: { label: "Needs Confirmation", className: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" },
  APPROVED: { label: "Approved", className: "bg-green-500/10 text-green-500 border-green-500/20" },
};

const inputClass =
  "rounded-lg border border-[#333] bg-black/40 px-3 py-2 text-xs text-[#F5F0E8] outline-none focus:border-[#C9A84C]";

export function RouteReviewClient({ rows }: { rows: RouteRow[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [vehicleFilter, setVehicleFilter] = useState("All");
  const [crossBorderOnly, setCrossBorderOnly] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [drafts, setDrafts] = useState<Record<string, { finalApprovedPrice: string; approvalNotes: string; pricingStatus: string }>>({});

  const vehicleOptions = useMemo(
    () => ["All", ...Array.from(new Set(rows.map((r) => r.vehicleCategory))).sort()],
    [rows]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (q && !r.routeFamily.toLowerCase().includes(q)) return false;
      if (vehicleFilter !== "All" && r.vehicleCategory !== vehicleFilter) return false;
      if (crossBorderOnly && !r.crossBorder) return false;
      return true;
    });
  }, [rows, search, vehicleFilter, crossBorderOnly]);

  function draftFor(r: RouteRow) {
    return (
      drafts[r.id] ?? {
        finalApprovedPrice: r.finalApprovedPrice != null ? String(r.finalApprovedPrice) : "",
        approvalNotes: r.approvalNotes ?? "",
        pricingStatus: r.pricingStatus,
      }
    );
  }

  function setDraft(id: string, patch: Partial<{ finalApprovedPrice: string; approvalNotes: string; pricingStatus: string }>) {
    setDrafts((d) => ({ ...d, [id]: { ...draftFor(rows.find((r) => r.id === id)!), ...d[id], ...patch } }));
  }

  async function saveRow(r: RouteRow) {
    const draft = draftFor(r);
    setBusyId(r.id);
    setError("");
    try {
      const res = await fetch(`/api/admin/route-price-approvals/${r.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          final_approved_price: draft.finalApprovedPrice ? Number(draft.finalApprovedPrice) : null,
          approval_notes: draft.approvalNotes || null,
          pricing_status: draft.pricingStatus,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Update failed");
        return;
      }
      router.refresh();
    } catch {
      setError("Network error");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7C8088]" />
          <input
            placeholder="Search route…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`${inputClass} w-full pl-9`}
          />
        </div>
        <select value={vehicleFilter} onChange={(e) => setVehicleFilter(e.target.value)} className={inputClass}>
          {vehicleOptions.map((v) => (
            <option key={v} value={v} className="bg-[#121212]">{v}</option>
          ))}
        </select>
        <label className="flex items-center gap-2 text-xs text-[#A1A1A6] cursor-pointer select-none">
          <input type="checkbox" checked={crossBorderOnly} onChange={(e) => setCrossBorderOnly(e.target.checked)} className="accent-[#C9A84C]" />
          Cross-border only
        </label>
        <span className="text-xs text-[#7C8088]">{filtered.length} of {rows.length} shown</span>
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}

      <div className="bg-[#111] border border-[#C9A84C]/15 rounded-2xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <MapPin className="h-12 w-12 text-[#7C8088] mx-auto mb-4" />
            <h3 className="font-heading text-xl font-bold text-[#F5F0E8] mb-2">No Routes Match</h3>
            <p className="text-sm text-[#A1A1A6]">Try clearing the filters above.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#1A1A1A] border-b border-[#C9A84C]/10 text-[0.65rem] uppercase tracking-widest text-[#7C8088]">
                  <th className="p-4 font-bold">Route</th>
                  <th className="p-4 font-bold">Vehicle</th>
                  <th className="p-4 font-bold">Trip</th>
                  <th className="p-4 font-bold">Observed Range</th>
                  <th className="p-4 font-bold">Sources</th>
                  <th className="p-4 font-bold">Status</th>
                  <th className="p-4 font-bold">Final Approved Price</th>
                  <th className="p-4 font-bold">Approval Notes</th>
                  <th className="p-4 font-bold text-right">Save</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#C9A84C]/5">
                {filtered.map((r) => {
                  const busy = busyId === r.id;
                  const draft = draftFor(r);
                  const status = STATUS_LABEL[draft.pricingStatus] ?? STATUS_LABEL.NEEDS_CONFIRMATION;
                  return (
                    <tr key={r.id} className="hover:bg-[#1A1A1A]/50 transition-colors align-top">
                      <td className="p-4 text-sm font-bold text-[#F5F0E8]">
                        {r.routeFamily}
                        {r.crossBorder && (
                          <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[0.55rem] font-bold uppercase tracking-wider border bg-blue-500/10 text-blue-400 border-blue-500/20">
                            {r.countryFrom} → {r.countryTo}
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-sm text-[#A1A1A6]">{r.vehicleCategory}</td>
                      <td className="p-4 text-sm text-[#A1A1A6]">{r.tripType === "ONE_WAY" ? "One-way" : "Round-trip"}</td>
                      <td className="p-4 text-sm font-mono text-[#C9A84C]">
                        {r.lowestObserved === r.highestObserved
                          ? `SAR ${r.lowestObserved?.toLocaleString()}`
                          : `SAR ${r.lowestObserved?.toLocaleString()}–${r.highestObserved?.toLocaleString()}`}
                      </td>
                      <td className="p-4 text-sm text-[#A1A1A6]">{r.sourceCount}</td>
                      <td className="p-4">
                        <select
                          value={draft.pricingStatus}
                          onChange={(e) => setDraft(r.id, { pricingStatus: e.target.value })}
                          className={`${inputClass} text-[0.65rem]`}
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s} className="bg-[#121212]">{STATUS_LABEL[s].label}</option>
                          ))}
                        </select>
                        <span className={`mt-1 inline-flex items-center px-2 py-0.5 rounded text-[0.55rem] font-bold uppercase tracking-wider border ${status.className}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="p-4">
                        <input
                          type="number"
                          min={0}
                          placeholder="Not approved yet"
                          value={draft.finalApprovedPrice}
                          onChange={(e) => setDraft(r.id, { finalApprovedPrice: e.target.value })}
                          className={`${inputClass} w-32`}
                        />
                      </td>
                      <td className="p-4">
                        <input
                          placeholder="Approval notes…"
                          value={draft.approvalNotes}
                          onChange={(e) => setDraft(r.id, { approvalNotes: e.target.value })}
                          className={`${inputClass} w-48`}
                        />
                      </td>
                      <td className="p-4 text-right">
                        <button
                          disabled={busy}
                          onClick={() => saveRow(r)}
                          className="rounded-lg bg-[#C9A84C]/15 border border-[#C9A84C]/25 px-3 py-2 text-xs font-bold text-[#C9A84C] hover:bg-[#C9A84C]/25 disabled:opacity-40"
                        >
                          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
                        </button>
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
