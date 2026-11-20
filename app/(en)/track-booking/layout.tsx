import type { Metadata } from "next";
import { generateMetadata as seo } from "@/lib/seo";

export const metadata: Metadata = seo({
  title: "Track Your Booking",
  description:
    "Check the status of your Taxi Saudi Arabia booking and driver details.",
  path: "/track-booking",
  noIndex: true,
});

export default function TrackBookingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
