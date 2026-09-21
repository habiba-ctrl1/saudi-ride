"use client";

import { Fragment, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, ToggleRight, Trash2, Loader2, BookOpen, Search, ChevronDown, ChevronRight } from "lucide-react";

type PriceBookEntry = {
  id: string;
  fromCity: string;
  toCity: string;
  vehicleType: string;
  price: number;
  currency: string;
  tripType: string;
  notes: string | null;
  source: string;
  isActive: boolean;
  routeFamily: string | null;
  crossBorder: boolean;
  priceKind: string;
  createdAt: string;
};

const VEHICLE_TYPES = ["Sedan", "SUV", "Van", "Luxury", "Bus"];
const TRIP_TYPES = ["ONE_WAY", "ROUND_TRIP"];

const inputClass =
  "rounded-lg border border-[#333] bg-black/40 px-3 py-2 text-xs text-[#F5F0E8] outline-none focus:border-[#C9A84C]";

const PRICE_KIND_LABEL: Record<string, { label: string; className: string }> = {
  CLIENT_OBSERVED: { label: "Client Quote", className: "bg-green-500/10 text-green-500 border-green-500/20" },
  VENDOR_COST: { label: "Vendor Cost", className: "bg-gray-500/10 text-gray-400 border-gray-500/20" },
  DERIVED_SUGGESTED: { label: "Derived +Margin", className: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" },
};

export function PricingBookClient({ entries }: { entries: PriceBookEntry[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [search, setSearch] = useState("");
  const [pickupFilter, setPickupFilter] = useState("");
  const [destinationFilter, setDestinationFilter] = useState("");
  const [vehicleFilter, setVehicleFilter] = useState("All");
  const [crossBorderOnly, setCrossBorderOnly] = useState(false);
  const [form, setForm] = useState({
    from_city: "",
    to_city: "",
    vehicle_type: VEHICLE_TYPES[0],
    price: "",
    trip_type: "ONE_WAY",
    notes: "",
  });

  const vehicleOptions = useMemo(
    () => ["All", ...Array.from(new Set(entries.map((e) => e.vehicleType))).sort()],
    [entries]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const pickupQ = pickupFilter.trim().toLowerCase();
    const destQ = destinationFilter.trim().toLowerCase();
    return entries.filter((e) => {
      if (q && !(e.fromCity.toLowerCase().includes(q) || e.toCity.toLowerCase().includes(q) || e.vehicleType.toLowerCase().includes(q))) return false;
      if (pickupQ && !e.fromCity.toLowerCase().includes(pickupQ)) return false;
      if (destQ && !e.toCity.toLowerCase().includes(destQ)) return false;
      if (vehicleFilter !== "All" && e.vehicleType !== vehicleFilter) return false;
      if (crossBorderOnly && !e.crossBorder) return false;
      return true;
    });
  }, [entries, search, pickupFilter, destinationFilter, vehicleFilter, crossBorderOnly]);

  // Same route + same vehicle + same trip type -> one row with a price range,
  // instead of one row per individual quote (which reads as duplicates).
  const groups = useMemo(() => {
    const map = new Map<string, { fromCity: string; toCity: string; vehicleType: string; tripType: string; crossBorder: boolean; entries: PriceBookEntry[] }>();
    for (const e of filtered) {
      const key = `${e.fromCity}|${e.toCity}|${e.vehicleType}|${e.tripType}`;
      const g = map.get(key);
      if (g) {
        g.entries.push(e);
      } else {
        map.set(key, { fromCity: e.fromCity, toCity: e.toCity, vehicleType: e.vehicleType, tripType: e.tripType, crossBorder: e.crossBorder, entries: [e] });
      }
    }
    return Array.from(map.values())
      .map((g) => ({ ...g, entries: g.entries.sort((a, b) => a.price - b.price) }))
      .sort((a, b) => a.fromCity.localeCompare(b.fromCity) || a.toCity.localeCompare(b.toCity));
  }, [filtered]);

  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  function toggleExpanded(key: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  async function createEntry(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setError("");
    try {
      const res = await fetch("/api/admin/pricing-book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from_city: form.from_city,
          to_city: form.to_city,
          vehicle_type: form.vehicle_type,
          price: Number(form.price),
          trip_type: form.trip_type,
          notes: form.notes || undefined,
          source: "admin_manual",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not save price");
        return;
      }
      setForm({ from_city: "", to_city: "", vehicle_type: VEHICLE_TYPES[0], price: "", trip_type: "ONE_WAY", notes: "" });
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
      const res = await fetch(`/api/admin/pricing-book/${id}`, {
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

  async function deleteEntry(id: string, label: string) {
    if (!confirm(`Delete price for "${label}"? This cannot be undone.`)) return;
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/pricing-book/${id}`, { method: "DELETE" });
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <button
          onClick={() => setShowForm((v) => !v)}
          className="inline-flex items-center gap-2 bg-[#C9A84C] text-[#0A0A0A] font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-lg hover:bg-[#B8963B] transition-colors w-fit"
        >
          <Plus className="h-4 w-4" /> {showForm ? "Cancel" : "Add Price"}
        </button>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7C8088]" />
          <input
            placeholder="Search route or vehicle…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`${inputClass} w-full pl-9`}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <input
          placeholder="Filter: pickup contains…"
          value={pickupFilter}
          onChange={(e) => setPickupFilter(e.target.value)}
          className={`${inputClass} w-full sm:w-52`}
        />
        <input
          placeholder="Filter: destination contains…"
          value={destinationFilter}
          onChange={(e) => setDestinationFilter(e.target.value)}
          className={`${inputClass} w-full sm:w-52`}
        />
        <select value={vehicleFilter} onChange={(e) => setVehicleFilter(e.target.value)} className={inputClass}>
          {vehicleOptions.map((v) => (
            <option key={v} value={v} className="bg-[#121212]">{v}</option>
          ))}
        </select>
        <label className="flex items-center gap-2 text-xs text-[#A1A1A6] cursor-pointer select-none">
          <input type="checkbox" checked={crossBorderOnly} onChange={(e) => setCrossBorderOnly(e.target.checked)} className="accent-[#C9A84C]" />
          Cross-border only
        </label>
        <span className="text-xs text-[#7C8088]">{filtered.length} of {entries.length} shown</span>
      </div>

      {showForm && (
        <form onSubmit={createEntry} className="bg-[#111] border border-[#C9A84C]/15 rounded-2xl p-5 grid gap-3 sm:grid-cols-6">
          <input required placeholder="From (e.g. Riyadh)" value={form.from_city} onChange={(e) => setForm((f) => ({ ...f, from_city: e.target.value }))} className={inputClass} />
          <input required placeholder="To (e.g. Makkah)" value={form.to_city} onChange={(e) => setForm((f) => ({ ...f, to_city: e.target.value }))} className={inputClass} />
          <select value={form.vehicle_type} onChange={(e) => setForm((f) => ({ ...f, vehicle_type: e.target.value }))} className={inputClass}>
            {VEHICLE_TYPES.map((v) => (
              <option key={v} value={v} className="bg-[#121212]">{v}</option>
            ))}
          </select>
          <input required type="number" min={0} step="0.01" placeholder="Price (SAR)" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} className={inputClass} />
          <select value={form.trip_type} onChange={(e) => setForm((f) => ({ ...f, trip_type: e.target.value }))} className={inputClass}>
            {TRIP_TYPES.map((t) => (
              <option key={t} value={t} className="bg-[#121212]">{t === "ONE_WAY" ? "One-way" : "Round-trip"}</option>
            ))}
          </select>
          <input placeholder="Notes / client ref (optional)" value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} className={inputClass} />
          <div className="sm:col-span-6 flex items-center gap-3">
            <button disabled={creating} type="submit" className="rounded-lg bg-[#C9A84C]/15 border border-[#C9A84C]/25 px-3 py-2 text-xs font-bold text-[#C9A84C] hover:bg-[#C9A84C]/25 disabled:opacity-40">
              {creating ? "Saving…" : "Save Price"}
            </button>
          </div>
        </form>
      )}

      {error && <p className="text-xs text-red-400">{error}</p>}

      <div className="bg-[#111] border border-[#C9A84C]/15 rounded-2xl overflow-hidden">
        {groups.length === 0 ? (
          <div className="p-12 text-center">
            <BookOpen className="h-12 w-12 text-[#7C8088] mx-auto mb-4" />
            <h3 className="font-heading text-xl font-bold text-[#F5F0E8] mb-2">No Prices Saved Yet</h3>
            <p className="text-sm text-[#A1A1A6]">Add a price above every time you quote a client so it&apos;s here next time.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#1A1A1A] border-b border-[#C9A84C]/10 text-[0.65rem] uppercase tracking-widest text-[#7C8088]">
                  <th className="p-4 font-bold">Route</th>
                  <th className="p-4 font-bold">Vehicle</th>
                  <th className="p-4 font-bold">Trip</th>
                  <th className="p-4 font-bold">Price Range</th>
                  <th className="p-4 font-bold">Quotes</th>
                  <th className="p-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#C9A84C]/5">
                {groups.map((g) => {
                  const key = `${g.fromCity}|${g.toCity}|${g.vehicleType}|${g.tripType}`;
                  const isOpen = expanded.has(key);
                  const prices = g.entries.map((e) => e.price);
                  const lo = Math.min(...prices);
                  const hi = Math.max(...prices);
                  const currency = g.entries[0].currency;
                  return (
                    <Fragment key={key}>
                      <tr className="hover:bg-[#1A1A1A]/50 transition-colors cursor-pointer" onClick={() => toggleExpanded(key)}>
                        <td className="p-4 text-sm font-bold text-[#F5F0E8]">
                          <div className="flex items-center gap-2">
                            {g.entries.length > 1 ? (isOpen ? <ChevronDown className="h-3.5 w-3.5 text-[#7C8088] shrink-0" /> : <ChevronRight className="h-3.5 w-3.5 text-[#7C8088] shrink-0" />) : <span className="w-3.5 shrink-0" />}
                            <span>{g.fromCity} → {g.toCity}</span>
                            {g.crossBorder && (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[0.55rem] font-bold uppercase tracking-wider border bg-blue-500/10 text-blue-400 border-blue-500/20">
                                Cross-border
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-sm text-[#A1A1A6]">{g.vehicleType}</td>
                        <td className="p-4 text-sm text-[#A1A1A6]">{g.tripType === "ONE_WAY" ? "One-way" : "Round-trip"}</td>
                        <td className="p-4 text-sm font-mono font-bold text-[#C9A84C]">
                          {lo === hi ? `${currency} ${lo.toLocaleString()}` : `${currency} ${lo.toLocaleString()}–${hi.toLocaleString()}`}
                        </td>
                        <td className="p-4 text-xs text-[#A1A1A6]">{g.entries.length} quote{g.entries.length > 1 ? "s" : ""}</td>
                        <td className="p-4 text-right text-[0.65rem] text-[#7C8088]">{g.entries.length > 1 ? (isOpen ? "Hide" : "View all") : ""}</td>
                      </tr>
                      {isOpen && g.entries.map((e) => {
                        const busy = busyId === e.id;
                        const kind = PRICE_KIND_LABEL[e.priceKind] ?? PRICE_KIND_LABEL.CLIENT_OBSERVED;
                        return (
                          <tr key={e.id} className="bg-black/20">
                            <td className="p-3 pl-11 text-xs text-[#A1A1A6]" colSpan={2}>
                              <span className={`inline-flex items-center px-2 py-0.5 mr-2 rounded text-[0.55rem] font-bold uppercase tracking-wider border ${kind.className}`}>
                                {kind.label}
                              </span>
                              <span className="truncate">{e.notes || "—"}</span>
                            </td>
                            <td className="p-3 text-xs text-[#A1A1A6]">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-[0.55rem] font-bold uppercase tracking-wider border ${e.isActive ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"}`}>
                                {e.isActive ? "Active" : "Inactive"}
                              </span>
                            </td>
                            <td className="p-3 text-xs font-mono font-bold text-[#C9A84C]">{e.currency} {e.price.toLocaleString()}</td>
                            <td className="p-3" />
                            <td className="p-3 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button disabled={busy} onClick={() => toggleActive(e.id, e.isActive)} className="p-1.5 rounded-lg border border-[#333] text-[#A1A1A6] hover:border-[#C9A84C]/40 disabled:opacity-40">
                                  {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ToggleRight className={`h-3.5 w-3.5 ${e.isActive ? "text-green-500" : "text-red-500"}`} />}
                                </button>
                                <button disabled={busy} onClick={() => deleteEntry(e.id, `${e.fromCity} → ${e.toCity}`)} className="p-1.5 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 disabled:opacity-40">
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </Fragment>
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
