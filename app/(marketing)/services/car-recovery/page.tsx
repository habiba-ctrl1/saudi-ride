import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { ServiceRelatedLinks } from "@/components/seo/ServiceRelatedLinks";
import { serviceSchema, faqSchema, itemListSchema, speakableSchema, recoveryBusinessSchema } from "@/lib/schema";
import { TLDRSummary } from "@/components/seo/TLDRSummary";
import { RecoveryLeadForm } from "@/components/recovery/RecoveryLeadForm";
import { StickyRecoveryCTA } from "@/components/recovery/StickyRecoveryCTA";
import { recoveryContact } from "@/lib/config/contact";
import {
  RECOVERY_CITIES,
  RECOVERY_SERVICES,
  RECOVERY_PRICE_FACTORS,
  RECOVERY_GLOBAL_FAQS,
} from "@/lib/data/recovery";
import { RECOVERY_ROUTES } from "@/lib/data/recovery-routes";
import {
  Truck,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  MessageCircle,
  Phone,
  Wrench,
  BadgeDollarSign,
  Route as RouteIcon,
} from "lucide-react";

const BASE = "https://taxisaudiarabia.com";
const TITLE = "Car Recovery Saudi Arabia | Dammam Satha & Eastern Province Tow Truck (سطحة)";
const DESCRIPTION =
  "Dammam-based flatbed satha (سطحة) — 24/7 car recovery across the Eastern Province (Dammam, Khobar, Dhahran, Qatif, Al-Ahsa) plus booked intercity car transport to Riyadh, Jeddah & Yanbu. Price on WhatsApp.";
const OG_IMAGE = `${BASE}/services/car-recovery-hero.webp`;
const BUSINESS_WA = recoveryContact.whatsappNumber;
const HERO_WA = `Salam, I need car recovery / car transport. My location: `;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: `${BASE}/services/car-recovery`,
    languages: {
      en: `${BASE}/services/car-recovery`,
      ar: `${BASE}/ar/services/car-recovery`,
      "x-default": `${BASE}/services/car-recovery`,
    },
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    url: `${BASE}/services/car-recovery`,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Dammam-based flatbed satha car recovery" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [OG_IMAGE] },
};

const EASTERN = RECOVERY_CITIES.filter((c) => c.region === "eastern");
const TRANSPORT_CITIES = RECOVERY_CITIES.filter((c) => c.transport);

const STEPS = [
  { icon: MessageCircle, title: "Send Your Location", desc: "WhatsApp us your live location, car model, and what happened — breakdown, accident, flat battery, or a car to transport." },
  { icon: BadgeDollarSign, title: "Get a Clear Price", desc: "We reply with a clear price and timing. No meter, no surprises, no arrival fees." },
  { icon: Truck, title: "Flatbed Dispatched", desc: "The Dammam-based satha is dispatched (Eastern Province) or the transport job is booked." },
  { icon: Wrench, title: "Safe Delivery", desc: "Your car is winched fully onto the bed and delivered to the workshop, dealership, or address — photos on request." },
];

export default function CarRecoveryPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#1C1C1C] pb-28">
      <JsonLd
        data={[
          serviceSchema({
            name: "Car Recovery & Towing Service (Satha سطحة)",
            description:
              "Dammam-based flatbed car recovery and roadside assistance across the Eastern Province, plus booked intercity car transport across Saudi Arabia.",
            path: "/services/car-recovery",
            serviceType: "Vehicle Towing & Recovery",
            areaServed: [...EASTERN.map((c) => c.name), "Eastern Province"],
          }),
          recoveryBusinessSchema({
            name: "Car Recovery — Dammam Satha (سطحة الدمام)",
            description: DESCRIPTION,
            path: "/services/car-recovery",
            areaServed: [...EASTERN.map((c) => c.name), "Eastern Province"],
            telephone: "+966539388072",
          }),
          faqSchema(RECOVERY_GLOBAL_FAQS),
          itemListSchema([
            ...EASTERN.map((c) => ({ name: `Car Recovery ${c.name} (${c.sathaAr})`, href: `/services/car-recovery/${c.slug}` })),
            ...RECOVERY_ROUTES.map((r) => ({ name: `${r.from} to ${r.to} Car Transport`, href: `/services/car-recovery/${r.slug}` })),
          ]),
          speakableSchema({ path: "/services/car-recovery" }),
        ]}
      />
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Services", href: "/services" },
          { name: "Car Recovery", href: "/services/car-recovery" },
        ]}
      />

      {/* HERO */}
      <section className="relative pt-32 pb-20 overflow-hidden border-b border-[#C9A84C]/10">
        <div className="absolute inset-0 z-0">
          <Image src="/services/car-recovery-hero.webp" alt="Dammam flatbed tow truck (satha) recovering a car" fill priority className="object-cover opacity-65" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAF7] via-[#FAFAF7]/50 to-[#FAFAF7]/15" />
        </div>
        <div className="section-container relative z-10 max-w-5xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 backdrop-blur-md px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#16A34A] mb-6">
            <Clock className="h-3 w-3" /> 24/7 · Dammam-based · Eastern Province
          </span>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
            Car Recovery &amp; Tow Truck <br />
            <span className="text-[#16A34A]">Satha — سطحة</span>
          </h1>
          <p className="max-w-2xl mx-auto text-sm md:text-base text-[#6B7280] leading-relaxed mb-4">
            A Dammam-based hydraulic flatbed (satha) for breakdowns, accidents, and roadside help across the{" "}
            <strong>Eastern Province</strong> — <Link href="/services/car-recovery/dammam" className="text-[#16A34A] hover:underline">Dammam</Link>,{" "}
            <Link href="/services/car-recovery/al-khobar" className="text-[#16A34A] hover:underline">Khobar</Link>,{" "}
            <Link href="/services/car-recovery/dhahran" className="text-[#16A34A] hover:underline">Dhahran</Link>,{" "}
            <Link href="/services/car-recovery/qatif" className="text-[#16A34A] hover:underline">Qatif</Link> &amp;{" "}
            <Link href="/services/car-recovery/al-ahsa" className="text-[#16A34A] hover:underline">Al-Ahsa</Link> — plus booked
            intercity car transport to Riyadh, Jeddah &amp; Yanbu. Price confirmed on WhatsApp.
          </p>
          <p className="text-xs text-[#6B7280] mb-8" dir="rtl" lang="ar">
            سطحة الدمام · سطحة الخبر · سطحة الظهران · سطحة القطيف · سطحة الأحساء — سحب ونقل السيارات ٢٤ ساعة
          </p>
          <div className="max-w-2xl mx-auto mb-10 text-left">
            <TLDRSummary
              answer="Car recovery (satha) from a Dammam-based operator — 24/7 across the Eastern Province, with booked intercity car transport to Riyadh, Jeddah, and Yanbu. WhatsApp your location for a clear price before the flatbed moves."
              facts={[
                { label: "Base", value: "Dammam" },
                { label: "Coverage", value: "Eastern Province + intercity" },
                { label: "Pricing", value: "On WhatsApp" },
              ]}
            />
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href={`https://wa.me/${BUSINESS_WA}?text=${encodeURIComponent(HERO_WA)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#16A34A] px-8 py-3.5 text-xs font-bold uppercase text-white hover:bg-[#15803D] transition-all"
            >
              <MessageCircle className="h-4 w-4 fill-current" /> WhatsApp for a Quote
            </a>
            <a href={recoveryContact.phoneLink} className="inline-flex items-center justify-center gap-2 rounded-full border border-[#C9A84C] px-8 py-3.5 text-xs font-bold uppercase text-[#16A34A] hover:bg-[#C9A84C]/10 transition-all">
              <Phone className="h-4 w-4" /> Call Directly
            </a>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="section-container max-w-5xl py-10 border-b border-[#C9A84C]/10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: MapPin, label: "Dammam-based operator" },
            { icon: BadgeDollarSign, label: "Clear price before dispatch" },
            { icon: ShieldCheck, label: "Full flatbed — zero drag damage" },
            { icon: Clock, label: "24/7 Eastern Province" },
          ].map((t, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <t.icon className="h-6 w-6 text-[#C9A84C]" />
              <p className="text-xs font-bold text-[#1C1C1C]">{t.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section className="section-container max-w-7xl py-20 border-b border-[#C9A84C]/10">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl font-bold mb-4">Recovery &amp; Towing Services</h2>
          <p className="text-[#6B7280] max-w-2xl mx-auto text-sm">From a dead battery in a parking lot to a full intercity car transport — one WhatsApp message covers it all.</p>
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
      </section>

      {/* HOW IT WORKS */}
      <section className="section-container max-w-7xl py-20 border-b border-[#C9A84C]/10">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl font-bold mb-4">How Car Recovery Works</h2>
          <p className="text-[#6B7280] text-sm">Four steps — usually under five minutes from message to a clear price.</p>
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

      {/* PRICING — factors, no fixed numbers */}
      <section id="pricing" className="section-container max-w-4xl py-20 border-b border-[#C9A84C]/10 scroll-mt-24">
        <div className="text-center mb-10">
          <h2 className="font-heading text-3xl font-bold mb-4">How Pricing Works</h2>
          <p className="text-[#6B7280] text-sm max-w-2xl mx-auto">
            There are no fixed public prices — recovery cost depends on the job. You always get a clear, fixed quote on
            WhatsApp before the truck moves: the price you agree is the price you pay.
          </p>
        </div>
        <div className="bg-white border border-[#16A34A]/15 rounded-3xl p-8">
          <ul className="grid sm:grid-cols-2 gap-3">
            {RECOVERY_PRICE_FACTORS.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm text-[#6B7280]">
                <CheckCircle2 className="h-4 w-4 text-[#16A34A] shrink-0 mt-0.5" /> {f}
              </li>
            ))}
          </ul>
          <div className="mt-6 text-center">
            <a
              href={`https://wa.me/${BUSINESS_WA}?text=${encodeURIComponent(HERO_WA)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#16A34A] px-7 py-3 text-xs font-bold uppercase text-white hover:bg-[#15803D] transition-all"
            >
              <MessageCircle className="h-4 w-4" /> Get Your Price on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* EASTERN PROVINCE CLUSTER */}
      <section className="section-container max-w-7xl py-20 border-b border-[#C9A84C]/10">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl font-bold mb-4">Eastern Province Coverage</h2>
          <p className="text-[#6B7280] text-sm">Our real, local satha turf — dispatched from Dammam across the Eastern Province.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {EASTERN.map((c) => (
            <Link key={c.slug} href={`/services/car-recovery/${c.slug}`} className="group rounded-3xl overflow-hidden border border-[#16A34A]/12 bg-white hover:border-[#16A34A]/35 transition-all duration-300">
              <div className="relative h-44">
                <Image src={c.image} alt={`Car recovery in ${c.name} (${c.sathaAr})`} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/20" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-lg font-bold text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]">Car Recovery {c.name}</p>
                  <p className="text-xs text-white/90 drop-shadow-[0_1px_4px_rgba(0,0,0,0.95)]" dir="rtl" lang="ar">{c.sathaAr}</p>
                </div>
              </div>
              <div className="p-6 flex items-center justify-between">
                <p className="text-xs text-[#6B7280]">{c.tagline}</p>
                <span className="text-xs font-bold uppercase text-[#16A34A] shrink-0 ml-3">Details →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* INTERCITY TRANSPORT CLUSTER */}
      <section className="section-container max-w-7xl py-20 border-b border-[#C9A84C]/10">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl font-bold mb-4">Intercity Car Transport from Dammam</h2>
          <p className="text-[#6B7280] text-sm max-w-2xl mx-auto">Booked flatbed transport across the Kingdom — not local emergency dispatch. Send the car and destination for a quote.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {RECOVERY_ROUTES.map((r) => (
            <Link key={r.slug} href={`/services/car-recovery/${r.slug}`} className="group rounded-3xl border border-[#C9A84C]/20 bg-white p-7 hover:border-[#C9A84C]/50 transition-all">
              <RouteIcon className="h-7 w-7 text-[#C9A84C] mb-4" />
              <h3 className="font-heading text-lg font-bold mb-1">{r.from} → {r.to}</h3>
              <p className="text-xs text-[#6B7280] mb-3" dir="rtl" lang="ar">{r.taglineAr}</p>
              <p className="text-xs text-[#6B7280]">~{r.distanceKm} km · {r.approxDrive} · flatbed transport</p>
              <span className="mt-4 inline-block text-xs font-bold uppercase text-[#16A34A]">Get a quote →</span>
            </Link>
          ))}
        </div>
        {TRANSPORT_CITIES.length > 0 && (
          <p className="mt-8 text-center text-xs text-[#6B7280]">
            We are Dammam-based — for {TRANSPORT_CITIES.map((c) => c.name).join(", ")} we handle booked car transport, not local emergency dispatch.
          </p>
        )}
      </section>

      {/* LEAD FORM */}
      <section id="request" className="section-container max-w-3xl py-20 border-b border-[#C9A84C]/10 scroll-mt-24">
        <div className="text-center mb-10">
          <h2 className="font-heading text-3xl font-bold mb-4">Request Recovery or Transport</h2>
          <p className="text-[#6B7280] text-sm">WhatsApp us the details for a clear price — or call the Dammam driver directly.</p>
        </div>
        <RecoveryLeadForm sourceLabel="CAR RECOVERY — HUB — EN" />
      </section>

      {/* FAQ */}
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
      <StickyRecoveryCTA waText={HERO_WA} lang="en" />
    </div>
  );
}
