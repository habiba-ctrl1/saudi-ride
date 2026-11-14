import { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, Clock, MapPin, Users as UsersIcon } from "lucide-react";
import { listScheduleQuotations, listOutstandingPayments, type QuotationRow, type QuotationStatus } from "@/lib/supabase/quotations";

export const metadata: Metadata = {
  title: "Schedule | Admin Dashboard",
};

export const dynamic = "force-dynamic";

const STATUS_COLOR: Record<QuotationStatus, string> = {
  new: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  quoted: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  confirmed: "bg-green-500/10 text-green-500 border-green-500/20",
  assigned: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  completed: "bg-[#C9A84C]/10 text-[#C9A84C] border-[#C9A84C]/20",
  cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
};

// Riyadh (UTC+3) date string — trip dates are booked in local KSA time
// regardless of where this server process runs. Mirrors the helper in
// admin/quotations/page.tsx.
function riyadhDate(offsetDays = 0): Date {
  return new Date(Date.now() + 3 * 60 * 60 * 1000 + offsetDays * 24 * 60 * 60 * 1000);
}
function toDateString(d: Date): string {
  return d.toISOString().slice(0, 10);
}
function endOfMonth(d: Date, monthsAhead = 0): string {
  const y = d.getUTCFullYear();
  const m = d.getUTCMonth() + monthsAhead;
  return toDateString(new Date(Date.UTC(y, m + 1, 0)));
}

type Bucket = { key: string; label: string; rows: QuotationRow[] };

export default async function AdminSchedulePage() {
  const today = riyadhDate(0);
  const todayStr = toDateString(today);
  const tomorrowStr = toDateString(riyadhDate(1));
  const endOfWeekStr = toDateString(riyadhDate(6));
  const endOfMonthStr = endOfMonth(today, 0);
  const endOfNextMonthStr = endOfMonth(today, 1);

  const farFutureStr = toDateString(riyadhDate(365));
  const [{ rows, error }, { rows: owed, error: owedError }] = await Promise.all([
    listScheduleQuotations(todayStr, farFutureStr),
    listOutstandingPayments(),
  ]);

  const buckets: Bucket[] = [
    { key: "today", label: "Today", rows: [] },
    { key: "tomorrow", label: "Tomorrow", rows: [] },
    { key: "week", label: "Rest of This Week", rows: [] },
    { key: "month", label: "Rest of This Month", rows: [] },
    { key: "next_month", label: "Next Month", rows: [] },
    { key: "later", label: "Later", rows: [] },
  ];
  for (const q of rows) {
    if (q.trip_date === todayStr) buckets[0].rows.push(q);
    else if (q.trip_date === tomorrowStr) buckets[1].rows.push(q);
    else if (q.trip_date <= endOfWeekStr) buckets[2].rows.push(q);
    else if (q.trip_date <= endOfMonthStr) buckets[3].rows.push(q);
    else if (q.trip_date <= endOfNextMonthStr) buckets[4].rows.push(q);
    else buckets[5].rows.push(q);
  }
  // "Later" is often sparse/far apart — no need to show an empty-state card
  // for it the way today/tomorrow/this-week always do.
  const visibleBuckets = buckets.filter((b) => b.key !== "later" || b.rows.length > 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold text-[#F5F0E8]">Ride Schedule</h1>
        <p className="mt-1 text-sm text-[#A1A1A6]">Every upcoming ride, grouped by when it&apos;s happening — today through next month.</p>
      </div>

      {owed.length > 0 && (
        <section className="rounded-2xl border border-red-500/30 bg-red-500/5 p-5">
          <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-red-400">
            <AlertTriangle className="h-4 w-4" /> Needs Attention — Completed but Unpaid
          </div>
          <div className="mt-3 grid gap-2">
            {owed.map((q) => (
              <RideRow key={q.id} q={q} highlight="red" />
            ))}
          </div>
        </section>
      )}
      {owedError && <p className="text-sm text-red-400">Could not load outstanding payments: {owedError}</p>}

      {error && (
        <p className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
          Could not load schedule: {error}
        </p>
      )}

      {visibleBuckets.map((bucket) => (
        <section key={bucket.key}>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-[#A1A1A6]">
            {bucket.label} <span className="ml-1 text-[#555]">({bucket.rows.length})</span>
          </h2>
          {bucket.rows.length === 0 ? (
            <p className="rounded-xl border border-[#222] bg-[#111]/50 px-4 py-4 text-center text-xs text-[#555]">
              Nothing scheduled.
            </p>
          ) : (
            <div className="grid gap-2">
              {bucket.rows.map((q) => (
                <RideRow key={q.id} q={q} />
              ))}
            </div>
          )}
        </section>
      ))}
    </div>
  );
}

function RideRow({ q, highlight }: { q: QuotationRow; highlight?: "red" }) {
  return (
    <Link
      href={`/admin/quotations?search=${encodeURIComponent(q.quote_reference)}`}
      className={`flex flex-wrap items-center gap-x-4 gap-y-1.5 rounded-xl border p-3.5 text-sm transition hover:border-[#C9A84C]/40 ${
        highlight === "red" ? "border-red-500/20 bg-[#111]" : "border-[#222] bg-[#111]"
      }`}
    >
      <span className="font-mono text-xs font-bold text-[#C9A84C]">{q.quote_reference}</span>
      <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase ${STATUS_COLOR[q.status]}`}>
        {q.status}
      </span>
      <span className="font-semibold text-[#F5F0E8]">{q.customer_name}</span>
      <span className="flex items-center gap-1 text-xs text-[#A1A1A6]">
        <Clock className="h-3 w-3" /> {q.trip_date}{q.trip_time ? ` — ${q.trip_time.slice(0, 5)}` : ""}
      </span>
      <span className="flex items-center gap-1 truncate text-xs text-[#A1A1A6]">
        <MapPin className="h-3 w-3 shrink-0" /> {q.pickup_location} → {q.drop_location}
      </span>
      {q.passengers_count ? (
        <span className="flex items-center gap-1 text-xs text-[#A1A1A6]">
          <UsersIcon className="h-3 w-3" /> {q.passengers_count}
        </span>
      ) : null}
      {highlight === "red" && q.quoted_price ? (
        <span className="ml-auto text-xs font-bold text-red-400">SAR {q.quoted_price.toFixed(2)} owed</span>
      ) : null}
    </Link>
  );
}
