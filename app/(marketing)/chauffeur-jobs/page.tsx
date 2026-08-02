export const revalidate = 86400;

import { Metadata } from "next";
import { DriverJobsHubBody } from "@/components/seo/DriverJobsHubBody";

const TITLE = "Chauffeur Jobs in Saudi Arabia | VIP & Corporate Driving — Taxi Saudi Arabia";
const DESCRIPTION =
  "Professional chauffeur jobs across Saudi Arabia — drive VIP, corporate and luxury-fleet clients. The premium earnings tier with steady bookings and weekly payouts. Apply by city.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "https://taxisaudiarabia.com/chauffeur-jobs" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://taxisaudiarabia.com/chauffeur-jobs",
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

export default function ChauffeurJobsHubPage() {
  return <DriverJobsHubBody variantKey="chauffeur-jobs" />;
}
