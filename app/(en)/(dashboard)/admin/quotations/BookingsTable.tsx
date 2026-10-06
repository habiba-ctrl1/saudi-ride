"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, ChevronLeft, ChevronRight, FileText, Loader2, MessageCircle, Plus, Search, User, XCircle } from "lucide-react";
import { PAGE_SIZE, VIEWS, VIEW_LABEL, type ListFilters, type ListRow, type View } from "@/lib/ops/list-shared";
import { nextAction } from "@/lib/ops/next-action";
import { STAGE_CLASS, STAGE_LABEL, effectiveStage } from "@/lib/ops/quote-stage";
import type { QuoteStage } from "@/lib/supabase/quotations";

type Assignable = { id: string; name: string; phone: string | null; kind: "main" | "local"; default_share_pct: number };

const input = "rounded-lg border border-[#333] bg-black/40 px-2.5 py-1.5 text-xs text-[#F5F0E8] outline-none focus:border-[#C9A84C]";
const sar = (n: number | null | undefined) => (n == null ? "—" : n.toLocaleString("en-US", { maximumFractionDigits: 0 }));
const VEH: Record<string, string> = { sedan: "Sedan", suv: "SUV", van: "Van", bus: "Coach", limousine: "VIP" };

export function BookingsTable({ rows, total, counts, view, filters, filterDrivers, assignable, pkrRate, today }: {
  rows: ListRow[]; total: number; counts: Record<View, number>; view: View; filters: ListFilters;
  filterDrivers: { id: string; name: string; kind: string }[]; assignable: Assignable[]; pkrRate: number | null; today: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [q, setQ] = useState(filters.q ?? "");
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [costFor, setCostFor] = useState<string | null>(null);
  const [cost, setCost] = useState("");
  const [driverFor, setDriverFor] = useState<string | null>(null);

  function setParam(k: string, v: string | null, resetPage = true) {
    const n = new URLSearchParams(sp.toString());
    if (v) n.set(k, v); else n.delete(k);
    if (resetPage) n.delete("page");
    router.replace(`${pathname}?${n.toString()}`);
  }
  useEffect(() => {
    const t = setTimeout(() => { if ((filters.q ?? "") !== q.trim()) setParam("q", q.trim() || null); }, 450);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = filters.page ?? 1;

  async function run(key: string, fn: () => Promise<Response>, okText: string) {
    setBusy(key);
    setMsg(null);
    try {
      const res = await fn();
      const data = await res.json().catch(() => ({}));
      if (!res.ok) setMsg({ ok: false, text: data.error || "Action failed" });
      else { setMsg({ ok: true, text: okText }); router.refresh(); }
    } catch {
      setMsg({ ok: false, text: "Network error" });
    } finally {
      setBusy(null);
    }
  }
  const json = (method: string, body: unknown) => ({ method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const sendTpl = (r: ListRow, t: "quotation" | "followup" | "pickup") => {
    if (!r.customer_email) return setMsg({ ok: false, text: `${r.quote_reference}: no email on file — open the record to send on WhatsApp.` });
    if (!window.confirm(`Email ${t === "quotation" ? "the quotation" : t === "followup" ? "a follow-up" : "the pickup details"} to ${r.customer_email}?\n(An internal copy is BCC'd to the office.)`)) return;
    run(`${r.id}-send`, () => fetch(`/api/admin/quotations/${r.id}/send`, json("POST", { template: t })), `Emailed ${r.customer_email}.`);
  };
  const convert = (r: ListRow) => run(`${r.id}-convert`, async () => {
    const a = await fetch(`/api/quotations/${r.id}`, json("PATCH", { status: "confirmed" }));
    if (a.ok) await fetch(`/api/admin/quotations/${r.id}/stage`, json("PATCH", { stage: "accepted" }));
    return a;
  }, `${r.quote_reference} converted to booking. No email sent.`);

  function Action({ r }: { r: ListRow }) {
    const a = nextAction(r, today);
    const b = busy?.startsWith(r.id);
    const cls = `inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-[0.7rem] font-bold whitespace-nowrap disabled:opacity-40 ${a.urgent ? "border-yellow-500/50 bg-yellow-500/10 text-yellow-500" : "border-[#C9A84C]/40 text-[#C9A84C] hover:bg-[#C9A84C]/10"}`;
    const spin = b ? <Loader2 className="h-3 w-3 animate-spin" /> : null;
    switch (a.key) {
      case "none": return <span className="text-[#555]">—</span>;
      case "await": return <span className="text-[0.7rem] text-[#7C8088]">{a.label}</span>;
      case "send_quote": return <button className={cls} disabled={!!b} onClick={() => sendTpl(r, "quotation")}>{spin}{a.label}</button>;
      case "follow_up": return <button className={cls} disabled={!!b} onClick={() => sendTpl(r, "followup")}>{spin}{a.label}</button>;
      case "send_pickup": return <button className={cls} disabled={!!b} onClick={() => sendTpl(r, "pickup")}>{spin}{a.label}</button>;
      case "convert": return <button className={cls} disabled={!!b} onClick={() => convert(r)}>{spin}{a.label}</button>;
      case "complete":
        return <button className={cls} disabled={!!b} onClick={() => window.confirm(`Mark ${r.quote_reference} completed?`) && run(`${r.id}-done`, () => fetch(`/api/quotations/${r.id}`, json("PATCH", { status: "completed" })), "Marked completed.")}>{spin}{a.label}</button>;
      case "receipt": return <button className={cls} disabled={!!b} onClick={() => run(`${r.id}-rcpt`, () => fetch(`/api/admin/quotations/${r.id}/receipt-doc`, json("POST", {})), "Receipt generated — open the record to send it.")}>{spin}{a.label}</button>;
      case "assign_driver":
        return driverFor === r.id ? (
          <select autoFocus className={input} defaultValue="" onBlur={() => setDriverFor(null)}
            onChange={(e) => { const id = e.target.value; setDriverFor(null); if (id) run(`${r.id}-drv`, () => fetch(`/api/admin/quotations/${r.id}/finance`, json("PATCH", { partner_id: id })), "Driver assigned."); }}>
            <option value="">Choose…</option>
            <optgroup label="Main drivers">{assignable.filter((d) => d.kind === "main").map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</optgroup>
            <optgroup label="Local drivers">{assignable.filter((d) => d.kind === "local").map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</optgroup>
          </select>
        ) : <button className={cls} onClick={() => setDriverFor(r.id)}>{a.label}</button>;
      case "add_cost":
        return costFor === r.id ? (
          <span className="inline-flex items-center gap-1">
            <input autoFocus type="number" min={0} placeholder="SAR" className={`${input} w-20`} value={cost} onChange={(e) => setCost(e.target.value)} />
            <button className={cls} disabled={!cost || !!b} onClick={() => { const v = Number(cost); setCostFor(null); setCost(""); run(`${r.id}-cost`, () => fetch(`/api/admin/quotations/${r.id}/finance`, json("PATCH", { driver_cost: v })), "Driver cost saved.") }}>{spin}Save</button>
            <button className="text-[#7C8088]" onClick={() => setCostFor(null)}>✕</button>
          </span>
        ) : <button className={cls} onClick={() => { setCostFor(r.id); setCost(""); }}>{a.label}</button>;
      default: return <Link className={cls} href={`/admin/quotations/${r.id}`}>{a.label}</Link>;
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-baseline gap-3">
          <h1 className="text-xl font-bold text-[#F5F0E8]">Quotes &amp; Bookings</h1>
          <span className="text-xs text-[#7C8088]">{total} shown</span>
        </div>
        <Link href="/admin/quotations/new" className="inline-flex items-center gap-1.5 rounded-lg bg-[#C9A84C] px-3.5 py-2 text-xs font-bold text-black hover:bg-[#dcb85e]"><Plus className="h-3.5 w-3.5" /> New Quotation</Link>
      </div>

      {/* view chips */}
      <div className="flex flex-wrap gap-1.5">
        {VIEWS.map((v) => (
          <button key={v} onClick={() => setParam("view", v === "all" ? null : v)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition ${view === v ? "border-[#C9A84C] bg-[#C9A84C]/15 text-[#C9A84C]" : "border-[#333] text-[#A1A1A6] hover:border-[#C9A84C]/40"} ${v === "loss" && counts[v] > 0 ? "!text-red-400" : ""}`}>
            {VIEW_LABEL[v]} <span className="opacity-60">{counts[v]}</span>
          </button>
        ))}
      </div>

      {/* filters */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#7C8088]" />
          <input className={`${input} w-full pl-8`} placeholder="Name, phone, email, TSA-2026-…, route, date…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        {(["today", "tomorrow", "week"] as const).map((p) => (
          <button key={p} onClick={() => setParam("preset", filters.preset === p ? null : p)} className={`rounded-lg border px-2.5 py-1.5 text-xs ${filters.preset === p ? "border-[#C9A84C] bg-[#C9A84C]/15 text-[#C9A84C]" : "border-[#333] text-[#A1A1A6]"}`}>{p === "week" ? "Next 7 days" : p[0].toUpperCase() + p.slice(1)}</button>
        ))}
        <input type="date" className={input} value={filters.from ?? ""} onChange={(e) => setParam("from", e.target.value || null)} title="Trip date from" />
        <span className="text-xs text-[#7C8088]">to</span>
        <input type="date" className={input} value={filters.to ?? ""} onChange={(e) => setParam("to", e.target.value || null)} title="Trip date to" />
        <select className={input} value={filters.vehicle ?? ""} onChange={(e) => setParam("vehicle", e.target.value || null)}>
          <option value="">All vehicles</option>{Object.entries(VEH).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select className={input} value={filters.driver ?? ""} onChange={(e) => setParam("driver", e.target.value || null)}>
          <option value="">All drivers</option>{filterDrivers.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
        <select className={input} value={filters.sort ?? ""} onChange={(e) => setParam("sort", e.target.value || null)}>
          <option value="">Default order</option><option value="date_desc">Trip date — newest</option><option value="date_asc">Trip date — soonest</option><option value="created">Recently created</option><option value="margin">Worst margin first</option>
        </select>
        {(filters.q || filters.preset || filters.from || filters.to || filters.vehicle || filters.driver || filters.sort || view !== "all") && (
          <button className="text-xs text-[#C9A84C] underline" onClick={() => { setQ(""); router.replace(pathname); }}>Clear</button>
        )}
      </div>

      {msg && (
        <div className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs ${msg.ok ? "border-green-500/30 bg-green-500/10 text-green-500" : "border-red-500/30 bg-red-500/10 text-red-400"}`}>
          {msg.ok ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />} {msg.text}
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-[#333] bg-[#111]">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#1A1A1A] text-[0.6rem] uppercase tracking-widest text-[#7C8088]">
            <tr>
              <th className="px-3 py-2.5">Booking</th><th className="px-2 py-2.5">Trip</th><th className="px-2 py-2.5">When</th><th className="px-2 py-2.5">Status</th>
              <th className="px-2 py-2.5 text-right">Quoted</th><th className="px-2 py-2.5 text-right">Paid</th><th className="px-2 py-2.5 text-right">Result</th><th className="px-2 py-2.5">Driver</th><th className="px-2 py-2.5">Next action</th><th className="px-3 py-2.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[#222] text-[#A1A1A6]">
            {rows.length === 0 && <tr><td colSpan={10} className="p-10 text-center">No bookings match these filters.</td></tr>}
            {rows.map((r) => {
              const stage = effectiveStage(r.quote_stage as QuoteStage, r.valid_until);
              const loss = r.margin != null && r.margin < 0;
              const state = r.status === "completed" ? "completed" : r.status === "cancelled" ? "cancelled" : r.status === "confirmed" || r.status === "assigned" ? "booking" : "quote";
              return (
                <tr key={r.id} className={`align-top hover:bg-[#1A1A1A]/60 ${loss ? "bg-red-500/5" : ""}`}>
                  <td className="px-3 py-2">
                    <Link href={`/admin/quotations/${r.id}`} className="font-mono font-bold text-[#C9A84C] hover:underline">{r.quote_reference}</Link>
                    <div className="text-[#F5F0E8]">{r.customer_name}</div>
                    <div className="text-[0.65rem] text-[#7C8088]">{r.customer_phone}</div>
                  </td>
                  <td className="max-w-[240px] px-2 py-2">{r.pickup_location} → {r.drop_location}<div className="text-[0.65rem] text-[#7C8088]">{r.vehicle ? VEH[r.vehicle] ?? r.vehicle : ""}</div></td>
                  <td className="whitespace-nowrap px-2 py-2 text-[#F5F0E8]">{r.trip_date}<div className="text-[0.65rem] text-[#7C8088]">{r.trip_time?.slice(0, 5) ?? ""}</div></td>
                  <td className="px-2 py-2">
                    <span className={`rounded border px-1.5 py-0.5 text-[0.6rem] font-bold uppercase ${state === "completed" ? "border-green-500/30 text-green-500" : state === "cancelled" ? "border-red-500/30 text-red-400" : state === "booking" ? "border-blue-500/30 text-blue-400" : STAGE_CLASS[stage]}`}>
                      {state === "quote" ? STAGE_LABEL[stage] : state}
                    </span>
                    {loss && <span className="ml-1 rounded border border-red-500/40 bg-red-500/10 px-1.5 py-0.5 text-[0.6rem] font-bold uppercase text-red-400">Loss</span>}
                    <div className={`mt-0.5 text-[0.65rem] ${r.payment_status === "paid" ? "text-green-500" : "text-[#7C8088]"}`}>{r.status === "cancelled" ? "" : r.payment_status}</div>
                  </td>
                  <td className="px-2 py-2 text-right font-mono">{sar(r.quoted_price)}</td>
                  <td className="px-2 py-2 text-right font-mono">{r.actual_amount_paid != null ? sar(r.actual_amount_paid) : "—"}</td>
                  <td className={`px-2 py-2 text-right font-mono ${loss ? "font-bold text-red-400" : r.margin != null ? "text-green-500" : ""}`}>
                    {r.status === "completed" && r.margin == null ? <span className="font-sans text-yellow-500">cost needed</span> : r.margin == null ? "—" : loss ? `−${sar(Math.abs(r.margin))}` : sar(r.margin)}
                    {r.margin != null && pkrRate && <div className="text-[0.6rem] font-normal text-[#7C8088]">PKR {Math.round(r.margin * pkrRate).toLocaleString("en-US")}</div>}
                  </td>
                  <td className={`px-2 py-2 ${r.driver_name ? "text-[#F5F0E8]" : "text-[#555]"}`}>{r.driver_name ?? "—"}</td>
                  <td className="px-2 py-2"><Action r={r} /></td>
                  <td className="whitespace-nowrap px-3 py-2 text-right">
                    <a href={`https://wa.me/${r.customer_phone.replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer" title="WhatsApp client" className="mr-2 inline-block text-[#A1A1A6] hover:text-green-500"><MessageCircle className="h-4 w-4" /></a>
                    {r.client_id && <Link href={`/admin/clients/${r.client_id}`} title="Client history" className="mr-2 inline-block text-[#A1A1A6] hover:text-[#C9A84C]"><User className="h-4 w-4" /></Link>}
                    {r.quoted_price != null && <a href={`/api/quotations/${r.id}/invoice`} title="Quotation PDF" className="inline-block text-[#A1A1A6] hover:text-[#C9A84C]"><FileText className="h-4 w-4" /></a>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div className="flex items-center justify-between text-xs text-[#A1A1A6]">
          <span>Page {page} of {pages}</span>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => setParam("page", String(page - 1), false)} className="rounded-lg border border-[#333] p-1.5 disabled:opacity-30"><ChevronLeft className="h-4 w-4" /></button>
            <button disabled={page >= pages} onClick={() => setParam("page", String(page + 1), false)} className="rounded-lg border border-[#333] p-1.5 disabled:opacity-30"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
      )}
    </div>
  );
}
