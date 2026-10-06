import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageCircle, MapPin, PlaneLanding, Mail, Train, Car, CalendarDays, Waves, Building2 } from "lucide-react";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqSchema, speakableSchema, itemListSchema } from "@/lib/schema";
import { contactConfig } from "@/lib/config/contact";
import { FLEET_VEHICLES } from "@/lib/fleet-data";
import { routeFact, reverseSlug, distanceGuideFor, CORPORATE_INVOICE_LINE } from "@/lib/data/cluster";
import {
  JEDDAH_FACTS,
  JEDDAH_TRIPS,
  JED_FLOW,
  CORRIDORS,
  COAST_STOPS,
  INLAND_AREAS,
  HOTEL_LEGS,
  JEDDAH_DEST_GROUPS,
  JEDDAH_VEHICLE_FIT,
  JEDDAH_TIMING,
  TRAIN_VS_CAR,
  JEDDAH_VISITOR_GUIDE,
  JEDDAH_BOOKING_STEPS,
  JEDDAH_HUB_FAQS,
  JEDDAH_GUIDES,
  JED_CITY,
  JED_MAKKAH,
  JEDDAH_MADINAH,
  FREE_WAIT,
} from "@/lib/data/jeddah-cluster";
import { TripTypeSelector } from "./TripTypeSelector";
import { AirportFlow } from "./AirportFlow";
import { TripDecision } from "./TripDecision";
import { DestinationExplorer, type ExplorerGroup } from "./DestinationExplorer";
import { VehicleFitTool, type FitOption } from "./VehicleFitTool";
import { SectionHeader, FactsStrip, FaqList, QuoteSection, wa } from "./ui";

const SITE = "https://taxisaudiarabia.com";
const PATH = "/locations/jeddah";
const HUB_WA = "Salam! Jeddah transport enquiry.\n• From (JED / hotel / address): \n• To: \n• Date & time: \n• Passengers & bags: \n• Flight number (if airport): ";

// Jeddah hub — built around the city's real journeys: the JED arrival, the
// Makkah and Madinah corridors, hotel legs, and the coast. Title/H1 kept from
// the ranking version (rule 3: GSC pos ~56, title kept anyway — it already
// matches "taxi jeddah" / "jeddah chauffeur" queries).
export function JeddahHub({ name, nameAr }: { name: string; nameAr: string }) {
  const groups: ExplorerGroup[] = JEDDAH_DEST_GROUPS.map((g) => ({
    id: g.id,
    label: g.label,
    intro: g.intro,
    items: g.items
      .map((d) => {
        const f = routeFact(d.slug);
        if (!f) return null;
        return { ...d, km: f.km, time: f.time, distanceSlug: distanceGuideFor(d.slug), reverseSlug: reverseSlug(d.slug) };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null)
      .sort((a, b) => a.km - b.km),
  }));
  const allRoutes = groups.flatMap((g) => g.items);
  const fitOptions: FitOption[] = JEDDAH_VEHICLE_FIT.map((v) => {
    const fleet = FLEET_VEHICLES.find((f) => f.slug === v.fleetSlug);
    return { id: v.id, label: v.label, forWho: v.forWho, href: v.href, passengers: fleet?.passengers ?? 0, luggage: fleet?.luggage ?? 0 };
  });
  const corridors = CORRIDORS.map((c) => ({ ...c, f: routeFact(c.slug) })).filter((c) => c.f);
  const hotelLegs = HOTEL_LEGS.map((h) => ({ ...h, f: routeFact(h.slug) })).filter((h) => h.f);
  const maxCorridor = Math.max(...corridors.map((c) => c.f!.km));

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "TaxiService",
      "@id": `${SITE}${PATH}#service`,
      name: "Private transfers & chauffeur service in Jeddah",
      description:
        "Pre-booked private transfers from King Abdulaziz International Airport (JED), Jeddah–Makkah and Jeddah–Madinah transfers, hotel transfers, private drivers by the hour and intercity cars, coordinated through a vetted partner network. Fare agreed before booking.",
      url: `${SITE}${PATH}`,
      provider: { "@type": "Organization", name: "Taxi Saudi Arabia", url: SITE },
      areaServed: { "@type": "City", name: "Jeddah", geo: { "@type": "GeoCoordinates", latitude: 21.4858, longitude: 39.1925 } },
      availableLanguage: ["English", "Arabic"],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Jeddah transport services",
        itemListElement: JEDDAH_TRIPS.filter((t) => t.href.startsWith("/")).map((t) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: t.label, url: `${SITE}${t.href}` },
        })),
      },
    },
    speakableSchema({ path: PATH }),
    itemListSchema(allRoutes.map((r) => ({ name: `${r.from ?? "Jeddah"} to ${r.name}`, href: `/routes/${r.slug}` }))),
    faqSchema(JEDDAH_HUB_FAQS),
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#1C1C1C]">
      <JsonLd data={schema} />

      {/* ─── HERO ─────────────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden bg-[#0B1F14]">
        <Image
          src="/locations/jeddah-hero.webp"
          alt="The Jeddah Corniche promenade with Red Sea waves breaking on the rocks and towers along the shore"
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover object-[70%_62%]"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#0B1F14] via-[#0B1F14]/80 to-[#0B1F14]/10" aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-[#0B1F14] to-transparent" aria-hidden="true" />

        <Breadcrumbs
          className="relative [&_a]:text-white/70 [&_a:hover]:text-white [&_span]:text-[#FACC15]"
          items={[
            { name: "Home", href: "/" },
            { name: "Locations", href: "/locations" },
            { name, href: PATH },
          ]}
        />

        <div className="section-container relative max-w-6xl pb-16 pt-6 md:pb-24 md:pt-10">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3.5 py-1.5 text-[0.7rem] font-bold uppercase tracking-[0.18em] text-[#FACC15] backdrop-blur">
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" /> Jeddah · {nameAr}
            </p>
            <h1 className="mt-5 font-heading text-[2.25rem] font-bold leading-[1.08] text-[#FFFFFF] sm:text-5xl md:text-[3.5rem]">
              Private Taxi &amp; Chauffeur Service in <span className="text-[#FACC15]">Jeddah</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/85 md:text-lg">
              Pre-booked private cars for international visitors, Umrah travellers, families, business travellers and companies — from JED arrivals to Makkah, Madinah, your hotel or a day around the city. One fare, agreed before you book.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#quote" className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-[#FACC15] px-7 text-sm font-bold uppercase tracking-wider text-[#0B1F14] transition-colors hover:bg-[#FDE047] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1F14]">
                Get My Private Transfer Quote <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <a href={wa(HUB_WA)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full border border-white/30 bg-white/5 px-7 text-sm font-bold uppercase tracking-wider text-[#FFFFFF] backdrop-blur transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                <MessageCircle className="h-4 w-4" aria-hidden="true" /> WhatsApp us
              </a>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-[0.8rem] text-white/80">
              {["We track your flight", `${FREE_WAIT} free waiting`, "English & Arabic drivers", "24/7"].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#FACC15]" aria-hidden="true" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ─── SHORT ANSWER + FACTS ─────────────────────────────────── */}
      <section aria-labelledby="answer-heading" className="section-container relative z-10 -mt-8 max-w-6xl">
        <div className="rounded-[2rem] border border-[#16A34A]/15 bg-white p-6 shadow-[0_30px_70px_-45px_rgba(15,23,42,0.5)] md:p-9">
          <div className="grid gap-6 md:grid-cols-[auto_1fr] md:gap-8">
            <p id="answer-heading" className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[#16A34A] md:w-32 md:pt-1">The short answer</p>
            <p id="speakable-summary" className="text-[1.05rem] leading-relaxed text-[#1F2937] md:text-lg">
              Taxi Saudi Arabia arranges pre-booked private transport in Jeddah through a vetted partner network: airport transfers from King Abdulaziz International Airport (JED, about {JED_CITY.km} km from the centre), Jeddah–Makkah ({JED_MAKKAH.km} km from JED) and Jeddah–Madinah ({JEDDAH_MADINAH.km} km) transfers, hotel transfers, private drivers by the hour, and intercity cars. We track your flight, waiting is free for {FREE_WAIT}, and the fare is agreed on WhatsApp before you book.
            </p>
          </div>
          <div className="mt-7">
            <FactsStrip facts={JEDDAH_FACTS} />
          </div>
        </div>
      </section>

      <div className="section-container max-w-6xl space-y-20 py-20 md:space-y-28 md:py-28">
        {/* ─── TRIP SELECTOR ────────────────────────────────────── */}
        <section aria-labelledby="trip-heading">
          <SectionHeader id="trip-heading" eyebrow="Start here" title="Where does your Jeddah trip start — and where is it going?" intro="Pick the closest match. Each one tells you what to send for a quote and where the details live." />
          <TripTypeSelector trips={JEDDAH_TRIPS} whatsappLink={contactConfig.whatsappLink} />
        </section>
      </div>

      {/* ─── JED AIRPORT FLOW (dark band) ───────────────────────── */}
      <section aria-labelledby="airport-heading" className="relative overflow-hidden bg-[#0B1F14] py-20 md:py-24">
        <div className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-[#16A34A]/25 blur-3xl" aria-hidden="true" />
        <div className="section-container relative max-w-6xl">
          <SectionHeader
            tone="dark"
            id="airport-heading"
            eyebrow="King Abdulaziz International Airport (JED)"
            title="Your JED airport transfer, step by step"
            intro={`JED has Terminal 1, the North Terminal and a Hajj Terminal. Central Jeddah is about ${JED_CITY.km} km away; Makkah about ${JED_MAKKAH.km} km.`}
          />
          <AirportFlow arrival={JED_FLOW.arrival} departure={JED_FLOW.departure} code="JED" />
          <div className="mt-10 flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 md:flex-row md:items-center md:justify-between">
            <p className="text-sm leading-relaxed text-white/80">
              Landing late? Many JED arrivals are at night. Transfers run 24/7 and we track your flight, so the driver is there when you clear baggage — not when the timetable said.
            </p>
            <a href={wa(JEDDAH_TRIPS[0].waPrefill)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[44px] shrink-0 items-center justify-center gap-2 rounded-full bg-[#FACC15] px-5 text-xs font-bold uppercase tracking-wider text-[#0B1F14] hover:bg-[#FDE047] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
              Plan My Jeddah Airport Transfer
            </a>
          </div>
          <Link href="/airports/king-abdulaziz-jeddah" className="mt-5 inline-flex min-h-[44px] items-center gap-2 text-sm font-bold text-[#FACC15] hover:text-[#FDE047]">
            JED terminals and full arrival details <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <div className="section-container max-w-6xl space-y-20 py-20 md:space-y-28 md:py-28">
        {/* ─── MAKKAH & MADINAH CORRIDOR BOARD ──────────────────── */}
        <section aria-labelledby="corridor-heading">
          <SectionHeader id="corridor-heading" eyebrow="Makkah & Madinah" title="The two corridors most Jeddah visitors book" intro="Real distances and drive times from our route data. Each card opens the route page with its own quote form." />
          <ol className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {corridors.map((c) => (
              <li key={c.slug} className="group relative overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#16A34A]/40 hover:shadow-[0_14px_30px_-20px_rgba(15,23,42,0.45)] focus-within:border-[#16A34A]">
                <div className="flex items-center justify-between gap-3">
                  <Link href={`/routes/${c.slug}`} className="font-heading text-base font-bold text-[#1C1C1C] after:absolute after:inset-0 focus-visible:outline-none">
                    {c.label}
                  </Link>
                  <span className="shrink-0 text-right text-[0.8rem] font-semibold tabular-nums">
                    {c.f!.km} km <span className="block text-[0.7rem] font-normal text-[#6B7280]">{c.f!.time}</span>
                  </span>
                </div>
                {/* journey rail: origin → destination, scaled to distance */}
                <div className="mt-4 flex items-center gap-2" aria-hidden="true">
                  <span className="h-3 w-3 shrink-0 rounded-full border-2 border-[#16A34A] bg-white" />
                  <span className="relative h-1 flex-1 overflow-hidden rounded-full bg-[#F3F4F6]">
                    <span className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#16A34A] to-[#FACC15] transition-all duration-500 group-hover:opacity-90" style={{ width: `${Math.max(14, (c.f!.km / maxCorridor) * 100)}%` }} />
                  </span>
                  <span className="h-3 w-3 shrink-0 rounded-full bg-[#16A34A]" />
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[#4B5563]">{c.note}</p>
              </li>
            ))}
          </ol>

          {/* Honest comparison: Haramain train vs private car */}
          <div className="mt-10 overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white">
            <div className="flex flex-col gap-1 border-b border-[#E5E7EB] p-5 md:flex-row md:items-end md:justify-between md:p-6">
              <div>
                <h3 className="font-heading text-lg font-bold">Haramain train or a private car to Makkah?</h3>
                <p className="mt-1 text-sm text-[#6B7280]">The train leaves from a station connected to JED Terminal 1. Both are good options — they suit different travellers.</p>
              </div>
            </div>
            <table className="w-full text-left text-sm">
              <caption className="sr-only">Comparison of the Haramain train and a private car from Jeddah Airport to Makkah</caption>
              <thead className="hidden bg-[#F9FAFB] text-[0.7rem] uppercase tracking-[0.14em] text-[#6B7280] sm:table-header-group">
                <tr>
                  <th scope="col" className="px-5 py-3 font-bold">&nbsp;</th>
                  <th scope="col" className="px-5 py-3 font-bold"><span className="inline-flex items-center gap-1.5"><Car className="h-3.5 w-3.5 text-[#16A34A]" aria-hidden="true" /> Private car</span></th>
                  <th scope="col" className="px-5 py-3 font-bold"><span className="inline-flex items-center gap-1.5"><Train className="h-3.5 w-3.5 text-[#6B7280]" aria-hidden="true" /> Haramain train</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {TRAIN_VS_CAR.map((r) => (
                  <tr key={r.point} className="block p-4 sm:table-row sm:p-0">
                    <th scope="row" className="block font-semibold sm:table-cell sm:px-5 sm:py-4">{r.point}</th>
                    <td className="block pt-1 text-[#1F2937] sm:table-cell sm:px-5 sm:py-4"><span className="mr-1 text-[0.65rem] font-bold uppercase tracking-wider text-[#16A34A] sm:hidden">Car:</span>{r.car}</td>
                    <td className="block pt-1 text-[#4B5563] sm:table-cell sm:px-5 sm:py-4"><span className="mr-1 text-[0.65rem] font-bold uppercase tracking-wider text-[#9CA3AF] sm:hidden">Train:</span>{r.train}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a href={wa(JEDDAH_TRIPS[1].waPrefill)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[#16A34A] px-6 text-xs font-bold uppercase tracking-wider text-[#FFFFFF] hover:bg-[#15803D]">
              <MessageCircle className="h-4 w-4" aria-hidden="true" /> Get a Jeddah–Makkah Quote
            </a>
            <Link href="/guides/jeddah-airport-to-makkah-guide" className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-[#16A34A]/30 px-6 text-xs font-bold uppercase tracking-wider text-[#15803D] hover:bg-[#F0FDF4]">
              Car, train and bus compared <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </section>

        {/* ─── HOTEL TRANSFERS ──────────────────────────────────── */}
        <section id="hotels" aria-labelledby="hotels-heading" className="scroll-mt-24">
          <SectionHeader id="hotels-heading" eyebrow="Hotel transfers" title="From your Jeddah hotel to wherever is next" intro="Any single leg from a Jeddah hotel, priced as one fixed fare. Give us the hotel name and the driver comes to the right entrance." />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <ul className="divide-y divide-[#E5E7EB] overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white">
              {hotelLegs.map((h) => (
                <li key={h.slug}>
                  <Link href={`/routes/${h.slug}`} className="group flex min-h-[64px] items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-[#F0FDF4] focus-visible:bg-[#F0FDF4] focus-visible:outline-none">
                    <span>
                      <span className="block font-semibold text-[#1C1C1C] group-hover:text-[#15803D]">{h.label}</span>
                      <span className="block text-[0.8rem] text-[#6B7280]">{h.when}</span>
                    </span>
                    <span className="flex shrink-0 items-center gap-3 text-right text-[0.8rem] font-semibold tabular-nums">
                      <span>{h.f!.km} km<span className="block text-[0.7rem] font-normal text-[#6B7280]">{h.f!.time}</span></span>
                      <ArrowRight className="h-4 w-4 text-[#16A34A] transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="rounded-3xl bg-[#0B1F14] p-6 text-[#FFFFFF] md:p-8">
              <Building2 className="h-6 w-6 text-[#FACC15]" aria-hidden="true" />
              <p className="mt-4 font-heading text-xl font-bold text-[#FFFFFF]">Where Jeddah&apos;s hotels are</p>
              <ul className="mt-4 space-y-3 text-sm text-white/80">
                <li><Link href="/locations/jeddah/al-hamra" className="font-semibold text-[#FFFFFF] hover:text-[#FACC15]">Al Hamra Corniche</Link> — seafront hotels facing King Fahd&apos;s Fountain</li>
                <li><Link href="/locations/jeddah/al-shati" className="font-semibold text-[#FFFFFF] hover:text-[#FACC15]">Al Shati</Link> — the northern Corniche, Red Sea Mall</li>
                <li><Link href="/locations/jeddah/obhur" className="font-semibold text-[#FFFFFF] hover:text-[#FACC15]">Obhur</Link> — beach resorts near the airport</li>
                <li><Link href="/locations/jeddah/al-andalus" className="font-semibold text-[#FFFFFF] hover:text-[#FACC15]">Al Andalus</Link> — central, beside Al Andalus Mall</li>
              </ul>
              <a href={wa(JEDDAH_TRIPS[3].waPrefill)} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex min-h-[44px] items-center gap-2 rounded-full bg-[#FACC15] px-5 text-xs font-bold uppercase tracking-wider text-[#0B1F14] hover:bg-[#FDE047]">
                Request My Hotel Transfer Quote
              </a>
            </div>
          </div>
        </section>

        {/* ─── COAST STRIP (north → south) ──────────────────────── */}
        <section aria-labelledby="coast-heading">
          <SectionHeader id="coast-heading" eyebrow="Jeddah by area" title="The coast, north to south — and the districts inland" intro="Jeddah stretches along the Red Sea. Knowing roughly where your stop is makes timing and pickup easier." />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.3fr_0.7fr]">
            <ol className="relative space-y-3 pl-8" aria-label="Coastal areas from north to south">
              <span aria-hidden="true" className="absolute bottom-3 left-[11px] top-3 w-[3px] rounded-full bg-gradient-to-b from-[#38BDF8] via-[#0EA5E9] to-[#0369A1]" />
              <li className="relative -ml-8 flex items-center gap-2 pb-1 text-[0.7rem] font-bold uppercase tracking-[0.16em] text-[#0369A1]">
                <PlaneLanding className="h-4 w-4" aria-hidden="true" /> North · JED airport side
              </li>
              {COAST_STOPS.map((s) => (
                <li key={s.slug} className="relative">
                  <span aria-hidden="true" className="absolute -left-[27px] top-6 h-4 w-4 rounded-full border-[3px] border-[#FAFAF7] bg-[#0EA5E9]" />
                  <Link href={`/locations/jeddah/${s.slug}`} className="group flex items-start justify-between gap-4 rounded-2xl border border-[#E5E7EB] bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#0EA5E9]/50 hover:shadow-[0_14px_30px_-20px_rgba(15,23,42,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A]">
                    <span>
                      <span className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-[#0369A1]">{s.tag}</span>
                      <span className="mt-1 block font-heading text-base font-bold text-[#1C1C1C]">{s.name} <span className="font-normal text-[#9CA3AF]" lang="ar">{s.nameAr}</span></span>
                      <span className="mt-1 block text-sm leading-relaxed text-[#4B5563]">{s.what}</span>
                    </span>
                    <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-[#16A34A] transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </Link>
                </li>
              ))}
              <li className="relative -ml-8 flex items-center gap-2 pt-1 text-[0.7rem] font-bold uppercase tracking-[0.16em] text-[#0369A1]">
                <Waves className="h-4 w-4" aria-hidden="true" /> South · historic centre
              </li>
            </ol>
            <div>
              <p className="mb-3 text-[0.7rem] font-bold uppercase tracking-[0.16em] text-[#6B7280]">Inland districts</p>
              <ul className="grid grid-cols-1 gap-2">
                {INLAND_AREAS.map((a) => (
                  <li key={a.slug}>
                    <Link href={`/locations/jeddah/${a.slug}`} className="group flex min-h-[56px] items-center justify-between gap-3 rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 transition-colors hover:border-[#16A34A]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A]">
                      <span>
                        <span className="block text-sm font-semibold text-[#1C1C1C] group-hover:text-[#15803D]">{a.name}</span>
                        <span className="block text-[0.75rem] text-[#6B7280]">{a.what}</span>
                      </span>
                      <ArrowRight className="h-4 w-4 shrink-0 text-[#16A34A] transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href="/locations/jeddah/city-tour" className="mt-4 flex items-center justify-between gap-3 rounded-2xl bg-[#F0FDF4] p-4 text-sm font-semibold text-[#15803D] hover:bg-[#DCFCE7]">
                See the sights in one booking — Jeddah city tour by car <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        {/* ─── TRANSFER vs HOURLY vs CORPORATE ──────────────────── */}
        <section aria-labelledby="decide-heading">
          <SectionHeader id="decide-heading" eyebrow="Choose the right booking" title="One transfer, a driver by the hour, or a corporate arrangement?" />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.1fr]">
            <TripDecision city="jeddah" transferHref="#hotels" />
            <div className="overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white">
              <table className="w-full text-left text-sm">
                <caption className="sr-only">When to book a single transfer, hourly hire or a corporate arrangement in Jeddah</caption>
                <thead className="bg-[#F9FAFB] text-[0.7rem] uppercase tracking-[0.14em] text-[#6B7280]">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-bold">Booking</th>
                    <th scope="col" className="px-4 py-3 font-bold">Best when</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]">
                  <tr>
                    <th scope="row" className="px-4 py-4 align-top font-semibold"><Link href="/routes/jeddah-airport-to-makkah" className="text-[#15803D] hover:underline">Single transfer</Link></th>
                    <td className="px-4 py-4 text-[#4B5563]">One pickup, one drop-off — JED to a hotel, Jeddah to Makkah, a hotel move.</td>
                  </tr>
                  <tr>
                    <th scope="row" className="px-4 py-4 align-top font-semibold"><Link href="/locations/jeddah/private-driver" className="text-[#15803D] hover:underline">Hourly driver</Link></th>
                    <td className="px-4 py-4 text-[#4B5563]">Three or more stops — Al-Balad, the Corniche, a mall and dinner — or meetings that may overrun.</td>
                  </tr>
                  <tr>
                    <th scope="row" className="px-4 py-4 align-top font-semibold"><Link href="/services/corporate" className="text-[#15803D] hover:underline">Corporate</Link></th>
                    <td className="px-4 py-4 text-[#4B5563]">Recurring staff travel, delegations, or anything needing a written quote and invoice.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ─── DESTINATIONS ─────────────────────────────────────── */}
        <section id="destinations" aria-labelledby="dest-heading" className="scroll-mt-24">
          <SectionHeader id="dest-heading" eyebrow="Where you can go from Jeddah" title="Makkah, Madinah, the Red Sea coast and beyond" intro="Every route has its own page and quote form. Distances and drive times are approximate and come from the same data the route pages use." />
          <DestinationExplorer groups={groups} fromLabel="Jeddah" />
        </section>

        {/* ─── VEHICLE FIT ──────────────────────────────────────── */}
        <section aria-labelledby="vehicle-heading">
          <SectionHeader id="vehicle-heading" eyebrow="Vehicle fit" title="Which vehicle fits your group and luggage?" intro="Umrah families often travel with more bags than they expect. Set passengers and large bags — the vehicle is confirmed with your quote." />
          <VehicleFitTool options={fitOptions} />
        </section>

        {/* ─── TIMING ───────────────────────────────────────────── */}
        <section aria-labelledby="timing-heading">
          <SectionHeader id="timing-heading" eyebrow="Plan your timing" title="What changes journey times in Jeddah" intro="Drive times shift with the season, the hour and the day of the week. These are the things that move them." />
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-[#E5E7EB] bg-[#E5E7EB] sm:grid-cols-2 lg:grid-cols-3">
            {JEDDAH_TIMING.map((t, i) => (
              <div key={t.title} className="bg-white p-6">
                <span className="font-heading text-sm font-bold tabular-nums text-[#16A34A]">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-2 font-heading text-base font-bold">{t.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#4B5563]">{t.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── VISITOR GUIDE + BOOKING STEPS ────────────────────── */}
        <section aria-labelledby="visitor-heading">
          <SectionHeader id="visitor-heading" eyebrow="First time in Jeddah?" title="What international visitors usually ask" />
          <div className="grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-2">
            {JEDDAH_VISITOR_GUIDE.map((v) => (
              <div key={v.q} className="border-l-2 border-[#16A34A]/25 pl-5">
                <h3 className="font-heading text-base font-bold text-[#1C1C1C]">{v.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#4B5563]">{v.a}</p>
              </div>
            ))}
          </div>
          <div className="mt-14 rounded-3xl border border-[#16A34A]/15 bg-[#F0FDF4] p-6 md:p-8">
            <h3 className="font-heading text-lg font-bold">From request to ride</h3>
            <ol className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {JEDDAH_BOOKING_STEPS.map((s, i) => (
                <li key={s.title}>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#16A34A] font-heading text-sm font-bold text-[#FFFFFF]">{i + 1}</span>
                  <p className="mt-3 font-bold text-[#1C1C1C]">{s.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-[#4B5563]">{s.desc}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ─── CORPORATE + EVENTS ───────────────────────────────── */}
        <section aria-labelledby="corp-heading" className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-[2rem] bg-[#0B1F14] p-7 text-[#FFFFFF] md:p-10">
            <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[#FACC15]">For companies & delegations</p>
            <h2 id="corp-heading" className="mt-3 font-heading text-[1.75rem] font-bold leading-tight text-[#FFFFFF] md:text-[2.1rem]">Corporate transportation in Jeddah, quoted in writing</h2>
            <p className="mt-4 text-sm leading-relaxed text-white/80">
              Visiting executives, port and KAEC business trips, Umrah groups organised by companies, and delegations over several days — one point of contact and the right mix of executive sedans, SUVs, vans and coasters through our partner network. {CORPORATE_INVOICE_LINE}
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                href={`mailto:${contactConfig.email}?subject=${encodeURIComponent("Corporate transportation RFQ — Jeddah")}&body=${encodeURIComponent("Hello Taxi Saudi Arabia team,\n\nWe'd like a written quote for transportation in Jeddah.\n\n• Company / organisation: \n• Contact name & role: \n• Dates: \n• Trips (JED / hotel / Makkah / Madinah / KAEC / hourly): \n• Passengers per trip: \n• Vehicle preference (Executive sedan / SUV / Van / Coaster): \n• Invoice needed?: \n\nPlease confirm the fixed fare before booking.\n\nThank you.")}`}
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[#FACC15] px-6 text-xs font-bold uppercase tracking-wider text-[#0B1F14] hover:bg-[#FDE047]"
              >
                <Mail className="h-4 w-4" aria-hidden="true" /> Request Corporate Transportation
              </a>
              <Link href="/services/corporate" className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-white/25 px-6 text-xs font-bold uppercase tracking-wider text-[#FFFFFF] hover:bg-white/10">
                How accounts work <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
          <div className="flex flex-col justify-between rounded-[2rem] border border-[#E5E7EB] bg-white p-7 md:p-8">
            <div>
              <p className="flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[#16A34A]"><CalendarDays className="h-4 w-4" aria-hidden="true" /> Events in Jeddah</p>
              <p className="mt-3 font-heading text-xl font-bold">Exhibitions and big nights</p>
              <p className="mt-2 text-sm leading-relaxed text-[#4B5563]">
                Exhibitions at the Jeddah Center for Forums and Events and large waterfront events concentrate arrivals at one place. Plan the drop-off and a fixed pickup point in advance.
              </p>
            </div>
            <Link href="/events/jeddah-event-transportation" className="mt-6 inline-flex min-h-[44px] w-fit items-center gap-2 rounded-full bg-[#1C1C1C] px-5 text-xs font-bold uppercase tracking-wider text-[#FFFFFF] hover:bg-[#000000]">
              Jeddah event transport <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </section>

        {/* ─── QUOTE ────────────────────────────────────────────── */}
        <QuoteSection
          heading="Get your Jeddah transfer quote"
          body="Tell us the trip — pickup, drop-off, date, passengers, bags and your flight number for airport trips. We reply on WhatsApp with the vehicle and one fixed fare before anything is booked."
          submitLabel="Get My Private Transfer Quote"
          form={{ pickup: "King Abdulaziz Airport (JED)" }}
          waPrefill={HUB_WA}
          pathB={{
            heading: "Booking for a company or an Umrah group?",
            body: `Send your trip list by email for a written quote. ${CORPORATE_INVOICE_LINE}`,
            emailSubject: "Transport RFQ — Jeddah",
            emailBody: "Hello Taxi Saudi Arabia team,\n\nWe'd like a written quote for transfers in Jeddah.\n\n• Company / group: \n• Contact name: \n• Dates & flight numbers: \n• Trips (JED / Makkah / Madinah / hotel): \n• Passengers per trip: \n• Vehicle preference: \n• Invoice needed?: \n\nThank you.",
          }}
        />

        {/* ─── FAQ ──────────────────────────────────────────────── */}
        <section aria-labelledby="faq-heading" className="grid grid-cols-1 gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <SectionHeader id="faq-heading" eyebrow="FAQ" title="Jeddah transport questions, answered" intro="Short answers to what travellers ask before booking." />
            <a href={wa(HUB_WA)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[#16A34A]/30 px-5 text-xs font-bold uppercase tracking-wider text-[#15803D] hover:bg-[#F0FDF4]">
              <MessageCircle className="h-4 w-4" aria-hidden="true" /> Ask on WhatsApp
            </a>
          </div>
          <FaqList faqs={JEDDAH_HUB_FAQS} />
        </section>

        {/* ─── GUIDES ───────────────────────────────────────────── */}
        <section aria-labelledby="guides-heading">
          <h2 id="guides-heading" className="mb-5 font-heading text-xl font-bold">Jeddah travel guides</h2>
          <ul className="grid grid-cols-1 gap-x-8 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
            {JEDDAH_GUIDES.map((g) => (
              <li key={g.href}>
                <Link href={g.href} className="group flex min-h-[44px] items-center justify-between gap-3 border-b border-[#E5E7EB] py-2 text-sm font-semibold text-[#1C1C1C] hover:text-[#15803D]">
                  {g.label}
                  <ArrowRight className="h-4 w-4 shrink-0 text-[#16A34A] transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* ─── FINAL CTA ──────────────────────────────────────────── */}
      <section className="border-t border-[#E5E7EB] bg-white">
        <div className="section-container flex max-w-6xl flex-col items-start gap-6 py-14 pb-28 md:flex-row md:items-center md:justify-between md:pb-14">
          <div>
            <p className="font-heading text-2xl font-bold">Landing in Jeddah soon?</p>
            <p className="mt-1 text-sm text-[#6B7280]">We track your flight, the fare is agreed before you book, and cancellation is free up to 24 hours before pickup.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a href="#quote" className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[#16A34A] px-6 text-xs font-bold uppercase tracking-wider text-[#FFFFFF] hover:bg-[#15803D]">
              Get My Quote <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <a href={wa(HUB_WA)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-[#16A34A]/30 px-6 text-xs font-bold uppercase tracking-wider text-[#15803D] hover:bg-[#F0FDF4]">
              <MessageCircle className="h-4 w-4" aria-hidden="true" /> WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
