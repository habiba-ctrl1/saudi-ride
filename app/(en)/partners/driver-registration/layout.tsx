import type { Metadata } from "next";
import { generateMetadata as seo } from "@/lib/seo";

export const metadata: Metadata = seo({
  title: "Chauffeur Partner Registration",
  description:
    "Register as a chauffeur partner with Taxi Saudi Arabia and start receiving pre-booked airport, Umrah and intercity trips.",
  path: "/partners/driver-registration",
  noIndex: true,
});

export default function DriverRegistrationLayout({ children }: { children: React.ReactNode }) {
  return children;
}
