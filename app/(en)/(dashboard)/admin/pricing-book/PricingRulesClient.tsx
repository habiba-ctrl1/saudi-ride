"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Search, MapPin } from "lucide-react";

export type RuleRowUI = {
  id: string;
  routeFamily: string;
  tripType: string;
  vehicleCategory: string;
  category: string | null;
  crossBorder: boolean;
  countryFrom: string | null;
  countryTo: string | null;
  lowestObserved: number | null;
  highestObserved: number | null;
  sourceCount: number;
  pricingStatus: string;
  finalApprovedPrice: number | null;
  rangeLow: number | null;
  rangeHigh: number | null;
  priceMin: number | null;
  estCost: number | null;
  borderFee: number | null;
  approvalNotes: string | null;
};

const TABS: { key: string; label: string }[] = [
  { key: "all", label: "All" },
  { key: "riyadh", label: "Riyadh" },
  { key: "airport_city", label: "Airport & City" },
  { key: "intercity", label: "Intercity" },
  { key: "border", label: "Border / International" },
  { key: "ziyarat", label: "Ziyarat" },
];

const STATUS_LABEL: Record<string, { label: string; className: string }> = {
  SINGLE_SOURCE: { label: "Single source", className: "bg-gray-500/10 text-gray-400 border-gray-500/20" },
  MULTIPLE_SOURCES: { label: "Multiple sources", className: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  CONFLICTING: { label: "Conflict — confirm", className: "bg-red-500/10 text-red-400 border-red-500/20" },
  NEEDS_CONFIRMATION: { label: "No price yet", className: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" },
  APPROVED: { label: "Approved", className: "bg-green-500/10 text-green-500 border-green-500/20" },
};

const inputClass =
  "rounded-lg border border-[#333] bg-black/40 px-2 py-1.5 text-xs text-[#F5F0E8] outline-none focus:border-[#C9A84C]";

type Draft = { rangeLow: string; rangeHigh: string; rec: string; min: string; cost: string; border: string; notes: string; status: string };

const toStr = (n: number | null) => (n != null ? String(n) : "");
const toNum = (s: string) => (s.trim() === "" ? null : Number(s));

export function PricingRulesClient({ rows }: { rows: RuleRowUI[] }) {
  const router = useRouter();
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [vehicle, setVehicle] = useState("All");
  const [view, setView] = useState<"all" | "needs_price" | "conflicts">("all");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: rows.length };
    rows.forEach((r) => { const k = r.category ?? "intercity"; c[k] = (c[k] ?? 0) + 1; });
    return c;
  }, [rows]);
  const vehicles = useMemo(() => ["All", ...Array.from(new Set(rows.map((r) => r.vehicleCategory))).sort()], [rows]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (tab !== "all" && (r.category ?? "intercity") !== tab) return false;
      if (q && !r.routeFamily.toLowerCase().includes(q)) return false;
      if (vehicle !== "All" && r.vehicleCategory !== vehicle) return false;
      if (view === "needs_price" && (r.finalApprovedPrice != null || r.pricingStatus === "APPROVED")) return false;
      if (view === "conflicts" && r.pricingStatus !== "CONFLICTING") return false;
      return true;
    });
  }, [rows, tab, search, vehicle, view]);

  const draftFor = (r: RuleRowUI): Draft =>
    drafts[r.id] ?? {
      rangeLow: toStr(r.rangeLow), rangeHigh: toStr(r.rangeHigh), rec: toStr(r.finalApprovedPrice), min: toStr(r.priceMin),
      cost: toStr(r.estCost), border: toStr(r.borderFee), notes: r.approvalNotes ?? "", status: r.pricingStatus,
    };
  const setDraft = (r: RuleRowUI, patch: Partial<Draft>) => setDrafts((d) => ({ ...d, [r.id]: { ...draftFor(r), ...patch } }));

  async function save(r: RuleRowUI) {
    const d = draftFor(r);
    const nums = [d.rangeLow, d.rangeHigh, d.rec, d.min, d.cost, d.border].map(toNum);
    if (nums.some((n) => n != null && (!Number.isFinite(n) || n < 0))) return setError("Prices must be positive numbers");
    setBusyId(r.id);
    setError("");
    try {
      const res = await fetch(`/api/admin/route-price-approvals/${r.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          range_low: nums[0], range_high: nums[1], final_approved_price: nums[2], price_min: nums[3], est_cost: nums[4], border_fee: nums[5],
          approval_notes: d.notes || null,
          pricing_status: d.rec ? "APPROVED" : d.status === "APPROVED" ? "NEEDS_CONFIRMATION" : d.status,
        }),
      });
      if (!res.ok) setError((await res.json().catch(() => ({}))).error || "Update failed");
      else { setDrafts((x) => { const n = { ...x }; delete n[r.id]; return n; }); router.refresh(); }
    } catch {
      setError("Network error");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${tab === t.key ? "bg-[#C9A84C]/20 border-[#C9A84C]/40 text-[#C9A84C]" : "border-[#333] text-[#A1A1A6] hover:text-[#F5F0E8]"}`}>
            {t.label} <span className="opacity-60">{counts[t.key] ?? 0}</span>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full sm:w-60">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7C8088]" />
          <input placeholder="Search route…" value={search} onChange={(e) => setSearch(e.target.value)} className={`${inputClass} w-full pl-9 py-2`} />
        </div>
        <select value={vehicle} onChange={(e) => setVehicle(e.target.value)} className={inputClass}>
          {vehicles.map((v) => <option key={v} value={v} className="bg-[#121212]">{v}</option>)}
        </select>
        <select value={view} onChange={(e) => setView(e.target.value as typeof view)} className={inputClass}>
          <option value="all" className="bg-[#121212]">All rules</option>
          <option value="needs_price" className="bg-[#121212]">Recommended price not set</option>
          <option value="conflicts" className="bg-[#121212]">Conflicts only</option>
        </select>
        <span className="text-xs text-[#7C8088]">{filtered.length} of {rows.length}</span>
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}

      <div className="bg-[#111] border border-[#C9A84C]/15 rounded-2xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <MapPin className="h-10 w-10 text-[#7C8088] mx-auto mb-3" />
            <p className="text-sm text-[#A1A1A6]">No rules match these filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#1A1A1A] border-b border-[#C9A84C]/10 text-[0.6rem] uppercase tracking-widest text-[#7C8088]">
                  <th className="p-3">Route · vehicle</th>
                  <th className="p-3">Observed</th>
                  <th className="p-3">Range low–high</th>
                  <th className="p-3">Recommended</th>
                  <th className="p-3">Min</th>
                  <th className="p-3">Est. cost</th>
                  <th className="p-3">Border fee</th>
                  <th className="p-3">Margin</th>
                  <th className="p-3">Notes</th>
                  <th className="p-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-[#C9A84C]/5">
                {filtered.map((r) => {
                  const d = draftFor(r);
                  const st = STATUS_LABEL[d.status] ?? STATUS_LABEL.NEEDS_CONFIRMATION;
                  const rec = toNum(d.rec), cost = toNum(d.cost);
                  const margin = rec != null && cost != null ? rec - cost - (toNum(d.border) ?? 0) : null;
                  const dirty = !!drafts[r.id];
                  return (
                    <tr key={r.id} className="align-top hover:bg-[#1A1A1A]/50">
                      <td className="p-3">
                        <div className="text-sm font-bold text-[#F5F0E8]">{r.routeFamily}</div>
                        <div className="text-xs text-[#A1A1A6] mt-0.5">{r.vehicleCategory} · {r.tripType}
                          {r.crossBorder && <span className="ml-1 text-blue-400">{r.countryFrom}→{r.countryTo}</span>}</div>
                        <span className={`mt-1 inline-flex px-1.5 py-0.5 rounded text-[0.55rem] font-bold uppercase tracking-wider border ${st.className}`}>{st.label}</span>
                      </td>
                      <td className="p-3 text-xs font-mono text-[#C9A84C] whitespace-nowrap">
                        {r.lowestObserved == null ? <span className="text-[#7C8088]">none</span>
                          : r.lowestObserved === r.highestObserved ? `${r.lowestObserved.toLocaleString()}` : `${r.lowestObserved.toLocaleString()}–${r.highestObserved?.toLocaleString()}`}
                        <div className="text-[#7C8088]">{r.sourceCount} src</div>
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <input type="number" min={0} value={d.rangeLow} onChange={(e) => setDraft(r, { rangeLow: e.target.value })} className={`${inputClass} w-16`} />
                        <span className="mx-1 text-[#7C8088]">–</span>
                        <input type="number" min={0} value={d.rangeHigh} onChange={(e) => setDraft(r, { rangeHigh: e.target.value })} className={`${inputClass} w-16`} />
                      </td>
                      <td className="p-3"><input type="number" min={0} value={d.rec} onChange={(e) => setDraft(r, { rec: e.target.value })} className={`${inputClass} w-20`} /></td>
                      <td className="p-3"><input type="number" min={0} value={d.min} onChange={(e) => setDraft(r, { min: e.target.value })} className={`${inputClass} w-20`} /></td>
                      <td className="p-3"><input type="number" min={0} value={d.cost} onChange={(e) => setDraft(r, { cost: e.target.value })} className={`${inputClass} w-20`} /></td>
                      <td className="p-3">
                        {r.crossBorder ? <input type="number" min={0} value={d.border} onChange={(e) => setDraft(r, { border: e.target.value })} className={`${inputClass} w-20`} /> : <span className="text-[#7C8088] text-xs">n/a</span>}
                      </td>
                      <td className={`p-3 text-xs font-mono ${margin != null && margin < 0 ? "text-red-400 font-bold" : "text-[#F5F0E8]"}`}>{margin == null ? "—" : margin.toLocaleString()}</td>
                      <td className="p-3"><input placeholder="Notes" value={d.notes} onChange={(e) => setDraft(r, { notes: e.target.value })} className={`${inputClass} w-40`} /></td>
                      <td className="p-3 text-right">
                        <button disabled={busyId === r.id || !dirty} onClick={() => save(r)}
                          className="rounded-lg bg-[#C9A84C]/15 border border-[#C9A84C]/25 px-3 py-1.5 text-xs font-bold text-[#C9A84C] hover:bg-[#C9A84C]/25 disabled:opacity-30">
                          {busyId === r.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
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
      <p className="text-[0.7rem] text-[#7C8088]">
        Observed = what clients were actually quoted (history only). Recommended/Min/Est. cost/Range are yours — nothing becomes a price until you set it here.
        Saving a recommended price marks the rule Approved. Naimat&apos;s rate card is excluded.
      </p>
    </div>
  );
}
