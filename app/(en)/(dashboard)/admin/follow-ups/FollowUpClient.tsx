"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle, Check, X, Trash2, Plus, Copy } from "lucide-react";
import { FU_LABEL, followUpMessage, type FollowUp, type FuStatus } from "@/lib/ops/followup-constants";

type Candidate = {
  id: string; customer_name: string; customer_phone: string | null; customer_email: string | null; pickup: string | null; dropoff: string | null;
  trip_date: string | null; vehicle: string | null; passengers: string | null; luggage: string | null; created_at: string;
};

const TONE: Record<FuStatus, string> = {
  quoted: "text-orange-400 border-orange-500/30", followed_up: "text-blue-400 border-blue-500/30",
  confirmed: "text-green-500 border-green-500/30", lost: "text-red-400 border-red-500/30",
};
const input = "rounded-lg border border-[#333] bg-black/40 px-2 py-1.5 text-xs text-[#F5F0E8] outline-none focus:border-[#C9A84C]";
const btn = "inline-flex items-center gap-1 rounded-lg border border-[#333] px-2.5 py-1.5 text-xs font-bold text-[#A1A1A6] hover:text-[#F5F0E8]";

function when(f: FollowUp) {
  if (!f.trip_date) return <span className="text-orange-400">No date</span>;
  const d = f.days_left;
  const tag = d == null ? "" : d < 0 ? `${-d}d ago` : d === 0 ? "today" : d === 1 ? "tomorrow" : `in ${d}d`;
  const tone = d != null && d < 0 ? "text-[#7C8088]" : d != null && d <= 3 ? "text-red-400 font-bold" : "text-[#A1A1A6]";
  return <>{f.trip_date}{f.trip_time ? ` ${f.trip_time.slice(0, 5)}` : ""} <span className={tone}>({tag})</span></>;
}

export default function FollowUpClient({ rows, candidates }: { rows: FollowUp[]; candidates: Candidate[] }) {
  const router = useRouter();
  const [tab, setTab] = useState<"open" | "closed" | "add">("open");
  const [busy, setBusy] = useState<string | null>(null);
  const [err, setErr] = useState("");
  const [prices, setPrices] = useState<Record<string, string>>({});
  const [form, setForm] = useState({ customer_name: "", customer_phone: "", pickup: "", dropoff: "", trip_date: "", trip_time: "", vehicle: "", passengers: "", quoted_price: "", notes: "" });

  const open = rows.filter((r) => r.status === "quoted" || r.status === "followed_up");
  const closed = rows.filter((r) => r.status === "confirmed" || r.status === "lost");
  const dueSoon = open.filter((r) => r.days_left != null && r.days_left >= 0 && r.days_left <= 3).length;

  async function call(key: string, url: string, method: string, body?: unknown) {
    setBusy(key); setErr("");
    try {
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(j.error || "Failed");
      router.refresh();
      return true;
    } catch (e) { setErr(e instanceof Error ? e.message : "Failed"); return false; }
    finally { setBusy(null); }
  }

  function sendWa(f: FollowUp) {
    if (!f.customer_phone) return;
    const text = followUpMessage(f);
    window.open(`https://wa.me/${f.customer_phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
    // Ask afterwards so a click that never sent a message does not count as a follow-up.
    if (window.confirm(`Did you send the follow-up to ${f.customer_name}? OK = mark as followed up`)) call(f.id, `/api/admin/follow-ups/${f.id}`, "PATCH", { mark_followed_up: true });
  }

  async function track(c: Candidate) {
    const p = prices[c.id];
    const ok = await call(c.id, "/api/admin/follow-ups", "POST", {
      customer_name: c.customer_name, customer_phone: c.customer_phone, customer_email: c.customer_email, pickup: c.pickup, dropoff: c.dropoff,
      trip_date: c.trip_date ? c.trip_date.slice(0, 10) : null, trip_time: c.trip_date && c.trip_date.length > 10 ? c.trip_date.slice(11, 16) : null,
      vehicle: c.vehicle, passengers: c.passengers, luggage: c.luggage, quoted_price: p ? Number(p) : null, source_lead_id: `leads:${c.id}`,
    });
    if (ok) setTab("open");
  }

  async function addManual(e: React.FormEvent) {
    e.preventDefault();
    const ok = await call("add", "/api/admin/follow-ups", "POST", { ...form, quoted_price: form.quoted_price ? Number(form.quoted_price) : null });
    if (ok) { setForm({ customer_name: "", customer_phone: "", pickup: "", dropoff: "", trip_date: "", trip_time: "", vehicle: "", passengers: "", quoted_price: "", notes: "" }); setTab("open"); }
  }

  const list = tab === "open" ? open : closed;
  const chip = (a: boolean) => `rounded-lg border px-3 py-1.5 text-xs font-bold ${a ? "border-[#C9A84C]/40 bg-[#C9A84C]/20 text-[#C9A84C]" : "border-[#333] text-[#A1A1A6] hover:text-[#F5F0E8]"}`;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <button onClick={() => setTab("open")} className={chip(tab === "open")}>Open ({open.length}){dueSoon > 0 && <span className="ml-1 text-red-400">· {dueSoon} trip ≤3 days</span>}</button>
        <button onClick={() => setTab("closed")} className={chip(tab === "closed")}>Confirmed / Lost ({closed.length})</button>
        <button onClick={() => setTab("add")} className={chip(tab === "add")}>Add from website forms ({candidates.length})</button>
      </div>
      {err && <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">{err}</div>}

      {tab !== "add" && (
        <div className="overflow-x-auto rounded-2xl border border-[#333] bg-[#111]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#1A1A1A] text-[0.6rem] uppercase tracking-widest text-[#7C8088]">
              <tr><th className="p-3">Customer</th><th className="p-3">Trip</th><th className="p-3">Price sent</th><th className="p-3">Status</th><th className="p-3 text-right">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-[#222] text-[#A1A1A6]">
              {list.length === 0 && <tr><td colSpan={5} className="p-8 text-center">Nothing here.</td></tr>}
              {list.map((f) => (
                <tr key={f.id} className="align-top">
                  <td className="p-3"><div className="font-bold text-[#F5F0E8]">{f.customer_name}</div><div>{f.customer_phone}</div><div>{f.customer_email}</div></td>
                  <td className="p-3">{f.pickup ?? "?"} → {f.dropoff ?? "?"}<div className="text-[#7C8088]">{when(f)} · {[f.vehicle, f.passengers ? `${f.passengers} pax` : null].filter(Boolean).join(" · ")}</div>
                    {f.notes && <div className="mt-0.5 text-[#7C8088]">{f.notes}</div>}</td>
                  <td className="whitespace-nowrap p-3">
                    <input
                      defaultValue={f.quoted_price ?? ""} placeholder="SAR" inputMode="numeric" className={`${input} w-20`}
                      onBlur={(e) => { const v = e.target.value.trim(); if (v !== String(f.quoted_price ?? "")) call(f.id, `/api/admin/follow-ups/${f.id}`, "PATCH", { quoted_price: v === "" ? null : Number(v) }); }}
                    />
                  </td>
                  <td className="p-3">
                    <span className={`rounded border px-1.5 py-0.5 text-[0.6rem] font-bold uppercase ${TONE[f.status]}`}>{FU_LABEL[f.status]}</span>
                    <div className="mt-1 text-[#7C8088]">{f.followup_count} follow-up{f.followup_count === 1 ? "" : "s"}{f.last_followup_at ? ` · last ${f.last_followup_at.slice(0, 10)}` : ""}</div>
                    {f.reminder_sent_at && <div className="text-[#7C8088]">Reminder emailed</div>}
                  </td>
                  <td className="p-3">
                    <div className="flex flex-wrap justify-end gap-1.5">
                      {f.customer_phone && <button className={btn} disabled={busy === f.id} onClick={() => sendWa(f)}><MessageCircle className="h-3.5 w-3.5" /> WhatsApp</button>}
                      <button className={btn} title="Copy message" onClick={() => navigator.clipboard?.writeText(followUpMessage(f))}><Copy className="h-3.5 w-3.5" /></button>
                      {tab === "open" ? (<>
                        <button className={`${btn} hover:text-green-500`} disabled={busy === f.id} onClick={() => call(f.id, `/api/admin/follow-ups/${f.id}`, "PATCH", { status: "confirmed" })}><Check className="h-3.5 w-3.5" /> Confirmed</button>
                        <button className={`${btn} hover:text-red-400`} disabled={busy === f.id} onClick={() => call(f.id, `/api/admin/follow-ups/${f.id}`, "PATCH", { status: "lost" })}><X className="h-3.5 w-3.5" /> Lost</button>
                      </>) : (
                        <button className={btn} disabled={busy === f.id} onClick={() => call(f.id, `/api/admin/follow-ups/${f.id}`, "PATCH", { status: "quoted" })}>Reopen</button>
                      )}
                      <button className={`${btn} hover:text-red-400`} aria-label="Delete" disabled={busy === f.id} onClick={() => { if (window.confirm(`Delete ${f.customer_name} from follow-ups?`)) call(f.id, `/api/admin/follow-ups/${f.id}`, "DELETE"); }}><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "add" && (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-2xl border border-[#333] bg-[#111]">
            <div className="border-b border-[#222] p-3 text-xs text-[#7C8088]">Website quote forms from the last 30 days that are not tracked yet. Enter the price you sent, then Track.</div>
            <table className="w-full text-left text-xs">
              <tbody className="divide-y divide-[#222] text-[#A1A1A6]">
                {candidates.length === 0 && <tr><td className="p-6 text-center">All recent forms are already tracked.</td></tr>}
                {candidates.map((c) => (
                  <tr key={c.id} className="align-top">
                    <td className="p-3"><div className="font-bold text-[#F5F0E8]">{c.customer_name}</div><div>{c.customer_phone}</div></td>
                    <td className="p-3">{c.pickup} → {c.dropoff}<div className="text-[#7C8088]">{c.trip_date ? c.trip_date.replace("T", " ") : "No date"} · {c.vehicle} · {c.passengers ?? "?"} pax · submitted {c.created_at.slice(0, 10)}</div></td>
                    <td className="whitespace-nowrap p-3 text-right">
                      <input value={prices[c.id] ?? ""} onChange={(e) => setPrices({ ...prices, [c.id]: e.target.value })} placeholder="Price SAR" inputMode="numeric" className={`${input} mr-2 w-24`} />
                      <button className={`${btn} text-[#C9A84C]`} disabled={busy === c.id} onClick={() => track(c)}><Plus className="h-3.5 w-3.5" /> Track</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <form onSubmit={addManual} className="grid gap-2 rounded-2xl border border-[#333] bg-[#111] p-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="sm:col-span-2 lg:col-span-4 text-xs font-bold text-[#F5F0E8]">Add manually (e.g. someone you quoted on WhatsApp)</div>
            {([["customer_name", "Name *"], ["customer_phone", "Phone / WhatsApp"], ["pickup", "From"], ["dropoff", "To"], ["trip_date", "Trip date", "date"], ["trip_time", "Time", "time"], ["vehicle", "Vehicle"], ["passengers", "Passengers"], ["quoted_price", "Price sent (SAR)"], ["notes", "Notes"]] as [keyof typeof form, string, string?][]).map(([k, label, type]) => (
              <label key={k} className="text-[0.65rem] text-[#7C8088]">{label}
                <input type={type ?? "text"} required={k === "customer_name"} value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} className={`${input} mt-1 w-full`} />
              </label>
            ))}
            <div className="flex items-end"><button disabled={busy === "add"} className="rounded-lg bg-[#C9A84C] px-4 py-2 text-xs font-bold text-black hover:opacity-90">Add to follow-ups</button></div>
          </form>
        </div>
      )}
    </div>
  );
}
