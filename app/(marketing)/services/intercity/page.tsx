import { Metadata } from "next";
import Image from "next/image";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { ServiceRelatedLinks } from "@/components/seo/ServiceRelatedLinks";
import { serviceSchema, faqSchema } from "@/lib/schema";
import Link from "next/link";
import { Map, Car, ShieldCheck, Clock, Navigation, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  alternates: { canonical: "https://taxisaudiarabia.com/services/intercity" },
  title: "Intercity Taxi Saudi Arabia | Long-Distance City Transfers",
  description: "Book an intercity taxi in Saudi Arabia for long-distance rides between Riyadh, Jeddah, Makkah, Madinah & Dammam. Fixed prices, clean cars, 24/7 drivers.",
};

const POPULAR_COMBINATIONS = [
  { from: "Riyadh", to: "Dammam", dist: "410 km", time: "4.5 hrs", price: 699, img: "/locations/dammam-hero.webp" },
  { from: "Jeddah", to: "Madinah", dist: "420 km", time: "4.5 hrs", price: 549, img: "/locations/madinah-hero.webp" },
  { from: "Makkah", to: "Taif", dist: "90 km", time: "1.5 hrs", price: 349, img: "/locations/taif-hero.webp" },
  { from: "Riyadh", to: "Al-Qassim", dist: "350 km", time: "3.5 hrs", price: 900, img: "/locations/riyadh-hero.webp" },
];

const FAQS = [
  {
    q: "Do you make rest stops on long journeys?",
    a: "Absolutely. For trips exceeding 2 hours (like Riyadh to Dammam), your driver is happy to stop at major service stations along the highway for food, restroom breaks, or prayer."
  },
  {
    q: "Can I bring excess luggage?",
    a: "Yes. Unlike trains or flights, booking a private SUV (like a Chevrolet Suburban) allows you to bring significantly more luggage without strict weight limits."
  },
  {
    q: "Are the vehicles comfortable for 5+ hour drives?",
    a: "We deploy our premium fleet for intercity trips. All vehicles feature advanced climate control, comfortable leather seating, and complimentary bottled water."
  }
];

export default function IntercityServicePage() {
  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#1C1C1C] pb-24">
      <JsonLd
        data={[
          serviceSchema({
            name: "Intercity Taxi Service",
            description:
              "Long-distance intercity taxi service in Saudi Arabia between Riyadh, Jeddah, Makkah, Madinah, Dammam, and Taif at fixed prices.",
            path: "/services/intercity",
            serviceType: "Intercity Transfer",
            areaServed: ["Riyadh", "Jeddah", "Makkah", "Madinah", "Dammam", "Taif"],
          }),
          faqSchema(FAQS.map((f) => ({ question: f.q, answer: f.a }))),
        ]}
      />
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Services", href: "/services" },
          { name: "Intercity", href: "/services/intercity" },
        ]}
      />
      {/* ─── HERO ─────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 overflow-hidden border-b border-[#C9A84C]/10">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/services/intercity-hero.webp" 
            alt="Saudi Arabia Highway" 
            fill 
            className="object-cover opacity-30" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAF7] via-[#FAFAF7]/80 to-[#FAFAF7]/40" />
        </div>

        <div className="section-container relative z-10 max-w-5xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 backdrop-blur-md px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#B8963B] mb-6">
            <Navigation className="h-3 w-3" /> Kingdom-Wide
          </span>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Intercity Executive <br />
            <span className="text-[#16A34A]">Transfers</span>
          </h1>
          <p className="max-w-2xl mx-auto text-sm md:text-base text-[#6B7280] leading-relaxed mb-10">
            Skip the airport lines and rigid train schedules. Travel door-to-door between any two cities in Saudi Arabia in absolute privacy and comfort.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/routes"
              className="inline-flex items-center gap-2 rounded-full bg-[#16A34A] px-8 py-3.5 text-xs font-bold uppercase text-white hover:bg-[#15803D] transition-all"
            >
              View All Routes
            </Link>
          </div>
        </div>
      </section>

      {/* ─── WHY PRIVATE TAXI ─────────────────────────────────────── */}
      <section className="section-container max-w-7xl py-20 border-b border-[#C9A84C]/10">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl font-bold mb-4">Why Choose Private Over Public Transport?</h2>
          <p className="text-[#6B7280]">Comparing our Driver service vs Flights and Trains.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-3xl p-8 border border-[#16A34A]/15 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Car className="h-24 w-24 text-[#C9A84C]" />
            </div>
            <h3 className="font-heading text-xl font-bold mb-4 text-[#1C1C1C]">True Door-to-Door</h3>
            <p className="text-sm text-[#6B7280] leading-relaxed">
              No need to taxi to a train station, wait an hour, board, and then taxi again to your final hotel. We pick you up from your lobby and drop you at your destination&apos;s doorstep.
            </p>
          </div>
          <div className="bg-white rounded-3xl p-8 border border-[#16A34A]/15 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Clock className="h-24 w-24 text-[#C9A84C]" />
            </div>
            <h3 className="font-heading text-xl font-bold mb-4 text-[#1C1C1C]">Your Schedule</h3>
            <p className="text-sm text-[#6B7280] leading-relaxed">
              Depart at 3 AM or 3 PM. You dictate the schedule. If your meeting runs late, your driver waits. You are never stressed about missing a departure.
            </p>
          </div>
          <div className="bg-white rounded-3xl p-8 border border-[#16A34A]/15 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <ShieldCheck className="h-24 w-24 text-[#C9A84C]" />
            </div>
            <h3 className="font-heading text-xl font-bold mb-4 text-[#1C1C1C]">Privacy & Productivity</h3>
            <p className="text-sm text-[#6B7280] leading-relaxed">
              Conduct confidential business calls, let the family sleep in peace, or simply enjoy the silence. Your vehicle is your private sanctuary across the desert.
            </p>
          </div>
        </div>
      </section>

      {/* ─── POPULAR COMBINATIONS ─────────────────────────────────── */}
      <section className="section-container max-w-7xl py-20">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl font-bold mb-4">Popular Intercity Routes</h2>
          <p className="text-[#6B7280]">Our most frequently booked long-distance journeys. Estimated fares — your final quotation is confirmed on WhatsApp or email.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {POPULAR_COMBINATIONS.map((route, i) => (
            <div key={i} className="group rounded-3xl overflow-hidden border border-[#16A34A]/12 bg-white hover:border-[#16A34A]/35 transition-all duration-300">
              <div className="relative h-48">
                <Image src={route.img} alt={`${route.from} to ${route.to}`} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111] to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-2 text-lg font-bold text-white">
                    {route.from} <span className="text-[#FACC15]">→</span> {route.to}
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-6 text-xs text-[#6B7280]">
                  <span className="flex items-center gap-1.5"><Map className="h-3 w-3" /> {route.dist}</span>
                  <span className="flex items-center gap-1.5"><Clock className="h-3 w-3" /> {route.time}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[0.6rem] uppercase text-[#6B7280] font-bold tracking-wider">Starting at</p>
                    <p className="text-[#16A34A] font-bold">SAR {route.price}</p>
                  </div>
                  <Link href={`/book?pickup=${encodeURIComponent(route.from)}&dropoff=${encodeURIComponent(route.to)}`} className="text-xs font-bold uppercase text-[#1C1C1C] hover:text-[#16A34A] transition-colors">
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── ROUTE MATRIX ─────────────────────────────────────────── */}
      <section className="section-container max-w-4xl py-12">
         <div className="bg-white border border-[#16A34A]/15 shadow-lg rounded-3xl p-8 text-center">
            <h3 className="font-heading text-2xl font-bold mb-3 text-[#1C1C1C]">Don&apos;t see your route?</h3>
            <p className="text-[#6B7280] mb-6 max-w-lg mx-auto text-sm">
              We cover all regions of Saudi Arabia, from Tabuk to Najran. Use our booking engine to get an instant quote for any custom intercity route.
            </p>
            <Link
              href="/book"
              className="inline-flex items-center gap-2 rounded-full border border-[#C9A84C] px-8 py-3 text-xs font-bold uppercase text-[#C9A84C] hover:bg-[#C9A84C]/10 transition-all"
            >
              Get Custom Quote
            </Link>
         </div>
      </section>

      {/* ─── FAQ ──────────────────────────────────────────────────── */}
      <section className="section-container max-w-4xl py-20 border-t border-[#C9A84C]/10">
        <h2 className="font-heading text-3xl font-bold mb-12 text-center">Intercity Travel FAQ</h2>
        <div className="space-y-6">
          {FAQS.map((faq, i) => (
            <div key={i} className="bg-white border border-[#16A34A]/12 rounded-2xl p-6">
              <h4 className="font-bold text-[#1C1C1C] mb-3 flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-[#C9A84C] shrink-0 mt-0.5" />
                {faq.q}
              </h4>
              <p className="text-sm text-[#6B7280] leading-relaxed pl-8">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
      <ServiceRelatedLinks currentPath="/services/intercity" />
    </div>
  );
}
