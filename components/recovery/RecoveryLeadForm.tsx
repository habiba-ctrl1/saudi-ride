"use client";

import { useState } from "react";
import { MessageCircle, Loader2, CheckCircle2, Phone } from "lucide-react";
import { contactConfig, recoveryContact } from "@/lib/config/contact";
import { RECOVERY_SERVICES } from "@/lib/data/recovery";

// Recovery lead form — submits into the existing /api/quotations pipeline so
// leads appear in the admin dashboard alongside taxi quotes. The notes field
// carries the "CAR RECOVERY" prefix so recovery jobs are easy to filter.
export function RecoveryLeadForm({ city }: { city?: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [reference, setReference] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    car: "",
    location: "",
    destination: "",
    service: RECOVERY_SERVICES[0].name as string,
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const whatsappHref = `https://wa.me/${recoveryContact.whatsappNumber}?text=${encodeURIComponent(
    `Salam, I need car recovery (satha)${city ? ` in ${city}` : ""}.\nService: ${form.service}\nCar: ${form.car || "-"}\nLocation: ${form.location || "-"}`
  )}`;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/quotations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: form.name,
          customerPhone: form.phone,
          pickup: form.location,
          dropoff: form.destination || "Nearest workshop",
          travelDate: new Date().toISOString().slice(0, 10),
          tripType: "one_way",
          notes: `CAR RECOVERY${city ? ` — ${city}` : ""} | Service: ${form.service} | Vehicle: ${form.car || "not specified"}`,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);
      setReference(data.quoteReference ?? null);
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="bg-white border border-[#16A34A]/25 rounded-3xl p-8 text-center">
        <CheckCircle2 className="h-12 w-12 text-[#16A34A] mx-auto mb-4" />
        <h3 className="font-heading text-xl font-bold mb-2">Request Received</h3>
        <p className="text-sm text-[#6B7280] mb-1">
          {reference ? <>Your reference: <span className="font-bold text-[#1C1C1C]">{reference}</span>.</> : null}{" "}
          We will call you back within minutes.
        </p>
        <p className="text-sm text-[#6B7280] mb-6">Need the truck faster? Message us directly:</p>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-8 py-3.5 text-xs font-bold uppercase text-white hover:bg-[#1EBE5B] transition-all"
        >
          <MessageCircle className="h-4 w-4" /> WhatsApp Now
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="bg-white border border-[#16A34A]/15 rounded-3xl p-8 space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <input
          required
          value={form.name}
          onChange={set("name")}
          placeholder="Your name *"
          className="w-full rounded-xl border border-[#1C1C1C]/10 bg-[#FAFAF7] px-4 py-3 text-sm outline-none focus:border-[#16A34A]"
        />
        <input
          required
          type="tel"
          value={form.phone}
          onChange={set("phone")}
          placeholder="Phone / WhatsApp number *"
          className="w-full rounded-xl border border-[#1C1C1C]/10 bg-[#FAFAF7] px-4 py-3 text-sm outline-none focus:border-[#16A34A]"
        />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <select
          value={form.service}
          onChange={set("service")}
          className="w-full rounded-xl border border-[#1C1C1C]/10 bg-[#FAFAF7] px-4 py-3 text-sm outline-none focus:border-[#16A34A]"
        >
          {RECOVERY_SERVICES.map((s) => (
            <option key={s.key} value={s.name}>{s.name}</option>
          ))}
        </select>
        <input
          value={form.car}
          onChange={set("car")}
          placeholder="Car make & model (e.g. Camry 2021)"
          className="w-full rounded-xl border border-[#1C1C1C]/10 bg-[#FAFAF7] px-4 py-3 text-sm outline-none focus:border-[#16A34A]"
        />
      </div>
      <input
        required
        value={form.location}
        onChange={set("location")}
        placeholder={`Where is the car? (district / highway${city ? `, ${city}` : ""}) *`}
        className="w-full rounded-xl border border-[#1C1C1C]/10 bg-[#FAFAF7] px-4 py-3 text-sm outline-none focus:border-[#16A34A]"
      />
      <input
        value={form.destination}
        onChange={set("destination")}
        placeholder="Where should we take it? (optional)"
        className="w-full rounded-xl border border-[#1C1C1C]/10 bg-[#FAFAF7] px-4 py-3 text-sm outline-none focus:border-[#16A34A]"
      />

      {status === "error" && (
        <p className="text-xs text-red-600">
          Could not send the request — please use WhatsApp or call us directly below.
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          type="submit"
          disabled={status === "sending"}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-[#16A34A] px-8 py-3.5 text-xs font-bold uppercase text-white hover:bg-[#15803D] transition-all disabled:opacity-60"
        >
          {status === "sending" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Request Recovery
        </button>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-8 py-3.5 text-xs font-bold uppercase text-white hover:bg-[#1EBE5B] transition-all"
        >
          <MessageCircle className="h-4 w-4" /> WhatsApp Direct
        </a>
      </div>
      <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-6 pt-1">
        <a
          href={recoveryContact.phoneLink}
          className="flex items-center justify-center gap-2 text-xs font-bold text-[#6B7280] hover:text-[#16A34A] transition-colors"
        >
          <Phone className="h-3.5 w-3.5" /> Recovery hotline (24/7): {recoveryContact.phoneDisplay}
        </a>
        <a
          href={contactConfig.primaryPhoneLink}
          className="flex items-center justify-center gap-2 text-xs font-bold text-[#6B7280] hover:text-[#16A34A] transition-colors"
        >
          <Phone className="h-3.5 w-3.5" /> Booking office: {contactConfig.primaryPhoneDisplay}
        </a>
      </div>
    </form>
  );
}
