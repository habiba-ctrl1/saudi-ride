import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { ServiceRelatedLinks } from "@/components/seo/ServiceRelatedLinks";
import { serviceSchema, faqSchema, recoveryBusinessSchema } from "@/lib/schema";
import { RecoveryLeadForm } from "@/components/recovery/RecoveryLeadForm";
import { StickyRecoveryCTA } from "@/components/recovery/StickyRecoveryCTA";
import { recoveryContact } from "@/lib/config/contact";
import {
  RECOVERY_CITIES,
  RECOVERY_SERVICES,
  RECOVERY_GLOBAL_FAQS,
  getRecoveryCity,
} from "@/lib/data/recovery";
import { RECOVERY_ROUTES, getRecoveryRoute } from "@/lib/data/recovery-routes";
import { Truck, MapPin, Clock, Route as RouteIcon, CheckCircle2, MessageCircle, Phone, PackageCheck, ArrowRight } from "lucide-react";

export const revalidate = 86400;

const REAL_TRUCK = "/services/car-recovery-hero.webp";
const BUSINESS_WA = recoveryContact.whatsappNumber;

// Supporting recovery/towing guides (real, published blog posts). These build
// the recovery topical cluster and answer the "how much / is it safe / what do
// I do" intent that these service pages themselves deliberately don't quote
// prices for — the cost guide already ranks on GSC page 1 but nothing in the
// recovery cluster linked to it.
const RECOVERY_GUIDES: { slug: string; label: string }[] = [
  { slug: "car-towing-cost-saudi-arabia-2026", label: "How much does car towing (satha) cost in Saudi Arabia?" },
  { slug: "car-breakdown-saudi-highway-guide", label: "Car breakdown on a Saudi highway? 7 steps to stay safe" },
  { slug: "flatbed-vs-hook-towing-automatic-cars", label: "Flatbed vs hook towing: what's safe for your car" },
];

function RecoveryGuides() {
  return (
    <div className="mx-auto mt-12 max-w-3xl rounded-3xl border border-[#16A34A]/12 bg-white p-7">
      <h3 className="font-heading text-lg font-bold mb-4 text-center">Helpful Car Recovery Guides</h3>
      <ul className="grid gap-2.5 sm:grid-cols-1">
        {RECOVERY_GUIDES.map((g) => (
          <li key={g.slug}>
            <Link href={`/blog/${g.slug}`} className="group inline-flex items-start gap-2 text-sm text-[#6B7280] hover:text-[#16A34A] transition-colors">
              <ArrowRight className="h-3.5 w-3.5 mt-0.5 shrink-0 text-[#C9A84C]/60 group-hover:text-[#16A34A] transition-colors" />
              {g.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function generateStaticParams() {
  return [
    ...RECOVERY_CITIES.map((c) => ({ slug: c.slug })),
    ...RECOVERY_ROUTES.map((r) => ({ slug: r.slug })),
  ];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const base = "https://taxisaudiarabia.com";

  const route = getRecoveryRoute(slug);
  if (route) {
    const url = `${base}/services/car-recovery/${route.slug}`;
    const title = `${route.tagline} | ${route.taglineAr}`;
    const description = `Car transport ${route.from} to ${route.to} (~${route.distanceKm} km) on a flatbed (satha). Booked intercity vehicle transport — price confirmed on WhatsApp. نقل سيارة من ${route.fromAr} إلى ${route.toAr}.`;
    return {
      title,
      description,
      alternates: {
        canonical: url,
        languages: {
          en: url,
          ar: `${base}/ar/services/car-recovery/${route.slug}`,
          "x-default": url,
        },
      },
      openGraph: { title, description, url, siteName: "Taxi Saudi Arabia", type: "website" },
    };
  }

  const city = getRecoveryCity(slug);
  if (!city) return {};
  const url = `${base}/services/car-recovery/${city.slug}`;
  const title = city.transport
    ? `Dammam ⇄ ${city.name} Car Transport | Satha ${city.sathaAr}`
    : `Car Recovery ${city.name} | 24/7 Tow Truck & Satha ${city.sathaAr}`;
  const description = city.transport
    ? `Booked car transport between Dammam and ${city.name} on a flatbed (satha). Dammam-based operator — price confirmed on WhatsApp before dispatch.`
    : city.noindex
      ? `Intercity car transport between the Eastern Province and ${city.name}. Dammam-based — no local truck in ${city.name}; price on WhatsApp.`
      : `24/7 car recovery & flatbed tow truck (${city.sathaAr}) in ${city.name}. Dammam-based, Eastern Province coverage — price confirmed on WhatsApp before dispatch.`;

  const hasAr = !!city.introAr;
  return {
    title,
    description,
    robots: city.noindex ? { index: false, follow: true } : undefined,
    alternates: {
      canonical: url,
      ...(hasAr
        ? {
            languages: {
              en: url,
              ar: `${base}/ar/services/car-recovery/${city.slug}`,
              "x-default": url,
            },
          }
        : {}),
    },
    openGraph: { title, description, url, siteName: "Taxi Saudi Arabia", type: "website" },
  };
}

export default async function RecoveryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const route = getRecoveryRoute(slug);
  if (route) return <RouteView route={route} />;
  const city = getRecoveryCity(slug);
  if (!city) notFound();
  return <CityView city={city} />;
}

/* ══════════════════════════ CITY VIEW ══════════════════════════ */
function CityView({ city }: { city: NonNullable<ReturnType<typeof getRecoveryCity>> }) {
  const isEastern = city.region === "eastern";
  const sourceLabel = `CAR RECOVERY — ${city.name.toUpperCase()} — EN`;
  const faqs = [...city.faqs, ...RECOVERY_GLOBAL_FAQS.slice(0, 3)];
  const otherEastern = RECOVERY_CITIES.filter((c) => c.region === "eastern" && c.slug !== city.slug);
  const waText = `Salam, I need car recovery (satha) in ${city.name}. My location: `;

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#1C1C1C] pb-28">
      <JsonLd
        data={[
          serviceSchema({
            name: city.transport
              ? `Dammam ⇄ ${city.name} Car Transport`
              : `Car Recovery & Tow Truck ${city.name} (${city.sathaAr})`,
            description: city.intro,
            path: `/services/car-recovery/${city.slug}`,
            serviceType: city.transport ? "Vehicle Transport" : "Vehicle Towing & Recovery",
            areaServed: city.transport ? ["Dammam", city.name] : [city.name, "Eastern Province"],
          }),
          ...(isEastern
            ? [
                recoveryBusinessSchema({
                  name: `Car Recovery ${city.name} — Satha (${city.sathaAr})`,
                  description: city.intro,
                  path: `/services/car-recovery/${city.slug}`,
                  areaServed: [city.name, "Eastern Province"],
                  telephone: "+966539388072",
                }),
              ]
            : []),
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

      {/* HERO */}
      <section className="relative pt-32 pb-20 overflow-hidden border-b border-[#C9A84C]/10">
        <div className="absolute inset-0 z-0">
          <Image src={city.image} alt={`Car recovery in ${city.name}`} fill priority className="object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAF7] via-[#FAFAF7]/55 to-[#FAFAF7]/20" />
        </div>
        <div className="section-container relative z-10 max-w-5xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 backdrop-blur-md px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#16A34A] mb-6">
            <Clock className="h-3 w-3" /> {isEastern ? "24/7 · Dammam-based" : "Booked intercity transport"}
          </span>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
            {city.transport ? (
              <>Dammam ⇄ {city.name} Car Transport</>
            ) : (
              <>Car Recovery {city.name}</>
            )}
            <br />
            <span className="text-[#16A34A]" dir="rtl" lang="ar">{city.sathaAr}</span>
          </h1>
          <p className="max-w-2xl mx-auto text-sm md:text-base text-[#6B7280] leading-relaxed mb-10">{city.intro}</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href={`https://wa.me/${BUSINESS_WA}?text=${encodeURIComponent(waText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#16A34A] px-8 py-3.5 text-xs font-bold uppercase text-white hover:bg-[#15803D] transition-all"
            >
              <MessageCircle className="h-4 w-4 fill-current" /> WhatsApp for a Quote
            </a>
            <a
              href={recoveryContact.phoneLink}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#C9A84C] px-8 py-3.5 text-xs font-bold uppercase text-[#16A34A] hover:bg-[#C9A84C]/10 transition-all"
            >
              <Phone className="h-4 w-4" /> Call Directly
            </a>
          </div>
        </div>
      </section>

      {/* REAL TRUCK (eastern only) */}
      {isEastern && (
        <section className="section-container max-w-5xl py-16 border-b border-[#C9A84C]/10">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="relative h-64 md:h-72 rounded-3xl overflow-hidden border border-[#C9A84C]/15">
              <Image src={REAL_TRUCK} alt={`Our flatbed satha serving ${city.name}`} fill className="object-cover" />
            </div>
            <div>
              <h2 className="font-heading text-2xl font-bold mb-3">Our Real Flatbed — Not a Stock Photo</h2>
              <p className="text-sm text-[#6B7280] leading-relaxed mb-4">
                This is the actual hydraulic flatbed (satha) that serves {city.name} and the Eastern Province — a
                Dammam-based operator you deal with directly. More real photos (loading, secured, on the road) are
                added as jobs are documented.
              </p>
              <div className="flex flex-wrap gap-3 text-xs text-[#6B7280]">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-[#16A34A]/15 px-3 py-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-[#16A34A]" /> Dammam-based operator</span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-[#16A34A]/15 px-3 py-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-[#16A34A]" /> Direct WhatsApp & phone</span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-[#16A34A]/15 px-3 py-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-[#16A34A]" /> Quote before dispatch</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* COVERAGE + SERVICES */}
      <section className="section-container max-w-7xl py-20 border-b border-[#C9A84C]/10">
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <div>
            <h2 className="font-heading text-3xl font-bold mb-6">
              {city.transport ? `Transport to & from ${city.name}` : `Tow Truck Service in ${city.name}`}
            </h2>
            <div className="bg-white border border-[#16A34A]/15 rounded-3xl p-7">
              <h3 className="font-heading text-lg font-bold mb-4 flex items-center gap-2.5">
                <RouteIcon className="h-5 w-5 text-[#C9A84C]" /> {city.transport ? "Route & Corridors" : "Highways We Cover"}
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
                <MapPin className="h-5 w-5 text-[#C9A84C]" /> {city.transport ? "What This Covers" : `Districts & Areas in ${city.name}`}
              </h3>
              <div className="flex flex-wrap gap-2">
                {city.areas.map((a) => (
                  <span key={a} className="rounded-full bg-[#FAFAF7] border border-[#1C1C1C]/8 px-4 py-1.5 text-xs text-[#6B7280]">{a}</span>
                ))}
              </div>
            </div>
            <div className="bg-white border border-[#16A34A]/15 rounded-3xl p-7">
              <h3 className="font-heading text-lg font-bold mb-4 flex items-center gap-2.5">
                <Truck className="h-5 w-5 text-[#C9A84C]" /> Services Available
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
        {city.transport && (
          <p className="mt-8 text-center text-sm text-[#6B7280]">
            Looking for a dedicated route page?{" "}
            <Link href={`/services/car-recovery/dammam-to-${city.slug}`} className="text-[#16A34A] font-bold hover:underline">
              Dammam to {city.name} car transport →
            </Link>
          </p>
        )}
      </section>

      {/* LEAD FORM */}
      <section id="request" className="section-container max-w-3xl py-20 border-b border-[#C9A84C]/10 scroll-mt-24">
        <div className="text-center mb-10">
          <h2 className="font-heading text-3xl font-bold mb-4">
            {city.transport ? `Get a Transport Quote — ${city.name}` : `Request a Tow Truck in ${city.name}`}
          </h2>
          <p className="text-[#6B7280] text-sm">
            WhatsApp us the details for a clear price — or call the Dammam driver directly.
          </p>
        </div>
        <RecoveryLeadForm city={city.name} sourceLabel={sourceLabel} />
      </section>

      {/* FAQ */}
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

      {/* CROSS-LINKS */}
      <section className="section-container max-w-5xl py-16">
        <h2 className="font-heading text-2xl font-bold mb-8 text-center">Eastern Province Recovery & Transport Routes</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {otherEastern.map((c) => (
            <Link key={c.slug} href={`/services/car-recovery/${c.slug}`} className="rounded-full bg-white border border-[#16A34A]/15 px-5 py-2.5 text-sm text-[#6B7280] hover:text-[#16A34A] hover:border-[#16A34A]/35 transition-all">
              Car Recovery {c.name}
            </Link>
          ))}
          {RECOVERY_ROUTES.map((r) => (
            <Link key={r.slug} href={`/services/car-recovery/${r.slug}`} className="rounded-full bg-white border border-[#C9A84C]/25 px-5 py-2.5 text-sm text-[#6B7280] hover:text-[#16A34A] hover:border-[#C9A84C]/50 transition-all">
              {r.from} → {r.to}
            </Link>
          ))}
          <Link href="/services/car-recovery" className="rounded-full bg-[#16A34A] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#15803D] transition-all">
            All Recovery →
          </Link>
        </div>
        {!city.transport && (
          <p className="text-center text-sm text-[#6B7280] mt-8">
            Also need a ride in {city.name}? See our{" "}
            <Link href={`/locations/${city.slug === "al-khobar" ? "alkhobar" : city.slug}`} className="text-[#16A34A] hover:underline">{city.name} taxi service</Link>.
          </p>
        )}
        <RecoveryGuides />
      </section>

      <ServiceRelatedLinks currentPath={`/services/car-recovery/${city.slug}`} />
      <StickyRecoveryCTA waText={waText} lang="en" />
    </div>
  );
}

/* ══════════════════════════ ROUTE VIEW ══════════════════════════ */
function RouteView({ route }: { route: (typeof RECOVERY_ROUTES)[number] }) {
  const sourceLabel = `CAR TRANSPORT — DAMMAM TO ${route.to.toUpperCase()} — EN`;
  const faqs = route.faqs;
  const waText = `Salam, I need to transport a car from ${route.from} to ${route.to}.\nCar make/model: \nPickup: \nPlease share price & availability.`;
  const STEPS = [
    { icon: MessageCircle, title: "Send the Details", desc: `Car make/model, pickup point in the ${route.from} area, and the ${route.to} destination — on WhatsApp.` },
    { icon: Clock, title: "Get a Quote & Slot", desc: "We confirm a clear price and the pickup/delivery window before the job is booked." },
    { icon: Truck, title: "Flatbed Loaded", desc: "Your car is winched fully onto the flatbed and secured for the journey." },
    { icon: PackageCheck, title: "Delivered", desc: `Handed over at the ${route.to} address, workshop, or showroom — with photos on request.` },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#1C1C1C] pb-28">
      <JsonLd
        data={[
          serviceSchema({
            name: route.tagline,
            description: route.intro,
            path: `/services/car-recovery/${route.slug}`,
            serviceType: "Vehicle Transport",
            areaServed: [route.from, route.to],
          }),
          faqSchema(faqs),
        ]}
      />
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Services", href: "/services" },
          { name: "Car Recovery", href: "/services/car-recovery" },
          { name: `${route.from} → ${route.to}`, href: `/services/car-recovery/${route.slug}` },
        ]}
      />

      {/* HERO */}
      <section className="relative pt-32 pb-20 overflow-hidden border-b border-[#C9A84C]/10">
        <div className="absolute inset-0 z-0">
          <Image src={route.image} alt={`Car transport from ${route.from} to ${route.to}`} fill priority className="object-cover opacity-55" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAF7] via-[#FAFAF7]/55 to-[#FAFAF7]/20" />
        </div>
        <div className="section-container relative z-10 max-w-5xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 backdrop-blur-md px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#16A34A] mb-6">
            <RouteIcon className="h-3 w-3" /> ~{route.distanceKm} km · {route.approxDrive}
          </span>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
            {route.from} to {route.to} Car Transport
            <br />
            <span className="text-[#16A34A]" dir="rtl" lang="ar">{route.taglineAr}</span>
          </h1>
          <p className="max-w-2xl mx-auto text-sm md:text-base text-[#6B7280] leading-relaxed mb-10">{route.intro}</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href={`https://wa.me/${BUSINESS_WA}?text=${encodeURIComponent(waText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#16A34A] px-8 py-3.5 text-xs font-bold uppercase text-white hover:bg-[#15803D] transition-all"
            >
              <MessageCircle className="h-4 w-4 fill-current" /> Get Quote on WhatsApp
            </a>
            <a href={recoveryContact.phoneLink} className="inline-flex items-center justify-center gap-2 rounded-full border border-[#C9A84C] px-8 py-3.5 text-xs font-bold uppercase text-[#16A34A] hover:bg-[#C9A84C]/10 transition-all">
              <Phone className="h-4 w-4" /> Call Directly
            </a>
          </div>
        </div>
      </section>

      {/* WHAT'S COVERED */}
      <section className="section-container max-w-4xl py-20 border-b border-[#C9A84C]/10">
        <h2 className="font-heading text-3xl font-bold mb-8 text-center">What This Route Covers</h2>
        <div className="bg-white border border-[#16A34A]/15 rounded-3xl p-8">
          <ul className="space-y-3">
            {route.highlights.map((h) => (
              <li key={h} className="flex items-start gap-3 text-sm text-[#6B7280]">
                <CheckCircle2 className="h-5 w-5 text-[#16A34A] shrink-0 mt-0.5" /> {h}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section-container max-w-7xl py-20 border-b border-[#C9A84C]/10">
        <h2 className="font-heading text-3xl font-bold mb-12 text-center">How the Transport Works</h2>
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

      {/* LEAD FORM */}
      <section id="request" className="section-container max-w-3xl py-20 border-b border-[#C9A84C]/10 scroll-mt-24">
        <div className="text-center mb-10">
          <h2 className="font-heading text-3xl font-bold mb-4">Get a {route.from} → {route.to} Quote</h2>
          <p className="text-[#6B7280] text-sm">Send the car and both addresses — we confirm the price on WhatsApp.</p>
        </div>
        <RecoveryLeadForm city={`${route.from} → ${route.to}`} sourceLabel={sourceLabel} />
      </section>

      {/* FAQ */}
      <section className="section-container max-w-4xl py-20 border-b border-[#C9A84C]/10">
        <h2 className="font-heading text-3xl font-bold mb-12 text-center">{route.from} to {route.to} Transport — FAQ</h2>
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

      {/* CROSS-LINKS */}
      <section className="section-container max-w-5xl py-16 text-center">
        <p className="text-sm text-[#6B7280] mb-4">Need a local satha instead? Start with our{" "}
          <Link href="/services/car-recovery/dammam" className="text-[#16A34A] font-bold hover:underline">Dammam recovery service</Link>.</p>
        <div className="flex flex-wrap justify-center gap-3">
          {RECOVERY_ROUTES.filter((r) => r.slug !== route.slug).map((r) => (
            <Link key={r.slug} href={`/services/car-recovery/${r.slug}`} className="rounded-full bg-white border border-[#C9A84C]/25 px-5 py-2.5 text-sm text-[#6B7280] hover:text-[#16A34A] hover:border-[#C9A84C]/50 transition-all">
              {r.from} → {r.to}
            </Link>
          ))}
          <Link href="/services/car-recovery" className="rounded-full bg-[#16A34A] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#15803D] transition-all">All Recovery →</Link>
        </div>
        <RecoveryGuides />
      </section>

      <ServiceRelatedLinks currentPath={`/services/car-recovery/${route.slug}`} />
      <StickyRecoveryCTA waText={waText} lang="en" />
    </div>
  );
}
