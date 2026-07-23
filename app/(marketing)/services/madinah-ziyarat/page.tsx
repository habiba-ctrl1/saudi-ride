import { Metadata } from "next";
import Image from "next/image";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { ServiceRelatedLinks } from "@/components/seo/ServiceRelatedLinks";
import { serviceSchema, faqSchema, speakableSchema } from "@/lib/schema";
import { TLDRSummary } from "@/components/seo/TLDRSummary";
import { Compass, ShieldCheck, MapPin, Map } from "lucide-react";
import Link from "next/link";

const TITLE = "Madinah Ziyarat Packages & Taxi Tours | Taxi Saudi Arabia";
const DESCRIPTION = "Guided Ziyarat tours in Madinah. Visit Quba Mosque, Mount Uhud, and historical Islamic sites with our knowledgeable local drivers.";
const OG_IMAGE = "https://taxisaudiarabia.com/services/madinah-ziyarat-hero.webp";

export const metadata: Metadata = {
  alternates: { canonical: "https://taxisaudiarabia.com/services/madinah-ziyarat" },
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    url: "https://taxisaudiarabia.com/services/madinah-ziyarat",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Madinah Ziyarat taxi tour" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
};

const FEATURES = [
  { icon: Map, title: "Comprehensive Routes", desc: "Our standard Ziyarat covers Quba Mosque, Qiblatain Mosque, Khandaq, and Mount Uhud." },
  { icon: Compass, title: "Local Knowledge", desc: "Drivers familiar with the history and significance of the holy sites in Madinah." },
  { icon: ShieldCheck, title: "Flexible Duration", desc: "Book a half-day or full-day tour. Take your time to pray and explore without rushing." },
  { icon: MapPin, title: "Hotel Pickup", desc: "Convenient pickup and drop-off right from your hotel in the Central Area (Markazia)." },
];

export default function MadinahZiyaratPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#1C1C1C] pb-24">
      <JsonLd
        data={[
          serviceSchema({
            name: "Madinah Ziyarat Taxi Tours",
            description:
              "Guided Madinah Ziyarat taxi tours visiting Quba Mosque, Qiblatain Mosque, Mount Uhud, and historical Islamic sites with knowledgeable local drivers.",
            path: "/services/madinah-ziyarat",
            serviceType: "Ziyarat Tour",
            areaServed: ["Madinah"],
          }),
          speakableSchema({ path: "/services/madinah-ziyarat" }),
        ]}
      />
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Services", href: "/services" },
          { name: "Madinah Ziyarat", href: "/services/madinah-ziyarat" },
        ]}
      />
      <section className="relative pt-32 pb-20 overflow-hidden border-b border-[#C9A84C]/10">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/services/madinah-ziyarat-hero.webp" 
            alt="Madinah Ziyarat Tours" 
            fill 
            className="object-cover opacity-30" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAF7] via-[#FAFAF7]/80 to-[#FAFAF7]/40" />
        </div>

        <div className="section-container relative z-10 max-w-5xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 backdrop-blur-md px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#B8963B] mb-6">
            <Compass className="h-3 w-3" /> Spiritual Journey
          </span>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Madinah Ziyarat <br />
            <span className="text-[#16A34A]">Taxi Tours</span>
          </h1>
          <p className="max-w-2xl mx-auto text-sm md:text-base text-[#6B7280] leading-relaxed mb-8">
            Explore the blessed city of Madinah. Visit the historical mosques and battle sites with our comfortable, private guided transport.
          </p>
          <div className="max-w-2xl mx-auto mb-10 text-left">
            <TLDRSummary
              answer="A Madinah Ziyarat taxi tour covers Quba Mosque, Qiblatain Mosque, the Seven Mosques, and Mount Uhud in 3-4 hours, with pickup from your hotel in the Central Area (Markazia)."
              facts={[
                { label: "Duration", value: "3-4 hours" },
                { label: "Sites covered", value: "4+ locations" },
                { label: "Pickup", value: "Markazia hotels" },
              ]}
            />
          </div>
          <div className="flex justify-center gap-4">
            <Link
              href="/book?service=madinah-ziyarat"
              className="inline-flex items-center gap-2 rounded-full bg-[#16A34A] px-8 py-3.5 text-xs font-bold uppercase text-white hover:bg-[#15803D] transition-all"
            >
              Book Ziyarat Tour
            </Link>
          </div>
        </div>
      </section>

      <section className="section-container max-w-7xl py-20 border-b border-[#C9A84C]/10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {FEATURES.map((feat, i) => (
            <div key={i} className="bg-white border border-[#16A34A]/12 rounded-3xl p-8 hover:border-[#16A34A]/35 transition-colors">
              <feat.icon className="h-8 w-8 text-[#C9A84C] mb-6" />
              <h3 className="font-heading text-lg font-bold mb-3">{feat.title}</h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>
      {(() => {
        const faqs = [
          { question: "Which sites does the Madinah Ziyarat tour cover?", answer: "A standard Ziyarat covers Quba Mosque, Qiblatain Mosque, the Seven Mosques (Khandaq area), and Mount Uhud." },
          { question: "How long does a Ziyarat tour take?", answer: "Typically 3 to 4 hours. You can book a half-day or full-day tour to explore at your own pace." },
          { question: "Do you pick up from my hotel?", answer: "Yes. We offer pickup and drop-off directly from your hotel in the Central Area (Markazia) and other Madinah districts." },
        ];
        return (
          <>
            <JsonLd data={faqSchema(faqs)} />
            <section className="section-container max-w-4xl py-20 border-t border-[#C9A84C]/10">
              <h2 className="font-heading text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {faqs.map((f, i) => (
                  <div key={i} className="bg-white border border-[#16A34A]/12 rounded-2xl p-6">
                    <h3 className="font-bold text-[#1C1C1C] mb-2">{f.question}</h3>
                    <p className="text-sm text-[#6B7280] leading-relaxed">{f.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          </>
        );
      })()}
      <ServiceRelatedLinks currentPath="/services/madinah-ziyarat" />
    </div>
  );
}
