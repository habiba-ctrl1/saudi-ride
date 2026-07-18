import { Metadata } from "next";
import { notFound } from "next/navigation";
import { GUIDES } from "@/lib/data/guides";
import { ChevronRight, Calendar, Clock, BookOpen, HelpCircle } from "lucide-react";
import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { articleSchema, breadcrumbSchema, faqSchema } from "@/lib/schema";
import { TLDRSummary } from "@/components/seo/TLDRSummary";

export const revalidate = 86400;

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

  return {
    title: `${guide.title} | Taxi Saudi Arabia`,
    description: guide.summary,
    alternates: {
      canonical: `https://taxisaudiarabia.com/guides/${slug}`,
    },
    openGraph: {
      title: `${guide.title} | Taxi Saudi Arabia`,
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
            <span className="flex items-center gap-1.5 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-[#B8963B]">
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
          </div>
        </div>
      </section>

      {/* ─── CONTENT ────────────────────────────────────────────────────── */}
      <section className="section-container max-w-3xl py-16">
        {/* Quick Answer (above-the-fold AI/snippet signal) */}
        {guide.tldr && (
          <TLDRSummary answer={guide.tldr} facts={guide.tldrFacts} className="mb-12" />
        )}
        <div className="prose prose-invert prose-p:leading-relaxed prose-p:text-[#6B7280] prose-li:text-[#6B7280] prose-headings:font-heading prose-headings:text-[#1C1C1C] prose-a:text-[#C9A84C] max-w-none">
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

        {/* CTA */}
        <div className="mt-16 p-8 rounded-3xl bg-white border border-[#16A34A]/15 shadow-lg text-center">
          <BookOpen className="h-8 w-8 text-[#C9A84C] mx-auto mb-4" />
          <h3 className="font-heading text-2xl font-bold mb-3">Ready to plan your journey?</h3>
          <p className="text-[#6B7280] text-sm mb-8 max-w-md mx-auto">
            Book your fixed-price, premium transfer with Taxi Saudi Arabia and enjoy a stress-free travel experience across the Kingdom.
          </p>
          <Link
            href="/book"
            className="inline-flex items-center gap-2 rounded-full bg-[#16A34A] px-8 py-3.5 text-xs font-bold uppercase text-white hover:bg-[#15803D] transition-all"
          >
            Book a Transfer
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
