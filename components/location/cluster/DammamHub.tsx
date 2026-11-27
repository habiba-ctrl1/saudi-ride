import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageCircle, MapPin, PlaneLanding, Mail, Car, Train, Clock, Building2 } from "lucide-react";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqSchema, speakableSchema, itemListSchema } from "@/lib/schema";
import { contactConfig } from "@/lib/config/contact";
import { FLEET_VEHICLES } from "@/lib/fleet-data";
import { routeFact, CORPORATE_INVOICE_LINE } from "@/lib/data/cluster";
import {
  DAMMAM_FACTS,
  DAMMAM_TRIPS,
  DAMMAM_AREAS,
  DAMMAM_CORRIDORS,
  DAMMAM_VEHICLE_FIT,
  DAMMAM_TIMING,
  CAR_VS_TRAIN,
  DAMMAM_VISITOR_GUIDE,
  DAMMAM_BOOKING_STEPS,
  DAMMAM_HUB_FAQS,
  DAMMAM_GUIDES,
  DMM_DHAHRAN,
  DMM_JUBAIL,
  DMM_BAHRAIN,
  D_MANAMA,
  D_DOHA,
  D_RIYADH,
  D_KUWAIT,
  FREE_WAIT,
} from "@/lib/data/dammam-cluster";
import { TripTypeSelector } from "./TripTypeSelector";
import { VehicleFitTool, type FitOption } from "./VehicleFitTool";
import { CorporateRfqForm } from "./CorporateRfqForm";
import { SectionHeader, FactsStrip, FaqList, QuoteSection, wa } from "./ui";

const SITE = "https://taxisaudiarabia.com";
const PATH = "/locations/dammam";
const HUB_WA = "Salam! Eastern Province transport enquiry.\n• From: \n• To: \n• Date & time: \n• Passengers & luggage: \n• Vehicle (Sedan / SUV / Van / Luxury): \n• Flight number (if airport): \n(ref: dammam-hub)";

const BTN_Y = "inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-[#FACC15] px-7 text-sm font-bold uppercase tracking-wider text-[#0B1F14] transition-colors hover:bg-[#FDE047] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white";
const BTN_G = "inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[#16A34A] px-6 text-xs font-bold uppercase tracking-wider text-[#FFFFFF] hover:bg-[#15803D]";
const BTN_O = "inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-[#16A34A]/30 px-6 text-xs font-bold uppercase tracking-wider text-[#15803D] hover:bg-[#F0FDF4]";
const LINK = "font-semibold text-[#15803D] hover:underline";

// Dammam / Eastern Province hub — rebuilt 2026-11-21 on the shared cluster
// system (seo/eastern-province-keyword-map.md). Title and H1 unchanged (rule 3).
// Every link the old hub carried is still present (rule 4).
export function DammamHub({ name, nameAr }: { name: string; nameAr: string }) {
  const fitOptions: FitOption[] = DAMMAM_VEHICLE_FIT.map((v) => {
    const fleet = FLEET_VEHICLES.find((f) => f.slug === v.fleetSlug);
    return { id: v.id, label: v.label, forWho: v.forWho, href: v.href, passengers: fleet?.passengers ?? 0, luggage: fleet?.luggage ?? 0 };
  });
  const corridors = DAMMAM_CORRIDORS.map((c) => ({ ...c, f: routeFact(c.slug) })).filter((c) => c.f);
  const maxKm = Math.max(...corridors.map((c) => c.f!.km));

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "TaxiService",
      "@id": `${SITE}${PATH}#service`,
      name: "Private taxi, transfers & chauffeur service in Dammam",
      description:
        "Pre-booked private transport in Dammam, Al Khobar and Dhahran: King Fahd Airport (DMM) transfers, rides across the metro, private drivers by the hour, Bahrain and Qatar cross-border trips and intercity transfers, coordinated through a vetted partner network. Fare agreed before booking.",
      url: `${SITE}${PATH}`,
      provider: { "@type": "Organization", name: "Taxi Saudi Arabia", url: SITE },
      areaServed: [
        { "@type": "City", name: "Dammam", geo: { "@type": "GeoCoordinates", latitude: 26.4207, longitude: 50.0888 } },
        { "@type": "City", name: "Al Khobar" },
        { "@type": "City", name: "Dhahran" },
      ],
      availableLanguage: ["English", "Arabic"],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Eastern Province transport services",
        itemListElement: DAMMAM_TRIPS.filter((t) => t.href.startsWith("/")).map((t) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: t.label, url: `${SITE}${t.href}` },
        })),
      },
    },
    speakableSchema({ path: PATH }),
    itemListSchema(corridors.map((c) => ({ name: c.label, href: `/routes/${c.slug}` }))),
    faqSchema(DAMMAM_HUB_FAQS),
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#1C1C1C]">
      <JsonLd data={schema} />

      {/* ─── HERO ─────────────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden bg-[#0B1F14]">
        <Image
          src="/locations/alkhobar-hero.webp"
          alt="Aerial view of the Al Khobar Water Tower and Corniche at sunset, part of the Dammam–Khobar–Dhahran metro"
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover object-[30%_60%]"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#0B1F14]/95 via-[#0B1F14]/75 to-[#0B1F14]/15" aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-[#0B1F14] to-transparent" aria-hidden="true" />

        <Breadcrumbs
          className="relative [&_a]:text-white/70 [&_a:hover]:text-white [&_span]:text-[#FACC15]"
          items={[
            { name: "Home", href: "/" },
            { name: "Saudi Arabia Transportation", href: "/locations" },
            { name, href: PATH },
          ]}
        />

        <div className="section-container relative max-w-6xl pb-16 pt-6 md:pb-24 md:pt-10">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3.5 py-1.5 text-[0.7rem] font-bold uppercase tracking-[0.18em] text-[#FACC15] backdrop-blur">
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" /> Dammam · {nameAr} · Eastern Province
            </p>
            <h1 className="mt-5 font-heading text-[2.25rem] font-bold leading-[1.08] text-[#FFFFFF] sm:text-5xl md:text-[3.5rem]">
              Private Taxi &amp; Chauffeur Service in <span className="text-[#FACC15]">Dammam</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/85 md:text-lg">
              Pre-booked private cars across Dammam, Al Khobar and Dhahran — King Fahd Airport pickups, rides inside the metro, a driver by the hour for site visits and meetings, and trips to Bahrain, Qatar and Riyadh. One fare, agreed before you book.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#quote" className={BTN_Y}>Request a Dammam Transfer Quote <ArrowRight className="h-4 w-4" aria-hidden="true" /></a>
              <a href={wa(HUB_WA)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full border border-white/30 bg-white/5 px-7 text-sm font-bold uppercase tracking-wider text-[#FFFFFF] backdrop-blur hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                <MessageCircle className="h-4 w-4" aria-hidden="true" /> Book via WhatsApp
              </a>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-[0.8rem] text-white/80">
              {["We track your flight", `${FREE_WAIT} free waiting`, "English & Arabic drivers", "24/7"].map((t) => (
                <li key={t} className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-[#FACC15]" aria-hidden="true" />{t}</li>
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
              Taxi Saudi Arabia arranges pre-booked private transport in Dammam, Al Khobar and Dhahran through a vetted partner network: King Fahd International Airport (DMM) pickups with flight tracking, one-way and return rides inside the metro, private drivers by the hour, Bahrain over the King Fahd Causeway (Dammam to Manama about {D_MANAMA.km} km), Doha via Salwa ({D_DOHA.km} km) and Riyadh ({D_RIYADH.km} km). The fare is agreed before booking and cancellation is free up to 24 hours before pickup.
            </p>
          </div>
          <div className="mt-7"><FactsStrip facts={DAMMAM_FACTS} /></div>
        </div>
      </section>

      <div className="section-container max-w-6xl space-y-20 py-20 md:space-y-28 md:py-28">
        {/* ─── TRIP SELECTOR ────────────────────────────────────── */}
        <section aria-labelledby="trip-heading">
          <SectionHeader id="trip-heading" eyebrow="Start here" title="What kind of Eastern Province trip do you need?" intro="Pick the closest match. Each one tells you what to send for a quote and links to the page that covers it." />
          <TripTypeSelector trips={DAMMAM_TRIPS} whatsappLink={contactConfig.whatsappLink} />
        </section>

        {/* ─── METRO ────────────────────────────────────────────── */}
        <section id="metro" aria-labelledby="metro-heading" className="scroll-mt-24">
          <SectionHeader id="metro-heading" eyebrow="Dammam · Al Khobar · Dhahran" title="Taxi in Dammam and the wider metro: where we pick up" intro="Dammam, Al Khobar and Dhahran run into each other along the Gulf coast, with Dhahran in the middle. For a quote, give the city and district of both addresses — a hotel on the Khobar Corniche and an office in north Dammam are a real drive apart." />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {DAMMAM_AREAS.map((a) => (
                <li key={a.href}>
                  <Link href={a.href} className="group flex min-h-[64px] items-center justify-between gap-3 rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 hover:border-[#16A34A]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A]">
                    <span>
                      <span className="block text-sm font-semibold text-[#1C1C1C] group-hover:text-[#15803D]">{a.name} <span className="font-normal text-[#9CA3AF]" lang="ar">{a.nameAr}</span></span>
                      <span className="block text-[0.75rem] text-[#6B7280]">{a.what}</span>
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-[#16A34A]" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
            <div className="rounded-3xl bg-[#0B1F14] p-6 text-[#FFFFFF] md:p-8">
              <Building2 className="h-6 w-6 text-[#FACC15]" aria-hidden="true" />
              <p className="mt-4 font-heading text-xl font-bold text-[#FFFFFF]">A single ride inside the city</p>
              <p className="mt-2 text-sm leading-relaxed text-white/80">Hotel to office, Dammam to a meeting in Al Khobar, an evening at the Corniche or a morning at Ithra — one pre-booked car, one fare agreed first. For three or more stops in a day, a driver by the hour is usually the better fit.</p>
              <a href={wa(DAMMAM_TRIPS[1].waPrefill)} target="_blank" rel="noopener noreferrer" className="mt-5 flex min-h-[44px] w-fit items-center gap-2 rounded-full bg-[#FACC15] px-5 text-xs font-bold uppercase tracking-wider text-[#0B1F14] hover:bg-[#FDE047]"><MessageCircle className="h-4 w-4" aria-hidden="true" /> Quote My Ride</a>
            </div>
          </div>
        </section>

        {/* ─── CORRIDORS ────────────────────────────────────────── */}
        <section id="destinations" aria-labelledby="routes-heading" className="scroll-mt-24">
          <SectionHeader id="routes-heading" eyebrow="Popular routes" title="Bahrain, Qatar, Riyadh and beyond from Dammam" intro="Every route has its own page and quote form. Distances and drive times are approximate and come from the same route data as the route pages." />
          <ol className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {corridors.map((c) => (
              <li key={c.slug} className="group relative overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#16A34A]/40 hover:shadow-[0_14px_30px_-20px_rgba(15,23,42,0.45)] focus-within:border-[#16A34A]">
                <div className="flex items-center justify-between gap-3">
                  <Link href={`/routes/${c.slug}`} className="font-heading text-base font-bold text-[#1C1C1C] after:absolute after:inset-0 focus-visible:outline-none">{c.label}</Link>
                  <span className="shrink-0 text-right text-[0.8rem] font-semibold tabular-nums">{c.f!.km.toLocaleString("en-US")} km <span className="block text-[0.7rem] font-normal text-[#6B7280]">{c.f!.time}</span></span>
                </div>
                <div className="mt-4 flex items-center gap-2" aria-hidden="true">
                  <span className="h-3 w-3 shrink-0 rounded-full border-2 border-[#16A34A] bg-white" />
                  <span className="relative h-1 flex-1 overflow-hidden rounded-full bg-[#F3F4F6]">
                    <span className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#16A34A] to-[#FACC15]" style={{ width: `${Math.max(6, (c.f!.km / maxKm) * 100)}%` }} />
                  </span>
                  <span className="h-3 w-3 shrink-0 rounded-full bg-[#16A34A]" />
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[#4B5563]">{c.note}</p>
              </li>
            ))}
          </ol>
          <p className="mt-5 text-sm text-[#4B5563]">
            Cross-border overviews: <Link href="/cross-border/saudi-to-bahrain" className={LINK}>Dammam to Bahrain and other causeway transfers</Link> and <Link href="/cross-border/saudi-to-qatar" className={LINK}>the Eastern Province to Doha by car</Link>. Kuwait City is about {D_KUWAIT.km} km away. For other cities see the <Link href="/routes" className={LINK}>full route list</Link>.
          </p>

          <div className="mt-10 overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white">
            <div className="border-b border-[#E5E7EB] p-5 md:p-6">
              <h3 className="font-heading text-lg font-bold">Riyadh to Dammam: private car or train?</h3>
              <p className="mt-1 text-sm text-[#6B7280]">Both work. They suit different travellers — here is the honest trade-off.</p>
            </div>
            <table className="w-full text-left text-sm">
              <caption className="sr-only">Comparison of a private car and the train between Riyadh and Dammam</caption>
              <thead className="hidden bg-[#F9FAFB] text-[0.7rem] uppercase tracking-[0.14em] text-[#6B7280] sm:table-header-group">
                <tr>
                  <th scope="col" className="px-5 py-3 font-bold">&nbsp;</th>
                  <th scope="col" className="px-5 py-3 font-bold"><span className="inline-flex items-center gap-1.5"><Car className="h-3.5 w-3.5 text-[#16A34A]" aria-hidden="true" /> Private car</span></th>
                  <th scope="col" className="px-5 py-3 font-bold"><span className="inline-flex items-center gap-1.5"><Train className="h-3.5 w-3.5 text-[#6B7280]" aria-hidden="true" /> Train</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {CAR_VS_TRAIN.map((r) => (
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
            <a href={wa(DAMMAM_TRIPS[5].waPrefill)} target="_blank" rel="noopener noreferrer" className={BTN_G}><MessageCircle className="h-4 w-4" aria-hidden="true" /> Get a Dammam–Riyadh Quote</a>
            <Link href="/blog/riyadh-to-dammam-taxi-price-train-or-flight" className={BTN_O}>Taxi, train or flight compared <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
          </div>
        </section>
      </div>

      {/* ─── AIRPORT (dark band) ──────────────────────────────────── */}
      <section aria-labelledby="airport-heading" className="relative overflow-hidden bg-[#0B1F14] py-20 md:py-24">
        <div className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-[#16A34A]/25 blur-3xl" aria-hidden="true" />
        <div className="section-container relative max-w-6xl">
          <SectionHeader tone="dark" id="airport-heading" eyebrow="Airport transfers" title="King Fahd Airport (DMM) to Dammam, Khobar, Dhahran or Jubail" intro={`DMM sits north-west of the cities. Dhahran is about ${DMM_DHAHRAN.km} km (${DMM_DHAHRAN.time}), Jubail about ${DMM_JUBAIL.km} km, and Bahrain about ${DMM_BAHRAIN.km} km straight from the terminal; Dammam and Al Khobar are further than Dhahran.`} />
          <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { t: "Book with your flight", d: "Send the flight number and the hotel or address. The fare is agreed before you travel." },
              { t: "We track the flight", d: `Delays move your pickup, and ${FREE_WAIT} of waiting is free once you land.` },
              { t: "Meet & greet", d: "We confirm the meeting point with you before you land; driver details arrive before pickup." },
              { t: "Straight to the door", d: "Hotel, compound or office in any of the cities. The return leg is worked back from your flight." },
            ].map((s, i) => (
              <li key={s.t} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FACC15] font-heading text-sm font-bold text-[#0B1F14]">{i + 1}</span>
                <p className="mt-3 font-bold text-[#FFFFFF]">{s.t}</p>
                <p className="mt-1 text-sm leading-relaxed text-white/75">{s.d}</p>
              </li>
            ))}
          </ol>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href={wa(DAMMAM_TRIPS[0].waPrefill)} target="_blank" rel="noopener noreferrer" className={BTN_Y}><PlaneLanding className="h-4 w-4" aria-hidden="true" /> Plan My Airport Transfer</a>
            <Link href="/airports/king-fahd-dammam" className="inline-flex min-h-[52px] items-center justify-center gap-2 text-sm font-bold text-[#FACC15] hover:text-[#FDE047]">DMM airport transfer details <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
          </div>
        </div>
      </section>

      <div className="section-container max-w-6xl space-y-20 py-20 md:space-y-28 md:py-28">
        {/* ─── HOURLY / PRIVATE DRIVER ──────────────────────────── */}
        <section aria-labelledby="driver-heading" className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[2rem] border border-[#E5E7EB] bg-white p-7 md:p-10">
            <p className="flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[#16A34A]"><Clock className="h-4 w-4" aria-hidden="true" /> Chauffeur by the hour</p>
            <h2 id="driver-heading" className="mt-3 font-heading text-[1.75rem] font-bold leading-tight md:text-[2.1rem]">Hire a private driver in Dammam and Al Khobar</h2>
            <p className="mt-4 text-sm leading-relaxed text-[#4B5563]">
              A site visit in Dhahran, meetings on the Khobar side, then an evening flight from DMM — book one car and driver for the hours you need. The driver waits outside each stop, your bags stay in the car, and the fare for the whole block is agreed before you book.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/locations/dammam/private-driver" className={BTN_G}>Private Driver in Dammam <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
              <a href={wa(DAMMAM_TRIPS[2].waPrefill)} target="_blank" rel="noopener noreferrer" className={BTN_O}><MessageCircle className="h-4 w-4" aria-hidden="true" /> Ask on WhatsApp</a>
            </div>
          </div>
          <table className="w-full self-start overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white text-left text-sm">
            <caption className="sr-only">When to book a single transfer, hourly hire or a corporate arrangement in the Eastern Province</caption>
            <thead className="bg-[#F9FAFB] text-[0.7rem] uppercase tracking-[0.14em] text-[#6B7280]"><tr><th scope="col" className="px-4 py-3 font-bold">Booking</th><th scope="col" className="px-4 py-3 font-bold">Best when</th></tr></thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              <tr><th scope="row" className="px-4 py-4 align-top font-semibold"><Link href="/routes/dammam-airport-to-dhahran" className="text-[#15803D] hover:underline">Single transfer</Link></th><td className="px-4 py-4 text-[#4B5563]">One pickup, one drop-off — airport, hotel move, Bahrain.</td></tr>
              <tr><th scope="row" className="px-4 py-4 align-top font-semibold"><Link href="/locations/dammam/private-driver" className="text-[#15803D] hover:underline">Hourly driver</Link></th><td className="px-4 py-4 text-[#4B5563]">Stops in two or three of the cities, or finish times you cannot predict.</td></tr>
              <tr><th scope="row" className="px-4 py-4 align-top font-semibold"><Link href="/services/corporate" className="text-[#15803D] hover:underline">Corporate</Link></th><td className="px-4 py-4 text-[#4B5563]">Visiting teams and contractors, written quote and invoice.</td></tr>
            </tbody>
          </table>
        </section>

        {/* ─── VEHICLE FIT ──────────────────────────────────────── */}
        <section aria-labelledby="vehicle-heading">
          <SectionHeader id="vehicle-heading" eyebrow="Vehicle options" title="Which vehicle fits your group and luggage?" intro="Set passengers and large bags and see which categories fit. The luxury option is a choice for the occasion, not for size. Availability in the Eastern Province is confirmed for your date when we quote." />
          <VehicleFitTool options={fitOptions} />
          <p className="mt-4 text-sm text-[#4B5563]">See all categories on the <Link href="/fleet" className={LINK}>vehicle categories page</Link> or the <Link href="/services/vip-transportation" className={LINK}>VIP transportation</Link> tier. Vehicles are provided through our partner network.</p>
        </section>

        {/* ─── TIMING ───────────────────────────────────────────── */}
        <section aria-labelledby="timing-heading">
          <SectionHeader id="timing-heading" eyebrow="Plan your timing" title="What changes journey times in the Eastern Province" intro="These are the things that move a Dammam, Khobar or Dhahran trip." />
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-[#E5E7EB] bg-[#E5E7EB] sm:grid-cols-2 lg:grid-cols-3">
            {DAMMAM_TIMING.map((t, i) => (
              <div key={t.title} className="bg-white p-6">
                <span className="font-heading text-sm font-bold tabular-nums text-[#16A34A]">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-2 font-heading text-base font-bold">{t.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#4B5563]">{t.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── VISITOR GUIDE + BOOKING ──────────────────────────── */}
        <section aria-labelledby="visitor-heading">
          <SectionHeader id="visitor-heading" eyebrow="First time in the Eastern Province?" title="What visitors to Dammam usually ask first" />
          <div className="grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-2">
            {DAMMAM_VISITOR_GUIDE.map((v) => (
              <div key={v.q} className="border-l-2 border-[#16A34A]/25 pl-5">
                <h3 className="font-heading text-base font-bold text-[#1C1C1C]">{v.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#4B5563]">{v.a}</p>
              </div>
            ))}
          </div>
          <div className="mt-14 rounded-3xl border border-[#16A34A]/15 bg-[#F0FDF4] p-6 md:p-8">
            <h3 className="font-heading text-lg font-bold">How booking works</h3>
            <ol className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {DAMMAM_BOOKING_STEPS.map((s, i) => (
                <li key={s.title}>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#16A34A] font-heading text-sm font-bold text-[#FFFFFF]">{i + 1}</span>
                  <p className="mt-3 font-bold text-[#1C1C1C]">{s.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-[#4B5563]">{s.desc}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ─── CORPORATE ────────────────────────────────────────── */}
        <section aria-labelledby="corp-heading" className="rounded-[2rem] bg-[#0B1F14] p-7 text-[#FFFFFF] md:p-10">
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[#FACC15]">For companies, visiting teams & VIP guests</p>
          <h2 id="corp-heading" className="mt-3 font-heading text-[1.75rem] font-bold leading-tight text-[#FFFFFF] md:text-[2.1rem]">Corporate transportation in Dammam, Al Khobar and Dhahran, quoted in writing</h2>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/80">
            Visiting engineers, auditors, event teams and senior guests get one written quote for every airport run, site visit and hotel move, with executive sedans, SUVs, vans and coasters through our partner network. We are not affiliated with any company whose sites you visit — your host arranges access. {CORPORATE_INVOICE_LINE}
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              href={`mailto:${contactConfig.email}?subject=${encodeURIComponent("Corporate transportation RFQ — Dammam / Eastern Province")}&body=${encodeURIComponent("Hello Taxi Saudi Arabia team,\n\nWe'd like a written quote for transportation in the Eastern Province.\n\n• Company: \n• Contact name & role: \n• Dates: \n• Trips (DMM / Dammam / Khobar / Dhahran / Jubail / Bahrain): \n• Passengers per trip: \n• Vehicle (Executive sedan / SUV / Van / Coaster): \n• Invoice needed?: \n\nPlease confirm the fixed fare before booking.\n\nThank you.")}`}
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[#FACC15] px-6 text-xs font-bold uppercase tracking-wider text-[#0B1F14] hover:bg-[#FDE047]"
            ><Mail className="h-4 w-4" aria-hidden="true" /> Request Corporate Transportation</a>
            <Link href="/services/corporate" className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-white/25 px-6 text-xs font-bold uppercase tracking-wider text-[#FFFFFF] hover:bg-white/10">Corporate transportation <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
            <Link href="/blog/eastern-province-corporate-visitor-transport-guide" className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-white/25 px-6 text-xs font-bold uppercase tracking-wider text-[#FFFFFF] hover:bg-white/10">Business visitor guide <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
          </div>
        </section>

        <CorporateRfqForm city="Dammam" path={PATH} />

        {/* ─── QUOTE ────────────────────────────────────────────── */}
        <QuoteSection
          heading="Get your Dammam transfer quote"
          body="Tell us the trip — both addresses with the city, date, passengers, luggage and your flight number for airport trips. We reply on WhatsApp with the vehicle and one fixed fare before anything is booked."
          submitLabel="Request a Dammam Transfer Quote"
          form={{ pickup: "Dammam" }}
          waPrefill={HUB_WA}
          pathB={{
            heading: "Booking for a company or a visiting team?",
            body: `Send your trip list by email for a written quote. ${CORPORATE_INVOICE_LINE}`,
            emailSubject: "Transport RFQ — Dammam / Eastern Province",
            emailBody: "Hello Taxi Saudi Arabia team,\n\nWe'd like a written quote for transfers in the Eastern Province.\n\n• Company: \n• Contact name: \n• Dates & flight numbers: \n• Trips (DMM / metro / hourly / Bahrain): \n• Passengers per trip: \n• Vehicle preference: \n\nPlease confirm the fixed fare before booking.\n\nThank you.",
          }}
        />

        {/* ─── FAQ ──────────────────────────────────────────────── */}
        <section aria-labelledby="faq-heading" className="grid grid-cols-1 gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <SectionHeader id="faq-heading" eyebrow="FAQ" title="Dammam transport questions, answered" intro="Short answers to what travellers ask before booking." />
            <a href={wa(HUB_WA)} target="_blank" rel="noopener noreferrer" className={BTN_O}><MessageCircle className="h-4 w-4" aria-hidden="true" /> Ask on WhatsApp</a>
          </div>
          <FaqList faqs={DAMMAM_HUB_FAQS} />
        </section>

        {/* ─── GUIDES ───────────────────────────────────────────── */}
        <section aria-labelledby="guides-heading">
          <h2 id="guides-heading" className="mb-5 font-heading text-xl font-bold">Eastern Province guides and related services</h2>
          <ul className="grid grid-cols-1 gap-x-8 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
            {DAMMAM_GUIDES.map((g) => (
              <li key={g.href}>
                <Link href={g.href} className="group flex min-h-[44px] items-center justify-between gap-3 border-b border-[#E5E7EB] py-2 text-sm font-semibold text-[#1C1C1C] hover:text-[#15803D]">
                  {g.label}
                  <ArrowRight className="h-4 w-4 shrink-0 text-[#16A34A] transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-[#4B5563]">
            Travelling on? See <Link href="/locations/riyadh" className={LINK}>private transfers in Riyadh</Link>, the <Link href="/services/airport-transfers" className={LINK}>airport transfer service</Link>, or <Link href="/book" className={LINK}>book online</Link>.
          </p>
        </section>
      </div>

      {/* ─── FINAL CTA ──────────────────────────────────────────── */}
      <section className="border-t border-[#E5E7EB] bg-white">
        <div className="section-container flex max-w-6xl flex-col items-start gap-6 py-14 pb-28 md:flex-row md:items-center md:justify-between md:pb-14">
          <div>
            <p className="font-heading text-2xl font-bold">Heading to Dammam soon?</p>
            <p className="mt-1 text-sm text-[#6B7280]">We track your flight, the fare is agreed before you book, and cancellation is free up to 24 hours before pickup.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a href="#quote" className={BTN_G}>Get My Quote <ArrowRight className="h-4 w-4" aria-hidden="true" /></a>
            <a href={wa(HUB_WA)} target="_blank" rel="noopener noreferrer" className={BTN_O}><MessageCircle className="h-4 w-4" aria-hidden="true" /> WhatsApp</a>
          </div>
        </div>
      </section>
    </div>
  );
}
