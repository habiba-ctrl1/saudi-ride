import { Metadata } from "next";
import Image from "next/image";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { ServiceRelatedLinks } from "@/components/seo/ServiceRelatedLinks";
import { serviceSchema, faqSchema, speakableSchema, airportTaxiServiceSchema } from "@/lib/schema";
import { AIRPORT_DETAILS } from "@/lib/data/airports";
import { TLDRSummary } from "@/components/seo/TLDRSummary";
import Link from "next/link";
import { Plane, Clock, UserCheck, CheckCircle2, ShieldCheck, Search, PlaneLanding, MapPin } from "lucide-react";

const TITLE = "Airport Taxi Saudi Arabia | Jeddah, Riyadh & Madinah Pickups";
const DESCRIPTION = "Private airport taxi in Saudi Arabia with pickups at Jeddah (JED), Riyadh (RUH) & Madinah (MED). Flight tracking, meet & greet, 24/7 professional drivers.";
const OG_IMAGE = "https://taxisaudiarabia.com/services/airport-transfers-hero.webp";

export const metadata: Metadata = {
  alternates: { canonical: "https://taxisaudiarabia.com/services/airport-transfers" },
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    url: "https://taxisaudiarabia.com/services/airport-transfers",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Airport taxi service in Saudi Arabia" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
};

const AIRPORT_ROUTES = [
  { airport: "Jeddah (JED)", dest: "Makkah", time: "1 hr", price: 249, routeSlug: "jeddah-airport-to-makkah" },
  { airport: "Jeddah (JED)", dest: "Madinah", time: "4.5 hrs", price: 549, routeSlug: "jeddah-airport-to-madinah" },
  { airport: "Jeddah (JED)", dest: "Jeddah City", time: "30 mins", price: 80, routeSlug: "jeddah-airport-to-jeddah-city" },
  { airport: "Riyadh (RUH)", dest: "City Center", time: "40 mins", price: 100, routeSlug: "riyadh-airport-to-city" },
  { airport: "Madinah (MED)", dest: "Haram Area", time: "25 mins", price: 80, routeSlug: "madinah-airport-to-city" },
];

const FAQS = [
  {
    q: "What if my flight is delayed?",
    a: "We actively track your flight using real-time data. Your driver will automatically adjust their arrival time to match your actual landing. We offer 60 minutes of free waiting time for arrivals."
  },
  {
    q: "How will I find my driver?",
    a: "Your driver will be waiting in the arrivals hall holding a name sign with your name on it. They will help you with your luggage and guide you directly to the car."
  },
  {
    q: "Are the prices fixed?",
    a: "Prices shown on the website are estimates. Your final fare is confirmed in your quotation on WhatsApp or email before the trip — and that confirmed price is final, with no hidden fees, toll charges, or surge pricing."
  }
];

export default function AirportTransfersPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#1C1C1C] pb-24">
      <JsonLd
        data={[
          serviceSchema({
            name: "Airport Taxi Service",
            description:
              "Private airport taxi service in Saudi Arabia with flight tracking and meet & greet at Jeddah (JED), Riyadh (RUH), and Madinah (MED) airports.",
            path: "/services/airport-transfers",
            serviceType: "Airport Transfer",
            areaServed: ["Jeddah", "Riyadh", "Madinah", "Dammam"],
          }),
          faqSchema(FAQS.map((f) => ({ question: f.q, answer: f.a }))),
          speakableSchema({ path: "/services/airport-transfers" }),
        ]}
      />
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Services", href: "/services" },
          { name: "Airport Transfers", href: "/services/airport-transfers" },
        ]}
      />
      {/* ─── HERO ─────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 overflow-hidden border-b border-[#C9A84C]/10">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/services/airport-transfers-hero.webp" 
            alt="Saudi Arabia Airport Transfer" 
            fill 
            className="object-cover opacity-80" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAF7] via-[#FAFAF7]/50 to-[#FAFAF7]/15" />
        </div>

        <div className="section-container relative z-10 max-w-5xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 backdrop-blur-md px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#B8963B] mb-6">
            <Plane className="h-3 w-3" /> Airport Services
          </span>
          <h1 className="font-heading text-4xl md:text-6xl font-bold leading-tight mb-6">
            Seamless Airport <br />
            <span className="text-[#16A34A]">Transfers Across KSA</span>
          </h1>
          <p className="max-w-2xl text-sm md:text-base text-[#6B7280] leading-relaxed mb-8">
            Arrive relaxed. We serve King Abdulaziz (JED), King Khalid (RUH), and Prince Mohammad Bin Abdulaziz (MED) airports with flight tracking, meet & greet, and zero waiting fees.
          </p>
          <div className="max-w-2xl mb-10">
            <TLDRSummary
              answer="Airport taxi transfers in Saudi Arabia start from SAR 80 (Jeddah city) to SAR 549 (Jeddah to Madinah), with flight tracking, meet & greet, and 60 minutes of free waiting time at Jeddah (JED), Riyadh (RUH), and Madinah (MED)."
              facts={[
                { label: "JED → Makkah", value: "From SAR 249" },
                { label: "RUH → City", value: "From SAR 100" },
                { label: "Free waiting", value: "60 minutes" },
                { label: "Availability", value: "24/7" },
              ]}
            />
          </div>

          {/* Flight Tracker UI (Frontend Only) */}
          <div className="bg-white/85 backdrop-blur-xl border border-[#16A34A]/15 p-6 rounded-3xl max-w-2xl shadow-2xl">
            <h3 className="text-sm font-bold text-[#1C1C1C] mb-4 flex items-center gap-2">
              <Search className="h-4 w-4 text-[#C9A84C]" /> Verify Flight Status
            </h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <input 
                type="text" 
                placeholder="Enter Flight Number (e.g. SV 112)" 
                className="flex-1 bg-[#FAFAF7] border border-[#C9A84C]/30 rounded-xl px-4 py-3 text-sm text-[#1C1C1C] focus:border-[#C9A84C] focus:outline-none transition-colors uppercase"
              />
              <button className="bg-[#16A34A] text-white font-bold uppercase tracking-wider text-xs px-6 py-3 rounded-xl hover:bg-[#15803D] transition-colors whitespace-nowrap">
                Track Flight
              </button>
            </div>
            <p className="text-[0.6rem] text-[#6B7280] mt-3 uppercase tracking-wider">
              *Our dispatch team monitors all entered flights automatically.
            </p>
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─────────────────────────────────────────────── */}
      <section className="section-container max-w-7xl py-20 border-b border-[#C9A84C]/10">
        <h2 className="font-heading text-3xl md:text-4xl font-bold mb-10 text-center">Why Book an Airport Taxi in Saudi Arabia</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: PlaneLanding, title: "Real-Time Flight Tracking", desc: "We monitor your flight and adjust pickup time for early or delayed arrivals." },
            { icon: UserCheck, title: "Meet & Greet at Arrivals", desc: "Driver awaits in the arrivals hall with a personalized name sign and helps with luggage." },
            { icon: Clock, title: "60 Minutes Free Waiting", desc: "Complimentary waiting time after landing for customs and baggage collection." },
            { icon: ShieldCheck, title: "Clear Fares Confirmed on WhatsApp", desc: "No hidden surge fees or toll charges. Your quoted price is confirmed before the trip." }
          ].map((feat, i) => (
            <div key={i} className="bg-white border border-[#16A34A]/12 rounded-3xl p-8 hover:border-[#16A34A]/35 transition-colors">
              <feat.icon className="h-8 w-8 text-[#C9A84C] mb-6" />
              <h3 className="font-heading text-lg font-bold mb-3">{feat.title}</h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── AIRPORT HUB LINKS ──────────────────────────────────── */}
      <section className="section-container max-w-7xl py-20 border-b border-[#C9A84C]/10">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Airports We Serve Across Saudi Arabia</h2>
          <p className="text-[#6B7280] max-w-2xl mx-auto">Pre-book your airport taxi at any of our covered airports. Each page has terminal info, transfer tips, and instant booking.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(AIRPORT_DETAILS).map(([slug, airport]) => (
            <Link
              key={slug}
              href={`/airports/${slug}`}
              className="group flex items-center gap-4 bg-white border border-[#16A34A]/12 rounded-2xl p-5 hover:border-[#16A34A]/35 transition-colors"
            >
              <div className="bg-[#C9A84C]/10 rounded-full p-3 group-hover:bg-[#16A34A]/10 transition-colors">
                <MapPin className="h-5 w-5 text-[#C9A84C] group-hover:text-[#16A34A] transition-colors" />
              </div>
              <div>
                <div className="font-bold text-sm text-[#1C1C1C]">{airport.name}</div>
                <div className="text-xs text-[#6B7280]">{airport.code} · {airport.tagline}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── PRICING TABLE ────────────────────────────────────────── */}
      <section className="section-container max-w-5xl py-20">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Airport Transfer Prices in Saudi Arabia</h2>
          <p className="text-[#6B7280]">Starting fares for sedan transfers — SUV and luxury classes also available. Final price is confirmed before your trip.</p>
        </div>

        <div className="bg-white rounded-3xl border border-[#16A34A]/12 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F0FDF4] border-b border-[#C9A84C]/10 text-[0.65rem] uppercase tracking-widest text-[#6B7280]">
                  <th className="p-6 font-bold">Departure Airport</th>
                  <th className="p-6 font-bold">Destination</th>
                  <th className="p-6 font-bold">Est. Time</th>
                  <th className="p-6 font-bold text-right">Starting Price (SAR)</th>
                  <th className="p-6 font-bold text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#C9A84C]/5">
                {AIRPORT_ROUTES.map((route, i) => (
                  <tr key={i} className="hover:bg-[#F0FDF4]/60 transition-colors">
                    <td className="p-6 font-bold text-sm text-[#1C1C1C]">{route.airport}</td>
                    <td className="p-6 text-sm text-[#6B7280]">{route.dest}</td>
                    <td className="p-6 text-sm text-[#6B7280]">{route.time}</td>
                    <td className="p-6 font-bold text-[#16A34A] text-right">{route.price}</td>
                    <td className="p-6 text-center flex items-center justify-center gap-4">
                      <Link href={`/routes/${route.routeSlug}`} className="text-xs font-bold uppercase tracking-wider text-[#6B7280] hover:text-[#16A34A] transition-colors">
                        Details
                      </Link>
                      <Link href={`/book?pickup=${encodeURIComponent(route.airport)}&dropoff=${encodeURIComponent(route.dest)}`} className="text-xs font-bold uppercase tracking-wider text-[#B8963B] hover:text-[#1C1C1C] transition-colors">
                        Book
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ─── FAQ ──────────────────────────────────────────────────── */}
      <section className="section-container max-w-4xl py-20 border-t border-[#C9A84C]/10">
        <h2 className="font-heading text-3xl font-bold mb-12 text-center">Airport Taxi FAQ — Saudi Arabia</h2>
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

      {/* ─── CTA ──────────────────────────────────────────────────── */}
      <section className="section-container max-w-5xl pb-20">
        <div className="bg-white border border-[#16A34A]/15 shadow-lg rounded-3xl p-12 text-center">
          <h2 className="font-heading text-3xl font-bold mb-4 text-[#1C1C1C]">Ready for a stress-free arrival?</h2>
          <p className="text-[#6B7280] mb-8 max-w-lg mx-auto">
            Book your premium airport transfer today and let us handle the logistics while you relax.
          </p>
          <Link
            href="/book"
            className="inline-flex items-center gap-2 rounded-full bg-[#16A34A] px-8 py-4 text-xs font-bold uppercase text-white hover:bg-[#15803D] transition-all shadow-[0_4px_20px_rgba(22,163,74,0.3)]"
          >
            Book Airport Taxi Now
          </Link>
        </div>
      </section>
      <ServiceRelatedLinks currentPath="/services/airport-transfers" />
    </div>
  );
}
