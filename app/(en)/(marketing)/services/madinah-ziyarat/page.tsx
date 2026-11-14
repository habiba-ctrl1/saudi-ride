import { Metadata } from "next";
import Image from "next/image";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { ServiceRelatedLinks } from "@/components/seo/ServiceRelatedLinks";
import { serviceSchema, faqSchema, speakableSchema } from "@/lib/schema";
import { TLDRSummary } from "@/components/seo/TLDRSummary";
import Link from "next/link";
import { Compass, ShieldCheck, MapPin, Map, Landmark, Users } from "lucide-react";
import { ZiyaratPlanner } from "@/components/location/cluster/ZiyaratPlanner";
import { ZIYARAT_STOPS } from "@/lib/data/madinah-cluster";
import { contactConfig } from "@/lib/config/contact";
import WhatsAppQuoteForm from "@/components/booking/WhatsAppQuoteForm";

const TITLE = "Madinah Ziyarat Packages & Taxi Tours | Taxi Saudi Arabia";
const DESCRIPTION = "Private car for Madinah Ziyarat — Quba Mosque, Masjid al-Qiblatayn, the Seven Mosques area and Mount Uhud, with the car waiting at each stop. Half-day or full-day; fare agreed on WhatsApp before booking.";
const OG_IMAGE = "https://taxisaudiarabia.com/locations/madinah-og.webp";

export const metadata: Metadata = {
  alternates: { canonical: "https://taxisaudiarabia.com/services/madinah-ziyarat" },
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    url: "https://taxisaudiarabia.com/services/madinah-ziyarat",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Sunlit umbrella canopies in the courtyard of Al-Masjid an-Nabawi in Madinah" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
};

const FEATURES = [
  { icon: Map, title: "Sites you choose", desc: "Quba Mosque, Masjid al-Qiblatayn, the Seven Mosques (Al-Khandaq) area and Mount Uhud — pick the ones you want in the planner." },
  { icon: Compass, title: "The car waits", desc: "The car waits at, or as near as allowed to, each stop so you are never looking for a ride afterwards. Transport only: no guide, no religious guidance." },
  { icon: ShieldCheck, title: "Half-day or full-day", desc: "Book a half-day for the main sites or a full day for a slower pace, extra stops or a custom order." },
  { icon: MapPin, title: "Hotel pickup", desc: "Pickup and drop-off at your hotel, from the nearest permitted point if you stay in the Central Area (Markaziyah)." },
];

const HALF_FULL = [
  { title: "Half-day", tone: "bg-white", when: ["The main sites at a normal pace", "Travellers short on time", "Up to four stops in one loop"] },
  { title: "Full-day", tone: "bg-[#F0FDF4]", when: ["Larger groups or elderly passengers", "A slower pace with longer stops", "Extra sites or shopping in the same day", "A custom order that follows prayer times"] },
];

const SITE_FAQS = [
  { question: "Which sites can the car take me to?", answer: "The usual loop is Quba Mosque, Masjid al-Qiblatayn, the Seven Mosques (Al-Khandaq) area and Mount Uhud with its martyrs cemetery. You choose the stops and the order in the planner, and the driver waits at each one." },
  { question: "How long does a Madinah Ziyarat trip take?", answer: "A half-day is usually enough for the main sites, but the time depends on how long you stay at each stop and on prayer times and traffic. Tell us your pace and who is travelling and we plan the hours with you." },
  { question: "Is this a guided tour?", answer: "No. This is a private transport service: the car and driver take you between the sites and wait. We do not provide a guide or religious guidance. For history and rulings use our Ziyarat sites guide or a qualified guide." },
  { question: "Can you pick us up from our hotel near Masjid an-Nabawi?", answer: "Yes. Pickup is from the nearest permitted point to your hotel in the Central Area (Markaziyah) or from any other Madinah district. Access near the mosque is restricted, so give us the exact hotel name." },
  { question: "Is it suitable for elderly parents and children?", answer: "Yes. Tell us who is travelling and we suggest an SUV or van with easier boarding, plan longer waits and keep the car as close as allowed. We cannot guarantee access arrangements at the sites themselves, which the authorities control." },
  { question: "Can we stop at Dhul Hulayfah (Abyar Ali) or visit Badr?", answer: "Dhul Hulayfah is on the Makkah road, so ask for it on a Madinah to Makkah transfer. Badr is a separate half-day trip about 150 km from Madinah - see our Badr Ziyarat service. Whether to enter ihram at the Miqat is a religious question we cannot advise on." },
  { question: "How much is a Madinah Ziyarat car?", answer: "It depends on the vehicle and the hours. We do not publish a fixed list because it would not fit every plan: send your stops and passengers and we confirm one fixed fare on WhatsApp before booking, with no meter and no surge." },
  { question: "Can I cancel or change the plan?", answer: "Yes. Cancellation is free up to 24 hours before pickup, and you can change the stops, time or hotel on WhatsApp." },
];

export default function MadinahZiyaratPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#1C1C1C] pb-24">
      <JsonLd
        data={[
          serviceSchema({
            name: "Madinah Ziyarat Taxi Tours",
            description:
              "Private transport for Madinah Ziyarat: a car and driver take you between Quba Mosque, Masjid al-Qiblatayn, the Seven Mosques area and Mount Uhud and wait at each stop. Transport only — no guide or religious guidance. Coordinated through a vetted partner network.",
            path: "/services/madinah-ziyarat",
            serviceType: "Ziyarat transportation",
            areaServed: ["Madinah"],
          }),
          speakableSchema({ path: "/services/madinah-ziyarat" }),
        ]}
      />
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Services", href: "/services" },
          { name: "Madinah Ziyarat", href: "/services/madinah-ziyarat" },
        ]}
      />
      <section className="relative pt-32 pb-20 overflow-hidden border-b border-[#C9A84C]/10">
        <div className="absolute inset-0 z-0">
          <Image
            src="/locations/madinah-og.webp"
            alt="Sunlit umbrella canopies in the courtyard of Al-Masjid an-Nabawi in Madinah"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAF7] via-[#FAFAF7]/75 to-[#FAFAF7]/55" />
        </div>

        <div className="section-container relative z-10 max-w-5xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 backdrop-blur-md px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#16A34A] mb-6">
            <Compass className="h-3 w-3" /> Spiritual Journey
          </span>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Madinah Ziyarat <br />
            <span className="text-[#16A34A]">Taxi Tours</span>
          </h1>
          <p className="max-w-2xl mx-auto text-sm md:text-base text-[#6B7280] leading-relaxed mb-8">
            A private car between the Madinah sites you choose — Quba, Masjid al-Qiblatayn, the Seven Mosques area and Mount Uhud — waiting at each stop. Transport only: we do not provide a guide or religious guidance.
          </p>
          <div className="max-w-2xl mx-auto mb-10 text-left">
            <TLDRSummary
              answer="A Madinah Ziyarat trip by private car takes you between Quba Mosque, Masjid al-Qiblatayn, the Seven Mosques area and Mount Uhud, with the car waiting at each stop and pickup from your hotel. A half-day usually covers the main sites. We provide the transport only, and confirm one fixed fare on WhatsApp before booking."
              facts={[
                { label: "Plan", value: "Half-day or full-day" },
                { label: "Main sites", value: "Quba · Qiblatayn · Seven Mosques · Uhud" },
                { label: "Pickup", value: "Your hotel" },
                { label: "Service", value: "Transport only" },
              ]}
            />
          </div>
          <div className="flex justify-center gap-4">
            <a
              href={`https://wa.me/${contactConfig.whatsappNumber}?text=${encodeURIComponent("Salam, I'd like to book a Madinah Ziyarat tour. My hotel and preferred date are:")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-lg"
            >
              Plan My Ziyarat on WhatsApp
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
      {/* Planner */}
      <section id="planner" aria-labelledby="planner-heading" className="section-container max-w-6xl py-20 border-b border-[#C9A84C]/10 scroll-mt-24">
        <div className="mb-8 max-w-3xl">
          <p className="mb-3 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[#16A34A]">Ziyarat stop planner</p>
          <h2 id="planner-heading" className="font-heading text-[1.75rem] font-bold leading-tight md:text-[2.25rem]">Choose your Madinah Ziyarat stops</h2>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-[#6B7280]">Tick the sites, choose half-day or full-day, and send the plan on WhatsApp. No price is calculated here — we confirm one fixed fare before booking.</p>
        </div>
        <ZiyaratPlanner whatsappLink={contactConfig.whatsappLink} formHref="#quote" />
      </section>

      {/* Site cards */}
      <section aria-labelledby="sites-heading" className="section-container max-w-6xl py-20 border-b border-[#C9A84C]/10">
        <h2 id="sites-heading" className="font-heading text-[1.75rem] font-bold leading-tight md:text-[2.25rem] mb-3">The sites the car can take you to</h2>
        <p className="mb-8 max-w-3xl text-sm leading-relaxed text-[#6B7280]">Distances are approximate road distances from Al-Masjid an-Nabawi; travel times assume no traffic. Opening and access arrangements at each site are set by the authorities and can change, so we do not list hours.</p>
        <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ZIYARAT_STOPS.filter((st) => st.id !== "dhul-hulayfah").map((st) => (
            <li key={st.id} className="rounded-3xl border border-[#16A34A]/12 bg-white p-6">
              <Landmark className="h-6 w-6 text-[#16A34A]" aria-hidden="true" />
              <h3 className="mt-3 font-heading text-base font-bold">{st.name}</h3>
              <p className="mt-0.5 text-[0.75rem] text-[#9CA3AF]" lang="ar">{st.nameAr}</p>
              <p className="mt-3 text-sm leading-relaxed text-[#4B5563]">{st.about}</p>
              <p className="mt-3 text-[0.8rem] font-semibold text-[#15803D]">About {st.km} km · ~{st.min} min</p>
              <p className="mt-2 text-[0.8rem] leading-relaxed text-[#6B7280]">{st.transport}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Half vs full day */}
      <section aria-labelledby="length-heading" className="section-container max-w-5xl py-20 border-b border-[#C9A84C]/10">
        <h2 id="length-heading" className="font-heading text-[1.75rem] font-bold leading-tight md:text-[2.25rem] mb-8">Half-day or full-day Ziyarat?</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {HALF_FULL.map((o) => (
            <article key={o.title} className={`rounded-3xl border border-[#16A34A]/15 p-6 md:p-8 ${o.tone}`}>
              <h3 className="font-heading text-xl font-bold">{o.title}</h3>
              <ul className="mt-4 space-y-2 text-sm text-[#374151]">
                {o.when.map((w) => <li key={w} className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#16A34A]" aria-hidden="true" />{w}</li>)}
              </ul>
            </article>
          ))}
        </div>
        <div className="mt-6"><a href="#planner" className="btn btn-primary btn-lg">Plan My Ziyarat</a></div>
      </section>

      {/* Families & elderly */}
      <section aria-labelledby="family-heading" className="section-container max-w-5xl py-20 border-b border-[#C9A84C]/10">
        <div className="flex items-start gap-4">
          <Users className="mt-1 h-7 w-7 shrink-0 text-[#16A34A]" aria-hidden="true" />
          <div>
            <h2 id="family-heading" className="font-heading text-[1.75rem] font-bold leading-tight md:text-[2.1rem]">Ziyarat with families and elderly travellers</h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#4B5563]">One vehicle for the whole day means no changing cars, space for bags and water, and a driver who waits while you pray or rest. Tell us who is travelling — for example how many elders or children — and we suggest an SUV or van and plan longer stops. We cannot make accessibility guarantees at the sites themselves, which depend on each site and the authorities.</p>
            <p className="mt-3 text-sm text-[#4B5563]">See also <Link href="/locations/madinah" className="font-semibold text-[#15803D] hover:underline">all Madinah transfers</Link>, a <Link href="/locations/madinah/private-driver" className="font-semibold text-[#15803D] hover:underline">private driver by the hour</Link>, <Link href="/airports/prince-mohammad-madinah" className="font-semibold text-[#15803D] hover:underline">Madinah Airport (MED) transfers</Link>, the <Link href="/guides/madinah-ziyarat-sites-guide" className="font-semibold text-[#15803D] hover:underline">Ziyarat sites guide</Link>, <Link href="/services/badr-ziyarat" className="font-semibold text-[#15803D] hover:underline">Badr Ziyarat</Link> and the <Link href="/guides/dhul-hulaifah-miqat-madinah" className="font-semibold text-[#15803D] hover:underline">Dhul Hulaifah (Abyar Ali) Miqat guide</Link>.</p>
          </div>
        </div>
      </section>

      <JsonLd data={faqSchema(SITE_FAQS)} />
      <section className="section-container max-w-4xl py-20 border-t border-[#C9A84C]/10">
        <h2 className="font-heading text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {SITE_FAQS.map((f, i) => (
            <div key={i} className="bg-white border border-[#16A34A]/12 rounded-2xl p-6">
              <h3 className="font-bold text-[#1C1C1C] mb-2">{f.question}</h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">{f.answer}</p>
            </div>
          ))}
        </div>
      </section>
      {/* On-page lead form + group Path B */}
      <section id="quote" className="section-container max-w-5xl pb-16 scroll-mt-24">
        <div className="bg-[#F0FDF4] border border-[#16A34A]/20 rounded-3xl p-6 sm:p-8">
          <div className="text-center mb-6">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-[#1C1C1C] mb-3">Plan your Madinah Ziyarat</h2>
            <p className="text-sm text-[#6B7280] max-w-xl mx-auto leading-relaxed">Fill a few details for a fast WhatsApp quote — a private half-day or full-day Ziyarat trip with a professional driver, hotel pickup, and the car waiting between sites. Families and groups can request a written quote.</p>
          </div>
          <WhatsAppQuoteForm defaultPickup="Madinah hotel" defaultDropoff="Madinah Ziyarat tour" />
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a href={`https://wa.me/${contactConfig.whatsappNumber}?text=${encodeURIComponent("Salam! Madinah Ziyarat tour enquiry.\n• Madinah hotel: \n• Date: \n• Passengers: \n• Half-day or full-day?: \n• Sites (Quba / Uhud / Qiblatain / Seven Mosques): ")}`} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg">Book Ziyarat on WhatsApp</a>
            <a href={`mailto:${contactConfig.email}?subject=${encodeURIComponent("Madinah Ziyarat tour enquiry")}&body=${encodeURIComponent("Hello Taxi Saudi Arabia team,\n\nWe'd like a private Madinah Ziyarat tour.\n\n• Group / family name: \n• Contact name: \n• Madinah hotel: \n• Date: \n• Number of passengers: \n• Half-day or full-day?: \n• Sites of interest (Quba / Uhud / Qiblatain / Seven Mosques): \n\nPlease confirm a fixed fare before booking.\n\nThank you.")}`} className="btn btn-secondary btn-lg">Email a group enquiry</a>
          </div>
        </div>
      </section>
      <ServiceRelatedLinks currentPath="/services/madinah-ziyarat" />
    </div>
  );
}
