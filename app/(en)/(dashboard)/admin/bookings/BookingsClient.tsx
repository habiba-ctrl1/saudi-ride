"use client";

import { Fragment, useRef, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  CalendarClock, Loader2, ChevronLeft, ChevronRight, Search, AlertTriangle,
  FileText, Download, FlaskConical, Trash2, ChevronDown, TrendingUp,
  DollarSign, Zap, Clock, Siren,
} from "lucide-react";
import { NewBookingForm } from "./NewBookingForm";

type BookingStatus =
  | "PENDING" | "CONFIRMED" | "DRIVER_ASSIGNED" | "IN_PROGRESS"
  | "COMPLETED" | "CANCELLED" | "REFUNDED";

export type BookingRow = {
  id: string;
  bookingRef: string;
  status: BookingStatus;
  pickupLocation: string;
  dropoffLocation: string;
  pickupDateTime: string;
  passengers: number;
  totalPrice: number;
  currency: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  notes: string | null;
  driverName: string | null;
  driverPhone: string | null;
  vehicleName: string;
  createdAt: string;
  isTest: boolean;
  quotationId: string | null;
  quotationRef: string | null;
  isUrgent: boolean;
};

type UrgentBooking = {
  id: string;
  bookingRef: string;
  customerName: string;
  customerPhone: string;
  pickupDateTime: string;
};

type Vehicle = { id: string; name: string; type: string };

const STATUS_COLOR: Record<BookingStatus, string> = {
  PENDING: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  CONFIRMED: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  DRIVER_ASSIGNED: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  IN_PROGRESS: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  COMPLETED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  CANCELLED: "bg-red-500/10 text-red-500 border-red-500/20",
  REFUNDED: "bg-red-500/10 text-red-500 border-red-500/20",
};
const ALL_STATUSES: BookingStatus[] = [
  "PENDING", "CONFIRMED", "DRIVER_ASSIGNED", "IN_PROGRESS", "COMPLETED", "CANCELLED", "REFUNDED",
];

const STAGE_TABS: Array<{ key: string; label: string }> = [
  { key: "all", label: "All Bookings" },
  { key: "pending", label: "Pending" },
  { key: "quote_sent", label: "Quote Sent" },
  { key: "confirmed", label: "Confirmed" },
  { key: "in_progress", label: "In Progress" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

function StatCard({ icon: Icon, label, value, sub }: { icon: typeof TrendingUp; label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-2xl border border-[#C9A84C]/10 bg-[#111] p-4 flex items-center gap-3">
      <div className="rounded-xl bg-[#C9A84C]/10 p-2.5 shrink-0">
        <Icon className="h-5 w-5 text-[#C9A84C]" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-wide text-[#7C8088]">{label}</p>
        <p className="text-xl font-bold text-[#F5F0E8] truncate">{value}</p>
        {sub && <p className="text-[10px] text-[#7C8088] truncate">{sub}</p>}
      </div>
    </div>
  );
}

export function BookingsClient({
  bookings,
  total,
  page,
  limit,
  vehicles,
  stats,
  stageCounts,
  urgentBookings,
}: {
  bookings: BookingRow[];
  total: number;
  page: number;
  limit: number;
  vehicles: Vehicle[];
  stats: { totalAllTime: number; todayRevenue: number; activeJobsToday: number };
  stageCounts: Record<string, number>;
  urgentBookings: UrgentBooking[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [priceDraft, setPriceDraft] = useState<Record<string, string>>({});
  const [driverNameDraft, setDriverNameDraft] = useState<Record<string, string>>({});
  const [driverPhoneDraft, setDriverPhoneDraft] = useState<Record<string, string>>({});
  const [notesDraft, setNotesDraft] = useState<Record<string, string>>({});
  const [rowError, setRowError] = useState<Record<string, string>>({});
  const [quotation, setQuotation] = useState<Record<string, { id: string; ref: string }>>({});
  const [searchDraft, setSearchDraft] = useState(searchParams.get("search") ?? "");
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const activeStage = searchParams.get("stage") ?? "all";

  function setParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    if (key !== "page") params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  async function patch(id: string, payload: Record<string, unknown>) {
    setBusyId(id);
    setRowError((prev) => ({ ...prev, [id]: "" }));
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setRowError((prev) => ({ ...prev, [id]: data.error || "Update failed" }));
        return;
      }
      router.refresh();
    } catch {
      setRowError((prev) => ({ ...prev, [id]: "Network error" }));
    } finally {
      setBusyId(null);
    }
  }

  async function generateQuotation(id: string) {
    setBusyId(id);
    setRowError((prev) => ({ ...prev, [id]: "" }));
    try {
      const res = await fetch(`/api/admin/bookings/${id}/quotation`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setRowError((prev) => ({ ...prev, [id]: data.error || "Could not generate quotation" }));
        return;
      }
      setQuotation((prev) => ({ ...prev, [id]: { id: data.quotationId, ref: data.quotationRef } }));
      router.refresh();
    } catch {
      setRowError((prev) => ({ ...prev, [id]: "Network error" }));
    } finally {
      setBusyId(null);
    }
  }

  async function deleteTestBooking(id: string, ref: string) {
    if (!confirm(`Delete TEST booking ${ref}? This cannot be undone.`)) return;
    setBusyId(id);
    setRowError((prev) => ({ ...prev, [id]: "" }));
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        setRowError((prev) => ({ ...prev, [id]: data.error || "Delete failed" }));
        return;
      }
      router.refresh();
    } catch {
      setRowError((prev) => ({ ...prev, [id]: "Network error" }));
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <CalendarClock className="h-6 w-6 text-[#C9A84C]" />
          <div>
            <h1 className="text-xl font-bold text-[#F5F0E8]">Bookings</h1>
            <p className="text-xs text-[#7C8088] mt-0.5">Monitor and process every transport reservation.</p>
          </div>
        </div>
        <NewBookingForm vehicles={vehicles} />
      </div>

      {/* ─── URGENT BANNER ──────────────────────────────────────────── */}
      {urgentBookings.length > 0 && (
        <div className="rounded-2xl border-2 border-red-500/50 bg-red-950/30 p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Siren className="h-5 w-5 text-red-400 animate-pulse" />
            <h2 className="text-sm font-bold uppercase tracking-wide text-red-400">
              {urgentBookings.length} booking{urgentBookings.length === 1 ? "" : "s"} need{urgentBookings.length === 1 ? "s" : ""} attention now
            </h2>
          </div>
          <p className="text-xs text-red-300/80">
            No price set, and pickup is within 24 hours or already passed. These are also re-alerted by email/WhatsApp automatically.
          </p>
          <div className="space-y-1.5">
            {urgentBookings.map((u) => {
              const overdue = new Date(u.pickupDateTime).getTime() < Date.now();
              return (
                <div key={u.id} className="flex items-center justify-between gap-3 rounded-lg bg-black/30 px-3 py-2 text-xs flex-wrap">
                  <div>
                    <span className="font-mono font-bold text-red-300">{u.bookingRef}</span>
                    <span className="text-[#F5F0E8] ml-2">{u.customerName}</span>
                    <span className={`ml-2 font-bold ${overdue ? "text-red-400" : "text-amber-400"}`}>
                      {overdue ? "OVERDUE" : "soon"} — {new Date(u.pickupDateTime).toLocaleString()}
                    </span>
                  </div>
                  <a
                    href={`https://wa.me/${u.customerPhone.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-[#C9A84C] hover:underline"
                  >
                    WhatsApp {u.customerPhone}
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── STAT CARDS ─────────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={TrendingUp} label="Total Bookings" value={String(stats.totalAllTime)} />
        <StatCard icon={DollarSign} label="Today's Paid Revenue" value={`SAR ${stats.todayRevenue.toLocaleString()}`} sub="Cash-on-arrival — most trips settle later" />
        <StatCard icon={Zap} label="Active Jobs Today" value={String(stats.activeJobsToday)} sub="Assigned or in progress" />
        <StatCard icon={Clock} label="Needs a Price" value={String(stageCounts.pending ?? 0)} sub="Waiting on WhatsApp confirmation" />
      </div>

      {/* ─── STAGE TABS ─────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-[#333] bg-[#111] p-4 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#666]" />
            <input
              value={searchDraft}
              onChange={(e) => {
                const value = e.target.value;
                setSearchDraft(value);
                if (searchTimer.current) clearTimeout(searchTimer.current);
                searchTimer.current = setTimeout(() => setParam("search", value || null), 400);
              }}
              placeholder="Search name / phone / ref…"
              className="w-56 rounded-lg border border-[#333] bg-black/40 py-2 pl-8 pr-3 text-xs text-[#F5F0E8] outline-none focus:border-[#C9A84C]"
            />
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {STAGE_TABS.map((f) => (
            <button
              key={f.key}
              onClick={() => setParam("stage", f.key === "all" ? null : f.key)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                activeStage === f.key
                  ? "border-[#C9A84C] bg-[#C9A84C]/10 text-[#C9A84C]"
                  : "border-[#333] text-[#A1A1A6] hover:border-[#C9A84C]/40"
              }`}
            >
              {f.label} <span className="opacity-60">({stageCounts[f.key] ?? 0})</span>
            </button>
          ))}
        </div>
      </div>

      {/* ─── TABLE ──────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-[#C9A84C]/10 bg-[#111] overflow-hidden">
        {bookings.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-[#A1A1A6]">No bookings match these filters.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#1A1A1A] border-b border-[#C9A84C]/10 text-[0.65rem] uppercase tracking-widest text-[#7C8088]">
                  <th className="p-4 font-bold">Booking</th>
                  <th className="p-4 font-bold">Customer</th>
                  <th className="p-4 font-bold">Trip</th>
                  <th className="p-4 font-bold">Vehicle</th>
                  <th className="p-4 font-bold">Date &amp; Time</th>
                  <th className="p-4 font-bold">Price</th>
                  <th className="p-4 font-bold">Status</th>
                  <th className="p-4 font-bold text-right">Manage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#C9A84C]/5">
                {bookings.map((b) => {
                  const busy = busyId === b.id;
                  const waPhone = b.customerPhone.replace(/[^0-9]/g, "");
                  const flagged = b.notes?.includes("SYSTEM FLAG");
                  const priceSet = b.totalPrice > 0;
                  const expanded = expandedId === b.id;
                  const q = quotation[b.id] ?? (b.quotationId && b.quotationRef ? { id: b.quotationId, ref: b.quotationRef } : null);

                  return (
                    <Fragment key={b.id}>
                      <tr
                        onClick={() => setExpandedId(expanded ? null : b.id)}
                        className={`cursor-pointer hover:bg-[#1A1A1A]/50 transition-colors ${b.isTest ? "opacity-70" : ""} ${b.isUrgent ? "bg-red-950/20 border-l-2 border-red-500" : ""}`}
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-1.5">
                            <ChevronDown className={`h-3.5 w-3.5 text-[#666] transition-transform shrink-0 ${expanded ? "rotate-180" : ""}`} />
                            <span className="font-mono text-xs font-bold text-[#C9A84C]">{b.bookingRef}</span>
                          </div>
                          <div className="flex gap-1 mt-1 ml-5">
                            {b.isUrgent && <span className="inline-flex items-center gap-0.5 text-[9px] font-bold uppercase text-red-400"><Siren className="h-2.5 w-2.5" /> Urgent</span>}
                            {b.isTest && <span className="inline-flex items-center gap-0.5 text-[9px] font-bold uppercase text-gray-400"><FlaskConical className="h-2.5 w-2.5" /> Test</span>}
                            {flagged && <span className="inline-flex items-center gap-0.5 text-[9px] font-bold uppercase text-red-400"><AlertTriangle className="h-2.5 w-2.5" /> Flagged</span>}
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="text-sm font-medium text-[#F5F0E8]">{b.customerName}</p>
                          <p className="text-xs text-[#7C8088]">{b.customerPhone}</p>
                        </td>
                        <td className="p-4 max-w-[220px]">
                          <p className="text-xs text-[#F5F0E8] truncate">{b.pickupLocation} → {b.dropoffLocation}</p>
                          <p className="text-[10px] text-[#7C8088]">{b.passengers} pax</p>
                        </td>
                        <td className="p-4 text-xs text-[#A1A1A6]">{b.vehicleName}</td>
                        <td className="p-4 text-xs text-[#A1A1A6]">{new Date(b.pickupDateTime).toLocaleString()}</td>
                        <td className="p-4">
                          {priceSet ? (
                            <span className="text-sm font-bold text-[#C9A84C]">{b.currency} {b.totalPrice}</span>
                          ) : (
                            <span className="text-xs text-amber-400">Not set</span>
                          )}
                        </td>
                        <td className="p-4">
                          <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase ${STATUS_COLOR[b.status]}`}>
                            {b.status.replace("_", " ")}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <a
                            href={`https://wa.me/${waPhone}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-[#C9A84C] hover:underline text-xs font-bold"
                          >
                            WhatsApp
                          </a>
                        </td>
                      </tr>

                      {expanded && (
                        <tr className="bg-black/20">
                          <td colSpan={8} className="p-5 space-y-4" onClick={(e) => e.stopPropagation()}>
                            {b.customerEmail && <p className="text-xs text-[#A1A1A6]">Email: {b.customerEmail}</p>}

                            <div>
                              <label className="text-[10px] uppercase tracking-wide text-[#666]">Internal admin notes</label>
                              <textarea
                                rows={2}
                                placeholder="Add a note for other admins (not shown to the customer)…"
                                value={notesDraft[b.id] ?? b.notes ?? ""}
                                onChange={(e) => setNotesDraft((prev) => ({ ...prev, [b.id]: e.target.value }))}
                                className={`mt-1 w-full resize-y rounded-lg border border-[#333] bg-black/40 px-3 py-2 text-xs outline-none focus:border-[#C9A84C] ${flagged ? "text-red-400" : "text-[#A1A1A6]"}`}
                              />
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                              <p className="text-[10px] uppercase tracking-wide text-[#666] w-full sm:w-auto">Quotation</p>
                              {q ? (
                                <a
                                  href={`/api/quotations/${q.id}/invoice`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1.5 rounded-lg border border-[#C9A84C]/30 bg-[#C9A84C]/10 px-3 py-1.5 text-xs font-bold text-[#C9A84C] hover:bg-[#C9A84C]/20"
                                >
                                  <Download className="h-3.5 w-3.5" /> Download {q.ref}
                                </a>
                              ) : (
                                <button
                                  disabled={busy || !priceSet}
                                  onClick={() => generateQuotation(b.id)}
                                  title={!priceSet ? "Set a confirmed price first" : undefined}
                                  className="flex items-center gap-1.5 rounded-lg border border-[#333] px-3 py-1.5 text-xs font-bold text-[#A1A1A6] hover:border-[#C9A84C]/40 disabled:opacity-40"
                                >
                                  <FileText className="h-3.5 w-3.5" /> Generate Quotation
                                </button>
                              )}
                            </div>

                            <div className="grid gap-3 sm:grid-cols-4">
                              <label className="text-xs text-[#A1A1A6]">
                                Set price (SAR)
                                <input
                                  type="number"
                                  min={0}
                                  placeholder={String(b.totalPrice || "")}
                                  value={priceDraft[b.id] ?? ""}
                                  onChange={(e) => setPriceDraft((prev) => ({ ...prev, [b.id]: e.target.value }))}
                                  className="mt-1 w-full rounded-lg border border-[#333] bg-black/40 px-3 py-2 text-xs text-[#F5F0E8] outline-none focus:border-[#C9A84C]"
                                />
                              </label>
                              <label className="text-xs text-[#A1A1A6]">
                                Status
                                <select
                                  value={b.status}
                                  disabled={busy}
                                  onChange={(e) => patch(b.id, { status: e.target.value })}
                                  className="mt-1 w-full rounded-lg border border-[#333] bg-black/40 px-3 py-2 text-xs text-[#F5F0E8] outline-none focus:border-[#C9A84C]"
                                >
                                  {ALL_STATUSES.map((s) => (
                                    <option key={s} value={s} className="bg-[#121212]">{s.replace("_", " ")}</option>
                                  ))}
                                </select>
                              </label>
                              <label className="text-xs text-[#A1A1A6]">
                                Driver name
                                <input
                                  type="text"
                                  placeholder={b.driverName || ""}
                                  value={driverNameDraft[b.id] ?? ""}
                                  onChange={(e) => setDriverNameDraft((prev) => ({ ...prev, [b.id]: e.target.value }))}
                                  className="mt-1 w-full rounded-lg border border-[#333] bg-black/40 px-3 py-2 text-xs text-[#F5F0E8] outline-none focus:border-[#C9A84C]"
                                />
                              </label>
                              <label className="text-xs text-[#A1A1A6]">
                                Driver phone
                                <input
                                  type="text"
                                  placeholder={b.driverPhone || ""}
                                  value={driverPhoneDraft[b.id] ?? ""}
                                  onChange={(e) => setDriverPhoneDraft((prev) => ({ ...prev, [b.id]: e.target.value }))}
                                  className="mt-1 w-full rounded-lg border border-[#333] bg-black/40 px-3 py-2 text-xs text-[#F5F0E8] outline-none focus:border-[#C9A84C]"
                                />
                              </label>
                            </div>

                            <div className="flex items-center gap-2 flex-wrap">
                              <button
                                disabled={
                                  busy ||
                                  (!priceDraft[b.id] && !driverNameDraft[b.id] && !driverPhoneDraft[b.id] &&
                                    (notesDraft[b.id] === undefined || notesDraft[b.id] === (b.notes ?? "")))
                                }
                                onClick={() => {
                                  const payload: Record<string, unknown> = {};
                                  if (priceDraft[b.id]) payload.totalPrice = priceDraft[b.id];
                                  if (driverNameDraft[b.id]) payload.driverName = driverNameDraft[b.id];
                                  if (driverPhoneDraft[b.id]) payload.driverPhone = driverPhoneDraft[b.id];
                                  if (notesDraft[b.id] !== undefined && notesDraft[b.id] !== (b.notes ?? "")) payload.notes = notesDraft[b.id];
                                  patch(b.id, payload);
                                }}
                                className="rounded-lg bg-[#C9A84C]/15 border border-[#C9A84C]/25 px-3 py-2 text-xs font-bold text-[#C9A84C] hover:bg-[#C9A84C]/25 disabled:opacity-40"
                              >
                                {busy ? "Saving…" : "Save Changes"}
                              </button>
                              {busy && <Loader2 className="h-4 w-4 animate-spin text-[#C9A84C]" />}

                              <span className="flex-1" />

                              <button
                                disabled={busy}
                                onClick={() => patch(b.id, { isTest: !b.isTest })}
                                className="flex items-center gap-1.5 rounded-lg border border-[#333] px-2.5 py-1.5 text-[10px] font-bold uppercase text-[#A1A1A6] hover:border-gray-400 disabled:opacity-40"
                              >
                                <FlaskConical className="h-3 w-3" /> {b.isTest ? "Unmark Test" : "Mark as Test"}
                              </button>
                              {b.isTest && (
                                <button
                                  disabled={busy}
                                  onClick={() => deleteTestBooking(b.id, b.bookingRef)}
                                  className="flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-2.5 py-1.5 text-[10px] font-bold uppercase text-red-400 hover:bg-red-500/20 disabled:opacity-40"
                                >
                                  <Trash2 className="h-3 w-3" /> Delete
                                </button>
                              )}
                            </div>
                            {rowError[b.id] && <p className="text-xs text-red-400">{rowError[b.id]}</p>}
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            disabled={page <= 1}
            onClick={() => setParam("page", String(page - 1))}
            className="flex items-center gap-1 rounded-lg border border-[#333] px-3 py-1.5 text-xs text-[#A1A1A6] hover:border-[#C9A84C]/40 disabled:opacity-30"
          >
            <ChevronLeft className="h-3.5 w-3.5" /> Prev
          </button>
          <span className="text-xs text-[#A1A1A6]">Page {page} of {totalPages}</span>
          <button
            disabled={page >= totalPages}
            onClick={() => setParam("page", String(page + 1))}
            className="flex items-center gap-1 rounded-lg border border-[#333] px-3 py-1.5 text-xs text-[#A1A1A6] hover:border-[#C9A84C]/40 disabled:opacity-30"
          >
            Next <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
