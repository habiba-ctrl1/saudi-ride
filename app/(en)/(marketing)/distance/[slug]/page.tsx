import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { TLDRSummary } from "@/components/seo/TLDRSummary";
import { faqSchema, speakableSchema } from "@/lib/schema";
import { contactConfig } from "@/lib/config/contact";
import { DISTANCE_GUIDES, getDistanceGuide } from "@/lib/data/distances";
import { MapPin, Clock, Route, Car, Train, Plane, ArrowRight, MessageCircle } from "lucide-react";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return DISTANCE_GUIDES.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const g = getDistanceGuide(slug);
  if (!g) return {};
  const title = `${g.fromCity} to ${g.toCity} Distance — ${g.km} km, ${g.driveLabel} by Car`;
  const description = `${g.fromCity} to ${g.toCity} is about ${g.km} km and ${g.driveLabel} to drive via ${g.highway}. See the route, stops, and how it compares by car, train, and flight. Private taxi fare on WhatsApp.`.slice(0, 160);
  const url = `https://taxisaudiarabia.com/distance/${g.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, type: "article", url },
    twitter: { card: "summary_large_image", title, description },
  };
}

const MODE_ICON: Record<string, typeof Car> = {
  "By car / private taxi": Car,
  "By train": Train,
  "By flight": Plane,
};

export default async function DistancePage({ params }: PageProps) {
  const { slug } = await params;
  const g = getDistanceGuide(slug);
  if (!g) notFound();

  const waText = encodeURIComponent(
    `Salam! I'd like a private taxi from ${g.fromCity} to ${g.toCity}.\n\n• Date & time: \n• Passengers & luggage: \n• Vehicle (Sedan / SUV / Van): `,
  );
  const waUrl = `${contactConfig.whatsappLink}?text=${waText}`;

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#1C1C1C] pb-24">
      <JsonLd data={[faqSchema(g.faqs), speakableSchema({ path: `/distance/${g.slug}` })]} />
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Distances", href: "/distance" },
          { name: `${g.fromCity} to ${g.toCity}`, href: `/distance/${g.slug}` },
        ]}
      />

      <section className="section-container max-w-4xl pt-28 pb-10">
        <span className="inline-flex items-center gap-2 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#16A34A] mb-6">
          <Route className="h-3 w-3" /> Distance &amp; Journey Guide
        </span>
        <h1 className="font-heading text-3xl md:text-5xl font-bold leading-tight mb-6">
          {g.fromCity} to {g.toCity} Distance
        </h1>
        <div className="mb-8">
          <TLDRSummary
            answer={`${g.fromCity} to ${g.toCity} is about ${g.km} km and takes ${g.driveLabel} to drive via ${g.highway}. A private taxi is door-to-door with the fare confirmed on WhatsApp.`}
            facts={[
              { label: "Distance", value: `~${g.km} km` },
              { label: "Drive time", value: g.driveLabel },
              { label: "Main road", value: g.highway.split(" (")[0] },
              { label: "Taxi fare", value: "On WhatsApp" },
            ]}
          />
        </div>

        {/* Quick facts */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
          <div className="bg-white border border-[#16A34A]/12 rounded-2xl p-5">
            <MapPin className="h-6 w-6 text-[#C9A84C] mb-2" />
            <p className="text-[0.6rem] uppercase tracking-wider text-[#6B7280]">Distance</p>
            <p className="font-heading text-xl font-bold">~{g.km} km</p>
          </div>
          <div className="bg-white border border-[#16A34A]/12 rounded-2xl p-5">
            <Clock className="h-6 w-6 text-[#C9A84C] mb-2" />
            <p className="text-[0.6rem] uppercase tracking-wider text-[#6B7280]">Driving time</p>
            <p className="font-heading text-xl font-bold">{g.driveLabel}</p>
          </div>
          <div className="bg-white border border-[#16A34A]/12 rounded-2xl p-5 col-span-2 sm:col-span-1">
            <Route className="h-6 w-6 text-[#C9A84C] mb-2" />
            <p className="text-[0.6rem] uppercase tracking-wider text-[#6B7280]">Main road</p>
            <p className="font-semibold text-sm">{g.highway.split(" (")[0]}</p>
          </div>
        </div>

        {/* Overview */}
        <p className="text-[#374151] leading-relaxed mb-10">{g.overview}</p>

        {/* Route & stops */}
        <h2 className="font-heading text-2xl font-bold mb-4">The Route &amp; Rest Stops</h2>
        <p className="text-sm text-[#6B7280] mb-4">Driving via {g.highway}, common stops for fuel, food, and prayer include:</p>
        <ul className="grid sm:grid-cols-2 gap-3 mb-12">
          {g.stops.map((s, i) => (
            <li key={i} className="flex items-center gap-3 bg-white border border-[#16A34A]/12 rounded-xl px-4 py-3 text-sm">
              <MapPin className="h-4 w-4 text-[#16A34A] shrink-0" /> {s}
            </li>
          ))}
        </ul>

        {/* Compare modes */}
        <h2 className="font-heading text-2xl font-bold mb-6">By Car, Train, or Flight</h2>
        <div className="space-y-4 mb-12">
          {g.compare.map((c, i) => {
            const Icon = MODE_ICON[c.mode] ?? Car;
            return (
              <div key={i} className="flex items-start gap-4 bg-white border border-[#16A34A]/12 rounded-2xl p-5">
                <Icon className="h-6 w-6 text-[#C9A84C] shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold mb-1">{c.mode}</h3>
                  <p className="text-sm text-[#6B7280] leading-relaxed">{c.detail}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Booking CTA -> matching route page + WhatsApp */}
        <div className="bg-[#0F2E1C] text-white rounded-3xl p-8 md:p-10 mb-12">
          <h2 className="font-heading text-2xl font-bold mb-3">Book a Private Taxi: {g.fromCity} → {g.toCity}</h2>
          <p className="text-sm text-white/70 mb-6 max-w-xl">
            Skip the airport process and travel door-to-door with a professional driver. Your fare is confirmed on WhatsApp before you book — no surge, no hidden fees.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href={`/routes/${g.routeSlug}`}
              className="inline-flex items-center gap-2 rounded-full bg-[#16A34A] px-7 py-3 text-xs font-bold uppercase text-white hover:bg-[#15803D] transition-all"
            >
              See {g.fromCity} to {g.toCity} taxi <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-7 py-3 text-xs font-bold uppercase text-white hover:brightness-110 transition-all"
            >
              <MessageCircle className="h-4 w-4" /> Get a fare on WhatsApp
            </a>
          </div>
        </div>

        {/* FAQ */}
        <h2 className="font-heading text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {g.faqs.map((f, i) => (
            <div key={i} className="bg-white border border-[#16A34A]/12 rounded-2xl p-6">
              <h3 className="font-bold text-[#1C1C1C] mb-2">{f.question}</h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">{f.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
