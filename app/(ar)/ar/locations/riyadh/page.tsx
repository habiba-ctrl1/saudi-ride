import type { Metadata } from "next";
import { generateMetadata as seo } from "@/lib/seo";
import { RegionalHubAr } from "@/components/ar/RegionalHubAr";
import { AR_RIYADH_HUB } from "@/lib/data/regional-hubs-ar";

export const revalidate = 86400;

// Added 2026-11-27 (seo/MASTER-SEO-STRATEGY.md, Batch 2). EN pair: /locations/riyadh.
export const metadata: Metadata = seo({
  title: AR_RIYADH_HUB.title,
  description: AR_RIYADH_HUB.metaDescription,
  path: "/ar/locations/riyadh",
  locale: "ar",
  image: "https://taxisaudiarabia.com/locations/riyadh-og.webp",
  hreflangPaths: { en: "/locations/riyadh", ar: "/ar/locations/riyadh" },
});

export default function ArabicRiyadhHubPage() {
  return <RegionalHubAr c={AR_RIYADH_HUB} />;
}
