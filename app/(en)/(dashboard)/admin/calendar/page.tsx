import { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getCalendarMonth, type CalEntry } from "@/lib/ops/calendar";

export const metadata: Metadata = { title: "Calendar | Admin Dashboard" };
export const dynamic = "force-dynamic";

const ksaToday = () => new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Riyadh" });
const STATUS_CLS: Record<string, string> = {
  confirmed: "border-blue-500/40 text-blue-300", assigned: "border-blue-500/40 text-blue-300", completed: "border-green-500/40 text-green-400",
  quoted: "border-[#444] text-[#A1A1A6]", new: "border-[#444] text-[#A1A1A6]",
};

function Chip({ e }: { e: CalEntry }) {
  const noDriver = !e.driver && (e.status === "confirmed" || e.status === "assigned");
  return (
    <Link href={`/admin/quotations/${e.id}`} className={`block rounded border px-1.5 py-1 text-[0.65rem] leading-tight hover:bg-white/5 ${STATUS_CLS[e.status] ?? "border-[#444]"}`}>
      <span className="font-bold">{e.kind === "return" ? "↩ return" : (e.time?.slice(0, 5) ?? "—")}</span> {e.customer.split(" ")[0]}
      <span className="block truncate opacity-70">{e.pickup} → {e.drop}</span>
      {noDriver && <span className="font-bold text-red-400">no driver</span>}
      {e.open_review && <span className="ml-1 font-bold text-orange-400">review</span>}
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
  const nav = "inline-flex items-center rounded-lg border border-[#333] px-3 py-1.5 text-xs font-bold text-[#A1A1A6] hover:text-[#F5F0E8]";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#F5F0E8]">Calendar</h1>
          <p className="text-xs text-[#7C8088]">{entries.length} ride date{entries.length === 1 ? "" : "s"} in {title}. Cancelled and test records are hidden.{!includeQuotes && " Unconfirmed quotes are hidden."}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link className={nav} href={`/admin/calendar?m=${shift(-1)}${q}`} aria-label="Previous month"><ChevronLeft className="h-4 w-4" /></Link>
          <span className="min-w-[8rem] text-center text-sm font-bold text-[#F5F0E8]">{title}</span>
          <Link className={nav} href={`/admin/calendar?m=${shift(1)}${q}`} aria-label="Next month"><ChevronRight className="h-4 w-4" /></Link>
          <Link className={nav} href={`/admin/calendar${q ? "?quotes=1" : ""}`}>Today</Link>
          <Link className={nav} href={`/admin/calendar?m=${monthKey}${includeQuotes ? "" : "&quotes=1"}`}>{includeQuotes ? "Hide quotes" : "Show quotes"}</Link>
        </div>
      </div>

      {/* Desktop: month grid */}
      <div className="hidden md:block">
        <div className="grid grid-cols-7 gap-px overflow-hidden rounded-2xl border border-[#333] bg-[#222]">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => <div key={d} className="bg-[#1A1A1A] p-2 text-center text-[0.6rem] font-bold uppercase tracking-widest text-[#7C8088]">{d}</div>)}
          {Array.from({ length: lead }).map((_, i) => <div key={`l${i}`} className="min-h-[96px] bg-[#1A1A1A]" />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = `${monthKey}-${String(i + 1).padStart(2, "0")}`;
            const list = byDay.get(day) ?? [];
            return (
              <div key={day} className={`min-h-[96px] space-y-1 p-1.5 ${day === today ? "bg-[#C9A84C]/10" : "bg-[#111]"}`}>
                <div className={`text-[0.65rem] font-bold ${day === today ? "text-[#C9A84C]" : "text-[#7C8088]"}`}>{i + 1}</div>
                {list.map((e) => <Chip key={e.id + e.kind} e={e} />)}
              </div>
            );
          })}
          {Array.from({ length: (7 - ((lead + daysInMonth) % 7)) % 7 }).map((_, i) => <div key={`t${i}`} className="min-h-[96px] bg-[#1A1A1A]" />)}
        </div>
      </div>

      {/* Mobile: agenda list */}
      <div className="space-y-3 md:hidden">
        {entries.length === 0 && <div className="rounded-2xl border border-[#333] bg-[#111] p-6 text-center text-sm text-[#A1A1A6]">No rides this month.</div>}
        {[...byDay.entries()].map(([day, list]) => (
          <div key={day} className="rounded-2xl border border-[#333] bg-[#111] p-3">
            <div className={`mb-2 text-xs font-bold ${day === today ? "text-[#C9A84C]" : "text-[#F5F0E8]"}`}>{new Date(`${day}T00:00:00Z`).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "short", timeZone: "UTC" })}{day === today ? " · today" : ""}</div>
            <div className="space-y-1.5">{list.map((e) => <Chip key={e.id + e.kind} e={e} />)}</div>
          </div>
        ))}
      </div>

      <p className="text-[0.65rem] text-[#7C8088]">Blue = confirmed / driver assigned · green = completed{includeQuotes ? " · grey = quote not yet confirmed" : ""}. “no driver” = a confirmed ride with no driver assigned.</p>
    </div>
  );
}
