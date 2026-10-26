import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { ServiceRelatedLinks } from "@/components/seo/ServiceRelatedLinks";
import { serviceSchema, faqSchema, speakableSchema } from "@/lib/schema";
import { TLDRSummary } from "@/components/seo/TLDRSummary";
import { Building2, ReceiptText, ShieldCheck, UserCheck, Check, MessageCircle } from "lucide-react";
import { contactConfig } from "@/lib/config/contact";
import { CorporateAccountForm } from "@/components/booking/CorporateAccountForm";
import { credentials, hasCredential } from "@/lib/config/credentials";

const ZATCA_READY = hasCredential(credentials.vatNumber);

const TITLE = "Corporate Taxi & Executive Chauffeur | Saudi Arabia";
const DESCRIPTION = ZATCA_READY
  ? "Corporate taxi & executive chauffeur accounts in Saudi Arabia. Written quotes by email, fixed fares agreed before booking, and corporate invoicing arranged through our sister company."
  : "Corporate taxi & executive chauffeur accounts in Saudi Arabia. Written quotes by email, fixed fares agreed before booking, and corporate invoicing arranged through our sister company.";
const OG_IMAGE = "https://taxisaudiarabia.com/services/corporate-hero.webp";

export const metadata: Metadata = {
  alternates: { canonical: "https://taxisaudiarabia.com/services/corporate" },
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    url: "https://taxisaudiarabia.com/services/corporate",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Corporate B2B transport in Saudi Arabia" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
};

const FEATURES = [
  {
    icon: ReceiptText,
    title: "Corporate Invoicing",
    desc: ZATCA_READY
      ? "Corporate invoicing can be arranged through our sister company."
      : "Corporate invoicing can be arranged through our sister company.",
  },
  { icon: UserCheck, title: "Written Quotes", desc: "Email your routes, dates and passenger numbers and receive a written quote for your trips before anything is booked." },
  { icon: ShieldCheck, title: "Fixed-Fare Quotes", desc: "Every corporate trip is quoted and agreed before booking — no meter, no surge, so costs stay predictable for approvals and reporting." },
  { icon: Building2, title: "Executive Vehicle Access", desc: "Executive sedans and luxury SUVs available through our partner network for visiting executives and board members, subject to availability." },
];

export default function CorporateAccountsPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#1C1C1C] pb-24">
      <JsonLd
        data={[
          serviceSchema({
            name: "Corporate Taxi Accounts & B2B Transport",
            description: ZATCA_READY
              ? "Corporate taxi accounts and B2B transport solutions in Saudi Arabia with written quotes, fixed fares agreed before booking, and corporate invoicing arranged through our sister company."
              : "Corporate taxi accounts and B2B transport solutions in Saudi Arabia with written quotes, fixed fares agreed before booking, and corporate invoicing arranged through our sister company.",
            path: "/services/corporate",
            serviceType: "Corporate Transport",
            areaServed: ["Saudi Arabia"],
          }),
          speakableSchema({ path: "/services/corporate" }),
        ]}
      />
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Services", href: "/services" },
          { name: "Corporate Accounts", href: "/services/corporate" },
        ]}
      />
      {/* ─── HERO ─────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 overflow-hidden border-b border-[#C9A84C]/10">
        <div className="absolute inset-0 z-0">
          <Image
            src="/services/corporate-hero.webp"
            alt="Corporate Transport Saudi Arabia"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAF7] via-[#FAFAF7]/50 to-[#FAFAF7]/15" />
        </div>

        <div className="section-container relative z-10 max-w-5xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 backdrop-blur-md px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#16A34A] mb-6">
            <Building2 className="h-3 w-3" /> B2B Solutions
          </span>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Executive Transport <br />
            <span className="text-[#16A34A]">for Modern Business</span>
          </h1>
          <p className="max-w-2xl mx-auto text-sm md:text-base text-[#6B7280] leading-relaxed mb-8">
            Streamline your company&apos;s travel logistics with our dedicated corporate accounts. Corporate invoicing can be arranged through our sister company, and access to executive-standard vehicles through our partner network across the Kingdom.
          </p>
          <div className="max-w-2xl mx-auto mb-10 text-left">
            <TLDRSummary
              answer={
                ZATCA_READY
                  ? "Corporate transport in Saudi Arabia through Taxi Saudi Arabia means a written quote by email, a fixed fare agreed before booking, corporate invoicing arranged through our sister company, and vehicles from executive sedans to coasters through our partner network."
                  : "Corporate transport in Saudi Arabia through Taxi Saudi Arabia means a written quote by email, a fixed fare agreed before booking, corporate invoicing arranged through our sister company, and vehicles from executive sedans to coasters through our partner network."
              }
              facts={[
                { label: "Invoicing", value: "Via our sister company" },
                { label: "Quotes", value: "Written, by email" },
                { label: "Vehicles", value: "Executive / VIP network" },
              ]}
            />
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <a
              href="#apply"
              className="btn btn-primary btn-lg"
            >
              Open Corporate Account
            </a>
            <a
              href={`https://wa.me/${contactConfig.whatsappNumber}?text=${encodeURIComponent("Salam, I'd like to set up a corporate transport account. Our company and estimated monthly trips are:")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-lg"
            >
              <MessageCircle className="h-4 w-4" /> Enquire on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ─── LOGOS ────────────────────────────────────────────────── */}
      <section className="border-b border-[#C9A84C]/10 py-10 bg-white">
        <div className="section-container max-w-5xl text-center">
          <p className="text-sm text-[#6B7280]">
            Corporate accounts are available for hotels, travel agencies, corporates and event organisers across the Kingdom.
          </p>
        </div>
      </section>

      {/* ─── FEATURES ─────────────────────────────────────────────── */}
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

      {/* ─── COMPARISON TABLE ─────────────────────────────────────── */}
      <section className="section-container max-w-5xl py-20">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl font-bold mb-4">Corporate vs Consumer Booking</h2>
          <p className="text-[#6B7280]">What changes when a company books instead of an individual traveller.</p>
        </div>

        <div className="bg-white rounded-3xl border border-[#16A34A]/12 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F0FDF4] border-b border-[#C9A84C]/10">
                <th className="p-6 font-bold text-sm text-[#6B7280]">Feature</th>
                <th className="p-6 font-bold text-sm text-[#6B7280] text-center border-l border-[#C9A84C]/10 w-1/3">Individual booking</th>
                <th className="p-6 font-bold text-sm text-[#C9A84C] text-center bg-[#C9A84C]/5 border-l border-[#C9A84C]/10 w-1/3">Company booking</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#C9A84C]/5">
              {[
                ["Quote", "WhatsApp quote", "WhatsApp or written quote by email"],
                ["Fixed fare agreed before booking", "Yes", "Yes"],
                ["Invoicing", "Electronic receipt on request", "Corporate invoicing via our sister company"],
                ["Payment", "Cash to the driver or bank transfer", "Cash to the driver or bank transfer"],
                ["Vehicles", "Sedan, SUV, van, coaster", "Sedan, SUV, van, coaster"],
              ].map((row, i) => (
                <tr key={i}>
                  <td className="p-6 text-sm text-[#1C1C1C] font-medium">{row[0]}</td>
                  <td className="p-6 text-center text-sm text-[#6B7280] border-l border-[#C9A84C]/10">{row[1]}</td>
                  <td className="p-6 text-center text-sm font-medium text-[#1C1C1C] bg-[#C9A84C]/5 border-l border-[#C9A84C]/10">{row[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ─── CORPORATE QUESTIONS (answer-first, AEO) ─────────────── */}
      <section className="section-container max-w-4xl pb-4">
        <div className="space-y-10">
          <div>
            <h2 className="font-heading text-2xl font-bold mb-3">What is a corporate chauffeur service in Saudi Arabia?</h2>
            <p className="text-sm md:text-base text-[#4B5563] leading-relaxed">It is a pre-booked private car with a professional chauffeur for company travel: airport pickups, hotel-to-meeting days, intercity trips and hourly hire, arranged through our partner network with the fare agreed before booking. Executives travelling between cities can start from the <Link href="/services/business-executive" className="font-semibold text-[#15803D] hover:underline">executive chauffeur service</Link>.</p>
          </div>
          <div>
            <h2 className="font-heading text-2xl font-bold mb-3">Can you arrange staff transfers for a company?</h2>
            <p className="text-sm md:text-base text-[#4B5563] leading-relaxed">Yes — email the routes, dates and passenger numbers and we reply with a written quote for the whole programme, using vehicles from executive sedans to coasters through the partner network. Check the <Link href="/fleet" className="font-semibold text-[#15803D] hover:underline">vehicle categories</Link> to match group size and luggage.</p>
          </div>
          <div>
            <h2 className="font-heading text-2xl font-bold mb-3">How do you handle delegation and event transport?</h2>
            <p className="text-sm md:text-base text-[#4B5563] leading-relaxed">Send flight numbers, passenger counts and the venue, and we agree the vehicle mix and fare before booking; arrivals are tracked so pickups follow the flight. Event-specific guidance is on the <Link href="/events" className="font-semibold text-[#15803D] hover:underline">events transport hub</Link>.</p>
          </div>
          <div>
            <h2 className="font-heading text-2xl font-bold mb-3">Book per trip, or request one quote for a programme?</h2>
            <p className="text-sm md:text-base text-[#4B5563] leading-relaxed">A single trip is fastest on WhatsApp, while several trips, several travellers or an invoice requirement suit one written quote by email. If you are unsure, send the details on WhatsApp and we will say which fits; see also <Link href="/pricing" className="font-semibold text-[#15803D] hover:underline">how fares are quoted</Link> or <Link href="/contact" className="font-semibold text-[#15803D] hover:underline">contact us</Link>.</p>
          </div>
        </div>
      </section>

      {/* ─── APPLICATION FORM ─────────────────────────────────────── */}
      <section id="apply" className="section-container max-w-3xl py-20">
        <div className="bg-white border border-[#16A34A]/15 shadow-lg rounded-3xl p-8 md:p-12">
          <div className="text-center mb-10">
            <h2 className="font-heading text-3xl font-bold mb-3 text-[#1C1C1C]">Request a Corporate Account</h2>
            <p className="text-sm text-[#6B7280]">Fill out the details below and we will reply with a written quote.</p>
          </div>

          <CorporateAccountForm />
          <div className="mt-6 pt-6 border-t border-[#16A34A]/10 text-center">
            <p className="text-xs text-[#6B7280] mb-3">Prefer email? Send your requirements and we will reply with a written quote; invoicing details are confirmed before the booking is finalised.</p>
            <a
              href={`mailto:${contactConfig.email}?subject=${encodeURIComponent("Corporate account / transport RFQ")}&body=${encodeURIComponent("Hello Taxi Saudi Arabia team,\n\nWe'd like to set up a corporate transport account / request a written quote.\n\n• Company: \n• Contact name & role: \n• City / cities: \n• Estimated monthly trips or routes: \n• Vehicle types needed (Executive sedan / SUV / Van / Luxury): \n• Invoicing (VAT / PO) & payment terms: \n\nThank you.")}`}
              className="inline-flex items-center gap-2 rounded-full border border-[#C9A84C] px-7 py-3 text-xs font-bold uppercase text-[#C9A84C] hover:bg-[#C9A84C]/10 transition-all"
            >
              Email our corporate desk
            </a>
          </div>
        </div>
      </section>
      {(() => {
        const faqs = [
          {
            question: "How does corporate invoicing work?",
            answer:
              "Corporate invoicing can be arranged through our sister company. Send your company name, VAT number and PO reference with your enquiry and we'll confirm invoicing details before the booking is finalised.",
          },
          { question: "Can one company book trips for several employees?", answer: "Yes. Send the travellers, routes, dates and passenger numbers by email or WhatsApp and we reply with one quote covering them, with the fare agreed before booking." },
          { question: "Is the fare fixed for corporate trips?", answer: "Yes. Every trip is quoted and agreed before booking — no meter and no surge — so the cost is known for approvals and expense reports." },
          { question: "Can we pay by bank transfer?", answer: "Payment is by cash to the driver or bank transfer, and electronic receipts are available on request." },
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
      <ServiceRelatedLinks currentPath="/services/corporate" />
    </div>
  );
}
