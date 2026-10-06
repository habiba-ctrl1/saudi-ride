import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { generateMetadata as seo } from "@/lib/seo";
import { AlulaChildPageAr } from "@/components/ar/AlulaArabic";
import { AR_ALULA_PAGES } from "@/lib/data/alula-cluster-ar";

export const dynamicParams = false;
export const revalidate = 86400;

export function generateStaticParams() {
  return Object.keys(AR_ALULA_PAGES).map((subarea) => ({ subarea }));
}

export async function generateMetadata({ params }: { params: Promise<{ subarea: string }> }): Promise<Metadata> {
  const { subarea } = await params;
  const page = AR_ALULA_PAGES[subarea];
  if (!page) return {};
  return seo({
    title: page.title,
    description: page.metaDescription,
    path: `/ar/locations/alula/${subarea}`,
    locale: "ar",
    image: "https://taxisaudiarabia.com/locations/alula-og.webp",
    hreflangPaths: { en: `/locations/alula/${subarea}`, ar: `/ar/locations/alula/${subarea}` },
  });
}

export default async function ArabicAlulaChildPage({ params }: { params: Promise<{ subarea: string }> }) {
  const { subarea } = await params;
  const page = AR_ALULA_PAGES[subarea];
  if (!page) notFound();
  return <AlulaChildPageAr page={page} />;
}
