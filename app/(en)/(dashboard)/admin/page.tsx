import { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle, ArrowRight, CalendarCheck, CalendarClock, CalendarDays, CheckCircle2, CircleDollarSign,
  Inbox, MessageCircle, Plus, UserX, Wallet,
} from "lucide-react";
import { getDashboard, type ForeignTotal, type Kpis, type RideRow } from "@/lib/ops/dashboard";
import { getPkrRate } from "@/lib/ops/money";

export const metadata: Metadata = { title: "Dashboard | Taxi Saudi Arabia Admin" };
export const dynamic = "force-dynamic";

const sar = (n: number) => `SAR ${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
const VEH: Record<string, string> = { sedan: "Sedan", suv: "SUV", van: "Van", bus: "Coach", limousine: "VIP" };
const STATUS_LABEL: Record<string, string> = {
  new: "New", quoted: "Quote sent", confirmed: "Confirmed", assigned: "Driver assigned", completed: "Completed", cancelled: "Cancelled",
};
const STATUS_TONE: Record<string, string> = {
  new: "bg-slate-100 text-slate-700", quoted: "bg-amber-50 text-amber-700", confirmed: "bg-sky-50 text-sky-700",
  assigned: "bg-sky-50 text-sky-700", completed: "bg-emerald-50 text-emerald-700", cancelled: "bg-rose-50 text-rose-700",
};

function Pill({ tone, children }: { tone: string; children: React.ReactNode }) {
  return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[0.7rem] font-semibold ${tone}`}>{children}</span>;
}

function Pkr({ n, rate }: { n: number; rate: number | null }) {
  return rate ? <span className="block text-xs font-normal text-slate-400">PKR {Math.round(n * rate).toLocaleString("en-US")}</span> : null;
}

/** Big, plain-language number card. Every card with an href is a real link to the matching list. */
function Stat({ icon: Icon, label, value, hint, tone = "slate", href }: {
  icon: React.ComponentType<{ className?: string }>; label: string; value: string | number; hint?: React.ReactNode;
  tone?: "slate" | "green" | "amber" | "red" | "sky"; href?: string;
}) {
  const ring = { slate: "bg-slate-100 text-slate-600", green: "bg-emerald-50 text-emerald-600", amber: "bg-amber-50 text-amber-600", red: "bg-rose-50 text-rose-600", sky: "bg-sky-50 text-sky-600" }[tone];
  const body = (
    <div className="flex h-full items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition group-hover:border-emerald-300 group-hover:shadow-md">
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${ring}`}><Icon className="h-5 w-5" /></span>
      <div className="min-w-0">
        <div className="text-2xl font-bold leading-tight text-slate-900">{value}</div>
        <div className="text-sm font-medium text-slate-600">{label}</div>
        {hint && <div className="mt-0.5 text-xs text-slate-400">{hint}</div>}
      </div>
    </div>
  );
  return href ? <Link href={href} className="group block h-full">{body}</Link> : <div className="h-full">{body}</div>;
}

function Money({ label, value, sub, tone = "text-slate-900", note }: { label: string; value: string; sub?: React.ReactNode; tone?: string; note?: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-sm font-medium text-slate-500">{label}</div>
      <div className={`mt-1 text-2xl font-bold ${tone}`}>{value}</div>
      {sub}
      {note && <div className="mt-1 text-xs text-slate-400">{note}</div>}
    </div>
  );
}

function RideList({ rows, empty }: { rows: RideRow[]; empty: string }) {
  if (rows.length === 0) return <p className="px-5 py-8 text-center text-sm text-slate-400">{empty}</p>;
  return (
    <ul className="divide-y divide-slate-100">
      {rows.map((r) => (
        <li key={r.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-3.5 hover:bg-slate-50">
          <div className="w-20 shrink-0">
            <div className="text-base font-bold text-slate-900">{r.trip_time ? r.trip_time.slice(0, 5) : "—"}</div>
            <div className="text-xs text-slate-400">{new Date(`${r.trip_date.slice(0, 10)}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" })}</div>
          </div>
          <div className="min-w-0 flex-1 basis-60">
            <Link href={`/admin/quotations/${r.id}`} className="font-semibold text-slate-900 hover:text-emerald-700 hover:underline">{r.customer_name}</Link>
            <div className="truncate text-sm text-slate-500">{r.pickup_location} → {r.drop_location}</div>
            {r.day_note && <div className="text-xs text-slate-400">{r.day_note}</div>}
          </div>
          <div className="w-28 shrink-0 text-sm">
            <div className="text-slate-400">Vehicle</div>
            <div className="font-medium text-slate-700">{r.vehicle ? VEH[r.vehicle] ?? r.vehicle : "—"}</div>
          </div>
          <div className="w-32 shrink-0 text-sm">
            <div className="text-slate-400">Driver</div>
            {r.driver ? <div className="font-medium text-slate-700">{r.driver}</div> : <Pill tone="bg-amber-50 text-amber-700">Needs a driver</Pill>}
          </div>
          <div className="flex w-36 shrink-0 flex-col items-start gap-1">
            <Pill tone={STATUS_TONE[r.status] ?? "bg-slate-100 text-slate-700"}>{STATUS_LABEL[r.status] ?? r.status}</Pill>
            <Pill tone={r.payment_status === "paid" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}>
              {r.payment_status === "paid" ? "Paid" : "Not paid yet"}{r.quoted_price != null ? ` · ${sar(r.quoted_price)}` : ""}
            </Pill>
          </div>
          <div className="ml-auto flex shrink-0 items-center gap-2">
            <a href={`https://wa.me/${r.customer_phone.replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer" title="Message on WhatsApp" aria-label={`WhatsApp ${r.customer_name}`}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:border-emerald-300 hover:text-emerald-600"><MessageCircle className="h-4 w-4" /></a>
            <Link href={`/admin/quotations/${r.id}`} className="inline-flex h-10 items-center rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white hover:bg-emerald-700">Open</Link>
          </div>
        </li>
      ))}
    </ul>
  );
}

// Where each "needs attention" card sends you. Links use the list's real filters (view=…).
const ALERT_LINK: Record<string, string> = {
  no_driver: "/admin/quotations?view=upcoming", past_open: "/admin/quotations?view=confirmed", need_cost: "/admin/quotations?view=needcost",
  unpaid: "/admin/quotations?view=unpaid", no_receipt: "/admin/quotations?view=paid", not_sent: "/admin/quotations?view=quotes", followup: "/admin/quotations?view=quotes",
};
const ALERT_URGENT = new Set(["no_driver", "past_open"]);

function MoneyBlock({ k, rate, fx }: { k: Kpis; rate: number | null; fx: ForeignTotal[] }) {
  const margin = k.costed_revenue - k.cost;
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Money label="Money received" value={sar(k.revenue)} sub={<Pkr n={k.revenue} rate={rate} />} note={`SAR rides only: ${k.paid_count} completed & paid`} tone="text-emerald-700" />
        <Money label="Still to collect" value={sar(k.unpaid_total)} sub={<Pkr n={k.unpaid_total} rate={rate} />} note={`${k.unpaid_completed} completed ride${k.unpaid_completed === 1 ? "" : "s"} not paid yet`} tone={k.unpaid_total ? "text-amber-600" : "text-slate-900"} />
        <Money label="Profit (where driver cost is known)" value={k.costed_count ? sar(margin) : "—"} sub={k.costed_count ? <Pkr n={margin} rate={rate} /> : undefined}
          note={k.costed_count ? `Only ${k.costed_count} of ${k.completed} completed rides — ${sar(k.costed_revenue)} received − ${sar(k.cost)} driver cost` : "No ride has a driver cost yet"} tone={margin < 0 ? "text-rose-600" : "text-emerald-700"} />
        <Money label="Your share of that profit" value={k.costed_count ? sar(k.owner_share) : "—"} sub={k.costed_count ? <Pkr n={k.owner_share} rate={rate} /> : undefined} note="After any partner split, same rides as profit" />
      </div>
      {fx.length > 0 && (
        <p className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
          <strong className="text-slate-900">Also received in other currencies (not converted, not included above):</strong>{" "}
          {fx.map((f) => `${f.currency} ${f.total.toLocaleString("en-US", { maximumFractionDigits: 2 })} (${f.rides} ride${f.rides === 1 ? "" : "s"})`).join(" · ")}
        </p>
      )}
      {k.missing_cost > 0 && (
        <Link href="/admin/quotations?view=needcost" className="flex items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 hover:bg-amber-100">
          <span><strong>{k.missing_cost} completed ride{k.missing_cost === 1 ? " has" : "s have"} no driver cost.</strong> Money received above includes them, but profit cannot be worked out until you enter what the driver was paid.</span>
          <span className="inline-flex shrink-0 items-center gap-1 font-semibold">Add costs <ArrowRight className="h-4 w-4" /></span>
        </Link>
      )}
    </div>
  );
}

const TABS = [
  { key: "today", label: "Today" }, { key: "tomorrow", label: "Tomorrow" }, { key: "week", label: "Next 7 days" },
  { key: "month", label: "Next 30 days" }, { key: "waiting", label: "Waiting for confirmation" },
] as const;

export default async function AdminDashboardPage({ searchParams }: { searchParams: Promise<{ range?: string; tab?: string }> }) {
  const sp = await searchParams;
  const rate = await getPkrRate();
  const d = await getDashboard(rate);
  const showAll = sp.range === "all";
  const k = showAll ? d.all : d.month;

  const dayPlus = (n: number) => new Date(new Date(`${d.today}T00:00:00Z`).getTime() + n * 86400000).toISOString().slice(0, 10);
  const weekRides = d.upcomingRides.filter((r) => r.trip_date.slice(0, 10) <= dayPlus(7));
  const tab = (TABS.find((t) => t.key === sp.tab)?.key ?? "today") as (typeof TABS)[number]["key"];
  const counts: Record<(typeof TABS)[number]["key"], number> = {
    today: d.todayRides.length, tomorrow: d.tomorrowRides.length, week: weekRides.length, month: d.upcomingRides.length, waiting: d.openQuotesUpcoming.length,
  };
  const tabRows = { today: d.todayRides, tomorrow: d.tomorrowRides, week: weekRides, month: d.upcomingRides, waiting: d.openQuotesUpcoming }[tab];
  const tabEmpty = { today: "No rides today.", tomorrow: "No rides tomorrow.", week: "No confirmed rides in the next 7 days.", month: "No confirmed rides in the next 30 days.", waiting: "No quotations waiting for a customer reply." }[tab];

  const todayLabel = new Date(`${d.today}T00:00:00Z`).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
  const owedTotal = d.owed.reduce((a, o) => a + o.outstanding, 0);

  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-10">
      {/* header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Good day — here is your business today</h1>
          <p className="text-sm text-slate-500">{todayLabel} (Riyadh time){!rate && <span className="ml-2 text-amber-600">· PKR rate not set</span>}</p>
        </div>
        <Link href="/admin/quotations/new" className="inline-flex h-11 items-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"><Plus className="h-4 w-4" /> New Quotation</Link>
      </div>

      {/* 1 — what is coming */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">What is coming up</h2>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Stat icon={CalendarCheck} label="Rides today" value={counts.today} tone="green" href="/admin/quotations?view=confirmed&preset=today" />
          <Stat icon={CalendarClock} label="Rides tomorrow" value={counts.tomorrow} tone="sky" href="/admin/quotations?view=confirmed&preset=tomorrow" />
          <Stat icon={CalendarDays} label="Rides in the next 7 days" value={counts.today + counts.tomorrow + weekRides.length} hint="including today and tomorrow" tone="sky" href="/admin/quotations?view=confirmed&preset=week" />
          <Stat icon={UserX} label="Upcoming rides with no driver" value={d.noDriverUpcoming} tone={d.noDriverUpcoming ? "amber" : "green"} hint={d.noDriverUpcoming ? "Assign a driver" : "All covered"} href="/admin/quotations?view=upcoming" />
        </div>
      </section>

      {/* 2 — what needs doing */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">What needs your attention</h2>
        {d.alerts.length === 0 ? (
          <p className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-700"><CheckCircle2 className="h-5 w-5" /> Nothing needs attention. All up to date.</p>
        ) : (
          <div className="grid gap-3 lg:grid-cols-2">
            {d.alerts.map((a) => {
              const urgent = ALERT_URGENT.has(a.key);
              return (
                <div key={a.key} className={`rounded-2xl border bg-white p-4 shadow-sm ${urgent ? "border-rose-200" : "border-slate-200"}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${urgent ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-600"}`}><AlertTriangle className="h-4 w-4" /></span>
                      <div>
                        <div className="font-semibold text-slate-900">{a.label} <span className={urgent ? "text-rose-600" : "text-amber-600"}>({a.items.length})</span></div>
                        <div className="text-sm text-slate-500">{a.hint}</div>
                      </div>
                    </div>
                    <Link href={ALERT_LINK[a.key] ?? "/admin/quotations"} className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-emerald-700 hover:underline">View all <ArrowRight className="h-3.5 w-3.5" /></Link>
                  </div>
                  <ul className="mt-3 space-y-1.5 text-sm">
                    {a.items.slice(0, 4).map((i) => (
                      <li key={i.id} className="flex flex-wrap gap-x-2"><Link href={`/admin/quotations/${i.id}`} className="font-mono text-xs font-bold text-emerald-700 hover:underline">{i.ref}</Link><span className="text-slate-600">{i.text}</span></li>
                    ))}
                    {a.items.length > 4 && <li className="text-xs text-slate-400">+ {a.items.length - 4} more</li>}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 3 — schedule */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Ride schedule</h2>
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex gap-1 overflow-x-auto border-b border-slate-200 px-3 pt-3">
            {TABS.map((t) => (
              <Link key={t.key} href={t.key === "today" ? "/admin" : `/admin?tab=${t.key}`} scroll={false}
                className={`-mb-px whitespace-nowrap rounded-t-lg border-b-2 px-4 py-2.5 text-sm font-semibold ${tab === t.key ? "border-emerald-600 text-emerald-700" : "border-transparent text-slate-500 hover:text-slate-800"}`}>
                {t.label} <span className={`ml-1 rounded-full px-2 py-0.5 text-xs ${tab === t.key ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>{counts[t.key]}</span>
              </Link>
            ))}
          </div>
          <RideList rows={tabRows} empty={tabEmpty} />
          {tab === "month" && d.laterCount > 0 && (
            <div className="border-t border-slate-100 px-5 py-3 text-sm text-slate-500">{d.laterCount} more confirmed ride{d.laterCount === 1 ? "" : "s"} further ahead — <Link href="/admin/quotations?view=upcoming" className="font-semibold text-emerald-700 hover:underline">see all upcoming</Link></div>
          )}
        </div>
      </section>

      {/* 4 — money */}
      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-900">Money — completed rides</h2>
          <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 text-sm font-semibold">
            <Link href="/admin" className={`rounded-lg px-4 py-1.5 ${!showAll ? "bg-emerald-600 text-white" : "text-slate-600 hover:text-slate-900"}`}>This month</Link>
            <Link href="/admin?range=all" className={`rounded-lg px-4 py-1.5 ${showAll ? "bg-emerald-600 text-white" : "text-slate-600 hover:text-slate-900"}`}>All time</Link>
          </div>
        </div>
        <p className="text-sm text-slate-500">{showAll ? "Every completed ride so far." : "Rides whose trip date is this month."} Revenue only counts rides marked <strong>Paid</strong>.</p>
        <MoneyBlock k={k} rate={rate} fx={showAll ? d.foreignAll : d.foreignMonth} />
      </section>

      {/* 5 — history folders */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Ride history</h2>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Stat icon={CheckCircle2} label="Completed rides" value={d.all.completed} hint={`${d.month.completed} this month`} tone="green" href="/admin/quotations?view=completed" />
          <Stat icon={CircleDollarSign} label="Paid rides" value={d.all.paid_count} tone="green" href="/admin/quotations?view=paid" />
          <Stat icon={AlertTriangle} label="Cancelled rides" value={d.all.cancelled} tone="slate" href="/admin/quotations?view=cancelled" />
          <Stat icon={Wallet} label="Drivers owe you" value={sar(owedTotal)} tone={owedTotal ? "amber" : "slate"} hint="Open Drivers for details" href="/admin/drivers" />
        </div>
      </section>

      {/* 6 — enquiries + losses */}
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900"><Inbox className="h-4 w-4 text-emerald-600" /> New website enquiries <span className="text-slate-400">({d.leadsTotal7d} this week)</span></h2>
            <Link href="/admin/leads" className="text-sm font-semibold text-emerald-700 hover:underline">Lead inbox</Link>
          </div>
          {d.leads.length === 0 ? <p className="text-sm text-slate-400">None waiting.</p> : (
            <ul className="divide-y divide-slate-100 text-sm">
              {d.leads.map((l) => {
                const qs = new URLSearchParams({
                  name: l.customer_name ?? "", phone: l.customer_phone ?? "", pickup: l.origin ?? "", drop: l.destination ?? "", date: (l.trip_date ?? "").slice(0, 10), time: (l.trip_date ?? "").slice(11, 16), vehicle: l.vehicle_type ?? "",
                });
                return (
                  <li key={l.id} className="flex items-center justify-between gap-3 py-2.5">
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-900">{l.customer_name ?? "No name"} <span className="font-normal text-slate-400">· {l.created_at.slice(0, 10)}</span></div>
                      <div className="truncate text-slate-500">{l.origin} → {l.destination}{l.trip_date ? ` · ${l.trip_date.slice(0, 10)}` : ""}{l.vehicle_type ? ` · ${l.vehicle_type}` : ""}</div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      {l.customer_phone && <a className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:border-emerald-300 hover:text-emerald-600" href={`https://wa.me/${l.customer_phone.replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer" title="WhatsApp" aria-label={`WhatsApp ${l.customer_name ?? "customer"}`}><MessageCircle className="h-4 w-4" /></a>}
                      <Link className="inline-flex h-10 items-center rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white hover:bg-emerald-700" href={`/admin/quotations/new?${qs}`}>Quote</Link>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-base font-semibold text-slate-900">Rides that lost money</h2>
          {d.lossRides.length === 0 ? <p className="text-sm text-slate-400">None recorded.</p> : (
            <ul className="space-y-2 text-sm">
              {d.lossRides.map((l) => (
                <li key={l.id} className="flex justify-between gap-3">
                  <span><Link href={`/admin/quotations/${l.id}`} className="font-mono text-xs font-bold text-emerald-700 hover:underline">{l.ref}</Link> <span className="text-slate-600">{l.customer} · {l.trip_date}</span></span>
                  <span className="font-semibold text-rose-600">−{sar(l.loss)}</span>
                </li>
              ))}
            </ul>
          )}
          {d.owed.length > 0 && (
            <>
              <h2 className="mb-2 mt-6 text-base font-semibold text-slate-900">Driver balances</h2>
              <ul className="space-y-1.5 text-sm">
                {d.owed.map((o) => (
                  <li key={o.name} className="flex justify-between gap-3">
                    <span className="font-medium text-slate-800">{o.name}</span>
                    <span className="text-slate-500">{o.outstanding > 0 ? `owes you ${sar(o.outstanding)}` : `you owe ${sar(-o.outstanding)}`}{rate ? ` · PKR ${Math.round(Math.abs(o.outstanding) * rate).toLocaleString("en-US")}` : ""}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
