import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageCircle, MapPin, Mail, Clock } from "lucide-react";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqSchema, speakableSchema, itemListSchema } from "@/lib/schema";
import { contactConfig } from "@/lib/config/contact";
import { FLEET_VEHICLES } from "@/lib/fleet-data";
import { routeFact, CORPORATE_INVOICE_LINE } from "@/lib/data/cluster";
import type { RegionalHubConfig } from "@/lib/data/eastern-hubs";
import { TripTypeSelector } from "./TripTypeSelector";
import { VehicleFitTool, type FitOption } from "./VehicleFitTool";
import { SectionHeader, FactsStrip, FaqList, QuoteSection, wa } from "./ui";

const SITE = "https://taxisaudiarabia.com";
const BTN_Y = "inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-[#FACC15] px-7 text-sm font-bold uppercase tracking-wider text-[#0B1F14] transition-colors hover:bg-[#FDE047] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white";
const BTN_G = "inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[#16A34A] px-6 text-xs font-bold uppercase tracking-wider text-[#FFFFFF] hover:bg-[#15803D]";
const BTN_O = "inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-[#16A34A]/30 px-6 text-xs font-bold uppercase tracking-wider text-[#15803D] hover:bg-[#F0FDF4]";
const PATTERN: React.CSSProperties = {
  backgroundImage: "radial-gradient(rgba(250,204,21,0.14) 1px, transparent 1px), radial-gradient(circle at 85% 20%, rgba(22,163,74,0.35), transparent 55%)",
  backgroundSize: "22px 22px, 100% 100%",
};

// Data-driven hub for secondary cities (Al Khobar, Dhahran, Jubail — built
// 2026-11-21). Every heading and paragraph comes from the city config, so no
// two hubs share sentences; only the layout is shared (CLAUDE.md §17).
export function RegionalHub({ c }: { c: RegionalHubConfig }) {
  const path = `/locations/${c.slug}`;
  const fitOptions: FitOption[] = c.vehicleFit.map((v) => {
    const fleet = FLEET_VEHICLES.find((f) => f.slug === v.fleetSlug);
    return { id: v.id, label: v.label, forWho: v.forWho, href: `/fleet/${v.fleetSlug}`, passengers: fleet?.passengers ?? 0, luggage: fleet?.luggage ?? 0 };
  });
  const corridors = c.corridors.map((r) => ({ ...r, f: routeFact(r.slug) })).filter((r) => r.f);
  const maxKm = Math.max(...corridors.map((r) => r.f!.km));

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "TaxiService",
      "@id": `${SITE}${path}#service`,
      name: c.schemaName,
      description: c.schemaDescription,
      url: `${SITE}${path}`,
      provider: { "@type": "Organization", name: "Taxi Saudi Arabia", url: SITE },
      areaServed: { "@type": "City", name: c.name, geo: { "@type": "GeoCoordinates", latitude: c.geo.lat, longitude: c.geo.lng } },
      availableLanguage: ["English", "Arabic"],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: `${c.name} transport services`,
        itemListElement: c.trips.filter((t) => t.href.startsWith("/")).map((t) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: t.label, url: `${SITE}${t.href}` } })),
      },
    },
    speakableSchema({ path }),
    itemListSchema(corridors.map((r) => ({ name: r.label, href: `/routes/${r.slug}` }))),
    faqSchema(c.faqs),
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#1C1C1C]">
      <JsonLd data={schema} />

      {/* ─── HERO ─────────────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden bg-[#0B1F14]">
        {c.hero ? (
          <>
            <Image src={c.hero.src} alt={c.hero.alt} fill priority sizes="100vw" className="-z-10 object-cover object-[30%_60%]" />
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#0B1F14]/95 via-[#0B1F14]/75 to-[#0B1F14]/15" aria-hidden="true" />
          </>
        ) : (
          <div aria-hidden="true" className="absolute inset-0 -z-10" style={PATTERN} />
        )}
        <Breadcrumbs
          className="relative [&_a]:text-white/70 [&_a:hover]:text-white [&_span]:text-[#FACC15]"
          items={[
            { name: "Home", href: "/" },
            { name: "Saudi Arabia Transportation", href: "/locations" },
            { name: "Dammam & Eastern Province", href: "/locations/dammam" },
            { name: c.name, href: path },
          ]}
        />
        <div className="section-container relative max-w-6xl pb-16 pt-6 md:pb-24 md:pt-10">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3.5 py-1.5 text-[0.7rem] font-bold uppercase tracking-[0.18em] text-[#FACC15] backdrop-blur">
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" /> {c.eyebrow}
            </p>
            <h1 className="mt-5 font-heading text-[2.25rem] font-bold leading-[1.08] text-[#FFFFFF] sm:text-5xl md:text-[3.5rem]">
              Private Taxi &amp; Chauffeur Service in <span className="text-[#FACC15]">{c.name}</span>
            </h1>
            <p className="mt-3 font-heading text-lg text-[#FACC15]/80" lang="ar">{c.nameAr}</p>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-white/85 md:text-lg">{c.lede}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#quote" className={BTN_Y}>{c.ctaLabel} <ArrowRight className="h-4 w-4" aria-hidden="true" /></a>
              <a href={wa(c.hubWa)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full border border-white/30 bg-white/5 px-7 text-sm font-bold uppercase tracking-wider text-[#FFFFFF] backdrop-blur hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                <MessageCircle className="h-4 w-4" aria-hidden="true" /> Book via WhatsApp
              </a>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-[0.8rem] text-white/80">
              {c.heroBullets.map((t) => (
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
            <p id="speakable-summary" className="text-[1.05rem] leading-relaxed text-[#1F2937] md:text-lg">{c.shortAnswer}</p>
          </div>
          <div className="mt-7"><FactsStrip facts={c.facts} /></div>
        </div>
      </section>

      <div className="section-container max-w-6xl space-y-20 py-20 md:space-y-28 md:py-28">
        {/* ─── TRIP SELECTOR ────────────────────────────────────── */}
        <section aria-labelledby="trip-heading">
          <SectionHeader id="trip-heading" eyebrow="Start here" title={c.tripHeading} intro={c.tripIntro} />
          <TripTypeSelector trips={c.trips} whatsappLink={contactConfig.whatsappLink} />
        </section>

        {/* ─── LOCAL KNOWLEDGE ──────────────────────────────────── */}
        <section id="local" aria-labelledby="local-heading" className="scroll-mt-24">
          <SectionHeader id="local-heading" eyebrow={c.local.eyebrow} title={c.local.heading} intro={c.local.intro} />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {c.local.items.map((it) => (
              <article key={it.title} className="flex flex-col rounded-3xl border border-[#E5E7EB] bg-white p-6">
                <h3 className="font-heading text-lg font-bold">{it.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-[#4B5563]">{it.body}</p>
                {it.href && (
                  <Link href={it.href} className="mt-4 inline-flex min-h-[44px] items-center gap-2 text-sm font-bold text-[#15803D] hover:underline">
                    {it.linkLabel} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                )}
              </article>
            ))}
          </div>
        </section>

        {/* ─── CORRIDORS ────────────────────────────────────────── */}
        <section id="destinations" aria-labelledby="routes-heading" className="scroll-mt-24">
          <SectionHeader id="routes-heading" eyebrow="Routes with their own page" title={c.routesHeading} intro="Distances and drive times are approximate and come from the same route data as the route pages." />
          <ol className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {corridors.map((r) => (
              <li key={r.slug} className="group relative overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#16A34A]/40 focus-within:border-[#16A34A]">
                <div className="flex items-center justify-between gap-3">
                  <Link href={`/routes/${r.slug}`} className="font-heading text-base font-bold text-[#1C1C1C] after:absolute after:inset-0 focus-visible:outline-none">{r.label}</Link>
                  <span className="shrink-0 text-right text-[0.8rem] font-semibold tabular-nums">{r.f!.km.toLocaleString("en-US")} km <span className="block text-[0.7rem] font-normal text-[#6B7280]">{r.f!.time}</span></span>
                </div>
                <div className="mt-4 flex items-center gap-2" aria-hidden="true">
                  <span className="h-3 w-3 shrink-0 rounded-full border-2 border-[#16A34A] bg-white" />
                  <span className="relative h-1 flex-1 overflow-hidden rounded-full bg-[#F3F4F6]">
                    <span className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#16A34A] to-[#FACC15]" style={{ width: `${Math.max(6, (r.f!.km / maxKm) * 100)}%` }} />
                  </span>
                  <span className="h-3 w-3 shrink-0 rounded-full bg-[#16A34A]" />
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[#4B5563]">{r.note}</p>
              </li>
            ))}
          </ol>
          {c.routesFootnote && <p className="mt-5 text-sm text-[#4B5563]">{c.routesFootnote}</p>}
        </section>

        {/* ─── COMPARISON ───────────────────────────────────────── */}
        <section aria-labelledby="compare-heading">
          <SectionHeader id="compare-heading" eyebrow="Honest comparison" title={c.compare.heading} intro={c.compare.intro} />
          <div className="grid gap-4 md:grid-cols-2">
            {c.compare.options.map((o, i) => (
              <div key={o.title} className={`rounded-3xl p-6 md:p-7 ${i === 1 ? "bg-[#16A34A] text-[#FFFFFF]" : "border border-[#E5E7EB] bg-white"}`}>
                <h3 className="font-heading text-lg font-bold">{o.title}</h3>
                <ul className="mt-4 space-y-2.5">
                  {o.when.map((w) => <li key={w} className={`text-sm ${i === 1 ? "text-white/90" : "text-[#374151]"}`}>• {w}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ─── HOURLY ───────────────────────────────────────────── */}
        <section aria-labelledby="driver-heading" className="rounded-[2rem] border border-[#E5E7EB] bg-white p-7 md:p-10">
          <p className="flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[#16A34A]"><Clock className="h-4 w-4" aria-hidden="true" /> Chauffeur by the hour</p>
          <h2 id="driver-heading" className="mt-3 font-heading text-[1.75rem] font-bold leading-tight md:text-[2.1rem]">{c.hourly.heading}</h2>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[#4B5563]">{c.hourly.body}</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href="/locations/dammam/private-driver" className={BTN_G}>{c.hourly.linkLabel} <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
            <a href={wa(c.hourly.waPrefill)} target="_blank" rel="noopener noreferrer" className={BTN_O}><MessageCircle className="h-4 w-4" aria-hidden="true" /> Ask on WhatsApp</a>
          </div>
        </section>

        {/* ─── VEHICLES ─────────────────────────────────────────── */}
        <section aria-labelledby="vehicle-heading">
          <SectionHeader id="vehicle-heading" eyebrow="Vehicle options" title={c.vehicleHeading} intro={c.vehicleIntro} />
          <VehicleFitTool options={fitOptions} />
        </section>

        {/* ─── TIMING ───────────────────────────────────────────── */}
        <section aria-labelledby="timing-heading">
          <SectionHeader id="timing-heading" eyebrow="Plan your timing" title={c.timingHeading} />
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-[#E5E7EB] bg-[#E5E7EB] sm:grid-cols-2 lg:grid-cols-3">
            {c.timing.map((t, i) => (
              <div key={t.title} className="bg-white p-6">
                <span className="font-heading text-sm font-bold tabular-nums text-[#16A34A]">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-2 font-heading text-base font-bold">{t.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#4B5563]">{t.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── CORPORATE ────────────────────────────────────────── */}
        <section aria-labelledby="corp-heading" className="rounded-[2rem] bg-[#0B1F14] p-7 text-[#FFFFFF] md:p-10">
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[#FACC15]">For companies & visiting teams</p>
          <h2 id="corp-heading" className="mt-3 font-heading text-[1.75rem] font-bold leading-tight text-[#FFFFFF] md:text-[2.1rem]">{c.corporate.heading}</h2>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/80">{c.corporate.body} {CORPORATE_INVOICE_LINE}</p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a href={`mailto:${contactConfig.email}?subject=${encodeURIComponent(c.corporate.emailSubject)}&body=${encodeURIComponent(c.corporate.emailBody)}`} className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[#FACC15] px-6 text-xs font-bold uppercase tracking-wider text-[#0B1F14] hover:bg-[#FDE047]"><Mail className="h-4 w-4" aria-hidden="true" /> Request a Written Quote</a>
            <Link href="/services/corporate" className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-white/25 px-6 text-xs font-bold uppercase tracking-wider text-[#FFFFFF] hover:bg-white/10">Corporate transportation <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
            <Link href="/services/vip-transportation" className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-white/25 px-6 text-xs font-bold uppercase tracking-wider text-[#FFFFFF] hover:bg-white/10">VIP transportation <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
            <Link href="/locations/dammam#corporate-rfq" className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-white/25 px-6 text-xs font-bold uppercase tracking-wider text-[#FFFFFF] hover:bg-white/10">Detailed RFQ form <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
          </div>
        </section>

        <QuoteSection
          heading={c.quote.heading}
          body={c.quote.body}
          submitLabel={c.ctaLabel}
          form={{ pickup: c.name }}
          waPrefill={c.hubWa}
          pathB={{ heading: "Booking for a company?", body: `Send the trips by email for a written quote. ${CORPORATE_INVOICE_LINE}`, emailSubject: c.corporate.emailSubject, emailBody: c.corporate.emailBody }}
        />

        {/* ─── FAQ ──────────────────────────────────────────────── */}
        <section aria-labelledby="faq-heading" className="grid grid-cols-1 gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <SectionHeader id="faq-heading" eyebrow="FAQ" title={c.faqHeading} />
            <a href={wa(c.hubWa)} target="_blank" rel="noopener noreferrer" className={BTN_O}><MessageCircle className="h-4 w-4" aria-hidden="true" /> Ask on WhatsApp</a>
          </div>
          <FaqList faqs={c.faqs} />
        </section>

        {/* ─── RELATED ──────────────────────────────────────────── */}
        <section aria-labelledby="related-heading">
          <h2 id="related-heading" className="mb-5 font-heading text-xl font-bold">{c.relatedHeading}</h2>
          <ul className="grid grid-cols-1 gap-x-8 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
            {c.related.map((g) => (
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

      <section className="border-t border-[#E5E7EB] bg-white">
        <div className="section-container flex max-w-6xl flex-col items-start gap-6 py-14 pb-28 md:flex-row md:items-center md:justify-between md:pb-14">
          <p className="font-heading text-2xl font-bold">{c.finalLine}</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a href="#quote" className={BTN_G}>Get My Quote <ArrowRight className="h-4 w-4" aria-hidden="true" /></a>
            <a href={wa(c.hubWa)} target="_blank" rel="noopener noreferrer" className={BTN_O}><MessageCircle className="h-4 w-4" aria-hidden="true" /> WhatsApp</a>
          </div>
        </div>
      </section>
    </div>
  );
}
