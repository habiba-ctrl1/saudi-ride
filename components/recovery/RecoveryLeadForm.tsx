"use client";

import { useState } from "react";
import { MessageCircle, Loader2, CheckCircle2, Phone } from "lucide-react";
import { recoveryContact } from "@/lib/config/contact";
import { RECOVERY_SERVICES } from "@/lib/data/recovery";

// Recovery lead form — submits into the existing /api/quotations pipeline so
// leads appear in the admin dashboard alongside taxi quotes.
//
// LEAD ROUTING: WhatsApp CTA -> BUSINESS lead-intake number (qualify -> quote ->
// margin). Direct CALL -> brother's Dammam number. The notes field carries a
// consistent source label (e.g. "CAR RECOVERY — DAMMAM — EN" /
// "CAR TRANSPORT — DAMMAM TO RIYADH — AR") so leads are easy to filter.
export function RecoveryLeadForm({
  city,
  sourceLabel,
  lang = "en",
  waText,
}: {
  city?: string;
  /** Full attribution label written to the quotation notes. */
  sourceLabel?: string;
  lang?: "en" | "ar";
  /** Override the pre-filled WhatsApp message (e.g. Arabic route text). */
  waText?: string;
}) {
  const ar = lang === "ar";
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

  const t = ar
    ? {
        name: "الاسم *",
        phone: "رقم الجوال / واتساب *",
        car: "نوع السيارة (مثال: كامري ٢٠٢١)",
        location: `أين السيارة؟ (الحي / الطريق${city ? `، ${city}` : ""}) *`,
        destination: "إلى أين ننقلها؟ (اختياري)",
        submit: "اطلب السطحة",
        wa: "اطلب السعر عبر واتساب",
        call: "اتصال مباشر",
        error: "تعذّر إرسال الطلب — تواصل معنا عبر واتساب أو اتصل مباشرة بالأسفل.",
        doneTitle: "تم استلام طلبك",
        doneRef: "رقمك المرجعي:",
        doneMsg: "سنتواصل معك خلال دقائق.",
        doneFast: "تبي السطحة أسرع؟ راسلنا مباشرة:",
        note: "نرد على واتساب خلال دقائق · اتصال مباشر:",
      }
    : {
        name: "Your name *",
        phone: "Phone / WhatsApp number *",
        car: "Car make & model (e.g. Camry 2021)",
        location: `Where is the car? (district / highway${city ? `, ${city}` : ""}) *`,
        destination: "Where should we take it? (optional)",
        submit: "Request Recovery",
        wa: "WhatsApp for a Quote",
        call: "Call Directly",
        error: "Could not send the request — please use WhatsApp or call us directly below.",
        doneTitle: "Request Received",
        doneRef: "Your reference:",
        doneMsg: "We will get back to you within minutes.",
        doneFast: "Need the truck faster? Message us directly:",
        note: "WhatsApp replies in minutes · Direct call:",
      };

  const set =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const defaultWa = ar
    ? `السلام عليكم، أحتاج سطحة${city ? ` في ${city}` : ""}.\nالخدمة: ${form.service}\nالسيارة: ${form.car || "-"}\nالموقع: ${form.location || "-"}`
    : `Salam, I need car recovery (satha)${city ? ` in ${city}` : ""}.\nService: ${form.service}\nCar: ${form.car || "-"}\nLocation: ${form.location || "-"}`;

  const whatsappHref = `https://wa.me/${recoveryContact.whatsappNumber}?text=${encodeURIComponent(waText ?? defaultWa)}`;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const notes =
        (sourceLabel ?? `CAR RECOVERY${city ? ` — ${city}` : ""}`) +
        ` | Service: ${form.service} | Vehicle: ${form.car || "not specified"}`;
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
          notes,
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
      <div dir={ar ? "rtl" : "ltr"} className="bg-white border border-[#16A34A]/25 rounded-3xl p-8 text-center">
        <CheckCircle2 className="h-12 w-12 text-[#16A34A] mx-auto mb-4" />
        <h3 className="font-heading text-xl font-bold mb-2">{t.doneTitle}</h3>
        <p className="text-sm text-[#6B7280] mb-1">
          {reference ? (
            <>
              {t.doneRef} <span className="font-bold text-[#1C1C1C]">{reference}</span>.
            </>
          ) : null}{" "}
          {t.doneMsg}
        </p>
        <p className="text-sm text-[#6B7280] mb-6">{t.doneFast}</p>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-8 py-3.5 text-xs font-bold uppercase text-white hover:bg-[#1EBE5B] transition-all"
        >
          <MessageCircle className="h-4 w-4" /> {t.wa}
        </a>
      </div>
    );
  }

  return (
    <form dir={ar ? "rtl" : "ltr"} onSubmit={submit} className="bg-white border border-[#16A34A]/15 rounded-3xl p-8 space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <input
          required
          value={form.name}
          onChange={set("name")}
          placeholder={t.name}
          className="w-full rounded-xl border border-[#1C1C1C]/10 bg-[#FAFAF7] px-4 py-3 text-sm outline-none focus:border-[#16A34A]"
        />
        <input
          required
          type="tel"
          value={form.phone}
          onChange={set("phone")}
          placeholder={t.phone}
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
            <option key={s.key} value={s.name}>
              {ar ? s.nameAr : s.name}
            </option>
          ))}
        </select>
        <input
          value={form.car}
          onChange={set("car")}
          placeholder={t.car}
          className="w-full rounded-xl border border-[#1C1C1C]/10 bg-[#FAFAF7] px-4 py-3 text-sm outline-none focus:border-[#16A34A]"
        />
      </div>
      <input
        required
        value={form.location}
        onChange={set("location")}
        placeholder={t.location}
        className="w-full rounded-xl border border-[#1C1C1C]/10 bg-[#FAFAF7] px-4 py-3 text-sm outline-none focus:border-[#16A34A]"
      />
      <input
        value={form.destination}
        onChange={set("destination")}
        placeholder={t.destination}
        className="w-full rounded-xl border border-[#1C1C1C]/10 bg-[#FAFAF7] px-4 py-3 text-sm outline-none focus:border-[#16A34A]"
      />

      {status === "error" && <p className="text-xs text-red-600">{t.error}</p>}

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          type="submit"
          disabled={status === "sending"}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-[#16A34A] px-6 py-3.5 text-xs font-bold uppercase text-white hover:bg-[#15803D] transition-all disabled:opacity-60"
        >
          {status === "sending" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {t.submit}
        </button>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 text-xs font-bold uppercase text-white hover:bg-[#1EBE5B] transition-all shadow-md"
        >
          <MessageCircle className="h-4 w-4" /> {t.wa}
        </a>
        <a
          href={recoveryContact.phoneLink}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-[#16A34A] px-6 py-3.5 text-xs font-bold uppercase text-white hover:bg-[#15803D] transition-all shadow-md"
        >
          <Phone className="h-4 w-4" /> {t.call}
        </a>
      </div>
      <p className="flex items-center justify-center gap-2 pt-1 text-center text-xs text-[#6B7280]">
        <Phone className="h-3.5 w-3.5 text-[#16A34A]" /> {t.note} {recoveryContact.phoneDisplay}
      </p>
    </form>
  );
}
