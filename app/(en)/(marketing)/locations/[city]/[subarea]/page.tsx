import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MapPin, ArrowRight, Car, ShieldCheck, Star, Clock, Building2, HelpCircle, PlaneLanding, CheckCircle2, MessageSquare, ExternalLink } from "lucide-react";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { serviceSchema, faqSchema } from "@/lib/schema";
import { TLDRSummary } from "@/components/seo/TLDRSummary";
import WhatsAppQuoteForm from "@/components/booking/WhatsAppQuoteForm";
import { SUB_AREAS } from "@/lib/data/subareas";
import { contactConfig } from "@/lib/config/contact";
import { RIYADH_PAGES, RIYADH_CITY } from "@/lib/data/riyadh-cluster";
import { JEDDAH_PAGES, JEDDAH_CITY } from "@/lib/data/jeddah-cluster";
import { ALULA_PAGES, ALULA_CITY } from "@/lib/data/alula-cluster";
import type { ClusterPage, ClusterCity } from "@/lib/data/cluster";

// Cities whose children render through the shared cluster system.
const CLUSTERS: Record<string, { pages: Record<string, ClusterPage>; city: ClusterCity }> = {
  riyadh: { pages: RIYADH_PAGES, city: RIYADH_CITY },
  jeddah: { pages: JEDDAH_PAGES, city: JEDDAH_CITY },
  alula: { pages: ALULA_PAGES, city: ALULA_CITY },
};
import { ClusterChildPage } from "@/components/location/cluster/ClusterChildPage";

export const revalidate = 86400; // revalidate every 24 hours

// Service-kind pages within the same city cross-link to each other directly
// (more contextual than the generic city-wide RELATED_LINKS below) — keyed by
// subarea slug, excludes self automatically since each map only lists siblings.
const SERVICE_CROSS_LINKS: Record<string, { name: string; href: string }[]> = {
  "private-driver": [{ name: "Riyadh hotel transfer — Olaya, KAFD & DQ", href: "/locations/riyadh/hotel-transfer" }],
  "hotel-transfer": [{ name: "Hire a private driver by the hour in Riyadh", href: "/locations/riyadh/private-driver" }],
};

// Ontology internal-linking targets per city (same-city / same-intent cluster).
const RELATED_LINKS: Record<string, { name: string; href: string }[]> = {
  riyadh: [
    { name: "King Khalid Airport (RUH) transfers", href: "/airports/king-khalid-riyadh" },
    { name: "Corporate & business travel accounts", href: "/services/corporate" },
    { name: "VIP transportation Riyadh", href: "/services/vip-transportation" },
    { name: "Riyadh to Dammam taxi", href: "/routes/riyadh-to-dammam" },
  ],
  jeddah: [
    { name: "Jeddah Airport → Makkah taxi", href: "/routes/jeddah-airport-to-makkah" },
    { name: "Jeddah → Madinah taxi", href: "/routes/jeddah-to-madinah" },
    { name: "Jeddah Airport (JED) pickups", href: "/airports/king-abdulaziz-jeddah" },
    { name: "Umrah taxi from Jeddah", href: "/services/umrah-transport" },
  ],
  makkah: [
    { name: "Makkah → Madinah taxi", href: "/routes/makkah-to-madinah" },
    { name: "Makkah → Jeddah Airport taxi", href: "/routes/makkah-to-jeddah-airport" },
    { name: "Makkah Ziyarat tour", href: "/services/makkah-ziyarat" },
    { name: "Umrah taxi service", href: "/services/umrah-transport" },
  ],
  madinah: [
    { name: "Madinah → Makkah taxi", href: "/routes/madinah-to-makkah" },
    { name: "Madinah Airport (MED) → City", href: "/routes/madinah-airport-to-city" },
    { name: "Madinah Ziyarat tour", href: "/services/madinah-ziyarat" },
    { name: "Madinah → Jeddah Airport taxi", href: "/routes/madinah-to-jeddah-airport" },
  ],
};

export function generateStaticParams() {
  return Object.values(SUB_AREAS).map((area) => ({
    city: area.city,
    subarea: area.subarea,
  }));
}

interface PageProps {
  params: Promise<{
    city: string;
    subarea: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city, subarea } = await params;
  const areaKey = Object.keys(SUB_AREAS).find(k => SUB_AREAS[k].city === city && SUB_AREAS[k].subarea === subarea);
  
  if (!areaKey) return { title: "Location Not Found" };
  
  const area = SUB_AREAS[areaKey];
  const capitalizedCity = city.charAt(0).toUpperCase() + city.slice(1);

  // Riyadh cluster pages (rebuilt 2026-10-01) carry their own metadata in
  // lib/data/riyadh-cluster.ts. Canonical pattern unchanged.
  const rp = CLUSTERS[city]?.pages[subarea];
  if (rp) {
    const url = `https://taxisaudiarabia.com/locations/${city}/${subarea}`;
    const img = rp.heroImage ? `https://taxisaudiarabia.com${rp.heroImage}` : `https://taxisaudiarabia.com/locations/${city}-og.webp`;
    return {
      title: { absolute: rp.title },
      description: rp.metaDescription,
      alternates: { canonical: url },
      openGraph: { title: rp.title, description: rp.metaDescription, type: "website", url, images: [{ url: img, alt: rp.heroAlt ?? rp.h1 }] },
      twitter: { card: "summary_large_image", title: rp.title, description: rp.metaDescription, images: [img] },
    };
  }

  // Service-kind pages (e.g. private-driver) carry their own metaTitle/
  // metaDescription — distinct commercial intent, not a district page.
  if (area.kind === "service" && area.metaTitle) {
    return {
      title: area.metaTitle,
      description: area.metaDescription ?? area.description,
      alternates: {
        canonical: `https://taxisaudiarabia.com/locations/${city}/${subarea}`,
      },
      openGraph: {
        title: area.metaTitle,
        description: area.metaDescription ?? area.description,
      },
      twitter: {
        card: "summary_large_image",
        title: area.metaTitle,
        description: area.metaDescription ?? area.description,
      },
    };
  }

  // Diriyah gets a directional title (matches "Riyadh to Diriyah" search
  // intent) instead of the generic "Taxi in X, City" formula every other
  // subarea page uses.
  const title = areaKey === "diriyah"
    ? `Riyadh to Diriyah Taxi — At-Turaif & Bujairi Transfer | Taxi Saudi Arabia`
    : `Taxi & Private Transfer in ${area.name}, ${capitalizedCity} | Taxi Saudi Arabia`;

  return {
    title,
    description: area.description,
    alternates: {
      canonical: `https://taxisaudiarabia.com/locations/${city}/${subarea}`,
    },
    openGraph: {
      title: areaKey === "diriyah" ? "Riyadh to Diriyah Taxi — Book Now" : `Taxi in ${area.name}, ${capitalizedCity} — Book Now`,
      description: area.description,
    },
  };
}

export default async function SubAreaPage({ params }: PageProps) {
  const { city, subarea } = await params;
  const areaKey = Object.keys(SUB_AREAS).find(k => SUB_AREAS[k].city === city && SUB_AREAS[k].subarea === subarea);
  
  if (!areaKey) {
    notFound();
  }

  const area = SUB_AREAS[areaKey];
  const capitalizedCity = city.charAt(0).toUpperCase() + city.slice(1);

  const cluster = CLUSTERS[city];
  const clusterPage = cluster?.pages[subarea];
  if (cluster && clusterPage) return <ClusterChildPage page={clusterPage} city={cluster.city} />;

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#1C1C1C] pb-24">
      <JsonLd
        data={serviceSchema({
          name: area.kind === "service" ? `${area.name} in ${capitalizedCity}` : `Taxi Service in ${area.name}, ${capitalizedCity}`,
          description: area.description,
          path: `/locations/${city}/${subarea}`,
          serviceType: area.kind === "service" ? "Hourly & Full-Day Chauffeur Hire" : "Local Taxi & Car Service",
          areaServed: area.kind === "service" ? [capitalizedCity] : [area.name, capitalizedCity],
        })}
      />
      {area.faqs && area.faqs.length > 0 && (
        <JsonLd data={faqSchema(area.faqs)} />
      )}
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Locations", href: "/locations" },
          { name: capitalizedCity, href: `/locations/${city}` },
          { name: area.name, href: `/locations/${city}/${subarea}` },
        ]}
      />
      {/* ─── HERO ───────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 overflow-hidden border-b border-[#C9A84C]/10 bg-white">
        <div className="absolute inset-0 bg-gradient-to-b from-[#C9A84C]/6 to-transparent pointer-events-none" />

        <div className="section-container relative z-10 max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/8 px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#16A34A] mb-6">
            <MapPin className="h-3 w-3" /> {area.kind === "service" ? `${capitalizedCity} Transport Service` : "Local Service Area"}
          </span>
          {area.kind === "service" ? (
            <h1 className="font-heading text-4xl font-bold leading-tight md:text-5xl lg:text-6xl mb-6">{area.h1 ?? area.name}</h1>
          ) : (
            <h1 className="font-heading text-4xl font-bold leading-tight md:text-5xl lg:text-6xl mb-6">
              Taxi Service in <br />
              <span className="text-[#16A34A]">{area.name}</span>
            </h1>
          )}
          <p className="text-[#C9A84C] font-bold tracking-widest text-lg mb-6">{area.nameAr}</p>
          <p className="max-w-2xl mx-auto text-sm md:text-base leading-relaxed text-[#6B7280]">
            {area.description}
            {area.kind !== "service" && ` Whether you need an immediate local ride, an airport transfer, or a private chauffeur for the day, Taxi Saudi Arabia offers premium vehicles and professional drivers directly in ${area.name}, ${capitalizedCity}.`}
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href={`/book?pickup=${encodeURIComponent(area.kind === "service" ? capitalizedCity : area.name + ', ' + capitalizedCity)}`}
              className="btn btn-primary btn-lg"
            >
              Book a Ride Now
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── QUICK ANSWER (above-the-fold AI/snippet signal) ────────────── */}
      {area.tldr && (
        <section className="section-container max-w-5xl pt-12">
          <TLDRSummary answer={area.tldr} facts={area.tldrFacts} />
        </section>
      )}

      {/* ─── USE CASES (service-kind pages only) ────────────────────────── */}
      {area.kind === "service" && area.useCases && area.useCases.length > 0 && (
        <section className="section-container max-w-5xl pt-16">
          <div className="bg-white border border-[#16A34A]/12 rounded-3xl p-8">
            <h2 className="font-heading text-xl font-bold mb-6">When Hourly Hire Makes Sense</h2>
            <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
              {area.useCases.map((u, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[#334155] leading-relaxed">
                  <CheckCircle2 className="h-4 w-4 text-[#16A34A] shrink-0 mt-0.5" />
                  <span>{u}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ─── DISTANCES & LANDMARKS ──────────────────────────────────────── */}
      {(area.airportMin || area.landmarks) && (
        <section className="section-container max-w-5xl pt-16">
          <div className="grid md:grid-cols-2 gap-8">
            {(area.airportMin || area.makkahMin) && (
              <div className="bg-white border border-[#16A34A]/12 rounded-3xl p-8">
                <h2 className="font-heading text-xl font-bold mb-6 flex items-center gap-2">
                  <Clock className="text-[#C9A84C] h-5 w-5" /> Travel Times from {area.name}
                </h2>
                <ul className="space-y-4 text-sm">
                  {area.airportMin && (
                    <li className="flex justify-between border-b border-[#C9A84C]/10 pb-3">
                      <span className="text-[#6B7280] flex items-center gap-2"><PlaneLanding className="h-4 w-4 text-[#C9A84C]" /> {area.airportLabel ?? "King Abdulaziz Airport (JED)"}</span>
                      <span className="font-bold text-[#1C1C1C]">{area.airportMin}</span>
                    </li>
                  )}
                  {area.makkahMin && area.makkahMin !== "—" && (
                    <li className="flex justify-between border-b border-[#C9A84C]/10 pb-3">
                      <span className="text-[#6B7280] flex items-center gap-2"><MapPin className="h-4 w-4 text-[#C9A84C]" /> {area.nearLabel ?? "Makkah (Masjid al-Haram)"}</span>
                      <span className="font-bold text-[#1C1C1C]">{area.makkahMin}</span>
                    </li>
                  )}
                  {area.popularFor && (
                    <li className="flex justify-between pt-1">
                      <span className="text-[#6B7280]">Popular for</span>
                      <span className="font-bold text-[#1C1C1C] text-right max-w-[60%]">{area.popularFor}</span>
                    </li>
                  )}
                </ul>
              </div>
            )}
            {area.landmarks && area.landmarks.length > 0 && (
              <div className="bg-white border border-[#16A34A]/12 rounded-3xl p-8">
                <h2 className="font-heading text-xl font-bold mb-6 flex items-center gap-2">
                  <Building2 className="text-[#C9A84C] h-5 w-5" /> Nearby Landmarks
                </h2>
                <ul className="space-y-3">
                  {area.landmarks.map((lm, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-[#6B7280]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#16A34A]" /> {lm}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─── LOCAL BENEFITS ─────────────────────────────────────────────── */}
      <section className="section-container max-w-5xl py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white border border-[#16A34A]/12 rounded-3xl p-8 text-center hover:border-[#16A34A]/35 transition-colors">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#C9A84C]/10 border border-[#16A34A]/15 mx-auto mb-6">
              <Car className="h-5 w-5 text-[#C9A84C]" />
            </div>
            <h3 className="font-heading text-lg font-bold mb-3">Fast Dispatch</h3>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              {area.kind === "service"
                ? `Our partner network covers ${capitalizedCity}, connecting you with a nearby available chauffeur.`
                : `Our partner network covers ${area.name}, connecting you with a nearby available chauffeur for local and intercity trips.`}
            </p>
          </div>
          <div className="bg-white border border-[#16A34A]/12 rounded-3xl p-8 text-center hover:border-[#16A34A]/35 transition-colors">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#C9A84C]/10 border border-[#16A34A]/15 mx-auto mb-6">
              <ShieldCheck className="h-5 w-5 text-[#C9A84C]" />
            </div>
            <h3 className="font-heading text-lg font-bold mb-3">Fixed Fares</h3>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              {area.kind === "service"
                ? "No surge pricing or hidden meters. Your fare is confirmed before you book."
                : `No surge pricing or hidden meters. Get a guaranteed upfront price for your ride from ${area.name}.`}
            </p>
          </div>
          <div className="bg-white border border-[#16A34A]/12 rounded-3xl p-8 text-center hover:border-[#16A34A]/35 transition-colors">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#C9A84C]/10 border border-[#16A34A]/15 mx-auto mb-6">
              <Star className="h-5 w-5 text-[#C9A84C]" />
            </div>
            <h3 className="font-heading text-lg font-bold mb-3">Premium Fleet</h3>
            <p className="text-xs text-[#6B7280] leading-relaxed">Choose from Executive Sedans, Luxury SUVs, and VIP Vans. All vehicles are impeccably maintained.</p>
          </div>
        </div>
      </section>

      {/* ─── FAQ (FAQPage schema injected above) ────────────────────────── */}
      {area.faqs && area.faqs.length > 0 && (
        <section className="section-container max-w-4xl pb-8">
          <h2 className="font-heading text-2xl font-bold mb-6 flex items-center gap-3">
            <HelpCircle className="text-[#C9A84C]" />
            {area.kind === "service" ? `${area.name} in ${capitalizedCity} — FAQ` : `${area.name} Taxi — FAQ`}
          </h2>
          <div className="space-y-4">
            {area.faqs.map((faq, i) => (
              <div key={i} className="border border-[#16A34A]/12 rounded-2xl p-6 bg-white">
                <h3 className="font-bold text-base mb-2 text-[#1C1C1C]">{faq.question}</h3>
                <p className="text-sm text-[#6B7280] leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ─── QUOTE FORM + PATH B (service-kind pages only) ──────────────── */}
      {area.kind === "service" && (
        <section className="section-container max-w-3xl pb-8">
          <div className="bg-[#F0FDF4] border border-[#16A34A]/20 rounded-3xl p-6 sm:p-8">
            <div className="text-center mb-6">
              <h2 className="font-heading text-2xl font-bold text-[#1C1C1C] mb-3">Get your {area.name.toLowerCase()} quote</h2>
              <p className="text-sm text-[#6B7280] max-w-xl mx-auto leading-relaxed">Fill a few details for a fast WhatsApp quote, or reach out directly for a corporate account.</p>
            </div>
            <WhatsAppQuoteForm defaultPickup={capitalizedCity} defaultVehicle="VIP SUV" />
            <div className="mt-8 rounded-2xl border border-[#16A34A]/15 bg-white p-6">
              <h3 className="font-heading text-lg font-bold text-[#1C1C1C] mb-2">Corporate accounts for daily drivers</h3>
              <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed mb-4">Companies with regular staff movements across Riyadh can set up an account with corporate invoicing on request.</p>
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={`${contactConfig.whatsappLink}?text=${encodeURIComponent("Salam! Private driver / hourly hire enquiry in Riyadh.\n• Date & hours needed: \n• Passengers: \n• Vehicle (Executive sedan / SUV): \n• Business / personal use?: ")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-lg"
                >
                  <MessageSquare className="h-4 w-4" />
                  Quote on WhatsApp
                </a>
                <a
                  href={`mailto:${contactConfig.email}?subject=${encodeURIComponent("Corporate driver account — Riyadh")}&body=${encodeURIComponent("Hello Taxi Saudi Arabia team,\n\nWe'd like a written quote for a corporate driver account in Riyadh.\n\n• Company / organisation: \n• Contact name & role: \n• Typical hours/days needed: \n• Vehicle preference (Executive sedan / SUV): \n• Corporate invoicing (VAT / PO)?: \n\nPlease confirm invoicing details and a fixed fare before booking.\n\nThank you.")}`}
                  className="btn btn-secondary btn-lg"
                >
                  <ExternalLink className="h-4 w-4" />
                  Email a written RFQ
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── RELATED LINKS (ontology internal linking, city cluster) ───── */}
      {RELATED_LINKS[city] && (
        <section className="section-container max-w-5xl pb-8">
          <h2 className="font-heading text-xl font-bold mb-5 text-[#1C1C1C]">
            {area.kind === "service" ? `Related ${capitalizedCity} Services` : `Popular from ${area.name}`}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[...(SERVICE_CROSS_LINKS[subarea] ?? []), ...RELATED_LINKS[city]].map((l) => (
              <Link key={l.href} href={l.href} className="group flex items-center justify-between gap-3 rounded-xl border border-[#16A34A]/12 bg-white px-4 py-3 hover:border-[#16A34A]/35 transition-colors">
                <span className="text-sm font-medium text-[#1C1C1C] group-hover:text-[#16A34A]">{l.name}</span>
                <ArrowRight className="h-4 w-4 text-[#C9A84C]" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ─── NEIGHBORHOOD INFO / CLOSING ─────────────────────────────────── */}
      <section className="border-t border-[#C9A84C]/10 bg-white py-20">
        <div className="section-container max-w-4xl text-center">
          <h2 className="font-heading text-2xl font-bold mb-6 flex items-center justify-center gap-3">
            <MapPin className="text-[#C9A84C]" />
            {area.kind === "service" ? `${area.name} vs. a Single Ride` : `About ${area.name}`}
          </h2>
          <p className="text-sm text-[#6B7280] leading-relaxed mb-8">
            {area.kind === "service"
              ? `A single one-way transfer covers one trip. Hourly or full-day hire keeps the same driver and vehicle with you across the day — better value once you need more than two or three stops, and the standard choice for a business day moving between ${capitalizedCity}'s districts.`
              : `As a key district in ${capitalizedCity}, ${area.name} is a frequent starting point for many of our clients. Whether you are traveling for business, Umrah, or leisure, Taxi Saudi Arabia connects ${area.name} to airports, train stations, and intercity destinations across the Kingdom, with a fixed fare confirmed before you book.`}
          </p>
          <Link
            href={`/locations/${city}`}
            className="text-xs font-bold uppercase tracking-wider text-[#16A34A] hover:text-[#1C1C1C] transition-colors"
          >
            View all {capitalizedCity} locations →
          </Link>
        </div>
      </section>
    </div>
  );
}
