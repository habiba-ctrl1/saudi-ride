import type { Metadata } from "next";
import { generateMetadata as seo } from "@/lib/seo";

export const metadata: Metadata = seo({
  title: "Taxi Fares & Fixed Prices in Saudi Arabia 2026",
  description:
    "See fixed taxi fares in Saudi Arabia for 2026 — airport transfers, Umrah routes, and intercity rides by vehicle type. No surge pricing, no hidden fees. Get an instant price for any route.",
  path: "/pricing",
});

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
