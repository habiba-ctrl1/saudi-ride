import type { Metadata } from "next";
import { generateMetadata as seo } from "@/lib/seo";

export const metadata: Metadata = seo({
  title: "Taxi Fleet for Hire — Sedans, SUVs, Vans & Buses",
  description:
    "Hire from our Saudi Arabia taxi fleet: Toyota Camry, GMC Yukon XL, Hyundai Staria, Toyota Hiace, Mercedes S-Class and more. Fixed prices for airport transfers, Umrah and intercity rides. Available 24/7.",
  path: "/fleet",
});

export default function FleetLayout({ children }: { children: React.ReactNode }) {
  return children;
}
