import type { Metadata } from "next";
import { generateMetadata as seo } from "@/lib/seo";
import { RegionalHubAr } from "@/components/ar/RegionalHubAr";
import { AR_DAMMAM_HUB } from "@/lib/data/regional-hubs-ar";

export const revalidate = 86400;

// Added 2026-11-22 (seo/sprint4-arabic-plan.md). EN pair: /locations/dammam.
export const metadata: Metadata = seo({
  title: AR_DAMMAM_HUB.title,
  description: AR_DAMMAM_HUB.metaDescription,
  path: "/ar/locations/dammam",
  locale: "ar",
  image: "https://taxisaudiarabia.com/opengraph-image",
  hreflangPaths: { en: "/locations/dammam", ar: "/ar/locations/dammam" },
});

export default function ArabicDammamHubPage() {
  return <RegionalHubAr c={AR_DAMMAM_HUB} />;
}
