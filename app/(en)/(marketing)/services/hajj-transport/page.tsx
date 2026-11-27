import { Metadata } from "next";
import Image from "next/image";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import WhatsAppQuoteForm from "@/components/booking/WhatsAppQuoteForm";
import { ServiceRelatedLinks } from "@/components/seo/ServiceRelatedLinks";
import { serviceSchema, faqSchema, speakableSchema } from "@/lib/schema";
import { TLDRSummary } from "@/components/seo/TLDRSummary";
import { Heart, Compass, ShieldCheck, Clock, Check } from "lucide-react";
import Link from "next/link";

const TITLE = "Hajj Transport Services | Jeddah, Makkah & Madinah Transfers";
const DESCRIPTION = "Book reliable Hajj transport in Saudi Arabia — private transfers between Jeddah Airport, Makkah, Mina, Arafat & Madinah. Fixed fares, AC vehicles, 24/7 peak-season dispatch.";
const OG_IMAGE = "https://taxisaudiarabia.com/services/hajj-transport-hero.webp";

export const metadata: Metadata = {
  alternates: { canonical: "https://taxisaudiarabia.com/services/hajj-transport" },
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    url: "https://taxisaudiarabia.com/services/hajj-transport",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Hajj transport service in Saudi Arabia" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
};

const FEATURES = [
  { icon: Compass, title: "Hajj Access Rules", desc: "Entry to Makkah and the holy sites is controlled in Hajj season, so we confirm what can be arranged for your dates first." },
  { icon: Clock, title: "24/7 Availability", desc: "Round-the-clock transfers to accommodate your flight arrivals and departure times." },
  { icon: ShieldCheck, title: "Safe & Reliable", desc: "Maintained vehicles with experienced drivers who know alternative routes during heavy traffic." },
  { icon: Heart, title: "Pilgrim Focused", desc: "We provide dedicated support, wheelchair accessible options, and understand the needs of Hujjaj." },
];

export default function HajjTransportPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#1C1C1C] pb-24">
      <JsonLd
        data={[
          serviceSchema({
            name: "Hajj Transport Service",
            description:
              "Dedicated Hajj transport service in Saudi Arabia with private vehicles and professional drivers for transfers between Jeddah, Makkah, Madinah, Mina, and Arafat.",
            path: "/services/hajj-transport",
            serviceType: "Hajj Transport",
            areaServed: ["Makkah", "Madinah", "Mina", "Arafat"],
          }),
          speakableSchema({ path: "/services/hajj-transport" }),
        ]}
      />
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Services", href: "/services" },
          { name: "Hajj Transport", href: "/services/hajj-transport" },
        ]}
      />
      <section className="relative pt-32 pb-20 overflow-hidden border-b border-[#C9A84C]/10">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/services/hajj-transport-hero.webp"
            alt="Hajj Transport Saudi Arabia"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAF7] via-[#FAFAF7]/50 to-[#FAFAF7]/15" />
        </div>

        <div className="section-container relative z-10 max-w-5xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 backdrop-blur-md px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#16A34A] mb-6">
            <Heart className="h-3 w-3" /> Pilgrimage Journey
          </span>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Hajj Transport <br />
            <span className="text-[#16A34A]">Services</span>
          </h1>
          <p className="max-w-2xl mx-auto text-sm md:text-base text-[#6B7280] leading-relaxed mb-8">
            Pre-booked private transport for Hajj pilgrims, subject to season access rules. Avoid the crowds and travel in comfort between Jeddah Airport, Makkah, and Madinah.
          </p>
          <div className="max-w-2xl mx-auto mb-10 text-left">
            <TLDRSummary
              answer="Hajj transport in Saudi Arabia is arranged as pre-booked private transfers between Jeddah Airport, Makkah, Madinah, Mina, and Arafat, available 24/7 and subject to the access rules of the season."
              facts={[
                { label: "Coverage", value: "Jeddah / Makkah / Madinah" },
                { label: "Access", value: "Confirmed per season rules" },
                { label: "Availability", value: "24/7" },
              ]}
            />
          </div>
          <div className="flex justify-center gap-4">
            <Link
              href="/book?service=hajj-transport"
              className="btn btn-primary btn-lg"
            >
              Reserve Hajj Transport
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
          { question: "Are vehicles allowed into the holy sites during Hajj?", answer: "Access to Makkah and the holy sites in Hajj season is controlled by the authorities and limited to vehicles and passengers with the right permits. Tell us your Hajj package and locations first, and we confirm what can be arranged before you book." },
          { question: "Do you cover transfers between Mina, Arafat, and Muzdalifah?", answer: "Yes. We provide transfers across all Hajj locations including Mina, Arafat, and Muzdalifah, subject to seasonal route regulations." },
          { question: "Should I book Hajj transport in advance?", answer: "Strongly recommended. Demand peaks sharply during Hajj, so early booking secures your vehicle and driver." },
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
      <section id="service-quote" className="section-container max-w-3xl py-12 scroll-mt-24">
        <h2 className="font-heading text-2xl font-bold mb-2 text-[#1C1C1C]">Ask about Hajj season transport</h2>
        <p className="text-sm text-[#374151] leading-relaxed mb-6">Send the date, places, passengers and bags. We reply on WhatsApp with one fare to confirm before you book.</p>
        <WhatsAppQuoteForm defaultPickup="Makkah" />
      </section>
      <ServiceRelatedLinks currentPath="/services/hajj-transport" />
    </div>
  );
}
