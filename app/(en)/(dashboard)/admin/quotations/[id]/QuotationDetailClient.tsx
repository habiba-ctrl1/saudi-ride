"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, CheckCircle2, FileText, Loader2, Mail, MessageCircle, Pencil, Receipt, XCircle, AlertTriangle, User } from "lucide-react";
import type { QuotationRow } from "@/lib/supabase/quotations";
import type { CommRow } from "@/lib/ops/comms";
import type { PaymentRow } from "@/lib/ops/payments";
import type { VersionRow } from "@/lib/ops/versions";
import type { InvoiceRow } from "@/lib/ops/invoices";
import { InvoicesCard } from "./InvoicesCard";
import type { TimelineItem } from "@/lib/ops/events";
import { LIFECYCLE } from "@/lib/ops/events";
import type { OpsTemplate } from "@/lib/email/ops-template-labels";
import { OPS_TEMPLATE_LABEL } from "@/lib/email/ops-template-labels";
import { STAGE_LABEL, effectiveStage, isConvertedToBooking } from "@/lib/ops/quote-stage";
import { waLink, waText } from "@/lib/ops/wa-text";

type Assignable = { id: string; name: string; phone: string | null; kind: "main" | "local"; default_share_pct: number };
type Doc = { id: string; kind: string; number: string; amount: number | null; created_at: string };
type Lifecycle = { done: boolean[]; currentIndex: number };

const btn = "inline-flex min-h-10 items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-semibold disabled:opacity-40 transition";
const gold = `${btn} border-emerald-200 bg-white text-emerald-700 hover:bg-emerald-50`;
const solid = `${btn} border-transparent bg-emerald-600 text-white hover:bg-emerald-700`;
const field = "mt-1 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-emerald-500 disabled:bg-slate-50 disabled:text-slate-400";
const lbl = "text-xs font-medium text-slate-500";
const sar = (n: number | null | undefined) => (n == null ? "—" : `SAR ${n.toLocaleString("en-US", { maximumFractionDigits: 2 })}`);
const ksa = (s: string) => {
  const d = new Date(s.replace(" ", "T").replace(/([+-]\d{2})$/, "$1:00"));
  return Number.isNaN(d.getTime()) ? s.slice(0, 16) : d.toLocaleString("en-GB", { timeZone: "Asia/Riyadh", day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
};

function Card({ title, right, children }: { title: string; right?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-base font-semibold text-slate-900">{title}</h2>
        {right}
      </div>
      {children}
    </section>
  );
}
const KV = ({ k, v }: { k: string; v: React.ReactNode }) => (
  <div className="flex justify-between gap-4 border-b border-slate-100 py-2 text-sm last:border-0">
    <span className="shrink-0 text-slate-500">{k}</span>
    <span className="min-w-0 break-words text-right text-slate-900">{v}</span>
  </div>
);

const NEXT_TEXT: Record<string, string> = {
  Quotation: "Set a price and send the quotation", Accepted: "Wait for the customer to accept", Confirmed: "Convert the quote to a booking",
  "Driver assigned": "Assign a driver", "Pickup details sent": "Send pickup details to the customer", "Ride completed": "Mark the ride completed",
  "Payment completed": "Record the customer's payment", "Receipt generated": "Generate the receipt", "Financials closed": "Enter the driver cost to close the books",
};
const PAY_METHODS = ["Cash", "Bank transfer", "Card", "Other"];
const today = () => new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Riyadh" });

/** Payments ledger for one booking: record what was received, void mistakes, issue a receipt per payment. */
function PaymentsPanel({ q, payments, busy, setBusy, setMsg, refresh }: {
  q: QuotationRow; payments: PaymentRow[]; busy: string | null; setBusy: (b: string | null) => void;
  setMsg: (m: { ok: boolean; text: string } | null) => void; refresh: () => void;
}) {
  const valid = payments.filter((p) => !p.voided_at);
  const received = valid.reduce((a, p) => a + p.amount, 0);
  const fare = q.quoted_price;
  const balance = fare != null ? Math.max(fare - received, 0) : null;
  const settled = q.payment_status === "paid";
  const [f, setF] = useState({ amount: "", method: "Cash", date: today(), ref: "", closes: false });
  const set = (k: keyof typeof f, v: string | boolean) => setF((x) => ({ ...x, [k]: v }));

  async function api(key: string, method: "POST" | "PATCH", body: unknown, ok: string) {
    setBusy(key); setMsg(null);
    try {
      const r = await fetch(`/api/admin/quotations/${q.id}/${key.startsWith("rc") ? "receipt-doc" : "payments"}`, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) setMsg({ ok: false, text: j.error || "Action failed" });
      else { setMsg({ ok: true, text: key.startsWith("rc") ? (j.fullyPaid ? "Receipt saved with PAID stamp." : `Receipt saved as PART PAYMENT (balance ${sar(j.balance)}).`) : ok }); if (key === "pay") setF((x) => ({ ...x, amount: "", ref: "", closes: false })); refresh(); }
    } catch { setMsg({ ok: false, text: "Network error" }); } finally { setBusy(null); }
  }
  const record = () => {
    const amount = Number(f.amount);
    if (!Number.isFinite(amount) || amount <= 0) return setMsg({ ok: false, text: "Enter the amount actually received" });
    if (f.closes && !window.confirm("Mark the booking as fully PAID although less than the agreed fare was received? Use this only for an agreed discount or write-off.")) return;
    api("pay", "POST", { amount, method: f.method, paid_at: f.date || null, reference: f.ref || null, closes_balance: f.closes }, "Payment recorded.");
  };
  const voidIt = (p: PaymentRow) => {
    const reason = window.prompt(`Void the ${sar(p.amount)} payment? It stays in history. Reason (required):`);
    if (reason && reason.trim()) api(`void-${p.id}`, "PATCH", { payment_id: p.id, reason }, "Payment voided.");
  };

  return (
    <div id="payment-card" className="mt-5 scroll-mt-6 space-y-3 border-t border-slate-100 pt-4">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs">
        <h3 className="text-sm font-semibold text-slate-900">Customer payments</h3>
        <span className="text-slate-500">Agreed fare <b className="text-slate-900">{sar(fare)}</b></span>
        <span className="text-slate-500">Received <b className="text-emerald-600">{sar(received)}</b></span>
        <span className="text-slate-500">Balance <b className={settled || balance === 0 ? "text-emerald-600" : "text-amber-600"}>{settled ? "SAR 0 (settled)" : sar(balance)}</b></span>
        <span className={`rounded border px-1.5 py-0.5 text-xs font-bold uppercase ${settled ? "border-emerald-200 bg-emerald-50 text-emerald-700" : q.payment_status === "partial" ? "border-amber-200 bg-amber-50 text-amber-700" : "border-slate-200 text-slate-500"}`}>{q.payment_status}</span>
      </div>

      {payments.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-slate-100">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-widest text-slate-500"><tr><th className="p-2">Date</th><th className="p-2">Amount</th><th className="p-2">Method</th><th className="p-2">Reference</th><th className="p-2" /></tr></thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              {payments.map((p) => (
                <tr key={p.id} className={p.voided_at ? "opacity-50" : ""}>
                  <td className="p-2 whitespace-nowrap">{p.paid_at ?? <span className="text-slate-500" title="Date was not recorded">not recorded</span>}</td>
                  <td className={`p-2 font-mono ${p.voided_at ? "line-through" : ""}`}>{sar(p.amount)}{p.closes_balance && !p.voided_at ? <span className="ml-1 text-xs text-emerald-600" title="Closed the balance">settles</span> : null}</td>
                  <td className="p-2">{p.method ?? "—"}</td>
                  <td className="p-2">{p.reference ?? "—"}{p.voided_at ? <div className="text-rose-600">Voided: {p.void_reason}</div> : null}</td>
                  <td className="p-2 whitespace-nowrap text-right">
                    {!p.voided_at && (p.receipt_doc_id
                      ? <a className="font-bold text-emerald-700 hover:underline" href={`/api/admin/documents/${p.receipt_doc_id}`} target="_blank" rel="noreferrer">Open receipt</a>
                      : <button className="font-bold text-emerald-700 hover:underline disabled:opacity-40" disabled={busy !== null} onClick={() => api(`rc-${p.id}`, "POST", { payment_id: p.id }, "")}>{busy === `rc-${p.id}` ? "…" : "Issue receipt"}</button>)}
                    {!p.voided_at && <button className="ml-3 text-rose-600 hover:underline disabled:opacity-40" disabled={busy !== null} onClick={() => voidIt(p)}>Void</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {payments.length === 0 && <p className="text-xs text-slate-500">No payment recorded yet. Receipts can only be issued for a payment that was actually received.</p>}

      {q.status !== "cancelled" && (
        <div className="rounded-lg border border-slate-100 p-3">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            <label className={lbl}>Amount received (SAR)<input type="number" min={0} step="0.01" className={field} value={f.amount} placeholder={balance ? String(balance) : ""} onChange={(e) => set("amount", e.target.value)} /></label>
            <label className={lbl}>Method<select className={field} value={f.method} onChange={(e) => set("method", e.target.value)}>{PAY_METHODS.map((m) => <option key={m}>{m}</option>)}</select></label>
            <label className={lbl}>Date received<input type="date" className={field} value={f.date} onChange={(e) => set("date", e.target.value)} /></label>
            <label className={`${lbl} col-span-2`}>Reference (optional)<input className={field} value={f.ref} onChange={(e) => set("ref", e.target.value)} /></label>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <button className={solid} disabled={busy !== null} onClick={record}>{busy === "pay" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Record payment"}</button>
            {balance != null && balance > 0 && <button className={gold} type="button" onClick={() => set("amount", String(balance))}>Fill balance {sar(balance)}</button>}
            <label className="flex items-center gap-1.5 text-xs text-slate-500"><input type="checkbox" checked={f.closes} onChange={(e) => set("closes", e.target.checked)} /> Final payment — accept as settled even if below the fare</label>
          </div>
          <p className="mt-2 text-xs text-slate-500">Recording does not email anyone and does not issue a receipt. Status becomes Paid only when payments reach the fare (or you tick the box above).</p>
        </div>
      )}
    </div>
  );
}

export function QuotationDetailClient({ q, comms, drivers, pkrRate, docs, timeline, lifecycle, payments, versions, invoices }: {
  q: QuotationRow; comms: CommRow[]; drivers: Assignable[]; pkrRate: number | null; docs: Doc[]; timeline: TimelineItem[]; lifecycle: Lifecycle; payments: PaymentRow[]; versions: VersionRow[]; invoices: InvoiceRow[];
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
    cost: n2s(q.driver_cost), extra: n2s(q.extra_cost ?? 0),
  });
  const setF = (k: keyof typeof fin, v: string) => setFin((x) => ({ ...x, [k]: v }));
  const pPaid = q.actual_amount_paid ?? null; // total received = sum of recorded payments
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
      : { driver_cost: pCost, extra_cost: pExtra };
    return call(`fin-${what}`, `/api/admin/quotations/${q.id}/finance`, "PATCH", body, what === "driver" ? "Driver saved." : "Costs saved.");
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

  // ── Send / lifecycle ──
  const sendEmail = (t: OpsTemplate) => call(`mail-${t}`, `/api/admin/quotations/${q.id}/send`, "POST", { template: t }, `${OPS_TEMPLATE_LABEL[t]} emailed to ${q.customer_email}. A record copy went to info@taxisaudiarabia.com.`);
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
        <span className="w-48 text-sm font-semibold text-slate-900">
          {OPS_TEMPLATE_LABEL[t]}
          {last && <span className={`ml-1 font-normal ${last.status === "sent" ? "text-emerald-600" : "text-rose-600"}`}>{last.status === "sent" ? "✓ sent" : "✗ failed"}</span>}
        </span>
        <button className={gold} disabled={disabled || !hasEmail || busy !== null} title={!hasEmail ? "No email on file" : hint} onClick={() => sendEmail(t)}>
          {busy === `mail-${t}` ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Mail className="h-3.5 w-3.5" />} {last?.status === "failed" ? "Retry email" : "Email"}
        </button>
        <a className={gold} href={link} target="_blank" rel="noreferrer"><MessageCircle className="h-3.5 w-3.5" /> WhatsApp</a>
        <button className={`${btn} border-slate-200 text-slate-600 hover:text-slate-900`} disabled={busy !== null} onClick={() => markWa(t)}>
          {busy === `wa-${t}` ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Mark sent on WhatsApp"}
        </button>
      </div>
    );
  }

  const paidLabel = q.actual_amount_paid != null ? `${sar(q.actual_amount_paid)}${q.payment_method_used ? ` (${q.payment_method_used})` : ""}` : q.payment_status;
  const driverLabel = q.driver_name ?? q.drivers?.full_name ?? "Not assigned";

  return (
    <div className="mx-auto max-w-7xl space-y-5 pb-10">
      {/* Header */}
      <div>
        <Link href="/admin/quotations" className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:underline"><ArrowLeft className="h-4 w-4" /> Back to Quotes &amp; Bookings</Link>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-bold text-slate-900">{q.customer_name}</h1>
          <span className="font-mono text-sm text-slate-400">{q.quote_reference}</span>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${completed ? "bg-emerald-50 text-emerald-700" : q.status === "cancelled" ? "bg-rose-50 text-rose-700" : converted ? "bg-sky-50 text-sky-700" : "bg-amber-50 text-amber-700"}`}>
            {completed ? "Completed" : q.status === "cancelled" ? "Cancelled" : converted ? "Confirmed booking" : `Quote: ${STAGE_LABEL[stage]}`}
          </span>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${q.payment_status === "paid" ? "bg-emerald-50 text-emerald-700" : q.payment_status === "partial" ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-600"}`}>
            {q.payment_status === "paid" ? "Paid" : q.payment_status === "partial" ? "Part paid" : "Not paid yet"}
          </span>
          {margin != null && margin < 0 && <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">Lost money</span>}
          {q.is_test && <span className="text-xs font-bold text-purple-600">TEST</span>}
        </div>
        <p className="mt-1 text-slate-600">{q.pickup_location} → {q.drop_location}</p>
      </div>

      {/* Next step */}
      {!lifecycle.done.every(Boolean) && q.status !== "cancelled" && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Next step</div>
            <div className="text-lg font-semibold text-slate-900">{NEXT_TEXT[LIFECYCLE[lifecycle.currentIndex]] ?? LIFECYCLE[lifecycle.currentIndex]}</div>
          </div>
          <div className="flex flex-wrap gap-2">
            {converted && !completed && <button className={solid} disabled={busy !== null} onClick={() => window.confirm(`Mark ${q.quote_reference} as completed? No email is sent.`) && markCompleted()}>{busy === "complete" ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />} Mark ride completed</button>}
            {converted && !(q.partner_id || q.driver_name || q.assigned_driver_id) && <a className={gold} href="#driver-card">Assign a driver</a>}
            {completed && q.payment_status !== "paid" && <a className={solid} href="#payment-card">Record payment</a>}
            {!converted && hasPrice && <button className={solid} disabled={busy !== null} onClick={convert}>Convert to booking</button>}
          </div>
        </div>
      )}

      {/* Key facts strip */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {[
          ["When", `${q.trip_date}${q.trip_time ? ` · ${q.trip_time.slice(0, 5)}` : ""}`],
          ["Quoted price", sar(q.quoted_price)],
          ["Money received", q.actual_amount_paid != null ? sar(q.actual_amount_paid) : "Nothing yet"],
          ["Driver", driverLabel],
          ["Profit", q.financial_status === "required" ? "Driver cost missing" : margin == null ? (expected != null ? `Expected ${sar(expected)}` : "—") : margin < 0 ? `Lost ${sar(Math.abs(margin))}` : sar(margin)],
        ].map(([k, v]) => (
          <div key={k} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <div className="text-xs font-medium text-slate-500">{k}</div>
            <div className={`mt-0.5 text-base font-bold ${k === "Profit" && (margin ?? 0) < 0 ? "text-rose-600" : k === "Profit" && q.financial_status === "required" ? "text-amber-600" : k === "Driver" && !(q.driver_name || q.drivers?.full_name) ? "text-amber-600" : "text-slate-900"}`}>{v}</div>
          </div>
        ))}
      </div>

      {/* Progress */}
      <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
        <div className="mb-2 text-sm font-semibold text-slate-900">Progress</div>
        <ol className="flex flex-wrap items-center gap-x-1 gap-y-2">
          {LIFECYCLE.map((step, i) => {
            const done = lifecycle.done[i];
            const current = i === lifecycle.currentIndex && !lifecycle.done.every(Boolean);
            return (
              <li key={step} className="flex items-center gap-1">
                <div className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${done ? "border-emerald-200 bg-emerald-50 text-emerald-700" : current ? "border-emerald-600 bg-white text-emerald-700" : "border-slate-200 text-slate-400"}`}>
                  {done ? <Check className="h-3 w-3" /> : <span>{i + 1}</span>} {step}
                </div>
                {i < LIFECYCLE.length - 1 && <span className="text-slate-300">›</span>}
              </li>
            );
          })}
        </ol>
        <p className="mt-2 text-xs text-slate-400">Steps tick themselves from real records — nothing is ticked by hand.</p>
      </div>

      {msg && (
        <div className={`flex items-start gap-2 rounded-xl border px-4 py-3 text-sm ${msg.ok ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-rose-200 bg-rose-50 text-rose-700"}`}>
          {msg.ok ? <CheckCircle2 className="mt-0.5 h-4 w-4" /> : <XCircle className="mt-0.5 h-4 w-4" />} {msg.text}
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="min-w-0 space-y-5 lg:col-span-2">
          {/* Client & trip */}
          <Card title="Client & trip details" right={
            !editing ? <button className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:underline" onClick={() => setEditing(true)}><Pencil className="h-3 w-3" /> Edit</button> : null}>
            {!editing ? (
              <div className="grid gap-x-8 sm:grid-cols-2">
                <div>
                  <KV k="Client" v={<>{q.customer_name} {q.client_id && <Link className="ml-1 inline-flex items-center gap-0.5 text-emerald-700 hover:underline" href={`/admin/clients/${q.client_id}`}><User className="h-3 w-3" />history</Link>}</>} />
                  <KV k="Phone / WhatsApp" v={q.customer_phone} />
                  <KV k="Email" v={q.customer_email ?? <span className="text-amber-600">none — Edit to add</span>} />
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
                {locked && <p className="text-xs text-amber-600">This ride is {q.status}: trip details are locked for record integrity. You can still fix phone and email.</p>}
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
                  <button className={`${btn} border-slate-200 text-slate-600`} onClick={() => setEditing(false)}>Cancel</button>
                </div>
              </div>
            )}
          </Card>

          {/* Ride, payment & receipt */}
          <Card title="Driver, costs & payment">
            <div className="grid gap-5 lg:grid-cols-2">
              <div id="driver-card" className="scroll-mt-6 space-y-2">
                <h3 className="text-sm font-semibold text-slate-900">Driver</h3>
                <select className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900" value={fin.partnerId} onChange={(e) => assignDriver(e.target.value)}>
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
                <h3 className="text-sm font-semibold text-slate-900">Costs</h3>
                <div className="grid grid-cols-2 gap-2">
                  <label className={lbl}>Driver cost<input type="number" min={0} className={field} value={fin.cost} onChange={(e) => setF("cost", e.target.value)} /></label>
                  <label className={lbl}>Extra cost<input type="number" min={0} className={field} value={fin.extra} onChange={(e) => setF("extra", e.target.value)} /></label>
                </div>
                <div className={`rounded-lg border px-3 py-2 font-mono text-sm ${liveMargin == null ? "border-slate-200 text-slate-500" : liveMargin < 0 ? "border-rose-200 bg-rose-50 font-bold text-rose-700" : "border-green-500/30 text-emerald-600"}`}>
                  {liveMargin == null ? "Needs a recorded payment + driver cost to show the result" : liveMargin < 0
                    ? `LOSS SAR ${Math.abs(liveMargin).toLocaleString()}${pkr(Math.abs(liveMargin))} · your part SAR ${ownerPart!.toLocaleString()}`
                    : `Margin SAR ${liveMargin.toLocaleString()}${pkr(liveMargin)} · your part SAR ${ownerPart!.toLocaleString()}${pkr(ownerPart!)}`}
                </div>
                <button className={gold} disabled={busy !== null} onClick={() => saveFinance("money")}>{busy === "fin-money" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Save costs"}</button>
              </div>
            </div>
            <PaymentsPanel q={q} payments={payments} busy={busy} setBusy={setBusy} setMsg={setMsg} refresh={() => router.refresh()} />

            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
              {!completed && q.status !== "cancelled" && <button className={solid} disabled={busy !== null} onClick={markCompleted}>{busy === "complete" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Mark ride Completed"}</button>}
            </div>
          </Card>

          {/* Quote lifecycle + sending */}
          <Card title="Send to customer">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <button className={gold} disabled={busy !== null || stage === "ready" || !hasPrice} onClick={() => setStage("ready")}>Mark Ready</button>
              <button className={gold} disabled={busy !== null} onClick={() => setStage("accepted")}>Accepted</button>
              <button className={gold} disabled={busy !== null} onClick={() => setStage("rejected")}>Rejected</button>
              <button className={gold} disabled={busy !== null} onClick={() => setStage("expired")}>Expired</button>
              {!converted && q.status !== "cancelled" && (
                <button className={solid} disabled={busy !== null || !hasPrice} onClick={convert}>{busy === "convert" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Convert to Booking"}</button>
              )}
              {!locked && <button className={`${btn} border-rose-200 text-rose-700 hover:bg-rose-50`} disabled={busy !== null} onClick={cancelBooking}>{busy === "cancel" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Cancel booking"}</button>}
            </div>
            {lastQuoteEmail?.status === "failed" && <p className="mb-2 flex items-center gap-2 text-sm font-bold text-rose-600"><XCircle className="h-4 w-4" /> Email Failed — Retry ({lastQuoteEmail.error})</p>}
            {lastQuoteEmail?.status === "sent" && <p className="mb-2 flex items-center gap-2 text-sm font-bold text-emerald-600"><CheckCircle2 className="h-4 w-4" /> Quotation Sent ✓ to {lastQuoteEmail.recipient}</p>}
            {!hasPrice && <p className="mb-2 flex items-center gap-2 text-xs text-amber-600"><AlertTriangle className="h-4 w-4" /> Set a price before sending a quotation.</p>}
            <SendRow t="quotation" disabled={!hasPrice} hint="PDF attached; a separate record copy goes to info@taxisaudiarabia.com" />
            <SendRow t="followup" disabled={!hasPrice} />
            <SendRow t="confirmation" disabled={!converted} hint={!converted ? "Convert to booking first" : undefined} />
            <SendRow t="pickup" disabled={!converted} hint={!converted ? "Convert to booking first" : undefined} />
            <SendRow t="receipt" disabled={!completed || !q.actual_amount_paid} hint={!completed ? "Available once the ride is completed and paid" : undefined} />
            <SendRow t="thankyou" disabled={!completed} hint={!completed ? "Available once the ride is completed" : undefined} />
            <p className="mt-1 text-xs text-slate-500">Emails go only when you press the button, a separate &quot;[TSA copy]&quot; record copy goes to the office inbox, and show Sent ✓ / Failed. WhatsApp opens a prefilled message you send yourself, then mark it sent. &quot;Viewed&quot; is not tracked (unreliable).</p>
          </Card>
        </div>

        <div className="min-w-0 space-y-5">
          {/* Financial */}
          <Card title={`Quotation versions (${versions.length})`}>
            {versions.length === 0 && <p className="text-xs text-slate-500">No version yet — one is saved automatically when a price is set. Earlier edits are never overwritten.</p>}
            <ul className="space-y-2">
              {versions.map((v, i) => {
                const prev = versions[i + 1];
                const priceChanged = prev && prev.price !== v.price;
                return (
                  <li key={v.id} className="rounded-lg border border-slate-100 p-2 text-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-bold text-slate-900">v{v.version_no}{i === 0 ? <span className="ml-2 rounded border border-green-500/40 px-1 text-xs text-emerald-600">CURRENT</span> : null}</span>
                      <span className="text-slate-500">{ksa(v.created_at)} · {v.reason.replace("_", " ")}{v.created_by ? ` · ${v.created_by}` : ""}</span>
                    </div>
                    <div className="mt-1 text-slate-600">
                      <b className="text-slate-900">{sar(v.price)}</b>{priceChanged ? <span className="text-amber-600"> (was {sar(prev.price)})</span> : null}
                      {v.valid_until ? ` · valid until ${v.valid_until}` : ""} · {v.snapshot.trip_date} {v.snapshot.trip_time?.slice(0, 5) ?? ""} · {v.snapshot.pickup_location} → {v.snapshot.drop_location}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">Template: {v.template_version}</div>
                    {v.sends.map((s, k) => (
                      <div key={k} className={`mt-0.5 ${s.status === "sent" ? "text-emerald-600" : "text-rose-600"}`}>
                        {s.status === "sent" ? "✓" : "✗ FAILED"} {s.template} via {s.channel}{s.recipient ? ` to ${s.recipient}` : ""} · {ksa(s.at)}{s.error ? ` — ${s.error}` : ""}
                      </div>
                    ))}
                    <a className="mt-1 inline-block font-bold text-emerald-700 hover:underline" href={`/api/admin/quotation-versions/${v.id}`} target="_blank" rel="noreferrer">View this version (PDF)</a>
                  </li>
                );
              })}
            </ul>
          </Card>

          <Card title={`Invoices (${invoices.filter((i) => i.status === "issued").length})`}>
            <InvoicesCard q={q} invoices={invoices} paid={payments.filter((p) => !p.voided_at).reduce((a, p) => a + p.amount, 0)} settled={q.payment_status === "paid"} busy={busy} setBusy={setBusy} setMsg={setMsg} refresh={() => router.refresh()} />
          </Card>

          <Card title="Money summary">
            <KV k="Quoted" v={sar(q.quoted_price)} />
            <KV k="Customer paid" v={paidLabel} />
            <KV k="Driver / vendor cost" v={sar(q.driver_cost)} />
            {(q.extra_cost ?? 0) > 0 && <KV k="Extra cost" v={sar(q.extra_cost)} />}
            <KV k="Result" v={
              q.financial_status === "required" ? <span className="font-bold text-amber-600">Financial data required</span>
              : margin == null ? "—"
              : <span className={margin < 0 ? "font-bold text-rose-600" : "font-bold text-emerald-600"}>{margin < 0 ? `LOSS ${sar(Math.abs(margin))}` : `Profit ${sar(margin)}`}{pkr(Math.abs(margin))}</span>} />
            {margin != null && q.partner_share_pct != null && (
              <KV k={`Your part (${100 - q.partner_share_pct}%)`} v={`${sar((margin * (100 - q.partner_share_pct)) / 100)}${pkr((margin * (100 - q.partner_share_pct)) / 100)}`} />
            )}
            {!locked && (
              <div className="mt-3 space-y-2 border-t border-slate-100 pt-3">
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
              {!hasPrice && docs.length === 0 && <span className="text-xs text-slate-500">No documents yet.</span>}
            </div>
          </Card>

          {/* Timeline */}
          <Card title="Timeline">
            <ol className="relative space-y-3 border-l border-slate-200 pl-4">
              {timeline.map((t, i) => (
                <li key={i} className="relative">
                  <span className={`absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full ${t.tone === "ok" ? "bg-emerald-500" : t.tone === "bad" ? "bg-rose-500" : t.tone === "warn" ? "bg-amber-500" : "bg-slate-400"}`} />
                  <div className={`text-xs font-bold ${t.tone === "bad" ? "text-rose-600" : "text-slate-900"}`}>{t.label}</div>
                  <div className="text-xs text-slate-500">{ksa(t.at)} KSA{t.detail ? ` · ${t.detail}` : ""}</div>
                </li>
              ))}
            </ol>
          </Card>

          <Card title="Notes">
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-900 outline-none focus:border-[#C9A84C]" placeholder="Internal notes (never shown to the client)" />
            <button className={`${gold} mt-2`} disabled={busy !== null || notes === (q.admin_notes ?? "")} onClick={saveNotes}>{busy === "notes" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Save notes"}</button>
            {q.financial_note && <p className="mt-2 whitespace-pre-wrap text-xs text-slate-500">{q.financial_note}</p>}
          </Card>

          <div className="flex flex-wrap items-center gap-3 px-1 text-xs text-slate-500">
            <button className="underline hover:text-slate-900" disabled={busy !== null} onClick={toggleTest}>{q.is_test ? "Unmark as test" : "Mark as test record"}</button>
            {q.is_test && <button className="underline text-rose-600" onClick={deleteTest}>Delete test record</button>}
          </div>
        </div>
      </div>
    </div>
  );
}
