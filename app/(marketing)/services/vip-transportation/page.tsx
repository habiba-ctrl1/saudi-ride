import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { ServiceRelatedLinks } from "@/components/seo/ServiceRelatedLinks";
import { serviceSchema, faqSchema, speakableSchema } from "@/lib/schema";
import { TLDRSummary } from "@/components/seo/TLDRSummary";
import { VIPPlanForm } from "@/components/services/VIPPlanForm";
import { Star, ShieldCheck, Clock, Crown, MessageCircle, Users, Briefcase, MapPin, ClipboardList } from "lucide-react";
import { contactConfig } from "@/lib/config/contact";
import { FLEET_VEHICLES } from "@/lib/fleet-data";

const waLink = (msg: string) =>
  `https://wa.me/${contactConfig.whatsappNumber}?text=${encodeURIComponent(msg)}`;

const CANONICAL = "https://taxisaudiarabia.com/services/vip-transportation";
const TITLE = "VIP Transportation Riyadh | Chauffeur & Event Transport";
const DESCRIPTION = "VIP transportation in Riyadh — luxury chauffeur-driven Mercedes-Maybach, S-Class, Range Rover & Lexus for corporate events, conferences, weddings & airport arrivals. Tailored quotes.";
const OG_IMAGE = "https://taxisaudiarabia.com/services/vip-luxury-hero.webp";

export const metadata: Metadata = {
  alternates: { canonical: CANONICAL },
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    url: CANONICAL,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "VIP transportation and luxury chauffeur service in Riyadh" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
};

const RIYADH_VIP_SLUGS = ["mercedes-maybach-s-class", "range-rover-autobiography", "lexus-lx-600"];
const RIYADH_VIP_FLEET = RIYADH_VIP_SLUGS
  .map((slug) => FLEET_VEHICLES.find((v) => v.slug === slug))
  .filter((v): v is NonNullable<typeof v> => Boolean(v));

const FEATURES = [
  { icon: Crown, title: "Luxury Fleet", desc: "Mercedes-Maybach, S-Class, Range Rover and Lexus — maintained to a flagship standard." },
  { icon: Star, title: "Executive Chauffeurs", desc: "Trained, bilingual, discreet chauffeurs dedicated to your comfort, privacy and schedule." },
  { icon: Clock, title: "Standby & Full-Day", desc: "Hourly charter, half-day, full-day and multi-day standby built around your itinerary." },
  { icon: ShieldCheck, title: "Protocol & Discretion", desc: "Confidential handling, priority routing and coordination for high-profile guests." },
];

// Why VIP transportation is a different discipline from a normal transfer.
const WHY_DIFFERENT = [
  "Fixed schedules across a full day or multi-day agenda",
  "Multiple pickups and drop-offs coordinated in sequence",
  "Airport & flight monitoring with meet & greet",
  "Hotel and venue access coordination",
  "VIP entrances and designated drop-off points",
  "Driver standby between engagements",
  "Last-minute itinerary changes handled calmly",
  "Multi-vehicle coordination for groups and delegations",
];

// "What we coordinate" — the arrival-logistics journey.
const JOURNEY = [
  { n: "01", title: "Planning", desc: "Guest list, itinerary and vehicle allocation confirmed in advance." },
  { n: "02", title: "Airport", desc: "Flight monitoring and meet & greet at King Khalid International (RUH)." },
  { n: "03", title: "Chauffeur", desc: "A professional, bilingual chauffeur assigned to your vehicle." },
  { n: "04", title: "Event Arrival", desc: "Venue access coordination and a designated VIP drop-off." },
  { n: "05", title: "Standby", desc: "The driver remains available wherever your schedule requires." },
  { n: "06", title: "Departure", desc: "Coordinated return transfers and onward journeys." },
];

// High-intent scenarios with real itinerary flow (semantic depth, not thin pages).
const USE_CASES = [
  { title: "Corporate Executives", flow: "Airport → hotel → office → meeting → dinner → airport", desc: "A fixed multi-day schedule with the same chauffeur and priority routing between engagements." },
  { title: "VIP Speakers & Guests", flow: "Airport meet & greet → hotel → conference → return", desc: "Standby between sessions and calm handling of stage timings and last-minute changes." },
  { title: "Exhibitions & Conferences", flow: "Airport → hotel → RICEC / venue → meetings → return", desc: "Coordinated across concentrated arrival windows for delegates and exhibitors in Riyadh." },
  { title: "Weddings & Celebrations", flow: "Bride & groom → family → VIP guests → venue → hotel", desc: "A flagship arrival car plus coordinated guest transport for the whole occasion." },
  { title: "Delegations", flow: "Multiple vehicles → synchronised routes → coordinator", desc: "Group movement with a dedicated coordinator keeping every vehicle on schedule." },
  { title: "VVIP Guests", flow: "Dedicated chauffeur → premium vehicle → discreet handling", desc: "Protocol-ready, confidential coordination for principals and high-profile arrivals." },
];

const RIYADH_VIP_CLIENTS = [
  { title: "Business & Corporate Visitors", desc: "Executives visiting KAFD, Olaya, and the Diplomatic Quarter for meetings, roadshows, and multi-day agendas." },
  { title: "Government & Diplomatic Delegations", desc: "Ministries, embassies, and official delegations needing discreet, protocol-ready movement across Riyadh." },
  { title: "Conference & Event Guests", desc: "VIP attendees and speakers at LEAP, RICEC, and Riyadh exhibitions who need reliable point-to-point transport." },
  { title: "Weddings & Private Events", desc: "Bride & groom arrival cars and family VIP transport for Riyadh weddings and celebrations." },
  { title: "Airport VIP Arrivals (RUH)", desc: "First-class meet & greet from King Khalid International Airport to Riyadh hotels, residences, and offices." },
  { title: "Luxury Hotel Guests & GCC Visitors", desc: "Guests of the Ritz-Carlton, Four Seasons, and Fairmont, plus GCC and international visitors expecting premium standards." },
];

const COVERAGE = [
  "King Khalid Int'l Airport (RUH)", "KAFD", "Olaya", "Diplomatic Quarter (DQ)",
  "RICEC", "ROSHN Front", "Ritz-Carlton Riyadh", "Four Seasons (Kingdom Tower)",
  "Fairmont Riyadh", "Boulevard / Riyadh Season",
];

const FAQS = [
  { question: "What is VIP transportation in Riyadh?", answer: "VIP transportation is chauffeur-driven luxury transport coordinated around an itinerary — airport meet & greet, hotel and venue transfers, standby, and multi-vehicle movement — using vehicles such as the Mercedes-Maybach, S-Class, Range Rover, and Lexus. It is arrival logistics, not just a single ride." },
  { question: "Which vehicles do you use for VIP transportation?", answer: "For Riyadh VIP movement we arrange the Mercedes-Maybach S-Class, Range Rover Autobiography, and Lexus LX 600, plus the Mercedes S-Class, Cadillac Escalade, and GMC Yukon for larger parties — all with professional chauffeurs, subject to availability." },
  { question: "Can you handle event and delegation transport with multiple vehicles?", answer: "Yes. We coordinate multi-vehicle movement with synchronised routes and a dedicated coordinator for corporate events, conferences, exhibitions, weddings, and government delegations across Riyadh." },
  { question: "Do you offer VIP airport transfers at King Khalid International (RUH)?", answer: "Yes. We provide flight monitoring and meet & greet at RUH, then a chauffeured transfer to your hotel, residence, office, or venue in Riyadh." },
  { question: "Can I book by the hour, half-day, or full-day?", answer: "Yes. We offer hourly charter, half-day, full-day, and multi-day standby so a chauffeur and vehicle stay dedicated to your schedule throughout." },
  { question: "How much does VIP transportation cost in Riyadh?", answer: "Pricing depends on the vehicle, hours, standby, number of vehicles, and itinerary, so we provide a tailored quote rather than fixed online pricing — no hidden fees and no surge. Send your plan on WhatsApp for a clear quote." },
];

export default function VIPTransportationPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#1C1C1C] pb-24">
      <JsonLd
        data={[
          serviceSchema({
            name: "VIP Transportation Riyadh",
            description:
              "VIP transportation and luxury chauffeur service in Riyadh — Mercedes-Maybach S-Class, Range Rover Autobiography, Lexus LX 600, and Mercedes S-Class with executive chauffeurs, coordinated for corporate events, conferences, exhibitions, weddings, and airport arrivals.",
            path: "/services/vip-transportation",
            serviceType: "VIP Transportation",
            areaServed: ["Riyadh"],
          }),
          speakableSchema({ path: "/services/vip-transportation" }),
        ]}
      />
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Services", href: "/services" },
          { name: "VIP Transportation", href: "/services/vip-transportation" },
        ]}
      />

      {/* ─── HERO ──────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 overflow-hidden border-b border-[#C9A84C]/10">
        <div className="absolute inset-0 z-0">
          <Image src="/services/vip-luxury-hero.webp" alt="VIP transportation in Riyadh" fill className="object-cover opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAF7] via-[#FAFAF7]/55 to-[#FAFAF7]/15" />
        </div>

        <div className="section-container relative z-10 max-w-5xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 backdrop-blur-md px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#16A34A] mb-6">
            <MapPin className="h-3 w-3" /> Riyadh · VIP & Event Transport
          </span>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            VIP Transportation <br />
            <span className="text-[#16A34A]">in Riyadh</span>
          </h1>
          <p className="max-w-2xl mx-auto text-sm md:text-base text-[#6B7280] leading-relaxed mb-6">
            Luxury chauffeur-driven transportation for executives, VIP guests, speakers, delegates, and private clients — coordinated around your itinerary.
          </p>
          <p className="max-w-2xl mx-auto text-xs md:text-sm font-semibold text-[#1C1C1C] mb-8">
            Mercedes-Maybach · Mercedes S-Class · Range Rover · Lexus · Premium SUVs
          </p>
          <div className="max-w-2xl mx-auto mb-10 text-left">
            <TLDRSummary
              answer="VIP transportation in Riyadh is chauffeur-driven luxury transport (Mercedes-Maybach, S-Class, Range Rover, Lexus) coordinated around an itinerary — airport meet & greet, hotel and venue transfers, standby, and multi-vehicle movement for corporate events, conferences, weddings, and delegations."
              facts={[
                { label: "Fleet", value: "Maybach / S-Class / Range Rover / Lexus" },
                { label: "Booking", value: "Hourly · Full-day · Multi-day" },
                { label: "For", value: "Events · Corporate · Airport · Weddings" },
              ]}
            />
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <a
              href="#plan"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#16A34A] px-8 py-3.5 text-xs font-bold uppercase text-white hover:bg-[#15803D] transition-all shadow-[0_4px_20px_rgba(22,163,74,0.3)]"
            >
              <ClipboardList className="h-4 w-4" /> Request a VIP Transportation Plan
            </a>
            <a
              href={waLink("Salam, I'd like to arrange VIP transportation in Riyadh. My date, itinerary and vehicle preference are:")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#C9A84C]/40 px-8 py-3.5 text-xs font-bold uppercase text-[#16A34A] hover:bg-[#C9A84C]/10 transition-all"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp Our Transport Team
            </a>
          </div>
        </div>
      </section>

      {/* ─── FEATURES ──────────────────────────────────────────────── */}
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

      {/* ─── WHY DIFFERENT ─────────────────────────────────────────── */}
      <section className="section-container max-w-7xl py-20 border-b border-[#C9A84C]/10">
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 items-center">
          <div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              Why VIP transportation is <span className="text-[#16A34A]">different for events</span>
            </h2>
            <p className="text-sm md:text-base text-[#6B7280] leading-relaxed">
              A VIP itinerary is not a single ride. It is a schedule that has to hold together across a full day or
              several days — airports, hotels, venues, standby, and changes handled without a hitch. That coordination
              is the service.
            </p>
          </div>
          <ul className="grid sm:grid-cols-2 gap-3">
            {WHY_DIFFERENT.map((w) => (
              <li key={w} className="flex items-start gap-2.5 rounded-2xl border border-[#C9A84C]/12 bg-white p-4 text-sm text-[#6B7280]">
                <span className="text-[#C9A84C] font-bold shrink-0">✓</span>
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ─── WHAT WE COORDINATE (JOURNEY) ──────────────────────────── */}
      <section className="section-container max-w-7xl py-20 border-b border-[#C9A84C]/10">
        <div className="max-w-3xl mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">What We Coordinate</h2>
          <p className="text-sm md:text-base text-[#6B7280] leading-relaxed">
            From planning to departure, every VIP journey follows a controlled, six-stage process.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {JOURNEY.map((s) => (
            <div key={s.n} className="relative rounded-3xl border border-[#C9A84C]/12 bg-white p-7 hover:border-[#16A34A]/35 transition-colors">
              <span className="font-heading text-4xl font-bold text-[#C9A84C]/35">{s.n}</span>
              <h3 className="font-heading text-lg font-bold mt-2 mb-2 text-[#1C1C1C]">{s.title}</h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── RIYADH VIP FLEET ──────────────────────────────────────── */}
      <section className="section-container max-w-7xl py-20 border-b border-[#C9A84C]/10">
        <div className="max-w-3xl mb-12">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#16A34A] mb-5">
            <Crown className="h-3 w-3" /> Luxury Fleet · Riyadh
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            The Riyadh VIP Fleet — <span className="text-[#16A34A]">Maybach, Range Rover & Lexus</span>
          </h2>
          <p className="text-sm md:text-base text-[#6B7280] leading-relaxed">
            Three flagship vehicles with a professional chauffeur for VIP movement inside Riyadh — the
            Mercedes-Maybach S-Class for principals and VVIP arrivals, the Range Rover Autobiography for premium SUV
            presence, and the Lexus LX 600 for executive comfort. Arranged for <strong className="text-[#1C1C1C]">Riyadh
            city transport</strong>: airport pickups, hotel transfers, meetings, weddings, and events.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {RIYADH_VIP_FLEET.map((v) => (
            <article key={v.slug} className="group flex flex-col overflow-hidden rounded-3xl border border-[#C9A84C]/12 bg-white shadow-lg hover:border-[#16A34A]/35 transition-all">
              <div className="relative h-52 w-full overflow-hidden">
                <Image
                  src={v.image}
                  alt={`${v.name} — VIP chauffeur in Riyadh`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute top-4 left-4">
                  <span className="rounded-full bg-[#16A34A] px-3 py-1 text-[0.6rem] font-bold uppercase tracking-wider text-white">{v.badge}</span>
                </div>
              </div>
              <div className="flex flex-col flex-1 p-6 space-y-4">
                <div>
                  <h3 className="font-heading text-xl font-bold text-[#1C1C1C] group-hover:text-[#16A34A] transition-colors">{v.name}</h3>
                  <p className="mt-1 text-[0.65rem] text-[#6B7280] font-semibold uppercase tracking-wide">{v.subtitle}</p>
                </div>
                <div className="flex items-center gap-5 border-y border-[#C9A84C]/8 py-3 text-xs text-[#6B7280] font-medium">
                  <div className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-[#C9A84C]/75" /><span>{v.passengers} Passengers</span></div>
                  <div className="h-3 w-px bg-[#C9A84C]/15" />
                  <div className="flex items-center gap-1.5"><Briefcase className="h-3.5 w-3.5 text-[#C9A84C]/75" /><span>{v.luggage} Bags</span></div>
                </div>
                <p className="text-[0.75rem] leading-relaxed text-[#6B7280]">{v.description}</p>
                <div className="mt-auto grid grid-cols-2 gap-3 pt-2">
                  <a
                    href={waLink(`Salam, I'd like a Riyadh VIP chauffeur in the ${v.name}. My date, time and pickup are:`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 rounded-full bg-[#16A34A] py-3 text-[0.65rem] font-bold uppercase tracking-wider text-white transition-all hover:bg-[#15803D]"
                  >
                    <MessageCircle className="h-3.5 w-3.5 fill-current" /> Reserve
                  </a>
                  <Link
                    href={`/fleet/${v.slug}`}
                    className="flex items-center justify-center gap-1.5 rounded-full border border-[#C9A84C]/30 bg-white py-3 text-[0.65rem] font-bold uppercase tracking-wider text-[#16A34A] transition-all hover:bg-[#C9A84C]/10"
                  >
                    Details
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-[#6B7280]">
          Larger party or delegation? We also arrange the Mercedes S-Class, Cadillac Escalade, GMC Yukon, and V-Class —{" "}
          <Link href="/fleet" className="font-bold text-[#16A34A] hover:underline">see the full fleet</Link>.
        </p>
      </section>

      {/* ─── USE CASES ─────────────────────────────────────────────── */}
      <section className="section-container max-w-7xl py-20 border-b border-[#C9A84C]/10">
        <div className="max-w-3xl mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">VIP Transportation Use Cases</h2>
          <p className="text-sm md:text-base text-[#6B7280] leading-relaxed">
            However your itinerary is shaped, we build the vehicle, chauffeur, and standby plan around it.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {USE_CASES.map((u) => (
            <div key={u.title} className="rounded-3xl border border-[#16A34A]/12 bg-white p-7 hover:border-[#16A34A]/35 transition-colors">
              <h3 className="font-heading text-lg font-bold mb-2 text-[#1C1C1C]">{u.title}</h3>
              <p className="text-[0.7rem] font-bold uppercase tracking-wide text-[#16A34A] mb-3">{u.flow}</p>
              <p className="text-sm text-[#6B7280] leading-relaxed">{u.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── WHO BOOKS ─────────────────────────────────────────────── */}
      <section className="section-container max-w-7xl py-20 border-b border-[#C9A84C]/10">
        <div className="max-w-3xl mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Who Books VIP Transportation in Riyadh</h2>
          <p className="text-sm md:text-base text-[#6B7280] leading-relaxed">
            Trusted by clients who expect discretion, punctuality, and a premium standard for every journey in the capital.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {RIYADH_VIP_CLIENTS.map((c) => (
            <div key={c.title} className="bg-white border border-[#16A34A]/12 rounded-3xl p-7 hover:border-[#16A34A]/35 transition-colors">
              <h3 className="font-heading text-lg font-bold mb-2 text-[#1C1C1C]">{c.title}</h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── COVERAGE ──────────────────────────────────────────────── */}
      <section className="section-container max-w-5xl py-20 border-b border-[#C9A84C]/10 text-center">
        <h2 className="font-heading text-3xl font-bold mb-4">Riyadh Coverage</h2>
        <p className="text-sm text-[#6B7280] leading-relaxed max-w-2xl mx-auto mb-8">
          Airport, business districts, venues, and the city&apos;s leading hotels — with priority routing throughout Riyadh.
        </p>
        <div className="flex flex-wrap justify-center gap-2.5">
          {COVERAGE.map((c) => (
            <span key={c} className="rounded-full border border-[#C9A84C]/25 bg-white px-4 py-2 text-xs font-semibold text-[#1C1C1C]">{c}</span>
          ))}
        </div>
      </section>

      {/* ─── ENQUIRY FORM ──────────────────────────────────────────── */}
      <section id="plan" className="section-container max-w-4xl py-20 border-b border-[#C9A84C]/10 scroll-mt-24">
        <div className="rounded-3xl border border-[#16A34A]/15 bg-white p-8 md:p-12 shadow-2xl">
          <div className="text-center mb-8">
            <span className="text-[0.65rem] uppercase tracking-[0.2em] text-[#16A34A] font-bold">No fixed online pricing</span>
            <h2 className="font-heading text-3xl font-bold mt-2 mb-3 text-[#1C1C1C]">Request a VIP Transportation Plan</h2>
            <p className="text-sm text-[#6B7280] max-w-lg mx-auto">
              Tell us your itinerary and we&apos;ll reply with a tailored quote — the right vehicle, chauffeur, and standby plan for your event.
            </p>
          </div>
          <VIPPlanForm />
        </div>
      </section>

      {/* ─── FAQ ───────────────────────────────────────────────────── */}
      <JsonLd data={faqSchema(FAQS)} />
      <section className="section-container max-w-4xl py-20">
        <h2 className="font-heading text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {FAQS.map((f, i) => (
            <div key={i} className="bg-white border border-[#16A34A]/12 rounded-2xl p-6">
              <h3 className="font-bold text-[#1C1C1C] mb-2">{f.question}</h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">{f.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <ServiceRelatedLinks currentPath="/services/vip-transportation" />
    </div>
  );
}
