export const revalidate = 86400; // revalidate every 24 hours

export function generateStaticParams() {
  return Object.keys(CITY_DETAILS).map((city) => ({ city }));
}

// No notFound import
import { db } from "@/lib/db";
import { Metadata } from "next";
import { MapPin, ArrowRight, Car, Building2, CheckCircle2, HelpCircle, Star, Quote, PlaneLanding, ExternalLink, MessageSquare } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { serviceSchema, faqSchema, speakableSchema } from "@/lib/schema";
import { TLDRSummary } from "@/components/seo/TLDRSummary";
import { SUB_AREAS } from "@/lib/data/subareas";
import { CITY_DETAILS } from "@/lib/data/locations";
import { trustStats } from "@/lib/config/stats";
import { contactConfig } from "@/lib/config/contact";

// Public city-centroid coordinates (not business location data) — lets
// location pages attach real GeoCoordinates to their Place/areaServed node.
const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  makkah: { lat: 21.3891, lng: 39.8579 },
  madinah: { lat: 24.5247, lng: 39.5692 },
  riyadh: { lat: 24.7136, lng: 46.6753 },
  jeddah: { lat: 21.4858, lng: 39.1925 },
  dammam: { lat: 26.4207, lng: 50.0888 },
  alula: { lat: 26.6084, lng: 37.9153 },
  taif: { lat: 21.2703, lng: 40.4158 },
  alkhobar: { lat: 26.2172, lng: 50.1971 },
  yanbu: { lat: 24.0895, lng: 38.0618 },
  neom: { lat: 27.9958, lng: 35.6367 },
  abha: { lat: 18.2164, lng: 42.5053 },
  tabuk: { lat: 28.3998, lng: 36.5715 },
};

// City -> matching airport page slug (only where a dedicated /airports/[slug] page exists).
const CITY_AIRPORT: Record<string, { slug: string; name: string }> = {
  jeddah: { slug: "king-abdulaziz-jeddah", name: "King Abdulaziz International Airport (JED)" },
  madinah: { slug: "prince-mohammad-madinah", name: "Prince Mohammad Bin Abdulaziz Airport (MED)" },
  riyadh: { slug: "king-khalid-riyadh", name: "King Khalid International Airport (RUH)" },
  dammam: { slug: "king-fahd-dammam", name: "King Fahd International Airport (DMM)" },
  taif: { slug: "taif-regional", name: "Taif Regional Airport (TIF)" },
  alula: { slug: "alula", name: "AlUla International Airport (ULH)" },
  abha: { slug: "abha-regional", name: "Abha International Airport (AHB)" },
  tabuk: { slug: "tabuk-regional", name: "Tabuk Regional Airport (TUU)" },
  neom: { slug: "red-sea", name: "Red Sea International Airport (RSI)" },
};

// Additional airport links per city (e.g. NEOM serves both RSI and TUU).
const CITY_AIRPORTS_EXTRA: Record<string, { slug: string; name: string }[]> = {
  neom: [{ slug: "tabuk-regional", name: "Tabuk Regional Airport (TUU)" }],
};

interface PageProps {
  params: Promise<{
    city: string;
  }>;
}

// One genuinely distinguishing sentence per city (a landmark, a real distance,
// a local route) instead of the old "Book a fixed-price taxi in {city}..."
// template that was byte-identical across all 11 pages except the city name.
const CITY_META_DESCRIPTION: Record<string, string> = {
  makkah: "Taxi in Makkah — Haram hotel drop-offs, Ziyarat tours, and transfers to Jeddah Airport (~80 km) or Madinah (~430 km). No surge, 24/7.",
  madinah: "Taxi in Madinah — Masjid an-Nabawi drop-offs, Ziyarat tours, and MED airport transfers (~20 km). Onward trips to Makkah available.",
  riyadh: "Taxi & chauffeur service in Riyadh — RUH airport transfers (~35 km), KAFD/Olaya business travel, and intercity rides to Dammam.",
  jeddah: "Taxi in Jeddah — JED airport pickups, Miqat stops for Ihram, and transfers to Makkah (~80 km) or Madinah (~420 km). 24/7.",
  dammam: "Taxi in Dammam — DMM airport transfers (~35 km), Khobar–Dhahran rides, and cross-border trips to Bahrain via the Causeway.",
  alula: "Taxi & full-day car hire in AlUla — Hegra (UNESCO), Elephant Rock, Maraya, and ULH airport transfers. Best visited October–March.",
  taif: "Taxi in Taif — day trips from Makkah (~90 km) via Al Hada, rose farm visits, and TIF airport transfers. Cool mountain escape.",
  alkhobar: "Taxi in Al Khobar — Corniche rides, DMM airport transfers (~30 km), and cross-border trips to Bahrain via the Causeway.",
  yanbu: "Taxi in Yanbu — Red Sea diving trips, and intercity rides to Madinah (~240 km) or Jeddah (~330 km). Industrial City covered.",
  neom: "Executive taxi across NEOM & Tabuk — Tabuk (TUU) and NEOM Bay (NUM) airport transfers, site access trips, and Gulf of Aqaba coast rides.",
  abha: "Taxi in Abha — Soudah Peak & cable car trips, AHB airport transfers (~25 km), and rides across the misty Asir mountains.",
  tabuk: "Taxi in Tabuk — TUU airport transfers, NEOM business trips (~120 km), and cross-border rides to Jordan via Haql (~130 km).",
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city } = await params;
  const cityKeyLower = city.toLowerCase();
  const cityData = CITY_DETAILS[cityKeyLower];

  if (!cityData) return { title: "Location Not Found" };

  return {
    title: `Taxi in ${cityData.name} | Airport & Intercity — Taxi Saudi Arabia`,
    description: CITY_META_DESCRIPTION[cityKeyLower] ?? `Book a private taxi in ${cityData.name}, Saudi Arabia — airport transfers, Umrah rides, and 24/7 intercity trips with professional drivers. No surge, quoted on WhatsApp.`,
    alternates: {
      canonical: `https://taxisaudiarabia.com/locations/${city}`,
    },
    openGraph: {
      title: `Taxi Service in ${cityData.name} | Taxi Saudi Arabia`,
      description: `Book a private taxi in ${cityData.name}, quoted on WhatsApp. Airport transfers, Umrah rides, and intercity taxi service. Available 24/7 with professional drivers.`,
      type: "website",
      url: `https://taxisaudiarabia.com/locations/${city}`,
      images: [
        {
          url: `https://taxisaudiarabia.com/locations/${city.toLowerCase()}-og.webp`,
          width: 1200,
          height: 630,
          alt: `Taxi service in ${cityData.name}, Saudi Arabia`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `Taxi Service in ${cityData.name} | Taxi Saudi Arabia`,
      description: `Taxi in ${cityData.name} — airport transfers, Umrah rides, and 24/7 intercity trips.`,
      images: [`https://taxisaudiarabia.com/locations/${city.toLowerCase()}-og.webp`],
    },
  };
}

export default async function CityLocationPage({ params }: PageProps) {
  const { city } = await params;
  const cityKey = city.toLowerCase();
  
  // Default fallback if city not strictly defined
  const cityData = CITY_DETAILS[cityKey] || {
    name: city.charAt(0).toUpperCase() + city.slice(1),
    nameAr: "",
    image: "/locations/riyadh-hero.webp",
    tagline: "Taxi & Car Service",
    description: `Reliable taxi and car service in ${city}, Saudi Arabia. Airport transfers, intercity rides, and local pickups with professional drivers.`,
    attractions: [],
    tips: []
  };

  const citySubAreas = Object.values(SUB_AREAS).filter((a) => a.city === cityKey);
  const cityAirport = CITY_AIRPORT[cityKey];

  // Fetch routes connected to this city (best-effort — a DB hiccup during
  // build must not fail the static export for every page in the site).
  let cityRoutes: Awaited<ReturnType<typeof db.route.findMany>> = [];
  try {
    cityRoutes = await db.route.findMany({
      where: {
        OR: [
          { fromCity: { contains: cityData.name, mode: 'insensitive' } },
          { toCity: { contains: cityData.name, mode: 'insensitive' } }
        ]
      },
      take: 10
    });
  } catch (error) {
    console.error(`❌ City routes fetch failed for ${cityKey}. Rendering without related routes.`, error);
  }

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#1C1C1C] pb-24">
      <JsonLd
        data={[
          serviceSchema({
            name: `Taxi Service in ${cityData.name}`,
            description: cityData.description,
            path: `/locations/${cityKey}`,
            serviceType: "Local Taxi & Car Service",
            areaServed: [
              CITY_COORDS[cityKey]
                ? { name: cityData.name, lat: CITY_COORDS[cityKey].lat, lng: CITY_COORDS[cityKey].lng }
                : cityData.name,
            ],
          }),
          speakableSchema({ path: `/locations/${cityKey}` }),
        ]}
      />
      {cityData.faqs && cityData.faqs.length > 0 && (
        <JsonLd data={faqSchema(cityData.faqs)} />
      )}
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Locations", href: "/locations" },
          { name: cityData.name, href: `/locations/${cityKey}` },
        ]}
      />
      {/* ─── HERO ─────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 overflow-hidden border-b border-[#C9A84C]/10">
        <div className="absolute inset-0 z-0">
          <Image
            src={cityData.image}
            alt={`Taxi service in ${cityData.name}, Saudi Arabia — airport transfers and intercity rides`}
            fill
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
            className="object-cover"
          />
          <div
            className={`absolute inset-0 bg-gradient-to-t ${
              cityKey === "neom"
                ? "from-[#FAFAF7] via-[#FAFAF7]/50 to-[#FAFAF7]/15"
                : "from-[#FAFAF7] via-[#FAFAF7]/80 to-[#FAFAF7]/40"
            }`}
          />
        </div>

        <div className="section-container relative z-10 max-w-5xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/20 backdrop-blur-sm px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#B8963B] mb-6">
            <MapPin className="h-3 w-3" /> Location Guide
          </span>
          <h1 className="font-heading text-4xl md:text-6xl font-bold leading-tight">
            Taxi Service in <br />
            <span className="text-[#16A34A]">{cityData.name}</span>
          </h1>
          <p className="text-[#C9A84C] text-sm tracking-widest uppercase font-bold mt-2 mb-6">{cityData.nameAr} - {cityData.tagline}</p>
          <p className="max-w-2xl text-sm md:text-base text-[#6B7280] leading-relaxed">
            {cityData.description}
          </p>

          <div className="mt-8 flex gap-4">
            <Link
              href={`/book?pickup=${encodeURIComponent(cityData.name)}`}
              className="flex items-center gap-2 rounded-full bg-[#16A34A] px-8 py-3.5 text-xs font-bold uppercase text-white hover:bg-[#15803D] transition-all"
            >
              <Car className="h-4 w-4" />
              Book a Taxi Now
            </Link>
          </div>
        </div>
      </section>

      <div className="section-container max-w-5xl mt-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* ─── MAIN CONTENT ───────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-16">

          {/* Quick Answer (above-the-fold AI/snippet signal) */}
          {cityData.tldr && (
            <TLDRSummary answer={cityData.tldr} facts={cityData.tldrFacts} />
          )}

          {/* Available Routes */}
          <section>
            <h2 className="font-heading text-3xl font-bold mb-8">Popular Routes from/to {cityData.name}</h2>
            {cityRoutes.length > 0 ? (
              <div className="grid gap-4">
                {cityRoutes.map((route) => (
                  <Link href={`/routes/${route.slug}`} key={route.id} className="group flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl bg-white border border-[#16A34A]/12 hover:border-[#16A34A]/35 transition-colors">
                    <div className="flex items-center gap-4 mb-4 md:mb-0">
                      <div className="font-bold">{route.fromCity}</div>
                      <ArrowRight className="h-4 w-4 text-[#C9A84C]" />
                      <div className="font-bold">{route.toCity}</div>
                    </div>
                    <div className="flex items-center justify-between md:gap-6">
                      <div className="text-right">
                        {route.priceOnRequest ? (
                          <p className="text-[#C9A84C] font-bold text-sm">Confirm on WhatsApp</p>
                        ) : (
                          <>
                            <p className="text-[0.6rem] text-[#6B7280] uppercase font-bold">Starting from</p>
                            <p className="text-[#C9A84C] font-bold">SAR {route.basePrice}</p>
                          </>
                        )}
                      </div>
                      <div className="bg-[#C9A84C]/10 text-[#C9A84C] rounded-full p-2 group-hover:bg-[#16A34A] group-hover:text-white transition-colors">
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-[#6B7280]">Currently mapping custom routes for this city. Please contact us for a quote.</p>
            )}
            <div className="mt-6">
              <Link href="/routes" className="text-[#C9A84C] text-sm font-bold hover:underline">View all {trustStats.routesCovered} Kingdom-wide routes &rarr;</Link>
            </div>
          </section>

          {/* Areas within this city + nearest airport (internal linking to sub-area pages) */}
          {(citySubAreas.length > 0 || cityAirport) && (
            <section>
              <h2 className="font-heading text-3xl font-bold mb-8">Areas We Serve in {cityData.name}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {cityAirport && (
                  <Link
                    href={`/airports/${cityAirport.slug}`}
                    className="group flex items-center justify-between gap-3 rounded-xl border border-[#16A34A]/12 bg-white px-4 py-3 hover:border-[#16A34A]/35 transition-colors"
                  >
                    <span className="flex items-center gap-2 text-sm font-medium text-[#1C1C1C] group-hover:text-[#16A34A]">
                      <PlaneLanding className="h-4 w-4 text-[#C9A84C]" /> {cityAirport.name}
                    </span>
                    <ArrowRight className="h-4 w-4 text-[#C9A84C]" />
                  </Link>
                )}
                {CITY_AIRPORTS_EXTRA[cityKey]?.map((ap) => (
                  <Link
                    key={ap.slug}
                    href={`/airports/${ap.slug}`}
                    className="group flex items-center justify-between gap-3 rounded-xl border border-[#16A34A]/12 bg-white px-4 py-3 hover:border-[#16A34A]/35 transition-colors"
                  >
                    <span className="flex items-center gap-2 text-sm font-medium text-[#1C1C1C] group-hover:text-[#16A34A]">
                      <PlaneLanding className="h-4 w-4 text-[#C9A84C]" /> {ap.name}
                    </span>
                    <ArrowRight className="h-4 w-4 text-[#C9A84C]" />
                  </Link>
                ))}
                {citySubAreas.map((area) => (
                  <Link
                    key={area.subarea}
                    href={`/locations/${cityKey}/${area.subarea}`}
                    className="group flex items-center justify-between gap-3 rounded-xl border border-[#16A34A]/12 bg-white px-4 py-3 hover:border-[#16A34A]/35 transition-colors"
                  >
                    <span className="text-sm font-medium text-[#1C1C1C] group-hover:text-[#16A34A]">Taxi in {area.name}</span>
                    <ArrowRight className="h-4 w-4 text-[#C9A84C]" />
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Local Tips */}
          {cityData.tips.length > 0 && (
            <section className="bg-white border border-[#16A34A]/12 rounded-3xl p-8">
              <h2 className="font-heading text-2xl font-bold mb-6 text-[#1C1C1C]">Local Travel Tips</h2>
              <ul className="space-y-4">
                {cityData.tips.map((tip, idx) => (
                  <li key={idx} className="flex gap-4">
                    <CheckCircle2 className="h-5 w-5 text-[#C9A84C] shrink-0 mt-0.5" />
                    <p className="text-sm text-[#6B7280]">{tip}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* FAQs (FAQPage schema injected above) */}
          {cityData.faqs && cityData.faqs.length > 0 && (
            <section>
              <h2 className="font-heading text-3xl font-bold mb-8 flex items-center gap-3">
                <HelpCircle className="text-[#C9A84C] h-7 w-7" />
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {cityData.faqs.map((faq, idx) => (
                  <div key={idx} className="border border-[#16A34A]/12 rounded-2xl p-6 bg-white">
                    <h3 className="font-bold text-base mb-2 text-[#1C1C1C]">{faq.question}</h3>
                    <p className="text-sm text-[#6B7280] leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Reviews / Testimonials (EEAT trust signals) */}
          {cityData.testimonials && cityData.testimonials.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
                <h2 className="font-heading text-3xl font-bold flex items-center gap-3">
                  <Star className="text-[#C9A84C] h-7 w-7 fill-[#C9A84C]" />
                  What {cityData.name} Travellers Say
                </h2>
                {/* Numeric rating removed — show a rating only when backed by
                    real, verifiable reviews (Phase 1A: no unbacked claims). */}
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {cityData.testimonials.map((t, idx) => (
                  <div key={idx} className="border border-[#16A34A]/12 rounded-2xl p-6 bg-white relative">
                    <Quote className="h-6 w-6 text-[#C9A84C]/30 mb-3" />
                    <p className="text-sm text-[#6B7280] leading-relaxed italic mb-4">&quot;{t.quote}&quot;</p>
                    <div className="flex items-center justify-between border-t border-[#C9A84C]/10 pt-3">
                      <div>
                        <p className="text-sm font-bold text-[#1C1C1C]">{t.author}</p>
                        <p className="text-[0.7rem] text-[#6B7280]">{t.location}</p>
                      </div>
                      <span className="text-[0.6rem] uppercase tracking-wider text-[#B8963B] bg-[#C9A84C]/10 px-2 py-1 rounded-md">{t.trip}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Related Links — internal cross-links to verified route + fleet pages (if present in cityData) */}
          {cityData.relatedLinks && cityData.relatedLinks.length > 0 && (
            <section className="bg-white border border-[#16A34A]/12 rounded-3xl p-8">
              <h2 className="font-heading text-2xl font-bold mb-6 flex items-center gap-3">
                <ExternalLink className="text-[#C9A84C] h-5 w-5" />
                Related Routes & Vehicles
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {cityData.relatedLinks.map((link, idx) => (
                  <Link
                    key={idx}
                    href={link.href}
                    className="group flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#16A34A] transition-colors p-2 rounded-lg hover:bg-[#F0FDF4]"
                  >
                    <ArrowRight className="h-3.5 w-3.5 shrink-0 text-[#C9A84C]/60 group-hover:text-[#16A34A] transition-colors" />
                    {link.label}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* NEOM Executive WhatsApp Inquiry CTA */}
          {cityKey === "neom" && (
            <section className="bg-[#F0FDF4] border border-[#16A34A]/20 rounded-3xl p-8 text-center">
              <h2 className="font-heading text-2xl font-bold text-[#1C1C1C] mb-3">
                Need Executive Chauffeur or Custom Transport in NEOM?
              </h2>
              <p className="text-sm text-[#6B7280] max-w-xl mx-auto mb-6 leading-relaxed">
                Contact our dispatch desk directly on WhatsApp for custom site visit quotes, executive SUV charters, corporate invoicing, and airport transfers.
              </p>
              <a
                href={`https://wa.me/${contactConfig.whatsappNumber}?text=${encodeURIComponent("Salam, I need a private transfer / executive chauffeur quote for NEOM.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 rounded-full bg-[#16A34A] px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#15803D] transition-all shadow-[0_4px_20px_rgba(22,163,74,0.3)]"
              >
                <MessageSquare className="h-4 w-4" />
                Request Quote on WhatsApp
              </a>
            </section>
          )}

        </div>

        {/* ─── SIDEBAR ────────────────────────────────────────────── */}
        <div className="lg:col-span-1 space-y-8">
          
          {/* Attractions */}
          {cityData.attractions.length > 0 && (
            <div className="bg-white border border-[#16A34A]/12 rounded-3xl p-6">
              <h3 className="font-heading text-xl font-bold mb-6 flex items-center gap-2">
                <Building2 className="text-[#C9A84C] h-5 w-5" /> Key Destinations
              </h3>
              <div className="space-y-4">
                {cityData.attractions.map((attr, idx) => (
                  <div key={idx} className="flex justify-between items-center border-b border-[#C9A84C]/10 pb-4 last:border-0 last:pb-0">
                    <span className="text-sm font-bold text-[#1C1C1C]">{attr.name}</span>
                    <span className="text-[0.65rem] uppercase tracking-wider text-[#B8963B] bg-[#C9A84C]/10 px-2 py-1 rounded-md">{attr.dist}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Vehicle Recommendation */}
          <div className="bg-white border border-[#16A34A]/15 shadow-lg rounded-3xl p-6 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-10 text-[#C9A84C]">
              <Car className="h-32 w-32" />
            </div>
            <div className="relative z-10">
              <span className="text-[0.6rem] uppercase tracking-widest text-[#C9A84C] font-bold">Recommended</span>
              <h3 className="font-heading text-xl font-bold mt-1 mb-2">SUV Class</h3>
              <p className="text-xs text-[#6B7280] mb-6 leading-relaxed">
                For optimal comfort and ample luggage space in {cityData.name}, our premium SUV fleet (GMC Yukon, Chevy Tahoe) is highly recommended.
              </p>
              <Link
                href={`/book?pickup=${encodeURIComponent(cityData.name)}`}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#16A34A] py-3 text-xs font-bold uppercase text-white hover:bg-[#15803D] transition-all"
              >
                Reserve Vehicle
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
