import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Calendar, User, ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { BLOG_POSTS_DATA } from "@/lib/data/blog-posts";
import { JsonLd } from "@/components/seo/JsonLd";
import { articleSchema, breadcrumbSchema } from "@/lib/schema";

export const revalidate = 86400;

// Contextual internal links derived from each post's title + content.
// Keeps every blog post linked into the topical cluster (routes / services /
// locations / airports) without hand-editing markdown bodies.
type InternalLink = { name: string; href: string };
function internalLinksFor(post: { title: string; content: string; slug: string }): InternalLink[] {
  const t = (post.title + " " + post.content).toLowerCase();
  const out: InternalLink[] = [];
  const add = (name: string, href: string) => {
    if (href !== `/blog/${post.slug}` && !out.some((l) => l.href === href)) out.push({ name, href });
  };
  const any = (...keys: string[]) => keys.some((k) => t.includes(k));
  const all = (...keys: string[]) => keys.every((k) => t.includes(k));

  // Routes (most specific first)
  if (any("jeddah airport to makkah") || all("jeddah", "makkah", "airport")) add("Jeddah Airport → Makkah taxi", "/routes/jeddah-airport-to-makkah");
  if (all("jeddah", "madinah")) add("Jeddah → Madinah taxi", "/routes/jeddah-to-madinah");
  if (any("makkah to madinah", "madinah to makkah")) add("Makkah ↔ Madinah taxi", "/routes/madinah-to-makkah");
  if (all("makkah", "taif")) add("Makkah → Taif taxi", "/routes/makkah-to-taif");

  // Airports
  if (any("jeddah airport", "king abdulaziz")) add("Jeddah Airport (JED) taxi", "/airports/king-abdulaziz-jeddah");
  if (any("madinah airport", "prince mohammad")) add("Madinah Airport (MED) taxi", "/airports/prince-mohammad-madinah");
  if (any("riyadh airport", "king khalid", "(ruh)")) add("Riyadh Airport (RUH) taxi", "/airports/king-khalid-riyadh");

  // Services
  if (any("umrah")) add("Umrah taxi service", "/services/umrah-transport");
  if (all("makkah", "ziyarat")) add("Makkah Ziyarat tour", "/services/makkah-ziyarat");
  if (all("madinah", "ziyarat")) add("Madinah Ziyarat tour", "/services/madinah-ziyarat");
  if (any("hajj")) add("Hajj transport service", "/services/hajj-transport");
  if (any("corporate", "business etiquette", "executive")) add("Corporate travel service", "/services/corporate");

  // Car recovery / towing cluster
  if (any("satha", "towing", "tow truck", "recovery", "سطحة")) {
    add("24/7 car recovery & satha service", "/services/car-recovery");
    if (any("riyadh")) add("Car recovery in Riyadh", "/services/car-recovery/riyadh");
    if (any("jeddah")) add("Car recovery in Jeddah", "/services/car-recovery/jeddah");
    if (any("dammam")) add("Car recovery in Dammam", "/services/car-recovery/dammam");
  }

  // Locations
  if (any("makkah", "mecca")) add("Taxi in Makkah", "/locations/makkah");
  if (any("madinah", "medina")) add("Taxi in Madinah", "/locations/madinah");
  if (any("jeddah")) add("Taxi in Jeddah", "/locations/jeddah");
  if (any("riyadh")) add("Taxi in Riyadh", "/locations/riyadh");
  if (any("alula", "al-ula", "hegra")) add("Taxi in AlUla", "/locations/alula");
  if (any("neom", "the line")) add("Taxi in NEOM", "/locations/neom");

  // Fares / pricing
  if (any("fare", "cost", "price", "how much")) add("Fares & pricing", "/pricing");

  // Evergreen
  add("See our cars & fleet", "/fleet");
  add("All taxi routes", "/routes");

  return out.slice(0, 6);
}

export function generateStaticParams() {
  return BLOG_POSTS_DATA.filter(post => post.published).map((post) => ({
    slug: post.slug,
  }));
}

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS_DATA.find((p) => p.slug === slug);

  if (!post || !post.published) return { title: "Post Not Found" };

  return {
    title: `${post.title} | Taxi Saudi Arabia Blog`,
    description: post.excerpt,
    alternates: {
      canonical: `https://taxisaudiarabia.com/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.coverImage }],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = BLOG_POSTS_DATA.find((p) => p.slug === slug);

  if (!post || !post.published) {
    notFound();
  }

  // Get related posts (just the latest 2 that are not this post)
  const relatedPosts = BLOG_POSTS_DATA
    .filter(p => p.published && p.slug !== slug)
    .slice(0, 2);

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8] pb-24">
      <JsonLd
        data={[
          articleSchema({
            type: "BlogPosting",
            headline: post.title,
            description: post.excerpt,
            image: post.coverImage,
            datePublished: post.publishedAt.toISOString(),
            author: post.author,
            path: `/blog/${slug}`,
          }),
          breadcrumbSchema([
            { name: "Home", href: "/" },
            { name: "Blog", href: "/blog" },
            { name: post.title, href: `/blog/${slug}` },
          ]),
        ]}
      />
      {/* ─── HERO ───────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 overflow-hidden border-b border-[#C9A84C]/10">
        <div className="absolute inset-0 z-0">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/90 to-[#0A0A0A]/60" />
        </div>

        <div className="section-container relative z-10 max-w-4xl">
          <Link href="/blog" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#A1A1A6] hover:text-[#C9A84C] transition-colors mb-8">
            <ArrowLeft className="h-4 w-4" /> Back to Blog
          </Link>
          
          <div className="mb-6">
            <span className="rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-[#C9A84C]">
              {post.category}
            </span>
          </div>

          <h1 className="font-heading text-3xl md:text-5xl font-bold leading-tight mb-8 text-[#F5F0E8]">
            {post.title}
          </h1>

          <div className="flex items-center gap-6 pt-6 border-t border-[#C9A84C]/10 text-xs text-[#7C8088] font-medium uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-[#C9A84C]" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#C9A84C]" />
              <span>{post.publishedAt.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CONTENT ────────────────────────────────────────────────────── */}
      <section className="section-container max-w-4xl py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12">
          
          <div className="prose prose-invert prose-p:leading-relaxed prose-p:text-[#A1A1A6] prose-headings:font-heading prose-headings:text-[#F5F0E8] prose-a:text-[#C9A84C] prose-strong:text-[#F5F0E8] prose-ul:text-[#A1A1A6] prose-ol:text-[#A1A1A6] prose-li:marker:text-[#C9A84C] max-w-none">
            <ReactMarkdown>{post.content}</ReactMarkdown>

            {/* Contextual internal links (topical cluster) */}
            {internalLinksFor(post).length > 0 && (
              <div className="mt-14 not-prose">
                <h2 className="font-heading text-xl font-bold mb-5 text-[#F5F0E8]">Related on Taxi Saudi Arabia</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {internalLinksFor(post).map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      className="group flex items-center justify-between gap-3 rounded-xl border border-[#C9A84C]/15 bg-[#111] px-4 py-3 hover:border-[#C9A84C]/40 transition-colors"
                    >
                      <span className="text-sm font-medium text-[#F5F0E8] group-hover:text-[#C9A84C]">{l.name}</span>
                      <ChevronRight className="h-4 w-4 text-[#C9A84C]" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* CTA inside article */}
            <div className="mt-16 p-8 rounded-3xl bg-[#111111] border border-[#C9A84C]/20 text-center not-prose">
              <h3 className="font-heading text-2xl font-bold mb-3 text-[#F5F0E8]">Book a Comfortable Ride</h3>
              <p className="text-[#A1A1A6] text-sm mb-8 max-w-md mx-auto">
                Going to a meeting or on Umrah? Our clean, air-conditioned cars with a professional driver get you there safely and on time, at a fixed price.
              </p>
              <Link
                href="/book"
                className="inline-flex items-center gap-2 rounded-full bg-[#C9A84C] px-8 py-3.5 text-xs font-bold uppercase text-[#0A0A0A] hover:bg-[#B8963B] transition-all"
              >
                Book Your Ride
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* SIDEBAR */}
          <aside className="space-y-8">
            <div className="bg-[#111111] border border-[#C9A84C]/15 rounded-3xl p-6">
              <h3 className="font-heading text-lg font-bold mb-6 text-[#F5F0E8]">Recent Posts</h3>
              <div className="space-y-6">
                {relatedPosts.map((related) => (
                  <Link key={related.slug} href={`/blog/${related.slug}`} className="group block">
                    <div className="relative h-32 rounded-xl overflow-hidden mb-3">
                      <Image
                        src={related.coverImage}
                        alt={related.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <h4 className="text-sm font-bold text-[#F5F0E8] group-hover:text-[#C9A84C] transition-colors line-clamp-2 leading-snug">
                      {related.title}
                    </h4>
                  </Link>
                ))}
              </div>
            </div>
          </aside>

        </div>
      </section>
    </main>
  );
}
