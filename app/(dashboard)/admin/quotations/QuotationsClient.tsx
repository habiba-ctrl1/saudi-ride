"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { FileText, Loader2, Flag, Pencil, X, ChevronLeft, ChevronRight, Search, Eye, Download } from "lucide-react";
import type { QuotationRow, QuotationStatus, LeadSource, QuotationPaymentStatus, TripType } from "@/lib/supabase/quotations";

type DriverOption = { id: string; name: string; city: string; vehicleType: string };

const STATUS_COLOR: Record<QuotationStatus, string> = {
  new: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  quoted: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  confirmed: "bg-green-500/10 text-green-500 border-green-500/20",
  assigned: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  completed: "bg-[#C9A84C]/10 text-[#C9A84C] border-[#C9A84C]/20",
  cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
};
const STATUS_LABEL: Record<QuotationStatus, string> = {
  new: "Pending",
  quoted: "Quoted",
  confirmed: "Confirmed",
  assigned: "Assigned",
  completed: "Completed",
  cancelled: "Cancelled",
};
const ALL_STATUSES: QuotationStatus[] = ["new", "quoted", "confirmed", "assigned", "completed", "cancelled"];

const STAGE_FILTERS: Array<{ key: string; label: string }> = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "quoted", label: "Quote Sent" },
  { key: "in_progress", label: "In Progress" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];
const DATE_PRESETS: Array<{ key: string; label: string }> = [
  { key: "today", label: "Today" },
  { key: "tomorrow", label: "Tomorrow" },
  { key: "week", label: "This Week" },
];
const SOURCE_FILTERS: Array<"all" | LeadSource> = ["all", "website", "whatsapp", "referral", "event_management"];
const PAYMENT_FILTERS: Array<"all" | QuotationPaymentStatus> = ["all", "unpaid", "partial", "paid"];
const TRIP_TYPES: TripType[] = ["one_way", "round_trip", "event", "multi_day", "airport_transfer", "hourly"];

type EditDraft = {
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  pickup_location: string;
  drop_location: string;
  trip_type: TripType;
  trip_date: string;
  trip_time: string;
  passengers_count: string;
  luggage_notes: string;
};

function draftFromRow(q: QuotationRow): EditDraft {
  return {
    customer_name: q.customer_name,
    customer_phone: q.customer_phone,
    customer_email: q.customer_email ?? "",
    pickup_location: q.pickup_location,
    drop_location: q.drop_location,
    trip_type: q.trip_type,
    trip_date: q.trip_date,
    trip_time: q.trip_time ? q.trip_time.slice(0, 5) : "",
    passengers_count: q.passengers_count !== null ? String(q.passengers_count) : "",
    luggage_notes: q.luggage_notes ?? "",
  };
}

export function QuotationsClient({
  quotations,
  total,
  page,
  limit,
  drivers,
  loadError,
}: {
  quotations: QuotationRow[];
  total: number;
  page: number;
  limit: number;
  drivers: DriverOption[];
  loadError: string | null;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [busyId, setBusyId] = useState<string | null>(null);
  const [priceDraft, setPriceDraft] = useState<Record<string, string>>({});
  const [driverDraft, setDriverDraft] = useState<Record<string, string>>({});
  const [rowError, setRowError] = useState<Record<string, string>>({});
  const [statusMenuOpenId, setStatusMenuOpenId] = useState<string | null>(null);
  const [pendingPriceId, setPendingPriceId] = useState<string | null>(null);
  const [pendingDriverId, setPendingDriverId] = useState<string | null>(null);
  const [viewingId, setViewingId] = useState<string | null>(null);
  const [searchDraft, setSearchDraft] = useState(searchParams.get("search") ?? "");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<EditDraft | null>(null);
  const [notesDraft, setNotesDraft] = useState<Record<string, string>>({});
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  function setParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    if (key !== "page") params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  function setDatePreset(key: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    params.delete("dateFrom");
    params.delete("dateTo");
    if (activeDatePreset === key) params.delete("datePreset");
    else params.set("datePreset", key);
    router.push(`${pathname}?${params.toString()}`);
  }

  function setDateRange(key: "dateFrom" | "dateTo", value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    params.delete("datePreset");
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`${pathname}?${params.toString()}`);
  }

  function onSearchChange(value: string) {
    setSearchDraft(value);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => setParam("search", value || null), 400);
  }

  useEffect(() => () => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
  }, []);

  async function patch(id: string, payload: { status: QuotationStatus; quotedPrice?: string; driverId?: string }) {
    setBusyId(id);
    setRowError((prev) => ({ ...prev, [id]: "" }));
    try {
      const res = await fetch(`/api/quotations/${id}`, {
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

  function requestStatusChange(q: QuotationRow, status: QuotationStatus) {
    setStatusMenuOpenId(null);
    if (status === "quoted" && !(priceDraft[q.id] ?? q.quoted_price)) {
      setPendingPriceId(q.id);
      return;
    }
    if (status === "assigned" && !(driverDraft[q.id] ?? q.assigned_driver_id)) {
      setPendingDriverId(q.id);
      return;
    }
    patch(q.id, { status });
  }

  async function patchDetails(id: string, details: Record<string, unknown>) {
    setBusyId(id);
    setRowError((prev) => ({ ...prev, [id]: "" }));
    try {
      const res = await fetch(`/api/quotations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ details }),
      });
      const data = await res.json();
      if (!res.ok) {
        setRowError((prev) => ({ ...prev, [id]: data.error || "Update failed" }));
        return false;
      }
      router.refresh();
      return true;
    } catch {
      setRowError((prev) => ({ ...prev, [id]: "Network error" }));
      return false;
    } finally {
      setBusyId(null);
    }
  }

  function startEdit(q: QuotationRow) {
    setEditingId(q.id);
    setEditDraft(draftFromRow(q));
  }

  async function saveEdit(id: string) {
    if (!editDraft) return;
    const ok = await patchDetails(id, {
      customer_name: editDraft.customer_name,
      customer_phone: editDraft.customer_phone,
      customer_email: editDraft.customer_email || null,
      pickup_location: editDraft.pickup_location,
      drop_location: editDraft.drop_location,
      trip_type: editDraft.trip_type,
      trip_date: editDraft.trip_date,
      trip_time: editDraft.trip_time || null,
      passengers_count: editDraft.passengers_count ? Number(editDraft.passengers_count) : null,
      luggage_notes: editDraft.luggage_notes || null,
    });
    if (ok) {
      setEditingId(null);
      setEditDraft(null);
    }
  }

  const activeStage = searchParams.get("stage") ?? "all";
  const activeDatePreset = searchParams.get("datePreset") ?? "";
  const activeSource = (searchParams.get("source") as LeadSource | null) ?? "all";
  const activePayment = (searchParams.get("paymentStatus") as QuotationPaymentStatus | null) ?? "all";
  const activeSort = searchParams.get("sort") === "oldest" ? "oldest" : "newest";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <FileText className="h-6 w-6 text-[#C9A84C]" />
          <h1 className="text-xl font-bold text-[#F5F0E8]">Quotations</h1>
          <span className="text-xs text-[#A1A1A6]">{total} total</span>
        </div>
      </div>

      {/* Filter bar */}
      <div className="rounded-2xl border border-[#333] bg-[#111] p-4 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#666]" />
            <input
              value={searchDraft}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search name / phone / ref…"
              className="w-56 rounded-lg border border-[#333] bg-black/40 py-2 pl-8 pr-3 text-xs text-[#F5F0E8] outline-none focus:border-[#C9A84C]"
            />
          </div>
          <input
            type="date"
            value={searchParams.get("dateFrom") ?? ""}
            onChange={(e) => setDateRange("dateFrom", e.target.value)}
            className="rounded-lg border border-[#333] bg-black/40 px-2 py-2 text-xs text-[#F5F0E8] outline-none focus:border-[#C9A84C]"
          />
          <span className="text-xs text-[#666]">to</span>
          <input
            type="date"
            value={searchParams.get("dateTo") ?? ""}
            onChange={(e) => setDateRange("dateTo", e.target.value)}
            className="rounded-lg border border-[#333] bg-black/40 px-2 py-2 text-xs text-[#F5F0E8] outline-none focus:border-[#C9A84C]"
          />
          <div className="flex gap-1.5">
            {DATE_PRESETS.map((d) => (
              <button
                key={d.key}
                onClick={() => setDatePreset(d.key)}
                className={`rounded-lg border px-2.5 py-2 text-xs font-medium transition ${
                  activeDatePreset === d.key
                    ? "border-[#C9A84C] bg-[#C9A84C]/10 text-[#C9A84C]"
                    : "border-[#333] text-[#A1A1A6] hover:border-[#C9A84C]/40"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
          <select
            value={activeSource}
            onChange={(e) => setParam("source", e.target.value === "all" ? null : e.target.value)}
            className="rounded-lg border border-[#333] bg-black/40 px-2 py-2 text-xs text-[#F5F0E8] outline-none focus:border-[#C9A84C]"
          >
            {SOURCE_FILTERS.map((s) => (
              <option key={s} value={s} className="bg-[#121212]">{s === "all" ? "All sources" : s.replace("_", " ")}</option>
            ))}
          </select>
          <select
            value={activePayment}
            onChange={(e) => setParam("paymentStatus", e.target.value === "all" ? null : e.target.value)}
            className="rounded-lg border border-[#333] bg-black/40 px-2 py-2 text-xs text-[#F5F0E8] outline-none focus:border-[#C9A84C]"
          >
            {PAYMENT_FILTERS.map((p) => (
              <option key={p} value={p} className="bg-[#121212]">{p === "all" ? "All payments" : p}</option>
            ))}
          </select>
          <select
            value={activeSort}
            onChange={(e) => setParam("sort", e.target.value === "oldest" ? "oldest" : null)}
            className="rounded-lg border border-[#333] bg-black/40 px-2 py-2 text-xs text-[#F5F0E8] outline-none focus:border-[#C9A84C]"
          >
            <option value="newest" className="bg-[#121212]">Newest first</option>
            <option value="oldest" className="bg-[#121212]">Oldest first</option>
          </select>
        </div>
        <div className="flex gap-2 flex-wrap">
          {STAGE_FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setParam("stage", f.key === "all" ? null : f.key)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                activeStage === f.key
                  ? "border-[#C9A84C] bg-[#C9A84C]/10 text-[#C9A84C]"
                  : "border-[#333] text-[#A1A1A6] hover:border-[#C9A84C]/40"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {loadError && (
        <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          Could not load quotations: {loadError}
        </p>
      )}

      {quotations.length === 0 && !loadError && (
        <p className="rounded-xl border border-[#333] bg-[#111] px-4 py-8 text-center text-sm text-[#A1A1A6]">
          No quotations match these filters.
        </p>
      )}

      <div className="grid gap-4">
        {quotations.map((q) => {
          const busy = busyId === q.id;
          const waPhone = q.customer_phone.replace(/[^0-9]/g, "");
          const locked = q.status === "completed" || q.status === "cancelled";
          const editing = editingId === q.id;
          return (
            <div key={q.id} className="rounded-2xl border border-[#C9A84C]/10 bg-[#111] p-5 space-y-4">
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-sm font-bold text-[#C9A84C]">{q.quote_reference}</span>
                    <div className="relative">
                      <button
                        disabled={locked || busy}
                        onClick={() => setStatusMenuOpenId(statusMenuOpenId === q.id ? null : q.id)}
                        className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase transition disabled:cursor-default ${STATUS_COLOR[q.status]} ${!locked ? "hover:brightness-125" : ""}`}
                      >
                        {STATUS_LABEL[q.status]}
                      </button>
                      {statusMenuOpenId === q.id && (
                        <div className="absolute left-0 top-full z-10 mt-1 w-36 overflow-hidden rounded-lg border border-[#333] bg-[#1a1a1a] shadow-xl">
                          {ALL_STATUSES.map((s) => (
                            <button
                              key={s}
                              onClick={() => requestStatusChange(q, s)}
                              className={`block w-full px-3 py-2 text-left text-[10px] font-bold uppercase hover:bg-white/5 ${
                                s === q.status ? "text-[#C9A84C]" : "text-[#A1A1A6]"
                              }`}
                            >
                              {STATUS_LABEL[s]}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="rounded-full border border-[#333] px-2.5 py-0.5 text-[10px] uppercase text-[#A1A1A6]">
                      {q.source.replace("_", " ")}
                    </span>
                    <button
                      disabled={busy}
                      onClick={() => patchDetails(q.id, { followup_flagged: !q.followup_flagged })}
                      className={`flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-bold transition disabled:opacity-40 ${
                        q.followup_flagged
                          ? "border-red-500/20 bg-red-500/10 text-red-400"
                          : "border-[#333] text-[#666] hover:border-red-500/30 hover:text-red-400"
                      }`}
                    >
                      <Flag className="h-3 w-3" /> {q.followup_flagged ? "FOLLOW UP" : "flag"}
                    </button>
                  </div>
                  {!editing && (
                    <>
                      <p className="mt-2 text-sm font-semibold text-[#F5F0E8]">{q.customer_name}</p>
                      <a href={`https://wa.me/${waPhone}`} target="_blank" rel="noopener noreferrer" className="text-xs text-[#C9A84C] hover:underline">
                        {q.customer_phone} (WhatsApp)
                      </a>
                      {q.customer_email && <p className="text-xs text-[#A1A1A6]">{q.customer_email}</p>}
                    </>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setViewingId(viewingId === q.id ? null : q.id)}
                    title="View full details"
                    className={`rounded-lg border p-1.5 transition ${
                      viewingId === q.id
                        ? "border-[#C9A84C]/40 text-[#C9A84C]"
                        : "border-[#333] text-[#A1A1A6] hover:border-[#C9A84C]/40 hover:text-[#C9A84C]"
                    }`}
                  >
                    {viewingId === q.id ? <X className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                  <button
                    onClick={() => {
                      if (editing) {
                        setEditingId(null);
                        setEditDraft(null);
                      } else {
                        setViewingId(null);
                        startEdit(q);
                      }
                    }}
                    title={locked ? "Locked (completed/cancelled) — read-only" : "Edit customer & trip details"}
                    className={`rounded-lg border p-1.5 transition ${
                      editing
                        ? "border-[#C9A84C]/40 text-[#C9A84C]"
                        : "border-[#333] text-[#A1A1A6] hover:border-[#C9A84C]/40 hover:text-[#C9A84C]"
                    }`}
                  >
                    {editing ? <X className="h-3.5 w-3.5" /> : <Pencil className="h-3.5 w-3.5" />}
                  </button>
                  {q.quoted_price !== null ? (
                    <a
                      href={`/api/quotations/${q.id}/invoice`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Download PDF invoice"
                      className="rounded-lg border border-[#333] p-1.5 text-[#A1A1A6] transition hover:border-[#C9A84C]/40 hover:text-[#C9A84C]"
                    >
                      <Download className="h-3.5 w-3.5" />
                    </a>
                  ) : (
                    <span title="Set a price first to generate an invoice" className="cursor-not-allowed rounded-lg border border-[#222] p-1.5 text-[#444]">
                      <Download className="h-3.5 w-3.5" />
                    </span>
                  )}
                </div>
              </div>

              {viewingId === q.id && (
                <div className="grid gap-3 border-t border-[#222] pt-4 text-xs sm:grid-cols-3">
                  <div><span className="text-[#666]">Email: </span><span className="text-[#F5F0E8]">{q.customer_email ?? "—"}</span></div>
                  <div><span className="text-[#666]">Payment: </span><span className="text-[#F5F0E8] capitalize">{q.payment_status}</span></div>
                  <div><span className="text-[#666]">Return date: </span><span className="text-[#F5F0E8]">{q.return_date ?? "—"}</span></div>
                  <div><span className="text-[#666]">Assigned driver: </span><span className="text-[#F5F0E8]">{drivers.find((d) => d.id === q.assigned_driver_id)?.name ?? "—"}</span></div>
                  <div><span className="text-[#666]">Confirmed at: </span><span className="text-[#F5F0E8]">{q.confirmed_at ? new Date(q.confirmed_at).toLocaleString() : "—"}</span></div>
                  <div><span className="text-[#666]">Created: </span><span className="text-[#F5F0E8]">{new Date(q.created_at).toLocaleString()}</span></div>
                  {q.price_notes && <div className="sm:col-span-3"><span className="text-[#666]">Price notes: </span><span className="text-[#F5F0E8]">{q.price_notes}</span></div>}
                  {q.admin_notes && <div className="sm:col-span-3"><span className="text-[#666]">Admin notes: </span><span className="text-[#F5F0E8]">{q.admin_notes}</span></div>}
                </div>
              )}

              {!editing && (
                <div className="grid gap-4 border-t border-[#222] pt-4 sm:grid-cols-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-[#666]">Trip</p>
                    <p className="mt-1 text-sm text-[#F5F0E8]">{q.pickup_location} → {q.drop_location}</p>
                    <p className="mt-1 text-xs text-[#A1A1A6]">
                      {q.trip_date}{q.trip_time ? ` · ${q.trip_time.slice(0, 5)}` : ""} · {q.trip_type.replace("_", " ")}
                    </p>
                    {q.passengers_count ? <p className="text-xs text-[#A1A1A6]">{q.passengers_count} passengers</p> : null}
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-[#666]">Vehicle</p>
                    {q.vehicle_type_requested ? (
                      <span className="mt-1 inline-block rounded-full border border-[#333] px-2.5 py-0.5 text-xs uppercase text-[#F5F0E8]">
                        {q.vehicle_type_requested}
                      </span>
                    ) : (
                      <p className="mt-1 text-xs text-[#666]">Not specified</p>
                    )}
                    {q.luggage_notes && <p className="mt-1 text-xs text-[#A1A1A6]">{q.luggage_notes}</p>}
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-[#666]">Price</p>
                    {q.quoted_price !== null ? (
                      <p className="mt-1 text-sm font-bold text-[#C9A84C]">{q.quoted_price} {q.currency}</p>
                    ) : (
                      <p className="mt-1 text-xs text-[#666]">Not quoted yet</p>
                    )}
                  </div>
                </div>
              )}

              {editing && editDraft && (
                <div className="grid gap-3 border-t border-[#222] pt-4 sm:grid-cols-2">
                  {locked && (
                    <p className="sm:col-span-2 rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-xs text-amber-400">
                      This quotation is {q.status} — customer/trip details are locked (read-only) to protect the record.
                    </p>
                  )}
                  {([
                    ["Name", "customer_name", "text"],
                    ["Phone", "customer_phone", "text"],
                    ["Email", "customer_email", "email"],
                    ["Pickup", "pickup_location", "text"],
                    ["Drop-off", "drop_location", "text"],
                    ["Trip date", "trip_date", "date"],
                    ["Trip time", "trip_time", "time"],
                    ["Passengers", "passengers_count", "number"],
                  ] as const).map(([label, key, type]) => (
                    <label key={key} className="text-xs text-[#A1A1A6]">
                      {label}
                      <input
                        type={type}
                        disabled={locked}
                        value={editDraft[key]}
                        onChange={(e) => setEditDraft({ ...editDraft, [key]: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-[#333] bg-black/40 px-3 py-2 text-xs text-[#F5F0E8] outline-none focus:border-[#C9A84C] disabled:opacity-50"
                      />
                    </label>
                  ))}
                  <label className="text-xs text-[#A1A1A6]">
                    Trip type
                    <select
                      disabled={locked}
                      value={editDraft.trip_type}
                      onChange={(e) => setEditDraft({ ...editDraft, trip_type: e.target.value as TripType })}
                      className="mt-1 w-full rounded-lg border border-[#333] bg-black/40 px-3 py-2 text-xs text-[#F5F0E8] outline-none focus:border-[#C9A84C] disabled:opacity-50"
                    >
                      {TRIP_TYPES.map((t) => (
                        <option key={t} value={t} className="bg-[#121212]">{t.replace("_", " ")}</option>
                      ))}
                    </select>
                  </label>
                  <label className="sm:col-span-2 text-xs text-[#A1A1A6]">
                    Luggage / notes
                    <textarea
                      disabled={locked}
                      value={editDraft.luggage_notes}
                      onChange={(e) => setEditDraft({ ...editDraft, luggage_notes: e.target.value })}
                      rows={2}
                      className="mt-1 w-full rounded-lg border border-[#333] bg-black/40 px-3 py-2 text-xs text-[#F5F0E8] outline-none focus:border-[#C9A84C] disabled:opacity-50"
                    />
                  </label>
                  <label className="sm:col-span-2 text-xs text-[#A1A1A6]">
                    Admin notes (always editable)
                    <textarea
                      value={notesDraft[q.id] ?? q.admin_notes ?? ""}
                      onChange={(e) => setNotesDraft((prev) => ({ ...prev, [q.id]: e.target.value }))}
                      rows={2}
                      className="mt-1 w-full rounded-lg border border-[#333] bg-black/40 px-3 py-2 text-xs text-[#F5F0E8] outline-none focus:border-[#C9A84C]"
                    />
                  </label>
                  <div className="sm:col-span-2 flex gap-2">
                    {!locked && (
                      <button
                        disabled={busy}
                        onClick={() => saveEdit(q.id)}
                        className="rounded-lg bg-[#C9A84C]/15 border border-[#C9A84C]/25 px-3 py-2 text-xs font-bold text-[#C9A84C] hover:bg-[#C9A84C]/25 disabled:opacity-40"
                      >
                        {busy ? "Saving…" : "Save details"}
                      </button>
                    )}
                    <button
                      disabled={busy || notesDraft[q.id] === undefined}
                      onClick={async () => {
                        const ok = await patchDetails(q.id, { admin_notes: notesDraft[q.id] });
                        if (ok) setNotesDraft((prev) => ({ ...prev, [q.id]: undefined as unknown as string }));
                      }}
                      className="rounded-lg border border-[#333] px-3 py-2 text-xs font-bold text-[#A1A1A6] hover:border-[#C9A84C]/40 hover:text-[#C9A84C] disabled:opacity-40"
                    >
                      Save notes
                    </button>
                  </div>
                </div>
              )}

              {pendingPriceId === q.id && (
                <div className="flex items-center gap-2 flex-wrap border-t border-[#222] pt-4">
                  <span className="text-xs text-[#A1A1A6]">Set a price to mark this as Quoted:</span>
                  <input
                    type="number"
                    min={0}
                    autoFocus
                    placeholder="Price (SAR)"
                    value={priceDraft[q.id] ?? ""}
                    onChange={(e) => setPriceDraft((prev) => ({ ...prev, [q.id]: e.target.value }))}
                    className="w-32 rounded-lg border border-[#333] bg-black/40 px-3 py-2 text-xs text-[#F5F0E8] outline-none focus:border-[#C9A84C]"
                  />
                  <button
                    disabled={busy || !priceDraft[q.id]}
                    onClick={async () => {
                      await patch(q.id, { status: "quoted", quotedPrice: priceDraft[q.id] });
                      setPendingPriceId(null);
                    }}
                    className="rounded-lg bg-blue-500/15 border border-blue-500/25 px-3 py-2 text-xs font-bold text-blue-400 hover:bg-blue-500/25 disabled:opacity-40"
                  >
                    Confirm
                  </button>
                  <button onClick={() => setPendingPriceId(null)} className="text-xs text-[#666] hover:text-[#A1A1A6]">Cancel</button>
                  {busy && <Loader2 className="h-4 w-4 animate-spin text-[#C9A84C]" />}
                </div>
              )}
              {pendingDriverId === q.id && (
                <div className="flex items-center gap-2 flex-wrap border-t border-[#222] pt-4">
                  <span className="text-xs text-[#A1A1A6]">Assign a driver to mark this as Assigned:</span>
                  <select
                    autoFocus
                    value={driverDraft[q.id] ?? ""}
                    onChange={(e) => setDriverDraft((prev) => ({ ...prev, [q.id]: e.target.value }))}
                    className="rounded-lg border border-[#333] bg-black/40 px-3 py-2 text-xs text-[#F5F0E8] outline-none focus:border-[#C9A84C]"
                  >
                    <option value="">Select driver…</option>
                    {drivers.map((d) => (
                      <option key={d.id} value={d.id} className="bg-[#121212]">
                        {d.name} — {d.city} ({d.vehicleType})
                      </option>
                    ))}
                  </select>
                  <button
                    disabled={busy || !driverDraft[q.id]}
                    onClick={async () => {
                      await patch(q.id, { status: "assigned", driverId: driverDraft[q.id] });
                      setPendingDriverId(null);
                    }}
                    className="rounded-lg bg-purple-500/15 border border-purple-500/25 px-3 py-2 text-xs font-bold text-purple-400 hover:bg-purple-500/25 disabled:opacity-40"
                  >
                    Confirm
                  </button>
                  <button onClick={() => setPendingDriverId(null)} className="text-xs text-[#666] hover:text-[#A1A1A6]">Cancel</button>
                  {busy && <Loader2 className="h-4 w-4 animate-spin text-[#C9A84C]" />}
                </div>
              )}
              {rowError[q.id] && <p className="text-xs text-red-400">{rowError[q.id]}</p>}
            </div>
          );
        })}
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
