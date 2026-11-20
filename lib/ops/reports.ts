// Reports. Everything is computed from the real records. Definitions (shown on the page too):
//  - Funnel is a COHORT by creation date: of the quotations created in the period, how many were sent / accepted-or-booked / completed.
//  - Money is by TRIP date, completed rides only; margin counts only rides where driver cost is known.
import { prisma } from "@/lib/prisma";
import { detectCity } from "@/lib/pricing/lookup";

export type Period = { key: string; label: string; from: string | null; to: string | null };

export function resolvePeriod(key: string | undefined, from?: string, to?: string, today = new Date(Date.now() + 3 * 3600 * 1000).toISOString().slice(0, 10)): Period {
  const y = Number(today.slice(0, 4)), m = Number(today.slice(5, 7));
  const iso = (d: Date) => d.toISOString().slice(0, 10);
  const monthStart = (yy: number, mm: number) => iso(new Date(Date.UTC(yy, mm - 1, 1)));
  const monthEnd = (yy: number, mm: number) => iso(new Date(Date.UTC(yy, mm, 0)));
  switch (key) {
    case "last_month": { const lm = m === 1 ? 12 : m - 1, ly = m === 1 ? y - 1 : y; return { key, label: "Last month", from: monthStart(ly, lm), to: monthEnd(ly, lm) }; }
    case "90d": { const d = new Date(`${today}T00:00:00Z`); d.setUTCDate(d.getUTCDate() - 89); return { key, label: "Last 90 days", from: iso(d), to: today }; }
    case "year": return { key, label: `${y} year to date`, from: `${y}-01-01`, to: today };
    case "all": return { key, label: "All time", from: null, to: null };
    case "custom":
      if (from && /^\d{4}-\d{2}-\d{2}$/.test(from) && to && /^\d{4}-\d{2}-\d{2}$/.test(to)) return { key, label: `${from} → ${to}`, from, to };
      return { key: "month", label: "This month", from: monthStart(y, m), to: monthEnd(y, m) };
    default: return { key: "month", label: "This month", from: monthStart(y, m), to: monthEnd(y, m) };
  }
}

export type Money = { rides: number; revenue: number; cost: number; margin: number; owner_share: number; loss_count: number; loss_total: number; missing_cost: number; avg_ticket: number };
export type Funnel = { website_leads: number; created: number; sent: number; accepted: number; completed: number; lost: number; conversion: number | null; win_value: number };
export type MonthRow = { month: string; rides: number; revenue: number; cost: number; margin: number; owner_share: number };
export type GroupRow = { key: string; quotes: number; booked: number; completed: number; revenue: number; margin: number; known_margin_rides: number };
export type ClientRow = { id: string; name: string; bookings: number; completed: number; revenue: number; margin: number; first: string; last: string };
export type DriverRow = { name: string; rides: number; revenue: number; margin: number; owner_share: number };
export type SourceRow = { source: string; created: number; booked: number };

export type Report = {
  period: Period;
  money: Money;
  funnel: Funnel;
  months: MonthRow[];
  routes: GroupRow[];
  vehicles: GroupRow[];
  clients: ClientRow[];
  repeatClients: number;
  drivers: DriverRow[];
  sources: SourceRow[];
};

const BOOKED = `status IN ('confirmed','assigned','completed')`;

export async function getReport(p: Period): Promise<Report> {
  const q = <T,>(sql: string, ...a: unknown[]) => prisma.$queryRawUnsafe<T[]>(sql, ...a);
  const tripCond = `NOT is_test AND ($1::date IS NULL OR trip_date >= $1::date) AND ($2::date IS NULL OR trip_date <= $2::date)`;
  const createdCond = `NOT is_test AND ($1::date IS NULL OR (created_at AT TIME ZONE 'Asia/Riyadh')::date >= $1::date) AND ($2::date IS NULL OR (created_at AT TIME ZONE 'Asia/Riyadh')::date <= $2::date)`;
  const args = [p.from, p.to];

  const [money, funnel, leads, months, perQuote, clients, drivers, sources] = await Promise.all([
    q<Money>(
      `SELECT count(*) FILTER (WHERE status='completed')::int rides,
         COALESCE(SUM(actual_amount_paid) FILTER (WHERE status='completed'),0)::float revenue,
         COALESCE(SUM(driver_cost+extra_cost) FILTER (WHERE status='completed' AND financial_status='confirmed'),0)::float cost,
         COALESCE(SUM(COALESCE(actual_amount_paid,0)-driver_cost-extra_cost) FILTER (WHERE status='completed' AND financial_status='confirmed'),0)::float margin,
         COALESCE(SUM((COALESCE(actual_amount_paid,0)-driver_cost-extra_cost)*(100-COALESCE(partner_share_pct,0))/100) FILTER (WHERE status='completed' AND financial_status='confirmed'),0)::float owner_share,
         count(*) FILTER (WHERE status='completed' AND financial_status='confirmed' AND COALESCE(actual_amount_paid,0)-driver_cost-extra_cost<0)::int loss_count,
         COALESCE(SUM(driver_cost+extra_cost-COALESCE(actual_amount_paid,0)) FILTER (WHERE status='completed' AND financial_status='confirmed' AND COALESCE(actual_amount_paid,0)-driver_cost-extra_cost<0),0)::float loss_total,
         count(*) FILTER (WHERE status='completed' AND financial_status<>'confirmed')::int missing_cost,
         COALESCE(AVG(actual_amount_paid) FILTER (WHERE status='completed' AND actual_amount_paid>0),0)::float avg_ticket
       FROM quotations WHERE ${tripCond}`, ...args),
    q<Omit<Funnel, "website_leads" | "conversion">>(
      `SELECT count(*)::int created,
         count(*) FILTER (WHERE sent_at IS NOT NULL OR quote_stage IN ('sent','follow_up','accepted') OR ${BOOKED})::int sent,
         count(*) FILTER (WHERE quote_stage='accepted' OR ${BOOKED})::int accepted,
         count(*) FILTER (WHERE status='completed')::int completed,
         count(*) FILTER (WHERE quote_stage IN ('rejected','expired') OR status='cancelled')::int lost,
         COALESCE(SUM(quoted_price) FILTER (WHERE ${BOOKED}),0)::float win_value
       FROM quotations WHERE ${createdCond}`, ...args),
    q<{ n: number }>(
      `SELECT count(*)::int n FROM leads WHERE ($1::date IS NULL OR (created_at AT TIME ZONE 'Asia/Riyadh')::date >= $1::date) AND ($2::date IS NULL OR (created_at AT TIME ZONE 'Asia/Riyadh')::date <= $2::date)`, ...args),
    q<MonthRow>(
      `SELECT to_char(date_trunc('month', trip_date),'YYYY-MM') AS month, count(*)::int rides,
         COALESCE(SUM(actual_amount_paid),0)::float revenue,
         COALESCE(SUM(driver_cost+extra_cost) FILTER (WHERE financial_status='confirmed'),0)::float cost,
         COALESCE(SUM(COALESCE(actual_amount_paid,0)-driver_cost-extra_cost) FILTER (WHERE financial_status='confirmed'),0)::float margin,
         COALESCE(SUM((COALESCE(actual_amount_paid,0)-driver_cost-extra_cost)*(100-COALESCE(partner_share_pct,0))/100) FILTER (WHERE financial_status='confirmed'),0)::float owner_share
       FROM quotations WHERE NOT is_test AND status='completed' AND trip_date >= (date_trunc('month', now() AT TIME ZONE 'Asia/Riyadh') - interval '5 months')::date
       GROUP BY 1 ORDER BY 1`),
    q<{ pickup_location: string; drop_location: string; vehicle: string | null; status: string; quote_stage: string; revenue: number | null; margin: number | null; has_margin: boolean }>(
      `SELECT pickup_location, drop_location, vehicle_type_requested::text vehicle, status::text, quote_stage,
         CASE WHEN status='completed' THEN actual_amount_paid::float END revenue,
         CASE WHEN status='completed' AND financial_status='confirmed' THEN (COALESCE(actual_amount_paid,0)-driver_cost-extra_cost)::float END margin,
         (status='completed' AND financial_status='confirmed') has_margin
       FROM quotations WHERE ${tripCond}`, ...args),
    q<ClientRow>(
      `SELECT c.id::text, c.name, count(x.id)::int bookings, count(x.id) FILTER (WHERE x.status='completed')::int completed,
         COALESCE(SUM(x.actual_amount_paid) FILTER (WHERE x.status='completed'),0)::float revenue,
         COALESCE(SUM(COALESCE(x.actual_amount_paid,0)-x.driver_cost-x.extra_cost) FILTER (WHERE x.status='completed' AND x.financial_status='confirmed'),0)::float margin,
         min(x.trip_date)::text AS first, max(x.trip_date)::text AS last
       FROM clients c JOIN quotations x ON x.client_id=c.id WHERE NOT x.is_test AND x.status IN ('confirmed','assigned','completed') AND ($1::date IS NULL OR x.trip_date >= $1::date) AND ($2::date IS NULL OR x.trip_date <= $2::date)
       GROUP BY c.id ORDER BY revenue DESC, bookings DESC LIMIT 15`, ...args),
    q<DriverRow>(
      `SELECT COALESCE(pt.name, x.driver_name, 'Unassigned') name, count(*)::int rides, COALESCE(SUM(x.actual_amount_paid),0)::float revenue,
         COALESCE(SUM(COALESCE(x.actual_amount_paid,0)-x.driver_cost-x.extra_cost) FILTER (WHERE x.financial_status='confirmed'),0)::float margin,
         COALESCE(SUM((COALESCE(x.actual_amount_paid,0)-x.driver_cost-x.extra_cost)*(100-COALESCE(x.partner_share_pct,0))/100) FILTER (WHERE x.financial_status='confirmed'),0)::float owner_share
       FROM quotations x LEFT JOIN partners pt ON pt.id=x.partner_id WHERE NOT x.is_test AND x.status='completed' AND ($1::date IS NULL OR x.trip_date >= $1::date) AND ($2::date IS NULL OR x.trip_date <= $2::date)
       GROUP BY 1 ORDER BY revenue DESC`, ...args),
    q<SourceRow>(
      `SELECT source::text, count(*)::int created, count(*) FILTER (WHERE ${BOOKED})::int booked FROM quotations WHERE ${createdCond} GROUP BY 1 ORDER BY 2 DESC`, ...args),
  ]);

  // routes + vehicles are grouped in JS so the city normaliser (same as the pricing lookup) is the single source of truth
  const routes = new Map<string, GroupRow>();
  const vehicles = new Map<string, GroupRow>();
  const bump = (m: Map<string, GroupRow>, key: string, r: (typeof perQuote)[number]) => {
    const g = m.get(key) ?? { key, quotes: 0, booked: 0, completed: 0, revenue: 0, margin: 0, known_margin_rides: 0 };
    g.quotes++;
    if (["confirmed", "assigned", "completed"].includes(r.status)) g.booked++;
    if (r.status === "completed") { g.completed++; g.revenue += r.revenue ?? 0; }
    if (r.has_margin) { g.margin += r.margin ?? 0; g.known_margin_rides++; }
    m.set(key, g);
  };
  for (const r of perQuote) {
    const a = detectCity(r.pickup_location), b = detectCity(r.drop_location);
    const key = a && b ? (a === b ? `${a} (local)` : `${a} → ${b}`) : "Other / unrecognised";
    bump(routes, key, r);
    bump(vehicles, r.vehicle ?? "unspecified", r);
  }
  const byBooked = (x: GroupRow, y: GroupRow) => y.revenue - x.revenue || y.booked - x.booked || y.quotes - x.quotes;

  const fu = funnel[0];
  const conv = fu.created > 0 ? fu.accepted / fu.created : null;
  const repeat = await q<{ n: number }>(`SELECT count(*)::int n FROM (SELECT client_id FROM quotations WHERE NOT is_test AND client_id IS NOT NULL AND ${BOOKED} GROUP BY client_id HAVING count(*) >= 2) t`);

  return {
    period: p,
    money: { ...money[0] },
    funnel: { website_leads: leads[0].n, ...fu, conversion: conv },
    months,
    routes: [...routes.values()].sort(byBooked),
    vehicles: [...vehicles.values()].sort(byBooked),
    clients,
    repeatClients: repeat[0].n,
    drivers,
    sources,
  };
}

export async function exportRows(p: Period) {
  return prisma.$queryRawUnsafe<Record<string, string | number | null>[]>(
    `SELECT quote_reference ref, trip_date::text trip_date, customer_name client, customer_phone phone, pickup_location pickup, drop_location dropoff,
        vehicle_type_requested::text vehicle, status::text status, quote_stage stage, quoted_price::float quoted, actual_amount_paid::float paid, payment_method_used payment_method,
        driver_cost::float driver_cost, extra_cost::float extra_cost,
        CASE WHEN driver_cost IS NOT NULL THEN (COALESCE(actual_amount_paid,0)-driver_cost-extra_cost)::float END margin,
        driver_name driver, partner_share_pct::float driver_share_pct, source::text source, created_at::date::text created
      FROM quotations WHERE NOT is_test AND ($1::date IS NULL OR trip_date >= $1::date) AND ($2::date IS NULL OR trip_date <= $2::date) ORDER BY trip_date, quote_reference`,
    p.from, p.to);
}
