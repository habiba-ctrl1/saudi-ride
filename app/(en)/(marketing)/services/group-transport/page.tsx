import { Metadata } from "next";
import Image from "next/image";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { ServiceRelatedLinks } from "@/components/seo/ServiceRelatedLinks";
import { serviceSchema, faqSchema, speakableSchema } from "@/lib/schema";
import { TLDRSummary } from "@/components/seo/TLDRSummary";
import { Users, ShieldCheck, Bus, MapPin, Check } from "lucide-react";
import Link from "next/link";
import WhatsAppQuoteForm from "@/components/booking/WhatsAppQuoteForm";
import { contactConfig } from "@/lib/config/contact";

// Premium VIP vans & coaches available through our vetted partner network
// (owner permission on file). Interiors + exteriors.
const PARTNER_VANS = Array.from({ length: 13 }, (_, i) => `/gallery/partner-vip-van-${i + 1}.webp`);

const TITLE = "Group Transport & Umrah Bus Hire | Taxi Saudi Arabia";
const DESCRIPTION = "Spacious group transport in Saudi Arabia. Rent 7-seater Vans, Coaster buses, and luxury coaches for large families and Umrah groups.";
const OG_IMAGE = "https://taxisaudiarabia.com/services/group-transport-hero.webp";

export const metadata: Metadata = {
  alternates: { canonical: "https://taxisaudiarabia.com/services/group-transport" },
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    url: "https://taxisaudiarabia.com/services/group-transport",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Group transport and bus hire in Saudi Arabia" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
};

const FEATURES = [
  { icon: Bus, title: "Spacious Fleet", desc: "From 7-seater Hyundai Starias to 50-seater luxury buses, we have the right vehicle for your group." },
  { icon: ShieldCheck, title: "Professional Drivers", desc: "Professional, vetted drivers experienced in handling large groups and long-distance travel." },
  { icon: MapPin, title: "Door-to-Door", desc: "Seamless point-to-point transfers from the airport directly to your hotel lobbies." },
  { icon: Users, title: "Dedicated Coordinator", desc: "Large group bookings get a dedicated logistics coordinator to manage arrivals and departures." },
];

export default function GroupTransportPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#1C1C1C] pb-24">
      <JsonLd
        data={[
          serviceSchema({
            name: "Group Transport & Bus Hire",
            description:
              "Group transport and bus hire in Saudi Arabia for Umrah groups, large families, and corporate teams with 7-seater vans, Coaster buses, and luxury coaches.",
            path: "/services/group-transport",
            serviceType: "Group Transport",
            areaServed: ["Makkah", "Madinah", "Jeddah", "Riyadh"],
          }),
          speakableSchema({ path: "/services/group-transport" }),
        ]}
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
            src="/services/group-transport-hero.webp" 
            alt="Group Transport Saudi Arabia" 
            fill 
            className="object-cover opacity-80" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAF7] via-[#FAFAF7]/50 to-[#FAFAF7]/15" />
        </div>

        <div className="section-container relative z-10 max-w-5xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 backdrop-blur-md px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#16A34A] mb-6">
            <Users className="h-3 w-3" /> Group Logistics
          </span>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Group Transport <br />
            <span className="text-[#16A34A]">& Bus Hire</span>
          </h1>
          <p className="max-w-2xl mx-auto text-sm md:text-base text-[#6B7280] leading-relaxed mb-8">
            Comfortable, spacious, and reliable transport for large families, Umrah groups, and corporate events across Saudi Arabia.
          </p>
          <div className="max-w-2xl mx-auto mb-10 text-left">
            <TLDRSummary
              answer="Group transport in Saudi Arabia ranges from 7-seater vans to 50-seater luxury coaches for Umrah groups, families, and corporate teams, with a dedicated coordinator for large bookings."
              facts={[
                { label: "Fleet range", value: "7 to 50 seats" },
                { label: "Coverage", value: "Makkah / Madinah / Jeddah / Riyadh" },
                { label: "Large groups", value: "Dedicated coordinator" },
              ]}
            />
          </div>
          <div className="flex justify-center gap-4">
            <Link
              href="/book"
              className="inline-flex items-center gap-2 rounded-full bg-[#16A34A] px-8 py-3.5 text-xs font-bold uppercase text-white hover:bg-[#15803D] transition-all"
            >
              Book Group Transport
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

      {/* Partner-network fleet gallery (owner permission on file) */}
      <section className="section-container max-w-7xl py-20 border-b border-[#C9A84C]/10">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/30 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-[#16A34A]">
            <Bus className="h-3.5 w-3.5" /> Partner Network Fleet
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold mt-3 mb-3">Executive vans &amp; coaches for groups</h2>
          <p className="text-sm text-[#6B7280] max-w-2xl mx-auto leading-relaxed">
            Through our vetted partner network we arrange premium executive VIP vans and coaches — quilted-leather cabins that keep a family, delegation or event group together in comfort. Below is a look at the standard of vehicle we coordinate.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {PARTNER_VANS.map((src, i) => (
            <div key={src} className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-[#16A34A]/12 bg-[#FAFAF7]">
              <Image
                src={src}
                alt={`Executive VIP van available through our partner network — view ${i + 1}`}
                fill
                loading="lazy"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </div>
        <p className="text-center text-[0.7rem] text-[#6B7280] mt-4">Vehicles shown are examples from our partner network; the exact model is confirmed with your quote.</p>
      </section>

      {/* On-page lead form + Path B */}
      <section className="section-container max-w-5xl py-16 border-b border-[#C9A84C]/10">
        <div className="bg-[#F0FDF4] border border-[#16A34A]/20 rounded-3xl p-6 sm:p-8">
          <div className="text-center mb-6">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-[#1C1C1C] mb-3">Get your group transport quote</h2>
            <p className="text-sm text-[#6B7280] max-w-xl mx-auto leading-relaxed">Fill a few details for a fast WhatsApp quote — vans, coasters and coaches for families, Umrah groups, delegations and events. Agencies and companies can request a written quote.</p>
          </div>
          <WhatsAppQuoteForm defaultVehicle="Van" />
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              href={`https://wa.me/${contactConfig.whatsappNumber}?text=${encodeURIComponent("Salam! Group transport enquiry.\n• From / to: \n• Date & time: \n• Group size: \n• Luggage: \n• Vehicle (Van / Coaster / Coach): \n• Umrah group / event / family?: ")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#16A34A] px-7 py-3.5 text-xs font-bold uppercase text-white hover:bg-[#15803D] transition-all"
            >
              Group quote on WhatsApp
            </a>
            <a
              href={`mailto:${contactConfig.email}?subject=${encodeURIComponent("Group / delegation transport RFQ")}&body=${encodeURIComponent("Hello Taxi Saudi Arabia team,\n\nWe'd like a written quote for group transport.\n\n• Agency / company / group name: \n• Contact name: \n• Route(s): \n• Dates: \n• Group size (per vehicle): \n• Luggage: \n• Vehicle(s) needed (Van / Coaster / Coach): \n• Corporate invoicing (VAT / PO)?: \n\nPlease confirm a fixed fare before booking.\n\nThank you.")}`}
              className="inline-flex items-center gap-2 rounded-full border border-[#16A34A]/30 bg-white px-7 py-3.5 text-xs font-bold uppercase text-[#16A34A] hover:bg-[#16A34A]/10 transition-all"
            >
              Email a group / delegation RFQ
            </a>
          </div>
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
      <ServiceRelatedLinks currentPath="/services/group-transport" />
    </div>
  );
}
