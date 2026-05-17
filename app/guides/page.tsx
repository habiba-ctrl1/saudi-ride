"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar, Clock, ChevronRight, BookOpen,
  Plane, Heart, CreditCard, MapPin, Smartphone, Sun
} from "lucide-react";
import Link from "next/link";

const GUIDES = [
  {
    id: "jeddah-sim-guide",
    category: "arrival",
    icon: Smartphone,
    title: "SIM Card Guide at Jeddah Airport",
    titleAr: "دليل الشريحة في مطار جدة",
    summary: "Exactly where to buy local 5G eSIMs from stc, Mobily, or Zain at Terminal 1 and the North Terminal upon landing.",
    date: "May 12, 2026",
    readTime: "4 min",
    tags: ["Jeddah", "SIM Card", "Airport Tips"],
    content: [
      "stc (STC) booths are located immediately after baggage claim on the right — best 5G coverage nationwide.",
      "Mobily kiosks are available in the arrivals hall — cheaper data plans, good for short stays.",
      "Zain counters open 24/7 near exit gates — ask for the 'Hajj & Umrah' tourist SIM for pilgrim bundles.",
      "eSIM: Use the stc or Zain app to activate a digital SIM before landing for seamless arrival connectivity.",
      "Price range: SAR 60–150 depending on data bundle (10GB to Unlimited monthly).",
    ],
  },
  {
    id: "meeqat-guide",
    category: "umrah",
    icon: Heart,
    title: "Complete Meeqat Locations Guide for Umrah",
    titleAr: "دليل مواقيت العمرة الكامل",
    summary: "Step-by-step guidance on all 5 Meeqat points for international pilgrims arriving by air or road — including Dhul Hulaifah and Yalamlam.",
    date: "May 8, 2026",
    readTime: "7 min",
    tags: ["Umrah", "Meeqat", "Pilgrim Guide"],
    content: [
      "Dhul Hulaifah (Abyar Ali): For pilgrims from Madinah — enter ihram before departing to Makkah.",
      "Al-Juhfah (Rabigh): For pilgrims from Syria, Jordan, and Egypt — most international flights connect via Jeddah and the Meeqat is near Rabigh.",
      "Yalamlam: For pilgrims from Yemen and those arriving by sea on the western side.",
      "Qarn Al-Manazil (As-Sayl): For pilgrims from Najd and those flying into Taif airport.",
      "Dhat Irq: For pilgrims from Iraq — eastern approach to Makkah.",
      "Pro Tip: If you're flying into Jeddah, you must enter ihram on the aircraft before crossing the Meeqat boundary — the crew will announce it.",
    ],
  },
  {
    id: "riyal-cash-guide",
    category: "money",
    icon: CreditCard,
    title: "Saudi Riyal Cash & Card Tips for Pilgrims",
    titleAr: "نصائح العملة للحجاج والزوار",
    summary: "Everything about card acceptance, the local Mada network, currency exchange outlets, and ATM fee limits in KSA.",
    date: "April 29, 2026",
    readTime: "5 min",
    tags: ["Money", "Currency", "Finance"],
    content: [
      "ATMs: Use Al-Rajhi, Al-Ahli (ANB), or Riyad Bank ATMs — lowest international withdrawal fees (typically SAR 15–20 per transaction).",
      "Mada network: All local debit transactions. Most shops accept international Visa/MC contactless.",
      "Apple Pay & Google Pay are widely accepted in Riyadh, Jeddah, and major malls — even for small purchases.",
      "Currency exchange: Best rates at airport exchange desks (not the first booth you see). Travelex rates are 5–8% worse than local exchangers.",
      "Cash is still king in Makkah/Madinah small shops, taxis, and street vendors. Carry at least SAR 500–1000 in small notes.",
      "Emergency: Western Union and MoneyGram are available at most Saudi Post branches.",
    ],
  },
  {
    id: "airport-guide",
    category: "arrival",
    icon: Plane,
    title: "Jeddah Airport Arrivals — Full Walk-Through",
    titleAr: "دليل وصول مطار جدة الشامل",
    summary: "Terminal layout, immigration queues, baggage claim zones, VIP arrival halls, and how to find your Riyadh Luxe chauffeur.",
    date: "April 21, 2026",
    readTime: "6 min",
    tags: ["Jeddah", "Airport", "Arrival"],
    content: [
      "Terminal 1 (International): Arrivals on Level 0 — immigration first, baggage claim in Halls A, B, C, D depending on your flight.",
      "North Terminal (Domestic): Smaller, faster processing — used for KSA internal flights.",
      "Hajj Terminal: Seasonal — used exclusively during Hajj season for pilgrims. Completely separate facility.",
      "VIP arrivals hall (Level 1): Available for business/first class passengers — ask your airline at check-in.",
      "Finding your chauffeur: Your Riyadh Luxe driver will be standing in the Arrivals Meet Zone with your name on a digital sign.",
      "WhatsApp your driver directly from the booking confirmation SMS — no waiting, no confusion.",
    ],
  },
  {
    id: "umrah-packing",
    category: "umrah",
    icon: Heart,
    title: "The Ultimate Umrah Packing List",
    titleAr: "قائمة تجهيزات العمرة الشاملة",
    summary: "From ihram garments to medication and digital essentials — a complete packing checklist for pilgrims performing Umrah.",
    date: "April 15, 2026",
    readTime: "8 min",
    tags: ["Umrah", "Packing", "Preparation"],
    content: [
      "Ihram: 2 sets minimum (one to wear, one clean backup). Seamless white cotton — available at Jeddah airport too.",
      "Footwear: Rubber sandals with no back-strap for men. Comfortable closed shoes for women.",
      "Medications: Paracetamol, electrolyte sachets, blister pads, anti-diarrheal tablets, and any prescription drugs (with Arabic prescription copies).",
      "Digital: Saudi eVisa saved on your phone (offline), booking confirmations, emergency contacts.",
      "Cash: Carry SAR 500–1000 in notes of 50 and 100 denomination.",
      "Zamzam: You're allowed 5 liters in checked luggage on departure — available free from dispensers throughout the Haram.",
    ],
  },
  {
    id: "saudi-customs",
    category: "culture",
    icon: Sun,
    title: "Saudi Arabia — Customs, Etiquette & Laws for Visitors",
    titleAr: "العادات والقوانين للزوار في المملكة",
    summary: "Essential cultural norms, dress codes, photography rules, and things to know before entering the Kingdom as a tourist or pilgrim.",
    date: "April 8, 2026",
    readTime: "6 min",
    tags: ["Culture", "Laws", "Saudi Arabia"],
    content: [
      "Dress code: Modest clothing required in holy areas. Women are no longer required to wear abaya in public but modest dress is encouraged.",
      "Photography: NEVER photograph government buildings, military sites, or people without permission. The Haram interior photography is restricted.",
      "Alcohol: Strictly prohibited. Zero tolerance — criminal penalties apply.",
      "Prayer times: Many shops close briefly during Salah. Build 15–20 minute buffers into schedules.",
      "Ramadan: Business hours shift significantly. Eating/drinking in public during daylight hours is illegal for all.",
      "Respect: Stand when national anthem plays, remove shoes before entering mosques, greet with 'As-salamu alaykum'.",
    ],
  },
  {
    id: "riyadh-business-guide",
    category: "business",
    icon: MapPin,
    title: "Riyadh Business District Navigator",
    titleAr: "دليل الأحياء التجارية في الرياض",
    summary: "KAFD, Olaya, Diplomatic Quarter, and King Abdullah Financial District — your executive's guide to navigating Riyadh's business zones.",
    date: "March 30, 2026",
    readTime: "5 min",
    tags: ["Riyadh", "Business", "Corporate"],
    content: [
      "KAFD (King Abdullah Financial District): Ultra-modern skyscraper district in north Riyadh — home to major banks, PIF, and global firms.",
      "Olaya Street: The traditional business heart — major hotels (Four Seasons, Ritz-Carlton), restaurants, and corporate towers.",
      "Diplomatic Quarter (DQ): Embassies, international schools, and secure residential compounds. Strict access controls.",
      "Al Faisaliah Tower: Iconic landmark — conference facilities, restaurants, and executive suites.",
      "Traffic: Riyadh rush hours are 7–9am and 4–8pm. Allow 45-min buffers for cross-city transfers during peak.",
      "Chauffeur tip: Pre-book your Riyadh Luxe driver for the full meeting day — hourly charter saves time and avoids Uber surge pricing.",
    ],
  },
  {
    id: "alula-tourism",
    category: "tourism",
    icon: MapPin,
    title: "AlUla Visitor Guide — Hegra, Dadan & the Rose City",
    titleAr: "دليل زيارة العُلا — الحِجر ودادان",
    summary: "Everything you need to know about visiting AlUla's UNESCO world heritage sites, rock formations, and luxury resort experiences.",
    date: "March 20, 2026",
    readTime: "9 min",
    tags: ["AlUla", "Tourism", "Heritage"],
    content: [
      "Hegra (Mada'in Salih): Saudi Arabia's first UNESCO World Heritage Site — 111 Nabataean tombs carved from rose sandstone.",
      "Dadan: The ancient capital of the Dadanite kingdom — predates Hegra. Guided access only via AlUla Experience tours.",
      "Jabal Ikmah: Open-air library of ancient inscriptions — largest in the Arabian Peninsula.",
      "Elephant Rock (Jabal Al-Fil): A natural rock formation resembling an elephant — free access, stunning at sunset.",
      "Best time to visit: October to March — temperatures between 15–25°C. Avoid summers (40°C+).",
      "Getting there: Direct flights from Riyadh/Jeddah to ULH Airport, or a premium road transfer (~10 hours from Riyadh).",
    ],
  },
];

const CATEGORIES = [
  { key: "all", label: "All Guides" },
  { key: "arrival", label: "Airport & Arrival" },
  { key: "umrah", label: "Umrah & Hajj" },
  { key: "money", label: "Money & Finance" },
  { key: "culture", label: "Culture & Laws" },
  { key: "business", label: "Business Travel" },
  { key: "tourism", label: "Tourism" },
];

const CATEGORY_COLORS: Record<string, string> = {
  arrival: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  umrah: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  money: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  culture: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  business: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
  tourism: "text-rose-400 bg-rose-400/10 border-rose-400/20",
};

const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } };

export default function GuidesPage() {
  const [active, setActive] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = GUIDES.filter((g) => active === "all" || g.category === active);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8]">

      {/* ─── HERO ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 bg-gradient-to-b from-[#C9A84C]/6 to-transparent pointer-events-none" />

        <div className="section-container relative z-10 max-w-5xl">
          <motion.div initial="hidden" animate="show" variants={fadeUp} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/8 px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#C9A84C]">
              <BookOpen className="h-3 w-3" /> Knowledge Base
            </span>
            <h1 className="mt-6 font-heading text-4xl font-bold leading-tight md:text-6xl">
              Saudi Arabia Travel Guides<br />
              <span className="text-[#C9A84C]">For Pilgrims & Visitors</span>
            </h1>
            <p className="mt-6 max-w-2xl text-sm md:text-base leading-relaxed text-[#A1A1A6]">
              Practical, locally researched insights from our concierge team — covering airports, Umrah, 
              customs, money, and everything in between for a seamless Saudi experience.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── FILTER BAR ───────────────────────────────────────────── */}
      <section className="sticky top-[72px] z-30 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#C9A84C]/10 py-4">
        <div className="section-container max-w-5xl">
          <div className="flex items-center gap-2 overflow-x-auto">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActive(cat.key)}
                className={`shrink-0 rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                  active === cat.key
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

      {/* ─── GUIDES LIST ──────────────────────────────────────────── */}
      <section className="section-container max-w-4xl py-14 pb-24 space-y-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            {filtered.map((guide, index) => {
              const Icon = guide.icon;
              const isOpen = expanded === guide.id;
              const colorClass = CATEGORY_COLORS[guide.category] ?? "text-[#C9A84C] bg-[#C9A84C]/10 border-[#C9A84C]/20";

              return (
                <motion.article
                  key={guide.id}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.05 }}
                  variants={fadeUp}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="rounded-3xl border border-[#C9A84C]/12 bg-[#111111] overflow-hidden hover:border-[#C9A84C]/30 transition-all duration-300"
                >
                  {/* Header — always visible */}
                  <button
                    onClick={() => setExpanded(isOpen ? null : guide.id)}
                    className="w-full text-left p-6 md:p-7"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border ${colorClass}`}>
                        <Icon className="h-4.5 w-4.5" />
                      </div>

                      <div className="flex-1 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`rounded-full border px-2.5 py-0.5 text-[0.55rem] font-bold uppercase tracking-wider ${colorClass}`}>
                            {CATEGORIES.find((c) => c.key === guide.category)?.label}
                          </span>
                          {guide.tags.slice(0, 2).map((tag) => (
                            <span key={tag} className="rounded-full border border-[#C9A84C]/10 bg-black/20 px-2.5 py-0.5 text-[0.55rem] text-[#7C8088] font-medium">
                              {tag}
                            </span>
                          ))}
                        </div>

                        <h2 className="font-heading text-lg md:text-xl font-bold text-[#F5F0E8] leading-snug">
                          {guide.title}
                        </h2>
                        <p className="text-[0.6rem] text-[#7C8088]">{guide.titleAr}</p>

                        <p className="text-xs text-[#A1A1A6] leading-relaxed">{guide.summary}</p>

                        <div className="flex items-center gap-4 text-[0.6rem] text-[#7C8088] font-medium">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{guide.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{guide.readTime} read</span>
                          </div>
                        </div>
                      </div>

                      <ChevronRight
                        className={`h-5 w-5 text-[#C9A84C] shrink-0 transition-transform duration-300 ${isOpen ? "rotate-90" : ""}`}
                      />
                    </div>
                  </button>

                  {/* Expanded content */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-[#C9A84C]/10 px-6 md:px-7 pb-7 pt-5 space-y-3">
                          <p className="text-[0.6rem] uppercase font-bold tracking-widest text-[#7C8088]">
                            Key Insights
                          </p>
                          <ol className="space-y-3">
                            {guide.content.map((point, i) => (
                              <li key={i} className="flex items-start gap-3">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#C9A84C]/15 border border-[#C9A84C]/25 text-[0.55rem] font-bold text-[#C9A84C]">
                                  {i + 1}
                                </span>
                                <p className="text-xs text-[#A1A1A6] leading-relaxed">{point}</p>
                              </li>
                            ))}
                          </ol>

                          <div className="flex items-center gap-3 pt-3 border-t border-[#C9A84C]/8">
                            <Link
                              href="/book"
                              className="flex items-center gap-1.5 rounded-full bg-[#C9A84C] px-5 py-2.5 text-[0.65rem] font-bold uppercase tracking-wider text-[#0A0A0A] hover:bg-[#B8963B] transition-all"
                            >
                              Book a Transfer
                              <ChevronRight className="h-3.5 w-3.5" />
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.article>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </section>
    </div>
  );
}
