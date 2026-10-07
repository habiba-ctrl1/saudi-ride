import type { Metadata } from "next";
import { generateMetadata as seo } from "@/lib/seo";
import { MakkahZiyaratAr } from "@/components/ar/MakkahArabic";
import { AR_ZIYARAT } from "@/lib/data/makkah-cluster-ar";

export const revalidate = 86400;

export const metadata: Metadata = seo({
  title: AR_ZIYARAT.title,
  description: AR_ZIYARAT.metaDescription,
  path: "/ar/services/makkah-ziyarat",
  locale: "ar",
  image: "https://taxisaudiarabia.com/locations/makkah-og.webp",
  hreflangPaths: { en: "/services/makkah-ziyarat", ar: "/ar/services/makkah-ziyarat" },
});

export default function ArabicMakkahZiyaratPage() {
  return <MakkahZiyaratAr />;
}
