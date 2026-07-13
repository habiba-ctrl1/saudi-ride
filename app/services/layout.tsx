import type { Metadata } from "next";
import { generateMetadata as seo } from "@/lib/seo";

export const metadata: Metadata = seo({
  title: "Taxi & Transfer Services in Saudi Arabia",
  description:
    "Explore our taxi and transfer services in Saudi Arabia — airport transfers, Umrah transport, Makkah & Madinah Ziyarat, intercity rides, corporate travel, and GCC cross-border trips. Fixed prices, licensed drivers, 24/7.",
  path: "/services",
});

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
