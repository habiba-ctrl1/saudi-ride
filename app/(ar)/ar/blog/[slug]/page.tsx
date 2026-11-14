import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AR_BLOG_SLUGS, getPost, getPostAr } from "@/lib/data/blog";
import { ArticleView } from "@/components/blog/ArticleView";
import { articleMetadata } from "@/components/blog/meta";

// Only slugs with a real Arabic article are pre-rendered; any other
// /ar/blog/* is 301'd to English by middleware before it reaches here.
export const revalidate = 86400;
export const dynamicParams = false;

export function generateStaticParams() {
  return AR_BLOG_SLUGS.map((slug) => ({ slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  const ar = getPostAr(slug);
  if (!post || !ar) return {};
  return articleMetadata(post, ar);
}

export default async function ArabicBlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPost(slug);
  const ar = getPostAr(slug);
  if (!post || !ar) notFound();
  return <ArticleView post={post} ar={ar} />;
}
