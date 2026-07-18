"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, ChevronRight, BookOpen } from "lucide-react";
import Link from "next/link";
import { GUIDES } from "@/lib/data/guides";

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
  arrival: "text-[#16A34A] bg-[#16A34A]/10 border-[#16A34A]/20",
  umrah: "text-[#16A34A] bg-[#16A34A]/10 border-[#16A34A]/20",
  money: "text-[#B8963B] bg-[#C9A84C]/10 border-[#C9A84C]/25",
  culture: "text-[#B8963B] bg-[#C9A84C]/10 border-[#C9A84C]/25",
  business: "text-[#16A34A] bg-[#16A34A]/10 border-[#16A34A]/20",
  tourism: "text-[#B8963B] bg-[#C9A84C]/10 border-[#C9A84C]/25",
};

const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } };

export default function GuidesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAFAF7] text-[#1C1C1C] flex items-center justify-center">
        <div className="text-[#C9A84C] font-heading text-lg font-bold animate-pulse">Loading Taxi Saudi Arabia Concierge Guides...</div>
      </div>
    }>
      <GuidesContent />
    </Suspense>
  );
}

function GuidesContent() {
  const searchParams = useSearchParams();
  const guideSlug = searchParams.get("slug");

  const [active, setActive] = useState("all");

  const filtered = GUIDES.filter((g) => active === "all" || g.category === active);

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#1C1C1C]">

      {/* ─── HERO ───────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 bg-gradient-to-b from-[#C9A84C]/6 to-transparent pointer-events-none" />

        <div className="section-container relative z-10 max-w-5xl">
          <motion.div initial="hidden" animate="show" variants={fadeUp} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/8 px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#B8963B]">
              <BookOpen className="h-3 w-3" /> Knowledge Base
            </span>
            <h1 className="mt-6 font-heading text-4xl font-bold leading-tight md:text-6xl">
              Saudi Arabia Travel Guides<br />
              <span className="text-[#16A34A]">For Pilgrims & Visitors</span>
            </h1>
            <p className="mt-6 max-w-2xl text-sm md:text-base leading-relaxed text-[#6B7280]">
              Practical, locally researched insights from our concierge team — covering airports, Umrah, 
              customs, money, and everything in between for a seamless Saudi experience.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── FILTER BAR ─────────────────────────────────────────────────── */}
      <section className="sticky top-[72px] z-30 bg-[#FAFAF7]/95 backdrop-blur-md border-b border-[#C9A84C]/10 py-4">
        <div className="section-container max-w-5xl">
          <div className="flex items-center gap-2 overflow-x-auto">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActive(cat.key)}
                className={`shrink-0 rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                  active === cat.key
                    ? "bg-[#16A34A] text-white shadow-[0_4px_14px_rgba(22,163,74,0.3)]"
                    : "border border-[#16A34A]/15 text-[#6B7280] hover:border-[#C9A84C]/50 hover:text-[#1C1C1C]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── GUIDES LIST ────────────────────────────────────────────────── */}
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
              const colorClass = CATEGORY_COLORS[guide.category] ?? "text-[#C9A84C] bg-[#C9A84C]/10 border-[#16A34A]/15";

              return (
                <motion.article
                  key={guide.slug}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.05 }}
                  variants={fadeUp}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="rounded-3xl border border-[#C9A84C]/12 bg-white hover:border-[#C9A84C]/30 transition-all duration-300"
                >
                  <Link
                    href={`/guides/${guide.slug}`}
                    className="w-full text-left p-6 md:p-7 block"
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
                            <span key={tag} className="rounded-full border border-[#C9A84C]/10 bg-white px-2.5 py-0.5 text-[0.55rem] text-[#6B7280] font-medium">
                              {tag}
                            </span>
                          ))}
                        </div>

                        <h2 className="font-heading text-lg md:text-xl font-bold text-[#1C1C1C] leading-snug">
                          {guide.title}
                        </h2>
                        <p className="text-[0.6rem] text-[#6B7280]">{guide.titleAr}</p>

                        <p className="text-xs text-[#6B7280] leading-relaxed">{guide.summary}</p>

                        <div className="flex items-center gap-4 text-[0.6rem] text-[#6B7280] font-medium">
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

                      <ChevronRight className="h-5 w-5 text-[#C9A84C] shrink-0" />
                    </div>
                  </Link>
                </motion.article>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </section>
    </div>
  );
}
