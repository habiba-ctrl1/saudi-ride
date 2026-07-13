import type { Metadata } from "next";
import { generateMetadata as seo } from "@/lib/seo";

export const metadata: Metadata = seo({
  title: "Frequently Asked Questions — Booking, Fares & Umrah",
  description:
    "Answers to common questions about booking a taxi in Saudi Arabia — fixed fares, airport transfers, Umrah transport, WhatsApp booking, payment, wait times and cities covered.",
  path: "/faq",
});

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return children;
}
