import { Metadata } from "next";
import Image from "next/image";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { ServiceRelatedLinks } from "@/components/seo/ServiceRelatedLinks";
import { serviceSchema, faqSchema, speakableSchema } from "@/lib/schema";
import { TLDRSummary } from "@/components/seo/TLDRSummary";
import { Briefcase, ShieldCheck, Clock, Wifi, MessageCircle } from "lucide-react";
import { contactConfig } from "@/lib/config/contact";
import { credentials, hasCredential } from "@/lib/config/credentials";

const waLink = (msg: string) =>
  `https://wa.me/${contactConfig.whatsappNumber}?text=${encodeURIComponent(msg)}`;

const ZATCA_READY = hasCredential(credentials.vatNumber);

const TITLE = "Business & Executive Transport | Taxi Saudi Arabia";
const DESCRIPTION = ZATCA_READY
  ? "Executive chauffeur service in Riyadh, Jeddah & Dammam — Mercedes S-Class & GMC Yukon for corporate meetings, KAFD & conferences. Fixed fares, ZATCA receipts, 24/7 dispatch."
  : "Executive chauffeur service in Riyadh, Jeddah & Dammam — Mercedes S-Class & GMC Yukon for corporate meetings, KAFD & conferences. Fixed fares, 24/7 dispatch.";
const OG_IMAGE = "https://taxisaudiarabia.com/services/business-executive-hero.webp";

export const metadata: Metadata = {
  alternates: { canonical: "https://taxisaudiarabia.com/services/business-executive" },
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    url: "https://taxisaudiarabia.com/services/business-executive",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Business executive transport in Saudi Arabia" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
};

const FEATURES = [
  { icon: Briefcase, title: "Corporate Standards", desc: "Immaculate vehicles and professionally attired chauffeurs to reflect your corporate image." },
  { icon: Clock, title: "Punctuality Guaranteed", desc: "We arrive 15 minutes before your scheduled pickup to ensure you're never late for a meeting." },
  { icon: Wifi, title: "Mobile Office", desc: "Complimentary high-speed Wi-Fi in select vehicles to keep you connected on the go." },
  { icon: ShieldCheck, title: "Discreet Service", desc: "Confidentiality and privacy guaranteed for traveling executives and board members." },
];

export default function BusinessExecutivePage() {
  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#1C1C1C] pb-24">
      <JsonLd
        data={[
          serviceSchema({
            name: "Business & Executive Transport",
            description:
              "Executive car service for business travelers in Saudi Arabia with professional chauffeurs, Wi-Fi equipped vehicles, and guaranteed punctuality.",
            path: "/services/business-executive",
            serviceType: "Executive Car Service",
            areaServed: ["Riyadh", "Jeddah", "Dammam"],
          }),
          speakableSchema({ path: "/services/business-executive" }),
        ]}
      />
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Services", href: "/services" },
          { name: "Business & Executive", href: "/services/business-executive" },
        ]}
      />
      <section className="relative pt-32 pb-20 overflow-hidden border-b border-[#C9A84C]/10">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/services/business-executive-hero.webp" 
            alt="Business Executive Transport Saudi Arabia" 
            fill 
            className="object-cover opacity-80" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAF7] via-[#FAFAF7]/50 to-[#FAFAF7]/15" />
        </div>

        <div className="section-container relative z-10 max-w-5xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 backdrop-blur-md px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#B8963B] mb-6">
            <Briefcase className="h-3 w-3" /> Corporate Travel
          </span>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Business Executive <br />
            <span className="text-[#16A34A]">Transport</span>
          </h1>
          <p className="max-w-2xl mx-auto text-sm md:text-base text-[#6B7280] leading-relaxed mb-8">
            Seamless travel logistics for professionals. From airport pickups to full-day standby services for your roadshows and meetings in Riyadh, Jeddah, or Dammam.
          </p>
          <div className="max-w-2xl mx-auto mb-10 text-left">
            <TLDRSummary
              answer="Business executive transport in Saudi Arabia offers professional chauffeurs, Wi-Fi equipped sedans, and guaranteed 15-minute-early arrivals for meetings in Riyadh, Jeddah, and Dammam."
              facts={[
                { label: "Coverage", value: "Riyadh / Jeddah / Dammam" },
                { label: "Punctuality", value: "15 min early" },
                { label: "Vehicles", value: "Wi-Fi equipped sedans" },
              ]}
            />
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <a
              href={waLink("Salam, I need executive transport in Saudi Arabia (Riyadh / Jeddah / Dammam). My date, pickup and schedule are:")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#16A34A] px-8 py-3.5 text-xs font-bold uppercase text-white hover:bg-[#15803D] transition-all shadow-[0_4px_20px_rgba(22,163,74,0.3)]"
            >
              <MessageCircle className="h-4 w-4" /> Book on WhatsApp
            </a>
            <a
              href={contactConfig.primaryPhoneLink}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#C9A84C]/40 px-8 py-3.5 text-xs font-bold uppercase text-[#B8963B] hover:bg-[#C9A84C]/10 transition-all"
            >
              Call {contactConfig.primaryPhoneDisplay}
            </a>
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
          { question: "Can I book a chauffeur for a full day of meetings?", answer: "Yes. We offer hourly and full-day executive charter where your chauffeur stays on standby between meetings across the city." },
          {
            question: "Do you provide invoices for corporate expense claims?",
            answer: ZATCA_READY
              ? "Yes. We issue ZATCA-compliant e-invoices suitable for company expense and reimbursement claims."
              : "Yes. We issue itemized invoices suitable for company expense and reimbursement claims.",
          },
          { question: "Are your executive vehicles equipped for working on the move?", answer: "Select vehicles include complimentary Wi-Fi, charging ports, and a quiet cabin so you can work or take calls en route." },
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
      <section className="section-container max-w-5xl py-4">
        <div className="bg-white border border-[#16A34A]/15 shadow-lg rounded-3xl p-12 text-center">
          <h2 className="font-heading text-2xl font-bold mb-3 text-[#1C1C1C]">Book your executive transfer</h2>
          <p className="text-[#6B7280] mb-8 max-w-lg mx-auto">Airport pickup, meeting standby, or a full-day roadshow — send your schedule on WhatsApp and we&apos;ll confirm your car and fixed fare.</p>
          <a
            href={waLink("Salam, I'd like to arrange business / executive transport in Saudi Arabia. Details:")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#16A34A] px-8 py-4 text-xs font-bold uppercase text-white hover:bg-[#15803D] transition-all shadow-[0_4px_20px_rgba(22,163,74,0.3)]"
          >
            <MessageCircle className="h-4 w-4" /> Message on WhatsApp
          </a>
        </div>
      </section>
      <ServiceRelatedLinks currentPath="/services/business-executive" />
    </div>
  );
}
