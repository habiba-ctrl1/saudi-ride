import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { ServiceRelatedLinks } from "@/components/seo/ServiceRelatedLinks";
import { serviceSchema, faqSchema } from "@/lib/schema";
import { RecoveryLeadForm } from "@/components/recovery/RecoveryLeadForm";
import {
  RECOVERY_CITIES,
  RECOVERY_SERVICES,
  RECOVERY_GLOBAL_FAQS,
  getRecoveryCity,
} from "@/lib/data/recovery";
import { Truck, MapPin, Clock, Route as RouteIcon, CheckCircle2 } from "lucide-react";

export const revalidate = 86400;

export function generateStaticParams() {
  return RECOVERY_CITIES.map((c) => ({ city: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city: slug } = await params;
  const city = getRecoveryCity(slug);
  if (!city) return {};
  return {
    alternates: { canonical: `https://taxisaudiarabia.com/services/car-recovery/${city.slug}` },
    title: `Car Recovery ${city.name} | 24/7 Tow Truck & Satha ${city.sathaAr}`,
    description: `24/7 car recovery & flatbed tow truck (${city.sathaAr}) in ${city.name}. Fast dispatch from SAR ${city.startingPrice}, fixed price on WhatsApp. Breakdown, accident & battery service across ${city.name}.`,
    keywords: [
      `car recovery ${city.name}`, `tow truck ${city.name}`, `satha ${city.name}`,
      city.sathaAr, `car towing ${city.name}`, `roadside assistance ${city.name}`,
      `سطحه ${city.nameAr}`, "سطحة", "ونش",
    ],
  };
}

export default async function RecoveryCityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city: slug } = await params;
  const city = getRecoveryCity(slug);
  if (!city) notFound();

  const otherCities = RECOVERY_CITIES.filter((c) => c.slug !== city.slug);
  const faqs = [...city.faqs, ...RECOVERY_GLOBAL_FAQS.slice(0, 4)];

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#1C1C1C] pb-24">
      <JsonLd
        data={[
          serviceSchema({
            name: `Car Recovery & Tow Truck ${city.name} (${city.sathaAr})`,
            description: `24/7 flatbed car recovery, towing, and roadside assistance in ${city.name}, Saudi Arabia — breakdown, accident, battery, and intercity car transport.`,
            path: `/services/car-recovery/${city.slug}`,
            serviceType: "Vehicle Towing & Recovery",
            areaServed: [city.name],
          }),
          faqSchema(faqs),
        ]}
      />
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Services", href: "/services" },
          { name: "Car Recovery", href: "/services/car-recovery" },
          { name: city.name, href: `/services/car-recovery/${city.slug}` },
        ]}
      />

      {/* ─── HERO ─────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 overflow-hidden border-b border-[#C9A84C]/10">
        <div className="absolute inset-0 z-0">
          <Image
            src={city.image}
            alt={`Flatbed tow truck (satha) service in ${city.name}`}
            fill
            priority
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAF7] via-[#FAFAF7]/80 to-[#FAFAF7]/40" />
        </div>
        <div className="section-container relative z-10 max-w-5xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 backdrop-blur-md px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#B8963B] mb-6">
            <Clock className="h-3 w-3" /> 24/7 · From SAR {city.startingPrice}
          </span>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
            Car Recovery {city.name} <br />
            <span className="text-[#16A34A]" dir="rtl" lang="ar">{city.sathaAr}</span>
          </h1>
          <p className="max-w-2xl mx-auto text-sm md:text-base text-[#6B7280] leading-relaxed mb-10">
            {city.tagline}. Flatbed tow truck (satha), battery jump start, tire help,
            and accident recovery anywhere in {city.name} — fixed price on WhatsApp before dispatch.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="#request"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#16A34A] px-8 py-3.5 text-xs font-bold uppercase text-white hover:bg-[#15803D] transition-all"
            >
              Request Recovery in {city.name}
            </a>
            <Link
              href="/services/car-recovery#pricing"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#C9A84C] px-8 py-3.5 text-xs font-bold uppercase text-[#B8963B] hover:bg-[#C9A84C]/10 transition-all"
            >
              Towing Prices
            </Link>
          </div>
        </div>
      </section>

      {/* ─── INTRO + COVERAGE ─────────────────────────────────────── */}
      <section className="section-container max-w-7xl py-20 border-b border-[#C9A84C]/10">
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <div>
            <h2 className="font-heading text-3xl font-bold mb-6">Tow Truck Service in {city.name}</h2>
            <p className="text-sm md:text-base text-[#6B7280] leading-relaxed mb-8">{city.intro}</p>
            <div className="bg-white border border-[#16A34A]/15 rounded-3xl p-7">
              <h3 className="font-heading text-lg font-bold mb-4 flex items-center gap-2.5">
                <RouteIcon className="h-5 w-5 text-[#C9A84C]" /> Highways We Cover
              </h3>
              <ul className="space-y-2.5">
                {city.highways.map((h) => (
                  <li key={h} className="flex items-start gap-2 text-sm text-[#6B7280]">
                    <CheckCircle2 className="h-4 w-4 text-[#16A34A] shrink-0 mt-0.5" /> {h}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-white border border-[#16A34A]/15 rounded-3xl p-7">
              <h3 className="font-heading text-lg font-bold mb-4 flex items-center gap-2.5">
                <MapPin className="h-5 w-5 text-[#C9A84C]" /> Districts &amp; Areas in {city.name}
              </h3>
              <div className="flex flex-wrap gap-2">
                {city.areas.map((a) => (
                  <span key={a} className="rounded-full bg-[#FAFAF7] border border-[#1C1C1C]/8 px-4 py-1.5 text-xs text-[#6B7280]">
                    {a}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-white border border-[#16A34A]/15 rounded-3xl p-7">
              <h3 className="font-heading text-lg font-bold mb-4 flex items-center gap-2.5">
                <Truck className="h-5 w-5 text-[#C9A84C]" /> Services Available in {city.name}
              </h3>
              <ul className="space-y-2.5">
                {RECOVERY_SERVICES.map((s) => (
                  <li key={s.key} className="flex items-start gap-2 text-sm text-[#6B7280]">
                    <CheckCircle2 className="h-4 w-4 text-[#16A34A] shrink-0 mt-0.5" /> {s.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── LEAD FORM ────────────────────────────────────────────── */}
      <section id="request" className="section-container max-w-3xl py-20 border-b border-[#C9A84C]/10 scroll-mt-24">
        <div className="text-center mb-10">
          <h2 className="font-heading text-3xl font-bold mb-4">Request a Tow Truck in {city.name}</h2>
          <p className="text-[#6B7280] text-sm">
            Fill the form and we call you back within minutes — or WhatsApp your live location for the fastest dispatch.
          </p>
        </div>
        <RecoveryLeadForm city={city.name} />
      </section>

      {/* ─── FAQ ──────────────────────────────────────────────────── */}
      <section className="section-container max-w-4xl py-20 border-b border-[#C9A84C]/10">
        <h2 className="font-heading text-3xl font-bold mb-12 text-center">Car Recovery in {city.name} — FAQ</h2>
        <div className="space-y-6">
          {faqs.map((faq, i) => (
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

      {/* ─── OTHER CITIES ─────────────────────────────────────────── */}
      <section className="section-container max-w-5xl py-16">
        <h2 className="font-heading text-2xl font-bold mb-8 text-center">Car Recovery in Other Cities</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {otherCities.map((c) => (
            <Link
              key={c.slug}
              href={`/services/car-recovery/${c.slug}`}
              className="rounded-full bg-white border border-[#16A34A]/15 px-6 py-2.5 text-sm text-[#6B7280] hover:text-[#16A34A] hover:border-[#16A34A]/35 transition-all"
            >
              Car Recovery {c.name}
            </Link>
          ))}
          <Link
            href="/services/car-recovery"
            className="rounded-full bg-[#16A34A] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#15803D] transition-all"
          >
            All Saudi Arabia →
          </Link>
        </div>
        <p className="text-center text-sm text-[#6B7280] mt-8">
          Also need a ride in {city.name}? See our{" "}
          <Link href={`/locations/${city.slug}`} className="text-[#16A34A] hover:underline">
            {city.name} taxi service
          </Link>.
        </p>
      </section>

      <ServiceRelatedLinks currentPath={`/services/car-recovery/${city.slug}`} />
    </div>
  );
}
