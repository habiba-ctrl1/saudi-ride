import type { Metadata } from "next";
import { generateMetadata as seo } from "@/lib/seo";

export const metadata: Metadata = seo({
  title: "Fleet Gallery — Luxury Taxis & Chauffeur Cars",
  description:
    "Browse the Taxi Saudi Arabia gallery — luxury sedans, SUVs, family vans and buses used for airport transfers, Umrah transport and intercity rides across the Kingdom.",
  path: "/gallery",
});

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
