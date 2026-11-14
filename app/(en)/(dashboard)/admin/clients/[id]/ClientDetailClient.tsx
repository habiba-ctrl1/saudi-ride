"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, MessageCircle, Mail, Phone } from "lucide-react";
import type { ClientDetail } from "@/lib/ops/clients";
import { STAGE_CLASS, STAGE_LABEL } from "@/lib/ops/quote-stage";
import type { QuoteStage } from "@/lib/supabase/quotations";

const sar = (n: number | null | undefined) => (n == null ? "—" : `SAR ${n.toLocaleString("en-US", { maximumFractionDigits: 2 })}`);

export function ClientDetailClient({ detail, pkrRate }: { detail: ClientDetail; pkrRate: number | null }) {
  const router = useRouter();
  const { client, bookings, emails_sent } = detail;
  const [notes, setNotes] = useState(client.notes ?? "");
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  const done = bookings.filter((b) => b.status === "completed");
  const paid = done.reduce((a, b) => a + (b.actual_amount_paid ?? 0), 0);
  const known = done.filter((b) => b.margin != null);
  const margin = known.reduce((a, b) => a + (b.margin ?? 0), 0);
  const unpaid = bookings.filter((b) => b.status === "completed" && b.payment_status !== "paid").reduce((a, b) => a + (b.quoted_price ?? 0), 0);
  const upcoming = bookings.filter((b) => ["quoted", "confirmed", "assigned", "new"].includes(b.status) && b.trip_date >= new Date().toISOString().slice(0, 10));

  async function saveNotes() {
    setBusy(true);
    await fetch(`/api/admin/clients/${client.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ notes }) });
    setBusy(false);
    setSaved(true);
    router.refresh();
  }

  const stat = (k: string, v: string, tone = "") => (
    <div className="rounded-xl border border-[#333] bg-[#111] p-3"><div className="text-[0.6rem] uppercase tracking-widest text-[#7C8088]">{k}</div><div className={`mt-1 font-mono text-sm text-[#F5F0E8] ${tone}`}>{v}</div></div>
  );

  return (
    <div className="space-y-5 max-w-6xl">
      <div>
        <Link href="/admin/clients" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C9A84C] hover:underline mb-2"><ArrowLeft className="h-3.5 w-3.5" /> Clients</Link>
        <h1 className="text-xl font-bold text-[#F5F0E8]">{client.name}</h1>
        <div className="mt-1 flex flex-wrap gap-3 text-xs text-[#A1A1A6]">
          {client.phone && <a className="inline-flex items-center gap-1 text-[#C9A84C]" href={`https://wa.me/${client.phone.replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer"><MessageCircle className="h-3.5 w-3.5" /> {client.phone}</a>}
          {client.phone && <a className="inline-flex items-center gap-1" href={`tel:${client.phone}`}><Phone className="h-3.5 w-3.5" /> call</a>}
          {client.email && <a className="inline-flex items-center gap-1" href={`mailto:${client.email}`}><Mail className="h-3.5 w-3.5" /> {client.email}</a>}
          <span>Client since {client.created_at.slice(0, 10)}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {stat("Bookings", String(bookings.length))}
        {stat("Completed rides", String(done.length))}
        {stat("Paid total", sar(paid))}
        {stat("Margin (known)", `${sar(margin)}${pkrRate ? ` · PKR ${Math.round(margin * pkrRate).toLocaleString()}` : ""}`, margin < 0 ? "text-red-400 font-bold" : "")}
        {stat("Unpaid (completed)", sar(unpaid), unpaid > 0 ? "text-yellow-500 font-bold" : "")}
      </div>
      {known.length < done.length && <p className="text-xs text-yellow-500">{done.length - known.length} completed ride(s) have no driver cost yet — margin excludes them.</p>}

      {upcoming.length > 0 && (
        <p className="text-xs text-[#A1A1A6]">Upcoming / open: {upcoming.map((u) => `${u.quote_reference} (${u.trip_date})`).join(" · ")}</p>
      )}

      <div className="rounded-2xl border border-[#333] bg-[#111] overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#1A1A1A] text-[0.6rem] uppercase tracking-widest text-[#7C8088]">
            <tr><th className="p-3">Ref</th><th className="p-3">Date</th><th className="p-3">Trip</th><th className="p-3">Status</th><th className="p-3">Driver</th><th className="p-3">Quoted</th><th className="p-3">Paid</th><th className="p-3">Result</th></tr>
          </thead>
          <tbody className="divide-y divide-[#222] text-[#A1A1A6]">
            {bookings.map((b) => (
              <tr key={b.id} className="align-top">
                <td className="p-3"><Link href={`/admin/quotations/${b.id}`} className="font-mono font-bold text-[#C9A84C] hover:underline">{b.quote_reference}</Link></td>
                <td className="p-3 whitespace-nowrap">{b.trip_date}</td>
                <td className="p-3 max-w-xs">{b.pickup_location} → {b.drop_location}</td>
                <td className="p-3"><span className="uppercase font-bold">{b.status}</span> <span className={`ml-1 rounded border px-1.5 py-0.5 text-[0.55rem] font-bold uppercase ${STAGE_CLASS[b.quote_stage as QuoteStage] ?? ""}`}>{STAGE_LABEL[b.quote_stage as QuoteStage] ?? b.quote_stage}</span></td>
                <td className="p-3">{b.driver_name ?? "—"}</td>
                <td className="p-3 font-mono">{sar(b.quoted_price)}</td>
                <td className="p-3 font-mono">{sar(b.actual_amount_paid)}</td>
                <td className={`p-3 font-mono ${b.margin != null && b.margin < 0 ? "text-red-400 font-bold" : ""}`}>
                  {b.status === "completed" && b.margin == null ? <span className="text-yellow-500">cost needed</span> : b.margin == null ? "—" : b.margin < 0 ? `LOSS ${sar(Math.abs(b.margin))}` : sar(b.margin)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-2xl border border-[#333] bg-[#111] p-4 space-y-2">
        <h2 className="text-[0.65rem] font-bold uppercase tracking-widest text-[#7C8088]">Client notes · {emails_sent} email(s) sent to this client</h2>
        <textarea value={notes} onChange={(e) => { setNotes(e.target.value); setSaved(false); }} rows={3} className="w-full rounded-lg border border-[#333] bg-black/40 px-3 py-2 text-sm text-[#F5F0E8] outline-none focus:border-[#C9A84C]" placeholder="Preferences, VIP, payment habits…" />
        <button disabled={busy} onClick={saveNotes} className="rounded-lg border border-[#C9A84C]/40 px-3 py-2 text-xs font-bold text-[#C9A84C] hover:bg-[#C9A84C]/10 disabled:opacity-40">{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? "Saved ✓" : "Save notes"}</button>
      </div>
    </div>
  );
}
