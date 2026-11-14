"use client";

import { useState } from "react";
import { Loader2, Search, AlertTriangle, CheckCircle2, CircleSlash } from "lucide-react";
import type { LookupResult } from "@/lib/pricing/lookup";

const inputClass =
  "rounded-lg border border-[#333] bg-black/40 px-3 py-2 text-xs text-[#F5F0E8] outline-none focus:border-[#C9A84C]";
const sar = (n: number | null | undefined) => (n == null ? "—" : `SAR ${n.toLocaleString()}`);

export function PricingLookupPanel() {
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [vehicle, setVehicle] = useState("sedan");
  const [tripType, setTripType] = useState("one_way");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [res, setRes] = useState<LookupResult | null>(null);

  async function run(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const qs = new URLSearchParams({ pickup, drop, vehicle, tripType });
      const r = await fetch(`/api/admin/pricing/lookup?${qs}`);
      const data = await r.json();
      if (!r.ok) setError(data.error || "Lookup failed");
      else setRes(data.result);
    } catch {
      setError("Network error");
    } finally {
      setBusy(false);
    }
  }

  const rule = res?.rule;
  const ok = res && (res.state === "match" || res.state === "reverse_match");

  return (
    <div className="bg-[#111] border border-[#C9A84C]/15 rounded-2xl p-5 space-y-4">
      <div>
        <h2 className="font-heading text-lg font-bold text-[#F5F0E8]">Price Lookup</h2>
        <p className="text-xs text-[#7C8088]">Same check the quotation form will run. Read-only — nothing is ever sent to a customer from here.</p>
      </div>
      <form onSubmit={run} className="flex flex-wrap gap-3 items-end">
        <input required placeholder="Pickup (e.g. Jeddah Airport)" value={pickup} onChange={(e) => setPickup(e.target.value)} className={`${inputClass} w-56`} />
        <input required placeholder="Drop-off (e.g. Makkah Haram)" value={drop} onChange={(e) => setDrop(e.target.value)} className={`${inputClass} w-56`} />
        <select value={vehicle} onChange={(e) => setVehicle(e.target.value)} className={inputClass}>
          <option value="sedan" className="bg-[#121212]">Sedan</option>
          <option value="suv" className="bg-[#121212]">SUV (GMC)</option>
          <option value="van" className="bg-[#121212]">Van (Staria)</option>
          <option value="limousine" className="bg-[#121212]">Luxury / VIP</option>
          <option value="bus" className="bg-[#121212]">Bus</option>
        </select>
        <select value={tripType} onChange={(e) => setTripType(e.target.value)} className={inputClass}>
          <option value="one_way" className="bg-[#121212]">One-way</option>
          <option value="round_trip" className="bg-[#121212]">Round-trip</option>
        </select>
        <button disabled={busy} className="inline-flex items-center gap-2 rounded-lg bg-[#C9A84C]/15 border border-[#C9A84C]/25 px-4 py-2 text-xs font-bold text-[#C9A84C] hover:bg-[#C9A84C]/25 disabled:opacity-40">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />} Check
        </button>
      </form>
      {error && <p className="text-xs text-red-400">{error}</p>}

      {res && (
        <div className="space-y-3 text-sm">
          <div className={`flex items-start gap-2 ${ok ? "text-green-500" : res.state === "no_price" ? "text-yellow-500" : "text-[#A1A1A6]"}`}>
            {ok ? <CheckCircle2 className="h-4 w-4 mt-0.5" /> : res.state === "no_price" ? <AlertTriangle className="h-4 w-4 mt-0.5" /> : <CircleSlash className="h-4 w-4 mt-0.5" />}
            <span className="font-bold">{res.message}</span>
          </div>

          {rule && (
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                ["Route", `${rule.route_family} · ${rule.vehicle_category} · ${rule.trip_type}`],
                [`Range${rule.range_source ? ` (${rule.range_source})` : ""}`,
                  rule.range_low_effective == null ? "—" : rule.range_low_effective === rule.range_high_effective ? sar(rule.range_low_effective) : `SAR ${rule.range_low_effective?.toLocaleString()}–${rule.range_high_effective?.toLocaleString()}`],
                ["Recommended", sar(rule.final_approved_price)],
                ["Minimum", sar(rule.price_min)],
                ["Est. cost → margin", rule.est_cost == null ? "cost not set" : `${sar(rule.est_cost + (rule.border_fee ?? 0))} → ${rule.expected_margin == null ? "—" : sar(rule.expected_margin)}`],
              ].map(([k, v]) => (
                <div key={k} className="bg-black/30 border border-[#333] rounded-xl p-3">
                  <div className="text-[0.6rem] uppercase tracking-widest text-[#7C8088]">{k}</div>
                  <div className="mt-1 font-mono text-[#F5F0E8] text-xs">{v}</div>
                </div>
              ))}
            </div>
          )}
          {rule?.conflict && (
            <p className="flex items-center gap-2 text-xs text-red-400"><AlertTriangle className="h-4 w-4" /> Conflicting past prices for this route — confirm the active price in the table below.</p>
          )}

          {res.alternatives.length > 0 && (
            <div>
              <div className="text-[0.6rem] uppercase tracking-widest text-[#7C8088] mb-1">Other rules on this route</div>
              <div className="flex flex-wrap gap-2">
                {res.alternatives.map((a) => (
                  <span key={a.id} className="text-xs border border-[#333] rounded-lg px-2 py-1 text-[#A1A1A6]">
                    {a.vehicle_category} · {a.trip_type}: {a.final_approved_price != null ? sar(a.final_approved_price) : a.lowest_observed != null ? `observed ${sar(a.lowest_observed)}${a.highest_observed !== a.lowest_observed ? `–${a.highest_observed?.toLocaleString()}` : ""}` : "no price yet"}
                  </span>
                ))}
              </div>
            </div>
          )}

          {res.history.length > 0 && (
            <div>
              <div className="text-[0.6rem] uppercase tracking-widest text-[#7C8088] mb-1">Real past quotes on this corridor</div>
              <table className="w-full text-xs text-left">
                <thead className="text-[#7C8088]"><tr><th className="py-1">Ref</th><th>Client</th><th>Date</th><th>Quoted</th><th>Paid</th><th>Driver cost</th><th>Margin</th></tr></thead>
                <tbody className="text-[#A1A1A6]">
                  {res.history.map((h) => (
                    <tr key={h.quote_reference} className="border-t border-[#C9A84C]/5">
                      <td className="py-1 font-mono">{h.quote_reference}</td><td>{h.customer_name}</td><td>{h.trip_date}</td>
                      <td>{sar(h.quoted_price)}</td><td>{sar(h.paid)}</td><td>{sar(h.driver_cost)}</td>
                      <td className={h.margin != null && h.margin < 0 ? "text-red-400 font-bold" : ""}>{h.margin == null ? "—" : sar(h.margin)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
