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
  MADINAH_FACTS,
  MADINAH_TRIPS,
  MADINAH_CORRIDORS,
  MADINAH_AREAS,
  MADINAH_VEHICLE_FIT,
  MADINAH_TIMING,
  CAR_TRAIN_BUS,
  CAR_TRAIN_BUS_NOTE,
  MADINAH_VISITOR_GUIDE,
  MADINAH_BOOKING_STEPS,
  MADINAH_HUB_FAQS,
  MADINAH_GUIDES,
  MED_ARRIVAL_STEPS,
  MED_DEPARTURE_STEPS,
  ZIYARAT_STOPS,
  MD_MED_CITY,
  MD_MAKKAH,
  MD_JED_AIRPORT,
  MD_ALULA,
  MD_RIYADH,
  FREE_WAIT,
} from "@/lib/data/madinah-cluster";
import { TripTypeSelector } from "./TripTypeSelector";
import { VehicleFitTool, type FitOption } from "./VehicleFitTool";
import { MadinahRouteMap } from "./MadinahRouteMap";
import { AirportFlow } from "./AirportFlow";
import { ZiyaratPlanner } from "./ZiyaratPlanner";
import { SectionHeader, FactsStrip, FaqList, QuoteSection, wa } from "./ui";

const SITE = "https://taxisaudiarabia.com";
const PATH = "/locations/madinah";
const HUB_WA = "Salam! Madinah transport enquiry.\n• From: \n• To: \n• Date & time: \n• Passengers & luggage: \n• Vehicle (Sedan / SUV / Staria / Van / Coaster): \n• Flight number (if airport): ";

const BTN_Y = "inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-[#FACC15] px-7 text-sm font-bold uppercase tracking-wider text-[#0B1F14] transition-colors hover:bg-[#FDE047] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white";
const BTN_G = "inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[#16A34A] px-6 text-xs font-bold uppercase tracking-wider text-[#FFFFFF] hover:bg-[#15803D]";
const BTN_O = "inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-[#16A34A]/30 px-6 text-xs font-bold uppercase tracking-wider text-[#15803D] hover:bg-[#F0FDF4]";
const LINK = "font-semibold text-[#15803D] hover:underline";

// Madinah hub — rebuilt 2026-10-09 on the shared cluster system from
// seo/madinah-keyword-map.md. Title/description unchanged (already carry the
// Ziyarat / MED / hotels intents). The old fabricated testimonials and
// "our drivers" wording were removed. Hero: genuine photograph of the
// umbrella canopies in the courtyard of Al-Masjid an-Nabawi (inspected
// 2026-10-09; see seo/madinah-visual-assets.md).
export function MadinahHub({ name, nameAr }: { name: string; nameAr: string }) {
  const fitOptions: FitOption[] = MADINAH_VEHICLE_FIT.map((v) => {
    const fleet = FLEET_VEHICLES.find((f) => f.slug === v.fleetSlug);
    return { id: v.id, label: v.label, forWho: v.forWho, href: v.href, passengers: fleet?.passengers ?? 0, luggage: fleet?.luggage ?? 0 };
  });
  const corridors = MADINAH_CORRIDORS.map((c) => ({ ...c, f: routeFact(c.slug) })).filter((c) => c.f);
  const maxKm = Math.max(...corridors.map((c) => c.f!.km));

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "TaxiService",
      "@id": `${SITE}${PATH}#service`,
      name: "Private transfers, Ziyarat transportation & chauffeur service in Madinah",
      description:
        "Pre-booked private transfers in Madinah: Madinah Airport (MED) transfers, hotel pickup and drop-off near Al-Masjid an-Nabawi, Ziyarat transportation, private drivers by the hour and intercity trips to Makkah, Jeddah, AlUla, Riyadh and Yanbu, coordinated through a vetted partner network. Fare agreed before booking.",
      url: `${SITE}${PATH}`,
      provider: { "@type": "Organization", name: "Taxi Saudi Arabia", url: SITE },
      areaServed: { "@type": "City", name: "Madinah", geo: { "@type": "GeoCoordinates", latitude: 24.4672, longitude: 39.6111 } },
      availableLanguage: ["English", "Arabic"],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Madinah transport services",
        itemListElement: MADINAH_TRIPS.filter((t) => t.href.startsWith("/")).map((t) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: t.label, url: `${SITE}${t.href}` },
        })),
      },
    },
    speakableSchema({ path: PATH }),
    itemListSchema(corridors.map((c) => ({ name: c.label, href: `/routes/${c.slug}` }))),
    faqSchema(MADINAH_HUB_FAQS),
  ];

  const loopStops = ZIYARAT_STOPS.filter((s) => s.id !== "dhul-hulayfah");

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#1C1C1C]">
      <JsonLd data={schema} />

      {/* ─── HERO ─────────────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden bg-[#0B1F14]">
        <Image
          src="/locations/madinah-hero.webp"
          alt="Sunlit umbrella canopies in the courtyard of Al-Masjid an-Nabawi in Madinah"
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover object-[50%_18%]"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#0B1F14]/95 via-[#0B1F14]/75 to-[#0B1F14]/25" aria-hidden="true" />
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
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" /> Private Madinah transportation · {nameAr}
            </p>
            <h1 className="mt-5 font-heading text-[2.25rem] font-bold leading-[1.08] text-[#FFFFFF] sm:text-5xl md:text-[3.5rem]">
              Private Transfers &amp; Car Service in <span className="text-[#FACC15]">Madinah</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/85 md:text-lg">
              Madinah Airport (MED) transfers, hotel pickups near Al-Masjid an-Nabawi, Ziyarat by car, a private driver by the hour, and intercity journeys to Makkah, Jeddah and AlUla — in a private vehicle. Tell us the route, date and passengers and we confirm one fare on WhatsApp before you book.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#quote" className={BTN_Y}>Get a Private Transfer Quote <ArrowRight className="h-4 w-4" aria-hidden="true" /></a>
              <a href={wa(HUB_WA)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full border border-white/30 bg-white/5 px-7 text-sm font-bold uppercase tracking-wider text-[#FFFFFF] backdrop-blur hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                <MessageCircle className="h-4 w-4" aria-hidden="true" /> WhatsApp Us
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
            <p id="answer-heading" className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[#16A34A] md:w-32 md:pt-1">Quick answer</p>
            <p id="speakable-summary" className="text-[1.05rem] leading-relaxed text-[#1F2937] md:text-lg">
              Taxi Saudi Arabia arranges pre-booked private transport in Madinah (Medina) through a vetted partner network: transfers from Prince Mohammad bin Abdulaziz International Airport (MED), about {MD_MED_CITY.km} km from the city centre; hotel pickups near Al-Masjid an-Nabawi; Ziyarat by car; a private driver by the hour; and intercity trips to Makkah ({MD_MAKKAH.km} km), Jeddah Airport ({MD_JED_AIRPORT.km} km) and AlUla ({MD_ALULA.km} km). You choose the vehicle and the fare is confirmed before booking.
            </p>
          </div>
          <div className="mt-7"><FactsStrip facts={MADINAH_FACTS} /></div>
        </div>
      </section>

      <div className="section-container max-w-6xl space-y-20 py-20 md:space-y-28 md:py-28">
        {/* ─── TRIP SELECTOR ────────────────────────────────────── */}
        <section aria-labelledby="trip-heading">
          <SectionHeader id="trip-heading" eyebrow="Start here" title="Which Madinah transfer do you need?" intro="Pick the closest match. Each one tells you what to send for a quote and links to the page that covers it." />
          <TripTypeSelector trips={MADINAH_TRIPS} whatsappLink={contactConfig.whatsappLink} />
        </section>

        {/* ─── PRIVATE CAR: WHEN IT MAKES SENSE ─────────────────── */}
        <section aria-labelledby="why-heading">
          <SectionHeader id="why-heading" eyebrow="An honest comparison" title="When a private car makes sense in Madinah" intro="Madinah has public buses, regular taxis and a railway to Makkah. A private transfer earns its place in these situations:" />
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { t: "Hotel-to-hotel with luggage", b: "One vehicle from door to nearest permitted drop-off, with no station or bus change." },
              { t: "Families and elderly passengers", b: "Fewer transfers, space to board slowly, and a car that waits while you visit a site." },
              { t: "Several Ziyarat stops", b: "One booking for Quba, Qiblatayn, Uhud and back, instead of re-hailing at each site." },
              { t: "Late or early flights", b: "Pickup is worked back from your flight at any hour, and your flight is tracked." },
              { t: "Travelling on from Madinah", b: "Makkah, Jeddah, AlUla or Riyadh in the same vehicle, with stops on request." },
              { t: "Groups that stay together", b: "One fare for the whole car, or a van or coaster for larger parties." },
            ].map((c) => (
              <li key={c.t} className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
                <p className="font-heading text-base font-bold">{c.t}</p>
                <p className="mt-2 text-sm leading-relaxed text-[#4B5563]">{c.b}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* ─── ROUTE MAP + CORRIDORS ────────────────────────────── */}
        <section id="destinations" aria-labelledby="routes-heading" className="scroll-mt-24">
          <SectionHeader id="routes-heading" eyebrow="Intercity from Madinah" title="Private transfers from and to Madinah" intro="Every route has its own page and quote form. Distances and drive times are approximate and come from the same route data as the route pages." />
          <MadinahRouteMap />
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
            Also available: <Link href="/routes/madinah-to-taif" className={LINK}>Madinah to Taif</Link>, <Link href="/routes/madinah-airport-to-makkah" className={LINK}>Madinah Airport to Makkah</Link>, <Link href="/routes/medinah-to-amman" className={LINK}>Madinah to Amman, Jordan</Link>, and the Badr historical sites on the <Link href="/services/badr-ziyarat" className={LINK}>Badr Ziyarat</Link> trip. For other cities see the <Link href="/services/intercity" className={LINK}>intercity transfer service</Link>.
          </p>

          <div className="mt-10 overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white">
            <div className="border-b border-[#E5E7EB] p-5 md:p-6">
              <h3 className="font-heading text-lg font-bold">Private car, train or bus between Madinah and Makkah?</h3>
              <p className="mt-1 text-sm text-[#6B7280]">All three work. They suit different travellers — here is the trade-off.</p>
            </div>
            <table className="w-full text-left text-sm">
              <caption className="sr-only">Qualitative comparison of a private car, the Haramain train and an intercity bus between Madinah and Makkah</caption>
              <thead className="hidden bg-[#F9FAFB] text-[0.7rem] uppercase tracking-[0.14em] text-[#6B7280] sm:table-header-group">
                <tr>
                  <th scope="col" className="px-5 py-3 font-bold">&nbsp;</th>
                  <th scope="col" className="px-5 py-3 font-bold"><span className="inline-flex items-center gap-1.5"><Car className="h-3.5 w-3.5 text-[#16A34A]" aria-hidden="true" /> Private car</span></th>
                  <th scope="col" className="px-5 py-3 font-bold"><span className="inline-flex items-center gap-1.5"><Train className="h-3.5 w-3.5 text-[#6B7280]" aria-hidden="true" /> Haramain train</span></th>
                  <th scope="col" className="px-5 py-3 font-bold">Intercity bus</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {CAR_TRAIN_BUS.map((r) => (
                  <tr key={r.point} className="block p-4 sm:table-row sm:p-0">
                    <th scope="row" className="block font-semibold sm:table-cell sm:px-5 sm:py-4">{r.point}</th>
                    <td className="block pt-1 text-[#1F2937] sm:table-cell sm:px-5 sm:py-4"><span className="mr-1 text-[0.65rem] font-bold uppercase tracking-wider text-[#16A34A] sm:hidden">Car:</span>{r.car}</td>
                    <td className="block pt-1 text-[#4B5563] sm:table-cell sm:px-5 sm:py-4"><span className="mr-1 text-[0.65rem] font-bold uppercase tracking-wider text-[#9CA3AF] sm:hidden">Train:</span>{r.train}</td>
                    <td className="block pt-1 text-[#4B5563] sm:table-cell sm:px-5 sm:py-4"><span className="mr-1 text-[0.65rem] font-bold uppercase tracking-wider text-[#9CA3AF] sm:hidden">Bus:</span>{r.bus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="border-t border-[#E5E7EB] p-5 text-sm leading-relaxed text-[#4B5563] md:px-6">{CAR_TRAIN_BUS_NOTE}</p>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a href={wa(MADINAH_TRIPS[4].waPrefill)} target="_blank" rel="noopener noreferrer" className={BTN_G}><MessageCircle className="h-4 w-4" aria-hidden="true" /> Get a Madinah–Makkah Quote</a>
            <Link href="/guides/makkah-to-madinah-transport-guide" className={BTN_O}>Taxi, train and bus compared <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
          </div>
        </section>
      </div>

      {/* ─── AIRPORT (dark band) ──────────────────────────────────── */}
      <section id="airport" aria-labelledby="airport-heading" className="relative scroll-mt-24 overflow-hidden bg-[#0B1F14] py-20 md:py-24">
        <div className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-[#16A34A]/25 blur-3xl" aria-hidden="true" />
        <div className="section-container relative max-w-6xl">
          <SectionHeader tone="dark" id="airport-heading" eyebrow="Madinah Airport (MED)" title="Madinah Airport to your hotel — and back" intro={`Prince Mohammad bin Abdulaziz International Airport (MED) is about ${MD_MED_CITY.km} km from the Central Area — ${MD_MED_CITY.time} on a clear road. Pre-book, share your flight number, and the driver meets you at arrivals.`} />
          <AirportFlow arrival={MED_ARRIVAL_STEPS} departure={MED_DEPARTURE_STEPS} code="MED" />
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href={wa(MADINAH_TRIPS[0].waPrefill)} target="_blank" rel="noopener noreferrer" className={BTN_Y}><PlaneLanding className="h-4 w-4" aria-hidden="true" /> Book My MED Transfer</a>
            <Link href="/airports/prince-mohammad-madinah" className="inline-flex min-h-[52px] items-center justify-center gap-2 text-sm font-bold text-[#FACC15] hover:text-[#FDE047]">Madinah Airport transfer details <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
          </div>
        </div>
      </section>

      <div className="section-container max-w-6xl space-y-20 py-20 md:space-y-28 md:py-28">
        {/* ─── HOTELS / CENTRAL AREA ────────────────────────────── */}
        <section id="hotels" aria-labelledby="hotels-heading" className="scroll-mt-24">
          <SectionHeader id="hotels-heading" eyebrow="Hotels near Masjid an-Nabawi" title="Transfers to and from the Central Area (Markaziyah)" intro="The Central Area is the district around Al-Masjid an-Nabawi where most pilgrim hotels stand. Vehicle access there is restricted, so the driver uses the nearest permitted drop-off point to your hotel." />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6 md:p-8">
              <h3 className="font-heading text-lg font-bold">What to expect at a hotel near the mosque</h3>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-[#4B5563]">
                {[
                  "Give us the exact hotel name — it decides which permitted drop-off point the driver uses.",
                  "Prayer times and Fridays can slow or restrict the roads around the mosque; the pickup time allows for it.",
                  "Porters or a short walk may be needed from the drop-off point, so tell us about heavy bags or mobility needs.",
                  `From MED the Central Area is about ${MD_MED_CITY.km} km (${MD_MED_CITY.time}); the Markaziyah airport route page covers hotel-level detail.`,
                ].map((t) => (
                  <li key={t} className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#16A34A]" aria-hidden="true" />{t}</li>
                ))}
              </ul>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link href="/routes/madinah-airport-to-madinah-markaziyah" className={BTN_G}>MED to Markaziyah hotels <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
                <Link href="/services/hotel-transfers" className={BTN_O}>Hotel transfer service</Link>
              </div>
            </div>
            <div className="rounded-3xl bg-[#0B1F14] p-6 text-[#FFFFFF] md:p-8">
              <Building2 className="h-6 w-6 text-[#FACC15]" aria-hidden="true" />
              <p className="mt-4 font-heading text-xl font-bold text-[#FFFFFF]">Hotel to hotel or hotel to station</p>
              <p className="mt-2 text-sm leading-relaxed text-white/80">Any Madinah hotel works — send the name and the leg you need (airport, station, another hotel or a city). We do not claim any hotel partnership; the driver meets you at your confirmed hotel.</p>
              <a href={wa(MADINAH_TRIPS[1].waPrefill)} target="_blank" rel="noopener noreferrer" className="mt-5 flex min-h-[44px] w-fit items-center gap-2 rounded-full bg-[#FACC15] px-5 text-xs font-bold uppercase tracking-wider text-[#0B1F14] hover:bg-[#FDE047]">Request My Hotel Transfer</a>
            </div>
          </div>
          <div className="mt-8">
            <p className="mb-3 text-[0.7rem] font-bold uppercase tracking-[0.16em] text-[#6B7280]">Madinah areas we serve</p>
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {MADINAH_AREAS.map((a) => (
                <li key={a.slug}>
                  <Link href={`/locations/madinah/${a.slug}`} className="group flex min-h-[56px] items-center justify-between gap-3 rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 hover:border-[#16A34A]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A]">
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
          <SectionHeader id="ziyarat-heading" eyebrow="Madinah Ziyarat by car" title="Private Ziyarat transportation between the sites you choose" intro="The car takes you from site to site and waits at each stop, so elders and children are never left looking for a ride. This is a transport service — it does not include a guide or religious guidance. Pick your stops below." />
          <ZiyaratPlanner whatsappLink={contactConfig.whatsappLink} />
          <ol className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {loopStops.map((s) => (
              <li key={s.id} className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
                <p className="flex items-center gap-2 font-heading text-base font-bold"><Landmark className="h-4 w-4 shrink-0 text-[#16A34A]" aria-hidden="true" />{s.name.split(" (")[0].replace(" & the Uhud martyrs' cemetery", "")}</p>
                <p className="mt-0.5 text-[0.75rem] text-[#9CA3AF]" lang="ar">{s.nameAr}</p>
                <p className="mt-2 text-sm leading-relaxed text-[#4B5563]">{s.about}</p>
                <p className="mt-2 text-[0.75rem] text-[#6B7280]">About {s.km} km by road from Masjid an-Nabawi, ~{s.min} min without traffic.</p>
              </li>
            ))}
          </ol>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href="/services/madinah-ziyarat" className={BTN_G}>Madinah Ziyarat service <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
            <Link href="/guides/madinah-ziyarat-sites-guide" className={BTN_O}>Ziyarat sites guide</Link>
            <Link href="/services/badr-ziyarat" className={BTN_O}>Badr Ziyarat</Link>
          </div>
        </section>

        {/* ─── MAKKAH + MIQAT ───────────────────────────────────── */}
        <section aria-labelledby="makkah-heading" className="rounded-[2rem] border border-[#16A34A]/15 bg-[#F0FDF4] p-7 md:p-10">
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[#16A34A]">Madinah ↔ Makkah</p>
          <h2 id="makkah-heading" className="mt-3 font-heading text-[1.75rem] font-bold leading-tight md:text-[2.1rem]">Travelling from Madinah to Makkah for Umrah?</h2>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[#374151]">
            The drive is about {MD_MAKKAH.km} km — roughly {MD_MAKKAH.time} plus your stops. For travellers leaving Madinah, the Miqat is Dhul Hulayfah (Abyar Ali), on the road south-west of the city. If you want a stop there, tell us when you book and we plan it into the trip. What to do at the Miqat is a religious question for a qualified scholar; we only handle the transport.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link href="/routes/madinah-to-makkah" className={BTN_G}>Madinah to Makkah <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
            <Link href="/routes/makkah-to-madinah" className={BTN_O}>Makkah to Madinah</Link>
            <Link href="/guides/dhul-hulaifah-miqat-madinah" className={BTN_O}>Dhul Hulaifah guide</Link>
          </div>
        </section>

        {/* ─── HOURLY / PRIVATE DRIVER ──────────────────────────── */}
        <section aria-labelledby="driver-heading" className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[2rem] border border-[#E5E7EB] bg-white p-7 md:p-10">
            <p className="flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[#16A34A]"><Clock className="h-4 w-4" aria-hidden="true" /> Car with driver in Madinah</p>
            <h2 id="driver-heading" className="mt-3 font-heading text-[1.75rem] font-bold leading-tight md:text-[2.1rem]">Hire a private driver in Madinah by the hour</h2>
            <p className="mt-4 text-sm leading-relaxed text-[#4B5563]">
              Three or more stops, elderly parents, children, or a plan that has to flex around prayer times — book one car and driver for a half-day or full day. The car waits outside each stop and the fare for the whole block is agreed before you book.
            </p>
            <ol className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-2 text-[0.8rem] font-semibold text-[#15803D]" aria-label="Typical hourly-hire day">
              {["Pickup", "Stop 1", "Wait", "Stop 2", "Wait", "Stop 3", "Hotel"].map((s, i, a) => (
                <li key={`${s}-${i}`} className="flex items-center gap-2"><span className={`rounded-full px-3 py-1 ${s === "Wait" ? "bg-[#F3F4F6] text-[#6B7280]" : "bg-[#F0FDF4]"}`}>{s}</span>{i < a.length - 1 && <ArrowRight className="h-3.5 w-3.5 text-[#9CA3AF]" aria-hidden="true" />}</li>
              ))}
            </ol>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/locations/madinah/private-driver" className={BTN_G}>Request an Hourly Car <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
              <a href={wa(MADINAH_TRIPS[3].waPrefill)} target="_blank" rel="noopener noreferrer" className={BTN_O}><MessageCircle className="h-4 w-4" aria-hidden="true" /> Ask on WhatsApp</a>
            </div>
          </div>
          <table className="w-full self-start overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white text-left text-sm">
            <caption className="sr-only">When to book a single transfer, hourly hire or a corporate arrangement in Madinah</caption>
            <thead className="bg-[#F9FAFB] text-[0.7rem] uppercase tracking-[0.14em] text-[#6B7280]"><tr><th scope="col" className="px-4 py-3 font-bold">Booking</th><th scope="col" className="px-4 py-3 font-bold">Best when</th></tr></thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              <tr><th scope="row" className="px-4 py-4 align-top font-semibold"><Link href="/airports/prince-mohammad-madinah" className="text-[#15803D] hover:underline">Single transfer</Link></th><td className="px-4 py-4 text-[#4B5563]">One pickup, one drop-off — airport, hotel move, Makkah.</td></tr>
              <tr><th scope="row" className="px-4 py-4 align-top font-semibold"><Link href="/locations/madinah/private-driver" className="text-[#15803D] hover:underline">Hourly driver</Link></th><td className="px-4 py-4 text-[#4B5563]">Three or more stops, or a flexible day.</td></tr>
              <tr><th scope="row" className="px-4 py-4 align-top font-semibold"><Link href="/services/corporate" className="text-[#15803D] hover:underline">Corporate</Link></th><td className="px-4 py-4 text-[#4B5563]">Recurring staff travel, delegations, written quote and invoice.</td></tr>
            </tbody>
          </table>
        </section>

        {/* ─── VEHICLE FIT ──────────────────────────────────────── */}
        <section aria-labelledby="vehicle-heading">
          <SectionHeader id="vehicle-heading" eyebrow="Vehicle options" title="Choose the right vehicle for your group and luggage" intro="Set passengers and large bags and see which categories fit. Availability is confirmed for your date, route and passenger count when we quote. Larger coaches are arranged on request." />
          <VehicleFitTool options={fitOptions} />
          <p className="mt-4 text-sm text-[#4B5563]">See all categories on the <Link href="/fleet" className={LINK}>vehicle categories page</Link>. Vehicles are provided through our partner network.</p>
        </section>

        {/* ─── TIMING ───────────────────────────────────────────── */}
        <section aria-labelledby="timing-heading">
          <SectionHeader id="timing-heading" eyebrow="Plan your timing" title="What changes journey times in Madinah" intro="Drive times shift with the season, the hour and prayer times. These are the things that move them." />
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-[#E5E7EB] bg-[#E5E7EB] sm:grid-cols-2 lg:grid-cols-3">
            {MADINAH_TIMING.map((t, i) => (
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
          <SectionHeader id="visitor-heading" eyebrow="First time in Madinah?" title="Terms you will see, in plain English" />
          <div className="grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-2">
            {MADINAH_VISITOR_GUIDE.map((v) => (
              <div key={v.q} className="border-l-2 border-[#16A34A]/25 pl-5">
                <h3 className="font-heading text-base font-bold text-[#1C1C1C]">{v.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#4B5563]">{v.a}</p>
              </div>
            ))}
          </div>
          <div className="mt-14 rounded-3xl border border-[#16A34A]/15 bg-[#F0FDF4] p-6 md:p-8">
            <h3 className="font-heading text-lg font-bold">How booking works</h3>
            <ol className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {MADINAH_BOOKING_STEPS.map((s, i) => (
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
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[#FACC15]">For companies, Umrah groups & delegations</p>
          <h2 id="corp-heading" className="mt-3 font-heading text-[1.75rem] font-bold leading-tight text-[#FFFFFF] md:text-[2.1rem]">Corporate and group transportation in Madinah, quoted in writing</h2>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/80">
            Umrah group organisers, company travel and visiting delegations get one point of contact and a mix of executive sedans, SUVs, vans and coasters through our partner network. Larger coaches are arranged on request. {CORPORATE_INVOICE_LINE}
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              href={`mailto:${contactConfig.email}?subject=${encodeURIComponent("Corporate transportation RFQ — Madinah")}&body=${encodeURIComponent("Hello Taxi Saudi Arabia team,\n\nWe'd like a written quote for transportation in Madinah.\n\n• Company / group: \n• Contact name & role: \n• Dates: \n• Trips (MED / hotel / Ziyarat / Makkah / other): \n• Passengers per trip: \n• Vehicle (Executive sedan / SUV / Van / Coaster): \n• Invoice needed?: \n\nPlease confirm the fixed fare before booking.\n\nThank you.")}`}
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[#FACC15] px-6 text-xs font-bold uppercase tracking-wider text-[#0B1F14] hover:bg-[#FDE047]"
            ><Mail className="h-4 w-4" aria-hidden="true" /> Request Corporate Transportation</a>
            <Link href="/services/group-transport" className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-white/25 px-6 text-xs font-bold uppercase tracking-wider text-[#FFFFFF] hover:bg-white/10">Group transport <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
            <Link href="/services/umrah-transport" className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-white/25 px-6 text-xs font-bold uppercase tracking-wider text-[#FFFFFF] hover:bg-white/10">Umrah transport <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
          </div>
        </section>

        {/* ─── QUOTE ────────────────────────────────────────────── */}
        <QuoteSection
          heading="Get your Madinah transfer quote"
          body="Tell us the trip — pickup, drop-off, date, passengers, luggage and your flight number for airport trips. We reply on WhatsApp with the vehicle and one fixed fare before anything is booked."
          submitLabel="Request a Madinah Transfer Quote"
          form={{ pickup: "Madinah" }}
          waPrefill={HUB_WA}
          pathB={{
            heading: "Booking for a company or an Umrah group?",
            body: `Send your trip list by email for a written quote. ${CORPORATE_INVOICE_LINE}`,
            emailSubject: "Transport RFQ — Madinah",
            emailBody: "Hello Taxi Saudi Arabia team,\n\nWe'd like a written quote for transfers in Madinah.\n\n• Company / group: \n• Contact name: \n• Dates & flight numbers: \n• Trips (MED / hotel / Ziyarat / Makkah): \n• Passengers per trip: \n• Vehicle preference: \n\nPlease confirm the fixed fare before booking.\n\nThank you.",
          }}
        />

        {/* ─── FAQ ──────────────────────────────────────────────── */}
        <section aria-labelledby="faq-heading" className="grid grid-cols-1 gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <SectionHeader id="faq-heading" eyebrow="FAQ" title="Madinah transfer questions, answered" intro="Short answers to what travellers ask before booking." />
            <a href={wa(HUB_WA)} target="_blank" rel="noopener noreferrer" className={BTN_O}><MessageCircle className="h-4 w-4" aria-hidden="true" /> Ask on WhatsApp</a>
          </div>
          <FaqList faqs={MADINAH_HUB_FAQS} />
        </section>

        {/* ─── GUIDES ───────────────────────────────────────────── */}
        <section aria-labelledby="guides-heading">
          <h2 id="guides-heading" className="mb-5 font-heading text-xl font-bold">Madinah travel guides and related services</h2>
          <ul className="grid grid-cols-1 gap-x-8 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
            {MADINAH_GUIDES.map((g) => (
              <li key={g.href}>
                <Link href={g.href} className="group flex min-h-[44px] items-center justify-between gap-3 border-b border-[#E5E7EB] py-2 text-sm font-semibold text-[#1C1C1C] hover:text-[#15803D]">
                  {g.label}
                  <ArrowRight className="h-4 w-4 shrink-0 text-[#16A34A] transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-[#4B5563]">
            Travelling on to other cities? See <Link href="/locations/makkah" className={LINK}>private transfers in Makkah</Link>, <Link href="/locations/jeddah" className={LINK}>Jeddah</Link>, <Link href="/locations/alula" className={LINK}>AlUla</Link> and <Link href="/locations/yanbu" className={LINK}>Yanbu</Link>, or the <Link href="/services/airport-transfers" className={LINK}>airport transfer service</Link>. Riyadh is about {MD_RIYADH.km} km away — see <Link href="/routes/madinah-to-riyadh" className={LINK}>Madinah to Riyadh</Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
