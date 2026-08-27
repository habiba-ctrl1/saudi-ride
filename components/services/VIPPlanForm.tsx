"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { contactConfig } from "@/lib/config/contact";

// Lead-capture form for the VIP Transportation pillar. Instead of a backend
// round-trip, it assembles a structured "VIP Transportation Plan" request and
// hands it to WhatsApp — consistent with the site's WhatsApp-first quoting.
const EVENT_TYPES = [
  "Corporate meeting / roadshow",
  "Conference / exhibition",
  "Wedding / private celebration",
  "Airport VIP arrival",
  "Government / protocol / delegation",
  "Gala dinner / award ceremony",
  "Other",
];

const VEHICLES = [
  "Mercedes-Maybach S-Class",
  "Mercedes S-Class",
  "Range Rover Autobiography",
  "Lexus LX 600",
  "Premium SUV (Escalade / Yukon)",
  "Multiple vehicles",
  "Not sure — recommend a vehicle",
];

const DURATIONS = [
  "Single transfer (point to point)",
  "Airport pickup / drop-off",
  "Hourly charter",
  "Half day",
  "Full day",
  "Multi-day",
];

const field =
  "w-full rounded-xl border border-[#C9A84C]/25 bg-white px-4 py-3 text-sm text-[#1C1C1C] placeholder:text-[#9CA3AF] focus:border-[#16A34A] focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 transition";
const labelCls = "block text-[0.7rem] font-bold uppercase tracking-wider text-[#6B7280] mb-1.5";

export function VIPPlanForm() {
  const [form, setForm] = useState({
    name: "",
    company: "",
    eventType: EVENT_TYPES[0],
    eventDate: "",
    pickup: "",
    destination: "",
    guests: "",
    vehicle: VEHICLES[0],
    duration: DURATIONS[0],
    notes: "",
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const lines = [
      "Salam, I'd like to request a VIP Transportation Plan in Riyadh.",
      "",
      form.name && `Name: ${form.name}`,
      form.company && `Company: ${form.company}`,
      `Event type: ${form.eventType}`,
      form.eventDate && `Event date: ${form.eventDate}`,
      form.pickup && `Pickup: ${form.pickup}`,
      form.destination && `Destination: ${form.destination}`,
      form.guests && `VIP guests: ${form.guests}`,
      `Vehicle preference: ${form.vehicle}`,
      `Service duration: ${form.duration}`,
      form.notes && `Special requirements: ${form.notes}`,
    ].filter(Boolean);
    const url = `https://wa.me/${contactConfig.whatsappNumber}?text=${encodeURIComponent(lines.join("\n"))}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <form onSubmit={submit} className="grid gap-5 sm:grid-cols-2">
      <div>
        <label className={labelCls} htmlFor="vip-name">Name</label>
        <input id="vip-name" className={field} value={form.name} onChange={set("name")} placeholder="Your name" />
      </div>
      <div>
        <label className={labelCls} htmlFor="vip-company">Company (optional)</label>
        <input id="vip-company" className={field} value={form.company} onChange={set("company")} placeholder="Company / organisation" />
      </div>

      <div>
        <label className={labelCls} htmlFor="vip-event">Event type</label>
        <select id="vip-event" className={field} value={form.eventType} onChange={set("eventType")}>
          {EVENT_TYPES.map((o) => <option key={o}>{o}</option>)}
        </select>
      </div>
      <div>
        <label className={labelCls} htmlFor="vip-date">Event date</label>
        <input id="vip-date" type="date" className={field} value={form.eventDate} onChange={set("eventDate")} />
      </div>

      <div>
        <label className={labelCls} htmlFor="vip-pickup">Pickup location</label>
        <input id="vip-pickup" className={field} value={form.pickup} onChange={set("pickup")} placeholder="e.g. King Khalid Airport (RUH)" />
      </div>
      <div>
        <label className={labelCls} htmlFor="vip-dest">Destination</label>
        <input id="vip-dest" className={field} value={form.destination} onChange={set("destination")} placeholder="e.g. Ritz-Carlton Riyadh" />
      </div>

      <div>
        <label className={labelCls} htmlFor="vip-guests">Number of VIP guests</label>
        <input id="vip-guests" className={field} value={form.guests} onChange={set("guests")} placeholder="e.g. 2" inputMode="numeric" />
      </div>
      <div>
        <label className={labelCls} htmlFor="vip-vehicle">Vehicle preference</label>
        <select id="vip-vehicle" className={field} value={form.vehicle} onChange={set("vehicle")}>
          {VEHICLES.map((o) => <option key={o}>{o}</option>)}
        </select>
      </div>

      <div className="sm:col-span-2">
        <label className={labelCls} htmlFor="vip-duration">Service duration</label>
        <select id="vip-duration" className={field} value={form.duration} onChange={set("duration")}>
          {DURATIONS.map((o) => <option key={o}>{o}</option>)}
        </select>
      </div>

      <div className="sm:col-span-2">
        <label className={labelCls} htmlFor="vip-notes">Special requirements</label>
        <textarea id="vip-notes" rows={3} className={field} value={form.notes} onChange={set("notes")} placeholder="Multiple pickups, standby hours, protocol, confidentiality, child seats…" />
      </div>

      <div className="sm:col-span-2">
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-full bg-[#16A34A] py-4 text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-[#15803D] shadow-[0_4px_20px_rgba(22,163,74,0.3)]"
        >
          <MessageCircle className="h-4 w-4 fill-current" /> Send my VIP Transportation Plan
        </button>
        <p className="mt-3 text-center text-[0.7rem] text-[#6B7280]">
          Sent securely via WhatsApp. We reply with a tailored quote — no fixed online pricing, no obligation.
        </p>
      </div>
    </form>
  );
}
