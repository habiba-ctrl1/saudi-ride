export const dynamic = "force-dynamic";
export const revalidate = 86400; // revalidate every 24 hours

import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Metadata } from "next";
import { MapPin, Clock, ArrowRight, CheckCircle2, ShieldCheck, Car, HelpCircle, AlertTriangle, ChevronRight } from "lucide-react";
import Link from "next/link";
import { contactConfig } from "@/lib/config/contact";
import Image from "next/image";
import { breadcrumbSchema, faqSchema, SITE } from "@/lib/schema";
import { TLDRSummary } from "@/components/seo/TLDRSummary";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generic fallback FAQs for routes without bespoke content.
const DEFAULT_FAQS = [
  {
    question: "Can I modify my pickup time?",
    answer: "Yes, you can modify your pickup time up to 12 hours before the scheduled transfer without any penalty. Just contact our support team.",
  },
  {
    question: "Are there stops allowed during the trip?",
    answer: "Brief rest stops for prayer or refreshments are absolutely fine and included in long-distance trips. For extensive detours, please request a custom quote.",
  },
];

// Route-specific, entity-rich content for the highest-value Jeddah corridors.
// Keyed by slug → above-the-fold answer + featured-snippet facts + bespoke FAQs.
const ROUTE_CONTENT: Record<string, { tldr: string; tldrFacts: { label: string; value: string }[]; faqs: { question: string; answer: string }[] }> = {
  "jeddah-airport-to-makkah": {
    tldr: "A taxi from Jeddah Airport (JED) to Makkah is about 80 km and takes roughly 1 hour. The fare is fixed from SAR 180, available 24/7, and the driver can stop at the Miqat so you enter Ihram before reaching Makkah.",
    tldrFacts: [
      { label: "Distance", value: "~80 km" },
      { label: "Time", value: "~1 hour" },
      { label: "From", value: "SAR 180" },
      { label: "Hours", value: "24/7" },
    ],
    faqs: [
      { question: "How far is Jeddah airport from Makkah?", answer: "King Abdulaziz International Airport (JED) is about 80 km from Makkah — roughly a 1-hour drive on the Makkah Expressway, traffic permitting." },
      { question: "How much is a taxi from Jeddah airport to Makkah?", answer: "The fare is fixed from SAR 180 for a sedan, with SUVs and vans available for families and extra luggage. You confirm the exact price before booking — no surge, tolls included." },
      { question: "Can the driver stop at the Miqat for Ihram?", answer: "Yes. Just tell us in advance and the driver will stop at the Miqat on the way so you can change into Ihram and make your intention before entering the Haram boundary." },
      { question: "Is the Jeddah airport to Makkah taxi available at night?", answer: "Yes, we operate 24/7. We track your flight number, so the driver is waiting at arrivals with a name sign even for late-night or delayed flights." },
      { question: "Which is better — taxi or the Haramain train?", answer: "A private taxi is door-to-door from the airport to your Makkah hotel with luggage help and a Miqat stop. The Haramain high-speed train is fast but requires transfers to and from the stations. For pilgrims with luggage, the direct taxi is usually more convenient." },
    ],
  },
  "jeddah-to-makkah": {
    tldr: "A taxi from Jeddah city to Makkah is about 85 km and takes around 1 hour 10 minutes. The fare is fixed from SAR 150, available 24/7, with door-to-door pickup from any Jeddah hotel or address.",
    tldrFacts: [
      { label: "Distance", value: "~85 km" },
      { label: "Time", value: "~1 hr 10 min" },
      { label: "From", value: "SAR 150" },
      { label: "Hours", value: "24/7" },
    ],
    faqs: [
      { question: "How far is Jeddah from Makkah?", answer: "Jeddah city centre is about 85 km from Makkah — roughly a 1 hour 10 minute drive on the Makkah Expressway." },
      { question: "How much is a taxi from Jeddah to Makkah?", answer: "The fare is fixed from SAR 150 for a sedan. SUVs and vans are available for families and extra luggage. The price is confirmed before booking, with tolls included and no surge." },
      { question: "Can you pick me up from my Jeddah hotel?", answer: "Yes. We offer door-to-door pickup from any hotel, residence, or address in Jeddah and drop you directly at your Makkah hotel or close to Masjid al-Haram." },
      { question: "Can the driver stop at the Miqat for Ihram?", answer: "Yes — let us know when booking and the driver will stop at the Miqat so you can enter Ihram before reaching Makkah." },
    ],
  },
  "jeddah-airport-to-jeddah-city": {
    tldr: "A taxi from Jeddah Airport (JED) to the city centre, Corniche, or Al-Balad takes about 20–35 minutes depending on your area. The fare is fixed from SAR 80, with meet & greet at arrivals and 24/7 availability.",
    tldrFacts: [
      { label: "Distance", value: "~20 km" },
      { label: "Time", value: "~20–35 min" },
      { label: "From", value: "SAR 80" },
      { label: "Hours", value: "24/7" },
    ],
    faqs: [
      { question: "How far is Jeddah airport from the city centre?", answer: "King Abdulaziz International Airport (JED) is about 20 km from central Jeddah — roughly a 20–35 minute drive depending on whether you are heading to the Corniche, Al-Balad, or a business district." },
      { question: "How much is a taxi from Jeddah airport to the city?", answer: "The fare is fixed from SAR 80 for a sedan, confirmed before you book, with no surge and tolls included. Larger vehicles are available for families and extra luggage." },
      { question: "Do you drop off at any Jeddah hotel?", answer: "Yes. We provide door-to-door drop-off at any hotel or address in Jeddah, including the Corniche, Al-Balad, Al-Hamra, and Obhur, with meet & greet at arrivals." },
      { question: "Is the airport taxi available for late-night arrivals?", answer: "Yes, we operate 24/7 and track your flight, so your driver is waiting at arrivals with a name sign even for late-night or early-morning landings." },
    ],
  },
  "jeddah-to-haramain-station": {
    tldr: "A taxi from Jeddah to the Haramain High-Speed Railway station is about 15 km and takes roughly 25 minutes. The fare is fixed from SAR 70, door-to-door with luggage help, so you can catch the train onward to Makkah or Madinah.",
    tldrFacts: [
      { label: "Distance", value: "~15 km" },
      { label: "Time", value: "~25 min" },
      { label: "From", value: "SAR 70" },
      { label: "Hours", value: "24/7" },
    ],
    faqs: [
      { question: "Where is the Haramain station in Jeddah?", answer: "The Haramain High-Speed Railway serves Jeddah, with a station at King Abdulaziz International Airport (JED). A taxi from central Jeddah takes about 25 minutes door-to-door." },
      { question: "How much is a taxi to the Haramain station in Jeddah?", answer: "The fare is fixed from SAR 70 for a sedan, confirmed before booking, with help for your luggage so you make your train comfortably." },
      { question: "Can you get me to the station in time for my train?", answer: "Yes. We recommend booking with a buffer before departure; we track timing and provide door-to-door pickup so you reach the Haramain station with time to spare." },
      { question: "Should I take the train or a direct taxi to Makkah?", answer: "The Haramain train is fast between stations, but a direct taxi from Jeddah to Makkah is door-to-door with a Miqat stop and no transfers. For pilgrims with luggage, the direct taxi is often more convenient." },
    ],
  },
  "jeddah-airport-to-madinah": {
    tldr: "A taxi from Jeddah Airport (JED) to Madinah is about 410 km and takes roughly 4 to 5 hours via the Haramain highway. The fare is fixed from SAR 380, with comfortable vehicles for families and luggage, available 24/7 with rest stops on request.",
    tldrFacts: [
      { label: "Distance", value: "~410 km" },
      { label: "Time", value: "~4–5 hours" },
      { label: "From", value: "SAR 380" },
      { label: "Hours", value: "24/7" },
    ],
    faqs: [
      { question: "How long does Jeddah airport to Madinah take by taxi?", answer: "The direct drive is about 410 km and takes roughly 4 to 5 hours via the Haramain highway, depending on traffic and rest stops." },
      { question: "How much is a taxi from Jeddah airport to Madinah?", answer: "The fare is fixed from SAR 380. We recommend an SUV or van for families and luggage on this long-distance route — the price is confirmed before booking, tolls included." },
      { question: "Are rest stops included on the way to Madinah?", answer: "Yes. Brief stops for prayer, food, or refreshments are included on this long-distance transfer — just let your driver know." },
      { question: "Is the trip comfortable for families with luggage?", answer: "Yes. We provide spacious SUVs (e.g. GMC Yukon) and vans (e.g. Hyundai Staria) with ample luggage space, ideal for families travelling from JED to Madinah." },
    ],
  },
  "jeddah-to-madinah": {
    tldr: "A taxi from Jeddah to Madinah is about 420 km and takes roughly 4 to 5 hours via the Haramain highway. The fare is fixed from SAR 350, door-to-door, with rest stops on request and 24/7 availability.",
    tldrFacts: [
      { label: "Distance", value: "~420 km" },
      { label: "Time", value: "~4–5 hours" },
      { label: "From", value: "SAR 350" },
      { label: "Hours", value: "24/7" },
    ],
    faqs: [
      { question: "How far is Jeddah from Madinah?", answer: "Jeddah is about 420 km from Madinah — roughly a 4 to 5 hour drive on the Haramain highway." },
      { question: "How much is a taxi from Jeddah to Madinah?", answer: "The fare is fixed from SAR 350 for a sedan, with SUVs and vans available for families. The price is confirmed before booking, with tolls included and no surge." },
      { question: "Can you collect me from my Jeddah hotel?", answer: "Yes, we provide door-to-door pickup from any Jeddah hotel or address and drop you at your Madinah hotel near Masjid an-Nabawi." },
      { question: "Are prayer and rest stops included?", answer: "Yes. Short stops for prayer and refreshments are included on this long-distance route — just tell your driver." },
    ],
  },
  "makkah-to-jeddah-airport": {
    tldr: "A taxi from Makkah to Jeddah Airport (JED) is about 80 km and takes roughly 1 hour. The fare is fixed from SAR 180, with pickup from your Makkah hotel and 24/7 availability — pre-book and allow buffer time before your flight.",
    tldrFacts: [
      { label: "Distance", value: "~80 km" },
      { label: "Time", value: "~1 hour" },
      { label: "From", value: "SAR 180" },
      { label: "Hours", value: "24/7" },
    ],
    faqs: [
      { question: "How much is a taxi from Makkah to Jeddah airport?", answer: "The fare is fixed from SAR 180 for a sedan, confirmed before booking, with larger SUVs and vans available for families and luggage. Tolls are included and there is no surge." },
      { question: "How long does Makkah to Jeddah airport take?", answer: "It is about 80 km and roughly a 1-hour drive. For departures we recommend leaving with extra buffer time, especially during Umrah, Hajj, and Ramadan seasons." },
      { question: "Can you pick up from my Makkah hotel near the Haram?", answer: "Yes. We collect you from your hotel as close to Masjid al-Haram as vehicles are permitted; during prayer-time road closures we use the nearest allowed checkpoint." },
      { question: "Is the airport transfer available late at night?", answer: "Yes, we operate 24/7. Pre-book your departure transfer so a driver is ready at your hotel at the agreed time, even for early-morning flights." },
    ],
  },
  "makkah-to-madinah": {
    tldr: "A taxi from Makkah to Madinah is about 430 km and takes roughly 4 to 5 hours via the Haramain highway. The fare is fixed from SAR 350, with prayer and rest stops included and comfortable vehicles for families and luggage.",
    tldrFacts: [
      { label: "Distance", value: "~430 km" },
      { label: "Time", value: "~4–5 hours" },
      { label: "From", value: "SAR 350" },
      { label: "Hours", value: "24/7" },
    ],
    faqs: [
      { question: "How far is Makkah from Madinah?", answer: "Makkah to Madinah is about 430 km — roughly a 4 to 5 hour drive on the Haramain highway, depending on traffic and rest stops." },
      { question: "How much is a taxi from Makkah to Madinah?", answer: "The fare is fixed from SAR 350 for a sedan. For families and luggage we recommend an SUV or van; the price is confirmed before booking with tolls included." },
      { question: "Are prayer and rest stops included on the way to Madinah?", answer: "Yes. Stops for prayer, food, and refreshments are included on this long-distance transfer — just let your driver know your preferences." },
      { question: "Should I take the taxi or the Haramain train to Madinah?", answer: "The Haramain high-speed train is fast between stations, but a private taxi is door-to-door from your Makkah hotel to your Madinah hotel with no transfers — more convenient for pilgrims with luggage and elderly travellers." },
    ],
  },
  "makkah-to-jeddah": {
    tldr: "A taxi from Makkah to Jeddah city is about 85 km and takes around 1 hour 10 minutes. The fare is fixed from SAR 150, door-to-door from your Makkah hotel to any address in Jeddah, available 24/7.",
    tldrFacts: [
      { label: "Distance", value: "~85 km" },
      { label: "Time", value: "~1 hr 10 min" },
      { label: "From", value: "SAR 150" },
      { label: "Hours", value: "24/7" },
    ],
    faqs: [
      { question: "How far is Makkah from Jeddah?", answer: "Makkah to Jeddah city is about 85 km — roughly a 1 hour 10 minute drive on the Makkah Expressway." },
      { question: "How much is a taxi from Makkah to Jeddah?", answer: "The fare is fixed from SAR 150 for a sedan, confirmed before booking, with no surge and tolls included." },
      { question: "Can you drop me at any address in Jeddah?", answer: "Yes. We provide door-to-door drop-off anywhere in Jeddah — hotels, the Corniche, Al-Balad, Obhur, or a residence." },
      { question: "Is the Makkah to Jeddah taxi available 24/7?", answer: "Yes, we operate around the clock with fixed pricing and pickup from your Makkah hotel." },
    ],
  },
  "makkah-to-taif": {
    tldr: "A taxi from Makkah to Taif is about 90 km and takes roughly 1 hour 10 minutes via the scenic Al Hada mountain road. The fare is fixed from SAR 180, with experienced drivers for the winding ascent.",
    tldrFacts: [
      { label: "Distance", value: "~90 km" },
      { label: "Time", value: "~1 hr 10 min" },
      { label: "From", value: "SAR 180" },
      { label: "Hours", value: "24/7" },
    ],
    faqs: [
      { question: "How far is Makkah from Taif?", answer: "Makkah to Taif is about 90 km — roughly a 1 hour 10 minute drive, often via the scenic Al Hada mountain road." },
      { question: "How much is a taxi from Makkah to Taif?", answer: "The fare is fixed from SAR 180 for a sedan, confirmed before booking, with SUVs available for families. Tolls are included." },
      { question: "Is the Al Hada mountain road safe by taxi?", answer: "Yes. Our drivers are experienced on the steep, winding Al Hada route. You can also request the longer, gentler Al Sail road if preferred." },
      { question: "Can I do a Taif day trip from Makkah?", answer: "Yes. We offer round-trip and hourly hire so you can visit Taif's rose farms, Al Hada, and cable car with waiting time included." },
    ],
  },
  "madinah-airport-to-city": {
    tldr: "A taxi from Madinah Airport (MED) to the central hotels near Masjid an-Nabawi is about 20 km and takes roughly 25 minutes. The fare is fixed from SAR 80, with meet & greet at arrivals and 24/7 availability.",
    tldrFacts: [
      { label: "Distance", value: "~20 km" },
      { label: "Time", value: "~25 min" },
      { label: "From", value: "SAR 80" },
      { label: "Hours", value: "24/7" },
    ],
    faqs: [
      { question: "How far is Madinah airport from the city centre?", answer: "Prince Mohammad Bin Abdulaziz Airport (MED) is about 20 km from the Central Area (Markazia) hotels — roughly a 25-minute drive." },
      { question: "How much is a taxi from Madinah airport to my hotel?", answer: "The fare is fixed from SAR 80 for a sedan, confirmed before booking, with meet & greet at arrivals and larger vehicles for families." },
      { question: "Will the driver meet me at arrivals?", answer: "Yes. We track your flight and your driver waits in the arrivals hall with a name sign, then helps with your luggage to the car." },
      { question: "Is the airport transfer available for late-night flights?", answer: "Yes, we operate 24/7, so your driver is ready even for late-night or early-morning arrivals at MED." },
    ],
  },
  "madinah-to-makkah": {
    tldr: "A taxi from Madinah to Makkah is about 430 km and takes roughly 4 to 5 hours via the Haramain highway. The fare is fixed from SAR 350, door-to-door with prayer and rest stops, ideal for completing your Umrah journey.",
    tldrFacts: [
      { label: "Distance", value: "~430 km" },
      { label: "Time", value: "~4–5 hours" },
      { label: "From", value: "SAR 350" },
      { label: "Hours", value: "24/7" },
    ],
    faqs: [
      { question: "How far is Madinah from Makkah?", answer: "Madinah to Makkah is about 430 km — roughly a 4 to 5 hour drive on the Haramain highway, depending on traffic and rest stops." },
      { question: "How much is a taxi from Madinah to Makkah?", answer: "The fare is fixed from SAR 350 for a sedan. For families and luggage we recommend an SUV or van; the price is confirmed before booking with tolls included." },
      { question: "Do I need to enter Ihram travelling from Madinah to Makkah?", answer: "Yes, if you intend Umrah you enter Ihram at the Miqat of Dhul Hulaifah (Abyar Ali) near Madinah. Your driver can stop there so you assume Ihram before continuing to Makkah." },
      { question: "Are prayer and rest stops included?", answer: "Yes. With a private taxi your driver includes stops for prayer, food, and rest on the long-distance journey between the two Holy Cities." },
    ],
  },
  "madinah-airport-to-makkah": {
    tldr: "A taxi from Madinah Airport (MED) to Makkah is about 450 km and takes roughly 4.5 to 5 hours. The fare is fixed from SAR 400, with a Miqat stop at Dhul Hulaifah for Ihram and rest stops on request.",
    tldrFacts: [
      { label: "Distance", value: "~450 km" },
      { label: "Time", value: "~4.5–5 hours" },
      { label: "From", value: "SAR 400" },
      { label: "Hours", value: "24/7" },
    ],
    faqs: [
      { question: "How long is Madinah airport to Makkah by taxi?", answer: "It is about 450 km and roughly a 4.5 to 5 hour direct drive from Prince Mohammad Bin Abdulaziz Airport (MED) to Makkah." },
      { question: "How much is the Madinah airport to Makkah taxi?", answer: "The fare is fixed from SAR 400 for a sedan, with SUVs and vans for families and luggage. The price is confirmed before booking, tolls included." },
      { question: "Can the driver stop at the Miqat for Ihram?", answer: "Yes. Coming from Madinah, the Miqat is Dhul Hulaifah (Abyar Ali). Your driver can stop there so you enter Ihram before continuing to Makkah." },
      { question: "Is this a good option after a late flight into Madinah?", answer: "Yes. We operate 24/7 and track your flight, so a direct comfortable transfer to Makkah is available even after a late arrival at MED." },
    ],
  },
  "madinah-to-jeddah-airport": {
    tldr: "A taxi from Madinah to Jeddah Airport (JED) is about 410 km and takes roughly 4 to 5 hours via the Haramain highway. The fare is fixed from SAR 380, door-to-door from your Madinah hotel, with rest stops on request.",
    tldrFacts: [
      { label: "Distance", value: "~410 km" },
      { label: "Time", value: "~4–5 hours" },
      { label: "From", value: "SAR 380" },
      { label: "Hours", value: "24/7" },
    ],
    faqs: [
      { question: "How far is Madinah from Jeddah airport?", answer: "Madinah to King Abdulaziz International Airport (JED) is about 410 km — roughly a 4 to 5 hour drive on the Haramain highway." },
      { question: "How much is a taxi from Madinah to Jeddah airport?", answer: "The fare is fixed from SAR 380 for a sedan, confirmed before booking, with SUVs and vans for families and luggage. Tolls are included." },
      { question: "Can you collect me from my Madinah hotel for the airport?", answer: "Yes, we provide door-to-door pickup from your Madinah hotel after Ziyarah and take you directly to Jeddah Airport for your flight." },
      { question: "Should I leave extra time for this departure?", answer: "Yes. For a long-distance airport transfer we recommend departing with comfortable buffer time before check-in, especially during Hajj and Ramadan seasons." },
    ],
  },
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const route = await db.route.findUnique({ where: { slug } });

  if (!route) return { title: "Route Not Found" };

  return {
    title: `Taxi from ${route.fromCity} to ${route.toCity} | Fixed Price SAR ${route.basePrice} — Taxi Saudi Arabia`,
    description: `Book a taxi from ${route.fromCity} to ${route.toCity}. ${route.distance}km ride, approx ${Math.round(route.duration / 60)} hours. Fixed price from SAR ${route.basePrice}. No hidden fees, licensed drivers, available 24/7.`,
    alternates: {
      canonical: `https://taxisaudiarabia.com/routes/${slug}`,
    },
    openGraph: {
      title: `Taxi from ${route.fromCity} to ${route.toCity} — SAR ${route.basePrice} Fixed Price`,
      description: route.description || `Book a taxi from ${route.fromCity} to ${route.toCity} at a fixed price. No surge, no hidden fees.`,
      type: "website",
    },
  };
}

export default async function RouteDetailsPage({ params }: PageProps) {
  const { slug } = await params;
  const route = await db.route.findUnique({ where: { slug } });

  if (!route) {
    notFound();
  }

  // Route-specific content (TLDR + bespoke FAQs) for priority corridors;
  // falls back to generic FAQs for all other routes.
  const content = ROUTE_CONTENT[slug];
  const faqs = content?.faqs ?? DEFAULT_FAQS;

  // Calculate prices based on basePrice
  const prices = {
    SEDAN: route.basePrice,
    SUV: Math.round(route.basePrice * 1.5),
    VAN: Math.round(route.basePrice * 1.35),
    LUXURY: Math.round(route.basePrice * 2.5),
    BUS: Math.round(route.basePrice * 3.8),
  };

  const vehicles = [
    { name: "Executive Sedan", key: "SEDAN", pax: 3, luggage: 2, img: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&w=400&q=80" },
    { name: "Family SUV", key: "SUV", pax: 6, luggage: 5, img: "https://images.unsplash.com/photo-1601929862074-04b7b88f0c82?auto=format&fit=crop&w=400&q=80" },
    { name: "Luxury VIP", key: "LUXURY", pax: 3, luggage: 3, img: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=400&q=80" },
    { name: "Group Van", key: "VAN", pax: 7, luggage: 7, img: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=400&q=80" },
  ];

  // Schema Markup
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    "name": `${route.fromCity} to ${route.toCity} Transfer`,
    "description": route.description,
    "provider": { "@id": SITE.businessId },
    "itinerary": {
      "@type": "ItemList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "item": {
            "@type": "TouristAttraction",
            "name": route.fromCity
          }
        },
        {
          "@type": "ListItem",
          "position": 2,
          "item": {
            "@type": "TouristAttraction",
            "name": route.toCity
          }
        }
      ]
    },
    "offers": {
      "@type": "Offer",
      "price": route.basePrice,
      "priceCurrency": "SAR",
      "availability": "https://schema.org/InStock"
    }
  };

  // Google Static Maps integration (Placeholder logic using standard maps URL if no key)
  const mapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const mapUrl = mapsApiKey 
    ? `https://maps.googleapis.com/maps/api/staticmap?size=800x400&path=color:0xC9A84C|weight:4|${encodeURIComponent(route.fromCity)}|${encodeURIComponent(route.toCity)}&markers=color:black|label:A|${encodeURIComponent(route.fromCity)}&markers=color:black|label:B|${encodeURIComponent(route.toCity)}&key=${mapsApiKey}`
    : `https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80`; // Fallback beautiful map abstract

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8] pb-24">
      {/* Inject Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(faqs)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: "Home", href: "/" },
              { name: "Routes", href: "/routes" },
              { name: `${route.fromCity} to ${route.toCity}`, href: `/routes/${slug}` },
            ])
          ),
        }}
      />

      {/* ─── HERO & MAP ───────────────────────────────────────────── */}
      <section className="relative pt-24 pb-12 overflow-hidden border-b border-[#C9A84C]/10">
        <div className="absolute inset-0 z-0 opacity-30">
          <Image src={mapUrl} alt={`Map route from ${route.fromCity} to ${route.toCity}`} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/80 to-[#0A0A0A]/40" />
        </div>

        <div className="section-container relative z-10 max-w-5xl">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-wider text-[#7C8088] mb-8">
            <Link href="/" className="hover:text-[#C9A84C] transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/routes" className="hover:text-[#C9A84C] transition-colors">Routes</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-[#C9A84C]">{route.fromCity} to {route.toCity}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <h1 className="font-heading text-4xl md:text-5xl font-bold leading-tight">
                {route.fromCity} <span className="text-[#C9A84C]">to</span> {route.toCity}
              </h1>
              <p className="mt-4 text-sm md:text-base text-[#A1A1A6] leading-relaxed">
                {route.description}
              </p>
            </div>
            
            <div className="shrink-0 bg-[#111111]/80 backdrop-blur-md border border-[#C9A84C]/20 rounded-2xl p-6 flex items-center gap-6">
              <div>
                <p className="text-[0.6rem] text-[#7C8088] uppercase font-bold tracking-wider mb-1">Distance</p>
                <div className="flex items-center gap-1.5 font-bold text-lg">
                  <MapPin className="h-4 w-4 text-[#C9A84C]" />
                  {route.distance} km
                </div>
              </div>
              <div className="w-px h-10 bg-[#C9A84C]/20" />
              <div>
                <p className="text-[0.6rem] text-[#7C8088] uppercase font-bold tracking-wider mb-1">Est. Time</p>
                <div className="flex items-center gap-1.5 font-bold text-lg">
                  <Clock className="h-4 w-4 text-[#C9A84C]" />
                  ~{Math.round(route.duration / 60)}h {route.duration % 60 > 0 ? `${route.duration % 60}m` : ''}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="section-container max-w-5xl mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* ─── LEFT COLUMN (Details) ──────────────────────────────── */}
        <div className="lg:col-span-2 space-y-12">

          {/* Quick Answer (above-the-fold AI/snippet signal) */}
          {content?.tldr && (
            <TLDRSummary answer={content.tldr} facts={content.tldrFacts} />
          )}

          {/* Vehicles & Pricing */}
          <section>
            <h2 className="font-heading text-2xl font-bold mb-6 flex items-center gap-3">
              <Car className="text-[#C9A84C]" />
              Vehicle Options & Fixed Pricing
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {vehicles.map((v) => (
                <div key={v.key} className="border border-[#C9A84C]/15 rounded-2xl bg-[#111] overflow-hidden group hover:border-[#C9A84C]/40 transition-colors">
                  <div className="h-32 relative">
                    <Image src={v.img} alt={v.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111] to-transparent" />
                  </div>
                  <div className="p-5 relative -mt-6">
                    <div className="flex justify-between items-end mb-2">
                      <h3 className="font-bold text-lg">{v.name}</h3>
                      <p className="font-heading text-xl font-bold text-[#C9A84C]">SAR {prices[v.key as keyof typeof prices]}</p>
                    </div>
                    <div className="flex gap-4 text-[0.65rem] text-[#A1A1A6] font-bold uppercase tracking-wider">
                      <span>{v.pax} Passengers</span>
                      <span>{v.luggage} Luggage</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Route Tips */}
          <section className="bg-[#111] border border-[#C9A84C]/15 rounded-3xl p-8">
            <h2 className="font-heading text-2xl font-bold mb-6 flex items-center gap-3">
              <AlertTriangle className="text-[#C9A84C]" />
              Route Tips & Information
            </h2>
            <ul className="space-y-4">
              <li className="flex gap-4">
                <CheckCircle2 className="h-5 w-5 text-[#C9A84C] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm">All-Inclusive Fixed Price</h4>
                  <p className="text-xs text-[#A1A1A6] mt-1">The price you see is the price you pay. No hidden fees, no surge pricing, tolls and taxes included.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <CheckCircle2 className="h-5 w-5 text-[#C9A84C] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm">Meet & Greet Service</h4>
                  <p className="text-xs text-[#A1A1A6] mt-1">Your driver will wait at the pickup location holding a name sign with your name on it.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <ShieldCheck className="h-5 w-5 text-[#C9A84C] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm">Professional & Licensed</h4>
                  <p className="text-xs text-[#A1A1A6] mt-1">All drivers are fully licensed by the Saudi Ministry of Transport, speak English and Arabic, and are trained for professional service.</p>
                </div>
              </li>
            </ul>
          </section>

          {/* FAQs */}
          <section>
            <h2 className="font-heading text-2xl font-bold mb-6 flex items-center gap-3">
              <HelpCircle className="text-[#C9A84C]" />
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div key={idx} className="border border-[#C9A84C]/15 rounded-2xl p-5 bg-[#111]">
                  <h4 className="font-bold text-sm mb-2">{faq.question}</h4>
                  <p className="text-xs text-[#A1A1A6] leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* ─── RIGHT COLUMN (Booking Widget) ──────────────────────── */}
        <div className="lg:col-span-1">
          <div className="sticky top-[100px] bg-[#111] border border-[#C9A84C]/30 rounded-3xl p-6 shadow-[0_8px_30px_rgba(201,168,76,0.1)]">
            <h3 className="font-heading text-xl font-bold mb-4">Book This Route</h3>
            
            <div className="space-y-4 mb-8">
              <div className="bg-[#0A0A0A] p-4 rounded-xl border border-[#C9A84C]/10 relative">
                <div className="absolute left-6 top-6 bottom-6 w-px bg-[#C9A84C]/30" />
                
                <div className="flex items-center gap-3 mb-6 relative z-10">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#C9A84C] outline outline-4 outline-[#111]" />
                  <div>
                    <p className="text-[0.6rem] text-[#7C8088] font-bold uppercase tracking-wider">Pickup</p>
                    <p className="font-bold text-sm truncate">{route.fromCity}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 relative z-10">
                  <div className="w-2.5 h-2.5 rounded-full bg-white outline outline-4 outline-[#111]" />
                  <div>
                    <p className="text-[0.6rem] text-[#7C8088] font-bold uppercase tracking-wider">Dropoff</p>
                    <p className="font-bold text-sm truncate">{route.toCity}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center px-2">
                <span className="text-sm font-bold text-[#A1A1A6]">Starting from</span>
                <span className="font-heading text-2xl font-bold text-[#C9A84C]">SAR {route.basePrice}</span>
              </div>
            </div>

            <div className="space-y-3">
              <Link
                href={`/book?pickup=${encodeURIComponent(route.fromCity)}&dropoff=${encodeURIComponent(route.toCity)}`}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#C9A84C] py-3.5 text-xs font-bold uppercase tracking-wider text-[#0A0A0A] hover:bg-[#B8963B] transition-all"
              >
                Proceed to Booking <ArrowRight className="h-4 w-4" />
              </Link>
              
              <a
                href={`https://wa.me/${contactConfig.whatsappNumber}?text=Salam, I want to book the route from ${route.fromCity} to ${route.toCity}.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-full border border-[#C9A84C]/30 py-3.5 text-xs font-bold uppercase tracking-wider text-[#C9A84C] hover:bg-[#C9A84C]/10 transition-all"
              >
                Book via WhatsApp
              </a>
            </div>
            
            <p className="text-center text-[0.6rem] text-[#7C8088] mt-4">Free cancellation up to 24h before pickup</p>
          </div>
        </div>
      </div>
    </main>
  );
}
