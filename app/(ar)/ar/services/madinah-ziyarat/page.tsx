import type { Metadata } from "next";
import { generateMetadata as seo } from "@/lib/seo";
import { MadinahZiyaratAr } from "@/components/ar/MadinahArabic";
import { AR_MED_ZIYARAT } from "@/lib/data/madinah-cluster-ar";

export const revalidate = 86400;

// Added 2026-11-28 (Batch 4). EN pair: /services/madinah-ziyarat.
export const metadata: Metadata = seo({
  title: AR_MED_ZIYARAT.title,
  description: AR_MED_ZIYARAT.metaDescription,
  path: "/ar/services/madinah-ziyarat",
  locale: "ar",
  image: "https://taxisaudiarabia.com/locations/madinah-og.webp",
  hreflangPaths: { en: "/services/madinah-ziyarat", ar: "/ar/services/madinah-ziyarat" },
});

export default function ArabicMadinahZiyaratPage() {
  return <MadinahZiyaratAr />;
}
