import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { findDuplicates, getLead, getLeadActivity, LEAD_SOURCE_LABEL, quotationPrefillQuery } from "@/lib/ops/leads";
import { LeadDetailClient } from "./LeadDetailClient";

export const metadata: Metadata = { title: "Lead | Admin Dashboard" };
export const dynamic = "force-dynamic";

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lead = await getLead(id);
  if (!lead) notFound();
  const [activity, dups] = await Promise.all([getLeadActivity(id), findDuplicates(lead.customer_phone, lead.customer_email, id)]);

  return (
    <div className="max-w-5xl space-y-5">
      <div>
        <Link href="/admin/leads" className="mb-2 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C9A84C] hover:underline"><ArrowLeft className="h-3.5 w-3.5" /> Lead Inbox</Link>
        <h1 className="text-xl font-bold text-[#F5F0E8]">{lead.customer_name ?? "Unnamed lead"} <span className="text-sm font-normal text-[#7C8088]">{lead.reference} · {LEAD_SOURCE_LABEL[lead.source]} · received {lead.received_at.slice(0, 16).replace("T", " ")}</span></h1>
      </div>
      {lead.processing_status === "failed" && <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">Processing failed: {lead.processing_error}</div>}
      <LeadDetailClient lead={lead} quotePrefill={quotationPrefillQuery(lead)} />
      {dups.length > 0 && (
        <section className="rounded-2xl border border-orange-500/30 bg-orange-500/5 p-4 text-xs text-orange-200">
          <h2 className="mb-2 font-bold">Same phone / email elsewhere</h2>
          <ul className="space-y-1">{dups.map((d) => <li key={d.type + d.id}><Link className="underline" href={d.href}>{d.label}</Link> <span className="opacity-70">— {d.detail}</span></li>)}</ul>
        </section>
      )}
      {lead.raw_text && (
        <section className="rounded-2xl border border-[#333] bg-[#111] p-5">
          <h2 className="mb-2 text-sm font-bold text-[#F5F0E8]">Original enquiry / conversation</h2>
          <pre className="max-h-96 overflow-auto whitespace-pre-wrap text-xs text-[#A1A1A6]">{lead.raw_text}</pre>
        </section>
      )}
      <section className="rounded-2xl border border-[#333] bg-[#111] p-5">
        <h2 className="mb-3 text-sm font-bold text-[#F5F0E8]">Activity</h2>
        <ul className="space-y-2 text-xs text-[#A1A1A6]">
          {activity.length === 0 && <li>No activity recorded yet.</li>}
          {activity.map((a, i) => <li key={i}><span className="text-[#7C8088]">{a.created_at.slice(0, 16).replace("T", " ")}</span> · <span className="font-bold text-[#F5F0E8]">{a.kind.replace("_", " ")}</span>{a.detail ? ` — ${a.detail}` : ""}{a.actor ? <span className="text-[#7C8088]"> ({a.actor})</span> : null}</li>)}
        </ul>
      </section>
    </div>
  );
}
