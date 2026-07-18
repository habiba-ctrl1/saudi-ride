"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Briefcase, MessageCircle, ChevronRight, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { contactConfig } from "@/lib/config/contact";
import { FLEET_VEHICLES } from "@/lib/fleet-data";
import { trustStats } from "@/lib/config/stats";

const CATEGORIES = [
  { key: "all", label: "All Cars" },
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
    <div className="min-h-screen bg-[#FAFAF7] text-[#1C1C1C]">

      {/* ─── HERO ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 bg-gradient-to-b from-[#C9A84C]/6 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-[#C9A84C]/3 blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#C9A84C_1px,transparent_1px),linear-gradient(to_bottom,#C9A84C_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.03] pointer-events-none" />

        <div className="section-container relative z-10 max-w-5xl">
          <motion.div initial="hidden" animate="show" variants={fadeUp} transition={{ duration: 0.6 }}>
            <span className="inline-block rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/8 px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#B8963B]">
              Our Cars
            </span>
            <h1 className="mt-6 font-heading text-4xl font-bold leading-tight md:text-6xl text-[#1C1C1C]">
              Cars for Hire in Saudi Arabia<br />
              <span className="text-[#16A34A]">Sedans, SUVs, Vans & Buses</span>
            </h1>
            <p className="mt-6 max-w-2xl text-sm md:text-base leading-relaxed text-[#6B7280]">
              Choose from sedans, SUVs, minivans, and buses — all clean, comfortable, and available 24/7 with a professional driver across Saudi Arabia, the GCC, and beyond. Fixed prices, no hidden fees.
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
              { value: trustStats.vehicleClasses, label: "Vehicle Classes" },
              { value: trustStats.licensedDrivers, label: "Licensed & Insured" },
              { value: trustStats.activeChauffeurs, label: "Available 24/7" },
              { value: trustStats.passengerRating, label: "Customer Rating" },
            ].map((s) => (
              <div key={s.label} className="flex flex-col">
                <span className="font-heading text-2xl font-bold text-[#16A34A]">{s.value}</span>
                <span className="text-[0.65rem] text-[#6B7280] font-bold uppercase tracking-wider">{s.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── FILTER BAR ───────────────────────────────────────────── */}
      <section className="sticky top-[72px] z-30 bg-[#FAFAF7]/95 backdrop-blur-md border-b border-[#C9A84C]/10 py-4">
        <div className="section-container max-w-5xl">
          <div className="flex items-center gap-2 overflow-x-auto" role="tablist">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                role="tab"
                tabIndex={0}
                aria-selected={activeCategory === cat.key}
                onKeyDown={(e) => e.key === "Enter" && setActiveCategory(cat.key)}
                onClick={() => setActiveCategory(cat.key)}
                className={`shrink-0 rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all focus:outline-none focus:ring-2 focus:ring-[#C9A84C] ${
                  activeCategory === cat.key
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

      {/* ─── VEHICLE GRID ─────────────────────────────────────────── */}
      <section className="section-container max-w-7xl py-16">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-xs text-[#6B7280] font-bold uppercase tracking-wider">
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
                className="group relative flex flex-col overflow-hidden rounded-3xl border border-[#C9A84C]/12 bg-white shadow-2xl hover:border-[#16A34A]/35 transition-all duration-300"
                whileHover={{ y: -5 }}
              >
                {/* Vehicle Image */}
                <div className="relative h-52 w-full overflow-hidden">
                  <Image
                    src={vehicle.image}
                    alt={`${vehicle.name} — Taxi Saudi Arabia Saudi Arabia`}
                    fill
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent" />

                  <div className="absolute top-4 left-4">
                    <span className="rounded-full bg-[#16A34A] px-3 py-1 text-[0.6rem] font-bold uppercase tracking-wider text-white">
                      {vehicle.badge}
                    </span>
                  </div>

                  <div className="absolute top-4 right-4">
                    <span className="rounded-full bg-black/70 border border-[#C9A84C]/25 px-3 py-1 text-[0.55rem] font-bold uppercase tracking-wider text-[#B8963B]">
                      {vehicle.subtitle}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="flex flex-col flex-1 p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="font-heading text-xl font-bold text-[#1C1C1C] group-hover:text-[#16A34A] transition-colors">
                        {vehicle.name}
                      </h2>
                      <div className="mt-1 flex items-center gap-1.5">
                        <Star className="h-3 w-3 fill-[#C9A84C] text-[#C9A84C]" />
                        <span className="text-[0.65rem] text-[#C9A84C] font-bold">{vehicle.rating}</span>
                        <span className="text-[0.6rem] text-[#6B7280]">({vehicle.reviews} reviews)</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[0.55rem] text-[#6B7280] uppercase font-bold tracking-wider">From</p>
                      <p className="font-heading text-xl font-bold text-[#16A34A]">SAR {vehicle.startingPrice}</p>
                    </div>
                  </div>

                  {/* Capacity */}
                  <div className="flex items-center gap-5 border-y border-[#C9A84C]/8 py-3 text-xs text-[#6B7280] font-medium">
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
                  <p className="text-[0.7rem] leading-relaxed text-[#6B7280] line-clamp-2">
                    {vehicle.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-1.5">
                    {vehicle.features.slice(0, 3).map((f) => (
                      <li key={f} className="flex items-center gap-2 text-[0.65rem] text-[#6B7280]">
                        <span className="text-[#C9A84C] font-bold shrink-0">✓</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Buttons */}
                  <div className="mt-auto grid grid-cols-2 gap-3 pt-3">
                    <Link
                      href={`/book?vehicle=${vehicle.slug}`}
                      className="flex items-center justify-center gap-1.5 rounded-full bg-[#16A34A] py-3 text-[0.65rem] font-bold uppercase tracking-wider text-white transition-all hover:bg-[#15803D] shadow-[0_4px_14px_rgba(22,163,74,0.25)]"
                    >
                      <span>Book Now</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                    <a
                      href={`https://wa.me/${contactConfig.whatsappNumber}?text=Salam, I would like a quote for the ${vehicle.name} (${vehicle.subtitle})`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 rounded-full border border-[#C9A84C]/30 bg-white py-3 text-[0.65rem] font-bold uppercase tracking-wider text-[#B8963B] transition-all hover:bg-[#C9A84C]/10"
                    >
                      <MessageCircle className="h-3.5 w-3.5 fill-current" />
                      <span>WhatsApp Quote</span>
                    </a>
                  </div>

                  {/* Detail Link */}
                  <Link
                    href={`/fleet/${vehicle.slug}`}
                    className="block text-center text-[0.6rem] text-[#6B7280] hover:text-[#16A34A] transition-colors pt-1 underline underline-offset-2"
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
        <div className="rounded-3xl border border-[#16A34A]/15 bg-white p-10 space-y-5 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#C9A84C]/4 to-transparent pointer-events-none rounded-3xl" />
          <span className="text-[0.65rem] uppercase tracking-[0.2em] text-[#B8963B] font-bold">Group & Corporate Bookings</span>
          <h2 className="font-heading text-2xl font-bold text-[#1C1C1C]">
            Need a specific car type<br />or a long-term booking?
          </h2>
          <p className="text-sm text-[#6B7280] leading-relaxed max-w-xl mx-auto">
            We handle corporate accounts, Umrah group transport, wedding car hire, and long-term vehicle arrangements across Saudi Arabia. Contact us to get a custom quote.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a
              href={`https://wa.me/${contactConfig.whatsappNumber}?text=Salam, I would like a price quote for a car.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full bg-[#16A34A] px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-[#15803D] shadow-[0_4px_20px_rgba(22,163,74,0.3)]"
            >
              <MessageCircle className="h-4 w-4 fill-current" />
              Get a Price on WhatsApp
            </a>
            <Link
              href="/contact"
              className="flex items-center gap-2 rounded-full border border-[#C9A84C]/30 px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-[#B8963B] transition-all hover:bg-[#C9A84C]/10"
            >
              Send Inquiry Form
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
