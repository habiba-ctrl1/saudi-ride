import type { Metadata } from "next";
import { generateMetadata as seo } from "@/lib/seo";
import { CorporateAr, AR_CORP } from "@/components/ar/CorporateArabic";

export const revalidate = 86400;

export const metadata: Metadata = seo({
  title: AR_CORP.title,
  description: AR_CORP.metaDescription,
  path: "/ar/services/corporate",
  locale: "ar",
  image: "https://taxisaudiarabia.com/services/corporate-hero.webp",
  hreflangPaths: { en: "/services/corporate", ar: "/ar/services/corporate" },
});

export default function ArabicCorporatePage() {
  return <CorporateAr />;
}
