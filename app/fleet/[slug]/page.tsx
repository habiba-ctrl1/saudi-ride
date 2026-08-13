export const revalidate = 86400; // revalidate every 24 hours

import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Users, Briefcase, CheckCircle, MessageCircle, ChevronLeft, Wifi, Wind, Shield } from "lucide-react";
import { FLEET_VEHICLES } from "@/lib/fleet-data";
import { contactConfig } from "@/lib/config/contact";
import { faqSchema } from "@/lib/schema";

// ─── Static Params ─────────────────────────────────────────────────────────
export async function generateStaticParams() {
  return FLEET_VEHICLES.map((v) => ({ slug: v.slug }));
}

// ─── SEO Metadata ───────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = FLEET_VEHICLES.find((v) => v.slug === slug);
  if (!vehicle) return { title: "Vehicle Not Found" };

  // Keep title under ~580px (Google truncation point). Long vehicle names
  // (e.g. "GMC Yukon XL / Denali") get a shorter brand suffix.
  const baseName = `${vehicle.name} — ${vehicle.subtitle} Hire`;
  const title = baseName.length > 45 ? `${baseName} | TaxiKSA` : `${baseName} | Taxi Saudi Arabia`;
  const description = `Hire a ${vehicle.name} in Saudi Arabia from SAR ${vehicle.startingPrice}. ${vehicle.description} Book on WhatsApp — clear prices, professional drivers.`.slice(0, 160);

  return {
    title,
    description,
    alternates: { canonical: `https://taxisaudiarabia.com/fleet/${slug}` },
    openGraph: {
      title,
      description,
      images: [vehicle.image],
      type: "website",
    },
  };
}

// ─── Gallery images per vehicle (Unsplash) ──────────────────────────────────
const GALLERY_IMAGES: Record<string, string[]> = {
  "toyota-camry": [
    "/fleet/toyota-camry.webp",
    "/fleet/gallery/toyota-camry-interior.webp",
    "/fleet/gallery/toyota-camry-side.webp",
  ],
  "gmc-yukon-xl": [
    "/fleet/gmc-yukon-xl.webp",
    "/fleet/gallery/gmc-yukon-interior.webp",
    "/fleet/gallery/gmc-yukon-side.webp",
  ],
  "hyundai-staria": [
    "/fleet/hyundai-staria.webp",
    "/fleet/gallery/staria-interior.webp",
    "/fleet/gallery/staria-side.webp",
  ],
  "mercedes-s-class": [
    "/fleet/mercedes-s-class.webp",
    "/fleet/gallery/s-class-interior.webp",
    "/fleet/gallery/s-class-side.webp",
  ],
  default: [
    "/fleet/toyota-camry.webp",
    "/fleet/gmc-yukon-xl.webp",
    "/fleet/hyundai-staria.webp",
  ],
};

// ─── Extended specs per vehicle type ────────────────────────────────────────
const EXTENDED_SPECS: Record<string, { wifi: boolean; ac: string; drive: string; year: string }> = {
  "toyota-camry":    { wifi: false, ac: "Dual-Zone AC", drive: "FWD", year: "2023" },
  "gmc-yukon-xl":    { wifi: true,  ac: "Tri-Zone AC", drive: "4WD", year: "2024" },
  "hyundai-staria":  { wifi: true,  ac: "Multi-Zone AC", drive: "FWD", year: "2023" },
  "cadillac-escalade":{ wifi: true, ac: "Tri-Zone AC", drive: "4WD", year: "2024" },
  "mercedes-s-class":{ wifi: true,  ac: "4-Zone THERMATIC", drive: "RWD", year: "2024" },
  "bmw-7-series":    { wifi: true,  ac: "4-Zone AC", drive: "RWD", year: "2024" },
  "genesis-g80":     { wifi: true,  ac: "Dual-Zone AC", drive: "AWD", year: "2023" },
  "ford-taurus":     { wifi: false, ac: "Dual-Zone AC", drive: "FWD", year: "2022" },
  "mercedes-vito":   { wifi: true,  ac: "Dual-Zone AC", drive: "RWD", year: "2023" },
  "mercedes-sprinter":{ wifi: true, ac: "Roof-Mounted AC", drive: "RWD", year: "2023" },
  "hyundai-starex":  { wifi: false, ac: "Dual-Zone AC", drive: "RWD", year: "2023" },
  "toyota-hiace":    { wifi: false, ac: "Roof-Mounted AC", drive: "RWD", year: "2023" },
  "toyota-coaster":  { wifi: true,  ac: "Roof-Mounted AC", drive: "RWD", year: "2023" },
  "luxury-bus":      { wifi: true,  ac: "Industrial AC", drive: "RWD", year: "2024" },
};

// ─── Sample customer reviews ─────────────────────────────────────────────────
// ─── Page Component ──────────────────────────────────────────────────────────
export default async function VehicleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const vehicle = FLEET_VEHICLES.find((v) => v.slug === slug);
  if (!vehicle) notFound();

  const gallery = GALLERY_IMAGES[slug] ?? GALLERY_IMAGES.default;
  const specs = EXTENDED_SPECS[slug] ?? { wifi: true, ac: "Dual-Zone AC", drive: "AWD", year: "2023" };

  // 3 similar vehicles (same category, exclude self)
  const similar = FLEET_VEHICLES.filter((v) => v.category === vehicle.category && v.slug !== slug).slice(0, 3);

  const waLink = `https://wa.me/${contactConfig.whatsappNumber}?text=Salam, I would like to book the ${vehicle.name} (${vehicle.subtitle}). Please share availability and pricing.`;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": vehicle.name,
    "image": vehicle.image,
    "description": vehicle.description,
    "brand": {
      "@type": "Brand",
      "name": "Taxi Saudi Arabia"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://taxisaudiarabia.com/fleet/${vehicle.slug}`,
      "priceCurrency": "SAR",
      "price": vehicle.startingPrice,
      "priceValidUntil": "2027-12-31",
      "availability": "https://schema.org/InStock",
      "itemCondition": "https://schema.org/NewCondition"
    },
    // NOTE: no aggregateRating/review schema or on-page review display —
    // add only once real customer reviews exist (see WORK-LEDGER).
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#1C1C1C]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      {vehicle.popularRoute && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(vehicle.popularRoute.faqs)) }}
        />
      )}

      {/* ─── HERO IMAGE ───────────────────────────────────────────── */}
      <section className="relative h-[55vh] min-h-[380px] w-full overflow-hidden">
        <Image
          src={vehicle.image}
          alt={`${vehicle.name} luxury transfer Saudi Arabia`}
          fill
          priority
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/25 to-[#FAFAF7]" />

        {/* Back Nav */}
        <div className="absolute top-28 left-0 right-0 section-container">
          <Link
            href="/fleet"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white px-4 py-2 text-xs font-bold text-[#1C1C1C] backdrop-blur-md hover:border-[#C9A84C]/50 hover:text-[#16A34A] transition-all"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Back to Fleet
          </Link>
        </div>

        {/* Hero Title Overlay */}
        <div className="absolute bottom-10 left-0 right-0 section-container">
          <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#B8963B]">{vehicle.subtitle}</span>
          <h1 className="mt-2 font-heading text-3xl font-bold md:text-5xl text-[#1C1C1C]">{vehicle.name}</h1>
          <div className="mt-3 flex items-center gap-3 flex-wrap">
            <span className="rounded-full bg-[#16A34A] px-3 py-0.5 text-[0.6rem] font-bold text-white uppercase tracking-wider">{vehicle.badge}</span>
          </div>
        </div>
      </section>

      {/* ─── MAIN CONTENT GRID ────────────────────────────────────── */}
      <section className="section-container max-w-6xl py-14">
        <div className="grid gap-12 lg:grid-cols-[1fr_380px]">

          {/* LEFT: Specs + Gallery + Reviews */}
          <div className="space-y-12">

            {/* Specs Panel */}
            <div className="rounded-3xl border border-[#16A34A]/12 bg-white p-7 space-y-6">
              <h2 className="font-heading text-xl font-bold text-[#1C1C1C]">Vehicle Specifications</h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: <Users className="h-5 w-5 text-[#C9A84C]" />, label: "Passengers", value: `${vehicle.passengers} Max` },
                  { icon: <Briefcase className="h-5 w-5 text-[#C9A84C]" />, label: "Luggage", value: `${vehicle.luggage} Bags` },
                  { icon: <Wind className="h-5 w-5 text-[#C9A84C]" />, label: "Climate", value: specs.ac },
                  { icon: <Wifi className="h-5 w-5 text-[#C9A84C]" />, label: "WiFi", value: specs.wifi ? "Onboard" : "Not Avail." },
                ].map((spec) => (
                  <div key={spec.label} className="rounded-2xl bg-[#F0FDF4] border border-[#C9A84C]/8 p-4 space-y-2 text-center">
                    <div className="flex justify-center">{spec.icon}</div>
                    <p className="text-[0.55rem] text-[#6B7280] uppercase font-bold tracking-wider">{spec.label}</p>
                    <p className="text-xs font-bold text-[#1C1C1C]">{spec.value}</p>
                  </div>
                ))}
              </div>

              {/* Features checklist */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B7280] mb-4">Included Amenities</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {[...vehicle.features, "24/7 Dispatch Availability", "Licensed & Insured Driver", `Model Year ${specs.year}`, `${specs.drive} Drivetrain`].map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-xs text-[#6B7280]">
                      <CheckCircle className="h-4 w-4 text-[#C9A84C] shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Photo Gallery */}
            <div>
              <h2 className="font-heading text-xl font-bold text-[#1C1C1C] mb-5">Photo Gallery</h2>
              <div className="grid grid-cols-3 gap-3">
                {gallery.map((src, i) => (
                  <div key={i} className={`relative overflow-hidden rounded-2xl border border-[#C9A84C]/10 ${i === 0 ? "col-span-3 h-60" : "h-36"}`}>
                    <Image
                      src={src}
                      alt={`${vehicle.name} angle ${i + 1}`}
                      fill
                      placeholder="blur"
                      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                      className="object-cover transition-transform duration-700 hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="rounded-3xl border border-[#C9A84C]/10 bg-white p-7 space-y-4">
              <h2 className="font-heading text-xl font-bold text-[#1C1C1C]">About This Vehicle</h2>
              <p className="text-sm text-[#6B7280] leading-relaxed">{vehicle.description}</p>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                We arrange the {vehicle.name} through our transportation partners, with a professional
                chauffeur for your journey. Whether you are heading to Makkah for Umrah, catching a flight
                from Jeddah, or attending a high-level business meeting in Riyadh — the {vehicle.name}
                delivers an experience befitting your status.
              </p>
            </div>

            {vehicle.popularRoute && (
              <div className="rounded-3xl border border-[#C9A84C]/10 bg-white p-7 space-y-4">
                <h2 className="font-heading text-xl font-bold text-[#1C1C1C]">{vehicle.popularRoute.title}</h2>
                <p className="text-sm text-[#6B7280] leading-relaxed">{vehicle.popularRoute.description}</p>
                <div className="space-y-3">
                  {vehicle.popularRoute.faqs.map((faq) => (
                    <div key={faq.question} className="border-t border-[#C9A84C]/10 pt-3">
                      <h3 className="text-sm font-bold text-[#1C1C1C] mb-1">{faq.question}</h3>
                      <p className="text-xs text-[#6B7280] leading-relaxed">{faq.answer}</p>
                    </div>
                  ))}
                </div>
                <Link
                  href={`/routes/${vehicle.popularRoute.routeSlug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#16A34A] hover:underline"
                >
                  View full route details &rarr;
                </Link>
              </div>
            )}

          </div>

          {/* RIGHT: Sticky Booking Panel */}
          <aside className="space-y-5">
            <div className="sticky top-28 space-y-4">

              {/* Price + Book Card */}
              <div className="rounded-3xl border border-[#16A34A]/15 bg-white p-6 shadow-2xl space-y-5">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[0.6rem] text-[#6B7280] uppercase font-bold tracking-wider">Starting From</p>
                    <p className="font-heading text-3xl font-bold text-[#16A34A]">SAR {vehicle.startingPrice}</p>
                    <p className="text-[0.6rem] text-[#6B7280]">per transfer · VAT inclusive</p>
                  </div>
                  <div className="flex items-center gap-1 bg-[#C9A84C]/10 border border-[#C9A84C]/25 rounded-full px-3 py-1.5">
                    <Shield className="h-3.5 w-3.5 text-[#C9A84C]" />
                    <span className="text-[0.6rem] font-bold text-[#16A34A]">Clear Quote</span>
                  </div>
                </div>

                <div className="space-y-2.5 border-y border-[#C9A84C]/8 py-4 text-[0.65rem] text-[#6B7280]">
                  {["Free cancellation 24h before", "No hidden fees", "Professional chauffeur", "On-time pickup"].map((p) => (
                    <div key={p} className="flex items-center gap-2">
                      <CheckCircle className="h-3.5 w-3.5 text-[#C9A84C] shrink-0" />
                      <span>{p}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href={`/book?vehicle=${vehicle.slug}`}
                  className="flex items-center justify-center gap-2 w-full rounded-full bg-[#16A34A] py-4 text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-[#15803D] shadow-[0_4px_20px_rgba(22,163,74,0.3)]"
                >
                  Book This Vehicle
                </Link>

                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full rounded-full border border-[#C9A84C]/30 py-3.5 text-xs font-bold uppercase tracking-wider text-[#B8963B] transition-all hover:bg-[#C9A84C]/10"
                >
                  <MessageCircle className="h-4 w-4 fill-current" />
                  WhatsApp Quote
                </a>
              </div>

              {/* Trust badges */}
              <div className="rounded-2xl border border-[#C9A84C]/10 bg-white p-5 space-y-3">
                <p className="text-[0.6rem] font-bold uppercase tracking-wider text-[#6B7280]">Why Book With Us</p>
                {["Saudi General Transport Authority Licensed", "24/7 English & Arabic Support", "GPS Tracked Every Journey", "Insurance Covered All Routes"].map((b) => (
                  <div key={b} className="flex items-center gap-2 text-[0.65rem] text-[#6B7280]">
                    <span className="text-[#C9A84C] font-bold">✓</span>
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* ─── SIMILAR VEHICLES ─────────────────────────────────────── */}
      {similar.length > 0 && (
        <section className="section-container max-w-6xl pb-24">
          <h2 className="font-heading text-2xl font-bold text-[#1C1C1C] mb-8">
            Similar Vehicles
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {similar.map((v) => (
              <Link
                key={v.slug}
                href={`/fleet/${v.slug}`}
                className="group relative overflow-hidden rounded-3xl border border-[#C9A84C]/12 bg-white hover:border-[#16A34A]/35 transition-all duration-300"
              >
                <div className="relative h-40 w-full overflow-hidden">
                  <Image
                    src={v.image}
                    alt={v.name}
                    fill
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111111] to-transparent" />
                </div>
                <div className="p-5 space-y-1">
                  <p className="text-[0.6rem] text-[#C9A84C] uppercase font-bold tracking-wider">{v.subtitle}</p>
                  <h3 className="font-heading text-base font-bold text-[#1C1C1C] group-hover:text-[#16A34A] transition-colors">{v.name}</h3>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-[#6B7280]">👥 {v.passengers} Pax · 🧳 {v.luggage} Bags</span>
                    <span className="text-xs font-bold text-[#16A34A]">SAR {v.startingPrice}+</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
