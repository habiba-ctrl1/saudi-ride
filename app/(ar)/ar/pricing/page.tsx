import type { Metadata } from "next";
import { generateMetadata as seo } from "@/lib/seo";
import PricingPage from "@/app/(en)/pricing/page";

export const metadata: Metadata = seo({
  title: "أسعار التاكسي الثابتة في السعودية 2026",
  description:
    "تعرف على أسعار التاكسي الثابتة في السعودية لعام 2026 — توصيل المطار، رحلات العمرة، والتنقل بين المدن حسب نوع السيارة. بدون زيادة مفاجئة أو رسوم خفية.",
  path: "/ar/pricing",
  locale: "ar",
  hreflangPaths: { en: "/pricing", ar: "/ar/pricing" },
});

export default PricingPage;
