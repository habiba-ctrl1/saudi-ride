"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useLanguage } from "@/lib/context/LanguageContext";
import { contactConfig } from "@/lib/config/contact";
import {
  MapPin,
  Calendar,
  ShieldCheck,
  HelpCircle,
  MessageCircle,
  AlertCircle,
  Car,
  Users,
  Repeat2,
} from "lucide-react";

type VehicleKey = "SEDAN" | "SUV" | "VAN" | "LUXURY" | "BUS";

type PricingResponse = {
  price: number;
  distance: number;
  duration: number;
  isFixed: boolean;
  currency: string;
  breakdown: {
    baseFare: number;
    nightSurcharge: number;
    ramadanSurcharge: number;
    isNight: boolean;
    isRamadan: boolean;
    subtotal: number;
    discount: number;
    isRoundTrip: boolean;
  };
};

const defaultSuggestions = [
  "Jeddah King Abdulaziz Airport (JED) - Terminal 1",
  "Makkah Grand Mosque (Haram) - Clock Tower Plaza",
  "Madinah Nabawi Mosque - North Courtyard Gate",
  "Riyadh King Khalid Airport (RUH) - Terminal 5",
  "Riyadh Downtown Olaya District",
  "Dammam King Fahd International Airport (DMM)",
  "Taif City Heights Resort",
  "AlUla Luxury Heritage Resort",
  "NEOM Gateway Hub",
  "Doha Gateway (Qatar)",
  "Dubai Luxury Marina Gateway (UAE)",
];

const vehicleTypes = [
  { key: "SEDAN" as VehicleKey, name: "Sedan",   icon: "🚗", desc: "Toyota Camry" },
  { key: "SUV"   as VehicleKey, name: "VIP SUV", icon: "🚙", desc: "GMC Yukon" },
  { key: "VAN"   as VehicleKey, name: "Van",      icon: "🚐", desc: "Staria" },
  { key: "LUXURY"as VehicleKey, name: "Elite",    icon: "💎", desc: "S-Class" },
  { key: "BUS"   as VehicleKey, name: "Bus",      icon: "🚌", desc: "Coaster" },
];

/* ─── Minimal shared input wrapper ────────────────────────────────────────── */
function InputRow({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div
      className="flex items-center gap-3 rounded-xl px-4 py-3.5 transition-all duration-200 focus-within:shadow-[0_0_0_2px_rgba(200,164,93,0.25)]"
      style={{
        border: "1.5px solid rgba(200,164,93,0.25)",
        backgroundColor: "#FFFFFF",
      }}
    >
      <span className="shrink-0 text-[#C8A45D]">{icon}</span>
      {children}
    </div>
  );
}

export default function PriceCalculator() {
  const { language } = useLanguage();
  const isRtl = language === "ar";

  const [pickup, setPickup]       = useState("");
  const [dropoff, setDropoff]     = useState("");
  const [vehicleType, setVehicleType] = useState<VehicleKey>("SUV");
  const [dateTime, setDateTime]   = useState("");
  const [isRoundTrip, setIsRoundTrip] = useState(false);

  const [pickupSuggestions,  setPickupSuggestions]  = useState<string[]>([]);
  const [dropoffSuggestions, setDropoffSuggestions] = useState<string[]>([]);
  const [showPickupList,  setShowPickupList]  = useState(false);
  const [showDropoffList, setShowDropoffList] = useState(false);

  const [pricingData, setPricingData] = useState<PricingResponse | null>(null);
  const [loading, setLoading]         = useState(false);
  const [errorMsg, setErrorMsg]       = useState("");

  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const now = new Date();
    now.setHours(now.getHours() + 2);
    const offset = now.getTimezoneOffset() * 60000;
    setDateTime(new Date(now.getTime() - offset).toISOString().slice(0, 16));
  }, []);

  const handlePickupChange = (val: string) => {
    setPickup(val);
    setPickupSuggestions(
      val.trim()
        ? defaultSuggestions.filter((s) => s.toLowerCase().includes(val.toLowerCase()))
        : []
    );
  };

  const handleDropoffChange = (val: string) => {
    setDropoff(val);
    setDropoffSuggestions(
      val.trim()
        ? defaultSuggestions.filter((s) => s.toLowerCase().includes(val.toLowerCase()))
        : []
    );
  };

  const calculateFares = useCallback(
    async (customPickup?: string, customDropoff?: string) => {
      const finalPickup  = customPickup  ?? pickup;
      const finalDropoff = customDropoff ?? dropoff;
      if (finalPickup.trim().length < 3 || finalDropoff.trim().length < 3 || !dateTime) return;

      try {
        setLoading(true);
        setErrorMsg("");
        const res = await fetch("/api/pricing", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pickup: finalPickup, dropoff: finalDropoff, vehicleType, dateTime, isRoundTrip }),
        });
        if (!res.ok) {
          const errData = await res.json() as { error?: string };
          throw new Error(errData.error ?? "Pricing failed");
        }
        setPricingData(await res.json() as PricingResponse);
      } catch (err) {
        setErrorMsg(err instanceof Error ? err.message : "Pricing estimation failed. Please review inputs.");
        setPricingData(null);
      } finally {
        setLoading(false);
      }
    },
    [pickup, dropoff, vehicleType, dateTime, isRoundTrip]
  );

  const setupGoogleAutocomplete = useCallback(() => {
    try {
      const gWindow = window as unknown as { google?: typeof google };
      const bind = (inputId: string, setter: (v: string) => void, other: string) => {
        const el = document.getElementById(inputId) as HTMLInputElement | null;
        if (el && gWindow.google?.maps?.places) {
          const ac = new gWindow.google.maps.places.Autocomplete(el, {
            types: ["geocode", "establishment"],
            componentRestrictions: { country: ["SA", "AE", "QA", "BH", "OM", "KW"] },
          });
          ac.addListener("place_changed", () => {
            const place = ac.getPlace();
            if (place.formatted_address) {
              setter(place.formatted_address);
              void calculateFares(
                inputId.includes("pickup") ? place.formatted_address : undefined,
                inputId.includes("dropoff") ? place.formatted_address : undefined
              );
            }
          });
        }
      };
      bind("autocomplete-pickup",  setPickup,  dropoff);
      bind("autocomplete-dropoff", setDropoff, pickup);
    } catch { /* ignore */ }
  }, [calculateFares, dropoff, pickup]);

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
    if (key && typeof window !== "undefined") {
      const gWindow = window as unknown as { google?: typeof google };
      if (gWindow.google?.maps?.places) setupGoogleAutocomplete();
    }
  }, [setupGoogleAutocomplete]);

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    if (pickup.trim().length >= 3 && dropoff.trim().length >= 3 && dateTime) {
      debounceTimer.current = setTimeout(() => void calculateFares(), 500);
    }
    return () => { if (debounceTimer.current) clearTimeout(debounceTimer.current); };
  }, [pickup, dropoff, vehicleType, dateTime, isRoundTrip, calculateFares]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] w-full text-left">

      {/* ── Left: Input Panel ─────────────────────────────────────────── */}
      <div
        className="rounded-2xl p-6 md:p-8 space-y-5 relative overflow-hidden"
        style={{
          backgroundColor: "#FFFFFF",
          border: "1.5px solid rgba(200,164,93,0.2)",
          boxShadow: "0 8px 40px rgba(200,164,93,0.08)",
        }}
      >
        {/* Subtle gold corner glow */}
        <div
          className="absolute top-0 right-0 h-32 w-32 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(200,164,93,0.08) 0%, transparent 70%)" }}
        />

        <div>
          <h3
            className="font-heading font-bold"
            style={{ color: "#0F172A", fontSize: "1.2rem", letterSpacing: "-0.01em" }}
          >
            {isRtl ? "محاكي التسعير الفوري" : "Instant Price Calculator"}
          </h3>
          <p className="text-[0.72rem] mt-1" style={{ color: "#6B7280" }}>
            {isRtl
              ? "أدخل بيانات رحلتك لمعرفة السعر الدقيق"
              : "Enter your journey details for a guaranteed fixed quote"}
          </p>
        </div>

        {/* Pickup */}
        <div className="space-y-1.5">
          <label className="block text-[0.65rem] uppercase tracking-widest font-bold" style={{ color: "#C8A45D" }}>
            {isRtl ? "نقطة الالتقاء" : "Pickup Location"}
          </label>
          <div className="relative">
            <InputRow icon={<MapPin className="h-4 w-4" />}>
              <input
                id="autocomplete-pickup"
                type="text"
                value={pickup}
                onChange={(e) => handlePickupChange(e.target.value)}
                onFocus={() => setShowPickupList(true)}
                onBlur={() => setTimeout(() => setShowPickupList(false), 200)}
                placeholder={isRtl ? "مطار جدة، فندق الرياض..." : "Jeddah Airport, Riyadh hotel..."}
                className="w-full text-sm outline-none bg-transparent"
                style={{ color: "#111827" }}
              />
            </InputRow>
            {showPickupList && pickupSuggestions.length > 0 && (
              <div
                className="absolute z-30 left-0 right-0 mt-1.5 max-h-52 overflow-y-auto rounded-xl p-1.5 shadow-xl"
                style={{ backgroundColor: "#FFFFFF", border: "1.5px solid rgba(200,164,93,0.25)" }}
              >
                {pickupSuggestions.map((s, idx) => (
                  <div
                    key={idx}
                    className="px-4 py-2.5 rounded-lg text-sm cursor-pointer transition-colors"
                    style={{ color: "#374151" }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(200,164,93,0.08)")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                    onClick={() => { setPickup(s); setPickupSuggestions([]); void calculateFares(s, undefined); }}
                  >
                    {s}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Dropoff */}
        <div className="space-y-1.5">
          <label className="block text-[0.65rem] uppercase tracking-widest font-bold" style={{ color: "#C8A45D" }}>
            {isRtl ? "وجهة التوصيل" : "Drop-off Destination"}
          </label>
          <div className="relative">
            <InputRow icon={<MapPin className="h-4 w-4" />}>
              <input
                id="autocomplete-dropoff"
                type="text"
                value={dropoff}
                onChange={(e) => handleDropoffChange(e.target.value)}
                onFocus={() => setShowDropoffList(true)}
                onBlur={() => setTimeout(() => setShowDropoffList(false), 200)}
                placeholder={isRtl ? "الحرم المكي، فندق مكة..." : "Makkah Haram, Madinah hotel..."}
                className="w-full text-sm outline-none bg-transparent"
                style={{ color: "#111827" }}
              />
            </InputRow>
            {showDropoffList && dropoffSuggestions.length > 0 && (
              <div
                className="absolute z-30 left-0 right-0 mt-1.5 max-h-52 overflow-y-auto rounded-xl p-1.5 shadow-xl"
                style={{ backgroundColor: "#FFFFFF", border: "1.5px solid rgba(200,164,93,0.25)" }}
              >
                {dropoffSuggestions.map((s, idx) => (
                  <div
                    key={idx}
                    className="px-4 py-2.5 rounded-lg text-sm cursor-pointer transition-colors"
                    style={{ color: "#374151" }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(200,164,93,0.08)")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                    onClick={() => { setDropoff(s); setDropoffSuggestions([]); void calculateFares(undefined, s); }}
                  >
                    {s}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Date & Time */}
        <div className="space-y-1.5">
          <label className="block text-[0.65rem] uppercase tracking-widest font-bold" style={{ color: "#C8A45D" }}>
            {isRtl ? "تاريخ ووقت الرحلة" : "Date & Time"}
          </label>
          <InputRow icon={<Calendar className="h-4 w-4" />}>
            <input
              type="datetime-local"
              value={dateTime}
              suppressHydrationWarning
              onChange={(e) => setDateTime(e.target.value)}
              className="w-full text-sm outline-none bg-transparent"
              style={{ color: "#111827" }}
            />
          </InputRow>
        </div>

        {/* Vehicle Type */}
        <div className="space-y-2">
          <label className="block text-[0.65rem] uppercase tracking-widest font-bold" style={{ color: "#C8A45D" }}>
            {isRtl ? "فئة السيارة" : "Vehicle Class"}
          </label>
          <div className="grid grid-cols-5 gap-2">
            {vehicleTypes.map((v) => {
              const active = vehicleType === v.key;
              return (
                <button
                  key={v.key}
                  onClick={() => setVehicleType(v.key)}
                  className="rounded-xl py-3 flex flex-col items-center gap-1 text-center transition-all duration-200"
                  style={{
                    border: active ? "1.5px solid #C8A45D" : "1.5px solid rgba(200,164,93,0.15)",
                    backgroundColor: active ? "rgba(200,164,93,0.1)" : "#FAFAFA",
                    color: active ? "#B8963B" : "#9CA3AF",
                  }}
                >
                  <span className="text-lg">{v.icon}</span>
                  <span className="text-[0.55rem] font-bold uppercase tracking-wide leading-none">{v.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Round trip toggle */}
        <div
          className="flex items-center justify-between rounded-xl p-4"
          style={{ backgroundColor: "#F8FAFC", border: "1.5px solid rgba(200,164,93,0.12)" }}
        >
          <div className="flex items-center gap-2.5">
            <Repeat2 className="h-4 w-4" style={{ color: "#C8A45D" }} />
            <div>
              <p className="text-sm font-semibold" style={{ color: "#111827" }}>
                {isRtl ? "رحلة ذهاب وعودة" : "Round Trip"}
              </p>
              <p className="text-[0.62rem]" style={{ color: "#9CA3AF" }}>
                {isRtl ? "خصم 10% على إجمالي الرحلة" : "Save 10% on total fare"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsRoundTrip(!isRoundTrip)}
            className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200"
            style={{ backgroundColor: isRoundTrip ? "#C8A45D" : "#E5E7EB" }}
          >
            <span
              className="pointer-events-none inline-block h-5 w-5 transform rounded-full shadow ring-0 transition duration-200"
              style={{
                backgroundColor: "#FFFFFF",
                transform: isRoundTrip ? "translateX(20px)" : "translateX(0)",
              }}
            />
          </button>
        </div>

        {/* Calculate button */}
        {pickup.trim().length >= 3 && dropoff.trim().length >= 3 && (
          <button
            type="button"
            onClick={() => void calculateFares()}
            disabled={loading}
            className="flex items-center justify-center gap-2 w-full rounded-xl py-3.5 text-sm font-bold uppercase tracking-wider transition-all duration-300 disabled:opacity-50"
            style={{
              backgroundColor: "#C8A45D",
              color: "#0F172A",
              boxShadow: "0 4px 20px rgba(200,164,93,0.3)",
            }}
          >
            {loading ? (
              <span className="h-4 w-4 rounded-full border-2 border-[#0F172A]/25 border-t-[#0F172A] animate-spin inline-block" />
            ) : (
              <span>{isRtl ? "احسب الأجرة الآن" : "Calculate Price"}</span>
            )}
          </button>
        )}
      </div>

      {/* ── Right: Results Panel ──────────────────────────────────────── */}
      <div
        className="rounded-2xl p-6 md:p-8 flex flex-col justify-between relative overflow-hidden"
        style={{
          backgroundColor: "#FFFFFF",
          border: "1.5px solid rgba(200,164,93,0.2)",
          boxShadow: "0 8px 40px rgba(200,164,93,0.08)",
        }}
      >
        <div
          className="absolute bottom-0 left-0 h-32 w-32 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(200,164,93,0.07) 0%, transparent 70%)" }}
        />

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <div
              className="h-10 w-10 rounded-full border-[3px] animate-spin"
              style={{ borderColor: "rgba(200,164,93,0.2)", borderTopColor: "#C8A45D" }}
            />
            <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: "#9CA3AF" }}>
              Calculating your quote…
            </p>
          </div>

        ) : errorMsg ? (
          <div className="flex flex-col items-center justify-center h-64 text-center gap-3">
            <AlertCircle className="h-9 w-9" style={{ color: "#DC2626" }} />
            <p className="text-sm" style={{ color: "#6B7280" }}>{errorMsg}</p>
          </div>

        ) : pricingData ? (
          <div className="space-y-5">
            {/* Price headline */}
            <div className="pb-5" style={{ borderBottom: "1px solid rgba(200,164,93,0.15)" }}>
              <span className="text-[0.62rem] uppercase tracking-widest font-bold" style={{ color: "#C8A45D" }}>
                {isRtl ? "الأجرة المضمونة" : "Guaranteed Fixed Quote"}
              </span>
              <h4
                className="font-heading font-extrabold mt-1"
                style={{ fontSize: "clamp(2rem, 5vw, 2.75rem)", color: "#0F172A", letterSpacing: "-0.02em" }}
              >
                SAR {pricingData.price.toLocaleString()}
              </h4>
              <div className="flex gap-4 mt-1.5 text-[0.65rem] font-semibold" style={{ color: "#9CA3AF" }}>
                <span className="flex items-center gap-1">
                  <Car className="h-3 w-3" style={{ color: "#C8A45D" }} />
                  {pricingData.distance} km
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" style={{ color: "#C8A45D" }} />
                  {pricingData.duration} min
                </span>
              </div>
            </div>

            {/* Breakdown */}
            <div className="space-y-2.5 text-sm">
              <p className="text-[0.62rem] uppercase tracking-widest font-bold mb-2" style={{ color: "#9CA3AF" }}>
                Price Breakdown
              </p>
              <div className="flex justify-between">
                <span style={{ color: "#6B7280" }}>Base Fare</span>
                <span className="font-semibold" style={{ color: "#111827" }}>SAR {pricingData.breakdown.baseFare}</span>
              </div>
              {pricingData.breakdown.nightSurcharge > 0 && (
                <div className="flex justify-between">
                  <span style={{ color: "#C8A45D" }}>Night Surcharge (+15%)</span>
                  <span className="font-semibold" style={{ color: "#C8A45D" }}>+ SAR {pricingData.breakdown.nightSurcharge}</span>
                </div>
              )}
              {pricingData.breakdown.ramadanSurcharge > 0 && (
                <div className="flex justify-between">
                  <span style={{ color: "#C8A45D" }}>Peak Season (+20%)</span>
                  <span className="font-semibold" style={{ color: "#C8A45D" }}>+ SAR {pricingData.breakdown.ramadanSurcharge}</span>
                </div>
              )}
              {pricingData.breakdown.discount > 0 && (
                <div className="flex justify-between">
                  <span style={{ color: "#16A34A" }}>Round Trip Discount</span>
                  <span className="font-semibold" style={{ color: "#16A34A" }}>− SAR {pricingData.breakdown.discount}</span>
                </div>
              )}
              <div
                className="flex justify-between pt-3 font-bold text-base"
                style={{ borderTop: "1px solid rgba(200,164,93,0.15)", color: "#0F172A" }}
              >
                <span>Total (VAT Incl.)</span>
                <span style={{ color: "#C8A45D" }}>SAR {pricingData.price}</span>
              </div>
            </div>

            {/* Price lock badge */}
            <div
              className="rounded-xl p-4 flex items-start gap-3"
              style={{ backgroundColor: "rgba(200,164,93,0.06)", border: "1px solid rgba(200,164,93,0.2)" }}
            >
              <ShieldCheck className="h-5 w-5 shrink-0 mt-0.5" style={{ color: "#C8A45D" }} />
              <div>
                <p className="text-[0.65rem] font-bold uppercase tracking-wider" style={{ color: "#C8A45D" }}>
                  Price Lock Guarantee
                </p>
                <p className="text-[0.6rem] mt-0.5 leading-relaxed" style={{ color: "#9CA3AF" }}>
                  No hidden fees, tolls, or luggage surcharges. This is your final price.
                </p>
              </div>
            </div>

            {/* Book CTA */}
            <a
              href={`https://wa.me/${contactConfig.whatsappNumber}?text=Salam%2C%20I%20want%20to%20book%20a%20ride%20from%20${encodeURIComponent(pickup)}%20to%20${encodeURIComponent(dropoff)}%20on%20${dateTime}.%20Vehicle%3A%20${vehicleType}.%20Quote%3A%20SAR%20${pricingData.price}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full rounded-xl py-4 text-sm font-bold uppercase tracking-wider transition-all hover:scale-[1.02]"
              style={{
                backgroundColor: "#C8A45D",
                color: "#0F172A",
                boxShadow: "0 6px 24px rgba(200,164,93,0.35)",
              }}
            >
              <MessageCircle className="h-4 w-4" />
              <span>Book This Journey</span>
            </a>
          </div>

        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center gap-4">
            <div
              className="h-14 w-14 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "rgba(200,164,93,0.08)", border: "1.5px solid rgba(200,164,93,0.2)" }}
            >
              <HelpCircle className="h-7 w-7" style={{ color: "#C8A45D" }} />
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: "#111827" }}>
                {isRtl ? "أدخل بيانات رحلتك" : "Enter Journey Details"}
              </p>
              <p className="text-[0.68rem] mt-1 max-w-[180px] mx-auto leading-relaxed" style={{ color: "#9CA3AF" }}>
                {isRtl
                  ? "أدخل نقطة الالتقاء والوجهة لعرض السعر"
                  : "Add pickup & destination to see your instant guaranteed quote"}
              </p>
            </div>
          </div>
        )}

        <div
          className="text-center text-[0.58rem] uppercase tracking-widest font-medium mt-5 pt-4"
          style={{ borderTop: "1px solid rgba(200,164,93,0.1)", color: "#D1D5DB" }}
        >
          Ministry of Transport Certified · Prices include 15% VAT
        </div>
      </div>
    </div>
  );
}
