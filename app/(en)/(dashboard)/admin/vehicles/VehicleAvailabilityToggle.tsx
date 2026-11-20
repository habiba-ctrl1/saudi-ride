"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ToggleRight, Loader2 } from "lucide-react";

export function VehicleAvailabilityToggle({ id, available }: { id: string; available: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function toggle() {
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/vehicles/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ available: !available }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Update failed");
        return;
      }
      router.refresh();
    } catch {
      setError("Network error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        disabled={busy}
        onClick={toggle}
        className="flex items-center gap-1.5 text-xs font-bold text-[#A1A1A6] uppercase tracking-wider hover:text-[#F5F0E8] transition-colors disabled:opacity-40"
      >
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ToggleRight className={`h-4 w-4 ${available ? "text-green-500" : "text-red-500"}`} />}
        {available ? "Active" : "Inactive"}
      </button>
      {error && <p className="text-[10px] text-red-400">{error}</p>}
    </div>
  );
}
