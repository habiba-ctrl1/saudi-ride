"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, AlertTriangle } from "lucide-react";
import { REVIEW_RULES, type ReviewItem } from "@/lib/ops/review-constants";

const btn = "rounded-lg border px-3 py-1.5 text-xs font-bold disabled:opacity-40";

export function ReviewClient({ items, raised, scanFailed }: { items: ReviewItem[]; raised: number; scanFailed: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});

  async function decide(it: ReviewItem, kind: "complete" | "cancel" | "keep" | "note") {
    const label = { complete: "Marked completed", cancel: "Marked cancelled", keep: "Kept active", note: "Reviewed" }[kind];
    const note = (notes[it.id] ?? "").trim();
    if (kind === "note" && !note) return setMsg({ ok: false, text: "Write a short note first" });
    if ((kind === "complete" || kind === "cancel") && !window.confirm(`${kind === "complete" ? "Mark as COMPLETED" : "CANCEL"} ${it.quote_reference} (${it.customer_name}, ${it.trip_date})? Fare, payment and customer details stay untouched.`)) return;
    setBusy(it.id); setMsg(null);
    try {
      if (kind === "complete" || kind === "cancel") {
        const r = await fetch(`/api/quotations/${it.quotation_id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: kind === "complete" ? "completed" : "cancelled" }) });
        if (!r.ok) return setMsg({ ok: false, text: (await r.json().catch(() => ({}))).error || "Could not change the status — flag left open" });
      }
      const r2 = await fetch(`/api/admin/review/${it.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ resolution: `${label}${note ? ` — ${note}` : ""}` }) });
      if (!r2.ok) return setMsg({ ok: false, text: (await r2.json().catch(() => ({}))).error || "Status changed but the flag could not be closed" });
      setMsg({ ok: true, text: `${it.quote_reference}: ${label}.` });
      router.refresh();
    } catch { setMsg({ ok: false, text: "Network error" }); } finally { setBusy(null); }
  }

  const evid = (b: boolean, yes: string, no: string) => <span className={b ? "text-green-500" : "text-[#7C8088]"}>{b ? "✓" : "✗"} {b ? yes : no}</span>;

  return (
    <div className="max-w-5xl space-y-4">
      <div>
        <h1 className="text-xl font-bold text-[#F5F0E8]">Needs Review</h1>
        <p className="text-xs text-[#7C8088]">Records whose real status the data cannot prove. A past date alone never completes a ride — you decide each one, with the evidence shown. Fare, payment and customer details are never changed by these buttons.</p>
      </div>
      {scanFailed && <div className="flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300"><AlertTriangle className="mt-0.5 h-4 w-4" /> The scan could not run just now; showing existing flags. Reload to retry.</div>}
      {raised > 0 && <div className="rounded-xl border border-orange-500/30 bg-orange-500/10 p-3 text-xs text-orange-200">{raised} new record{raised === 1 ? "" : "s"} flagged on this scan.</div>}
      {msg && <div className={`rounded-xl border p-3 text-sm ${msg.ok ? "border-green-500/30 text-green-400" : "border-red-500/30 text-red-300"}`}>{msg.text}</div>}
      {items.length === 0 && <div className="rounded-2xl border border-[#333] bg-[#111] p-8 text-center text-sm text-[#A1A1A6]">Nothing needs review.</div>}

      {items.map((it) => (
        <section key={it.id} className="rounded-2xl border border-[#333] bg-[#111] p-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <span className="mr-2 rounded border border-orange-500/40 px-1.5 py-0.5 text-[0.6rem] font-bold uppercase text-orange-400">{REVIEW_RULES[it.rule]}</span>
              <Link href={`/admin/quotations/${it.quotation_id}`} className="font-bold text-[#F5F0E8] hover:text-[#C9A84C]">{it.quote_reference} · {it.customer_name}</Link>
            </div>
            <span className="text-xs text-[#7C8088]">{it.trip_date} {it.trip_time?.slice(0, 5) ?? ""} · {it.pickup_location} → {it.drop_location}</span>
          </div>
          <p className="mt-2 text-xs text-[#A1A1A6]">{it.detail}</p>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
            <span className="text-[#7C8088]">Status: <b className="text-[#F5F0E8]">{it.status}</b></span>
            <span className="text-[#7C8088]">Fare: <b className="text-[#F5F0E8]">{it.quoted_price != null ? `SAR ${it.quoted_price}` : "none"}</b></span>
            {evid(it.has_driver, "driver assigned", "no driver assigned")}
            {evid(it.pickup_details_sent, "pickup details sent", "pickup details not sent")}
            {evid(it.payment_recorded, "payment recorded", "no payment recorded")}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <input value={notes[it.id] ?? ""} onChange={(e) => setNotes({ ...notes, [it.id]: e.target.value })} placeholder="Note (what you checked)…" className="min-w-[220px] flex-1 rounded-lg border border-[#333] bg-black/40 px-3 py-1.5 text-xs text-[#F5F0E8] outline-none focus:border-[#C9A84C]" />
            {it.rule === "past_open" && (
              <>
                <button disabled={busy !== null} onClick={() => decide(it, "complete")} className={`${btn} border-transparent bg-[#C9A84C] text-black`}>{busy === it.id ? <Loader2 className="h-3 w-3 animate-spin" /> : "It happened — mark Completed"}</button>
                <button disabled={busy !== null} onClick={() => decide(it, "cancel")} className={`${btn} border-red-500/40 text-red-400`}>It was cancelled</button>
                <button disabled={busy !== null} onClick={() => decide(it, "keep")} className={`${btn} border-[#333] text-[#A1A1A6]`}>Still active</button>
              </>
            )}
            {it.rule !== "past_open" && <button disabled={busy !== null} onClick={() => decide(it, "note")} className={`${btn} border-[#C9A84C]/40 text-[#C9A84C]`}>{busy === it.id ? <Loader2 className="h-3 w-3 animate-spin" /> : "Reviewed — close flag"}</button>}
          </div>
        </section>
      ))}
    </div>
  );
}
