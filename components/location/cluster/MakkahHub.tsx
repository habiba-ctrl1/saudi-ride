import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageCircle, MapPin, PlaneLanding, Mail, Car, Train, Building2, Clock, Landmark } from "lucide-react";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqSchema, speakableSchema, itemListSchema } from "@/lib/schema";
import { contactConfig } from "@/lib/config/contact";
import { FLEET_VEHICLES } from "@/lib/fleet-data";
import { routeFact, CORPORATE_INVOICE_LINE } from "@/lib/data/cluster";
import {
  MAKKAH_FACTS,
  MAKKAH_TRIPS,
  MAKKAH_CORRIDORS,
  MAKKAH_HOTEL_ROUTES,
  MAKKAH_AREAS,
  MAKKAH_ZIYARAT_STOPS,
  MAKKAH_VEHICLE_FIT,
  MAKKAH_TIMING,
  CAR_VS_TRAIN,
  MAKKAH_VISITOR_GUIDE,
  MAKKAH_BOOKING_STEPS,
  MAKKAH_HUB_FAQS,
  MAKKAH_GUIDES,
  JED_AIRPORT_MK,
  MK_MADINAH,
  MK_TAIF,
  MK_RIYADH,
  MK_JEDDAH,
  FREE_WAIT,
} from "@/lib/data/makkah-cluster";
import { TripTypeSelector } from "./TripTypeSelector";
import { VehicleFitTool, type FitOption } from "./VehicleFitTool";
import { MakkahRouteMap } from "./MakkahRouteMap";
import { SectionHeader, FactsStrip, FaqList, QuoteSection, wa } from "./ui";

const SITE = "https://taxisaudiarabia.com";
const PATH = "/locations/makkah";
const HUB_WA = "Salam! Makkah transport enquiry.\n• From: \n• To: \n• Date & time: \n• Passengers & luggage: \n• Vehicle (Sedan / SUV / Staria / Van / Coaster): \n• Flight number (if airport): ";

const BTN_Y = "inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-[#FACC15] px-7 text-sm font-bold uppercase tracking-wider text-[#0B1F14] transition-colors hover:bg-[#FDE047] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white";
const BTN_G = "inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[#16A34A] px-6 text-xs font-bold uppercase tracking-wider text-[#FFFFFF] hover:bg-[#15803D]";
const BTN_O = "inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-[#16A34A]/30 px-6 text-xs font-bold uppercase tracking-wider text-[#15803D] hover:bg-[#F0FDF4]";
const LINK = "font-semibold text-[#15803D] hover:underline";

// Makkah hub — rebuilt 2026-10-08 on the shared cluster system. Title and H1
// were reworked from GSC evidence (seo/makkah-keyword-map.md): the hub sat at
// pos ~60 for "makkah taxi / taxi in makkah / makkah taxi service", so the
// title now carries the "private taxi" + Madinah + Ziyarat intents that the
// route pages prove demand for. URL unchanged.
export function MakkahHub({ name, nameAr }: { name: string; nameAr: string }) {
  const fitOptions: FitOption[] = MAKKAH_VEHICLE_FIT.map((v) => {
    const fleet = FLEET_VEHICLES.find((f) => f.slug === v.fleetSlug);
    return { id: v.id, label: v.label, forWho: v.forWho, href: v.href, passengers: fleet?.passengers ?? 0, luggage: fleet?.luggage ?? 0 };
  });
  const corridors = MAKKAH_CORRIDORS.map((c) => ({ ...c, f: routeFact(c.slug) })).filter((c) => c.f);
  const maxKm = Math.max(...corridors.map((c) => c.f!.km));
  const hotels = MAKKAH_HOTEL_ROUTES.map((h) => ({ ...h, f: routeFact(h.slug) })).filter((h) => h.f);
  const medAirport = routeFact("madinah-airport-to-makkah");

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "TaxiService",
      "@id": `${SITE}${PATH}#service`,
      name: "Private taxi, transfers & chauffeur service in Makkah",
      description:
        "Pre-booked private transfers in Makkah: Jeddah Airport transfers, Makkah–Madinah, Makkah–Jeddah and Makkah–Taif trips, hotel pickup and drop-off, Ziyarat transportation and private drivers by the hour, coordinated through a vetted partner network. Fare agreed before booking.",
      url: `${SITE}${PATH}`,
      provider: { "@type": "Organization", name: "Taxi Saudi Arabia", url: SITE },
      areaServed: { "@type": "City", name: "Makkah", geo: { "@type": "GeoCoordinates", latitude: 21.3891, longitude: 39.8579 } },
      availableLanguage: ["English", "Arabic"],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Makkah transport services",
        itemListElement: MAKKAH_TRIPS.filter((t) => t.href.startsWith("/")).map((t) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: t.label, url: `${SITE}${t.href}` },
        })),
      },
    },
    speakableSchema({ path: PATH }),
    itemListSchema(corridors.map((c) => ({ name: c.label, href: `/routes/${c.slug}` }))),
    faqSchema(MAKKAH_HUB_FAQS),
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#1C1C1C]">
      <JsonLd data={schema} />

      {/* ─── HERO ─────────────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden bg-[#0B1F14]">
        <Image
          src="/locations/makkah-hero.webp"
          alt="Minarets and colonnades of the Haram complex in Makkah at sunset"
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover object-[50%_32%]"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#0B1F14]/95 via-[#0B1F14]/70 to-[#0B1F14]/10" aria-hidden="true" />
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
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" /> Makkah · {nameAr}
            </p>
            <h1 className="mt-5 font-heading text-[2.25rem] font-bold leading-[1.08] text-[#FFFFFF] sm:text-5xl md:text-[3.5rem]">
              Private Taxi &amp; Transfer Service in <span className="text-[#FACC15]">Makkah</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/85 md:text-lg">
              Pre-booked private cars for Umrah travellers, families, couples, groups and companies — Jeddah Airport, Madinah, Taif, your Makkah hotel, Ziyarat, or a chauffeur by the hour. One fare, agreed before you book.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#quote" className={BTN_Y}>Request a Makkah Transfer Quote <ArrowRight className="h-4 w-4" aria-hidden="true" /></a>
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
              Taxi Saudi Arabia arranges pre-booked private transport in Makkah through a vetted partner network: transfers between Jeddah Airport (JED) and your Makkah hotel (about {JED_AIRPORT_MK.km} km), Makkah–Madinah ({MK_MADINAH.km} km), Makkah–Jeddah ({MK_JEDDAH.km} km) and Makkah–Taif ({MK_TAIF.km} km) trips, hotel pickup and drop-off, Ziyarat transportation and private drivers by the hour. You choose the vehicle, the fare is agreed before booking, and cancellation is free up to 24 hours before pickup.
            </p>
          </div>
          <div className="mt-7"><FactsStrip facts={MAKKAH_FACTS} /></div>
        </div>
      </section>

      <div className="section-container max-w-6xl space-y-20 py-20 md:space-y-28 md:py-28">
        {/* ─── TRIP SELECTOR ────────────────────────────────────── */}
        <section aria-labelledby="trip-heading">
          <SectionHeader id="trip-heading" eyebrow="Start here" title="What kind of Makkah trip do you need?" intro="Pick the closest match. Each one tells you what to send for a quote and links to the page that covers it." />
          <TripTypeSelector trips={MAKKAH_TRIPS} whatsappLink={contactConfig.whatsappLink} />
        </section>

        {/* ─── ROUTE MAP + CORRIDORS ────────────────────────────── */}
        <section id="destinations" aria-labelledby="routes-heading" className="scroll-mt-24">
          <SectionHeader id="routes-heading" eyebrow="Popular Makkah routes" title="Private transfers from and to Makkah" intro="Every route has its own page and quote form. Distances and drive times are approximate and come from the same route data as the route pages." />
          <MakkahRouteMap />
          <ol className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-2">
            {corridors.map((c) => (
              <li key={c.slug} className="group relative overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#16A34A]/40 hover:shadow-[0_14px_30px_-20px_rgba(15,23,42,0.45)] focus-within:border-[#16A34A]">
                <div className="flex items-center justify-between gap-3">
                  <Link href={`/routes/${c.slug}`} className="font-heading text-base font-bold text-[#1C1C1C] after:absolute after:inset-0 focus-visible:outline-none">{c.label}</Link>
                  <span className="shrink-0 text-right text-[0.8rem] font-semibold tabular-nums">{c.f!.km} km <span className="block text-[0.7rem] font-normal text-[#6B7280]">{c.f!.time}</span></span>
                </div>
                <div className="mt-4 flex items-center gap-2" aria-hidden="true">
                  <span className="h-3 w-3 shrink-0 rounded-full border-2 border-[#16A34A] bg-white" />
                  <span className="relative h-1 flex-1 overflow-hidden rounded-full bg-[#F3F4F6]">
                    <span className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#16A34A] to-[#FACC15]" style={{ width: `${Math.max(10, (c.f!.km / maxKm) * 100)}%` }} />
                  </span>
                  <span className="h-3 w-3 shrink-0 rounded-full bg-[#16A34A]" />
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[#4B5563]">{c.note}</p>
              </li>
            ))}
          </ol>
          <p className="mt-5 text-sm text-[#4B5563]">
            Also available: <Link href="/routes/makkah-to-madinah-airport" className={LINK}>Makkah to Madinah Airport</Link>, <Link href="/routes/makkah-to-kaec" className={LINK}>Makkah to KAEC</Link> and <Link href="/routes/makkah-to-yanbu" className={LINK}>Makkah to Yanbu</Link>. For other cities see the <Link href="/services/intercity" className={LINK}>intercity transfer service</Link>.
          </p>

          <div className="mt-10 overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white">
            <div className="border-b border-[#E5E7EB] p-5 md:p-6">
              <h3 className="font-heading text-lg font-bold">Private car or Haramain train between the cities?</h3>
              <p className="mt-1 text-sm text-[#6B7280]">Both work. They suit different travellers — here is the trade-off for a Makkah trip.</p>
            </div>
            <table className="w-full text-left text-sm">
              <caption className="sr-only">Comparison of a private car and the Haramain train for travel to and from Makkah</caption>
              <thead className="hidden bg-[#F9FAFB] text-[0.7rem] uppercase tracking-[0.14em] text-[#6B7280] sm:table-header-group">
                <tr>
                  <th scope="col" className="px-5 py-3 font-bold">&nbsp;</th>
                  <th scope="col" className="px-5 py-3 font-bold"><span className="inline-flex items-center gap-1.5"><Car className="h-3.5 w-3.5 text-[#16A34A]" aria-hidden="true" /> Private car</span></th>
                  <th scope="col" className="px-5 py-3 font-bold"><span className="inline-flex items-center gap-1.5"><Train className="h-3.5 w-3.5 text-[#6B7280]" aria-hidden="true" /> Haramain train</span></th>
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
            <a href={wa(MAKKAH_TRIPS[1].waPrefill)} target="_blank" rel="noopener noreferrer" className={BTN_G}><MessageCircle className="h-4 w-4" aria-hidden="true" /> Get a Makkah–Madinah Quote</a>
            <Link href="/guides/makkah-to-madinah-transport-guide" className={BTN_O}>Taxi, train and bus compared <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
          </div>
        </section>
      </div>

      {/* ─── AIRPORT (dark band) ──────────────────────────────────── */}
      <section aria-labelledby="airport-heading" className="relative overflow-hidden bg-[#0B1F14] py-20 md:py-24">
        <div className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-[#16A34A]/25 blur-3xl" aria-hidden="true" />
        <div className="section-container relative max-w-6xl">
          <SectionHeader tone="dark" id="airport-heading" eyebrow="Airport transfers" title="Jeddah Airport to your Makkah hotel — and back" intro={`King Abdulaziz International Airport (JED) is about ${JED_AIRPORT_MK.km} km from Makkah — ${JED_AIRPORT_MK.time} on a clear road.${medAirport ? ` Madinah Airport (MED) is about ${medAirport.km} km away for pilgrims arriving there first.` : ""}`} />
          <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { t: "Book with your flight", d: "Send the flight number and your hotel. The fare is agreed before you travel." },
              { t: "We track the flight", d: `Delays move your pickup, and ${FREE_WAIT} of waiting is free once you land.` },
              { t: "Meet your driver", d: "Driver details arrive on WhatsApp before pickup. The vehicle is sized to your bags." },
              { t: "Straight to Makkah", d: "To the nearest permitted drop-off at your hotel. The return leg is worked back from your flight." },
            ].map((s, i) => (
              <li key={s.t} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FACC15] font-heading text-sm font-bold text-[#0B1F14]">{i + 1}</span>
                <p className="mt-3 font-bold text-[#FFFFFF]">{s.t}</p>
                <p className="mt-1 text-sm leading-relaxed text-white/75">{s.d}</p>
              </li>
            ))}
          </ol>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href={wa(MAKKAH_TRIPS[0].waPrefill)} target="_blank" rel="noopener noreferrer" className={BTN_Y}><PlaneLanding className="h-4 w-4" aria-hidden="true" /> Plan My Airport Transfer</a>
            <Link href="/airports/king-abdulaziz-jeddah" className="inline-flex min-h-[52px] items-center justify-center gap-2 text-sm font-bold text-[#FACC15] hover:text-[#FDE047]">JED terminals and arrival details <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
          </div>
        </div>
      </section>

      <div className="section-container max-w-6xl space-y-20 py-20 md:space-y-28 md:py-28">
        {/* ─── HOTELS ───────────────────────────────────────────── */}
        <section id="hotels" aria-labelledby="hotels-heading" className="scroll-mt-24">
          <SectionHeader id="hotels-heading" eyebrow="Makkah hotel pickup & drop-off" title="Transfers to and from your Makkah hotel" intro="Pickup and drop-off are arranged at your confirmed hotel. Near Masjid al-Haram the driver uses the nearest permitted point at prayer times and tells you where to meet. These hotel pages cover the airport leg in detail:" />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <ul className="divide-y divide-[#E5E7EB] overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white">
              {hotels.map((h) => (
                <li key={h.slug}>
                  <Link href={`/routes/${h.slug}`} className="group flex min-h-[60px] items-center justify-between gap-4 px-5 py-3.5 transition-colors hover:bg-[#F0FDF4] focus-visible:bg-[#F0FDF4] focus-visible:outline-none">
                    <span>
                      <span className="block font-semibold text-[#1C1C1C] group-hover:text-[#15803D]">Jeddah Airport to {h.hotel}</span>
                      <span className="block text-[0.8rem] text-[#6B7280]">{h.f!.km} km · {h.f!.time}</span>
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-[#16A34A] transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
            <div className="rounded-3xl bg-[#0B1F14] p-6 text-[#FFFFFF] md:p-8">
              <Building2 className="h-6 w-6 text-[#FACC15]" aria-hidden="true" />
              <p className="mt-4 font-heading text-xl font-bold text-[#FFFFFF]">Not on the list?</p>
              <p className="mt-2 text-sm leading-relaxed text-white/80">Any Makkah hotel works — send the name and the leg you need (airport, station, another hotel or a city). We do not claim any hotel partnership; the driver simply meets you at your confirmed hotel.</p>
              <Link href="/guides/makkah-hotel-haram-dropoff-guide" className="mt-4 inline-flex min-h-[44px] items-center gap-2 text-sm font-bold text-[#FACC15] hover:text-[#FDE047]">Haram-area drop-off guide <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
              <a href={wa(MAKKAH_TRIPS[5].waPrefill)} target="_blank" rel="noopener noreferrer" className="mt-4 flex min-h-[44px] w-fit items-center gap-2 rounded-full bg-[#FACC15] px-5 text-xs font-bold uppercase tracking-wider text-[#0B1F14] hover:bg-[#FDE047]">Request My Hotel Transfer</a>
            </div>
          </div>
          <div className="mt-8">
            <p className="mb-3 text-[0.7rem] font-bold uppercase tracking-[0.16em] text-[#6B7280]">Makkah areas we serve</p>
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {MAKKAH_AREAS.map((a) => (
                <li key={a.slug}>
                  <Link href={`/locations/makkah/${a.slug}`} className="group flex min-h-[56px] items-center justify-between gap-3 rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 hover:border-[#16A34A]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A]">
                    <span>
                      <span className="block text-sm font-semibold text-[#1C1C1C] group-hover:text-[#15803D]">{a.name} <span className="font-normal text-[#9CA3AF]" lang="ar">{a.nameAr}</span></span>
                      <span className="block text-[0.75rem] text-[#6B7280]">{a.what}</span>
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-[#16A34A]" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ─── ZIYARAT ──────────────────────────────────────────── */}
        <section id="ziyarat" aria-labelledby="ziyarat-heading" className="scroll-mt-24">
          <SectionHeader id="ziyarat-heading" eyebrow="Makkah Ziyarat transportation" title="A private car between the Makkah sites you choose" intro="The car takes you from site to site and waits at each stop, so elders and children are never left looking for a ride. This is a transport service — it does not include religious guidance." />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.3fr_0.7fr]">
            <ol className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {MAKKAH_ZIYARAT_STOPS.map((s) => (
                <li key={s.name} className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
                  <p className="flex items-center gap-2 font-heading text-base font-bold"><Landmark className="h-4 w-4 text-[#16A34A]" aria-hidden="true" />{s.name} <span className="font-normal text-[#9CA3AF]" lang="ar">{s.nameAr}</span></p>
                  <p className="mt-2 text-sm leading-relaxed text-[#4B5563]">{s.note}</p>
                </li>
              ))}
            </ol>
            <div className="flex flex-col justify-between rounded-3xl bg-[#F0FDF4] p-6 md:p-8">
              <div>
                <p className="font-heading text-xl font-bold">Plan the day around prayer times</p>
                <p className="mt-2 text-sm leading-relaxed text-[#4B5563]">A half-day is usually enough for the main sites. Tell us the order you prefer, who is travelling, and how long you want at each stop.</p>
              </div>
              <div className="mt-6 flex flex-col gap-3">
                <a href={wa(MAKKAH_TRIPS[3].waPrefill)} target="_blank" rel="noopener noreferrer" className={BTN_G}><MessageCircle className="h-4 w-4" aria-hidden="true" /> Book Makkah Ziyarat Transport</a>
                <Link href="/services/makkah-ziyarat" className={BTN_O}>Ziyarat service details <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
              </div>
            </div>
          </div>
        </section>

        {/* ─── HOURLY / PRIVATE DRIVER ──────────────────────────── */}
        <section aria-labelledby="driver-heading" className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[2rem] border border-[#E5E7EB] bg-white p-7 md:p-10">
            <p className="flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[#16A34A]"><Clock className="h-4 w-4" aria-hidden="true" /> Private chauffeur in Makkah</p>
            <h2 id="driver-heading" className="mt-3 font-heading text-[1.75rem] font-bold leading-tight md:text-[2.1rem]">Hire a private driver in Makkah by the hour</h2>
            <p className="mt-4 text-sm leading-relaxed text-[#4B5563]">
              Three or more stops, elderly parents, children, meetings that may overrun, or a plan that has to flex around prayer times — book one car and driver for a half-day or full day. The car waits outside each stop and the fare for the whole block is agreed before you book.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/locations/makkah/private-driver" className={BTN_G}>Hire a Private Driver in Makkah <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
              <a href={wa(MAKKAH_TRIPS[4].waPrefill)} target="_blank" rel="noopener noreferrer" className={BTN_O}><MessageCircle className="h-4 w-4" aria-hidden="true" /> Ask on WhatsApp</a>
            </div>
          </div>
          <table className="w-full self-start overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white text-left text-sm">
            <caption className="sr-only">When to book a single transfer, hourly hire or a corporate arrangement in Makkah</caption>
            <thead className="bg-[#F9FAFB] text-[0.7rem] uppercase tracking-[0.14em] text-[#6B7280]"><tr><th scope="col" className="px-4 py-3 font-bold">Booking</th><th scope="col" className="px-4 py-3 font-bold">Best when</th></tr></thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              <tr><th scope="row" className="px-4 py-4 align-top font-semibold"><Link href="/routes/jeddah-airport-to-makkah" className="text-[#15803D] hover:underline">Single transfer</Link></th><td className="px-4 py-4 text-[#4B5563]">One pickup, one drop-off — airport, hotel move, Madinah.</td></tr>
              <tr><th scope="row" className="px-4 py-4 align-top font-semibold"><Link href="/locations/makkah/private-driver" className="text-[#15803D] hover:underline">Hourly driver</Link></th><td className="px-4 py-4 text-[#4B5563]">Three or more stops, or a flexible day.</td></tr>
              <tr><th scope="row" className="px-4 py-4 align-top font-semibold"><Link href="/services/corporate" className="text-[#15803D] hover:underline">Corporate</Link></th><td className="px-4 py-4 text-[#4B5563]">Recurring staff travel, delegations, written quote and invoice.</td></tr>
            </tbody>
          </table>
        </section>

        {/* ─── VEHICLE FIT ──────────────────────────────────────── */}
        <section aria-labelledby="vehicle-heading">
          <SectionHeader id="vehicle-heading" eyebrow="Vehicle options" title="Which vehicle fits your group and luggage?" intro="Set passengers and large bags and see which categories fit. Availability is confirmed for your date, route and passenger count when we quote. Larger coaches are arranged on request." />
          <VehicleFitTool options={fitOptions} />
          <p className="mt-4 text-sm text-[#4B5563]">See all categories on the <Link href="/fleet" className={LINK}>vehicle categories page</Link>. Vehicles are provided through our partner network.</p>
        </section>

        {/* ─── TIMING ───────────────────────────────────────────── */}
        <section aria-labelledby="timing-heading">
          <SectionHeader id="timing-heading" eyebrow="Plan your timing" title="What changes journey times in Makkah" intro="Drive times shift with the season, the hour and prayer times. These are the things that move them." />
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-[#E5E7EB] bg-[#E5E7EB] sm:grid-cols-2 lg:grid-cols-3">
            {MAKKAH_TIMING.map((t, i) => (
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
          <SectionHeader id="visitor-heading" eyebrow="First time booking in Makkah?" title="What travellers usually ask first" />
          <div className="grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-2">
            {MAKKAH_VISITOR_GUIDE.map((v) => (
              <div key={v.q} className="border-l-2 border-[#16A34A]/25 pl-5">
                <h3 className="font-heading text-base font-bold text-[#1C1C1C]">{v.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#4B5563]">{v.a}</p>
              </div>
            ))}
          </div>
          <div className="mt-14 rounded-3xl border border-[#16A34A]/15 bg-[#F0FDF4] p-6 md:p-8">
            <h3 className="font-heading text-lg font-bold">How booking works</h3>
            <ol className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {MAKKAH_BOOKING_STEPS.map((s, i) => (
                <li key={s.title}>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#16A34A] font-heading text-sm font-bold text-[#FFFFFF]">{i + 1}</span>
                  <p className="mt-3 font-bold text-[#1C1C1C]">{s.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-[#4B5563]">{s.desc}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ─── CORPORATE / GROUPS ───────────────────────────────── */}
        <section aria-labelledby="corp-heading" className="rounded-[2rem] bg-[#0B1F14] p-7 text-[#FFFFFF] md:p-10">
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[#FACC15]">For companies, VIP guests & groups</p>
          <h2 id="corp-heading" className="mt-3 font-heading text-[1.75rem] font-bold leading-tight text-[#FFFFFF] md:text-[2.1rem]">Corporate, group and VIP transportation in Makkah, quoted in writing</h2>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/80">
            Umrah group organisers, company travel, visiting delegations and VIP guests get one point of contact and a mix of executive sedans, SUVs, vans and coasters through our partner network. Larger coaches are arranged on request. {CORPORATE_INVOICE_LINE}
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              href={`mailto:${contactConfig.email}?subject=${encodeURIComponent("Corporate transportation RFQ — Makkah")}&body=${encodeURIComponent("Hello Taxi Saudi Arabia team,\n\nWe'd like a written quote for transportation in Makkah.\n\n• Company / group: \n• Contact name & role: \n• Dates: \n• Trips (airport / hotel / Madinah / other): \n• Passengers per trip: \n• Vehicle (Executive sedan / SUV / Van / Coaster): \n• Invoice needed?: \n\nPlease confirm the fixed fare before booking.\n\nThank you.")}`}
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[#FACC15] px-6 text-xs font-bold uppercase tracking-wider text-[#0B1F14] hover:bg-[#FDE047]"
            ><Mail className="h-4 w-4" aria-hidden="true" /> Request Corporate Transportation</a>
            <Link href="/services/group-transport" className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-white/25 px-6 text-xs font-bold uppercase tracking-wider text-[#FFFFFF] hover:bg-white/10">Group transport <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
            <Link href="/services/vip-transportation" className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-white/25 px-6 text-xs font-bold uppercase tracking-wider text-[#FFFFFF] hover:bg-white/10">VIP transportation <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
          </div>
        </section>

        {/* ─── QUOTE ────────────────────────────────────────────── */}
        <QuoteSection
          heading="Get your Makkah transfer quote"
          body="Tell us the trip — pickup, drop-off, date, passengers, luggage and your flight number for airport trips. We reply on WhatsApp with the vehicle and one fixed fare before anything is booked."
          submitLabel="Request a Makkah Transfer Quote"
          form={{ pickup: "Makkah" }}
          waPrefill={HUB_WA}
          pathB={{
            heading: "Booking for a company or an Umrah group?",
            body: `Send your trip list by email for a written quote. ${CORPORATE_INVOICE_LINE}`,
            emailSubject: "Transport RFQ — Makkah",
            emailBody: "Hello Taxi Saudi Arabia team,\n\nWe'd like a written quote for transfers in Makkah.\n\n• Company / group: \n• Contact name: \n• Dates & flight numbers: \n• Trips (JED / Madinah / hotel / Ziyarat): \n• Passengers per trip: \n• Vehicle preference: \n\nPlease confirm the fixed fare before booking.\n\nThank you.",
          }}
        />

        {/* ─── FAQ ──────────────────────────────────────────────── */}
        <section aria-labelledby="faq-heading" className="grid grid-cols-1 gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <SectionHeader id="faq-heading" eyebrow="FAQ" title="Makkah transport questions, answered" intro="Short answers to what travellers ask before booking." />
            <a href={wa(HUB_WA)} target="_blank" rel="noopener noreferrer" className={BTN_O}><MessageCircle className="h-4 w-4" aria-hidden="true" /> Ask on WhatsApp</a>
          </div>
          <FaqList faqs={MAKKAH_HUB_FAQS} />
        </section>

        {/* ─── GUIDES ───────────────────────────────────────────── */}
        <section aria-labelledby="guides-heading">
          <h2 id="guides-heading" className="mb-5 font-heading text-xl font-bold">Makkah travel guides and related services</h2>
          <ul className="grid grid-cols-1 gap-x-8 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
            {MAKKAH_GUIDES.map((g) => (
              <li key={g.href}>
                <Link href={g.href} className="group flex min-h-[44px] items-center justify-between gap-3 border-b border-[#E5E7EB] py-2 text-sm font-semibold text-[#1C1C1C] hover:text-[#15803D]">
                  {g.label}
                  <ArrowRight className="h-4 w-4 shrink-0 text-[#16A34A] transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-[#4B5563]">
            Travelling on to other cities? See <Link href="/locations/madinah" className={LINK}>private transfers in Madinah</Link>, <Link href="/locations/taif" className={LINK}>Taif</Link> and <Link href="/locations/jeddah" className={LINK}>Jeddah</Link>, or the <Link href="/services/airport-transfers" className={LINK}>airport transfer service</Link>. Riyadh is about {MK_RIYADH.km} km away — see <Link href="/routes/makkah-to-riyadh" className={LINK}>Makkah to Riyadh</Link>.
          </p>
        </section>
      </div>

      {/* ─── FINAL CTA ──────────────────────────────────────────── */}
      <section className="border-t border-[#E5E7EB] bg-white">
        <div className="section-container flex max-w-6xl flex-col items-start gap-6 py-14 pb-28 md:flex-row md:items-center md:justify-between md:pb-14">
          <div>
            <p className="font-heading text-2xl font-bold">Heading to Makkah soon?</p>
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
