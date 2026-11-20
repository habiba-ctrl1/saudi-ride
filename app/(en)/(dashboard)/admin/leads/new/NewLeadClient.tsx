"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft } from "lucide-react";
import { LeadFields, draftToPayload, emptyDraft } from "../LeadFields";

export function NewLeadClient() {
  const router = useRouter();
  const [d, setD] = useState(emptyDraft);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function save() {
    setBusy(true); setError("");
    try {
      const r = await fetch("/api/admin/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ leads: [{ ...draftToPayload(d), source: "manual" }] }) });
      const j = await r.json();
      if (!r.ok) setError(j.error || "Could not save");
      else router.push(`/admin/leads/${j.created[0].id}`);
    } catch { setError("Network error"); } finally { setBusy(false); }
  }

  return (
    <div className="max-w-5xl space-y-5">
      <div>
        <Link href="/admin/leads" className="mb-2 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C9A84C] hover:underline"><ArrowLeft className="h-3.5 w-3.5" /> Lead Inbox</Link>
        <h1 className="text-xl font-bold text-[#F5F0E8]">Add Lead</h1>
        <p className="text-xs text-[#7C8088]">Only a name or a contact detail is required. Incomplete leads are fine — missing items stay flagged.</p>
      </div>
      <section className="space-y-4 rounded-2xl border border-[#333] bg-[#111] p-5">
        <LeadFields value={d} onChange={setD} />
        {error && <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">{error}</div>}
        <button onClick={save} disabled={busy} className="inline-flex items-center gap-2 rounded-lg bg-[#C9A84C] px-5 py-2.5 text-sm font-bold text-black disabled:opacity-50">{busy && <Loader2 className="h-4 w-4 animate-spin" />} Save lead</button>
      </section>
    </div>
  );
}
