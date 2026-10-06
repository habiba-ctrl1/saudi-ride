// Quotes & Bookings list: server-side search + filters + counts. One table = enquiry → quote → booking → ride.
import { prisma } from "@/lib/prisma";
import { VIEWS, VIEW_LABEL, PAGE_SIZE, type View, type ListFilters, type ListRow } from "@/lib/ops/list-shared";

export { VIEWS, VIEW_LABEL, PAGE_SIZE };
export type { View, ListFilters, ListRow };

const TODAY = `(now() AT TIME ZONE 'Asia/Riyadh')::date`;

const VIEW_SQL: Record<View, string> = {
  all: "TRUE",
  enquiries: "(status='new' OR quote_stage='draft') AND status NOT IN ('completed','cancelled')",
  quotes: "status IN ('new','quoted') AND quote_stage NOT IN ('rejected','expired')",
  confirmed: "status IN ('confirmed','assigned')",
  upcoming: `status IN ('confirmed','assigned') AND trip_date >= ${TODAY}`,
  completed: "status='completed'",
  cancelled: "status='cancelled'",
  lost: "(quote_stage IN ('rejected','expired') OR status='cancelled')",
  paid: "payment_status='paid'",
  unpaid: "payment_status<>'paid' AND status<>'cancelled' AND NOT (actual_amount_paid = 0 AND financial_status='confirmed')",
  profitable: "driver_cost IS NOT NULL AND COALESCE(actual_amount_paid,0)-driver_cost-extra_cost > 0",
  loss: "driver_cost IS NOT NULL AND COALESCE(actual_amount_paid,0)-driver_cost-extra_cost < 0",
  needcost: "status='completed' AND financial_status<>'confirmed'",
};

const SORT_SQL = {
  date_desc: "trip_date DESC, trip_time DESC NULLS LAST",
  date_asc: "trip_date ASC, trip_time ASC NULLS LAST",
  created: "created_at DESC",
  margin: "margin ASC NULLS LAST",
} as const;

export async function listBookings(f: ListFilters): Promise<{ rows: ListRow[]; total: number; counts: Record<View, number> }> {
  const where: string[] = ["NOT is_test"];
  const p: unknown[] = [];
  const add = (v: unknown) => { p.push(v); return `$${p.length}`; };

  const view = f.view && VIEWS.includes(f.view) ? f.view : "all";
  where.push(`(${VIEW_SQL[view]})`);

  const q = f.q?.trim();
  if (q) {
    const like = add(`%${q}%`);
    const digits = q.replace(/[^0-9]/g, "");
    const parts = [
      `customer_name ILIKE ${like}`, `customer_phone ILIKE ${like}`, `customer_email ILIKE ${like}`, `quote_reference ILIKE ${like}`,
      `pickup_location ILIKE ${like}`, `drop_location ILIKE ${like}`, `driver_name ILIKE ${like}`, `(pickup_location || ' ' || drop_location) ILIKE ${like}`,
    ];
    if (digits.length >= 4) parts.push(`regexp_replace(customer_phone,'[^0-9]','','g') LIKE ${add(`%${digits}%`)}`);
    if (/^\d{4}-\d{2}-\d{2}$/.test(q)) parts.push(`trip_date = ${add(q)}::date`);
    where.push(`(${parts.join(" OR ")})`);
  }
  if (f.vehicle && ["sedan", "suv", "van", "bus", "limousine"].includes(f.vehicle)) where.push(`vehicle_type_requested::text = ${add(f.vehicle)}`);
  if (f.driver && /^[0-9a-f-]{36}$/i.test(f.driver)) where.push(`partner_id = ${add(f.driver)}::uuid`);
  let from = f.from, to = f.to;
  if (f.preset === "today") { where.push(`trip_date = ${TODAY}`); from = to = undefined; }
  else if (f.preset === "tomorrow") { where.push(`trip_date = ${TODAY} + 1`); from = to = undefined; }
  else if (f.preset === "week") { where.push(`trip_date BETWEEN ${TODAY} AND ${TODAY} + 6`); from = to = undefined; }
  if (from && /^\d{4}-\d{2}-\d{2}$/.test(from)) where.push(`trip_date >= ${add(from)}::date`);
  if (to && /^\d{4}-\d{2}-\d{2}$/.test(to)) where.push(`trip_date <= ${add(to)}::date`);

  const page = Math.max(1, f.page ?? 1);
  const sort = SORT_SQL[f.sort ?? (view === "upcoming" || view === "quotes" ? "date_asc" : "date_desc")];
  const w = where.join(" AND ");

  const rows = await prisma.$queryRawUnsafe<ListRow[]>(
    `SELECT x.id::text, quote_reference, customer_name, customer_phone, customer_email, client_id::text, pickup_location, drop_location, trip_date::text, trip_time::text,
         vehicle_type_requested::text vehicle, status::text, quote_stage, valid_until::text, sent_at::text, followup_at::text, quoted_price::float, actual_amount_paid::float,
         payment_status::text, driver_cost::float, extra_cost::float, financial_status, COALESCE(driver_name, (SELECT full_name FROM drivers d WHERE d.id=assigned_driver_id)) driver_name,
         partner_id::text, is_test,
         CASE WHEN driver_cost IS NOT NULL THEN (COALESCE(actual_amount_paid,0)-driver_cost-extra_cost)::float END margin,
         (EXISTS (SELECT 1 FROM documents d WHERE d.quotation_id=x.id AND d.kind='receipt') OR receipt_sent_at IS NOT NULL) has_receipt,
         EXISTS (SELECT 1 FROM communication_log l WHERE l.quotation_id=x.id AND l.template='pickup' AND l.status='sent') pickup_sent
       FROM quotations x WHERE ${w} ORDER BY ${sort} LIMIT ${PAGE_SIZE} OFFSET ${(page - 1) * PAGE_SIZE}`,
    ...p,
  );
  const total = (await prisma.$queryRawUnsafe<{ n: number }[]>(`SELECT count(*)::int n FROM quotations x WHERE ${w}`, ...p))[0].n;

  const c = await prisma.$queryRawUnsafe<Record<string, number>[]>(
    `SELECT ${VIEWS.map((v) => `count(*) FILTER (WHERE ${VIEW_SQL[v]})::int "${v}"`).join(", ")} FROM quotations WHERE NOT is_test`);
  return { rows, total, counts: c[0] as Record<View, number> };
}

export async function listDriversForFilter() {
  return prisma.$queryRawUnsafe<{ id: string; name: string; kind: string }[]>(`SELECT id::text, name, kind FROM partners WHERE is_active ORDER BY kind, name`);
}
