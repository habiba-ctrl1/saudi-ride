"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserCheck, Loader2, Star, AlertTriangle } from "lucide-react";
import type { DriverRow, DriverStatus } from "@/lib/supabase/drivers";

const STATUS_COLOR: Record<DriverStatus, string> = {
  pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  approved: "bg-green-500/10 text-green-500 border-green-500/20",
  rejected: "bg-red-500/10 text-red-500 border-red-500/20",
  suspended: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  blacklisted: "bg-red-900/20 text-red-500 border-red-900/40",
};

const FILTERS: Array<"all" | DriverStatus> = ["all", "pending", "approved", "suspended", "rejected", "blacklisted"];

export function DriverApplicationsClient({ drivers, loadError }: { drivers: DriverRow[]; loadError: string | null }) {
  const router = useRouter();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [rowError, setRowError] = useState<Record<string, string>>({});

  const visible = filter === "all" ? drivers : drivers.filter((d) => d.status === filter);

  async function patch(id: string, status: DriverStatus, reason?: string) {
    setBusyId(id);
    setRowError((prev) => ({ ...prev, [id]: "" }));
    try {
      const res = await fetch(`/api/driver-applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, reason }),
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
          <UserCheck className="h-6 w-6 text-[#C9A84C]" />
          <h1 className="text-xl font-bold text-[#F5F0E8]">Driver Applications</h1>
          <span className="text-xs text-[#A1A1A6]">{drivers.length} total</span>
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
          Could not load drivers: {loadError}
        </p>
      )}

      {visible.length === 0 && !loadError && (
        <p className="rounded-xl border border-[#333] bg-[#111] px-4 py-8 text-center text-sm text-[#A1A1A6]">
          No drivers{filter !== "all" ? ` with status "${filter}"` : " yet"}.
        </p>
      )}

      <div className="grid gap-4">
        {visible.map((d) => {
          const busy = busyId === d.id;
          const waPhone = d.phone.replace(/[^0-9]/g, "");
          return (
            <div key={d.id} className="rounded-2xl border border-[#C9A84C]/10 bg-[#111] p-5 space-y-4">
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-[#F5F0E8]">{d.full_name}</span>
                    <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase ${STATUS_COLOR[d.status]}`}>
                      {d.status}
                    </span>
                    {d.expiring_soon && (
                      <span className="flex items-center gap-1 rounded-full border border-orange-500/20 bg-orange-500/10 px-2.5 py-0.5 text-[10px] font-bold text-orange-400">
                        <AlertTriangle className="h-3 w-3" /> DOCS EXPIRING
                      </span>
                    )}
                    {d.rating !== null && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-[#C9A84C]">
                        <Star className="h-3 w-3 fill-[#C9A84C]" /> {d.rating}
                      </span>
                    )}
                  </div>
                  <a href={`https://wa.me/${waPhone}`} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block text-xs text-[#C9A84C] hover:underline">
                    {d.phone} (WhatsApp)
                  </a>
                  <p className="mt-1 text-xs text-[#A1A1A6]">
                    {d.city} · {d.vehicle_type}{d.vehicle_model ? ` — ${d.vehicle_model}` : ""}
                    {d.years_experience !== null ? ` · ${d.years_experience} yrs exp` : ""} · {d.total_trips_completed} trips
                  </p>
                </div>
                <div className="text-right text-xs text-[#A1A1A6]">
                  <p>License: <span className="font-mono text-[#F5F0E8]">{d.license_number}</span>{d.license_expiry_date ? ` (exp ${d.license_expiry_date})` : " (no expiry set)"}</p>
                  <p>Iqama: <span className="font-mono text-[#F5F0E8]">{d.iqama_number}</span>{d.iqama_expiry_date ? ` (exp ${d.iqama_expiry_date})` : " (no expiry set)"}</p>
                  <p className="mt-1">Applied {new Date(d.created_at).toLocaleDateString()}</p>
                  {d.suspension_reason && <p className="mt-1 text-orange-400">Reason: {d.suspension_reason}</p>}
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap border-t border-[#222] pt-4">
                {d.status !== "approved" && d.status !== "blacklisted" && (
                  <button
                    disabled={busy}
                    onClick={() => patch(d.id, "approved")}
                    className="rounded-lg bg-green-500/15 border border-green-500/25 px-3 py-2 text-xs font-bold text-green-400 hover:bg-green-500/25 disabled:opacity-40"
                  >
                    Approve
                  </button>
                )}
                {d.status === "pending" && (
                  <button
                    disabled={busy}
                    onClick={() => patch(d.id, "rejected")}
                    className="rounded-lg border border-red-500/20 px-3 py-2 text-xs font-bold text-red-400 hover:bg-red-500/10 disabled:opacity-40"
                  >
                    Reject
                  </button>
                )}
                {d.status === "approved" && (
                  <button
                    disabled={busy}
                    onClick={() => {
                      const reason = window.prompt("Suspension reason?") || undefined;
                      if (reason !== undefined) patch(d.id, "suspended", reason);
                    }}
                    className="rounded-lg border border-orange-500/20 px-3 py-2 text-xs font-bold text-orange-400 hover:bg-orange-500/10 disabled:opacity-40"
                  >
                    Suspend
                  </button>
                )}
                {d.status !== "blacklisted" && (
                  <button
                    disabled={busy}
                    onClick={() => {
                      if (window.confirm(`Blacklist ${d.full_name}? This is for serious violations.`)) {
                        patch(d.id, "blacklisted");
                      }
                    }}
                    className="ml-auto rounded-lg border border-red-900/40 px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-900/20 disabled:opacity-40"
                  >
                    Blacklist
                  </button>
                )}
                {busy && <Loader2 className="h-4 w-4 animate-spin text-[#C9A84C]" />}
              </div>
              {rowError[d.id] && <p className="text-xs text-red-400">{rowError[d.id]}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
