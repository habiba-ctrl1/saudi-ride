import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageCircle, MapPin, Landmark, Building2, Mountain } from "lucide-react";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqSchema, speakableSchema, itemListSchema } from "@/lib/schema";
import { contactConfig } from "@/lib/config/contact";
import { routeFact, distanceGuideFor, CORPORATE_INVOICE_LINE } from "@/lib/data/cluster";
import {
  ALULA_FACTS,
  ALULA_TRIPS,
  ALULA_FLOW,
  ALULA_ATTRACTION_GROUPS,
  ALULA_STAYS,
  ALULA_HOTEL_LEGS,
  ALULA_ONWARD,
  ALULA_BOOKING_STEPS,
  ALULA_TIMING,
  ALULA_HUB_FAQS,
  ALULA_GUIDES,
  ALULA_AIRPORT_RESORTS,
  RSI_ALULA,
  FREE_WAIT,
} from "@/lib/data/alula-cluster";
import { TripTypeSelector } from "./TripTypeSelector";
import { AirportFlow } from "./AirportFlow";
import { TripDecision } from "./TripDecision";
import { JourneyPlanner } from "./JourneyPlanner";
import { CrossDestinationDiagram, DriveVsFlyTable } from "./CrossDestination";
import { SectionHeader, FactsStrip, FaqList, QuoteSection, wa } from "./ui";

const SITE = "https://taxisaudiarabia.com";
const PATH = "/locations/alula";
const HUB_WA = "Salam! AlUla transport enquiry.\n• From (ULH airport / hotel / RSI): \n• To: \n• Date & time: \n• Passengers & bags: \n• Flight number (if airport): ";
const GROUP_ICON = { heritage: Landmark, architecture: Building2, nature: Mountain } as const;

// AlUla hub — rebuilt 2026-10-07 around the real visitor journeys: the ULH
// arrival, hotel legs, the guided heritage sites, a multi-stop day with a
// private driver, and the connections out (Madinah, Riyadh, Jeddah, Red Sea).
// Title and H1 unchanged from the ranking version (CLAUDE.md rule 3, GSC pos
// ~16); the new positioning lives in the tagline and body.
export function AlulaHub({ name, nameAr }: { name: string; nameAr: string }) {
  const onward = ALULA_ONWARD.map((o) => ({ ...o, f: routeFact(o.slug) })).filter((o) => o.f);

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "TaxiService",
      "@id": `${SITE}${PATH}#service`,
      name: "Private transfers & chauffeur service in AlUla",
      description:
        "Pre-booked private transfers from AlUla International Airport (ULH), hotel transfers, private drivers for multi-stop sightseeing days, and intercity and Red Sea transfers, coordinated through a vetted partner network. Fare agreed before booking.",
      url: `${SITE}${PATH}`,
      provider: { "@type": "Organization", name: "Taxi Saudi Arabia", url: SITE },
      areaServed: { "@type": "City", name: "AlUla", geo: { "@type": "GeoCoordinates", latitude: 26.6084, longitude: 37.9153 } },
      availableLanguage: ["English", "Arabic"],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "AlUla transport services",
        itemListElement: ALULA_TRIPS.filter((t) => t.href.startsWith("/")).map((t) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: t.label, url: `${SITE}${t.href}` },
        })),
      },
    },
    speakableSchema({ path: PATH }),
    itemListSchema(onward.map((o) => ({ name: `${o.f!.from} to ${o.f!.to}`, href: `/routes/${o.slug}` }))),
    faqSchema(ALULA_HUB_FAQS),
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#1C1C1C]">
      <JsonLd data={schema} />

      {/* ─── HERO ─────────────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden bg-[#0B1F14]">
        <Image
          src="/locations/alula-hero.webp"
          alt="Illustrative image: a candle-lit dinner table set in a sandstone desert valley, with a mirrored structure standing behind it"
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover object-[60%_50%]"
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
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" /> AlUla · {nameAr}
            </p>
            <h1 className="mt-5 font-heading text-[2.25rem] font-bold leading-[1.08] text-[#FFFFFF] sm:text-5xl md:text-[3.5rem]">
              Private Taxi &amp; Chauffeur Service in <span className="text-[#FACC15]">AlUla</span>
            </h1>
            <p className="mt-4 max-w-xl text-lg font-semibold leading-snug text-[#FFFFFF] md:text-xl">
              Private transportation for AlUla: airport transfers, hotels, attractions and intercity journeys.
            </p>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-white/80">
              Pre-booked cars for international visitors, couples, families and groups — from your ULH arrival to Hegra, Maraya and Elephant Rock, and on to Madinah, Riyadh or the Red Sea. One fare, agreed before you book.
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
              Taxi Saudi Arabia arranges private transport in AlUla through a vetted partner network: pre-booked transfers with meet &amp; greet from AlUla International Airport (ULH, about {ALULA_AIRPORT_RESORTS.km} km from the resort area), hotel transfers, private drivers for multi-stop days at Hegra, the Old Town, Maraya and Elephant Rock, and intercity cars to Madinah, Riyadh, Jeddah, NEOM, AMAALA and Red Sea International Airport. Request a quote on this page or WhatsApp; the fare is agreed before you book, and we track your flight.
            </p>
          </div>
          <div className="mt-7">
            <FactsStrip facts={ALULA_FACTS} />
          </div>
        </div>
      </section>

      <div className="section-container max-w-6xl space-y-20 py-20 md:space-y-28 md:py-28">
        {/* ─── TRIP SELECTOR ────────────────────────────────────── */}
        <section aria-labelledby="trip-heading">
          <SectionHeader id="trip-heading" eyebrow="What are you planning?" title="Choose your AlUla journey" intro="Each option tells you what to send for a quote and opens the page, section or quote flow built for it." />
          <TripTypeSelector trips={ALULA_TRIPS} whatsappLink={contactConfig.whatsappLink} />
        </section>
      </div>

      {/* ─── AIRPORT FLOW (dark band) ───────────────────────────── */}
      <section id="airport" aria-labelledby="airport-heading" className="relative scroll-mt-20 overflow-hidden bg-[#0B1F14] py-20 md:py-24">
        <div className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-[#16A34A]/25 blur-3xl" aria-hidden="true" />
        <div className="section-container relative max-w-6xl">
          <SectionHeader
            tone="dark"
            id="airport-heading"
            eyebrow="AlUla International Airport (ULH)"
            title="Your AlUla airport transfer, step by step"
            intro={`ULH is a small regional airport about ${ALULA_AIRPORT_RESORTS.km} km from the resort area, and on-demand cars there are limited — so most visitors pre-book.`}
          />
          <AirportFlow arrival={ALULA_FLOW.arrival} departure={ALULA_FLOW.departure} code="ULH" />
          <div className="mt-10 flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 md:flex-row md:items-center md:justify-between">
            <p className="text-sm leading-relaxed text-white/80">
              We track your flight, so a late landing moves your pickup. Share the flight number and your hotel and the fare is agreed before you travel.
            </p>
            <a href={wa(ALULA_TRIPS[0].waPrefill)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[44px] shrink-0 items-center justify-center gap-2 rounded-full bg-[#FACC15] px-5 text-xs font-bold uppercase tracking-wider text-[#0B1F14] hover:bg-[#FDE047] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
              Plan My AlUla Airport Transfer
            </a>
          </div>
          <Link href="/airports/alula" className="mt-5 inline-flex min-h-[44px] items-center gap-2 text-sm font-bold text-[#FACC15] hover:text-[#FDE047]">
            AlUla airport page: full arrival details <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <div className="section-container max-w-6xl space-y-20 py-20 md:space-y-28 md:py-28">
        {/* ─── HOTELS ───────────────────────────────────────────── */}
        <section id="hotels" aria-labelledby="hotels-heading" className="scroll-mt-20">
          <SectionHeader id="hotels-heading" eyebrow="Hotel & resort transfers" title="Every leg between your AlUla stay and the places you came for" intro="Single legs, booked as you need them. Tap a leg to send a pre-filled WhatsApp request." />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.1fr]">
            <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6 md:p-7">
              <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[#16A34A]">Where visitors stay</p>
              <ul className="mt-4 divide-y divide-[#E5E7EB]">
                {ALULA_STAYS.map((s) => (
                  <li key={s.name} className="py-3 first:pt-0 last:pb-0">
                    <p className="font-heading text-[0.95rem] font-bold">{s.name}</p>
                    <p className="text-[0.8rem] text-[#6B7280]">{s.area} · {s.note}</p>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-xs leading-relaxed text-[#6B7280]">
                Named so you can see where trips start and end. Taxi Saudi Arabia is independent of these properties and has no partnership with them.
              </p>
              <Link href="/routes/alula-airport-to-banyan-tree" className="mt-4 inline-flex min-h-[44px] items-center gap-2 text-sm font-bold text-[#15803D] hover:text-[#16A34A]">
                Example: ULH → Banyan Tree AlUla <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {ALULA_HOTEL_LEGS.map((l) => (
                <li key={l.label}>
                  <a
                    href={wa(l.waPrefill)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex h-full min-h-[96px] flex-col rounded-2xl border border-[#E5E7EB] bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#16A34A]/40 hover:shadow-[0_14px_30px_-20px_rgba(15,23,42,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A] focus-visible:ring-offset-2"
                  >
                    <span className="font-heading text-[0.9rem] font-bold text-[#1C1C1C] group-hover:text-[#15803D]">{l.label}</span>
                    <span className="mt-1 flex-1 text-[0.8rem] text-[#6B7280]">{l.when}</span>
                    <span className="mt-2 inline-flex items-center gap-1.5 text-[0.7rem] font-bold uppercase tracking-wider text-[#15803D]">
                      <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" /> Request this transfer
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ─── ATTRACTIONS ──────────────────────────────────────── */}
        <section id="attractions" aria-labelledby="attractions-heading" className="scroll-mt-20">
          <SectionHeader id="attractions-heading" eyebrow="Getting to the sights" title="Hegra, Maraya, Elephant Rock and the Old Town — and how to reach each" intro="Grouped by what you came for. Taxi Saudi Arabia provides the transport; guided sites are booked with Experience AlUla." />
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            {ALULA_ATTRACTION_GROUPS.map((g) => {
              const Icon = GROUP_ICON[g.id as keyof typeof GROUP_ICON];
              return (
                <article key={g.id} className="flex flex-col rounded-3xl border border-[#E5E7EB] bg-white p-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F0FDF4] text-[#16A34A]"><Icon className="h-5 w-5" aria-hidden="true" /></span>
                  <h3 className="mt-4 font-heading text-lg font-bold">{g.label}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-[#6B7280]">{g.intro}</p>
                  <ul className="mt-5 flex-1 space-y-4">
                    {g.items.map((it) => (
                      <li key={it.name}>
                        {it.href ? (
                          <Link href={it.href} className="group inline-flex min-h-[32px] items-center gap-1.5 font-heading text-[0.95rem] font-bold text-[#1C1C1C] hover:text-[#15803D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A]">
                            {it.name} <ArrowRight className="h-3.5 w-3.5 text-[#16A34A] transition-transform group-hover:translate-x-1" aria-hidden="true" />
                          </Link>
                        ) : (
                          <p className="font-heading text-[0.95rem] font-bold text-[#1C1C1C]">{it.name}</p>
                        )}
                        <p className="mt-0.5 text-[0.8rem] leading-relaxed text-[#4B5563]">{it.transport}</p>
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </section>

        {/* ─── MULTI-STOP PLANNER ───────────────────────────────── */}
        <section id="planner" aria-labelledby="planner-heading" className="scroll-mt-20">
          <SectionHeader id="planner-heading" eyebrow="Plan a full day" title="Build your AlUla day, then send it for a quote" intro="Choose a start, tick the places, choose a finish. The planner tells you whether a private driver fits and prepares the WhatsApp message." />
          <JourneyPlanner whatsappLink={contactConfig.whatsappLink} />
        </section>

        {/* ─── PRIVATE DRIVER DECISION ──────────────────────────── */}
        <section id="private-driver" aria-labelledby="decide-heading" className="scroll-mt-20">
          <SectionHeader id="decide-heading" eyebrow="Choose the right booking" title="One transfer, a private driver for the day, or a corporate arrangement?" />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.1fr]">
            <TripDecision city="alula" transferHref="#airport" />
            <div className="overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white">
              <table className="w-full text-left text-sm">
                <caption className="sr-only">When to book a single transfer, a private driver or a corporate arrangement in AlUla</caption>
                <thead className="bg-[#F9FAFB] text-[0.7rem] uppercase tracking-[0.14em] text-[#6B7280]">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-bold">Booking</th>
                    <th scope="col" className="px-4 py-3 font-bold">Best when</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]">
                  {[
                    ["Single transfer", "Airport to hotel, hotel to one sight, or a one-way journey to another city."],
                    ["Private driver by the day", "Three or more stops, guided slots to meet, children, heat, or plans that may change."],
                    ["Corporate arrangement", "Teams, incentive groups and delegations: one contact, a written quote, invoicing on request."],
                  ].map(([a, b]) => (
                    <tr key={a}>
                      <th scope="row" className="px-4 py-4 font-semibold align-top">{a}</th>
                      <td className="px-4 py-4 text-[#4B5563]">{b}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Link href="/locations/alula/private-driver" className="flex items-center justify-between gap-3 border-t border-[#E5E7EB] bg-[#F0FDF4] p-4 text-sm font-semibold text-[#15803D] hover:bg-[#DCFCE7]">
                How a private driver works in AlUla <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        {/* ─── RED SEA COMBINATION ──────────────────────────────── */}
        <section id="red-sea" aria-labelledby="red-sea-heading" className="scroll-mt-20">
          <SectionHeader id="red-sea-heading" eyebrow="AlUla with the Red Sea" title="Combining AlUla with Shura Island, AMAALA and Red Sea International Airport" intro={`These are separate destinations. Red Sea International Airport is about ${RSI_ALULA.km} km from AlUla by road (${RSI_ALULA.time}), so a private inter-destination transfer is usually a planned leg of the trip.`} />
          <CrossDestinationDiagram />
          <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
            <DriveVsFlyTable />
            <div className="flex flex-col justify-between rounded-3xl bg-[#0B1F14] p-6 text-[#FFFFFF]">
              <div>
                <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[#FACC15]">Request a transfer</p>
                <p className="mt-3 font-heading text-lg font-bold">RSI, Shura Island or AMAALA to AlUla — and back</p>
                <p className="mt-2 text-sm leading-relaxed text-white/75">Tell us the direction, the resort at each end and your flight number. One fixed fare, agreed before booking.</p>
              </div>
              <div className="mt-6 flex flex-col gap-3">
                <Link href="/routes/red-sea-airport-to-alula" className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-[#FACC15] px-5 text-xs font-bold uppercase tracking-wider text-[#0B1F14] hover:bg-[#FDE047] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                  Get an RSI → AlUla Quote <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link href="/routes/alula-to-red-sea-airport" className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-white/30 px-5 text-xs font-bold uppercase tracking-wider text-[#FFFFFF] hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                  AlUla → RSI quote
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ─── ONWARD JOURNEYS ──────────────────────────────────── */}
        <section id="onward" aria-labelledby="onward-heading" className="scroll-mt-20">
          <SectionHeader id="onward-heading" eyebrow="Continue your journey" title="Onward from AlUla" intro="Real distances and drive times from our route data. Each card opens the route page with its own quote form." />
          <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {onward.map((o) => {
              const f = o.f!;
              const guide = distanceGuideFor(o.slug);
              return (
                <li key={o.slug} className="group relative flex flex-col rounded-2xl border border-[#E5E7EB] bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#16A34A]/40 hover:shadow-[0_14px_30px_-20px_rgba(15,23,42,0.45)] focus-within:border-[#16A34A]">
                  <div className="flex items-start justify-between gap-3">
                    <Link href={`/routes/${o.slug}`} className="font-heading text-base font-bold text-[#1C1C1C] after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none">
                      {f.from} → {f.to}
                    </Link>
                    <span className="shrink-0 text-right text-[0.8rem] font-semibold tabular-nums">
                      {f.km.toLocaleString("en-US")} km <span className="block text-[0.7rem] font-normal text-[#6B7280]">{f.time}</span>
                    </span>
                  </div>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-[#4B5563]">{o.note}</p>
                  {guide && (
                    <Link href={`/distance/${guide}`} className="relative z-10 mt-3 inline-flex min-h-[32px] w-fit items-center rounded-full bg-[#F0FDF4] px-3 text-[0.7rem] font-semibold text-[#15803D] hover:bg-[#DCFCE7]">
                      Distance &amp; drive-time guide
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
          <div className="mt-6 overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">AlUla road distances and approximate drive times</caption>
              <thead className="bg-[#F9FAFB] text-[0.7rem] uppercase tracking-[0.14em] text-[#6B7280]">
                <tr>
                  <th scope="col" className="px-4 py-3 font-bold">Journey</th>
                  <th scope="col" className="px-4 py-3 font-bold">Road distance</th>
                  <th scope="col" className="px-4 py-3 font-bold">Drive time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {[ALULA_AIRPORT_RESORTS, ...onward.filter((o) => o.slug.startsWith("alula-to-")).map((o) => o.f!)].map((f) => (
                  <tr key={f.slug}>
                    <th scope="row" className="px-4 py-3 font-semibold">{f.from} → {f.to}</th>
                    <td className="px-4 py-3 tabular-nums text-[#4B5563]">~{f.km.toLocaleString("en-US")} km</td>
                    <td className="px-4 py-3 tabular-nums text-[#4B5563]">{f.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="border-t border-[#E5E7EB] px-4 py-3 text-xs text-[#6B7280]">Road-routing estimates from our route data; your driver confirms timing for your day. Reverse directions are the same distance.</p>
          </div>
          <p className="mt-4 text-xs text-[#6B7280]">Every route has its own page in both directions. Combining two legs, such as arriving from Madinah and leaving for Riyadh? Mention it in your request and we quote them together.</p>
        </section>

        {/* ─── TIMING & PRACTICAL ───────────────────────────────── */}
        <section aria-labelledby="timing-heading">
          <SectionHeader id="timing-heading" eyebrow="Before you go" title="Practical notes for planning AlUla transport" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {ALULA_TIMING.map((t) => (
              <article key={t.title} className="rounded-3xl border border-[#E5E7EB] bg-white p-6">
                <h3 className="font-heading text-base font-bold">{t.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#4B5563]">{t.body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ─── BOOKING STEPS ────────────────────────────────────── */}
        <section aria-labelledby="steps-heading">
          <SectionHeader id="steps-heading" eyebrow="How booking works" title="Request, quote, confirm, ride" />
          <ol className="relative grid gap-6 md:grid-cols-4 md:gap-4">
            <span aria-hidden="true" className="absolute left-[12%] right-[12%] top-5 hidden h-px bg-[#16A34A]/25 md:block" />
            {ALULA_BOOKING_STEPS.map((s, i) => (
              <li key={s.title} className="relative flex gap-4 md:flex-col md:items-start">
                <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 border-[#FAFAF7] bg-[#16A34A] font-heading text-sm font-bold text-[#FFFFFF]">{i + 1}</span>
                <div className="md:mt-3">
                  <p className="font-heading font-bold">{s.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-[#4B5563]">{s.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* ─── QUOTE ────────────────────────────────────────────── */}
        <QuoteSection
          heading="Get your AlUla transfer quote"
          body="Tell us the trip — pickup, drop-off, date, passengers, bags and your flight number for airport trips. We reply on WhatsApp with the vehicle and one fixed fare before anything is booked."
          submitLabel="Get My Private Transfer Quote"
          form={{ pickup: "AlUla International Airport (ULH)" }}
          waPrefill={HUB_WA}
          pathB={{
            heading: "Booking for a company, incentive group or delegation?",
            body: `Send your trip list by email for a written quote. ${CORPORATE_INVOICE_LINE}`,
            emailSubject: "Transport RFQ — AlUla",
            emailBody: "Hello Taxi Saudi Arabia team,\n\nWe'd like a written quote for transport in AlUla.\n\n• Company / group: \n• Contact name & role: \n• Dates & flight numbers: \n• Trips (ULH / hotels / sites / Red Sea / other cities): \n• Passengers per trip: \n• Vehicle preference: \n• Invoice needed?: \n\nThank you.",
          }}
        />

        {/* ─── FAQ ──────────────────────────────────────────────── */}
        <section aria-labelledby="faq-heading" className="grid grid-cols-1 gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <SectionHeader id="faq-heading" eyebrow="FAQ" title="AlUla transport questions, answered" intro="Short answers to what international visitors ask before booking." />
            <a href={wa(HUB_WA)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[#16A34A]/30 px-5 text-xs font-bold uppercase tracking-wider text-[#15803D] hover:bg-[#F0FDF4]">
              <MessageCircle className="h-4 w-4" aria-hidden="true" /> Ask on WhatsApp
            </a>
          </div>
          <FaqList faqs={ALULA_HUB_FAQS} />
        </section>

        {/* ─── GUIDES ───────────────────────────────────────────── */}
        <section aria-labelledby="guides-heading">
          <h2 id="guides-heading" className="mb-5 font-heading text-xl font-bold">AlUla travel guides</h2>
          <ul className="grid grid-cols-1 gap-x-8 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
            {ALULA_GUIDES.map((g) => (
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
            <p className="font-heading text-2xl font-bold">Planning AlUla?</p>
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
