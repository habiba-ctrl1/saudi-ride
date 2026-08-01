import type { Metadata } from "next";
import { generateMetadata as seo } from "@/lib/seo";

export const metadata: Metadata = seo({
  title: "Saudi Arabia Travel & Umrah Taxi Guides",
  description:
    "Practical travel guides for Saudi Arabia — Umrah Miqat & Ihram, airport transfers, SIM cards, & currency advice for pilgrims, tourists & visitors.",
  path: "/guides",
});

export default function GuidesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
