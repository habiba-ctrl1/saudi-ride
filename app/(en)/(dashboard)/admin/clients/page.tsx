import { Metadata } from "next";
import Link from "next/link";
import { listClients } from "@/lib/ops/clients";
import { getPkrRate } from "@/lib/ops/money";

export const metadata: Metadata = { title: "Clients | Admin Dashboard" };
export const dynamic = "force-dynamic";

export default async function AdminClientsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const [clients, rate] = await Promise.all([listClients(q), getPkrRate()]);
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#F5F0E8]">Clients</h1>
          <p className="text-xs text-[#7C8088]">{clients.length} clients. Someone who only asked for a price stays an enquiry — a client exists once a quotation was created for them.</p>
        </div>
        <form className="flex gap-2">
          <input name="q" defaultValue={q} placeholder="Search name, phone, email…" className="rounded-lg border border-[#333] bg-black/40 px-3 py-2 text-sm text-[#F5F0E8] outline-none focus:border-[#C9A84C]" />
          <button className="rounded-lg border border-[#C9A84C]/40 px-3 py-2 text-xs font-bold text-[#C9A84C]">Search</button>
        </form>
      </div>
      <div className="rounded-2xl border border-[#333] bg-[#111] overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#1A1A1A] text-[0.6rem] uppercase tracking-widest text-[#7C8088]">
            <tr><th className="p-3">Client</th><th className="p-3">Contact</th><th className="p-3">Bookings</th><th className="p-3">Completed</th><th className="p-3">Paid</th><th className="p-3">Margin</th><th className="p-3">Last trip</th></tr>
          </thead>
          <tbody className="divide-y divide-[#222] text-[#A1A1A6]">
            {clients.map((c) => (
              <tr key={c.id}>
                <td className="p-3"><Link href={`/admin/clients/${c.id}`} className="font-bold text-[#F5F0E8] hover:text-[#C9A84C] hover:underline">{c.name}</Link></td>
                <td className="p-3">{c.phone}{c.email && <div>{c.email}</div>}</td>
                <td className="p-3">{c.bookings}</td>
                <td className="p-3">{c.completed}</td>
                <td className="p-3 font-mono">SAR {c.paid_total.toLocaleString()}</td>
                <td className={`p-3 font-mono ${c.margin_total < 0 ? "text-red-400 font-bold" : ""}`}>SAR {c.margin_total.toLocaleString()}{rate ? ` · PKR ${Math.round(c.margin_total * rate).toLocaleString()}` : ""}</td>
                <td className="p-3">{c.last_trip ?? "—"}</td>
              </tr>
            ))}
            {clients.length === 0 && <tr><td colSpan={7} className="p-8 text-center">No clients match.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
