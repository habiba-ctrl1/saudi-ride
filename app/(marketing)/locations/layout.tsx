import type { Metadata } from "next";
import { generateMetadata as seo } from "@/lib/seo";

export const metadata: Metadata = seo({
  title: "Taxi Service by City Across Saudi Arabia",
  description:
    "Book a taxi in any Saudi city — Riyadh, Jeddah, Makkah, Madinah, Dammam, Taif, AlUla, Abha, Yanbu, Al Khobar and more. Airport transfers, Umrah rides and intercity trips at fixed prices.",
  path: "/locations",
});

export default function LocationsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
