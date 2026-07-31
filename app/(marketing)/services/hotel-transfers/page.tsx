import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Building2, MapPin, Clock, ShieldCheck, CheckCircle2, MessageCircle } from "lucide-react";
import { contactConfig } from "@/lib/config/contact";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { ServiceRelatedLinks } from "@/components/seo/ServiceRelatedLinks";
import { serviceSchema, faqSchema, speakableSchema } from "@/lib/schema";
import { TLDRSummary } from "@/components/seo/TLDRSummary";

const TITLE = "Hotel Transfer Taxi Service Saudi Arabia | Makkah, Madinah & Riyadh";
const DESCRIPTION = "Book private hotel transfers in Saudi Arabia. Direct pickup & drop-off for Makkah Clock Tower, Madinah Markaziyah, Riyadh KAFD & airport connections with licensed drivers.";
const OG_IMAGE = "https://taxisaudiarabia.com/services/hotel-transfers-hero.webp";

export const metadata: Metadata = {
  alternates: { canonical: "https://taxisaudiarabia.com/services/hotel-transfers" },
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    url: "https://taxisaudiarabia.com/services/hotel-transfers",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Hotel Transfer Taxi Service Saudi Arabia" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
};

const HOTELS = [
  { name: "Fairmont Makkah Clock Royal Tower", area: "Makkah Haram Area", desc: "Direct hotel lobby pickup & luggage handling right outside the Haram plaza." },
  { name: "Pullman Zamzam Makkah", area: "Abraj Al Bait Complex", desc: "Seamless transfers to Jeddah Airport or Madinah with large luggage vehicles." },
  { name: "Dar Al Taqwa Madinah", area: "Madinah Central (Markaziyah)", desc: "Door-to-door transfer steps away from Masjid al-Nabawi green dome." },
  { name: "Ritz-Carlton Riyadh", area: "Riyadh Diplomatic Quarter", desc: "Executive VIP chauffeur service in Mercedes S-Class or GMC Yukon Denali." },
  { name: "Shangri-La Jeddah", area: "Jeddah Corniche", desc: "Luxury seaside hotel transfers to King Abdulaziz Airport Terminal 1." },
  { name: "Mövenpick Hotel & Residences Hajar Makkah", area: "Makkah Clock Tower", desc: "Family SUV and VIP Van transfers with fixed pre-booked fares." },
];

const FEATURES = [
  { icon: Building2, title: "Lobby Door-to-Door Service", desc: "Our drivers assist with luggage directly at your hotel entrance or concierge desk." },
  { icon: MapPin, title: "Haram & Business Hub Access", desc: "Permitted drivers who navigate Makkah Haram access points and Riyadh KAFD districts efficiently." },
  { icon: Clock, title: "24/7 On-Time Dispatch", desc: "Pre-scheduled pickups so you never miss a flight, train (Haramain High Speed Rail), or meeting." },
  { icon: ShieldCheck, title: "Fixed Prices — No Surge", desc: "Pre-agreed transparent fares with zero hidden tolls or peak-hour surcharges." },
];

const FAQS = [
  { question: "How do hotel pickups work in Makkah during busy prayer times?", answer: "Our drivers coordinate via phone/WhatsApp and park as close to your hotel lobby or designated assembly point as permitted by traffic authorities." },
  { question: "Can I book a transfer from my Makkah hotel to a Madinah hotel?", answer: "Yes! We specialize in inter-hotel transfers between Makkah and Madinah with Meeqat stops included." },
  { question: "Do you offer executive vehicles for hotel guests?", answer: "Yes. We provide Mercedes-Benz S-Class, V-Class VIP, GMC Yukon Denali, and Cadillac Escalade for hotel VIP transfers." },
  { question: "What if my flight is early in the morning?", answer: "We operate 24/7/365. You can schedule your hotel pickup for any hour of the day or night." },
];

export default function HotelTransfersPage() {
  const whatsappMsg = encodeURIComponent("Salam! I would like to book a hotel transfer in Saudi Arabia.");

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#1C1C1C] pb-24">
      <JsonLd
        data={[
          serviceSchema({ name: TITLE, description: DESCRIPTION, serviceType: "ChauffeurService", path: "/services/hotel-transfers" }),
          faqSchema(FAQS),
          speakableSchema({ path: "/services/hotel-transfers" }),
        ]}
      />

      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Services", href: "/services" },
          { name: "Hotel Transfers", href: "/services/hotel-transfers" },
        ]}
      />

      {/* Hero Section */}
      <section className="relative bg-[#121212] text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#C9A84C]/20 border border-[#C9A84C]/40 px-3.5 py-1 text-xs font-semibold text-[#C9A84C] mb-4">
              <Building2 className="h-3.5 w-3.5" /> Door-to-Door Hospitality
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-white">
              Hotel Transfer Taxi Service
            </h1>
            <p className="text-base sm:text-lg text-[#D4D4D4] leading-relaxed mb-6">
              Seamless private transfers between hotels, airports, and holy sites in Makkah, Madinah, Riyadh, Jeddah, and Dammam. Luggage assistance and 24/7 fixed pricing.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href={`${contactConfig.whatsappLink}?text=${whatsappMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 rounded-xl bg-[#25D366] px-6 py-3.5 text-sm font-bold text-white shadow-lg transition-transform hover:scale-105"
              >
                <MessageCircle className="h-5 w-5" /> Book Hotel Transfer on WhatsApp
              </a>
              <Link
                href="/book"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              >
                Calculate Fare
              </Link>
            </div>
          </div>

          <div className="relative aspect-video rounded-2xl overflow-hidden border border-[#C9A84C]/30 shadow-2xl">
            <Image
              src="/fleet/real/mercedes-v-class-fleet-lineup.webp"
              alt="Hotel Transfer Taxi Service Saudi Arabia"
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
          answer="Our hotel transfer service offers 24/7 door-to-door pickups across all major Saudi hotel districts including Makkah Clock Tower, Madinah Markaziyah, Riyadh KAFD, and airport connections with luggage assistance."
          facts={[
            { label: "Coverage", value: "All Saudi Cities & Hotels" },
            { label: "Service Hours", value: "24 Hours / 7 Days" },
            { label: "Luggage Help", value: "Included" },
            { label: "Pricing", value: "Fixed upfront fare" },
          ]}
          className="mb-12"
        />

        {/* Features */}
        <section className="mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8">Why Travelers Choose Our Hotel Transfers</h2>
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

        {/* Featured Hotels */}
        <section className="mb-16 bg-white rounded-2xl p-8 border border-[#E5E5E5] shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Popular Hotel Routes & Destinations Served</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {HOTELS.map((hotel, index) => (
              <div key={index} className="flex gap-4 p-4 rounded-xl bg-[#FAFAF7] border border-[#E5E5E5]">
                <CheckCircle2 className="h-6 w-6 text-[#006C35] flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-base text-[#1C1C1C]">{hotel.name}</h3>
                  <p className="text-sm text-[#525252] mt-1">{hotel.desc}</p>
                  <span className="inline-block mt-2 text-xs font-semibold text-[#006C35] bg-[#006C35]/10 px-2.5 py-0.5 rounded-full">
                    Area: {hotel.area}
                  </span>
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

        <ServiceRelatedLinks currentPath="/services/hotel-transfers" />
      </div>
    </div>
  );
}
