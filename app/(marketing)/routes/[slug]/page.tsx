export const revalidate = 86400; // static + refresh daily (was force-dynamic = ~16s server render on every request)

import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ROUTES_DATA } from "@/lib/data/routes";
import { Metadata } from "next";
import { MapPin, Clock, ArrowRight, CheckCircle2, ShieldCheck, Car, HelpCircle, AlertTriangle, ChevronRight } from "lucide-react";
import Link from "next/link";
import { contactConfig } from "@/lib/config/contact";
import Image from "next/image";
import { breadcrumbSchema, faqSchema, SITE } from "@/lib/schema";
import { TLDRSummary } from "@/components/seo/TLDRSummary";
import { RouteRelatedLinks } from "@/components/seo/RouteRelatedLinks";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Pre-render every route page at build time so they load instantly and get
// indexed reliably (previously each one server-rendered on every request).
export function generateStaticParams() {
  return ROUTES_DATA.map((r) => ({ slug: r.slug }));
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

  // ─── Jeddah corridors ───
  "jeddah-to-taif": {
    tldr: "A taxi from Jeddah to Taif is about 170 km and takes around 2 hours via the Al Hada mountain road. The fare is fixed from SAR 200, with experienced drivers for the scenic, winding climb to the City of Roses.",
    tldrFacts: [
      { label: "Distance", value: "~170 km" },
      { label: "Time", value: "~2 hours" },
      { label: "From", value: "SAR 200" },
      { label: "Hours", value: "24/7" },
    ],
    faqs: [
      { question: "How long is the taxi from Jeddah to Taif?", answer: "Jeddah to Taif is about 170 km and takes roughly 2 hours, climbing the scenic Al Hada mountain road to the cool highlands of Taif." },
      { question: "How much is a taxi from Jeddah to Taif?", answer: "The fare is fixed from SAR 200 for a sedan, with SUVs and vans available. The exact price is confirmed before booking, with tolls included and no surge." },
      { question: "Is the Al Hada mountain road safe by taxi?", answer: "Yes. Our drivers are experienced on the steep, winding Al Hada route. An SUV is a comfortable choice for families on the climb." },
    ],
  },
  "jeddah-airport-to-taif": {
    tldr: "A taxi from Jeddah Airport (JED) to Taif is about 180 km and takes roughly 2 hours 10 minutes. The fare is fixed from SAR 220, with meet & greet at arrivals and a direct transfer up the Al Hada road.",
    tldrFacts: [
      { label: "Distance", value: "~180 km" },
      { label: "Time", value: "~2 hr 10 min" },
      { label: "From", value: "SAR 220" },
      { label: "Hours", value: "24/7" },
    ],
    faqs: [
      { question: "How far is Jeddah airport from Taif?", answer: "King Abdulaziz International Airport (JED) is about 180 km from Taif — roughly a 2 hour 10 minute drive via the Al Hada mountain road." },
      { question: "How much is the Jeddah airport to Taif taxi?", answer: "The fare is fixed from SAR 220 for a sedan, confirmed before booking. SUVs and vans are available for families and luggage, with tolls included." },
      { question: "Is meet & greet included at Jeddah airport?", answer: "Yes. We track your flight and the driver waits at arrivals with a name sign, then takes you directly to Taif, 24/7." },
    ],
  },
  "jeddah-to-riyadh": {
    tldr: "A taxi from Jeddah to Riyadh is about 950 km and takes roughly 9 hours across the Kingdom. The fare is fixed from SAR 600, door-to-door, with rest and prayer stops included for the long-distance journey.",
    tldrFacts: [
      { label: "Distance", value: "~950 km" },
      { label: "Time", value: "~9 hours" },
      { label: "From", value: "SAR 600" },
      { label: "Hours", value: "24/7" },
    ],
    faqs: [
      { question: "How long is the drive from Jeddah to Riyadh?", answer: "Jeddah to Riyadh is about 950 km — roughly a 9-hour drive on Highway 40. We include rest and prayer stops along the way." },
      { question: "How much is a taxi from Jeddah to Riyadh?", answer: "The fare is fixed from SAR 600 for a sedan, with SUVs and vans for families and luggage. The price is confirmed before booking, with no surge." },
      { question: "Is a one-way long-distance transfer comfortable?", answer: "Yes. We use comfortable, air-conditioned vehicles and the driver takes rest stops, making the long cross-Kingdom journey far easier than self-driving." },
    ],
  },
  "jeddah-to-kaec": {
    tldr: "A taxi from Jeddah to King Abdullah Economic City (KAEC) is about 120 km and takes around 1 hour 20 minutes on the coastal highway. The fare is fixed from SAR 200, ideal for business visits to the King Abdullah Port and industrial zones.",
    tldrFacts: [
      { label: "Distance", value: "~120 km" },
      { label: "Time", value: "~1 hr 20 min" },
      { label: "From", value: "SAR 200" },
      { label: "Hours", value: "24/7" },
    ],
    faqs: [
      { question: "How far is KAEC from Jeddah?", answer: "King Abdullah Economic City (KAEC) is about 120 km north of Jeddah on the Red Sea coastal highway — roughly a 1 hour 20 minute drive." },
      { question: "How much is a taxi from Jeddah to KAEC?", answer: "The fare is fixed from SAR 200 for a sedan, confirmed before booking. Corporate sedans and SUVs are available for business travel." },
      { question: "Do you serve King Abdullah Port and business visitors?", answer: "Yes. We provide corporate transfers to KAEC for the port, industrial zones, and business meetings, with professional drivers 24/7." },
    ],
  },
  "jeddah-airport-to-kaec": {
    tldr: "A taxi from Jeddah Airport (JED) to King Abdullah Economic City (KAEC) is about 100 km and takes around 1 hour 10 minutes. The fare is fixed from SAR 180, with meet & greet at arrivals for business travellers.",
    tldrFacts: [
      { label: "Distance", value: "~100 km" },
      { label: "Time", value: "~1 hr 10 min" },
      { label: "From", value: "SAR 180" },
      { label: "Hours", value: "24/7" },
    ],
    faqs: [
      { question: "How far is KAEC from Jeddah airport?", answer: "King Abdullah Economic City is about 100 km from King Abdulaziz International Airport (JED) — roughly a 1 hour 10 minute drive on the coastal highway." },
      { question: "How much is the Jeddah airport to KAEC taxi?", answer: "The fare is fixed from SAR 180 for a sedan, confirmed before booking, with corporate sedans and SUVs available for business travellers." },
      { question: "Is the driver waiting at the airport?", answer: "Yes. We track your flight and the driver meets you at arrivals with a name sign, then takes you directly to KAEC, 24/7." },
    ],
  },
  "jeddah-to-yanbu": {
    tldr: "A taxi from Jeddah to Yanbu is about 330 km and takes roughly 3 hours on the Red Sea coastal highway. The fare is fixed from SAR 300, door-to-door, suitable for divers, business visitors, and onward pilgrim travel.",
    tldrFacts: [
      { label: "Distance", value: "~330 km" },
      { label: "Time", value: "~3 hours" },
      { label: "From", value: "SAR 300" },
      { label: "Hours", value: "24/7" },
    ],
    faqs: [
      { question: "How far is Jeddah from Yanbu?", answer: "Jeddah to Yanbu is about 330 km — roughly a 3-hour drive along the Red Sea coastal highway." },
      { question: "How much is a taxi from Jeddah to Yanbu?", answer: "The fare is fixed from SAR 300 for a sedan, with SUVs and vans available. The price is confirmed before booking, with no surge." },
      { question: "Do you serve both Yanbu city and the Industrial City?", answer: "Yes. Tell us whether you need Yanbu Al-Bahr (the city) or Yanbu Industrial City, as the two areas are far apart, and the driver will take you directly." },
    ],
  },

  // ─── Riyadh corridors ───
  "riyadh-airport-to-city": {
    tldr: "A taxi from Riyadh Airport (RUH) to the city is about 35 km and takes around 45 minutes. The fare is fixed from SAR 100, with meet & greet at arrivals and direct drop-off to any Riyadh district, 24/7.",
    tldrFacts: [
      { label: "Distance", value: "~35 km" },
      { label: "Time", value: "~45 min" },
      { label: "From", value: "SAR 100" },
      { label: "Hours", value: "24/7" },
    ],
    faqs: [
      { question: "How much is a taxi from Riyadh airport to the city?", answer: "The fare is fixed from SAR 100 to central Riyadh districts like Olaya or KAFD. King Khalid International Airport (RUH) is about 35 km from the centre, roughly a 45-minute drive." },
      { question: "Is there a taxi at Riyadh airport 24/7?", answer: "Yes. We operate around the clock at RUH and track your flight, so the driver waits at arrivals with a name sign even for late or delayed flights." },
      { question: "Can the driver take me to any Riyadh district?", answer: "Yes — KAFD, Olaya, the Diplomatic Quarter, and all other districts. Share your exact address when booking so the driver plans the best route." },
    ],
  },
  "riyadh-to-dammam": {
    tldr: "A taxi from Riyadh to Dammam is about 390 km and takes roughly 3.5 hours on Highway 40. The fare is fixed from SAR 300, door-to-door, popular with executives travelling to the Eastern Province.",
    tldrFacts: [
      { label: "Distance", value: "~390 km" },
      { label: "Time", value: "~3.5 hours" },
      { label: "From", value: "SAR 300" },
      { label: "Hours", value: "24/7" },
    ],
    faqs: [
      { question: "How long is the taxi from Riyadh to Dammam?", answer: "Riyadh to Dammam is about 390 km — roughly a 3.5-hour drive on Highway 40, with rest stops on request." },
      { question: "How much is a taxi from Riyadh to Dammam?", answer: "The fare is fixed from SAR 300 for a sedan, with SUVs and vans available. The exact price is confirmed before booking, with no surge." },
      { question: "Can I book a corporate car for this route?", answer: "Yes. We offer executive sedans and SUVs with professional drivers for the Riyadh–Dammam corporate corridor, with hourly and one-way options." },
    ],
  },
  "riyadh-to-alkhobar": {
    tldr: "A taxi from Riyadh to Al Khobar is about 400 km and takes roughly 3 hours 40 minutes on Highway 40. The fare is fixed from SAR 320, door-to-door to the Eastern Province waterfront city.",
    tldrFacts: [
      { label: "Distance", value: "~400 km" },
      { label: "Time", value: "~3 hr 40 min" },
      { label: "From", value: "SAR 320" },
      { label: "Hours", value: "24/7" },
    ],
    faqs: [
      { question: "How far is Riyadh from Al Khobar?", answer: "Riyadh to Al Khobar is about 400 km — roughly a 3 hour 40 minute drive on Highway 40 towards the Eastern Province." },
      { question: "How much is a taxi from Riyadh to Al Khobar?", answer: "The fare is fixed from SAR 320 for a sedan, confirmed before booking, with SUVs and vans for families and luggage." },
      { question: "Does this route also serve Dammam and Dhahran?", answer: "Yes. Al Khobar, Dammam, and Dhahran form one metro area, so we can drop you anywhere across the three cities — just confirm your district." },
    ],
  },
  "riyadh-to-alula": {
    tldr: "A taxi from Riyadh to AlUla is about 1050 km and takes roughly 10 hours. The fare is fixed from SAR 1000 for this premium long-distance heritage transfer, with rest stops and comfortable vehicles for the desert journey.",
    tldrFacts: [
      { label: "Distance", value: "~1050 km" },
      { label: "Time", value: "~10 hours" },
      { label: "From", value: "SAR 1000" },
      { label: "Hours", value: "24/7" },
    ],
    faqs: [
      { question: "How long is the drive from Riyadh to AlUla?", answer: "Riyadh to AlUla is about 1050 km — roughly a 10-hour drive. Many travellers prefer to fly, but we offer a comfortable premium road transfer with rest stops." },
      { question: "How much is a taxi from Riyadh to AlUla?", answer: "The fare is fixed from SAR 1000 for this long-distance heritage transfer, confirmed before booking. SUVs are recommended for comfort over the long journey." },
      { question: "Is it better to fly or drive to AlUla?", answer: "Flying to AlUla (ULH) is faster, but a private car is door-to-door and lets you stop along the way. For comfort on the road, we recommend an SUV." },
    ],
  },
  "riyadh-to-buraydah": {
    tldr: "A taxi from Riyadh to Buraydah, the Qassim capital, is about 350 km and takes roughly 3 hours 10 minutes. The fare is fixed from SAR 280, door-to-door, with rest stops on request.",
    tldrFacts: [
      { label: "Distance", value: "~350 km" },
      { label: "Time", value: "~3 hr 10 min" },
      { label: "From", value: "SAR 280" },
      { label: "Hours", value: "24/7" },
    ],
    faqs: [
      { question: "How far is Riyadh from Buraydah?", answer: "Riyadh to Buraydah, the capital of the Qassim region, is about 350 km — roughly a 3 hour 10 minute drive north." },
      { question: "How much is a taxi from Riyadh to Buraydah?", answer: "The fare is fixed from SAR 280 for a sedan, confirmed before booking, with SUVs and vans available for families." },
      { question: "Do you cover the Qassim region?", answer: "Yes. We serve Buraydah, Unaizah, and the wider Qassim region with fixed-price intercity transfers from Riyadh, 24/7." },
    ],
  },
  "riyadh-to-jeddah": {
    tldr: "A taxi from Riyadh to Jeddah is about 950 km and takes roughly 9 hours across the Kingdom. The fare is fixed from SAR 600, door-to-door, with rest and prayer stops included on the long-distance journey.",
    tldrFacts: [
      { label: "Distance", value: "~950 km" },
      { label: "Time", value: "~9 hours" },
      { label: "From", value: "SAR 600" },
      { label: "Hours", value: "24/7" },
    ],
    faqs: [
      { question: "How long is the drive from Riyadh to Jeddah?", answer: "Riyadh to Jeddah is about 950 km — roughly a 9-hour drive on Highway 40, with rest and prayer stops along the way." },
      { question: "How much is a taxi from Riyadh to Jeddah?", answer: "The fare is fixed from SAR 600 for a sedan, with SUVs and vans for families and luggage. The price is confirmed before booking, with no surge." },
      { question: "Is a long-distance car better than flying?", answer: "Flying is faster, but a private car is door-to-door with no airport check-in. For groups with luggage it can be convenient and comfortable with rest stops." },
    ],
  },
  "riyadh-to-makkah": {
    tldr: "A taxi from Riyadh to Makkah is about 870 km and takes roughly 8 hours. The fare is fixed from SAR 550, door-to-door, with prayer and rest stops and a Miqat stop for Ihram on request.",
    tldrFacts: [
      { label: "Distance", value: "~870 km" },
      { label: "Time", value: "~8 hours" },
      { label: "From", value: "SAR 550" },
      { label: "Hours", value: "24/7" },
    ],
    faqs: [
      { question: "How long is the drive from Riyadh to Makkah?", answer: "Riyadh to Makkah is about 870 km — roughly an 8-hour drive. We include prayer and rest stops, and a Miqat stop for Ihram if you are performing Umrah." },
      { question: "How much is a taxi from Riyadh to Makkah?", answer: "The fare is fixed from SAR 550 for a sedan, confirmed before booking, with SUVs and vans for families and luggage." },
      { question: "Can the driver stop at the Miqat for Ihram?", answer: "Yes. Tell us in advance and the driver will stop at the relevant Miqat (Qarn Al-Manazil for those coming from Najd) so you can enter Ihram." },
    ],
  },
  "riyadh-to-madinah": {
    tldr: "A taxi from Riyadh to Madinah is about 840 km and takes roughly 7.5 hours. The fare is fixed from SAR 550, door-to-door to your Madinah hotel, with prayer and rest stops included.",
    tldrFacts: [
      { label: "Distance", value: "~840 km" },
      { label: "Time", value: "~7.5 hours" },
      { label: "From", value: "SAR 550" },
      { label: "Hours", value: "24/7" },
    ],
    faqs: [
      { question: "How long is the drive from Riyadh to Madinah?", answer: "Riyadh to Madinah is about 840 km — roughly a 7.5-hour drive, with prayer and rest stops along the way." },
      { question: "How much is a taxi from Riyadh to Madinah?", answer: "The fare is fixed from SAR 550 for a sedan, confirmed before booking, with SUVs and vans for families and luggage." },
      { question: "Can you drop me at my hotel near Masjid an-Nabawi?", answer: "Yes. We provide door-to-door transfer to your Central Area (Markazia) hotel, handling any prayer-time road restrictions near the Haram." },
    ],
  },
  "riyadh-to-alahsa": {
    tldr: "A taxi from Riyadh to Al Ahsa, the world's largest oasis, is about 330 km and takes roughly 3 hours. The fare is fixed from SAR 280, door-to-door, ideal for visiting the UNESCO-listed palm groves and heritage sites.",
    tldrFacts: [
      { label: "Distance", value: "~330 km" },
      { label: "Time", value: "~3 hours" },
      { label: "From", value: "SAR 280" },
      { label: "Hours", value: "24/7" },
    ],
    faqs: [
      { question: "How far is Riyadh from Al Ahsa?", answer: "Riyadh to Al Ahsa (Hofuf) is about 330 km — roughly a 3-hour drive east towards the Eastern Province oasis." },
      { question: "How much is a taxi from Riyadh to Al Ahsa?", answer: "The fare is fixed from SAR 280 for a sedan, confirmed before booking, with SUVs and vans available for families and groups." },
      { question: "Is Al Ahsa worth visiting?", answer: "Yes. Al Ahsa is a UNESCO World Heritage oasis with vast palm groves, springs, and heritage sites. A full-day car lets you explore the highlights comfortably." },
    ],
  },
  "riyadh-to-hail": {
    tldr: "A taxi from Riyadh to Hail is about 600 km and takes roughly 5.5 hours on the northern highway. The fare is fixed from SAR 450, door-to-door, with rest stops included for the long-distance journey.",
    tldrFacts: [
      { label: "Distance", value: "~600 km" },
      { label: "Time", value: "~5.5 hours" },
      { label: "From", value: "SAR 450" },
      { label: "Hours", value: "24/7" },
    ],
    faqs: [
      { question: "How far is Riyadh from Hail?", answer: "Riyadh to Hail is about 600 km — roughly a 5.5-hour drive on the northern highway, with rest stops on request." },
      { question: "How much is a taxi from Riyadh to Hail?", answer: "The fare is fixed from SAR 450 for a sedan, confirmed before booking, with SUVs and vans available for families and luggage." },
      { question: "Are rest stops included on the way to Hail?", answer: "Yes. On this long-distance route the driver includes stops for prayer, food, and rest to keep the journey comfortable." },
    ],
  },

  // ─── Madinah corridors ───
  "madinah-to-jeddah": {
    tldr: "A taxi from Madinah to Jeddah is about 420 km and takes roughly 4 hours via the Haramain highway. The fare is fixed from SAR 350, door-to-door from your Madinah hotel, with rest stops on request.",
    tldrFacts: [
      { label: "Distance", value: "~420 km" },
      { label: "Time", value: "~4 hours" },
      { label: "From", value: "SAR 350" },
      { label: "Hours", value: "24/7" },
    ],
    faqs: [
      { question: "How far is Madinah from Jeddah?", answer: "Madinah to Jeddah is about 420 km — roughly a 4-hour drive on the Haramain highway." },
      { question: "How much is a taxi from Madinah to Jeddah?", answer: "The fare is fixed from SAR 350 for a sedan, confirmed before booking, with SUVs and vans for families and luggage." },
      { question: "Do you pick up from my Madinah hotel?", answer: "Yes. We provide door-to-door pickup from your hotel near Masjid an-Nabawi and take you directly to your Jeddah address, 24/7." },
    ],
  },
  "madinah-to-yanbu": {
    tldr: "A taxi from Madinah to Yanbu is about 220 km and takes roughly 2 hours 10 minutes. The fare is fixed from SAR 200, door-to-door, popular for onward Red Sea coastal travel and diving trips.",
    tldrFacts: [
      { label: "Distance", value: "~220 km" },
      { label: "Time", value: "~2 hr 10 min" },
      { label: "From", value: "SAR 200" },
      { label: "Hours", value: "24/7" },
    ],
    faqs: [
      { question: "How far is Madinah from Yanbu?", answer: "Madinah to Yanbu is about 220 km — roughly a 2 hour 10 minute drive towards the Red Sea coast." },
      { question: "How much is a taxi from Madinah to Yanbu?", answer: "The fare is fixed from SAR 200 for a sedan, confirmed before booking, with SUVs and vans available." },
      { question: "Do you serve Yanbu Industrial City too?", answer: "Yes. Tell us whether you need Yanbu Al-Bahr or the Industrial City, as the two are far apart, and the driver will take you directly." },
    ],
  },
  "madinah-to-alula": {
    tldr: "A taxi from Madinah to AlUla is about 330 km and takes roughly 3 hours. The fare is fixed from SAR 400, door-to-door, popular with pilgrims adding a heritage trip to Hegra and the Old Town after Ziyarah.",
    tldrFacts: [
      { label: "Distance", value: "~330 km" },
      { label: "Time", value: "~3 hours" },
      { label: "From", value: "SAR 400" },
      { label: "Hours", value: "24/7" },
    ],
    faqs: [
      { question: "How far is Madinah from AlUla?", answer: "Madinah to AlUla is about 330 km — roughly a 3-hour drive, making it an easy heritage trip after visiting Madinah." },
      { question: "How much is a taxi from Madinah to AlUla?", answer: "The fare is fixed from SAR 400 for a sedan, confirmed before booking, with SUVs recommended for comfort and luggage." },
      { question: "Can I combine Ziyarah with an AlUla heritage trip?", answer: "Yes. Many pilgrims travel from Madinah to AlUla to visit Hegra, Dadan, and the Old Town. We can arrange the transfer and onward sightseeing." },
    ],
  },
  "madinah-to-riyadh": {
    tldr: "A taxi from Madinah to Riyadh is about 840 km and takes roughly 7.5 hours. The fare is fixed from SAR 550, door-to-door, with prayer and rest stops included on the long-distance journey.",
    tldrFacts: [
      { label: "Distance", value: "~840 km" },
      { label: "Time", value: "~7.5 hours" },
      { label: "From", value: "SAR 550" },
      { label: "Hours", value: "24/7" },
    ],
    faqs: [
      { question: "How long is the drive from Madinah to Riyadh?", answer: "Madinah to Riyadh is about 840 km — roughly a 7.5-hour drive, with prayer and rest stops along the way." },
      { question: "How much is a taxi from Madinah to Riyadh?", answer: "The fare is fixed from SAR 550 for a sedan, confirmed before booking, with SUVs and vans for families and luggage." },
      { question: "Is this comfortable for families?", answer: "Yes. We use spacious, air-conditioned SUVs and vans for long trips, and the driver takes regular rest stops for comfort." },
    ],
  },
  "madinah-to-tabuk": {
    tldr: "A taxi from Madinah to Tabuk is about 620 km and takes roughly 5.5 hours on the northern highway. The fare is fixed from SAR 500, door-to-door, with rest stops included for the long journey north.",
    tldrFacts: [
      { label: "Distance", value: "~620 km" },
      { label: "Time", value: "~5.5 hours" },
      { label: "From", value: "SAR 500" },
      { label: "Hours", value: "24/7" },
    ],
    faqs: [
      { question: "How far is Madinah from Tabuk?", answer: "Madinah to Tabuk is about 620 km — roughly a 5.5-hour drive on the northern highway towards the Tabuk region and NEOM." },
      { question: "How much is a taxi from Madinah to Tabuk?", answer: "The fare is fixed from SAR 500 for a sedan, confirmed before booking, with SUVs and vans for families and luggage." },
      { question: "Can I continue to NEOM from Tabuk?", answer: "Yes. Tabuk is the main gateway to the NEOM region, and we can arrange onward transfers to the project zones and the Red Sea coast." },
    ],
  },
  "madinah-to-taif": {
    tldr: "A taxi from Madinah to Taif is about 480 km and takes roughly 4.5 hours, ending on the scenic Al Hada mountain road. The fare is fixed from SAR 400, door-to-door, with rest stops on request.",
    tldrFacts: [
      { label: "Distance", value: "~480 km" },
      { label: "Time", value: "~4.5 hours" },
      { label: "From", value: "SAR 400" },
      { label: "Hours", value: "24/7" },
    ],
    faqs: [
      { question: "How far is Madinah from Taif?", answer: "Madinah to Taif is about 480 km — roughly a 4.5-hour drive, finishing with the scenic mountain climb into Taif." },
      { question: "How much is a taxi from Madinah to Taif?", answer: "The fare is fixed from SAR 400 for a sedan, confirmed before booking, with SUVs and vans available for families." },
      { question: "Are rest stops included?", answer: "Yes. On this long route the driver includes prayer and rest stops, and an SUV is recommended for comfort on the mountain section." },
    ],
  },

  // ─── Makkah corridors ───
  "makkah-to-madinah-airport": {
    tldr: "A taxi from Makkah to Madinah Airport (MED) is about 450 km and takes roughly 4.5 hours. The fare is fixed from SAR 400, door-to-door from your Makkah hotel, with prayer and rest stops for departing pilgrims.",
    tldrFacts: [
      { label: "Distance", value: "~450 km" },
      { label: "Time", value: "~4.5 hours" },
      { label: "From", value: "SAR 400" },
      { label: "Hours", value: "24/7" },
    ],
    faqs: [
      { question: "How far is Makkah from Madinah airport?", answer: "Makkah to Prince Mohammad Bin Abdulaziz Airport (MED) is about 450 km — roughly a 4.5-hour drive on the Haramain highway." },
      { question: "How much is a taxi from Makkah to Madinah airport?", answer: "The fare is fixed from SAR 400 for a sedan, confirmed before booking, with SUVs and vans for families and luggage." },
      { question: "Will I have time for my flight?", answer: "Yes. We recommend departing Makkah with comfortable buffer time, and the driver takes you directly to MED departures, with rest stops if needed." },
    ],
  },
  "makkah-to-riyadh": {
    tldr: "A taxi from Makkah to Riyadh is about 870 km and takes roughly 8 hours. The fare is fixed from SAR 550, door-to-door, with prayer and rest stops included for the long-distance journey to the capital.",
    tldrFacts: [
      { label: "Distance", value: "~870 km" },
      { label: "Time", value: "~8 hours" },
      { label: "From", value: "SAR 550" },
      { label: "Hours", value: "24/7" },
    ],
    faqs: [
      { question: "How long is the drive from Makkah to Riyadh?", answer: "Makkah to Riyadh is about 870 km — roughly an 8-hour drive, with prayer and rest stops along the way." },
      { question: "How much is a taxi from Makkah to Riyadh?", answer: "The fare is fixed from SAR 550 for a sedan, confirmed before booking, with SUVs and vans for families and luggage." },
      { question: "Is this route comfortable for a family?", answer: "Yes. We use spacious, air-conditioned SUVs and vans for long trips, and the driver takes regular rest stops for comfort." },
    ],
  },
  "makkah-to-kaec": {
    tldr: "A taxi from Makkah to King Abdullah Economic City (KAEC) is about 180 km and takes roughly 1 hour 50 minutes. The fare is fixed from SAR 250, door-to-door, ideal for business travel to the Red Sea coast.",
    tldrFacts: [
      { label: "Distance", value: "~180 km" },
      { label: "Time", value: "~1 hr 50 min" },
      { label: "From", value: "SAR 250" },
      { label: "Hours", value: "24/7" },
    ],
    faqs: [
      { question: "How far is Makkah from KAEC?", answer: "Makkah to King Abdullah Economic City (KAEC) is about 180 km — roughly a 1 hour 50 minute drive towards the Red Sea coast." },
      { question: "How much is a taxi from Makkah to KAEC?", answer: "The fare is fixed from SAR 250 for a sedan, confirmed before booking, with corporate sedans and SUVs available." },
      { question: "Do you serve King Abdullah Port?", answer: "Yes. We provide corporate transfers to KAEC for the port, industrial zones, and business meetings, with professional drivers 24/7." },
    ],
  },
  "makkah-to-yanbu": {
    tldr: "A taxi from Makkah to Yanbu is about 400 km and takes roughly 3 hours 40 minutes on the coastal route. The fare is fixed from SAR 350, door-to-door, with rest stops on request.",
    tldrFacts: [
      { label: "Distance", value: "~400 km" },
      { label: "Time", value: "~3 hr 40 min" },
      { label: "From", value: "SAR 350" },
      { label: "Hours", value: "24/7" },
    ],
    faqs: [
      { question: "How far is Makkah from Yanbu?", answer: "Makkah to Yanbu is about 400 km — roughly a 3 hour 40 minute drive towards the Red Sea coast." },
      { question: "How much is a taxi from Makkah to Yanbu?", answer: "The fare is fixed from SAR 350 for a sedan, confirmed before booking, with SUVs and vans available for families." },
      { question: "Are rest stops included on this route?", answer: "Yes. The driver includes prayer and rest stops, and tells us whether you need Yanbu city or the Industrial City for a direct drop-off." },
    ],
  },

  // ─── GCC border crossings ───
  "riyadh-to-dubai": {
    tldr: "A taxi from Riyadh to Dubai is about 990 km and takes roughly 9 hours plus the Saudi–UAE border crossing. The fare is fixed from SAR 1200, with documentation support and a comfortable vehicle for the cross-border journey.",
    tldrFacts: [
      { label: "Distance", value: "~990 km" },
      { label: "Time", value: "~9 hours + border" },
      { label: "From", value: "SAR 1200" },
      { label: "Hours", value: "24/7" },
    ],
    faqs: [
      { question: "How long is the taxi from Riyadh to Dubai?", answer: "Riyadh to Dubai is about 990 km — roughly a 9-hour drive plus time at the Saudi–UAE border (Al Batha crossing)." },
      { question: "What documents do I need for the border?", answer: "You need a valid passport and the correct UAE entry visa or eligibility. Share your details in advance so we can advise and prepare for a smooth crossing." },
      { question: "How much is a taxi from Riyadh to Dubai?", answer: "The fare is fixed from SAR 1200, confirmed before booking. We use comfortable vehicles suited to the long cross-border journey." },
    ],
  },
  "dammam-to-doha": {
    tldr: "A taxi from Dammam to Doha is about 400 km and takes roughly 4 hours plus the Saudi–Qatar border crossing at Salwa. The fare is fixed from SAR 500, with documentation support for a smooth crossing.",
    tldrFacts: [
      { label: "Distance", value: "~400 km" },
      { label: "Time", value: "~4 hours + border" },
      { label: "From", value: "SAR 500" },
      { label: "Hours", value: "24/7" },
    ],
    faqs: [
      { question: "How far is Dammam from Doha?", answer: "Dammam to Doha is about 400 km — roughly a 4-hour drive plus time at the Saudi–Qatar border crossing at Salwa." },
      { question: "What do I need to cross into Qatar?", answer: "A valid passport and the correct Qatar entry permit or visa. Share your details in advance so we can prepare for a smooth border crossing." },
      { question: "How much is a taxi from Dammam to Doha?", answer: "The fare is fixed from SAR 500, confirmed before booking, with comfortable vehicles for the cross-border journey." },
    ],
  },
  "riyadh-to-doha": {
    tldr: "A taxi from Riyadh to Doha is about 580 km and takes roughly 5.5 hours plus the Saudi–Qatar border crossing at Salwa. The fare is fixed from SAR 800, with documentation support for the cross-border trip.",
    tldrFacts: [
      { label: "Distance", value: "~580 km" },
      { label: "Time", value: "~5.5 hours + border" },
      { label: "From", value: "SAR 800" },
      { label: "Hours", value: "24/7" },
    ],
    faqs: [
      { question: "How far is Riyadh from Doha?", answer: "Riyadh to Doha is about 580 km — roughly a 5.5-hour drive plus time at the Salwa border crossing into Qatar." },
      { question: "What documents are needed for Qatar?", answer: "A valid passport and the correct Qatar visa or entry permit. Send your details in advance so we can advise and prepare for the crossing." },
      { question: "How much is a taxi from Riyadh to Doha?", answer: "The fare is fixed from SAR 800, confirmed before booking, with comfortable vehicles for the long cross-border journey." },
    ],
  },
  "dammam-to-manama": {
    tldr: "A taxi from Dammam to Manama, Bahrain is about 70 km and takes roughly 1 hour across the King Fahd Causeway. The fare is fixed from SAR 200, with border documentation support for a quick, smooth crossing.",
    tldrFacts: [
      { label: "Distance", value: "~70 km" },
      { label: "Time", value: "~1 hour" },
      { label: "From", value: "SAR 200" },
      { label: "Hours", value: "24/7" },
    ],
    faqs: [
      { question: "How long is the taxi from Dammam to Bahrain?", answer: "Dammam to Manama is about 70 km — roughly a 1-hour drive across the King Fahd Causeway, plus border formalities." },
      { question: "What do I need to cross the Causeway?", answer: "A valid passport and the correct Bahrain entry eligibility or visa. Share your details in advance so we can prepare for a smooth crossing." },
      { question: "How much is a taxi from Dammam to Manama?", answer: "The fare is fixed from SAR 200, confirmed before booking, with comfortable vehicles and causeway toll handling." },
    ],
  },
  "alkhobar-to-manama": {
    tldr: "A taxi from Al Khobar to Manama, Bahrain is about 50 km and takes roughly 50 minutes across the King Fahd Causeway. The fare is fixed from SAR 180, with border documentation support for a quick crossing.",
    tldrFacts: [
      { label: "Distance", value: "~50 km" },
      { label: "Time", value: "~50 min" },
      { label: "From", value: "SAR 180" },
      { label: "Hours", value: "24/7" },
    ],
    faqs: [
      { question: "How far is Al Khobar from Bahrain?", answer: "Al Khobar to Manama is about 50 km — roughly a 50-minute drive across the King Fahd Causeway, plus border formalities." },
      { question: "What documents do I need for Bahrain?", answer: "A valid passport and the correct Bahrain entry eligibility or visa. Send your details in advance so we can advise and prepare for the crossing." },
      { question: "How much is a taxi from Al Khobar to Manama?", answer: "The fare is fixed from SAR 180, confirmed before booking, with comfortable vehicles and causeway toll handling." },
    ],
  },
  "riyadh-to-manama": {
    tldr: "A taxi from Riyadh to Manama, Bahrain is about 450 km and takes roughly 4.5 hours, crossing the King Fahd Causeway. The fare is fixed from SAR 600, with documentation support for the cross-border journey.",
    tldrFacts: [
      { label: "Distance", value: "~450 km" },
      { label: "Time", value: "~4.5 hours" },
      { label: "From", value: "SAR 600" },
      { label: "Hours", value: "24/7" },
    ],
    faqs: [
      { question: "How far is Riyadh from Bahrain?", answer: "Riyadh to Manama is about 450 km — roughly a 4.5-hour drive, crossing into Bahrain via the King Fahd Causeway." },
      { question: "What do I need to enter Bahrain?", answer: "A valid passport and the correct Bahrain entry eligibility or visa. Share your details in advance so we can prepare for a smooth crossing." },
      { question: "How much is a taxi from Riyadh to Manama?", answer: "The fare is fixed from SAR 600, confirmed before booking, with comfortable vehicles for the long cross-border journey." },
    ],
  },
  "dammam-to-kuwait": {
    tldr: "A taxi from Dammam to Kuwait City is about 410 km and takes roughly 4 hours plus the Saudi–Kuwait border crossing at Al Khafji. The fare is fixed from SAR 600, with documentation support for the crossing.",
    tldrFacts: [
      { label: "Distance", value: "~410 km" },
      { label: "Time", value: "~4 hours + border" },
      { label: "From", value: "SAR 600" },
      { label: "Hours", value: "24/7" },
    ],
    faqs: [
      { question: "How far is Dammam from Kuwait City?", answer: "Dammam to Kuwait City is about 410 km — roughly a 4-hour drive plus time at the Saudi–Kuwait border crossing at Al Khafji." },
      { question: "What documents are needed for Kuwait?", answer: "A valid passport and the correct Kuwait visa or entry permit. Send your details in advance so we can advise and prepare for the crossing." },
      { question: "How much is a taxi from Dammam to Kuwait?", answer: "The fare is fixed from SAR 600, confirmed before booking, with comfortable vehicles for the cross-border journey." },
    ],
  },
  "riyadh-to-abudhabi": {
    tldr: "A taxi from Riyadh to Abu Dhabi is about 850 km and takes roughly 8 hours plus the Saudi–UAE border crossing. The fare is fixed from SAR 1100, with documentation support and a comfortable vehicle for the journey.",
    tldrFacts: [
      { label: "Distance", value: "~850 km" },
      { label: "Time", value: "~8 hours + border" },
      { label: "From", value: "SAR 1100" },
      { label: "Hours", value: "24/7" },
    ],
    faqs: [
      { question: "How far is Riyadh from Abu Dhabi?", answer: "Riyadh to Abu Dhabi is about 850 km — roughly an 8-hour drive plus time at the Saudi–UAE border (Al Batha crossing)." },
      { question: "What do I need for the UAE border?", answer: "A valid passport and the correct UAE entry visa or eligibility. Share your details in advance so we can advise and prepare for a smooth crossing." },
      { question: "How much is a taxi from Riyadh to Abu Dhabi?", answer: "The fare is fixed from SAR 1100, confirmed before booking, with comfortable vehicles for the long cross-border journey." },
    ],
  },

  // ─── Tourism routes ───
  "alula-airport-to-resorts": {
    tldr: "A taxi from AlUla Airport (ULH) to the resorts is about 30 km and takes around 30 minutes. The fare is fixed from SAR 150, with meet & greet at arrivals and a smooth transfer to AlUla's luxury desert hotels.",
    tldrFacts: [
      { label: "Distance", value: "~30 km" },
      { label: "Time", value: "~30 min" },
      { label: "From", value: "SAR 150" },
      { label: "Hours", value: "24/7" },
    ],
    faqs: [
      { question: "How far is AlUla airport from the resorts?", answer: "AlUla International Airport (ULH) is about 30 km from the main resort area — roughly a 30-minute transfer." },
      { question: "How much is a taxi from AlUla airport to my resort?", answer: "The fare is fixed from SAR 150, confirmed before booking, with meet & greet at arrivals and SUVs available for luggage." },
      { question: "Can you arrange sightseeing after my transfer?", answer: "Yes. We offer onward trips to Hegra, Dadan, Elephant Rock, and the Old Town with a driver and flexible waiting time." },
    ],
  },
  "jeddah-to-alula": {
    tldr: "A taxi from Jeddah to AlUla is about 700 km and takes roughly 6.5 hours. The fare is fixed from SAR 800 for this coastal-to-desert heritage transfer, with rest stops and comfortable vehicles for the journey.",
    tldrFacts: [
      { label: "Distance", value: "~700 km" },
      { label: "Time", value: "~6.5 hours" },
      { label: "From", value: "SAR 800" },
      { label: "Hours", value: "24/7" },
    ],
    faqs: [
      { question: "How far is Jeddah from AlUla?", answer: "Jeddah to AlUla is about 700 km — roughly a 6.5-hour drive from the Red Sea coast to the desert heritage valley." },
      { question: "How much is a taxi from Jeddah to AlUla?", answer: "The fare is fixed from SAR 800, confirmed before booking, with SUVs recommended for comfort over the long journey." },
      { question: "Is it better to fly or drive to AlUla from Jeddah?", answer: "Flying to AlUla (ULH) is faster, but a private car is door-to-door with rest stops. For comfort on the road, we recommend an SUV." },
    ],
  },
  "tabuk-airport-to-neom": {
    tldr: "A taxi from Tabuk Airport (TUU) to NEOM is about 120 km and takes roughly 1 hour 20 minutes. The fare is fixed from SAR 200, with meet & greet at arrivals — the main gateway transfer into the NEOM project.",
    tldrFacts: [
      { label: "Distance", value: "~120 km" },
      { label: "Time", value: "~1 hr 20 min" },
      { label: "From", value: "SAR 200" },
      { label: "Hours", value: "24/7" },
    ],
    faqs: [
      { question: "How far is Tabuk airport from NEOM?", answer: "Tabuk Airport (TUU) is about 120 km from the NEOM zone — roughly a 1 hour 20 minute drive, and the main air gateway to the project." },
      { question: "How much is a taxi from Tabuk airport to NEOM?", answer: "The fare is fixed from SAR 200, confirmed before booking, with executive SUVs available for business visitors and contractors." },
      { question: "Do I need a permit for NEOM site access?", answer: "Some NEOM gates require access clearance. Confirm your permit in advance so the driver can take you to the correct entry point." },
    ],
  },
  "riyadh-to-neom": {
    tldr: "A taxi from Riyadh to NEOM is about 1300 km and takes roughly 12 hours. The fare is fixed from SAR 1500 for this elite long-distance transfer, with rest stops and an executive vehicle for the journey north.",
    tldrFacts: [
      { label: "Distance", value: "~1300 km" },
      { label: "Time", value: "~12 hours" },
      { label: "From", value: "SAR 1500" },
      { label: "Hours", value: "24/7" },
    ],
    faqs: [
      { question: "How far is Riyadh from NEOM?", answer: "Riyadh to NEOM is about 1300 km — roughly a 12-hour drive. Many travellers fly to Tabuk or NEOM Bay, but we offer a premium road transfer with rest stops." },
      { question: "How much is a taxi from Riyadh to NEOM?", answer: "The fare is fixed from SAR 1500 for this elite long-distance transfer, confirmed before booking, with executive SUVs for comfort." },
      { question: "Is flying better for Riyadh to NEOM?", answer: "Flying to Tabuk (TUU) or NEOM Bay (NUM) is much faster. We can arrange the airport transfer at the NEOM end, or a full road transfer if you prefer." },
    ],
  },
  "jeddah-to-neom": {
    tldr: "A taxi from Jeddah to NEOM is about 1000 km and takes roughly 9 hours along the Red Sea coast. The fare is fixed from SAR 1100 for this long-distance transfer, with rest stops and a comfortable vehicle.",
    tldrFacts: [
      { label: "Distance", value: "~1000 km" },
      { label: "Time", value: "~9 hours" },
      { label: "From", value: "SAR 1100" },
      { label: "Hours", value: "24/7" },
    ],
    faqs: [
      { question: "How far is Jeddah from NEOM?", answer: "Jeddah to NEOM is about 1000 km — roughly a 9-hour drive north along the Red Sea coast." },
      { question: "How much is a taxi from Jeddah to NEOM?", answer: "The fare is fixed from SAR 1100, confirmed before booking, with executive SUVs recommended for comfort on the long journey." },
      { question: "Do I need NEOM site clearance?", answer: "Some NEOM gates require access permits. Confirm your clearance in advance so the driver can take you to the correct entry point." },
    ],
  },
  "abha-airport-to-soudah": {
    tldr: "A taxi from Abha Airport (AHB) to Soudah is about 45 km and takes roughly 50 minutes up the Asir mountain road. The fare is fixed from SAR 150, with experienced drivers for the climb to Saudi Arabia's highest peak.",
    tldrFacts: [
      { label: "Distance", value: "~45 km" },
      { label: "Time", value: "~50 min" },
      { label: "From", value: "SAR 150" },
      { label: "Hours", value: "24/7" },
    ],
    faqs: [
      { question: "How far is Abha airport from Soudah?", answer: "Abha International Airport (AHB) is about 45 km from Soudah — roughly a 50-minute drive up the Asir mountain road to Saudi Arabia's highest peak." },
      { question: "How much is a taxi from Abha airport to Soudah?", answer: "The fare is fixed from SAR 150, confirmed before booking, with experienced mountain drivers and SUVs for the climb." },
      { question: "Can the driver wait while I explore Soudah?", answer: "Yes. We offer full-day hire with waiting time so you can enjoy Soudah Peak, the cable car, and the viewpoints at your own pace." },
    ],
  },
  "jeddah-to-abha": {
    tldr: "A taxi from Jeddah to Abha is about 630 km and takes roughly 6 hours, climbing into the cool Asir mountains. The fare is fixed from SAR 700, door-to-door, with rest stops included on the long journey south.",
    tldrFacts: [
      { label: "Distance", value: "~630 km" },
      { label: "Time", value: "~6 hours" },
      { label: "From", value: "SAR 700" },
      { label: "Hours", value: "24/7" },
    ],
    faqs: [
      { question: "How far is Jeddah from Abha?", answer: "Jeddah to Abha is about 630 km — roughly a 6-hour drive from the Red Sea coast into the cool Asir mountains." },
      { question: "How much is a taxi from Jeddah to Abha?", answer: "The fare is fixed from SAR 700, confirmed before booking, with SUVs recommended for comfort on the long mountain journey." },
      { question: "Are rest stops included on this route?", answer: "Yes. The driver includes prayer and rest stops, and an SUV is recommended for the climb into the Asir highlands." },
    ],
  },
  "taif-to-albaha": {
    tldr: "A taxi from Taif to Al Baha is about 220 km and takes roughly 2 hours 20 minutes on a scenic mountain road between two resort cities. The fare is fixed from SAR 300, with experienced drivers for the winding route.",
    tldrFacts: [
      { label: "Distance", value: "~220 km" },
      { label: "Time", value: "~2 hr 20 min" },
      { label: "From", value: "SAR 300" },
      { label: "Hours", value: "24/7" },
    ],
    faqs: [
      { question: "How far is Taif from Al Baha?", answer: "Taif to Al Baha is about 220 km — roughly a 2 hour 20 minute drive on a scenic mountain road connecting the two resort cities." },
      { question: "How much is a taxi from Taif to Al Baha?", answer: "The fare is fixed from SAR 300, confirmed before booking, with SUVs available for comfort on the mountain route." },
      { question: "Is the mountain road safe by taxi?", answer: "Yes. Our drivers are experienced on the winding Sarawat mountain roads, and an SUV is a comfortable choice for families." },
    ],
  },
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const route = await db.route.findUnique({ where: { slug } });

  if (!route) return { title: "Route Not Found" };

  return {
    title: `Taxi ${route.fromCity} to ${route.toCity} — From SAR ${route.basePrice} | Taxi Saudi Arabia`,
    description: `Book a fixed-price taxi from ${route.fromCity} to ${route.toCity} — ${route.distance} km, approx ${Math.round(route.duration / 60)}h. From SAR ${route.basePrice}, available 24/7 with licensed drivers. No surge, no hidden fees.`,
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

          <RouteRelatedLinks slug={slug} fromCity={route.fromCity} toCity={route.toCity} />

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
                href={`https://wa.me/${contactConfig.whatsappNumber}?text=${encodeURIComponent(
                  `Salam! I want to book a taxi from ${route.fromCity} to ${route.toCity}.\n\n` +
                    `• Date & time: \n` +
                    `• Pickup point: \n` +
                    `• Passengers & luggage: \n` +
                    `• Vehicle (Sedan / SUV / Van): `,
                )}`}
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
