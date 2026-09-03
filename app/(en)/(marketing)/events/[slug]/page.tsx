import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Calendar, MapPin, Building2, CheckCircle2, MessageCircle, CalendarDays, ArrowRight } from "lucide-react";
import { contactConfig } from "@/lib/config/contact";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { TLDRSummary } from "@/components/seo/TLDRSummary";
import { serviceSchema, faqSchema, speakableSchema, breadcrumbSchema } from "@/lib/schema";
import { EVENTS, EVENT_SLUGS, getEvent } from "@/lib/data/events";

export const revalidate = 86400;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return EVENT_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const ev = getEvent(slug);
  if (!ev) return { title: "Event Not Found" };
  return {
    title: ev.title,
    description: ev.description,
    alternates: { canonical: `https://taxisaudiarabia.com/events/${slug}` },
    openGraph: {
      title: ev.title,
      description: ev.description,
      type: "website",
      url: `https://taxisaudiarabia.com/events/${slug}`,
      ...(ev.heroImage ? { images: [{ url: `https://taxisaudiarabia.com${ev.heroImage}`, width: 1376, height: 768, alt: ev.heroAlt ?? ev.h1 }] } : {}),
    },
    // Explicit twitter block so the card title/description/image match this page
    // instead of inheriting the site-wide default from the root layout.
    twitter: {
      card: "summary_large_image",
      title: ev.title,
      description: ev.description,
      ...(ev.heroImage ? { images: [{ url: `https://taxisaudiarabia.com${ev.heroImage}`, alt: ev.heroAlt ?? ev.h1 }] } : {}),
    },
  };
}

export default async function EventPage({ params }: PageProps) {
  const { slug } = await params;
  const ev = getEvent(slug);
  if (!ev) notFound();

  const waLink = `https://wa.me/${contactConfig.whatsappNumber}?text=${encodeURIComponent(
    ev.waPrefill ?? `Salam, I need ${ev.waContext}. My dates, group size and pickup are:`,
  )}`;

  // Time-limited departure callout: render only up to its cut-off instant.
  const showDeparture = !!ev.departureCallout && Date.now() <= Date.parse(ev.departureCallout.untilISO);
  const departureWaLink = ev.departureCallout
    ? `https://wa.me/${contactConfig.whatsappNumber}?text=${encodeURIComponent(ev.departureCallout.waPrefill)}`
    : "";

  // Organiser desk (Path B): WhatsApp RFQ + email RFQ (mailto — corporate buyers
  // who cannot transact on WhatsApp need a written quote / CR-VAT / PO trail).
  const organiserWaLink = ev.organiserDesk
    ? `https://wa.me/${contactConfig.whatsappNumber}?text=${encodeURIComponent(ev.organiserDesk.waPrefill)}`
    : "";
  const organiserMailto = ev.organiserDesk
    ? `mailto:${contactConfig.email}?subject=${encodeURIComponent(ev.organiserDesk.emailSubject)}&body=${encodeURIComponent(ev.organiserDesk.emailBody)}`
    : "";

  // WebPage node that references the real event via `about` (Event is never the
  // root type — we are the transport provider, not the organiser).
  const aboutSchema = ev.about
    ? {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": `https://taxisaudiarabia.com/events/${slug}#webpage`,
        name: ev.title,
        url: `https://taxisaudiarabia.com/events/${slug}`,
        ...(ev.heroImage ? { primaryImageOfPage: { "@type": "ImageObject", url: `https://taxisaudiarabia.com${ev.heroImage}` } } : {}),
        about: {
          "@type": "Event",
          name: ev.about.eventName,
          startDate: ev.about.startDate,
          endDate: ev.about.endDate,
          eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
          location: { "@type": "Place", name: ev.about.venueName, address: { "@type": "PostalAddress", addressLocality: ev.city, addressCountry: "SA" } },
          ...(ev.about.organizer ? { organizer: { "@type": "Organization", name: ev.about.organizer } } : {}),
          ...(ev.about.sameAs ? { sameAs: ev.about.sameAs } : {}),
        },
      }
    : null;

  // ItemList of covered venues (Place, name only — no asserted business relationship).
  const venueListSchema = ev.venueTable
    ? {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: ev.venueTable.heading,
        itemListElement: ev.venueTable.rows.map((r, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: { "@type": "Place", name: r.venue, address: { "@type": "PostalAddress", addressLocality: ev.city, addressCountry: "SA" } },
        })),
      }
    : null;

  // Related event pages — prefer the same city, then fill from the rest.
  const others = EVENTS.filter((e) => e.slug !== slug);
  const sameCity = others.filter((e) => e.city === ev.city);
  const related = [...sameCity, ...others.filter((e) => e.city !== ev.city)].slice(0, 4);

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#1C1C1C] pb-24">
      <JsonLd
        data={[
          serviceSchema({
            name: ev.h1,
            description: ev.description,
            path: `/events/${slug}`,
            serviceType: "Event Transportation",
            areaServed: [ev.city],
          }),
          ...(aboutSchema ? [aboutSchema] : []),
          ...(venueListSchema ? [venueListSchema] : []),
          faqSchema(ev.faqs),
          speakableSchema({ path: `/events/${slug}` }),
          breadcrumbSchema([
            { name: "Home", href: "/" },
            { name: "Events", href: "/events" },
            { name: ev.shortName, href: `/events/${slug}` },
          ]),
        ]}
      />
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Events", href: "/events" },
          { name: ev.shortName, href: `/events/${slug}` },
        ]}
      />

      {/* HERO */}
      <section className="section-container max-w-5xl pt-32 pb-12">
        <span className="inline-flex items-center gap-2 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#16A34A] mb-6">
          <CalendarDays className="h-3 w-3" /> {ev.badge}
        </span>
        <h1 className="font-heading text-3xl md:text-5xl font-bold leading-tight mb-6">{ev.h1}</h1>
        <p className="max-w-2xl text-sm md:text-base text-[#6B7280] leading-relaxed mb-8">{ev.intro}</p>

        {ev.heroImage && (
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl border border-[#C9A84C]/20 mb-8 shadow-[0_8px_40px_rgba(0,0,0,0.12)]">
            <Image
              src={ev.heroImage}
              alt={ev.heroAlt ?? ev.h1}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 1200px"
              className="object-cover"
            />
          </div>
        )}

        {ev.edition && (
          <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mb-8">
            <div className="flex items-start gap-3 rounded-2xl border border-[#C9A84C]/20 bg-white p-4">
              <Calendar className="h-5 w-5 text-[#C9A84C] shrink-0 mt-0.5" />
              <div>
                <p className="text-[0.6rem] uppercase tracking-wider text-[#6B7280] font-bold">Dates</p>
                <p className="text-sm font-bold">{ev.edition.dates}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl border border-[#C9A84C]/20 bg-white p-4">
              <Building2 className="h-5 w-5 text-[#C9A84C] shrink-0 mt-0.5" />
              <div>
                <p className="text-[0.6rem] uppercase tracking-wider text-[#6B7280] font-bold">Venue</p>
                <p className="text-sm font-bold">{ev.edition.venue}</p>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-2xl mb-10">
          <TLDRSummary answer={ev.tldrAnswer} facts={ev.tldrFacts} />
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#16A34A] px-8 py-4 text-xs font-bold uppercase text-white hover:bg-[#15803D] transition-all shadow-[0_4px_20px_rgba(22,163,74,0.3)]"
          >
            <MessageCircle className="h-4 w-4" /> {ev.waCtaLabel ?? "Get Event Transport on WhatsApp"}
          </a>
          <a
            href={contactConfig.primaryPhoneLink}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-[#C9A84C]/40 px-8 py-4 text-xs font-bold uppercase text-[#16A34A] hover:bg-[#C9A84C]/10 transition-all"
          >
            Call {contactConfig.primaryPhoneDisplay}
          </a>
        </div>
      </section>

      {/* ORGANISER DESK (Path B — delegation / B2B; WhatsApp RFQ + email RFQ) */}
      {ev.organiserDesk && (
        <section className="section-container max-w-5xl pt-2 pb-4">
          <div className="rounded-3xl border-2 border-[#16A34A]/35 bg-gradient-to-br from-[#F0FDF4] to-white p-6 sm:p-8 shadow-sm">
            <h2 className="font-heading text-xl md:text-2xl font-bold mb-3">{ev.organiserDesk.heading}</h2>
            <p className="max-w-2xl text-sm text-[#6B7280] leading-relaxed mb-5">{ev.organiserDesk.body}</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={organiserWaLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#16A34A] px-6 py-3.5 text-xs font-bold uppercase text-white hover:bg-[#15803D] transition-all shadow-[0_4px_20px_rgba(22,163,74,0.3)]"
              >
                <MessageCircle className="h-4 w-4" /> Request a delegation quote on WhatsApp
              </a>
              <a
                href={organiserMailto}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#16A34A]/40 px-6 py-3.5 text-xs font-bold uppercase text-[#16A34A] hover:bg-[#16A34A]/10 transition-all"
              >
                Email our organiser desk
              </a>
            </div>
          </div>
        </section>
      )}

      {/* DEPARTURE CALLOUT (time-limited; auto-hides after cut-off) */}
      {showDeparture && ev.departureCallout && (
        <section className="section-container max-w-5xl pt-2 pb-4">
          <div className="rounded-3xl border-2 border-[#C9A84C] bg-[#FFF8E6] p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <CalendarDays className="h-5 w-5 text-[#C9A84C]" />
              <h2 className="font-heading text-xl md:text-2xl font-bold">{ev.departureCallout.heading}</h2>
            </div>
            <p className="max-w-2xl text-sm text-[#6B7280] leading-relaxed mb-5">{ev.departureCallout.body}</p>
            <a
              href={departureWaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#16A34A] px-7 py-3.5 text-xs font-bold uppercase text-white hover:bg-[#15803D] transition-all shadow-[0_4px_20px_rgba(22,163,74,0.3)]"
            >
              <MessageCircle className="h-4 w-4" /> Book my departure transfer
            </a>
          </div>
        </section>
      )}

      {/* VENUE TIMINGS TABLE */}
      {ev.timings && (
        <section className="section-container max-w-5xl py-16 border-t border-[#C9A84C]/10">
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-3 text-center">{ev.timings.heading}</h2>
          {ev.timings.intro && (
            <p className="max-w-2xl mx-auto text-sm text-[#6B7280] leading-relaxed mb-8 text-center">{ev.timings.intro}</p>
          )}
          <div className="overflow-x-auto rounded-2xl border border-[#16A34A]/12 bg-white">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#16A34A]/12 bg-[#F0FDF4]">
                  <th className="px-5 py-3 font-bold text-[#166534]">Who</th>
                  <th className="px-5 py-3 font-bold text-[#166534]">Hours</th>
                  <th className="px-5 py-3 font-bold text-[#166534]">What it means for your transport</th>
                </tr>
              </thead>
              <tbody>
                {ev.timings.rows.map((r) => (
                  <tr key={r.who} className="border-b border-[#16A34A]/10 last:border-0">
                    <td className="px-5 py-3 font-semibold whitespace-nowrap">{r.who}</td>
                    <td className="px-5 py-3 whitespace-nowrap">{r.hours}</td>
                    <td className="px-5 py-3 text-[#6B7280] leading-relaxed">{r.meaning}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {ev.timings.closingLine && (
            <p className="max-w-2xl mx-auto text-sm text-[#1C1C1C] font-medium leading-relaxed mt-6 text-center">{ev.timings.closingLine}</p>
          )}
          {ev.timings.sourceHref && ev.timings.sourceLabel && (
            <p className="text-center text-xs text-[#6B7280] mt-4">
              Hours per the{" "}
              <a href={ev.timings.sourceHref} target="_blank" rel="noopener noreferrer" className="text-[#16A34A] font-semibold hover:underline">
                {ev.timings.sourceLabel}
              </a>.
            </p>
          )}
        </section>
      )}

      {/* SERVICES */}
      <section className="section-container max-w-5xl py-16 border-t border-[#C9A84C]/10">
        <h2 className="font-heading text-2xl md:text-3xl font-bold mb-8 text-center">How we handle your event transport</h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {ev.services.map((s) => (
            <div key={s.title} className="rounded-2xl border border-[#16A34A]/12 bg-white p-6">
              <h3 className="font-bold text-sm mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#C9A84C]" /> {s.title}
              </h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
        {ev.servicesImage && (
          <figure className="mt-8 overflow-hidden rounded-3xl border border-[#C9A84C]/20 shadow-sm">
            <Image
              src={ev.servicesImage.src}
              alt={ev.servicesImage.alt}
              width={1200}
              height={655}
              sizes="(max-width: 768px) 100vw, 1000px"
              className="w-full h-auto"
            />
          </figure>
        )}
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={`/airports/${ev.airport.slug}`} className="inline-flex items-center gap-2 rounded-full border border-[#16A34A]/25 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#16A34A] hover:bg-[#16A34A]/10 transition-all">
            <MapPin className="h-3.5 w-3.5" /> {ev.airport.label} transfers
          </Link>
          {(ev.city === "Riyadh" || ev.city === "Jeddah") && (
            <Link href={`/locations/${ev.city.toLowerCase()}`} className="inline-flex items-center gap-2 rounded-full border border-[#16A34A]/25 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#16A34A] hover:bg-[#16A34A]/10 transition-all">
              <MapPin className="h-3.5 w-3.5" /> {ev.city} taxi &amp; transfers
            </Link>
          )}
          <Link href="/services/corporate" className="inline-flex items-center gap-2 rounded-full border border-[#C9A84C]/25 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#C9A84C] hover:bg-[#C9A84C]/10 transition-all">
            <ArrowRight className="h-3.5 w-3.5" /> Corporate accounts
          </Link>
          <Link href="/services/vip-transportation" className="inline-flex items-center gap-2 rounded-full border border-[#C9A84C]/25 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#C9A84C] hover:bg-[#C9A84C]/10 transition-all">
            <ArrowRight className="h-3.5 w-3.5" /> VIP transportation
          </Link>
        </div>
      </section>

      {/* VENUE COVERAGE TABLE (pillar asset) */}
      {ev.venueTable && (
        <section className="section-container max-w-5xl py-16 border-t border-[#C9A84C]/10">
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-3 text-center">{ev.venueTable.heading}</h2>
          {ev.venueTable.intro && (
            <p className="max-w-2xl mx-auto text-sm text-[#6B7280] leading-relaxed mb-8 text-center">{ev.venueTable.intro}</p>
          )}
          {ev.venueTable.image && (
            <figure className="mb-8 overflow-hidden rounded-3xl border border-[#C9A84C]/20 shadow-sm">
              <Image
                src={ev.venueTable.image.src}
                alt={ev.venueTable.image.alt}
                width={1200}
                height={655}
                sizes="(max-width: 768px) 100vw, 1000px"
                className="w-full h-auto"
              />
            </figure>
          )}
          <div className="overflow-x-auto rounded-2xl border border-[#16A34A]/12 bg-white">
            <table className="w-full text-left text-sm min-w-[640px]">
              <thead>
                <tr className="border-b border-[#16A34A]/12 bg-[#F0FDF4]">
                  <th className="px-5 py-3 font-bold text-[#166534]">Venue</th>
                  <th className="px-5 py-3 font-bold text-[#166534]">District</th>
                  <th className="px-5 py-3 font-bold text-[#166534]">Access &amp; parking</th>
                  <th className="px-5 py-3 font-bold text-[#166534]">Best transport setup</th>
                </tr>
              </thead>
              <tbody>
                {ev.venueTable.rows.map((r) => (
                  <tr key={r.venue} className="border-b border-[#16A34A]/10 last:border-0 align-top">
                    <td className="px-5 py-3 font-semibold">{r.venue}</td>
                    <td className="px-5 py-3 text-[#6B7280] whitespace-nowrap">{r.district}</td>
                    <td className="px-5 py-3 text-[#6B7280] leading-relaxed">{r.access}</td>
                    <td className="px-5 py-3 text-[#6B7280] leading-relaxed">{r.setup}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {ev.venueTable.closing && (
            <p className="max-w-3xl mx-auto text-sm text-[#1C1C1C] leading-relaxed mt-6">{ev.venueTable.closing}</p>
          )}
          {/* Mid-page CTA */}
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#16A34A] px-7 py-3.5 text-xs font-bold uppercase text-white hover:bg-[#15803D] transition-all shadow-[0_4px_20px_rgba(22,163,74,0.3)]"
            >
              <MessageCircle className="h-4 w-4" /> {ev.waCtaLabel ?? "Get Event Transport on WhatsApp"}
            </a>
            <a
              href={contactConfig.primaryPhoneLink}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#C9A84C]/40 px-7 py-3.5 text-xs font-bold uppercase text-[#16A34A] hover:bg-[#C9A84C]/10 transition-all"
            >
              Call {contactConfig.primaryPhoneDisplay}
            </a>
          </div>
        </section>
      )}

      {/* COMMERCIAL OPTIONS (named events only) */}
      {ev.optionsSection && (
        <section className="section-container max-w-5xl py-16 border-t border-[#C9A84C]/10">
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-3 text-center">{ev.optionsSection.heading}</h2>
          <p className="max-w-2xl mx-auto text-sm text-[#6B7280] leading-relaxed mb-8 text-center">{ev.optionsSection.intro}</p>
          <div className="grid sm:grid-cols-2 gap-6">
            {ev.optionsSection.items.map((s) => (
              <div key={s.title} className="rounded-2xl border border-[#16A34A]/12 bg-white p-6">
                <h3 className="font-bold text-sm mb-2 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#C9A84C]" /> {s.title}
                </h3>
                <p className="text-sm text-[#6B7280] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
          {ev.optionsSection.links && ev.optionsSection.links.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-3">
              {ev.optionsSection.links.map((l) => (
                <Link key={l.href} href={l.href} className="inline-flex items-center gap-2 rounded-full border border-[#16A34A]/25 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#16A34A] hover:bg-[#16A34A]/10 transition-all">
                  <ArrowRight className="h-3.5 w-3.5" /> {l.label}
                </Link>
              ))}
            </div>
          )}
        </section>
      )}

      {/* BOOKING / TRUST STRIP (confirmed policy + internal links only) */}
      {ev.trustStrip && (
        <section className="section-container max-w-4xl py-12 border-t border-[#C9A84C]/10">
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-6 text-center">{ev.trustStrip.heading}</h2>
          <ul className="max-w-2xl mx-auto space-y-3 mb-8">
            {ev.trustStrip.items.map((it) => (
              <li key={it} className="flex gap-3 text-sm text-[#1C1C1C]">
                <CheckCircle2 className="h-5 w-5 text-[#16A34A] shrink-0 mt-0.5" />
                <span className="leading-relaxed">{it}</span>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap justify-center gap-3">
            {ev.trustStrip.links.map((l) => (
              <Link key={l.href} href={l.href} className="inline-flex items-center gap-2 rounded-full border border-[#16A34A]/25 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#16A34A] hover:bg-[#16A34A]/10 transition-all">
                <ArrowRight className="h-3.5 w-3.5" /> {l.label}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="section-container max-w-4xl py-16 border-t border-[#C9A84C]/10">
        <h2 className="font-heading text-2xl md:text-3xl font-bold mb-10 text-center">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {ev.faqs.map((f) => (
            <div key={f.question} className="bg-white border border-[#16A34A]/12 rounded-2xl p-6">
              <h3 className="font-bold text-sm mb-2">{f.question}</h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">{f.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* RELATED */}
      {ev.relatedOverride ? (
        <section className="section-container max-w-5xl py-12 border-t border-[#C9A84C]/10">
          <h2 className="font-heading text-xl font-bold mb-6">{ev.relatedOverride.heading}</h2>
          <div className="space-y-6">
            {ev.relatedOverride.groups.map((g) => (
              <div key={g.label}>
                <p className="text-[0.65rem] font-bold uppercase tracking-wider text-[#6B7280] mb-3">{g.label}</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {g.links.map((l) => (
                    <Link key={l.href} href={l.href} className="group flex items-center justify-between rounded-2xl border border-[#16A34A]/12 bg-white px-5 py-4 hover:border-[#16A34A]/35 transition-all">
                      <span className="text-sm font-semibold">{l.label}</span>
                      <ArrowRight className="h-4 w-4 text-[#C9A84C] shrink-0 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="section-container max-w-5xl py-12 border-t border-[#C9A84C]/10">
          <h2 className="font-heading text-xl font-bold mb-6">Other event transport in Saudi Arabia</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {related.map((r) => (
              <Link key={r.slug} href={`/events/${r.slug}`} className="group flex items-center justify-between rounded-2xl border border-[#16A34A]/12 bg-white px-5 py-4 hover:border-[#16A34A]/35 transition-all">
                <span className="text-sm font-semibold">{r.h1}</span>
                <ArrowRight className="h-4 w-4 text-[#C9A84C] shrink-0 group-hover:translate-x-1 transition-transform" />
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
