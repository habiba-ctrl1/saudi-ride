import type { Metadata } from "next";
import { generateMetadata as seo } from "@/lib/seo";

export const metadata: Metadata = seo({
  title: "Privacy Policy",
  description:
    "How Taxi Saudi Arabia collects, uses and protects your personal information when you book taxi, airport transfer and Umrah transport services. Read our full privacy policy.",
  path: "/privacy-policy",
});

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
