import type { Metadata } from "next";
import { generateMetadata as seo } from "@/lib/seo";

export const metadata: Metadata = seo({
  title: "Taxi Fares & Fixed Prices in Saudi Arabia 2026",
  description:
    "Fixed 2026 taxi fares in Saudi Arabia — airport transfers, Umrah routes, and intercity rides by vehicle type. No surge pricing, no hidden fees.",
  path: "/pricing",
  hreflangPaths: { en: "/pricing", ar: "/ar/pricing" },
});

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
