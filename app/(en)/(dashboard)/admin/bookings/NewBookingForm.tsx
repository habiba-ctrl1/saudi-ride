"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Loader2 } from "lucide-react";

type Vehicle = { id: string; name: string; type: string };

const inputClass = "rounded-lg border border-[#333] bg-black/40 px-3 py-2 text-xs text-[#F5F0E8] outline-none focus:border-[#C9A84C]";

export function NewBookingForm({ vehicles }: { vehicles: Vehicle[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    customerName: "", customerPhone: "", customerEmail: "",
    pickupLocation: "", dropoffLocation: "", pickupDate: "", pickupTime: "",
    passengers: "2", vehicleId: vehicles[0]?.id ?? "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const pickupDateTime = `${form.pickupDate}T${form.pickupTime || "10:00"}:00.000Z`;
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicleId: form.vehicleId,
          pickupLocation: form.pickupLocation,
          dropoffLocation: form.dropoffLocation,
          pickupDateTime,
          passengers: Number(form.passengers),
          customerName: form.customerName,
          customerPhone: form.customerPhone,
          customerEmail: form.customerEmail || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not create booking");
        return;
      }
      setForm({ customerName: "", customerPhone: "", customerEmail: "", pickupLocation: "", dropoffLocation: "", pickupDate: "", pickupTime: "", passengers: "2", vehicleId: vehicles[0]?.id ?? "" });
      setOpen(false);
      router.refresh();
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 bg-[#C9A84C] text-[#0A0A0A] font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-lg hover:bg-[#B8963B] transition-colors w-fit"
      >
        <Plus className="h-4 w-4" /> {open ? "Cancel" : "New Booking"}
      </button>

      {open && (
        <form onSubmit={handleSubmit} className="mt-4 bg-[#111] border border-[#C9A84C]/15 rounded-2xl p-5 grid gap-3 sm:grid-cols-4">
          <input required placeholder="Customer name" value={form.customerName} onChange={(e) => setForm((f) => ({ ...f, customerName: e.target.value }))} className={inputClass} />
          <input required placeholder="Phone (WhatsApp)" value={form.customerPhone} onChange={(e) => setForm((f) => ({ ...f, customerPhone: e.target.value }))} className={inputClass} />
          <input type="email" placeholder="Email (optional)" value={form.customerEmail} onChange={(e) => setForm((f) => ({ ...f, customerEmail: e.target.value }))} className={inputClass} />
          <select required value={form.vehicleId} onChange={(e) => setForm((f) => ({ ...f, vehicleId: e.target.value }))} className={inputClass}>
            {vehicles.map((v) => <option key={v.id} value={v.id} className="bg-[#121212]">{v.name} ({v.type})</option>)}
          </select>
          <input required placeholder="Pickup location" value={form.pickupLocation} onChange={(e) => setForm((f) => ({ ...f, pickupLocation: e.target.value }))} className={inputClass} />
          <input required placeholder="Drop-off location" value={form.dropoffLocation} onChange={(e) => setForm((f) => ({ ...f, dropoffLocation: e.target.value }))} className={inputClass} />
          <input required type="date" value={form.pickupDate} onChange={(e) => setForm((f) => ({ ...f, pickupDate: e.target.value }))} className={inputClass} />
          <input type="time" value={form.pickupTime} onChange={(e) => setForm((f) => ({ ...f, pickupTime: e.target.value }))} className={inputClass} />
          <input required type="number" min={1} placeholder="Passengers" value={form.passengers} onChange={(e) => setForm((f) => ({ ...f, passengers: e.target.value }))} className={inputClass} />

          <p className="sm:col-span-4 text-[11px] text-[#7C8088]">
            Price isn&apos;t set here — every new booking starts as Pending with no price, same as a real inquiry.
            Confirm the fare on WhatsApp, then set it on the booking row below.
          </p>
          {error && <p className="sm:col-span-4 text-xs text-red-400">{error}</p>}

          <div className="sm:col-span-4">
            <button disabled={saving} type="submit" className="rounded-lg bg-[#C9A84C]/15 border border-[#C9A84C]/25 px-4 py-2.5 text-xs font-bold text-[#C9A84C] hover:bg-[#C9A84C]/25 disabled:opacity-40 inline-flex items-center gap-2">
              {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />} {saving ? "Creating…" : "Create Booking"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
