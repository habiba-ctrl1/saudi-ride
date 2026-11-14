import type { Metadata } from "next";
import { generateMetadata as seo } from "@/lib/seo";

export const metadata: Metadata = seo({
  title: "About Us — Professional Drivers & Private Taxis",
  description:
    "Taxi Saudi Arabia offers 24/7 airport transfers, Umrah transport & intercity rides across Riyadh, Jeddah, Makkah & Madinah. Professional drivers, clear fares confirmed on WhatsApp.",
  path: "/about",
  hreflangPaths: { en: "/about", ar: "/ar/about" },
});

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
