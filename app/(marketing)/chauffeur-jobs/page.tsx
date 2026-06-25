export const revalidate = 86400;

import { Metadata } from "next";
import { DriverJobsHubBody } from "@/components/seo/DriverJobsHubBody";

export const metadata: Metadata = {
  title: "Chauffeur Jobs in Saudi Arabia | VIP & Corporate Driving — Taxi Saudi Arabia",
  description:
    "Professional chauffeur jobs across Saudi Arabia — drive VIP, corporate and luxury-fleet clients. The premium earnings tier with steady bookings and weekly payouts. Apply by city.",
  alternates: { canonical: "https://taxisaudiarabia.com/chauffeur-jobs" },
};

export default function ChauffeurJobsHubPage() {
  return <DriverJobsHubBody variantKey="chauffeur-jobs" />;
}
