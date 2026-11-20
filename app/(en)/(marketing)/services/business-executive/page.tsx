import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { ServiceRelatedLinks } from "@/components/seo/ServiceRelatedLinks";
import { serviceSchema, faqSchema, speakableSchema } from "@/lib/schema";
import { TLDRSummary } from "@/components/seo/TLDRSummary";
import WhatsAppQuoteForm from "@/components/booking/WhatsAppQuoteForm";
import { Briefcase, ShieldCheck, Clock, CalendarClock, MessageCircle } from "lucide-react";
import { contactConfig } from "@/lib/config/contact";
import { credentials, hasCredential } from "@/lib/config/credentials";

const waLink = (msg: string) =>
  `https://wa.me/${contactConfig.whatsappNumber}?text=${encodeURIComponent(msg)}`;

const ZATCA_READY = hasCredential(credentials.vatNumber);

const TITLE = "Private Chauffeur & Executive Transport | Taxi Saudi Arabia";
const DESCRIPTION = ZATCA_READY
  ? "Private chauffeur & executive transport in Riyadh, Jeddah & Dammam — hourly, half-day or full day. Fixed fares agreed before booking, invoicing via our sister company, 24/7 availability."
  : "Private chauffeur & executive transport in Riyadh, Jeddah & Dammam — hourly, half-day or full day. Fixed fares agreed before booking, invoicing via our sister company, 24/7 availability.";
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
  { icon: Briefcase, title: "Professional Chauffeurs", desc: "Executive sedans and full-size SUVs with professional partner chauffeurs, matched to your group size and luggage." },
  { icon: Clock, title: "Confirmed Before Pickup", desc: "Driver details are sent on WhatsApp before pickup, and the fare is agreed before you book." },
  { icon: CalendarClock, title: "Standby Between Meetings", desc: "Book by the hour, half-day or full day and the car waits outside each stop of your schedule." },
  { icon: ShieldCheck, title: "Discreet Chauffeur", desc: "A private car for one party, not a shared ride, suited to travelling executives and senior guests." },
];

export default function BusinessExecutivePage() {
  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#1C1C1C] pb-24">
      <JsonLd
        data={[
          serviceSchema({
            name: "Private Chauffeur & Executive Transport",
            description:
              "Private chauffeur and executive car service for business travelers in Saudi Arabia with professional partner chauffeurs, bookable by the hour, half-day or full day.",
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
          { name: "Private Chauffeur & Executive", href: "/services/business-executive" },
        ]}
      />
      <section className="relative pt-32 pb-20 overflow-hidden border-b border-[#C9A84C]/10">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/services/business-executive-hero.webp"
            alt="Business Executive Transport Saudi Arabia"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAF7] via-[#FAFAF7]/50 to-[#FAFAF7]/15" />
        </div>

        <div className="section-container relative z-10 max-w-5xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 backdrop-blur-md px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#16A34A] mb-6">
            <Briefcase className="h-3 w-3" /> Corporate Travel
          </span>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Private Chauffeur & <br />
            <span className="text-[#16A34A]">Executive Transport</span>
          </h1>
          <p className="max-w-2xl mx-auto text-sm md:text-base text-[#6B7280] leading-relaxed mb-8">
            A private chauffeur for professionals — book by the hour, for a full-day standby, or for airport pickups, roadshows and meetings in Riyadh, Jeddah, or Dammam.
          </p>
          <div className="max-w-2xl mx-auto mb-10 text-left">
            <TLDRSummary
              answer="Private chauffeur and executive transport in Saudi Arabia means a professional chauffeur and a private car booked by the hour, half-day or full day for meetings, airport transfers and city travel in Riyadh, Jeddah and Dammam, with the fare agreed before booking."
              facts={[
                { label: "Coverage", value: "Riyadh / Jeddah / Dammam" },
                { label: "Fare", value: "Agreed before booking" },
                { label: "Vehicles", value: "Executive sedan / full-size SUV" },
              ]}
            />
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <a
              href={waLink("Salam, I need executive transport in Saudi Arabia (Riyadh / Jeddah / Dammam). My date, pickup and schedule are:")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-lg"
            >
              <MessageCircle className="h-4 w-4" /> Book on WhatsApp
            </a>
            <a
              href={contactConfig.primaryPhoneLink}
              className="btn btn-secondary btn-lg"
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
      <section className="section-container max-w-4xl py-20 border-b border-[#C9A84C]/10">
        <div className="space-y-10">
          <div>
            <h2 className="font-heading text-2xl font-bold mb-3">What is a private chauffeur service in Saudi Arabia?</h2>
            <p className="text-sm md:text-base text-[#4B5563] leading-relaxed">It is a private car with a professional chauffeur booked in advance for a block of hours or a whole day, rather than a single point-to-point ride. The car waits outside each stop, and the fare is agreed before you book. Single airport or intercity runs are covered on the <Link href="/services/airport-transfers" className="font-semibold text-[#15803D] hover:underline">airport transfers</Link> page.</p>
          </div>
          <div>
            <h2 className="font-heading text-2xl font-bold mb-3">Hourly hire or a full day: which should I book?</h2>
            <p className="text-sm md:text-base text-[#4B5563] leading-relaxed">Book by the hour when you have a few stops and a known end time, and a full day when meetings may overrun or you are hosting a visitor. A single transfer is simpler when you only need A to B, so say honestly which fits when you send the details. Vehicle categories are listed on the <Link href="/fleet" className="font-semibold text-[#15803D] hover:underline">fleet page</Link>, and the <Link href="/pricing" className="font-semibold text-[#15803D] hover:underline">pricing page</Link> explains how fares are quoted.</p>
          </div>
          <div>
            <h2 className="font-heading text-2xl font-bold mb-3">Where can I book an executive chauffeur?</h2>
            <p className="text-sm md:text-base text-[#4B5563] leading-relaxed">In Riyadh, Jeddah and Dammam through our partner network. City details are on the <Link href="/locations/riyadh" className="font-semibold text-[#15803D] hover:underline">Riyadh</Link> and <Link href="/locations/jeddah/private-driver" className="font-semibold text-[#15803D] hover:underline">Jeddah driver-by-the-hour</Link> pages, and companies setting up regular travel can see <Link href="/services/corporate" className="font-semibold text-[#15803D] hover:underline">corporate transport</Link> or <Link href="/contact" className="font-semibold text-[#15803D] hover:underline">contact us</Link>.</p>
          </div>
        </div>
      </section>
      <section className="section-container max-w-4xl py-4">
        <div className="rounded-3xl bg-[#0F172A] p-7 text-white sm:p-10">
          <h2 className="font-heading text-2xl font-bold">Booking for a company or a visiting team?</h2>
          <p className="mt-3 text-sm leading-relaxed text-white/80">Email your cities, dates and passenger numbers and we reply with a written quote. Corporate invoicing can be arranged through our sister company.</p>
          <ul className="mt-5 grid gap-2 text-sm text-white/85 sm:grid-cols-3">
            <li>Written quote by email</li>
            <li>Fixed fare agreed before booking</li>
            <li>Invoicing via our sister company</li>
          </ul>
        </div>
      </section>
      {(() => {
        const faqs = [
          { question: "Can I book a private chauffeur by the hour?", answer: "Yes. You can book a private chauffeur by the hour, for a half-day, or for a full day — the vehicle and driver stay dedicated to you between stops." },
          { question: "Can I book a chauffeur for a full day of meetings?", answer: "Yes. We offer hourly and full-day executive charter where your chauffeur stays on standby between meetings across the city." },
          {
            question: "Do you provide invoices for corporate expense claims?",
            answer: ZATCA_READY
              ? "Yes. Corporate invoicing can be arranged through our sister company."
              : "Yes. Corporate invoicing can be arranged through our sister company.",
          },
          { question: "Can I work or take calls during the trip?", answer: "Yes — it is a private car with a professional chauffeur, so you can take calls or review documents between stops. Tell us your schedule when you request the quote and we confirm the vehicle." },
          { question: "Can I book a chauffeur in Jeddah, Riyadh or Dammam?", answer: "Yes. Chauffeur hire is available in all three cities through our partner network, by the hour, half-day or full day, with the fare agreed before booking. Send the date, start time and hours needed." },
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
        <div className="bg-white border border-[#16A34A]/15 shadow-lg rounded-3xl p-6 sm:p-10">
          <div className="text-center mb-6">
            <h2 className="font-heading text-2xl font-bold mb-3 text-[#1C1C1C]">Book your executive transfer</h2>
            <p className="text-[#6B7280] max-w-lg mx-auto">Airport pickup, meeting standby, or a full-day roadshow — fill a few details for a fast WhatsApp quote, or email our corporate desk for a written quote with invoicing.</p>
          </div>
          <WhatsAppQuoteForm defaultVehicle="Luxury" />
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              href={waLink("Salam! Business / executive transport enquiry.\n• From / to: \n• Date & time: \n• Passengers: \n• Vehicle (Executive sedan / SUV / Luxury): \n• Airport / meeting standby / roadshow?: ")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-lg"
            >
              <MessageCircle className="h-4 w-4" /> Executive quote on WhatsApp
            </a>
            <a
              href={`mailto:${contactConfig.email}?subject=${encodeURIComponent("Corporate / executive transport RFQ")}&body=${encodeURIComponent("Hello Taxi Saudi Arabia team,\n\nWe'd like a written quote for business / executive transport in Saudi Arabia.\n\n• Company: \n• Contact name & role: \n• City / route(s): \n• Dates: \n• Passengers per trip: \n• Vehicle preference (Executive sedan / SUV / Luxury): \n• Airport / meeting standby / roadshow / multi-day?: \n• Corporate invoicing (VAT / PO)?: \n\nPlease confirm invoicing details and a fixed fare before booking.\n\nThank you.")}`}
              className="inline-flex items-center gap-2 rounded-full border border-[#C9A84C] px-7 py-3.5 text-xs font-bold uppercase text-[#C9A84C] hover:bg-[#C9A84C]/10 transition-all"
            >
              Email our corporate desk
            </a>
          </div>
        </div>
      </section>
      <ServiceRelatedLinks currentPath="/services/business-executive" />
    </div>
  );
}
