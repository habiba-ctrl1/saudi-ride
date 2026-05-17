import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Users, Briefcase, CheckCircle, Star, MessageCircle, ChevronLeft, Wifi, Wind, Shield } from "lucide-react";
import { FLEET_VEHICLES } from "@/lib/fleet-data";
import { contactConfig } from "@/lib/config/contact";

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

  const title = `${vehicle.name} Taxi Saudi Arabia | ${vehicle.subtitle} Transfer | Riyadh Luxe`;
  const description = `Book a ${vehicle.name} in Saudi Arabia from SAR ${vehicle.startingPrice}. ${vehicle.description} Available 24/7 for airport transfers, Umrah, and intercity routes.`;

  return {
    title,
    description,
    keywords: `${vehicle.name} taxi Saudi Arabia, ${vehicle.subtitle} hire Riyadh, ${vehicle.name} Jeddah airport, luxury transfer KSA`,
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
    "https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1543796076-c95c6ff5c0e4?auto=format&fit=crop&w=800&q=80",
  ],
  "gmc-yukon-xl": [
    "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1601929862074-04b7b88f0c82?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1567416661576-659de24d4344?auto=format&fit=crop&w=800&q=80",
  ],
  "hyundai-staria": [
    "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80",
  ],
  "mercedes-s-class": [
    "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1603386329225-868f9b1ee6c9?auto=format&fit=crop&w=800&q=80",
  ],
  default: [
    "https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80",
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
const REVIEWS = [
  { name: "Abdullah Al-Dosari", city: "Riyadh → Jeddah", rating: 5, text: "Absolutely impeccable service. The vehicle was spotless and our chauffeur was professional and punctual. Will use again." },
  { name: "Sarah M.", city: "JED Airport → Makkah", rating: 5, text: "Best airport transfer I've had in Saudi Arabia. Gold standard service from booking to drop-off." },
  { name: "Faisal Al-Shammari", city: "Riyadh → Dammam", rating: 5, text: "Booked for a corporate delegation. The vehicle class and professionalism exceeded our expectations." },
  { name: "Amira K.", city: "Madinah → Jeddah Airport", rating: 4, text: "Great experience overall. Clean vehicle, courteous driver. Arrived well on time for our flight." },
];

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

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8]">

      {/* ─── HERO IMAGE ───────────────────────────────────────────── */}
      <section className="relative h-[55vh] min-h-[380px] w-full overflow-hidden">
        <Image
          src={vehicle.image}
          alt={`${vehicle.name} luxury transfer Saudi Arabia`}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/25 to-[#0A0A0A]" />

        {/* Back Nav */}
        <div className="absolute top-28 left-0 right-0 section-container">
          <Link
            href="/fleet"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/45 px-4 py-2 text-xs font-bold text-[#F5F0E8] backdrop-blur-md hover:border-[#C9A84C]/50 hover:text-[#C9A84C] transition-all"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Back to Fleet
          </Link>
        </div>

        {/* Hero Title Overlay */}
        <div className="absolute bottom-10 left-0 right-0 section-container">
          <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#C9A84C]">{vehicle.subtitle}</span>
          <h1 className="mt-2 font-heading text-3xl font-bold md:text-5xl text-[#F5F0E8]">{vehicle.name}</h1>
          <div className="mt-3 flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-3.5 w-3.5 ${i < Math.floor(vehicle.rating) ? "fill-[#C9A84C] text-[#C9A84C]" : "text-[#7C8088]"}`} />
              ))}
              <span className="ml-1.5 text-xs text-[#C9A84C] font-bold">{vehicle.rating}</span>
              <span className="text-xs text-[#7C8088]">({vehicle.reviews} verified reviews)</span>
            </div>
            <span className="h-1.5 w-1.5 rounded-full bg-[#C9A84C]/50" />
            <span className="rounded-full bg-[#C9A84C] px-3 py-0.5 text-[0.6rem] font-bold text-[#0A0A0A] uppercase tracking-wider">{vehicle.badge}</span>
          </div>
        </div>
      </section>

      {/* ─── MAIN CONTENT GRID ────────────────────────────────────── */}
      <section className="section-container max-w-6xl py-14">
        <div className="grid gap-12 lg:grid-cols-[1fr_380px]">

          {/* LEFT: Specs + Gallery + Reviews */}
          <div className="space-y-12">

            {/* Specs Panel */}
            <div className="rounded-3xl border border-[#C9A84C]/15 bg-[#111111] p-7 space-y-6">
              <h2 className="font-heading text-xl font-bold text-[#F5F0E8]">Vehicle Specifications</h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: <Users className="h-5 w-5 text-[#C9A84C]" />, label: "Passengers", value: `${vehicle.passengers} Max` },
                  { icon: <Briefcase className="h-5 w-5 text-[#C9A84C]" />, label: "Luggage", value: `${vehicle.luggage} Bags` },
                  { icon: <Wind className="h-5 w-5 text-[#C9A84C]" />, label: "Climate", value: specs.ac },
                  { icon: <Wifi className="h-5 w-5 text-[#C9A84C]" />, label: "WiFi", value: specs.wifi ? "Onboard" : "Not Avail." },
                ].map((spec) => (
                  <div key={spec.label} className="rounded-2xl bg-black/35 border border-[#C9A84C]/8 p-4 space-y-2 text-center">
                    <div className="flex justify-center">{spec.icon}</div>
                    <p className="text-[0.55rem] text-[#7C8088] uppercase font-bold tracking-wider">{spec.label}</p>
                    <p className="text-xs font-bold text-[#F5F0E8]">{spec.value}</p>
                  </div>
                ))}
              </div>

              {/* Features checklist */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#A1A1A6] mb-4">Included Amenities</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {[...vehicle.features, "24/7 Dispatch Availability", "Licensed & Insured Chauffeur", `Model Year ${specs.year}`, `${specs.drive} Drivetrain`].map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-xs text-[#A1A1A6]">
                      <CheckCircle className="h-4 w-4 text-[#C9A84C] shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Photo Gallery */}
            <div>
              <h2 className="font-heading text-xl font-bold text-[#F5F0E8] mb-5">Photo Gallery</h2>
              <div className="grid grid-cols-3 gap-3">
                {gallery.map((src, i) => (
                  <div key={i} className={`relative overflow-hidden rounded-2xl border border-[#C9A84C]/10 ${i === 0 ? "col-span-3 h-60" : "h-36"}`}>
                    <Image
                      src={src}
                      alt={`${vehicle.name} angle ${i + 1}`}
                      fill
                      className="object-cover transition-transform duration-700 hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="rounded-3xl border border-[#C9A84C]/10 bg-[#111111] p-7 space-y-4">
              <h2 className="font-heading text-xl font-bold text-[#F5F0E8]">About This Vehicle</h2>
              <p className="text-sm text-[#A1A1A6] leading-relaxed">{vehicle.description}</p>
              <p className="text-sm text-[#A1A1A6] leading-relaxed">
                All vehicles in our fleet are professionally maintained to the highest standards, 
                regularly inspected, and operated exclusively by certified Saudi Transport Authority licensed chauffeurs.
                Whether you are heading to Makkah for Umrah, catching a flight from Jeddah, or attending a high-level 
                business meeting in Riyadh — the {vehicle.name} delivers an experience befitting your status.
              </p>
            </div>

            {/* Reviews */}
            <div>
              <h2 className="font-heading text-xl font-bold text-[#F5F0E8] mb-5">
                Customer Reviews
                <span className="ml-3 text-sm font-normal text-[#7C8088]">({vehicle.reviews} total)</span>
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                {REVIEWS.map((review) => (
                  <div key={review.name} className="rounded-2xl border border-[#C9A84C]/10 bg-[#111111] p-5 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-bold text-[#F5F0E8]">{review.name}</p>
                        <p className="text-[0.6rem] text-[#7C8088] mt-0.5">{review.city}</p>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-[#C9A84C] text-[#C9A84C]" />
                        ))}
                      </div>
                    </div>
                    <p className="text-[0.7rem] text-[#A1A1A6] leading-relaxed">{review.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Sticky Booking Panel */}
          <aside className="space-y-5">
            <div className="sticky top-28 space-y-4">

              {/* Price + Book Card */}
              <div className="rounded-3xl border border-[#C9A84C]/20 bg-[#111111] p-6 shadow-2xl space-y-5">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[0.6rem] text-[#7C8088] uppercase font-bold tracking-wider">Starting From</p>
                    <p className="font-heading text-3xl font-bold text-[#C9A84C]">SAR {vehicle.startingPrice}</p>
                    <p className="text-[0.6rem] text-[#7C8088]">per transfer · VAT inclusive</p>
                  </div>
                  <div className="flex items-center gap-1 bg-[#C9A84C]/10 border border-[#C9A84C]/25 rounded-full px-3 py-1.5">
                    <Shield className="h-3.5 w-3.5 text-[#C9A84C]" />
                    <span className="text-[0.6rem] font-bold text-[#C9A84C]">Fixed Price</span>
                  </div>
                </div>

                <div className="space-y-2.5 border-y border-[#C9A84C]/8 py-4 text-[0.65rem] text-[#A1A1A6]">
                  {["Free cancellation 24h before", "No hidden fees", "Professional licensed chauffeur", "Guaranteed on-time pickup"].map((p) => (
                    <div key={p} className="flex items-center gap-2">
                      <CheckCircle className="h-3.5 w-3.5 text-[#C9A84C] shrink-0" />
                      <span>{p}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href={`/book?vehicle=${vehicle.slug}`}
                  className="flex items-center justify-center gap-2 w-full rounded-full bg-[#C9A84C] py-4 text-xs font-bold uppercase tracking-wider text-[#0A0A0A] transition-all hover:bg-[#B8963B] shadow-[0_4px_20px_rgba(201,168,76,0.3)]"
                >
                  Book This Vehicle
                </Link>

                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full rounded-full border border-[#C9A84C]/30 py-3.5 text-xs font-bold uppercase tracking-wider text-[#C9A84C] transition-all hover:bg-[#C9A84C]/10"
                >
                  <MessageCircle className="h-4 w-4 fill-current" />
                  WhatsApp Quote
                </a>
              </div>

              {/* Trust badges */}
              <div className="rounded-2xl border border-[#C9A84C]/10 bg-[#111111] p-5 space-y-3">
                <p className="text-[0.6rem] font-bold uppercase tracking-wider text-[#7C8088]">Why Book With Us</p>
                {["Saudi General Transport Authority Licensed", "24/7 English & Arabic Support", "GPS Tracked Every Journey", "Insurance Covered All Routes"].map((b) => (
                  <div key={b} className="flex items-center gap-2 text-[0.65rem] text-[#A1A1A6]">
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
          <h2 className="font-heading text-2xl font-bold text-[#F5F0E8] mb-8">
            Similar Vehicles
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {similar.map((v) => (
              <Link
                key={v.slug}
                href={`/fleet/${v.slug}`}
                className="group relative overflow-hidden rounded-3xl border border-[#C9A84C]/12 bg-[#111111] hover:border-[#C9A84C]/40 transition-all duration-300"
              >
                <div className="relative h-40 w-full overflow-hidden">
                  <Image
                    src={v.image}
                    alt={v.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111111] to-transparent" />
                </div>
                <div className="p-5 space-y-1">
                  <p className="text-[0.6rem] text-[#C9A84C] uppercase font-bold tracking-wider">{v.subtitle}</p>
                  <h3 className="font-heading text-base font-bold text-[#F5F0E8] group-hover:text-[#C9A84C] transition-colors">{v.name}</h3>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-[#A1A1A6]">👥 {v.passengers} Pax · 🧳 {v.luggage} Bags</span>
                    <span className="text-xs font-bold text-[#C9A84C]">SAR {v.startingPrice}+</span>
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
