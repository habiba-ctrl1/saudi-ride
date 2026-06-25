export const revalidate = 86400; // revalidate every 24 hours

import { notFound } from "next/navigation";
import { Metadata } from "next";
import { DriverJobBody } from "@/components/seo/DriverJobBody";
import { DRIVER_JOB_CITIES, getDriverJobCity, variantSalary, JOB_VARIANTS } from "@/lib/data/driver-jobs";

const VARIANT = "driver-jobs" as const;

interface PageProps {
  params: Promise<{ city: string }>;
}

export function generateStaticParams() {
  return DRIVER_JOB_CITIES.map((c) => ({ city: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city } = await params;
  const data = getDriverJobCity(city);
  if (!data) return { title: "Driver Jobs Not Found" };

  const v = JOB_VARIANTS[VARIANT];
  const salary = variantSalary(data.salary, v.salaryFactor);
  const title = `${v.label} in ${data.name} | Taxi & Chauffeur Jobs — Taxi Saudi Arabia`;
  const description = `Apply for ${v.keyword} in ${data.name}, ${data.region}. Earn SAR ${salary[0].toLocaleString()}–${salary[1].toLocaleString()}/month with steady pre-booked trips, flexible hours and weekly payouts. ${data.demand} demand.`;
  return {
    title,
    description,
    alternates: { canonical: `https://taxisaudiarabia.com${v.urlBase}/${data.slug}` },
    openGraph: { title, description, type: "website" },
  };
}

export default async function DriverJobsCityPage({ params }: PageProps) {
  const { city } = await params;
  const data = getDriverJobCity(city);
  if (!data) notFound();
  return <DriverJobBody data={data} variantKey={VARIANT} />;
}
