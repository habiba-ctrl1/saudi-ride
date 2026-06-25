export const revalidate = 86400;

import { notFound } from "next/navigation";
import { Metadata } from "next";
import { DriverJobBody } from "@/components/seo/DriverJobBody";
import { DRIVER_JOB_CITIES, getDriverJobCity, variantSalary, JOB_VARIANTS } from "@/lib/data/driver-jobs";

const VARIANT = "chauffeur-jobs" as const;

interface PageProps {
  params: Promise<{ city: string }>;
}

export function generateStaticParams() {
  return DRIVER_JOB_CITIES.map((c) => ({ city: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city } = await params;
  const data = getDriverJobCity(city);
  if (!data) return { title: "Chauffeur Jobs Not Found" };

  const v = JOB_VARIANTS[VARIANT];
  const salary = variantSalary(data.salary, v.salaryFactor);
  const title = `${v.label} in ${data.name} | VIP & Corporate Chauffeur — Taxi Saudi Arabia`;
  const description = `Apply for ${v.keyword} in ${data.name}, ${data.region}. Drive VIP and corporate clients, earn SAR ${salary[0].toLocaleString()}–${salary[1].toLocaleString()}/month — the premium tier. Steady bookings, weekly payouts.`;
  return {
    title,
    description,
    alternates: { canonical: `https://taxisaudiarabia.com${v.urlBase}/${data.slug}` },
    openGraph: { title, description, type: "website" },
  };
}

export default async function ChauffeurJobsCityPage({ params }: PageProps) {
  const { city } = await params;
  const data = getDriverJobCity(city);
  if (!data) notFound();
  return <DriverJobBody data={data} variantKey={VARIANT} />;
}
