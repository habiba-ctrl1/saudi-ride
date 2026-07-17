"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Loader2, Flag } from "lucide-react";
import type { QuotationRow, QuotationStatus } from "@/lib/supabase/quotations";

type DriverOption = { id: string; name: string; city: string; vehicleType: string };

const STATUS_COLOR: Record<QuotationStatus, string> = {
  new: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  quoted: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  confirmed: "bg-green-500/10 text-green-500 border-green-500/20",
  assigned: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  completed: "bg-[#C9A84C]/10 text-[#C9A84C] border-[#C9A84C]/20",
  cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
};

const FILTERS: Array<"all" | QuotationStatus> = ["all", "new", "quoted", "confirmed", "assigned", "completed", "cancelled"];

export function QuotationsClient({
  quotations,
  drivers,
  loadError,
}: {
  quotations: QuotationRow[];
  drivers: DriverOption[];
  loadError: string | null;
}) {
  const router = useRouter();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [priceDraft, setPriceDraft] = useState<Record<string, string>>({});
  const [driverDraft, setDriverDraft] = useState<Record<string, string>>({});
  const [rowError, setRowError] = useState<Record<string, string>>({});

  const visible = filter === "all" ? quotations : quotations.filter((q) => q.status === filter);

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <FileText className="h-6 w-6 text-[#C9A84C]" />
          <h1 className="text-xl font-bold text-[#F5F0E8]">Quotations</h1>
          <span className="text-xs text-[#A1A1A6]">{quotations.length} total</span>
        </div>
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full border px-3 py-1.5 text-xs capitalize transition ${
                filter === f
                  ? "border-[#C9A84C] bg-[#C9A84C]/10 text-[#C9A84C]"
                  : "border-[#333] text-[#A1A1A6] hover:border-[#C9A84C]/40"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {loadError && (
        <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          Could not load quotations: {loadError}
        </p>
      )}

      {visible.length === 0 && !loadError && (
        <p className="rounded-xl border border-[#333] bg-[#111] px-4 py-8 text-center text-sm text-[#A1A1A6]">
          No quotations{filter !== "all" ? ` with status "${filter}"` : " yet"}.
        </p>
      )}

      <div className="grid gap-4">
        {visible.map((q) => {
          const busy = busyId === q.id;
          const waPhone = q.customer_phone.replace(/[^0-9]/g, "");
          return (
            <div key={q.id} className="rounded-2xl border border-[#C9A84C]/10 bg-[#111] p-5 space-y-4">
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-sm font-bold text-[#C9A84C]">{q.quote_reference}</span>
                    <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase ${STATUS_COLOR[q.status]}`}>
                      {q.status}
                    </span>
                    {q.followup_flagged && (
                      <span className="flex items-center gap-1 rounded-full border border-red-500/20 bg-red-500/10 px-2.5 py-0.5 text-[10px] font-bold text-red-400">
                        <Flag className="h-3 w-3" /> FOLLOW UP
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm font-semibold text-[#F5F0E8]">{q.customer_name}</p>
                  <a href={`https://wa.me/${waPhone}`} target="_blank" rel="noopener noreferrer" className="text-xs text-[#C9A84C] hover:underline">
                    {q.customer_phone} (WhatsApp)
                  </a>
                </div>
                <div className="text-right text-xs text-[#A1A1A6]">
                  <p className="text-sm text-[#F5F0E8]">{q.pickup_location} → {q.drop_location}</p>
                  <p className="mt-1">{q.trip_date}{q.trip_time ? ` · ${q.trip_time.slice(0, 5)}` : ""} · {q.trip_type.replace("_", " ")}</p>
                  {q.passengers_count ? <p>{q.passengers_count} passengers</p> : null}
                  {q.quoted_price !== null && (
                    <p className="mt-1 text-sm font-bold text-[#C9A84C]">{q.quoted_price} {q.currency}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap border-t border-[#222] pt-4">
                {(q.status === "new" || q.status === "quoted") && (
                  <>
                    <input
                      type="number"
                      min={0}
                      placeholder="Price (SAR)"
                      value={priceDraft[q.id] ?? (q.quoted_price !== null ? String(q.quoted_price) : "")}
                      onChange={(e) => setPriceDraft((prev) => ({ ...prev, [q.id]: e.target.value }))}
                      className="w-32 rounded-lg border border-[#333] bg-black/40 px-3 py-2 text-xs text-[#F5F0E8] outline-none focus:border-[#C9A84C]"
                    />
                    <button
                      disabled={busy || !(priceDraft[q.id] ?? q.quoted_price)}
                      onClick={() => patch(q.id, { status: "quoted", quotedPrice: priceDraft[q.id] ?? String(q.quoted_price ?? "") })}
                      className="rounded-lg bg-blue-500/15 border border-blue-500/25 px-3 py-2 text-xs font-bold text-blue-400 hover:bg-blue-500/25 disabled:opacity-40"
                    >
                      Save Quote
                    </button>
                  </>
                )}
                {q.status === "quoted" && (
                  <button
                    disabled={busy}
                    onClick={() => patch(q.id, { status: "confirmed" })}
                    className="rounded-lg bg-green-500/15 border border-green-500/25 px-3 py-2 text-xs font-bold text-green-400 hover:bg-green-500/25 disabled:opacity-40"
                  >
                    Mark Confirmed
                  </button>
                )}
                {q.status === "confirmed" && (
                  <>
                    <select
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
                      onClick={() => patch(q.id, { status: "assigned", driverId: driverDraft[q.id] })}
                      className="rounded-lg bg-purple-500/15 border border-purple-500/25 px-3 py-2 text-xs font-bold text-purple-400 hover:bg-purple-500/25 disabled:opacity-40"
                    >
                      Assign Driver
                    </button>
                  </>
                )}
                {q.status === "assigned" && (
                  <button
                    disabled={busy}
                    onClick={() => patch(q.id, { status: "completed" })}
                    className="rounded-lg bg-[#C9A84C]/15 border border-[#C9A84C]/25 px-3 py-2 text-xs font-bold text-[#C9A84C] hover:bg-[#C9A84C]/25 disabled:opacity-40"
                  >
                    Mark Completed
                  </button>
                )}
                {q.status !== "cancelled" && q.status !== "completed" && (
                  <button
                    disabled={busy}
                    onClick={() => patch(q.id, { status: "cancelled" })}
                    className="ml-auto rounded-lg border border-red-500/20 px-3 py-2 text-xs font-bold text-red-400 hover:bg-red-500/10 disabled:opacity-40"
                  >
                    Cancel
                  </button>
                )}
                {busy && <Loader2 className="h-4 w-4 animate-spin text-[#C9A84C]" />}
              </div>
              {rowError[q.id] && <p className="text-xs text-red-400">{rowError[q.id]}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
