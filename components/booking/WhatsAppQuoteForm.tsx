"use client";

// Replaces the old price-calculator widget on the homepage. We do not have a
// single fixed rate per trip (route, vehicle, date, passengers, luggage, and
// waiting time all affect the final price), so this form collects trip
// details and hands off to WhatsApp for a real quote from a person — no
// estimated/fake price is shown or implied anywhere in this component.
import { useState } from "react";
import { useLanguage } from "@/lib/context/LanguageContext";
import { contactConfig } from "@/lib/config/contact";
import { trackEvent } from "@/lib/analytics";
import { getUtm } from "@/lib/utm";
import { MapPin, Calendar, Car, MessageCircle } from "lucide-react";

const VEHICLES = [
  { key: "Sedan", en: "Sedan", ar: "سيدان" },
  { key: "VIP SUV", en: "VIP SUV", ar: "SUV فاخرة" },
  { key: "Van", en: "Van", ar: "فان" },
  { key: "Luxury", en: "Luxury", ar: "فاخرة VIP" },
  { key: "Bus", en: "Bus / Coaster", ar: "حافلة" },
];

function InputRow({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div
      className="flex items-center gap-3 rounded-xl px-4 py-3.5 transition-all duration-200 focus-within:shadow-[0_0_0_2px_rgba(200,164,93,0.25)]"
      style={{ border: "1.5px solid rgba(200,164,93,0.25)", backgroundColor: "#FFFFFF" }}
    >
      <span className="shrink-0 text-[#C8A45D]">{icon}</span>
      {children}
    </div>
  );
}

export default function WhatsAppQuoteForm() {
  const { language } = useLanguage();
  const isRtl = language === "ar";

  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [vehicle, setVehicle] = useState("VIP SUV");

  const handleSubmit = () => {
    trackEvent("lead_captured", { source: "whatsapp_quote_form", fromCity: pickup, toCity: dropoff, vehicleClass: vehicle, locale: language });

    // Non-blocking lead capture — never delays or blocks the WhatsApp open.
    try {
      fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        keepalive: true,
        body: JSON.stringify({
          origin: pickup || "Not specified",
          destination: dropoff || "Not specified",
          tripDate: dateTime || null,
          vehicleType: vehicle,
          locale: language,
          pageUrl: typeof window !== "undefined" ? window.location.href : null,
          utm: getUtm(),
          source: "whatsapp_quote_form",
        }),
      }).catch(() => {});
    } catch {}

    const lines = isRtl
      ? [
          "السلام عليكم، أرغب بالحصول على عرض سعر لرحلة تاكسي.",
          "",
          `• من: ${pickup || "—"}`,
          `• إلى: ${dropoff || "—"}`,
          `• التاريخ والوقت: ${dateTime || "—"}`,
          `• نوع السيارة: ${VEHICLES.find((v) => v.key === vehicle)?.ar ?? vehicle}`,
          `• عدد الركاب والأمتعة: `,
        ]
      : [
          "Salam! I'd like a quote for a taxi trip.",
          "",
          `• From: ${pickup || "—"}`,
          `• To: ${dropoff || "—"}`,
          `• Date & time: ${dateTime || "—"}`,
          `• Vehicle: ${vehicle}`,
          `• Passengers & luggage: `,
        ];

    const url = `${contactConfig.whatsappLink}?text=${encodeURIComponent(lines.join("\n"))}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className="mx-auto max-w-2xl rounded-3xl p-6 md:p-8 space-y-5"
      style={{ border: "1.5px solid rgba(200,164,93,0.25)", backgroundColor: "#FAFAF7" }}
    >
      <InputRow icon={<MapPin className="h-4 w-4" />}>
        <input
          value={pickup}
          onChange={(e) => setPickup(e.target.value)}
          placeholder={isRtl ? "نقطة الانطلاق (مثال: مطار جدة)" : "Pickup location (e.g. Jeddah Airport)"}
          className="w-full bg-transparent text-sm outline-none placeholder:text-[#9CA3AF]"
        />
      </InputRow>
      <InputRow icon={<MapPin className="h-4 w-4" />}>
        <input
          value={dropoff}
          onChange={(e) => setDropoff(e.target.value)}
          placeholder={isRtl ? "الوجهة (مثال: مكة المكرمة)" : "Destination (e.g. Makkah)"}
          className="w-full bg-transparent text-sm outline-none placeholder:text-[#9CA3AF]"
        />
      </InputRow>
      <div className="grid gap-4 sm:grid-cols-2">
        <InputRow icon={<Calendar className="h-4 w-4" />}>
          <input
            type="datetime-local"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
            className="w-full bg-transparent text-sm outline-none text-[#1C1C1C]"
          />
        </InputRow>
        <InputRow icon={<Car className="h-4 w-4" />}>
          <select
            value={vehicle}
            onChange={(e) => setVehicle(e.target.value)}
            className="w-full bg-transparent text-sm outline-none text-[#1C1C1C]"
          >
            {VEHICLES.map((v) => (
              <option key={v.key} value={v.key}>
                {isRtl ? v.ar : v.en}
              </option>
            ))}
          </select>
        </InputRow>
      </div>

      <button
        onClick={handleSubmit}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-[#16A34A] py-4 text-sm font-bold uppercase tracking-wider text-white hover:bg-[#15803D] transition-all"
      >
        <MessageCircle className="h-4 w-4 fill-current" />
        {isRtl ? "احصل على عرض السعر عبر واتساب" : "Get Your Quote on WhatsApp"}
      </button>
      <p className="text-center text-[0.65rem] text-[#6B7280]">
        {isRtl
          ? "السعر النهائي يعتمد على المسار والسيارة والتاريخ وعدد الركاب — يتم تأكيده معك مباشرة قبل الحجز."
          : "Final pricing depends on route, vehicle, date, and passengers — confirmed with you directly before booking."}
      </p>
    </div>
  );
}
