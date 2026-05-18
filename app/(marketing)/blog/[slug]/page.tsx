export const revalidate = 86400; // revalidate every 24 hours

import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Calendar, User, Clock, ChevronRight, Car, Share2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await db.blogPost.findUnique({ where: { slug } });

  if (!post) return { title: "Post Not Found" };

  return {
    title: `${post.title} | Riyadh Luxe Taxi Blog`,
    description: post.excerpt,
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      authors: [post.author],
      images: post.coverImage ? [{ url: post.coverImage }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [post.coverImage] : [],
    }
  };
}

// Helper to extract headings for TOC
function extractHeadings(markdown: string) {
  const matches = markdown.match(/^## (.*$)/gim);
  if (!matches) return [];
  return matches.map(match => {
    const title = match.replace(/^## /, "").trim();
    const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return { title, id };
  });
}

// Calculate rough read time (avg 200 words per min)
function calculateReadTime(text: string) {
  const words = text.split(/\s+/).length;
  const mins = Math.max(1, Math.ceil(words / 200));
  return `${mins} min read`;
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await db.blogPost.findUnique({ where: { slug } });

  if (!post) {
    notFound();
  }

  // Fetch related posts
  const relatedPosts = await db.blogPost.findMany({
    where: { 
      category: post.category,
      id: { not: post.id },
      published: true
    },
    take: 3,
  });

  const headings = extractHeadings(post.content);
  const readTime = calculateReadTime(post.content);

  // Schema Markup
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "image": post.coverImage ? [post.coverImage] : [],
    "datePublished": post.publishedAt?.toISOString(),
    "dateModified": post.updatedAt?.toISOString(),
    "author": [{
      "@type": "Person",
      "name": post.author,
    }],
    "publisher": {
      "@type": "Organization",
      "name": "Riyadh Luxe Taxi",
    },
    "description": post.excerpt,
  };

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8] pb-24">
      {/* Inject Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />

      {/* ─── HERO ─────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 overflow-hidden border-b border-[#C9A84C]/10">
        <div className="absolute inset-0 z-0">
          {post.coverImage && (
            <Image src={post.coverImage} alt={post.title} fill className="object-cover opacity-40" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/80 to-[#0A0A0A]/30" />
        </div>

        <div className="section-container relative z-10 max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 text-[0.65rem] font-bold uppercase tracking-wider text-[#7C8088] mb-6">
            <Link href="/" className="hover:text-[#C9A84C] transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/blog" className="hover:text-[#C9A84C] transition-colors">Blog</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-[#C9A84C]">{post.category}</span>
          </div>

          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-8">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-bold text-[#A1A1A6] uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-[#C9A84C]" />
              {post.author}
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#C9A84C]" />
              {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#C9A84C]" />
              {readTime}
            </div>
          </div>
        </div>
      </section>

      <div className="section-container max-w-6xl mx-auto mt-12 grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* ─── SIDEBAR (Table of Contents & Share) ──────────────── */}
        <aside className="lg:col-span-1 hidden lg:block">
          <div className="sticky top-[100px] space-y-8">
            {headings.length > 0 && (
              <div className="bg-[#111] border border-[#C9A84C]/15 rounded-3xl p-6">
                <h3 className="font-heading text-lg font-bold mb-4">Table of Contents</h3>
                <ul className="space-y-3">
                  {headings.map((h, i) => (
                    <li key={i}>
                      <a href={`#${h.id}`} className="text-sm text-[#A1A1A6] hover:text-[#C9A84C] transition-colors line-clamp-2">
                        {h.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-[#111] border border-[#C9A84C]/15 rounded-3xl p-6">
              <h3 className="font-heading text-sm uppercase tracking-wider font-bold mb-4 text-[#7C8088] flex items-center gap-2">
                <Share2 className="h-4 w-4" /> Share Article
              </h3>
              <div className="flex flex-col gap-3">
                <a 
                  href={`https://wa.me/?text=${encodeURIComponent(`${post.title} - Read more at https://riyadhluxetaxi.com/blog/${slug}`)}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-full border border-[#C9A84C]/30 py-2.5 text-xs font-bold uppercase tracking-wider text-[#C9A84C] hover:bg-[#C9A84C]/10 transition-all"
                >
                  WhatsApp
                </a>
                <a 
                  href={`https://twitter.com/intent/tweet?url=https://riyadhluxetaxi.com/blog/${slug}&text=${encodeURIComponent(post.title)}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-full border border-[#C9A84C]/30 py-2.5 text-xs font-bold uppercase tracking-wider text-[#C9A84C] hover:bg-[#C9A84C]/10 transition-all"
                >
                  Twitter / X
                </a>
              </div>
            </div>
          </div>
        </aside>

        {/* ─── MAIN ARTICLE CONTENT ───────────────────────────────── */}
        <article className="lg:col-span-3 prose prose-invert prose-lg max-w-none">
          {/* Add IDs to h2 for TOC linking */}
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h2: ({children, ...props}) => {
                const text = String(children);
                const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                return <h2 id={id} {...props} className="text-[#C9A84C] font-heading mt-12 mb-6 scroll-mt-24">{children}</h2>;
              },
              h3: ({children, ...props}) => <h3 {...props} className="text-[#F5F0E8] font-heading mt-8 mb-4">{children}</h3>,
              p: ({children, ...props}) => <p {...props} className="text-[#A1A1A6] leading-relaxed mb-6">{children}</p>,
              ul: ({children, ...props}) => <ul {...props} className="list-disc list-inside text-[#A1A1A6] mb-6 space-y-2 marker:text-[#C9A84C]">{children}</ul>,
              ol: ({children, ...props}) => <ol {...props} className="list-decimal list-inside text-[#A1A1A6] mb-6 space-y-2 marker:text-[#C9A84C]">{children}</ol>,
              strong: ({children, ...props}) => <strong {...props} className="text-[#F5F0E8] font-bold">{children}</strong>,
              a: ({children, ...props}) => <a {...props} className="text-[#C9A84C] hover:underline">{children}</a>,
            }}
          >
            {post.content}
          </ReactMarkdown>

          {/* Contextual CTA */}
          <div className="mt-16 bg-gradient-to-br from-[#1A1A1A] to-[#111] border border-[#C9A84C]/30 rounded-3xl p-8 md:p-12 text-center not-prose">
            <Car className="h-12 w-12 text-[#C9A84C] mx-auto mb-4" />
            <h3 className="font-heading text-2xl font-bold mb-3 text-[#F5F0E8]">
              Need Premium Transport for Your Journey?
            </h3>
            <p className="text-[#A1A1A6] mb-8 max-w-lg mx-auto">
              Whether you are traveling for Umrah, business, or leisure, our fleet of luxury vehicles and professional chauffeurs guarantee a perfect trip.
            </p>
            <Link
              href="/book"
              className="inline-flex items-center gap-2 rounded-full bg-[#C9A84C] px-8 py-4 text-xs font-bold uppercase text-[#0A0A0A] hover:bg-[#B8963B] transition-all shadow-[0_4px_20px_rgba(201,168,76,0.3)]"
            >
              Book Your Transfer Now
            </Link>
          </div>
        </article>
      </div>

      {/* ─── RELATED POSTS ──────────────────────────────────────── */}
      {relatedPosts.length > 0 && (
        <section className="section-container max-w-7xl mx-auto mt-24 border-t border-[#C9A84C]/10 pt-16">
          <h2 className="font-heading text-3xl font-bold mb-10">More from {post.category}</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {relatedPosts.map((relatedPost) => (
              <Link href={`/blog/${relatedPost.slug}`} key={relatedPost.id}>
                <div className="group flex flex-col h-full rounded-3xl border border-[#C9A84C]/12 bg-[#111] overflow-hidden hover:border-[#C9A84C]/40 transition-all duration-300">
                  <div className="relative h-48 w-full overflow-hidden">
                    {relatedPost.coverImage && (
                      <Image 
                        src={relatedPost.coverImage} 
                        alt={relatedPost.title} 
                        fill 
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <div className="flex flex-col flex-1 p-6">
                    <h3 className="font-heading text-lg font-bold text-[#F5F0E8] group-hover:text-[#C9A84C] transition-colors mb-2 line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-xs text-[#A1A1A6] leading-relaxed line-clamp-2">
                      {relatedPost.excerpt}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
