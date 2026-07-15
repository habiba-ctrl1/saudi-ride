"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Plane, Building2, Award, MessageCircle, ChevronRight, Landmark } from "lucide-react";
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
    image: "/locations/makkah-hero.webp",
    tagline: "The Holiest City on Earth",
    airports: ["Jeddah KAI Airport (80 km)"],
    popularRoutes: ["JED Airport → Makkah", "Makkah → Madinah", "Makkah → Taif"],
    startingPrice: 150,
    note: "No-go zone for non-Muslims. All chauffeurs are Muslim & trained for respectful pilgrimage service.",
    slug: "makkah"
  },
  {
    id: "madinah",
    name: "Madinah Al-Munawwarah",
    nameAr: "المدينة المنورة",
    category: "holy",
    image: "/locations/madinah-hero.webp",
    tagline: "City of the Prophet ﷺ",
    airports: ["Prince Mohammad Bin Abdulaziz Airport (MED)"],
    popularRoutes: ["Madinah → JED Airport", "Madinah → Makkah", "MED Airport → Hotels"],
    startingPrice: 80,
    note: "Transfers to Al-Masjid Al-Nabawi, Quba Mosque, Al-Baqi' and all Ziyarah points.",
    slug: "madinah"
  },
  // Major Cities
  {
    id: "riyadh",
    name: "Riyadh",
    nameAr: "الرياض",
    category: "city",
    image: "/locations/riyadh-hero.webp",
    tagline: "The Saudi Capital & Business Hub",
    airports: ["King Khalid International Airport (RUH)"],
    popularRoutes: ["RUH Airport → City", "Riyadh → Dammam", "Riyadh → Jeddah"],
    startingPrice: 100,
    note: "Full city coverage: KAFD, Olaya, Diplomatic Quarter, King Abdullah Financial District.",
    slug: "riyadh"
  },
  {
    id: "jeddah",
    name: "Jeddah",
    nameAr: "جدة",
    category: "city",
    image: "/locations/jeddah-hero.webp",
    tagline: "The Red Sea Gateway",
    airports: ["King Abdulaziz International Airport (JED)"],
    popularRoutes: ["JED → Makkah", "JED → Madinah", "JED → Taif", "JED → KAEC"],
    startingPrice: 80,
    note: "Terminal 1 (International), North Terminal (Domestic), and Hajj Terminal all covered.",
    slug: "jeddah"
  },
  {
    id: "dammam",
    name: "Dammam",
    nameAr: "الدمام",
    category: "city",
    image: "/locations/dammam-hero.webp",
    tagline: "Eastern Province Capital",
    airports: ["King Fahd International Airport (DMM)"],
    popularRoutes: ["DMM → Al Khobar", "Dammam → Doha", "Dammam → Riyadh"],
    startingPrice: 120,
    note: "Covers Al Khobar, Dhahran, Jubail, and King Fahd Causeway (Bahrain border) transfers.",
    slug: "dammam"
  },
  {
    id: "alkhobar",
    name: "Al-Khobar",
    nameAr: "الخبر",
    category: "city",
    image: "/locations/alkhobar-hero.webp",
    tagline: "The Coastal Resort City",
    airports: ["King Fahd International Airport (DMM)"],
    popularRoutes: ["Khobar → DMM Airport", "Khobar → Bahrain"],
    startingPrice: 150,
    note: "Corporate transfers and Bahrain causeway VIP transport.",
    slug: "alkhobar"
  },
  {
    id: "yanbu",
    name: "Yanbu",
    nameAr: "ينبع",
    category: "city",
    image: "/locations/yanbu-hero.webp",
    tagline: "The Pearl of the Red Sea",
    airports: ["Prince Abdul Mohsin bin Abdulaziz Airport (YNB)"],
    popularRoutes: ["YNB Airport → City", "Yanbu → Madinah", "Yanbu → Jeddah"],
    startingPrice: 100,
    note: "Transfers to Yanbu Industrial City and Royal Commission areas.",
    slug: "yanbu"
  },
  // Tourism
  {
    id: "alula",
    name: "AlUla",
    nameAr: "العُلا",
    category: "tourism",
    image: "/locations/alula-hero.webp",
    tagline: "Saudi Arabia's Archaeological Wonder",
    airports: ["Prince Abdulmajeed Airport (ULH)"],
    popularRoutes: ["ULH Airport → Resorts", "Riyadh → AlUla", "Jeddah → AlUla"],
    startingPrice: 150,
    note: "Transfers to Hegra (Mada'in Salih), Dadan, Jabal Ikmah, and all luxury resort camps.",
    slug: "alula"
  },
  {
    id: "neom",
    name: "NEOM / Tabuk",
    nameAr: "نيوم / تبوك",
    category: "tourism",
    image: "/locations/neom-hero.webp",
    tagline: "The Future Giga-City",
    airports: ["Prince Sultan Bin Abdulaziz Airport (TUU)", "NEOM Bay Airport (NUM)"],
    popularRoutes: ["Tabuk → NEOM", "NUM Airport → Sindalah"],
    startingPrice: 200,
    note: "Gateway transfers to The LINE, Sindalah Island, Aqaba coastal area, and Sharma resort.",
    slug: "neom"
  },
  {
    id: "taif",
    name: "Taif",
    nameAr: "الطائف",
    category: "tourism",
    image: "/locations/taif-hero.webp",
    tagline: "City of Roses & Mountain Resorts",
    airports: ["Taif Regional Airport (TIF)"],
    popularRoutes: ["TIF Airport → City", "Jeddah → Taif", "Makkah → Taif"],
    startingPrice: 100,
    note: "Scenic mountain road transfers to Rose Festival areas, Al-Hada, and Shafa resort zone.",
    slug: "taif"
  },
  {
    id: "abha",
    name: "Abha & Asir Province",
    nameAr: "أبها وعسير",
    category: "tourism",
    image: "/locations/abha-hero.webp",
    tagline: "Cloud City & Green Mountains",
    airports: ["Abha International Airport (AHB)"],
    popularRoutes: ["AHB Airport → City", "Abha → Rijal Alma", "Abha → Soudah Peak"],
    startingPrice: 120,
    note: "Mountain tourism transfers across the Asir highlands — ideal for nature tourism escapes.",
    slug: "abha"
  },
];

const CATEGORIES = [
  { key: "all", label: "All Locations", icon: MapPin },
  { key: "holy", label: "Holy Cities", icon: Landmark },
  { key: "city", label: "Major Cities", icon: Building2 },
  { key: "tourism", label: "Tourism", icon: Award },
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
              <span className="text-[#C9A84C]">Saudi Arabia & Beyond</span>
            </h1>
            <p className="mt-6 max-w-2xl text-sm md:text-base leading-relaxed text-[#A1A1A6]">
              From the Holy Cities of Makkah and Madinah to the futuristic NEOM — we provide
              fixed-price VIP transfers across the Kingdom with airport-to-hotel precision.
            </p>
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
                    alt={`${loc.name} — Taxi Saudi Arabia transfers`}
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

                  {/* Note */}
                  <p className="text-[0.6rem] leading-relaxed text-[#7C8088] italic border-l-2 border-[#C9A84C]/20 pl-3">
                    {loc.note}
                  </p>

                  {/* CTAs */}
                  <div className="grid grid-cols-2 gap-3 pt-2 mt-auto">
                    <Link
                      href={`/locations/${loc.slug}`}
                      className="flex items-center justify-center gap-1.5 rounded-full bg-[#C9A84C] py-3 text-[0.65rem] font-bold uppercase tracking-wider text-[#0A0A0A] hover:bg-[#B8963B] transition-all"
                    >
                      View City <ChevronRight className="h-3.5 w-3.5" />
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
      </section>
    </div>
  );
}
