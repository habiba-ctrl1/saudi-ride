import { Metadata } from "next";
import { notFound } from "next/navigation";
import { GUIDES } from "@/lib/data/guides";
import { ChevronRight, Calendar, Clock, BookOpen, HelpCircle } from "lucide-react";
import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { articleSchema, breadcrumbSchema, faqSchema } from "@/lib/schema";
import { TLDRSummary } from "@/components/seo/TLDRSummary";
import { contactConfig } from "@/lib/config/contact";

export const revalidate = 86400;

// Related-reading links for guides whose topic also has a distinct-angle blog
// post — /guides pages currently have zero outbound cross-links, so topically
// overlapping /blog posts were invisible to each other. Scoped to the pairs
// with confirmed real overlap (2026-09-25 cannibalization audit) — not a
// blanket related-links system for every guide.
const RELATED_LINKS: Record<string, { href: string; label: string }[]> = {
  "jeddah-airport-sim-card": [
    { href: "/blog/buying-sim-cards-jeddah-airport-stc-mobily-zain", label: "STC vs Mobily vs Zain: a detailed operator comparison" },
  ],
  "makkah-to-madinah-transport-guide": [
    // Was /blog/makkah-to-madinah-taxi-journey-expectations — merged into this
    // guide (301, 2026-10-02); point at the reverse-direction route article instead.
    { href: "/blog/madinah-to-makkah-taxi-price-distance-time", label: "Madinah to Makkah by car: distance, time & Miqat stop" },
    { href: "/routes/makkah-to-madinah", label: "Book a Makkah to Madinah taxi" },
  ],
  // 2026-11-13 (Batch 5): 1,492 impressions at pos 7.6 with no link to the money pages it supports.
  "riyadh-to-bahrain-taxi-vs-train": [
    { href: "/routes/riyadh-to-manama", label: "Riyadh to Bahrain private car with driver" },
    { href: "/routes/manama-to-riyadh", label: "Bahrain to Riyadh private transfer" },
    { href: "/cross-border/saudi-to-bahrain", label: "Saudi Arabia to Bahrain by road: King Fahd Causeway guide" },
  ],
  // 2026-11-13: guide = what to see + seasons; the blog posts own "how to get there" and
  // "when to go"; the hub owns booking. Links make that split explicit and pass equity to money pages.
  "alula-transport-guide": [
    { href: "/locations/alula", label: "Private taxi and chauffeur service in AlUla" },
    { href: "/locations/alula/private-driver", label: "Hire a private driver in AlUla for a full sightseeing day" },
    { href: "/blog/alula-travel-guide-hegra-dadan-transport", label: "How to get to AlUla: airport, road and getting around" },
    { href: "/routes/madinah-to-alula", label: "Madinah to AlUla private transfer" },
    { href: "/airports/alula", label: "AlUla International Airport (ULH) private transfers" },
  ],
};

// Jeddah airport terminals guide (2026-11-16): the terminal layout changed in
// Sep-Oct 2026 (Terminal 4 opened), so the guide links the airport page, the two
// most-booked onward routes and the Miqat guide instead of repeating them.
RELATED_LINKS["jeddah-airport-guide"] = [
  { href: "/airports/king-abdulaziz-jeddah", label: "Jeddah Airport (JED) private transfers and meet & greet" },
  { href: "/routes/jeddah-airport-to-makkah", label: "Jeddah Airport to Makkah taxi" },
  { href: "/routes/jeddah-airport-to-madinah", label: "Jeddah Airport to Madinah private transfer" },
  { href: "/guides/jeddah-airport-to-makkah-guide", label: "How to get from Jeddah Airport to Makkah" },
  { href: "/guides/miqat-jeddah-makkah", label: "Miqat and Ihram when you arrive at Jeddah" },
  { href: "/guides/jeddah-airport-sim-card", label: "Buying a SIM card at Jeddah Airport" },
];

export function generateStaticParams() {
  return GUIDES.map((guide) => ({
    slug: guide.slug,
  }));
}

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = GUIDES.find((g) => g.slug === slug);

  if (!guide) return { title: "Guide Not Found" };

  const metaTitle = guide.metaTitle ?? guide.title;
  return {
    title: `${metaTitle} | Taxi Saudi Arabia`,
    description: guide.summary,
    alternates: {
      canonical: `https://taxisaudiarabia.com/guides/${slug}`,
    },
    openGraph: {
      title: `${metaTitle} | Taxi Saudi Arabia`,
      description: guide.summary,
    },
    twitter: {
      card: "summary_large_image",
      title: `${metaTitle} | Taxi Saudi Arabia`,
      description: guide.summary,
    },
  };
}

export default async function GuideSinglePage({ params }: PageProps) {
  const { slug } = await params;
  const guide = GUIDES.find((g) => g.slug === slug);

  if (!guide) {
    notFound();
  }

  const Icon = guide.icon;

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#1C1C1C] pb-24">
      <JsonLd
        data={[
          articleSchema({
            headline: guide.title,
            description: guide.summary,
            path: `/guides/${slug}`,
          }),
          breadcrumbSchema([
            { name: "Home", href: "/" },
            { name: "Guides", href: "/guides" },
            { name: guide.title, href: `/guides/${slug}` },
          ]),
          ...(guide.faqs && guide.faqs.length > 0 ? [faqSchema(guide.faqs)] : []),
        ]}
      />
      {/* ─── HERO ───────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-16 overflow-hidden border-b border-[#C9A84C]/10 bg-white">
        <div className="section-container relative z-10 max-w-3xl">
          <Link href="/guides" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#6B7280] hover:text-[#16A34A] transition-colors mb-8">
            <ChevronRight className="h-4 w-4 rotate-180" /> Back to Knowledge Base
          </Link>
          
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="flex items-center gap-1.5 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-[#16A34A]">
              <Icon className="h-3.5 w-3.5" />
              {guide.category}
            </span>
            {guide.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-[#16A34A]/15 bg-[#FAFAF7] px-2.5 py-1 text-[0.6rem] text-[#6B7280] font-medium uppercase tracking-wider">
                {tag}
              </span>
            ))}
          </div>

          <h1 className="font-heading text-3xl md:text-5xl font-bold leading-tight mb-3">
            {guide.title}
          </h1>
          <p className="text-[#C9A84C] text-sm tracking-widest font-bold mb-6">{guide.titleAr}</p>

          <p className="text-[#6B7280] text-lg leading-relaxed max-w-2xl">
            {guide.summary}
          </p>

          <div className="flex items-center gap-6 mt-8 pt-6 border-t border-[#C9A84C]/10 text-xs text-[#6B7280] font-medium uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#C9A84C]" />
              <span>{guide.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#C9A84C]" />
              <span>{guide.readTime} read</span>
            </div>
            {guide.updated && (
              <div className="flex items-center gap-2">
                <span>Checked {guide.updated}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─── CONTENT ────────────────────────────────────────────────────── */}
      <section className="section-container max-w-3xl py-16">
        {/* Quick Answer (above-the-fold AI/snippet signal) */}
        {guide.tldr && (
          <TLDRSummary answer={guide.tldr} facts={guide.tldrFacts} className="mb-12" />
        )}
        {guide.sections && guide.sections.length > 0 ? (
          <div className="space-y-14">
            {guide.sections.map((sec) => (
              <section key={sec.heading}>
                <h2 className="font-heading text-2xl font-bold mb-4 text-[#0F172A]">{sec.heading}</h2>
                {sec.body?.map((para, i) => (
                  <p key={i} className="mb-4 leading-[1.8] text-[#475569] max-w-[70ch]">{para}</p>
                ))}
                {sec.bullets && (
                  <ul className="mb-4 space-y-2 pl-5 list-disc marker:text-[#16A34A] text-[#475569] max-w-[70ch]">
                    {sec.bullets.map((b, i) => (
                      <li key={i} className="leading-relaxed">{b}</li>
                    ))}
                  </ul>
                )}
                {sec.table && (
                  <div className="overflow-x-auto rounded-2xl border border-[#16A34A]/12 bg-white">
                    {/* Below sm each row stacks into a labelled card so nothing needs sideways scrolling at 320-414px. */}
                    <table className="w-full text-left text-sm">
                      <thead className="hidden sm:table-header-group bg-[#FAFAF7] text-[#0F172A]">
                        <tr>
                          {sec.table.head.map((h) => (
                            <th key={h} className="px-4 py-3 font-bold">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="text-[#475569]">
                        {sec.table.rows.map((row, ri) => (
                          <tr key={ri} className="block sm:table-row border-t border-[#16A34A]/10 align-top first:border-t-0 py-2 sm:py-0">
                            {row.map((cell, ci) => (
                              <td key={ci} className={`block sm:table-cell px-4 py-1.5 sm:py-3 leading-relaxed ${ci === 0 ? "font-semibold text-[#0F172A]" : ""}`}>
                                {ci > 0 && <span className="sm:hidden block text-[0.65rem] font-bold uppercase tracking-wider text-[#16A34A]">{sec.table!.head[ci]}</span>}
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {sec.note && <p className="mt-3 text-xs text-[#6B7280] leading-relaxed max-w-[70ch]">{sec.note}</p>}
              </section>
            ))}
          </div>
        ) : (
        <div className="tsa-prose prose prose-lg mx-auto max-w-[70ch] prose-p:leading-[1.8] prose-p:text-[#475569] prose-li:text-[#475569] prose-li:marker:text-[#16A34A] prose-headings:font-heading prose-headings:tracking-tight prose-headings:text-[#0F172A] prose-strong:text-[#0F172A] prose-a:text-[#15803D] prose-td:text-[#475569] prose-th:text-[#0F172A]">
          <p className="text-sm font-bold uppercase tracking-widest text-[#C9A84C] mb-8">Key Insights</p>
          
          <ul className="space-y-8 list-none pl-0">
            {guide.content.map((point, i) => (
              <li key={i} className="flex items-start gap-4 p-6 rounded-2xl bg-white border border-[#C9A84C]/10">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/30 text-sm font-bold text-[#16A34A]">
                  {i + 1}
                </span>
                <p className="m-0 pt-1 leading-relaxed text-[#1C1C1C]">{point}</p>
              </li>
            ))}
          </ul>
        </div>
        )}

        {/* FAQs (FAQPage schema injected above) */}
        {guide.faqs && guide.faqs.length > 0 && (
          <div className="mt-16">
            <h2 className="font-heading text-2xl font-bold mb-6 flex items-center gap-3 text-[#1C1C1C]">
              <HelpCircle className="text-[#C9A84C]" />
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {guide.faqs.map((faq, i) => (
                <div key={i} className="border border-[#16A34A]/12 rounded-2xl p-6 bg-white">
                  <h3 className="font-bold text-base mb-2 text-[#1C1C1C]">{faq.question}</h3>
                  <p className="text-sm text-[#6B7280] leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related reading — cross-links to a topically distinct blog post/route, where one exists */}
        {RELATED_LINKS[slug] && RELATED_LINKS[slug].length > 0 && (
          <div className="mt-16">
            <h2 className="font-heading text-xl font-bold mb-4 text-[#1C1C1C]">Related Reading</h2>
            <div className="space-y-2">
              {RELATED_LINKS[slug].map((link, i) => (
                <Link
                  key={i}
                  href={link.href}
                  className="flex items-center gap-2 text-sm text-[#16A34A] font-medium hover:underline"
                >
                  <ChevronRight className="h-3.5 w-3.5 shrink-0" />
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 p-8 rounded-3xl bg-white border border-[#16A34A]/15 shadow-lg text-center">
          <BookOpen className="h-8 w-8 text-[#C9A84C] mx-auto mb-4" />
          <h3 className="font-heading text-2xl font-bold mb-3">{guide.cta?.heading ?? "Ready to plan your journey?"}</h3>
          <p className="text-[#6B7280] text-sm mb-8 max-w-md mx-auto">
            {guide.cta?.text ?? "Book your premium transfer with Taxi Saudi Arabia, price confirmed on WhatsApp, and enjoy a stress-free travel experience across the Kingdom."}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {guide.cta && (
              <a
                href={`https://wa.me/${contactConfig.whatsappNumber}?text=${encodeURIComponent(guide.cta.waText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-lg"
              >
                Get a quote on WhatsApp
              </a>
            )}
            <Link
              href="/book"
              className={guide.cta ? "btn btn-lg" : "btn btn-primary btn-lg"}
            >
              Book a Transfer
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
