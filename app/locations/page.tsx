"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Plane, Building2, Award, Star, MessageCircle, ChevronRight, Landmark } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { contactConfig } from "@/lib/config/contact";

const LOCATIONS = [
  // Holy Cities
  {
    id: "makkah",
    name: "Makkah Al-Mukarramah",
    nameAr: "مكة المكرمة",
    category: "holy",
    image: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=800&q=80",
    tagline: "The Holiest City on Earth",
    airports: ["Jeddah KAI Airport (80 km)"],
    popularRoutes: ["JED Airport → Makkah", "Makkah → Madinah", "Makkah → Taif"],
    startingPrice: 180,
    note: "No-go zone for non-Muslims. All chauffeurs are Muslim & trained for respectful pilgrimage service.",
  },
  {
    id: "madinah",
    name: "Madinah Al-Munawwarah",
    nameAr: "المدينة المنورة",
    category: "holy",
    image: "https://images.unsplash.com/photo-1564769662533-4f00a87b4056?auto=format&fit=crop&w=800&q=80",
    tagline: "City of the Prophet ﷺ",
    airports: ["Prince Mohammad Bin Abdulaziz Airport (MED)"],
    popularRoutes: ["Madinah → JED Airport", "Madinah → Makkah", "MED Airport → Hotels"],
    startingPrice: 350,
    note: "Transfers to Al-Masjid Al-Nabawi, Quba Mosque, Al-Baqi' and all Ziyarah points.",
  },
  // Major Cities
  {
    id: "riyadh",
    name: "Riyadh",
    nameAr: "الرياض",
    category: "city",
    image: "https://images.unsplash.com/photo-1578895101408-1a36b834405b?auto=format&fit=crop&w=800&q=80",
    tagline: "The Saudi Capital & Business Hub",
    airports: ["King Khalid International Airport (RUH)"],
    popularRoutes: ["RUH Airport → City", "Riyadh → Dammam", "Riyadh → Jeddah"],
    startingPrice: 100,
    note: "Full city coverage: KAFD, Olaya, Diplomatic Quarter, King Abdullah Financial District.",
  },
  {
    id: "jeddah",
    name: "Jeddah",
    nameAr: "جدة",
    category: "city",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80",
    tagline: "The Red Sea Gateway",
    airports: ["King Abdulaziz International Airport (JED)"],
    popularRoutes: ["JED → Makkah", "JED → Madinah", "JED → Taif", "JED → KAEC"],
    startingPrice: 80,
    note: "Terminal 1 (International), North Terminal (Domestic), and Hajj Terminal all covered.",
  },
  {
    id: "dammam",
    name: "Dammam",
    nameAr: "الدمام",
    category: "city",
    image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=800&q=80",
    tagline: "Eastern Province Capital",
    airports: ["King Fahd International Airport (DMM)"],
    popularRoutes: ["DMM → Al Khobar", "Dammam → Doha", "Dammam → Riyadh"],
    startingPrice: 120,
    note: "Covers Al Khobar, Dhahran, Jubail, and King Fahd Causeway (Bahrain border) transfers.",
  },
  // Tourism
  {
    id: "alula",
    name: "AlUla",
    nameAr: "العُلا",
    category: "tourism",
    image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=800&q=80",
    tagline: "Saudi Arabia's Archaeological Wonder",
    airports: ["Prince Abdulmajeed Airport (ULH)"],
    popularRoutes: ["Riyadh → AlUla", "Jeddah → AlUla", "AlUla → NEOM"],
    startingPrice: 1100,
    note: "Transfers to Hegra (Mada'in Salih), Dadan, Jabal Ikmah, and all luxury resort camps.",
  },
  {
    id: "neom",
    name: "NEOM / Tabuk",
    nameAr: "نيوم / تبوك",
    category: "tourism",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80",
    tagline: "The Future Giga-City",
    airports: ["Prince Sultan Bin Abdulaziz Airport (TUU)"],
    popularRoutes: ["Riyadh → NEOM", "Jeddah → NEOM", "AlUla → NEOM"],
    startingPrice: 1400,
    note: "Gateway transfers to The LINE, Sindalah Island, Aqaba coastal area, and Sharma resort.",
  },
  {
    id: "taif",
    name: "Taif",
    nameAr: "الطائف",
    category: "tourism",
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
    tagline: "City of Roses & Mountain Resorts",
    airports: ["Taif Regional Airport (TIF)"],
    popularRoutes: ["Jeddah → Taif", "Makkah → Taif", "Taif Cable Car Area"],
    startingPrice: 200,
    note: "Scenic mountain road transfers to Rose Festival areas, Al-Hada, and Shafa resort zone.",
  },
  {
    id: "abha",
    name: "Abha & Asir Province",
    nameAr: "أبها وعسير",
    category: "tourism",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
    tagline: "Cloud City & Green Mountains",
    airports: ["Abha International Airport (AHB)"],
    popularRoutes: ["AHB Airport → City", "Abha → Rijal Alma", "Abha → Soudah Peak"],
    startingPrice: 150,
    note: "Mountain tourism transfers across the Asir highlands — ideal for nature tourism escapes.",
  },
  // International
  {
    id: "dubai",
    name: "Dubai, UAE",
    nameAr: "دبي، الإمارات",
    category: "international",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80",
    tagline: "GCC Cross-Border Transfer",
    airports: ["Via Riyadh or Dammam (Road)"],
    popularRoutes: ["Riyadh → Dubai", "Dammam → Dubai", "Dubai → Riyadh"],
    startingPrice: 1200,
    note: "Licensed cross-border GCC operation. Saudi & UAE transit documentation handled.",
  },
  {
    id: "doha",
    name: "Doha, Qatar",
    nameAr: "الدوحة، قطر",
    category: "international",
    image: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=800&q=80",
    tagline: "Qatar Border — King Fahd Causeway",
    airports: ["Via King Fahd Causeway"],
    popularRoutes: ["Dammam → Doha", "Al Khobar → Doha", "Doha → Dammam"],
    startingPrice: 500,
    note: "Premium road transfer via Abu Samra border crossing. Qatar entry documentation guidance provided.",
  },
];

const CATEGORIES = [
  { key: "all", label: "All Locations", icon: MapPin },
  { key: "holy", label: "Holy Cities", icon: Landmark },
  { key: "city", label: "Major Cities", icon: Building2 },
  { key: "tourism", label: "Tourism", icon: Award },
  { key: "international", label: "GCC International", icon: Plane },
];

const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } };

export default function LocationsPage() {
  const [active, setActive] = useState("all");

  const filtered = LOCATIONS.filter((l) => active === "all" || l.category === active);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8]">

      {/* ─── HERO ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 bg-gradient-to-b from-[#C9A84C]/6 to-transparent pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A84C]/30 to-transparent" />

        <div className="section-container relative z-10 max-w-5xl">
          <motion.div initial="hidden" animate="show" variants={fadeUp} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/8 px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#C9A84C]">
              <MapPin className="h-3 w-3" /> Kingdom-Wide Coverage
            </span>
            <h1 className="mt-6 font-heading text-4xl font-bold leading-tight md:text-6xl">
              We Operate Across<br />
              <span className="text-[#C9A84C]">All of Saudi Arabia & GCC</span>
            </h1>
            <p className="mt-6 max-w-2xl text-sm md:text-base leading-relaxed text-[#A1A1A6]">
              From the Holy Cities of Makkah and Madinah to the futuristic NEOM — we provide
              fixed-price VIP transfers across 11 destinations with airport-to-hotel precision.
            </p>
          </motion.div>

          <motion.div
            initial="hidden" animate="show" variants={fadeUp} transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-10 flex flex-wrap gap-5"
          >
            {[
              { v: "11", l: "Cities Covered" },
              { v: "4", l: "Countries" },
              { v: "24/7", l: "Operations" },
              { v: "Fixed", l: "All-Inclusive Price" },
            ].map((s) => (
              <div key={s.l} className="flex flex-col">
                <span className="font-heading text-2xl font-bold text-[#C9A84C]">{s.v}</span>
                <span className="text-[0.65rem] text-[#7C8088] font-bold uppercase tracking-wider">{s.l}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── FILTER BAR ───────────────────────────────────────────── */}
      <section className="sticky top-[72px] z-30 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#C9A84C]/10 py-4">
        <div className="section-container max-w-5xl">
          <div className="flex items-center gap-2 overflow-x-auto">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.key}
                  onClick={() => setActive(cat.key)}
                  className={`shrink-0 flex items-center gap-1.5 rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                    active === cat.key
                      ? "bg-[#C9A84C] text-[#0A0A0A] shadow-[0_4px_14px_rgba(201,168,76,0.3)]"
                      : "border border-[#C9A84C]/20 text-[#A1A1A6] hover:border-[#C9A84C]/50 hover:text-[#F5F0E8]"
                  }`}
                >
                  <Icon className="h-3 w-3" />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── LOCATIONS GRID ───────────────────────────────────────── */}
      <section className="section-container max-w-6xl py-14 pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
          >
            {filtered.map((loc, index) => (
              <motion.article
                key={loc.id}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.1 }}
                variants={fadeUp}
                transition={{ duration: 0.4, delay: (index % 6) * 0.07 }}
                className="group relative overflow-hidden rounded-3xl border border-[#C9A84C]/12 bg-[#111111] hover:border-[#C9A84C]/40 transition-all duration-300 flex flex-col"
                style={{ transform: "translateZ(0)" }}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={loc.image}
                    alt={`${loc.name} — Riyadh Luxe Taxi transfers`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-black/20 to-transparent" />

                  {/* Category badge */}
                  <div className="absolute top-4 left-4">
                    <span className="rounded-full bg-[#C9A84C] px-3 py-1 text-[0.55rem] font-bold uppercase tracking-wider text-[#0A0A0A]">
                      {CATEGORIES.find((c) => c.key === loc.category)?.label}
                    </span>
                  </div>

                  {/* Price badge */}
                  <div className="absolute top-4 right-4">
                    <div className="rounded-full bg-black/70 border border-[#C9A84C]/25 px-3 py-1 text-center">
                      <p className="text-[0.5rem] text-[#7C8088] font-bold uppercase">From</p>
                      <p className="text-xs font-bold text-[#C9A84C]">SAR {loc.startingPrice}</p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-6 space-y-4">
                  <div>
                    <h2 className="font-heading text-xl font-bold text-[#F5F0E8] group-hover:text-[#C9A84C] transition-colors">
                      {loc.name}
                    </h2>
                    <p className="text-[0.6rem] text-[#7C8088] mt-0.5">{loc.nameAr}</p>
                    <p className="text-xs text-[#C9A84C] font-medium mt-1">{loc.tagline}</p>
                  </div>

                  {/* Airports */}
                  <div className="space-y-1.5">
                    <p className="text-[0.55rem] uppercase font-bold tracking-wider text-[#7C8088]">Serving Airport(s)</p>
                    {loc.airports.map((a) => (
                      <div key={a} className="flex items-center gap-1.5 text-[0.65rem] text-[#A1A1A6]">
                        <Plane className="h-3 w-3 text-[#C9A84C]/60 shrink-0" />
                        <span>{a}</span>
                      </div>
                    ))}
                  </div>

                  {/* Popular routes */}
                  <div className="space-y-1.5">
                    <p className="text-[0.55rem] uppercase font-bold tracking-wider text-[#7C8088]">Popular Transfers</p>
                    {loc.popularRoutes.map((r) => (
                      <div key={r} className="flex items-center gap-1.5 text-[0.65rem] text-[#A1A1A6]">
                        <Star className="h-3 w-3 text-[#C9A84C]/60 shrink-0" />
                        <span>{r}</span>
                      </div>
                    ))}
                  </div>

                  {/* Note */}
                  <p className="text-[0.6rem] leading-relaxed text-[#7C8088] italic border-l-2 border-[#C9A84C]/20 pl-3">
                    {loc.note}
                  </p>

                  {/* CTAs */}
                  <div className="grid grid-cols-2 gap-3 pt-2 mt-auto">
                    <Link
                      href={`/book?pickup=${encodeURIComponent(loc.name)}`}
                      className="flex items-center justify-center gap-1.5 rounded-full bg-[#C9A84C] py-3 text-[0.65rem] font-bold uppercase tracking-wider text-[#0A0A0A] hover:bg-[#B8963B] transition-all"
                    >
                      Book Now <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                    <a
                      href={`https://wa.me/${contactConfig.whatsappNumber}?text=Salam, I need a transfer to/from ${loc.name}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 rounded-full border border-[#C9A84C]/30 py-3 text-[0.65rem] font-bold uppercase tracking-wider text-[#C9A84C] hover:bg-[#C9A84C]/10 transition-all"
                    >
                      <MessageCircle className="h-3.5 w-3.5 fill-current" />
                      WhatsApp
                    </a>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Custom location CTA */}
        <div className="mt-14 rounded-3xl border border-[#C9A84C]/20 bg-[#111111] p-8 text-center space-y-4">
          <span className="text-[0.65rem] uppercase tracking-[0.2em] text-[#C9A84C] font-bold">Custom Transfer</span>
          <h2 className="font-heading text-2xl font-bold">Your location not listed?</h2>
          <p className="text-sm text-[#A1A1A6] max-w-lg mx-auto">
            We cover every corner of Saudi Arabia. Message our concierge and get a fixed price within 15 minutes.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <a
              href={`https://wa.me/${contactConfig.whatsappNumber}?text=Salam, I need a transfer to a custom location.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full bg-[#C9A84C] px-7 py-3.5 text-xs font-bold uppercase text-[#0A0A0A] hover:bg-[#B8963B] transition-all shadow-[0_4px_20px_rgba(201,168,76,0.3)]"
            >
              <MessageCircle className="h-4 w-4 fill-current" />
              Contact Concierge
            </a>
            <Link
              href="/routes"
              className="flex items-center gap-2 rounded-full border border-[#C9A84C]/30 px-7 py-3.5 text-xs font-bold uppercase text-[#C9A84C] hover:bg-[#C9A84C]/10 transition-all"
            >
              View All Routes
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
