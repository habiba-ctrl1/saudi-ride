import { Metadata } from "next";
import Image from "next/image";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { ServiceRelatedLinks } from "@/components/seo/ServiceRelatedLinks";
import { serviceSchema, faqSchema } from "@/lib/schema";
import { Heart, Compass, ShieldCheck, Clock, Check } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  alternates: { canonical: "https://taxisaudiarabia.com/services/hajj-transport" },
  title: "Hajj Transport Services | Jeddah, Makkah & Madinah Transfers",
  description: "Dedicated Hajj transport services in Saudi Arabia. Reliable transfers during the peak pilgrimage season between Jeddah, Makkah, and Madinah.",
};

const FEATURES = [
  { icon: Compass, title: "Hajj Permits", desc: "All our vehicles and drivers hold the necessary permits to operate within Makkah during Hajj." },
  { icon: Clock, title: "24/7 Availability", desc: "Round-the-clock transfers to accommodate your flight arrivals and departure times." },
  { icon: ShieldCheck, title: "Safe & Reliable", desc: "Maintained vehicles with experienced drivers who know alternative routes during heavy traffic." },
  { icon: Heart, title: "Pilgrim Focused", desc: "We provide dedicated support, wheelchair accessible options, and understand the needs of Hujjaj." },
];

export default function HajjTransportPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#1C1C1C] pb-24">
      <JsonLd
        data={serviceSchema({
          name: "Hajj Transport Service",
          description:
            "Dedicated Hajj transport service in Saudi Arabia with permitted vehicles and experienced drivers for transfers between Jeddah, Makkah, Madinah, Mina, and Arafat.",
          path: "/services/hajj-transport",
          serviceType: "Hajj Transport",
          areaServed: ["Makkah", "Madinah", "Mina", "Arafat"],
        })}
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
            className="object-cover opacity-30" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAF7] via-[#FAFAF7]/80 to-[#FAFAF7]/40" />
        </div>

        <div className="section-container relative z-10 max-w-5xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 backdrop-blur-md px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#B8963B] mb-6">
            <Heart className="h-3 w-3" /> Pilgrimage Journey
          </span>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Hajj Transport <br />
            <span className="text-[#16A34A]">Services</span>
          </h1>
          <p className="max-w-2xl mx-auto text-sm md:text-base text-[#6B7280] leading-relaxed mb-10">
            Secure, reliable, and permitted transport for Hajj pilgrims. Avoid the crowds and travel in comfort between Jeddah Airport, Makkah, and Madinah.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/book?service=hajj-transport"
              className="inline-flex items-center gap-2 rounded-full bg-[#16A34A] px-8 py-3.5 text-xs font-bold uppercase text-white hover:bg-[#15803D] transition-all"
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
          { question: "Are your vehicles permitted to operate during Hajj?", answer: "Yes. Our Hajj vehicles and drivers hold the required permits to operate within Makkah and the holy sites during the Hajj season." },
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
      <ServiceRelatedLinks currentPath="/services/hajj-transport" />
    </div>
  );
}
