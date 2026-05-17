"use client";

import { useState, useEffect, useCallback } from "react";
import { useLanguage } from "@/lib/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Calendar,
  ChevronRight,
  ShieldCheck,
  MessageCircle,
  User,
  Phone,
  Mail,
  Globe,
  Languages,
  CreditCard,
  Check,
  ChevronLeft,
  ArrowRight,
  FileText
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { contactConfig } from "@/lib/config/contact";

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

const vehicleList = [
  { key: 'SEDAN' as VehicleKey, name: 'Premium Sedan', desc: 'Toyota Camry or equivalent', cap: 3, luggage: 2, badge: "Best Value", image: "https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=600&q=80" },
  { key: 'SUV' as VehicleKey, name: 'VIP SUV', desc: 'GMC Yukon Denali XL', cap: 6, luggage: 5, badge: "Most Popular", image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80" },
  { key: 'VAN' as VehicleKey, name: 'Luxury Cabin Van', desc: 'Hyundai Staria or equivalent', cap: 7, luggage: 7, badge: "Family Pick", image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=600&q=80" },
  { key: 'LUXURY' as VehicleKey, name: 'Ultra Elite', desc: 'Mercedes S-Class or equivalent', cap: 3, luggage: 3, badge: "VIP Choice", image: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=600&q=80" },
  { key: 'BUS' as VehicleKey, name: 'Coaster/Bus', desc: 'VIP Pilgrim Bus', cap: 18, luggage: 15, badge: "Pilgrims Hub", image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80" },
];

export default function BookPage() {
  const { language } = useLanguage();
  const isRtl = language === "ar";

  // Wizard Steps (1-6)
  const [step, setStep] = useState(1);

  // Form State
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [returnDateTime, setReturnDateTime] = useState("");
  const [passengers, setPassengers] = useState(2);
  const [tripType, setTripType] = useState<"oneway" | "roundtrip" | "hourly">("oneway");
  const [hours, setHours] = useState(4);
  const [flightNumber, setFlightNumber] = useState("");
  const [specialNotes, setSpecialNotes] = useState("");

  // Step 2 Vehicle Selection
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleKey>('SUV');
  const [computedPrices, setComputedPrices] = useState<Record<VehicleKey, PricingResponse | null>>({
    SEDAN: null, SUV: null, VAN: null, LUXURY: null, BUS: null
  });
  const [loadingPrices, setLoadingPrices] = useState(false);

  // Step 3 Addons
  const [addons, setAddons] = useState({
    childSeat: false,
    meetAndGreet: false,
    extraWaiting: false,
    wheelchairFilter: false,
    prayerMat: false,
    waterBottles: false
  });

  // Step 4 Customer
  const [custName, setCustName] = useState("");
  const [custPhone, setCustPhone] = useState("");
  const [phoneCode, setPhoneCode] = useState("+966");
  const [custEmail, setCustEmail] = useState("");
  const [nationality, setNationality] = useState("Saudi Arabia");
  const [preferredLang, setPreferredLang] = useState<"en" | "ar" | "ur">("en");

  // Step 5 Payment
  const [payMethod, setPayMethod] = useState<"card" | "applepay" | "arrival">("card");
  const [payDeposit, setPayDeposit] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [promoDiscount, setPromoDiscount] = useState(0); // in ratio e.g. 0.10
  const [termsAgreed, setTermsAgreed] = useState(false);

  // Step 6 Confirmation details
  const [bookingRef, setBookingRef] = useState("");
  const [notificationLogs, setNotificationLogs] = useState<string[]>([]);
  const [creatingBooking, setCreatingBooking] = useState(false);

  // Autocomplete UI dropdown filters
  const [pickupSuggestions, setPickupSuggestions] = useState<string[]>([]);
  const [dropoffSuggestions, setDropoffSuggestions] = useState<string[]>([]);
  const [showPickupList, setShowPickupList] = useState(false);
  const [showDropoffList, setShowDropoffList] = useState(false);

  // Load state from sessionStorage if returning
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = sessionStorage.getItem("rlt_booking_draft");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.pickup) setPickup(parsed.pickup);
          if (parsed.dropoff) setDropoff(parsed.dropoff);
          if (parsed.dateTime) setDateTime(parsed.dateTime);
          if (parsed.tripType) setTripType(parsed.tripType);
          if (parsed.passengers) setPassengers(parsed.passengers);
          if (parsed.selectedVehicle) setSelectedVehicle(parsed.selectedVehicle);
          if (parsed.custName) setCustName(parsed.custName);
          if (parsed.custPhone) setCustPhone(parsed.custPhone);
          if (parsed.custEmail) setCustEmail(parsed.custEmail);
        }
      } catch (e) {
        console.warn("Session restore skipped:", e);
      }
    }
  }, []);

  // Save progress
  const persistProgress = useCallback(() => {
    if (typeof window !== "undefined") {
      const draft = {
        pickup, dropoff, dateTime, tripType, passengers, selectedVehicle,
        custName, custPhone, custEmail
      };
      sessionStorage.setItem("rlt_booking_draft", JSON.stringify(draft));
    }
  }, [pickup, dropoff, dateTime, tripType, passengers, selectedVehicle, custName, custPhone, custEmail]);

  useEffect(() => {
    persistProgress();
  }, [persistProgress]);

  // Default date setup (2 hours from now)
  useEffect(() => {
    if (!dateTime) {
      const now = new Date();
      now.setHours(now.getHours() + 2);
      const tzoffset = now.getTimezoneOffset() * 60000;
      const localTime = new Date(now.getTime() - tzoffset).toISOString().slice(0, 16);
      setDateTime(localTime);
    }
  }, [dateTime]);

  // Fetch prices for all vehicle types
  const fetchAllPrices = async () => {
    if (pickup.length < 3 || dropoff.length < 3) return;
    try {
      setLoadingPrices(true);
      const vehicleKeys: VehicleKey[] = ['SEDAN', 'SUV', 'VAN', 'LUXURY', 'BUS'];
      const responses: Record<VehicleKey, PricingResponse | null> = {
        SEDAN: null, SUV: null, VAN: null, LUXURY: null, BUS: null
      };

      for (const vk of vehicleKeys) {
        try {
          const res = await fetch("/api/pricing", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              pickup,
              dropoff,
              vehicleType: vk,
              dateTime,
              isRoundTrip: tripType === "roundtrip"
            })
          });
          if (res.ok) {
            responses[vk] = await res.json();
          }
        } catch (singleErr) {
          console.error(`Fares estimate failed for class ${vk}:`, singleErr);
        }
      }
      setComputedPrices(responses);
    } catch (err) {
      console.error("Global pricing sync error:", err);
    } finally {
      setLoadingPrices(false);
    }
  };

  const handlePickupChange = (val: string) => {
    setPickup(val);
    if (val.trim() === "") {
      setPickupSuggestions([]);
    } else {
      setPickupSuggestions(defaultSuggestions.filter(s => s.toLowerCase().includes(val.toLowerCase())));
    }
  };

  const handleDropoffChange = (val: string) => {
    setDropoff(val);
    if (val.trim() === "") {
      setDropoffSuggestions([]);
    } else {
      setDropoffSuggestions(defaultSuggestions.filter(s => s.toLowerCase().includes(val.toLowerCase())));
    }
  };

  // Google Autocomplete manual setup fallback
  const setupGoogleAutocomplete = useCallback(() => {
    try {
      const pickupInput = document.getElementById("pickup-location") as HTMLInputElement;
      const dropoffInput = document.getElementById("dropoff-location") as HTMLInputElement;
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

  useEffect(() => {
    const mapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
    if (mapsKey && typeof window !== "undefined") {
      const gWindow = window as unknown as { google?: typeof google };
      if (gWindow.google && gWindow.google.maps && gWindow.google.maps.places) {
        setupGoogleAutocomplete();
      }
    }
  }, [setupGoogleAutocomplete]);

  // Price computations for review step
  const activePricing = computedPrices[selectedVehicle];
  const basePrice = activePricing ? activePricing.price : 250;

  // Surcharge for addons
  const addonTotal =
    (addons.childSeat ? 30 : 0) +
    (addons.meetAndGreet ? 20 : 0) +
    (addons.extraWaiting ? 40 : 0) +
    (addons.waterBottles ? 10 : 0);

  const subtotalBeforePromo = basePrice + addonTotal;
  const promoDiscountAmount = Math.round(subtotalBeforePromo * promoDiscount);
  const subtotalAfterPromo = subtotalBeforePromo - promoDiscountAmount;

  // 15% VAT included
  const vatAmount = Math.round(subtotalAfterPromo * 0.15);
  const finalTotalPrice = subtotalAfterPromo; // Pricing is already VAT inclusive or inclusive, let's treat it as total price

  const depositDue = Math.round(finalTotalPrice * 0.20);
  const remainingDue = finalTotalPrice - depositDue;

  // Promo code verification
  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (code === "WELCOME10") {
      setPromoDiscount(0.10);
      alert("Promo code WELCOME10 applied! 10% discount added to your transfer.");
    } else if (code === "RAMADAN26") {
      setPromoDiscount(0.15);
      alert("Promo code RAMADAN26 applied! 15% Ramadan discount added.");
    } else {
      alert("Invalid promo code.");
      setPromoDiscount(0);
    }
  };

  // Submit Booking to database (POST /api/bookings)
  const handleFinalizeBooking = async () => {
    if (payMethod === "card" && (cardNumber.length < 16 || cardCvv.length < 3)) {
      alert("Please check your payment card details.");
      return;
    }

    try {
      setCreatingBooking(true);
      setNotificationLogs([]);

      // Make API POST request
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pickup,
          dropoff,
          dateTime,
          isRoundTrip: tripType === "roundtrip",
          returnDateTime: tripType === "roundtrip" ? returnDateTime : null,
          passengers,
          vehicleType: selectedVehicle,
          customerName: custName,
          customerPhone: `${phoneCode}${custPhone}`,
          customerEmail: custEmail || null,
          notes: specialNotes || null,
          flightNumber: flightNumber || null,
          paymentMethod: payMethod,
          totalPrice: finalTotalPrice
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to create booking");
      }

      const data = await res.json();
      setBookingRef(data.bookingRef);

      // Simulate dispatch alerts
      setNotificationLogs([
        "⏱️ Booking recorded in Riyadh Luxe Dispatch central database.",
        `🔐 Security Ref assigned: ${data.bookingRef}`,
        "📲 Twilio SMS notification queued successfully for "+phoneCode+" "+custPhone+".",
        custEmail ? `📧 Resend luxury invoice dispatch confirmation queued for ${custEmail}.` : "📧 Optional email dispatch notice skipped (no email provided)."
      ]);

      // Complete to step 6
      setStep(6);
      // Clear draft
      sessionStorage.removeItem("rlt_booking_draft");

    } catch (err) {
      alert(err instanceof Error ? err.message : "Dispatch request failed");
    } finally {
      setCreatingBooking(false);
    }
  };

  // Step validation triggers
  const handleNextStep = () => {
    if (step === 1) {
      if (pickup.length < 5 || dropoff.length < 5) {
        alert("Please select valid pickup and dropoff points.");
        return;
      }
      if (!dateTime) {
        alert("Please set pick-up date & time.");
        return;
      }
      // Load pricing
      void fetchAllPrices();
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      setStep(4);
    } else if (step === 4) {
      if (custName.trim().length < 2) {
        alert("Please provide full name.");
        return;
      }
      if (custPhone.trim().length < 6) {
        alert("Please enter a valid phone number.");
        return;
      }
      setStep(5);
    }
  };

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8] pt-32 pb-24 relative overflow-hidden">
      
      {/* Background radial luxury glows */}
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-[#C9A84C]/5 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-[#C9A84C]/2.5 blur-3xl pointer-events-none" />

      <div className="section-container relative z-10 max-w-4xl mx-auto space-y-10 text-left">
        
        {/* PROGRESS STEP INDICATOR (1-6) */}
        <div className="relative">
          <div className="flex items-center justify-between text-[0.55rem] font-bold uppercase tracking-wider text-[#7C8088]">
            <span className={step >= 1 ? "text-[#C9A84C]" : ""}>{isRtl ? "١. التفاصيل" : "1. Journey"}</span>
            <span className={step >= 2 ? "text-[#C9A84C]" : ""}>{isRtl ? "٢. السيارة" : "2. Vehicle"}</span>
            <span className={step >= 3 ? "text-[#C9A84C]" : ""}>{isRtl ? "٣. الإضافات" : "3. Extras"}</span>
            <span className={step >= 4 ? "text-[#C9A84C]" : ""}>{isRtl ? "٤. العميل" : "4. Contact"}</span>
            <span className={step >= 5 ? "text-[#C9A84C]" : ""}>{isRtl ? "٥. الدفع" : "5. Summary"}</span>
            <span className={step >= 6 ? "text-[#C9A84C]" : ""}>{isRtl ? "٦. تأكيد" : "6. Done"}</span>
          </div>

          <div className="mt-3 h-1 w-full bg-black/45 rounded-full overflow-hidden border border-[#C9A84C]/10">
            <motion.div
              className="h-full bg-gradient-to-r from-[#C9A84C] to-[#B8963B]"
              initial={{ width: "16.6%" }}
              animate={{ width: `${(step / 6) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* WIZARD SCREENS CAROUSEL / CHANGER */}
        <AnimatePresence mode="wait">
          
          {/* STEP 1: JOURNEY DETAILS */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              className="space-y-6"
            >
              <div className="space-y-1">
                <h2 className="font-heading text-2xl font-bold">{isRtl ? "تفاصيل رحلتك الفاخرة" : "Enter Journey Coordinates"}</h2>
                <p className="text-xs text-[#A1A1A6]">{isRtl ? "حدد وجهتك وتاريخ الرحلة وخيارات مسارك لتعديل الأسعار التلقائي." : "Specify transfer points, schedule details, and vehicle sizing."}</p>
              </div>

              <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
                
                {/* Inputs block */}
                <div className="space-y-4 rounded-3xl border border-[#C9A84C]/15 bg-[#121212] p-6 shadow-2xl">
                  
                  {/* Trip type selector */}
                  <div className="grid grid-cols-3 gap-2 p-1 bg-black/40 rounded-full border border-[#C9A84C]/10">
                    <button
                      type="button"
                      onClick={() => { setTripType("oneway"); }}
                      className={`rounded-full py-2 text-[0.65rem] font-bold uppercase transition-all ${tripType === "oneway" ? "bg-[#C9A84C] text-[#0A0A0A]" : "text-[#A1A1A6] hover:text-[#F5F0E8]"}`}
                    >
                      {isRtl ? "اتجاه واحد" : "One-Way"}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setTripType("roundtrip"); }}
                      className={`rounded-full py-2 text-[0.65rem] font-bold uppercase transition-all ${tripType === "roundtrip" ? "bg-[#C9A84C] text-[#0A0A0A]" : "text-[#A1A1A6] hover:text-[#F5F0E8]"}`}
                    >
                      {isRtl ? "ذهاب وعودة" : "Round-Trip"}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setTripType("hourly"); }}
                      className={`rounded-full py-2 text-[0.65rem] font-bold uppercase transition-all ${tripType === "hourly" ? "bg-[#C9A84C] text-[#0A0A0A]" : "text-[#A1A1A6] hover:text-[#F5F0E8]"}`}
                    >
                      {isRtl ? "حجز بالساعات" : "Hourly Charter"}
                    </button>
                  </div>

                  {/* Pickup */}
                  <div className="relative">
                    <label className="block text-[0.6rem] uppercase tracking-wider text-[#A1A1A6] mb-1 font-bold">
                      {isRtl ? "موقع الركوب" : "Pick-up Location"}
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-[#C9A84C]" />
                      <input
                        id="pickup-location"
                        type="text"
                        required
                        value={pickup}
                        onChange={(e) => handlePickupChange(e.target.value)}
                        onFocus={() => setShowPickupList(true)}
                        onBlur={() => setTimeout(() => setShowPickupList(false), 250)}
                        placeholder={isRtl ? "ابحث عن مطار، معلم أو فندق..." : "Search Airport, hotel, landmark..."}
                        className="w-full rounded-xl bg-black/40 border border-[#C9A84C]/10 pl-9 pr-4 py-3 text-xs text-[#F5F0E8] placeholder-[#7C8088] outline-none focus:border-[#C9A84C]"
                      />
                    </div>

                    {showPickupList && pickupSuggestions.length > 0 && (
                      <div className="absolute z-20 left-0 right-0 mt-1 max-h-48 overflow-y-auto rounded-xl border border-[#C9A84C]/20 bg-[#121212] p-2 shadow-2xl">
                        {pickupSuggestions.map((s, i) => (
                          <button
                            key={i}
                            type="button"
                            onMouseDown={() => { setPickup(s); setPickupSuggestions([]); }}
                            className="w-full text-left px-3 py-2 text-[0.65rem] text-[#A1A1A6] hover:text-[#C9A84C] hover:bg-white/2 rounded transition-colors"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Drop-off */}
                  {tripType !== "hourly" && (
                    <div className="relative">
                      <label className="block text-[0.6rem] uppercase tracking-wider text-[#A1A1A6] mb-1 font-bold">
                        {isRtl ? "الوجهة" : "Drop-off Destination"}
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-[#C9A84C]" />
                        <input
                          id="dropoff-location"
                          type="text"
                          required
                          value={dropoff}
                          onChange={(e) => handleDropoffChange(e.target.value)}
                          onFocus={() => setShowDropoffList(true)}
                          onBlur={() => setTimeout(() => setShowDropoffList(false), 250)}
                          placeholder={isRtl ? "ابحث عن وجهة الحجز..." : "Search drop-off landmark..."}
                          className="w-full rounded-xl bg-black/40 border border-[#C9A84C]/10 pl-9 pr-4 py-3 text-xs text-[#F5F0E8] placeholder-[#7C8088] outline-none focus:border-[#C9A84C]"
                        />
                      </div>

                      {showDropoffList && dropoffSuggestions.length > 0 && (
                        <div className="absolute z-20 left-0 right-0 mt-1 max-h-48 overflow-y-auto rounded-xl border border-[#C9A84C]/20 bg-[#121212] p-2 shadow-2xl">
                          {dropoffSuggestions.map((s, i) => (
                            <button
                              key={i}
                              type="button"
                              onMouseDown={() => { setDropoff(s); setDropoffSuggestions([]); }}
                              className="w-full text-left px-3 py-2 text-[0.65rem] text-[#A1A1A6] hover:text-[#C9A84C] hover:bg-white/2 rounded transition-colors"
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Hourly Charter Sizing */}
                  {tripType === "hourly" && (
                    <div>
                      <label className="block text-[0.6rem] uppercase tracking-wider text-[#A1A1A6] mb-2 font-bold">
                        {isRtl ? "مدة الخدمة المطلوبة" : "Charter Sizing (Hours)"}
                      </label>
                      <select
                        value={hours}
                        onChange={(e) => {
                          setHours(Number(e.target.value));
                          setDropoff(`Riyadh Hourly Charter (${e.target.value} Hours)`);
                        }}
                        className="w-full rounded-xl bg-black/40 border border-[#C9A84C]/10 px-3 py-3 text-xs text-[#F5F0E8] outline-none focus:border-[#C9A84C]"
                      >
                        <option value="4">4 Hours Charter (Half Day)</option>
                        <option value="8">8 Hours Charter (Full Day)</option>
                        <option value="12">12 Hours Charter (VIP Touring)</option>
                        <option value="24">24 Hours Full Concierge Dispatch</option>
                      </select>
                    </div>
                  )}

                  {/* Date Picker */}
                  <div className="grid gap-4 grid-cols-2">
                    <div>
                      <label className="block text-[0.6rem] uppercase tracking-wider text-[#A1A1A6] mb-1 font-bold">
                        {isRtl ? "التاريخ والوقت" : "Pick-up DateTime"}
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3.5 h-4 w-4 text-[#C9A84C]/75 pointer-events-none" />
                        <input
                          type="datetime-local"
                          required
                          value={dateTime}
                          onChange={(e) => setDateTime(e.target.value)}
                          className="w-full rounded-xl bg-black/40 border border-[#C9A84C]/10 pl-9 pr-3 py-3 text-xs text-[#F5F0E8] outline-none focus:border-[#C9A84C]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[0.6rem] uppercase tracking-wider text-[#A1A1A6] mb-1 font-bold">
                        {isRtl ? "عدد المسافرين" : "Passengers"}
                      </label>
                      <select
                        value={passengers}
                        onChange={(e) => setPassengers(Number(e.target.value))}
                        className="w-full rounded-xl bg-black/40 border border-[#C9A84C]/10 px-3 py-3 text-xs text-[#F5F0E8] outline-none focus:border-[#C9A84C]"
                      >
                        {[...Array(18)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1} {i + 1 === 1 ? (isRtl ? "مسافر" : "Passenger") : (isRtl ? "مسافرين" : "Passengers")}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Return DateTime for Round Trip */}
                  {tripType === "roundtrip" && (
                    <div>
                      <label className="block text-[0.6rem] uppercase tracking-wider text-[#A1A1A6] mb-1 font-bold">
                        {isRtl ? "تاريخ ووقت العودة" : "Return DateTime"}
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3.5 h-4 w-4 text-[#C9A84C]/75 pointer-events-none" />
                        <input
                          type="datetime-local"
                          required
                          value={returnDateTime}
                          onChange={(e) => setReturnDateTime(e.target.value)}
                          className="w-full rounded-xl bg-black/40 border border-[#C9A84C]/10 pl-9 pr-3 py-3 text-xs text-[#F5F0E8] outline-none focus:border-[#C9A84C]"
                        />
                      </div>
                    </div>
                  )}

                  {/* Optional flight details & notes */}
                  <div className="grid gap-4 grid-cols-2">
                    <div>
                      <label className="block text-[0.6rem] uppercase tracking-wider text-[#A1A1A6] mb-1 font-bold">
                        {isRtl ? "رقم الرحلة (اختياري)" : "Flight Number (Opt)"}
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. SV-120"
                        value={flightNumber}
                        onChange={(e) => setFlightNumber(e.target.value)}
                        className="w-full rounded-xl bg-black/40 border border-[#C9A84C]/10 px-3 py-3 text-xs text-[#F5F0E8] outline-none focus:border-[#C9A84C]"
                      />
                    </div>

                    <div>
                      <label className="block text-[0.6rem] uppercase tracking-wider text-[#A1A1A6] mb-1 font-bold">
                        {isRtl ? "ملاحظات إضافية" : "Special Notes"}
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Need extra luggage room"
                        value={specialNotes}
                        onChange={(e) => setSpecialNotes(e.target.value)}
                        className="w-full rounded-xl bg-black/40 border border-[#C9A84C]/10 px-3 py-3 text-xs text-[#F5F0E8] outline-none focus:border-[#C9A84C]"
                      />
                    </div>
                  </div>

                </div>

                {/* Vector Glowing Grid Fallback Map Preview */}
                <div className="rounded-3xl border border-[#C9A84C]/15 bg-[#121212] overflow-hidden flex flex-col justify-between p-6 h-full relative">
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#C9A84C_1px,transparent_1px),linear-gradient(to_bottom,#C9A84C_1px,transparent_1px)] bg-[size:25px_25px] opacity-5 pointer-events-none" />

                  <div className="space-y-1">
                    <span className="text-[0.65rem] uppercase tracking-wider text-[#C9A84C] font-bold">
                      {isRtl ? "معاينة إحداثيات المسار" : "Transfer Coordinates Preview"}
                    </span>
                    <h3 className="font-heading text-lg font-bold">Riyadh Luxe Dispatch GPS</h3>
                  </div>

                  {/* Route Visualizer SVG */}
                  <div className="h-44 w-full flex items-center justify-center my-4 bg-black/60 rounded-2xl border border-[#C9A84C]/10 overflow-hidden relative">
                    <svg className="w-full h-full max-w-[280px]" viewBox="0 0 300 150">
                      <path d="M 40 100 C 100 40, 200 40, 260 100" fill="none" stroke="#C9A84C" strokeWidth="2" strokeDasharray="5 5" opacity="0.4" />
                      <motion.path
                        d="M 40 100 C 100 40, 200 40, 260 100"
                        fill="none"
                        stroke="#C9A84C"
                        strokeWidth="3"
                        initial={{ strokeDasharray: "300", strokeDashoffset: "300" }}
                        animate={{ strokeDashoffset: 0 }}
                        transition={{ duration: 4, repeat: Infinity }}
                      />
                      <circle cx="40" cy="100" r="6" fill="#0A0A0A" stroke="#C9A84C" strokeWidth="2" />
                      <circle cx="260" cy="100" r="6" fill="#C9A84C" />
                    </svg>

                    <div className="absolute bottom-3 left-3 text-[0.55rem] text-[#7C8088] font-bold uppercase">
                      Saudi Route Sync
                    </div>
                  </div>

                  <button
                    onClick={handleNextStep}
                    className="flex items-center justify-center gap-2 w-full rounded-full bg-[#C9A84C] py-4 text-xs font-bold uppercase tracking-wider text-[#0A0A0A] shadow-[0_4px_20px_rgba(201,168,76,0.3)] transition-all hover:bg-[#B8963B]"
                  >
                    <span>{isRtl ? "عرض السيارات المتاحة" : "View Available Fleet"}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>

                </div>

              </div>
            </motion.div>
          )}

          {/* STEP 2: CHOOSE VEHICLE */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between border-b border-[#C9A84C]/10 pb-4">
                <div>
                  <h2 className="font-heading text-2xl font-bold">{isRtl ? "اختر سيارتك الفاخرة" : "Select Reserved Class"}</h2>
                  <p className="text-xs text-[#A1A1A6]">{isRtl ? "مقارنة الأسعار الثابتة الشاملة للضريبة لجميع فئات أسطولنا." : "Compare KSA VAT-inclusive flat rates for your journey coordinates."}</p>
                </div>

                <button
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-1.5 text-xs text-[#C9A84C] hover:underline"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>{isRtl ? "تعديل المسار" : "Adjust Journey"}</span>
                </button>
              </div>

              {loadingPrices ? (
                <div className="flex flex-col items-center justify-center py-20 bg-[#121212] border border-[#C9A84C]/10 rounded-3xl">
                  <span className="h-8 w-8 animate-spin rounded-full border-4 border-[#C9A84C] border-t-transparent mb-4" />
                  <p className="text-xs text-[#7C8088]">Calculating dynamic rates...</p>
                </div>
              ) : (
                <div className="grid gap-6">
                  {vehicleList.map((veh) => {
                    const priceData = computedPrices[veh.key];
                    const routePrice = priceData ? priceData.price : 350;
                    
                    // Capacity lockout check
                    const isSoldOut = passengers > veh.cap;

                    return (
                      <article
                        key={veh.key}
                        onClick={() => { if (!isSoldOut) setSelectedVehicle(veh.key); }}
                        className={`group relative overflow-hidden rounded-3xl border transition-all duration-300 grid md:grid-cols-[0.8fr_1.2fr] ${
                          isSoldOut
                            ? "border-red-950/20 bg-[#121212]/40 opacity-50 cursor-not-allowed"
                            : selectedVehicle === veh.key
                            ? "border-[#C9A84C] bg-[#1A1813] shadow-[0_8px_30px_rgba(201,168,76,0.1)] scale-101"
                            : "border-[#C9A84C]/10 bg-[#121212] hover:border-[#C9A84C]/35 cursor-pointer"
                        }`}
                      >
                        {/* Vehicle Image */}
                        <div className="relative h-48 md:h-full w-full min-h-[160px] overflow-hidden">
                          <Image
                            src={veh.image}
                            alt={veh.name}
                            fill
                            className="object-cover transition-transform duration-750 group-hover:scale-103"
                          />

                          {/* Top tags */}
                          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                            <span className="rounded-full bg-black/80 px-3 py-1 text-[0.55rem] font-bold uppercase tracking-wider text-[#C9A84C] border border-[#C9A84C]/25">
                              {veh.badge}
                            </span>
                            {isSoldOut && (
                              <span className="rounded-full bg-red-950 border border-red-800 px-3 py-1 text-[0.55rem] font-bold uppercase text-red-300">
                                Size Limit Exceeded
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Details specs */}
                        <div className="p-6 flex flex-col justify-between text-left space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h3 className="font-heading text-lg font-bold text-[#F5F0E8] group-hover:text-[#C9A84C] transition-colors">
                                {veh.name}
                              </h3>
                              
                              <div className="text-right">
                                <p className="text-[0.55rem] text-[#7C8088] uppercase tracking-wider font-bold">Guaranteed Price</p>
                                <p className="font-heading text-xl font-bold text-[#C9A84C]">
                                  SAR {routePrice}
                                </p>
                              </div>
                            </div>

                            <p className="text-xs text-[#A1A1A6]">{veh.desc}</p>
                          </div>

                          <div className="flex items-center justify-between border-t border-[#C9A84C]/10 pt-4">
                            <div className="flex items-center gap-4 text-[0.65rem] text-[#7C8088] font-bold">
                              <span>👥 Max {veh.cap} Pax</span>
                              <span className="h-1.5 w-1.5 rounded-full bg-[#C9A84C]" />
                              <span>🧳 {veh.luggage} Bags</span>
                            </div>

                            {!isSoldOut && (
                              <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${selectedVehicle === veh.key ? "border-[#C9A84C] bg-[#C9A84C]" : "border-[#7C8088]/20"}`}>
                                {selectedVehicle === veh.key && <Check className="h-3.5 w-3.5 text-[#0A0A0A] stroke-[3]" />}
                              </div>
                            )}
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}

              {/* Navigation button */}
              <div className="flex justify-end pt-4">
                <button
                  onClick={handleNextStep}
                  disabled={loadingPrices}
                  className="flex items-center justify-center gap-2 rounded-full bg-[#C9A84C] px-8 py-4 text-xs font-bold uppercase tracking-wider text-[#0A0A0A] transition-all hover:bg-[#B8963B] shadow-[0_4px_20px_rgba(201,168,76,0.3)]"
                >
                  <span>{isRtl ? "المتابعة للإضافات" : "Continue to Extras"}</span>
                  <ChevronRight className="h-4.5 w-4.5" />
                </button>
              </div>

            </motion.div>
          )}

          {/* STEP 3: ADDONS & EXTRAS */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between border-b border-[#C9A84C]/10 pb-4">
                <div>
                  <h2 className="font-heading text-2xl font-bold">{isRtl ? "الإضافات والخدمات الخاصة" : "Tailor Your VIP Experience"}</h2>
                  <p className="text-xs text-[#A1A1A6]">{isRtl ? "خيارات دربان مخصصة لتأمين أقصى سبل الراحة والترحيب بضيوفكم." : "Premium amenities to enhance pilgrim comfort or executive hospitality."}</p>
                </div>

                <button
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-1.5 text-xs text-[#C9A84C] hover:underline"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>{isRtl ? "تغيير السيارة" : "Change Vehicle"}</span>
                </button>
              </div>

              {/* Addon Selection Grid */}
              <div className="grid gap-4 md:grid-cols-2">
                
                {/* Child Seat */}
                <div
                  onClick={() => setAddons(a => ({ ...a, childSeat: !a.childSeat }))}
                  className={`rounded-2xl border p-5 text-left flex justify-between items-start transition-all cursor-pointer ${addons.childSeat ? "border-[#C9A84C] bg-[#1A1813]" : "border-[#C9A84C]/10 bg-[#121212] hover:border-[#C9A84C]/30"}`}
                >
                  <div className="space-y-1.5 max-w-[200px]">
                    <h4 className="text-sm font-bold text-[#F5F0E8]">{isRtl ? "كرسي أطفال آمن" : "Child Safety Seat"}</h4>
                    <p className="text-[0.6rem] text-[#A1A1A6] leading-relaxed">Required for babies and toddlers under 4 years old in KSA.</p>
                  </div>
                  <span className="text-xs font-bold text-[#C9A84C]">+SAR 30</span>
                </div>

                {/* Meet and Greet */}
                <div
                  onClick={() => setAddons(a => ({ ...a, meetAndGreet: !a.meetAndGreet }))}
                  className={`rounded-2xl border p-5 text-left flex justify-between items-start transition-all cursor-pointer ${addons.meetAndGreet ? "border-[#C9A84C] bg-[#1A1813]" : "border-[#C9A84C]/10 bg-[#121212] hover:border-[#C9A84C]/30"}`}
                >
                  <div className="space-y-1.5 max-w-[200px]">
                    <h4 className="text-sm font-bold text-[#F5F0E8]">{isRtl ? "الاستقبال والترحيب بالمطار" : "Airport Meet & Greet"}</h4>
                    <p className="text-[0.6rem] text-[#A1A1A6] leading-relaxed">Chauffeur greets you at arrivals holding a luxury VIP sign.</p>
                  </div>
                  <span className="text-xs font-bold text-[#C9A84C]">+SAR 20</span>
                </div>

                {/* Extra Waiting */}
                <div
                  onClick={() => setAddons(a => ({ ...a, extraWaiting: !a.extraWaiting }))}
                  className={`rounded-2xl border p-5 text-left flex justify-between items-start transition-all cursor-pointer ${addons.extraWaiting ? "border-[#C9A84C] bg-[#1A1813]" : "border-[#C9A84C]/10 bg-[#121212] hover:border-[#C9A84C]/30"}`}
                >
                  <div className="space-y-1.5 max-w-[200px]">
                    <h4 className="text-sm font-bold text-[#F5F0E8]">{isRtl ? "وقت انتظار إضافي (٣٠ دقيقة)" : "Extra Waiting Time"}</h4>
                    <p className="text-[0.6rem] text-[#A1A1A6] leading-relaxed">Extend driver standby window at your coordinates.</p>
                  </div>
                  <span className="text-xs font-bold text-[#C9A84C]">+SAR 40</span>
                </div>

                {/* Chilled Water Bottles */}
                <div
                  onClick={() => setAddons(a => ({ ...a, waterBottles: !a.waterBottles }))}
                  className={`rounded-2xl border p-5 text-left flex justify-between items-start transition-all cursor-pointer ${addons.waterBottles ? "border-[#C9A84C] bg-[#1A1813]" : "border-[#C9A84C]/10 bg-[#121212] hover:border-[#C9A84C]/30"}`}
                >
                  <div className="space-y-1.5 max-w-[200px]">
                    <h4 className="text-sm font-bold text-[#F5F0E8]">{isRtl ? "مياه باردة فاخرة" : "Premium Chilled Water"}</h4>
                    <p className="text-[0.6rem] text-[#A1A1A6] leading-relaxed">Bottled premium chilled water stocked in vehicle.</p>
                  </div>
                  <span className="text-xs font-bold text-[#C9A84C]">+SAR 10</span>
                </div>

                {/* Prayer Mat Stop */}
                <div
                  onClick={() => setAddons(a => ({ ...a, prayerMat: !a.prayerMat }))}
                  className={`rounded-2xl border p-5 text-left flex justify-between items-start transition-all cursor-pointer ${addons.prayerMat ? "border-[#C9A84C] bg-[#1A1813]" : "border-[#C9A84C]/10 bg-[#121212] hover:border-[#C9A84C]/30"}`}
                >
                  <div className="space-y-1.5 max-w-[200px]">
                    <h4 className="text-sm font-bold text-[#F5F0E8]">{isRtl ? "سجادة صلاة معقمة" : "Sterilized Prayer Mat"}</h4>
                    <p className="text-[0.6rem] text-[#A1A1A6] leading-relaxed">Sterilized pilgrim prayer mat loaded in back cabin.</p>
                  </div>
                  <span className="text-xs font-bold text-green-400">Complimentary</span>
                </div>

                {/* Wheelchair accessible filter */}
                <div
                  onClick={() => setAddons(a => ({ ...a, wheelchairFilter: !a.wheelchairFilter }))}
                  className={`rounded-2xl border p-5 text-left flex justify-between items-start transition-all cursor-pointer ${addons.wheelchairFilter ? "border-[#C9A84C] bg-[#1A1813]" : "border-[#C9A84C]/10 bg-[#121212] hover:border-[#C9A84C]/30"}`}
                >
                  <div className="space-y-1.5 max-w-[200px]">
                    <h4 className="text-sm font-bold text-[#F5F0E8]">{isRtl ? "مركبة مهيئة للكراسي" : "Wheelchair Facility"}</h4>
                    <p className="text-[0.6rem] text-[#A1A1A6] leading-relaxed">Lock a vehicle that supports folding wheelchair loading.</p>
                  </div>
                  <span className="text-xs font-bold text-green-400">Filter Applied</span>
                </div>

              </div>

              {/* Navigation button */}
              <div className="flex justify-between pt-4 border-t border-[#C9A84C]/10">
                <button
                  onClick={() => setStep(2)}
                  className="flex items-center justify-center gap-1.5 rounded-full border border-[#C9A84C]/25 bg-black/45 px-6 py-4 text-xs font-bold text-[#C9A84C] hover:bg-[#C9A84C]/10 transition-all"
                >
                  <ChevronLeft className="h-4.5 w-4.5" />
                  <span>Back</span>
                </button>

                <button
                  onClick={handleNextStep}
                  className="flex items-center justify-center gap-2 rounded-full bg-[#C9A84C] px-8 py-4 text-xs font-bold uppercase tracking-wider text-[#0A0A0A] transition-all hover:bg-[#B8963B] shadow-[0_4px_20px_rgba(201,168,76,0.3)]"
                >
                  <span>{isRtl ? "المتابعة لبيانات الاتصال" : "Continue to Contact"}</span>
                  <ChevronRight className="h-4.5 w-4.5" />
                </button>
              </div>

            </motion.div>
          )}

          {/* STEP 4: CUSTOMER DETAILS */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between border-b border-[#C9A84C]/10 pb-4">
                <div>
                  <h2 className="font-heading text-2xl font-bold">{isRtl ? "معلومات الاتصال والمسافر" : "VIP Passenger Registry"}</h2>
                  <p className="text-xs text-[#A1A1A6]">{isRtl ? "أدخل تفاصيل الاتصال لإرسال بيانات السائق ورقم اللوحة فورا." : "Specify target contacts to receive dispatch verification alerts."}</p>
                </div>

                <button
                  onClick={() => setStep(3)}
                  className="inline-flex items-center gap-1.5 text-xs text-[#C9A84C] hover:underline"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>{isRtl ? "تعديل الإضافات" : "Edit Amenities"}</span>
                </button>
              </div>

              {/* Registration Prompt Loyalty */}
              <div className="rounded-2xl border border-amber-900/30 bg-amber-950/5 p-5 flex items-start gap-4">
                <ShieldCheck className="h-6 w-6 text-[#C9A84C] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-[#F5F0E8]">
                    {isRtl ? "هل ترغب في كسب ١٥٠ نقطة ولاء فاخرة؟" : "Unlock 150 VIP Luxe Points Today"}
                  </h4>
                  <p className="text-[0.6rem] text-[#A1A1A6] leading-relaxed mt-1">
                    {isRtl
                      ? "قم بتسجيل الدخول أو إنشاء حساب الآن لحفظ تفاصيل هذا الحجز، والاستفادة من خصومات رحلتك القادمة."
                      : "Sign in or create an account to lock this dispatch into your client dashboard and trigger loyalty program rewards."}
                  </p>
                  <div className="mt-3 flex gap-2">
                    <Link
                      href="/admin/login"
                      className="rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/35 px-4.5 py-1 text-[0.55rem] font-bold text-[#C9A84C] hover:bg-[#C9A84C] hover:text-[#0A0A0A] transition-all"
                    >
                      Sign In / Register
                    </Link>
                  </div>
                </div>
              </div>

              {/* Form panel inputs */}
              <div className="rounded-3xl border border-[#C9A84C]/15 bg-[#121212] p-6 space-y-4">
                
                {/* Full name */}
                <div>
                  <label className="block text-[0.6rem] uppercase tracking-wider text-[#A1A1A6] mb-1.5 font-bold">
                    {isRtl ? "الاسم الكامل للمسافر" : "Passenger Full Name"}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 h-4 w-4 text-[#C9A84C]/75" />
                    <input
                      type="text"
                      required
                      value={custName}
                      onChange={(e) => setCustName(e.target.value)}
                      placeholder="e.g. Muhammad Al-Ghamdi"
                      className="w-full rounded-xl bg-black/40 border border-[#C9A84C]/10 pl-9 pr-4 py-3.5 text-xs text-[#F5F0E8] placeholder-[#7C8088] outline-none focus:border-[#C9A84C]"
                    />
                  </div>
                </div>

                {/* Contact phone with code */}
                <div className="grid gap-4 grid-cols-[0.3fr_0.7fr]">
                  <div>
                    <label className="block text-[0.6rem] uppercase tracking-wider text-[#A1A1A6] mb-1.5 font-bold">
                      Code
                    </label>
                    <select
                      value={phoneCode}
                      onChange={(e) => setPhoneCode(e.target.value)}
                      className="w-full rounded-xl bg-black/40 border border-[#C9A84C]/10 px-2 py-3.5 text-xs text-[#F5F0E8] outline-none focus:border-[#C9A84C]"
                    >
                      <option value="+966">KSA (+966)</option>
                      <option value="+971">UAE (+971)</option>
                      <option value="+974">QAT (+974)</option>
                      <option value="+973">BAH (+973)</option>
                      <option value="+968">OMN (+968)</option>
                      <option value="+965">KWT (+965)</option>
                      <option value="+1">USA (+1)</option>
                      <option value="+44">UK (+44)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[0.6rem] uppercase tracking-wider text-[#A1A1A6] mb-1.5 font-bold">
                      {isRtl ? "رقم الهاتف والواتساب" : "WhatsApp Phone Number"}
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3.5 h-4 w-4 text-[#C9A84C]/75" />
                      <input
                        type="text"
                        required
                        value={custPhone}
                        onChange={(e) => setCustPhone(e.target.value)}
                        placeholder="e.g. 500123456"
                        className="w-full rounded-xl bg-black/40 border border-[#C9A84C]/10 pl-9 pr-4 py-3.5 text-xs text-[#F5F0E8] placeholder-[#7C8088] outline-none focus:border-[#C9A84C]"
                      />
                    </div>
                  </div>
                </div>

                {/* Email and nationality */}
                <div className="grid gap-4 grid-cols-2">
                  <div>
                    <label className="block text-[0.6rem] uppercase tracking-wider text-[#A1A1A6] mb-1.5 font-bold">
                      {isRtl ? "البريد الإلكتروني (اختياري)" : "Email Address (Optional)"}
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3.5 h-4 w-4 text-[#C9A84C]/75" />
                      <input
                        type="email"
                        value={custEmail}
                        onChange={(e) => setCustEmail(e.target.value)}
                        placeholder="e.g. client@luxe.sa"
                        className="w-full rounded-xl bg-black/40 border border-[#C9A84C]/10 pl-9 pr-4 py-3.5 text-xs text-[#F5F0E8] placeholder-[#7C8088] outline-none focus:border-[#C9A84C]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[0.6rem] uppercase tracking-wider text-[#A1A1A6] mb-1.5 font-bold">
                      {isRtl ? "الجنسية / البلد" : "Nationality / Country"}
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-3.5 h-4 w-4 text-[#C9A84C]/75" />
                      <input
                        type="text"
                        value={nationality}
                        onChange={(e) => setNationality(e.target.value)}
                        placeholder="e.g. Saudi Arabia"
                        className="w-full rounded-xl bg-black/40 border border-[#C9A84C]/10 pl-9 pr-4 py-3.5 text-xs text-[#F5F0E8] placeholder-[#7C8088] outline-none focus:border-[#C9A84C]"
                      />
                    </div>
                  </div>
                </div>

                {/* Language Select */}
                <div>
                  <label className="block text-[0.6rem] uppercase tracking-wider text-[#A1A1A6] mb-1.5 font-bold">
                    {isRtl ? "لغة السائق المفضلة" : "Preferred Communication Language"}
                  </label>
                  <div className="relative">
                    <Languages className="absolute left-3 top-3.5 h-4 w-4 text-[#C9A84C]/75" />
                    <select
                      value={preferredLang}
                      onChange={(e) => setPreferredLang(e.target.value as "en" | "ar" | "ur")}
                      className="w-full rounded-xl bg-black/40 border border-[#C9A84C]/10 pl-9 pr-3 py-3.5 text-xs text-[#F5F0E8] outline-none focus:border-[#C9A84C]"
                    >
                      <option value="en">English (Chauffeur Standard)</option>
                      <option value="ar">العربية (سائق يتحدث العربية)</option>
                      <option value="ur">اردو (سائق اردو بولنے والا)</option>
                    </select>
                  </div>
                </div>

              </div>

              {/* Navigation button */}
              <div className="flex justify-between pt-4 border-t border-[#C9A84C]/10">
                <button
                  onClick={() => setStep(3)}
                  className="flex items-center justify-center gap-1.5 rounded-full border border-[#C9A84C]/25 bg-black/45 px-6 py-4 text-xs font-bold text-[#C9A84C] hover:bg-[#C9A84C]/10 transition-all"
                >
                  <ChevronLeft className="h-4.5 w-4.5" />
                  <span>Back</span>
                </button>

                <button
                  onClick={handleNextStep}
                  className="flex items-center justify-center gap-2 rounded-full bg-[#C9A84C] px-8 py-4 text-xs font-bold uppercase tracking-wider text-[#0A0A0A] transition-all hover:bg-[#B8963B] shadow-[0_4px_20px_rgba(201,168,76,0.3)]"
                >
                  <span>{isRtl ? "مراجعة وحساب الفاتورة" : "Review Summary & Pay"}</span>
                  <ChevronRight className="h-4.5 w-4.5" />
                </button>
              </div>

            </motion.div>
          )}

          {/* STEP 5: REVIEW & PAYMENT */}
          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between border-b border-[#C9A84C]/10 pb-4">
                <div>
                  <h2 className="font-heading text-2xl font-bold">{isRtl ? "الفاتورة التفصيلية وبوابة الدفع" : "Secure Premium Review & Checkout"}</h2>
                  <p className="text-xs text-[#A1A1A6]">{isRtl ? "مراجعة جميع إحداثيات رحلتك وتفاصيل الفاتورة الضريبية." : "Verify dispatch summaries and secure KSA banking portal checkout."}</p>
                </div>

                <button
                  onClick={() => setStep(4)}
                  className="inline-flex items-center gap-1.5 text-xs text-[#C9A84C] hover:underline"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>{isRtl ? "تعديل معلوماتي" : "Edit Customer Info"}</span>
                </button>
              </div>

              <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
                
                {/* LEFT: Payment inputs */}
                <div className="space-y-6">
                  
                  {/* Moyasar Gateway Simulator selection */}
                  <div className="rounded-3xl border border-[#C9A84C]/15 bg-[#121212] p-6 space-y-4">
                    <h3 className="font-heading text-sm uppercase tracking-wider text-[#C9A84C] font-bold">
                      {isRtl ? "طريقة الدفع الآمنة" : "VIP Secure Payment Method"}
                    </h3>

                    <div className="grid gap-3 grid-cols-3">
                      <button
                        type="button"
                        onClick={() => setPayMethod("card")}
                        className={`rounded-xl border p-3 flex flex-col items-center gap-2 transition-all ${payMethod === "card" ? "border-[#C9A84C] bg-[#1A1813]" : "border-[#C9A84C]/10 bg-black/20"}`}
                      >
                        <CreditCard className="h-5 w-5 text-[#C9A84C]" />
                        <span className="text-[0.55rem] font-bold uppercase">Credit Card</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPayMethod("applepay")}
                        className={`rounded-xl border p-3 flex flex-col items-center gap-2 transition-all ${payMethod === "applepay" ? "border-[#C9A84C] bg-[#1A1813]" : "border-[#C9A84C]/10 bg-black/20"}`}
                      >
                        <span className="text-base">🍏</span>
                        <span className="text-[0.55rem] font-bold uppercase">Apple Pay</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPayMethod("arrival")}
                        className={`rounded-xl border p-3 flex flex-col items-center gap-2 transition-all ${payMethod === "arrival" ? "border-[#C9A84C] bg-[#1A1813]" : "border-[#C9A84C]/10 bg-black/20"}`}
                      >
                        <span className="text-base">💬</span>
                        <span className="text-[0.55rem] font-bold uppercase">{isRtl ? "واتساب" : "Arrival / WA"}</span>
                      </button>
                    </div>

                    {/* Deposit Switcher toggle */}
                    {payMethod !== "arrival" && (
                      <div className="flex items-center justify-between bg-black/35 border border-[#C9A84C]/10 rounded-2xl p-4 mt-2">
                        <div>
                          <h4 className="text-xs font-bold text-[#F5F0E8]">Pay 20% Deposit Now</h4>
                          <p className="text-[0.55rem] text-[#7C8088] mt-0.5">Pay SAR {depositDue} today, rest at pickup (SAR {remainingDue})</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={payDeposit}
                          onChange={(e) => setPayDeposit(e.target.checked)}
                          className="h-4.5 w-4.5 accent-[#C9A84C] rounded border-[#C9A84C]/20"
                        />
                      </div>
                    )}

                    {/* Card details simulation input */}
                    {payMethod === "card" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="space-y-3 pt-2"
                      >
                        <div>
                          <label className="block text-[0.55rem] uppercase tracking-wider text-[#A1A1A6] mb-1 font-bold">Cardholder Name</label>
                          <input
                            type="text"
                            required
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                            placeholder="e.g. MUHAMMAD AL GHAMDI"
                            className="w-full rounded-xl bg-black/40 border border-[#C9A84C]/10 px-3 py-3 text-xs text-[#F5F0E8] placeholder-[#7C8088] outline-none focus:border-[#C9A84C]"
                          />
                        </div>

                        <div>
                          <label className="block text-[0.55rem] uppercase tracking-wider text-[#A1A1A6] mb-1 font-bold">Card Number</label>
                          <input
                            type="text"
                            maxLength={19}
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                            placeholder="4000 1234 5678 9010 (Mada / Visa / MC)"
                            className="w-full rounded-xl bg-black/40 border border-[#C9A84C]/10 px-3 py-3 text-xs text-[#F5F0E8] placeholder-[#7C8088] outline-none focus:border-[#C9A84C]"
                          />
                        </div>

                        <div className="grid gap-3 grid-cols-3">
                          <div className="col-span-2">
                            <label className="block text-[0.55rem] uppercase tracking-wider text-[#A1A1A6] mb-1 font-bold">Expiry Date</label>
                            <input
                              type="text"
                              maxLength={5}
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              placeholder="MM/YY"
                              className="w-full rounded-xl bg-black/40 border border-[#C9A84C]/10 px-3 py-3 text-xs text-[#F5F0E8] placeholder-[#7C8088] outline-none focus:border-[#C9A84C]"
                            />
                          </div>
                          <div>
                            <label className="block text-[0.55rem] uppercase tracking-wider text-[#A1A1A6] mb-1 font-bold">CVV</label>
                            <input
                              type="password"
                              maxLength={3}
                              value={cardCvv}
                              onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ""))}
                              placeholder="***"
                              className="w-full rounded-xl bg-black/40 border border-[#C9A84C]/10 px-3 py-3 text-xs text-[#F5F0E8] placeholder-[#7C8088] outline-none focus:border-[#C9A84C]"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Apple Pay trigger message */}
                    {payMethod === "applepay" && (
                      <div className="rounded-2xl border border-dashed border-[#C9A84C]/25 bg-black/35 p-6 text-center text-xs text-[#7C8088] space-y-2">
                        <p>Simulating quick Apple Pay auth via biometric/wallet overlay...</p>
                        <div className="inline-block rounded-full bg-white text-black font-bold font-heading px-6 py-2">
                           Pay
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Promo Code section */}
                  <div className="rounded-3xl border border-[#C9A84C]/10 bg-[#121212] p-6 flex gap-2">
                    <input
                      type="text"
                      placeholder="PROMO CODE (e.g. WELCOME10)"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 rounded-xl bg-black/40 border border-[#C9A84C]/10 px-3 py-2.5 text-xs text-[#F5F0E8] placeholder-[#7C8088] outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      className="rounded-xl border border-[#C9A84C]/25 hover:bg-[#C9A84C] hover:text-[#0A0A0A] transition-all text-xs font-bold text-[#C9A84C] px-5"
                    >
                      Apply
                    </button>
                  </div>

                  {/* Terms checkbox */}
                  <div className="flex items-start gap-2.5 pl-2">
                    <input
                      type="checkbox"
                      checked={termsAgreed}
                      onChange={(e) => setTermsAgreed(e.target.checked)}
                      className="h-4.5 w-4.5 accent-[#C9A84C] rounded border-[#C9A84C]/20 mt-0.5"
                    />
                    <p className="text-[0.6rem] leading-relaxed text-[#7C8088]">
                      I agree to the <span className="underline hover:text-[#C9A84C] cursor-pointer">Terms of Carriage</span>, including Saudi General Transport Authority laws and the Riyadh Luxe fixed rate guaranteed pricing policy.
                    </p>
                  </div>

                </div>

                {/* RIGHT: Invoice Summary breakdown */}
                <div className="rounded-3xl border border-[#C9A84C]/15 bg-[#121212] p-6 space-y-6 flex flex-col justify-between shadow-2xl">
                  
                  <div className="space-y-6">
                    <h3 className="font-heading text-sm uppercase tracking-wider text-[#C9A84C] font-bold border-b border-[#C9A84C]/10 pb-3 flex items-center gap-1.5">
                      <FileText className="h-4 w-4" /> {isRtl ? "فاتورة النقل الفاخرة" : "VIP Travel Invoice"}
                    </h3>

                    {/* Summary coordinates list */}
                    <div className="space-y-3.5 text-xs">
                      <div>
                        <p className="text-[0.55rem] text-[#7C8088] font-bold uppercase">{isRtl ? "مسار الرحلة" : "Route details"}</p>
                        <p className="text-[#F5F0E8] truncate max-w-[280px]">{pickup} ➔ {dropoff}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-[0.55rem] text-[#7C8088] font-bold uppercase">{isRtl ? "التاريخ والوقت" : "Departure"}</p>
                          <p className="text-[0.65rem] text-[#F5F0E8] font-semibold">{new Date(dateTime).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-[0.55rem] text-[#7C8088] font-bold uppercase">{isRtl ? "السيارة والركاب" : "Vehicle sizing"}</p>
                          <p className="text-[0.65rem] text-[#F5F0E8] font-semibold">{selectedVehicle} • {passengers} Pax</p>
                        </div>
                      </div>

                      {/* VAT Surcharges breakdown table */}
                      <div className="border-t border-[#C9A84C]/10 pt-4 space-y-2.5 text-[0.65rem] text-[#A1A1A6]">
                        <div className="flex justify-between">
                          <span>{isRtl ? "أجرة الرحلة الأساسية" : "Reserved Base Fare"}</span>
                          <span className="text-[#F5F0E8]">SAR {basePrice}</span>
                        </div>

                        {addonTotal > 0 && (
                          <div className="flex justify-between text-[#C9A84C]">
                            <span>{isRtl ? "مجموع الإضافات الفاخرة" : "VIP Addon Surcharges"}</span>
                            <span>+SAR {addonTotal}</span>
                          </div>
                        )}

                        {promoDiscount > 0 && (
                          <div className="flex justify-between text-green-400">
                            <span>Promo Code Discount ({(promoDiscount * 100)}%)</span>
                            <span>-SAR {promoDiscountAmount}</span>
                          </div>
                        )}

                        <div className="flex justify-between text-[0.55rem] text-[#7C8088] uppercase font-bold pt-1">
                          <span>{isRtl ? "ضريبة القيمة المضافة ١٥٪ (مشمولة)" : "KSA VAT 15% (Included)"}</span>
                          <span>SAR {vatAmount}</span>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Pricing action buttons */}
                  <div className="space-y-4 pt-6 border-t border-[#C9A84C]/10">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-[0.55rem] text-[#7C8088] font-bold uppercase">{payDeposit ? "Due Today" : "Total VAT-Inclusive Price"}</p>
                        <p className="font-heading text-2xl font-bold text-[#C9A84C]">
                          SAR {payDeposit ? depositDue : finalTotalPrice}
                        </p>
                      </div>
                      {payDeposit && (
                        <span className="text-[0.55rem] text-[#7C8088] font-bold uppercase pb-1 text-right">
                          Rest due at pickup: SAR {remainingDue}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={handleFinalizeBooking}
                      disabled={!termsAgreed || creatingBooking}
                      className="flex items-center justify-center gap-2 w-full rounded-full bg-[#C9A84C] py-4 text-xs font-bold uppercase tracking-wider text-[#0A0A0A] shadow-[0_4px_20px_rgba(201,168,76,0.3)] transition-all hover:bg-[#B8963B] disabled:opacity-50"
                    >
                      {creatingBooking ? (
                        <span className="h-4.5 w-4.5 animate-spin rounded-full border-2 border-[#0A0A0A] border-t-transparent" />
                      ) : (
                        <ShieldCheck className="h-4.5 w-4.5" />
                      )}
                      <span>{isRtl ? "تأكيد وإتمام الحجز" : "Lock VIP Dispatch Now"}</span>
                    </button>
                  </div>

                </div>

              </div>
            </motion.div>
          )}

          {/* STEP 6: BOOKING CONFIRMATION & NOTIFICATIONS */}
          {step === 6 && (
            <motion.div
              key="step6"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-xl mx-auto text-center space-y-8 rounded-3xl border border-[#C9A84C]/20 bg-[#121212] p-8 md:p-10 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-[#C9A84C]/5 blur-3xl pointer-events-none" />

              {/* Animated golden success checkmark */}
              <div className="h-16 w-16 rounded-full bg-[#C9A84C]/10 border-2 border-[#C9A84C] flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(201,168,76,0.25)]">
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  className="text-[#C9A84C] text-2xl font-bold"
                >
                  ✓
                </motion.span>
              </div>

              <div className="space-y-2">
                <span className="text-[0.6rem] uppercase tracking-[0.25em] text-[#C9A84C] font-bold">
                  {isRtl ? "تم تأكيد حجز السائق" : "VIP Booking Certified"}
                </span>
                <h2 className="font-heading text-2xl font-bold text-[#F5F0E8]">
                  {isRtl ? "رحلة مباركة بضيافة فاخرة" : "Welcome Aboard, Guest"}
                </h2>
                <p className="text-xs text-[#A1A1A6] max-w-sm mx-auto leading-relaxed">
                  Your chauffeur is registered in our centralized administrative system. Check details or verify GPS updates below.
                </p>
              </div>

              {/* Booking Reference card */}
              <div className="bg-black/45 rounded-2xl border border-[#C9A84C]/10 p-5 space-y-3.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#7C8088] font-bold">BOOKING REFERENCE</span>
                  <span className="font-bold text-[#C9A84C] font-mono tracking-widest">{bookingRef}</span>
                </div>
                <div className="flex justify-between items-center text-xs border-t border-[#C9A84C]/10 pt-3">
                  <span className="text-[#7C8088] font-bold">SCHEDULED TRIP</span>
                  <span className="text-[#F5F0E8] font-semibold truncate max-w-[200px]">{pickup}</span>
                </div>
                <div className="flex justify-between items-center text-xs border-t border-[#C9A84C]/10 pt-3">
                  <span className="text-[#7C8088] font-bold">TOTAL PRICE (SAR)</span>
                  <span className="text-[#C9A84C] font-bold">SAR {finalTotalPrice}</span>
                </div>
              </div>

              {/* Developer / Dispatch alerts simulator log */}
              <div className="rounded-xl bg-black/75 p-4 text-[0.6rem] text-left space-y-2 font-mono text-[#A1A1A6] border border-[#C9A84C]/10">
                <p className="text-[#C9A84C] font-bold border-b border-[#C9A84C]/10 pb-1.5 uppercase tracking-wider text-[0.55rem]">
                  Dispatch Simulation Console Output:
                </p>
                {notificationLogs.map((log, idx) => (
                  <p key={idx}>{log}</p>
                ))}
              </div>

              {/* Quick Action Links */}
              <div className="grid gap-3 grid-cols-2">
                <Link
                  href={`/track-booking?ref=${encodeURIComponent(bookingRef)}&phone=${encodeURIComponent(custPhone)}`}
                  className="flex items-center justify-center gap-2 rounded-full border border-[#C9A84C]/25 bg-black/45 hover:bg-[#C9A84C]/10 py-3.5 text-xs font-bold text-[#C9A84C] transition-all"
                >
                  <MapPin className="h-4 w-4" />
                  <span>Track GPS Live</span>
                </Link>

                <a
                  href={`https://wa.me/${contactConfig.whatsappNumber}?text=Salam,%20I%20have%20successfully%20booked%20my%20chauffeur%20ref%20${bookingRef}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-full bg-[#C9A84C] hover:bg-[#B8963B] py-3.5 text-xs font-bold text-[#0A0A0A] transition-all"
                >
                  <MessageCircle className="h-4 w-4 fill-current" />
                  <span>Share on WhatsApp</span>
                </a>
              </div>

              <div className="pt-2 border-t border-[#C9A84C]/10 flex items-center justify-between text-[0.6rem] text-[#7C8088] font-bold">
                <span>Chauffeur contacts you 1 hour before pick-up</span>
                <Link href="/" className="underline hover:text-[#C9A84C]">Back to Home</Link>
              </div>

            </motion.div>
          )}

        </AnimatePresence>

      </div>
    </main>
  );
}
