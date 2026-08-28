import { Metadata } from "next";
import { MapPin, ArrowRight, Car, Building2, CheckCircle2, PlaneLanding, HelpCircle, ExternalLink, MessageCircle } from "lucide-react";
import Link from "next/link";
import { contactConfig } from "@/lib/config/contact";
import Image from "next/image";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqSchema, airportTaxiServiceSchema } from "@/lib/schema";
import { TLDRSummary } from "@/components/seo/TLDRSummary";
import { AIRPORT_DETAILS } from "@/lib/data/airports";

export const revalidate = 86400;

export function generateStaticParams() {
  return Object.keys(AIRPORT_DETAILS).map((slug) => ({ slug }));
}

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const airportData = AIRPORT_DETAILS[slug.toLowerCase()];

  if (!airportData) return { title: "Airport Not Found" };

  // Evidenced CTR fix (GSC: 25 impressions, 0 clicks, pos ~31): the generic
  // formula uses only the airport's official name, which for MED omits the
  // word "Madinah" entirely — nobody searches "Prince Mohammad Bin Abdulaziz
  // airport taxi" by that name. Same TITLE_OVERRIDES pattern as routes/[slug].
  const TITLE_OVERRIDES: Record<string, string> = {
    "prince-mohammad-madinah": "Madinah Airport Taxi (MED) | Prince Mohammad Bin Abdulaziz",
    // Same CTR fix: the official airport names omit the city travellers actually
    // search ("Jeddah/Riyadh/Dammam airport taxi"), so lead with the city.
    "king-abdulaziz-jeddah": "Jeddah Airport Taxi (JED) | King Abdulaziz International Airport",
    "king-khalid-riyadh": "Riyadh Airport Taxi (RUH) | King Khalid International Airport",
    "king-fahd-dammam": "Dammam Airport Taxi (DMM) | King Fahd International Airport",
  };
  const DESCRIPTION_OVERRIDES: Record<string, string> = {
    "prince-mohammad-madinah": "Madinah Airport (MED) taxi — Prince Mohammad Bin Abdulaziz Airport to your hotel near Masjid an-Nabawi, ~20 km/25 min. Meet & greet included, quoted on WhatsApp, 24/7.",
    "king-abdulaziz-jeddah": "Jeddah Airport (JED) taxi — King Abdulaziz International Airport to Makkah, Madinah or your Jeddah hotel. Meet & greet, flight tracking, fare confirmed on WhatsApp, 24/7.",
    "king-khalid-riyadh": "Riyadh Airport (RUH) taxi — King Khalid International Airport to your hotel, KAFD or city centre. Meet & greet included, fare confirmed on WhatsApp, 24/7.",
    "king-fahd-dammam": "Dammam Airport (DMM) taxi — King Fahd International Airport to Dammam, Khobar, Dhahran or Jubail. Meet & greet, fare confirmed on WhatsApp, 24/7.",
  };

  return {
    title: TITLE_OVERRIDES[slug] ?? `Taxi from ${airportData.name} (${airportData.code}) | Taxi Saudi Arabia`,
    description: DESCRIPTION_OVERRIDES[slug] ?? `Book your airport transfer from ${airportData.name}. Reliable private taxi service, quoted on WhatsApp, with meet & greet included at ${airportData.code} airport.`,
    alternates: {
      canonical: `https://taxisaudiarabia.com/airports/${slug}`,
    },
    openGraph: {
      title: `Taxi Service at ${airportData.code} Airport | Taxi Saudi Arabia`,
      description: airportData.description,
    },
  };
}

export default async function AirportLandingPage({ params }: PageProps) {
  const { slug } = await params;
  const airportKey = slug.toLowerCase();
  const airportData = AIRPORT_DETAILS[airportKey];

  if (!airportData) {
    notFound();
  }

  // Fetch routes connected to this airport (best-effort — a DB hiccup during
  // build must not fail the static export for every page in the site).
  let airportRoutes: Awaited<ReturnType<typeof db.route.findMany>> = [];
  try {
    airportRoutes = await db.route.findMany({
      where: {
        OR: [
          { fromCity: { contains: airportData.code, mode: 'insensitive' } },
          { toCity: { contains: airportData.code, mode: 'insensitive' } },
          { slug: { in: airportData.priorityRoutes } }
        ]
      },
      take: 6
    });
  } catch (error) {
    console.error(`❌ Airport routes fetch failed for ${airportKey}. Rendering without related routes.`, error);
  }

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#1C1C1C] pb-24">
      <JsonLd
        data={airportTaxiServiceSchema({
          airportName: airportData.name,
          iataCode: airportData.code,
          path: `/airports/${airportKey}`,
          description: airportData.description,
        })}
      />
      {airportData.faqs && airportData.faqs.length > 0 && (
        <JsonLd data={faqSchema(airportData.faqs)} />
      )}
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Airport Transfers", href: "/services/airport-transfers" },
          { name: `${airportData.code} Airport`, href: `/airports/${airportKey}` },
        ]}
      />
      {/* ─── HERO ─────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 overflow-hidden border-b border-[#C9A84C]/10">
        <div className="absolute inset-0 z-0">
          <Image
            src={airportData.image}
            alt={airportData.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAF7] via-[#FAFAF7]/50 to-[#FAFAF7]/15" />
        </div>

        <div className="section-container relative z-10 max-w-5xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/20 backdrop-blur-sm px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#16A34A] mb-6">
            <PlaneLanding className="h-3 w-3" /> Airport Transfer
          </span>
          <h1 className="font-heading text-4xl md:text-5xl font-bold leading-tight mb-2">
            Taxi Service from <br />
            <span className="text-[#16A34A]">{airportData.h1Name ?? airportData.name}</span>
          </h1>
          <p className="text-[#C9A84C] text-lg tracking-widest font-bold mb-6">
            {airportData.h1Name ? `${airportData.name} · ` : ""}{airportData.code} - {airportData.nameAr}
          </p>
          <p className="max-w-2xl text-sm md:text-base text-[#6B7280] leading-relaxed">
            {airportData.description}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <a
              href={`https://wa.me/${contactConfig.whatsappNumber}?text=${encodeURIComponent(`Salam, I need an airport taxi from ${airportData.name} (${airportData.code}). My destination and arrival time are:`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-full bg-[#16A34A] px-8 py-3.5 text-xs font-bold uppercase text-white hover:bg-[#15803D] transition-all shadow-[0_4px_20px_rgba(22,163,74,0.3)]"
            >
              <MessageCircle className="h-4 w-4" />
              Get Fare on WhatsApp
            </a>
            <Link
              href={`/book?pickup=${encodeURIComponent(airportData.name)}`}
              className="flex items-center justify-center gap-2 rounded-full border border-[#C9A84C]/40 px-8 py-3.5 text-xs font-bold uppercase text-[#16A34A] hover:bg-[#C9A84C]/10 transition-all"
            >
              <Car className="h-4 w-4" />
              Book Airport Pickup
            </Link>
          </div>
        </div>
      </section>

      <div className="section-container max-w-5xl mt-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* ─── MAIN CONTENT ───────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-16">

          {/* Quick Answer (above-the-fold AI/snippet signal) */}
          {airportData.tldr && (
            <TLDRSummary answer={airportData.tldr} facts={airportData.tldrFacts} />
          )}

          {/* Available Routes */}
          <section>
            <h2 className="font-heading text-3xl font-bold mb-8">Taxi Routes from {airportData.name} ({airportData.code})</h2>
            {airportRoutes.length > 0 ? (
              <div className="grid gap-4">
                {airportRoutes.map((route) => (
                  <Link href={`/routes/${route.slug}`} key={route.id} className="group flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl bg-white border border-[#16A34A]/12 hover:border-[#16A34A]/35 transition-colors">
                    <div className="flex items-center gap-4 mb-4 md:mb-0">
                      <div className="font-bold">{route.fromCity}</div>
                      <ArrowRight className="h-4 w-4 text-[#C9A84C]" />
                      <div className="font-bold">{route.toCity}</div>
                    </div>
                    <div className="flex items-center justify-between md:gap-6">
                      <div className="text-right">
                        <p className="text-[0.6rem] text-[#6B7280] uppercase font-bold">Starting from</p>
                        <p className="text-[#C9A84C] font-bold">On WhatsApp</p>
                      </div>
                      <div className="bg-[#C9A84C]/10 text-[#C9A84C] rounded-full p-2 group-hover:bg-[#16A34A] group-hover:text-white transition-colors">
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-[#6B7280]">Currently mapping custom routes for this airport. Please contact us for a quote.</p>
            )}
            <div className="mt-6">
              <Link href="/routes" className="text-[#C9A84C] text-sm font-bold hover:underline">View all Kingdom-wide routes &rarr;</Link>
            </div>
          </section>

          {/* Local Tips */}
          {airportData.tips.length > 0 && (
            <section className="bg-white border border-[#16A34A]/12 rounded-3xl p-8">
              <h2 className="font-heading text-2xl font-bold mb-6 text-[#1C1C1C]">Transfer Tips for {airportData.code} Airport</h2>
              <ul className="space-y-4">
                {airportData.tips.map((tip, idx) => (
                  <li key={idx} className="flex gap-4">
                    <CheckCircle2 className="h-5 w-5 text-[#C9A84C] shrink-0 mt-0.5" />
                    <p className="text-sm text-[#6B7280]">{tip}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* FAQs (FAQPage schema injected above) */}
          {airportData.faqs && airportData.faqs.length > 0 && (
            <section>
              <h2 className="font-heading text-2xl font-bold mb-6 flex items-center gap-3">
                <HelpCircle className="text-[#C9A84C]" />
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {airportData.faqs.map((faq, idx) => (
                  <div key={idx} className="border border-[#16A34A]/12 rounded-2xl p-6 bg-white">
                    <h3 className="font-bold text-base mb-2 text-[#1C1C1C]">{faq.question}</h3>
                    <p className="text-sm text-[#6B7280] leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Related Links — internal cross-links to verified route + fleet pages */}
          {airportData.relatedLinks && airportData.relatedLinks.length > 0 && (
            <section className="bg-white border border-[#16A34A]/12 rounded-3xl p-8">
              <h2 className="font-heading text-2xl font-bold mb-6 flex items-center gap-3">
                <ExternalLink className="text-[#C9A84C] h-5 w-5" />
                Related Routes & Vehicles
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {airportData.relatedLinks.map((link, idx) => (
                  <Link
                    key={idx}
                    href={link.href}
                    className="group flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#16A34A] transition-colors p-2 rounded-lg hover:bg-[#F0FDF4]"
                  >
                    <ArrowRight className="h-3.5 w-3.5 shrink-0 text-[#C9A84C]/60 group-hover:text-[#16A34A] transition-colors" />
                    {link.label}
                  </Link>
                ))}
              </div>
            </section>
          )}

        </div>

        {/* ─── SIDEBAR ────────────────────────────────────────────── */}
        <div className="lg:col-span-1 space-y-8">
          
          {/* Terminals */}
          {airportData.terminals.length > 0 && (
            <div className="bg-white border border-[#16A34A]/12 rounded-3xl p-6">
              <h3 className="font-heading text-xl font-bold mb-6 flex items-center gap-2">
                <Building2 className="text-[#C9A84C] h-5 w-5" /> Terminals
              </h3>
              <div className="space-y-4">
                {airportData.terminals.map((term, idx) => (
                  <div key={idx} className="border-b border-[#C9A84C]/10 pb-4 last:border-0 last:pb-0">
                    <div className="text-sm font-bold text-[#1C1C1C] mb-1">{term.name}</div>
                    <p className="text-[0.7rem] text-[#6B7280]">{term.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FAQ Schema Placeholder (Blueprint requirement) */}
          <div className="bg-white border border-[#16A34A]/15 shadow-lg rounded-3xl p-6 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-10 text-[#C9A84C]">
              <PlaneLanding className="h-32 w-32" />
            </div>
            <div className="relative z-10">
              <span className="text-[0.6rem] uppercase tracking-widest text-[#C9A84C] font-bold">Included</span>
              <h3 className="font-heading text-xl font-bold mt-1 mb-2">Meet & Greet</h3>
              <p className="text-xs text-[#6B7280] mb-6 leading-relaxed">
                Your driver will be waiting in the arrivals hall with a name sign. We track your flight for delays. 60 minutes of free waiting time included.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
