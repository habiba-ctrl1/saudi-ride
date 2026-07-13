import { Metadata } from "next";
import Image from "next/image";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { ServiceRelatedLinks } from "@/components/seo/ServiceRelatedLinks";
import { serviceSchema, faqSchema } from "@/lib/schema";
import { Users, ShieldCheck, Bus, MapPin, Check } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  alternates: { canonical: "https://taxisaudiarabia.com/services/group-transport" },
  title: "Group Transport & Umrah Bus Hire | Taxi Saudi Arabia",
  description: "Spacious group transport in Saudi Arabia. Rent 7-seater Vans, Coaster buses, and luxury coaches for large families and Umrah groups.",
};

const FEATURES = [
  { icon: Bus, title: "Spacious Fleet", desc: "From 7-seater Hyundai Starias to 50-seater luxury buses, we have the right vehicle for your group." },
  { icon: ShieldCheck, title: "Licensed Drivers", desc: "Professional, vetted drivers experienced in handling large groups and long-distance travel." },
  { icon: MapPin, title: "Door-to-Door", desc: "Seamless point-to-point transfers from the airport directly to your hotel lobbies." },
  { icon: Users, title: "Dedicated Coordinator", desc: "Large group bookings get a dedicated logistics coordinator to manage arrivals and departures." },
];

export default function GroupTransportPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8] pb-24">
      <JsonLd
        data={serviceSchema({
          name: "Group Transport & Bus Hire",
          description:
            "Group transport and bus hire in Saudi Arabia for Umrah groups, large families, and corporate teams with 7-seater vans, Coaster buses, and luxury coaches.",
          path: "/services/group-transport",
          serviceType: "Group Transport",
          areaServed: ["Makkah", "Madinah", "Jeddah", "Riyadh"],
        })}
      />
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Services", href: "/services" },
          { name: "Group Transport", href: "/services/group-transport" },
        ]}
      />
      <section className="relative pt-32 pb-20 overflow-hidden border-b border-[#C9A84C]/10">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1920&q=80" 
            alt="Group Transport Saudi Arabia" 
            fill 
            className="object-cover opacity-30" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/80 to-[#0A0A0A]/40" />
        </div>

        <div className="section-container relative z-10 max-w-5xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 backdrop-blur-md px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#C9A84C] mb-6">
            <Users className="h-3 w-3" /> Group Logistics
          </span>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Group Transport <br />
            <span className="text-[#C9A84C]">& Bus Hire</span>
          </h1>
          <p className="max-w-2xl mx-auto text-sm md:text-base text-[#A1A1A6] leading-relaxed mb-10">
            Comfortable, spacious, and reliable transport for large families, Umrah groups, and corporate events across Saudi Arabia.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/book"
              className="inline-flex items-center gap-2 rounded-full bg-[#C9A84C] px-8 py-3.5 text-xs font-bold uppercase text-[#0A0A0A] hover:bg-[#B8963B] transition-all"
            >
              Book Group Transport
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
          { question: "What group sizes can you accommodate?", answer: "From 7-seater vans to 50-seater coaches. We match the vehicle to your group size and luggage volume." },
          { question: "Is group transport available for Umrah groups?", answer: "Yes. We specialize in Umrah group transfers between Jeddah Airport, Makkah, and Madinah with experienced pilgrim drivers." },
          { question: "Can you coordinate multiple vehicles for a large group?", answer: "Yes. Large bookings get a dedicated coordinator who manages convoys and synchronizes arrivals and departures." },
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
      <ServiceRelatedLinks currentPath="/services/group-transport" />
    </main>
  );
}
