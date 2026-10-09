import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Info, MessageCircle, MapPin, Luggage, CheckCircle2, Plane, ShieldCheck } from "lucide-react";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { TLDRSummary } from "@/components/seo/TLDRSummary";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import WhatsAppQuoteForm from "@/components/booking/WhatsAppQuoteForm";
import { contactConfig } from "@/lib/config/contact";
import { serviceSchema, faqSchema, speakableSchema, itemListSchema } from "@/lib/schema";
import { ALT_AIRPORTS, altFacts, altWaText, type AltAirport } from "@/lib/data/riyadh-alternative-airports";

// Comparison hub for "which airport can I reach from Riyadh by road?".
// It links DOWN to the airport sections that already live on the route pages
// (owner Option A, 2026-10-09) and takes none of their route-level keywords.
const PATH = "/riyadh-alternative-airports";
const URL = `https://taxisaudiarabia.com${PATH}`;
const TITLE = "Riyadh Alternative Airports | Private Car Transfers by Road";
const DESCRIPTION =
  "Need another airport from Riyadh? Compare private car transfers to Dammam, Bahrain, Doha, Jeddah and Dubai airports, then request a route-specific quote on WhatsApp.";
const OG_IMAGE = "https://taxisaudiarabia.com/services/border-crossings-hero.webp";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    url: URL,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Private car on a Saudi highway for an airport transfer from Riyadh" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [OG_IMAGE] },
};

const FAQS = [
  {
    question: "Which airports can I reach from Riyadh by private car?",
    answer:
      "On request we arrange private cars from Riyadh to King Fahd International Airport (DMM) in Dammam, King Abdulaziz International Airport (JED) in Jeddah, Bahrain International Airport (BAH), Hamad International Airport (DOH) in Doha and Dubai International Airport (DXB). Availability and the border procedure are confirmed per trip.",
  },
  {
    question: "Which alternative airport is closest by road?",
    answer:
      "Dammam (DMM) is the closest of the five on the route figures published on this site — about 390 km, roughly 3 h 30 min of driving to Dammam city, with no border. Bahrain (BAH) is next, but it adds a causeway crossing, so total time depends on border traffic.",
  },
  {
    question: "How do I request a transfer quote?",
    answer:
      "Send your Riyadh pickup address, destination airport, date and pickup time, passengers, luggage and preferred vehicle on WhatsApp, or use the quote form on this page. A quote request is not a booking: the trip is confirmed only after availability, details and payment arrangements are agreed.",
  },
  {
    question: "Can I arrange a private transfer for my family and luggage?",
    answer:
      "Yes. Tell us the number of passengers and the number and size of suitcases. A sedan suits a small group with manageable luggage; an SUV or van is the better fit for more people or bulky bags. We recommend a vehicle category, but a specific model is not promised.",
  },
  {
    question: "Can I travel to Bahrain, Doha or Dubai by road?",
    answer:
      "Yes, on request. Bahrain is reached over the King Fahd Causeway, Qatar via the Salwa–Abu Samra crossing and the UAE via the Saudi–UAE land border. Not every vehicle can cross every border, so cross-border eligibility is confirmed for your date before you book.",
  },
  {
    question: "What documents should I check before an international transfer?",
    answer:
      "Every passenger needs a valid passport and the right to enter the destination country, and residents should confirm their Saudi exit and re-entry status. Requirements differ by nationality and change, so check official government sources and your airline. We do not arrange visas or immigration, and a driver cannot resolve entry problems.",
  },
  {
    question: "How early should I leave Riyadh for my flight?",
    answer:
      "There is no single safe buffer. Work backwards from your airline's check-in deadline, then add the road time for your route, traffic, stops and, on international trips, border processing that we cannot predict to the minute. For Doha, Dubai and Jeddah, consider travelling the day before.",
  },
  {
    question: "Can I book a return transfer to Riyadh?",
    answer:
      "You can ask for one, subject to route coverage and partner availability. Reverse routes exist for Jeddah, Bahrain, Doha and Dubai. Return fares are quoted separately — they are not assumed to match the outbound fare.",
  },
  {
    question: "Can I request a specific vehicle?",
    answer:
      "You can request a category — executive sedan, full-size SUV or van — and we match it from the partner network for your date. A specific make or model cannot be promised ahead of confirmation.",
  },
  {
    question: "What happens if my flight changes after I request a transfer?",
    answer:
      "Message us on WhatsApp as soon as you know, with the new flight number and time. We track flights for airport transfers and adjust the pickup where the partner's schedule allows. Changes on long or cross-border runs depend on availability, and free cancellation applies up to 24 hours before pickup.",
  },
];

const STEPS = [
  { t: "Share your pickup and destination airport", d: "Your Riyadh address or hotel, and the airport you need." },
  { t: "Add date, pickup time, passengers and luggage", d: "Include your flight time so the pickup can be planned backwards from it." },
  { t: "Receive a route- and vehicle-specific quote", d: "Quoted for your trip and subject to partner confirmation. This is still a request, not a booking." },
  { t: "Confirm once details, availability and payment are agreed", d: "Payment is by cash to the driver or bank transfer. Free cancellation up to 24 hours before pickup." },
];

const CHECKLIST = [
  "Pickup address or hotel name in Riyadh",
  "Destination airport and terminal, if you know it",
  "Date and preferred pickup time",
  "Number of passengers",
  "Number and size of suitcases",
  "Preferred vehicle category",
  "One-way or return trip",
  "Flight number, if relevant",
  "Border or travel considerations (nationality, residency, anything unusual)",
];

const waHref = (text: string) => `https://wa.me/${contactConfig.whatsappNumber}?text=${encodeURIComponent(text)}`;

function RouteLink({ a, label, className }: { a: AltAirport; label: string; className?: string }) {
  return (
    <Link href={`/routes/${a.slug}${a.anchor ? `#${a.anchor}` : ""}`} className={className}>
      {label}
    </Link>
  );
}

export default function RiyadhAlternativeAirportsPage() {
  const rows = ALT_AIRPORTS.map((a) => ({ a, f: altFacts(a.slug) }));
  const domestic = rows.filter((r) => !r.a.international);
  const international = rows.filter((r) => r.a.international);

  return (
    <div className="min-h-screen bg-[#FAFAF7] pb-24 text-[#1C1C1C]">
      <JsonLd
        data={[
          serviceSchema({
            name: "Private car transfers from Riyadh to other airports",
            description: DESCRIPTION,
            path: PATH,
            serviceType: "Private airport transfer by road",
            areaServed: ["Riyadh", "Dammam", "Jeddah", "Bahrain", "Qatar", "United Arab Emirates"],
          }),
          itemListSchema(ALT_AIRPORTS.map((a) => ({ name: `Riyadh to ${a.airportName} (${a.code})`, href: `/routes/${a.slug}` }))),
          faqSchema(FAQS),
          speakableSchema({ path: PATH }),
        ]}
      />
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Riyadh", href: "/locations/riyadh" },
          { name: "Alternative airports", href: PATH },
        ]}
      />

      {/* A — HERO */}
      <section className="section-container max-w-6xl pt-28 pb-10">
        <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#16A34A]/25 bg-[#F0FDF4] px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-[#166534]">
              <Plane className="h-3.5 w-3.5" aria-hidden /> Airports reached by road from Riyadh
            </span>
            <h1 className="font-heading mt-5 text-3xl font-bold leading-tight md:text-5xl">Need an Alternative Airport from Riyadh?</h1>
            <p className="mt-5 text-[0.98rem] leading-relaxed text-[#475569]" style={{ maxWidth: "62ch" }}>
              Request a private, pre-arranged car from your home, hotel, office or another agreed pickup point in Riyadh to Dammam, Jeddah, Bahrain, Doha or Dubai airport.
              Sedan, SUV and larger-vehicle options are subject to availability, and every quote is specific to your route, vehicle and date.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <TrackedLink
                href={waHref(altWaText())}
                target="_blank"
                rel="noopener noreferrer"
                kind="whatsapp"
                sourceLocation="alt_airports_hero"
                contactUsed={contactConfig.whatsappNumber}
                path={PATH}
                className="btn btn-whatsapp btn-lg"
              >
                <MessageCircle className="h-4 w-4" aria-hidden /> Get a Transfer Quote
              </TrackedLink>
              <a href="#compare" className="btn btn-secondary btn-lg">
                Compare Airport Routes
              </a>
            </div>
            <ul className="mt-7 grid gap-2 text-sm text-[#475569] sm:grid-cols-2" style={{ maxWidth: "46rem" }}>
              {[
                "Quote on WhatsApp — confirmed individually",
                "Free cancellation up to 24 hours before pickup",
                "Pay by cash to the driver or bank transfer",
                "English- and Arabic-speaking drivers",
              ].map((t) => (
                <li key={t} className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#16A34A]" aria-hidden /> {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-[#16A34A]/15 shadow-[0_8px_40px_rgba(0,0,0,0.10)]">
            <Image
              src="/services/border-crossings-hero.webp"
              alt="Private car on a Saudi highway heading out of Riyadh for an airport transfer"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 540px"
              className="object-cover"
            />
          </div>
        </div>

        <div className="mt-10" style={{ maxWidth: "46rem" }}>
          <TLDRSummary
            answer="From Riyadh you can request a private car by road to King Fahd International Airport (DMM) in Dammam, King Abdulaziz International Airport (JED) in Jeddah, Bahrain International Airport (BAH), Hamad International Airport (DOH) in Doha and Dubai International Airport (DXB). Dammam is the shortest run; Doha and Dubai are full-day journeys with border time. Pricing is quoted per trip on WhatsApp."
            facts={[
              { label: "Airports", value: "DMM · JED · BAH · DOH · DXB" },
              { label: "Domestic", value: "Dammam, Jeddah" },
              { label: "Cross-border", value: "Bahrain, Qatar, UAE" },
              { label: "Pricing", value: "Quoted per trip on WhatsApp" },
            ]}
          />
        </div>
      </section>

      {/* B — COMPARISON */}
      <section id="compare" className="section-container max-w-6xl scroll-mt-24 py-10">
        <h2 className="font-heading text-2xl font-bold md:text-3xl">Which airports can you reach from Riyadh by road?</h2>
        <p className="mt-3 text-[0.95rem] leading-relaxed text-[#475569]" style={{ maxWidth: "70ch" }}>
          Five airports are available on request. Distances and driving times are the figures published on each route page for the destination city; an airport drop-off shifts them slightly, and traffic, stops, road works and borders change the real journey time. Treat them as planning figures, not guaranteed arrival times.
        </p>

        {/* Desktop table */}
        <div className="mt-6 hidden overflow-hidden rounded-3xl border border-[#16A34A]/15 bg-white md:block">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Comparison of airports reachable by private car from Riyadh</caption>
            <thead className="bg-[#F0FDF4] text-xs uppercase tracking-wider text-[#166534]">
              <tr>
                <th scope="col" className="px-4 py-3">Airport</th>
                <th scope="col" className="px-4 py-3">Road distance · drive time</th>
                <th scope="col" className="px-4 py-3">Border</th>
                <th scope="col" className="px-4 py-3">Vehicles</th>
                <th scope="col" className="px-4 py-3">May suit</th>
                <th scope="col" className="px-4 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#16A34A]/10 align-top">
              {rows.map(({ a, f }) => (
                <tr key={a.code}>
                  <th scope="row" className="px-4 py-4 font-semibold">
                    {a.airportName} ({a.code})
                    <span className="block text-xs font-normal text-[#6B7280]">{a.city}, {a.country}</span>
                  </th>
                  <td className="px-4 py-4 text-[#475569]">About {f.km} km<span className="block text-xs">roughly {f.drive} driving</span></td>
                  <td className="px-4 py-4 text-[#475569]">{a.border}</td>
                  <td className="px-4 py-4 text-[#475569]">{a.vehicles}</td>
                  <td className="px-4 py-4 text-[#475569]" style={{ maxWidth: "16rem" }}>{a.suits}</td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col gap-2">
                      <TrackedLink
                        href={waHref(altWaText(a))}
                        target="_blank"
                        rel="noopener noreferrer"
                        kind="whatsapp"
                        sourceLocation={`alt_airports_table_${a.code.toLowerCase()}`}
                        contactUsed={contactConfig.whatsappNumber}
                        path={PATH}
                        routeId={a.routeId}
                        className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-[#16A34A] px-4 py-2 text-xs font-bold text-white hover:bg-[#15803D]"
                      >
                        <MessageCircle className="h-3.5 w-3.5" aria-hidden /> Quote {a.code}
                      </TrackedLink>
                      <RouteLink a={a} label={`Riyadh to ${a.city} route`} className="inline-flex min-h-[44px] items-center gap-1 text-xs font-semibold text-[#166534] hover:underline" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile comparison list */}
        <ul className="mt-6 space-y-3 md:hidden">
          {rows.map(({ a, f }) => (
            <li key={a.code} className="rounded-2xl border border-[#16A34A]/15 bg-white p-4">
              <p className="font-semibold">{a.airportName} ({a.code})</p>
              <p className="text-xs text-[#6B7280]">{a.city}, {a.country}</p>
              <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-sm text-[#475569]">
                <dt className="font-semibold text-[#1C1C1C]">Road</dt><dd>About {f.km} km, roughly {f.drive} driving</dd>
                <dt className="font-semibold text-[#1C1C1C]">Border</dt><dd>{a.border}</dd>
                <dt className="font-semibold text-[#1C1C1C]">Vehicles</dt><dd>{a.vehicles}</dd>
                <dt className="font-semibold text-[#1C1C1C]">May suit</dt><dd>{a.suits}</dd>
              </dl>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <TrackedLink
                  href={waHref(altWaText(a))}
                  target="_blank"
                  rel="noopener noreferrer"
                  kind="whatsapp"
                  sourceLocation={`alt_airports_list_${a.code.toLowerCase()}`}
                  contactUsed={contactConfig.whatsappNumber}
                  path={PATH}
                  routeId={a.routeId}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-[#16A34A] px-4 py-2 text-xs font-bold text-white"
                >
                  <MessageCircle className="h-3.5 w-3.5" aria-hidden /> Quote {a.code}
                </TrackedLink>
                <RouteLink a={a} label={`Riyadh to ${a.city} route`} className="inline-flex min-h-[44px] items-center text-xs font-semibold text-[#166534] hover:underline" />
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* C — DESTINATION CARDS */}
      <section className="section-container max-w-6xl py-10">
        <h2 className="font-heading text-2xl font-bold md:text-3xl">Five airport routes from Riyadh, in short</h2>
        <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map(({ a, f }) => (
            <li key={a.code} className="flex flex-col overflow-hidden rounded-3xl border border-[#16A34A]/15 bg-white">
              <div className="relative aspect-[16/9] w-full">
                <Image src={a.image.src} alt={a.image.alt} fill loading="lazy" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px" className="object-cover" />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-heading text-lg font-bold">{a.airportName} ({a.code})</h3>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-[#166534]">
                  {a.country} · roughly {f.drive} driving
                </p>
                <p className="mt-3 text-sm leading-relaxed text-[#475569]">{a.blurb}</p>
                <p className="mt-3 flex gap-2 text-xs leading-relaxed text-[#6B7280]">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden /> {a.border}
                </p>
                <div className="mt-auto flex flex-wrap items-center gap-3 pt-5">
                  <TrackedLink
                    href={waHref(altWaText(a))}
                    target="_blank"
                    rel="noopener noreferrer"
                    kind="whatsapp"
                    sourceLocation={`alt_airports_card_${a.code.toLowerCase()}`}
                    contactUsed={contactConfig.whatsappNumber}
                    path={PATH}
                    routeId={a.routeId}
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-[#16A34A] px-5 py-2 text-xs font-bold text-white hover:bg-[#15803D]"
                  >
                    <MessageCircle className="h-3.5 w-3.5" aria-hidden /> Request a Quote
                  </TrackedLink>
                  <RouteLink a={a} label="View Route" className="inline-flex min-h-[44px] items-center gap-1 text-xs font-bold text-[#166534] hover:underline" />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* D — CHOOSING */}
      <section className="section-container max-w-6xl py-10">
        <h2 className="font-heading text-2xl font-bold md:text-3xl">How do you choose the right airport before booking a car?</h2>
        <p className="mt-3 text-[0.95rem] leading-relaxed text-[#475569]" style={{ maxWidth: "70ch" }}>
          Compare the whole journey, not just the kilometres. A cheaper or better-timed ticket only helps if you can realistically reach that airport with time to spare.
        </p>
        <ul className="mt-5 grid gap-3 md:grid-cols-2">
          {[
            ["Confirm the flight first", "Check the operating flight, ticket rules and baggage allowance with your airline before arranging the car."],
            ["Compare total travel time", "Add the drive, any border processing, check-in and boarding cut-offs. The shortest road is not always the shortest trip."],
            ["Check connections and availability", "Compare ticket prices, schedules and onward connections from each airport, not just the departure city."],
            ["Verify entry and exit rules", "For Bahrain, Qatar and the UAE, confirm entry permission for your nationality and, for residents, Saudi exit and re-entry status."],
            ["Leave a sensible buffer", "Border queues, traffic and road conditions are unpredictable. For long or cross-border runs, consider going the day before."],
            ["Verify status independently", "Flight status and immigration requirements must be checked through your airline and official government sources. We do not arrange visas or immigration."],
          ].map(([t, d]) => (
            <li key={t} className="rounded-2xl border border-[#16A34A]/12 bg-white p-4">
              <p className="text-sm font-semibold">{t}</p>
              <p className="mt-1 text-sm leading-relaxed text-[#475569]">{d}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* E — DOMESTIC vs INTERNATIONAL */}
      <section className="section-container max-w-6xl py-10">
        <h2 className="font-heading text-2xl font-bold md:text-3xl">Domestic or international: what changes on the road?</h2>
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <div className="rounded-3xl border border-[#16A34A]/15 bg-white p-6">
            <h3 className="font-heading text-xl font-bold">Domestic airport journeys</h3>
            <p className="mt-2 text-sm leading-relaxed text-[#475569]">
              {domestic.map((r) => `${r.a.city} (${r.a.code})`).join(" and ")} involve no border, so the planning is about distance and timing. Dammam is the shortest of the five; Jeddah, at about {domestic.find((r) => r.a.code === "JED")?.f.km} km, is a full day on the road, so consider travelling the day before your flight.
            </p>
            <ul className="mt-3 space-y-2 text-sm text-[#475569]">
              <li className="flex gap-2"><span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#16A34A]" /> Agree the exact pickup point and time, working backwards from check-in.</li>
              <li className="flex gap-2"><span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#16A34A]" /> Tell us the luggage count and size so the vehicle category fits.</li>
              <li className="flex gap-2"><span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#16A34A]" /> Plan comfort stops on the longer Jeddah run.</li>
            </ul>
          </div>
          <div className="rounded-3xl border border-[#16A34A]/15 bg-white p-6">
            <h3 className="font-heading text-xl font-bold">International airport journeys</h3>
            <p className="mt-2 text-sm leading-relaxed text-[#475569]">
              {international.map((r) => `${r.a.city} (${r.a.code})`).join(", ")} add a border crossing: the King Fahd Causeway for Bahrain, the Salwa–Abu Samra crossing for Qatar and the Saudi–UAE land border for Dubai.
            </p>
            <ul className="mt-3 space-y-2 text-sm text-[#475569]">
              <li className="flex gap-2"><span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#16A34A]" /> Every passenger needs a valid passport and the right to enter; requirements differ by nationality.</li>
              <li className="flex gap-2"><span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#16A34A]" /> Saudi residents should confirm exit and re-entry status.</li>
              <li className="flex gap-2"><span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#16A34A]" /> Border queues and any tolls or fees vary; we confirm what the quote covers. Border crossing fees for the vehicle are included in the quoted fare; your own visa or entry fees are not.</li>
              <li className="flex gap-2"><span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#16A34A]" /> Not every vehicle can cross every border — eligibility is confirmed per trip.</li>
            </ul>
            <p className="mt-4 flex gap-2 rounded-2xl border border-[#FACC15]/40 bg-[#FEFCE8] p-3 text-xs leading-relaxed text-[#475569]">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#A16207]" aria-hidden /> Check current rules with official government sources and your airline. How the process works is covered in our{" "}
              <Link href="/services/border-crossings" className="font-semibold text-[#166534] underline-offset-2 hover:underline">cross-border transfer guide</Link>.
            </p>
          </div>
        </div>
      </section>

      {/* F — VEHICLES */}
      <section className="section-container max-w-6xl py-10">
        <h2 className="font-heading text-2xl font-bold md:text-3xl">Which vehicle fits your airport trip?</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            ["Executive sedan", "Individuals or a couple with manageable luggage. Comfortable for the shorter Dammam run; less suited to bulky bags or four adults with cases."],
            ["Full-size SUV", "More luggage or up to a small family. Suits the long Jeddah and cross-border runs, where space and comfort matter."],
            ["Van", "Groups and bulky luggage, where partner availability allows. Tell us the headcount and suitcase sizes early."],
          ].map(([t, d]) => (
            <div key={t} className="rounded-2xl border border-[#16A34A]/12 bg-white p-5">
              <Luggage className="h-5 w-5 text-[#16A34A]" aria-hidden />
              <h3 className="font-heading mt-2 text-lg font-bold">{t}</h3>
              <p className="mt-1 text-sm leading-relaxed text-[#475569]">{d}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-[#475569]">
          Vehicles come from our partner network by category; a specific model is not promised until confirmed. See the{" "}
          <Link href="/fleet" className="font-semibold text-[#166534] underline-offset-2 hover:underline">vehicle categories</Link> available.
        </p>
        <a href="#quote" className="btn btn-primary btn-lg mt-5">Find a Vehicle for Your Trip</a>
      </section>

      {/* G — HOW IT WORKS */}
      <section className="section-container max-w-6xl py-10">
        <h2 className="font-heading text-2xl font-bold md:text-3xl">How does booking an airport transfer work?</h2>
        <ol className="mt-6 grid gap-4 md:grid-cols-4">
          {STEPS.map((s, i) => (
            <li key={s.t} className="rounded-2xl border border-[#16A34A]/12 bg-white p-5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#16A34A] text-sm font-bold text-white">{i + 1}</span>
              <p className="mt-3 text-sm font-semibold">{s.t}</p>
              <p className="mt-1 text-sm leading-relaxed text-[#475569]">{s.d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* H — CHECKLIST + FORM */}
      <section id="quote" className="section-container max-w-6xl scroll-mt-24 py-10">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <h2 className="font-heading text-2xl font-bold md:text-3xl">What should you send with your quote request?</h2>
            <ul className="mt-5 space-y-2.5">
              {CHECKLIST.map((c) => (
                <li key={c} className="flex gap-2 text-sm leading-relaxed text-[#475569]">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#16A34A]" aria-hidden /> {c}
                </li>
              ))}
            </ul>
            <p className="mt-4 flex gap-2 text-sm text-[#475569]">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#16A34A]" aria-hidden /> The form opens WhatsApp with your details pre-written. Nothing is booked until we agree availability and payment with you.
            </p>
          </div>
          <div className="rounded-3xl border border-[#16A34A]/15 bg-white p-5 sm:p-7">
            <WhatsAppQuoteForm
              defaultPickup="Riyadh"
              dropoffOptions={ALT_AIRPORTS.map((a) => `${a.airportName} (${a.code}), ${a.city}`)}
              defaultDropoff={`${ALT_AIRPORTS[0].airportName} (${ALT_AIRPORTS[0].code}), ${ALT_AIRPORTS[0].city}`}
              vehicleKeys={["Sedan", "VIP SUV", "Van"]}
              suvLabel="SUV"
              pickupPlaceholder="Pickup address or hotel in Riyadh"
              submitLabel="Request a Quote on WhatsApp"
              messageIntro="Salam! I'd like a private transfer quote from Riyadh to another airport."
              showNotes
              footnote="This is a quote request, not a confirmed booking. Prices and vehicle availability are confirmed individually."
            />
          </div>
        </div>
      </section>

      {/* I — REVERSE */}
      <section className="section-container max-w-6xl py-10">
        <h2 className="font-heading text-2xl font-bold md:text-3xl">Can I travel from an alternative airport back to Riyadh?</h2>
        <p className="mt-3 text-[0.95rem] leading-relaxed text-[#475569]" style={{ maxWidth: "70ch" }}>
          Yes, you can ask — subject to route coverage and partner availability. Return fares are quoted separately and are not assumed to equal the outbound fare.
        </p>
        <ul className="mt-4 flex flex-wrap gap-3">
          {rows.filter((r) => r.a.reverseSlug).map(({ a }) => (
            <li key={a.code}>
              <Link href={`/routes/${a.reverseSlug}`} className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[#16A34A]/25 bg-white px-4 py-2 text-sm font-semibold text-[#166534] hover:bg-[#F0FDF4]">
                {a.city} to Riyadh <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-[#6B7280]">No dedicated Dammam-to-Riyadh page is published yet; message us on WhatsApp for that direction.</p>
      </section>

      {/* J — RELATED */}
      <section className="section-container max-w-6xl py-10">
        <h2 className="font-heading text-2xl font-bold md:text-3xl">Related routes and travel guides</h2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["/routes/riyadh-to-dammam", "Riyadh to Dammam by private car", "Highway 40 corridor, Dammam and Al Khobar"],
            ["/routes/riyadh-to-manama", "Riyadh to Bahrain by road", "King Fahd Causeway and Manama"],
            ["/routes/riyadh-to-doha", "Riyadh to Doha by road", "Al Ahsa and the Salwa crossing"],
            ["/routes/riyadh-to-jeddah", "Riyadh to Jeddah by car", "Cross-Kingdom run to the Red Sea"],
            ["/routes/riyadh-to-dubai", "Riyadh to Dubai by car", "Saudi–UAE road journey"],
            ["/services/airport-transfers", "Airport transfers in Saudi Arabia", "If you are flying from King Khalid Airport (RUH) instead"],
            ["/services/border-crossings", "Cross-border transfers from Saudi Arabia", "How border journeys are arranged"],
            ["/blog/riyadh-to-dubai-taxi-gcc-road-trip", "Riyadh to Dubai road-trip guide", "Planning the long GCC drive"],
            ["/locations/riyadh", "Private chauffeur service in Riyadh", "Pickups, districts and city runs"],
          ].map(([href, label, note]) => (
            <li key={href}>
              <Link href={href} className="group flex min-h-[44px] items-center justify-between gap-3 rounded-2xl border border-[#16A34A]/15 bg-white p-4 hover:border-[#16A34A]/40">
                <span>
                  <span className="block text-sm font-semibold">{label}</span>
                  <span className="block text-xs text-[#6B7280]">{note}</span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-[#16A34A]" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* K — FAQ */}
      <section className="section-container max-w-4xl py-10">
        <h2 className="font-heading text-2xl font-bold md:text-3xl">Frequently asked questions</h2>
        <div className="mt-6 space-y-3">
          {FAQS.map((f) => (
            <details key={f.question} className="group rounded-2xl border border-[#16A34A]/15 bg-white p-4 open:shadow-sm">
              <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold">
                {f.question}
                <span aria-hidden className="text-[#16A34A] transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-[#475569]">{f.answer}</p>
            </details>
          ))}
        </div>
      </section>

      {/* L — FINAL CTA */}
      <section className="section-container max-w-4xl py-10">
        <div className="rounded-3xl border border-[#16A34A]/20 bg-white p-7 text-center sm:p-10">
          <h2 className="font-heading text-2xl font-bold md:text-3xl">Let&apos;s Plan Your Transfer to the Right Airport</h2>
          <p className="mx-auto mt-3 text-sm leading-relaxed text-[#475569]" style={{ maxWidth: "56ch" }}>
            Send your pickup point, destination airport, date, flight time, passengers and luggage, and we will come back with a quote for that route and vehicle. Prices and vehicle availability are confirmed individually.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <TrackedLink
              href={waHref(altWaText())}
              target="_blank"
              rel="noopener noreferrer"
              kind="whatsapp"
              sourceLocation="alt_airports_final_cta"
              contactUsed={contactConfig.whatsappNumber}
              path={PATH}
              className="btn btn-whatsapp btn-lg"
            >
              <MessageCircle className="h-4 w-4" aria-hidden /> Get a Transfer Quote on WhatsApp
            </TrackedLink>
            <a href="#compare" className="btn btn-secondary btn-lg">Compare Airport Routes</a>
          </div>
        </div>
      </section>
    </div>
  );
}
