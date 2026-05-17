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
  AlertCircle
} from "lucide-react";

type VehicleKey = 'SEDAN' | 'SUV' | 'VAN' | 'LUXURY' | 'BUS';

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
  "Dubai Luxury Marina Gateway (UAE)"
];

const vehicleTypes = [
  { key: 'SEDAN' as VehicleKey, name: 'Premium Sedan', desc: 'Camry or equivalent', icon: '🚗' },
  { key: 'SUV' as VehicleKey, name: 'VIP SUV', desc: 'Yukon Denali XL or equivalent', icon: '🚙' },
  { key: 'VAN' as VehicleKey, name: 'Luxury Cabin Van', desc: 'Hyundai Staria or equivalent', icon: '🚐' },
  { key: 'LUXURY' as VehicleKey, name: 'Ultra Elite', desc: 'Mercedes S-Class or equivalent', icon: '💎' },
  { key: 'BUS' as VehicleKey, name: 'Coaster/Bus', desc: 'VIP Pilgrim Bus', icon: '🚌' },
];

export default function PriceCalculator() {
  const { language } = useLanguage();
  const isRtl = language === "ar";

  // Form State
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [vehicleType, setVehicleType] = useState<VehicleKey>('SUV');
  const [dateTime, setDateTime] = useState("");
  const [isRoundTrip, setIsRoundTrip] = useState(false);

  // Address Autocomplete UI
  const [pickupSuggestions, setPickupSuggestions] = useState<string[]>([]);
  const [dropoffSuggestions, setDropoffSuggestions] = useState<string[]>([]);
  const [showPickupList, setShowPickupList] = useState(false);
  const [showDropoffList, setShowDropoffList] = useState(false);

  // Calculation Results state
  const [pricingData, setPricingData] = useState<PricingResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Default DateTime initializer (2 hours from now)
  useEffect(() => {
    const now = new Date();
    now.setHours(now.getHours() + 2);
    const tzoffset = now.getTimezoneOffset() * 60000;
    const localISOTime = new Date(now.getTime() - tzoffset).toISOString().slice(0, 16);
    setDateTime(localISOTime);
  }, []);

  // Filter suggestion list as user types
  const handlePickupChange = (val: string) => {
    setPickup(val);
    if (val.trim() === "") {
      setPickupSuggestions([]);
    } else {
      const filtered = defaultSuggestions.filter(s =>
        s.toLowerCase().includes(val.toLowerCase())
      );
      setPickupSuggestions(filtered);
    }
  };

  const handleDropoffChange = (val: string) => {
    setDropoff(val);
    if (val.trim() === "") {
      setDropoffSuggestions([]);
    } else {
      const filtered = defaultSuggestions.filter(s =>
        s.toLowerCase().includes(val.toLowerCase())
      );
      setDropoffSuggestions(filtered);
    }
  };

  const setupGoogleAutocomplete = useCallback(() => {
    try {
      const pickupInput = document.getElementById("autocomplete-pickup") as HTMLInputElement;
      const dropoffInput = document.getElementById("autocomplete-dropoff") as HTMLInputElement;
      const gWindow = window as unknown as { google?: typeof google };

      if (pickupInput && gWindow.google?.maps?.places) {
        const pickupAutocomplete = new gWindow.google.maps.places.Autocomplete(pickupInput, {
          types: ["geocode", "establishment"],
          componentRestrictions: { country: ["SA", "AE", "QA", "BH", "OM", "KW"] }
        });
        pickupAutocomplete.addListener("place_changed", () => {
          const place = pickupAutocomplete.getPlace();
          if (place.formatted_address) {
            setPickup(place.formatted_address);
          }
        });
      }

      if (dropoffInput && gWindow.google?.maps?.places) {
        const dropoffAutocomplete = new gWindow.google.maps.places.Autocomplete(dropoffInput, {
          types: ["geocode", "establishment"],
          componentRestrictions: { country: ["SA", "AE", "QA", "BH", "OM", "KW"] }
        });
        dropoffAutocomplete.addListener("place_changed", () => {
          const place = dropoffAutocomplete.getPlace();
          if (place.formatted_address) {
            setDropoff(place.formatted_address);
          }
        });
      }
    } catch (err) {
      console.warn("Places autocomplete binding failed:", err);
    }
  }, []);

  // Google Places Autocomplete Loader setup if API Key is available
  useEffect(() => {
    const mapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
    if (mapsKey && mapsKey !== "" && typeof window !== "undefined") {
      const gWindow = window as unknown as { google?: typeof google };
      // Lazy load standard google maps autocomplete if scripts have been fetched
      if (gWindow.google && gWindow.google.maps && gWindow.google.maps.places) {
        setupGoogleAutocomplete();
      }
    }
  }, [setupGoogleAutocomplete]);

  const calculateFares = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMsg("");

      const response = await fetch("/api/pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pickup,
          dropoff,
          vehicleType,
          dateTime,
          isRoundTrip
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to calculate luxury pricing");
      }

      const pricing = await response.json() as PricingResponse;
      setPricingData(pricing);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Pricing estimation failed. Please review inputs.";
      setErrorMsg(errMsg);
      setPricingData(null);
    } finally {
      setLoading(false);
    }
  }, [pickup, dropoff, vehicleType, dateTime, isRoundTrip]);

  // Debounced Pricing Calculator logic (500ms after inputs change)
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (pickup.trim().length > 3 && dropoff.trim().length > 3 && dateTime !== "") {
      debounceTimer.current = setTimeout(() => {
        void calculateFares();
      }, 500);
    }

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [pickup, dropoff, vehicleType, dateTime, isRoundTrip, calculateFares]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] w-full text-[#F5F0E8] text-left">
      
      {/* Left Input Panel */}
      <div className="rounded-3xl border border-[#C9A84C]/15 bg-[#121212] p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-[#C9A84C]/5 blur-3xl pointer-events-none" />
        
        <div>
          <h3 className="font-heading text-xl font-bold text-[#F5F0E8]">
            {isRtl ? "محاكي التسعير الفوري" : "Instant Price Simulator"}
          </h3>
          <p className="text-[0.7rem] text-[#A1A1A6] mt-1">
            Configure your journey parameters below to simulate fully tax-inclusive luxury quotes.
          </p>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          
          {/* Pickup Input */}
          <div className="relative">
            <label className="block text-[0.65rem] uppercase tracking-wider text-[#A1A1A6] font-bold mb-2">
              {isRtl ? "نقطة الالتقاء" : "Pickup Point"}
            </label>
            <div className="flex items-center gap-3 rounded-2xl border border-[#C9A84C]/15 bg-black/40 px-4 py-3.5 focus-within:border-[#C9A84C] transition-all">
              <MapPin className="h-4.5 w-4.5 text-[#C9A84C]" />
              <input
                id="autocomplete-pickup"
                type="text"
                value={pickup}
                onChange={(e) => handlePickupChange(e.target.value)}
                onFocus={() => setShowPickupList(true)}
                onBlur={() => setTimeout(() => setShowPickupList(false), 200)}
                placeholder={isRtl ? "اكتب عنوان الالتقاء أو المطار..." : "Jeddah Airport, Riyadh hotel..."}
                className="w-full bg-transparent text-xs text-[#F5F0E8] outline-none"
              />
            </div>

            {/* Manual suggestions list */}
            {showPickupList && pickupSuggestions.length > 0 && (
              <div className="absolute z-30 left-0 right-0 mt-2 max-h-52 overflow-y-auto rounded-2xl border border-[#C9A84C]/25 bg-[#121212] p-1.5 shadow-2xl">
                {pickupSuggestions.map((s, idx) => (
                  <div
                    key={idx}
                    className="px-4 py-2 rounded-xl hover:bg-[#C9A84C]/10 text-xs text-[#F5F0E8] cursor-pointer"
                    onClick={() => {
                      setPickup(s);
                      setPickupSuggestions([]);
                    }}
                  >
                    {s}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Drop-off Input */}
          <div className="relative">
            <label className="block text-[0.65rem] uppercase tracking-wider text-[#A1A1A6] font-bold mb-2">
              {isRtl ? "وجهة التوصيل" : "Drop-off Destination"}
            </label>
            <div className="flex items-center gap-3 rounded-2xl border border-[#C9A84C]/15 bg-black/40 px-4 py-3.5 focus-within:border-[#C9A84C] transition-all">
              <MapPin className="h-4.5 w-4.5 text-[#C9A84C]" />
              <input
                id="autocomplete-dropoff"
                type="text"
                value={dropoff}
                onChange={(e) => handleDropoffChange(e.target.value)}
                onFocus={() => setShowDropoffList(true)}
                onBlur={() => setTimeout(() => setShowDropoffList(false), 200)}
                placeholder={isRtl ? "اكتب وجهة التوصيل..." : "Makkah Haram, Madinah hotel..."}
                className="w-full bg-transparent text-xs text-[#F5F0E8] outline-none"
              />
            </div>

            {/* Manual suggestions list */}
            {showDropoffList && dropoffSuggestions.length > 0 && (
              <div className="absolute z-30 left-0 right-0 mt-2 max-h-52 overflow-y-auto rounded-2xl border border-[#C9A84C]/25 bg-[#121212] p-1.5 shadow-2xl">
                {dropoffSuggestions.map((s, idx) => (
                  <div
                    key={idx}
                    className="px-4 py-2 rounded-xl hover:bg-[#C9A84C]/10 text-xs text-[#F5F0E8] cursor-pointer"
                    onClick={() => {
                      setDropoff(s);
                      setDropoffSuggestions([]);
                    }}
                  >
                    {s}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Date & Time */}
          <div>
            <label className="block text-[0.65rem] uppercase tracking-wider text-[#A1A1A6] font-bold mb-2">
              {isRtl ? "تاريخ ووقت الرحلة" : "Journey Date & Time"}
            </label>
            <div className="flex items-center gap-3 rounded-2xl border border-[#C9A84C]/15 bg-black/40 px-4 py-3.5">
              <Calendar className="h-4.5 w-4.5 text-[#C9A84C]" />
              <input
                type="datetime-local"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                className="w-full bg-transparent text-xs text-[#F5F0E8] outline-none"
              />
            </div>
          </div>

          {/* Vehicle Class Grid */}
          <div>
            <label className="block text-[0.65rem] uppercase tracking-wider text-[#A1A1A6] font-bold mb-2">
              {isRtl ? "فئة السيارة المطلوبة" : "Select Chauffeur Class"}
            </label>
            <div className="grid gap-3 grid-cols-2 md:grid-cols-5">
              {vehicleTypes.map((v) => (
                <div
                  key={v.key}
                  className={`rounded-2xl border p-4 text-center cursor-pointer transition-all ${
                    vehicleType === v.key
                      ? "border-[#C9A84C] bg-[#C9A84C]/10 text-[#C9A84C]"
                      : "border-[#C9A84C]/15 bg-black/20 text-[#A1A1A6] hover:border-[#C9A84C]/35"
                  }`}
                  onClick={() => setVehicleType(v.key)}
                >
                  <span className="text-xl block mb-2">{v.icon}</span>
                  <p className="text-[0.6rem] font-bold uppercase tracking-wider">{v.name.split(" ")[1] || v.name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Round Trip Toggle */}
          <div className="flex items-center justify-between rounded-2xl border border-[#C9A84C]/10 bg-black/20 p-4">
            <div>
              <p className="text-xs font-bold text-[#F5F0E8]">
                {isRtl ? "تأكيد رحلة الذهاب والعودة" : "Book as Round-Trip"}
              </p>
              <p className="text-[0.55rem] text-[#A1A1A6] mt-0.5">
                {isRtl ? "احصل على خصم ١٠٪ على رحلة العودة بالكامل" : "Apply 10% premium discount on total route fare."}
              </p>
            </div>
            
            <button
              type="button"
              onClick={() => setIsRoundTrip(!isRoundTrip)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                isRoundTrip ? "bg-[#C9A84C]" : "bg-neutral-800"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-black shadow-lg ring-0 transition duration-200 ease-in-out ${
                  isRoundTrip ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

        </div>
      </div>

      {/* Right Output Panel */}
      <div className="rounded-3xl border border-[#C9A84C]/15 bg-[#121212] p-6 md:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden">
        <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-[#C9A84C]/5 blur-3xl pointer-events-none" />

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <div className="h-8 w-8 rounded-full border-2 border-[#C9A84C]/20 border-t-[#C9A84C] animate-spin" />
            <p className="text-xs text-[#A1A1A6] uppercase tracking-widest font-semibold">
              Simulating Luxury Quote...
            </p>
          </div>
        ) : errorMsg ? (
          <div className="flex flex-col items-center justify-center h-64 text-center space-y-3">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <p className="text-xs text-[#A1A1A6]">{errorMsg}</p>
          </div>
        ) : pricingData ? (
          <div className="space-y-6">
            
            {/* Main Price display */}
            <div className="border-b border-[#C9A84C]/10 pb-5">
              <span className="text-[0.65rem] uppercase tracking-widest text-[#C9A84C] font-bold">
                {isRtl ? "مجموع الأجرة الفاخرة المضمونة" : "Guaranteed VIP Quote"}
              </span>
              <h4 className="font-heading text-4xl font-bold text-[#F5F0E8] mt-2">
                SAR {pricingData.price.toLocaleString()}
              </h4>
              <p className="text-[0.6rem] text-[#7C8088] font-bold uppercase tracking-wider mt-1.5">
                Distance: <span className="text-[#F5F0E8]">{pricingData.distance} km</span> | Est. Duration: <span className="text-[#F5F0E8]">{pricingData.duration} mins</span>
              </p>
            </div>

            {/* Breakdown */}
            <div className="space-y-3 text-xs">
              <p className="text-[0.65rem] uppercase tracking-wider text-[#A1A1A6] font-bold mb-1">
                Quote Breakdown
              </p>
              
              <div className="flex justify-between text-[0.7rem]">
                <span className="text-[#7C8088]">Base Route Fare</span>
                <span className="font-bold">SAR {pricingData.breakdown.baseFare}</span>
              </div>

              {pricingData.breakdown.nightSurcharge > 0 && (
                <div className="flex justify-between text-[0.7rem] text-[#C9A84C]">
                  <span>Night Surcharge (+15% VIP)</span>
                  <span className="font-bold">+ SAR {pricingData.breakdown.nightSurcharge}</span>
                </div>
              )}

              {pricingData.breakdown.ramadanSurcharge > 0 && (
                <div className="flex justify-between text-[0.7rem] text-[#C9A84C]">
                  <span>High-Season Ramadan (+20%)</span>
                  <span className="font-bold">+ SAR {pricingData.breakdown.ramadanSurcharge}</span>
                </div>
              )}

              {pricingData.breakdown.discount > 0 && (
                <div className="flex justify-between text-[0.7rem] text-green-500">
                  <span>Round Trip Discount (-10%)</span>
                  <span className="font-bold">- SAR {pricingData.breakdown.discount}</span>
                </div>
              )}

              <div className="border-t border-[#C9A84C]/10 pt-3 flex justify-between font-heading font-bold text-sm">
                <span>Total Fare (VAT Incl.)</span>
                <span>SAR {pricingData.price}</span>
              </div>
            </div>

            {/* Price Guarantee Badge */}
            <div className="rounded-2xl border border-[#C9A84C]/25 bg-[#C9A84C]/5 p-4 flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-[#C9A84C] shrink-0 mt-0.5" />
              <div>
                <p className="text-[0.65rem] font-bold uppercase tracking-wider text-[#C9A84C]">
                  Price Lock Guarantee
                </p>
                <p className="text-[0.55rem] text-[#A1A1A6] mt-0.5 leading-relaxed">
                  No hidden fees, tolls, or luggage surcharges. The simulated fare represents the final guaranteed quote.
                </p>
              </div>
            </div>

            {/* CTA action buttons */}
            <div className="space-y-3 pt-2">
              <a
                href={`https://wa.me/${contactConfig.whatsappNumber}?text=Salam,%20I%20would%20like%20to%20book%20a%20VIP%20transfer%20from%20${encodeURIComponent(pickup)}%20to%20${encodeURIComponent(dropoff)}%20on%20${dateTime}.%20Vehicle:%20${vehicleType}.%20Guaranteed%20fare:%20SAR%20${pricingData.price}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full rounded-full bg-[#C9A84C] py-4 text-xs font-bold uppercase tracking-wider text-[#0A0A0A] hover:bg-[#B8963B] transition-all hover:scale-102 shadow-[0_4px_20px_rgba(201,168,76,0.3)]"
              >
                <MessageCircle className="h-4.5 w-4.5 fill-[#0A0A0A]" />
                <span>Book This Journey Now</span>
              </a>
            </div>

          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
            <HelpCircle className="h-10 w-10 text-[#C9A84C]/45 animate-pulse" />
            <div>
              <p className="text-xs font-bold text-[#F5F0E8]">
                Awaiting Journey Input
              </p>
              <p className="text-[0.55rem] text-[#A1A1A6] mt-1 max-w-[200px] mx-auto leading-relaxed">
                Provide pickup, drop-off, and dateTime above to simulate your instant luxury quote.
              </p>
            </div>
          </div>
        )}

        <div className="border-t border-[#C9A84C]/10 pt-4 mt-6 text-center text-[0.55rem] uppercase tracking-wider text-[#7C8088]">
          Ministry of Transport Certified Dispatch Service
        </div>
      </div>

    </div>
  );
}
