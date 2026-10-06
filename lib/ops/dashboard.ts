// Operational dashboard data. Every number is computed from the real records — nothing typed by hand.
// "Today" is Riyadh time (UTC+3) regardless of where the server runs.
import { prisma } from "@/lib/prisma";
import { normPhone } from "@/lib/ops/quotations";

export type RideRow = {
  id: string;
  quote_reference: string;
  customer_name: string;
  customer_phone: string;
  pickup_location: string;
  drop_location: string;
  trip_date: string;
  return_date: string | null;
  trip_time: string | null;
  trip_type: string;
  vehicle: string | null;
  quoted_price: number | null;
  status: string;
  payment_status: string;
  driver: string | null;
  day_note: string | null;
};

const RIDE_COLS = `id::text, quote_reference, customer_name, customer_phone, pickup_location, drop_location, trip_date::text, return_date::text, trip_time::text, trip_type::text,
  vehicle_type_requested::text vehicle, quoted_price::float, status::text, payment_status::text, COALESCE(driver_name, (SELECT full_name FROM drivers d WHERE d.id=assigned_driver_id)) driver`;

export type Kpis = {
  completed: number;
  revenue: number;
  cost: number;
  margin: number;
  owner_share: number;
  loss_count: number;
  loss_total: number;
  missing_cost: number;
  unpaid_completed: number;
  unpaid_total: number;
  confirmed_upcoming: number;
  cancelled: number;
  pending_quotes: number;
  quotes_value: number;
};

export type Alert = { key: string; label: string; hint: string; items: { id: string; ref: string; text: string }[] };

export type LeadRow = { id: string; customer_name: string | null; customer_phone: string | null; origin: string | null; destination: string | null; trip_date: string | null; vehicle_type: string | null; created_at: string };

export type Dashboard = {
  today: string;
  rate: number | null;
  todayRides: RideRow[];
  tomorrowRides: RideRow[];
  upcomingRides: RideRow[];
  openQuotesUpcoming: RideRow[];
  month: Kpis;
  all: Kpis;
  alerts: Alert[];
  leads: LeadRow[];
  leadsTotal7d: number;
  owed: { name: string; outstanding: number }[];
  lossRides: { id: string; ref: string; customer: string; trip_date: string; loss: number }[];
};

async function kpis(from: string | null): Promise<Kpis> {
  const r = await prisma.$queryRawUnsafe<Kpis[]>(
    `SELECT
       count(*) FILTER (WHERE status='completed')::int completed,
       COALESCE(SUM(actual_amount_paid) FILTER (WHERE status='completed'),0)::float revenue,
       COALESCE(SUM(driver_cost+extra_cost) FILTER (WHERE status='completed' AND financial_status='confirmed'),0)::float cost,
       COALESCE(SUM(COALESCE(actual_amount_paid,0)-driver_cost-extra_cost) FILTER (WHERE status='completed' AND financial_status='confirmed'),0)::float margin,
       COALESCE(SUM((COALESCE(actual_amount_paid,0)-driver_cost-extra_cost)*(100-COALESCE(partner_share_pct,0))/100) FILTER (WHERE status='completed' AND financial_status='confirmed'),0)::float owner_share,
       count(*) FILTER (WHERE status='completed' AND financial_status='confirmed' AND COALESCE(actual_amount_paid,0)-driver_cost-extra_cost < 0)::int loss_count,
       COALESCE(SUM(driver_cost+extra_cost-COALESCE(actual_amount_paid,0)) FILTER (WHERE status='completed' AND financial_status='confirmed' AND COALESCE(actual_amount_paid,0)-driver_cost-extra_cost < 0),0)::float loss_total,
       count(*) FILTER (WHERE status='completed' AND financial_status<>'confirmed')::int missing_cost,
       count(*) FILTER (WHERE status='completed' AND payment_status<>'paid' AND NOT (actual_amount_paid = 0 AND financial_status='confirmed'))::int unpaid_completed,
       COALESCE(SUM(quoted_price) FILTER (WHERE status='completed' AND payment_status<>'paid' AND NOT (actual_amount_paid = 0 AND financial_status='confirmed')),0)::float unpaid_total,
       count(*) FILTER (WHERE status IN ('confirmed','assigned') AND trip_date >= (now() AT TIME ZONE 'Asia/Riyadh')::date)::int confirmed_upcoming,
       count(*) FILTER (WHERE status='cancelled')::int cancelled,
       count(*) FILTER (WHERE status IN ('new','quoted') AND quote_stage IN ('draft','ready','sent','follow_up'))::int pending_quotes,
       COALESCE(SUM(quoted_price) FILTER (WHERE status IN ('new','quoted') AND quote_stage IN ('draft','ready','sent','follow_up')),0)::float quotes_value
     FROM quotations WHERE NOT is_test AND ($1::date IS NULL OR trip_date >= $1::date)`,
    from,
  );
  return r[0];
}

export async function getDashboard(pkrRate: number | null): Promise<Dashboard> {
  const today = (await prisma.$queryRawUnsafe<{ d: string }[]>(`SELECT (now() AT TIME ZONE 'Asia/Riyadh')::date::text d`))[0].d;
  const monthStart = today.slice(0, 8) + "01";

  const [todayRides, tomorrowRides, upcomingRides, openQuotesUpcoming, month, all] = await Promise.all([
    prisma.$queryRawUnsafe<RideRow[]>(
      `SELECT ${RIDE_COLS}, CASE WHEN trip_type='multi_day' AND trip_date<>$1::date THEN 'multi-day, ends '||to_char(return_date,'DD Mon') WHEN trip_type='multi_day' AND return_date IS NOT NULL THEN 'multi-day, ends '||to_char(return_date,'DD Mon') END day_note
         FROM quotations WHERE NOT is_test AND status IN ('confirmed','assigned','completed')
          AND (trip_date=$1::date OR (trip_type='multi_day' AND return_date IS NOT NULL AND $1::date BETWEEN trip_date AND return_date))
         ORDER BY trip_time NULLS LAST`, today),
    prisma.$queryRawUnsafe<RideRow[]>(
      `SELECT ${RIDE_COLS}, CASE WHEN trip_type='multi_day' AND return_date IS NOT NULL THEN 'multi-day, ends '||to_char(return_date,'DD Mon') END day_note
         FROM quotations WHERE NOT is_test AND status IN ('confirmed','assigned','completed') AND trip_date=$1::date+1
         ORDER BY trip_time NULLS LAST`, today),
    prisma.$queryRawUnsafe<RideRow[]>(
      `SELECT ${RIDE_COLS}, NULL day_note FROM quotations WHERE NOT is_test AND status IN ('confirmed','assigned') AND trip_date > $1::date+1
         ORDER BY trip_date, trip_time NULLS LAST LIMIT 20`, today),
    prisma.$queryRawUnsafe<RideRow[]>(
      `SELECT ${RIDE_COLS}, NULL day_note FROM quotations WHERE NOT is_test AND status IN ('new','quoted') AND quote_stage IN ('draft','ready','sent','follow_up')
          AND trip_date >= $1::date ORDER BY trip_date LIMIT 20`, today),
    kpis(monthStart),
    kpis(null),
  ]);

  // ── outstanding actions ──
  const q = <T,>(sql: string, ...p: unknown[]) => prisma.$queryRawUnsafe<T[]>(sql, ...p);
  type A = { id: string; quote_reference: string; customer_name: string; trip_date: string; extra?: string };
  const [noDriver, notSent, followUp, pastOpen, needCost, unpaid, noReceipt] = await Promise.all([
    q<A>(`SELECT id::text, quote_reference, customer_name, trip_date::text FROM quotations WHERE NOT is_test AND status IN ('confirmed','assigned')
           AND partner_id IS NULL AND driver_name IS NULL AND assigned_driver_id IS NULL AND trip_date <= $1::date+3 AND trip_date >= $1::date ORDER BY trip_date`, today),
    q<A>(`SELECT id::text, quote_reference, customer_name, trip_date::text FROM quotations WHERE NOT is_test AND quote_stage='ready' AND status IN ('new','quoted') ORDER BY created_at`),
    q<A>(`SELECT id::text, quote_reference, customer_name, trip_date::text, to_char(COALESCE(followup_at, sent_at) AT TIME ZONE 'Asia/Riyadh','DD Mon') extra FROM quotations
           WHERE NOT is_test AND status IN ('new','quoted') AND quote_stage IN ('sent','follow_up') AND trip_date >= $1::date
             AND COALESCE(followup_at, sent_at) < now() - interval '2 days' ORDER BY COALESCE(followup_at, sent_at)`, today),
    q<A>(`SELECT id::text, quote_reference, customer_name, trip_date::text FROM quotations WHERE NOT is_test AND status IN ('new','quoted','confirmed','assigned') AND trip_date < $1::date
           AND NOT (trip_type='multi_day' AND return_date >= $1::date) ORDER BY trip_date`, today),
    q<A>(`SELECT id::text, quote_reference, customer_name, trip_date::text FROM quotations WHERE NOT is_test AND status='completed' AND financial_status<>'confirmed' ORDER BY trip_date`),
    q<A>(`SELECT id::text, quote_reference, customer_name, trip_date::text FROM quotations WHERE NOT is_test AND status='completed' AND payment_status<>'paid' AND NOT (actual_amount_paid = 0 AND financial_status='confirmed') ORDER BY trip_date`),
    q<A>(`SELECT id::text, quote_reference, customer_name, trip_date::text FROM quotations x WHERE NOT is_test AND status='completed' AND payment_status='paid'
           AND NOT EXISTS (SELECT 1 FROM documents d WHERE d.quotation_id=x.id AND d.kind='receipt') AND receipt_sent_at IS NULL AND trip_date >= $1::date - 14 ORDER BY trip_date`, today),
  ]);
  const mk = (key: string, label: string, hint: string, rows: A[]): Alert => ({
    key, label, hint, items: rows.map((r) => ({ id: r.id, ref: r.quote_reference, text: `${r.customer_name} · ${r.trip_date}${r.extra ? ` · last contact ${r.extra}` : ""}` })),
  });
  const alerts: Alert[] = [
    mk("no_driver", "Rides in the next 3 days with no driver", "Assign a driver on the booking record", noDriver),
    mk("past_open", "Past rides still open", "Mark completed or cancelled so the books are right", pastOpen),
    mk("need_cost", "Completed rides missing driver cost", "Margin cannot be known until you enter it", needCost),
    mk("unpaid", "Completed rides not marked paid", "Record the payment received", unpaid),
    mk("no_receipt", "Paid rides (last 14 days) with no receipt in the system", "Generate / send the receipt (older rides are not nagged)", noReceipt),
    mk("not_sent", "Quotations Ready but not sent", "Send by email or WhatsApp", notSent),
    mk("followup", "Quotations to follow up (sent over 2 days ago)", "Send a follow-up", followUp),
  ].filter((a) => a.items.length > 0);

  // ── website enquiries not yet turned into a quotation ──
  const leadsRaw = await q<LeadRow>(
    `SELECT id::text, customer_name, customer_phone, origin, destination, trip_date, vehicle_type, created_at::text FROM leads ORDER BY created_at DESC LIMIT 60`);
  const phones = new Set((await q<{ p: string }>(`SELECT regexp_replace(customer_phone,'[^0-9+]','','g') p FROM quotations`)).map((x) => x.p));
  const leads = leadsRaw.filter((l) => !/^test\b/i.test(l.customer_name ?? "") && !(l.customer_phone && phones.has(normPhone(l.customer_phone))));
  const cutoff = Date.now() - 7 * 24 * 3600 * 1000;
  const leadsTotal7d = leads.filter((l) => new Date(l.created_at.replace(" ", "T").replace(/([+-]\d{2})$/, "$1:00")).getTime() >= cutoff).length;

  const owed = await q<{ name: string; outstanding: number }>(
    `SELECT p.name, (COALESCE(r.owner_share,0)-COALESCE(s.received,0)+COALESCE(s.paid_out,0))::float outstanding FROM partners p
       LEFT JOIN (SELECT partner_id, SUM((COALESCE(actual_amount_paid,0)-driver_cost-extra_cost)*(100-COALESCE(partner_share_pct,0))/100) owner_share FROM quotations
                   WHERE financial_status='confirmed' AND status='completed' AND NOT is_test GROUP BY partner_id) r ON r.partner_id=p.id
       LEFT JOIN (SELECT partner_id, SUM(amount) FILTER (WHERE direction='received_from_partner') received, SUM(amount) FILTER (WHERE direction='paid_to_partner') paid_out FROM partner_settlements GROUP BY partner_id) s ON s.partner_id=p.id
      WHERE p.kind='main' AND p.is_active AND (COALESCE(r.owner_share,0)-COALESCE(s.received,0)+COALESCE(s.paid_out,0)) <> 0 ORDER BY 2 DESC`);

  const lossRides = await q<{ id: string; ref: string; customer: string; trip_date: string; loss: number }>(
    `SELECT id::text, quote_reference ref, customer_name customer, trip_date::text, (driver_cost+extra_cost-COALESCE(actual_amount_paid,0))::float loss FROM quotations
      WHERE NOT is_test AND status='completed' AND financial_status='confirmed' AND COALESCE(actual_amount_paid,0)-driver_cost-extra_cost < 0 ORDER BY trip_date DESC`);

  return { today, rate: pkrRate, todayRides, tomorrowRides, upcomingRides, openQuotesUpcoming, month, all, alerts, leads: leads.slice(0, 8), leadsTotal7d, owed, lossRides };
}
