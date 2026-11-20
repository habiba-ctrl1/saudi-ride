import { Metadata } from "next";
import { notFound } from "next/navigation";
import { DISTANCE_GUIDES, getDistanceGuide } from "@/lib/data/distances";
import { DistanceGuidePremium } from "@/components/distance/DistanceGuidePremium";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return DISTANCE_GUIDES.map((d) => ({ slug: d.slug }));
}

// Evidenced CTR fix (GSC 6mo, 2026-09-25): madinah-to-alula ranks pos 8.19
// with 638 impressions but only 5 clicks (0.78% CTR) — the query intent is
// informational ("madinah to alula distance", 140+103+34+18 impr across
// phrasings) but the generic title leads with "Taxi", not "Distance". Scoped
// to this one slug only — the shared formula below is unchanged for every
// other distance guide.
const TITLE_OVERRIDES: Record<string, string> = {
  "madinah-to-alula": "Madinah to AlUla Distance: 330 km, About 3 Hours (+ Private Taxi)",
  // Approved 2026-11-16. GSC 3mo: 1,300 impr, 2 clicks, pos 8.35; every query is "distance/by road/km/hours".
  "riyadh-to-makkah": "Riyadh to Makkah Distance: 870 km, 8–9 Hours by Road (+ Private Car)",
};
const DESCRIPTION_OVERRIDES: Record<string, string> = {
  "madinah-to-alula": "Madinah to AlUla is 330 km — about 3 hours by road. See the route, driving time, and book a private door-to-door car with a professional driver, fare confirmed on WhatsApp, 24/7.",
  "riyadh-to-makkah": "Riyadh to Makkah is about 870 km, 8–9 hours by road via Highway 40. Route, driving time and a private door-to-door car, fare confirmed on WhatsApp.",
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const g = getDistanceGuide(slug);
  if (!g) return {};
  const title = TITLE_OVERRIDES[slug] ?? `${g.fromCity} to ${g.toCity} Taxi — ${g.km} km, ${g.driveLabel} by Car`;
  const description = (DESCRIPTION_OVERRIDES[slug] ?? `${g.fromCity} to ${g.toCity} is about ${g.km} km, ${g.driveLabel} by road via ${g.highway}. Private door-to-door car with a professional driver — sedan, SUV, or van. Fare confirmed on WhatsApp, 24/7.`).slice(0, 160);
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
