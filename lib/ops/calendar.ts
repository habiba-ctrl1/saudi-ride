// Calendar data: one entry per ride date. Round trips also appear on their return date. Dates are KSA calendar dates as stored.
import { prisma } from "@/lib/prisma";

export type CalEntry = {
  id: string; ref: string; customer: string; status: string; stage: string | null; date: string; kind: "trip" | "return";
  time: string | null; pickup: string; drop: string; vehicle: string | null; driver: string | null; paid: string; open_review: boolean;
};

export const ymd = (d: Date) => `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;

/** monthKey = "YYYY-MM". includeQuotes=false shows only real bookings (confirmed / assigned / completed). */
export async function getCalendarMonth(monthKey: string, includeQuotes: boolean): Promise<CalEntry[]> {
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(monthKey)) throw new Error("Invalid month");
  const first = `${monthKey}-01`;
  const statuses = includeQuotes ? "('new','quoted','confirmed','assigned','completed')" : "('confirmed','assigned','completed')";
  const rows = await prisma.$queryRawUnsafe<(Omit<CalEntry, "kind"> & { return_date: string | null })[]>(
    `SELECT q.id::text, q.quote_reference ref, q.customer_name customer, q.status::text status, q.quote_stage stage, q.trip_date::text date, q.return_date::text return_date,
            q.trip_time::text "time", q.pickup_location pickup, q.drop_location "drop", q.vehicle_type_requested::text vehicle,
            COALESCE(q.driver_name, pt.name) driver, q.payment_status::text paid,
            EXISTS (SELECT 1 FROM review_flags f WHERE f.quotation_id=q.id AND f.status='open') open_review
       FROM quotations q LEFT JOIN partners pt ON pt.id = q.partner_id
      WHERE NOT q.is_test AND q.status::text IN ${statuses}
        AND ((q.trip_date >= $1::date AND q.trip_date < ($1::date + interval '1 month'))
          OR (q.return_date IS NOT NULL AND q.return_date >= $1::date AND q.return_date < ($1::date + interval '1 month')))
      ORDER BY q.trip_date, q.trip_time NULLS LAST`, first);
  const inMonth = (d: string) => d.startsWith(monthKey);
  const out: CalEntry[] = [];
  for (const r of rows) {
    const { return_date, ...rest } = r;
    if (inMonth(r.date)) out.push({ ...rest, kind: "trip" });
    if (return_date && return_date !== r.date && inMonth(return_date)) out.push({ ...rest, date: return_date, time: null, kind: "return" });
  }
  return out.sort((a, b) => a.date.localeCompare(b.date) || (a.time ?? "99").localeCompare(b.time ?? "99"));
}
