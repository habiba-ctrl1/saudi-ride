import { Metadata } from "next";
import { notFound } from "next/navigation";
import { DISTANCE_GUIDES, getDistanceGuide } from "@/lib/data/distances";
import { DistanceGuidePremium } from "@/components/distance/DistanceGuidePremium";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return DISTANCE_GUIDES.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const g = getDistanceGuide(slug);
  if (!g) return {};
  const title = `${g.fromCity} to ${g.toCity} Taxi — ${g.km} km, ${g.driveLabel} by Car`;
  const description = `${g.fromCity} to ${g.toCity} is about ${g.km} km, ${g.driveLabel} by road via ${g.highway}. Private door-to-door car with a professional driver — sedan, SUV, or van. Fare confirmed on WhatsApp, 24/7.`.slice(0, 160);
  const url = `https://taxisaudiarabia.com/distance/${g.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, type: "article", url, images: [{ url: `https://taxisaudiarabia.com${g.heroImage}`, width: 1200, height: 630, alt: `${g.fromCity} to ${g.toCity} journey` }] },
    twitter: { card: "summary_large_image", title, description, images: [`https://taxisaudiarabia.com${g.heroImage}`] },
  };
}

export default async function DistancePage({ params }: PageProps) {
  const { slug } = await params;
  const g = getDistanceGuide(slug);
  if (!g) notFound();
  return <DistanceGuidePremium g={g} />;
}
