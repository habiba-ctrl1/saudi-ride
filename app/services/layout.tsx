import type { Metadata } from "next";
import { generateMetadata as seo } from "@/lib/seo";

export const metadata: Metadata = seo({
  title: "Taxi & Transfer Services in Saudi Arabia",
  description:
    "Private taxi & transfer services in Saudi Arabia — airport transfers, Umrah transport, Ziyarat tours, intercity rides & GCC trips. Fixed prices 24/7.",
  path: "/services",
});

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
