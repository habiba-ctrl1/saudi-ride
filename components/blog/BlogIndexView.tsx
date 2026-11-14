import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock } from "lucide-react";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  BLOG_CATEGORIES,
  BLOG_CATEGORY_AR,
  BLOG_POSTS,
  BLOG_POSTS_AR,
  getPost,
  readingMinutes,
  type BlogCategory,
} from "@/lib/data/blog";
import type { BlogCardData } from "./BlogCard";
import { BlogGrid } from "./BlogGrid";
import { BLOG_STRINGS, formatDate, type BlogLocale } from "./strings";

const DOMAIN = "https://taxisaudiarabia.com";

/** Card data for either locale (Arabic falls back to the English post's image/category). */
export function cardsFor(locale: BlogLocale): (BlogCardData & { featured?: boolean })[] {
  const s = BLOG_STRINGS[locale];
  if (locale === "en") {
    return BLOG_POSTS.map((p) => ({
      href: `/blog/${p.slug}`,
      title: p.title,
      excerpt: p.excerpt,
      categoryKey: p.category,
      categoryLabel: p.category,
      image: p.coverImage,
      alt: p.coverAlt,
      dateLabel: formatDate(p.updatedAt ?? p.publishedAt, "en"),
      readLabel: s.readTime(readingMinutes(p.content)),
      featured: p.featured,
    }));
  }
  return BLOG_POSTS_AR.map((a) => {
    const en = getPost(a.slug)!;
    return {
      href: `/ar/blog/${a.slug}`,
      title: a.title,
      excerpt: a.excerpt,
      categoryKey: en.category,
      categoryLabel: BLOG_CATEGORY_AR[en.category],
      image: en.coverImage,
      alt: a.coverAlt,
      dateLabel: formatDate(a.updatedAt ?? a.publishedAt, "ar"),
      readLabel: s.readTime(readingMinutes(a.content, "ar")),
      featured: en.featured,
    };
  });
}

export function BlogIndexView({ locale }: { locale: BlogLocale }) {
  const s = BLOG_STRINGS[locale];
  const ar = locale === "ar";
  const base = ar ? "/ar/blog" : "/blog";
  const cards = cardsFor(locale);
  const featured = cards.find((c) => c.featured) ?? cards[0];
  const rest = cards.filter((c) => c !== featured);

  const categories = BLOG_CATEGORIES.map((key: BlogCategory) => ({
    key,
    label: ar ? BLOG_CATEGORY_AR[key] : key,
    count: rest.filter((c) => c.categoryKey === key).length,
  })).filter((c) => c.count > 0);

  return (
    <div className="min-h-screen bg-[#FAFAF7] pb-20 text-[#0F172A]" dir={ar ? "rtl" : undefined} lang={ar ? "ar" : undefined}>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: s.indexH1,
          description: s.indexLead,
          url: `${DOMAIN}${base}`,
          inLanguage: ar ? "ar" : "en",
          mainEntity: {
            "@type": "ItemList",
            itemListElement: cards.map((c, i) => ({ "@type": "ListItem", position: i + 1, url: `${DOMAIN}${c.href}`, name: c.title })),
          },
        }}
      />
      <Breadcrumbs
        items={[
          { name: s.home, href: ar ? "/ar" : "/" },
          { name: s.blog, href: base },
        ]}
      />

      {/* Hero: value proposition + the featured guide side by side */}
      <section className="section-container max-w-7xl pb-12 pt-6 md:pb-16">
        <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <span className="t-eyebrow">{s.eyebrow}</span>
            <h1 className="mt-3 font-heading text-[clamp(2rem,4.4vw,3.4rem)] font-bold leading-[1.08] tracking-tight">{s.indexH1}</h1>
            <p className="mt-5 max-w-xl text-[1.02rem] leading-relaxed text-[#475569]">{s.indexLead}</p>
            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-[#334155]">
              {s.indexFacts.map((f) => (
                <li key={f} className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-[#16A34A]" aria-hidden /> {f}
                </li>
              ))}
            </ul>
          </div>

          {featured && (
            <article className="group relative overflow-hidden rounded-3xl border border-[#0F172A]/[0.07] bg-white shadow-[0_24px_60px_-36px_rgba(15,23,42,0.45)]">
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image
                  src={featured.image}
                  alt={featured.alt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
                <span className="absolute start-4 top-4 rounded-full bg-[#FACC15] px-3 py-1 text-[0.7rem] font-bold uppercase tracking-wide text-[#0F172A]">
                  {s.featured}
                </span>
              </div>
              <div className="p-6 md:p-7">
                <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#15803D]">{featured.categoryLabel}</span>
                <h2 className="mt-2 font-heading text-[clamp(1.25rem,2vw,1.6rem)] font-bold leading-snug group-hover:text-[#15803D]">
                  <Link href={featured.href} className="after:absolute after:inset-0 after:content-['']">
                    {featured.title}
                  </Link>
                </h2>
                <p className="mt-3 line-clamp-2 text-[0.95rem] leading-relaxed text-[#64748B]">{featured.excerpt}</p>
                <div className="mt-4 flex items-center justify-between text-xs font-medium text-[#64748B]">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-[#16A34A]" aria-hidden /> {featured.readLabel} · {featured.dateLabel}
                  </span>
                  <span className="inline-flex items-center gap-1 font-semibold text-[#15803D]" aria-hidden>
                    {s.readArticle} <ArrowRight className="h-3.5 w-3.5 rtl:-scale-x-100" />
                  </span>
                </div>
              </div>
            </article>
          )}
        </div>
      </section>

      <section className="section-container max-w-7xl" aria-labelledby="all-guides">
        <h2 id="all-guides" className="mb-5 font-heading text-xl font-bold">
          {s.backToBlog} <span className="text-base font-medium text-[#94A3B8]">({rest.length})</span>
        </h2>
        <BlogGrid posts={rest} categories={categories} allLabel={s.all} readLabel={s.readArticle} emptyLabel={s.noPosts} />
      </section>

      <section className="section-container mt-16 max-w-7xl">
        <div className="flex flex-col items-start justify-between gap-5 rounded-3xl bg-[#0F2A1C] px-6 py-8 text-white md:flex-row md:items-center md:px-10">
          <div>
            <h2 className="font-heading text-xl font-bold md:text-2xl">{s.indexCtaHeading}</h2>
            <p className="mt-1.5 text-sm text-white/75">{s.indexCtaText}</p>
          </div>
          <Link href={ar ? "/ar/book" : "/book"} className="btn btn-accent shrink-0">
            {s.indexCtaButton} <ArrowRight className="h-4 w-4 rtl:-scale-x-100" />
          </Link>
        </div>
      </section>
    </div>
  );
}
