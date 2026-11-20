"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, ChevronLeft, ChevronRight, FileText, Loader2, MessageCircle, Plus, Search, User, XCircle } from "lucide-react";
import { PAGE_SIZE, VIEW_GROUPS, VIEW_LABEL, type ListFilters, type ListRow, type View } from "@/lib/ops/list-shared";
import { nextAction } from "@/lib/ops/next-action";
import { STAGE_LABEL, effectiveStage } from "@/lib/ops/quote-stage";
import type { QuoteStage } from "@/lib/supabase/quotations";

type Assignable = { id: string; name: string; phone: string | null; kind: "main" | "local"; default_share_pct: number };

const input = "h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none focus:border-emerald-500";
const sar = (n: number | null | undefined) => (n == null ? "—" : n.toLocaleString("en-US", { maximumFractionDigits: 0 }));
const QUOTE_TONE: Record<string, string> = { draft: "bg-slate-100 text-slate-600", ready: "bg-sky-50 text-sky-700", sent: "bg-amber-50 text-amber-700", follow_up: "bg-orange-50 text-orange-700", accepted: "bg-emerald-50 text-emerald-700", rejected: "bg-rose-50 text-rose-700", expired: "bg-slate-100 text-slate-500" };
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
    if (!window.confirm(`Email ${t === "quotation" ? "the quotation" : t === "followup" ? "a follow-up" : "the pickup details"} to ${r.customer_email}?\n(A record copy is also sent to the office inbox.)`)) return;
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
    const cls = `inline-flex h-9 items-center gap-1 rounded-lg px-3 text-sm font-semibold whitespace-nowrap disabled:opacity-40 ${a.urgent ? "bg-amber-500 text-white hover:bg-amber-600" : "bg-emerald-600 text-white hover:bg-emerald-700"}`;
    const spin = b ? <Loader2 className="h-3 w-3 animate-spin" /> : null;
    switch (a.key) {
      case "none": return <span className="text-slate-300">—</span>;
      case "await": return <span className="text-sm text-slate-400">{a.label}</span>;
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
            <button className="px-1 text-slate-400" aria-label="Cancel" onClick={() => setCostFor(null)}>✕</button>
          </span>
        ) : <button className={cls} onClick={() => { setCostFor(r.id); setCost(""); }}>{a.label}</button>;
      default: return <Link className={cls} href={`/admin/quotations/${r.id}`}>{a.label}</Link>;
    }
  }

  const anyFilter = filters.q || filters.preset || filters.from || filters.to || filters.vehicle || filters.driver || filters.sort || view !== "all";
  const tone = (state: string, stage: QuoteStage) =>
    state === "completed" ? "bg-emerald-50 text-emerald-700" : state === "cancelled" ? "bg-rose-50 text-rose-700" : state === "booking" ? "bg-sky-50 text-sky-700" : (QUOTE_TONE[stage] ?? "bg-slate-100 text-slate-600");
  const stateText = (state: string, stage: QuoteStage) => (state === "quote" ? STAGE_LABEL[stage] : state === "booking" ? "Confirmed" : state === "completed" ? "Completed" : "Cancelled");

  return (
    <div className="mx-auto max-w-7xl space-y-5 pb-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quotes &amp; Bookings</h1>
          <p className="text-sm text-slate-500">Showing {total} in &ldquo;{VIEW_LABEL[view]}&rdquo;. Tap a folder to switch.</p>
        </div>
        <Link href="/admin/quotations/new" className="inline-flex h-11 items-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"><Plus className="h-4 w-4" /> New Quotation</Link>
      </div>

      {/* folders */}
      <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-3">
        {VIEW_GROUPS.map((g) => (
          <div key={g.title}>
            <div className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">{g.title}</div>
            <div className="flex flex-wrap gap-1.5">
              {g.views.map((v) => (
                <button key={v} onClick={() => setParam("view", v === "all" ? null : v)} aria-pressed={view === v}
                  className={`h-9 whitespace-nowrap rounded-full border px-3.5 text-sm font-medium transition ${view === v ? "border-emerald-600 bg-emerald-600 text-white" : v === "loss" && counts[v] > 0 ? "border-rose-200 bg-rose-50 text-rose-700 hover:border-rose-300" : "border-slate-200 text-slate-600 hover:border-emerald-300 hover:text-emerald-700"}`}>
                  {VIEW_LABEL[v]} <span className={view === v ? "text-white/80" : "text-slate-400"}>{counts[v]}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* filters */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input className={`${input} w-full pl-9`} placeholder="Search name, phone, email, TSA-2026-…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        {(["today", "tomorrow", "week"] as const).map((p) => (
          <button key={p} onClick={() => setParam("preset", filters.preset === p ? null : p)} className={`h-10 rounded-lg border px-3 text-sm font-medium ${filters.preset === p ? "border-emerald-600 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-white text-slate-600 hover:border-emerald-300"}`}>{p === "week" ? "Next 7 days" : p[0].toUpperCase() + p.slice(1)}</button>
        ))}
        <input type="date" className={input} value={filters.from ?? ""} onChange={(e) => setParam("from", e.target.value || null)} title="Trip date from" aria-label="Trip date from" />
        <span className="text-sm text-slate-400">to</span>
        <input type="date" className={input} value={filters.to ?? ""} onChange={(e) => setParam("to", e.target.value || null)} title="Trip date to" aria-label="Trip date to" />
        <select className={input} value={filters.vehicle ?? ""} onChange={(e) => setParam("vehicle", e.target.value || null)} aria-label="Vehicle">
          <option value="">All vehicles</option>{Object.entries(VEH).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select className={input} value={filters.driver ?? ""} onChange={(e) => setParam("driver", e.target.value || null)} aria-label="Driver">
          <option value="">All drivers</option>{filterDrivers.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
        <select className={input} value={filters.sort ?? ""} onChange={(e) => setParam("sort", e.target.value || null)} aria-label="Sort">
          <option value="">Default order</option><option value="date_desc">Trip date — newest</option><option value="date_asc">Trip date — soonest</option><option value="created">Recently created</option><option value="margin">Worst profit first</option>
        </select>
        {anyFilter && <button className="h-10 px-2 text-sm font-semibold text-emerald-700 hover:underline" onClick={() => { setQ(""); router.replace(pathname); }}>Clear filters</button>}
      </div>

      {msg && (
        <div className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm ${msg.ok ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-rose-200 bg-rose-50 text-rose-700"}`}>
          {msg.ok ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />} {msg.text}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {rows.length === 0 && <p className="p-12 text-center text-sm text-slate-400">No rides match these filters.</p>}
        <ul className="divide-y divide-slate-100">
          {rows.map((r) => {
            const stage = effectiveStage(r.quote_stage as QuoteStage, r.valid_until);
            const loss = r.margin != null && r.margin < 0;
            const state = r.status === "completed" ? "completed" : r.status === "cancelled" ? "cancelled" : r.status === "confirmed" || r.status === "assigned" ? "booking" : "quote";
            return (
              <li key={r.id} className={`flex flex-wrap items-center gap-x-5 gap-y-3 px-5 py-4 hover:bg-slate-50 ${loss ? "bg-rose-50/50" : ""}`}>
                <div className="w-24 shrink-0">
                  <div className="text-base font-bold text-slate-900">{new Date(`${r.trip_date.slice(0, 10)}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" })}</div>
                  <div className="text-xs text-slate-400">{r.trip_date.slice(0, 4)}{r.trip_time ? ` · ${r.trip_time.slice(0, 5)}` : ""}</div>
                </div>
                <div className="min-w-0 flex-1 basis-64">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link href={`/admin/quotations/${r.id}`} className="font-semibold text-slate-900 hover:text-emerald-700 hover:underline">{r.customer_name}</Link>
                    <span className="font-mono text-xs text-slate-400">{r.quote_reference}</span>
                  </div>
                  <div className="truncate text-sm text-slate-500">{r.pickup_location} → {r.drop_location}</div>
                  <div className="text-xs text-slate-400">{r.vehicle ? VEH[r.vehicle] ?? r.vehicle : ""}{r.vehicle && r.customer_phone ? " · " : ""}{r.customer_phone}</div>
                </div>
                <div className="flex w-40 shrink-0 flex-col items-start gap-1">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${tone(state, stage)}`}>{stateText(state, stage)}</span>
                  {state !== "cancelled" && (
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${r.payment_status === "paid" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>{r.payment_status === "paid" ? "Paid" : "Not paid yet"}</span>
                  )}
                  {loss && <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-semibold text-rose-700">Lost money</span>}
                </div>
                <div className="w-36 shrink-0 text-sm">
                  <div className="text-slate-400">Quoted / received</div>
                  <div className="font-semibold text-slate-900">{r.currency !== "SAR" && <span className="mr-1 rounded bg-amber-50 px-1 text-xs font-bold text-amber-700">{r.currency}</span>}{sar(r.quoted_price)} <span className="font-normal text-slate-400">/</span> {r.actual_amount_paid != null ? sar(r.actual_amount_paid) : "—"}</div>
                  <div className={`text-xs ${loss ? "font-semibold text-rose-600" : "text-slate-500"}`}>
                    {r.status === "completed" && r.margin == null ? <span className="text-amber-600">driver cost missing</span> : r.margin == null ? "" : `Profit ${loss ? "−" : ""}${sar(Math.abs(r.margin))}`}
                  </div>
                  {r.margin != null && pkrRate && <div className="text-xs text-slate-400">PKR {Math.round(r.margin * pkrRate).toLocaleString("en-US")}</div>}
                </div>
                <div className="w-28 shrink-0 text-sm">
                  <div className="text-slate-400">Driver</div>
                  <div className={r.driver_name ? "font-medium text-slate-800" : "text-slate-300"}>{r.driver_name ?? "—"}</div>
                </div>
                <div className="flex shrink-0 items-center gap-2 lg:ml-auto">
                  <Action r={r} />
                  <a href={`https://wa.me/${r.customer_phone.replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer" title="WhatsApp client" aria-label={`WhatsApp ${r.customer_name}`} className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:border-emerald-300 hover:text-emerald-600"><MessageCircle className="h-4 w-4" /></a>
                  {r.client_id && <Link href={`/admin/clients/${r.client_id}`} title="Client history" aria-label="Client history" className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:border-emerald-300 hover:text-emerald-600"><User className="h-4 w-4" /></Link>}
                  {r.quoted_price != null && <a href={`/api/quotations/${r.id}/invoice`} title="Quotation PDF" aria-label="Quotation PDF" className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:border-emerald-300 hover:text-emerald-600"><FileText className="h-4 w-4" /></a>}
                  <Link href={`/admin/quotations/${r.id}`} className="inline-flex h-9 items-center rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-700 hover:border-emerald-300">Open</Link>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {pages > 1 && (
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>Page {page} of {pages}</span>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => setParam("page", String(page - 1), false)} aria-label="Previous page" className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white disabled:opacity-30"><ChevronLeft className="h-4 w-4" /></button>
            <button disabled={page >= pages} onClick={() => setParam("page", String(page + 1), false)} aria-label="Next page" className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white disabled:opacity-30"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
      )}
    </div>
  );
}
