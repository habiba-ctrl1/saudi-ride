"use client";

import { useState, type FormEvent } from "react";
import { Mail, MessageCircle } from "lucide-react";
import { contactConfig } from "@/lib/config/contact";
import { trackEvent } from "@/lib/analytics";
import { CORPORATE_INVOICE_LINE } from "@/lib/data/cluster";

// Corporate / delegation RFQ. There is no corporate backend endpoint yet
// (CLAUDE.md §13), so the form composes a structured request and hands it to
// email or WhatsApp. Nothing is stored or sent from this page. Analytics: the
// existing lead_captured event, with no personal data in the payload.
const VEHICLES = ["GMC Yukon XL / Denali (full-size SUV)", "Executive sedan", "Full-size SUV (other)", "VIP van", "Coaster / bus", "Not sure — advise me"];

const FORMATS = [
  "Single executive transfer",
  "Airport-to-hotel transportation",
  "Hotel-to-meeting transfers and multiple stops",
  "Dedicated hourly or daily chauffeur",
  "Multi-day itinerary or multiple vehicles",
  "Recurring corporate travel",
];

const inputCls = "mt-1 block min-h-[44px] w-full rounded-xl border border-[#D1D5DB] bg-white px-3 text-sm text-[#1C1C1C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A]";
const labelCls = "block text-xs font-bold uppercase tracking-wider text-[#374151]";

export function CorporateRfqForm({ city, path }: { city: "Jeddah" | "Makkah" | "Madinah"; path: string }) {
  const [error, setError] = useState("");

  function compose(form: HTMLFormElement): string | null {
    const d = new FormData(form);
    const g = (k: string) => String(d.get(k) ?? "").trim();
    if (!g("company") || !g("contact") || !g("email") || !g("whatsapp")) {
      setError("Please add company, contact person, business email and WhatsApp number.");
      return null;
    }
    setError("");
    return [
      `Corporate transport request — ${city}`,
      `• Company: ${g("company")}`,
      `• Contact person: ${g("contact")}`,
      `• Business email: ${g("email")}`,
      `• WhatsApp: ${g("whatsapp")}`,
      `• City: ${g("city") || city}`,
      `• Travel dates: ${g("dates")}`,
      `• Passengers: ${g("passengers")}`,
      `• Vehicles: ${g("vehicles")}`,
      `• Vehicle category: ${g("category")}`,
      `• Requirement: ${g("recurrence")}`,
      `• Service type: ${g("format")}`,
      `• Pickup / destination: ${g("route")}`,
      `• Additional requirements: ${g("notes")}`,
      "",
      "Please send a written quotation and confirm vehicle availability and terms.",
    ].join("\n");
  }

  function send(e: FormEvent<HTMLButtonElement>, channel: "email" | "whatsapp") {
    const form = e.currentTarget.form;
    if (!form) return;
    const body = compose(form);
    if (!body) return;
    trackEvent("lead_captured", { source: `corporate_rfq_${city.toLowerCase()}_${channel}`, toCity: city, locale: "en" });
    const url =
      channel === "email"
        ? `mailto:${contactConfig.email}?subject=${encodeURIComponent(`Corporate transport RFQ — ${city}`)}&body=${encodeURIComponent(body)}`
        : `${contactConfig.whatsappLink}?text=${encodeURIComponent(body)}`;
    if (channel === "email") window.location.href = url;
    else window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <section id="corporate-rfq" aria-labelledby="rfq-heading" className="scroll-mt-24" data-path={path}>
      <div className="rounded-[2rem] border border-[#E5E7EB] bg-white p-6 md:p-10">
        <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[#16A34A]">Corporate enquiry</p>
        <h2 id="rfq-heading" className="mt-3 font-heading text-[1.75rem] font-bold leading-tight text-[#1C1C1C] md:text-[2.1rem]">
          Corporate Chauffeur &amp; Executive Transportation in Saudi Arabia
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#4B5563]">
          For corporate travel managers, executive assistants, office administrators, hotel guest-relations teams and event coordinators arranging airport pickups for visiting clients. Typical requests, subject to availability:
        </p>
        <ul className="mt-3 grid gap-x-8 gap-y-1 text-sm text-[#4B5563] sm:grid-cols-2">
          {FORMATS.map((f) => (
            <li key={f} className="before:mr-2 before:text-[#16A34A] before:content-['•']">{f}</li>
          ))}
        </ul>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#6B7280]">
          Vehicles, schedules, service terms and rates are confirmed individually in a written quotation. {CORPORATE_INVOICE_LINE} You do not need to share confidential details — pickup areas and dates are enough to start.
        </p>

        <form className="mt-8 grid gap-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()} noValidate>
          <label className={labelCls}>Company name *<input name="company" required autoComplete="organization" className={inputCls} /></label>
          <label className={labelCls}>Contact person *<input name="contact" required autoComplete="name" className={inputCls} /></label>
          <label className={labelCls}>Business email *<input name="email" type="email" required autoComplete="email" className={inputCls} /></label>
          <label className={labelCls}>WhatsApp number *<input name="whatsapp" type="tel" required autoComplete="tel" placeholder="+966…" className={inputCls} /></label>
          <label className={labelCls}>City
            <select name="city" defaultValue={city} className={inputCls}>
              {["Jeddah", "Makkah", "Madinah", "Riyadh", "Other"].map((c) => <option key={c}>{c}</option>)}
            </select>
          </label>
          <label className={labelCls}>Travel dates<input name="dates" placeholder="e.g. 12–15 Nov" className={inputCls} /></label>
          <label className={labelCls}>Estimated passengers<input name="passengers" inputMode="numeric" className={inputCls} /></label>
          <label className={labelCls}>Number of vehicles<input name="vehicles" inputMode="numeric" className={inputCls} /></label>
          <label className={labelCls}>Requested vehicle category
            <select name="category" defaultValue={VEHICLES[0]} className={inputCls}>
              {VEHICLES.map((v) => <option key={v}>{v}</option>)}
            </select>
          </label>
          <label className={labelCls}>One-time or recurring
            <select name="recurrence" className={inputCls}><option>One-time</option><option>Recurring</option></select>
          </label>
          <label className={`${labelCls} sm:col-span-2`}>Service type
            <select name="format" className={inputCls}>{FORMATS.map((f) => <option key={f}>{f}</option>)}</select>
          </label>
          <label className={`${labelCls} sm:col-span-2`}>Pickup and destination details<textarea name="route" rows={2} className={`${inputCls} py-2`} /></label>
          <label className={`${labelCls} sm:col-span-2`}>Additional requirements<textarea name="notes" rows={2} className={`${inputCls} py-2`} /></label>

          {error && <p role="alert" className="text-sm font-semibold text-red-600 sm:col-span-2">{error}</p>}
          <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row">
            <button type="button" onClick={(e) => send(e, "email")} className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[#16A34A] px-6 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#15803D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A] focus-visible:ring-offset-2">
              <Mail className="h-4 w-4" aria-hidden="true" /> Send request by email
            </button>
            <button type="button" onClick={(e) => send(e, "whatsapp")} className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-[#16A34A]/40 px-6 text-xs font-bold uppercase tracking-wider text-[#15803D] hover:bg-[#F0FDF4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A] focus-visible:ring-offset-2">
              <MessageCircle className="h-4 w-4" aria-hidden="true" /> Send on WhatsApp
            </button>
          </div>
          <p className="text-xs text-[#6B7280] sm:col-span-2">Your request opens in your email app or WhatsApp, ready to send. Nothing is stored on this page.</p>
        </form>
      </div>
    </section>
  );
}
