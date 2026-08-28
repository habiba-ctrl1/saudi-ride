import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { generateMetadata as seo } from "@/lib/seo";
import { ArabicRoutePage } from "@/components/ar/ArabicRoutePage";
import { AR_ROUTE_CONTENT, AR_ROUTE_CONTENT_SLUGS } from "@/lib/data/routes-content-ar";

// Only the slugs with bespoke Arabic content are pre-rendered; any other
// /ar/routes/* is 301'd to English by middleware before it reaches here.
export const dynamicParams = false;
export const revalidate = 86400; // static + daily refresh, matching the English route page

export function generateStaticParams() {
  return AR_ROUTE_CONTENT_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = AR_ROUTE_CONTENT[slug];
  if (!entry) return {};
  return seo({
    title: entry.metaTitle,
    description: entry.metaDescription,
    path: `/ar/routes/${slug}`,
    locale: "ar",
    hreflangPaths: { en: `/routes/${slug}`, ar: `/ar/routes/${slug}` },
  });
}

export default async function ArabicRouteSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = AR_ROUTE_CONTENT[slug];
  if (!entry) notFound();
  // metaTitle/metaDescription are for <head> only; strip them from the render props.
  const { metaTitle: _t, metaDescription: _d, ...content } = entry;
  void _t;
  void _d;
  return <ArabicRoutePage content={{ slug, ...content }} />;
}
