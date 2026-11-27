import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Clock, Lightbulb, ListTree, PenLine } from "lucide-react";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { articleSchema } from "@/lib/schema";
import {
  BLOG_AUTHOR,
  BLOG_AUTHOR_AR,
  BLOG_CATEGORY_AR,
  hasArabic,
  lastModified,
  readingMinutes,
  relatedPosts,
  tableOfContents,
  getPostAr,
  type BlogPost,
  type BlogPostAr,
} from "@/lib/data/blog";
import { autoLinksFor } from "@/lib/data/blog/links";
import { AR_AVAILABLE_ROUTES } from "@/lib/config/i18n";
import { BlogMarkdown } from "./BlogMarkdown";
import { BlogCta } from "./BlogCta";
import { BlogCard } from "./BlogCard";
import { BLOG_STRINGS, formatDate, type BlogLocale } from "./strings";

/** In Arabic articles, point internal links at the /ar page when one exists. */
function localizeForAr(href: string) {
  const [path, hash = ""] = href.split("#");
  const blog = path.match(/^\/blog\/([a-z0-9-]+)$/);
  if (blog && hasArabic(blog[1])) return `/ar${path}${hash ? `#${hash}` : ""}`;
  if (path === "/blog") return "/ar/blog";
  if (AR_AVAILABLE_ROUTES.includes(path)) return `/ar${path === "/" ? "" : path}${hash ? `#${hash}` : ""}`;
  return href;
}

export function ArticleView({ post, ar: arPost }: { post: BlogPost; ar?: BlogPostAr }) {
  const locale: BlogLocale = arPost ? "ar" : "en";
  const s = BLOG_STRINGS[locale];
  const isAr = locale === "ar";
  const base = isAr ? "/ar/blog" : "/blog";

  const title = arPost?.title ?? post.title;
  const excerpt = arPost?.excerpt ?? post.excerpt;
  const content = arPost?.content ?? post.content;
  const quickAnswer = arPost ? arPost.quickAnswer : post.quickAnswer;
  const published = arPost?.publishedAt ?? post.publishedAt;
  const updated = arPost ? arPost.updatedAt : post.updatedAt;
  const categoryLabel = isAr ? BLOG_CATEGORY_AR[post.category] : post.category;
  const author = isAr ? BLOG_AUTHOR_AR : BLOG_AUTHOR;
  const path = `${base}/${post.slug}`;
  const toc = tableOfContents(content);
  const minutes = readingMinutes(content, locale);
  const links = (isAr ? arPost?.links : undefined) ?? post.links ?? autoLinksFor(post);
  const localize = isAr ? localizeForAr : (h: string) => h;

  const related = relatedPosts(post, 3)
    .map((r) => {
      const rAr = isAr ? getPostAr(r.slug) : undefined;
      if (isAr && !rAr) return null;
      return {
        href: isAr ? `/ar/blog/${r.slug}` : `/blog/${r.slug}`,
        title: rAr?.title ?? r.title,
        excerpt: rAr?.excerpt ?? r.excerpt,
        categoryKey: r.category,
        categoryLabel: isAr ? BLOG_CATEGORY_AR[r.category] : r.category,
        image: r.coverImage,
        alt: rAr?.coverAlt ?? r.coverAlt,
        dateLabel: formatDate((rAr ?? r).updatedAt ?? (rAr ?? r).publishedAt, locale),
        readLabel: s.readTime(readingMinutes(rAr?.content ?? r.content, locale)),
      };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  return (
    <div className="min-h-screen bg-[#FAFAF7] pb-20 text-[#0F172A]" dir={isAr ? "rtl" : undefined} lang={isAr ? "ar" : undefined}>
      <JsonLd
        data={articleSchema({
          type: "BlogPosting",
          headline: title,
          description: excerpt,
          image: post.coverImage,
          datePublished: published,
          dateModified: lastModified({ publishedAt: published, updatedAt: updated }),
          author,
          path,
          section: categoryLabel,
          inLanguage: locale,
        })}
      />
      <Breadcrumbs
        items={[
          { name: s.home, href: isAr ? "/ar" : "/" },
          { name: s.blog, href: base },
          { name: title, href: path },
        ]}
      />

      {/* Header */}
      <header className="section-container max-w-5xl pb-8 pt-5">
        <Link
          href={`${base}#cat-${encodeURIComponent(post.category)}`}
          className="inline-flex rounded-full bg-[#16A34A]/[0.09] px-3 py-1 text-xs font-bold tracking-wide text-[#15803D] hover:bg-[#16A34A]/[0.16]"
        >
          {categoryLabel}
        </Link>
        <h1 className="mt-4 font-heading text-[clamp(1.9rem,4vw,3rem)] font-bold leading-[1.12] tracking-tight">{title}</h1>
        <p className="mt-4 max-w-3xl text-[1.05rem] leading-relaxed text-[#475569]">{excerpt}</p>
        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-[#0F172A]/[0.07] pt-5 text-[0.8rem] font-medium text-[#64748B]">
          <span className="inline-flex items-center gap-1.5">
            <PenLine className="h-4 w-4 text-[#16A34A]" aria-hidden />
            {s.by}{" "}
            <Link href={isAr ? "/ar/about" : "/about"} className="text-[#0F172A] hover:text-[#15803D]">
              {author}
            </Link>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4 text-[#16A34A]" aria-hidden />
            {s.published} <time dateTime={published}>{formatDate(published, locale)}</time>
          </span>
          {updated && updated > published && (
            <span className="inline-flex items-center gap-1.5">
              {s.updated} <time dateTime={updated}>{formatDate(updated, locale)}</time>
            </span>
          )}
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-[#16A34A]" aria-hidden />
            {s.readTime(minutes)}
          </span>
        </div>
      </header>

      <div className="section-container max-w-5xl">
        <div className="relative aspect-[16/9] overflow-hidden rounded-3xl bg-[#E8EFEA]">
          <Image
            src={post.coverImage}
            alt={arPost?.coverAlt ?? post.coverAlt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 1024px"
            className="object-cover"
          />
        </div>
      </div>

      {/* Body + sidebar */}
      <div className="section-container mt-10 max-w-6xl md:mt-12">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_17rem] lg:gap-14">
          <article className="min-w-0">
            {quickAnswer && (
              <div className="blog-quick">
                <p className="blog-quick-label">
                  <Lightbulb className="h-4 w-4" aria-hidden /> {s.quickAnswer}
                </p>
                <p className="blog-quick-text">{quickAnswer}</p>
              </div>
            )}

            {toc.length >= 3 && (
              <details className="blog-toc-mobile lg:hidden">
                <summary>
                  <ListTree className="h-4 w-4" aria-hidden /> {s.toc}
                </summary>
                <ol>
                  {toc.map((t) => (
                    <li key={t.id}>
                      <a href={`#${t.id}`}>{t.text}</a>
                    </li>
                  ))}
                </ol>
              </details>
            )}

            <div className="tsa-prose blog-prose prose prose-lg max-w-none">
              <BlogMarkdown content={content} localizeHref={localize} />
            </div>

            {links.length > 0 && (
              <section className="mt-14" aria-labelledby="plan-trip-h">
                <h2 id="plan-trip-h" className="font-heading text-xl font-bold">
                  {s.planTrip}
                </h2>
                <p className="mt-1 text-sm text-[#64748B]">{s.planTripLead}</p>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={localize(l.href)}
                        className="group flex min-h-12 items-center justify-between gap-3 rounded-xl border border-[#0F172A]/[0.08] bg-white px-4 py-3 text-sm font-semibold text-[#0F172A] transition-colors hover:border-[#16A34A]/40 hover:text-[#15803D]"
                      >
                        {l.label}
                        <ArrowRight className="h-4 w-4 shrink-0 text-[#16A34A] transition-transform group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <div className="mt-14">
              <BlogCta cta={arPost?.cta ?? (isAr ? { kind: post.cta?.kind } : post.cta)} title={title} locale={locale} />
            </div>
          </article>

          {toc.length >= 3 && (
            <aside className="hidden lg:block">
              <nav className="blog-toc sticky top-28" aria-label={s.toc}>
                <p className="blog-toc-title">{s.toc}</p>
                <ol>
                  {toc.map((t) => (
                    <li key={t.id}>
                      <a href={`#${t.id}`}>{t.text}</a>
                    </li>
                  ))}
                </ol>
              </nav>
            </aside>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="section-container mt-20 max-w-6xl" aria-labelledby="related-h">
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 id="related-h" className="font-heading text-2xl font-bold">
              {s.related}
            </h2>
            <Link href={base} className="text-sm font-semibold text-[#15803D] hover:underline">
              {s.backToBlog}
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <BlogCard key={r.href} post={r} readLabel={s.readArticle} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
