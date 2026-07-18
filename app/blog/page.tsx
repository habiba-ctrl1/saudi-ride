import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, Calendar, ChevronRight, User } from "lucide-react";
import { BLOG_POSTS_DATA } from "@/lib/data/blog-posts";

export const metadata: Metadata = {
  title: "Taxi Saudi Arabia Blog | Travel Tips, News & Guides",
  description: "Read the latest news, travel tips, and guides for Umrah pilgrims, business travelers, and tourists in Saudi Arabia.",
  alternates: {
    canonical: "https://taxisaudiarabia.com/blog",
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
          <span className="inline-flex items-center gap-2 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/8 px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#B8963B] mb-6">
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
      <section className="section-container max-w-5xl py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {publishedPosts.map((post) => (
            <article key={post.slug} className="group rounded-3xl border border-[#C9A84C]/12 bg-white overflow-hidden hover:border-[#C9A84C]/30 transition-all duration-300 flex flex-col">
              <Link href={`/blog/${post.slug}`} className="relative h-48 overflow-hidden">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <span className="rounded-full border border-[#C9A84C]/30 bg-black/60 backdrop-blur-md px-3 py-1 text-[0.6rem] font-bold uppercase tracking-wider text-[#B8963B]">
                    {post.category}
                  </span>
                </div>
              </Link>
              <div className="p-6 flex flex-col flex-1">
                <Link href={`/blog/${post.slug}`} className="block flex-1">
                  <h2 className="font-heading text-lg font-bold text-[#1C1C1C] leading-snug mb-3 group-hover:text-[#16A34A] transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-xs text-[#6B7280] leading-relaxed line-clamp-3 mb-6">
                    {post.excerpt}
                  </p>
                </Link>
                <div className="flex items-center justify-between pt-4 border-t border-[#C9A84C]/10 mt-auto">
                  <div className="flex flex-col gap-1.5 text-[0.6rem] text-[#6B7280] font-medium uppercase tracking-wider">
                    <div className="flex items-center gap-1.5">
                      <User className="h-3 w-3 text-[#C9A84C]" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3 w-3 text-[#C9A84C]" />
                      <span>{post.publishedAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                    </div>
                  </div>
                  <Link href={`/blog/${post.slug}`} className="flex h-8 w-8 items-center justify-center rounded-full bg-[#C9A84C]/10 text-[#C9A84C] group-hover:bg-[#16A34A] group-hover:text-white transition-colors">
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
