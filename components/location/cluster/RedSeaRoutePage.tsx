import Link from "next/link";
import { ArrowRight, MessageCircle, CheckCircle2, Mail, CarFront, Users, Briefcase, BedDouble } from "lucide-react";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { TLDRSummary } from "@/components/seo/TLDRSummary";
import WhatsAppQuoteForm from "@/components/booking/WhatsAppQuoteForm";
import { faqSchema, serviceSchema, speakableSchema } from "@/lib/schema";
import { contactConfig } from "@/lib/config/contact";
import {
  RSI_FROM_LABEL, RSI_FORM_MICROCOPY, RSI_HUB_HREF, RSI_ISLAND_MICROCOPY, RSI_ROUTE_LINKS, rsiWhatsApp,
  type RsiRoutePageData,
} from "@/lib/data/red-sea-cluster";
import {
  IncludedList, IslandTransferNotice, JourneyDiagram, RouteArt, RouteRateCards, RsiStyles, TransferBadges,
} from "./RedSeaVisuals";

// One bespoke RSI route page (Turtle Bay, Shura Island, Nujuma, Shebara).
// All copy, rates and links come from lib/data/red-sea-cluster.ts. Each journey
// kind gets its own illustration and diagram so the four pages are not clones.

const ANCHORS = ["Red Sea International Airport transfers", "private RSI airport transfer", "RSI airport", "Red Sea airport transfer"];

export default function RedSeaRoutePage({ data }: { data: RsiRoutePageData }) {
  const path = `/routes/${data.slug}`;
  const wa = rsiWhatsApp(data.destination, data.waIntro);
  const dark = data.journeyKind === "nujuma";
  const anchor = ANCHORS[RSI_ROUTE_ORDER.indexOf(data.slug) % ANCHORS.length];
  const mailto = `mailto:${contactConfig.email}?subject=${encodeURIComponent(`Group / corporate transfer RFQ — RSI to ${data.destination}`)}&body=${encodeURIComponent(`Hello Taxi Saudi Arabia team,\n\nWe'd like a written quote for transfers from Red Sea International Airport (RSI) to ${data.destination}.\n\n• Company / organisation: \n• Contact name & role: \n• Arrival date & flight no.: \n• Passengers & luggage: \n• Vehicle(s): \n• Invoicing details: \n`)}`;
  const journeyKind = data.journeyKind === "shura" ? "shura" : data.journeyKind === "turtle-bay" ? "mainland" : "island";

  return (
    <div className="min-h-screen bg-[#FAFAF7] pb-28 text-[#1C1C1C] lg:pb-16">
      <RsiStyles />
      <JsonLd
        data={[
          serviceSchema({
            name: `RSI Airport to ${data.destination} private transfer`,
            description: data.quickAnswer,
            path,
            serviceType: "Private airport transfer",
            areaServed: ["Red Sea International Airport (RSI)", data.destination, "Saudi Arabia"],
          }),
          faqSchema(data.faqs),
          speakableSchema({ path }),
        ]}
      />
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Routes", href: "/routes" },
          { name: "Red Sea International Airport", href: RSI_HUB_HREF },
          { name: `RSI to ${data.destination}`, href: path },
        ]}
      />

      {/* ─── HERO ─── */}
      <section className="section-container max-w-5xl pt-3">
        <div className={`relative overflow-hidden rounded-[28px] p-6 sm:p-10 ${dark ? "bg-[#06101F]" : "bg-[radial-gradient(120%_140%_at_0%_0%,#0E7490_0%,#0A3E4D_55%,#062B33_100%)]"}`}>
          <div aria-hidden className="pointer-events-none absolute -end-24 -top-24 h-72 w-72 rounded-full bg-[#FACC15]/10 blur-3xl" />
          <div className="relative z-10 space-y-5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FACC15]/40 bg-[#FACC15]/10 px-3.5 py-1 text-[0.65rem] font-bold uppercase tracking-widest text-[#FACC15]">{data.eyebrow}</span>
            <h1 className="font-heading max-w-3xl text-3xl font-extrabold leading-tight tracking-tight text-[#FFFFFF] sm:text-5xl">{data.h1}</h1>
            <p className="max-w-2xl text-sm leading-relaxed text-[#FFFFFF]/90 sm:text-base">{data.lead}</p>
            <TransferBadges badges={data.badges} />
            <div className="flex flex-wrap gap-3">
              <a href="#route-quote" className="btn btn-accent btn-lg">{data.ctaLabel} <ArrowRight aria-hidden className="h-4 w-4 rtl:rotate-180" /></a>
              <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-glass btn-lg"><MessageCircle aria-hidden className="h-4 w-4" /> Book on WhatsApp</a>
            </div>
            <div className="pt-2"><RouteArt kind={data.journeyKind} alt={data.heroAlt} /></div>
          </div>
        </div>
      </section>

      <div className="section-container mt-10 max-w-5xl space-y-12">
        {/* ─── QUICK ANSWER ─── */}
        <TLDRSummary answer={data.quickAnswer} facts={data.facts} />

        {/* ─── PRICE ─── */}
        <section aria-labelledby="rt-price" className="space-y-4">
          <h2 id="rt-price" className="font-heading text-2xl font-bold sm:text-3xl">RSI to {data.destination}: price</h2>
          <RouteRateCards rateKey={data.rateKey} scope={data.rateScope} destination={data.destination} />
          {data.island && <IslandTransferNotice />}
        </section>

        {/* ─── INCLUDED ─── */}
        <section aria-labelledby="rt-incl">
          <h2 id="rt-incl" className="font-heading text-2xl font-bold sm:text-3xl">What&apos;s Included</h2>
          <IncludedList className="mt-5" />
        </section>

        {/* ─── JOURNEY ─── */}
        <section aria-labelledby="rt-journey" className={`rounded-3xl p-6 sm:p-10 ${dark ? "bg-[#06101F] text-[#FFFFFF]" : "border border-[#0E7490]/15 bg-white"}`}>
          <h2 id="rt-journey" className="font-heading text-2xl font-bold sm:text-3xl">How your {data.destination} transfer works</h2>
          <div className="mt-6">
            <JourneyDiagram kind={journeyKind} destination={data.destination === "Shura Island" ? "Your hotel" : data.destination} tone={dark ? "dark" : "light"} label={`${data.destination} journey from Red Sea International Airport`} />
          </div>
        </section>

        {/* ─── DESTINATION LOGISTICS ─── */}
        {data.sections.map((s) => (
          <section key={s.heading} id={s.id} aria-labelledby={`h-${s.heading.replace(/\W+/g, "-")}`} className="scroll-mt-24">
            <h2 id={`h-${s.heading.replace(/\W+/g, "-")}`} className="font-heading text-2xl font-bold sm:text-3xl">{s.heading}</h2>
            <div className="mt-3 space-y-3 text-[0.95rem] leading-relaxed text-[#475569]" style={{ maxWidth: "70ch" }}>
              {s.paragraphs.map((p) => <p key={p}>{p}</p>)}
            </div>
            {s.points && (
              <ul className="mt-5 grid gap-3 sm:grid-cols-3">
                {s.points.map((pt) => (
                  <li key={pt.title} className="rounded-2xl border border-[#0E7490]/15 bg-white p-4 text-sm leading-relaxed text-[#475569]"><span className="font-semibold text-[#0F172A]">{pt.title}.</span> {pt.desc}</li>
                ))}
              </ul>
            )}
          </section>
        ))}

        {/* Shura properties */}
        {data.hotels && (
          <section id="shura-hotels" aria-labelledby="rt-hotels" className="scroll-mt-24">
            <h2 id="rt-hotels" className="font-heading text-2xl font-bold sm:text-3xl">Staying at a Shura Island hotel?</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#475569]">Book your RSI → Shura Island transfer, then tell us your property so we confirm its access arrangement. This covers all Shura properties; there is one transfer page, not one per hotel.</p>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {data.hotels.map((h) => (
                <li key={h.name} className="flex items-center justify-between gap-3 rounded-2xl border border-[#0E7490]/15 bg-white p-4">
                  <span className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ECFEFF] text-[#0E7490]"><BedDouble aria-hidden className="h-5 w-5" /></span><span><span className="block text-sm font-bold">Stay at {h.name}?</span><span className="block text-xs text-[#64748B]">{h.note}</span></span></span>
                  <a href={rsiWhatsApp(`Shura Island (${h.name})`)} target="_blank" rel="noopener noreferrer" aria-label={`Get quote: RSI to ${h.name}`} className="inline-flex min-h-[44px] shrink-0 items-center gap-1 rounded-full bg-[#16A34A] px-4 text-xs font-bold text-[#FFFFFF] hover:bg-[#15803D]"><MessageCircle aria-hidden className="h-3.5 w-3.5" /> Quote</a>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ─── VEHICLES ─── */}
        <section aria-labelledby="rt-veh">
          <h2 id="rt-veh" className="font-heading text-2xl font-bold sm:text-3xl">Vehicle options</h2>
          <ul className="mt-5 grid gap-4 sm:grid-cols-3">
            {[
              { icon: CarFront, t: "Sedan", d: "1–3 passengers, couples, light luggage." },
              { icon: Users, t: "SUV", d: "Families, more luggage, extra comfort." },
              { icon: Briefcase, t: "Van", d: "Larger groups; availability confirmed on WhatsApp." },
            ].map(({ icon: Icon, t, d }) => (
              <li key={t} className="rounded-2xl border border-[#0E7490]/15 bg-white p-5"><Icon aria-hidden className="h-5 w-5 text-[#0E7490]" /><h3 className="mt-2 font-bold">{t}</h3><p className="mt-1 text-sm text-[#475569]">{d}</p></li>
            ))}
          </ul>
        </section>

        {/* ─── WHO / WHY ─── */}
        <section aria-labelledby="rt-who" className="grid gap-5 lg:grid-cols-2">
          <div>
            <h2 id="rt-who" className="font-heading text-xl font-bold">Who this transfer is for</h2>
            <ul className="mt-4 space-y-3">
              {data.whoFor.map((w) => <li key={w.title} className="rounded-2xl border border-[#0E7490]/15 bg-white p-4 text-sm leading-relaxed text-[#475569]"><span className="font-semibold text-[#0F172A]">{w.title}.</span> {w.desc}</li>)}
            </ul>
          </div>
          <div className="rounded-3xl border border-[#16A34A]/20 bg-[#F0FDF4] p-6">
            <h2 className="font-heading text-xl font-bold">Why pre-book this transfer?</h2>
            <ul className="mt-4 space-y-2.5">
              {data.whyPrebook.map((w) => <li key={w} className="flex gap-2.5 text-sm text-[#166534]"><CheckCircle2 aria-hidden className="mt-0.5 h-4 w-4 shrink-0" /> {w}</li>)}
            </ul>
          </div>
        </section>

        {/* ─── BOOKING PROCESS ─── */}
        <section aria-labelledby="rt-process">
          <h2 id="rt-process" className="font-heading text-2xl font-bold sm:text-3xl">How to book</h2>
          <ol className="mt-5 grid gap-4 md:grid-cols-3">
            {[
              { n: "01", t: "Send Your Trip Details", d: "Airport, destination, date, time, passengers and vehicle." },
              { n: "02", t: "Receive Your Fare", d: "TSA confirms the fare on WhatsApp." },
              { n: "03", t: "Confirm Your Transfer", d: "Once confirmed, the trip is scheduled." },
            ].map((s) => <li key={s.n} className="rounded-2xl border border-[#0E7490]/15 bg-white p-5"><p className="font-heading text-3xl font-extrabold text-[#5EEAD4]">{s.n}</p><h3 className="mt-1 font-bold">{s.t}</h3><p className="mt-1 text-sm text-[#475569]">{s.d}</p></li>)}
          </ol>
        </section>

        {/* ─── FAQ ─── */}
        <section aria-labelledby="rt-faq">
          <h2 id="rt-faq" className="font-heading text-2xl font-bold sm:text-3xl">RSI to {data.destination}: your questions</h2>
          <div className="mt-5 space-y-3">
            {data.faqs.map((f) => (
              <details key={f.question} className="rounded-2xl border border-[#0E7490]/15 bg-white p-5 open:border-[#16A34A]/40">
                <summary className="cursor-pointer list-none font-semibold marker:hidden"><h3 className="inline">{f.question}</h3></summary>
                <p className="mt-2 text-sm leading-relaxed text-[#475569]">{f.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ─── QUOTE ─── */}
        <section id="route-quote" aria-labelledby="rt-quote" className="scroll-mt-24 rounded-3xl border border-[#16A34A]/20 bg-[#F0FDF4] p-5 sm:p-8">
          <div className="mx-auto mb-6 max-w-2xl text-center">
            <h2 id="rt-quote" className="font-heading text-2xl font-bold sm:text-3xl">Get Quote: RSI → {data.destination}</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#475569]">Send the details and we reply on WhatsApp with the fare for your vehicle.</p>
          </div>
          <WhatsAppQuoteForm
            defaultPickup={RSI_FROM_LABEL}
            lockPickup
            defaultDropoff={data.destination}
            vehicleKeys={["Sedan", "VIP SUV", "Van"]}
            suvLabel="SUV"
            defaultVehicle="Sedan"
            showNotes
            messageIntro={data.waIntro}
            submitLabel="Get Quote on WhatsApp"
            footnote={data.island ? `${RSI_FORM_MICROCOPY} ${RSI_ISLAND_MICROCOPY}` : RSI_FORM_MICROCOPY}
          />
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp btn-lg"><MessageCircle aria-hidden className="h-4 w-4" /> Or message us on WhatsApp</a>
            <a href={mailto} className="btn btn-secondary btn-lg"><Mail aria-hidden className="h-4 w-4" /> Company? Email an RFQ</a>
          </div>
          <p className="mt-3 text-center text-xs text-[#475569]">Corporate invoicing can be arranged through our sister company.</p>
        </section>

        {/* ─── RELATED ─── */}
        <section aria-labelledby="rt-related" className="grid gap-6 md:grid-cols-2">
          <div>
            <h2 id="rt-related" className="font-heading text-xl font-bold">Related Red Sea routes</h2>
            <ul className="mt-3 space-y-3">
              {data.related.map((k) => {
                const l = RSI_ROUTE_LINKS[k];
                return (
                  <li key={k}>
                    <Link href={l.href} className="group block">
                      <span className="inline-flex items-center gap-1 text-sm font-bold text-[#15803D] group-hover:underline">{l.label} <ArrowRight aria-hidden className="h-3.5 w-3.5 rtl:rotate-180" /></span>
                      <span className="block text-xs text-[#64748B]">{l.blurb}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="rounded-3xl border border-[#0E7490]/15 bg-white p-6">
            <h2 className="font-heading text-xl font-bold">More about RSI</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#475569]">See every destination, the land-versus-boat explanation and all indicative rates on the <Link href={RSI_HUB_HREF} className="font-semibold text-[#15803D] hover:underline">{anchor}</Link> page.</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href="/routes/red-sea-airport-to-amaala" className="font-semibold text-[#15803D] hover:underline">RSI to AMAALA transfer</Link></li>
              <li><Link href="/locations/neom" className="font-semibold text-[#15803D] hover:underline">Private transfers in NEOM</Link></li>
              <li><Link href="/fleet" className="font-semibold text-[#15803D] hover:underline">Vehicle categories</Link></li>
            </ul>
          </div>
        </section>
      </div>

      {/* ─── MOBILE STICKY CTA ─── */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#16A34A]/15 bg-[#FFFFFF]/95 py-3 ps-4 pe-20 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur lg:hidden">
        <div className="flex items-center gap-2">
          <a href="#route-quote" className="btn btn-primary flex-1 justify-center whitespace-nowrap">Get Quote</a>
          <a href={wa} target="_blank" rel="noopener noreferrer" aria-label={`WhatsApp — RSI to ${data.destination}`} className="btn btn-whatsapp flex-1 justify-center"><MessageCircle aria-hidden className="h-4 w-4" /> WhatsApp</a>
        </div>
      </div>
    </div>
  );
}

const RSI_ROUTE_ORDER = ["red-sea-airport-to-turtle-bay", "red-sea-airport-to-shura-island", "red-sea-airport-to-nujuma", "red-sea-airport-to-shebara"];
