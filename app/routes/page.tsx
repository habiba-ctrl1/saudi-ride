"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock, ArrowRight, MessageCircle, Car, ChevronRight } from "lucide-react";
import Link from "next/link";
import { contactConfig } from "@/lib/config/contact";

type VehicleKey = "SEDAN" | "SUV" | "VAN" | "LUXURY" | "BUS";

interface Route {
  id: string;
  from: string;
  to: string;
  fromAr: string;
  toAr: string;
  distance: string;
  duration: string;
  category: string;
  popular: boolean;
  prices: Record<VehicleKey, number>;
  description: string;
}

const ROUTES: Route[] = [
  {
    id: "jed-makkah",
    from: "Jeddah Airport (JED)",
    to: "Makkah Grand Mosque",
    fromAr: "مطار جدة",
    toAr: "الحرم المكي الشريف",
    distance: "80 km",
    duration: "~60 min",
    category: "umrah",
    popular: true,
    prices: { SEDAN: 180, SUV: 280, VAN: 250, LUXURY: 450, BUS: 700 },
    description: "The most requested pilgrim corridor. Direct, air-conditioned transfers from King Abdulaziz International Airport to the Holy Mosque.",
  },
  {
    id: "makkah-madinah",
    from: "Makkah",
    to: "Madinah (Al-Masjid Al-Nabawi)",
    fromAr: "مكة المكرمة",
    toAr: "المدينة المنورة",
    distance: "430 km",
    duration: "~4.5 hrs",
    category: "umrah",
    popular: true,
    prices: { SEDAN: 350, SUV: 500, VAN: 450, LUXURY: 800, BUS: 1200 },
    description: "Complete your Umrah journey with a comfortable inter-city transfer between the two Holy Cities.",
  },
  {
    id: "madinah-jed",
    from: "Madinah",
    to: "Jeddah Airport (JED)",
    fromAr: "المدينة المنورة",
    toAr: "مطار جدة الدولي",
    distance: "420 km",
    duration: "~4.5 hrs",
    category: "umrah",
    popular: false,
    prices: { SEDAN: 350, SUV: 500, VAN: 450, LUXURY: 800, BUS: 1200 },
    description: "Return transfer from Madinah after Ziyarah, with ample luggage space and punctual scheduling.",
  },
  {
    id: "riyadh-dammam",
    from: "Riyadh (King Khalid Airport)",
    to: "Dammam City",
    fromAr: "الرياض",
    toAr: "الدمام",
    distance: "360 km",
    duration: "~3.5 hrs",
    category: "intercity",
    popular: true,
    prices: { SEDAN: 280, SUV: 400, VAN: 350, LUXURY: 650, BUS: 950 },
    description: "Executive corridor between the Saudi capital and the Eastern Province's commercial hub.",
  },
  {
    id: "riyadh-jeddah",
    from: "Riyadh",
    to: "Jeddah",
    fromAr: "الرياض",
    toAr: "جدة",
    distance: "950 km",
    duration: "~9 hrs",
    category: "intercity",
    popular: false,
    prices: { SEDAN: 600, SUV: 900, VAN: 800, LUXURY: 1400, BUS: 2000 },
    description: "Cross-Kingdom transfer between Saudi Arabia's two largest cities — ideal for delegations and families.",
  },
  {
    id: "riyadh-dubai",
    from: "Riyadh",
    to: "Dubai (UAE)",
    fromAr: "الرياض",
    toAr: "دبي",
    distance: "1,100 km",
    duration: "~11 hrs",
    category: "international",
    popular: true,
    prices: { SEDAN: 1200, SUV: 1800, VAN: 1600, LUXURY: 2800, BUS: 4000 },
    description: "Premium GCC cross-border transfer with documentation support, fully licensed for international routes.",
  },
  {
    id: "dammam-doha",
    from: "Dammam",
    to: "Doha, Qatar",
    fromAr: "الدمام",
    toAr: "الدوحة",
    distance: "430 km",
    duration: "~4.5 hrs",
    category: "international",
    popular: false,
    prices: { SEDAN: 500, SUV: 750, VAN: 650, LUXURY: 1200, BUS: 1800 },
    description: "Smooth border crossing from the Eastern Province to Qatar's capital, operated by licensed GCC drivers.",
  },
  {
    id: "jed-kaec",
    from: "Jeddah Airport",
    to: "King Abdullah Economic City",
    fromAr: "مطار جدة",
    toAr: "مدينة الملك عبدالله الاقتصادية",
    distance: "100 km",
    duration: "~75 min",
    category: "intercity",
    popular: false,
    prices: { SEDAN: 220, SUV: 320, VAN: 280, LUXURY: 520, BUS: 800 },
    description: "Business transfer to KAEC — Saudi Arabia's mega business city on the Red Sea coast.",
  },
  {
    id: "riyadh-alula",
    from: "Riyadh",
    to: "AlUla Heritage Resort",
    fromAr: "الرياض",
    toAr: "محافظة العُلا",
    distance: "1,100 km",
    duration: "~10 hrs",
    category: "tourism",
    popular: true,
    prices: { SEDAN: 1100, SUV: 1600, VAN: 1400, LUXURY: 2600, BUS: 3800 },
    description: "Luxury transfer to Saudi Arabia's world-heritage archaeological wonder — AlUla.",
  },
  {
    id: "jed-taif",
    from: "Jeddah",
    to: "Taif City",
    fromAr: "جدة",
    toAr: "الطائف",
    distance: "90 km",
    duration: "~80 min",
    category: "intercity",
    popular: false,
    prices: { SEDAN: 200, SUV: 290, VAN: 260, LUXURY: 480, BUS: 750 },
    description: "Scenic mountain transfer from Jeddah to the City of Roses, Taif — via King Fahd highway.",
  },
  {
    id: "riyadh-neom",
    from: "Riyadh",
    to: "NEOM Gateway",
    fromAr: "الرياض",
    toAr: "نيوم",
    distance: "1,300 km",
    duration: "~12 hrs",
    category: "tourism",
    popular: true,
    prices: { SEDAN: 1400, SUV: 2000, VAN: 1800, LUXURY: 3200, BUS: 5000 },
    description: "Elite transfer to NEOM — Saudi Arabia's futuristic giga-project on the Red Sea. Executive and VIP packages available.",
  },
];

const CATEGORIES = [
  { key: "all", label: "All Routes" },
  { key: "umrah", label: "Umrah & Pilgrimage" },
  { key: "intercity", label: "Intercity KSA" },
  { key: "international", label: "GCC International" },
  { key: "tourism", label: "Tourism & Resorts" },
];

const VEHICLE_LABELS: Record<VehicleKey, string> = {
  SEDAN: "Sedan",
  SUV: "SUV",
  VAN: "Van",
  LUXURY: "Luxury",
  BUS: "Bus / Coach",
};

const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } };

export default function RoutesPage() {
  const [category, setCategory] = useState("all");
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleKey>("SUV");

  const filtered = ROUTES.filter((r) => category === "all" || r.category === category);

  const waLink = (route: Route) =>
    `https://wa.me/${contactConfig.whatsappNumber}?text=Salam, I would like to book a transfer from ${route.from} to ${route.to}. Please confirm pricing and availability.`;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8]">

      {/* ─── HERO ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 bg-gradient-to-b from-[#C9A84C]/6 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,#C9A84C10,transparent_60%)] pointer-events-none" />

        <div className="section-container relative z-10 max-w-5xl">
          <motion.div initial="hidden" animate="show" variants={fadeUp} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/8 px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#C9A84C]">
              <MapPin className="h-3 w-3" /> Popular Corridors
            </span>
            <h1 className="mt-6 font-heading text-4xl font-bold leading-tight md:text-6xl">
              Fixed-Price Routes<br />
              <span className="text-[#C9A84C]">Across Saudi Arabia & GCC</span>
            </h1>
            <p className="mt-6 max-w-2xl text-sm md:text-base leading-relaxed text-[#A1A1A6]">
              Pre-negotiated, guaranteed flat-rate fares for 11 major corridors.
              No meters, no surprises — just premium chauffeur service at a price you lock in at booking.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── VEHICLE CLASS SELECTOR ───────────────────────────────── */}
      <section className="section-container max-w-5xl pb-4">
        <div className="rounded-2xl border border-[#C9A84C]/15 bg-[#111111] p-5 space-y-3">
          <p className="text-[0.6rem] uppercase font-bold tracking-widest text-[#7C8088]">
            Compare prices by vehicle class
          </p>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(VEHICLE_LABELS) as VehicleKey[]).map((vk) => (
              <button
                key={vk}
                onClick={() => setSelectedVehicle(vk)}
                className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                  selectedVehicle === vk
                    ? "bg-[#C9A84C] text-[#0A0A0A]"
                    : "border border-[#C9A84C]/20 text-[#A1A1A6] hover:border-[#C9A84C]/50"
                }`}
              >
                {VEHICLE_LABELS[vk]}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CATEGORY FILTER ──────────────────────────────────────── */}
      <section className="sticky top-[72px] z-30 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#C9A84C]/10 py-4">
        <div className="section-container max-w-5xl">
          <div className="flex items-center gap-2 overflow-x-auto">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setCategory(cat.key)}
                className={`shrink-0 rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                  category === cat.key
                    ? "bg-[#C9A84C] text-[#0A0A0A] shadow-[0_4px_14px_rgba(201,168,76,0.3)]"
                    : "border border-[#C9A84C]/20 text-[#A1A1A6] hover:border-[#C9A84C]/50 hover:text-[#F5F0E8]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ROUTES LIST ──────────────────────────────────────────── */}
      <section className="section-container max-w-5xl py-14 space-y-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={category + selectedVehicle}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            {filtered.map((route, index) => (
              <motion.div
                key={route.id}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.1 }}
                variants={fadeUp}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group rounded-3xl border border-[#C9A84C]/12 bg-[#111111] p-6 md:p-8 hover:border-[#C9A84C]/35 transition-all duration-300"
              >
                <div className="grid gap-6 md:grid-cols-[1fr_auto]">
                  {/* Route info */}
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 flex-wrap">
                      {route.popular && (
                        <span className="rounded-full bg-[#C9A84C] px-3 py-0.5 text-[0.55rem] font-bold uppercase tracking-wider text-[#0A0A0A]">
                          Popular
                        </span>
                      )}
                      <span className="rounded-full border border-[#C9A84C]/25 px-3 py-0.5 text-[0.55rem] font-bold uppercase tracking-wider text-[#C9A84C]">
                        {CATEGORIES.find((c) => c.key === route.category)?.label}
                      </span>
                    </div>

                    {/* From → To */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="space-y-0.5">
                        <p className="text-[0.55rem] text-[#7C8088] font-bold uppercase tracking-wider">From</p>
                        <p className="font-heading text-base font-bold text-[#F5F0E8]">{route.from}</p>
                        <p className="text-[0.6rem] text-[#7C8088] rtl-text">{route.fromAr}</p>
                      </div>

                      <div className="flex flex-col items-center gap-1 text-[#C9A84C]">
                        <div className="h-px w-12 bg-[#C9A84C]/40" />
                        <ArrowRight className="h-4 w-4" />
                        <div className="h-px w-12 bg-[#C9A84C]/40" />
                      </div>

                      <div className="space-y-0.5">
                        <p className="text-[0.55rem] text-[#7C8088] font-bold uppercase tracking-wider">To</p>
                        <p className="font-heading text-base font-bold text-[#F5F0E8]">{route.to}</p>
                        <p className="text-[0.6rem] text-[#7C8088] rtl-text">{route.toAr}</p>
                      </div>
                    </div>

                    {/* Distance & Duration */}
                    <div className="flex items-center gap-5 text-xs text-[#A1A1A6]">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-[#C9A84C]/60" />
                        <span>{route.distance}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-[#C9A84C]/60" />
                        <span>{route.duration}</span>
                      </div>
                    </div>

                    <p className="text-xs text-[#A1A1A6] leading-relaxed max-w-lg">{route.description}</p>

                    {/* All vehicle prices row */}
                    <div className="flex flex-wrap gap-3 pt-1">
                      {(Object.keys(VEHICLE_LABELS) as VehicleKey[]).map((vk) => (
                        <div
                          key={vk}
                          className={`rounded-xl border px-3 py-1.5 text-center transition-all ${
                            selectedVehicle === vk
                              ? "border-[#C9A84C] bg-[#C9A84C]/8"
                              : "border-[#C9A84C]/8 bg-black/20"
                          }`}
                        >
                          <p className="text-[0.5rem] text-[#7C8088] font-bold uppercase">{VEHICLE_LABELS[vk]}</p>
                          <p className={`text-xs font-bold ${selectedVehicle === vk ? "text-[#C9A84C]" : "text-[#A1A1A6]"}`}>
                            SAR {route.prices[vk]}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right: Price + CTA */}
                  <div className="flex flex-col justify-between items-end gap-4 min-w-[170px]">
                    <div className="text-right">
                      <p className="text-[0.6rem] text-[#7C8088] uppercase font-bold tracking-wider">{VEHICLE_LABELS[selectedVehicle]} Price</p>
                      <p className="font-heading text-3xl font-bold text-[#C9A84C]">SAR {route.prices[selectedVehicle]}</p>
                      <p className="text-[0.6rem] text-[#7C8088]">Fixed · VAT inclusive</p>
                    </div>

                    <div className="flex flex-col gap-2.5 w-full">
                      <Link
                        href={`/book?pickup=${encodeURIComponent(route.from)}&dropoff=${encodeURIComponent(route.to)}`}
                        className="flex items-center justify-center gap-1.5 rounded-full bg-[#C9A84C] px-5 py-3 text-[0.65rem] font-bold uppercase tracking-wider text-[#0A0A0A] hover:bg-[#B8963B] transition-all shadow-[0_4px_14px_rgba(201,168,76,0.25)] w-full"
                      >
                        <Car className="h-3.5 w-3.5" />
                        Book Now
                      </Link>
                      <a
                        href={waLink(route)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 rounded-full border border-[#C9A84C]/30 px-5 py-3 text-[0.65rem] font-bold uppercase tracking-wider text-[#C9A84C] hover:bg-[#C9A84C]/10 transition-all w-full"
                      >
                        <MessageCircle className="h-3.5 w-3.5 fill-current" />
                        WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Custom Route CTA */}
        <div className="rounded-3xl border border-[#C9A84C]/20 bg-[#111111] p-8 text-center space-y-4 mt-10">
          <span className="text-[0.65rem] uppercase tracking-[0.2em] text-[#C9A84C] font-bold">Custom Route</span>
          <h2 className="font-heading text-2xl font-bold">Don&apos;t see your route?</h2>
          <p className="text-sm text-[#A1A1A6] max-w-lg mx-auto">
            We cover all of Saudi Arabia and GCC. Share your coordinates and our concierge team will provide a fixed quote within 15 minutes.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <a
              href={`https://wa.me/${contactConfig.whatsappNumber}?text=Salam, I need a custom route quote.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full bg-[#C9A84C] px-7 py-3.5 text-xs font-bold uppercase text-[#0A0A0A] hover:bg-[#B8963B] transition-all shadow-[0_4px_20px_rgba(201,168,76,0.3)]"
            >
              <MessageCircle className="h-4 w-4 fill-current" />
              Get Custom Quote
            </a>
            <Link
              href="/book"
              className="flex items-center gap-2 rounded-full border border-[#C9A84C]/30 px-7 py-3.5 text-xs font-bold uppercase text-[#C9A84C] hover:bg-[#C9A84C]/10 transition-all"
            >
              <ChevronRight className="h-4 w-4" />
              Online Booking System
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
