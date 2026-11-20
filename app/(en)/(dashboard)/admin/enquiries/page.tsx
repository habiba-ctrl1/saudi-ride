import { Metadata } from "next";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { listWebLeads, listWhatsAppEnquiries } from "@/lib/ops/enquiries";

export const metadata: Metadata = { title: "Enquiries | Admin Dashboard" };
export const dynamic = "force-dynamic";

const OUTCOME = { won: "text-green-500 border-green-500/30", lost: "text-red-400 border-red-500/30", unknown: "text-[#A1A1A6] border-[#333]" } as const;

export default async function AdminEnquiriesPage({ searchParams }: { searchParams: Promise<{ tab?: string; q?: string; outcome?: string }> }) {
  const sp = await searchParams;
  const tab = sp.tab === "whatsapp" ? "whatsapp" : "web";
  const q = sp.q ?? "";
  const outcome = ["won", "lost", "unknown"].includes(sp.outcome ?? "") ? (sp.outcome as string) : "";
  const [leads, wa] = await Promise.all([tab === "web" ? listWebLeads(q) : Promise.resolve([]), tab === "whatsapp" ? listWhatsAppEnquiries(q, outcome) : Promise.resolve([])]);
  const tabCls = (t: string) => `rounded-lg border px-4 py-2 text-xs font-bold ${tab === t ? "border-[#C9A84C]/40 bg-[#C9A84C]/20 text-[#C9A84C]" : "border-[#333] text-[#A1A1A6] hover:text-[#F5F0E8]"}`;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#F5F0E8]">Enquiries</h1>
          <p className="text-xs text-[#7C8088]">People who asked for a price. They are history, not clients — a client is created only when you make a quotation.</p>
        </div>
        <form className="flex gap-2">
          <input type="hidden" name="tab" value={tab} />
          <input name="q" defaultValue={q} placeholder="Search name, phone, route…" className="rounded-lg border border-[#333] bg-black/40 px-3 py-2 text-sm text-[#F5F0E8] outline-none focus:border-[#C9A84C]" />
          {tab === "whatsapp" && (
            <select name="outcome" defaultValue={outcome} className="rounded-lg border border-[#333] bg-black/40 px-2 py-2 text-xs text-[#F5F0E8]">
              <option value="">All outcomes</option><option value="lost">Lost</option><option value="won">Won</option><option value="unknown">No outcome recorded</option>
            </select>
          )}
          <button className="rounded-lg border border-[#C9A84C]/40 px-3 py-2 text-xs font-bold text-[#C9A84C]">Search</button>
        </form>
      </div>
      <div className="flex gap-2">
        <Link href="/admin/enquiries" className={tabCls("web")}>Website form</Link>
        <Link href="/admin/enquiries?tab=whatsapp" className={tabCls("whatsapp")}>WhatsApp pricing log</Link>
      </div>

      {tab === "web" && (
        <div className="overflow-x-auto rounded-2xl border border-[#333] bg-[#111]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#1A1A1A] text-[0.6rem] uppercase tracking-widest text-[#7C8088]"><tr><th className="p-3">Received</th><th className="p-3">Client</th><th className="p-3">Trip</th><th className="p-3">Vehicle</th><th className="p-3" /></tr></thead>
            <tbody className="divide-y divide-[#222] text-[#A1A1A6]">
              {leads.length === 0 && <tr><td colSpan={5} className="p-8 text-center">Nothing found.</td></tr>}
              {leads.map((l) => {
                const qs = new URLSearchParams({ name: l.customer_name ?? "", phone: l.customer_phone ?? "", pickup: l.origin ?? "", drop: l.destination ?? "", date: (l.trip_date ?? "").slice(0, 10), time: (l.trip_date ?? "").slice(11, 16), vehicle: l.vehicle_type ?? "" });
                return (
                  <tr key={l.id} className="align-top">
                    <td className="whitespace-nowrap p-3">{l.created_at.slice(0, 10)}</td>
                    <td className="p-3"><div className="font-bold text-[#F5F0E8]">{l.customer_name ?? "No name"}</div><div>{l.customer_phone}</div><div>{l.customer_email}</div></td>
                    <td className="p-3">{l.origin} → {l.destination}<div className="text-[#7C8088]">{l.trip_date?.slice(0, 16).replace("T", " ")}</div></td>
                    <td className="p-3">{l.vehicle_type ?? "—"}</td>
                    <td className="whitespace-nowrap p-3 text-right">
                      {l.quoted ? <span className="text-green-500">already quoted</span> : <Link className="font-bold text-[#C9A84C] hover:underline" href={`/admin/quotations/new?${qs}`}>Create quotation</Link>}
                      {l.customer_phone && <a className="ml-3 inline-block align-middle text-[#A1A1A6] hover:text-green-500" href={`https://wa.me/${l.customer_phone.replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer"><MessageCircle className="h-4 w-4" /></a>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {tab === "whatsapp" && (
        <>
          <p className="text-xs text-[#7C8088]">{wa.length} entries from your pricing log (kept exactly as written). &quot;Won&quot; = completed rides; &quot;Lost&quot; = cancelled / expensive / blocked; the rest have no outcome recorded.</p>
          <div className="overflow-x-auto rounded-2xl border border-[#333] bg-[#111]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#1A1A1A] text-[0.6rem] uppercase tracking-widest text-[#7C8088]"><tr><th className="p-3">#</th><th className="p-3">Client</th><th className="p-3">Route</th><th className="p-3">Prices given</th><th className="p-3">Outcome</th><th className="p-3">Notes</th></tr></thead>
              <tbody className="divide-y divide-[#222] text-[#A1A1A6]">
                {wa.map((e) => (
                  <tr key={e.id} className="align-top">
                    <td className="p-3">{e.seq_no?.startsWith("row") ? "" : e.seq_no}</td>
                    <td className="p-3"><div className="whitespace-pre-line font-bold text-[#F5F0E8]">{e.client_name ?? "No name"}</div>{e.contact && <a className="text-[#C9A84C]" href={`https://wa.me/${e.contact.replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer">{e.contact}</a>}</td>
                    <td className="max-w-[200px] p-3"><span className="whitespace-pre-line">{e.route_from}{e.route_to ? ` → ${e.route_to}` : ""}</span></td>
                    <td className="max-w-[220px] whitespace-pre-line p-3 font-mono">{[e.sedan_text && `Sedan: ${e.sedan_text}`, e.staria_text && `Staria: ${e.staria_text}`, e.gmc_text && `GMC/other: ${e.gmc_text}`].filter(Boolean).join("\n") || "—"}</td>
                    <td className="p-3"><span className={`rounded border px-1.5 py-0.5 text-[0.6rem] font-bold uppercase ${OUTCOME[e.outcome as keyof typeof OUTCOME]}`}>{e.outcome === "unknown" ? "no outcome" : e.outcome}</span>
                      {(e.status_text || e.reason) && <div className="mt-1">{[e.status_text, e.reason].filter(Boolean).join(" · ")}</div>}</td>
                    <td className="max-w-sm whitespace-pre-line p-3">{[e.trip_type_text, e.notes].filter(Boolean).join("\n")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
