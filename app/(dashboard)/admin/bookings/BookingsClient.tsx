"use client";

import { useRef, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { CalendarClock, Loader2, ChevronLeft, ChevronRight, Search, AlertTriangle } from "lucide-react";

type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "DRIVER_ASSIGNED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "REFUNDED";

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
};

const STATUS_COLOR: Record<BookingStatus, string> = {
  PENDING: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  CONFIRMED: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  DRIVER_ASSIGNED: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  IN_PROGRESS: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  COMPLETED: "bg-[#C9A84C]/10 text-[#C9A84C] border-[#C9A84C]/20",
  CANCELLED: "bg-red-500/10 text-red-500 border-red-500/20",
  REFUNDED: "bg-red-500/10 text-red-500 border-red-500/20",
};
const ALL_STATUSES: BookingStatus[] = [
  "PENDING",
  "CONFIRMED",
  "DRIVER_ASSIGNED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
  "REFUNDED",
];

const STAGE_FILTERS: Array<{ key: string; label: string }> = [
  { key: "all", label: "All" },
  { key: "needs_price", label: "Needs Price" },
  { key: "confirmed", label: "Confirmed / Active" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

export function BookingsClient({
  bookings,
  total,
  page,
  limit,
  needsPriceCount,
}: {
  bookings: BookingRow[];
  total: number;
  page: number;
  limit: number;
  needsPriceCount: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [busyId, setBusyId] = useState<string | null>(null);
  const [priceDraft, setPriceDraft] = useState<Record<string, string>>({});
  const [driverNameDraft, setDriverNameDraft] = useState<Record<string, string>>({});
  const [driverPhoneDraft, setDriverPhoneDraft] = useState<Record<string, string>>({});
  const [rowError, setRowError] = useState<Record<string, string>>({});
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <CalendarClock className="h-6 w-6 text-[#C9A84C]" />
          <h1 className="text-xl font-bold text-[#F5F0E8]">Bookings</h1>
          <span className="text-xs text-[#A1A1A6]">{total} total</span>
          {needsPriceCount > 0 && (
            <span className="flex items-center gap-1 rounded-full border border-amber-500/25 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase text-amber-400">
              <AlertTriangle className="h-3 w-3" /> {needsPriceCount} need{needsPriceCount === 1 ? "s" : ""} a price
            </span>
          )}
        </div>
      </div>

      <p className="rounded-xl border border-[#333] bg-[#111] px-4 py-3 text-xs text-[#A1A1A6]">
        The site no longer shows or emails an automated price to customers — every booking here starts at{" "}
        <span className="text-[#F5F0E8] font-semibold">PENDING / no price set</span>. Confirm the real fare with the
        customer on WhatsApp, then enter it below.
      </p>

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

      {bookings.length === 0 && (
        <p className="rounded-xl border border-[#333] bg-[#111] px-4 py-8 text-center text-sm text-[#A1A1A6]">
          No bookings match these filters.
        </p>
      )}

      <div className="grid gap-4">
        {bookings.map((b) => {
          const busy = busyId === b.id;
          const waPhone = b.customerPhone.replace(/[^0-9]/g, "");
          const flagged = b.notes?.includes("SYSTEM FLAG");
          const priceSet = b.totalPrice > 0;

          return (
            <div key={b.id} className="rounded-2xl border border-[#C9A84C]/10 bg-[#111] p-5 space-y-4">
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-sm font-bold text-[#C9A84C]">{b.bookingRef}</span>
                    <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase ${STATUS_COLOR[b.status]}`}>
                      {b.status.replace("_", " ")}
                    </span>
                    {!priceSet && b.status === "PENDING" && (
                      <span className="rounded-full border border-amber-500/25 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase text-amber-400">
                        Needs price
                      </span>
                    )}
                    {flagged && (
                      <span className="flex items-center gap-1 rounded-full border border-red-500/25 bg-red-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase text-red-400">
                        <AlertTriangle className="h-3 w-3" /> Flagged
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm font-semibold text-[#F5F0E8]">{b.customerName}</p>
                  <a href={`https://wa.me/${waPhone}`} target="_blank" rel="noopener noreferrer" className="text-xs text-[#C9A84C] hover:underline">
                    {b.customerPhone} (WhatsApp)
                  </a>
                  {b.customerEmail && <p className="text-xs text-[#A1A1A6]">{b.customerEmail}</p>}
                </div>
              </div>

              <div className="grid gap-4 border-t border-[#222] pt-4 sm:grid-cols-3">
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-[#666]">Trip</p>
                  <p className="mt-1 text-sm text-[#F5F0E8]">{b.pickupLocation} → {b.dropoffLocation}</p>
                  <p className="mt-1 text-xs text-[#A1A1A6]">
                    {new Date(b.pickupDateTime).toLocaleString()} · {b.passengers} pax · {b.vehicleName}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-[#666]">Price</p>
                  {priceSet ? (
                    <p className="mt-1 text-sm font-bold text-[#C9A84C]">{b.currency} {b.totalPrice}</p>
                  ) : (
                    <p className="mt-1 text-xs text-amber-400">Not set — confirm on WhatsApp first</p>
                  )}
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-[#666]">Driver</p>
                  <p className="mt-1 text-xs text-[#F5F0E8]">{b.driverName || "Not assigned"}</p>
                  {b.driverPhone && <p className="text-xs text-[#A1A1A6]">{b.driverPhone}</p>}
                </div>
              </div>

              {b.notes && (
                <p className={`text-xs border-t border-[#222] pt-3 ${flagged ? "text-red-400" : "text-[#A1A1A6]"}`}>
                  {b.notes}
                </p>
              )}

              <div className="grid gap-3 border-t border-[#222] pt-4 sm:grid-cols-4">
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

              <div className="flex items-center gap-2">
                <button
                  disabled={busy || (!priceDraft[b.id] && !driverNameDraft[b.id] && !driverPhoneDraft[b.id])}
                  onClick={() => {
                    const payload: Record<string, unknown> = {};
                    if (priceDraft[b.id]) payload.totalPrice = priceDraft[b.id];
                    if (driverNameDraft[b.id]) payload.driverName = driverNameDraft[b.id];
                    if (driverPhoneDraft[b.id]) payload.driverPhone = driverPhoneDraft[b.id];
                    patch(b.id, payload);
                  }}
                  className="rounded-lg bg-[#C9A84C]/15 border border-[#C9A84C]/25 px-3 py-2 text-xs font-bold text-[#C9A84C] hover:bg-[#C9A84C]/25 disabled:opacity-40"
                >
                  {busy ? "Saving…" : "Save"}
                </button>
                {busy && <Loader2 className="h-4 w-4 animate-spin text-[#C9A84C]" />}
                {rowError[b.id] && <p className="text-xs text-red-400">{rowError[b.id]}</p>}
              </div>
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
