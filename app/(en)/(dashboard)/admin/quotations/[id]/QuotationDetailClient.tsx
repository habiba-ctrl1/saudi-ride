"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, CheckCircle2, FileText, Loader2, Mail, MessageCircle, Pencil, Receipt, XCircle, AlertTriangle, User } from "lucide-react";
import type { QuotationRow } from "@/lib/supabase/quotations";
import type { CommRow } from "@/lib/ops/comms";
import type { TimelineItem } from "@/lib/ops/events";
import { LIFECYCLE } from "@/lib/ops/events";
import type { OpsTemplate } from "@/lib/email/ops-templates";
import { OPS_TEMPLATE_LABEL } from "@/lib/email/ops-templates";
import { STAGE_CLASS, STAGE_LABEL, effectiveStage, isConvertedToBooking } from "@/lib/ops/quote-stage";
import { waLink, waText } from "@/lib/ops/wa-text";

type Assignable = { id: string; name: string; phone: string | null; kind: "main" | "local"; default_share_pct: number };
type Doc = { id: string; kind: string; number: string; amount: number | null; created_at: string };
type Lifecycle = { done: boolean[]; currentIndex: number };

const btn = "inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-bold disabled:opacity-40 transition";
const gold = `${btn} border-[#C9A84C]/40 text-[#C9A84C] hover:bg-[#C9A84C]/10`;
const solid = `${btn} border-transparent bg-[#C9A84C] text-black hover:bg-[#dcb85e]`;
const field = "mt-1 w-full rounded-lg border border-[#333] bg-black/40 px-2 py-1.5 text-sm text-[#F5F0E8] outline-none focus:border-[#C9A84C]";
const lbl = "text-[0.65rem] text-[#7C8088]";
const sar = (n: number | null | undefined) => (n == null ? "—" : `SAR ${n.toLocaleString("en-US", { maximumFractionDigits: 2 })}`);
const ksa = (s: string) => {
  const d = new Date(s.replace(" ", "T").replace(/([+-]\d{2})$/, "$1:00"));
  return Number.isNaN(d.getTime()) ? s.slice(0, 16) : d.toLocaleString("en-GB", { timeZone: "Asia/Riyadh", day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
};

function Card({ title, right, children }: { title: string; right?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-[#333] bg-[#111] p-4">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h2 className="text-[0.65rem] font-bold uppercase tracking-widest text-[#7C8088]">{title}</h2>
        {right}
      </div>
      {children}
    </section>
  );
}
const KV = ({ k, v }: { k: string; v: React.ReactNode }) => (
  <div className="flex justify-between gap-4 border-b border-[#222] py-1 text-xs last:border-0">
    <span className="shrink-0 text-[#7C8088]">{k}</span>
    <span className="text-right text-[#F5F0E8]">{v}</span>
  </div>
);

export function QuotationDetailClient({ q, comms, drivers, pkrRate, docs, timeline, lifecycle }: {
  q: QuotationRow; comms: CommRow[]; drivers: Assignable[]; pkrRate: number | null; docs: Doc[]; timeline: TimelineItem[]; lifecycle: Lifecycle;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const stage = effectiveStage(q.quote_stage ?? "draft", q.valid_until ?? null);
  const converted = isConvertedToBooking(q.status);
  const completed = q.status === "completed";
  const locked = completed || q.status === "cancelled";
  const hasPrice = q.quoted_price != null;
  const hasEmail = !!q.customer_email;
  const lastQuoteEmail = comms.find((c) => c.channel === "email" && c.template === "quotation");

  const margin = q.driver_cost != null ? (q.actual_amount_paid ?? 0) - q.driver_cost - (q.extra_cost ?? 0) : null;
  const expected = q.quoted_price != null && q.est_driver_cost != null ? q.quoted_price - q.est_driver_cost : null;
  const pkr = (n: number) => (pkrRate ? ` ≈ PKR ${Math.round(n * pkrRate).toLocaleString("en-US")}` : "");
  const issuedReceipt = docs.find((d) => d.kind === "receipt");

  async function call(key: string, url: string, method: string, body: unknown, okText: string) {
    setBusy(key);
    setMsg(null);
    try {
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) setMsg({ ok: false, text: data.error || "Action failed" });
      else { setMsg({ ok: true, text: okText }); router.refresh(); }
      return res.ok;
    } catch {
      setMsg({ ok: false, text: "Network error" });
      return false;
    } finally {
      setBusy(null);
    }
  }

  // ── Edit client & trip ──
  const [editing, setEditing] = useState(false);
  const [ed, setEd] = useState({
    name: q.customer_name, phone: q.customer_phone, email: q.customer_email ?? "", pickup: q.pickup_location, drop: q.drop_location,
    date: q.trip_date, time: q.trip_time?.slice(0, 5) ?? "", ret: q.return_date ?? "", pax: q.passengers_count?.toString() ?? "", luggage: q.luggage_notes ?? "",
    vehicle: q.vehicle_type_requested ?? "", tripType: q.trip_type,
  });
  const setE = (k: keyof typeof ed, v: string) => setEd((x) => ({ ...x, [k]: v }));
  async function saveEdit() {
    setBusy("edit");
    setMsg(null);
    try {
      // contact details are always editable (even on completed rides); trip details only while the record is open
      const c = await fetch(`/api/admin/quotations/${q.id}/contact`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ customer_email: ed.email, customer_phone: ed.phone }) });
      if (!c.ok) return setMsg({ ok: false, text: (await c.json().catch(() => ({}))).error || "Could not save contact details" });
      if (!locked) {
        const details = {
          customer_name: ed.name, pickup_location: ed.pickup, drop_location: ed.drop, trip_type: ed.tripType, trip_date: ed.date,
          trip_time: ed.time || null, return_date: ed.ret || null, passengers_count: ed.pax ? Number(ed.pax) : null, luggage_notes: ed.luggage || null,
          vehicle_type_requested: ed.vehicle || null,
        };
        const r = await fetch(`/api/quotations/${q.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ details }) });
        if (!r.ok) return setMsg({ ok: false, text: (await r.json().catch(() => ({}))).error || "Could not save trip details" });
      }
      setEditing(false);
      setMsg({ ok: true, text: "Details saved." });
      router.refresh();
    } finally {
      setBusy(null);
    }
  }

  // ── Price ──
  const [pr, setPr] = useState({ price: q.quoted_price?.toString() ?? "", est: q.est_driver_cost?.toString() ?? "", valid: q.valid_until ?? "" });
  const savePrice = () => call("price", `/api/admin/quotations/${q.id}/price`, "PATCH", {
    quoted_price: pr.price === "" ? null : Number(pr.price), est_driver_cost: pr.est === "" ? null : Number(pr.est), valid_until: pr.valid || null,
  }, "Price saved. Nothing was sent to the client.");

  // ── Ride & payment ──
  const n2s = (n: number | null | undefined) => (n == null ? "" : String(n));
  const [fin, setFin] = useState({
    partnerId: q.partner_id ?? "", share: n2s(q.partner_share_pct), plate: q.vehicle_plate ?? "", vehicle: q.vehicle_detail ?? "",
    paid: n2s(q.actual_amount_paid ?? (completed ? q.quoted_price : null)), method: q.payment_method_used ?? "Cash", cost: n2s(q.driver_cost), extra: n2s(q.extra_cost ?? 0),
  });
  const setF = (k: keyof typeof fin, v: string) => setFin((x) => ({ ...x, [k]: v }));
  const pPaid = fin.paid === "" ? null : Number(fin.paid);
  const pCost = fin.cost === "" ? null : Number(fin.cost);
  const pExtra = fin.extra === "" ? 0 : Number(fin.extra);
  const liveMargin = pPaid != null && pCost != null ? pPaid - pCost - pExtra : null;
  const shareToDriver = fin.share === "" ? 0 : Number(fin.share);
  const ownerPart = liveMargin != null ? (liveMargin * (100 - shareToDriver)) / 100 : null;

  const assignDriver = (id: string) => {
    setF("partnerId", id);
    const d = drivers.find((x) => x.id === id);
    if (d) setF("share", String(d.default_share_pct));
  };
  const saveFinance = (what: "driver" | "money") => {
    const body: Record<string, unknown> = what === "driver"
      ? { partner_id: fin.partnerId || null, partner_share_pct: fin.share === "" ? null : Number(fin.share), vehicle_plate: fin.plate, vehicle_detail: fin.vehicle }
      : { actual_amount_paid: pPaid, payment_method_used: fin.method, driver_cost: pCost, extra_cost: pExtra };
    return call(`fin-${what}`, `/api/admin/quotations/${q.id}/finance`, "PATCH", body, what === "driver" ? "Driver saved." : "Payment and costs saved.");
  };
  const markCompleted = () => call("complete", `/api/quotations/${q.id}`, "PATCH", { status: "completed" }, "Ride marked completed. No email was sent.");
  // Notes / cancel / test flag
  const [notes, setNotes] = useState(q.admin_notes ?? "");
  const saveNotes = () => call("notes", `/api/quotations/${q.id}`, "PATCH", { details: { admin_notes: notes } }, "Notes saved.");
  const cancelBooking = () => {
    if (!window.confirm(`Cancel ${q.quote_reference}? The record stays (history is never deleted). No email is sent.`)) return;
    call("cancel", `/api/quotations/${q.id}`, "PATCH", { status: "cancelled" }, "Booking cancelled.");
  };
  const toggleTest = () => call("test", `/api/quotations/${q.id}`, "PATCH", { is_test: !q.is_test }, q.is_test ? "Unmarked as test." : "Marked as test (hidden from reports and dashboard).");
  const deleteTest = async () => {
    if (!q.is_test || !window.confirm(`Permanently delete TEST record ${q.quote_reference}?`)) return;
    const r = await fetch(`/api/quotations/${q.id}`, { method: "DELETE" });
    if (r.ok) router.push("/admin/quotations");
    else setMsg({ ok: false, text: (await r.json().catch(() => ({}))).error || "Could not delete" });
  };
  const issueReceipt = () => call("receipt-doc", `/api/admin/quotations/${q.id}/receipt-doc`, "POST", {}, "Receipt generated and saved to this booking.");

  // ── Send / lifecycle ──
  const sendEmail = (t: OpsTemplate) => call(`mail-${t}`, `/api/admin/quotations/${q.id}/send`, "POST", { template: t }, `${OPS_TEMPLATE_LABEL[t]} emailed to ${q.customer_email} (internal copy BCC'd).`);
  const markWa = (t: OpsTemplate) => call(`wa-${t}`, `/api/admin/quotations/${q.id}/whatsapp-sent`, "POST", { template: t }, "Recorded as sent on WhatsApp.");
  const setStage = (s: string) => call(`stage-${s}`, `/api/admin/quotations/${q.id}/stage`, "PATCH", { stage: s }, `Marked ${STAGE_LABEL[s as keyof typeof STAGE_LABEL]}.`);
  const convert = async () => {
    setBusy("convert");
    setMsg(null);
    const r = await fetch(`/api/quotations/${q.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "confirmed" }) });
    if (!r.ok) { setMsg({ ok: false, text: (await r.json().catch(() => ({}))).error || "Could not convert" }); setBusy(null); return; }
    await fetch(`/api/admin/quotations/${q.id}/stage`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ stage: "accepted" }) });
    setMsg({ ok: true, text: "Converted to booking (confirmed). No email was sent — use Send confirmation." });
    setBusy(null);
    router.refresh();
  };

  function SendRow({ t, disabled, hint }: { t: OpsTemplate; disabled?: boolean; hint?: string }) {
    const link = waLink(q.customer_phone, waText(t, q));
    const last = comms.find((c) => c.template === t);
    return (
      <div className="flex flex-wrap items-center gap-2 py-1.5">
        <span className="w-44 text-xs font-bold text-[#F5F0E8]">
          {OPS_TEMPLATE_LABEL[t]}
          {last && <span className={`ml-1 font-normal ${last.status === "sent" ? "text-green-500" : "text-red-400"}`}>{last.status === "sent" ? "✓ sent" : "✗ failed"}</span>}
        </span>
        <button className={gold} disabled={disabled || !hasEmail || busy !== null} title={!hasEmail ? "No email on file" : hint} onClick={() => sendEmail(t)}>
          {busy === `mail-${t}` ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Mail className="h-3.5 w-3.5" />} {last?.status === "failed" ? "Retry email" : "Email"}
        </button>
        <a className={gold} href={link} target="_blank" rel="noreferrer"><MessageCircle className="h-3.5 w-3.5" /> WhatsApp</a>
        <button className={`${btn} border-[#333] text-[#A1A1A6] hover:text-[#F5F0E8]`} disabled={busy !== null} onClick={() => markWa(t)}>
          {busy === `wa-${t}` ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Mark sent on WhatsApp"}
        </button>
      </div>
    );
  }

  const paidLabel = q.actual_amount_paid != null ? `${sar(q.actual_amount_paid)}${q.payment_method_used ? ` (${q.payment_method_used})` : ""}` : q.payment_status;
  const driverLabel = q.driver_name ?? q.drivers?.full_name ?? "Not assigned";

  return (
    <div className="max-w-7xl space-y-4">
      {/* Header */}
      <div>
        <Link href="/admin/quotations" className="mb-2 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C9A84C] hover:underline"><ArrowLeft className="h-3.5 w-3.5" /> Quotations</Link>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-mono text-xl font-bold text-[#C9A84C]">{q.quote_reference}</h1>
          <span className={`rounded border px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider ${STAGE_CLASS[stage]}`}>{STAGE_LABEL[stage]}</span>
          <span className="rounded border border-[#333] px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-[#A1A1A6]">{q.status}</span>
          {converted && <span className="rounded border border-green-500/30 bg-green-500/10 px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-green-500">Converted to booking</span>}
          {margin != null && margin < 0 && <span className="rounded border border-red-500/40 bg-red-500/10 px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-red-400">Loss-making</span>}
          {q.is_test && <span className="text-[0.65rem] font-bold text-purple-400">TEST</span>}
        </div>
        <p className="mt-1 text-sm text-[#F5F0E8]">{q.customer_name} · {q.pickup_location} → {q.drop_location}</p>
      </div>

      {/* Key facts strip */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {[
          ["When", `${q.trip_date}${q.trip_time ? ` · ${q.trip_time.slice(0, 5)}` : ""}`],
          ["Quoted", sar(q.quoted_price)],
          ["Payment", q.payment_status === "paid" ? "Paid" : q.payment_status === "partial" ? "Partial" : "Unpaid"],
          ["Driver", driverLabel],
          ["Result", q.financial_status === "required" ? "Cost needed" : margin == null ? (expected != null ? `Expected ${sar(expected)}` : "—") : margin < 0 ? `LOSS ${sar(Math.abs(margin))}` : sar(margin)],
        ].map(([k, v]) => (
          <div key={k} className="rounded-xl border border-[#333] bg-[#111] px-3 py-2">
            <div className="text-[0.6rem] uppercase tracking-widest text-[#7C8088]">{k}</div>
            <div className={`mt-0.5 text-sm font-bold ${k === "Result" && (margin ?? 0) < 0 ? "text-red-400" : k === "Result" && q.financial_status === "required" ? "text-yellow-500" : "text-[#F5F0E8]"}`}>{v}</div>
          </div>
        ))}
      </div>

      {/* Lifecycle */}
      <div className="rounded-2xl border border-[#333] bg-[#111] px-4 py-3">
        <ol className="flex flex-wrap items-center gap-y-1.5 gap-x-1">
          {LIFECYCLE.map((step, i) => {
            const done = lifecycle.done[i];
            const current = i === lifecycle.currentIndex && !lifecycle.done.every(Boolean);
            return (
              <li key={step} className="flex items-center gap-1">
                <div className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.65rem] font-bold ${done ? "border-green-500/30 bg-green-500/10 text-green-500" : current ? "border-[#C9A84C] bg-[#C9A84C]/15 text-[#C9A84C]" : "border-[#333] text-[#7C8088]"}`}>
                  {done ? <Check className="h-3 w-3" /> : <span className="text-[0.6rem]">{i + 1}</span>} {step}
                </div>
                {i < LIFECYCLE.length - 1 && <span className="text-[#444]">›</span>}
              </li>
            );
          })}
        </ol>
        {!lifecycle.done.every(Boolean) && <p className="mt-2 text-[0.7rem] text-[#7C8088]">Next: <span className="font-bold text-[#C9A84C]">{LIFECYCLE[lifecycle.currentIndex]}</span> — steps tick themselves from real data, nothing is checked by hand.</p>}
      </div>

      {msg && (
        <div className={`flex items-start gap-2 rounded-xl border px-4 py-3 text-sm ${msg.ok ? "border-green-500/30 bg-green-500/10 text-green-500" : "border-red-500/30 bg-red-500/10 text-red-400"}`}>
          {msg.ok ? <CheckCircle2 className="mt-0.5 h-4 w-4" /> : <XCircle className="mt-0.5 h-4 w-4" />} {msg.text}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {/* Client & trip */}
          <Card title="Client & trip" right={
            !editing ? <button className="inline-flex items-center gap-1 text-[0.7rem] font-bold text-[#C9A84C] hover:underline" onClick={() => setEditing(true)}><Pencil className="h-3 w-3" /> Edit</button> : null}>
            {!editing ? (
              <div className="grid gap-x-8 sm:grid-cols-2">
                <div>
                  <KV k="Client" v={<>{q.customer_name} {q.client_id && <Link className="ml-1 inline-flex items-center gap-0.5 text-[#C9A84C] hover:underline" href={`/admin/clients/${q.client_id}`}><User className="h-3 w-3" />history</Link>}</>} />
                  <KV k="Phone / WhatsApp" v={q.customer_phone} />
                  <KV k="Email" v={q.customer_email ?? <span className="text-yellow-500">none — Edit to add</span>} />
                  <KV k="Source" v={q.source} />
                  <KV k="Enquiry date" v={q.created_at.slice(0, 10)} />
                </div>
                <div>
                  <KV k="Pickup" v={q.pickup_location} />
                  <KV k="Drop-off" v={q.drop_location} />
                  <KV k="Service" v={q.trip_type.replace("_", " ")} />
                  <KV k="Vehicle" v={q.vehicle_type_requested ?? "—"} />
                  <KV k="Passengers / luggage" v={`${q.passengers_count ?? "—"} / ${q.luggage_notes ?? "—"}`} />
                  {q.return_date && <KV k="Return" v={q.return_date} />}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {locked && <p className="text-xs text-yellow-500">This ride is {q.status}: trip details are locked for record integrity. You can still fix phone and email.</p>}
                <div className="grid gap-2 sm:grid-cols-3">
                  <label className={lbl}>Name<input className={field} disabled={locked} value={ed.name} onChange={(e) => setE("name", e.target.value)} /></label>
                  <label className={lbl}>Phone / WhatsApp<input className={field} value={ed.phone} onChange={(e) => setE("phone", e.target.value)} /></label>
                  <label className={lbl}>Email<input className={field} type="email" value={ed.email} onChange={(e) => setE("email", e.target.value)} /></label>
                  <label className={lbl}>Pickup<input className={field} disabled={locked} value={ed.pickup} onChange={(e) => setE("pickup", e.target.value)} /></label>
                  <label className={lbl}>Drop-off<input className={field} disabled={locked} value={ed.drop} onChange={(e) => setE("drop", e.target.value)} /></label>
                  <label className={lbl}>Service
                    <select className={field} disabled={locked} value={ed.tripType} onChange={(e) => setE("tripType", e.target.value)}>
                      {["one_way", "round_trip", "airport_transfer", "multi_day", "hourly", "event"].map((t) => <option key={t} value={t}>{t.replace("_", " ")}</option>)}</select></label>
                  <label className={lbl}>Date<input className={field} type="date" disabled={locked} value={ed.date} onChange={(e) => setE("date", e.target.value)} /></label>
                  <label className={lbl}>Time<input className={field} type="time" disabled={locked} value={ed.time} onChange={(e) => setE("time", e.target.value)} /></label>
                  <label className={lbl}>Return date<input className={field} type="date" disabled={locked} value={ed.ret} onChange={(e) => setE("ret", e.target.value)} /></label>
                  <label className={lbl}>Vehicle
                    <select className={field} disabled={locked} value={ed.vehicle} onChange={(e) => setE("vehicle", e.target.value)}>
                      <option value="">—</option>{["sedan", "suv", "van", "bus", "limousine"].map((v) => <option key={v} value={v}>{v}</option>)}</select></label>
                  <label className={lbl}>Passengers<input className={field} type="number" min={1} disabled={locked} value={ed.pax} onChange={(e) => setE("pax", e.target.value)} /></label>
                  <label className={lbl}>Luggage<input className={field} disabled={locked} value={ed.luggage} onChange={(e) => setE("luggage", e.target.value)} /></label>
                </div>
                <div className="flex gap-2">
                  <button className={solid} disabled={busy !== null} onClick={saveEdit}>{busy === "edit" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Save"}</button>
                  <button className={`${btn} border-[#333] text-[#A1A1A6]`} onClick={() => setEditing(false)}>Cancel</button>
                </div>
              </div>
            )}
          </Card>

          {/* Ride, payment & receipt */}
          <Card title="Ride, payment & receipt">
            <div className="grid gap-5 lg:grid-cols-2">
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-[#F5F0E8]">Driver</h3>
                <select className="w-full rounded-lg border border-[#333] bg-black/40 px-3 py-2 text-sm text-[#F5F0E8]" value={fin.partnerId} onChange={(e) => assignDriver(e.target.value)}>
                  <option value="">— not assigned —</option>
                  <optgroup label="Main drivers">{drivers.filter((d) => d.kind === "main").map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</optgroup>
                  <optgroup label="Local drivers">{drivers.filter((d) => d.kind === "local").map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</optgroup>
                </select>
                <div className="grid grid-cols-3 gap-2">
                  <label className={lbl}>Share to driver %<input type="number" min={0} max={100} className={field} value={fin.share} onChange={(e) => setF("share", e.target.value)} /></label>
                  <label className={lbl}>Plate<input className={field} value={fin.plate} onChange={(e) => setF("plate", e.target.value)} /></label>
                  <label className={lbl}>Vehicle<input className={field} value={fin.vehicle} onChange={(e) => setF("vehicle", e.target.value)} /></label>
                </div>
                <button className={gold} disabled={busy !== null} onClick={() => saveFinance("driver")}>{busy === "fin-driver" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Save driver"}</button>
              </div>
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-[#F5F0E8]">Payment &amp; costs</h3>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  <label className={lbl}>Customer paid<input type="number" min={0} className={field} value={fin.paid} onChange={(e) => setF("paid", e.target.value)} /></label>
                  <label className={lbl}>Method
                    <select className={field} value={fin.method} onChange={(e) => setF("method", e.target.value)}><option>Cash</option><option>Bank transfer</option><option>Card</option></select></label>
                  <label className={lbl}>Driver cost<input type="number" min={0} className={field} value={fin.cost} onChange={(e) => setF("cost", e.target.value)} /></label>
                  <label className={lbl}>Extra cost<input type="number" min={0} className={field} value={fin.extra} onChange={(e) => setF("extra", e.target.value)} /></label>
                </div>
                <div className={`rounded-lg border px-3 py-2 font-mono text-sm ${liveMargin == null ? "border-[#333] text-[#7C8088]" : liveMargin < 0 ? "border-red-500/40 bg-red-500/10 font-bold text-red-400" : "border-green-500/30 text-green-500"}`}>
                  {liveMargin == null ? "Enter paid + driver cost to see the result" : liveMargin < 0
                    ? `LOSS SAR ${Math.abs(liveMargin).toLocaleString()}${pkr(Math.abs(liveMargin))} · your part SAR ${ownerPart!.toLocaleString()}`
                    : `Margin SAR ${liveMargin.toLocaleString()}${pkr(liveMargin)} · your part SAR ${ownerPart!.toLocaleString()}${pkr(ownerPart!)}`}
                </div>
                <button className={gold} disabled={busy !== null} onClick={() => saveFinance("money")}>{busy === "fin-money" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Save payment & costs"}</button>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[#222] pt-3">
              {!completed && q.status !== "cancelled" && <button className={solid} disabled={busy !== null} onClick={markCompleted}>{busy === "complete" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Mark ride Completed"}</button>}
              {completed && <button className={solid} disabled={busy !== null || !(q.actual_amount_paid && q.actual_amount_paid > 0)} title={!(q.actual_amount_paid && q.actual_amount_paid > 0) ? "Save the amount paid first" : undefined} onClick={issueReceipt}>
                {busy === "receipt-doc" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : issuedReceipt ? "Generate new receipt" : "Generate Receipt"}</button>}
            </div>
          </Card>

          {/* Quote lifecycle + sending */}
          <Card title="Quote & communication">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <button className={gold} disabled={busy !== null || stage === "ready" || !hasPrice} onClick={() => setStage("ready")}>Mark Ready</button>
              <button className={gold} disabled={busy !== null} onClick={() => setStage("accepted")}>Accepted</button>
              <button className={gold} disabled={busy !== null} onClick={() => setStage("rejected")}>Rejected</button>
              <button className={gold} disabled={busy !== null} onClick={() => setStage("expired")}>Expired</button>
              {!converted && q.status !== "cancelled" && (
                <button className={solid} disabled={busy !== null || !hasPrice} onClick={convert}>{busy === "convert" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Convert to Booking"}</button>
              )}
              {!locked && <button className={`${btn} border-red-500/40 text-red-400 hover:bg-red-500/10`} disabled={busy !== null} onClick={cancelBooking}>{busy === "cancel" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Cancel booking"}</button>}
            </div>
            {lastQuoteEmail?.status === "failed" && <p className="mb-2 flex items-center gap-2 text-sm font-bold text-red-400"><XCircle className="h-4 w-4" /> Email Failed — Retry ({lastQuoteEmail.error})</p>}
            {lastQuoteEmail?.status === "sent" && <p className="mb-2 flex items-center gap-2 text-sm font-bold text-green-500"><CheckCircle2 className="h-4 w-4" /> Quotation Sent ✓ to {lastQuoteEmail.recipient}</p>}
            {!hasPrice && <p className="mb-2 flex items-center gap-2 text-xs text-yellow-500"><AlertTriangle className="h-4 w-4" /> Set a price before sending a quotation.</p>}
            <SendRow t="quotation" disabled={!hasPrice} hint="PDF attached; internal copy BCC to info@taxisaudiarabia.com" />
            <SendRow t="followup" disabled={!hasPrice} />
            <SendRow t="confirmation" disabled={!converted} hint={!converted ? "Convert to booking first" : undefined} />
            <SendRow t="pickup" disabled={!converted} hint={!converted ? "Convert to booking first" : undefined} />
            <SendRow t="receipt" disabled={!completed || !q.actual_amount_paid} hint={!completed ? "Available once the ride is completed and paid" : undefined} />
            <SendRow t="thankyou" disabled={!completed} hint={!completed ? "Available once the ride is completed" : undefined} />
            <p className="mt-1 text-[0.7rem] text-[#7C8088]">Emails go only when you press the button, BCC the internal record address, and show Sent ✓ / Failed. WhatsApp opens a prefilled message you send yourself, then mark it sent. &quot;Viewed&quot; is not tracked (unreliable).</p>
          </Card>
        </div>

        <div className="space-y-4">
          {/* Financial */}
          <Card title="Financial">
            <KV k="Quoted" v={sar(q.quoted_price)} />
            <KV k="Customer paid" v={paidLabel} />
            <KV k="Driver / vendor cost" v={sar(q.driver_cost)} />
            {(q.extra_cost ?? 0) > 0 && <KV k="Extra cost" v={sar(q.extra_cost)} />}
            <KV k="Result" v={
              q.financial_status === "required" ? <span className="font-bold text-yellow-500">Financial data required</span>
              : margin == null ? "—"
              : <span className={margin < 0 ? "font-bold text-red-400" : "font-bold text-green-500"}>{margin < 0 ? `LOSS ${sar(Math.abs(margin))}` : `Profit ${sar(margin)}`}{pkr(Math.abs(margin))}</span>} />
            {margin != null && q.partner_share_pct != null && (
              <KV k={`Your part (${100 - q.partner_share_pct}%)`} v={`${sar((margin * (100 - q.partner_share_pct)) / 100)}${pkr((margin * (100 - q.partner_share_pct)) / 100)}`} />
            )}
            {!locked && (
              <div className="mt-3 space-y-2 border-t border-[#222] pt-3">
                <div className="grid grid-cols-2 gap-2">
                  <label className={lbl}>Quoted<input type="number" min={0} className={field} value={pr.price} onChange={(e) => setPr((x) => ({ ...x, price: e.target.value }))} /></label>
                  <label className={lbl}>Exp. cost<input type="number" min={0} className={field} value={pr.est} onChange={(e) => setPr((x) => ({ ...x, est: e.target.value }))} /></label>
                  <label className={lbl}>Valid until<input type="date" className={field} value={pr.valid} onChange={(e) => setPr((x) => ({ ...x, valid: e.target.value }))} /></label>
                </div>
                <button className={gold} disabled={busy !== null} onClick={savePrice}>{busy === "price" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Save price"}</button>
              </div>
            )}
          </Card>

          {/* Documents */}
          <Card title="Documents">
            <div className="flex flex-col gap-2">
              {hasPrice && <a className={gold} href={`/api/quotations/${q.id}/invoice`}><FileText className="h-3.5 w-3.5" /> Quotation PDF</a>}
              {docs.filter((d) => d.kind === "receipt").map((d) => (
                <a key={d.id} className={gold} href={`/api/admin/documents/${d.id}`} target="_blank" rel="noreferrer"><Receipt className="h-3.5 w-3.5" /> Receipt · {ksa(d.created_at)}{d.amount != null ? ` · SAR ${d.amount.toLocaleString()}` : ""}</a>
              ))}
              {!hasPrice && docs.length === 0 && <span className="text-xs text-[#7C8088]">No documents yet.</span>}
            </div>
          </Card>

          {/* Timeline */}
          <Card title="Timeline">
            <ol className="relative space-y-3 border-l border-[#333] pl-4">
              {timeline.map((t, i) => (
                <li key={i} className="relative">
                  <span className={`absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full ${t.tone === "ok" ? "bg-green-500" : t.tone === "bad" ? "bg-red-500" : t.tone === "warn" ? "bg-yellow-500" : "bg-[#7C8088]"}`} />
                  <div className={`text-xs font-bold ${t.tone === "bad" ? "text-red-400" : "text-[#F5F0E8]"}`}>{t.label}</div>
                  <div className="text-[0.65rem] text-[#7C8088]">{ksa(t.at)} KSA{t.detail ? ` · ${t.detail}` : ""}</div>
                </li>
              ))}
            </ol>
          </Card>

          <Card title="Notes">
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} className="w-full rounded-lg border border-[#333] bg-black/40 px-2 py-1.5 text-xs text-[#F5F0E8] outline-none focus:border-[#C9A84C]" placeholder="Internal notes (never shown to the client)" />
            <button className={`${gold} mt-2`} disabled={busy !== null || notes === (q.admin_notes ?? "")} onClick={saveNotes}>{busy === "notes" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Save notes"}</button>
            {q.financial_note && <p className="mt-2 whitespace-pre-wrap text-[0.7rem] text-[#7C8088]">{q.financial_note}</p>}
          </Card>

          <div className="flex flex-wrap items-center gap-3 px-1 text-[0.7rem] text-[#7C8088]">
            <button className="underline hover:text-[#F5F0E8]" disabled={busy !== null} onClick={toggleTest}>{q.is_test ? "Unmark as test" : "Mark as test record"}</button>
            {q.is_test && <button className="underline text-red-400" onClick={deleteTest}>Delete test record</button>}
          </div>
        </div>
      </div>
    </div>
  );
}
