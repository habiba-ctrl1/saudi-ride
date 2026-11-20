import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Landmark, MapPin, Clock, ShieldCheck, CheckCircle2, MessageCircle } from "lucide-react";
import { contactConfig } from "@/lib/config/contact";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { ServiceRelatedLinks } from "@/components/seo/ServiceRelatedLinks";
import { serviceSchema, faqSchema, speakableSchema } from "@/lib/schema";
import { TLDRSummary } from "@/components/seo/TLDRSummary";

const TITLE = "Badr Battlefield Ziyarat Tour | Madinah to Ghazwa Badr";
const DESCRIPTION = "Private car from Madinah to the Badr sites (~150 km) — Shuhada Badr Cemetery, Masjid Al-Areesh & Jabal Al-Mala'ikah, with the car waiting at each stop. Transport only; fare agreed before booking.";
const OG_IMAGE = "https://taxisaudiarabia.com/locations/madinah-og.webp";

export const metadata: Metadata = {
  alternates: { canonical: "https://taxisaudiarabia.com/services/badr-ziyarat" },
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    url: "https://taxisaudiarabia.com/services/badr-ziyarat",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Sunlit umbrella canopies in the courtyard of Al-Masjid an-Nabawi in Madinah" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
};

const SITES = [
  { name: "Shuhada Badr (Martyrs Cemetery)", desc: "The resting place of the 14 Sahaba (companions) martyred in the First Battle of Badr.", dist: "Badr City" },
  { name: "Masjid Al-Areesh", desc: "The site of the command tent (Areesh) where the Prophet ﷺ prayed during the battle.", dist: "Near Battlefield" },
  { name: "Jabal Al-Mala'ikah (Mount of Angels)", desc: "The sand hill where the angels descended to support the Muslim army.", dist: "Battle Field" },
  { name: "Al-Udwat Al-Dunya & Al-Udwat Al-Quswa", desc: "The historical positions of the Muslim and Quraish armies mentioned in the Quran (Surah Al-Anfal).", dist: "Battlefield Area" },
  { name: "Bir Badr (Wells of Badr)", desc: "The historic water wells around which the strategic battle took place.", dist: "Badr Plains" },
];

const FEATURES = [
  { icon: MapPin, title: "Madinah Hotel Pickup", desc: "Convenient pickup directly from your hotel in Markaziyah or any district in Madinah." },
  { icon: Landmark, title: "Rich Quranic & Seerah History", desc: "Visit the historic battlefield sites at your own pace. Transport only: we do not provide a guide or religious guidance." },
  { icon: Clock, title: "Half-Day Trip", desc: "About 150 km each way by road (roughly 1 hr 45 min without traffic), with time at the sites to pray and reflect. Allow most of a day if you add stops." },
  { icon: ShieldCheck, title: "Fare Agreed First", desc: "We confirm one fixed fare on WhatsApp before booking — no meter, no surge." },
];

const FAQS = [
  { question: "How far is Badr from Madinah?", answer: "Badr is about 150 km south-west of Madinah by road, roughly 1 hour 45 minutes without traffic each way." },
  { question: "How long does the Badr Ziyarat trip take?", answer: "Plan most of a day. The drive alone is around 3 hours 30 minutes there and back, plus the time you spend at each site and prayer stops. Tell us your pace and we plan the hours with you." },
  { question: "Which sites can the car take me to at Badr?", answer: "The usual stops are Shuhada Badr (Martyrs Cemetery), Masjid Al-Areesh, Jabal Al-Mala'ikah and the battlefield area. We provide the transport and wait at each stop; we do not provide a guide." },
  { question: "Can we combine Badr with Yanbu?", answer: "Yes. Tell us the plan and we can arrange a Madinah to Badr to Yanbu trip as one booking, with the fare confirmed first. For Jeddah or Makkah, book a separate transfer." },
];

export default function BadrZiyaratPage() {
  const whatsappMsg = encodeURIComponent("Salam! I would like to book a Badr Ziyarat Tour from Madinah.");

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#1C1C1C] pb-24">
      <JsonLd
        data={[
          serviceSchema({ name: TITLE, description: DESCRIPTION, serviceType: "ChauffeurService", path: "/services/badr-ziyarat" }),
          faqSchema(FAQS),
          speakableSchema({ path: "/services/badr-ziyarat" }),
        ]}
      />

      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Services", href: "/services" },
          { name: "Badr Ziyarat", href: "/services/badr-ziyarat" },
        ]}
      />

      {/* Hero Section */}
      <section className="relative bg-[#121212] text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#C9A84C]/20 border border-[#C9A84C]/40 px-3.5 py-1 text-xs font-semibold text-[#C9A84C] mb-4">
              <Landmark className="h-3.5 w-3.5" /> Seerah & Quranic History
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-white">
              Battlefield of Badr Ziyarat Tour
            </h1>
            <p className="text-base sm:text-lg text-[#D4D4D4] leading-relaxed mb-6">
              Visit the sacred site of Ghazwa Badr — the first decisive battle in Islamic history. Private transfer tour from Madinah to Shuhada Badr, Masjid Al-Areesh, and Jabal Al-Mala&apos;ikah.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href={`${contactConfig.whatsappLink}?text=${whatsappMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 rounded-xl bg-[#25D366] px-6 py-3.5 text-sm font-bold text-white shadow-lg transition-transform hover:scale-105"
              >
                <MessageCircle className="h-5 w-5" /> Book Badr Tour on WhatsApp
              </a>
              <Link
                href="/book"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              >
                Request a Quote
              </Link>
            </div>
          </div>

          <div className="relative aspect-video rounded-2xl overflow-hidden border border-[#C9A84C]/30 shadow-2xl">
            <Image
              src="/fleet/real/mercedes-s-class-exterior-night.webp"
              alt="Ghazwa Badr private transfer"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      {/* Main Content Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <TLDRSummary
          answer="Badr is about 150 km from Madinah, roughly 1 hour 45 minutes each way, so the trip takes most of a half-day or more. A private car takes you to Shuhada Badr, Masjid Al-Areesh, Jabal Al-Mala'ikah and the battlefield area and waits at each stop. Transport only — no guide."
          facts={[
            { label: "Distance", value: "150 km from Madinah" },
            { label: "Duration", value: "Most of a day, depending on stops" },
            { label: "Pickup", value: "Madinah Hotel Pickup" },
            { label: "Vehicle Options", value: "Sedan, SUV, VIP Van" },
          ]}
          className="mb-12"
        />

        {/* Key Features Grid */}
        <section className="mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8">Why Visit Badr With Taxi Saudi Arabia?</h2>
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

        {/* Sites Covered Table */}
        <section className="mb-16 bg-white rounded-2xl p-8 border border-[#E5E5E5] shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Historical Battlefield Sites the Car Can Take You To</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SITES.map((site, index) => (
              <div key={index} className="flex gap-4 p-4 rounded-xl bg-[#FAFAF7] border border-[#E5E5E5]">
                <CheckCircle2 className="h-6 w-6 text-[#006C35] flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-base text-[#1C1C1C]">{site.name}</h3>
                  <p className="text-sm text-[#525252] mt-1">{site.desc}</p>
                  <span className="inline-block mt-2 text-xs font-semibold text-[#006C35] bg-[#006C35]/10 px-2.5 py-0.5 rounded-full">
                    Area: {site.dist}
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

        <p className="mb-10 text-sm text-[#525252]">
          Staying in Madinah? See <Link href="/services/madinah-ziyarat" className="font-semibold text-[#006C35] hover:underline">Madinah Ziyarat by private car</Link>, <Link href="/locations/madinah/private-driver" className="font-semibold text-[#006C35] hover:underline">a private driver by the hour</Link> and <Link href="/locations/madinah" className="font-semibold text-[#006C35] hover:underline">all Madinah transfers</Link>.
        </p>
        <ServiceRelatedLinks currentPath="/services/badr-ziyarat" />
      </div>
    </div>
  );
}
