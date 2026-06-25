export const revalidate = 86400;

import { Metadata } from "next";
import { DriverJobsHubBody } from "@/components/seo/DriverJobsHubBody";

export const metadata: Metadata = {
  title: "Taxi Driver Jobs in Saudi Arabia | Apply Today — Taxi Saudi Arabia",
  description:
    "Taxi driver jobs across Saudi Arabia — everyday airport, city and intercity rides. Flexible hours, transparent fares and weekly payouts. Apply by city.",
  alternates: { canonical: "https://taxisaudiarabia.com/taxi-driver-jobs" },
};

export default function TaxiDriverJobsHubPage() {
  return <DriverJobsHubBody variantKey="taxi-driver-jobs" />;
}
