import { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, CheckCircle2, MessageCircle, Plus } from "lucide-react";
import { getDashboard, type Kpis, type RideRow } from "@/lib/ops/dashboard";
import { getPkrRate } from "@/lib/ops/money";

export const metadata: Metadata = { title: "Dashboard | Taxi Saudi Arabia Admin" };
export const dynamic = "force-dynamic";

const sar = (n: number) => `SAR ${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
const VEH: Record<string, string> = { sedan: "Sedan", suv: "SUV", van: "Van", bus: "Coach", limousine: "VIP" };

function Pkr({ n, rate }: { n: number; rate: number | null }) {
  return rate ? <span className="block text-[0.65rem] font-normal text-[#7C8088]">PKR {Math.round(n * rate).toLocaleString("en-US")}</span> : null;
}

function Kpi({ label, value, sub, tone, href }: { label: string; value: string; sub?: React.ReactNode; tone?: string; href?: string }) {
  const body = (
    <div className="rounded-xl border border-[#333] bg-[#111] px-3 py-2.5 h-full">
      <div className="text-[0.6rem] uppercase tracking-widest text-[#7C8088]">{label}</div>
      <div className={`mt-0.5 text-lg font-bold ${tone ?? "text-[#F5F0E8]"}`}>{value}</div>
      {sub}
    </div>
  );
  return href ? <Link href={href} className="block hover:opacity-90">{body}</Link> : body;
}

function RideTable({ title, rows, empty, rate }: { title: string; rows: RideRow[]; empty: string; rate: number | null }) {
  void rate;
  return (
    <section className="rounded-2xl border border-[#333] bg-[#111]">
      <h2 className="flex items-center justify-between px-4 pt-3 text-[0.65rem] font-bold uppercase tracking-widest text-[#7C8088]">
        {title} <span className="rounded-full bg-[#C9A84C]/15 px-2 py-0.5 text-[#C9A84C]">{rows.length}</span>
      </h2>
      {rows.length === 0 ? (
        <p className="px-4 py-4 text-xs text-[#7C8088]">{empty}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[0.6rem] uppercase tracking-widest text-[#7C8088]">
              <tr><th className="px-4 py-2">Time</th><th className="py-2">Client</th><th className="py-2">Trip</th><th className="py-2">Vehicle</th><th className="py-2">Driver</th><th className="py-2">Status</th><th className="py-2">Payment</th><th className="py-2 pr-4" /></tr>
            </thead>
            <tbody className="divide-y divide-[#222] text-[#A1A1A6]">
              {rows.map((r) => (
                <tr key={r.id} className="align-top">
                  <td className="whitespace-nowrap px-4 py-2 font-mono text-[#F5F0E8]">{r.trip_time ? r.trip_time.slice(0, 5) : "—"}<div className="font-sans text-[0.65rem] text-[#7C8088]">{r.trip_date.slice(5)}{r.day_note ? ` · ${r.day_note}` : ""}</div></td>
                  <td className="py-2"><Link href={`/admin/quotations/${r.id}`} className="font-bold text-[#F5F0E8] hover:text-[#C9A84C] hover:underline">{r.customer_name}</Link><div className="font-mono text-[0.65rem] text-[#C9A84C]">{r.quote_reference}</div></td>
                  <td className="max-w-[260px] py-2">{r.pickup_location} → {r.drop_location}</td>
                  <td className="py-2">{r.vehicle ? VEH[r.vehicle] ?? r.vehicle : "—"}</td>
                  <td className={`py-2 ${r.driver ? "text-[#F5F0E8]" : "font-bold text-yellow-500"}`}>{r.driver ?? "unassigned"}</td>
                  <td className="py-2 uppercase font-bold">{r.status}</td>
                  <td className={`py-2 ${r.payment_status === "paid" ? "text-green-500" : ""}`}>{r.payment_status}{r.quoted_price != null ? <div className="font-mono text-[0.65rem] text-[#7C8088]">{sar(r.quoted_price)}</div> : null}</td>
                  <td className="whitespace-nowrap py-2 pr-4 text-right">
                    <Link href={`/admin/quotations/${r.id}`} className="font-bold text-[#C9A84C] hover:underline">Open</Link>
                    <a href={`https://wa.me/${r.customer_phone.replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer" className="ml-3 inline-flex items-center text-[#A1A1A6] hover:text-green-500" title="WhatsApp client"><MessageCircle className="h-3.5 w-3.5" /></a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function KpiBlock({ title, k, rate }: { title: string; k: Kpis; rate: number | null }) {
  return (
    <section className="space-y-2">
      <h2 className="text-[0.65rem] font-bold uppercase tracking-widest text-[#7C8088]">{title}</h2>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-6">
        <Kpi label="Completed rides" value={String(k.completed)} />
        <Kpi label="Revenue (paid)" value={sar(k.revenue)} sub={<Pkr n={k.revenue} rate={rate} />} />
        <Kpi label="Driver cost" value={sar(k.cost)} sub={<Pkr n={k.cost} rate={rate} />} />
        <Kpi label="Gross margin" value={sar(k.margin)} tone={k.margin < 0 ? "text-red-400" : "text-green-500"} sub={<Pkr n={k.margin} rate={rate} />} />
        <Kpi label="Your share" value={sar(k.owner_share)} sub={<Pkr n={k.owner_share} rate={rate} />} />
        <Kpi label="Loss-making rides" value={String(k.loss_count)} tone={k.loss_count ? "text-red-400" : undefined} sub={k.loss_count ? <span className="block text-[0.65rem] font-normal text-red-400">lost {sar(k.loss_total)}</span> : undefined} />
      </div>
      {k.missing_cost > 0 && <p className="text-[0.7rem] text-yellow-500">{k.missing_cost} completed ride(s) have no driver cost yet — revenue counts them, margin does not.</p>}
    </section>
  );
}

export default async function AdminDashboardPage({ searchParams }: { searchParams: Promise<{ range?: string }> }) {
  const sp = await searchParams;
  const rate = await getPkrRate();
  const d = await getDashboard(rate);
  const showAll = sp.range === "all";
  const k = showAll ? d.all : d.month;

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#F5F0E8]">Operations dashboard</h1>
          <p className="text-xs text-[#7C8088]">
            Today in Riyadh: {new Date(`${d.today}T00:00:00Z`).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })}
            {!rate && <span className="ml-2 text-yellow-500">· PKR rate not set</span>}
          </p>
        </div>
        <Link href="/admin/quotations/new" className="inline-flex items-center gap-1.5 rounded-lg bg-[#C9A84C] px-3.5 py-2 text-xs font-bold text-black hover:bg-[#dcb85e]"><Plus className="h-3.5 w-3.5" /> New Quotation</Link>
      </div>

      {/* pipeline */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Kpi label="New website enquiries (7 days)" value={String(d.leadsTotal7d)} sub={<span className="block text-[0.65rem] font-normal text-[#7C8088]">not yet quoted</span>} />
        <Kpi label="Pending quotations" value={String(d.all.pending_quotes)} sub={<span className="block text-[0.65rem] font-normal text-[#7C8088]">{sar(d.all.quotes_value)} on the table</span>} href="/admin/quotations?stage=quoted" />
        <Kpi label="Confirmed upcoming rides" value={String(d.all.confirmed_upcoming)} href="/admin/quotations?stage=in_progress" />
        <Kpi label="Completed — unpaid" value={String(d.all.unpaid_completed)} tone={d.all.unpaid_completed ? "text-yellow-500" : undefined} sub={d.all.unpaid_completed ? <span className="block text-[0.65rem] font-normal text-[#7C8088]">{sar(d.all.unpaid_total)}</span> : undefined} href="/admin/quotations?stage=completed&paymentStatus=unpaid" />
      </div>

      {/* actions */}
      <section className="rounded-2xl border border-[#333] bg-[#111] p-4">
        <h2 className="mb-2 flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-widest text-[#7C8088]">Outstanding actions</h2>
        {d.alerts.length === 0 ? (
          <p className="flex items-center gap-2 text-sm text-green-500"><CheckCircle2 className="h-4 w-4" /> Nothing needs attention.</p>
        ) : (
          <div className="grid gap-3 lg:grid-cols-2">
            {d.alerts.map((a) => (
              <div key={a.key} className="rounded-xl border border-[#333] bg-black/20 p-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle className={`mt-0.5 h-4 w-4 shrink-0 ${a.key === "past_open" || a.key === "no_driver" ? "text-red-400" : "text-yellow-500"}`} />
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-[#F5F0E8]">{a.label} <span className="text-[#C9A84C]">({a.items.length})</span></div>
                    <div className="text-[0.7rem] text-[#7C8088]">{a.hint}</div>
                  </div>
                </div>
                <ul className="mt-2 space-y-1 text-xs">
                  {a.items.slice(0, 5).map((i) => (
                    <li key={i.id}><Link href={`/admin/quotations/${i.id}`} className="font-mono font-bold text-[#C9A84C] hover:underline">{i.ref}</Link> <span className="text-[#A1A1A6]">{i.text}</span></li>
                  ))}
                  {a.items.length > 5 && <li className="text-[#7C8088]">+ {a.items.length - 5} more</li>}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* rides */}
      <RideTable title="Today's rides" rows={d.todayRides} empty="No rides today." rate={rate} />
      <RideTable title="Tomorrow" rows={d.tomorrowRides} empty="No rides tomorrow." rate={rate} />
      <RideTable title="Upcoming confirmed rides" rows={d.upcomingRides} empty="No further confirmed rides." rate={rate} />
      {d.openQuotesUpcoming.length > 0 && <RideTable title="Open quotations with an upcoming date (not confirmed yet)" rows={d.openQuotesUpcoming} empty="" rate={rate} />}

      {/* money */}
      <div className="flex flex-wrap items-center gap-2">
        <Link href="/admin" className={`rounded-lg border px-3 py-1.5 text-xs font-bold ${!showAll ? "border-[#C9A84C]/40 bg-[#C9A84C]/15 text-[#C9A84C]" : "border-[#333] text-[#A1A1A6]"}`}>This month</Link>
        <Link href="/admin?range=all" className={`rounded-lg border px-3 py-1.5 text-xs font-bold ${showAll ? "border-[#C9A84C]/40 bg-[#C9A84C]/15 text-[#C9A84C]" : "border-[#333] text-[#A1A1A6]"}`}>All time</Link>
      </div>
      <KpiBlock title={showAll ? "All time — completed rides" : "This month — completed rides (by trip date)"} k={k} rate={rate} />
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Kpi label="Cancelled" value={String(k.cancelled)} />
        <Kpi label="Confirmed upcoming" value={String(d.all.confirmed_upcoming)} />
        <Kpi label="Owed to you by drivers" value={sar(d.owed.reduce((a, o) => a + o.outstanding, 0))} href="/admin/drivers" sub={<Pkr n={d.owed.reduce((a, o) => a + o.outstanding, 0)} rate={rate} />} />
        <Kpi label="Unpaid completed" value={sar(d.all.unpaid_total)} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-[#333] bg-[#111] p-4">
          <h2 className="mb-2 text-[0.65rem] font-bold uppercase tracking-widest text-[#7C8088]">New website enquiries (not quoted yet)</h2>
          {d.leads.length === 0 ? <p className="text-xs text-[#7C8088]">None waiting.</p> : (
            <ul className="divide-y divide-[#222] text-xs">
              {d.leads.map((l) => {
                const qs = new URLSearchParams({
                  name: l.customer_name ?? "", phone: l.customer_phone ?? "", pickup: l.origin ?? "", drop: l.destination ?? "", date: (l.trip_date ?? "").slice(0, 10), time: (l.trip_date ?? "").slice(11, 16), vehicle: l.vehicle_type ?? "",
                });
                return (
                  <li key={l.id} className="flex items-start justify-between gap-3 py-2">
                    <div className="min-w-0">
                      <div className="font-bold text-[#F5F0E8]">{l.customer_name ?? "No name"} <span className="font-normal text-[#7C8088]">· {l.created_at.slice(0, 10)}</span></div>
                      <div className="text-[#A1A1A6]">{l.origin} → {l.destination}{l.trip_date ? ` · ${l.trip_date.slice(0, 10)}` : ""}{l.vehicle_type ? ` · ${l.vehicle_type}` : ""}</div>
                    </div>
                    <div className="flex shrink-0 gap-3">
                      {l.customer_phone && <a className="text-[#A1A1A6] hover:text-green-500" href={`https://wa.me/${l.customer_phone.replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer" title="WhatsApp"><MessageCircle className="h-4 w-4" /></a>}
                      <Link className="font-bold text-[#C9A84C] hover:underline" href={`/admin/quotations/new?${qs}`}>Quote</Link>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-[#333] bg-[#111] p-4">
          <h2 className="mb-2 text-[0.65rem] font-bold uppercase tracking-widest text-[#7C8088]">Loss-making rides</h2>
          {d.lossRides.length === 0 ? <p className="text-xs text-[#7C8088]">No loss-making rides recorded.</p> : (
            <ul className="space-y-1.5 text-xs">
              {d.lossRides.map((l) => (
                <li key={l.id} className="flex justify-between gap-3">
                  <span><Link href={`/admin/quotations/${l.id}`} className="font-mono font-bold text-[#C9A84C] hover:underline">{l.ref}</Link> <span className="text-[#A1A1A6]">{l.customer} · {l.trip_date}</span></span>
                  <span className="font-mono font-bold text-red-400">LOSS {sar(l.loss)}</span>
                </li>
              ))}
            </ul>
          )}
          {d.owed.length > 0 && (
            <>
              <h2 className="mb-2 mt-4 text-[0.65rem] font-bold uppercase tracking-widest text-[#7C8088]">Driver balances</h2>
              <ul className="space-y-1 text-xs text-[#A1A1A6]">
                {d.owed.map((o) => (
                  <li key={o.name} className="flex justify-between"><span className="text-[#F5F0E8]">{o.name}</span><span className="font-mono">{o.outstanding > 0 ? `owes you ${sar(o.outstanding)}` : `you owe ${sar(-o.outstanding)}`}{rate ? ` · PKR ${Math.round(Math.abs(o.outstanding) * rate).toLocaleString("en-US")}` : ""}</span></li>
                ))}
              </ul>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
