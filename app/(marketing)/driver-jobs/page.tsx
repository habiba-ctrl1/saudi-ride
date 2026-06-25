export const revalidate = 86400;

import { Metadata } from "next";
import { DriverJobsHubBody } from "@/components/seo/DriverJobsHubBody";

export const metadata: Metadata = {
  title: "Taxi & Chauffeur Driver Jobs in Saudi Arabia | Apply by City — Taxi Saudi Arabia",
  description:
    "Driver jobs across Saudi Arabia — Riyadh, Jeddah, Makkah, Madinah, Dammam and more. Steady pre-booked trips, flexible hours and weekly payouts. Apply by city.",
  alternates: { canonical: "https://taxisaudiarabia.com/driver-jobs" },
};

export default function DriverJobsHubPage() {
  return <DriverJobsHubBody variantKey="driver-jobs" />;
}
