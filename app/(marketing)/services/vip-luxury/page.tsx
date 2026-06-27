import { Metadata } from "next";
import Image from "next/image";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { ServiceRelatedLinks } from "@/components/seo/ServiceRelatedLinks";
import { serviceSchema, faqSchema } from "@/lib/schema";
import { Star, ShieldCheck, Clock, Crown } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "VIP & Luxury Chauffeur Service | Taxi Saudi Arabia",
  description: "VIP luxury chauffeur service in Saudi Arabia with a premium fleet — Mercedes S-Class, BMW 7-Series & Cadillac Escalade. Discreet, professional drivers, 24/7.",
};

const FEATURES = [
  { icon: Crown, title: "Premium Fleet", desc: "Travel in the utmost comfort with our latest model luxury sedans and premium SUVs." },
  { icon: Star, title: "Executive Chauffeurs", desc: "Highly trained, bilingual, and discreet chauffeurs dedicated to your comfort and privacy." },
  { icon: Clock, title: "On-Demand Availability", desc: "Flexible booking options including hourly charter and full-day standby service." },
  { icon: ShieldCheck, title: "Enhanced Security", desc: "Advanced vehicle tracking and priority routing for high-profile clients." },
];

export default function VIPLuxuryPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8] pb-24">
      <JsonLd
        data={serviceSchema({
          name: "VIP & Luxury Chauffeur Service",
          description:
            "VIP and luxury chauffeur service in Saudi Arabia with a premium fleet including Mercedes S-Class, BMW 7-Series, and Cadillac Escalade and discreet executive chauffeurs.",
          path: "/services/vip-luxury",
          serviceType: "Luxury Chauffeur",
          areaServed: ["Riyadh", "Jeddah", "Makkah", "Madinah"],
        })}
      />
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Services", href: "/services" },
          { name: "VIP & Luxury", href: "/services/vip-luxury" },
        ]}
      />
      <section className="relative pt-32 pb-20 overflow-hidden border-b border-[#C9A84C]/10">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1920&q=80" 
            alt="VIP Luxury Transport Saudi Arabia" 
            fill 
            className="object-cover opacity-30" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/80 to-[#0A0A0A]/40" />
        </div>

        <div className="section-container relative z-10 max-w-5xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 backdrop-blur-md px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#C9A84C] mb-6">
            <Crown className="h-3 w-3" /> Absolute Elegance
          </span>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            VIP & Luxury <br />
            <span className="text-[#C9A84C]">Chauffeur Service</span>
          </h1>
          <p className="max-w-2xl mx-auto text-sm md:text-base text-[#A1A1A6] leading-relaxed mb-10">
            For those who demand the very best. Our VIP transport service offers unparalleled comfort, privacy, and prestige across the Kingdom.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/book?service=vip-luxury"
              className="inline-flex items-center gap-2 rounded-full bg-[#C9A84C] px-8 py-3.5 text-xs font-bold uppercase text-[#0A0A0A] hover:bg-[#B8963B] transition-all"
            >
              Reserve Luxury Transport
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
          { question: "Which luxury vehicles are available?", answer: "Our VIP fleet includes the Mercedes S-Class, BMW 7-Series, GMC Yukon, and Cadillac Escalade, subject to availability." },
          { question: "Are chauffeurs trained for VIP clients?", answer: "Yes. Our executive chauffeurs are bilingual, professionally attired, and trained in discretion and privacy." },
          { question: "Can I book luxury transport for a full day or event?", answer: "Yes. We offer hourly charter, full-day standby, and event transport for weddings, conferences, and VIP visits." },
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
      <ServiceRelatedLinks currentPath="/services/vip-luxury" />
    </main>
  );
}
