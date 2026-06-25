import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MapPin, ArrowRight, Car, ShieldCheck, Star, Clock, Building2, HelpCircle, PlaneLanding } from "lucide-react";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { serviceSchema, faqSchema } from "@/lib/schema";
import { TLDRSummary } from "@/components/seo/TLDRSummary";

export const revalidate = 86400; // revalidate every 24 hours

const SUB_AREAS: Record<string, {
  city: string;
  subarea: string;
  name: string;
  nameAr: string;
  description: string;
  // Optional rich fields (populated per city — programmatic Wave 3).
  airportMin?: string;
  makkahMin?: string;
  // Optional label overrides for the Travel-Times card (defaults: JED airport + Makkah Haram).
  airportLabel?: string;
  nearLabel?: string;
  landmarks?: string[];
  popularFor?: string;
  tldr?: string;
  tldrFacts?: { label: string; value: string }[];
  faqs?: { question: string; answer: string }[];
}> = {
  // Riyadh
  "kafd": { city: "riyadh", subarea: "kafd", name: "KAFD (King Abdullah Financial District)", nameAr: "مركز الملك عبدالله المالي", description: "Premium executive transport and corporate taxi services for KAFD professionals and visitors." },
  "olaya": { city: "riyadh", subarea: "olaya", name: "Olaya", nameAr: "العليا", description: "Reliable taxi services in the heart of Riyadh's commercial district, Olaya." },
  "diplomatic-quarter": { city: "riyadh", subarea: "diplomatic-quarter", name: "Diplomatic Quarter (DQ)", nameAr: "الحي الدبلوماسي", description: "Discreet and secure luxury chauffeur services for the Diplomatic Quarter." },
  "al-malaz": { city: "riyadh", subarea: "al-malaz", name: "Al Malaz", nameAr: "الملز", description: "Local and intercity taxi bookings from Al Malaz, Riyadh." },
  "al-murabba": { city: "riyadh", subarea: "al-murabba", name: "Al Murabba", nameAr: "المربع", description: "Historical Al Murabba taxi and private transport services." },
  "diriyah": { city: "riyadh", subarea: "diriyah", name: "Diriyah", nameAr: "الدرعية", description: "Heritage tours and luxury transfers to At-Turaif and Diriyah." },
  // Jeddah (Wave 3 — rich programmatic pages)
  "al-balad": {
    city: "jeddah", subarea: "al-balad", name: "Al Balad (Historical Jeddah)", nameAr: "البلد",
    description: "Book a fixed-price taxi in Al Balad, the UNESCO-listed historic heart of Jeddah, with door-to-door pickup from the old souks and coral-stone houses.",
    airportMin: "~30 min", makkahMin: "~1 hr", popularFor: "Heritage tourism, souks, museums",
    landmarks: ["Al-Balad UNESCO Old Town", "Naseef House", "Souq Al-Alawi", "Bab Makkah"],
    tldr: "A taxi in Al Balad, historic Jeddah, is fixed-price and available 24/7. It is about 30 minutes to King Abdulaziz Airport (JED) and roughly 1 hour to Makkah, with door-to-door pickup from the old town.",
    tldrFacts: [{ label: "To JED", value: "~30 min" }, { label: "To Makkah", value: "~1 hr" }, { label: "Pricing", value: "Fixed" }, { label: "Hours", value: "24/7" }],
    faqs: [
      { question: "How far is Al Balad from Jeddah airport?", answer: "Al Balad is about 30 minutes from King Abdulaziz International Airport (JED) by taxi, depending on traffic. We offer fixed-price meet & greet transfers both ways." },
      { question: "Can I get a taxi from Al Balad to Makkah?", answer: "Yes. Al Balad to Makkah is roughly a 1-hour drive (~85 km). The fixed fare is confirmed before booking, with an optional Miqat stop for Ihram." },
      { question: "Is taxi pickup available inside the old town?", answer: "Yes, we pick up door-to-door from hotels, souks, and landmarks across Al Balad, 24/7." },
    ],
  },
  "corniche": {
    city: "jeddah", subarea: "corniche", name: "Jeddah Corniche", nameAr: "كورنيش جدة",
    description: "Scenic rides and immediate fixed-price pickups along the Jeddah Corniche and waterfront, from King Fahd's Fountain to the Floating Mosque.",
    airportMin: "~25 min", makkahMin: "~1 hr 10 min", popularFor: "Waterfront leisure, dining, family outings",
    landmarks: ["King Fahd's Fountain", "Al-Rahma (Floating) Mosque", "Jeddah Waterfront", "Jeddah Corniche Circuit"],
    tldr: "A taxi along the Jeddah Corniche is fixed-price and available 24/7. The waterfront is about 25 minutes from King Abdulaziz Airport (JED) and roughly 1 hour 10 minutes to Makkah.",
    tldrFacts: [{ label: "To JED", value: "~25 min" }, { label: "To Makkah", value: "~1 hr 10 min" }, { label: "Pricing", value: "Fixed" }, { label: "Hours", value: "24/7" }],
    faqs: [
      { question: "How far is the Jeddah Corniche from the airport?", answer: "The Corniche is about 25 minutes from King Abdulaziz International Airport (JED) by taxi, depending on traffic and which section of the waterfront you need." },
      { question: "Can you pick up along the Corniche at night?", answer: "Yes, we operate 24/7 with fixed prices and quick pickups anywhere along the Jeddah Corniche and waterfront." },
      { question: "Do you offer Corniche sightseeing rides?", answer: "Yes, we provide hourly hire and city-tour rides covering King Fahd's Fountain, the Floating Mosque, and the waterfront promenade." },
    ],
  },
  "al-hamra": {
    city: "jeddah", subarea: "al-hamra", name: "Al Hamra", nameAr: "الحمراء",
    description: "Fixed-price taxi service in Al Hamra, Jeddah — close to King Fahd's Fountain, the consulates district, and waterfront hotels.",
    airportMin: "~25 min", makkahMin: "~1 hr", popularFor: "Hotels, consulates, business",
    landmarks: ["King Fahd's Fountain", "Consulates District", "Al Hamra Corniche"],
    tldr: "A taxi in Al Hamra, Jeddah is fixed-price and available 24/7. The district is about 25 minutes from King Abdulaziz Airport (JED) and roughly 1 hour to Makkah.",
    tldrFacts: [{ label: "To JED", value: "~25 min" }, { label: "To Makkah", value: "~1 hr" }, { label: "Pricing", value: "Fixed" }, { label: "Hours", value: "24/7" }],
    faqs: [
      { question: "How far is Al Hamra from Jeddah airport?", answer: "Al Hamra is about 25 minutes from King Abdulaziz International Airport (JED) by taxi. We offer fixed-price transfers with meet & greet on arrival." },
      { question: "Do you serve the consulates area in Al Hamra?", answer: "Yes, we provide reliable pickups across Al Hamra including the consulates district and waterfront hotels, 24/7." },
      { question: "How much is a taxi from Al Hamra to Makkah?", answer: "Al Hamra to Makkah is about a 1-hour drive at a fixed fare confirmed before you book, with an optional Miqat stop." },
    ],
  },
  "obhur": {
    city: "jeddah", subarea: "obhur", name: "Obhur (Abhur)", nameAr: "أبحر",
    description: "Transfers to and from the beach resorts of Obhur (Abhur North & South), north Jeddah, with fixed prices and 24/7 availability.",
    airportMin: "~30–40 min", makkahMin: "~1 hr 20 min", popularFor: "Beach resorts, diving, weekend getaways",
    landmarks: ["Obhur Creek", "Silver Sands Beach", "North Obhur Resorts", "Red Sea diving sites"],
    tldr: "A taxi to or from Obhur (Abhur), north Jeddah's resort area, is fixed-price and available 24/7. It is about 30–40 minutes to King Abdulaziz Airport (JED) and roughly 1 hour 20 minutes to Makkah.",
    tldrFacts: [{ label: "To JED", value: "~30–40 min" }, { label: "To Makkah", value: "~1 hr 20 min" }, { label: "Pricing", value: "Fixed" }, { label: "Hours", value: "24/7" }],
    faqs: [
      { question: "How far is Obhur from Jeddah airport?", answer: "Obhur (Abhur) is about 30–40 minutes from King Abdulaziz International Airport (JED), depending on whether you need North or South Obhur. We offer fixed-price resort transfers." },
      { question: "Can you pick up from Obhur beach resorts?", answer: "Yes, we provide door-to-door pickup from resorts and compounds across North and South Obhur, 24/7." },
      { question: "Is Obhur far from Makkah by taxi?", answer: "Obhur to Makkah is about a 1 hour 20 minute drive. We provide comfortable fixed-price transfers with luggage space for families." },
    ],
  },
  "al-safaa": {
    city: "jeddah", subarea: "al-safaa", name: "Al Safaa", nameAr: "الصفا",
    description: "Fast, fixed-price 24/7 taxi dispatch in the Al Safaa district of Jeddah for local rides, airport transfers, and Makkah trips.",
    airportMin: "~20 min", makkahMin: "~1 hr", popularFor: "Residential pickups, local rides",
    landmarks: ["Al Safaa residential district", "Prince Majid Road"],
    tldr: "A taxi in Al Safaa, Jeddah is fixed-price and available 24/7. The district is about 20 minutes from King Abdulaziz Airport (JED) and roughly 1 hour to Makkah.",
    tldrFacts: [{ label: "To JED", value: "~20 min" }, { label: "To Makkah", value: "~1 hr" }, { label: "Pricing", value: "Fixed" }, { label: "Hours", value: "24/7" }],
    faqs: [
      { question: "How far is Al Safaa from Jeddah airport?", answer: "Al Safaa is about 20 minutes from King Abdulaziz International Airport (JED) by taxi, with fixed-price transfers both ways." },
      { question: "Is 24/7 taxi available in Al Safaa?", answer: "Yes, we dispatch around the clock in Al Safaa for local rides, airport pickups, and intercity transfers." },
      { question: "Can I book Al Safaa to Makkah in advance?", answer: "Yes. Al Safaa to Makkah is about a 1-hour drive; pre-booking guarantees a fixed price and a Miqat stop for Ihram on request." },
    ],
  },
  "al-rawdah": {
    city: "jeddah", subarea: "al-rawdah", name: "Al Rawdah", nameAr: "الروضة",
    description: "Premium fixed-price taxi pickups in the upscale Al Rawdah neighbourhood of Jeddah, near malls, clinics, and business offices.",
    airportMin: "~25 min", makkahMin: "~1 hr", popularFor: "Shopping, clinics, business",
    landmarks: ["Red Sea Mall (nearby)", "Al Rawdah business offices", "Prince Sultan Road"],
    tldr: "A taxi in Al Rawdah, Jeddah is fixed-price and available 24/7. This upscale district is about 25 minutes from King Abdulaziz Airport (JED) and roughly 1 hour to Makkah.",
    tldrFacts: [{ label: "To JED", value: "~25 min" }, { label: "To Makkah", value: "~1 hr" }, { label: "Pricing", value: "Fixed" }, { label: "Hours", value: "24/7" }],
    faqs: [
      { question: "How far is Al Rawdah from Jeddah airport?", answer: "Al Rawdah is about 25 minutes from King Abdulaziz International Airport (JED) by taxi, with fixed-price meet & greet transfers." },
      { question: "Do you serve Red Sea Mall and Al Rawdah offices?", answer: "Yes, we provide quick pickups across Al Rawdah including malls, clinics, and business offices, 24/7." },
      { question: "How much is Al Rawdah to Makkah by taxi?", answer: "Al Rawdah to Makkah is about a 1-hour drive at a fixed fare confirmed before booking, with an optional Miqat stop for Ihram." },
    ],
  },
  "al-shati": {
    city: "jeddah", subarea: "al-shati", name: "Al Shati (Ash Shati)", nameAr: "الشاطئ",
    description: "Fixed-price taxi service in Al Shati, north Jeddah's seafront district, near the northern Corniche and waterfront hotels.",
    airportMin: "~25 min", makkahMin: "~1 hr 10 min", popularFor: "Seafront living, hotels, dining",
    landmarks: ["Northern Corniche", "Al Shati waterfront", "Jeddah Yacht Club (nearby)"],
    tldr: "A taxi in Al Shati, north Jeddah is fixed-price and available 24/7. The seafront district is about 25 minutes from King Abdulaziz Airport (JED) and roughly 1 hour 10 minutes to Makkah.",
    tldrFacts: [{ label: "To JED", value: "~25 min" }, { label: "To Makkah", value: "~1 hr 10 min" }, { label: "Pricing", value: "Fixed" }, { label: "Hours", value: "24/7" }],
    faqs: [
      { question: "How far is Al Shati from Jeddah airport?", answer: "Al Shati is about 25 minutes from King Abdulaziz International Airport (JED) by taxi, with fixed-price transfers both ways." },
      { question: "Do you pick up from Al Shati waterfront hotels?", answer: "Yes, we provide door-to-door pickup across Al Shati including the northern Corniche and seafront hotels, 24/7." },
      { question: "Can I book Al Shati to Makkah?", answer: "Yes. Al Shati to Makkah is about a 1 hour 10 minute drive at a fixed fare, with a Miqat stop available on request." },
    ],
  },
  "al-salamah": {
    city: "jeddah", subarea: "al-salamah", name: "Al Salamah", nameAr: "السلامة",
    description: "Reliable fixed-price taxi pickups in Al Salamah, a central Jeddah district near malls and the Corniche.",
    airportMin: "~20 min", makkahMin: "~1 hr", popularFor: "Shopping, residential, local rides",
    landmarks: ["Salama Mall", "Heraa Street", "Al Salamah residential district"],
    tldr: "A taxi in Al Salamah, Jeddah is fixed-price and available 24/7. The district is about 20 minutes from King Abdulaziz Airport (JED) and roughly 1 hour to Makkah.",
    tldrFacts: [{ label: "To JED", value: "~20 min" }, { label: "To Makkah", value: "~1 hr" }, { label: "Pricing", value: "Fixed" }, { label: "Hours", value: "24/7" }],
    faqs: [
      { question: "How far is Al Salamah from Jeddah airport?", answer: "Al Salamah is about 20 minutes from King Abdulaziz International Airport (JED) by taxi, with fixed-price transfers." },
      { question: "Is taxi available 24/7 in Al Salamah?", answer: "Yes, we dispatch around the clock in Al Salamah for local rides, airport transfers, and Makkah trips." },
      { question: "How much is Al Salamah to Makkah?", answer: "Al Salamah to Makkah is about a 1-hour drive at a fixed fare confirmed before booking, with a Miqat stop on request." },
    ],
  },
  "al-aziziyah-jeddah": {
    city: "jeddah", subarea: "al-aziziyah-jeddah", name: "Al Aziziyah", nameAr: "العزيزية",
    description: "Fixed-price taxi service in Al Aziziyah, east Jeddah — convenient access to the Makkah Expressway for fast pilgrim transfers.",
    airportMin: "~25 min", makkahMin: "~55 min", popularFor: "Residential, fast Makkah access",
    landmarks: ["Makkah Expressway access", "Al Aziziyah district"],
    tldr: "A taxi in Al Aziziyah, east Jeddah is fixed-price and available 24/7. With quick access to the Makkah Expressway, it is about 55 minutes to Makkah and 25 minutes to King Abdulaziz Airport (JED).",
    tldrFacts: [{ label: "To JED", value: "~25 min" }, { label: "To Makkah", value: "~55 min" }, { label: "Pricing", value: "Fixed" }, { label: "Hours", value: "24/7" }],
    faqs: [
      { question: "How far is Al Aziziyah, Jeddah from Makkah?", answer: "Al Aziziyah in east Jeddah has fast access to the Makkah Expressway, so it is about a 55-minute drive to Makkah at a fixed fare, with an optional Miqat stop." },
      { question: "How far is Al Aziziyah from Jeddah airport?", answer: "Al Aziziyah is about 25 minutes from King Abdulaziz International Airport (JED) by taxi, with fixed-price transfers." },
      { question: "Is 24/7 taxi available in Al Aziziyah?", answer: "Yes, we provide round-the-clock pickups in Al Aziziyah for local, airport, and Makkah trips." },
    ],
  },
  "al-faisaliyah": {
    city: "jeddah", subarea: "al-faisaliyah", name: "Al Faisaliyah", nameAr: "الفيصلية",
    description: "Fixed-price taxi pickups in Al Faisaliyah, central Jeddah, for local rides, airport transfers, and Makkah trips.",
    airportMin: "~25 min", makkahMin: "~1 hr", popularFor: "Residential, local rides",
    landmarks: ["Al Faisaliyah district", "Falasteen Street"],
    tldr: "A taxi in Al Faisaliyah, central Jeddah is fixed-price and available 24/7. The district is about 25 minutes from King Abdulaziz Airport (JED) and roughly 1 hour to Makkah.",
    tldrFacts: [{ label: "To JED", value: "~25 min" }, { label: "To Makkah", value: "~1 hr" }, { label: "Pricing", value: "Fixed" }, { label: "Hours", value: "24/7" }],
    faqs: [
      { question: "How far is Al Faisaliyah from Jeddah airport?", answer: "Al Faisaliyah is about 25 minutes from King Abdulaziz International Airport (JED) by taxi, with fixed-price transfers both ways." },
      { question: "Is taxi available 24/7 in Al Faisaliyah?", answer: "Yes, we dispatch around the clock in Al Faisaliyah for local rides, airport pickups, and Makkah transfers." },
      { question: "How much is Al Faisaliyah to Makkah?", answer: "Al Faisaliyah to Makkah is about a 1-hour drive at a fixed fare, with a Miqat stop for Ihram on request." },
    ],
  },
  "al-andalus": {
    city: "jeddah", subarea: "al-andalus", name: "Al Andalus", nameAr: "الأندلس",
    description: "Fixed-price taxi service in Al Andalus, central Jeddah, near malls and main roads for fast local and airport rides.",
    airportMin: "~20 min", makkahMin: "~1 hr", popularFor: "Shopping, residential, business",
    landmarks: ["Al Andalus Mall (nearby)", "Al Andalus district", "King Abdullah Road"],
    tldr: "A taxi in Al Andalus, central Jeddah is fixed-price and available 24/7. The district is about 20 minutes from King Abdulaziz Airport (JED) and roughly 1 hour to Makkah.",
    tldrFacts: [{ label: "To JED", value: "~20 min" }, { label: "To Makkah", value: "~1 hr" }, { label: "Pricing", value: "Fixed" }, { label: "Hours", value: "24/7" }],
    faqs: [
      { question: "How far is Al Andalus from Jeddah airport?", answer: "Al Andalus is about 20 minutes from King Abdulaziz International Airport (JED) by taxi, with fixed-price transfers." },
      { question: "Do you serve Al Andalus malls and offices?", answer: "Yes, we provide quick pickups across Al Andalus including malls, offices, and residential areas, 24/7." },
      { question: "How much is Al Andalus to Makkah by taxi?", answer: "Al Andalus to Makkah is about a 1-hour drive at a fixed fare confirmed before booking, with an optional Miqat stop." },
    ],
  },
  "city-tour": {
    city: "jeddah", subarea: "city-tour", name: "Jeddah City Tour", nameAr: "جولة مدينة جدة",
    description: "Private Jeddah city tour by car — visit Al-Balad UNESCO old town, the Corniche, King Fahd's Fountain, and the Floating Mosque with your own driver and flexible timing.",
    airportMin: "~20–30 min", makkahMin: "—", popularFor: "Sightseeing, tourists, half-day & full-day tours",
    landmarks: ["Al-Balad UNESCO Old Town", "King Fahd's Fountain", "Al-Rahma Floating Mosque", "Jeddah Corniche", "Souq Al-Alawi"],
    tldr: "A private Jeddah city tour by car covers Al-Balad old town, the Corniche, King Fahd's Fountain, and the Floating Mosque. Half-day and full-day options are available with a private driver, fixed price, and flexible stops.",
    tldrFacts: [{ label: "Half day", value: "~4 hours" }, { label: "Full day", value: "~8 hours" }, { label: "Vehicle", value: "Private car/SUV" }, { label: "Pricing", value: "Fixed" }],
    faqs: [
      { question: "What does a Jeddah city tour include?", answer: "A private Jeddah city tour typically covers Al-Balad (the UNESCO historic district), the Corniche and waterfront, King Fahd's Fountain, and the Al-Rahma Floating Mosque, with flexible stops and waiting time included." },
      { question: "How long is a Jeddah city tour?", answer: "We offer half-day tours (about 4 hours) and full-day tours (about 8 hours) by private car or SUV, at a fixed price agreed before you book." },
      { question: "Can the Jeddah tour start from my hotel or the airport?", answer: "Yes. The tour can start from any Jeddah hotel or directly from King Abdulaziz International Airport (JED), and we tailor the route to your interests." },
    ],
  },
  // Makkah (rich programmatic pages)
  "aziziyah": {
    city: "makkah", subarea: "aziziyah", name: "Aziziyah", nameAr: "العزيزية",
    description: "Dedicated Umrah and Hajj taxi transfers from Aziziyah hotels to Masjid al-Haram, plus return trips to Jeddah Airport — fixed-price and 24/7.",
    airportMin: "~50 min", makkahMin: "~10 min drive", popularFor: "Pilgrim hotels, Hajj/Umrah stays",
    landmarks: ["Aziziyah hotel district", "Route to Mina & Arafat", "Masjid al-Haram (nearby)"],
    tldr: "A taxi in Aziziyah, Makkah is fixed-price and available 24/7. The district is about a 10-minute drive to Masjid al-Haram and roughly 50 minutes to Jeddah Airport (JED).",
    tldrFacts: [{ label: "To Haram", value: "~10 min" }, { label: "To JED", value: "~50 min" }, { label: "Pricing", value: "Fixed" }, { label: "Hours", value: "24/7" }],
    faqs: [
      { question: "How far is Aziziyah from the Haram?", answer: "Aziziyah is about a 10-minute drive from Masjid al-Haram. We offer fixed-price transfers to the closest permitted drop-off, with prayer-time road closures handled by the driver." },
      { question: "Can you take us from Aziziyah to Jeddah airport?", answer: "Yes. Aziziyah to King Abdulaziz International Airport (JED) is about 50 minutes; pre-book your departure with buffer time before your flight." },
      { question: "Do you serve Aziziyah for Hajj transport?", answer: "Yes, we provide permitted transfers between Aziziyah hotels, the Haram, and the routes towards Mina and Arafat during the seasons." },
    ],
  },
  "ajyad": {
    city: "makkah", subarea: "ajyad", name: "Ajyad", nameAr: "أجياد",
    description: "Immediate fixed-price taxi availability in Ajyad, directly adjacent to Masjid al-Haram — ideal for hotel transfers and airport departures.",
    airportMin: "~1 hr", makkahMin: "~5 min walk", popularFor: "Haram-adjacent hotels, easy access",
    landmarks: ["Masjid al-Haram", "Ajyad Street hotels", "Clock Tower (Abraj Al Bait)"],
    tldr: "A taxi in Ajyad, Makkah is fixed-price and available 24/7. Ajyad sits beside Masjid al-Haram (about a 5-minute walk) and is roughly 1 hour from Jeddah Airport (JED).",
    tldrFacts: [{ label: "To Haram", value: "~5 min walk" }, { label: "To JED", value: "~1 hr" }, { label: "Pricing", value: "Fixed" }, { label: "Hours", value: "24/7" }],
    faqs: [
      { question: "Is Ajyad close to the Haram?", answer: "Yes, Ajyad is directly adjacent to Masjid al-Haram — about a 5-minute walk. For airport departures we collect you from the nearest vehicle-permitted point." },
      { question: "How much is a taxi from Ajyad to Jeddah airport?", answer: "Ajyad to King Abdulaziz International Airport (JED) is about 1 hour, fixed-price from SAR 180. Pre-book with buffer time before your flight." },
      { question: "Can you pick up from Ajyad hotels during prayer times?", answer: "Yes. When roads near the Haram close for Salah, the driver meets you at the closest permitted checkpoint." },
    ],
  },
  "al-awali-makkah": {
    city: "makkah", subarea: "al-awali-makkah", name: "Al Awali", nameAr: "العوالي",
    description: "Comfortable fixed-price rides and Jeddah Airport transfers from Al Awali, southern Makkah, with quick access to the expressway.",
    airportMin: "~55 min", makkahMin: "~15 min drive", popularFor: "Residential, modern compounds",
    landmarks: ["Al Awali district", "Makkah expressway access", "Route to Jeddah"],
    tldr: "A taxi in Al Awali, Makkah is fixed-price and available 24/7. The district is about a 15-minute drive to Masjid al-Haram and roughly 55 minutes to Jeddah Airport (JED).",
    tldrFacts: [{ label: "To Haram", value: "~15 min" }, { label: "To JED", value: "~55 min" }, { label: "Pricing", value: "Fixed" }, { label: "Hours", value: "24/7" }],
    faqs: [
      { question: "How far is Al Awali from the Haram?", answer: "Al Awali is about a 15-minute drive from Masjid al-Haram, with fixed-price transfers to the nearest permitted drop-off." },
      { question: "Can you collect from Al Awali for Jeddah airport?", answer: "Yes. Al Awali to King Abdulaziz International Airport (JED) is about 55 minutes; pre-book your departure for a fixed price." },
      { question: "Is 24/7 taxi available in Al Awali?", answer: "Yes, we dispatch around the clock in Al Awali for Haram transfers, airport returns, and intercity trips." },
    ],
  },
  "al-shubaikah": {
    city: "makkah", subarea: "al-shubaikah", name: "Al Shubaikah", nameAr: "الشبيكة",
    description: "Local Makkah taxi service for pilgrims staying in Al Shubaikah, close to Masjid al-Haram and the Jeddah road.",
    airportMin: "~1 hr", makkahMin: "~5–10 min walk", popularFor: "Haram-area hotels, pilgrims",
    landmarks: ["Masjid al-Haram (nearby)", "Jarwal / Shubaikah hotels", "Route to Jeddah"],
    tldr: "A taxi in Al Shubaikah, Makkah is fixed-price and available 24/7. The district is a short 5–10 minute walk from Masjid al-Haram and about 1 hour from Jeddah Airport (JED).",
    tldrFacts: [{ label: "To Haram", value: "~5–10 min walk" }, { label: "To JED", value: "~1 hr" }, { label: "Pricing", value: "Fixed" }, { label: "Hours", value: "24/7" }],
    faqs: [
      { question: "Is Al Shubaikah near the Haram?", answer: "Yes, Al Shubaikah is one of the closest districts to Masjid al-Haram — a short 5–10 minute walk. Vehicle pickup is from the nearest permitted point." },
      { question: "How much is Al Shubaikah to Jeddah airport?", answer: "Al Shubaikah to King Abdulaziz International Airport (JED) is about 1 hour, fixed-price from SAR 180, available 24/7." },
      { question: "Do you serve Al Shubaikah for hotel transfers?", answer: "Yes, we provide fixed-price pickups for pilgrims staying in Al Shubaikah and the surrounding Haram-area hotels." },
    ],
  },
  "al-mansour": {
    city: "makkah", subarea: "al-mansour", name: "Al Mansour", nameAr: "المنصور",
    description: "Reliable and affordable fixed-price taxi rides in the Al Mansour district of Makkah for Haram transfers and airport departures.",
    airportMin: "~55 min", makkahMin: "~10 min drive", popularFor: "Residential, local rides",
    landmarks: ["Al Mansour district", "Route to Haram", "Makkah ring road"],
    tldr: "A taxi in Al Mansour, Makkah is fixed-price and available 24/7. The district is about a 10-minute drive to Masjid al-Haram and roughly 55 minutes to Jeddah Airport (JED).",
    tldrFacts: [{ label: "To Haram", value: "~10 min" }, { label: "To JED", value: "~55 min" }, { label: "Pricing", value: "Fixed" }, { label: "Hours", value: "24/7" }],
    faqs: [
      { question: "How far is Al Mansour from the Haram?", answer: "Al Mansour is about a 10-minute drive from Masjid al-Haram, with fixed-price transfers to the closest permitted drop-off." },
      { question: "Can you take us from Al Mansour to Jeddah airport?", answer: "Yes. Al Mansour to King Abdulaziz International Airport (JED) is about 55 minutes; pre-book for a fixed price and buffer time." },
      { question: "Is taxi available 24/7 in Al Mansour?", answer: "Yes, we dispatch around the clock in Al Mansour for Haram transfers, airport returns, and intercity trips." },
    ],
  },
  "mina": {
    city: "makkah", subarea: "mina", name: "Mina", nameAr: "منى",
    description: "Permitted Hajj transport and year-round transfers to the Valley of Mina, the tent city east of Makkah, with experienced pilgrim drivers.",
    airportMin: "~1 hr 10 min", makkahMin: "~8 km (~15 min)", popularFor: "Hajj, Mina/Arafat/Muzdalifah",
    landmarks: ["Valley of Mina (tent city)", "Jamarat", "Route to Arafat & Muzdalifah"],
    tldr: "Taxi Saudi Arabia provides permitted transport to and around Mina, about 8 km east of Masjid al-Haram. Mina is the central point of the Hajj rites, linking Arafat and Muzdalifah.",
    tldrFacts: [{ label: "To Haram", value: "~8 km" }, { label: "To JED", value: "~1 hr 10 min" }, { label: "Use", value: "Hajj transport" }, { label: "Hours", value: "Seasonal/24/7" }],
    faqs: [
      { question: "How far is Mina from Makkah?", answer: "Mina is about 8 km east of Masjid al-Haram — roughly a 15-minute drive outside peak Hajj times. During Hajj, vehicle access follows official routing and permits." },
      { question: "Do you provide Hajj transport to Mina, Arafat and Muzdalifah?", answer: "Yes, we arrange permitted transfers connecting the Hajj sites of Mina, Arafat, and Muzdalifah. Contact us in advance during the Hajj season to plan logistics." },
      { question: "Can I visit Mina outside the Hajj season?", answer: "Yes, the Mina area can be visited year-round by car as part of a Ziyarat tour, with our driver explaining the significance of each site." },
    ],
  },
  // Madinah (rich programmatic pages)
  "al-markazia": {
    city: "madinah", subarea: "al-markazia", name: "Al Markazia (Central Area)", nameAr: "المركزية",
    description: "Fixed-price taxi and Ziyarat tours starting directly from Al Markazia (Central Area) hotels beside Masjid an-Nabawi.",
    airportMin: "~25 min", makkahMin: "~5 min walk", airportLabel: "Madinah Airport (MED)", nearLabel: "Masjid an-Nabawi", popularFor: "Haram-area hotels, pilgrims",
    landmarks: ["Masjid an-Nabawi", "Central Area (Markazia) hotels", "Quba Road"],
    tldr: "A taxi in Al Markazia, the Central Area of Madinah, is fixed-price and available 24/7. It sits beside Masjid an-Nabawi (a short walk) and is about 25 minutes from Prince Mohammad Airport (MED).",
    tldrFacts: [{ label: "To Nabawi", value: "~5 min walk" }, { label: "To MED", value: "~25 min" }, { label: "Pricing", value: "Fixed" }, { label: "Hours", value: "24/7" }],
    faqs: [
      { question: "Is Al Markazia close to Masjid an-Nabawi?", answer: "Yes, Al Markazia (the Central Area) surrounds Masjid an-Nabawi — most hotels are a short walk away. Vehicle pickup is from the nearest permitted point." },
      { question: "How far is Al Markazia from Madinah airport?", answer: "Al Markazia is about 25 minutes from Prince Mohammad Bin Abdulaziz Airport (MED), with fixed-price meet & greet transfers." },
      { question: "Can I start a Ziyarat tour from Al Markazia?", answer: "Yes, our half-day Ziyarat car collects you from your Central Area hotel and covers Quba, Uhud, and Qiblatain with waiting time." },
    ],
  },
  "qaba": {
    city: "madinah", subarea: "qaba", name: "Quba", nameAr: "قباء",
    description: "Fixed-price transport to and from Quba Mosque and the surrounding district of Madinah — the first mosque built in Islam.",
    airportMin: "~25 min", makkahMin: "~4 km from Nabawi", airportLabel: "Madinah Airport (MED)", nearLabel: "Masjid an-Nabawi", popularFor: "Quba Mosque visits, residential",
    landmarks: ["Quba Mosque", "Quba Road", "Date farms"],
    tldr: "A taxi in the Quba district of Madinah is fixed-price and available 24/7. Quba Mosque is about 4 km from Masjid an-Nabawi, and the airport (MED) is roughly 25 minutes away.",
    tldrFacts: [{ label: "Quba → Nabawi", value: "~4 km" }, { label: "To MED", value: "~25 min" }, { label: "Pricing", value: "Fixed" }, { label: "Hours", value: "24/7" }],
    faqs: [
      { question: "How far is Quba Mosque from Masjid an-Nabawi?", answer: "Quba Mosque is about 4 km from Masjid an-Nabawi — a short fixed-price taxi ride, and a popular Ziyarat stop." },
      { question: "Can you take me to Quba Mosque and wait?", answer: "Yes, we provide round trips and Ziyarat tours with waiting time so you can pray at Quba and return comfortably." },
      { question: "Is taxi available 24/7 in the Quba area?", answer: "Yes, we serve the Quba district around the clock for local rides, airport transfers, and Ziyarat." },
    ],
  },
  "uhud": {
    city: "madinah", subarea: "uhud", name: "Mount Uhud District", nameAr: "أحد",
    description: "Ziyarat tours and fixed-price taxi service to the historic Mount Uhud, site of the Battle of Uhud, north of Masjid an-Nabawi.",
    airportMin: "~20 min", makkahMin: "~6 km from Nabawi", airportLabel: "Madinah Airport (MED)", nearLabel: "Masjid an-Nabawi", popularFor: "Mount Uhud Ziyarat, history",
    landmarks: ["Mount Uhud", "Martyrs of Uhud", "Archers' Hill"],
    tldr: "A taxi to the Mount Uhud district of Madinah is fixed-price and available 24/7. Mount Uhud is about 6 km from Masjid an-Nabawi and roughly 20 minutes from the airport (MED).",
    tldrFacts: [{ label: "Uhud → Nabawi", value: "~6 km" }, { label: "To MED", value: "~20 min" }, { label: "Pricing", value: "Fixed" }, { label: "Hours", value: "24/7" }],
    faqs: [
      { question: "How far is Mount Uhud from Masjid an-Nabawi?", answer: "Mount Uhud is about 6 km north of Masjid an-Nabawi — a short fixed-price taxi ride and a key Ziyarat site." },
      { question: "Can I visit Mount Uhud as part of a Ziyarat tour?", answer: "Yes, our half-day Ziyarat car includes Mount Uhud along with Quba and Qiblatain, with waiting time at each site." },
      { question: "Is taxi available to Mount Uhud at any time?", answer: "Yes, we provide 24/7 fixed-price transport to and from the Mount Uhud district." },
    ],
  },
  "al-awali-madinah": {
    city: "madinah", subarea: "al-awali-madinah", name: "Al Awali", nameAr: "العوالي",
    description: "Fixed-price airport transfers and local rides in Al Awali, southern Madinah, near Quba and the Makkah road.",
    airportMin: "~30 min", makkahMin: "~8 km from Nabawi", airportLabel: "Madinah Airport (MED)", nearLabel: "Masjid an-Nabawi", popularFor: "Residential, Quba access",
    landmarks: ["Al Awali district", "Quba (nearby)", "Route to Makkah"],
    tldr: "A taxi in Al Awali, southern Madinah, is fixed-price and available 24/7. The district is about 8 km from Masjid an-Nabawi and roughly 30 minutes from the airport (MED).",
    tldrFacts: [{ label: "To Nabawi", value: "~8 km" }, { label: "To MED", value: "~30 min" }, { label: "Pricing", value: "Fixed" }, { label: "Hours", value: "24/7" }],
    faqs: [
      { question: "How far is Al Awali from Masjid an-Nabawi?", answer: "Al Awali is about 8 km from Masjid an-Nabawi — a short fixed-price taxi ride, close to Quba Mosque." },
      { question: "Can you collect from Al Awali for the airport?", answer: "Yes. Al Awali to Prince Mohammad Bin Abdulaziz Airport (MED) is about 30 minutes, fixed-price with pickup from your door." },
      { question: "Is 24/7 taxi available in Al Awali?", answer: "Yes, we dispatch around the clock in Al Awali for local rides, airport transfers, and Ziyarat." },
    ],
  },
  "al-aqiq-madinah": {
    city: "madinah", subarea: "al-aqiq-madinah", name: "Al Aqiq", nameAr: "العقيق",
    description: "Fixed-price taxi service in Al Aqiq, an upscale western district of Madinah near the Knowledge Economic City and main highways.",
    airportMin: "~25 min", makkahMin: "~6 km from Nabawi", airportLabel: "Madinah Airport (MED)", nearLabel: "Masjid an-Nabawi", popularFor: "Upscale residential, business",
    landmarks: ["Knowledge Economic City", "Al Aqiq district", "King Abdullah Road"],
    tldr: "A taxi in Al Aqiq, western Madinah, is fixed-price and available 24/7. The district is about 6 km from Masjid an-Nabawi and roughly 25 minutes from the airport (MED).",
    tldrFacts: [{ label: "To Nabawi", value: "~6 km" }, { label: "To MED", value: "~25 min" }, { label: "Pricing", value: "Fixed" }, { label: "Hours", value: "24/7" }],
    faqs: [
      { question: "How far is Al Aqiq from Masjid an-Nabawi?", answer: "Al Aqiq is about 6 km from Masjid an-Nabawi — a short fixed-price taxi ride from this upscale western district." },
      { question: "Do you serve Al Aqiq for airport transfers?", answer: "Yes. Al Aqiq to Prince Mohammad Bin Abdulaziz Airport (MED) is about 25 minutes, fixed-price with door-to-door pickup." },
      { question: "Is taxi available 24/7 in Al Aqiq?", answer: "Yes, we provide round-the-clock service in Al Aqiq for local, airport, and Ziyarat trips." },
    ],
  },
  "sultanah": {
    city: "madinah", subarea: "sultanah", name: "Sultanah", nameAr: "السلطانة",
    description: "Reliable fixed-price taxi rides in the central Sultanah district of Madinah, close to Masjid an-Nabawi and main shopping streets.",
    airportMin: "~20 min", makkahMin: "~3 km from Nabawi", airportLabel: "Madinah Airport (MED)", nearLabel: "Masjid an-Nabawi", popularFor: "Central residential, shopping",
    landmarks: ["Sultanah district", "Central markets", "Quba Road"],
    tldr: "A taxi in Sultanah, central Madinah, is fixed-price and available 24/7. The district is about 3 km from Masjid an-Nabawi and roughly 20 minutes from the airport (MED).",
    tldrFacts: [{ label: "To Nabawi", value: "~3 km" }, { label: "To MED", value: "~20 min" }, { label: "Pricing", value: "Fixed" }, { label: "Hours", value: "24/7" }],
    faqs: [
      { question: "How far is Sultanah from Masjid an-Nabawi?", answer: "Sultanah is about 3 km from Masjid an-Nabawi — a quick fixed-price taxi ride from this central Madinah district." },
      { question: "Is taxi available 24/7 in Sultanah?", answer: "Yes, we dispatch around the clock in Sultanah for local rides, airport transfers, and Ziyarat tours." },
      { question: "How far is Sultanah from Madinah airport?", answer: "Sultanah to Prince Mohammad Bin Abdulaziz Airport (MED) is about 20 minutes, fixed-price with door-to-door pickup." },
    ],
  },
  // Dammam / Eastern Province
  "al-khobar": { city: "dammam", subarea: "al-khobar", name: "Al Khobar", nameAr: "الخبر", description: "Corporate and leisure taxi services across Al Khobar." },
  "dhahran": { city: "dammam", subarea: "dhahran", name: "Dhahran", nameAr: "الظهران", description: "Executive transport for Aramco facilities and Dhahran district." },
  "half-moon-bay": { city: "dammam", subarea: "half-moon-bay", name: "Half Moon Bay", nameAr: "شاطئ نصف القمر", description: "Resort transfers and private transport to Half Moon Bay." },
  "qatif": { city: "dammam", subarea: "qatif", name: "Qatif", nameAr: "القطيف", description: "Reliable local taxi and intercity transfers from Qatif." }
};

// Ontology internal-linking targets per city (same-city / same-intent cluster).
const RELATED_LINKS: Record<string, { name: string; href: string }[]> = {
  jeddah: [
    { name: "Jeddah Airport → Makkah taxi", href: "/routes/jeddah-airport-to-makkah" },
    { name: "Jeddah → Madinah taxi", href: "/routes/jeddah-to-madinah" },
    { name: "Jeddah Airport (JED) pickups", href: "/airports/king-abdulaziz-jeddah" },
    { name: "Umrah taxi from Jeddah", href: "/services/umrah-transport" },
  ],
  makkah: [
    { name: "Makkah → Madinah taxi", href: "/routes/makkah-to-madinah" },
    { name: "Makkah → Jeddah Airport taxi", href: "/routes/makkah-to-jeddah-airport" },
    { name: "Makkah Ziyarat tour", href: "/services/makkah-ziyarat" },
    { name: "Umrah taxi service", href: "/services/umrah-transport" },
  ],
  madinah: [
    { name: "Madinah → Makkah taxi", href: "/routes/madinah-to-makkah" },
    { name: "Madinah Airport (MED) → City", href: "/routes/madinah-airport-to-city" },
    { name: "Madinah Ziyarat tour", href: "/services/madinah-ziyarat" },
    { name: "Madinah → Jeddah Airport taxi", href: "/routes/madinah-to-jeddah-airport" },
  ],
};

export function generateStaticParams() {
  return Object.values(SUB_AREAS).map((area) => ({
    city: area.city,
    subarea: area.subarea,
  }));
}

interface PageProps {
  params: Promise<{
    city: string;
    subarea: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city, subarea } = await params;
  const areaKey = Object.keys(SUB_AREAS).find(k => SUB_AREAS[k].city === city && SUB_AREAS[k].subarea === subarea);
  
  if (!areaKey) return { title: "Location Not Found" };
  
  const area = SUB_AREAS[areaKey];
  const capitalizedCity = city.charAt(0).toUpperCase() + city.slice(1);

  return {
    title: `Taxi & Private Transfer in ${area.name}, ${capitalizedCity} | Taxi Saudi Arabia`,
    description: area.description,
    alternates: {
      canonical: `https://taxisaudiarabia.com/locations/${city}/${subarea}`,
    },
    openGraph: {
      title: `Taxi in ${area.name}, ${capitalizedCity} — Book Now`,
      description: area.description,
    },
  };
}

export default async function SubAreaPage({ params }: PageProps) {
  const { city, subarea } = await params;
  const areaKey = Object.keys(SUB_AREAS).find(k => SUB_AREAS[k].city === city && SUB_AREAS[k].subarea === subarea);
  
  if (!areaKey) {
    notFound();
  }

  const area = SUB_AREAS[areaKey];
  const capitalizedCity = city.charAt(0).toUpperCase() + city.slice(1);

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8] pb-24">
      <JsonLd
        data={serviceSchema({
          name: `Taxi Service in ${area.name}, ${capitalizedCity}`,
          description: area.description,
          path: `/locations/${city}/${subarea}`,
          serviceType: "Local Taxi & Car Service",
          areaServed: [area.name, capitalizedCity],
        })}
      />
      {area.faqs && area.faqs.length > 0 && (
        <JsonLd data={faqSchema(area.faqs)} />
      )}
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Locations", href: "/locations" },
          { name: capitalizedCity, href: `/locations/${city}` },
          { name: area.name, href: `/locations/${city}/${subarea}` },
        ]}
      />
      {/* ─── HERO ───────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 overflow-hidden border-b border-[#C9A84C]/10 bg-[#111111]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#C9A84C]/6 to-transparent pointer-events-none" />

        <div className="section-container relative z-10 max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/8 px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#C9A84C] mb-6">
            <MapPin className="h-3 w-3" /> Local Service Area
          </span>
          <h1 className="font-heading text-4xl font-bold leading-tight md:text-5xl lg:text-6xl mb-6">
            Taxi Service in <br />
            <span className="text-[#C9A84C]">{area.name}</span>
          </h1>
          <p className="text-[#C9A84C] font-bold tracking-widest text-lg mb-6">{area.nameAr}</p>
          <p className="max-w-2xl mx-auto text-sm md:text-base leading-relaxed text-[#A1A1A6]">
            {area.description} Whether you need an immediate local ride, an airport transfer, or a private chauffeur for the day, Taxi Saudi Arabia offers premium vehicles and professional drivers directly in {area.name}, {capitalizedCity}.
          </p>
          
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href={`/book?pickup=${encodeURIComponent(area.name + ', ' + capitalizedCity)}`}
              className="inline-flex items-center gap-2 rounded-full bg-[#C9A84C] px-8 py-4 text-xs font-bold uppercase tracking-wider text-[#0A0A0A] hover:bg-[#B8963B] transition-all shadow-[0_4px_14px_rgba(201,168,76,0.2)]"
            >
              Book a Ride Now
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── QUICK ANSWER (above-the-fold AI/snippet signal) ────────────── */}
      {area.tldr && (
        <section className="section-container max-w-5xl pt-12">
          <TLDRSummary answer={area.tldr} facts={area.tldrFacts} />
        </section>
      )}

      {/* ─── DISTANCES & LANDMARKS ──────────────────────────────────────── */}
      {(area.airportMin || area.landmarks) && (
        <section className="section-container max-w-5xl pt-16">
          <div className="grid md:grid-cols-2 gap-8">
            {(area.airportMin || area.makkahMin) && (
              <div className="bg-[#111] border border-[#C9A84C]/15 rounded-3xl p-8">
                <h2 className="font-heading text-xl font-bold mb-6 flex items-center gap-2">
                  <Clock className="text-[#C9A84C] h-5 w-5" /> Travel Times from {area.name}
                </h2>
                <ul className="space-y-4 text-sm">
                  {area.airportMin && (
                    <li className="flex justify-between border-b border-[#C9A84C]/10 pb-3">
                      <span className="text-[#A1A1A6] flex items-center gap-2"><PlaneLanding className="h-4 w-4 text-[#C9A84C]" /> {area.airportLabel ?? "King Abdulaziz Airport (JED)"}</span>
                      <span className="font-bold text-[#F5F0E8]">{area.airportMin}</span>
                    </li>
                  )}
                  {area.makkahMin && area.makkahMin !== "—" && (
                    <li className="flex justify-between border-b border-[#C9A84C]/10 pb-3">
                      <span className="text-[#A1A1A6] flex items-center gap-2"><MapPin className="h-4 w-4 text-[#C9A84C]" /> {area.nearLabel ?? "Makkah (Masjid al-Haram)"}</span>
                      <span className="font-bold text-[#F5F0E8]">{area.makkahMin}</span>
                    </li>
                  )}
                  {area.popularFor && (
                    <li className="flex justify-between pt-1">
                      <span className="text-[#A1A1A6]">Popular for</span>
                      <span className="font-bold text-[#F5F0E8] text-right max-w-[60%]">{area.popularFor}</span>
                    </li>
                  )}
                </ul>
              </div>
            )}
            {area.landmarks && area.landmarks.length > 0 && (
              <div className="bg-[#111] border border-[#C9A84C]/15 rounded-3xl p-8">
                <h2 className="font-heading text-xl font-bold mb-6 flex items-center gap-2">
                  <Building2 className="text-[#C9A84C] h-5 w-5" /> Nearby Landmarks
                </h2>
                <ul className="space-y-3">
                  {area.landmarks.map((lm, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-[#A1A1A6]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#C9A84C]" /> {lm}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─── LOCAL BENEFITS ─────────────────────────────────────────────── */}
      <section className="section-container max-w-5xl py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-[#111] border border-[#C9A84C]/15 rounded-3xl p-8 text-center hover:border-[#C9A84C]/40 transition-colors">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#C9A84C]/10 border border-[#C9A84C]/20 mx-auto mb-6">
              <Car className="h-5 w-5 text-[#C9A84C]" />
            </div>
            <h3 className="font-heading text-lg font-bold mb-3">Fast Dispatch</h3>
            <p className="text-xs text-[#A1A1A6] leading-relaxed">Our vehicles are stationed near {area.name} ensuring rapid pickup times for local and intercity trips.</p>
          </div>
          <div className="bg-[#111] border border-[#C9A84C]/15 rounded-3xl p-8 text-center hover:border-[#C9A84C]/40 transition-colors">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#C9A84C]/10 border border-[#C9A84C]/20 mx-auto mb-6">
              <ShieldCheck className="h-5 w-5 text-[#C9A84C]" />
            </div>
            <h3 className="font-heading text-lg font-bold mb-3">Fixed Fares</h3>
            <p className="text-xs text-[#A1A1A6] leading-relaxed">No surge pricing or hidden meters. Get a guaranteed upfront price for your ride from {area.name}.</p>
          </div>
          <div className="bg-[#111] border border-[#C9A84C]/15 rounded-3xl p-8 text-center hover:border-[#C9A84C]/40 transition-colors">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#C9A84C]/10 border border-[#C9A84C]/20 mx-auto mb-6">
              <Star className="h-5 w-5 text-[#C9A84C]" />
            </div>
            <h3 className="font-heading text-lg font-bold mb-3">Premium Fleet</h3>
            <p className="text-xs text-[#A1A1A6] leading-relaxed">Choose from Executive Sedans, Luxury SUVs, and VIP Vans. All vehicles are impeccably maintained.</p>
          </div>
        </div>
      </section>

      {/* ─── FAQ (FAQPage schema injected above) ────────────────────────── */}
      {area.faqs && area.faqs.length > 0 && (
        <section className="section-container max-w-4xl pb-8">
          <h2 className="font-heading text-2xl font-bold mb-6 flex items-center gap-3">
            <HelpCircle className="text-[#C9A84C]" />
            {area.name} Taxi — FAQ
          </h2>
          <div className="space-y-4">
            {area.faqs.map((faq, i) => (
              <div key={i} className="border border-[#C9A84C]/15 rounded-2xl p-6 bg-[#111]">
                <h3 className="font-bold text-base mb-2 text-[#F5F0E8]">{faq.question}</h3>
                <p className="text-sm text-[#A1A1A6] leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ─── RELATED LINKS (ontology internal linking, city cluster) ───── */}
      {RELATED_LINKS[city] && (
        <section className="section-container max-w-5xl pb-8">
          <h2 className="font-heading text-xl font-bold mb-5 text-[#F5F0E8]">Popular from {area.name}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {RELATED_LINKS[city].map((l) => (
              <Link key={l.href} href={l.href} className="group flex items-center justify-between gap-3 rounded-xl border border-[#C9A84C]/15 bg-[#111] px-4 py-3 hover:border-[#C9A84C]/40 transition-colors">
                <span className="text-sm font-medium text-[#F5F0E8] group-hover:text-[#C9A84C]">{l.name}</span>
                <ArrowRight className="h-4 w-4 text-[#C9A84C]" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ─── NEIGHBORHOOD INFO ────────────────────────────────────────── */}
      <section className="border-t border-[#C9A84C]/10 bg-[#111] py-20">
        <div className="section-container max-w-4xl text-center">
          <h2 className="font-heading text-2xl font-bold mb-6 flex items-center justify-center gap-3">
            <MapPin className="text-[#C9A84C]" />
            About {area.name}
          </h2>
          <p className="text-sm text-[#A1A1A6] leading-relaxed mb-8">
            As a key district in {capitalizedCity}, {area.name} is a frequent starting point for many of our clients. Whether you are traveling for business, Umrah, or leisure, Taxi Saudi Arabia provides the most reliable connection from {area.name} to airports, train stations, and intercity destinations across the Kingdom of Saudi Arabia.
          </p>
          <Link
            href={`/locations/${city}`}
            className="text-xs font-bold uppercase tracking-wider text-[#C9A84C] hover:text-[#F5F0E8] transition-colors"
          >
            View all {capitalizedCity} locations →
          </Link>
        </div>
      </section>
    </main>
  );
}
