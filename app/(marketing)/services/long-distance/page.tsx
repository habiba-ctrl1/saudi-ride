import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Navigation, MapPin, Clock, ShieldCheck, CheckCircle2, MessageCircle } from "lucide-react";
import { contactConfig } from "@/lib/config/contact";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { ServiceRelatedLinks } from "@/components/seo/ServiceRelatedLinks";
import { serviceSchema, faqSchema, speakableSchema } from "@/lib/schema";
import { TLDRSummary } from "@/components/seo/TLDRSummary";

const TITLE = "Intercity & Long Distance Taxi | Cross-Country & GCC";
const DESCRIPTION = "Private long-distance intercity transfers in Saudi Arabia — rides between Riyadh, Jeddah, Makkah, Madinah, Dammam & cross-border GCC trips, price confirmed on WhatsApp.";
const OG_IMAGE = "https://taxisaudiarabia.com/services/long-distance-hero.webp";

export const metadata: Metadata = {
  alternates: { canonical: "https://taxisaudiarabia.com/services/long-distance" },
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    url: "https://taxisaudiarabia.com/services/long-distance",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Long Distance Intercity Taxi Saudi Arabia" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
};

const ROUTES = [
  { name: "Riyadh to Dammam / Al Khobar", dist: "410 km (~3.5 hrs)", price: "From SAR 699", desc: "Express highway transfer connecting Saudi capital with Eastern Province business hubs." },
  { name: "Makkah to Madinah", dist: "430 km (~4.5 hrs)", price: "From SAR 499", desc: "Pilgrim inter-city highway transfer with Meeqat stop (Dhul Hulaifah) included." },
  { name: "Jeddah to Madinah", dist: "420 km (~4 hrs)", price: "From SAR 549", desc: "Direct highway transfer from Jeddah Airport or hotel straight to Madinah Markaziyah." },
  { name: "Riyadh to Jeddah / Makkah", dist: "950 km (~9 hrs)", price: "From SAR 550", desc: "Cross-kingdom journey in executive SUV (GMC Yukon) or sedan." },
  { name: "Dammam to Bahrain (Causeway)", dist: "60 km (~1 hr)", price: "From SAR 200", desc: "Cross-border transfer over King Fahd Causeway to Manama." },
  { name: "Dammam to Qatar (Salwa Border)", dist: "300 km (~3 hrs)", price: "From SAR 500", desc: "GCC inter-state transfer connecting Saudi Eastern Province with Doha." },
];

const FEATURES = [
  { icon: Navigation, title: "Comfortable Highway Vehicles", desc: "Spacious GMC Yukon XL, Mercedes V-Class VIP, and Toyota Camry maintained for long distance safety." },
  { icon: MapPin, title: "Door-to-Door Intercity Delivery", desc: "Direct pickup from any address in the origin city and drop-off at your destination doorstep." },
  { icon: Clock, title: "Pre-Scheduled Rest Stops", desc: "Drivers plan highway stops at modern SASCO stations for food, prayer, and rest at your preference." },
  { icon: ShieldCheck, title: "Clear Upfront Quotes", desc: "All-inclusive quotes covering highway tolls, fuel, and driver fees without hidden charges — confirmed on WhatsApp before booking." },
];

const FAQS = [
  { question: "Are your intercity long-distance prices fixed?", answer: "Yes! All intercity fares are 100% fixed and confirmed on WhatsApp before your trip. There are no meter surcharges or fuel extras." },
  { question: "Can we stop for food and prayer during long highway drives?", answer: "Absolutely. Drivers accommodate rest stops at modern SASCO stations along the highway for prayer, coffee, and meals whenever you request." },
  { question: "Do you offer cross-border GCC long-distance transfers?", answer: "Yes, we provide cross-border private rides to Bahrain (via King Fahd Causeway), Qatar (Salwa Border), UAE, and Kuwait." },
  { question: "Which vehicle is best for long-distance travel with family?", answer: "We recommend our GMC Yukon XL Denali or Mercedes-Benz V-Class VIP for long intercity journeys for maximum legroom, reclining seats, and luggage space." },
];

export default function LongDistancePage() {
  const whatsappMsg = encodeURIComponent("Salam! I would like to book a long-distance intercity taxi in Saudi Arabia.");

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#1C1C1C] pb-24">
      <JsonLd
        data={[
          serviceSchema({ name: TITLE, description: DESCRIPTION, serviceType: "ChauffeurService", path: "/services/long-distance" }),
          faqSchema(FAQS),
          speakableSchema({ path: "/services/long-distance" }),
        ]}
      />

      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Services", href: "/services" },
          { name: "Long Distance", href: "/services/long-distance" },
        ]}
      />

      {/* Hero Section */}
      <section className="relative bg-[#121212] text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#C9A84C]/20 border border-[#C9A84C]/40 px-3.5 py-1 text-xs font-semibold text-[#C9A84C] mb-4">
              <Navigation className="h-3.5 w-3.5" /> Intercity & Cross-Border Highway Travel
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-white">
              Long Distance Taxi Service
            </h1>
            <p className="text-base sm:text-lg text-[#D4D4D4] leading-relaxed mb-6">
              Comfortable long-distance transfers between all major cities in Saudi Arabia and GCC cross-border routes. Experienced highway chauffeurs, premium vehicles, and clear pricing on WhatsApp.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href={`${contactConfig.whatsappLink}?text=${whatsappMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 rounded-xl bg-[#25D366] px-6 py-3.5 text-sm font-bold text-white shadow-lg transition-transform hover:scale-105"
              >
                <MessageCircle className="h-5 w-5" /> Book Intercity Ride on WhatsApp
              </a>
              <Link
                href="/book"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              >
                Calculate Intercity Fare
              </Link>
            </div>
          </div>

          <div className="relative aspect-video rounded-2xl overflow-hidden border border-[#C9A84C]/30 shadow-2xl">
            <Image
              src="/fleet/real/mercedes-sprinter-vip-exterior.webp"
              alt="Long Distance Intercity Taxi Saudi Arabia"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* Main Content Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <TLDRSummary
          answer="Our long-distance intercity taxi service connects Riyadh, Jeddah, Makkah, Madinah, Dammam, and GCC borders with comfortable vehicles (Camry, Yukon XL, Mercedes V-Class), flexible rest stops, and fixed upfront fares."
          facts={[
            { label: "Intercity Routes", value: "All Saudi Cities & GCC" },
            { label: "Rest Stops", value: "At your convenience (SASCO)" },
            { label: "Vehicles", value: "Sedan, SUV, VIP Minivan" },
            { label: "Fares", value: "Fixed — pre-agreed" },
          ]}
          className="mb-12"
        />

        {/* Features */}
        <section className="mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8">Why Book Long Distance Travels With Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-[#E5E5E5] shadow-sm">
                <f.icon className="h-8 w-8 text-[#006C35] mb-4" />
                <h3 className="text-lg font-bold mb-2">{f.title}</h3>
                <p className="text-sm text-[#525252] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Intercity Routes */}
        <section className="mb-16 bg-white rounded-2xl p-8 border border-[#E5E5E5] shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Popular Long-Distance Intercity Routes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ROUTES.map((route, index) => (
              <div key={index} className="flex gap-4 p-4 rounded-xl bg-[#FAFAF7] border border-[#E5E5E5]">
                <CheckCircle2 className="h-6 w-6 text-[#006C35] flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-base text-[#1C1C1C]">{route.name}</h3>
                  <p className="text-sm text-[#525252] mt-1">{route.desc}</p>
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs font-semibold text-[#006C35] bg-[#006C35]/10 px-2.5 py-0.5 rounded-full">
                      {route.dist}
                    </span>
                    <span className="text-xs font-semibold text-[#C9A84C] bg-[#C9A84C]/10 px-2.5 py-0.5 rounded-full">
                      {route.price}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQs */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="bg-white rounded-xl p-6 border border-[#E5E5E5] shadow-sm">
                <h3 className="font-bold text-lg mb-2 text-[#1C1C1C]">{faq.question}</h3>
                <p className="text-sm text-[#525252] leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <ServiceRelatedLinks currentPath="/services/long-distance" />
      </div>
    </div>
  );
}
