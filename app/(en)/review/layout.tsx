import type { Metadata } from "next";
import { generateMetadata as seo } from "@/lib/seo";

// Private, per-ride link: never indexed.
export const metadata: Metadata = seo({
  title: "Review your trip",
  description: "Share feedback about your completed Taxi Saudi Arabia trip.",
  path: "/review",
  noIndex: true,
});

export default function ReviewLayout({ children }: { children: React.ReactNode }) {
  return children;
}
