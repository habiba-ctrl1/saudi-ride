export const revalidate = 86400;

import { Metadata } from "next";
import { DriverJobsHubBody } from "@/components/seo/DriverJobsHubBody";

const TITLE = "Taxi Driver Jobs in Saudi Arabia | Apply Today — Taxi Saudi Arabia";
const DESCRIPTION =
  "Taxi driver jobs across Saudi Arabia — everyday airport, city and intercity rides. Flexible hours, transparent fares and weekly payouts. Apply by city.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "https://taxisaudiarabia.com/taxi-driver-jobs" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://taxisaudiarabia.com/taxi-driver-jobs",
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

export default function TaxiDriverJobsHubPage() {
  return <DriverJobsHubBody variantKey="taxi-driver-jobs" />;
}
