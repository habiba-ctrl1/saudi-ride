"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Loader2, Search, AlertTriangle, CheckCircle2, CircleSlash, UserPlus } from "lucide-react";
import type { LookupResult } from "@/lib/pricing/lookup";

type Client = { id: string; name: string; phone: string | null; email: string | null; rides: number };

const input = "w-full rounded-lg border border-[#333] bg-black/40 px-3 py-2 text-sm text-[#F5F0E8] outline-none focus:border-[#C9A84C]";
const label = "block text-[0.65rem] font-bold uppercase tracking-widest text-[#7C8088] mb-1";
const sar = (n: number | null | undefined) => (n == null ? "—" : `SAR ${n.toLocaleString()}`);

export function NewQuotationClient() {
  const router = useRouter();
  // Optional prefill from a website enquiry: /admin/quotations/new?name=&phone=&pickup=&drop=&date=&time=&vehicle=
  const sp = useSearchParams();
  const vehicleFromLead = (v: string | null) => {
    const x = (v ?? "").toLowerCase();
    return x.includes("suv") || x.includes("gmc") ? "suv" : x.includes("van") || x.includes("staria") ? "van" : x.includes("lux") || x.includes("vip") ? "limousine" : x.includes("bus") || x.includes("coach") ? "bus" : "sedan";
  };
  const [f, setF] = useState({
    name: sp.get("name") ?? "", phone: sp.get("phone") ?? "", email: "", source: sp.get("name") || sp.get("phone") ? "website" : "whatsapp",
    pickup: sp.get("pickup") ?? "", drop: sp.get("drop") ?? "", tripType: "one_way", date: sp.get("date") ?? "", time: sp.get("time") ?? "", returnDate: "",
    pax: "", luggage: "", vehicle: vehicleFromLead(sp.get("vehicle")), price: "", estCost: "", validUntil: "", notes: "",
  });
  const set = (k: keyof typeof f, v: string) => setF((x) => ({ ...x, [k]: v }));

  // Client picker
  const [clientId, setClientId] = useState<string | null>(null);
  const [cq, setCq] = useState("");
  const [clients, setClients] = useState<Client[]>([]);
  useEffect(() => {
    if (cq.trim().length < 2) { setClients([]); return; }
    const t = setTimeout(async () => {
      const r = await fetch(`/api/admin/clients?q=${encodeURIComponent(cq)}`);
      if (r.ok) setClients((await r.json()).clients);
    }, 300);
    return () => clearTimeout(t);
  }, [cq]);

  // Live pricing lookup
  const [lookup, setLookup] = useState<LookupResult | null>(null);
  const [lkBusy, setLkBusy] = useState(false);
  const lastKey = useRef("");
  useEffect(() => {
    if (f.pickup.trim().length < 3 || f.drop.trim().length < 3) { setLookup(null); return; }
    const key = `${f.pickup}|${f.drop}|${f.vehicle}|${f.tripType}`;
    const t = setTimeout(async () => {
      lastKey.current = key;
      setLkBusy(true);
      try {
        const r = await fetch(`/api/admin/pricing/lookup?${new URLSearchParams({ pickup: f.pickup, drop: f.drop, vehicle: f.vehicle, tripType: f.tripType })}`);
        if (r.ok && lastKey.current === key) setLookup((await r.json()).result);
      } finally { setLkBusy(false); }
    }, 600);
    return () => clearTimeout(t);
  }, [f.pickup, f.drop, f.vehicle, f.tripType]);

  const rule = lookup?.rule ?? null;
  const price = f.price === "" ? null : Number(f.price);
  const cost = f.estCost === "" ? null : Number(f.estCost);
  const margin = price != null && cost != null ? price - cost : null;
  const belowMin = price != null && rule?.price_min != null && price < rule.price_min;

  const [busy, setBusy] = useState<"draft" | "ready" | null>(null);
  const [error, setError] = useState("");

  async function save(stage: "draft" | "ready") {
    setBusy(stage);
    setError("");
    try {
      const res = await fetch("/api/admin/quotations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: clientId, customer_name: f.name, customer_phone: f.phone, customer_email: f.email || null, source: f.source,
          pickup_location: f.pickup, drop_location: f.drop, trip_type: f.tripType, trip_date: f.date, trip_time: f.time || null,
          return_date: f.returnDate || null, passengers_count: f.pax || null, luggage_notes: f.luggage || null, vehicle_type_requested: f.vehicle,
          quoted_price: f.price, est_driver_cost: f.estCost, pricing_rule_id: rule?.id ?? null, valid_until: f.validUntil || null,
          price_notes: f.notes || null, stage,
        }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error || "Could not save");
      else router.push(`/admin/quotations/${data.id}`);
    } catch {
      setError("Network error");
    } finally {
      setBusy(null);
    }
  }

  const ready = f.name.trim() && f.phone.trim() && f.pickup.trim() && f.drop.trim() && f.date;

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <Link href="/admin/quotations" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C9A84C] hover:underline mb-2">
          <ArrowLeft className="h-3.5 w-3.5" /> Quotations
        </Link>
        <h1 className="text-xl font-bold text-[#F5F0E8]">New Quotation</h1>
        <p className="text-xs text-[#7C8088]">Saving never contacts the client. Sending is a separate, explicit step on the next screen.</p>
      </div>

      {/* 1 — Client */}
      <section className="rounded-2xl border border-[#333] bg-[#111] p-5 space-y-3">
        <h2 className="text-sm font-bold text-[#F5F0E8]">1 · Client</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7C8088]" />
          <input className={`${input} pl-9`} placeholder="Search existing client by name, phone or email…" value={cq} onChange={(e) => setCq(e.target.value)} />
          {clients.length > 0 && (
            <div className="absolute z-10 mt-1 w-full rounded-lg border border-[#333] bg-[#161616] shadow-xl max-h-60 overflow-auto">
              {clients.map((c) => (
                <button key={c.id} type="button" className="w-full text-left px-3 py-2 text-xs hover:bg-[#222] text-[#F5F0E8]"
                  onClick={() => { setClientId(c.id); set("name", c.name); set("phone", c.phone ?? ""); set("email", c.email ?? ""); setCq(""); setClients([]); }}>
                  <span className="font-bold">{c.name}</span> · {c.phone} {c.email ? `· ${c.email}` : ""} <span className="text-[#7C8088]">({c.rides} rides)</span>
                </button>
              ))}
            </div>
          )}
        </div>
        {clientId ? (
          <p className="text-xs text-green-500 flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Existing client selected
            <button className="underline text-[#A1A1A6]" onClick={() => setClientId(null)}>detach</button></p>
        ) : (
          <p className="text-xs text-[#7C8088] flex items-center gap-2"><UserPlus className="h-4 w-4" /> No client selected — a client is created (or matched by phone) when you save.</p>
        )}
        <div className="grid sm:grid-cols-3 gap-3">
          <div><label className={label}>Name *</label><input className={input} value={f.name} onChange={(e) => set("name", e.target.value)} /></div>
          <div><label className={label}>Phone / WhatsApp *</label><input className={input} value={f.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+966…" /></div>
          <div><label className={label}>Email</label><input type="email" className={input} value={f.email} onChange={(e) => set("email", e.target.value)} /></div>
        </div>
        <div className="sm:w-1/3"><label className={label}>Source</label>
          <select className={input} value={f.source} onChange={(e) => set("source", e.target.value)}>
            <option value="whatsapp">WhatsApp</option><option value="website">Website</option><option value="referral">Referral</option><option value="event_management">Event / corporate</option>
          </select></div>
      </section>

      {/* 2 — Trip */}
      <section className="rounded-2xl border border-[#333] bg-[#111] p-5 space-y-3">
        <h2 className="text-sm font-bold text-[#F5F0E8]">2 · Trip</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <div><label className={label}>Pickup *</label><input className={input} value={f.pickup} onChange={(e) => set("pickup", e.target.value)} /></div>
          <div><label className={label}>Drop-off *</label><input className={input} value={f.drop} onChange={(e) => set("drop", e.target.value)} /></div>
        </div>
        <div className="grid sm:grid-cols-4 gap-3">
          <div><label className={label}>Date *</label><input type="date" className={input} value={f.date} onChange={(e) => set("date", e.target.value)} /></div>
          <div><label className={label}>Time</label><input type="time" className={input} value={f.time} onChange={(e) => set("time", e.target.value)} /></div>
          <div><label className={label}>Service type</label>
            <select className={input} value={f.tripType} onChange={(e) => set("tripType", e.target.value)}>
              <option value="one_way">One-way</option><option value="round_trip">Round-trip</option><option value="airport_transfer">Airport transfer</option>
              <option value="multi_day">Multi-day</option><option value="hourly">Hourly</option><option value="event">Event</option>
            </select></div>
          <div><label className={label}>Return date</label><input type="date" className={input} value={f.returnDate} onChange={(e) => set("returnDate", e.target.value)} /></div>
        </div>
        <div className="grid sm:grid-cols-3 gap-3">
          <div><label className={label}>Vehicle</label>
            <select className={input} value={f.vehicle} onChange={(e) => set("vehicle", e.target.value)}>
              <option value="sedan">Executive sedan</option><option value="suv">Full-size SUV</option><option value="van">Van</option><option value="limousine">Limousine / VIP</option><option value="bus">Coach</option>
            </select></div>
          <div><label className={label}>Passengers</label><input type="number" min={1} className={input} value={f.pax} onChange={(e) => set("pax", e.target.value)} /></div>
          <div><label className={label}>Luggage</label><input className={input} value={f.luggage} onChange={(e) => set("luggage", e.target.value)} placeholder="e.g. 2 large + 1 small" /></div>
        </div>
      </section>

      {/* 3 — Pricing */}
      <section className="rounded-2xl border border-[#333] bg-[#111] p-5 space-y-3">
        <h2 className="text-sm font-bold text-[#F5F0E8] flex items-center gap-2">3 · Pricing {lkBusy && <Loader2 className="h-3.5 w-3.5 animate-spin text-[#7C8088]" />}</h2>
        {!lookup && <p className="text-xs text-[#7C8088]">Enter pickup and drop-off — the Pricing Book is checked automatically.</p>}
        {lookup && (
          <div className="rounded-xl border border-[#333] bg-black/30 p-3 space-y-2 text-xs">
            <div className={`flex items-start gap-2 font-bold ${rule && lookup.state !== "no_price" ? "text-green-500" : lookup.state === "no_price" ? "text-yellow-500" : "text-[#A1A1A6]"}`}>
              {rule && lookup.state !== "no_price" ? <CheckCircle2 className="h-4 w-4" /> : lookup.state === "no_price" ? <AlertTriangle className="h-4 w-4" /> : <CircleSlash className="h-4 w-4" />}
              <span>{lookup.message}</span>
            </div>
            {rule && (
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[#F5F0E8] font-mono">
                <div><div className="text-[0.6rem] text-[#7C8088] uppercase">Route</div>{rule.route_family} · {rule.vehicle_category}</div>
                <div><div className="text-[0.6rem] text-[#7C8088] uppercase">Range{rule.range_source ? ` (${rule.range_source})` : ""}</div>
                  {rule.range_low_effective == null ? "—" : rule.range_low_effective === rule.range_high_effective ? sar(rule.range_low_effective) : `${rule.range_low_effective?.toLocaleString()}–${rule.range_high_effective?.toLocaleString()}`}</div>
                <div><div className="text-[0.6rem] text-[#7C8088] uppercase">Recommended</div>{sar(rule.final_approved_price)}
                  {rule.final_approved_price != null && <button type="button" className="ml-1 underline text-[#C9A84C]" onClick={() => set("price", String(rule.final_approved_price))}>use</button>}</div>
                <div><div className="text-[0.6rem] text-[#7C8088] uppercase">Minimum</div>{sar(rule.price_min)}</div>
                <div><div className="text-[0.6rem] text-[#7C8088] uppercase">Est. cost</div>{sar(rule.est_cost != null ? rule.est_cost + (rule.border_fee ?? 0) : null)}
                  {rule.est_cost != null && <button type="button" className="ml-1 underline text-[#C9A84C]" onClick={() => set("estCost", String(rule.est_cost! + (rule.border_fee ?? 0)))}>use</button>}</div>
              </div>
            )}
            {rule?.conflict && <p className="text-red-400 flex items-center gap-2"><AlertTriangle className="h-4 w-4" /> Conflicting past prices on this route — confirm before quoting.</p>}
            {lookup.history.length > 0 && (
              <p className="text-[#A1A1A6]">Past on this corridor: {lookup.history.map((h) => `${h.quote_reference} ${sar(h.quoted_price)}${h.margin != null ? ` (margin ${h.margin})` : ""}`).join(" · ")}</p>
            )}
          </div>
        )}
        <div className="grid sm:grid-cols-4 gap-3">
          <div><label className={label}>Final selling price (SAR)</label><input type="number" min={0} className={input} value={f.price} onChange={(e) => set("price", e.target.value)} /></div>
          <div><label className={label}>Expected driver cost (SAR)</label><input type="number" min={0} className={input} value={f.estCost} onChange={(e) => set("estCost", e.target.value)} /></div>
          <div><label className={label}>Valid until</label><input type="date" className={input} value={f.validUntil} onChange={(e) => set("validUntil", e.target.value)} /></div>
          <div>
            <div className={label}>Expected margin</div>
            <div className={`rounded-lg border px-3 py-2 text-sm font-mono ${margin == null ? "border-[#333] text-[#7C8088]" : margin < 0 ? "border-red-500/40 bg-red-500/10 text-red-400 font-bold" : "border-green-500/30 text-green-500"}`}>
              {margin == null ? "enter cost" : margin < 0 ? `LOSS ${Math.abs(margin)}` : `SAR ${margin}`}
            </div>
          </div>
        </div>
        {belowMin && <p className="text-xs text-red-400 flex items-center gap-2"><AlertTriangle className="h-4 w-4" /> Below the minimum acceptable price ({sar(rule?.price_min)}).</p>}
        <div><label className={label}>Internal pricing notes</label><input className={input} value={f.notes} onChange={(e) => set("notes", e.target.value)} /></div>
      </section>

      {error && <p className="text-sm text-red-400">{error}</p>}
      <div className="flex flex-wrap gap-3">
        <button disabled={!ready || busy !== null} onClick={() => save("draft")}
          className="rounded-lg border border-[#C9A84C]/40 px-5 py-2.5 text-xs font-bold text-[#C9A84C] hover:bg-[#C9A84C]/10 disabled:opacity-40">
          {busy === "draft" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save as Draft"}
        </button>
        <button disabled={!ready || price == null || busy !== null} onClick={() => save("ready")}
          className="rounded-lg bg-[#C9A84C] px-5 py-2.5 text-xs font-bold text-black hover:bg-[#dcb85e] disabled:opacity-40">
          {busy === "ready" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save as Ready to Send"}
        </button>
      </div>
    </div>
  );
}
