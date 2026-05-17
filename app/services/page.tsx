"use client";

import { motion } from "framer-motion";
import {
  Plane, Star, Users, Clock, MapPin, Sparkles,
  ShieldCheck, Building2, Heart, Camera, Car, MessageCircle, ChevronRight
} from "lucide-react";
import Link from "next/link";
import { contactConfig } from "@/lib/config/contact";

const SERVICES = [
  {
    icon: Plane,
    slug: "airport-transfers",
    title: "Airport Transfers",
    titleAr: "نقل المطارات",
    badge: "24/7 Service",
    color: "from-blue-500/10 to-transparent",
    borderColor: "border-blue-500/20",
    description: "Meet & greet at arrivals, live flight tracking, professional chauffeurs with name signs, and luggage assistance. Serving JED, RUH, DMM and all KSA airports.",
    features: [
      "Live flight tracking — wait free if delayed",
      "Name board at arrivals terminal",
      "Full luggage assistance",
      "Multilingual chauffeur (EN / AR / UR)",
      "Available all 24 hours, 365 days",
    ],
    startingPrice: 80,
    route: "/book?service=airport",
  },
  {
    icon: Sparkles,
    slug: "umrah-transport",
    title: "Umrah & Pilgrimage",
    titleAr: "نقل العمرة والحج",
    badge: "Most Requested",
    color: "from-emerald-500/10 to-transparent",
    borderColor: "border-emerald-500/20",
    description: "Dedicated pilgrimage transfers between Jeddah Airport, Makkah, and Madinah. Prayer-time aware scheduling, zamzam water, and respectful service for your spiritual journey.",
    features: [
      "Jeddah ↔ Makkah ↔ Madinah corridors",
      "Prayer-time sensitive scheduling",
      "Zamzam storage space guaranteed",
      "Complimentary prayer mat & Quran",
      "Elderly & wheelchair-friendly vehicles",
    ],
    startingPrice: 180,
    route: "/book?service=umrah",
  },
  {
    icon: Building2,
    slug: "business-executive",
    title: "Corporate & VIP Executive",
    titleAr: "الخدمات التنفيذية والشركات",
    badge: "Business Class",
    color: "from-amber-500/10 to-transparent",
    borderColor: "border-amber-500/20",
    description: "Luxury fleet for business delegations, C-suite executives, Saudi board meetings, and diplomatic arrivals. Discretion and professionalism guaranteed.",
    features: [
      "Signed NDAs available on request",
      "Advance route scouting for delegations",
      "On-board WiFi & charging ports",
      "Corporate billing & monthly invoicing",
      "Dedicated account manager",
    ],
    startingPrice: 200,
    route: "/book?service=corporate",
  },
  {
    icon: Star,
    slug: "vip-luxury",
    title: "VIP Luxury Charter",
    titleAr: "تأجير VIP الفاخر",
    badge: "Ultra Premium",
    color: "from-purple-500/10 to-transparent",
    borderColor: "border-purple-500/20",
    description: "Mercedes S-Class, BMW 7 Series, and Cadillac Escalade available for full-day, half-day, or hourly exclusive charter. Perfect for dignitaries, celebrities, and ultra-HNW clients.",
    features: [
      "S-Class, BMW 7 Series, Escalade fleet",
      "Dedicated concierge attendant available",
      "Chilled beverages & refreshments",
      "Roses, gifts, surprise setups on request",
      "Arrival fanfare coordination",
    ],
    startingPrice: 250,
    route: "/book?service=vip",
  },
  {
    icon: Heart,
    slug: "wedding-events",
    title: "Weddings & Special Events",
    titleAr: "الأفراح والمناسبات الخاصة",
    badge: "Special Occasions",
    color: "from-rose-500/10 to-transparent",
    borderColor: "border-rose-500/20",
    description: "Impeccably decorated fleet for Saudi weddings, engagement ceremonies, graduation celebrations, and luxury events. Full convoy arrangements available.",
    features: [
      "White ribbon & floral decoration",
      "Bridal entourage convoy arrangements",
      "Photography-ready presentation",
      "Royal red carpet deployment",
      "Multilingual MC chauffeur available",
    ],
    startingPrice: 400,
    route: "/book?service=wedding",
  },
  {
    icon: Camera,
    slug: "tourism-tours",
    title: "Tourism & Private Tours",
    titleAr: "السياحة والجولات الخاصة",
    badge: "Explore KSA",
    color: "from-cyan-500/10 to-transparent",
    borderColor: "border-cyan-500/20",
    description: "Full-day guided private touring of AlUla, Diriyah, NEOM, and Saudi heritage sites. Expert bilingual guides and luxury vehicles for inbound tourists.",
    features: [
      "AlUla, Diriyah, NEOM packages",
      "Bilingual cultural guide on board",
      "Photography stops included",
      "Halal meal planning assistance",
      "Multi-day touring packages",
    ],
    startingPrice: 350,
    route: "/book?service=tourism",
  },
  {
    icon: Users,
    slug: "group-transport",
    title: "Group & Pilgrimage Bus",
    titleAr: "نقل المجموعات والحافلات",
    badge: "Up to 25 Pax",
    color: "from-orange-500/10 to-transparent",
    borderColor: "border-orange-500/20",
    description: "Coaster, Sprinter, and luxury bus for pilgrimage groups, corporate tours, school trips, and large family groups. Scalable fleet for any group size.",
    features: [
      "Toyota Coaster & Mercedes Sprinter",
      "Luxury bus with WiFi & entertainment",
      "Luggage bay for heavy loads",
      "Pilgrimage group specialist drivers",
      "Multi-pickup point coordination",
    ],
    startingPrice: 300,
    route: "/book?service=group",
  },
  {
    icon: Clock,
    slug: "hourly-charter",
    title: "Hourly Charter Service",
    titleAr: "الإيجار بالساعة",
    badge: "4 – 24 Hours",
    color: "from-indigo-500/10 to-transparent",
    borderColor: "border-indigo-500/20",
    description: "Book your driver for 4, 8, 12, or 24 hours for complete flexibility. Ideal for business road shows, city exploration, or multi-stop transfers.",
    features: [
      "4, 8, 12 or 24-hour packages",
      "Unlimited stops within service hours",
      "No extra charge for waiting time",
      "Driver on standby at all times",
      "Flexible city or intercity coverage",
    ],
    startingPrice: 250,
    route: "/book?tripType=hourly",
  },
];

const fadeUp = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0 } };

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8]">

      {/* ─── HERO ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 bg-gradient-to-b from-[#C9A84C]/6 to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[400px] w-[800px] rounded-full bg-[#C9A84C]/4 blur-3xl pointer-events-none" />

        <div className="section-container relative z-10 max-w-5xl">
          <motion.div initial="hidden" animate="show" variants={fadeUp} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/8 px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#C9A84C]">
              <Car className="h-3 w-3" /> Premium Services
            </span>
            <h1 className="mt-6 font-heading text-4xl font-bold leading-tight md:text-6xl">
              8 Elite Transfer Services<br />
              <span className="text-[#C9A84C]">Tailored to Every Need</span>
            </h1>
            <p className="mt-6 max-w-2xl text-sm md:text-base leading-relaxed text-[#A1A1A6]">
              From Umrah pilgrimage transfers to royal wedding convoys — we have a premium service
              crafted for every occasion across Saudi Arabia and the GCC region.
            </p>
          </motion.div>

          {/* Quick stats */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeUp}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-5 max-w-2xl"
          >
            {[
              { value: "8", label: "Service Types" },
              { value: "14", label: "Fleet Vehicles" },
              { value: "50K+", label: "Trips Completed" },
              { value: "4.9★", label: "Average Rating" },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-[#C9A84C]/10 bg-[#111111] p-4 text-center">
                <p className="font-heading text-xl font-bold text-[#C9A84C]">{s.value}</p>
                <p className="text-[0.6rem] text-[#7C8088] font-bold uppercase tracking-wider mt-1">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── SERVICES GRID ────────────────────────────────────────── */}
      <section className="section-container max-w-6xl py-10 pb-24">
        <div className="grid gap-6 md:grid-cols-2">
          {SERVICES.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.article
                key={service.slug}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.1 }}
                variants={fadeUp}
                transition={{ duration: 0.45, delay: (index % 4) * 0.08 }}
                className={`group relative overflow-hidden rounded-3xl border bg-[#111111] p-7 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(201,168,76,0.08)] ${service.borderColor} hover:border-[#C9A84C]/40`}
              >
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-60 pointer-events-none rounded-3xl`} />

                <div className="relative space-y-5">
                  {/* Header row */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#C9A84C]/10 border border-[#C9A84C]/20">
                        <Icon className="h-5 w-5 text-[#C9A84C]" />
                      </div>
                      <div>
                        <span className="text-[0.55rem] font-bold uppercase tracking-wider text-[#C9A84C]">{service.badge}</span>
                        <h2 className="font-heading text-lg font-bold text-[#F5F0E8] group-hover:text-[#C9A84C] transition-colors leading-tight">
                          {service.title}
                        </h2>
                        <p className="text-[0.6rem] text-[#7C8088]">{service.titleAr}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[0.55rem] text-[#7C8088] uppercase font-bold">From</p>
                      <p className="font-heading text-lg font-bold text-[#C9A84C]">SAR {service.startingPrice}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-[#A1A1A6] leading-relaxed">{service.description}</p>

                  {/* Features */}
                  <ul className="space-y-2">
                    {service.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-[0.65rem] text-[#A1A1A6]">
                        <ShieldCheck className="h-3.5 w-3.5 text-[#C9A84C] shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Buttons */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <Link
                      href={service.route}
                      className="flex items-center justify-center gap-1.5 rounded-full bg-[#C9A84C] py-3 text-[0.65rem] font-bold uppercase tracking-wider text-[#0A0A0A] hover:bg-[#B8963B] transition-all shadow-[0_4px_14px_rgba(201,168,76,0.2)]"
                    >
                      Book Now
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                    <a
                      href={`https://wa.me/${contactConfig.whatsappNumber}?text=Salam, I need your ${service.title} service.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 rounded-full border border-[#C9A84C]/30 py-3 text-[0.65rem] font-bold uppercase tracking-wider text-[#C9A84C] hover:bg-[#C9A84C]/10 transition-all"
                    >
                      <MessageCircle className="h-3.5 w-3.5 fill-current" />
                      Inquire
                    </a>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* Trust Section */}
        <div className="mt-16 rounded-3xl border border-[#C9A84C]/15 bg-[#111111] p-8 md:p-12">
          <div className="grid gap-8 md:grid-cols-2 items-center">
            <div className="space-y-4">
              <span className="text-[0.65rem] uppercase tracking-[0.2em] text-[#C9A84C] font-bold">Why Riyadh Luxe?</span>
              <h2 className="font-heading text-2xl md:text-3xl font-bold">
                Saudi Arabia&apos;s Most Trusted<br />Chauffeur Brand
              </h2>
              <p className="text-sm text-[#A1A1A6] leading-relaxed">
                Every chauffeur is Saudi GTA certified, background-checked, and trained in elite hospitality standards.
                Every vehicle is GPS-tracked, fully insured, and inspected monthly.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: ShieldCheck, label: "GTA Licensed", sub: "Saudi Transport Authority" },
                { icon: MapPin, label: "GPS Tracked", sub: "Every trip monitored" },
                { icon: Clock, label: "Always On-Time", sub: "98.7% punctuality rate" },
                { icon: Star, label: "4.9/5 Rating", sub: "Based on 4,200+ reviews" },
              ].map((item) => {
                const ItemIcon = item.icon;
                return (
                  <div key={item.label} className="rounded-2xl border border-[#C9A84C]/10 bg-black/30 p-4 space-y-2">
                    <ItemIcon className="h-5 w-5 text-[#C9A84C]" />
                    <p className="text-xs font-bold text-[#F5F0E8]">{item.label}</p>
                    <p className="text-[0.6rem] text-[#7C8088]">{item.sub}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
