import { Metadata } from "next";
import Image from "next/image";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { ServiceRelatedLinks } from "@/components/seo/ServiceRelatedLinks";
import { serviceSchema, faqSchema } from "@/lib/schema";
import Link from "next/link";
import { Map, Clock, Compass, ChevronRight, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  alternates: { canonical: "https://taxisaudiarabia.com/services/tourism" },
  title: "Day Trip Car Hire Saudi Arabia | AlUla, Taif, NEOM & Abha",
  description: "Hire a car with driver for day trips in Saudi Arabia — explore AlUla, NEOM, Abha, Taif & Diriyah. Hourly and full-day rates. Book online or on WhatsApp.",
};

const DESTINATIONS = [
  { name: "AlUla & Khaybar", tag: "Heritage", desc: "Transport to Hegra, Elephant Rock, and ancient oasis towns.", img: "/locations/alula-hero.webp" },
  { name: "NEOM & Tabuk", tag: "Future City", desc: "Executive transfers across the developing giga-project zones.", img: "/locations/neom-hero.webp" },
  { name: "Abha (Asir)", tag: "Mountains", desc: "Navigate the high-altitude winding roads of Soudah Peak.", img: "/locations/abha-hero.webp" },
  { name: "Taif", tag: "Nature", desc: "Day trips from Jeddah/Makkah to the city of roses.", img: "/locations/taif-hero.webp" }
];

const CHARTER_RATES = [
  { class: "Executive Sedan", ex: "Toyota Camry / Ford Taurus", hourly: "SAR 120/hr", daily: "SAR 1,000/day" },
  { class: "Premium SUV", ex: "GMC Yukon / Chevy Tahoe", hourly: "SAR 180/hr", daily: "SAR 1,500/day" },
  { class: "Luxury Sedan", ex: "Mercedes S-Class / BMW 7", hourly: "SAR 300/hr", daily: "SAR 2,500/day" },
  { class: "VIP Van", ex: "Mercedes V-Class (7 Pax)", hourly: "SAR 250/hr", daily: "SAR 2,000/day" }
];

export default function TourismChartersPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#1C1C1C] pb-24">
      <JsonLd
        data={serviceSchema({
          name: "Tourism & Day Trip Car Hire",
          description:
            "Day trip car hire with a driver in Saudi Arabia to AlUla, NEOM, Abha, Taif, and Diriyah with hourly and full-day rates and a driver who waits at every stop.",
          path: "/services/tourism",
          serviceType: "Tourism Transport",
          areaServed: ["AlUla", "NEOM", "Abha", "Taif"],
        })}
      />
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Services", href: "/services" },
          { name: "Tourism & Day Trips", href: "/services/tourism" },
        ]}
      />
      {/* ─── HERO ─────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 overflow-hidden border-b border-[#C9A84C]/10">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/services/tourism-hero.webp" 
            alt="Saudi Tourism Transport" 
            fill 
            className="object-cover opacity-40" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAF7] via-[#FAFAF7]/80 to-[#FAFAF7]/40" />
        </div>

        <div className="section-container relative z-10 max-w-5xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 backdrop-blur-md px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#B8963B] mb-6">
            <Compass className="h-3 w-3" /> Explore Saudi Arabia
          </span>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Tourism Transport & <br />
            <span className="text-[#16A34A]">Private Charters</span>
          </h1>
          <p className="max-w-2xl mx-auto text-sm md:text-base text-[#6B7280] leading-relaxed mb-10">
            From the ancient ruins of AlUla to the cool mountains of Abha. Hire a private driver by the hour or by the day to explore the Kingdom at your own pace.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/book?type=charter"
              className="inline-flex items-center gap-2 rounded-full bg-[#16A34A] px-8 py-3.5 text-xs font-bold uppercase text-white hover:bg-[#15803D] transition-all"
            >
              Book a Charter
            </Link>
          </div>
        </div>
      </section>

      {/* ─── DESTINATIONS ─────────────────────────────────────────── */}
      <section className="section-container max-w-7xl py-20 border-b border-[#C9A84C]/10">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl font-bold mb-4">Top Tourism Destinations</h2>
          <p className="text-[#6B7280]">We provide specialized logistics for remote and mountainous heritage sites.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {DESTINATIONS.map((dest, i) => (
            <div key={i} className="group rounded-3xl overflow-hidden border border-[#16A34A]/12 bg-white hover:border-[#16A34A]/35 transition-all duration-300">
              <div className="relative h-64 w-full">
                <Image src={dest.img} alt={dest.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-black/40 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="rounded-full bg-[#FAFAF7]/80 backdrop-blur-md px-3 py-1 text-[0.55rem] font-bold uppercase tracking-wider text-[#B8963B] border border-[#16A34A]/15">
                    {dest.tag}
                  </span>
                </div>
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="font-heading text-xl font-bold text-white mb-2">{dest.name}</h3>
                  <p className="text-xs text-white/85 line-clamp-2">{dest.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CHARTER VS DAY TRIP ──────────────────────────────────── */}
      <section className="section-container max-w-5xl py-20">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="bg-white p-10 rounded-3xl border border-[#16A34A]/15">
            <Clock className="h-10 w-10 text-[#C9A84C] mb-6" />
            <h3 className="font-heading text-2xl font-bold mb-4 text-[#1C1C1C]">Hourly Charters</h3>
            <p className="text-[#6B7280] text-sm leading-relaxed mb-6">
              Perfect for city tours in Riyadh or Jeddah. Your driver stays with you, waiting at every stop. Ideal for shopping trips, restaurant hopping, or visiting multiple museums in a single afternoon.
            </p>
            <ul className="space-y-2 mb-8">
              <li className="flex gap-2 text-sm text-[#1C1C1C]"><CheckCircle2 className="h-4 w-4 text-[#C9A84C] shrink-0 mt-0.5" /> Minimum 4 hours</li>
              <li className="flex gap-2 text-sm text-[#1C1C1C]"><CheckCircle2 className="h-4 w-4 text-[#C9A84C] shrink-0 mt-0.5" /> Mileage limits apply per hour</li>
            </ul>
          </div>
          <div className="bg-white p-10 rounded-3xl border border-[#16A34A]/15">
            <Map className="h-10 w-10 text-[#C9A84C] mb-6" />
            <h3 className="font-heading text-2xl font-bold mb-4 text-[#1C1C1C]">Multi-Day Packages</h3>
            <p className="text-[#6B7280] text-sm leading-relaxed mb-6">
              Essential for trips to AlUla, NEOM, or the Asir region. The driver and vehicle are exclusively yours for consecutive days, giving you total freedom to explore remote areas.
            </p>
            <ul className="space-y-2 mb-8">
              <li className="flex gap-2 text-sm text-[#1C1C1C]"><CheckCircle2 className="h-4 w-4 text-[#C9A84C] shrink-0 mt-0.5" /> 10 to 12 hours of service per day</li>
              <li className="flex gap-2 text-sm text-[#1C1C1C]"><CheckCircle2 className="h-4 w-4 text-[#C9A84C] shrink-0 mt-0.5" /> Driver accommodation handled by us</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ─── CHARTER RATES TABLE ──────────────────────────────────── */}
      <section className="section-container max-w-5xl py-20 border-t border-[#C9A84C]/10">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl font-bold mb-4">Charter Pricing Estimates</h2>
          <p className="text-[#6B7280]">Base rates for inside-city charters. Intercity charters may incur surcharges.</p>
        </div>

        <div className="bg-white rounded-3xl border border-[#16A34A]/12 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F0FDF4] border-b border-[#C9A84C]/10 text-[0.65rem] uppercase tracking-widest text-[#6B7280]">
                  <th className="p-6 font-bold">Vehicle Class</th>
                  <th className="p-6 font-bold">Example Models</th>
                  <th className="p-6 font-bold text-center">Hourly Rate</th>
                  <th className="p-6 font-bold text-center">Daily Rate (10 Hrs)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#C9A84C]/5">
                {CHARTER_RATES.map((rate, i) => (
                  <tr key={i} className="hover:bg-[#F0FDF4]/60 transition-colors">
                    <td className="p-6 font-bold text-sm text-[#1C1C1C]">{rate.class}</td>
                    <td className="p-6 text-sm text-[#6B7280]">{rate.ex}</td>
                    <td className="p-6 font-bold text-[#16A34A] text-center">{rate.hourly}</td>
                    <td className="p-6 font-bold text-[#16A34A] text-center">{rate.daily}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="mt-12 text-center">
            <Link
              href="/book?type=charter"
              className="inline-flex items-center gap-2 rounded-full border border-[#C9A84C] px-8 py-4 text-xs font-bold uppercase text-[#C9A84C] hover:bg-[#C9A84C]/10 transition-all"
            >
              Request Custom Quote <ChevronRight className="h-4 w-4" />
            </Link>
        </div>
      </section>
      {(() => {
        const faqs = [
          { question: "Do you offer hourly and full-day car hire?", answer: "Yes. You can hire a car with a driver by the hour or for a full day, with your driver waiting at every stop." },
          { question: "Which destinations are popular for day trips?", answer: "AlUla, NEOM and Tabuk, Abha in Asir, Taif, and Diriyah are among the most requested day-trip destinations." },
          { question: "Can the driver wait while I explore?", answer: "Yes. With charter bookings your driver stays with you throughout, so you never wait for a ride between stops." },
        ];
        return (
          <>
            <JsonLd data={faqSchema(faqs)} />
            <section className="section-container max-w-4xl py-20 border-t border-[#C9A84C]/10">
              <h2 className="font-heading text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {faqs.map((f, i) => (
                  <div key={i} className="bg-white border border-[#16A34A]/12 rounded-2xl p-6">
                    <h3 className="font-bold text-[#1C1C1C] mb-2">{f.question}</h3>
                    <p className="text-sm text-[#6B7280] leading-relaxed">{f.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          </>
        );
      })()}
      <ServiceRelatedLinks currentPath="/services/tourism" />
    </div>
  );
}
