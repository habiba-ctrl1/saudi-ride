import type { Metadata } from "next";
import { generateMetadata as seo } from "@/lib/seo";
import { RegionalHubAr } from "@/components/ar/RegionalHubAr";
import { AR_YANBU_HUB } from "@/lib/data/regional-hubs-ar";

export const revalidate = 86400;

// Added 2026-11-22 (seo/sprint4-arabic-plan.md). EN pair: /locations/yanbu.
export const metadata: Metadata = seo({
  title: AR_YANBU_HUB.title,
  description: AR_YANBU_HUB.metaDescription,
  path: "/ar/locations/yanbu",
  locale: "ar",
  image: "https://taxisaudiarabia.com/opengraph-image",
  hreflangPaths: { en: "/locations/yanbu", ar: "/ar/locations/yanbu" },
});

export default function ArabicYanbuHubPage() {
  return <RegionalHubAr c={AR_YANBU_HUB} />;
}
