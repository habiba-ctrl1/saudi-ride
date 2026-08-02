export const revalidate = 86400;

import { Metadata } from "next";
import { DriverJobsHubBody } from "@/components/seo/DriverJobsHubBody";

const TITLE = "Taxi & Chauffeur Driver Jobs in Saudi Arabia | Apply by City — Taxi Saudi Arabia";
const DESCRIPTION =
  "Driver jobs across Saudi Arabia — Riyadh, Jeddah, Makkah, Madinah, Dammam and more. Steady pre-booked trips, flexible hours and weekly payouts. Apply by city.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "https://taxisaudiarabia.com/driver-jobs" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://taxisaudiarabia.com/driver-jobs",
    siteName: "Taxi Saudi Arabia",
    images: [{ url: "https://taxisaudiarabia.com/opengraph-image", width: 1200, height: 630, alt: TITLE }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function DriverJobsHubPage() {
  return <DriverJobsHubBody variantKey="driver-jobs" />;
}
