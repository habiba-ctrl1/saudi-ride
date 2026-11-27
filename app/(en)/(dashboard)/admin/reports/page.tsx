import { Metadata } from "next";
import Link from "next/link";
import { Download } from "lucide-react";
import { getReport, resolvePeriod, type GroupRow } from "@/lib/ops/reports";
import { getPkrRate } from "@/lib/ops/money";

export const metadata: Metadata = { title: "Reports | Admin Dashboard" };
export const dynamic = "force-dynamic";

const PERIODS = [["month", "This month"], ["last_month", "Last month"], ["90d", "Last 90 days"], ["year", "This year"], ["all", "All time"]] as const;
const sar = (n: number) => `SAR ${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
const pct = (n: number | null) => (n == null ? "—" : `${Math.round(n * 100)}%`);
const VEH: Record<string, string> = { sedan: "Executive sedan", suv: "Full-size SUV", van: "Van", bus: "Coach", limousine: "Limousine / VIP", unspecified: "Not specified" };

export default async function ReportsPage({ searchParams }: { searchParams: Promise<{ period?: string; from?: string; to?: string }> }) {
  const sp = await searchParams;
  const period = resolvePeriod(sp.period, sp.from, sp.to);
  const [r, rate] = await Promise.all([getReport(period), getPkrRate()]);
  const pkr = (n: number) => (rate ? <span className="block text-[0.65rem] font-normal text-[#7C8088]">PKR {Math.round(n * rate).toLocaleString("en-US")}</span> : null);
  const exportQs = new URLSearchParams({ period: period.key, ...(period.key === "custom" ? { from: period.from ?? "", to: period.to ?? "" } : {}) });
  const maxMargin = Math.max(1, ...r.months.map((m) => Math.abs(m.revenue)));

  const Kpi = ({ k, v, sub, tone }: { k: string; v: string; sub?: React.ReactNode; tone?: string }) => (
    <div className="rounded-xl border border-[#333] bg-[#111] px-3 py-2.5"><div className="text-[0.6rem] uppercase tracking-widest text-[#7C8088]">{k}</div><div className={`mt-0.5 text-lg font-bold ${tone ?? "text-[#F5F0E8]"}`}>{v}</div>{sub}</div>
  );
  const Section = ({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) => (
    <section className="rounded-2xl border border-[#333] bg-[#111] p-4">
      <h2 className="text-[0.65rem] font-bold uppercase tracking-widest text-[#7C8088]">{title}</h2>
      {note && <p className="mb-2 text-[0.7rem] text-[#7C8088]">{note}</p>}
      <div className="mt-2 overflow-x-auto">{children}</div>
    </section>
  );
  const groupTable = (rows: GroupRow[], label: (k: string) => string, head: string) => (
    <table className="w-full text-left text-xs">
      <thead className="text-[0.6rem] uppercase tracking-widest text-[#7C8088]"><tr><th className="py-1.5 pr-3">{head}</th><th className="px-2">Quotes</th><th className="px-2">Booked</th><th className="px-2">Win rate</th><th className="px-2">Completed</th><th className="px-2 text-right">Revenue</th><th className="px-2 text-right">Margin</th></tr></thead>
      <tbody className="divide-y divide-[#222] text-[#A1A1A6]">
        {rows.map((g) => (
          <tr key={g.key}>
            <td className="py-1.5 pr-3 font-bold text-[#F5F0E8]">{label(g.key)}</td><td className="px-2">{g.quotes}</td><td className="px-2">{g.booked}</td>
            <td className="px-2">{g.quotes ? pct(g.booked / g.quotes) : "—"}</td><td className="px-2">{g.completed}</td>
            <td className="px-2 text-right font-mono">{sar(g.revenue)}</td>
            <td className={`px-2 text-right font-mono ${g.margin < 0 ? "text-red-400 font-bold" : ""}`}>{g.known_margin_rides ? sar(g.margin) : "—"}{g.known_margin_rides ? pkr(g.margin) : null}</td>
          </tr>
        ))}
        {rows.length === 0 && <tr><td colSpan={7} className="py-4 text-center">No data in this period.</td></tr>}
      </tbody>
    </table>
  );

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#F5F0E8]">Reports</h1>
          <p className="text-xs text-[#7C8088]">{period.label}{period.from ? ` · ${period.from} → ${period.to}` : ""}{!rate && <span className="ml-2 text-yellow-500">PKR rate not set</span>}</p>
        </div>
        <a href={`/api/admin/reports/export?${exportQs}`} className="inline-flex items-center gap-1.5 rounded-lg border border-[#C9A84C]/40 px-3 py-2 text-xs font-bold text-[#C9A84C] hover:bg-[#C9A84C]/10"><Download className="h-3.5 w-3.5" /> Export bookings CSV</a>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {PERIODS.map(([k, l]) => (
          <Link key={k} href={`/admin/reports?period=${k}`} className={`rounded-lg border px-3 py-1.5 text-xs font-bold ${period.key === k ? "border-[#C9A84C]/40 bg-[#C9A84C]/15 text-[#C9A84C]" : "border-[#333] text-[#A1A1A6]"}`}>{l}</Link>
        ))}
        <form className="ml-2 flex items-center gap-1.5 text-xs text-[#7C8088]">
          <input type="hidden" name="period" value="custom" />
          <input type="date" name="from" defaultValue={period.key === "custom" ? period.from ?? "" : ""} required className="rounded-lg border border-[#333] bg-black/40 px-2 py-1.5 text-xs text-[#F5F0E8]" /> to
          <input type="date" name="to" defaultValue={period.key === "custom" ? period.to ?? "" : ""} required className="rounded-lg border border-[#333] bg-black/40 px-2 py-1.5 text-xs text-[#F5F0E8]" />
          <button className="rounded-lg border border-[#333] px-2.5 py-1.5 text-xs font-bold text-[#A1A1A6] hover:text-[#F5F0E8]">Apply</button>
        </form>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-6">
        <Kpi k="Completed rides" v={String(r.money.rides)} />
        <Kpi k="Revenue (paid)" v={sar(r.money.revenue)} sub={pkr(r.money.revenue)} />
        <Kpi k="Driver cost" v={sar(r.money.cost)} sub={pkr(r.money.cost)} />
        <Kpi k="Gross margin" v={sar(r.money.margin)} tone={r.money.margin < 0 ? "text-red-400" : "text-green-500"} sub={pkr(r.money.margin)} />
        <Kpi k="Your share" v={sar(r.money.owner_share)} sub={pkr(r.money.owner_share)} />
        <Kpi k="Avg ticket" v={sar(r.money.avg_ticket)} sub={pkr(r.money.avg_ticket)} />
      </div>
      <p className="text-[0.7rem] text-[#7C8088]">
        Loss-making rides: <span className={r.money.loss_count ? "font-bold text-red-400" : ""}>{r.money.loss_count}{r.money.loss_count ? ` (lost ${sar(r.money.loss_total)})` : ""}</span>
        {r.money.missing_cost > 0 && <span className="ml-3 text-yellow-500">{r.money.missing_cost} completed ride(s) have no driver cost — revenue counts them, margin does not.</span>}
        <span className="ml-3">Money is by trip date, completed rides only.</span>
      </p>

      <Section title="Funnel" note="Cohort by creation date: of the quotations created in this period, how far did they get. Conversion = accepted or booked ÷ created.">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          <Kpi k="Website enquiries" v={String(r.funnel.website_leads)} />
          <Kpi k="Quotations created" v={String(r.funnel.created)} />
          <Kpi k="Quotations sent" v={String(r.funnel.sent)} />
          <Kpi k="Accepted / booked" v={String(r.funnel.accepted)} sub={<span className="block text-[0.65rem] font-normal text-[#7C8088]">{sar(r.funnel.win_value)} quoted value</span>} />
          <Kpi k="Completed" v={String(r.funnel.completed)} />
          <Kpi k="Conversion" v={pct(r.funnel.conversion)} tone="text-[#C9A84C]" sub={<span className="block text-[0.65rem] font-normal text-[#7C8088]">{r.funnel.lost} lost / cancelled</span>} />
        </div>
      </Section>

      <Section title="Last 6 months" note="Completed rides by month of trip.">
        {r.months.length === 0 ? <p className="py-3 text-xs text-[#7C8088]">No completed rides yet.</p> : (
          <table className="w-full text-left text-xs">
            <thead className="text-[0.6rem] uppercase tracking-widest text-[#7C8088]"><tr><th className="py-1.5">Month</th><th>Rides</th><th className="text-right">Revenue</th><th className="text-right">Driver cost</th><th className="text-right">Margin</th><th className="text-right">Your share</th><th className="w-40 pl-4" /></tr></thead>
            <tbody className="divide-y divide-[#222] text-[#A1A1A6]">
              {r.months.map((m) => (
                <tr key={m.month}>
                  <td className="py-1.5 font-bold text-[#F5F0E8]">{m.month}</td><td>{m.rides}</td>
                  <td className="text-right font-mono">{sar(m.revenue)}{pkr(m.revenue)}</td><td className="text-right font-mono">{sar(m.cost)}</td>
                  <td className={`text-right font-mono ${m.margin < 0 ? "font-bold text-red-400" : ""}`}>{sar(m.margin)}</td><td className="text-right font-mono">{sar(m.owner_share)}{pkr(m.owner_share)}</td>
                  <td className="pl-4"><div className="h-2 rounded bg-[#222]"><div className={`h-2 rounded ${m.margin < 0 ? "bg-red-500" : "bg-green-500"}`} style={{ width: `${Math.max(3, Math.round((Math.abs(m.revenue) / maxMargin) * 100))}%` }} /></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Section>

      <Section title="Route performance" note="Routes are grouped with the same city recogniser the Pricing Book uses. Win rate = booked ÷ quotes for trips in this period.">
        {groupTable(r.routes, (k) => k, "Route")}
      </Section>

      <div className="grid gap-5 lg:grid-cols-2">
        <Section title="Vehicle performance">{groupTable(r.vehicles, (k) => VEH[k] ?? k, "Vehicle")}</Section>
        <Section title="Where bookings come from" note="Quotations created in this period, by source.">
          <table className="w-full text-left text-xs">
            <thead className="text-[0.6rem] uppercase tracking-widest text-[#7C8088]"><tr><th className="py-1.5">Source</th><th>Quotations</th><th>Booked</th><th>Win rate</th></tr></thead>
            <tbody className="divide-y divide-[#222] text-[#A1A1A6]">
              {r.sources.map((s) => <tr key={s.source}><td className="py-1.5 font-bold text-[#F5F0E8]">{s.source.replace("_", " ")}</td><td>{s.created}</td><td>{s.booked}</td><td>{s.created ? pct(s.booked / s.created) : "—"}</td></tr>)}
              {r.sources.length === 0 && <tr><td colSpan={4} className="py-4 text-center">No data in this period.</td></tr>}
            </tbody>
          </table>
        </Section>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Section title="Top clients" note={`${r.repeatClients} repeat client(s) ever (2+ bookings).`}>
          <table className="w-full text-left text-xs">
            <thead className="text-[0.6rem] uppercase tracking-widest text-[#7C8088]"><tr><th className="py-1.5">Client</th><th>Bookings</th><th className="text-right">Revenue</th><th className="text-right">Margin</th></tr></thead>
            <tbody className="divide-y divide-[#222] text-[#A1A1A6]">
              {r.clients.map((c) => (
                <tr key={c.id}><td className="py-1.5"><Link href={`/admin/clients/${c.id}`} className="font-bold text-[#F5F0E8] hover:text-[#C9A84C] hover:underline">{c.name}</Link></td><td>{c.bookings}</td><td className="text-right font-mono">{sar(c.revenue)}</td><td className={`text-right font-mono ${c.margin < 0 ? "text-red-400" : ""}`}>{sar(c.margin)}</td></tr>
              ))}
              {r.clients.length === 0 && <tr><td colSpan={4} className="py-4 text-center">No bookings in this period.</td></tr>}
            </tbody>
          </table>
        </Section>
        <Section title="Driver performance" note="Completed rides in this period. Your share = margin after the driver's share.">
          <table className="w-full text-left text-xs">
            <thead className="text-[0.6rem] uppercase tracking-widest text-[#7C8088]"><tr><th className="py-1.5">Driver</th><th>Rides</th><th className="text-right">Revenue</th><th className="text-right">Margin</th><th className="text-right">Your share</th></tr></thead>
            <tbody className="divide-y divide-[#222] text-[#A1A1A6]">
              {r.drivers.map((d) => (
                <tr key={d.name}><td className="py-1.5 font-bold text-[#F5F0E8]">{d.name}</td><td>{d.rides}</td><td className="text-right font-mono">{sar(d.revenue)}</td><td className="text-right font-mono">{sar(d.margin)}</td><td className="text-right font-mono">{sar(d.owner_share)}{pkr(d.owner_share)}</td></tr>
              ))}
              {r.drivers.length === 0 && <tr><td colSpan={5} className="py-4 text-center">No completed rides in this period.</td></tr>}
            </tbody>
          </table>
        </Section>
      </div>
    </div>
  );
}
