"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, MessageCircle } from "lucide-react";
import { LeadFields, draftToPayload, type LeadDraft } from "../LeadFields";
import { LEAD_STATUSES, LEAD_STATUS_LABEL, type LeadRow, type LeadStatus } from "@/lib/ops/lead-constants";

const toDraft = (l: LeadRow): LeadDraft => ({
  customer_name: l.customer_name ?? "", customer_phone: l.customer_phone ?? "", customer_email: l.customer_email ?? "", language: l.language ?? "",
  pickup: l.pickup ?? "", dropoff: l.dropoff ?? "", trip_date: l.trip_date?.slice(0, 10) ?? "", trip_time: l.trip_time ?? "", trip_type: l.trip_type ?? "",
  passengers: l.passengers == null ? "" : String(l.passengers), luggage: l.luggage ?? "", vehicle: l.vehicle ?? "", budget_text: l.budget_text ?? "",
  prior_quote_text: l.prior_quote_text ?? "", preferences: l.preferences ?? "", notes: l.notes ?? "",
});

export function LeadDetailClient({ lead, quotePrefill }: { lead: LeadRow; quotePrefill: string }) {
  const router = useRouter();
  const [d, setD] = useState(toDraft(lead));
  const [status, setStatus] = useState<LeadStatus>(lead.status);
  const [followup, setFollowup] = useState(lead.next_followup?.slice(0, 10) ?? "");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function save() {
    if (status === "lost" && lead.status !== "lost" && !confirm("Mark this lead as Lost?")) return;
    setBusy(true); setMsg(null);
    try {
      const r = await fetch(`/api/admin/leads/${lead.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...draftToPayload(d), status, next_followup: followup || null }) });
      const j = await r.json();
      if (!r.ok) setMsg({ ok: false, text: j.error || "Save failed" });
      else { setMsg({ ok: true, text: "Saved" }); router.refresh(); }
    } catch { setMsg({ ok: false, text: "Network error" }); } finally { setBusy(false); }
  }

  return (
    <section className="space-y-4 rounded-2xl border border-[#333] bg-[#111] p-5">
      <div className="flex flex-wrap items-end gap-3">
        <label>
          <span className="mb-1 block text-[0.65rem] font-bold uppercase tracking-widest text-[#7C8088]">Status</span>
          <select value={status} onChange={(e) => setStatus(e.target.value as LeadStatus)} className="rounded-lg border border-[#333] bg-black/40 px-3 py-2 text-sm text-[#F5F0E8]">
            {LEAD_STATUSES.map((s) => <option key={s} value={s}>{LEAD_STATUS_LABEL[s]}</option>)}
          </select>
        </label>
        <label>
          <span className="mb-1 block text-[0.65rem] font-bold uppercase tracking-widest text-[#7C8088]">Next follow-up</span>
          <input type="date" value={followup} onChange={(e) => setFollowup(e.target.value)} className="rounded-lg border border-[#333] bg-black/40 px-3 py-2 text-sm text-[#F5F0E8]" />
        </label>
        <div className="ml-auto flex items-center gap-3">
          {lead.customer_phone && <a href={`https://wa.me/${lead.customer_phone.replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-bold text-green-500"><MessageCircle className="h-4 w-4" /> WhatsApp</a>}
          {lead.quotation_id ? (
            <Link href={`/admin/quotations/${lead.quotation_id}`} className="rounded-lg border border-[#C9A84C]/40 px-4 py-2 text-xs font-bold text-[#C9A84C]">Open {lead.quote_reference}</Link>
          ) : (
            <Link href={`/admin/quotations/new?${quotePrefill}`} className="rounded-lg bg-[#C9A84C] px-4 py-2 text-xs font-bold text-black">Create quotation</Link>
          )}
        </div>
      </div>
      {lead.effective_status !== lead.status && <p className="text-xs text-green-400">Linked quotation is {lead.quote_status} — displayed as &quot;{LEAD_STATUS_LABEL[lead.effective_status]}&quot;.</p>}
      <LeadFields value={d} onChange={setD} />
      <div className="flex items-center gap-3">
        <button onClick={save} disabled={busy} className="inline-flex items-center gap-2 rounded-lg bg-[#C9A84C] px-5 py-2.5 text-sm font-bold text-black disabled:opacity-50">{busy && <Loader2 className="h-4 w-4 animate-spin" />} Save changes</button>
        {msg && <span className={`text-xs ${msg.ok ? "text-green-500" : "text-red-400"}`}>{msg.text}</span>}
      </div>
    </section>
  );
}
