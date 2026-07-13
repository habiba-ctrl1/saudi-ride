import type { Metadata } from "next";
import { generateMetadata as seo } from "@/lib/seo";

export const metadata: Metadata = seo({
  title: "Saudi Arabia Travel & Umrah Taxi Guides",
  description:
    "Practical travel guides for Saudi Arabia — Umrah Miqat and Ihram, Jeddah Airport to Makkah transfers, SIM cards, currency and more. Written for pilgrims, tourists and business travelers.",
  path: "/guides",
});

export default function GuidesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
