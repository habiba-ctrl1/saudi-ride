import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Landmark, MapPin, Clock, ShieldCheck, CheckCircle2, MessageCircle, ArrowRight } from "lucide-react";
import { contactConfig } from "@/lib/config/contact";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { ServiceRelatedLinks } from "@/components/seo/ServiceRelatedLinks";
import { serviceSchema, faqSchema, speakableSchema } from "@/lib/schema";
import { TLDRSummary } from "@/components/seo/TLDRSummary";
import WhatsAppQuoteForm from "@/components/booking/WhatsAppQuoteForm";
import { VehicleFitTool, type FitOption } from "@/components/location/cluster/VehicleFitTool";
import { FLEET_VEHICLES } from "@/lib/fleet-data";
import { MAKKAH_VEHICLE_FIT } from "@/lib/data/makkah-cluster";
import { CORPORATE_INVOICE_LINE } from "@/lib/data/cluster";

// Rebuilt 2026-10-08 from seo/makkah-keyword-map.md. GSC: "makkah ziyarat taxi"
// 184 impr / pos ~91 — the biggest unmet Makkah query. Primary keyword now leads
// title, H1, meta description, first paragraph and one H2. Transport only —
// no religious guidance; no per-site distances typed by hand (only Mina's
// ~8 km, which matches the Mina area page).
const TITLE = "Makkah Ziyarat Taxi | Private Car to Jabal Al-Noor, Mina & Arafat";
const DESCRIPTION = "Private Makkah Ziyarat taxi: a car and driver between Jabal Al-Noor, Jabal Thawr, Mina, Muzdalifah and Arafat, waiting at each stop. Fare agreed before booking.";
const OG_IMAGE = "https://taxisaudiarabia.com/locations/makkah-og.webp";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://taxisaudiarabia.com/services/makkah-ziyarat",
    languages: {
      en: "https://taxisaudiarabia.com/services/makkah-ziyarat",
      ar: "https://taxisaudiarabia.com/ar/services/makkah-ziyarat",
      "x-default": "https://taxisaudiarabia.com/services/makkah-ziyarat",
    },
  },
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    url: "https://taxisaudiarabia.com/services/makkah-ziyarat",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Minarets of the Haram complex in Makkah at sunset" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [OG_IMAGE] },
};

const SITES = [
  { name: "Jabal Al-Noor (Cave of Hira)", where: "North of Makkah", desc: "The mountain above the Cave of Hira. The car waits at the base; the climb is on foot and takes time, so allow for it." },
  { name: "Jabal Thawr (Cave of Thawr)", where: "South of Makkah", desc: "The mountain with the Cave of Thawr. The car waits at the base." },
  { name: "Mina", where: "About 8 km east of the Haram", desc: "The tent valley used during the days of Hajj. Outside the Hajj season it can be visited by car." },
  { name: "Muzdalifah", where: "Between Mina and Arafat", desc: "The open area between Mina and Arafat." },
  { name: "Arafat & Jabal Al-Rahmah", where: "East of Makkah", desc: "The plain of Arafat and the Mount of Mercy (Jabal Al-Rahmah)." },
  { name: "Jannat Al-Mu'alla", where: "North of the Haram", desc: "The historic cemetery of Makkah. Visiting rules are set by the authorities — your driver drops you at the nearest permitted point." },
];

const FEATURES = [
  { icon: MapPin, title: "A Route You Choose", desc: "Pick the sites and the order, or let us suggest an order that keeps the driving short. Skip any site you have already visited." },
  { icon: Clock, title: "Waiting Time at Every Stop", desc: "The car waits while you visit, so elders and children are never left looking for a ride between sites." },
  { icon: ShieldCheck, title: "Hotel Pickup & Drop-Off", desc: "Pickup and return at your Makkah hotel in Aziziyah, Ajyad or the Haram area — at the nearest permitted point near the Haram." },
  { icon: Landmark, title: "Transport, Not Guidance", desc: "We provide the car and driver. We do not provide religious guidance; bring your own guide or guidebook if you want one." },
];

const OPTIONS = [
  { option: "Half-day Ziyarat", best: "Most visitors: the main sites in one loop", how: "A block of hours with waiting at each stop; start time agreed with you" },
  { option: "Full-day Ziyarat", best: "Larger groups, elders who need long rests, or every site at a relaxed pace", how: "A full day with the same car and driver, including a rest or meal break" },
  { option: "Ziyarat plus airport or Madinah", best: "Leaving Makkah the same day", how: "Quoted together with the transfer; ask for both in one request" },
];

const FAQS = [
  { question: "How do I book a Makkah Ziyarat taxi?", answer: "Send your hotel, date, number of passengers, and whether you want a half day or a full day, by the form or on WhatsApp. We reply with the vehicle and one fixed fare before anything is booked." },
  { question: "Which sites can the Makkah Ziyarat car visit?", answer: "Most requests include Jabal Al-Noor (Cave of Hira), Jabal Thawr, Mina, Muzdalifah, Arafat with Jabal Al-Rahmah, and Jannat Al-Mu'alla. You choose the sites; the car takes you to each and waits." },
  { question: "How long does a Makkah Ziyarat tour by car take?", answer: "A half-day is usually enough for the main sites. Time at each stop depends on you — climbing Jabal Al-Noor on foot, for example, takes much longer than a photo stop. A full day gives a relaxed pace." },
  { question: "Can elderly parents or young children join?", answer: "Yes. Tell us who is travelling and we choose a vehicle with easier boarding and plan longer waiting stops. Some sites involve steps or climbs, so plan which stops they will actually get out at." },
  { question: "Does the driver explain the sites or give religious guidance?", answer: "No. The service is transport: the car, the driver, the waiting time. We do not provide religious guidance or a guide; bring your own guidebook or guide if you want one." },
  { question: "Can you pick us up from our Makkah hotel?", answer: "Yes — from hotels in Aziziyah, Ajyad, around the Haram and other Makkah districts. Near the Haram the car may need to meet you at the nearest permitted point; the driver tells you where." },
  { question: "Which vehicle should I choose for a family or group?", answer: "A sedan fits one to three people. A GMC or full-size SUV or a Hyundai Staria suits families. A Hiace van or coaster suits larger groups; larger coaches are arranged on request. We confirm the vehicle against your group size when we quote." },
  { question: "Can I add a stop at Masjid Aisha (Tan'eem)?", answer: "Yes, as a transport stop on request. We cannot advise on religious matters — tell us where you want to stop and the car waits." },
  { question: "Is this a private tour or a shared bus?", answer: "Private. The car is only for your group — it is not a shared bus tour — and the fare is agreed before booking." },
  { question: "Can I cancel or change the booking?", answer: "Yes. Cancellation is free up to 24 hours before pickup, and changes of time or hotel can be made on WhatsApp." },
];

const WA_PREFILL = "Salam! Makkah Ziyarat taxi enquiry.\n• Makkah hotel: \n• Date & start time: \n• Passengers (any elders / children?): \n• Half-day or full-day? : \n• Sites (Jabal al-Noor / Jabal Thawr / Mina / Muzdalifah / Arafat / other): \n• Vehicle (Sedan / SUV / Staria / Van / Coaster): ";

export default function MakkahZiyaratPage() {
  const fitOptions: FitOption[] = MAKKAH_VEHICLE_FIT.map((v) => {
    const fleet = FLEET_VEHICLES.find((f) => f.slug === v.fleetSlug);
    return { id: v.id, label: v.label, forWho: v.forWho, href: v.href, passengers: fleet?.passengers ?? 0, luggage: fleet?.luggage ?? 0 };
  });
  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#1C1C1C] pb-24">
      <JsonLd
        data={[
          serviceSchema({
            name: "Makkah Ziyarat Taxi",
            description:
              "Private Makkah Ziyarat transportation: a car and driver between Jabal Al-Noor, Jabal Thawr, Mina, Muzdalifah, Arafat and Jannat Al-Mu'alla, with waiting time at each stop. Transport only, coordinated through a partner network.",
            path: "/services/makkah-ziyarat",
            serviceType: "Ziyarat transportation",
            areaServed: ["Makkah"],
          }),
          faqSchema(FAQS),
          speakableSchema({ path: "/services/makkah-ziyarat" }),
        ]}
      />
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Makkah", href: "/locations/makkah" },
          { name: "Makkah Ziyarat Taxi", href: "/services/makkah-ziyarat" },
        ]}
      />

      {/* ─── HERO ─────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 overflow-hidden border-b border-[#C9A84C]/10">
        <div className="absolute inset-0 z-0">
          <Image
            src="/services/makkah-ziyarat-hero.webp"
            alt="A white private van driving a winding mountain road in western Saudi Arabia"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAF7] via-[#FAFAF7]/50 to-[#FAFAF7]/15" />
        </div>
        <div className="section-container relative z-10 max-w-5xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 backdrop-blur-md px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#16A34A] mb-6">
            <Landmark className="h-3 w-3" /> Ziyarat transportation · Makkah
          </span>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Makkah Ziyarat Taxi — <span className="text-[#16A34A]">Private Car Between the Holy Sites</span>
          </h1>
          <p className="max-w-2xl mx-auto text-sm md:text-base text-[#4B5563] leading-relaxed mb-8">
            A Makkah Ziyarat taxi gives your family or group one private car and driver for the day, taking you between Jabal Al-Noor, Jabal Thawr, Mina, Muzdalifah and Arafat and waiting at each stop. The fare is agreed before you book.
          </p>
          <div className="max-w-2xl mx-auto mb-10 text-left">
            <TLDRSummary
              answer="A Makkah Ziyarat taxi is a private car and driver booked for a half-day or full-day. It takes you between the Makkah sites you choose, waits at each stop, and collects you from your hotel. It is a transport service, not a guided tour."
              facts={[
                { label: "Booked as", value: "Half-day or full-day" },
                { label: "Pickup", value: "Your Makkah hotel" },
                { label: "Fare", value: "Agreed before booking" },
              ]}
            />
          </div>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a href="#quote" className="btn btn-primary btn-lg">Request a Ziyarat Quote</a>
            <a
              href={`https://wa.me/${contactConfig.whatsappNumber}?text=${encodeURIComponent(WA_PREFILL)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[48px] items-center gap-2 rounded-full border border-[#16A34A]/40 bg-white/70 px-7 text-xs font-bold uppercase tracking-wider text-[#15803D] backdrop-blur hover:bg-white"
            >
              <MessageCircle className="h-4 w-4" /> Book on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ─── SITES ────────────────────────────────────────────────── */}
      <section className="section-container max-w-6xl py-20 border-b border-[#C9A84C]/10">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Makkah Ziyarat Sites You Can Visit by Car</h2>
          <p className="text-[#6B7280]">You choose the sites. Locations are approximate and relative to Masjid Al-Haram.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SITES.map((site) => (
            <div key={site.name} className="bg-white border border-[#16A34A]/12 rounded-3xl p-6 hover:border-[#16A34A]/35 transition-colors">
              <h3 className="font-heading text-lg font-bold text-[#1C1C1C]">{site.name}</h3>
              <p className="mt-1 text-[0.7rem] font-bold uppercase tracking-wider text-[#16A34A]">{site.where}</p>
              <p className="mt-3 text-sm text-[#6B7280] leading-relaxed">{site.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── OPTIONS ──────────────────────────────────────────────── */}
      <section className="section-container max-w-5xl py-20 border-b border-[#C9A84C]/10">
        <h2 className="font-heading text-3xl font-bold mb-3 text-center">Half-Day or Full-Day Makkah Ziyarat?</h2>
        <p className="text-center text-[#6B7280] mb-10">Most visitors book a half-day. Choose a full day if the group is large, has elders, or wants a slow pace.</p>
        <div className="overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Makkah Ziyarat booking options</caption>
            <thead className="hidden bg-[#F9FAFB] text-[0.7rem] uppercase tracking-[0.14em] text-[#6B7280] sm:table-header-group">
              <tr><th scope="col" className="px-5 py-3 font-bold">Option</th><th scope="col" className="px-5 py-3 font-bold">Best for</th><th scope="col" className="px-5 py-3 font-bold">How it works</th></tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {OPTIONS.map((o) => (
                <tr key={o.option} className="block p-4 sm:table-row sm:p-0">
                  <th scope="row" className="block font-semibold sm:table-cell sm:px-5 sm:py-4">{o.option}</th>
                  <td className="block pt-1 text-[#1F2937] sm:table-cell sm:px-5 sm:py-4">{o.best}</td>
                  <td className="block pt-1 text-[#4B5563] sm:table-cell sm:px-5 sm:py-4">{o.how}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-5 text-sm text-[#4B5563]">
          Need a car for the whole day beyond Ziyarat? See <Link href="/locations/makkah/private-driver" className="font-semibold text-[#15803D] hover:underline">hiring a private driver in Makkah</Link>.
        </p>
      </section>

      {/* ─── FEATURES ─────────────────────────────────────────────── */}
      <section className="section-container max-w-6xl py-20">
        <h2 className="font-heading text-3xl font-bold mb-10 text-center">How the Ziyarat Car Service Works</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="flex gap-4 bg-white border border-[#16A34A]/12 rounded-2xl p-6">
              <div className="bg-[#C9A84C]/10 p-3 rounded-xl h-fit">
                <f.icon className="h-6 w-6 text-[#C9A84C]" />
              </div>
              <div>
                <h3 className="font-bold text-[#1C1C1C] mb-1">{f.title}</h3>
                <p className="text-sm text-[#6B7280] leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── VEHICLE FIT ──────────────────────────────────────────── */}
      <section className="section-container max-w-5xl py-16 border-t border-[#C9A84C]/10">
        <h2 className="font-heading text-3xl font-bold mb-3 text-center">Which Vehicle for Your Ziyarat Group?</h2>
        <p className="text-center text-[#6B7280] mb-8">Set passengers and bags. Availability is confirmed for your date when we quote; larger coaches on request.</p>
        <VehicleFitTool options={fitOptions} />
      </section>

      {/* ─── FAQ ──────────────────────────────────────────────────── */}
      <section className="section-container max-w-4xl py-20 border-t border-[#C9A84C]/10">
        <h2 className="font-heading text-3xl font-bold mb-12 text-center">Makkah Ziyarat Taxi FAQs</h2>
        <div className="space-y-4">
          {FAQS.map((f) => (
            <div key={f.question} className="bg-white border border-[#16A34A]/12 rounded-2xl p-6">
              <h3 className="font-bold text-[#1C1C1C] mb-2 flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-[#C9A84C] shrink-0 mt-0.5" />
                {f.question}
              </h3>
              <p className="text-sm text-[#6B7280] leading-relaxed pl-8">{f.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CTA + on-page lead form + group Path B ──────────────────── */}
      <section id="quote" className="section-container max-w-5xl pb-4 scroll-mt-24">
        <div className="bg-white border border-[#16A34A]/15 shadow-lg rounded-3xl p-6 sm:p-10">
          <div className="text-center mb-6">
            <h2 className="font-heading text-2xl font-bold mb-3 text-[#1C1C1C]">Request your Makkah Ziyarat quote</h2>
            <p className="text-[#6B7280] max-w-lg mx-auto">
              Send a few details for a quick WhatsApp quote — we confirm the vehicle and one fixed fare before booking, around your prayer times.
            </p>
          </div>

          <WhatsAppQuoteForm defaultPickup="Makkah hotel" defaultDropoff="Makkah Ziyarat" submitLabel="Request a Ziyarat Quote" />

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              href={`https://wa.me/${contactConfig.whatsappNumber}?text=${encodeURIComponent(WA_PREFILL)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-lg"
            >
              <MessageCircle className="h-4 w-4" /> Book Ziyarat on WhatsApp
            </a>
            <a
              href={`mailto:${contactConfig.email}?subject=${encodeURIComponent("Makkah Ziyarat group enquiry")}&body=${encodeURIComponent(
                "Hello Taxi Saudi Arabia team,\n\nWe'd like a quote for private Makkah Ziyarat transport.\n\n• Group / organisation: \n• Contact name: \n• Makkah hotel: \n• Date: \n• Number of passengers: \n• Half-day or full-day?: \n• Vehicle (SUV / Van / Coaster): \n• Invoice needed?: \n\nPlease confirm the fixed fare before booking.\n\nThank you.",
              )}`}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[#C9A84C] px-7 py-3 text-xs font-bold uppercase text-[#C9A84C] hover:bg-[#C9A84C]/10 transition-all"
            >
              Email a group enquiry
            </a>
          </div>
          <p className="mt-4 text-center text-xs text-[#6B7280]">{CORPORATE_INVOICE_LINE}</p>
          <p className="mt-6 text-center text-sm text-[#4B5563]">
            Part of our <Link href="/locations/makkah" className="font-semibold text-[#15803D] hover:underline">private transportation in Makkah</Link>. Arriving first? See{" "}
            <Link href="/routes/jeddah-airport-to-makkah" className="font-semibold text-[#15803D] hover:underline">Jeddah Airport to Makkah</Link> or{" "}
            <Link href="/services/umrah-transport" className="font-semibold text-[#15803D] hover:underline">Umrah transport</Link>.{" "}
            <Link href="/blog/makkah-ziyarat-taxi-holy-sites-tour" className="inline-flex items-center gap-1 font-semibold text-[#15803D] hover:underline">Read the Ziyarat guide <ArrowRight className="h-3.5 w-3.5" /></Link>
          </p>
        </div>
      </section>
      <ServiceRelatedLinks currentPath="/services/makkah-ziyarat" />
    </div>
  );
}
