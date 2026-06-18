import { Metadata } from "next";
import Image from "next/image";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { serviceSchema, faqSchema } from "@/lib/schema";
import { Map, ShieldCheck, Camera, MapPin } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Saudi Heritage Tours & Transport | Taxi Saudi Arabia",
  description: "Private chauffeur tours to Saudi Arabia's top heritage sites including AlUla, Diriyah, and more. Experience the Kingdom's history in comfort.",
};

const FEATURES = [
  { icon: Map, title: "Custom Itineraries", desc: "Design your own tour to historical sites or let our experts recommend the best routes." },
  { icon: Camera, title: "Scenic Stops", desc: "Your chauffeur will happily pause at panoramic viewpoints and cultural landmarks for photos." },
  { icon: ShieldCheck, title: "Comfortable SUVs", desc: "Perfect for long desert drives and reaching remote heritage destinations like Hegra." },
  { icon: MapPin, title: "Kingdom Wide", desc: "Tours available to AlUla, Diriyah, Al Balad (Jeddah), and the Eastern Province." },
];

export default function HeritageToursPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8] pb-24">
      <JsonLd
        data={serviceSchema({
          name: "Saudi Heritage Tours & Transport",
          description:
            "Private chauffeur heritage tours across Saudi Arabia including AlUla, Hegra, Diriyah, and Al Balad with knowledgeable drivers and flexible itineraries.",
          path: "/services/heritage-tours",
          serviceType: "Heritage Tour Transport",
          areaServed: ["AlUla", "Diriyah", "Jeddah", "Taif"],
        })}
      />
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Services", href: "/services" },
          { name: "Heritage Tours", href: "/services/heritage-tours" },
        ]}
      />
      <section className="relative pt-32 pb-20 overflow-hidden border-b border-[#C9A84C]/10">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1920&q=80" 
            alt="Heritage Tours Saudi Arabia" 
            fill 
            className="object-cover opacity-30" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/80 to-[#0A0A0A]/40" />
        </div>

        <div className="section-container relative z-10 max-w-5xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 backdrop-blur-md px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#C9A84C] mb-6">
            <Map className="h-3 w-3" /> Discover Arabia
          </span>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Heritage & Cultural <br />
            <span className="text-[#C9A84C]">Tours</span>
          </h1>
          <p className="max-w-2xl mx-auto text-sm md:text-base text-[#A1A1A6] leading-relaxed mb-10">
            Journey through time with our private transport services to Saudi Arabia's incredible UNESCO World Heritage sites and historical landmarks.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/book?service=heritage-tours"
              className="inline-flex items-center gap-2 rounded-full bg-[#C9A84C] px-8 py-3.5 text-xs font-bold uppercase text-[#0A0A0A] hover:bg-[#B8963B] transition-all"
            >
              Book a Tour Transfer
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
          { question: "Which heritage sites can you take me to?", answer: "Popular destinations include AlUla and Hegra, Diriyah (At-Turaif), historic Al Balad in Jeddah, and Eastern Province sites. Custom itineraries are welcome." },
          { question: "Is a guide included with the tour?", answer: "Our drivers know the routes and key sites well. For licensed on-site guides, we can arrange them on request for an additional fee." },
          { question: "What vehicle is best for heritage tours?", answer: "An SUV is recommended for long desert drives and for reaching remote sites comfortably." },
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
    </main>
  );
}
