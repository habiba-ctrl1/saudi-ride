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
  };
}

export default async function EventPage({ params }: PageProps) {
  const { slug } = await params;
  const ev = getEvent(slug);
  if (!ev) notFound();

  const waLink = `https://wa.me/${contactConfig.whatsappNumber}?text=${encodeURIComponent(
    `Salam, I need ${ev.waContext}. My dates, group size and pickup are:`,
  )}`;

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
              sizes="(max-width: 1024px) 100vw, 1024px"
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
            <MessageCircle className="h-4 w-4" /> Get Event Transport on WhatsApp
          </a>
          <a
            href={contactConfig.primaryPhoneLink}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-[#C9A84C]/40 px-8 py-4 text-xs font-bold uppercase text-[#16A34A] hover:bg-[#C9A84C]/10 transition-all"
          >
            Call {contactConfig.primaryPhoneDisplay}
          </a>
        </div>
      </section>

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
    </div>
  );
}
