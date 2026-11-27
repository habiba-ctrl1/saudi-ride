import type { Metadata } from "next";
import { generateMetadata as seo } from "@/lib/seo";
import { RelatedGuides } from "@/components/blog/RelatedGuides";

export const metadata: Metadata = seo({
  title: "Taxi Fleet for Hire — Sedans, SUVs, Vans & Buses",
  description:
    // 2026-11-28: "our fleet" removed (CLAUDE.md §14 partner-network wording).
    "Vehicles through our partner network — executive sedans, full-size SUVs, vans and coasters, from Toyota Camry to Mercedes S-Class. Fixed fare on WhatsApp.",
  path: "/fleet",
});

export default function FleetLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <RelatedGuides />
    </>
  );
}
