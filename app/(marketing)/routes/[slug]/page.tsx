export const dynamic = "force-dynamic";
export const revalidate = 86400; // revalidate every 24 hours

import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Metadata } from "next";
import { MapPin, Clock, ArrowRight, CheckCircle2, ShieldCheck, Car, HelpCircle, AlertTriangle, ChevronRight } from "lucide-react";
import Link from "next/link";
import { contactConfig } from "@/lib/config/contact";
import Image from "next/image";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const route = await db.route.findUnique({ where: { slug } });

  if (!route) return { title: "Route Not Found" };

  return {
    title: `${route.fromCity} to ${route.toCity} Taxi | Fixed Rate SAR ${route.basePrice} | Book Now`,
    description: `Premium chauffeur transfer from ${route.fromCity} to ${route.toCity}. Distance: ${route.distance}km, Duration: ~${Math.round(route.duration / 60)}hrs. Fixed prices starting at SAR ${route.basePrice}. No hidden fees.`,
    alternates: {
      canonical: `/routes/${slug}`,
    },
    openGraph: {
      title: `${route.fromCity} to ${route.toCity} Premium Transfer`,
      description: route.description || `Book a luxury ride from ${route.fromCity} to ${route.toCity}.`,
      type: "website",
    },
  };
}

export default async function RouteDetailsPage({ params }: PageProps) {
  const { slug } = await params;
  const route = await db.route.findUnique({ where: { slug } });

  if (!route) {
    notFound();
  }

  // Calculate prices based on basePrice
  const prices = {
    SEDAN: route.basePrice,
    SUV: Math.round(route.basePrice * 1.5),
    VAN: Math.round(route.basePrice * 1.35),
    LUXURY: Math.round(route.basePrice * 2.5),
    BUS: Math.round(route.basePrice * 3.8),
  };

  const vehicles = [
    { name: "Executive Sedan", key: "SEDAN", pax: 3, luggage: 2, img: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&w=400&q=80" },
    { name: "Family SUV", key: "SUV", pax: 6, luggage: 5, img: "https://images.unsplash.com/photo-1601929862074-04b7b88f0c82?auto=format&fit=crop&w=400&q=80" },
    { name: "Luxury VIP", key: "LUXURY", pax: 3, luggage: 3, img: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=400&q=80" },
    { name: "Group Van", key: "VAN", pax: 7, luggage: 7, img: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=400&q=80" },
  ];

  // Schema Markup
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    "name": `${route.fromCity} to ${route.toCity} Transfer`,
    "description": route.description,
    "provider": {
      "@type": "LocalBusiness",
      "name": "Riyadh Taxi"
    },
    "itinerary": {
      "@type": "ItemList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "item": {
            "@type": "TouristAttraction",
            "name": route.fromCity
          }
        },
        {
          "@type": "ListItem",
          "position": 2,
          "item": {
            "@type": "TouristAttraction",
            "name": route.toCity
          }
        }
      ]
    },
    "offers": {
      "@type": "Offer",
      "price": route.basePrice,
      "priceCurrency": "SAR",
      "availability": "https://schema.org/InStock"
    }
  };

  // Google Static Maps integration (Placeholder logic using standard maps URL if no key)
  const mapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const mapUrl = mapsApiKey 
    ? `https://maps.googleapis.com/maps/api/staticmap?size=800x400&path=color:0xC9A84C|weight:4|${encodeURIComponent(route.fromCity)}|${encodeURIComponent(route.toCity)}&markers=color:black|label:A|${encodeURIComponent(route.fromCity)}&markers=color:black|label:B|${encodeURIComponent(route.toCity)}&key=${mapsApiKey}`
    : `https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80`; // Fallback beautiful map abstract

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8] pb-24">
      {/* Inject Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />

      {/* ─── HERO & MAP ───────────────────────────────────────────── */}
      <section className="relative pt-24 pb-12 overflow-hidden border-b border-[#C9A84C]/10">
        <div className="absolute inset-0 z-0 opacity-30">
          <Image src={mapUrl} alt={`Map route from ${route.fromCity} to ${route.toCity}`} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/80 to-[#0A0A0A]/40" />
        </div>

        <div className="section-container relative z-10 max-w-5xl">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-wider text-[#7C8088] mb-8">
            <Link href="/" className="hover:text-[#C9A84C] transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/routes" className="hover:text-[#C9A84C] transition-colors">Routes</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-[#C9A84C]">{route.fromCity} to {route.toCity}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <h1 className="font-heading text-4xl md:text-5xl font-bold leading-tight">
                {route.fromCity} <span className="text-[#C9A84C]">to</span> {route.toCity}
              </h1>
              <p className="mt-4 text-sm md:text-base text-[#A1A1A6] leading-relaxed">
                {route.description}
              </p>
            </div>
            
            <div className="shrink-0 bg-[#111111]/80 backdrop-blur-md border border-[#C9A84C]/20 rounded-2xl p-6 flex items-center gap-6">
              <div>
                <p className="text-[0.6rem] text-[#7C8088] uppercase font-bold tracking-wider mb-1">Distance</p>
                <div className="flex items-center gap-1.5 font-bold text-lg">
                  <MapPin className="h-4 w-4 text-[#C9A84C]" />
                  {route.distance} km
                </div>
              </div>
              <div className="w-px h-10 bg-[#C9A84C]/20" />
              <div>
                <p className="text-[0.6rem] text-[#7C8088] uppercase font-bold tracking-wider mb-1">Est. Time</p>
                <div className="flex items-center gap-1.5 font-bold text-lg">
                  <Clock className="h-4 w-4 text-[#C9A84C]" />
                  ~{Math.round(route.duration / 60)}h {route.duration % 60 > 0 ? `${route.duration % 60}m` : ''}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="section-container max-w-5xl mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* ─── LEFT COLUMN (Details) ──────────────────────────────── */}
        <div className="lg:col-span-2 space-y-12">
          
          {/* Vehicles & Pricing */}
          <section>
            <h2 className="font-heading text-2xl font-bold mb-6 flex items-center gap-3">
              <Car className="text-[#C9A84C]" />
              Vehicle Options & Fixed Pricing
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {vehicles.map((v) => (
                <div key={v.key} className="border border-[#C9A84C]/15 rounded-2xl bg-[#111] overflow-hidden group hover:border-[#C9A84C]/40 transition-colors">
                  <div className="h-32 relative">
                    <Image src={v.img} alt={v.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111] to-transparent" />
                  </div>
                  <div className="p-5 relative -mt-6">
                    <div className="flex justify-between items-end mb-2">
                      <h3 className="font-bold text-lg">{v.name}</h3>
                      <p className="font-heading text-xl font-bold text-[#C9A84C]">SAR {prices[v.key as keyof typeof prices]}</p>
                    </div>
                    <div className="flex gap-4 text-[0.65rem] text-[#A1A1A6] font-bold uppercase tracking-wider">
                      <span>{v.pax} Passengers</span>
                      <span>{v.luggage} Luggage</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Route Tips */}
          <section className="bg-[#111] border border-[#C9A84C]/15 rounded-3xl p-8">
            <h2 className="font-heading text-2xl font-bold mb-6 flex items-center gap-3">
              <AlertTriangle className="text-[#C9A84C]" />
              Route Tips & Information
            </h2>
            <ul className="space-y-4">
              <li className="flex gap-4">
                <CheckCircle2 className="h-5 w-5 text-[#C9A84C] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm">All-Inclusive Fixed Price</h4>
                  <p className="text-xs text-[#A1A1A6] mt-1">The price you see is the price you pay. No hidden fees, no surge pricing, tolls and taxes included.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <CheckCircle2 className="h-5 w-5 text-[#C9A84C] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm">Meet & Greet Service</h4>
                  <p className="text-xs text-[#A1A1A6] mt-1">Your chauffeur will wait for you at the exact pickup location holding a personalized name board.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <ShieldCheck className="h-5 w-5 text-[#C9A84C] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm">Professional & Licensed</h4>
                  <p className="text-xs text-[#A1A1A6] mt-1">All chauffeurs are fully licensed, bilingual (English/Arabic), and trained for premium executive transport.</p>
                </div>
              </li>
            </ul>
          </section>

          {/* FAQs */}
          <section>
            <h2 className="font-heading text-2xl font-bold mb-6 flex items-center gap-3">
              <HelpCircle className="text-[#C9A84C]" />
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              <div className="border border-[#C9A84C]/15 rounded-2xl p-5 bg-[#111]">
                <h4 className="font-bold text-sm mb-2">Can I modify my pickup time?</h4>
                <p className="text-xs text-[#A1A1A6] leading-relaxed">Yes, you can modify your pickup time up to 12 hours before the scheduled transfer without any penalty. Just contact our support team.</p>
              </div>
              <div className="border border-[#C9A84C]/15 rounded-2xl p-5 bg-[#111]">
                <h4 className="font-bold text-sm mb-2">Are there stops allowed during the trip?</h4>
                <p className="text-xs text-[#A1A1A6] leading-relaxed">Brief rest stops for prayer or refreshments are absolutely fine and included in long-distance trips. For extensive detours, please request a custom quote.</p>
              </div>
            </div>
          </section>

        </div>

        {/* ─── RIGHT COLUMN (Booking Widget) ──────────────────────── */}
        <div className="lg:col-span-1">
          <div className="sticky top-[100px] bg-[#111] border border-[#C9A84C]/30 rounded-3xl p-6 shadow-[0_8px_30px_rgba(201,168,76,0.1)]">
            <h3 className="font-heading text-xl font-bold mb-4">Book This Route</h3>
            
            <div className="space-y-4 mb-8">
              <div className="bg-[#0A0A0A] p-4 rounded-xl border border-[#C9A84C]/10 relative">
                <div className="absolute left-6 top-6 bottom-6 w-px bg-[#C9A84C]/30" />
                
                <div className="flex items-center gap-3 mb-6 relative z-10">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#C9A84C] outline outline-4 outline-[#111]" />
                  <div>
                    <p className="text-[0.6rem] text-[#7C8088] font-bold uppercase tracking-wider">Pickup</p>
                    <p className="font-bold text-sm truncate">{route.fromCity}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 relative z-10">
                  <div className="w-2.5 h-2.5 rounded-full bg-white outline outline-4 outline-[#111]" />
                  <div>
                    <p className="text-[0.6rem] text-[#7C8088] font-bold uppercase tracking-wider">Dropoff</p>
                    <p className="font-bold text-sm truncate">{route.toCity}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center px-2">
                <span className="text-sm font-bold text-[#A1A1A6]">Starting from</span>
                <span className="font-heading text-2xl font-bold text-[#C9A84C]">SAR {route.basePrice}</span>
              </div>
            </div>

            <div className="space-y-3">
              <Link
                href={`/book?pickup=${encodeURIComponent(route.fromCity)}&dropoff=${encodeURIComponent(route.toCity)}`}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#C9A84C] py-3.5 text-xs font-bold uppercase tracking-wider text-[#0A0A0A] hover:bg-[#B8963B] transition-all"
              >
                Proceed to Booking <ArrowRight className="h-4 w-4" />
              </Link>
              
              <a
                href={`https://wa.me/${contactConfig.whatsappNumber}?text=Salam, I want to book the route from ${route.fromCity} to ${route.toCity}.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-full border border-[#C9A84C]/30 py-3.5 text-xs font-bold uppercase tracking-wider text-[#C9A84C] hover:bg-[#C9A84C]/10 transition-all"
              >
                Book via WhatsApp
              </a>
            </div>
            
            <p className="text-center text-[0.6rem] text-[#7C8088] mt-4">Free cancellation up to 24h before pickup</p>
          </div>
        </div>
      </div>
    </main>
  );
}
