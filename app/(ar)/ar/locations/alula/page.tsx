import type { Metadata } from "next";
import { generateMetadata as seo } from "@/lib/seo";
import { AlulaHubAr } from "@/components/ar/AlulaArabic";
import { AR_ALULA_HUB } from "@/lib/data/alula-cluster-ar";

export const revalidate = 86400;

export const metadata: Metadata = seo({
  title: AR_ALULA_HUB.title,
  description: AR_ALULA_HUB.metaDescription,
  path: "/ar/locations/alula",
  locale: "ar",
  image: "https://taxisaudiarabia.com/locations/alula/alula-og-sandstone-road.webp",
  hreflangPaths: { en: "/locations/alula", ar: "/ar/locations/alula" },
});

export default function ArabicAlulaHubPage() {
  return <AlulaHubAr />;
}
