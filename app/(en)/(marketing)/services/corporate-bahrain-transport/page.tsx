import { Metadata } from "next";
import Image from "next/image";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { ServiceRelatedLinks } from "@/components/seo/ServiceRelatedLinks";
import { serviceSchema, faqSchema, speakableSchema } from "@/lib/schema";
import { TLDRSummary } from "@/components/seo/TLDRSummary";
import { VIPPlanForm } from "@/components/services/VIPPlanForm";
import { Building2, Repeat, FileText, ShieldCheck, Clock, Check } from "lucide-react";
import Link from "next/link";

const TITLE = "Corporate Bahrain Transport | Saudi to Bahrain Staff & Executive Transfers";
const DESCRIPTION = "Corporate cross-border transport between Saudi Arabia and Bahrain via the King Fahd Causeway. Monthly staff transfers, executive chauffeur, airport pickups, and VAT invoicing for companies. Quote on WhatsApp.";
const OG_IMAGE = "https://taxisaudiarabia.com/services/border-crossings-hero.webp";

export const metadata: Metadata = {
  alternates: { canonical: "https://taxisaudiarabia.com/services/corporate-bahrain-transport" },
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    url: "https://taxisaudiarabia.com/services/corporate-bahrain-transport",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Corporate transport Saudi Arabia to Bahrain" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
};

const FEATURES = [
  { icon: Repeat, title: "Monthly Contracts", desc: "Fixed monthly staff and executive transfers across the King Fahd Causeway — one agreed rate, no daily haggling." },
  { icon: Building2, title: "Executive Chauffeur", desc: "Mercedes S-Class, GMC Yukon, and executive sedans for directors and clients travelling between Khobar, Dammam, and Manama." },
  { icon: FileText, title: "VAT Tax Invoicing", desc: "Proper VAT tax invoices for your finance team, with clear monthly statements for every trip." },
  { icon: ShieldCheck, title: "Causeway Experts", desc: "Drivers who cross the causeway daily and know the checkpoints, paperwork, and fastest lanes to keep staff on time." },
];

const USE_CASES = [
  "Daily and weekly staff shuttles across the causeway",
  "Executive and director airport pickups (BAH ↔ DMM)",
  "Client and delegation transfers for meetings in Manama",
  "Monthly retainer for a dedicated car and driver",
  "Event, conference, and roadshow transport in Bahrain",
  "Ad-hoc urgent cross-border business trips, 24/7",
];

export default function CorporateBahrainTransportPage() {
  const faqs = [
    { question: "Do you offer monthly corporate transport contracts to Bahrain?", answer: "Yes. We arrange fixed monthly contracts for staff shuttles and executive transfers across the King Fahd Causeway between the Eastern Province and Bahrain, at one agreed rate with monthly VAT invoicing." },
    { question: "Can you provide VAT tax invoices for our company?", answer: "Yes. Corporate accounts receive proper VAT tax invoices and clear monthly statements suitable for your finance and reimbursement process." },
    { question: "Which vehicles are used for corporate Bahrain transfers?", answer: "Executive sedans and the Toyota Veloz for staff, and Mercedes S-Class, GMC Yukon, and premium SUVs for directors, clients, and VIP delegations." },
    { question: "How long does the King Fahd Causeway crossing take?", answer: "The causeway crossing typically takes 30 to 60 minutes depending on traffic and immigration. Our drivers cross daily and choose the fastest lanes to keep your team on schedule." },
    { question: "Can you handle airport pickups on both sides?", answer: "Yes. We cover Bahrain International Airport (BAH) and King Fahd International Airport (DMM), with meet-and-greet for executives and clients." },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#1C1C1C] pb-24">
      <JsonLd
        data={[
          serviceSchema({
            name: "Corporate Bahrain Transport",
            description:
              "Corporate cross-border transport between Saudi Arabia and Bahrain via the King Fahd Causeway — monthly staff shuttles, executive chauffeur, airport transfers, and VAT invoicing for companies.",
            path: "/services/corporate-bahrain-transport",
            serviceType: "Corporate Transport",
            areaServed: ["Al Khobar", "Dammam", "Dhahran", "Manama", "Bahrain"],
          }),
          speakableSchema({ path: "/services/corporate-bahrain-transport" }),
          faqSchema(faqs),
        ]}
      />
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Services", href: "/services" },
          { name: "Corporate Bahrain Transport", href: "/services/corporate-bahrain-transport" },
        ]}
      />
      <section className="relative pt-32 pb-20 overflow-hidden border-b border-[#C9A84C]/10">
        <div className="absolute inset-0 z-0">
          <Image
            src="/services/border-crossings-hero.webp"
            alt="Corporate transport Saudi Arabia to Bahrain"
            fill
            className="object-cover opacity-80"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAF7] via-[#FAFAF7]/50 to-[#FAFAF7]/15" />
        </div>

        <div className="section-container relative z-10 max-w-5xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 backdrop-blur-md px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#16A34A] mb-6">
            <Building2 className="h-3 w-3" /> Corporate &amp; B2B
          </span>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Corporate Bahrain Transport <br />
            <span className="text-[#16A34A]">Saudi ↔ Bahrain Causeway</span>
          </h1>
          <p className="max-w-2xl mx-auto text-sm md:text-base text-[#6B7280] leading-relaxed mb-8">
            Reliable cross-border transport for companies in the Eastern Province and Bahrain. Monthly staff shuttles, executive chauffeur, airport pickups, and proper VAT invoicing — one accountable partner for the causeway run.
          </p>
          <div className="max-w-2xl mx-auto mb-10 text-left">
            <TLDRSummary
              answer="Taxi Saudi Arabia runs corporate transport across the King Fahd Causeway between Khobar, Dammam, Dhahran, and Bahrain — monthly staff shuttles, executive chauffeur, airport pickups, and VAT tax invoicing on a fixed agreed rate confirmed on WhatsApp."
              facts={[
                { label: "Model", value: "Monthly contract or per-trip" },
                { label: "Route", value: "Eastern Province ↔ Bahrain" },
                { label: "Invoicing", value: "VAT tax invoice" },
                { label: "Availability", value: "24/7 causeway crossings" },
              ]}
            />
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="#enquiry"
              className="inline-flex items-center gap-2 rounded-full bg-[#16A34A] px-8 py-3.5 text-xs font-bold uppercase text-white hover:bg-[#15803D] transition-all"
            >
              Request a Corporate Quote
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
        <h2 className="font-heading text-3xl font-bold mb-8 text-center">What Companies Use Us For</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {USE_CASES.map((u, i) => (
            <div key={i} className="flex items-start gap-3 bg-white border border-[#16A34A]/12 rounded-2xl p-5">
              <Check className="h-5 w-5 text-[#16A34A] shrink-0 mt-0.5" />
              <span className="text-sm text-[#1C1C1C]">{u}</span>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-[#6B7280]">
          Just need a single crossing?{" "}
          <Link href="/services/border-crossings" className="text-[#16A34A] font-semibold underline">
            See our GCC border-crossing taxi
          </Link>{" "}
          or the{" "}
          <Link href="/routes/alkhobar-to-manama" className="text-[#16A34A] font-semibold underline">
            Khobar to Bahrain route
          </Link>.
        </p>
      </section>

      <section id="enquiry" className="section-container max-w-4xl py-20 border-b border-[#C9A84C]/10">
        <div className="text-center mb-10">
          <h2 className="font-heading text-3xl font-bold mb-3">Request a Corporate Quote</h2>
          <p className="text-sm text-[#6B7280] max-w-xl mx-auto flex items-center justify-center gap-2">
            <Clock className="h-4 w-4 text-[#16A34A]" /> Tell us your company, volume, and route — we reply on WhatsApp with a fixed monthly proposal.
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

      <ServiceRelatedLinks currentPath="/services/corporate-bahrain-transport" />
    </div>
  );
}
