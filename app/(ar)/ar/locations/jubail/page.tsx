import type { Metadata } from "next";
import { generateMetadata as seo } from "@/lib/seo";
import { RegionalHubAr } from "@/components/ar/RegionalHubAr";
import { AR_JUBAIL_HUB } from "@/lib/data/regional-hubs-ar";

export const revalidate = 86400;

// Added 2026-11-22 (seo/sprint4-arabic-plan.md). EN pair: /locations/jubail.
export const metadata: Metadata = seo({
  title: AR_JUBAIL_HUB.title,
  description: AR_JUBAIL_HUB.metaDescription,
  path: "/ar/locations/jubail",
  locale: "ar",
  image: "https://taxisaudiarabia.com/opengraph-image",
  hreflangPaths: { en: "/locations/jubail", ar: "/ar/locations/jubail" },
});

export default function ArabicJubailHubPage() {
  return <RegionalHubAr c={AR_JUBAIL_HUB} />;
}
