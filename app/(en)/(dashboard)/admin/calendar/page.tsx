import { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getCalendarMonth, type CalEntry } from "@/lib/ops/calendar";

export const metadata: Metadata = { title: "Calendar | Admin Dashboard" };
export const dynamic = "force-dynamic";

const ksaToday = () => new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Riyadh" });
const STATUS_CLS: Record<string, string> = {
  confirmed: "border-sky-200 bg-sky-50 text-sky-800", assigned: "border-sky-200 bg-sky-50 text-sky-800", completed: "border-emerald-200 bg-emerald-50 text-emerald-800",
  quoted: "border-slate-200 bg-slate-50 text-slate-600", new: "border-slate-200 bg-slate-50 text-slate-600",
};
const isOpenRide = (e: CalEntry) => e.status === "confirmed" || e.status === "assigned";

function Chip({ e }: { e: CalEntry }) {
  const noDriver = !e.driver && isOpenRide(e);
  return (
    <Link href={`/admin/quotations/${e.id}`} className={`block rounded-lg border px-2 py-1.5 text-xs leading-tight hover:shadow-sm ${STATUS_CLS[e.status] ?? "border-slate-200 bg-white text-slate-600"}`}>
      <span className="font-bold">{e.kind === "return" ? "↩ return" : (e.time?.slice(0, 5) ?? "—")}</span> {e.customer.split(" ")[0]}
      <span className="block truncate opacity-70">{e.pickup} → {e.drop}</span>
      {e.driver && <span className="block truncate font-medium opacity-80">Driver: {e.driver}</span>}
      {noDriver && <span className="font-bold text-rose-600">Needs a driver</span>}
      {e.open_review && <span className="ml-1 font-bold text-amber-600">Needs review</span>}
    </Link>
  );
}

export default async function CalendarPage({ searchParams }: { searchParams: Promise<{ m?: string; quotes?: string }> }) {
  const sp = await searchParams;
  const today = ksaToday();
  const monthKey = sp.m && /^\d{4}-(0[1-9]|1[0-2])$/.test(sp.m) ? sp.m : today.slice(0, 7);
  const includeQuotes = sp.quotes === "1";
  const entries = await getCalendarMonth(monthKey, includeQuotes);
  const [y, m] = monthKey.split("-").map(Number);
  const daysInMonth = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const lead = (new Date(Date.UTC(y, m - 1, 1)).getUTCDay() + 6) % 7; // Monday-first
  const shift = (d: number) => { const t = new Date(Date.UTC(y, m - 1 + d, 1)); return `${t.getUTCFullYear()}-${String(t.getUTCMonth() + 1).padStart(2, "0")}`; };
  const q = includeQuotes ? "&quotes=1" : "";
  const byDay = new Map<string, CalEntry[]>();
  for (const e of entries) byDay.set(e.date, [...(byDay.get(e.date) ?? []), e]);
  const title = new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });
  const nav = "inline-flex h-10 items-center rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600 hover:border-emerald-300 hover:text-emerald-700";

  const rides = entries.filter((e) => e.kind !== "return");
  const completed = rides.filter((e) => e.status === "completed").length;
  const upcoming = rides.filter((e) => isOpenRide(e) && e.date >= today).length;
  const noDriver = rides.filter((e) => !e.driver && isOpenRide(e) && e.date >= today).length;

  return (
    <div className="mx-auto max-w-7xl space-y-5 pb-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Calendar</h1>
          <p className="text-sm text-slate-500">All rides in {title}. Tap a ride to open it. Cancelled and test records are hidden.{!includeQuotes && " Unconfirmed quotes are hidden."}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link className={nav} href={`/admin/calendar?m=${shift(-1)}${q}`} aria-label="Previous month"><ChevronLeft className="h-4 w-4" /></Link>
          <span className="min-w-[9rem] text-center text-base font-bold text-slate-900">{title}</span>
          <Link className={nav} href={`/admin/calendar?m=${shift(1)}${q}`} aria-label="Next month"><ChevronRight className="h-4 w-4" /></Link>
          <Link className={nav} href={`/admin/calendar${q ? "?quotes=1" : ""}`}>Today</Link>
          <Link className={nav} href={`/admin/calendar?m=${monthKey}${includeQuotes ? "" : "&quotes=1"}`}>{includeQuotes ? "Hide quotes" : "Show quotes"}</Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          ["Rides this month", rides.length, "text-slate-900"],
          ["Completed", completed, "text-emerald-700"],
          ["Still to come", upcoming, "text-sky-700"],
          ["Still to come, no driver", noDriver, noDriver ? "text-rose-600" : "text-slate-900"],
        ].map(([k, v, c]) => (
          <div key={k as string} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <div className={`text-2xl font-bold ${c}`}>{v}</div>
            <div className="text-sm text-slate-500">{k}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-4 text-sm text-slate-600">
        <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded border border-sky-200 bg-sky-50" /> Confirmed</span>
        <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded border border-emerald-200 bg-emerald-50" /> Completed</span>
        {includeQuotes && <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded border border-slate-200 bg-slate-50" /> Quote not confirmed yet</span>}
        <span className="inline-flex items-center gap-2 font-medium text-rose-600">Needs a driver = confirmed ride with nobody assigned</span>
      </div>

      {/* Desktop: month grid */}
      <div className="hidden md:block">
        <div className="grid grid-cols-7 gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 shadow-sm">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => <div key={d} className="bg-slate-50 p-2 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">{d}</div>)}
          {Array.from({ length: lead }).map((_, i) => <div key={`l${i}`} className="min-h-[110px] bg-slate-50" />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = `${monthKey}-${String(i + 1).padStart(2, "0")}`;
            const list = byDay.get(day) ?? [];
            return (
              <div key={day} className={`min-h-[110px] min-w-0 space-y-1 p-1.5 ${day === today ? "bg-emerald-50" : "bg-white"}`}>
                <div className={`text-sm font-semibold ${day === today ? "text-emerald-700" : "text-slate-400"}`}>{i + 1}{day === today ? " · today" : ""}</div>
                {list.map((e) => <Chip key={e.id + e.kind} e={e} />)}
              </div>
            );
          })}
          {Array.from({ length: (7 - ((lead + daysInMonth) % 7)) % 7 }).map((_, i) => <div key={`t${i}`} className="min-h-[110px] bg-slate-50" />)}
        </div>
      </div>

      {/* Mobile: agenda list */}
      <div className="space-y-3 md:hidden">
        {entries.length === 0 && <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">No rides this month.</div>}
        {[...byDay.entries()].map(([day, list]) => (
          <div key={day} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className={`mb-2 text-sm font-semibold ${day === today ? "text-emerald-700" : "text-slate-900"}`}>{new Date(`${day}T00:00:00Z`).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "short", timeZone: "UTC" })}{day === today ? " · today" : ""}</div>
            <div className="space-y-1.5">{list.map((e) => <Chip key={e.id + e.kind} e={e} />)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
