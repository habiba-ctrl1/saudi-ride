export const revalidate = 86400;

import { notFound } from "next/navigation";
import { Metadata } from "next";
import { DriverJobBody } from "@/components/seo/DriverJobBody";
import { DRIVER_JOB_CITIES, getDriverJobCity, variantSalary, JOB_VARIANTS } from "@/lib/data/driver-jobs";

const VARIANT = "taxi-driver-jobs" as const;

interface PageProps {
  params: Promise<{ city: string }>;
}

export function generateStaticParams() {
  return DRIVER_JOB_CITIES.map((c) => ({ city: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city } = await params;
  const data = getDriverJobCity(city);
  if (!data) return { title: "Taxi Driver Jobs Not Found" };

  const v = JOB_VARIANTS[VARIANT];
  const salary = variantSalary(data.salary, v.salaryFactor);
  const title = `${v.label} in ${data.name} | Apply Today — Taxi Saudi Arabia`;
  const description = `Apply for ${v.keyword} in ${data.name}, ${data.region}. Everyday airport, city and intercity rides. Earn SAR ${salary[0].toLocaleString()}–${salary[1].toLocaleString()}/month with flexible hours and weekly payouts.`;
  return {
    title,
    description,
    alternates: { canonical: `https://taxisaudiarabia.com${v.urlBase}/${data.slug}` },
    openGraph: { title, description, type: "website" },
  };
}

export default async function TaxiDriverJobsCityPage({ params }: PageProps) {
  const { city } = await params;
  const data = getDriverJobCity(city);
  if (!data) notFound();
  return <DriverJobBody data={data} variantKey={VARIANT} />;
}
