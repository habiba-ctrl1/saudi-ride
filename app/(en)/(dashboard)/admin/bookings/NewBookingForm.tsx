"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Loader2 } from "lucide-react";

type Vehicle = { id: string; name: string; type: string };

const inputClass = "w-full rounded-lg border border-[#333] bg-black/40 px-3 py-2 text-xs text-[#F5F0E8] outline-none focus:border-[#C9A84C]";
const labelClass = "block text-[10px] uppercase tracking-wide text-[#666] mb-1";

function Field({ label, className = "", children }: { label: string; className?: string; children: React.ReactNode }) {
  return (
    <label className={className}>
      <span className={labelClass}>{label}</span>
      {children}
    </label>
  );
}

const EMPTY = {
  customerName: "", customerPhone: "", customerEmail: "",
  pickupLocation: "", dropoffLocation: "", pickupDate: "", pickupTime: "",
  passengers: "2", vehicleId: "", totalPrice: "", status: "PENDING",
  paymentMethod: "arrival", flightNumber: "", notes: "",
};

export function NewBookingForm({ vehicles }: { vehicles: Vehicle[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState("");
  const [notify, setNotify] = useState(true);
  const [form, setForm] = useState({ ...EMPTY, vehicleId: vehicles[0]?.id ?? "" });
  const set = (k: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const canEmail = form.status !== "PENDING" && !!form.customerEmail;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setResult("");
    try {
      // Time is stored as entered wall-clock (same convention as the public booking form).
      const pickupDateTime = `${form.pickupDate}T${form.pickupTime || "10:00"}:00.000Z`;
      const res = await fetch("/api/admin/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          pickupDateTime,
          passengers: Number(form.passengers),
          totalPrice: form.totalPrice ? Number(form.totalPrice) : 0,
          notifyCustomer: notify && canEmail,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not create booking");
        return;
      }
      const mail = data.email?.sent
        ? ` Email sent to ${data.email.to}.`
        : data.email?.error ? ` Email NOT sent: ${data.email.error}` : "";
      setResult(`Created ${data.bookingRef}.${mail}`);
      setForm({ ...EMPTY, vehicleId: vehicles[0]?.id ?? "" });
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
      {result && <p className="mt-2 text-xs text-emerald-400">{result}</p>}

      {open && (
        <form onSubmit={handleSubmit} className="mt-4 bg-[#111] border border-[#C9A84C]/15 rounded-2xl p-5 space-y-5">
          <fieldset className="grid gap-3 sm:grid-cols-3">
            <legend className="text-[11px] font-bold uppercase tracking-widest text-[#C9A84C] mb-2">Customer</legend>
            <Field label="Name"><input required value={form.customerName} onChange={set("customerName")} className={inputClass} /></Field>
            <Field label="Phone (WhatsApp)"><input required value={form.customerPhone} onChange={set("customerPhone")} className={inputClass} /></Field>
            <Field label="Email (optional)"><input type="email" value={form.customerEmail} onChange={set("customerEmail")} className={inputClass} /></Field>
          </fieldset>

          <fieldset className="grid gap-3 sm:grid-cols-4">
            <legend className="text-[11px] font-bold uppercase tracking-widest text-[#C9A84C] mb-2">Trip</legend>
            <Field label="Pickup (any address, hotel or map link)" className="sm:col-span-2"><input required value={form.pickupLocation} onChange={set("pickupLocation")} className={inputClass} /></Field>
            <Field label="Drop-off" className="sm:col-span-2"><input required value={form.dropoffLocation} onChange={set("dropoffLocation")} className={inputClass} /></Field>
            <Field label="Date"><input required type="date" value={form.pickupDate} onChange={set("pickupDate")} className={inputClass} /></Field>
            <Field label="Time"><input required type="time" value={form.pickupTime} onChange={set("pickupTime")} className={inputClass} /></Field>
            <Field label="Passengers"><input required type="number" min={1} value={form.passengers} onChange={set("passengers")} className={inputClass} /></Field>
            <Field label="Vehicle">
              <select required value={form.vehicleId} onChange={set("vehicleId")} className={inputClass}>
                {vehicles.map((v) => <option key={v.id} value={v.id} className="bg-[#121212]">{v.name} ({v.type})</option>)}
              </select>
            </Field>
            <Field label="Flight number (optional)" className="sm:col-span-2"><input value={form.flightNumber} onChange={set("flightNumber")} className={inputClass} /></Field>
          </fieldset>

          <fieldset className="grid gap-3 sm:grid-cols-4">
            <legend className="text-[11px] font-bold uppercase tracking-widest text-[#C9A84C] mb-2">Price &amp; status</legend>
            <Field label="Agreed fare (SAR)"><input type="number" min={0} value={form.totalPrice} onChange={set("totalPrice")} placeholder="0 = not set" className={inputClass} /></Field>
            <Field label="Payment">
              <select value={form.paymentMethod} onChange={set("paymentMethod")} className={inputClass}>
                <option value="arrival" className="bg-[#121212]">Cash on pickup</option>
                <option value="bank_transfer" className="bg-[#121212]">Bank transfer</option>
                <option value="payment_link" className="bg-[#121212]">Payment link</option>
              </select>
            </Field>
            <Field label="Status">
              <select value={form.status} onChange={set("status")} className={inputClass}>
                <option value="PENDING" className="bg-[#121212]">Pending (still negotiating)</option>
                <option value="CONFIRMED" className="bg-[#121212]">Confirmed</option>
                <option value="DRIVER_ASSIGNED" className="bg-[#121212]">Driver assigned</option>
              </select>
            </Field>
            <label className="flex items-end gap-2 pb-2 text-xs text-[#A1A1A6]">
              <input type="checkbox" checked={notify && canEmail} disabled={!canEmail} onChange={(e) => setNotify(e.target.checked)} className="h-4 w-4 accent-[#C9A84C]" />
              Email customer
            </label>
          </fieldset>

          <Field label="Internal notes (not shown to the customer)">
            <textarea rows={2} value={form.notes} onChange={set("notes")} placeholder="Exact pickup pin, special requests, who agreed the price…" className={inputClass} />
          </Field>

          {!canEmail && (
            <p className="text-[11px] text-[#7C8088]">
              Customer email is sent only when status is Confirmed / Driver assigned and an email address is entered.
              A Pending booking is saved silently.
            </p>
          )}
          {error && <p className="text-xs text-red-400">{error}</p>}

          <button disabled={saving} type="submit" className="rounded-lg bg-[#C9A84C]/15 border border-[#C9A84C]/25 px-4 py-2.5 text-xs font-bold text-[#C9A84C] hover:bg-[#C9A84C]/25 disabled:opacity-40 inline-flex items-center gap-2">
            {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />} {saving ? "Saving…" : "Save Booking"}
          </button>
        </form>
      )}
    </div>
  );
}
