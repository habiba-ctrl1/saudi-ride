import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { ServiceRelatedLinks } from "@/components/seo/ServiceRelatedLinks";
import { serviceSchema, faqSchema, itemListSchema } from "@/lib/schema";
import { RecoveryLeadForm } from "@/components/recovery/RecoveryLeadForm";
import {
  RECOVERY_CITIES,
  RECOVERY_SERVICES,
  RECOVERY_PRICING,
  RECOVERY_GLOBAL_FAQS,
} from "@/lib/data/recovery";
import {
  Truck,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  MessageCircle,
  BadgeDollarSign,
  Wrench,
} from "lucide-react";

export const metadata: Metadata = {
  alternates: { canonical: "https://taxisaudiarabia.com/services/car-recovery" },
  title: "Car Recovery Saudi Arabia | 24/7 Tow Truck & Flatbed Satha (سطحة)",
  description:
    "24/7 car recovery & towing service in Saudi Arabia. Flatbed tow truck (satha سطحة) in Riyadh, Jeddah, Dammam, Makkah & Madinah. Fixed prices on WhatsApp, fast dispatch, intercity car transport.",
  keywords: [
    "car recovery Saudi Arabia", "tow truck Saudi Arabia", "satha", "سطحة",
    "flatbed towing", "car towing service", "roadside assistance Saudi Arabia",
    "سطحة الرياض", "سطحة جدة", "سطحة الدمام", "car transport Saudi Arabia", "winch truck",
  ],
};

const STEPS = [
  {
    icon: MessageCircle,
    title: "Send Your Location",
    desc: "WhatsApp us your live location, car model, and what happened — breakdown, accident, flat battery, or tire.",
  },
  {
    icon: BadgeDollarSign,
    title: "Get a Fixed Price",
    desc: "We reply within minutes with a fixed price and the truck's ETA. No meter, no surprises, no arrival fees.",
  },
  {
    icon: Truck,
    title: "Truck Dispatched",
    desc: "The nearest flatbed (satha) is dispatched to you. Track the driver by phone until he reaches you.",
  },
  {
    icon: Wrench,
    title: "Safe Delivery",
    desc: "Your car is winched fully onto the bed and delivered to the workshop, dealership, or your home — with photos on request.",
  },
];

export default function CarRecoveryPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#1C1C1C] pb-24">
      <JsonLd
        data={[
          serviceSchema({
            name: "Car Recovery & Towing Service (Satha سطحة)",
            description:
              "24/7 flatbed car recovery, towing, roadside assistance, and intercity car transport across Saudi Arabia — Riyadh, Jeddah, Dammam, Makkah, and Madinah.",
            path: "/services/car-recovery",
            serviceType: "Vehicle Towing & Recovery",
            areaServed: RECOVERY_CITIES.map((c) => c.name),
          }),
          faqSchema(RECOVERY_GLOBAL_FAQS),
          itemListSchema(
            RECOVERY_CITIES.map((c) => ({
              name: `Car Recovery ${c.name} (${c.sathaAr})`,
              href: `/services/car-recovery/${c.slug}`,
            }))
          ),
        ]}
      />
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Services", href: "/services" },
          { name: "Car Recovery", href: "/services/car-recovery" },
        ]}
      />

      {/* ─── HERO ─────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 overflow-hidden border-b border-[#C9A84C]/10">
        <div className="absolute inset-0 z-0">
          <Image
            src="/services/car-recovery-hero.webp"
            alt="Flatbed tow truck (satha) recovering a car in Saudi Arabia"
            fill
            priority
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAF7] via-[#FAFAF7]/80 to-[#FAFAF7]/40" />
        </div>

        <div className="section-container relative z-10 max-w-5xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 backdrop-blur-md px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#B8963B] mb-6">
            <Clock className="h-3 w-3" /> 24/7 · All Saudi Arabia
          </span>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
            Car Recovery &amp; Tow Truck <br />
            <span className="text-[#16A34A]">Satha — سطحة</span>
          </h1>
          <p className="max-w-2xl mx-auto text-sm md:text-base text-[#6B7280] leading-relaxed mb-4">
            Broken down, in an accident, or need a car moved? A hydraulic flatbed
            (satha) reaches you fast in{" "}
            <Link href="/services/car-recovery/riyadh" className="text-[#16A34A] hover:underline">Riyadh</Link>,{" "}
            <Link href="/services/car-recovery/jeddah" className="text-[#16A34A] hover:underline">Jeddah</Link>,{" "}
            <Link href="/services/car-recovery/dammam" className="text-[#16A34A] hover:underline">Dammam</Link>,{" "}
            <Link href="/services/car-recovery/makkah" className="text-[#16A34A] hover:underline">Makkah</Link> &amp;{" "}
            <Link href="/services/car-recovery/madinah" className="text-[#16A34A] hover:underline">Madinah</Link>{" "}
            — with a fixed price on WhatsApp before the truck moves.
          </p>
          <p className="text-xs text-[#6B7280] mb-10" dir="rtl" lang="ar">
            سطحة الرياض · سطحة جدة · سطحة الدمام · سطحة مكة · سطحة المدينة — خدمة سحب السيارات ٢٤ ساعة
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="#request"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#16A34A] px-8 py-3.5 text-xs font-bold uppercase text-white hover:bg-[#15803D] transition-all"
            >
              Request Recovery Now
            </a>
            <a
              href="#pricing"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#C9A84C] px-8 py-3.5 text-xs font-bold uppercase text-[#B8963B] hover:bg-[#C9A84C]/10 transition-all"
            >
              See Towing Prices
            </a>
          </div>
        </div>
      </section>

      {/* ─── TRUST STRIP ──────────────────────────────────────────── */}
      <section className="section-container max-w-5xl py-10 border-b border-[#C9A84C]/10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: Clock, label: "20–45 min city dispatch" },
            { icon: BadgeDollarSign, label: "Fixed price before dispatch" },
            { icon: ShieldCheck, label: "Full flatbed — zero drag damage" },
            { icon: MapPin, label: "City + highway coverage" },
          ].map((t, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <t.icon className="h-6 w-6 text-[#C9A84C]" />
              <p className="text-xs font-bold text-[#1C1C1C]">{t.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── SERVICES ─────────────────────────────────────────────── */}
      <section className="section-container max-w-7xl py-20 border-b border-[#C9A84C]/10">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl font-bold mb-4">Recovery &amp; Towing Services</h2>
          <p className="text-[#6B7280] max-w-2xl mx-auto text-sm">
            From a dead battery in a parking lot to a full intercity car transport — one WhatsApp message covers it all.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {RECOVERY_SERVICES.map((s) => (
            <div key={s.key} className="bg-white rounded-3xl p-8 border border-[#16A34A]/15 hover:border-[#16A34A]/35 transition-all">
              <Truck className="h-8 w-8 text-[#C9A84C] mb-4" />
              <h3 className="font-heading text-lg font-bold mb-3">{s.name}</h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-[#6B7280] mt-10">
          Travelling with your car? Book yourself an{" "}
          <Link href="/services/intercity" className="text-[#16A34A] hover:underline">intercity taxi</Link>{" "}
          on the same route while we transport the vehicle.
        </p>
      </section>

      {/* ─── HOW IT WORKS ─────────────────────────────────────────── */}
      <section className="section-container max-w-7xl py-20 border-b border-[#C9A84C]/10">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl font-bold mb-4">How Car Recovery Works</h2>
          <p className="text-[#6B7280] text-sm">Four steps — usually under five minutes from message to dispatch.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((s, i) => (
            <div key={i} className="bg-white rounded-3xl p-8 border border-[#16A34A]/15 relative">
              <span className="absolute top-6 right-6 text-4xl font-bold text-[#C9A84C]/15">{i + 1}</span>
              <s.icon className="h-7 w-7 text-[#16A34A] mb-4" />
              <h3 className="font-heading text-lg font-bold mb-3">{s.title}</h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── PRICING ──────────────────────────────────────────────── */}
      <section id="pricing" className="section-container max-w-4xl py-20 border-b border-[#C9A84C]/10 scroll-mt-24">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl font-bold mb-4">Towing &amp; Recovery Prices</h2>
          <p className="text-[#6B7280] text-sm max-w-2xl mx-auto">
            Indicative starting prices. Your exact fixed quote is confirmed on WhatsApp before the truck moves — the price you agree is the price you pay.
          </p>
        </div>
        <div className="bg-white border border-[#16A34A]/15 rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#C9A84C]/15 bg-[#FAFAF7]">
                  <th className="text-left font-bold px-6 py-4">Service</th>
                  <th className="text-right font-bold px-6 py-4 whitespace-nowrap">Typical Price</th>
                </tr>
              </thead>
              <tbody>
                {RECOVERY_PRICING.map((row, i) => (
                  <tr key={i} className="border-b border-[#C9A84C]/8 last:border-0">
                    <td className="px-6 py-4 text-[#6B7280]">{row.service}</td>
                    <td className="px-6 py-4 text-right font-bold text-[#16A34A] whitespace-nowrap">{row.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ─── CITY COVERAGE ────────────────────────────────────────── */}
      <section className="section-container max-w-7xl py-20 border-b border-[#C9A84C]/10">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl font-bold mb-4">Recovery Coverage by City</h2>
          <p className="text-[#6B7280] text-sm">Dedicated flatbed coverage in the Kingdom&apos;s five biggest cities — and the highways between them.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {RECOVERY_CITIES.map((c) => (
            <Link
              key={c.slug}
              href={`/services/car-recovery/${c.slug}`}
              className="group rounded-3xl overflow-hidden border border-[#16A34A]/12 bg-white hover:border-[#16A34A]/35 transition-all duration-300"
            >
              <div className="relative h-44">
                <Image
                  src={c.image}
                  alt={`Car recovery and tow truck service in ${c.name} (${c.sathaAr})`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111] to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                  <div>
                    <p className="text-lg font-bold text-white">Car Recovery {c.name}</p>
                    <p className="text-xs text-white/80" dir="rtl" lang="ar">{c.sathaAr}</p>
                  </div>
                </div>
              </div>
              <div className="p-6 flex items-center justify-between">
                <p className="text-xs text-[#6B7280]">{c.tagline}</p>
                <span className="text-xs font-bold uppercase text-[#16A34A] shrink-0 ml-3">From SAR {c.startingPrice}</span>
              </div>
            </Link>
          ))}
          <div className="rounded-3xl border border-dashed border-[#C9A84C]/40 bg-[#C9A84C]/5 p-8 flex flex-col items-center justify-center text-center">
            <MapPin className="h-8 w-8 text-[#C9A84C] mb-3" />
            <h3 className="font-heading text-lg font-bold mb-2">Somewhere else?</h3>
            <p className="text-sm text-[#6B7280] mb-4">We also cover Taif, Al-Khobar, Qassim, Tabuk, and the highways between all major cities.</p>
            <a href="#request" className="text-xs font-bold uppercase text-[#16A34A] hover:underline">Send your location →</a>
          </div>
        </div>
      </section>

      {/* ─── LEAD FORM ────────────────────────────────────────────── */}
      <section id="request" className="section-container max-w-3xl py-20 border-b border-[#C9A84C]/10 scroll-mt-24">
        <div className="text-center mb-10">
          <h2 className="font-heading text-3xl font-bold mb-4">Request a Recovery Truck</h2>
          <p className="text-[#6B7280] text-sm">
            Fill the form and we call you back within minutes — or message us directly on WhatsApp for the fastest dispatch.
          </p>
        </div>
        <RecoveryLeadForm />
      </section>

      {/* ─── FAQ ──────────────────────────────────────────────────── */}
      <section className="section-container max-w-4xl py-20">
        <h2 className="font-heading text-3xl font-bold mb-12 text-center">Car Recovery FAQ</h2>
        <div className="space-y-6">
          {RECOVERY_GLOBAL_FAQS.map((faq, i) => (
            <div key={i} className="bg-white border border-[#16A34A]/12 rounded-2xl p-6">
              <h3 className="font-bold text-[#1C1C1C] mb-3 flex items-start gap-3 text-base">
                <CheckCircle2 className="h-5 w-5 text-[#C9A84C] shrink-0 mt-0.5" />
                {faq.question}
              </h3>
              <p className="text-sm text-[#6B7280] leading-relaxed pl-8">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <ServiceRelatedLinks currentPath="/services/car-recovery" />
    </div>
  );
}
