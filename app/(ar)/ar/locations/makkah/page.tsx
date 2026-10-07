import type { Metadata } from "next";
import { generateMetadata as seo } from "@/lib/seo";
import { MakkahHubAr } from "@/components/ar/MakkahArabic";
import { AR_MAKKAH_HUB } from "@/lib/data/makkah-cluster-ar";

export const revalidate = 86400;

export const metadata: Metadata = seo({
  title: AR_MAKKAH_HUB.title,
  description: AR_MAKKAH_HUB.metaDescription,
  path: "/ar/locations/makkah",
  locale: "ar",
  image: "https://taxisaudiarabia.com/locations/makkah-og.webp",
  hreflangPaths: { en: "/locations/makkah", ar: "/ar/locations/makkah" },
});

export default function ArabicMakkahHubPage() {
  return <MakkahHubAr />;
}
