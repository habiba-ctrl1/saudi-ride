import { Metadata } from "next";
import Image from "next/image";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { ServiceRelatedLinks } from "@/components/seo/ServiceRelatedLinks";
import { serviceSchema, faqSchema } from "@/lib/schema";
import { Compass, ShieldCheck, MapPin, Map } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Madinah Ziyarat Packages & Taxi Tours | Taxi Saudi Arabia",
  description: "Guided Ziyarat tours in Madinah. Visit Quba Mosque, Mount Uhud, and historical Islamic sites with our knowledgeable local drivers.",
};

const FEATURES = [
  { icon: Map, title: "Comprehensive Routes", desc: "Our standard Ziyarat covers Quba Mosque, Qiblatain Mosque, Khandaq, and Mount Uhud." },
  { icon: Compass, title: "Local Knowledge", desc: "Drivers familiar with the history and significance of the holy sites in Madinah." },
  { icon: ShieldCheck, title: "Flexible Duration", desc: "Book a half-day or full-day tour. Take your time to pray and explore without rushing." },
  { icon: MapPin, title: "Hotel Pickup", desc: "Convenient pickup and drop-off right from your hotel in the Central Area (Markazia)." },
];

export default function MadinahZiyaratPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8] pb-24">
      <JsonLd
        data={serviceSchema({
          name: "Madinah Ziyarat Taxi Tours",
          description:
            "Guided Madinah Ziyarat taxi tours visiting Quba Mosque, Qiblatain Mosque, Mount Uhud, and historical Islamic sites with knowledgeable local drivers.",
          path: "/services/madinah-ziyarat",
          serviceType: "Ziyarat Tour",
          areaServed: ["Madinah"],
        })}
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
            src="https://images.unsplash.com/photo-1564769662533-4f00a87b4056?auto=format&fit=crop&w=1920&q=80" 
            alt="Madinah Ziyarat Tours" 
            fill 
            className="object-cover opacity-30" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/80 to-[#0A0A0A]/40" />
        </div>

        <div className="section-container relative z-10 max-w-5xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 backdrop-blur-md px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#C9A84C] mb-6">
            <Compass className="h-3 w-3" /> Spiritual Journey
          </span>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Madinah Ziyarat <br />
            <span className="text-[#C9A84C]">Taxi Tours</span>
          </h1>
          <p className="max-w-2xl mx-auto text-sm md:text-base text-[#A1A1A6] leading-relaxed mb-10">
            Explore the blessed city of Madinah. Visit the historical mosques and battle sites with our comfortable, private guided transport.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/book?service=madinah-ziyarat"
              className="inline-flex items-center gap-2 rounded-full bg-[#C9A84C] px-8 py-3.5 text-xs font-bold uppercase text-[#0A0A0A] hover:bg-[#B8963B] transition-all"
            >
              Book Ziyarat Tour
            </Link>
          </div>
        </div>
      </section>

      <section className="section-container max-w-7xl py-20 border-b border-[#C9A84C]/10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {FEATURES.map((feat, i) => (
            <div key={i} className="bg-[#111] border border-[#C9A84C]/15 rounded-3xl p-8 hover:border-[#C9A84C]/40 transition-colors">
              <feat.icon className="h-8 w-8 text-[#C9A84C] mb-6" />
              <h3 className="font-heading text-lg font-bold mb-3">{feat.title}</h3>
              <p className="text-sm text-[#A1A1A6] leading-relaxed">{feat.desc}</p>
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
                  <div key={i} className="bg-[#111] border border-[#C9A84C]/15 rounded-2xl p-6">
                    <h3 className="font-bold text-[#F5F0E8] mb-2">{f.question}</h3>
                    <p className="text-sm text-[#A1A1A6] leading-relaxed">{f.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          </>
        );
      })()}
      <ServiceRelatedLinks currentPath="/services/madinah-ziyarat" />
    </main>
  );
}
