import Link from "next/link";
import { ArrowRight, MessageCircle, CheckCircle2, Mail, CarFront, Users, Briefcase, Compass } from "lucide-react";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { TLDRSummary } from "@/components/seo/TLDRSummary";
import WhatsAppQuoteForm from "@/components/booking/WhatsAppQuoteForm";
import { faqSchema, serviceSchema, speakableSchema } from "@/lib/schema";
import {
  RSI_DESTINATIONS, RSI_FORM_DESTINATIONS, RSI_FORM_HINTS, RSI_FORM_MICROCOPY, RSI_HUB, RSI_ISLAND_MICROCOPY,
  RSI_FROM_LABEL, RSI_HUB_HREF, RSI_TRANSFER_RATES, rsiWhatsApp, sar,
} from "@/lib/data/red-sea-cluster";
import { contactConfig } from "@/lib/config/contact";
import {
  IncludedList, IslandTransferNotice, JourneyDiagram, RateTable, RsiHeroArt, RsiStyles, TransferBadges,
} from "./RedSeaVisuals";
import RedSeaTransferMap from "./RedSeaTransferMap";

const POPULAR = [
  { key: "turtle-bay", title: "Turtle Bay", route: "RSI Airport → Turtle Bay", rate: "turtleBay" as const, cta: "View Turtle Bay Transfer", href: "/routes/red-sea-airport-to-turtle-bay", note: "Private land transfer" },
  { key: "shura-island", title: "Shura Island", route: "RSI Airport → Shura Island", rate: "shuraIsland" as const, cta: "View Shura Island Transfer", href: "/routes/red-sea-airport-to-shura-island", note: "Private transfer to the island access point" },
  { key: "nujuma", title: "Nujuma", route: "RSI Airport → Nujuma Transfer Point / Turtle Bay", rate: "nujuma" as const, cta: "View Nujuma Transfer", href: "/routes/red-sea-airport-to-nujuma", note: "Land transfer; boat or seaplane onward" },
  { key: "shebara", title: "Shebara", route: "RSI Airport → Turtle Bay / Shebara land-transfer component", rate: "shebara" as const, cta: "View Shebara Transfer", href: "/routes/red-sea-airport-to-shebara", note: "Land transfer; boat or seaplane onward" },
];

const CHOOSER = [
  { q: "Staying on Shura Island?", a: "Shura Island transfer", href: "/routes/red-sea-airport-to-shura-island" },
  { q: "Going to Turtle Bay?", a: "Turtle Bay transfer", href: "/routes/red-sea-airport-to-turtle-bay" },
  { q: "Staying at Nujuma?", a: "Nujuma transfer", href: "/routes/red-sea-airport-to-nujuma" },
  { q: "Staying at Shebara?", a: "Shebara transfer", href: "/routes/red-sea-airport-to-shebara" },
  { q: "Going to AMAALA?", a: "AMAALA transfer", href: "/routes/red-sea-airport-to-amaala" },
  { q: "Staying at another Red Sea resort?", a: "Ask TSA on WhatsApp", href: "" },
];

const TRUST = [
  "Private vehicle", "Pre-booked transfer", "Airport meet & greet", "Luggage assistance",
  "Clear fare confirmation", "Sedan and SUV options", "WhatsApp booking support",
];

export default function RedSeaHub() {
  const waGeneral = rsiWhatsApp("my Red Sea destination");
  const resortCards = RSI_DESTINATIONS.filter((d) => d.key !== "turtle-bay");
  const mailto = `mailto:${contactConfig.email}?subject=${encodeURIComponent("Group / corporate transfer RFQ — Red Sea International Airport (RSI)")}&body=${encodeURIComponent("Hello Taxi Saudi Arabia team,\n\nWe'd like a written quote for transfers from Red Sea International Airport (RSI).\n\n• Company / organisation: \n• Contact name & role: \n• Destination(s): \n• Arrival date & flight no.: \n• Passengers & vehicles: \n• Invoicing details: \n")}`;

  return (
    <div className="min-h-screen bg-[#FAFAF7] pb-28 text-[#1C1C1C] lg:pb-16">
      <RsiStyles />
      <JsonLd
        data={[
          serviceSchema({
            name: "Red Sea International Airport (RSI) private transfers",
            description: RSI_HUB.quickAnswer,
            path: RSI_HUB_HREF,
            serviceType: "Private airport transfer",
            areaServed: ["Red Sea International Airport (RSI)", "Shura Island", "Turtle Bay", "AMAALA", "Saudi Arabia"],
          }),
          faqSchema(RSI_HUB.faqs),
          speakableSchema({ path: RSI_HUB_HREF }),
        ]}
      />
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Airport Transfers", href: "/services/airport-transfers" },
          { name: "Red Sea International Airport", href: RSI_HUB_HREF },
        ]}
      />

      {/* ─── HERO ─── */}
      <section className="section-container max-w-6xl pt-3">
        <div className="relative overflow-hidden rounded-[28px] bg-[#062B33]">
          <RsiHeroArt />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-[#062B33]/90 via-[#062B33]/45 to-transparent" />
          <div className="relative z-10 space-y-5 p-6 pb-44 sm:p-10 sm:pb-56">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FACC15]/40 bg-[#FACC15]/10 px-3.5 py-1 text-[0.65rem] font-bold uppercase tracking-widest text-[#FACC15]">
              RSI · Saudi Arabia&apos;s Red Sea coast
            </span>
            <h1 className="font-heading max-w-3xl text-3xl font-extrabold leading-tight tracking-tight text-[#FFFFFF] sm:text-5xl">
              Private Transfers from <span className="text-[#5EEAD4]">Red Sea International Airport</span>
            </h1>
            <p className="max-w-xl text-sm leading-relaxed text-[#FFFFFF]/90 sm:text-base">
              Pre-book a private airport transfer from RSI to Shura Island, Turtle Bay, Nujuma, Shebara, AMAALA and selected Red Sea destinations.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#rsi-quote" className="btn btn-accent btn-lg">Get Your RSI Transfer Quote <ArrowRight aria-hidden className="h-4 w-4 rtl:rotate-180" /></a>
              <a href={waGeneral} target="_blank" rel="noopener noreferrer" className="btn btn-glass btn-lg"><MessageCircle aria-hidden className="h-4 w-4" /> Book on WhatsApp</a>
            </div>
            <ul className="flex flex-wrap gap-2 pt-1 text-xs font-semibold text-[#FFFFFF]">
              {["Private vehicle", "Meet & greet at arrivals", "Sedan & SUV", "Fare confirmed before you go"].map((t) => (
                <li key={t} className="inline-flex items-center gap-1.5 rounded-full border border-[#FFFFFF]/20 bg-[#062B33]/60 px-3 py-1.5"><CheckCircle2 aria-hidden className="h-3.5 w-3.5 text-[#5EEAD4]" /> {t}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <div className="section-container mt-12 max-w-6xl space-y-14">
        {/* ─── QUICK ANSWER + QUOTE FORM ─── */}
        <section id="rsi-quote" aria-labelledby="rsi-qa" className="grid scroll-mt-24 gap-8 lg:grid-cols-5 lg:items-start">
          <div className="space-y-5 lg:col-span-2 lg:sticky lg:top-24">
            <h2 id="rsi-qa" className="font-heading text-2xl font-bold sm:text-3xl">Need a Private Transfer from RSI?</h2>
            <TLDRSummary
              answer={RSI_HUB.quickAnswer}
              facts={[
                { label: "Pickup", value: "RSI arrivals" },
                { label: "Vehicles", value: "Sedan · SUV" },
                { label: "Rates", value: `From ${sar(RSI_TRANSFER_RATES.turtleBay.sedan)}` },
                { label: "Islands", value: "Boat separate" },
              ]}
            />
          </div>
          <div className="lg:col-span-3">
            <WhatsAppQuoteForm
              defaultPickup={RSI_FROM_LABEL}
              lockPickup
              defaultDropoff=""
              dropoffOptions={RSI_FORM_DESTINATIONS}
              dropoffHints={RSI_FORM_HINTS}
              dropoffPlaceholder="Select destination"
              vehicleKeys={["Sedan", "VIP SUV", "Van"]}
              suvLabel="SUV"
              defaultVehicle="Sedan"
              showNotes
              messageIntro="Hello, I'd like a private transfer from Red Sea International Airport (RSI)."
              submitLabel="Get Quote on WhatsApp"
              footnote={`${RSI_FORM_MICROCOPY} ${RSI_ISLAND_MICROCOPY}`}
            />
          </div>
        </section>

        {/* ─── POPULAR TRANSFERS ─── */}
        <section aria-labelledby="rsi-popular">
          <h2 id="rsi-popular" className="font-heading text-2xl font-bold sm:text-3xl">Popular Red Sea International Airport Transfers</h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {POPULAR.map((p) => (
              <li key={p.key} className="flex flex-col rounded-3xl border border-[#0E7490]/15 bg-white p-5 transition-shadow hover:shadow-lg">
                <TransferBadges badges={RSI_DESTINATIONS.find((d) => d.key === p.key)!.badges} />
                <h3 className="font-heading mt-3 text-xl font-bold">{p.title}</h3>
                <p className="text-sm text-[#475569]">{p.route}</p>
                <dl className="mt-4 grid grid-cols-2 gap-2 text-sm">
                  <div className="rounded-xl bg-[#F8FAFC] p-3"><dt className="text-[0.65rem] font-bold uppercase tracking-wider text-[#64748B]">Sedan</dt><dd className="text-lg font-extrabold">{sar(RSI_TRANSFER_RATES[p.rate].sedan)}</dd></div>
                  <div className="rounded-xl bg-[#F8FAFC] p-3"><dt className="text-[0.65rem] font-bold uppercase tracking-wider text-[#64748B]">SUV</dt><dd className="text-lg font-extrabold">{sar(RSI_TRANSFER_RATES[p.rate].suv)}</dd></div>
                </dl>
                <p className="mt-2 text-xs text-[#64748B]">{p.note}. Indicative rate.</p>
                <Link href={p.href} className="btn btn-secondary mt-4">{p.cta} <ArrowRight aria-hidden className="h-4 w-4 rtl:rotate-180" /></Link>
              </li>
            ))}
            <li className="flex flex-col rounded-3xl border border-[#FACC15]/40 bg-[#FEFCE8] p-5">
              <TransferBadges badges={["quote"]} />
              <h3 className="font-heading mt-3 text-xl font-bold">AMAALA</h3>
              <p className="text-sm text-[#475569]">Private transfer from RSI</p>
              <p className="mt-4 text-lg font-extrabold">Fare confirmed on WhatsApp</p>
              <Link href="/routes/red-sea-airport-to-amaala" className="btn btn-secondary mt-auto">View AMAALA Transfer <ArrowRight aria-hidden className="h-4 w-4 rtl:rotate-180" /></Link>
            </li>
          </ul>
        </section>

        {/* ─── HOW TRANSFERS WORK ─── */}
        <section aria-labelledby="rsi-how" className="rounded-3xl bg-[#062B33] p-6 text-[#FFFFFF] sm:p-10">
          <span className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-[#5EEAD4]">Land vs boat vs seaplane</span>
          <h2 id="rsi-how" className="font-heading mt-1 text-2xl font-bold sm:text-3xl">How Red Sea Transfers Work</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#CBD5E1]">Not every Red Sea resort is reached by road. TSA arranges the private land leg. Where an island resort needs a boat or seaplane, that connection is arranged separately.</p>
          <div className="mt-8 space-y-9">
            <div>
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-[#99F6E4]">Mainland destinations</h3>
              <JourneyDiagram kind="mainland" tone="dark" destination="Your destination" label="Mainland journey: RSI airport, private vehicle, destination" />
            </div>
            <div>
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-[#99F6E4]">Island resorts (Nujuma, Shebara, St. Regis Red Sea)</h3>
              <JourneyDiagram kind="island" tone="dark" label="Island journey: RSI airport, private vehicle, Turtle Bay, boat or seaplane, island resort" />
            </div>
            <div>
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-[#99F6E4]">Shura Island (car-free)</h3>
              <JourneyDiagram kind="shura" tone="dark" label="Shura Island journey: RSI airport, private vehicle, access point, property electric transfer, hotel" />
            </div>
          </div>
        </section>

        {/* ─── RATES ─── */}
        <section aria-labelledby="rsi-rates" className="space-y-5">
          <h2 id="rsi-rates" className="font-heading text-2xl font-bold sm:text-3xl">RSI Private Transfer Rates</h2>
          <RateTable
            heading="Private land transfers from Red Sea International Airport"
            rows={[
              { key: "turtleBay", title: "RSI → Turtle Bay", scope: "Private land transfer", waDestination: "Turtle Bay", href: "/routes/red-sea-airport-to-turtle-bay", badges: ["land"] },
              { key: "shuraIsland", title: "RSI → Shura Island hotels", scope: "To the Shura access point; property transfer for the final leg", waDestination: "Shura Island", href: "/routes/red-sea-airport-to-shura-island", badges: ["land"] },
              { key: "nujuma", title: "RSI → Nujuma transfer point / Turtle Bay", scope: "Land component only", waDestination: "Nujuma / Turtle Bay transfer point", href: "/routes/red-sea-airport-to-nujuma", badges: ["land-boat", "land-seaplane"] },
              { key: "shebara", title: "RSI → Turtle Bay / Shebara", scope: "Land component only", waDestination: "Shebara (via Turtle Bay)", href: "/routes/red-sea-airport-to-shebara", badges: ["land-boat", "land-seaplane"] },
            ]}
          />
          <IslandTransferNotice />
        </section>

        {/* ─── INCLUDED ─── */}
        <section aria-labelledby="rsi-incl">
          <h2 id="rsi-incl" className="font-heading text-2xl font-bold sm:text-3xl">What&apos;s Included</h2>
          <IncludedList className="mt-5" />
        </section>

        {/* ─── CHOOSER ─── */}
        <section aria-labelledby="rsi-choose">
          <h2 id="rsi-choose" className="font-heading text-2xl font-bold sm:text-3xl">Which Red Sea Transfer Do You Need?</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {CHOOSER.map((c) => (
              <li key={c.q}>
                {c.href ? (
                  <Link href={c.href} className="group flex min-h-[72px] items-center justify-between gap-3 rounded-2xl border border-[#0E7490]/15 bg-white p-4 hover:border-[#16A34A]">
                    <span><span className="block text-sm font-bold">{c.q}</span><span className="text-sm text-[#15803D]">{c.a}</span></span>
                    <ArrowRight aria-hidden className="h-4 w-4 shrink-0 text-[#16A34A] rtl:rotate-180" />
                  </Link>
                ) : (
                  <a href={waGeneral} target="_blank" rel="noopener noreferrer" className="group flex min-h-[72px] items-center justify-between gap-3 rounded-2xl border border-[#0E7490]/15 bg-white p-4 hover:border-[#16A34A]">
                    <span><span className="block text-sm font-bold">{c.q}</span><span className="text-sm text-[#15803D]">{c.a}</span></span>
                    <MessageCircle aria-hidden className="h-4 w-4 shrink-0 text-[#16A34A]" />
                  </a>
                )}
              </li>
            ))}
          </ul>
        </section>

        {/* ─── MAP ─── */}
        <section aria-labelledby="rsi-map">
          <h2 id="rsi-map" className="font-heading text-2xl font-bold sm:text-3xl">Red Sea Destinations from RSI</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#475569]">Choose a destination to see how the journey works and what TSA covers.</p>
          <div className="mt-6"><RedSeaTransferMap destinations={RSI_DESTINATIONS} /></div>
        </section>

        {/* ─── RESORT TRANSFERS ─── */}
        <section id="resort-transfers" aria-labelledby="rsi-resorts" className="scroll-mt-24">
          <h2 id="rsi-resorts" className="font-heading text-2xl font-bold sm:text-3xl">Red Sea Resort Transfers from RSI</h2>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {resortCards.map((d) => (
              <li key={d.key} className="flex flex-col rounded-2xl border border-[#0E7490]/15 bg-white p-5">
                <TransferBadges badges={d.badges} />
                <h3 className="mt-3 font-bold text-[#0F172A]">{d.name}</h3>
                <p className="mt-1 text-sm leading-relaxed text-[#475569]">{d.summary}</p>
                {d.time && <p className="mt-2 text-xs text-[#475569]">{d.time}</p>}
                <div className="mt-4 flex flex-wrap gap-2 pt-1">
                  {d.href && <Link href={d.href} className="inline-flex min-h-[44px] items-center gap-1 text-sm font-bold text-[#15803D] hover:underline">View transfer <ArrowRight aria-hidden className="h-3.5 w-3.5 rtl:rotate-180" /></Link>}
                  <a href={rsiWhatsApp(d.name)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[44px] items-center gap-1 text-sm font-bold text-[#0E7490] hover:underline"><MessageCircle aria-hidden className="h-3.5 w-3.5" /> Get Quote: RSI → {d.name}</a>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* ─── VEHICLES ─── */}
        <section aria-labelledby="rsi-veh">
          <h2 id="rsi-veh" className="font-heading text-2xl font-bold sm:text-3xl">Choose Your Vehicle</h2>
          <ul className="mt-5 grid gap-4 sm:grid-cols-3">
            {[
              { icon: CarFront, t: "Sedan", d: "Best for 1–3 passengers, couples and light luggage.", rate: `From ${sar(RSI_TRANSFER_RATES.turtleBay.sedan)} (land transfer)` },
              { icon: Users, t: "SUV", d: "Best for families, more luggage and premium comfort.", rate: `From ${sar(RSI_TRANSFER_RATES.turtleBay.suv)} (land transfer)` },
              { icon: Briefcase, t: "Van", d: "For larger groups. Availability and capacity confirmed on WhatsApp.", rate: "Quote on WhatsApp" },
            ].map(({ icon: Icon, t, d, rate }) => (
              <li key={t} className="rounded-2xl border border-[#0E7490]/15 bg-white p-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ECFEFF] text-[#0E7490]"><Icon aria-hidden className="h-5 w-5" /></span>
                <h3 className="mt-3 font-bold">{t}</h3>
                <p className="mt-1 text-sm leading-relaxed text-[#475569]">{d}</p>
                <p className="mt-2 text-sm font-semibold text-[#0F172A]">{rate}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* ─── BOOKING PROCESS ─── */}
        <section aria-labelledby="rsi-process">
          <h2 id="rsi-process" className="font-heading text-2xl font-bold sm:text-3xl">How to Book Your RSI Transfer</h2>
          <ol className="mt-5 grid gap-4 md:grid-cols-3">
            {[
              { n: "01", t: "Send Your Trip Details", d: "Airport, destination, date, time, passengers and vehicle." },
              { n: "02", t: "Receive Your Fare", d: "TSA confirms the fare on WhatsApp." },
              { n: "03", t: "Confirm Your Transfer", d: "Once confirmed, the trip is scheduled." },
            ].map((s) => (
              <li key={s.n} className="rounded-2xl border border-[#0E7490]/15 bg-white p-5">
                <p className="font-heading text-3xl font-extrabold text-[#5EEAD4]">{s.n}</p>
                <h3 className="mt-1 font-bold">{s.t}</h3>
                <p className="mt-1 text-sm text-[#475569]">{s.d}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* ─── TRUST ─── */}
        <section aria-labelledby="rsi-trust" className="rounded-3xl border border-[#16A34A]/20 bg-[#F0FDF4] p-6 sm:p-8">
          <h2 id="rsi-trust" className="font-heading text-2xl font-bold">Why Pre-Book Your RSI Transfer?</h2>
          <ul className="mt-4 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {TRUST.map((t) => (
              <li key={t} className="flex items-center gap-2.5 text-sm text-[#166534]"><CheckCircle2 aria-hidden className="h-4 w-4 shrink-0" /> {t}</li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-[#166534]">Corporate invoicing can be arranged through our sister company.</p>
        </section>

        {/* ─── FAQ ─── */}
        <section aria-labelledby="rsi-faq">
          <h2 id="rsi-faq" className="font-heading text-2xl font-bold sm:text-3xl">Red Sea International Airport Transfers: Your Questions</h2>
          <div className="mt-5 space-y-3">
            {RSI_HUB.faqs.map((f) => (
              <details key={f.question} className="rounded-2xl border border-[#0E7490]/15 bg-white p-5 open:border-[#16A34A]/40">
                <summary className="cursor-pointer list-none font-semibold marker:hidden"><h3 className="inline">{f.question}</h3></summary>
                <p className="mt-2 text-sm leading-relaxed text-[#475569]">{f.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ─── RELATED + CTA ─── */}
        <section aria-labelledby="rsi-related" className="grid gap-6 md:grid-cols-2">
          <div>
            <h2 id="rsi-related" className="font-heading text-xl font-bold">Beyond the Red Sea resorts</h2>
            <ul className="mt-3 space-y-2.5 text-sm">
              {[
                { href: "/routes/red-sea-airport-to-amaala", label: "RSI to AMAALA private transfer" },
                { href: "/routes/red-sea-airport-to-neom", label: "Red Sea Airport to NEOM transfer" },
                { href: "/routes/red-sea-airport-to-alula", label: "Travelling on to AlUla from RSI" },
                { href: "/routes/tabuk-to-red-sea-airport", label: "Tabuk to Red Sea International Airport" },
                { href: "/locations/neom", label: "Private transfers in NEOM" },
              ].map((l) => (
                <li key={l.href}><Link href={l.href} className="inline-flex min-h-[44px] items-center gap-1.5 font-semibold text-[#15803D] hover:underline"><Compass aria-hidden className="h-4 w-4" /> {l.label}</Link></li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl bg-[#062B33] p-6 text-[#FFFFFF]">
            <h2 className="font-heading text-xl font-bold">Ready to book your RSI transfer?</h2>
            <p className="mt-2 text-sm text-[#CBD5E1]">Send your destination and flight number. We reply with the fare for your vehicle.</p>
            <div className="mt-4 flex flex-col gap-2.5">
              <a href={waGeneral} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp btn-lg"><MessageCircle aria-hidden className="h-4 w-4" /> Get RSI Transfer Quote</a>
              <a href={mailto} className="btn btn-glass"><Mail aria-hidden className="h-4 w-4" /> Company or group? Email an RFQ</a>
            </div>
          </div>
        </section>
      </div>

      {/* ─── MOBILE STICKY CTA ─── */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#16A34A]/15 bg-[#FFFFFF]/95 py-3 ps-4 pe-20 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur lg:hidden">
        <div className="flex items-center gap-2">
          <a href="#rsi-quote" className="btn btn-primary flex-1 justify-center whitespace-nowrap">Get Quote</a>
          <a href={waGeneral} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp — Red Sea International Airport transfer" className="btn btn-whatsapp flex-1 justify-center"><MessageCircle aria-hidden className="h-4 w-4" /> WhatsApp</a>
        </div>
      </div>
    </div>
  );
}
