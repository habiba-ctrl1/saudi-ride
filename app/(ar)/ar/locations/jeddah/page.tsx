import type { Metadata } from "next";
import { generateMetadata as seo } from "@/lib/seo";
import { JeddahHubAr } from "@/components/ar/JeddahArabic";
import { AR_JEDDAH_HUB } from "@/lib/data/jeddah-cluster-ar";

export const revalidate = 86400;

export const metadata: Metadata = seo({
  title: AR_JEDDAH_HUB.title,
  description: AR_JEDDAH_HUB.metaDescription,
  path: "/ar/locations/jeddah",
  locale: "ar",
  image: "https://taxisaudiarabia.com/locations/jeddah-og.webp",
  hreflangPaths: { en: "/locations/jeddah", ar: "/ar/locations/jeddah" },
});

export default function ArabicJeddahHubPage() {
  return <JeddahHubAr />;
}
