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

const TITLE = "Badr Battlefield Ziyarat Taxi Tour | Madinah to Ghazwa Badr";
const DESCRIPTION = "Book a private Ghazwa Badr Ziyarat taxi tour from Madinah (~150 km). Visit Shuhada Badr Martyrs Cemetery, Masjid Al-Areesh & Jabal Al-Mala'ikah with knowledgeable drivers.";
const OG_IMAGE = "https://taxisaudiarabia.com/services/badr-ziyarat-hero.webp";

export const metadata: Metadata = {
  alternates: { canonical: "https://taxisaudiarabia.com/services/badr-ziyarat" },
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    url: "https://taxisaudiarabia.com/services/badr-ziyarat",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Ghazwa Badr Ziyarat taxi tour" }],
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
  { icon: Landmark, title: "Rich Quranic & Seerah History", desc: "Explore the exact sites mentioned in Surah Al-Anfal with respectful, experienced drivers." },
  { icon: Clock, title: "Half-Day Tour (~4-5 Hours)", desc: "Smooth highway drive (~150 km / 1.5 hrs each way) with plenty of time to pray and reflect." },
  { icon: ShieldCheck, title: "Fixed All-Inclusive Fares", desc: "Clear upfront pricing with no hidden charges. Book in seconds via WhatsApp." },
];

const FAQS = [
  { question: "How far is Badr from Madinah?", answer: "Badr is located approximately 150 km southwest of Madinah along the Red Sea highway (~1.5 hours drive)." },
  { question: "How long does the Badr Ziyarat tour take?", answer: "The entire round trip tour usually takes 4 to 5 hours, including drive time and stops at Shuhada Badr and Masjid Al-Areesh." },
  { question: "Which sites are included in the Badr tour?", answer: "The tour includes Shuhada Badr (Martyrs Cemetery), Masjid Al-Areesh, Jabal Al-Mala'ikah, and the battlefield perimeter." },
  { question: "Can we combine the Badr tour with Yanbu or Jeddah?", answer: "Yes! Since Badr is on the way to Yanbu and Jeddah, we can customize your trip to include Yanbu coastal tour or Jeddah drop-off." },
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
              Visit the sacred site of Ghazwa Badr — the first decisive battle in Islamic history. Private taxi tour from Madinah to Shuhada Badr, Masjid Al-Areesh, and Jabal Al-Mala&apos;ikah.
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
                Calculate Tour Fare
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
            />
          </div>
        </div>
      </section>

      {/* Main Content Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <TLDRSummary
          answer="Badr Ziyarat is a 4-5 hour round trip from Madinah (~150 km). Key stops include Shuhada Badr (14 Martyrs cemetery), Masjid Al-Areesh, Jabal Al-Mala'ikah, and the historical battlefield."
          facts={[
            { label: "Distance", value: "150 km from Madinah" },
            { label: "Duration", value: "4–5 Hours" },
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
          <h2 className="text-2xl font-bold mb-6">Historical Battlefield Sites Visited</h2>
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

        <ServiceRelatedLinks currentPath="/services/badr-ziyarat" />
      </div>
    </div>
  );
}
