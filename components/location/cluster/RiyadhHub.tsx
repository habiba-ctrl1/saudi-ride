import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageCircle, MapPin, PlaneLanding, Briefcase, Landmark, CalendarDays, Mail, Info } from "lucide-react";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqSchema, speakableSchema, itemListSchema } from "@/lib/schema";
import { contactConfig } from "@/lib/config/contact";
import { FLEET_VEHICLES } from "@/lib/fleet-data";
import {
  RIYADH_FACTS,
  TRIP_TYPES,
  AIRPORT_FLOW,
  DISTRICT_CARDS,
  DESTINATION_GROUPS,
  VEHICLE_FIT,
  TIMING_PLANNER,
  VISITOR_GUIDE,
  BOOKING_STEPS,
  HUB_FAQS,
  HUB_GUIDES,
  RUH_CITY,
  CORPORATE_INVOICE_LINE,
  routeFact,
  reverseSlug,
  distanceGuideFor,
} from "@/lib/data/riyadh-cluster";
import { RiyadhAirportTransferLinks } from "@/components/seo/RiyadhAirportTransferLinks";
import { TripTypeSelector } from "./TripTypeSelector";
import { AirportFlow } from "./AirportFlow";
import { TripDecision } from "./TripDecision";
import { DestinationExplorer, type ExplorerGroup } from "./DestinationExplorer";
import { VehicleFitTool, type FitOption } from "./VehicleFitTool";
import { SectionHeader, FactsStrip, FaqList, QuoteSection, wa } from "./ui";

const SITE = "https://taxisaudiarabia.com";
const PATH = "/locations/riyadh";

const HUB_WA = "Salam! Riyadh transport enquiry.\n• From: \n• To: \n• Date & time: \n• Passengers & bags: \n• Trip (airport / hotel / hourly / intercity / corporate): ";

// Riyadh hub — its own information architecture, built around visitor
// journeys rather than the shared city template (which every other city
// still uses, untouched). Title/H1 are unchanged from the ranking version
// (CLAUDE.md rule 3); everything below the H1 is rebuilt.
export function RiyadhHub({ name, nameAr }: { name: string; nameAr: string }) {
  const groups: ExplorerGroup[] = DESTINATION_GROUPS.map((g) => ({
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

  const fitOptions: FitOption[] = VEHICLE_FIT.map((v) => {
    const fleet = FLEET_VEHICLES.find((f) => f.slug === v.fleetSlug);
    return { id: v.id, label: v.label, forWho: v.forWho, href: v.href, passengers: fleet?.passengers ?? 0, luggage: fleet?.luggage ?? 0 };
  });

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "TaxiService",
      "@id": `${SITE}${PATH}#service`,
      name: "Private transfers & chauffeur service in Riyadh",
      description:
        "Pre-booked private transfers, hourly private drivers, hotel transfers, corporate transportation and intercity cars in Riyadh, coordinated through a vetted partner network. Fare agreed before booking.",
      url: `${SITE}${PATH}`,
      provider: { "@type": "Organization", name: "Taxi Saudi Arabia", url: SITE },
      areaServed: { "@type": "City", name: "Riyadh", geo: { "@type": "GeoCoordinates", latitude: 24.7136, longitude: 46.6753 } },
      availableLanguage: ["English", "Arabic"],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Riyadh transport services",
        itemListElement: TRIP_TYPES.filter((t) => t.href.startsWith("/")).map((t) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: t.label, url: `${SITE}${t.href}` },
        })),
      },
    },
    speakableSchema({ path: PATH }),
    itemListSchema(allRoutes.map((r) => ({ name: `Riyadh to ${r.name}`, href: `/routes/${r.slug}` }))),
    faqSchema(HUB_FAQS),
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#1C1C1C]">
      <JsonLd data={schema} />

      {/* ─── HERO ─────────────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden bg-[#0B1F14]">
        <Image
          src="/locations/riyadh-hero.webp"
          alt="Riyadh skyline at dusk with Kingdom Centre and Al Faisaliah Tower over the Olaya district"
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover object-[70%_50%]"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#0B1F14] via-[#0B1F14]/85 to-[#0B1F14]/20" aria-hidden="true" />
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
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" /> Riyadh · {nameAr}
            </p>
            <h1 className="mt-5 font-heading text-[2.25rem] font-bold leading-[1.08] text-[#FFFFFF] sm:text-5xl md:text-[3.5rem]">
              Private Transfers, Taxis &amp; Chauffeur Services in <span className="text-[#FACC15]">Riyadh</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/80 md:text-lg">
              Pre-booked private cars for international visitors, business travellers, families and companies — RUH airport runs, hotel transfers, drivers by the hour, and intercity trips from Riyadh. One agreed fare, before you book.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#quote" className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-[#FACC15] px-7 text-sm font-bold uppercase tracking-wider text-[#0B1F14] transition-colors hover:bg-[#FDE047] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1F14]">
                Get My Riyadh Quote <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <a href={wa(HUB_WA)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full border border-white/30 bg-white/5 px-7 text-sm font-bold uppercase tracking-wider text-[#FFFFFF] backdrop-blur transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                <MessageCircle className="h-4 w-4" aria-hidden="true" /> WhatsApp us
              </a>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-[0.8rem] text-white/75">
              {["English & Arabic drivers", "24/7", "Free cancellation 24h before", "Invoices for companies"].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#FACC15]" aria-hidden="true" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ─── QUICK ANSWER + FACTS ─────────────────────────────────── */}
      <section aria-labelledby="answer-heading" className="section-container relative z-10 -mt-8 max-w-6xl">
        <div className="rounded-[2rem] border border-[#16A34A]/15 bg-white p-6 shadow-[0_30px_70px_-45px_rgba(15,23,42,0.5)] md:p-9">
          <div className="grid gap-6 md:grid-cols-[auto_1fr] md:gap-8">
            <p id="answer-heading" className="t-eyebrow">The short answer</p>
            <p id="speakable-summary" className="text-[1.05rem] leading-relaxed text-[#1F2937] md:text-lg">
              Taxi Saudi Arabia arranges pre-booked private transport across Riyadh through a vetted partner network: airport transfers from King Khalid International Airport (RUH, about {RUH_CITY.km} km from the centre), hotel transfers, private drivers by the hour or day, corporate transportation, and intercity or cross-border cars to cities like Dammam, Makkah, Jeddah and Bahrain. Send your trip on WhatsApp or the form below and the fare is agreed before you book.
            </p>
          </div>
          <div className="mt-7">
            <FactsStrip facts={RIYADH_FACTS} />
          </div>
        </div>
      </section>

      <div className="section-container max-w-6xl space-y-20 py-20 md:space-y-28 md:py-28">
        {/* ─── TRIP-TYPE SELECTOR ───────────────────────────────── */}
        <section aria-labelledby="trip-heading">
          <SectionHeader id="trip-heading" eyebrow="Start here" title="What kind of Riyadh trip are you planning?" intro="Pick the closest match — each one tells you what to send for a quote and where the full details live." />
          <TripTypeSelector trips={TRIP_TYPES} whatsappLink={contactConfig.whatsappLink} />
        </section>

        {/* ─── JOURNEYS (service discovery) ─────────────────────── */}
        <section aria-labelledby="journeys-heading">
          <SectionHeader id="journeys-heading" eyebrow="How people use us" title="Arrive, work, explore — three ways a Riyadh trip usually goes" />
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            {[
              {
                icon: PlaneLanding,
                img: "/gallery/airport-meet.webp",
                alt: "Chauffeur holding a welcome sign at an airport arrivals hall",
                title: "Arrive",
                body: "Land at RUH and go straight to your hotel, office or first meeting. Your driver's contact arrives on WhatsApp before pickup.",
                links: [
                  { href: "/airports/king-khalid-riyadh", label: "RUH airport transfers" },
                  { href: "/locations/riyadh/hotel-transfer", label: "Hotel transfers in Riyadh" },
                ],
              },
              {
                icon: Briefcase,
                img: "/gallery/business-transfer.webp",
                alt: "Business traveller working on a laptop in the back of a chauffeured car",
                title: "Work",
                body: "Meeting days across KAFD, Olaya and the Diplomatic Quarter with the car waiting outside — or one account for your whole team.",
                links: [
                  { href: "/locations/riyadh/private-driver", label: "Private driver by the hour" },
                  { href: "/locations/riyadh/kafd", label: "KAFD executive transfers" },
                ],
              },
              {
                icon: Landmark,
                img: "/locations/diriyah-hero.webp",
                alt: "At-Turaif mud-brick district in Diriyah lit at dusk",
                title: "Explore",
                body: "At-Turaif and Bujairi Terrace in Diriyah, the National Museum downtown, and Riyadh Season nights in Hittin — with a fixed ride home.",
                links: [
                  { href: "/locations/riyadh/diriyah", label: "Riyadh to Diriyah" },
                  { href: "/locations/riyadh/boulevard", label: "Boulevard & Riyadh Season" },
                ],
              },
            ].map((j) => (
              <article key={j.title} className="group flex flex-col overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white transition-shadow duration-300 hover:shadow-[0_24px_50px_-30px_rgba(15,23,42,0.5)]">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image src={j.img} alt={j.alt} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F14]/70 to-transparent" aria-hidden="true" />
                  <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-[#0B1F14]">
                    <j.icon className="h-3.5 w-3.5 text-[#16A34A]" aria-hidden="true" /> {j.title}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="flex-1 text-sm leading-relaxed text-[#4B5563]">{j.body}</p>
                  <ul className="mt-5 space-y-1.5">
                    {j.links.map((l) => (
                      <li key={l.href}>
                        <Link href={l.href} className="group/link inline-flex min-h-[36px] items-center gap-2 text-sm font-bold text-[#15803D] hover:text-[#16A34A] focus-visible:outline-none focus-visible:underline">
                          {l.label}
                          <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-0.5" aria-hidden="true" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      {/* ─── RUH AIRPORT FLOW (dark band) ───────────────────────── */}
      <section aria-labelledby="airport-heading" className="relative overflow-hidden bg-[#0B1F14] py-20 md:py-24">
        <div className="pointer-events-none absolute -right-24 top-0 h-80 w-80 rounded-full bg-[#16A34A]/25 blur-3xl" aria-hidden="true" />
        <div className="section-container relative max-w-6xl">
          <SectionHeader
            tone="dark"
            id="airport-heading"
            eyebrow="King Khalid International Airport (RUH)"
            title="Your Riyadh airport transfer, step by step"
            intro={`RUH is about ${RUH_CITY.km} km north of central Riyadh — ${RUH_CITY.time} on a clear road. Here is how an arrival and a departure work.`}
          />
          <AirportFlow arrival={AIRPORT_FLOW.arrival} departure={AIRPORT_FLOW.departure} />
          <div className="mt-10 flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 md:flex-row md:items-center md:justify-between">
            <p className="flex items-start gap-3 text-sm leading-relaxed text-white/75">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#FACC15]" aria-hidden="true" />
              Travelling light and alone? The Riyadh Metro Yellow Line links the airport with KAFD. With luggage, family, or a fixed first meeting, a car to the door is simpler.
            </p>
            <a href={wa(TRIP_TYPES[0].waPrefill)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[44px] shrink-0 items-center justify-center gap-2 rounded-full bg-[#FACC15] px-5 text-xs font-bold uppercase tracking-wider text-[#0B1F14] hover:bg-[#FDE047] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
              Plan My Riyadh Airport Transfer
            </a>
          </div>
          <Link href="/airports/king-khalid-riyadh" className="mt-5 inline-flex min-h-[44px] items-center gap-2 text-sm font-bold text-[#FACC15] hover:text-[#FDE047]">
            Terminals and full RUH arrival details <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <div className="section-container max-w-6xl space-y-20 py-20 md:space-y-28 md:py-28">
        {/* ─── TRANSFER vs HOURLY vs CORPORATE ──────────────────── */}
        <section aria-labelledby="decide-heading">
          <SectionHeader id="decide-heading" eyebrow="Choose the right booking" title="One transfer, a driver by the hour, or a corporate arrangement?" intro="Two questions decide it. The table underneath gives the same answer in plain terms." />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.1fr]">
            <TripDecision city="riyadh" />
            <div className="overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white">
              <table className="w-full text-left text-sm">
                <caption className="sr-only">Comparison of single transfers, hourly hire and corporate arrangements in Riyadh</caption>
                <thead className="bg-[#F9FAFB] text-[0.7rem] uppercase tracking-[0.14em] text-[#6B7280]">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-bold">Booking</th>
                    <th scope="col" className="px-4 py-3 font-bold">Best when</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]">
                  <tr>
                    <th scope="row" className="px-4 py-4 align-top font-semibold"><Link href="/locations/riyadh/hotel-transfer" className="text-[#15803D] hover:underline">Single transfer</Link></th>
                    <td className="px-4 py-4 text-[#4B5563]">One pickup and one drop-off — airport runs, hotel moves, a dinner with a timed return.</td>
                  </tr>
                  <tr>
                    <th scope="row" className="px-4 py-4 align-top font-semibold"><Link href="/locations/riyadh/private-driver" className="text-[#15803D] hover:underline">Hourly driver</Link></th>
                    <td className="px-4 py-4 text-[#4B5563]">Three or more stops, meetings that may overrun, shopping with bags, a group out for the day.</td>
                  </tr>
                  <tr>
                    <th scope="row" className="px-4 py-4 align-top font-semibold"><Link href="/services/corporate" className="text-[#15803D] hover:underline">Corporate</Link></th>
                    <td className="px-4 py-4 text-[#4B5563]">Recurring staff travel, delegations over several days, or when you need a written quote and invoice.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ─── DESTINATIONS ─────────────────────────────────────── */}
        <section id="destinations" aria-labelledby="dest-heading" className="scroll-mt-24">
          <SectionHeader id="dest-heading" eyebrow="Where you can go from Riyadh" title="Intercity, cross-border and airport routes" intro="Every route below has its own page with details and a quote form. Distances and drive times are approximate and come from the same route data the route pages use." />
          <DestinationExplorer groups={groups} />
        </section>

        <RiyadhAirportTransferLinks variant="hub" />

        {/* ─── DISTRICTS ────────────────────────────────────────── */}
        <section aria-labelledby="districts-heading">
          <SectionHeader id="districts-heading" eyebrow="Riyadh by district" title="Where in Riyadh are you going?" intro="Each area has different traffic, drop-off and timing realities. Pick yours for the local details." />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {DISTRICT_CARDS.map((d) => (
              <li key={d.slug}>
                <Link href={d.href} className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#16A34A]/40 hover:shadow-[0_20px_40px_-25px_rgba(15,23,42,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A] focus-visible:ring-offset-2">
                  <span className="absolute right-4 top-4 font-heading text-sm text-[#D1D5DB] transition-colors group-hover:text-[#16A34A]/40" lang="ar">{d.nameAr}</span>
                  <span className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-[#16A34A]">{d.tag}</span>
                  <span className="mt-2 font-heading text-lg font-bold text-[#1C1C1C]">{d.name}</span>
                  <span className="mt-2 flex-1 text-[0.8rem] leading-relaxed text-[#6B7280]">{d.why}</span>
                  <span className="mt-4 flex flex-wrap gap-1.5">
                    {d.reasons.map((r) => (
                      <span key={r} className="rounded-full bg-[#F3F4F6] px-2.5 py-1 text-[0.65rem] font-semibold text-[#374151]">{r}</span>
                    ))}
                  </span>
                  <span className="mt-4 flex items-center justify-between border-t border-[#F3F4F6] pt-3 text-[0.7rem] text-[#6B7280]">
                    <span className="flex items-center gap-1.5"><PlaneLanding className="h-3.5 w-3.5 text-[#16A34A]" aria-hidden="true" />{d.airportNote}</span>
                    <ArrowRight className="h-4 w-4 text-[#16A34A] transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* ─── VEHICLE FIT ──────────────────────────────────────── */}
        <section aria-labelledby="vehicle-heading">
          <SectionHeader id="vehicle-heading" eyebrow="Vehicle fit" title="Which vehicle fits your group and luggage?" intro="Set the number of passengers and large bags. Vehicles are available through our partner network and confirmed with your quote." />
          <VehicleFitTool options={fitOptions} />
        </section>

        {/* ─── TIMING PLANNER ───────────────────────────────────── */}
        <section aria-labelledby="timing-heading">
          <SectionHeader id="timing-heading" eyebrow="Plan your timing" title="How traffic and timing work in Riyadh" intro="Riyadh is spread out and car-centred. Drive times vary with the hour and the season, so here is what moves them — rather than a number that only holds on an empty road." />
          <div className="grid gap-px overflow-hidden rounded-3xl border border-[#E5E7EB] bg-[#E5E7EB] sm:grid-cols-2 lg:grid-cols-3">
            {TIMING_PLANNER.map((t, i) => (
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
          <SectionHeader id="visitor-heading" eyebrow="For international visitors" title="Getting around Riyadh: what visitors usually ask" />
          <div className="grid gap-x-10 gap-y-8 md:grid-cols-2">
            {VISITOR_GUIDE.map((v) => (
              <div key={v.q} className="border-l-2 border-[#16A34A]/25 pl-5">
                <h3 className="font-heading text-base font-bold text-[#1C1C1C]">{v.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#4B5563]">{v.a}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 rounded-3xl border border-[#16A34A]/15 bg-[#F0FDF4] p-6 md:p-8">
            <h3 className="font-heading text-lg font-bold">From request to ride in four steps</h3>
            <ol className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {BOOKING_STEPS.map((s, i) => (
                <li key={s.title} className="relative">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#16A34A] font-heading text-sm font-bold text-[#FFFFFF]">{i + 1}</span>
                  <p className="mt-3 font-bold text-[#1C1C1C]">{s.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-[#4B5563]">{s.desc}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ─── CORPORATE ────────────────────────────────────────── */}
        <section aria-labelledby="corp-heading" className="overflow-hidden rounded-[2rem] bg-[#0B1F14] text-[#FFFFFF]">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-7 md:p-12">
              <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[#FACC15]">For companies & delegations</p>
              <h2 id="corp-heading" className="mt-3 font-heading text-[1.75rem] font-bold leading-tight md:text-[2.25rem]">Corporate transportation in Riyadh, quoted in writing</h2>
              <p className="mt-4 text-sm leading-relaxed text-white/75">
                For executives, visiting teams, conferences and recurring staff travel, we coordinate the right mix of executive sedans, full-size SUVs, vans and coasters through our partner network — the multi-vehicle capacity a single small operator can&apos;t match, with one point of contact. {CORPORATE_INVOICE_LINE}
              </p>
              <ul className="mt-6 grid gap-2 text-sm text-white/85 sm:grid-cols-2">
                {["Written quote by email", "One contact for every trip", "Vehicles sized to each group", "E-receipts for every ride"].map((t) => (
                  <li key={t} className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-[#FACC15]" aria-hidden="true" />{t}</li>
                ))}
              </ul>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href={`mailto:${contactConfig.email}?subject=${encodeURIComponent("Corporate transportation RFQ — Riyadh")}&body=${encodeURIComponent("Hello Taxi Saudi Arabia team,\n\nWe'd like a written quote for transportation in Riyadh.\n\n• Company / organisation: \n• Contact name & role: \n• Dates: \n• Trips (airport / hotel / venue / hourly): \n• Passengers per trip: \n• Vehicle preference (Executive sedan / SUV / Van / Coaster): \n• Invoice needed?: \n\nPlease confirm the fixed fare before booking.\n\nThank you.")}`}
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[#FACC15] px-6 text-xs font-bold uppercase tracking-wider text-[#0B1F14] hover:bg-[#FDE047] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <Mail className="h-4 w-4" aria-hidden="true" /> Request Corporate Transportation
                </a>
                <Link href="/services/corporate" className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-white/25 px-6 text-xs font-bold uppercase tracking-wider text-[#FFFFFF] hover:bg-white/10">
                  How corporate accounts work <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
            <div className="relative min-h-[260px]">
              <Image src="/gallery/event-fleet-lineup-sedan-suv-van-coaster-riyadh.webp" alt="Executive sedan, full-size SUV, van and coaster lined up outside a convention centre" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0B1F14] via-[#0B1F14]/20 to-transparent lg:via-transparent" aria-hidden="true" />
            </div>
          </div>
        </section>

        {/* ─── EVENTS (links into the existing events cluster) ──── */}
        <section aria-labelledby="events-heading" className="grid gap-6 rounded-3xl border border-[#E5E7EB] bg-white p-6 md:grid-cols-[1fr_auto] md:items-center md:p-8">
          <div>
            <p className="t-eyebrow"><CalendarDays className="h-4 w-4" aria-hidden="true" /> Events in Riyadh</p>
            <h2 id="events-heading" className="mt-2 font-heading text-xl font-bold md:text-2xl">Attending an exhibition, conference or Riyadh Season?</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#4B5563]">
              Exhibitions at RECC in Malham, RICEC and KAICC, and the Riyadh Season zones in Hittin, each need planned arrivals and a fixed pickup point. Our event pages cover delegate, speaker and exhibitor transport.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row md:flex-col">
            <Link href="/events/riyadh-event-transportation" className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-[#1C1C1C] px-5 text-xs font-bold uppercase tracking-wider text-[#FFFFFF] hover:bg-black">
              Riyadh event transport <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/events" className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-[#E5E7EB] px-5 text-xs font-bold uppercase tracking-wider text-[#374151] hover:border-[#16A34A]/40">
              Upcoming events
            </Link>
          </div>
        </section>

        {/* ─── QUOTE ────────────────────────────────────────────── */}
        <QuoteSection
          heading="Get your Riyadh transfer quote"
          body="Tell us the trip — pickup, drop-off, date, passengers and bags. We reply on WhatsApp with the vehicle and one fixed fare before anything is booked."
          submitLabel="Get My Private Transfer Quote"
          form={{ dropoff: "Riyadh" }}
          waPrefill={HUB_WA}
          pathB={{
            heading: "Booking for a company or a group?",
            body: `Send your trip list by email for a written quote. ${CORPORATE_INVOICE_LINE}`,
            emailSubject: "Transport RFQ — Riyadh",
            emailBody: "Hello Taxi Saudi Arabia team,\n\nWe'd like a written quote for transfers in Riyadh.\n\n• Company / organisation: \n• Contact name: \n• Dates: \n• Trips / addresses: \n• Passengers per trip: \n• Vehicle preference: \n• Invoice needed?: \n\nThank you.",
          }}
        />

        {/* ─── FAQ ──────────────────────────────────────────────── */}
        <section aria-labelledby="faq-heading" className="grid grid-cols-1 gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <SectionHeader id="faq-heading" eyebrow="FAQ" title="Riyadh transport questions, answered" intro="Short answers to what travellers ask before booking. Anything else — message us." />
            <a href={wa(HUB_WA)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[#16A34A]/30 px-5 text-xs font-bold uppercase tracking-wider text-[#15803D] hover:bg-[#F0FDF4]">
              <MessageCircle className="h-4 w-4" aria-hidden="true" /> Ask on WhatsApp
            </a>
          </div>
          <FaqList faqs={HUB_FAQS} />
        </section>

        {/* ─── RELATED GUIDES ───────────────────────────────────── */}
        <section aria-labelledby="guides-heading">
          <h2 id="guides-heading" className="mb-5 font-heading text-xl font-bold">Riyadh travel guides</h2>
          <ul className="grid gap-x-8 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
            {HUB_GUIDES.map((g) => (
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
            <p className="font-heading text-2xl font-bold">Ready to plan your Riyadh trip?</p>
            <p className="mt-1 text-sm text-[#6B7280]">One fixed fare, agreed before you book. Free cancellation up to 24 hours before pickup.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a href="#quote" className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[#16A34A] px-6 text-xs font-bold uppercase tracking-wider text-[#FFFFFF] hover:bg-[#15803D]">
              Get My Riyadh Quote <ArrowRight className="h-4 w-4" aria-hidden="true" />
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
