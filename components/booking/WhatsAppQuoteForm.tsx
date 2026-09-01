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
import { MapPin, Calendar, Car, MessageCircle, Users } from "lucide-react";

const VEHICLES = [
  { key: "Sedan", en: "Sedan", ar: "سيدان" },
  { key: "VIP SUV", en: "VIP SUV", ar: "SUV فاخرة" },
  { key: "Van", en: "Van", ar: "فان" },
  { key: "Luxury", en: "Luxury", ar: "فاخرة VIP" },
  { key: "Bus", en: "Bus / Coaster", ar: "حافلة" },
];

const TRIP_TYPES = [
  { key: "One Way", en: "One Way", ar: "ذهاب فقط" },
  { key: "Round Trip", en: "Round Trip", ar: "ذهاب وعودة" },
  { key: "By the Hour", en: "By the Hour", ar: "بالساعة" },
];

const PASSENGERS = ["1", "2", "3", "4", "5-6", "7+"];

function InputRow({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div
      className="flex items-center gap-3 rounded-xl px-4 py-3.5 transition-all duration-200 focus-within:shadow-[0_0_0_2px_rgba(22,163,74,0.25)]"
      style={{ border: "1.5px solid rgba(22,163,74,0.25)", backgroundColor: "#FFFFFF" }}
    >
      <span className="shrink-0 text-[#16A34A]">{icon}</span>
      {children}
    </div>
  );
}

export default function WhatsAppQuoteForm() {
  const { language } = useLanguage();
  const isRtl = language === "ar";

  const [tripType, setTripType] = useState("One Way");
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [passengers, setPassengers] = useState("");
  const [vehicle, setVehicle] = useState("VIP SUV");

  const handleSubmit = () => {
    trackEvent("lead_captured", { source: "whatsapp_quote_form", fromCity: pickup, toCity: dropoff, vehicleClass: vehicle, tripType, passengers, locale: language });

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
          tripType,
          passengers: passengers || null,
          locale: language,
          pageUrl: typeof window !== "undefined" ? window.location.href : null,
          utm: getUtm(),
          source: "whatsapp_quote_form",
        }),
      }).catch(() => {});
    } catch {}

    const tripLabel = TRIP_TYPES.find((tt) => tt.key === tripType);
    const lines = isRtl
      ? [
          "السلام عليكم، أرغب بالحصول على عرض سعر لرحلة نقل خاصة.",
          "",
          `• نوع الرحلة: ${tripLabel?.ar ?? tripType}`,
          `• من: ${pickup || "—"}`,
          `• إلى: ${dropoff || "—"}`,
          `• التاريخ والوقت: ${dateTime || "—"}`,
          `• نوع السيارة: ${VEHICLES.find((v) => v.key === vehicle)?.ar ?? vehicle}`,
          `• عدد الركاب: ${passengers || "—"}`,
          `• الأمتعة: `,
        ]
      : [
          "Salam! I'd like a quote for a private transfer.",
          "",
          `• Trip type: ${tripLabel?.en ?? tripType}`,
          `• From: ${pickup || "—"}`,
          `• To: ${dropoff || "—"}`,
          `• Date & time: ${dateTime || "—"}`,
          `• Vehicle: ${vehicle}`,
          `• Passengers: ${passengers || "—"}`,
          `• Luggage: `,
        ];

    const url = `${contactConfig.whatsappLink}?text=${encodeURIComponent(lines.join("\n"))}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className="mx-auto max-w-2xl rounded-3xl p-6 md:p-8 space-y-5"
      style={{ border: "1.5px solid rgba(22,163,74,0.25)", backgroundColor: "#FAFAF7" }}
    >
      {/* Trip type — qualifies the enquiry up front */}
      <div className="grid grid-cols-3 gap-2">
        {TRIP_TYPES.map((tt) => {
          const active = tripType === tt.key;
          return (
            <button
              key={tt.key}
              type="button"
              onClick={() => setTripType(tt.key)}
              aria-pressed={active}
              className="rounded-xl py-2.5 text-xs font-bold transition-all"
              style={{
                border: active ? "1.5px solid #16A34A" : "1.5px solid rgba(22,163,74,0.25)",
                backgroundColor: active ? "#16A34A" : "#FFFFFF",
                color: active ? "#FFFFFF" : "#15803D",
              }}
            >
              {isRtl ? tt.ar : tt.en}
            </button>
          );
        })}
      </div>

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
        <InputRow icon={<Users className="h-4 w-4" />}>
          <select
            value={passengers}
            onChange={(e) => setPassengers(e.target.value)}
            aria-label={isRtl ? "عدد الركاب" : "Passengers"}
            className="w-full bg-transparent text-sm outline-none text-[#1C1C1C]"
          >
            <option value="">{isRtl ? "عدد الركاب" : "Passengers"}</option>
            {PASSENGERS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </InputRow>
      </div>
      <InputRow icon={<Car className="h-4 w-4" />}>
        <select
          value={vehicle}
          onChange={(e) => setVehicle(e.target.value)}
          aria-label={isRtl ? "نوع السيارة" : "Vehicle"}
          className="w-full bg-transparent text-sm outline-none text-[#1C1C1C]"
        >
          {VEHICLES.map((v) => (
            <option key={v.key} value={v.key}>
              {isRtl ? v.ar : v.en}
            </option>
          ))}
        </select>
      </InputRow>

      <button
        onClick={handleSubmit}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-[#16A34A] py-4 text-sm font-bold uppercase tracking-wider text-white hover:bg-[#15803D] transition-all"
      >
        <MessageCircle className="h-4 w-4 fill-current" />
        {isRtl ? "احصل على عرض سعر النقل الخاص عبر واتساب" : "Get My Private Transfer Quote"}
      </button>
      <p className="text-center text-[0.65rem] text-[#6B7280]">
        {isRtl
          ? "السعر النهائي يعتمد على المسار والسيارة والتاريخ وعدد الركاب — يتم تأكيده معك مباشرة قبل الحجز."
          : "Final pricing depends on route, vehicle, date, and passengers — confirmed with you directly before booking."}
      </p>

      <div
        className="rounded-xl px-4 py-3 text-center"
        style={{ border: "1px solid rgba(22,163,74,0.2)", backgroundColor: "rgba(22,163,74,0.05)" }}
      >
        <p className="text-xs font-semibold text-[#15803D]">
          {isRtl ? "نقل خاص فقط" : "Private Transportation Only"}
        </p>
        <p className="mt-1 text-[0.7rem] text-[#4B5563]">
          {isRtl
            ? "كل حجز يشمل سيارتك وسائقك بشكل خاص — سيارة خاصة وسائق محترف."
            : "Every booking is your own private vehicle and professional chauffeur."}
        </p>
      </div>
    </div>
  );
}
