export const revalidate = 86400; // static + refresh daily (was force-dynamic = ~16s server render on every request)

import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ROUTES_DATA } from "@/lib/data/routes";
import { Metadata } from "next";
import { MapPin, Clock, ArrowRight, CheckCircle2, ShieldCheck, Car, HelpCircle, AlertTriangle, ChevronRight, Phone, MessageSquare, Plane, UserCheck, Compass, Users, Briefcase, Navigation, Coffee } from "lucide-react";
import Link from "next/link";
import { contactConfig } from "@/lib/config/contact";
import Image from "next/image";
import { breadcrumbSchema, faqSchema, speakableSchema, SITE } from "@/lib/schema";
import { TLDRSummary } from "@/components/seo/TLDRSummary";
import { RouteRelatedLinks } from "@/components/seo/RouteRelatedLinks";
import { VEHICLE_PRICE_MULTIPLIERS } from "@/lib/data/vehicleMultipliers";
import { credentials, hasCredential } from "@/lib/config/credentials";

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
    tldr: "A private taxi from Jeddah Airport (JED) to Makkah (Mecca) is about 80 km and takes roughly 1 hour. Fares start from SAR 249, confirmed on WhatsApp before booking, available 24/7, with a Miqat stop on request so you can enter Ihram before reaching Makkah.",
    tldrFacts: [
      { label: "Distance", value: "~80 km" },
      { label: "Time", value: "~1 hour" },
      { label: "From", value: "SAR 249" },
      { label: "Hours", value: "24/7" },
    ],
    faqs: [
      { question: "How far is Jeddah airport from Makkah?", answer: "King Abdulaziz International Airport (JED) is about 80 km from Makkah — roughly a 1-hour drive on the Makkah Expressway, traffic permitting." },
      { question: "How much is a taxi from Jeddah airport to Makkah?", answer: "Fares start from SAR 249 for a sedan, with SUVs and vans available for families and extra luggage. Message us on WhatsApp with your flight time and passenger count for a clear quote before booking — no surge, tolls included." },
      { question: "Can the driver stop at the Miqat for Ihram?", answer: "Yes. Just tell us in advance and the driver will stop at the Miqat on the way so you can change into Ihram and make your intention before entering the Haram boundary." },
      { question: "Is the Jeddah airport to Makkah taxi available at night?", answer: "Yes, we operate 24/7. We track your flight number, so the driver is waiting at arrivals with a name sign even for late-night or delayed flights." },
      { question: "Which is better — taxi or the Haramain train?", answer: "A private taxi is door-to-door from the airport to your Makkah hotel with luggage help and a Miqat stop. The Haramain high-speed train is fast but requires transfers to and from the stations. For pilgrims with luggage, the direct taxi is usually more convenient." },
      { question: "Where do I meet my driver at Jeddah airport?", answer: "Your driver waits in the arrivals hall with a name sign at your terminal (Terminal 1 for most international airlines, the Hajj Terminal during Hajj/Umrah peak season). We track your flight, so pickup timing adjusts automatically if you land early or late." },
      { question: "Is a private taxi cheaper than Uber or Careem from Jeddah to Makkah?", answer: "A private, pre-booked taxi gives you a confirmed vehicle and driver waiting at arrivals with no surge pricing during peak Umrah season — unlike ride-hailing apps, which can be scarce or surge-priced right after international flights land. Message us on WhatsApp to compare your options for a quote." },
      { question: "Do you provide a taxi service from Jeddah to Mecca for groups?", answer: "Yes. Alongside sedans, we arrange SUVs and vans for Umrah groups and families travelling together from Jeddah Airport to Mecca, with one driver and vehicle for the whole party." },
    ],
  },
  "jeddah-airport-to-fairmont-makkah": {
    tldr: "A taxi from Jeddah Airport (JED) to the Fairmont Makkah Clock Royal Tower is about 80 km and takes roughly 1 hour. The fare is fixed from SAR 249, available 24/7, with drop-off right at the hotel entrance overlooking Masjid al-Haram.",
    tldrFacts: [
      { label: "Distance", value: "~80 km" },
      { label: "Time", value: "~1 hour" },
      { label: "From", value: "SAR 249" },
      { label: "Hours", value: "24/7" },
    ],
    faqs: [
      { question: "How far is the Fairmont Makkah Clock Royal Tower from Jeddah airport?", answer: "About 80 km — roughly a 1-hour drive on the Makkah Expressway. The hotel sits directly in the Abraj Al Bait complex, overlooking Masjid al-Haram." },
      { question: "How much is a taxi from Jeddah airport to the Fairmont Makkah?", answer: "The fare is fixed from SAR 249 for a sedan, with SUVs and vans available for families and extra luggage. Confirmed before booking, no surge, tolls included." },
      { question: "Can the driver stop at the Miqat for Ihram?", answer: "Yes. Let us know in advance and the driver will stop at the Miqat so you can enter Ihram before continuing to the hotel." },
      { question: "Will the driver drop me at the hotel entrance?", answer: "Yes, as close to the Fairmont's entrance as vehicle access allows — during peak prayer times the driver uses the nearest permitted drop-off point, just a short walk from the lobby." },
    ],
  },
  "jeddah-airport-to-swissotel-makkah": {
    tldr: "A taxi from Jeddah Airport (JED) to Swissotel Al Maqam Makkah is about 80 km and takes roughly 1 hour. The fare is fixed from SAR 249, available 24/7, with drop-off at the hotel, steps from Masjid al-Haram.",
    tldrFacts: [
      { label: "Distance", value: "~80 km" },
      { label: "Time", value: "~1 hour" },
      { label: "From", value: "SAR 249" },
      { label: "Hours", value: "24/7" },
    ],
    faqs: [
      { question: "How far is Swissotel Al Maqam Makkah from Jeddah airport?", answer: "About 80 km — roughly a 1-hour drive on the Makkah Expressway. The hotel is in the Abraj Al Bait towers, a short walk from Masjid al-Haram." },
      { question: "How much is a taxi from Jeddah airport to Swissotel Makkah?", answer: "The fare is fixed from SAR 249 for a sedan, with SUVs and vans available for families and extra luggage. Confirmed before booking, no surge, tolls included." },
      { question: "Can the driver stop at the Miqat for Ihram?", answer: "Yes. Let us know in advance and the driver will stop at the Miqat so you can enter Ihram before continuing to the hotel." },
      { question: "Is the transfer available for late-night flight arrivals?", answer: "Yes, we operate 24/7. We track your flight number so the driver is waiting with a name sign even for delayed or late-night arrivals." },
    ],
  },
  "jeddah-airport-to-pullman-zamzam-makkah": {
    tldr: "A taxi from Jeddah Airport (JED) to Pullman Zamzam Makkah is about 80 km and takes roughly 1 hour. The fare is fixed from SAR 249, available 24/7, with drop-off at one of the closest hotels to Masjid al-Haram.",
    tldrFacts: [
      { label: "Distance", value: "~80 km" },
      { label: "Time", value: "~1 hour" },
      { label: "From", value: "SAR 249" },
      { label: "Hours", value: "24/7" },
    ],
    faqs: [
      { question: "How far is Pullman Zamzam Makkah from Jeddah airport?", answer: "About 80 km — roughly a 1-hour drive on the Makkah Expressway. It's one of the closest hotels to Masjid al-Haram." },
      { question: "How much is a taxi from Jeddah airport to Pullman Zamzam Makkah?", answer: "The fare is fixed from SAR 249 for a sedan, with SUVs and vans available for families and extra luggage. Confirmed before booking, no surge, tolls included." },
      { question: "Can the driver stop at the Miqat for Ihram?", answer: "Yes. Let us know in advance and the driver will stop at the Miqat so you can enter Ihram before continuing to the hotel." },
      { question: "Will the driver help with luggage at the hotel?", answer: "Yes, our drivers assist with luggage from the vehicle to the hotel entrance, especially useful for families and larger groups." },
    ],
  },
  "jeddah-airport-to-conrad-makkah": {
    tldr: "A taxi from Jeddah Airport (JED) to Conrad Makkah is about 80 km and takes roughly 1 hour. The fare is fixed from SAR 249, available 24/7, with drop-off near King Abdulaziz Gate, a short walk from Masjid al-Haram.",
    tldrFacts: [
      { label: "Distance", value: "~80 km" },
      { label: "Time", value: "~1 hour" },
      { label: "From", value: "SAR 249" },
      { label: "Hours", value: "24/7" },
    ],
    faqs: [
      { question: "How far is Conrad Makkah from Jeddah airport?", answer: "About 80 km — roughly a 1-hour drive on the Makkah Expressway. The hotel is a short walk from Masjid al-Haram via King Abdulaziz Gate." },
      { question: "How much is a taxi from Jeddah airport to Conrad Makkah?", answer: "The fare is fixed from SAR 249 for a sedan, with SUVs and vans available for families and extra luggage. Confirmed before booking, no surge, tolls included." },
      { question: "Can the driver stop at the Miqat for Ihram?", answer: "Yes. Let us know in advance and the driver will stop at the Miqat so you can enter Ihram before continuing to the hotel." },
      { question: "Is this transfer available 24/7?", answer: "Yes, we operate around the clock with flight tracking, so your driver is waiting even for late-night or delayed arrivals." },
    ],
  },
  "jeddah-airport-to-hilton-suites-makkah": {
    tldr: "A taxi from Jeddah Airport (JED) to Hilton Suites Makkah is about 80 km and takes roughly 1 hour. The fare is fixed from SAR 249, available 24/7, with drop-off at the hotel in the Jabal Omar development, adjacent to the Haram.",
    tldrFacts: [
      { label: "Distance", value: "~80 km" },
      { label: "Time", value: "~1 hour" },
      { label: "From", value: "SAR 249" },
      { label: "Hours", value: "24/7" },
    ],
    faqs: [
      { question: "How far is Hilton Suites Makkah from Jeddah airport?", answer: "About 80 km — roughly a 1-hour drive on the Makkah Expressway. The hotel is in the Jabal Omar development, adjacent to Masjid al-Haram." },
      { question: "How much is a taxi from Jeddah airport to Hilton Suites Makkah?", answer: "The fare is fixed from SAR 249 for a sedan, with SUVs and vans available for families and extra luggage. Confirmed before booking, no surge, tolls included." },
      { question: "Can the driver stop at the Miqat for Ihram?", answer: "Yes. Let us know in advance and the driver will stop at the Miqat so you can enter Ihram before continuing to the hotel." },
      { question: "Is the vehicle suitable for families with luggage?", answer: "Yes, SUVs and vans are available with ample luggage space, ideal for families travelling to Hilton Suites Makkah." },
    ],
  },
  "jeddah-airport-to-movenpick-makkah": {
    tldr: "A taxi from Jeddah Airport (JED) to Movenpick Hajar Tower Makkah is about 80 km and takes roughly 1 hour. The fare is fixed from SAR 249, available 24/7, with drop-off at the hotel overlooking Masjid al-Haram.",
    tldrFacts: [
      { label: "Distance", value: "~80 km" },
      { label: "Time", value: "~1 hour" },
      { label: "From", value: "SAR 249" },
      { label: "Hours", value: "24/7" },
    ],
    faqs: [
      { question: "How far is Movenpick Hajar Tower Makkah from Jeddah airport?", answer: "About 80 km — roughly a 1-hour drive on the Makkah Expressway. The hotel overlooks Masjid al-Haram." },
      { question: "How much is a taxi from Jeddah airport to Movenpick Makkah?", answer: "The fare is fixed from SAR 249 for a sedan, with SUVs and vans available for families and extra luggage. Confirmed before booking, no surge, tolls included." },
      { question: "Can the driver stop at the Miqat for Ihram?", answer: "Yes. Let us know in advance and the driver will stop at the Miqat so you can enter Ihram before continuing to the hotel." },
      { question: "Is the taxi available for early-morning or late-night flights?", answer: "Yes, we operate 24/7 with flight tracking, so your driver is waiting with a name sign regardless of arrival time." },
    ],
  },
  "jeddah-to-makkah": {
    tldr: "A taxi from Jeddah city to Makkah is about 85 km and takes around 1 hour 10 minutes. The fare is fixed from SAR 199, available 24/7, with door-to-door pickup from any Jeddah hotel or address.",
    tldrFacts: [
      { label: "Distance", value: "~85 km" },
      { label: "Time", value: "~1 hr 10 min" },
      { label: "From", value: "SAR 199" },
      { label: "Hours", value: "24/7" },
    ],
    faqs: [
      { question: "How far is Jeddah from Makkah?", answer: "Jeddah city centre is about 85 km from Makkah — roughly a 1 hour 10 minute drive on the Makkah Expressway." },
      { question: "How much is a taxi from Jeddah to Makkah?", answer: "The fare is fixed from SAR 199 for a sedan. SUVs and vans are available for families and extra luggage. The price is confirmed before booking, with tolls included and no surge." },
      { question: "Can you pick me up from my Jeddah hotel?", answer: "Yes. We offer door-to-door pickup from any hotel, residence, or address in Jeddah and drop you directly at your Makkah hotel or close to Masjid al-Haram." },
      { question: "Can the driver stop at the Miqat for Ihram?", answer: "Yes — let us know when booking and the driver will stop at the Miqat so you can enter Ihram before reaching Makkah." },
      { question: "Do you offer a taxi service from Jeddah to Mecca?", answer: "Yes, Taxi Saudi Arabia arranges private transfers from Jeddah to Makkah (Mecca) 24/7, with door-to-door pickup and Miqat stops for Umrah pilgrims." },
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
    tldr: "A taxi from Jeddah Airport (JED) to Madinah is about 410 km and takes roughly 4 to 5 hours via the Haramain highway. The fare is confirmed on WhatsApp before booking, with comfortable vehicles for families and luggage, available 24/7 with rest stops on request.",
    tldrFacts: [
      { label: "Distance", value: "~410 km" },
      { label: "Time", value: "~4–5 hours" },
      { label: "Price", value: "Confirmed on WhatsApp" },
      { label: "Hours", value: "24/7" },
    ],
    faqs: [
      { question: "How long does Jeddah airport to Madinah take by taxi?", answer: "The direct drive is about 410 km and takes roughly 4 to 5 hours via the Haramain highway, depending on traffic and rest stops." },
      { question: "How much is a taxi from Jeddah airport to Madinah?", answer: "The exact fare is confirmed on WhatsApp before booking, based on your vehicle choice — sedan, SUV, or van for families and luggage on this long-distance route. Tolls included, no surge." },
      { question: "Are rest stops included on the way to Madinah?", answer: "Yes. Brief stops for prayer, food, or refreshments are included on this long-distance transfer — just let your driver know." },
      { question: "Is the trip comfortable for families with luggage?", answer: "Yes. We provide spacious SUVs (e.g. GMC Yukon) and vans (e.g. Hyundai Staria) with ample luggage space, ideal for families travelling from JED to Madinah." },
    ],
  },
  "jeddah-to-madinah": {
    tldr: "A taxi from Jeddah to Madinah is about 420 km and takes roughly 4 to 5 hours via the Haramain highway. The fare is confirmed on WhatsApp before booking, door-to-door, with rest stops on request and 24/7 availability.",
    tldrFacts: [
      { label: "Distance", value: "~420 km" },
      { label: "Time", value: "~4–5 hours" },
      { label: "Price", value: "Confirmed on WhatsApp" },
      { label: "Hours", value: "24/7" },
    ],
    faqs: [
      { question: "How far is Jeddah from Madinah?", answer: "Jeddah is about 420 km from Madinah — roughly a 4 to 5 hour drive on the Haramain highway." },
      { question: "What is the taxi fare from Jeddah to Madinah (Madina)?", answer: "The exact fare is confirmed on WhatsApp before booking, based on your vehicle choice — sedan, SUV, or van for families. Tolls included, no surge." },
      { question: "Can you collect me from my Jeddah hotel?", answer: "Yes, we provide door-to-door pickup from any Jeddah hotel or address and drop you at your Madinah hotel near Masjid an-Nabawi." },
      { question: "Are prayer and rest stops included?", answer: "Yes. Short stops for prayer and refreshments are included on this long-distance route — just tell your driver." },
    ],
  },
  "makkah-to-jeddah-airport": {
    tldr: "A taxi from Makkah to Jeddah Airport (JED) is about 80 km and takes roughly 1 hour. The fare is fixed from SAR 249, with pickup from your Makkah hotel and 24/7 availability — pre-book and allow buffer time before your flight.",
    tldrFacts: [
      { label: "Distance", value: "~80 km" },
      { label: "Time", value: "~1 hour" },
      { label: "From", value: "SAR 249" },
      { label: "Hours", value: "24/7" },
    ],
    faqs: [
      { question: "How much is a taxi from Makkah to Jeddah airport?", answer: "The fare is fixed from SAR 249 for a sedan, confirmed before booking, with larger SUVs and vans available for families and luggage. Tolls are included and there is no surge." },
      { question: "How long does Makkah to Jeddah airport take?", answer: "It is about 80 km and roughly a 1-hour drive. For departures we recommend leaving with extra buffer time, especially during Umrah, Hajj, and Ramadan seasons." },
      { question: "Can you pick up from my Makkah hotel near the Haram?", answer: "Yes. We collect you from your hotel as close to Masjid al-Haram as vehicles are permitted; during prayer-time road closures we use the nearest allowed checkpoint." },
      { question: "Is the airport transfer available late at night?", answer: "Yes, we operate 24/7. Pre-book your departure transfer so a driver is ready at your hotel at the agreed time, even for early-morning flights." },
    ],
  },
  "makkah-to-madinah": {
    tldr: "A taxi from Makkah to Madinah is about 430 km and takes roughly 4 to 5 hours via the Haramain highway. The fare is fixed from SAR 499, with prayer and rest stops included and comfortable vehicles for families and luggage.",
    tldrFacts: [
      { label: "Distance", value: "~430 km" },
      { label: "Time", value: "~4–5 hours" },
      { label: "From", value: "SAR 499" },
      { label: "Hours", value: "24/7" },
    ],
    faqs: [
      { question: "How much is a taxi from Makkah to Madinah?", answer: "The fare is fixed from SAR 499 for a sedan. SUVs and vans are available for families and extra luggage — the exact price is confirmed before booking with tolls included and no surge." },
      { question: "How long does a taxi from Makkah to Madinah take?", answer: "The journey is approximately 430 km and takes roughly 4 to 5 hours via the Haramain highway, depending on traffic conditions and any rest stops." },
      { question: "Can I book a private taxi from Makkah to Madinah?", answer: "Yes. Every booking is a private transfer — your vehicle is exclusively for you and your group, with a dedicated driver for the entire journey between the two Holy Cities." },
      { question: "Is the fare fixed or metered?", answer: "Fixed. The price is confirmed upfront before booking with zero surge pricing. Tolls, fuel, and all costs are included — no hidden fees." },
      { question: "Can families travel with luggage?", answer: "Yes. We provide spacious SUVs (e.g. GMC Yukon XL) and vans (e.g. Hyundai Staria) with ample luggage space, ideal for families and groups travelling between Makkah and Madinah." },
      { question: "Can we stop for prayer or rest during the journey?", answer: "Yes. Rest and prayer stops are included on this long-distance transfer at no extra charge — just let your driver know your preferences along the way." },
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
      { question: "Is there a car service or cab from Madinah airport?", answer: "Yes — our licensed car service (cab) meets you at Prince Mohammad Bin Abdulaziz Airport (MED) arrivals and drives you directly to your Madinah hotel, fixed from SAR 80." },
    ],
  },
  "madinah-to-makkah": {
    tldr: "A taxi from Madinah to Makkah is about 430 km and takes roughly 4 to 5 hours via the Haramain highway. The fare is fixed from SAR 499, door-to-door with prayer and rest stops, ideal for completing your Umrah journey.",
    tldrFacts: [
      { label: "Distance", value: "~430 km" },
      { label: "Time", value: "~4–5 hours" },
      { label: "From", value: "SAR 499" },
      { label: "Hours", value: "24/7" },
    ],
    faqs: [
      { question: "How far is Madinah from Makkah?", answer: "Madinah to Makkah is about 430 km — roughly a 4 to 5 hour drive on the Haramain highway, depending on traffic and rest stops." },
      { question: "How much is a taxi from Madinah to Makkah?", answer: "The fare is fixed from SAR 499 for a sedan. For families and luggage we recommend an SUV or van; the price is confirmed before booking with tolls included." },
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
    tldr: "A taxi from Madinah to Jeddah Airport (JED) is about 410 km and takes roughly 4 to 5 hours via the Haramain highway. The fare is confirmed on WhatsApp before booking, door-to-door from your Madinah hotel, with rest stops on request.",
    tldrFacts: [
      { label: "Distance", value: "~410 km" },
      { label: "Time", value: "~4–5 hours" },
      { label: "Price", value: "Confirmed on WhatsApp" },
      { label: "Hours", value: "24/7" },
    ],
    faqs: [
      { question: "How far is Madinah from Jeddah airport?", answer: "Madinah to King Abdulaziz International Airport (JED) is about 410 km — roughly a 4 to 5 hour drive on the Haramain highway." },
      { question: "What is the taxi fare from Madinah to Jeddah airport?", answer: "The exact fare is confirmed on WhatsApp before booking, based on your vehicle choice — sedan, SUV, or van for families and luggage. Tolls included." },
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
    tldr: "A private taxi from Riyadh to Dammam is about 390 km and takes roughly 3.5 hours on Highway 40. Fares start from SAR 699, door-to-door, confirmed on WhatsApp before booking — popular with executives travelling to the Eastern Province and Aramco/Dhahran corridor.",
    tldrFacts: [
      { label: "Distance", value: "~390 km" },
      { label: "Time", value: "~3.5 hours" },
      { label: "From", value: "SAR 699" },
      { label: "Hours", value: "24/7" },
    ],
    faqs: [
      { question: "How long is the taxi from Riyadh to Dammam?", answer: "Riyadh to Dammam is about 390 km — roughly a 3.5-hour drive on Highway 40, with rest stops on request." },
      { question: "How much is a taxi from Riyadh to Dammam?", answer: "Fares start from SAR 699 for a sedan, with SUVs and vans available. Message us on WhatsApp with your travel date and passenger count for a clear quote before booking, with no surge." },
      { question: "Can I book a corporate car for this route?", answer: "Yes. We arrange executive sedans and SUVs with professional drivers for the Riyadh–Dammam corporate corridor — useful for meetings in Dhahran, Al Khobar, or Jubail — with hourly and one-way options." },
      { question: "What is the distance between Riyadh and Dammam?", answer: "The distance between Riyadh and Dammam is about 390 km by road, a roughly 3.5-hour drive on Highway 40." },
      { question: "Can the driver continue on to Khobar, Dhahran, or Jubail after Dammam?", answer: "Yes. Since Dammam, Al Khobar, Dhahran, and Jubail form one Eastern Province service area, you can extend your trip to any of these cities at booking — just mention your final destination when requesting a quote." },
    ],
  },
  "dammam-airport-to-jubail": {
    tldr: "A taxi from King Fahd International Airport (DMM) to Jubail is about 90 km and takes roughly 65 minutes. The fare is fixed from SAR 250, with corporate accounts available for contractors and companies operating in Jubail Industrial City.",
    tldrFacts: [
      { label: "Distance", value: "~90 km" },
      { label: "Time", value: "~65 minutes" },
      { label: "From", value: "SAR 250" },
      { label: "Hours", value: "24/7" },
    ],
    faqs: [
      { question: "How long does the trip from Dammam airport to Jubail take?", answer: "The drive is about 90 km and takes roughly 65 minutes, depending on traffic and shift-change hours around the industrial city." },
      { question: "How much is a taxi from Dammam airport to Jubail?", answer: "The fare is fixed from SAR 250 for a sedan, with SUVs and vans available for groups and equipment. The price is confirmed before booking, with no surge." },
      { question: "Do you offer corporate accounts for Jubail Industrial City?", answer: "Yes. Contractors and companies operating in Jubail Industrial City I & II can set up monthly corporate billing instead of paying per trip — message us on WhatsApp to arrange an account." },
      { question: "Can the driver access restricted plant gates in Jubail?", answer: "Share your company name and site/gate location when booking so the driver can plan the correct access route — some plants have restricted entry points and ID checks." },
    ],
  },
  "dammam-airport-to-dhahran": {
    tldr: "A taxi from King Fahd International Airport (DMM) to Dhahran is about 25 km and takes roughly 25 minutes — one of the shortest airport transfers in the Eastern Province. The fare is fixed from SAR 100, with corporate accounts available for Saudi Aramco and KFUPM visitors.",
    tldrFacts: [
      { label: "Distance", value: "~25 km" },
      { label: "Time", value: "~25 minutes" },
      { label: "From", value: "SAR 100" },
      { label: "Hours", value: "24/7" },
    ],
    faqs: [
      { question: "How long does the trip from Dammam airport to Dhahran take?", answer: "The drive is about 25 km and takes roughly 25 minutes — one of the shortest airport-to-city runs in the Eastern Province." },
      { question: "How much is a taxi from Dammam airport to Dhahran?", answer: "The fare is fixed from SAR 100 for a sedan, with SUVs and vans available. The price is confirmed before booking, with no surge." },
      { question: "Do you offer corporate accounts for Saudi Aramco or KFUPM?", answer: "Yes. Contractors, consultants, and companies working with Saudi Aramco, KFUPM, or based in Dhahran Techno Valley can set up monthly corporate billing instead of paying per trip — message us on WhatsApp to arrange an account." },
      { question: "Can the driver pick up visitors from inside Aramco or KFUPM gates?", answer: "Share your host company, badge type, and gate name when booking so the driver can plan the correct visitor entry point — some facilities require advance notice for access." },
    ],
  },
  "dhahran-to-dammam-airport": {
    tldr: "A taxi from Dhahran to King Fahd International Airport (DMM) is about 25 km and takes roughly 25 minutes. The fare is fixed from SAR 100, with meet & greet pickup from Saudi Aramco, KFUPM, or any Dhahran hotel or address.",
    tldrFacts: [
      { label: "Distance", value: "~25 km" },
      { label: "Time", value: "~25 minutes" },
      { label: "From", value: "SAR 100" },
      { label: "Hours", value: "24/7" },
    ],
    faqs: [
      { question: "How far is Dhahran from Dammam airport?", answer: "Dhahran is about 25 km from King Fahd International Airport (DMM) — roughly a 25-minute drive, traffic permitting." },
      { question: "How much is a taxi from Dhahran to the airport?", answer: "The fare is fixed from SAR 100 for a sedan, confirmed before booking, with larger vehicles available for groups and luggage." },
      { question: "Can you collect me from Saudi Aramco or KFUPM for my flight?", answer: "Yes, we provide door-to-door pickup from Aramco facilities, KFUPM, Dhahran Techno Valley, or any hotel or address in Dhahran, timed to your flight." },
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
      { question: "Do you cover the Qassim region?", answer: "Yes. We serve Buraydah, Unaizah, and the wider Qassim region with intercity transfers from Riyadh, quoted on WhatsApp, 24/7." },
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
    tldr: "A taxi from Madinah to Jeddah is about 420 km and takes roughly 4 hours via the Haramain highway. The fare is confirmed on WhatsApp before booking, door-to-door from your Madinah hotel, with rest stops on request.",
    tldrFacts: [
      { label: "Distance", value: "~420 km" },
      { label: "Time", value: "~4 hours" },
      { label: "Price", value: "Confirmed on WhatsApp" },
      { label: "Hours", value: "24/7" },
    ],
    faqs: [
      { question: "How far is Madinah from Jeddah?", answer: "Madinah to Jeddah is about 420 km — roughly a 4-hour drive on the Haramain highway." },
      { question: "How much is a taxi from Madinah to Jeddah?", answer: "The exact fare is confirmed on WhatsApp before booking, based on your vehicle choice — sedan, SUV, or van for families and luggage." },
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
    tldr: "A private car with driver from Riyadh to Dubai is about 990 km and takes roughly 9 hours plus the Saudi–UAE border crossing. Fares start from SAR 1200, confirmed on WhatsApp, with documentation support and a comfortable vehicle for the cross-border journey.",
    tldrFacts: [
      { label: "Distance", value: "~990 km" },
      { label: "Time", value: "~9 hours + border" },
      { label: "From", value: "SAR 1200" },
      { label: "Hours", value: "24/7" },
    ],
    faqs: [
      { question: "How long is the taxi from Riyadh to Dubai?", answer: "Riyadh to Dubai is about 990 km — roughly a 9-hour drive plus time at the Saudi–UAE border (Al Batha crossing)." },
      { question: "What documents do I need for the border?", answer: "You need a valid passport and the correct UAE entry visa or eligibility. Share your details in advance so we can advise and prepare for a smooth crossing." },
      { question: "How much is a taxi from Riyadh to Dubai?", answer: "Fares start from SAR 1200 — message us on WhatsApp with your travel date for a clear quote before booking. We arrange comfortable vehicles suited to the long cross-border journey." },
      { question: "Can I get a private car with a driver from Riyadh to Dubai?", answer: "Yes. We arrange a private car with a professional driver for the full Riyadh to Dubai journey — not a shared ride — with one vehicle and driver for your whole party door-to-door." },
      { question: "Is it better to fly or drive from Riyadh to Dubai?", answer: "Flying is faster, but a private car with driver is popular for business travellers who want to work en route, families with luggage, or anyone who prefers not to navigate two airports and a connecting ride on each end." },
      { question: "Can I stop overnight or make business stops on the way to Dubai?", answer: "Yes. The Riyadh-Dubai route can include planned stops for meetings, meals, or rest — let us know your itinerary when requesting a quote so we can arrange the right vehicle and driver." },
    ],
  },
  "dammam-to-doha": {
    tldr: "A private taxi from Dammam to Doha is about 400 km and takes roughly 4 hours plus the Saudi–Qatar border crossing at Salwa. Fares start from SAR 500, confirmed on WhatsApp, with documentation support for a smooth crossing.",
    tldrFacts: [
      { label: "Distance", value: "~400 km" },
      { label: "Time", value: "~4 hours + border" },
      { label: "From", value: "SAR 500" },
      { label: "Hours", value: "24/7" },
    ],
    faqs: [
      { question: "How far is Dammam from Doha?", answer: "Dammam to Doha is about 400 km — roughly a 4-hour drive plus time at the Saudi–Qatar border crossing at Salwa." },
      { question: "What do I need to cross into Qatar?", answer: "A valid passport and the correct Qatar entry permit or visa. Share your details in advance so we can prepare for a smooth border crossing." },
      { question: "How much is a taxi from Dammam to Doha?", answer: "Fares start from SAR 500 — message us on WhatsApp with your travel date and passenger count for a clear quote before booking, with comfortable vehicles for the cross-border journey." },
      { question: "Is there a taxi from Khobar to Doha?", answer: "Yes — Al Khobar and Dammam are twin cities about 15 km apart, so this same Dammam–Doha service picks up from Khobar hotels and addresses with the same border-crossing support." },
      { question: "How long does the Salwa border crossing usually take?", answer: "Crossing time varies with traffic and document checks, typically adding 30-60 minutes to the drive. Our drivers know the Salwa crossing well and can advise on typically busier or quieter times." },
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
      { question: "Is there a train from Riyadh to Bahrain?", answer: "No — there is currently no operational train between Riyadh and Bahrain; the GCC's planned Gulf Railway hasn't been completed on this route. A private taxi via the King Fahd Causeway is the most comfortable door-to-door option." },
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
  "alula-airport-to-banyan-tree": {
    tldr: "A private VIP taxi from AlUla Airport (ULH) to Banyan Tree AlUla is about 35 km and takes around 35 minutes. The fare is fixed from SAR 220, in a luxury SUV or VIP sedan, with meet & greet at arrivals for the resort's guests.",
    tldrFacts: [
      { label: "Distance", value: "~35 km" },
      { label: "Time", value: "~35 min" },
      { label: "From", value: "SAR 220" },
      { label: "Hours", value: "24/7" },
    ],
    faqs: [
      { question: "How far is AlUla airport from Banyan Tree AlUla?", answer: "AlUla International Airport (ULH) is about 35 km from Banyan Tree AlUla, in Ashar Valley — roughly a 35-minute private transfer through the sandstone canyons." },
      { question: "How much is a private transfer to Banyan Tree AlUla?", answer: "The fare is fixed from SAR 220 in a luxury SUV or VIP sedan, confirmed before booking, with meet & greet at arrivals and help with luggage." },
      { question: "Is this a shared shuttle or a private car?", answer: "This is a private, chauffeur-driven vehicle exclusively for you and your party — not a shared shuttle — matching the resort's VIP standard." },
      { question: "Can you arrange a full-day driver for Hegra or Elephant Rock during my stay?", answer: "Yes. We offer full-day and half-day private chauffeur hire from Banyan Tree AlUla to Hegra, Elephant Rock, Dadan, and the Old Town, with flexible waiting time." },
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
  "jeddah-airport-to-makkah-clock-tower": {
    tldr: "A taxi from Jeddah Airport (JED) to the Makkah Clock Tower hotels (Fairmont, Pullman Zamzam, Abraj Al Bait) is about 85 km and takes roughly 65 minutes. The fare is fixed from SAR 249, available 24/7, with door-to-door drop-off and luggage help.",
    tldrFacts: [
      { label: "Distance", value: "~85 km" },
      { label: "Time", value: "~65 min" },
      { label: "From", value: "SAR 249" },
      { label: "Hours", value: "24/7" },
    ],
    faqs: [
      { question: "How far is the Makkah Clock Tower from Jeddah airport?", answer: "About 85 km — roughly a 65-minute drive on the Makkah Expressway from King Abdulaziz International Airport (JED) to the Clock Tower hotel complex (Abraj Al Bait), which includes the Fairmont, Pullman Zamzam, and other Haram-adjacent hotels." },
      { question: "How much is a taxi from Jeddah airport to the Clock Tower hotels?", answer: "The fare is fixed from SAR 249 for a sedan, with SUVs and vans available for families and extra luggage. Confirmed before booking, no surge, tolls included." },
      { question: "Can the driver stop at the Miqat for Ihram?", answer: "Yes. Let us know in advance and the driver will stop at the Miqat so you can enter Ihram before continuing to your hotel." },
      { question: "Which hotels are in the Clock Tower complex?", answer: "The Abraj Al Bait complex includes the Fairmont Makkah Clock Royal Tower, Pullman Zamzam Makkah, and several other towers — all directly overlooking Masjid al-Haram. Tell us your specific hotel when booking." },
    ],
  },
  "madinah-airport-to-madinah-markaziyah": {
    tldr: "A taxi from Madinah Airport (MED) to the Central Markaziyah hotels is about 22 km and takes roughly 25 minutes. The fare is fixed from SAR 120, available 24/7, with drop-off steps from Al-Masjid an-Nabawi.",
    tldrFacts: [
      { label: "Distance", value: "~22 km" },
      { label: "Time", value: "~25 min" },
      { label: "From", value: "SAR 120" },
      { label: "Hours", value: "24/7" },
    ],
    faqs: [
      { question: "How far is Central Markaziyah from Madinah airport?", answer: "About 22 km — roughly a 25-minute drive from Prince Mohammad Bin Abdulaziz International Airport (MED) to the Central Markaziyah hotel district, which sits directly around Al-Masjid an-Nabawi." },
      { question: "How much is a taxi from Madinah airport to Markaziyah hotels?", answer: "The fare is fixed from SAR 120 for a sedan, with SUVs and vans available for families and extra luggage. Confirmed before booking, no surge, tolls included." },
      { question: "Is there a taxi at Madinah airport at night?", answer: "Yes. We operate 24/7 at MED, including late-night and early-morning arrivals, and track your flight so your driver is waiting even if it's delayed." },
      { question: "How close is the drop-off to the Prophet's Mosque?", answer: "Markaziyah hotels are within walking distance of Al-Masjid an-Nabawi — the driver drops you as close to your hotel entrance as vehicle access allows, especially during prayer-time road closures." },
    ],
  },
  "makkah-clock-tower-to-madinah-markaziyah": {
    tldr: "A taxi from the Makkah Clock Tower hotels to Madinah Central Markaziyah is about 430 km and takes roughly 4 hours 10 minutes via the Haramain Highway. The fare is fixed from SAR 499, with a Meeqat stop included for pilgrims continuing to Umrah.",
    tldrFacts: [
      { label: "Distance", value: "~430 km" },
      { label: "Time", value: "~4h 10m" },
      { label: "From", value: "SAR 499" },
      { label: "Meeqat stop", value: "Included" },
    ],
    faqs: [
      { question: "How far is it from Makkah Clock Tower hotels to Madinah?", answer: "About 430 km — roughly a 4 hour 10 minute drive via the Haramain Highway, direct from the Clock Tower hotel complex to the Central Markaziyah hotels around the Prophet's Mosque." },
      { question: "How much is a taxi from Makkah Clock Tower to Madinah?", answer: "The fare is fixed from SAR 499 for a sedan, with SUVs and vans available for families and extra luggage. Confirmed before booking, no surge, tolls included." },
      { question: "Is there a Meeqat stop on this route?", answer: "Yes. Dhul Hulaifah (Abyar Ali) is on the route from Makkah to Madinah, and the driver will stop there so you can enter Ihram if you're continuing on to Umrah." },
      { question: "Are rest stops included on the drive?", answer: "Yes, brief stops for prayer or refreshments along the highway are included at no extra charge — just let the driver know." },
    ],
  },
  "makkah-hotels-to-taif-resorts": {
    tldr: "A taxi from Makkah Haram-area hotels to the Al-Hada and Shafa mountain resorts of Taif is about 85 km and takes roughly 75 minutes. The fare is fixed from SAR 220, available 24/7, ideal as a day trip or resort-hotel transfer.",
    tldrFacts: [
      { label: "Distance", value: "~85 km" },
      { label: "Time", value: "~75 min" },
      { label: "From", value: "SAR 220" },
      { label: "Route", value: "Al-Hada mountain road" },
    ],
    faqs: [
      { question: "How far are the Taif resorts from Makkah hotels?", answer: "About 85 km — roughly a 75-minute drive on the Al-Hada mountain road, from the Makkah Haram area up to the resort hotels of Al-Hada and Shafa in Taif." },
      { question: "How much is a taxi from Makkah to Taif resorts?", answer: "The fare is fixed from SAR 220 for a sedan, with SUVs recommended for the mountain road and extra luggage. Confirmed before booking, no surge, tolls included." },
      { question: "Can we stop at the rose distilleries?", answer: "Yes — this route is popular as a day trip that includes a stop at the Taif rose distilleries and gardens. Mention it when booking so the driver plans the stop into your day." },
      { question: "Is this a good day trip from Makkah?", answer: "Yes. Taif's cooler mountain climate, the Al-Hada cable car, and the rose season (spring) make it a popular half-day or full-day escape from Makkah — book a return trip or hourly hire if you want the driver to wait." },
    ],
  },
  "riyadh-airport-to-kafd-hotels": {
    tldr: "A taxi from Riyadh Airport (RUH) to KAFD and Olaya business-district hotels is about 40 km and takes roughly 35 minutes. The fare is fixed from SAR 150, available 24/7, with meet & greet for executive and business arrivals.",
    tldrFacts: [
      { label: "Distance", value: "~40 km" },
      { label: "Time", value: "~35 min" },
      { label: "From", value: "SAR 150" },
      { label: "Hours", value: "24/7" },
    ],
    faqs: [
      { question: "How far is KAFD from Riyadh airport?", answer: "About 40 km — roughly a 35-minute drive from King Khalid International Airport (RUH) to the King Abdullah Financial District (KAFD) and the Olaya business district." },
      { question: "How much is a taxi from Riyadh airport to KAFD hotels?", answer: "The fare is fixed from SAR 150 for a sedan, with executive SUVs and luxury sedans available for business travelers. Confirmed before booking, no surge, tolls included." },
      { question: "Do you offer executive vehicles for business travel?", answer: "Yes. A Mercedes S-Class or premium SUV can be booked for corporate and VIP arrivals, with a professional chauffeur and flight tracking included." },
      { question: "Is meet & greet included for business arrivals?", answer: "Yes — your driver waits inside the arrivals hall with a name sign, tracks your flight for delays, and includes 60 minutes of free waiting time, the same as every other airport transfer." },
    ],
  },
};

// Explicit inbound links from the highest-traffic Makkah route page — the
// generic RouteRelatedLinks same-city matching doesn't reliably surface these
// (crowded out by other jeddah-airport-* routes), so without this block these
// 6 pages would have no real inbound internal link and risk staying orphaned.
const MAKKAH_HOTEL_ROUTES: { slug: string; hotel: string }[] = [
  { slug: "jeddah-airport-to-fairmont-makkah", hotel: "Fairmont Makkah Clock Royal Tower" },
  { slug: "jeddah-airport-to-swissotel-makkah", hotel: "Swissotel Al Maqam Makkah" },
  { slug: "jeddah-airport-to-pullman-zamzam-makkah", hotel: "Pullman Zamzam Makkah" },
  { slug: "jeddah-airport-to-conrad-makkah", hotel: "Conrad Makkah" },
  { slug: "jeddah-airport-to-hilton-suites-makkah", hotel: "Hilton Suites Makkah" },
  { slug: "jeddah-airport-to-movenpick-makkah", hotel: "Movenpick Hajar Tower Makkah" },
  { slug: "jeddah-airport-to-makkah-clock-tower", hotel: "Makkah Clock Tower Hotels (Abraj Al Bait)" },
];

// Explicit inbound links for routes that RouteRelatedLinks' same-city
// substring matching (slice(0,5)) reliably crowds out — same orphan-page
// risk as MAKKAH_HOTEL_ROUTES above, confirmed via
// scripts/check_route_link_density.ts. Placed on each corridor's highest-
// traffic flagship page so they inherit real link equity, not just the
// baseline /routes hub listing every route already gets.
const MORE_JEDDAH_MAKKAH_ROUTES: { slug: string; label: string; distance: number; price: number }[] = [
  { slug: "jeddah-airport-to-jeddah-city", label: "Jeddah Airport to Jeddah City", distance: 20, price: 80 },
  { slug: "jeddah-to-haramain-station", label: "Jeddah to Haramain Station", distance: 15, price: 70 },
  { slug: "makkah-to-jeddah", label: "Makkah to Jeddah", distance: 85, price: 150 },
  { slug: "makkah-to-kaec", label: "Makkah to KAEC", distance: 180, price: 250 },
  { slug: "makkah-to-yanbu", label: "Makkah to Yanbu", distance: 400, price: 350 },
];

const MORE_MADINAH_ROUTES: { slug: string; label: string; distance: number; price: number }[] = [
  { slug: "madinah-airport-to-madinah-markaziyah", label: "Madinah Airport to Markaziyah Hotels", distance: 22, price: 120 },
  { slug: "makkah-clock-tower-to-madinah-markaziyah", label: "Makkah Clock Tower to Madinah Markaziyah Hotels", distance: 430, price: 499 },
  { slug: "madinah-to-yanbu", label: "Madinah to Yanbu", distance: 220, price: 200 },
];

const MORE_RIYADH_ROUTES: { slug: string; label: string; distance: number; price: number }[] = [
  { slug: "riyadh-airport-to-kafd-hotels", label: "Riyadh Airport to KAFD & Olaya Hotels", distance: 40, price: 150 },
  { slug: "riyadh-to-alahsa", label: "Riyadh to Al Ahsa", distance: 330, price: 280 },
  { slug: "riyadh-to-hail", label: "Riyadh to Hail", distance: 600, price: 450 },
  { slug: "riyadh-to-abudhabi", label: "Riyadh to Abu Dhabi, UAE", distance: 850, price: 1100 },
];

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  // A transient DB hiccup here must not fail metadata for this one page,
  // let alone abort the static build for every page on the site (this is
  // the same class of bug fixed in airports/[slug] and locations/[city] —
  // it just hadn't hit routes/[slug] yet).
  let route: Awaited<ReturnType<typeof db.route.findUnique>> = null;
  try {
    route = await db.route.findUnique({ where: { slug } });
  } catch (error) {
    console.error(`❌ Route metadata fetch failed for ${slug}.`, error);
  }

  if (!route) return { title: "Route Not Found" };

  // Hotel-specific destinations (e.g. "Fairmont Makkah Clock Royal Tower")
  // push the full title well past the ~600px truncation point — drop the
  // brand suffix when the route name itself is already long.
  const routeLabel = route.priceOnRequest
    ? `Taxi ${route.fromCity} to ${route.toCity} — Price on Request`
    : `Taxi ${route.fromCity} to ${route.toCity} — From SAR ${route.basePrice}`;
  // Per-slug overrides below match literal Search Console query phrasing for
  // pages that already get impressions but zero clicks — title/CTR fixes
  // only, no price or content claims changed. Formula below still covers
  // every other route.
  const TITLE_OVERRIDES: Record<string, string> = {
    "jeddah-airport-to-makkah": "Taxi Jeddah Airport to Makkah — Fare From SAR 249",
    "makkah-to-madinah": "Taxi Makkah to Madinah — From SAR 499",
    "riyadh-to-dammam": "Riyadh to Dammam Taxi — One Way Price, Fare & Distance",
    "dammam-to-doha": "Taxi Dammam to Doha, Qatar — Cross-Border Fare From SAR 500",
    "jeddah-to-makkah": "Jeddah to Makkah (Mecca) Taxi Service — From SAR 199",
    "madinah-to-jeddah-airport": "Taxi Madinah to Jeddah Airport — Fare Confirmed on WhatsApp",
    "jeddah-to-madinah": "Taxi Jeddah to Madinah (Madina) — Fare Confirmed on WhatsApp",
    "madinah-airport-to-city": "Madinah Airport Taxi & Car Service — From SAR 80",
    "riyadh-to-dubai": "Private Car with Driver — Riyadh to Dubai — From SAR 1200",
  };
  const title = TITLE_OVERRIDES[slug] ?? (routeLabel.length > 55 ? routeLabel : `${routeLabel} | Taxi Saudi Arabia`);
  const priceBlurb = route.priceOnRequest ? "confirmed on WhatsApp" : `From SAR ${route.basePrice}`;

  // Per-slug description overrides — same CTR-fix rationale as TITLE_OVERRIDES,
  // for pages with confirmed impressions/position but zero clicks.
  const DESCRIPTION_OVERRIDES: Record<string, string> = {
    "riyadh-to-dammam": "Riyadh to Dammam taxi, one way — 390 km, about 3.5 hours. Get your exact price and fare confirmed on WhatsApp before booking. Private, professional drivers, 24/7.",
  };

  return {
    title,
    description: DESCRIPTION_OVERRIDES[slug] ?? `Private taxi from ${route.fromCity} to ${route.toCity} — ${route.distance} km, approx ${Math.round(route.duration / 60)}h. ${priceBlurb}, 24/7, professional drivers, no surge.`.slice(0, 160),
    alternates: {
      canonical: `https://taxisaudiarabia.com/routes/${slug}`,
      ...(slug === "jeddah-airport-to-makkah"
        ? {
            languages: {
              en: `https://taxisaudiarabia.com/routes/${slug}`,
              ar: "https://taxisaudiarabia.com/ar/routes/jeddah-airport-to-makkah",
              "x-default": `https://taxisaudiarabia.com/routes/${slug}`,
            },
          }
        : {}),
    },
    openGraph: {
      title: route.priceOnRequest
        ? `Taxi from ${route.fromCity} to ${route.toCity} — Price on Request`
        : `Taxi from ${route.fromCity} to ${route.toCity} — From SAR ${route.basePrice}`,
      description: route.description || `Book a taxi from ${route.fromCity} to ${route.toCity} with a clear price confirmed on WhatsApp. No surge, no hidden fees.`,
      type: "website",
    },
  };
}

export default async function RouteDetailsPage({ params }: PageProps) {
  const { slug } = await params;
  let route: Awaited<ReturnType<typeof db.route.findUnique>> = null;
  try {
    route = await db.route.findUnique({ where: { slug } });
  } catch (error) {
    console.error(`❌ Route page fetch failed for ${slug}. Building as 404 instead of failing the whole site build — next revalidate will retry.`, error);
  }

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
    SUV: Math.round(route.basePrice * VEHICLE_PRICE_MULTIPLIERS.suv),
    VAN: Math.round(route.basePrice * VEHICLE_PRICE_MULTIPLIERS.van),
    LUXURY: Math.round(route.basePrice * VEHICLE_PRICE_MULTIPLIERS.luxury),
    BUS: Math.round(route.basePrice * VEHICLE_PRICE_MULTIPLIERS.bus),
  };

  const vehicles = [
    { name: "Executive Sedan", key: "SEDAN", pax: 3, luggage: 2, img: "/fleet/toyota-camry.webp" },
    { name: "Family SUV", key: "SUV", pax: 6, luggage: 5, img: "/fleet/gmc-yukon-xl.webp" },
    { name: "Luxury VIP", key: "LUXURY", pax: 3, luggage: 3, img: "/fleet/mercedes-s-class.webp" },
    { name: "Group Van", key: "VAN", pax: 7, luggage: 7, img: "/fleet/hyundai-staria.webp" },
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
    ...(route.priceOnRequest ? {} : {
      "offers": {
        "@type": "Offer",
        "price": route.basePrice,
        "priceCurrency": "SAR",
        "availability": "https://schema.org/InStock"
      }
    }),
  };

  // Google Static Maps integration (Placeholder logic using standard maps URL if no key)
  const mapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
  const mapUrl = mapsApiKey 
    ? `https://maps.googleapis.com/maps/api/staticmap?size=800x400&path=color:0xC9A84C|weight:4|${encodeURIComponent(route.fromCity)}|${encodeURIComponent(route.toCity)}&markers=color:black|label:A|${encodeURIComponent(route.fromCity)}&markers=color:black|label:B|${encodeURIComponent(route.toCity)}&key=${mapsApiKey}`
    : `/routes/map-abstract.webp`; // Fallback beautiful map abstract

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#1C1C1C] pb-24">
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableSchema({ path: `/routes/${slug}` })) }}
      />

      {/* ─── HERO & MAP ───────────────────────────────────────────── */}
      <section className="relative pt-24 pb-12 overflow-hidden border-b border-[#C9A84C]/10">
        <div className="absolute inset-0 z-0 opacity-30">
          <Image src={mapUrl} alt={`Map route from ${route.fromCity} to ${route.toCity}`} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAF7] via-[#FAFAF7]/80 to-[#FAFAF7]/40" />
        </div>

        <div className="section-container relative z-10 max-w-5xl">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-wider text-[#6B7280] mb-8">
            <Link href="/" className="hover:text-[#16A34A] transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/routes" className="hover:text-[#16A34A] transition-colors">Routes</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-[#16A34A]">{route.fromCity} to {route.toCity}</span>
          </div>

          {slug === "jeddah-airport-to-makkah" ? (
            <div className="premium-dark-section bg-gradient-to-br from-[#0F281E] via-[#16422F] to-[#0A1C14] rounded-3xl p-8 sm:p-10 text-white shadow-2xl border border-[#C9A84C]/25 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9A84C]/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 max-w-3xl space-y-6">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#C9A84C]/20 border border-[#C9A84C]/40 px-3.5 py-1 text-[0.65rem] font-bold uppercase tracking-widest text-[#FACC15]">
                    <Plane className="h-3.5 w-3.5 text-[#FACC15]" />
                    JED Airport Transfer
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 px-3.5 py-1 text-[0.65rem] font-bold uppercase tracking-widest text-white/90">
                    <ShieldCheck className="h-3.5 w-3.5 text-[#16A34A]" />
                    Pilgrim-Friendly (Miqat Stop Available)
                  </span>
                </div>

                <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight tracking-tight text-white">
                  Taxi from Jeddah Airport <span className="text-[#FACC15]">to</span> Makkah
                </h1>

                <p className="text-sm sm:text-base text-white/85 leading-relaxed font-normal">
                  Private taxi &amp; chauffeur service from King Abdulaziz International Airport (JED) directly to your hotel near Masjid al-Haram. 24/7 flight tracking with meet &amp; greet included.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-xl px-4 py-2 border border-white/15 text-xs font-semibold">
                    <MapPin className="h-4 w-4 text-[#FACC15]" />
                    <span>~80 km</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-xl px-4 py-2 border border-white/15 text-xs font-semibold">
                    <Clock className="h-4 w-4 text-[#FACC15]" />
                    <span>~1 hour</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-xl px-4 py-2 border border-white/15 text-xs font-semibold">
                    <CheckCircle2 className="h-4 w-4 text-[#16A34A]" />
                    <span>From SAR 249</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-3">
                  <Link
                    href={`/book?pickup=${encodeURIComponent(route.fromCity)}&dropoff=${encodeURIComponent(route.toCity)}`}
                    className="inline-flex items-center gap-2 rounded-full bg-[#16A34A] px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#15803D] transition-all shadow-lg hover:scale-105"
                  >
                    <span>Book Now</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <a
                    href={`https://wa.me/${contactConfig.whatsappNumber}?text=${encodeURIComponent(
                      `Salam! I want to book a taxi from Jeddah Airport to Makkah.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-md border border-white/30 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-white/25 transition-all"
                  >
                    <MessageSquare className="h-4 w-4 text-[#FACC15]" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          ) : slug === "makkah-to-madinah" ? (
            <div className="premium-dark-section bg-gradient-to-br from-[#0F281E] via-[#16422F] to-[#0A1C14] rounded-3xl p-8 sm:p-10 text-white shadow-2xl border border-[#C9A84C]/25 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9A84C]/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#16A34A]/8 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 max-w-3xl space-y-6">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#C9A84C]/20 border border-[#C9A84C]/40 px-3.5 py-1 text-[0.65rem] font-bold uppercase tracking-widest text-[#FACC15]">
                    <Navigation className="h-3.5 w-3.5 text-[#FACC15]" />
                    Intercity Private Transfer
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 px-3.5 py-1 text-[0.65rem] font-bold uppercase tracking-widest text-white/90">
                    <ShieldCheck className="h-3.5 w-3.5 text-[#16A34A]" />
                    Clear Pricing · No Surge
                  </span>
                </div>

                <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight tracking-tight text-white">
                  Taxi from Makkah <span className="text-[#FACC15]">to</span> Madinah
                </h1>

                <p className="text-sm sm:text-base text-white/85 leading-relaxed font-normal">
                  Private intercity transfer between the two Holy Cities. Comfortable vehicles for families and luggage, with prayer and rest stops along the Haramain highway.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-xl px-4 py-2 border border-white/15 text-xs font-semibold">
                    <MapPin className="h-4 w-4 text-[#FACC15]" />
                    <span>~430 km</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-xl px-4 py-2 border border-white/15 text-xs font-semibold">
                    <Clock className="h-4 w-4 text-[#FACC15]" />
                    <span>~4 hours</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-xl px-4 py-2 border border-white/15 text-xs font-semibold">
                    <CheckCircle2 className="h-4 w-4 text-[#16A34A]" />
                    <span>From SAR 499</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-3">
                  <Link
                    href={`/book?pickup=${encodeURIComponent(route.fromCity)}&dropoff=${encodeURIComponent(route.toCity)}`}
                    className="inline-flex items-center gap-2 rounded-full bg-[#16A34A] px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#15803D] transition-all shadow-lg hover:scale-105"
                  >
                    <span>Book Now</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <a
                    href={`https://wa.me/${contactConfig.whatsappNumber}?text=${encodeURIComponent(
                      `Salam! I want to book a private taxi from Makkah to Madinah.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-md border border-white/30 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-white/25 transition-all"
                  >
                    <MessageSquare className="h-4 w-4 text-[#FACC15]" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="max-w-2xl">
                <h1 className="font-heading text-4xl md:text-5xl font-bold leading-tight">
                  {route.fromCity} <span className="text-[#16A34A]">to</span> {route.toCity}
                </h1>
                <p className="mt-4 text-sm md:text-base text-[#6B7280] leading-relaxed">
                  {route.description}
                </p>
              </div>
              
              <div className="shrink-0 bg-white/80 backdrop-blur-md border border-[#16A34A]/15 rounded-2xl p-6 flex items-center gap-6">
                <div>
                  <p className="text-[0.6rem] text-[#6B7280] uppercase font-bold tracking-wider mb-1">Distance</p>
                  <div className="flex items-center gap-1.5 font-bold text-lg">
                    <MapPin className="h-4 w-4 text-[#C9A84C]" />
                    {route.distance} km
                  </div>
                </div>
                <div className="w-px h-10 bg-[#C9A84C]/20" />
                <div>
                  <p className="text-[0.6rem] text-[#6B7280] uppercase font-bold tracking-wider mb-1">Est. Time</p>
                  <div className="flex items-center gap-1.5 font-bold text-lg">
                    <Clock className="h-4 w-4 text-[#C9A84C]" />
                    ~{Math.round(route.duration / 60)}h {route.duration % 60 > 0 ? `${route.duration % 60}m` : ''}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <div className="section-container max-w-5xl mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* ─── LEFT COLUMN (Details) ──────────────────────────────── */}
        <div className="lg:col-span-2 space-y-12">

          {/* Quick Answer (above-the-fold AI/snippet signal) */}
          {content?.tldr && (
            <TLDRSummary answer={content.tldr} facts={content.tldrFacts} />
          )}

          {/* Contextual Internal Links for JED -> Makkah */}
          {slug === "jeddah-airport-to-makkah" && (
            <div className="rounded-2xl border border-[#16A34A]/20 bg-[#F0FDF4] p-4 text-xs text-[#334155] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="font-medium">Planning your flight arrival or pilgrimage logistics?</span>
              <div className="flex flex-wrap items-center gap-4 font-bold shrink-0">
                <Link href="/airports/king-abdulaziz-jeddah" className="text-[#16A34A] hover:underline inline-flex items-center gap-1">
                  Jeddah Airport Transfer Guide &rarr;
                </Link>
                <Link href="/services/umrah-transport" className="text-[#16A34A] hover:underline inline-flex items-center gap-1">
                  Umrah Transport Services &rarr;
                </Link>
              </div>
            </div>
          )}

          {/* Contextual Internal Links for Makkah -> Madinah */}
          {slug === "makkah-to-madinah" && (
            <div className="rounded-2xl border border-[#16A34A]/20 bg-[#F0FDF4] p-4 text-xs text-[#334155] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="font-medium">Travelling between the Holy Cities for Umrah?</span>
              <div className="flex flex-wrap items-center gap-4 font-bold shrink-0">
                <Link href="/services/umrah-transport" className="text-[#16A34A] hover:underline inline-flex items-center gap-1">
                  Umrah Transport Services &rarr;
                </Link>
                <Link href="/services/madinah-ziyarat" className="text-[#16A34A] hover:underline inline-flex items-center gap-1">
                  Madinah Ziyarat Tours &rarr;
                </Link>
              </div>
            </div>
          )}

          {/* Vehicles & Pricing */}
          <section>
            <h2 className="font-heading text-2xl font-bold mb-6 flex items-center gap-3">
              <Car className="text-[#C9A84C]" />
              Vehicle Options &amp; Estimated Pricing
            </h2>
            <p className="text-[0.7rem] text-[#6B7280] mb-6">* All fares are fixed with zero surge pricing — confirmed on WhatsApp or email prior to dispatch.</p>
            <div className="grid sm:grid-cols-2 gap-5">
              {vehicles.map((v) => (
                <div key={v.key} className="border border-[#16A34A]/15 rounded-2xl bg-white overflow-hidden group hover:border-[#16A34A]/40 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col justify-between">
                  <div>
                    <div className="h-36 relative overflow-hidden bg-[#FAFAF7]">
                      <Image src={v.img} alt={v.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                      <span className="absolute top-3 right-3 rounded-full bg-[#16A34A]/90 backdrop-blur-md px-3 py-1 text-[0.6rem] font-bold text-white uppercase tracking-wider">
                        Clear Quote
                      </span>
                    </div>
                    <div className="p-5 relative -mt-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-bold text-lg text-[#1C1C1C]">{v.name}</h3>
                          <div className="flex items-center gap-3 text-[0.7rem] text-[#6B7280] font-semibold mt-1">
                            <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5 text-[#C9A84C]" /> {v.pax} Passengers</span>
                            <span className="flex items-center gap-1"><Briefcase className="h-3.5 w-3.5 text-[#C9A84C]" /> {v.luggage} Bags</span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-[0.55rem] uppercase tracking-wider text-[#6B7280]">Starting from</p>
                          <p className="font-heading text-xl font-bold text-[#16A34A]">{route.priceOnRequest ? "On Request" : `SAR ${prices[v.key as keyof typeof prices]}`}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="px-5 pb-5 pt-0">
                    <Link
                      href={`/book?pickup=${encodeURIComponent(route.fromCity)}&dropoff=${encodeURIComponent(route.toCity)}&vehicle=${v.key}`}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#F0FDF4] border border-[#16A34A]/25 py-2.5 text-xs font-bold uppercase text-[#16A34A] hover:bg-[#16A34A] hover:text-white transition-all"
                    >
                      Book This Vehicle <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ─── 4-STEP TRANSFER PROCESS (JED -> Makkah) ─── */}
          {slug === "jeddah-airport-to-makkah" && (
            <section className="bg-white border border-[#16A34A]/15 rounded-3xl p-8 shadow-sm">
              <div className="mb-8">
                <span className="text-[0.65rem] uppercase tracking-[0.2em] text-[#C9A84C] font-bold">Simple 4-Step Process</span>
                <h2 className="font-heading text-2xl font-bold mt-1 text-[#1C1C1C]">
                  How Your Jeddah Airport Transfer Works
                </h2>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { step: "1", title: "Flight Tracked", desc: "We monitor your flight status in real time for delays.", icon: Plane },
                  { step: "2", title: "Meet Your Driver", desc: "Meet your driver at the agreed airport pickup point.", icon: UserCheck },
                  { step: "3", title: "Optional Miqat Stop", desc: "Request a Miqat stop in advance if required for Ihram.", icon: Compass },
                  { step: "4", title: "Makkah Hotel Drop-Off", desc: "Direct drop-off at your requested Makkah destination.", icon: MapPin },
                ].map((s, idx) => {
                  const Icon = s.icon;
                  return (
                    <div key={idx} className="bg-[#FAFAF7] rounded-2xl p-5 border border-[#16A34A]/10 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#16A34A] text-xs font-bold text-white">
                            {s.step}
                          </span>
                          <Icon className="h-5 w-5 text-[#C9A84C]" />
                        </div>
                        <h3 className="font-bold text-sm text-[#1C1C1C] mb-1.5">{s.title}</h3>
                        <p className="text-xs text-[#6B7280] leading-relaxed">{s.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* ─── 4-STEP TRANSFER PROCESS (Makkah -> Madinah) ─── */}
          {slug === "makkah-to-madinah" && (
            <section className="bg-white border border-[#16A34A]/15 rounded-3xl p-8 shadow-sm">
              <div className="mb-8">
                <span className="text-[0.65rem] uppercase tracking-[0.2em] text-[#C9A84C] font-bold">Simple 4-Step Process</span>
                <h2 className="font-heading text-2xl font-bold mt-1 text-[#1C1C1C]">
                  How Your Makkah to Madinah Transfer Works
                </h2>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { step: "1", title: "Makkah Pickup", desc: "Driver collects you from your requested Makkah pickup point.", icon: MapPin },
                  { step: "2", title: "Haramain Highway", desc: "Comfortable drive on the Haramain highway towards Madinah.", icon: Navigation },
                  { step: "3", title: "Prayer & Rest Stop", desc: "Optional stops for prayer, food, or refreshments along the way.", icon: Coffee },
                  { step: "4", title: "Madinah Drop-Off", desc: "Direct drop-off at your requested Madinah destination.", icon: MapPin },
                ].map((s, idx) => {
                  const Icon = s.icon;
                  return (
                    <div key={idx} className="bg-[#FAFAF7] rounded-2xl p-5 border border-[#16A34A]/10 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#16A34A] text-xs font-bold text-white">
                            {s.step}
                          </span>
                          <Icon className="h-5 w-5 text-[#C9A84C]" />
                        </div>
                        <h3 className="font-bold text-sm text-[#1C1C1C] mb-1.5">{s.title}</h3>
                        <p className="text-xs text-[#6B7280] leading-relaxed">{s.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* ─── WHAT'S INCLUDED TRUST STRIP (JED -> Makkah) ─── */}
          {slug === "jeddah-airport-to-makkah" && (
            <section className="bg-gradient-to-r from-[#F0FDF4] via-white to-[#F0FDF4] border border-[#16A34A]/20 rounded-3xl p-8 shadow-sm">
              <h2 className="font-heading text-xl font-bold mb-6 flex items-center gap-2 text-[#1C1C1C]">
                <ShieldCheck className="h-5 w-5 text-[#16A34A]" />
                What&apos;s Included in Your JED ➔ Makkah Transfer
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  { title: "Clear-Price Private Transfer", desc: "Confirmed upfront fare with zero surge pricing." },
                  { title: "Meet & Greet Service", desc: "Driver waits in the arrivals hall with a name sign." },
                  { title: "Real-Time Flight Tracking", desc: "We track your landing time automatically." },
                  { title: "60 Mins Free Waiting Time", desc: "Ample time for baggage collection and customs." },
                  { title: "Direct Hotel Drop-Off", desc: "Door-to-door service at your Makkah hotel." },
                  { title: "Miqat Stop Available", desc: "Complimentary stop on request for assuming Ihram." },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-3 bg-white p-4 rounded-2xl border border-[#16A34A]/12 shadow-2xs">
                    <CheckCircle2 className="h-5 w-5 text-[#16A34A] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-xs text-[#1C1C1C]">{item.title}</h4>
                      <p className="text-[0.7rem] text-[#6B7280] mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ─── WHAT'S INCLUDED TRUST STRIP (Makkah -> Madinah) ─── */}
          {slug === "makkah-to-madinah" && (
            <section className="bg-gradient-to-r from-[#F0FDF4] via-white to-[#F0FDF4] border border-[#16A34A]/20 rounded-3xl p-8 shadow-sm">
              <h2 className="font-heading text-xl font-bold mb-6 flex items-center gap-2 text-[#1C1C1C]">
                <ShieldCheck className="h-5 w-5 text-[#16A34A]" />
                What&apos;s Included in Your Makkah ➔ Madinah Transfer
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  { title: "Clear-Price Private Transfer", desc: "Confirmed upfront fare — no surge, tolls included." },
                  { title: "24/7 Booking & Contact", desc: "Book and travel any time, day or night." },
                  { title: "Spacious Luggage Capacity", desc: "SUVs and vans available for families with luggage." },
                  { title: "Prayer & Rest Stops", desc: "Complimentary stops along the highway on request." },
                  { title: "Makkah Pickup", desc: "Collected from your requested Makkah pickup point." },
                  { title: "Madinah Drop-Off", desc: "Direct drop-off at your requested Madinah destination." },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-3 bg-white p-4 rounded-2xl border border-[#16A34A]/12 shadow-2xs">
                    <CheckCircle2 className="h-5 w-5 text-[#16A34A] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-xs text-[#1C1C1C]">{item.title}</h4>
                      <p className="text-[0.7rem] text-[#6B7280] mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ─── PILGRIM INTENT VISUAL BLOCK (JED -> Makkah) ─── */}
          {slug === "jeddah-airport-to-makkah" && (
            <section className="bg-white border border-[#C9A84C]/25 rounded-3xl p-8 relative overflow-hidden shadow-sm">
              <div className="max-w-2xl space-y-4">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/30 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-[#B8963B]">
                  Umrah &amp; Hajj Pilgrims
                </span>
                <h2 className="font-heading text-2xl font-bold text-[#1C1C1C]">
                  Jeddah Airport to Makkah for Umrah Travelers
                </h2>
                <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed">
                  Arriving at King Abdulaziz International Airport (JED) for Umrah? Whether your flight lands late at night or early in the morning, our 24/7 private chauffeurs ensure a seamless journey. We provide spacious vehicles for family luggage, direct drop-off at your requested Makkah destination, and a planned Miqat stop for Ihram.
                </p>
                <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-bold">
                  <Link href="/services/umrah-transport" className="text-[#16A34A] hover:underline inline-flex items-center gap-1">
                    Umrah Transport Services &rarr;
                  </Link>
                  <Link href="/services/makkah-ziyarat" className="text-[#16A34A] hover:underline inline-flex items-center gap-1">
                    Makkah Ziyarat Tours &rarr;
                  </Link>
                </div>
              </div>
            </section>
          )}

          {/* ─── PILGRIM INTENT VISUAL BLOCK (Makkah -> Madinah) ─── */}
          {slug === "makkah-to-madinah" && (
            <section className="bg-white border border-[#C9A84C]/25 rounded-3xl p-8 relative overflow-hidden shadow-sm">
              <div className="max-w-2xl space-y-4">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/30 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-[#B8963B]">
                  Umrah Travelers
                </span>
                <h2 className="font-heading text-2xl font-bold text-[#1C1C1C]">
                  Makkah to Madinah Taxi for Umrah Travelers
                </h2>
                <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed">
                  Completing your Umrah in Makkah and continuing to Madinah? This private intercity transfer covers the approximately 430 km journey in around 4 hours via the Haramain highway. Suitable for individuals, couples, and families — with spacious vehicles for luggage and prayer or rest stops along the way. The fare is fixed from SAR 499 and confirmed before booking.
                </p>
                <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-bold">
                  <Link href="/locations/makkah" className="text-[#16A34A] hover:underline inline-flex items-center gap-1">
                    Makkah taxi services &rarr;
                  </Link>
                  <Link href="/locations/madinah" className="text-[#16A34A] hover:underline inline-flex items-center gap-1">
                    Madinah taxi services &rarr;
                  </Link>
                  <Link href="/services/umrah-transport" className="text-[#16A34A] hover:underline inline-flex items-center gap-1">
                    Umrah transport &rarr;
                  </Link>
                  <Link href="/services/madinah-ziyarat" className="text-[#16A34A] hover:underline inline-flex items-center gap-1">
                    Madinah Ziyarat tours &rarr;
                  </Link>
                </div>
              </div>
            </section>
          )}

          {/* Route Tips */}
          <section className="bg-white border border-[#16A34A]/12 rounded-3xl p-8">
            <h2 className="font-heading text-2xl font-bold mb-6 flex items-center gap-3">
              <AlertTriangle className="text-[#C9A84C]" />
              Route Tips &amp; Information
            </h2>
            <ul className="space-y-4">
              <li className="flex gap-4">
                <CheckCircle2 className="h-5 w-5 text-[#C9A84C] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm">Clear, All-Inclusive Pricing</h4>
                  <p className="text-xs text-[#6B7280] mt-1">Your fare is confirmed with you on WhatsApp before booking. No hidden fees, no surge pricing, tolls and taxes included.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <CheckCircle2 className="h-5 w-5 text-[#C9A84C] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm">Meet &amp; Greet Service</h4>
                  <p className="text-xs text-[#6B7280] mt-1">Your driver will wait at the pickup location holding a name sign with your name on it.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <ShieldCheck className="h-5 w-5 text-[#C9A84C] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm">Professional &amp; Licensed</h4>
                  <p className="text-xs text-[#6B7280] mt-1">
                    {hasCredential(credentials.motLicenseNumber)
                      ? `All drivers are fully licensed by the Saudi Ministry of Transport (Licence ${credentials.motLicenseNumber}), speak English and Arabic, and are trained for professional service.`
                      : "All drivers hold a valid Saudi driving licence, speak English and Arabic, and are trained for professional service."}
                  </p>
                </div>
              </li>
            </ul>
          </section>

          {/* ─── INLINE BOOKING CTA BEFORE FAQ (JED -> Makkah) ─── */}
          {slug === "jeddah-airport-to-makkah" && (
            <section className="premium-dark-section bg-gradient-to-br from-[#16A34A] to-[#116B32] rounded-3xl p-8 sm:p-10 text-white text-center shadow-xl space-y-6">
              <div className="max-w-xl mx-auto space-y-3">
                <h2 className="font-heading text-2xl sm:text-3xl font-extrabold">
                  Ready to Travel from Jeddah Airport to Makkah?
                </h2>
                <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
                  Book your private transfer in under 2 minutes. Free cancellation up to 24 hours before pickup.
                </p>
              </div>

              <div className="flex flex-wrap justify-center items-center gap-4 text-xs font-bold uppercase tracking-wider pt-2">
                <Link
                  href={`/book?pickup=${encodeURIComponent(route.fromCity)}&dropoff=${encodeURIComponent(route.toCity)}`}
                  className="rounded-full bg-[#FACC15] px-8 py-3.5 text-[#1C1C1C] hover:bg-[#e5b810] transition-all hover:scale-105 shadow-md"
                >
                  Book Jeddah Airport ➔ Makkah
                </Link>
                <a
                  href={`https://wa.me/${contactConfig.whatsappNumber}?text=${encodeURIComponent(
                    `Salam! I want to book a taxi from Jeddah Airport to Makkah.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-white px-7 py-3.5 text-[#16A34A] hover:bg-white/90 transition-all hover:scale-105"
                >
                  WhatsApp Booking
                </a>
              </div>
            </section>
          )}

          {/* ─── INLINE BOOKING CTA BEFORE FAQ (Makkah -> Madinah) ─── */}
          {slug === "makkah-to-madinah" && (
            <section className="premium-dark-section bg-gradient-to-br from-[#16A34A] to-[#116B32] rounded-3xl p-8 sm:p-10 text-white text-center shadow-xl space-y-6">
              <div className="max-w-xl mx-auto space-y-3">
                <h2 className="font-heading text-2xl sm:text-3xl font-extrabold">
                  Ready to Travel from Makkah to Madinah?
                </h2>
                <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
                  Book your private transfer in under 2 minutes. Free cancellation up to 24 hours before pickup.
                </p>
              </div>

              <div className="flex flex-wrap justify-center items-center gap-4 text-xs font-bold uppercase tracking-wider pt-2">
                <Link
                  href={`/book?pickup=${encodeURIComponent(route.fromCity)}&dropoff=${encodeURIComponent(route.toCity)}`}
                  className="rounded-full bg-[#FACC15] px-8 py-3.5 text-[#1C1C1C] hover:bg-[#e5b810] transition-all hover:scale-105 shadow-md"
                >
                  Book Makkah ➔ Madinah Taxi
                </Link>
                <a
                  href={`https://wa.me/${contactConfig.whatsappNumber}?text=${encodeURIComponent(
                    `Salam! I want to book a private taxi from Makkah to Madinah.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-white px-7 py-3.5 text-[#16A34A] hover:bg-white/90 transition-all hover:scale-105"
                >
                  WhatsApp Booking
                </a>
              </div>
            </section>
          )}

          {/* FAQs */}
          <section>
            <h2 className="font-heading text-2xl font-bold mb-6 flex items-center gap-3">
              <HelpCircle className="text-[#C9A84C]" />
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div key={idx} className="border border-[#16A34A]/12 rounded-2xl p-5 bg-white shadow-2xs">
                  <h4 className="font-bold text-sm text-[#1C1C1C] mb-2">{faq.question}</h4>
                  <p className="text-xs text-[#6B7280] leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

          {slug === "jeddah-airport-to-makkah" && (
            <section className="mt-16 border-t border-[#C9A84C]/10 pt-10">
              <h2 className="font-heading text-2xl font-bold mb-6">
                Book by Hotel Near Masjid al-Haram
              </h2>
              <p className="text-xs text-[#6B7280] mb-6">
                Already have a hotel booked? Same clear price, direct drop-off at your hotel entrance.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {MAKKAH_HOTEL_ROUTES.map((h) => (
                  <Link
                    key={h.slug}
                    href={`/routes/${h.slug}`}
                    className="group flex items-center justify-between rounded-2xl border border-[#16A34A]/12 bg-white px-5 py-4 hover:border-[#16A34A]/35 transition-all"
                  >
                    <span className="text-sm font-semibold">
                      Taxi to {h.hotel}
                      <span className="block text-[0.65rem] text-[#6B7280] font-normal mt-0.5">
                        80 km · from SAR 249
                      </span>
                    </span>
                    <ArrowRight className="h-4 w-4 text-[#C9A84C] shrink-0 group-hover:translate-x-1 transition-transform" />
                  </Link>
                ))}
              </div>
            </section>
          )}

          {slug === "jeddah-airport-to-makkah" && (
            <section className="mt-16 border-t border-[#C9A84C]/10 pt-10">
              <h2 className="font-heading text-2xl font-bold mb-6">
                More Jeddah &amp; Makkah Routes
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {MORE_JEDDAH_MAKKAH_ROUTES.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/routes/${r.slug}`}
                    className="group flex items-center justify-between rounded-2xl border border-[#16A34A]/12 bg-white px-5 py-4 hover:border-[#16A34A]/35 transition-all"
                  >
                    <span className="text-sm font-semibold">
                      {r.label}
                      <span className="block text-[0.65rem] text-[#6B7280] font-normal mt-0.5">
                        {r.distance} km · from SAR {r.price}
                      </span>
                    </span>
                    <ArrowRight className="h-4 w-4 text-[#C9A84C] shrink-0 group-hover:translate-x-1 transition-transform" />
                  </Link>
                ))}
              </div>
            </section>
          )}

          {(slug === "madinah-to-makkah" || slug === "makkah-to-madinah") && (
            <section className="mt-16 border-t border-[#C9A84C]/10 pt-10">
              <h2 className="font-heading text-2xl font-bold mb-6">
                More Madinah Routes
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {MORE_MADINAH_ROUTES.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/routes/${r.slug}`}
                    className="group flex items-center justify-between rounded-2xl border border-[#16A34A]/12 bg-white px-5 py-4 hover:border-[#16A34A]/35 transition-all"
                  >
                    <span className="text-sm font-semibold">
                      {r.label}
                      <span className="block text-[0.65rem] text-[#6B7280] font-normal mt-0.5">
                        {r.distance} km · from SAR {r.price}
                      </span>
                    </span>
                    <ArrowRight className="h-4 w-4 text-[#C9A84C] shrink-0 group-hover:translate-x-1 transition-transform" />
                  </Link>
                ))}
              </div>
            </section>
          )}

          {slug === "riyadh-airport-to-city" && (
            <section className="mt-16 border-t border-[#C9A84C]/10 pt-10">
              <h2 className="font-heading text-2xl font-bold mb-6">
                More Riyadh Routes
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {MORE_RIYADH_ROUTES.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/routes/${r.slug}`}
                    className="group flex items-center justify-between rounded-2xl border border-[#16A34A]/12 bg-white px-5 py-4 hover:border-[#16A34A]/35 transition-all"
                  >
                    <span className="text-sm font-semibold">
                      {r.label}
                      <span className="block text-[0.65rem] text-[#6B7280] font-normal mt-0.5">
                        {r.distance} km · from SAR {r.price}
                      </span>
                    </span>
                    <ArrowRight className="h-4 w-4 text-[#C9A84C] shrink-0 group-hover:translate-x-1 transition-transform" />
                  </Link>
                ))}
              </div>
            </section>
          )}

          <RouteRelatedLinks slug={slug} fromCity={route.fromCity} toCity={route.toCity} />

        </div>

        {/* ─── RIGHT COLUMN (Booking Widget) ──────────────────────── */}
        <div className="lg:col-span-1">
          <div className="sticky top-[100px] bg-white border border-[#C9A84C]/30 rounded-3xl p-6 shadow-[0_8px_30px_rgba(22,163,74,0.1)]">
            <h3 className="font-heading text-xl font-bold mb-4">Book This Route</h3>
            
            <div className="space-y-4 mb-8">
              <div className="bg-[#FAFAF7] p-4 rounded-xl border border-[#C9A84C]/10 relative">
                <div className="absolute left-6 top-6 bottom-6 w-px bg-[#C9A84C]/30" />
                
                <div className="flex items-center gap-3 mb-6 relative z-10">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#16A34A] outline outline-4 outline-[#111]" />
                  <div>
                    <p className="text-[0.6rem] text-[#6B7280] font-bold uppercase tracking-wider">Pickup</p>
                    <p className="font-bold text-sm truncate">{route.fromCity}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 relative z-10">
                  <div className="w-2.5 h-2.5 rounded-full bg-white outline outline-4 outline-[#111]" />
                  <div>
                    <p className="text-[0.6rem] text-[#6B7280] font-bold uppercase tracking-wider">Dropoff</p>
                    <p className="font-bold text-sm truncate">{route.toCity}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center px-2">
                {route.priceOnRequest ? (
                  <span className="text-sm font-bold text-[#16A34A]">Price confirmed on WhatsApp</span>
                ) : (
                  <>
                    <span className="text-sm font-bold text-[#6B7280]">Starting from</span>
                    <span className="font-heading text-2xl font-bold text-[#16A34A]">SAR {route.basePrice}</span>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <Link
                href={`/book?pickup=${encodeURIComponent(route.fromCity)}&dropoff=${encodeURIComponent(route.toCity)}`}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#16A34A] py-3.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#15803D] transition-all"
              >
                Proceed to Booking <ArrowRight className="h-4 w-4" />
              </Link>
              
              <a
                href={`https://wa.me/${contactConfig.whatsappNumber}?text=${encodeURIComponent(
                  `Salam! I want to book a taxi with Taxi Saudi Arabia.\n\n` +
                    `• From: \n` +
                    `• To: \n` +
                    `• Date & time: \n` +
                    `• Passengers & luggage: \n` +
                    `• Vehicle (Sedan / SUV / Van): `,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-full border border-[#C9A84C]/30 py-3.5 text-xs font-bold uppercase tracking-wider text-[#B8963B] hover:bg-[#C9A84C]/10 transition-all"
              >
                Book via WhatsApp
              </a>
            </div>
            
            <p className="text-center text-[0.6rem] text-[#6B7280] mt-4">Free cancellation up to 24h before pickup</p>
          </div>
        </div>
      </div>

      {/* ─── MOBILE STICKY BOOKING BAR (JED -> Makkah) ─────────────── */}
      {slug === "jeddah-airport-to-makkah" && (
        <div className="fixed bottom-0 inset-x-0 z-50 lg:hidden bg-white/95 backdrop-blur-md border-t border-[#16A34A]/20 p-3 px-4 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
            <div>
              <p className="text-[0.65rem] font-bold text-[#1C1C1C] uppercase tracking-wider">JED ➔ Makkah</p>
              <p className="text-xs font-extrabold text-[#16A34A]">From SAR 249</p>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={`https://wa.me/${contactConfig.whatsappNumber}?text=${encodeURIComponent(
                  `Salam! I want to book a taxi from Jeddah Airport to Makkah.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-full border border-[#C9A84C]/40 bg-[#C9A84C]/10 px-3.5 py-2 text-xs font-bold text-[#B8963B] hover:bg-[#C9A84C]/20 transition-all"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                <span>WhatsApp</span>
              </a>
              <Link
                href={`/book?pickup=${encodeURIComponent(route.fromCity)}&dropoff=${encodeURIComponent(route.toCity)}`}
                className="inline-flex items-center gap-1 rounded-full bg-[#16A34A] px-4 py-2 text-xs font-bold uppercase text-white hover:bg-[#15803D] transition-all shadow-sm"
              >
                <span>Book Now</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ─── MOBILE STICKY BOOKING BAR (Makkah -> Madinah) ─────────────── */}
      {slug === "makkah-to-madinah" && (
        <div className="fixed bottom-0 inset-x-0 z-50 lg:hidden bg-white/95 backdrop-blur-md border-t border-[#16A34A]/20 p-3 px-4 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
            <div>
              <p className="text-[0.65rem] font-bold text-[#1C1C1C] uppercase tracking-wider">Makkah ➔ Madinah</p>
              <p className="text-xs font-extrabold text-[#16A34A]">From SAR 499</p>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={`https://wa.me/${contactConfig.whatsappNumber}?text=${encodeURIComponent(
                  `Salam! I want to book a private taxi from Makkah to Madinah.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-full border border-[#C9A84C]/40 bg-[#C9A84C]/10 px-3.5 py-2 text-xs font-bold text-[#B8963B] hover:bg-[#C9A84C]/20 transition-all"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                <span>WhatsApp</span>
              </a>
              <Link
                href={`/book?pickup=${encodeURIComponent(route.fromCity)}&dropoff=${encodeURIComponent(route.toCity)}`}
                className="inline-flex items-center gap-1 rounded-full bg-[#16A34A] px-4 py-2 text-xs font-bold uppercase text-white hover:bg-[#15803D] transition-all shadow-sm"
              >
                <span>Book Now</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
