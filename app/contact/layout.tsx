import type { Metadata } from "next";
import { generateMetadata as seo } from "@/lib/seo";

export const metadata: Metadata = seo({
  title: "Contact & 24/7 Booking Desk",
  description:
    "Contact Taxi Saudi Arabia for airport transfers, Umrah transport and intercity rides. Reach our 24/7 booking desk by phone, WhatsApp or email for instant fixed-price taxi quotes across Saudi Arabia.",
  path: "/contact",
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
