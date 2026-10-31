"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, FileText, Loader2, Mail, MessageCircle, Star, XCircle } from "lucide-react";
import type { ReceiptRow } from "@/lib/ops/receipts";
import { waLink } from "@/lib/ops/wa-text";

const money = (n: number | null, cur = "SAR") => (n == null ? "—" : `${cur} ${n.toLocaleString("en-US", { maximumFractionDigits: 2 })}`);
const day = (s: string | null) => (s ? new Date(s.slice(0, 10) + "T00:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }) : "—");
const btn = "inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-sm font-semibold disabled:opacity-40";
const solid = `${btn} border-transparent bg-emerald-600 text-white hover:bg-emerald-700`;
const outline = `${btn} border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:text-emerald-700`;

type TabKey = "tosend" | "sent" | "all";

export function ReceiptsClient({ ready, issued, tab, reviewUrl }: { ready: ReceiptRow[]; issued: ReceiptRow[]; tab: TabKey; reviewUrl: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [q, setQ] = useState("");

  const isSent = (r: ReceiptRow) => r.email_status === "sent" || !!r.wa_sent_at;
  const all = [...ready, ...issued];
  const sentRows = all.filter(isSent);
  const toSend = all.filter((r) => !isSent(r));
  const rows = (tab === "tosend" ? toSend : tab === "sent" ? sentRows : all).filter((r) => {
    const s = q.trim().toLowerCase();
    return !s || [r.customer_name, r.quote_reference, r.number ?? "", r.customer_phone].some((v) => v.toLowerCase().includes(s));
  });
  const totalIssued = issued.filter((r) => r.currency === "SAR").reduce((a, r) => a + (r.amount ?? 0), 0);
  const [sel, setSel] = useState<Set<string>>(new Set());
  const toggle = (id: string) => setSel((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  const allVisible = rows.length > 0 && rows.every((r) => sel.has(r.quotation_id));

  async function call(key: string, url: string, body: unknown, okText: string) {
    setBusy(key); setMsg(null);
    try {
      const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) setMsg({ ok: false, text: data.error || "Action failed" });
      else { setMsg({ ok: true, text: okText }); router.refresh(); }
    } catch { setMsg({ ok: false, text: "Network error" }); } finally { setBusy(null); }
  }
  const bulk = (channels: ("whatsapp" | "email")[]) => {
    const n = sel.size;
    const via = channels.length === 2 ? "WhatsApp and email" : channels[0] === "whatsapp" ? "WhatsApp" : "email";
    if (!window.confirm(`Record ${n} ride${n === 1 ? "" : "s"} as ALREADY SENT by you on ${via}?

This only updates the status here. Nothing is sent to any customer.`)) return;
    call("bulk", "/api/admin/receipts/mark-sent", { ids: [...sel], channels }, `${n} ride${n === 1 ? "" : "s"} recorded as already sent on ${via}.`).then(() => setSel(new Set()));
  };
  const reviewMsg = (r: ReceiptRow) =>
    `Hello ${r.customer_name.trim().split(/\s+/)[0]}, thank you for travelling with Taxi Saudi Arabia. If you were happy with your trip, we would be grateful for an honest review: ${reviewUrl}`;
  const markReview = (ids: string[]) => call("review", "/api/admin/receipts/mark-review", { ids }, `${ids.length} ride${ids.length === 1 ? "" : "s"} recorded as review requested.`).then(() => setSel(new Set()));
  const issue = (r: ReceiptRow) => call(`i-${r.quotation_id}`, `/api/admin/quotations/${r.quotation_id}/receipt-doc`, {}, `Receipt saved for ${r.quote_reference}. Nothing was sent to the customer.`);
  const email = (r: ReceiptRow) => {
    if (!r.customer_email) return;
    if (!window.confirm(`Email the receipt for ${r.quote_reference} to ${r.customer_email}?\n(A record copy also goes to the office inbox.)`)) return;
    call(`e-${r.doc_id}`, `/api/admin/quotations/${r.quotation_id}/send`, { template: "receipt" }, `Receipt emailed to ${r.customer_email}.`);
  };
  const markWa = (r: ReceiptRow) => call(`w-${r.doc_id}`, `/api/admin/quotations/${r.quotation_id}/whatsapp-sent`, { template: "receipt" }, "Recorded as sent on WhatsApp.");
  const waMsg = (r: ReceiptRow) =>
    `Hello ${r.customer_name.trim().split(/\s+/)[0]}, thank you for travelling with Taxi Saudi Arabia. Payment received${r.amount != null ? `: SAR ${r.amount.toLocaleString("en-US")}` : ""} for booking ${r.quote_reference} (${r.pickup_location} to ${r.drop_location}). Your receipt is attached.`;

  const tabs: { key: TabKey; label: string; n: number }[] = [
    { key: "tosend", label: "Not sent yet", n: toSend.length },
    { key: "sent", label: "Already sent", n: sentRows.length },
    { key: "all", label: "All paid rides", n: all.length },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-5 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Receipts</h1>
        <p className="text-sm text-slate-500">A receipt exists only for money actually received. Saving a receipt never sends it — you press Email or WhatsApp yourself.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          ["Paid rides", all.length, "text-slate-900"],
          ["Receipt already sent", sentRows.length, "text-emerald-700"],
          ["Receipt not sent yet", toSend.length, toSend.length ? "text-amber-600" : "text-slate-900"],
          ["Receipt not saved in system", ready.length, ready.length ? "text-amber-600" : "text-slate-900"],
        ].map(([k, v, c]) => (
          <div key={k as string} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <div className={`text-2xl font-bold ${c}`}>{v}</div>
            <div className="text-sm text-slate-500">{k}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex flex-wrap rounded-xl border border-slate-200 bg-white p-1 text-sm font-semibold">
          {tabs.map((t) => (
            <Link key={t.key} href={t.key === "tosend" ? "/admin/receipts" : `/admin/receipts?tab=${t.key}`}
              className={`rounded-lg px-4 py-1.5 ${tab === t.key ? "bg-emerald-600 text-white" : "text-slate-600 hover:text-slate-900"}`}>
              {t.label} <span className={tab === t.key ? "text-white/80" : "text-slate-400"}>{t.n}</span>
            </Link>
          ))}
        </div>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, TSA-2026-…, receipt number" aria-label="Search receipts"
          className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-emerald-500 sm:w-80" />
      </div>

      {msg && (
        <div className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm ${msg.ok ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-rose-200 bg-rose-50 text-rose-700"}`}>
          {msg.ok ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />} {msg.text}
        </div>
      )}

      <div className={`flex flex-wrap items-center gap-3 rounded-2xl border px-4 py-3 ${sel.size ? "border-emerald-300 bg-emerald-50" : "border-slate-200 bg-white"}`}>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <input type="checkbox" className="h-4 w-4 accent-emerald-600" checked={allVisible} onChange={() => setSel(allVisible ? new Set() : new Set(rows.map((r) => r.quotation_id)))} /> Select all shown
        </label>
        <span className="text-sm text-slate-500">{sel.size ? `${sel.size} selected — already sent to the customer by you? Record it:` : "Tick the rides whose receipt you already sent yourself, then choose how:"}</span>
        <div className="flex flex-wrap gap-2 sm:ml-auto">
          <button className={solid} disabled={!sel.size || busy !== null} onClick={() => bulk(["whatsapp"])}>{busy === "bulk" ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageCircle className="h-4 w-4" />} Sent on WhatsApp</button>
          <button className={solid} disabled={!sel.size || busy !== null} onClick={() => bulk(["email"])}><Mail className="h-4 w-4" /> Sent by email</button>
          <button className={solid} disabled={!sel.size || busy !== null} onClick={() => bulk(["whatsapp", "email"])}>Sent on both</button>
          <button className={outline} disabled={!sel.size || busy !== null} onClick={() => window.confirm(`Record ${sel.size} ride(s) as Trustpilot review ALREADY requested by you? Nothing is sent.`) && markReview([...sel])}><Star className="h-4 w-4" /> Review already asked</button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {rows.length === 0 && <p className="p-12 text-center text-sm text-slate-400">{tab === "tosend" ? "Every paid ride already has its receipt sent." : "Nothing here."}</p>}
        <ul className="divide-y divide-slate-100">
          {rows.map((r) => (
            <li key={`${r.quotation_id}-${r.doc_id ?? "x"}`} className={`flex flex-wrap items-center gap-x-5 gap-y-3 px-5 py-4 hover:bg-slate-50 ${sel.has(r.quotation_id) ? "bg-emerald-50/60" : ""}`}>
              <input type="checkbox" className="h-4 w-4 shrink-0 accent-emerald-600" checked={sel.has(r.quotation_id)} onChange={() => toggle(r.quotation_id)} aria-label={`Select ${r.customer_name}`} />
              <div className="w-28 shrink-0">
                <div className="text-sm font-bold text-slate-900">{r.number ?? "No receipt yet"}</div>
                <div className="text-xs text-slate-400">{r.issued_at ? `Issued ${day(r.issued_at)}` : `Ride ${day(r.trip_date)}`}</div>
              </div>
              <div className="min-w-0 flex-1 basis-60">
                <Link href={`/admin/quotations/${r.quotation_id}`} className="font-semibold text-slate-900 hover:text-emerald-700 hover:underline">{r.customer_name}</Link>
                <span className="ml-2 font-mono text-xs text-slate-400">{r.quote_reference}</span>
                <div className="truncate text-sm text-slate-500">{r.pickup_location} → {r.drop_location}</div>
              </div>
              <div className="w-36 shrink-0 text-sm">
                <div className="font-semibold text-slate-900">{money(r.amount, r.currency)}</div>
                <div className="text-xs text-slate-400">{r.payment_method ?? "Method not recorded"}</div>
              </div>
              <div className="w-40 shrink-0 text-xs">
                <div className="flex flex-col items-start gap-1">
                  {r.doc_id === null && <span className="rounded-full bg-amber-50 px-2.5 py-0.5 font-semibold text-amber-700">Receipt not saved</span>}
                  <span className={`rounded-full px-2.5 py-0.5 font-semibold ${r.email_status === "sent" ? "bg-emerald-50 text-emerald-700" : r.email_status === "failed" ? "bg-rose-50 text-rose-700" : "bg-slate-100 text-slate-500"}`}>
                    Email: {r.email_status === "sent" ? `sent ${day(r.email_at)}${r.email_manual ? " (by you)" : ""}` : r.email_status === "failed" ? "failed" : "not sent"}
                  </span>
                  <span className={`rounded-full px-2.5 py-0.5 font-semibold ${r.wa_sent_at ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                    WhatsApp: {r.wa_sent_at ? `sent ${day(r.wa_sent_at)}` : "not recorded"}
                  </span>
                  <span className={`rounded-full px-2.5 py-0.5 font-semibold ${r.review_invited_at ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                    Review: {r.review_invited_at ? `requested ${day(r.review_invited_at)}` : "not asked"}
                  </span>
                </div>
              </div>
              <div className="flex shrink-0 flex-wrap items-center gap-2 lg:ml-auto">
                <a className={outline} href={waLink(r.customer_phone, reviewMsg(r))} target="_blank" rel="noreferrer" title="Opens WhatsApp with the Trustpilot review request" aria-label={`Ask ${r.customer_name} for a review on WhatsApp`}><Star className="h-4 w-4" /> Ask review</a>
                {r.doc_id === null ? (
                  <button className={solid} disabled={busy !== null} onClick={() => issue(r)}>{busy === `i-${r.quotation_id}` ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />} Save receipt</button>
                ) : (
                  <>
                    <a className={outline} href={`/api/admin/documents/${r.doc_id}`} target="_blank" rel="noreferrer"><FileText className="h-4 w-4" /> PDF</a>
                    <button className={outline} disabled={busy !== null || !r.customer_email} title={r.customer_email ? `Email to ${r.customer_email}` : "No email on file"} onClick={() => email(r)}>
                      {busy === `e-${r.doc_id}` ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />} {r.email_status === "failed" ? "Retry email" : r.email_status === "sent" ? "Resend" : "Email"}
                    </button>
                    <a className={outline} href={waLink(r.customer_phone, waMsg(r))} target="_blank" rel="noreferrer"><MessageCircle className="h-4 w-4" /> WhatsApp</a>
                    {!r.wa_sent_at && <button className={outline} disabled={busy !== null} onClick={() => markWa(r)}>{busy === `w-${r.doc_id}` ? <Loader2 className="h-4 w-4 animate-spin" /> : "Mark sent on WhatsApp"}</button>}
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
