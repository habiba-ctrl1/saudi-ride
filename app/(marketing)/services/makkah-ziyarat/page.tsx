import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Landmark, MapPin, Clock, ShieldCheck, CheckCircle2, MessageCircle } from "lucide-react";
import { contactConfig } from "@/lib/config/contact";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { ServiceRelatedLinks } from "@/components/seo/ServiceRelatedLinks";
import { serviceSchema, faqSchema } from "@/lib/schema";

export const metadata: Metadata = {
  alternates: { canonical: "https://taxisaudiarabia.com/services/makkah-ziyarat" },
  title: "Makkah Ziyarat Taxi Tours | Jabal Al-Noor, Mina & Arafat",
  description:
    "Book a Makkah Ziyarat taxi tour — visit Jabal Al-Noor, Jabal Thawr, Mina, Arafat & Muzdalifah with knowledgeable drivers. Flexible half-day & full-day tours.",
};

const SITES = [
  { name: "Jabal Al-Noor (Cave of Hira)", desc: "The mountain where the first revelation came to the Prophet ﷺ.", dist: "5 km" },
  { name: "Jabal Thawr (Cave of Thawr)", desc: "The cave where the Prophet ﷺ took shelter during the migration.", dist: "8 km" },
  { name: "Mina", desc: "The tent valley used during the days of Hajj.", dist: "8 km" },
  { name: "Arafat & Jabal Al-Rahmah", desc: "The plain and Mount of Mercy, the core standing place of Hajj.", dist: "20 km" },
  { name: "Muzdalifah", desc: "The open area where pilgrims gather between Arafat and Mina.", dist: "12 km" },
  { name: "Jannat Al-Mualla", desc: "The historic cemetery of Makkah near the Holy Mosque.", dist: "2 km" },
];

const FEATURES = [
  { icon: MapPin, title: "Complete Site Coverage", desc: "A standard Makkah Ziyarat covers Jabal Al-Noor, Jabal Thawr, Mina, Arafat, and Muzdalifah in one trip." },
  { icon: Landmark, title: "Knowledgeable Drivers", desc: "Drivers familiar with the history and significance of each site, and the best times to visit." },
  { icon: Clock, title: "Flexible Duration", desc: "Book a half-day or full-day tour. Take your time at each stop without rushing." },
  { icon: ShieldCheck, title: "Hotel Pickup", desc: "Convenient pickup and drop-off directly from your Makkah hotel in Aziziyah, Ajyad, or the Haram area." },
];

const FAQS = [
  { question: "Which sites does the Makkah Ziyarat tour cover?", answer: "A standard Makkah Ziyarat covers Jabal Al-Noor (Cave of Hira), Jabal Thawr, Mina, Arafat with Jabal Al-Rahmah, Muzdalifah, and Jannat Al-Mualla." },
  { question: "How long does a Makkah Ziyarat tour take?", answer: "A typical tour takes 3 to 4 hours. You can book a half-day or full-day tour depending on how long you wish to spend at each site." },
  { question: "Can you also take us to the Meeqat for Ihram?", answer: "Yes. If you need to assume Ihram, we can include a stop at Masjid Aisha (Tan'eem) or the nearest Meeqat during your tour." },
  { question: "Do you pick up from my Makkah hotel?", answer: "Yes. We offer pickup and drop-off directly from your hotel in Aziziyah, Ajyad, the Haram area, and other Makkah districts." },
];

export default function MakkahZiyaratPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#1C1C1C] pb-24">
      <JsonLd
        data={[
          serviceSchema({
            name: "Makkah Ziyarat Taxi Tours",
            description:
              "Guided Makkah Ziyarat taxi tours visiting Jabal Al-Noor, Jabal Thawr, Mina, Arafat, Muzdalifah, and Jannat Al-Mualla with knowledgeable local drivers.",
            path: "/services/makkah-ziyarat",
            serviceType: "Ziyarat Tour",
            areaServed: ["Makkah"],
          }),
          faqSchema(FAQS),
        ]}
      />
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Services", href: "/services" },
          { name: "Makkah Ziyarat", href: "/services/makkah-ziyarat" },
        ]}
      />

      {/* ─── HERO ─────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 overflow-hidden border-b border-[#C9A84C]/10">
        <div className="absolute inset-0 z-0">
          <Image
            src="/services/makkah-ziyarat-hero.webp"
            alt="Makkah Ziyarat historical sites"
            fill
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAF7] via-[#FAFAF7]/80 to-[#FAFAF7]/40" />
        </div>
        <div className="section-container relative z-10 max-w-5xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 backdrop-blur-md px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#B8963B] mb-6">
            <Landmark className="h-3 w-3" /> Historical Sites of Makkah
          </span>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Makkah Ziyarat <span className="text-[#16A34A]">Taxi Tours</span>
          </h1>
          <p className="max-w-2xl mx-auto text-sm md:text-base text-[#6B7280] leading-relaxed mb-10">
            Visit the blessed historical sites of Makkah — Jabal Al-Noor, Jabal Thawr, Mina, Arafat, and Muzdalifah — with a comfortable vehicle and a driver who knows every route.
          </p>
          <Link
            href="/book"
            className="inline-flex items-center gap-2 rounded-full bg-[#16A34A] px-8 py-3.5 text-xs font-bold uppercase text-white hover:bg-[#15803D] transition-all"
          >
            Book Ziyarat Tour
          </Link>
        </div>
      </section>

      {/* ─── SITES ────────────────────────────────────────────────── */}
      <section className="section-container max-w-6xl py-20 border-b border-[#C9A84C]/10">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Sites Covered in Makkah Ziyarat</h2>
          <p className="text-[#6B7280]">Distances are approximate from Al-Masjid Al-Haram.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SITES.map((site, i) => (
            <div key={i} className="bg-white border border-[#16A34A]/12 rounded-3xl p-6 hover:border-[#16A34A]/35 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-heading text-lg font-bold text-[#1C1C1C]">{site.name}</h3>
                <span className="text-[0.6rem] uppercase tracking-wider text-[#B8963B] bg-[#C9A84C]/10 px-2 py-1 rounded-md shrink-0">{site.dist}</span>
              </div>
              <p className="text-sm text-[#6B7280] leading-relaxed">{site.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FEATURES ─────────────────────────────────────────────── */}
      <section className="section-container max-w-6xl py-20">
        <div className="grid md:grid-cols-2 gap-6">
          {FEATURES.map((f, i) => (
            <div key={i} className="flex gap-4 bg-white border border-[#16A34A]/12 rounded-2xl p-6">
              <div className="bg-[#C9A84C]/10 p-3 rounded-xl h-fit">
                <f.icon className="h-6 w-6 text-[#C9A84C]" />
              </div>
              <div>
                <h3 className="font-bold text-[#1C1C1C] mb-1">{f.title}</h3>
                <p className="text-sm text-[#6B7280] leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FAQ ──────────────────────────────────────────────────── */}
      <section className="section-container max-w-4xl py-20 border-t border-[#C9A84C]/10">
        <h2 className="font-heading text-3xl font-bold mb-12 text-center">Makkah Ziyarat FAQ</h2>
        <div className="space-y-4">
          {FAQS.map((f, i) => (
            <div key={i} className="bg-white border border-[#16A34A]/12 rounded-2xl p-6">
              <h3 className="font-bold text-[#1C1C1C] mb-2 flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-[#C9A84C] shrink-0 mt-0.5" />
                {f.question}
              </h3>
              <p className="text-sm text-[#6B7280] leading-relaxed pl-8">{f.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────────── */}
      <section className="section-container max-w-5xl pb-4">
        <div className="bg-gradient-to-br from-[#1A1A1A] to-[#FAFAF7] border border-[#C9A84C]/30 rounded-3xl p-12 text-center">
          <h2 className="font-heading text-2xl font-bold mb-4 text-[#1C1C1C]">Plan your Makkah Ziyarat</h2>
          <p className="text-[#6B7280] mb-8 max-w-lg mx-auto">
            Message us on WhatsApp to arrange a half-day or full-day Ziyarat tour around your prayer times.
          </p>
          <a
            href={`https://wa.me/${contactConfig.whatsappNumber}?text=Salam, I would like to book a Makkah Ziyarat tour.`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-[#C9A84C] px-8 py-4 text-xs font-bold uppercase text-[#C9A84C] hover:bg-[#C9A84C]/10 transition-all"
          >
            <MessageCircle className="h-4 w-4" /> Message on WhatsApp
          </a>
        </div>
      </section>
      <ServiceRelatedLinks currentPath="/services/makkah-ziyarat" />
    </div>
  );
}
