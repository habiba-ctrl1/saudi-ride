import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Globe, MessageSquare, Mail, ShieldCheck, Users, Car, Info } from "lucide-react";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { TLDRSummary } from "@/components/seo/TLDRSummary";
import WhatsAppQuoteForm from "@/components/booking/WhatsAppQuoteForm";
import { BorderJourney } from "@/components/cross-border/BorderJourney";
import { CorridorRouteCards } from "@/components/cross-border/CorridorRouteCards";
import { CrossBorderEssentials } from "@/components/cross-border/CrossBorderEssentials";
import { TripModes } from "@/components/cross-border/TripModes";
import { contactConfig } from "@/lib/config/contact";
import { serviceSchema, faqSchema, itemListSchema, speakableSchema } from "@/lib/schema";
import {
  CORRIDORS,
  CORRIDOR_SLUGS,
  corridorRoutes,
  corridorWhatsAppText,
  corridorRfqMailto,
  type CorridorSlug,
} from "@/lib/data/cross-border";

// Country/corridor hubs: /cross-border/saudi-to-<country>. One page per
// country covers BOTH directions (no separate reverse hubs — they would be
// near-duplicates). Content: lib/data/cross-border.ts. Added 2026-10-03.
const BASE = "https://taxisaudiarabia.com";

export function generateStaticParams() {
  return CORRIDOR_SLUGS.map((corridor) => ({ corridor }));
}
export const dynamicParams = false;

type Props = { params: Promise<{ corridor: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { corridor } = await params;
  const c = CORRIDORS[corridor as CorridorSlug];
  if (!c) return {};
  const url = `${BASE}/cross-border/${c.slug}`;
  const image = `${BASE}/gallery/highway-travel.webp`;
  return {
    title: c.title,
    description: c.description,
    alternates: { canonical: url },
    openGraph: { title: c.title, description: c.description, url, type: "website", images: [{ url: image, alt: "Private car with driver on a long-distance highway" }] },
    twitter: { card: "summary_large_image", title: c.title, description: c.description, images: [image] },
  };
}

export default async function CorridorPage({ params }: Props) {
  const { corridor } = await params;
  const c = CORRIDORS[corridor as CorridorSlug];
  if (!c) notFound();

  const { outbound, inbound } = corridorRoutes(c);
  const all = [...outbound, ...inbound];
  const shortest = [...outbound].sort((a, b) => a.distance - b.distance)[0];
  const path = `/cross-border/${c.slug}`;
  const waHref = `https://wa.me/${contactConfig.whatsappNumber}?text=${encodeURIComponent(corridorWhatsAppText(c))}`;
  const others = CORRIDOR_SLUGS.filter((s) => s !== c.slug).map((s) => CORRIDORS[s]);

  return (
    <div className="min-h-screen bg-[#FAFAF7] pb-24 text-[#1C1C1C]">
      <JsonLd
        data={[
          serviceSchema({
            name: `${c.pairLabel.replace("↔", "–")} private cross-border transfer`,
            description: c.description,
            path,
            serviceType: "Private cross-border transfer",
            areaServed: ["Saudi Arabia", c.country === "UAE" ? "United Arab Emirates" : c.country],
          }),
          itemListSchema(all.map((r) => ({ name: `${r.fromCity} to ${r.toCity}`, href: `/routes/${r.slug}` }))),
          faqSchema(c.faqs),
          speakableSchema({ path }),
        ]}
      />
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Border Crossings", href: "/services/border-crossings" },
          { name: c.pairLabel.replace("↔", "–"), href: path },
        ]}
      />

      {/* ─── HERO ─── */}
      <section className="section-container max-w-5xl pt-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#16A34A] via-[#15803D] to-[#116B32] p-7 sm:p-10">
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 sm:block">
            <Image src="/gallery/highway-travel.webp" alt="Private car with driver on a long-distance highway" fill priority sizes="(max-width: 640px) 0vw, 50vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#16A34A] via-[#16A34A]/70 to-transparent" />
          </div>
          <div className="relative z-10 max-w-xl space-y-5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FACC15]/40 bg-[#FACC15]/15 px-3.5 py-1 text-[0.65rem] font-bold uppercase tracking-widest text-[#FACC15]">
              <Globe className="h-3.5 w-3.5" aria-hidden /> {c.pairLabel}
            </span>
            <h1 className="font-heading text-3xl font-extrabold leading-tight tracking-tight text-[#FFFFFF] sm:text-4xl">{c.h1}</h1>
            <p className="text-sm leading-relaxed text-[#FFFFFF]/85 sm:text-base">
              Pre-booked private car with a professional driver, door to door across {c.crossingName}. One fixed fare in writing before you book.
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <a href="#corridor-quote" className="btn btn-accent btn-lg">
                Request a Cross-Border Quote <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
              <a href={waHref} target="_blank" rel="noopener noreferrer" className="btn btn-glass btn-lg">
                <MessageSquare className="h-4 w-4" aria-hidden /> Check availability on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="section-container mt-10 max-w-5xl space-y-12">
        {/* ─── QUICK ANSWER ─── */}
        <TLDRSummary
          answer={c.quickAnswer}
          facts={[
            { label: "Border", value: `${c.saudiSide.split(" (")[0]} – ${c.otherSide.split(" (")[0]}` },
            ...(shortest ? [{ label: "Shortest route", value: `${shortest.fromCity}: ~${shortest.distance} km` }] : []),
            { label: "Routes", value: `${all.length} bookable` },
            { label: "Fare", value: "Fixed, in writing" },
          ]}
        />

        {/* ─── ROUTES ─── */}
        <section aria-labelledby="xb-routes" className="space-y-6">
          <div>
            <span className="t-eyebrow">Routes</span>
            <h2 id="xb-routes" className="font-heading mt-1 text-2xl font-bold sm:text-3xl">
              {c.pairLabel.replace("↔", "–")} private transfer routes
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#6B7280]">
              Distances and drive times exclude time at the border, which varies with traffic and checks. Each route page has its own details, FAQs and quote form.
            </p>
          </div>
          <CorridorRouteCards heading={`Saudi Arabia to ${c.country}`} routes={outbound} />
          <CorridorRouteCards heading={`${c.country} to Saudi Arabia`} routes={inbound} />
        </section>

        {/* ─── OVERVIEW ─── */}
        <section aria-labelledby="xb-overview" className="rounded-3xl border border-[#16A34A]/15 bg-white p-6 sm:p-8">
          <h2 id="xb-overview" className="font-heading text-2xl font-bold">Who this corridor serves and where we pick up</h2>
          <div className="mt-4 space-y-4 text-[0.95rem] leading-relaxed text-[#475569]" style={{ maxWidth: "70ch" }}>
            {c.overview.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </section>

        {/* ─── JOURNEY + CROSSING ─── */}
        <BorderJourney eyebrow="Border crossing" heading={`What happens at ${c.crossingName}`} stages={c.journey} />
        <div className="flex gap-3 rounded-2xl border border-[#16A34A]/20 bg-[#F0FDF4] p-4 text-sm leading-relaxed text-[#166534]">
          <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          <p>{c.crossingNote} Border processing time is never guaranteed.</p>
        </div>

        {/* ─── PRACTICAL GUIDANCE ─── */}
        <section aria-labelledby="xb-practical">
          <h2 id="xb-practical" className="font-heading text-2xl font-bold">Practical notes for {c.country} trips</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {c.practical.map((p) => (
              <div key={p.title} className="rounded-2xl border border-[#16A34A]/12 bg-white p-5">
                <h3 className="font-semibold text-[#1C1C1C]">{p.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-[#6B7280]">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── USE CASES + VEHICLES ─── */}
        <section aria-labelledby="xb-who" className="grid gap-5 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 id="xb-who" className="font-heading flex items-center gap-2 text-2xl font-bold">
              <Users className="h-5 w-5 text-[#16A34A]" aria-hidden /> Who books this transfer
            </h2>
            <ul className="mt-4 space-y-3">
              {c.useCases.map((u) => (
                <li key={u.title} className="rounded-2xl border border-[#16A34A]/12 bg-white p-4 text-sm leading-relaxed text-[#475569]">
                  <span className="font-semibold text-[#1C1C1C]">{u.title}.</span> {u.desc}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-[#16A34A]/15 bg-white p-6">
            <h2 className="font-heading flex items-center gap-2 text-xl font-bold">
              <Car className="h-5 w-5 text-[#16A34A]" aria-hidden /> Vehicle options
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-[#475569]">
              <li><span className="font-semibold text-[#1C1C1C]">Executive sedan</span> — up to 3 passengers</li>
              <li><span className="font-semibold text-[#1C1C1C]">Full-size SUV</span> — families, more luggage</li>
              <li><span className="font-semibold text-[#1C1C1C]">Van</span> — groups and heavy luggage</li>
              <li><span className="font-semibold text-[#1C1C1C]">Coaster</span> — delegations, on request</li>
            </ul>
            <p className="mt-3 text-xs leading-relaxed text-[#6B7280]">Vehicles come from our vetted partner network; the car for your date is confirmed as eligible to cross before we quote.</p>
            <Link href="/fleet" className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-[#16A34A] hover:underline">
              See vehicle categories <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>
        </section>

        {c.tradeOff && (
          <section aria-labelledby="xb-tradeoff" className="rounded-3xl border border-[#16A34A]/15 bg-white p-6 sm:p-8">
            <h2 id="xb-tradeoff" className="font-heading text-2xl font-bold">{c.tradeOff.heading}</h2>
            <div className="mt-4 space-y-3 text-[0.95rem] leading-relaxed text-[#475569]" style={{ maxWidth: "70ch" }}>
              {c.tradeOff.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </section>
        )}

        {c.borderDrop && <TripModes destination={c.country} crossing="the border" />}

        <CrossBorderEssentials />

        {/* ─── FAQ ─── */}
        <section aria-labelledby="xb-faq">
          <h2 id="xb-faq" className="font-heading text-2xl font-bold">{c.country} cross-border transfer questions</h2>
          <div className="mt-5 space-y-3">
            {c.faqs.map((f) => (
              <details key={f.question} className="group rounded-2xl border border-[#16A34A]/12 bg-white p-5 open:border-[#16A34A]/35">
                <summary className="cursor-pointer list-none font-semibold text-[#1C1C1C] marker:hidden">
                  <h3 className="inline">{f.question}</h3>
                </summary>
                <p className="mt-2 text-sm leading-relaxed text-[#475569]">{f.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ─── BOOKING (Path A + Path B) ─── */}
        <section id="corridor-quote" aria-labelledby="xb-quote" className="scroll-mt-24 rounded-3xl border border-[#16A34A]/20 bg-[#F0FDF4] p-5 sm:p-8">
          <div className="mx-auto mb-6 max-w-2xl text-center">
            <h2 id="xb-quote" className="font-heading text-2xl font-bold sm:text-3xl">Plan your private transfer to {c.country}</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">
              Tell us the route and date. We confirm an eligible vehicle and send one fixed fare on WhatsApp. Passengers carry their own valid travel documents.
            </p>
          </div>
          <WhatsAppQuoteForm
            defaultDropoff={c.country === "UAE" ? "UAE" : c.country}
            pickupPlaceholder="Pickup city & address — e.g. Al Khobar, hotel name"
            dropoffPlaceholder={`Destination in ${c.country} — city & address`}
            messageIntro={`Hello, I'd like a quote for a private cross-border transfer between Saudi Arabia and ${c.country}.`}
            showNotes
            submitLabel="Request a Cross-Border Quote"
          />
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a href={corridorRfqMailto(contactConfig.email, c)} className="btn btn-secondary btn-lg">
              <Mail className="h-4 w-4" aria-hidden /> Email a corporate RFQ
            </a>
            <p className="max-w-xs text-center text-xs leading-relaxed text-[#6B7280] sm:text-left">
              Written quotes for companies and delegations. Corporate invoicing can be arranged through our sister company.
            </p>
          </div>
        </section>

        {/* ─── RELATED ─── */}
        <section aria-labelledby="xb-related" className="grid gap-6 md:grid-cols-2">
          <div>
            <h2 id="xb-related" className="font-heading text-xl font-bold">Related pages</h2>
            <ul className="mt-3 space-y-2">
              {c.related.map((r) => (
                <li key={r.href}>
                  <Link href={r.href} className="inline-flex items-center gap-1 text-sm font-semibold text-[#16A34A] hover:underline">
                    {r.label} <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-heading text-xl font-bold">Other cross-border corridors</h2>
            <ul className="mt-3 space-y-2">
              {others.map((o) => (
                <li key={o.slug}>
                  <Link href={`/cross-border/${o.slug}`} className="inline-flex items-center gap-1 text-sm font-semibold text-[#16A34A] hover:underline">
                    Saudi Arabia to {o.country} via {o.crossingName.replace(/^the /, "")} <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/services/border-crossings" className="inline-flex items-center gap-1 text-sm font-semibold text-[#16A34A] hover:underline">
                  <ShieldCheck className="h-3.5 w-3.5" aria-hidden /> How our cross-border service works
                </Link>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
