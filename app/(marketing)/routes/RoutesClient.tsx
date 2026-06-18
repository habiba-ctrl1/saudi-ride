"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock, Car, ChevronRight, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { Route } from "@prisma/client";
import { contactConfig } from "@/lib/config/contact";

const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } };

export default function RoutesClient({ initialRoutes }: { initialRoutes: Route[] }) {
  const [departureCity, setDepartureCity] = useState("All");
  const [destinationCity, setDestinationCity] = useState("All");
  const [priceRange, setPriceRange] = useState("All");

  const departureCities = useMemo(() => {
    const cities = Array.from(new Set(initialRoutes.map((r) => r.fromCity.split(' ')[0])));
    return ["All", ...cities.sort()];
  }, [initialRoutes]);

  const destinationCities = useMemo(() => {
    const cities = Array.from(new Set(initialRoutes.map((r) => r.toCity.split(' ')[0])));
    return ["All", ...cities.sort()];
  }, [initialRoutes]);

  const filteredRoutes = useMemo(() => {
    return initialRoutes.filter((route) => {
      // Departure City Filter (From)
      if (departureCity !== "All" && !route.fromCity.startsWith(departureCity)) {
        return false;
      }
      // Destination City Filter (To)
      if (destinationCity !== "All" && !route.toCity.startsWith(destinationCity)) {
        return false;
      }
      // Price Range Filter
      if (priceRange !== "All") {
        if (priceRange === "Under SAR 300" && route.basePrice >= 300) return false;
        if (priceRange === "SAR 300 - 600" && (route.basePrice < 300 || route.basePrice > 600)) return false;
        if (priceRange === "Over SAR 600" && route.basePrice <= 600) return false;
      }
      return true;
    });
  }, [initialRoutes, departureCity, destinationCity, priceRange]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8]">
      {/* ─── HERO ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-32 pb-16">
        <div className="absolute inset-0 bg-gradient-to-b from-[#C9A84C]/6 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,#C9A84C10,transparent_60%)] pointer-events-none" />

        <div className="section-container relative z-10 max-w-6xl">
          <motion.div initial="hidden" animate="show" variants={fadeUp} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/8 px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#C9A84C]">
              <MapPin className="h-3 w-3" /> Kingdom-Wide Coverage
            </span>
            <h1 className="mt-6 font-heading text-4xl font-bold leading-tight md:text-6xl">
              50+ Taxi Routes in<br />
              <span className="text-[#C9A84C]">Saudi Arabia & GCC</span>
            </h1>
            <p className="mt-6 max-w-2xl text-sm md:text-base leading-relaxed text-[#A1A1A6]">
              Fixed-price taxi rides across all major cities in Saudi Arabia and the GCC.
              Choose your route, see the exact price, and book with a licensed driver in minutes.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── FILTERS ──────────────────────────────────────────────── */}
      <section className="sticky top-[72px] z-30 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#C9A84C]/10 py-4">
        <div className="section-container max-w-6xl">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex items-center gap-2 text-[#C9A84C] pr-4 md:border-r border-[#C9A84C]/20">
              <SlidersHorizontal className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Filters</span>
            </div>
            
            <div className="flex items-center gap-3 overflow-x-auto w-full pb-2 md:pb-0">
              {/* Departure City */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[0.65rem] text-[#7C8088] uppercase font-bold tracking-wider">From:</span>
                <select
                  value={departureCity}
                  onChange={(e) => setDepartureCity(e.target.value)}
                  className="bg-[#111] border border-[#C9A84C]/20 rounded-full px-4 py-1.5 text-xs text-[#F5F0E8] outline-none focus:border-[#C9A84C] transition-colors"
                >
                  {departureCities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              {/* Destination City */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[0.65rem] text-[#7C8088] uppercase font-bold tracking-wider">To:</span>
                <select
                  value={destinationCity}
                  onChange={(e) => setDestinationCity(e.target.value)}
                  className="bg-[#111] border border-[#C9A84C]/20 rounded-full px-4 py-1.5 text-xs text-[#F5F0E8] outline-none focus:border-[#C9A84C] transition-colors"
                >
                  {destinationCities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[0.65rem] text-[#7C8088] uppercase font-bold tracking-wider">Price:</span>
                <select 
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="bg-[#111] border border-[#C9A84C]/20 rounded-full px-4 py-1.5 text-xs text-[#F5F0E8] outline-none focus:border-[#C9A84C] transition-colors"
                >
                  <option value="All">All Prices</option>
                  <option value="Under SAR 300">Under SAR 300</option>
                  <option value="SAR 300 - 600">SAR 300 - 600</option>
                  <option value="Over SAR 600">Over SAR 600</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── ROUTES GRID ──────────────────────────────────────────── */}
      <section className="section-container max-w-6xl py-12 pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${departureCity}-${destinationCity}-${priceRange}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {filteredRoutes.length === 0 ? (
              <div className="col-span-full py-12 text-center text-[#A1A1A6]">
                <p>No routes found matching your filters.</p>
                <button 
                  onClick={() => { setDepartureCity("All"); setPriceRange("All"); }}
                  className="mt-4 text-[#C9A84C] hover:underline text-sm"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              filteredRoutes.map((route, index) => (
                <motion.div
                  key={route.id}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.1 }}
                  variants={fadeUp}
                  transition={{ duration: 0.4, delay: (index % 6) * 0.05 }}
                  className="group flex flex-col justify-between rounded-3xl border border-[#C9A84C]/12 bg-[#111111] p-6 hover:border-[#C9A84C]/40 transition-all duration-300"
                >
                  <div className="space-y-4">
                    {/* Tags */}
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-[#1A1A1A] px-3 py-1 text-[0.55rem] font-bold uppercase tracking-wider text-[#C9A84C] border border-[#C9A84C]/10">
                        {route.distance} km
                      </span>
                      {route.popular && (
                        <span className="rounded-full bg-[#C9A84C]/10 px-3 py-1 text-[0.55rem] font-bold uppercase tracking-wider text-[#C9A84C]">
                          Popular
                        </span>
                      )}
                    </div>

                    {/* From → To */}
                    <div className="space-y-3 pt-2">
                      <div className="space-y-0.5">
                        <p className="text-[0.55rem] text-[#7C8088] font-bold uppercase tracking-wider">From</p>
                        <p className="font-heading text-lg font-bold text-[#F5F0E8] leading-tight group-hover:text-[#C9A84C] transition-colors">{route.fromCity}</p>
                      </div>

                      <div className="flex items-center gap-2 text-[#C9A84C]/50 pl-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]/50" />
                        <div className="h-8 w-px bg-gradient-to-b from-[#C9A84C]/50 to-transparent" />
                      </div>

                      <div className="space-y-0.5">
                        <p className="text-[0.55rem] text-[#7C8088] font-bold uppercase tracking-wider">To</p>
                        <p className="font-heading text-lg font-bold text-[#F5F0E8] leading-tight">{route.toCity}</p>
                      </div>
                    </div>

                    {/* Meta */}
                    <div className="flex items-center gap-4 text-xs text-[#A1A1A6] pt-2">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-[#C9A84C]/60" />
                        <span>~{Math.round(route.duration / 60)} hrs {route.duration % 60 > 0 ? `${route.duration % 60} min` : ''}</span>
                      </div>
                    </div>
                  </div>

                  {/* Price & CTA */}
                  <div className="mt-8 pt-6 border-t border-[#C9A84C]/10 flex items-end justify-between">
                    <div>
                      <p className="text-[0.6rem] text-[#7C8088] uppercase font-bold tracking-wider">From</p>
                      <p className="font-heading text-2xl font-bold text-[#C9A84C]">SAR {route.basePrice}</p>
                    </div>
                    <Link
                      href={`/routes/${route.slug}`}
                      className="flex items-center justify-center gap-1.5 rounded-full bg-[#C9A84C] px-5 py-2.5 text-[0.65rem] font-bold uppercase tracking-wider text-[#0A0A0A] hover:bg-[#B8963B] transition-all"
                    >
                      View <ChevronRight className="h-3 w-3" />
                    </Link>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </AnimatePresence>

        {/* Custom Route CTA */}
        <div className="mt-14 rounded-3xl border border-[#C9A84C]/20 bg-[#111111] p-8 text-center space-y-4">
          <span className="text-[0.65rem] uppercase tracking-[0.2em] text-[#C9A84C] font-bold">Custom Route</span>
          <h2 className="font-heading text-2xl font-bold">Need a specific transfer?</h2>
          <p className="text-sm text-[#A1A1A6] max-w-lg mx-auto">
            We cover all of Saudi Arabia and GCC. Contact our concierge for a customized VIP transfer quote.
          </p>
          <div className="flex justify-center pt-2">
            <a
              href={`https://wa.me/${contactConfig.whatsappNumber}?text=Salam, I need a custom route quote.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full bg-[#C9A84C] px-7 py-3.5 text-xs font-bold uppercase text-[#0A0A0A] hover:bg-[#B8963B] transition-all shadow-[0_4px_20px_rgba(201,168,76,0.3)]"
            >
              <Car className="h-4 w-4" />
              Contact Concierge
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
