"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Briefcase, MessageCircle, ChevronRight, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { contactConfig } from "@/lib/config/contact";
import { FLEET_VEHICLES } from "@/lib/fleet-data";

const CATEGORIES = [
  { key: "all", label: "All Fleet" },
  { key: "sedan", label: "Sedans" },
  { key: "suv", label: "SUVs" },
  { key: "van", label: "Vans" },
  { key: "luxury", label: "Luxury" },
  { key: "bus", label: "Buses" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0 },
};

export default function FleetPage() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = FLEET_VEHICLES.filter(
    (v) => activeCategory === "all" || v.category === activeCategory
  );

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8]">

      {/* ─── HERO ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 bg-gradient-to-b from-[#C9A84C]/6 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-[#C9A84C]/3 blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#C9A84C_1px,transparent_1px),linear-gradient(to_bottom,#C9A84C_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.03] pointer-events-none" />

        <div className="section-container relative z-10 max-w-5xl">
          <motion.div initial="hidden" animate="show" variants={fadeUp} transition={{ duration: 0.6 }}>
            <span className="inline-block rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/8 px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#C9A84C]">
              Our Premium Fleet
            </span>
            <h1 className="mt-6 font-heading text-4xl font-bold leading-tight md:text-6xl text-[#F5F0E8]">
              14 World-Class Vehicles<br />
              <span className="text-[#C9A84C]">Across Every Class</span>
            </h1>
            <p className="mt-6 max-w-2xl text-sm md:text-base leading-relaxed text-[#A1A1A6]">
              From executive airport sedans to full luxury coaches — every vehicle is immaculately
              maintained, chauffeur-driven, and available 24/7 across Saudi Arabia, GCC, and international transfers.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeUp}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-10 flex flex-wrap gap-6"
          >
            {[
              { value: "14", label: "Vehicle Classes" },
              { value: "100%", label: "Licensed & Insured" },
              { value: "24/7", label: "Availability" },
              { value: "4.9★", label: "Fleet Rating" },
            ].map((s) => (
              <div key={s.label} className="flex flex-col">
                <span className="font-heading text-2xl font-bold text-[#C9A84C]">{s.value}</span>
                <span className="text-[0.65rem] text-[#7C8088] font-bold uppercase tracking-wider">{s.label}</span>
              </div>
            ))}
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
                onClick={() => setActiveCategory(cat.key)}
                className={`shrink-0 rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                  activeCategory === cat.key
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

      {/* ─── VEHICLE GRID ─────────────────────────────────────────── */}
      <section className="section-container max-w-7xl py-16">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-xs text-[#7C8088] font-bold uppercase tracking-wider">
            Showing {filtered.length} vehicle{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="grid gap-8 md:grid-cols-2 xl:grid-cols-3"
          >
            {filtered.map((vehicle, index) => (
              <motion.article
                key={vehicle.slug}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.1 }}
                variants={fadeUp}
                transition={{ duration: 0.45, delay: (index % 6) * 0.07 }}
                className="group relative flex flex-col overflow-hidden rounded-3xl border border-[#C9A84C]/12 bg-[#111111] shadow-2xl hover:border-[#C9A84C]/40 transition-all duration-300"
                whileHover={{ y: -5 }}
              >
                {/* Vehicle Image */}
                <div className="relative h-52 w-full overflow-hidden">
                  <Image
                    src={vehicle.image}
                    alt={`${vehicle.name} — Riyadh Luxe Taxi Saudi Arabia`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent" />

                  <div className="absolute top-4 left-4">
                    <span className="rounded-full bg-[#C9A84C] px-3 py-1 text-[0.6rem] font-bold uppercase tracking-wider text-[#0A0A0A]">
                      {vehicle.badge}
                    </span>
                  </div>

                  <div className="absolute top-4 right-4">
                    <span className="rounded-full bg-black/70 border border-[#C9A84C]/25 px-3 py-1 text-[0.55rem] font-bold uppercase tracking-wider text-[#C9A84C]">
                      {vehicle.subtitle}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="flex flex-col flex-1 p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="font-heading text-xl font-bold text-[#F5F0E8] group-hover:text-[#C9A84C] transition-colors">
                        {vehicle.name}
                      </h2>
                      <div className="mt-1 flex items-center gap-1.5">
                        <Star className="h-3 w-3 fill-[#C9A84C] text-[#C9A84C]" />
                        <span className="text-[0.65rem] text-[#C9A84C] font-bold">{vehicle.rating}</span>
                        <span className="text-[0.6rem] text-[#7C8088]">({vehicle.reviews} reviews)</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[0.55rem] text-[#7C8088] uppercase font-bold tracking-wider">From</p>
                      <p className="font-heading text-xl font-bold text-[#C9A84C]">SAR {vehicle.startingPrice}</p>
                    </div>
                  </div>

                  {/* Capacity */}
                  <div className="flex items-center gap-5 border-y border-[#C9A84C]/8 py-3 text-xs text-[#A1A1A6] font-medium">
                    <div className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-[#C9A84C]/75" />
                      <span>{vehicle.passengers} Passengers</span>
                    </div>
                    <div className="h-3 w-px bg-[#C9A84C]/15" />
                    <div className="flex items-center gap-1.5">
                      <Briefcase className="h-3.5 w-3.5 text-[#C9A84C]/75" />
                      <span>{vehicle.luggage} Bags</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-[0.7rem] leading-relaxed text-[#A1A1A6] line-clamp-2">
                    {vehicle.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-1.5">
                    {vehicle.features.slice(0, 3).map((f) => (
                      <li key={f} className="flex items-center gap-2 text-[0.65rem] text-[#A1A1A6]">
                        <span className="text-[#C9A84C] font-bold shrink-0">✓</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Buttons */}
                  <div className="mt-auto grid grid-cols-2 gap-3 pt-3">
                    <Link
                      href={`/book?vehicle=${vehicle.slug}`}
                      className="flex items-center justify-center gap-1.5 rounded-full bg-[#C9A84C] py-3 text-[0.65rem] font-bold uppercase tracking-wider text-[#0A0A0A] transition-all hover:bg-[#B8963B] shadow-[0_4px_14px_rgba(201,168,76,0.25)]"
                    >
                      <span>Book Now</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                    <a
                      href={`https://wa.me/${contactConfig.whatsappNumber}?text=Salam, I would like a quote for the ${vehicle.name} (${vehicle.subtitle})`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 rounded-full border border-[#C9A84C]/30 bg-black/25 py-3 text-[0.65rem] font-bold uppercase tracking-wider text-[#C9A84C] transition-all hover:bg-[#C9A84C]/10"
                    >
                      <MessageCircle className="h-3.5 w-3.5 fill-current" />
                      <span>WA Quote</span>
                    </a>
                  </div>

                  {/* Detail Link */}
                  <Link
                    href={`/fleet/${vehicle.slug}`}
                    className="block text-center text-[0.6rem] text-[#7C8088] hover:text-[#C9A84C] transition-colors pt-1 underline underline-offset-2"
                  >
                    View full specs &amp; gallery →
                  </Link>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* ─── BOTTOM CTA ───────────────────────────────────────────── */}
      <section className="section-container max-w-3xl text-center pb-24">
        <div className="rounded-3xl border border-[#C9A84C]/20 bg-[#111111] p-10 space-y-5 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#C9A84C]/4 to-transparent pointer-events-none rounded-3xl" />
          <span className="text-[0.65rem] uppercase tracking-[0.2em] text-[#C9A84C] font-bold">Custom Fleet Request</span>
          <h2 className="font-heading text-2xl font-bold text-[#F5F0E8]">
            Need a specific vehicle class<br />or long-term lease?
          </h2>
          <p className="text-sm text-[#A1A1A6] leading-relaxed max-w-xl mx-auto">
            Contact our dispatch team for corporate accounts, pilgrimage operators,
            wedding planners, and exclusive long-term fleet agreements.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a
              href={`https://wa.me/${contactConfig.whatsappNumber}?text=Salam, I am looking for a custom fleet arrangement.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full bg-[#C9A84C] px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-[#0A0A0A] transition-all hover:bg-[#B8963B] shadow-[0_4px_20px_rgba(201,168,76,0.3)]"
            >
              <MessageCircle className="h-4 w-4 fill-current" />
              WhatsApp Fleet Manager
            </a>
            <Link
              href="/contact"
              className="flex items-center gap-2 rounded-full border border-[#C9A84C]/30 px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-[#C9A84C] transition-all hover:bg-[#C9A84C]/10"
            >
              Send Inquiry Form
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
