import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, Calendar, ChevronRight, User } from "lucide-react";
import { BLOG_POSTS_DATA } from "@/lib/data/blog-posts";

const TITLE = "Taxi Saudi Arabia Blog | Travel Tips, News & Guides";
const DESCRIPTION = "Read the latest news, travel tips, and guides for Umrah pilgrims, business travelers, and tourists in Saudi Arabia.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "https://taxisaudiarabia.com/blog",
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://taxisaudiarabia.com/blog",
    siteName: "Taxi Saudi Arabia",
    images: [{ url: "https://taxisaudiarabia.com/opengraph-image", width: 1200, height: 630, alt: TITLE }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function BlogIndexPage() {
  const publishedPosts = BLOG_POSTS_DATA.filter((post) => post.published)
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#1C1C1C] pb-24">
      {/* ─── HERO ───────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-32 pb-20 border-b border-[#C9A84C]/10 bg-white">
        <div className="absolute inset-0 bg-gradient-to-b from-[#C9A84C]/6 to-transparent pointer-events-none" />

        <div className="section-container relative z-10 max-w-5xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/8 px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#16A34A] mb-6">
            <BookOpen className="h-3 w-3" /> Our Blog
          </span>
          <h1 className="font-heading text-4xl font-bold leading-tight md:text-6xl mb-6">
            Saudi Arabia Travel Tips<br />
            <span className="text-[#16A34A]">& Taxi Guides</span>
          </h1>
          <p className="max-w-2xl text-sm md:text-base leading-relaxed text-[#6B7280]">
            Simple, helpful guides on taxi prices, airport pickups, Umrah travel, and getting around Saudi Arabia by car. Updated regularly by the Taxi Saudi Arabia team.
          </p>
        </div>
      </section>

      {/* ─── BLOG GRID ──────────────────────────────────────────────────── */}
      {/* Editorial layout: newest post as a wide featured story, the rest as
          a card grid. Same links, same order. */}
      <section className="section-container max-w-6xl py-14 md:py-20">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {publishedPosts.map((post, i) => {
            const featured = i === 0;
            return (
              <article
                key={post.slug}
                className={`card card-hover group flex overflow-hidden ${featured ? "flex-col md:col-span-2 lg:col-span-3 lg:flex-row" : "flex-col"}`}
              >
                <Link
                  href={`/blog/${post.slug}`}
                  className={`card-media no-lift relative block shrink-0 overflow-hidden ${featured ? "aspect-[16/9] lg:aspect-auto lg:w-[58%] lg:min-h-[22rem]" : "aspect-[16/10]"}`}
                >
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    sizes={featured ? "(max-width: 1024px) 100vw, 60vw" : "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"}
                    priority={featured}
                    className="object-cover"
                  />
                  <span className="absolute start-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-[#15803D] shadow-sm backdrop-blur">
                    {post.category}
                  </span>
                </Link>
                <div className={`flex flex-1 flex-col ${featured ? "p-6 md:p-8 lg:p-10 lg:justify-center" : "p-6"}`}>
                  {featured && <span className="t-eyebrow mb-3">Latest guide</span>}
                  <Link href={`/blog/${post.slug}`} className="block flex-1">
                    <h2 className={`font-heading font-bold leading-snug text-[#0F172A] transition-colors group-hover:text-[#15803D] ${featured ? "text-[clamp(1.4rem,2.4vw,2rem)] mb-4" : "text-lg mb-3"}`}>
                      {post.title}
                    </h2>
                    <p className={`leading-relaxed text-[#64748B] ${featured ? "text-[0.98rem] line-clamp-4 mb-6" : "text-sm line-clamp-3 mb-6"}`}>
                      {post.excerpt}
                    </p>
                  </Link>
                  <div className="mt-auto flex items-center justify-between border-t border-[#0F172A]/[0.06] pt-4">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-[#64748B]">
                      <span className="inline-flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-[#16A34A]" />
                        {post.author}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-[#16A34A]" />
                        {post.publishedAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    </div>
                    <Link
                      href={`/blog/${post.slug}`}
                      aria-label={`Read: ${post.title}`}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F0FDF4] text-[#16A34A] transition-colors group-hover:bg-[#16A34A] group-hover:text-[#FFFFFF]"
                    >
                      <ChevronRight className="h-4 w-4 rtl:-scale-x-100" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
