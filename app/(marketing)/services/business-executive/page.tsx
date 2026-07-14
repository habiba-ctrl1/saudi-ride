import { Metadata } from "next";
import Image from "next/image";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { ServiceRelatedLinks } from "@/components/seo/ServiceRelatedLinks";
import { serviceSchema, faqSchema } from "@/lib/schema";
import { Briefcase, ShieldCheck, Clock, Wifi } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  alternates: { canonical: "https://taxisaudiarabia.com/services/business-executive" },
  title: "Business & Executive Transport | Taxi Saudi Arabia",
  description: "Executive transport services for business travelers in Riyadh, Jeddah, and Dammam. Professional chauffeurs and comfortable sedans for your corporate meetings.",
};

const FEATURES = [
  { icon: Briefcase, title: "Corporate Standards", desc: "Immaculate vehicles and professionally attired chauffeurs to reflect your corporate image." },
  { icon: Clock, title: "Punctuality Guaranteed", desc: "We arrive 15 minutes before your scheduled pickup to ensure you're never late for a meeting." },
  { icon: Wifi, title: "Mobile Office", desc: "Complimentary high-speed Wi-Fi in select vehicles to keep you connected on the go." },
  { icon: ShieldCheck, title: "Discreet Service", desc: "Confidentiality and privacy guaranteed for traveling executives and board members." },
];

export default function BusinessExecutivePage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8] pb-24">
      <JsonLd
        data={serviceSchema({
          name: "Business & Executive Transport",
          description:
            "Executive car service for business travelers in Saudi Arabia with professional chauffeurs, Wi-Fi equipped vehicles, and guaranteed punctuality.",
          path: "/services/business-executive",
          serviceType: "Executive Car Service",
          areaServed: ["Riyadh", "Jeddah", "Dammam"],
        })}
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
            className="object-cover opacity-30" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/80 to-[#0A0A0A]/40" />
        </div>

        <div className="section-container relative z-10 max-w-5xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 backdrop-blur-md px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#C9A84C] mb-6">
            <Briefcase className="h-3 w-3" /> Corporate Travel
          </span>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Business Executive <br />
            <span className="text-[#C9A84C]">Transport</span>
          </h1>
          <p className="max-w-2xl mx-auto text-sm md:text-base text-[#A1A1A6] leading-relaxed mb-10">
            Seamless travel logistics for professionals. From airport pickups to full-day standby services for your roadshows and meetings in Riyadh, Jeddah, or Dammam.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/book?service=business-executive"
              className="inline-flex items-center gap-2 rounded-full bg-[#C9A84C] px-8 py-3.5 text-xs font-bold uppercase text-[#0A0A0A] hover:bg-[#B8963B] transition-all"
            >
              Book Executive Transport
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
          { question: "Can I book a chauffeur for a full day of meetings?", answer: "Yes. We offer hourly and full-day executive charter where your chauffeur stays on standby between meetings across the city." },
          { question: "Do you provide invoices for corporate expense claims?", answer: "Yes. We issue ZATCA-compliant e-invoices suitable for company expense and reimbursement claims." },
          { question: "Are your executive vehicles equipped for working on the move?", answer: "Select vehicles include complimentary Wi-Fi, charging ports, and a quiet cabin so you can work or take calls en route." },
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
      <ServiceRelatedLinks currentPath="/services/business-executive" />
    </main>
  );
}
