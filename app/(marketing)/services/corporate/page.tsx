import { Metadata } from "next";
import Image from "next/image";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { ServiceRelatedLinks } from "@/components/seo/ServiceRelatedLinks";
import { serviceSchema, faqSchema } from "@/lib/schema";
import { Building2, ReceiptText, ShieldCheck, UserCheck, Check } from "lucide-react";

export const metadata: Metadata = {
  alternates: { canonical: "https://taxisaudiarabia.com/services/corporate" },
  title: "Corporate Taxi Accounts & B2B Transport | Taxi Saudi Arabia",
  description: "Executive B2B transport solutions in Saudi Arabia. Monthly invoicing, ZATCA compliant receipts, priority dispatch, and dedicated account managers.",
};

const FEATURES = [
  { icon: ReceiptText, title: "Monthly Invoicing", desc: "Consolidated billing at the end of the month with full ZATCA-compliant e-invoices for easy accounting." },
  { icon: UserCheck, title: "Dedicated Manager", desc: "A single point of contact for all your executive transport logistics and complex bookings." },
  { icon: ShieldCheck, title: "Priority Dispatch", desc: "Corporate accounts receive priority vehicle allocation, even during peak rush hour or major events." },
  { icon: Building2, title: "VIP Fleet Access", desc: "Guaranteed access to our top-tier S-Class and Luxury SUV fleet for visiting executives and board members." },
];

export default function CorporateAccountsPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8] pb-24">
      <JsonLd
        data={serviceSchema({
          name: "Corporate Taxi Accounts & B2B Transport",
          description:
            "Corporate taxi accounts and B2B transport solutions in Saudi Arabia with monthly ZATCA-compliant invoicing, dedicated account managers, and priority dispatch.",
          path: "/services/corporate",
          serviceType: "Corporate Transport",
          areaServed: ["Saudi Arabia"],
        })}
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
            src="https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1920&q=80" 
            alt="Corporate Transport Saudi Arabia" 
            fill 
            className="object-cover opacity-30" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/80 to-[#0A0A0A]/40" />
        </div>

        <div className="section-container relative z-10 max-w-5xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 backdrop-blur-md px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#C9A84C] mb-6">
            <Building2 className="h-3 w-3" /> B2B Solutions
          </span>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Executive Transport <br />
            <span className="text-[#C9A84C]">for Modern Business</span>
          </h1>
          <p className="max-w-2xl mx-auto text-sm md:text-base text-[#A1A1A6] leading-relaxed mb-10">
            Streamline your company&apos;s travel logistics with our dedicated corporate accounts. Enjoy monthly billing, ZATCA tax compliance, and unmatched VIP service across the Kingdom.
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="#apply"
              className="inline-flex items-center gap-2 rounded-full bg-[#C9A84C] px-8 py-3.5 text-xs font-bold uppercase text-[#0A0A0A] hover:bg-[#B8963B] transition-all"
            >
              Open Corporate Account
            </a>
          </div>
        </div>
      </section>

      {/* ─── LOGOS ────────────────────────────────────────────────── */}
      <section className="border-b border-[#C9A84C]/10 py-10 bg-[#111]">
        <div className="section-container max-w-5xl">
          <p className="text-center text-[0.65rem] uppercase tracking-widest font-bold text-[#7C8088] mb-6">Trusted by leading organizations across the Kingdom</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-40 grayscale">
             {/* Placeholders for logos */}
             <div className="font-heading text-xl font-bold">AL-RAJHI CORP</div>
             <div className="font-heading text-xl font-bold">SABIC PARTNERS</div>
             <div className="font-heading text-xl font-bold">KAFD MANAGEMENT</div>
             <div className="font-heading text-xl font-bold">KINGDOM HOTELS</div>
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─────────────────────────────────────────────── */}
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

      {/* ─── COMPARISON TABLE ─────────────────────────────────────── */}
      <section className="section-container max-w-5xl py-20">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl font-bold mb-4">Corporate vs Consumer Booking</h2>
          <p className="text-[#A1A1A6]">Why your organization should upgrade to a B2B account.</p>
        </div>

        <div className="bg-[#111] rounded-3xl border border-[#C9A84C]/15 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#1A1A1A] border-b border-[#C9A84C]/10">
                <th className="p-6 font-bold text-sm text-[#A1A1A6]">Feature</th>
                <th className="p-6 font-bold text-sm text-[#A1A1A6] text-center border-l border-[#C9A84C]/10 w-1/3">Standard Account</th>
                <th className="p-6 font-bold text-sm text-[#C9A84C] text-center bg-[#C9A84C]/5 border-l border-[#C9A84C]/10 w-1/3">Corporate Account</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#C9A84C]/5">
              {[
                ["ZATCA Compliant E-Invoicing", false, true],
                ["Monthly Post-Paid Billing", false, true],
                ["Dedicated Account Manager", false, true],
                ["Priority Dispatch in Rush Hour", false, true],
                ["Custom SLA Agreements", false, true],
                ["Volume Booking Discounts", false, true],
              ].map((row, i) => (
                <tr key={i}>
                  <td className="p-6 text-sm text-[#F5F0E8] font-medium">{row[0]}</td>
                  <td className="p-6 text-center border-l border-[#C9A84C]/10">
                    {row[1] ? <Check className="h-5 w-5 text-[#A1A1A6] mx-auto" /> : <span className="text-[#7C8088]">—</span>}
                  </td>
                  <td className="p-6 text-center bg-[#C9A84C]/5 border-l border-[#C9A84C]/10">
                    {row[2] ? <Check className="h-5 w-5 text-[#C9A84C] mx-auto" /> : <span className="text-[#7C8088]">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ─── APPLICATION FORM ─────────────────────────────────────── */}
      <section id="apply" className="section-container max-w-3xl py-20">
        <div className="bg-gradient-to-br from-[#1A1A1A] to-[#111] border border-[#C9A84C]/30 rounded-3xl p-8 md:p-12">
          <div className="text-center mb-10">
            <h2 className="font-heading text-3xl font-bold mb-3 text-[#F5F0E8]">Request a Corporate Account</h2>
            <p className="text-sm text-[#A1A1A6]">Fill out the details below and our B2B team will contact you within 24 hours.</p>
          </div>

          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#A1A1A6] uppercase tracking-wider">Company Name *</label>
                <input type="text" className="w-full bg-[#0A0A0A] border border-[#C9A84C]/20 rounded-xl px-4 py-3 text-sm focus:border-[#C9A84C] outline-none transition-colors" required />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#A1A1A6] uppercase tracking-wider">Contact Person *</label>
                <input type="text" className="w-full bg-[#0A0A0A] border border-[#C9A84C]/20 rounded-xl px-4 py-3 text-sm focus:border-[#C9A84C] outline-none transition-colors" required />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#A1A1A6] uppercase tracking-wider">Corporate Email *</label>
                <input type="email" className="w-full bg-[#0A0A0A] border border-[#C9A84C]/20 rounded-xl px-4 py-3 text-sm focus:border-[#C9A84C] outline-none transition-colors" required />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#A1A1A6] uppercase tracking-wider">Phone Number *</label>
                <input type="tel" className="w-full bg-[#0A0A0A] border border-[#C9A84C]/20 rounded-xl px-4 py-3 text-sm focus:border-[#C9A84C] outline-none transition-colors" required />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#A1A1A6] uppercase tracking-wider">Estimated Monthly Trips</label>
              <select className="w-full bg-[#0A0A0A] border border-[#C9A84C]/20 rounded-xl px-4 py-3 text-sm focus:border-[#C9A84C] outline-none transition-colors appearance-none">
                <option value="1-10">1 - 10 Trips</option>
                <option value="11-50">11 - 50 Trips</option>
                <option value="50+">50+ Trips</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#A1A1A6] uppercase tracking-wider">Additional Requirements</label>
              <textarea rows={4} className="w-full bg-[#0A0A0A] border border-[#C9A84C]/20 rounded-xl px-4 py-3 text-sm focus:border-[#C9A84C] outline-none transition-colors" placeholder="Tell us about your specific transport needs..."></textarea>
            </div>

            <button type="button" className="w-full bg-[#C9A84C] text-[#0A0A0A] font-bold uppercase tracking-wider text-xs py-4 rounded-xl hover:bg-[#B8963B] transition-colors mt-4">
              Submit Application
            </button>
            <p className="text-center text-[0.65rem] text-[#7C8088] mt-4">By submitting, you agree to our B2B terms of service.</p>
          </form>
        </div>
      </section>
      {(() => {
        const faqs = [
          { question: "How does monthly corporate billing work?", answer: "Your company is invoiced once at month-end with a consolidated, ZATCA-compliant statement covering all rides, instead of paying per trip." },
          { question: "Can multiple employees book under one account?", answer: "Yes. Corporate accounts support multiple authorized bookers and travelers under a single billing profile with a dedicated account manager." },
          { question: "Do corporate accounts get priority during peak times?", answer: "Yes. Corporate bookings receive priority vehicle allocation during rush hours and major events." },
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
      <ServiceRelatedLinks currentPath="/services/corporate" />
    </main>
  );
}
