"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, AlertTriangle, ArrowLeft } from "lucide-react";
import { LeadFields, draftToPayload, emptyDraft, type LeadDraft } from "../LeadFields";

type Parsed = Record<string, string | number | string[] | null> & { missing: string[]; warnings: string[] };
type Dup = { type: string; id: string; label: string; detail: string; href: string };

const toDraft = (p: Parsed): LeadDraft => {
  const d = { ...emptyDraft };
  for (const k of Object.keys(d) as (keyof LeadDraft)[]) {
    const src = k === "dropoff" ? p.dropoff : p[k];
    d[k] = src == null || Array.isArray(src) ? "" : String(src);
  }
  return d;
};

export function PasteClient() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [busy, setBusy] = useState<"parse" | "save" | null>(null);
  const [error, setError] = useState("");
  const [drafts, setDrafts] = useState<LeadDraft[] | null>(null);
  const [warnings, setWarnings] = useState<string[][]>([]);
  const [dups, setDups] = useState<Dup[]>([]);
  const [mode, setMode] = useState<"separate" | "group" | null>(null);
  const [convo, setConvo] = useState("");
  const [ack, setAck] = useState(false);

  async function parse() {
    setBusy("parse"); setError(""); setDrafts(null); setMode(null); setAck(false);
    try {
      const r = await fetch("/api/admin/leads/parse", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text }) });
      const j = await r.json();
      if (!r.ok) { setError(j.error || "Could not read the text"); return; }
      setDrafts((j.bookings as Parsed[]).map(toDraft));
      setWarnings((j.bookings as Parsed[]).map((b) => b.warnings));
      setDups(j.duplicates);
      setConvo(j.conversation);
      if (j.bookings.length === 1) setMode("separate");
    } catch { setError("Network error"); } finally { setBusy(null); }
  }

  async function save() {
    if (!drafts) return;
    setBusy("save"); setError("");
    try {
      const leads = drafts.map((d) => ({ ...draftToPayload(d), source: "whatsapp_paste", raw_text: convo }));
      const r = await fetch("/api/admin/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ leads, group: mode === "group" }) });
      const j = await r.json();
      if (!r.ok) { setError(j.error || "Could not save"); return; }
      router.push(j.created.length === 1 ? `/admin/leads/${j.created[0].id}` : "/admin/leads");
      router.refresh();
    } catch { setError("Network error"); } finally { setBusy(null); }
  }

  return (
    <div className="max-w-5xl space-y-5">
      <div>
        <Link href="/admin/leads" className="mb-2 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C9A84C] hover:underline"><ArrowLeft className="h-3.5 w-3.5" /> Lead Inbox</Link>
        <h1 className="text-xl font-bold text-[#F5F0E8]">Paste New Enquiry</h1>
        <p className="text-xs text-[#7C8088]">Paste a WhatsApp chat, email or message. Nothing is saved until you review and confirm. Anything not in the text is left blank — never guessed.</p>
      </div>

      <section className="space-y-3 rounded-2xl border border-[#333] bg-[#111] p-5">
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={10} placeholder="Paste the whole conversation here…" className="w-full rounded-lg border border-[#333] bg-black/40 p-3 text-sm text-[#F5F0E8] outline-none focus:border-[#C9A84C]" />
        <button onClick={parse} disabled={!text.trim() || busy !== null} className="inline-flex items-center gap-2 rounded-lg bg-[#C9A84C] px-5 py-2.5 text-sm font-bold text-black disabled:opacity-50">
          {busy === "parse" && <Loader2 className="h-4 w-4 animate-spin" />} Extract details
        </button>
      </section>

      {error && <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">{error}</div>}

      {drafts && (
        <>
          {dups.length > 0 && (
            <div className="rounded-xl border border-orange-500/40 bg-orange-500/10 p-4 text-xs text-orange-200">
              <div className="mb-2 flex items-center gap-2 font-bold"><AlertTriangle className="h-4 w-4" /> Possible duplicates (same phone or email)</div>
              <ul className="space-y-1">{dups.map((d) => <li key={d.type + d.id}><Link className="underline" href={d.href} target="_blank">{d.label}</Link> <span className="opacity-70">— {d.detail}</span></li>)}</ul>
              <label className="mt-3 flex items-center gap-2"><input type="checkbox" checked={ack} onChange={(e) => setAck(e.target.checked)} /> I have checked — this is a new enquiry, save it anyway</label>
            </div>
          )}

          {drafts.length > 1 && (
            <div className="rounded-xl border border-[#C9A84C]/40 bg-[#C9A84C]/10 p-4 text-sm text-[#F5F0E8]">
              <p className="mb-3 font-bold">This text seems to contain {drafts.length} different trips. How should they be saved?</p>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setMode("separate")} className={`rounded-lg border px-4 py-2 text-xs font-bold ${mode === "separate" ? "border-[#C9A84C] bg-[#C9A84C] text-black" : "border-[#333]"}`}>Separate leads</button>
                <button onClick={() => setMode("group")} className={`rounded-lg border px-4 py-2 text-xs font-bold ${mode === "group" ? "border-[#C9A84C] bg-[#C9A84C] text-black" : "border-[#333]"}`}>Group under the same customer</button>
                <button onClick={() => { setDrafts([drafts[0]]); setMode("separate"); }} className="rounded-lg border border-[#333] px-4 py-2 text-xs font-bold">It&apos;s one trip — keep only the first</button>
              </div>
            </div>
          )}

          {drafts.map((d, i) => (
            <section key={i} className="space-y-3 rounded-2xl border border-[#333] bg-[#111] p-5">
              <h2 className="text-sm font-bold text-[#F5F0E8]">{drafts.length > 1 ? `Trip ${i + 1}` : "Review extracted details"}</h2>
              {warnings[i]?.map((w) => <p key={w} className="text-xs text-orange-300">⚠ {w}</p>)}
              <LeadFields value={d} onChange={(v) => setDrafts(drafts.map((x, j) => (j === i ? v : x)))} />
            </section>
          ))}

          <div className="flex items-center gap-3">
            <button onClick={save} disabled={busy !== null || mode === null || (dups.length > 0 && !ack)} className="inline-flex items-center gap-2 rounded-lg bg-[#C9A84C] px-5 py-2.5 text-sm font-bold text-black disabled:opacity-50">
              {busy === "save" && <Loader2 className="h-4 w-4 animate-spin" />} Save to Lead Inbox
            </button>
            <span className="text-xs text-[#7C8088]">Saving does not contact the customer.</span>
          </div>
        </>
      )}
    </div>
  );
}
