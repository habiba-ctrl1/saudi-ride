import type { Metadata } from "next";
import { generateMetadata as seo } from "@/lib/seo";

export const metadata: Metadata = seo({
  title: "Terms & Conditions",
  description:
    "Read the terms and conditions for booking taxi, airport transfer, Umrah and intercity services with Taxi Saudi Arabia, including reservations, fares, cancellations and operational rules.",
  path: "/terms-conditions",
});

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
