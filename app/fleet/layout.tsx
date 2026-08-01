import type { Metadata } from "next";
import { generateMetadata as seo } from "@/lib/seo";

export const metadata: Metadata = seo({
  title: "Taxi Fleet for Hire — Sedans, SUVs, Vans & Buses",
  description:
    "Browse our Saudi Arabia taxi fleet: GMC Yukon XL, Hyundai Staria, Toyota Camry, & Mercedes S-Class. Fixed prices for airport, Umrah & intercity transfers 24/7.",
  path: "/fleet",
});

export default function FleetLayout({ children }: { children: React.ReactNode }) {
  return children;
}
