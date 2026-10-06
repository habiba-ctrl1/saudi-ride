import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageCircle, MapPin, Check, ArrowLeft } from "lucide-react";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqSchema, speakableSchema } from "@/lib/schema";
import { routeFact, distanceGuideFor, type Block, type ClusterPage, type ClusterCity } from "@/lib/data/cluster";
import { SectionHeader, FactsStrip, FaqList, LinkCards, QuoteSection, wa } from "./ui";

const SITE = "https://taxisaudiarabia.com";

function BlockView({ block, index }: { block: Block; index: number }) {
  const id = `block-${index}`;
  switch (block.type) {
    case "prose":
      return (
        <section aria-labelledby={id} className="grid grid-cols-1 gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
          <h2 id={id} className="font-heading text-[1.6rem] font-bold leading-tight md:text-[2rem]">{block.heading}</h2>
          <div className="space-y-4 text-[0.95rem] leading-relaxed text-[#374151]">
            {block.paragraphs.map((p) => <p key={p.slice(0, 32)}>{p}</p>)}
          </div>
        </section>
      );
    case "cards":
      return (
        <section aria-labelledby={id}>
          <SectionHeader id={id} eyebrow={block.eyebrow ?? "Who it's for"} title={block.heading} intro={block.intro} />
          <div className="grid gap-4 md:grid-cols-3">
            {block.items.map((c, i) => (
              <article key={c.title} className="rounded-3xl border border-[#E5E7EB] bg-white p-6">
                <span className="font-heading text-sm font-bold tabular-nums text-[#16A34A]">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-2 font-heading text-lg font-bold">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#4B5563]">{c.body}</p>
              </article>
            ))}
          </div>
        </section>
      );
    case "checklist":
      return (
        <section aria-labelledby={id} className="rounded-3xl border border-[#16A34A]/15 bg-[#F0FDF4] p-6 md:p-9">
          <h2 id={id} className="font-heading text-[1.5rem] font-bold md:text-[1.75rem]">{block.heading}</h2>
          {block.intro && <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#4B5563]">{block.intro}</p>}
          <ul className="mt-6 grid gap-3 md:grid-cols-2">
            {block.items.map((it) => (
              <li key={it} className="flex items-start gap-3 rounded-2xl bg-white p-4 text-sm leading-relaxed text-[#1F2937]">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#16A34A] text-[#FFFFFF]"><Check className="h-3 w-3" aria-hidden="true" /></span>
                {it}
              </li>
            ))}
          </ul>
        </section>
      );
    case "steps":
      return (
        <section aria-labelledby={id}>
          <SectionHeader id={id} eyebrow={block.eyebrow ?? "Step by step"} title={block.heading} intro={block.intro} />
          <ol className="relative grid gap-6 md:grid-cols-4 md:gap-4">
            <span aria-hidden="true" className="absolute left-[12%] right-[12%] top-5 hidden h-px bg-[#16A34A]/25 md:block" />
            {block.items.map((s, i) => (
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
      );
    case "table":
      return (
        <section aria-labelledby={id}>
          <SectionHeader id={id} eyebrow={block.eyebrow ?? "At a glance"} title={block.heading} intro={block.intro} />
          <div className="overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white">
            {/* Stacked rows on mobile, a real table from sm up — no horizontal scroll at 320px. */}
            <table className="w-full text-left text-sm">
              <thead className="hidden bg-[#F9FAFB] text-[0.7rem] uppercase tracking-[0.14em] text-[#6B7280] sm:table-header-group">
                <tr>{block.columns.map((c) => <th key={c} scope="col" className="px-5 py-3 font-bold">{c}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {block.rows.map((r) => (
                  <tr key={r[0]} className="block p-4 sm:table-row sm:p-0">
                    {r.map((cell, ci) =>
                      ci === 0 ? (
                        <th key={ci} scope="row" className="block font-semibold text-[#1C1C1C] sm:table-cell sm:px-5 sm:py-4">{cell}</th>
                      ) : (
                        <td key={ci} className="block pt-1 text-[#4B5563] sm:table-cell sm:px-5 sm:py-4">
                          <span className="mr-1 text-[0.65rem] font-bold uppercase tracking-wider text-[#9CA3AF] sm:hidden">{block.columns[ci]}:</span>
                          {cell}
                        </td>
                      ),
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      );
    case "compare":
      return (
        <section aria-labelledby={id}>
          <SectionHeader id={id} eyebrow={block.eyebrow ?? "Honest comparison"} title={block.heading} intro={block.intro} />
          <div className="grid gap-4 md:grid-cols-2">
            {block.options.map((o) => (
              <div key={o.title} className={`rounded-3xl p-6 md:p-7 ${o.tone === "green" ? "bg-[#16A34A] text-[#FFFFFF]" : "border border-[#E5E7EB] bg-white"}`}>
                <h3 className="font-heading text-lg font-bold">{o.title}</h3>
                <p className={`mt-1 text-[0.7rem] font-bold uppercase tracking-[0.16em] ${o.tone === "green" ? "text-[#FACC15]" : "text-[#16A34A]"}`}>Best when</p>
                <ul className="mt-4 space-y-2.5">
                  {o.when.map((w) => (
                    <li key={w} className="flex items-start gap-2.5 text-sm">
                      <Check className={`mt-0.5 h-4 w-4 shrink-0 ${o.tone === "green" ? "text-[#FACC15]" : "text-[#16A34A]"}`} aria-hidden="true" />
                      <span className={o.tone === "green" ? "text-white/90" : "text-[#374151]"}>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      );
    case "routes":
      return (
        <section aria-labelledby={id}>
          <SectionHeader id={id} eyebrow={block.eyebrow ?? "Onward journeys"} title={block.heading} intro={block.intro} />
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {block.items.map((it) => {
              const f = routeFact(it.slug);
              if (!f) return null;
              const guide = distanceGuideFor(it.slug);
              return (
                <li key={it.slug} className="group relative flex flex-col rounded-2xl border border-[#E5E7EB] bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#16A34A]/40 hover:shadow-[0_14px_30px_-20px_rgba(15,23,42,0.45)] focus-within:border-[#16A34A]">
                  <div className="flex items-start justify-between gap-3">
                    <Link href={`/routes/${it.slug}`} className="font-heading text-base font-bold text-[#1C1C1C] after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none">
                      {f.from} → {f.to}
                    </Link>
                    <span className="shrink-0 text-right text-[0.8rem] font-semibold tabular-nums text-[#1C1C1C]">
                      {f.km.toLocaleString("en-US")} km
                      <span className="block text-[0.7rem] font-normal text-[#6B7280]">{f.time}</span>
                    </span>
                  </div>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-[#4B5563]">{it.note}</p>
                  {guide && (
                    <Link href={`/distance/${guide}`} className="relative z-10 mt-3 inline-flex min-h-[32px] w-fit items-center rounded-full bg-[#F0FDF4] px-3 text-[0.7rem] font-semibold text-[#15803D] hover:bg-[#DCFCE7]">
                      Distance &amp; drive-time guide
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      );
    case "timeline":
      return (
        <section aria-labelledby={id} className="grid grid-cols-1 gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
          <div>
            <p className="t-eyebrow mb-3">{block.eyebrow ?? "An example plan"}</p>
            <h2 id={id} className="font-heading text-[1.6rem] font-bold leading-tight md:text-[2rem]">{block.heading}</h2>
            {block.intro && <p className="mt-3 text-sm leading-relaxed text-[#6B7280]">{block.intro}</p>}
          </div>
          <ol className="relative space-y-0 border-l-2 border-[#16A34A]/20 pl-7">
            {block.items.map((t) => (
              <li key={t.title} className="group relative pb-7 last:pb-0">
                <span aria-hidden="true" className="absolute -left-[37px] top-1 h-4 w-4 rounded-full border-4 border-[#FAFAF7] bg-[#16A34A] transition-transform group-hover:scale-125" />
                <p className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-[#15803D]">{t.time}</p>
                <p className="mt-1 font-heading text-base font-bold">{t.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-[#4B5563]">{t.desc}</p>
              </li>
            ))}
          </ol>
        </section>
      );
  }
}

// Subtle dot grid for photo-less heroes.
const PATTERN: React.CSSProperties = {
  backgroundImage: "radial-gradient(rgba(250,204,21,0.14) 1px, transparent 1px), radial-gradient(circle at 85% 20%, rgba(22,163,74,0.35), transparent 55%)",
  backgroundSize: "22px 22px, 100% 100%",
};

function Hero({ page, city }: { page: ClusterPage; city: ClusterCity }) {
  const ctas = (
    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
      <a href="#quote" className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-[#FACC15] px-7 text-sm font-bold uppercase tracking-wider text-[#0B1F14] hover:bg-[#FDE047] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
        {page.ctaLabel} <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </a>
      <a href={wa(page.waPrefill)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full border border-white/30 bg-white/5 px-7 text-sm font-bold uppercase tracking-wider text-[#FFFFFF] backdrop-blur hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
        <MessageCircle className="h-4 w-4" aria-hidden="true" /> WhatsApp
      </a>
    </div>
  );
  const eyebrow = (
    <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3.5 py-1.5 text-[0.7rem] font-bold uppercase tracking-[0.18em] text-[#FACC15] backdrop-blur">
      <MapPin className="h-3.5 w-3.5" aria-hidden="true" /> {page.eyebrow}
    </p>
  );
  const crumbs = (
    <Breadcrumbs
      className="relative [&_a]:text-white/70 [&_a:hover]:text-white [&_span]:text-[#FACC15]"
      items={[
        { name: "Home", href: "/" },
        { name: "Locations", href: "/locations" },
        { name: city.name, href: `/locations/${city.slug}` },
        { name: page.name, href: `/locations/${city.slug}/${page.slug}` },
      ]}
    />
  );

  if (page.kind === "district") {
    // District: split layout — text left, framed photo right.
    return (
      <section className="relative overflow-hidden bg-[#0B1F14]">
        {crumbs}
        <div className="section-container grid max-w-6xl items-center gap-10 pb-16 pt-6 lg:grid-cols-[1.1fr_0.9fr] lg:pb-20">
          <div>
            {eyebrow}
            <h1 className="mt-5 font-heading text-[2.1rem] font-bold leading-[1.1] text-[#FFFFFF] sm:text-[2.75rem] md:text-5xl">{page.h1}</h1>
            {page.tagline && <p className="mt-3 max-w-xl text-base leading-relaxed text-white/80">{page.tagline}</p>}
            <p className="mt-3 font-heading text-lg text-[#FACC15]/80" lang="ar">{page.nameAr}</p>
            {ctas}
          </div>
          {page.heroImage ? (
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl">
              <Image src={page.heroImage} alt={page.heroAlt ?? ""} fill priority sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
            </div>
          ) : (
            // No verified photo of this area yet — an honest typographic panel
            // (Arabic name + key facts) instead of an unrelated stock image.
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0F2A1C] p-7 shadow-2xl md:p-9" style={PATTERN}>
              <p className="font-heading text-5xl font-bold leading-none text-[#FACC15] md:text-6xl" lang="ar" aria-hidden="true">{page.nameAr}</p>
              <dl className="mt-8 grid gap-4">
                {page.facts.slice(0, 3).map((f) => (
                  <div key={f.label} className="border-t border-white/10 pt-3">
                    <dt className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-white/50">{f.label}</dt>
                    <dd className="mt-1 text-sm font-semibold text-[#FFFFFF]">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </section>
    );
  }

  // Service and attraction: full-bleed photo; attraction text sits low over
  // the image, service text sits high with a stronger side gradient.
  const attraction = page.kind === "attraction" && !!page.heroImage;
  return (
    <section className={`relative isolate overflow-hidden bg-[#0B1F14] ${attraction ? "min-h-[560px] md:min-h-[620px]" : ""}`}>
      {page.heroImage ? (
        <Image src={page.heroImage} alt={page.heroAlt ?? ""} fill priority sizes="100vw" className="-z-10 object-cover" />
      ) : (
        <div aria-hidden="true" className="absolute inset-0 -z-10" style={PATTERN} />
      )}
      <div
        aria-hidden="true"
        className={`absolute inset-0 -z-10 ${attraction ? "bg-gradient-to-t from-[#0B1F14] via-[#0B1F14]/60 to-[#0B1F14]/30" : "bg-gradient-to-r from-[#0B1F14] via-[#0B1F14]/85 to-[#0B1F14]/30"}`}
      />
      {crumbs}
      <div className={`section-container max-w-6xl pb-16 md:pb-20 ${attraction ? "pt-40 md:pt-56" : "pt-6 md:pt-10"}`}>
        <div className="max-w-2xl">
          {eyebrow}
          <h1 className="mt-5 font-heading text-[2.1rem] font-bold leading-[1.1] text-[#FFFFFF] sm:text-[2.75rem] md:text-5xl">{page.h1}</h1>
          {page.tagline && <p className="mt-3 max-w-xl text-base leading-relaxed text-white/80">{page.tagline}</p>}
            <p className="mt-3 font-heading text-lg text-[#FACC15]/80" lang="ar">{page.nameAr}</p>
          {ctas}
        </div>
      </div>
    </section>
  );
}

export function ClusterChildPage({ page, city }: { page: ClusterPage; city: ClusterCity }) {
  const path = `/locations/${city.slug}/${page.slug}`;
  const service: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": page.kind === "service" ? "Service" : "TaxiService",
    "@id": `${SITE}${path}#service`,
    name: page.h1,
    serviceType: page.schema.serviceType,
    description: page.metaDescription,
    url: `${SITE}${path}`,
    provider: { "@type": "Organization", name: "Taxi Saudi Arabia", url: SITE },
    areaServed: { "@type": "City", name: city.name },
    availableLanguage: ["English", "Arabic"],
  };
  if (page.schema.place) {
    service.about = { "@type": page.schema.place.type, name: page.schema.place.name, description: page.schema.place.description, address: { "@type": "PostalAddress", addressLocality: city.name, addressCountry: "SA" } };
  }
  const siblings = city.nav.filter((n) => n.slug !== page.slug);

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#1C1C1C]">
      <JsonLd data={[service, speakableSchema({ path }), faqSchema(page.faqs)]} />
      <Hero page={page} city={city} />

      <section className="section-container relative z-10 -mt-8 max-w-6xl" aria-label="Summary">
        <div className="rounded-[2rem] border border-[#16A34A]/15 bg-white p-6 shadow-[0_30px_70px_-45px_rgba(15,23,42,0.5)] md:p-9">
          <p id="speakable-summary" className="text-[1.02rem] leading-relaxed text-[#1F2937] md:text-[1.1rem]">{page.intro}</p>
          <div className="mt-7"><FactsStrip facts={page.facts} /></div>
        </div>
      </section>

      <div className="section-container max-w-6xl space-y-20 py-20 md:space-y-24 md:py-24">
        {page.blocks.map((b, i) => <BlockView key={i} block={b} index={i} />)}

        <QuoteSection heading={page.ctaHeading} body={page.ctaBody} submitLabel={page.ctaLabel} form={page.form} waPrefill={page.waPrefill} pathB={page.pathB} />

        <section aria-labelledby="faq-heading" className="grid grid-cols-1 gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeader id="faq-heading" eyebrow="FAQ" title={`${page.name}: common questions`} />
          <FaqList faqs={page.faqs} />
        </section>

        <section aria-labelledby="related-heading">
          <h2 id="related-heading" className="mb-5 font-heading text-xl font-bold">Related in {city.name}</h2>
          <LinkCards links={page.related} />
        </section>

        <nav aria-label={`More ${city.name} pages`} className="rounded-3xl border border-[#E5E7EB] bg-white p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <Link href={`/locations/${city.slug}`} className="group inline-flex min-h-[44px] items-center gap-2 text-sm font-bold text-[#15803D] hover:text-[#16A34A]">
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" aria-hidden="true" /> All {city.name} transport options
            </Link>
            <ul className="flex flex-wrap gap-2">
              {siblings.map((n) => (
                <li key={n.slug}>
                  <Link href={`/locations/${city.slug}/${n.slug}`} className="inline-flex min-h-[36px] items-center rounded-full border border-[#E5E7EB] px-3.5 text-xs font-semibold text-[#374151] transition-colors hover:border-[#16A34A]/40 hover:text-[#15803D]">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>
    </div>
  );
}
