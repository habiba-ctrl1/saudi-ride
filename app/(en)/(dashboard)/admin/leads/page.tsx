import { Metadata } from "next";
import Link from "next/link";
import { ClipboardPaste, Plus, MessageCircle, AlertTriangle } from "lucide-react";
import { LEAD_SOURCES, LEAD_SOURCE_LABEL, LEAD_STATUSES, LEAD_STATUS_LABEL, listLeads, quotationPrefillQuery, syncWebsiteLeads, type LeadStatus } from "@/lib/ops/leads";

export const metadata: Metadata = { title: "Lead Inbox | Admin Dashboard" };
export const dynamic = "force-dynamic";

const TONE: Record<LeadStatus, string> = {
  new: "text-[#C9A84C] border-[#C9A84C]/40", unreviewed: "text-[#C9A84C] border-[#C9A84C]/40", contacted: "text-blue-400 border-blue-500/30", awaiting_info: "text-orange-400 border-orange-500/30",
  quotation_in_prep: "text-blue-400 border-blue-500/30", quotation_sent: "text-blue-400 border-blue-500/30", follow_up: "text-orange-400 border-orange-500/30",
  confirmed: "text-green-500 border-green-500/30", lost: "text-red-400 border-red-500/30", converted: "text-green-500 border-green-500/30",
};
const PAGE = 25;

export default async function LeadInboxPage({ searchParams }: { searchParams: Promise<{ status?: string; source?: string; q?: string; page?: string }> }) {
  const sp = await searchParams;
  const sync = await syncWebsiteLeads();
  const page = Math.max(parseInt(sp.page ?? "1", 10) || 1, 1);
  const { rows, total, counts } = await listLeads({ status: sp.status, source: sp.source, q: sp.q, page, pageSize: PAGE });
  const all = Object.values(counts).reduce((a, b) => a + b, 0);
  const href = (o: Record<string, string | undefined>) => {
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries({ status: sp.status, source: sp.source, q: sp.q, ...o })) if (v) p.set(k, v);
    const s = p.toString();
    return `/admin/leads${s ? `?${s}` : ""}`;
  };
  const chip = (active: boolean) => `rounded-lg border px-3 py-1.5 text-xs font-bold ${active ? "border-[#C9A84C]/40 bg-[#C9A84C]/20 text-[#C9A84C]" : "border-[#333] text-[#A1A1A6] hover:text-[#F5F0E8]"}`;
  const pages = Math.max(Math.ceil(total / PAGE), 1);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#F5F0E8]">Lead Inbox</h1>
          <p className="text-xs text-[#7C8088]">Every enquiry, from every source, in one place. Sending a quotation never marks a lead confirmed.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/leads/paste" className="inline-flex items-center gap-2 rounded-lg bg-[#C9A84C] px-4 py-2.5 text-sm font-bold text-black hover:opacity-90"><ClipboardPaste className="h-4 w-4" /> Paste New Enquiry</Link>
          <Link href="/admin/leads/new" className="inline-flex items-center gap-2 rounded-lg border border-[#C9A84C]/40 px-4 py-2.5 text-sm font-bold text-[#C9A84C]"><Plus className="h-4 w-4" /> Add manually</Link>
        </div>
      </div>

      {sync.error && <div className="flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /> Website enquiries could not be synced just now: {sync.error}. Existing leads below are unaffected; reload to retry.</div>}

      <div className="flex flex-wrap gap-2">
        <Link href={href({ status: undefined, page: undefined })} className={chip(!sp.status)}>All ({all})</Link>
        {LEAD_STATUSES.map((s) => <Link key={s} href={href({ status: s, page: undefined })} className={chip(sp.status === s)}>{LEAD_STATUS_LABEL[s]} ({counts[s] ?? 0})</Link>)}
      </div>

      <form className="flex flex-wrap gap-2">
        {sp.status && <input type="hidden" name="status" value={sp.status} />}
        <input name="q" defaultValue={sp.q ?? ""} placeholder="Search name, phone, email, reference, place…" className="min-w-[240px] flex-1 rounded-lg border border-[#333] bg-black/40 px-3 py-2 text-sm text-[#F5F0E8] outline-none focus:border-[#C9A84C]" />
        <select name="source" defaultValue={sp.source ?? ""} className="rounded-lg border border-[#333] bg-black/40 px-2 py-2 text-xs text-[#F5F0E8]">
          <option value="">All sources</option>{LEAD_SOURCES.map((s) => <option key={s} value={s}>{LEAD_SOURCE_LABEL[s]}</option>)}
        </select>
        <button className="rounded-lg border border-[#C9A84C]/40 px-3 py-2 text-xs font-bold text-[#C9A84C]">Filter</button>
      </form>

      <div className="overflow-x-auto rounded-2xl border border-[#333] bg-[#111]">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#1A1A1A] text-[0.6rem] uppercase tracking-widest text-[#7C8088]"><tr><th className="p-3">Received</th><th className="p-3">Customer</th><th className="p-3">Trip</th><th className="p-3">Source</th><th className="p-3">Status</th><th className="p-3" /></tr></thead>
          <tbody className="divide-y divide-[#222] text-[#A1A1A6]">
            {rows.length === 0 && <tr><td colSpan={6} className="p-8 text-center">No leads match.</td></tr>}
            {rows.map((l) => (
              <tr key={l.id} className="align-top">
                <td className="whitespace-nowrap p-3">{l.received_at.slice(0, 10)}<div className="text-[#7C8088]">{l.reference}</div></td>
                <td className="p-3"><Link href={`/admin/leads/${l.id}`} className="font-bold text-[#F5F0E8] hover:text-[#C9A84C]">{l.customer_name ?? "No name"}</Link><div>{l.customer_phone}</div><div>{l.customer_email}</div></td>
                <td className="p-3">{l.pickup || l.dropoff ? `${l.pickup ?? "?"} → ${l.dropoff ?? "?"}` : <span className="text-[#7C8088]">Not stated</span>}
                  <div className="text-[#7C8088]">{[l.trip_date, l.trip_time, l.vehicle, l.passengers ? `${l.passengers} pax` : null].filter(Boolean).join(" · ")}</div>
                  {l.missing.length > 0 && <div className="mt-0.5 text-orange-400">Missing: {l.missing.join(", ")}</div>}</td>
                <td className="p-3">{LEAD_SOURCE_LABEL[l.source]}{l.processing_status === "failed" && <div className="text-red-400">Processing failed</div>}</td>
                <td className="p-3"><span className={`rounded border px-1.5 py-0.5 text-[0.6rem] font-bold uppercase ${TONE[l.effective_status]}`}>{LEAD_STATUS_LABEL[l.effective_status]}</span>
                  {l.quote_reference && <div className="mt-1"><Link className="text-[#C9A84C] hover:underline" href={`/admin/quotations/${l.quotation_id}`}>{l.quote_reference}</Link> <span className="text-[#7C8088]">({l.quote_status})</span></div>}</td>
                <td className="whitespace-nowrap p-3 text-right">
                  {!l.quotation_id && <Link className="font-bold text-[#C9A84C] hover:underline" href={`/admin/quotations/new?${quotationPrefillQuery(l)}`}>Create quotation</Link>}
                  {l.customer_phone && <a className="ml-3 inline-block align-middle text-[#A1A1A6] hover:text-green-500" href={`https://wa.me/${l.customer_phone.replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer" aria-label="Open WhatsApp"><MessageCircle className="h-4 w-4" /></a>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between text-xs text-[#7C8088]">
        <span>{total} lead{total === 1 ? "" : "s"} · page {page} of {pages}</span>
        <div className="flex gap-2">
          {page > 1 && <Link className={chip(false)} href={href({ page: String(page - 1) })}>Previous</Link>}
          {page < pages && <Link className={chip(false)} href={href({ page: String(page + 1) })}>Next</Link>}
        </div>
      </div>
    </div>
  );
}
