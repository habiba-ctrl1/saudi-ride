import type { Metadata } from "next";
import { generateMetadata as seo } from "@/lib/seo";

export const metadata: Metadata = seo({
  title: "About Us — Licensed Drivers & Fixed-Price Taxis",
  description:
    "Learn about Taxi Saudi Arabia — a trusted taxi and chauffeur service with licensed drivers, fixed prices, and 24/7 airport, Umrah and intercity transfers across Riyadh, Jeddah, Makkah, Madinah and Dammam.",
  path: "/about",
});

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
