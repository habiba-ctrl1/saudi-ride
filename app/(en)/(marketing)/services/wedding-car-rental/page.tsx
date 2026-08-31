import { Metadata } from "next";
import Image from "next/image";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { ServiceRelatedLinks } from "@/components/seo/ServiceRelatedLinks";
import { serviceSchema, faqSchema, speakableSchema } from "@/lib/schema";
import { TLDRSummary } from "@/components/seo/TLDRSummary";
import { VIPPlanForm } from "@/components/services/VIPPlanForm";
import { Heart, Sparkles, Car, ShieldCheck, Crown, Check } from "lucide-react";
import Link from "next/link";

const TITLE = "Wedding Car Rental Saudi Arabia | Luxury Bridal Cars & Chauffeur";
const DESCRIPTION = "Luxury wedding car rental in Saudi Arabia — Mercedes-Maybach, S-Class, Range Rover, and Rolls-Royce-style bridal cars with a professional chauffeur. Decorated cars, matched fleets, and VIP guest transport. Quote on WhatsApp.";
const OG_IMAGE = "https://taxisaudiarabia.com/fleet/mercedes-maybach.webp";

export const metadata: Metadata = {
  alternates: { canonical: "https://taxisaudiarabia.com/services/wedding-car-rental" },
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    url: "https://taxisaudiarabia.com/services/wedding-car-rental",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Luxury wedding car rental in Saudi Arabia" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
};

const FEATURES = [
  { icon: Crown, title: "Flagship & Value Options", desc: "Riyadh's ultimate bridal cars are the Mercedes-Maybach and Range Rover Autobiography. The Mercedes S-Class and Lexus LX 600 can be arranged on other routes too, depending on the city and date." },
  { icon: Car, title: "Smart-Value Fleet", desc: "For an elegant entrance without the top tier, choose the GMC Yukon, Hyundai Staria, or a latest 2025/26 Toyota Camry or Ford sedan — clean, modern, and great value." },
  { icon: Sparkles, title: "Decoration on Request", desc: "Ribbon, floral, and elegant car décor arranged for the bridal car so it looks perfect for photos and the arrival." },
  { icon: ShieldCheck, title: "Professional Chauffeur", desc: "Discreet, formally dressed chauffeurs who understand timing, privacy, and the flow of a wedding day — plus a matched guest fleet of V-Class and Sprinter vans." },
];

const OCCASIONS = [
  "Bridal car for the wedding entrance",
  "Groom and family arrival",
  "Nikah and reception venue transfers",
  "Guest and VIP shuttle between hotel and hall",
  "Engagement and milad celebrations",
  "Anniversary and private family events",
];

export default function WeddingCarRentalPage() {
  const faqs = [
    { question: "Which cars can I rent for a wedding in Saudi Arabia?", answer: "In Riyadh our top bridal cars are the Mercedes-Maybach and Range Rover Autobiography. The Mercedes S-Class and Lexus LX 600 can also be arranged for weddings — availability depends on your route, city, and date. For a smart-value entrance we offer the GMC Yukon, Hyundai Staria, and the latest 2025/26 Toyota Camry and Ford sedans. For the wider party we add Mercedes V-Class and Sprinter vans." },
    { question: "Do you have a Maybach or premium luxury car for the bride?", answer: "Yes — our top-tier bridal car is the Mercedes-Maybach, arranged for weddings within Riyadh with a first-class rear cabin ideal for the bridal entrance. The Mercedes S-Class and Lexus LX 600 are also available on many routes depending on the city and date — message us with your details and we confirm what we can arrange." },
    { question: "Do you decorate the wedding car?", answer: "Yes. On request we arrange elegant ribbon and floral décor for the bridal car so it looks perfect for the entrance and photos. Tell us your colours and theme when you message us." },
    { question: "How much does wedding car rental cost?", answer: "Wedding car packages depend on the car, number of hours, and how many vehicles you need — from great-value 2025/26 sedans and the GMC Yukon up to the Maybach flagship. Send us your date, city, and details on WhatsApp and we confirm a clear all-in price before you book." },
    { question: "Which cities do you cover for weddings?", answer: "We arrange wedding cars across Riyadh, Jeddah, Makkah, Madinah, Dammam, and Khobar, with chauffeurs who know the main wedding halls and hotels in each city. The Maybach and Range Rover flagships are offered for Riyadh weddings, while the S-Class and Lexus can be arranged elsewhere depending on the route." },
    { question: "Can you provide multiple cars for the whole wedding party?", answer: "Yes. A dedicated coordinator arranges the bridal car plus a matched fleet of SUVs and vans for family and VIP guests, synchronised so arrivals and departures run on time." },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#1C1C1C] pb-24">
      <JsonLd
        data={[
          serviceSchema({
            name: "Wedding Car Rental",
            description:
              "Luxury wedding car rental in Saudi Arabia with Mercedes-Maybach, S-Class, Range Rover, and Lexus bridal cars, decoration on request, matched guest fleets, and professional chauffeurs.",
            path: "/services/wedding-car-rental",
            serviceType: "Wedding Car Rental",
            areaServed: ["Riyadh", "Jeddah", "Makkah", "Madinah", "Dammam", "Al Khobar"],
          }),
          speakableSchema({ path: "/services/wedding-car-rental" }),
          faqSchema(faqs),
        ]}
      />
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Services", href: "/services" },
          { name: "Wedding Car Rental", href: "/services/wedding-car-rental" },
        ]}
      />
      <section className="relative pt-32 pb-20 overflow-hidden border-b border-[#C9A84C]/10">
        <div className="absolute inset-0 z-0">
          <Image
            src="/fleet/mercedes-maybach.webp"
            alt="Luxury wedding car rental Saudi Arabia"
            fill
            className="object-cover opacity-80"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAF7] via-[#FAFAF7]/50 to-[#FAFAF7]/15" />
        </div>

        <div className="section-container relative z-10 max-w-5xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 backdrop-blur-md px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#16A34A] mb-6">
            <Heart className="h-3 w-3" /> Wedding &amp; Celebrations
          </span>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Wedding Car Rental <br />
            <span className="text-[#16A34A]">in Saudi Arabia</span>
          </h1>
          <p className="max-w-2xl mx-auto text-sm md:text-base text-[#6B7280] leading-relaxed mb-8">
            Make the arrival unforgettable. Luxury bridal cars, decoration on request, a matched fleet for your guests, and a discreet professional chauffeur — arranged across every major Saudi city.
          </p>
          <div className="max-w-2xl mx-auto mb-10 text-left">
            <TLDRSummary
              answer="Taxi Saudi Arabia arranges luxury wedding cars — Mercedes-Maybach, S-Class, Range Rover, and Lexus LX 600 — with decoration on request, a matched guest fleet, and a professional chauffeur across Riyadh, Jeddah, Makkah, Madinah, and Dammam. Your package price is confirmed on WhatsApp."
              facts={[
                { label: "Bridal cars", value: "Maybach / S-Class / Range Rover" },
                { label: "Decoration", value: "On request" },
                { label: "Coverage", value: "Riyadh / Jeddah / Dammam +" },
                { label: "Pricing", value: "Quoted on WhatsApp" },
              ]}
            />
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="#plan"
              className="inline-flex items-center gap-2 rounded-full bg-[#16A34A] px-8 py-3.5 text-xs font-bold uppercase text-white hover:bg-[#15803D] transition-all"
            >
              Plan My Wedding Car
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

      <section className="section-container max-w-4xl py-20 border-b border-[#C9A84C]/10">
        <h2 className="font-heading text-3xl font-bold mb-8 text-center">What We Cover for Your Big Day</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {OCCASIONS.map((o, i) => (
            <div key={i} className="flex items-start gap-3 bg-white border border-[#16A34A]/12 rounded-2xl p-5">
              <Check className="h-5 w-5 text-[#16A34A] shrink-0 mt-0.5" />
              <span className="text-sm text-[#1C1C1C]">{o}</span>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-[#6B7280] leading-relaxed">
          Planning a Riyadh wedding? Our{" "}
          <Link href="/services/vip-transportation" className="text-[#16A34A] font-semibold underline">
            VIP transportation in Riyadh
          </Link>{" "}
          covers the Maybach, Range Rover, and Lexus flagships. Browse the full{" "}
          <Link href="/fleet" className="text-[#16A34A] font-semibold underline">
            luxury fleet
          </Link>{" "}
          or see our{" "}
          <Link href="/locations/riyadh" className="text-[#16A34A] font-semibold underline">
            Riyadh taxi &amp; chauffeur service
          </Link>{" "}
          for city coverage.
        </p>
      </section>

      <section id="plan" className="section-container max-w-4xl py-20 border-b border-[#C9A84C]/10">
        <div className="text-center mb-10">
          <h2 className="font-heading text-3xl font-bold mb-3">Plan Your Wedding Car</h2>
          <p className="text-sm text-[#6B7280] max-w-xl mx-auto">
            Tell us your date, city, and the cars you have in mind. We reply on WhatsApp with a clear package price — bridal car, decoration, and guest fleet included.
          </p>
        </div>
        <VIPPlanForm />
      </section>

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

      <ServiceRelatedLinks currentPath="/services/wedding-car-rental" />
    </div>
  );
}
