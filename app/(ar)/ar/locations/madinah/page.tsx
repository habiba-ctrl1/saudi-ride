import type { Metadata } from "next";
import { generateMetadata as seo } from "@/lib/seo";
import { MadinahHubAr } from "@/components/ar/MadinahArabic";
import { AR_MADINAH_HUB } from "@/lib/data/madinah-cluster-ar";

export const revalidate = 86400;

export const metadata: Metadata = seo({
  title: AR_MADINAH_HUB.title,
  description: AR_MADINAH_HUB.metaDescription,
  path: "/ar/locations/madinah",
  locale: "ar",
  image: "https://taxisaudiarabia.com/locations/madinah-og.webp",
  hreflangPaths: { en: "/locations/madinah", ar: "/ar/locations/madinah" },
});

export default function ArabicMadinahHubPage() {
  return <MadinahHubAr />;
}
