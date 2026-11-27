import { Metadata } from "next";
import { listBookings, listDriversForFilter, VIEWS, type ListFilters, type View } from "@/lib/ops/list";
import { listAssignable } from "@/lib/ops/drivers";
import { getPkrRate } from "@/lib/ops/money";
import { BookingsTable } from "./BookingsTable";

export const metadata: Metadata = { title: "Quotes & Bookings | Admin Dashboard" };
export const dynamic = "force-dynamic";

export default async function AdminQuotationsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const view = VIEWS.includes(sp.view as View) ? (sp.view as View) : "all";
  const filters: ListFilters = {
    q: sp.q, view, vehicle: sp.vehicle, driver: sp.driver, from: sp.from, to: sp.to, preset: sp.preset,
    sort: (["date_desc", "date_asc", "created", "margin"] as const).find((s) => s === sp.sort),
    page: sp.page ? Math.max(1, Number(sp.page) || 1) : 1,
  };
  const [{ rows, total, counts }, filterDrivers, assignable, rate] = await Promise.all([listBookings(filters), listDriversForFilter(), listAssignable(), getPkrRate()]);
  const today = new Date(Date.now() + 3 * 3600 * 1000).toISOString().slice(0, 10); // Riyadh date

  return <BookingsTable rows={rows} total={total} counts={counts} view={view} filters={filters} filterDrivers={filterDrivers} assignable={assignable} pkrRate={rate} today={today} />;
}
