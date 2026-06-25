export const revalidate = 86400; // revalidate every 24 hours

export function generateStaticParams() {
  return [
    { city: "makkah" },
    { city: "madinah" },
    { city: "riyadh" },
    { city: "jeddah" },
    { city: "dammam" },
    { city: "alula" },
    { city: "taif" },
    { city: "alkhobar" },
    { city: "yanbu" },
    { city: "neom" },
    { city: "abha" }
  ];
}

// No notFound import
import { db } from "@/lib/db";
import { Metadata } from "next";
import { MapPin, ArrowRight, Car, Building2, CheckCircle2, HelpCircle, Star, Quote } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { serviceSchema, faqSchema } from "@/lib/schema";
import { TLDRSummary } from "@/components/seo/TLDRSummary";

// Static content for cities to complement dynamic route data
const CITY_DETAILS: Record<string, { name: string, nameAr: string, image: string, tagline: string, description: string, attractions: { name: string, dist: string }[], tips: string[], tldr?: string, tldrFacts?: { label: string, value: string }[], faqs?: { question: string, answer: string }[], testimonials?: { quote: string, author: string, location: string, trip: string }[] }> = {
  makkah: {
    name: "Makkah",
    nameAr: "مكة المكرمة",
    image: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=1200&q=80",
    tagline: "The Holiest City on Earth",
    description: "Book a fixed-price taxi in Makkah for Umrah, Hajj, Ziyarat, or onward travel. Our professional drivers provide Masjid Al-Haram drop-offs, return transfers to Jeddah Airport (~80 km, ~1 hour), and Makkah to Madinah journeys (~430 km, ~4–5 hours). Prayer-time and rest stops are always included, and drivers know the road-closure points around the Haram during Salah.",
    tldr: "Taxi Saudi Arabia provides 24/7 fixed-price taxi service in Makkah — Masjid al-Haram hotel drop-offs, return transfers to Jeddah Airport (~80 km, ~1 hour), and Makkah to Madinah journeys (~430 km, ~4–5 hours). Prayer stops and luggage help included.",
    tldrFacts: [
      { label: "To Jeddah Airport", value: "~80 km · ~1 hr" },
      { label: "To Madinah", value: "~430 km · ~4–5 hr" },
      { label: "To Taif", value: "~90 km · ~1 hr 10" },
      { label: "Pricing", value: "Fixed, no surge" }
    ],
    attractions: [
      { name: "Al-Masjid Al-Haram (Kaaba)", dist: "0 km" },
      { name: "Jabal Al-Nour (Cave of Hira)", dist: "5 km" },
      { name: "Jabal Thawr", dist: "4 km" },
      { name: "Mina & Arafat", dist: "8–15 km" },
      { name: "Jeddah Airport (JED)", dist: "~80 km" },
      { name: "Madinah (Masjid an-Nabawi)", dist: "~430 km" }
    ],
    tips: [
      "Vehicle access near Masjid Al-Haram may be restricted during peak prayer times — your driver will know the closest permitted drop-off point.",
      "Only Muslims are permitted to enter the city limits of Makkah.",
      "Pre-book your return taxi to Jeddah Airport in advance during Umrah and Hajj seasons to avoid delays — allow extra time before your flight.",
      "For Ziyarat, a half-day car covers Jabal Al-Nour, Mina, Arafat, and Jabal Thawr with waiting time included."
    ],
    faqs: [
      { question: "How much is a taxi from Makkah to Jeddah airport?", answer: "A fixed-price taxi from Makkah to King Abdulaziz International Airport (JED) starts from around SAR 180 for a sedan. It is about 80 km and roughly 1 hour — pre-book and allow buffer time before your flight." },
      { question: "How far is Makkah from Madinah by taxi?", answer: "Makkah to Madinah is about 430 km — roughly a 4 to 5 hour drive via the Haramain highway. The fixed fare starts from around SAR 350, with prayer and rest stops included." },
      { question: "Can the taxi drop me at my Makkah hotel near the Haram?", answer: "Yes. We drop you as close to your hotel and Masjid al-Haram as vehicles are permitted. During prayer times some roads close, so the driver uses the nearest allowed checkpoint." },
      { question: "Do you provide Makkah Ziyarat tours by car?", answer: "Yes. A half-day Ziyarat car visits Jabal Al-Nour (Cave of Hira), Jabal Thawr, Mina, and Arafat with a knowledgeable driver and flexible waiting time." },
      { question: "Is taxi available in Makkah 24/7?", answer: "Yes, we operate around the clock in Makkah for hotel transfers, airport returns, intercity trips, and Ziyarat — at fixed prices with no surge." }
    ],
    testimonials: [
      { quote: "Booked our Makkah to Madinah transfer in a big SUV. Driver was on time at the hotel, stopped for prayers, and the price was exactly as quoted. Very comfortable for the elderly in our group.", author: "Yusuf A.", location: "Manchester, UK", trip: "Makkah → Madinah" },
      { quote: "Return trip from our hotel near the Haram to Jeddah airport. He knew exactly where the roads were closed and got us out smoothly with plenty of time for the flight.", author: "Nadia H.", location: "Sydney, Australia", trip: "Makkah → JED Airport" },
      { quote: "Did the Ziyarat tour — Cave of Hira, Mina, Arafat. The driver explained each site and never rushed us. Fixed fair price. Highly recommended.", author: "Bilal K.", location: "Makkah", trip: "Makkah Ziyarat" }
    ]
  },
  madinah: {
    name: "Madinah",
    nameAr: "المدينة المنورة",
    image: "https://images.unsplash.com/photo-1564769662533-4f00a87b4056?auto=format&fit=crop&w=1200&q=80",
    tagline: "City of the Prophet ﷺ",
    description: "Book a fixed-price taxi in Madinah for airport transfers from Prince Mohammad Bin Abdulaziz Airport (MED) (~20 km, ~25 min), Masjid an-Nabawi hotel drop-offs, Ziyarat tours, and onward journeys to Makkah (~430 km, ~4–5 hours). Our drivers serve pilgrims arriving at MED and travellers heading to or from Makkah and Jeddah, with prayer stops and luggage help included.",
    tldr: "Taxi Saudi Arabia provides 24/7 fixed-price taxi service in Madinah — Prince Mohammad Bin Abdulaziz Airport (MED) transfers (~20 km, ~25 min), Masjid an-Nabawi hotel drop-offs, Ziyarat tours, and Madinah to Makkah journeys (~430 km, ~4–5 hours).",
    tldrFacts: [
      { label: "Airport (MED)", value: "~20 km · ~25 min" },
      { label: "To Makkah", value: "~430 km · ~4–5 hr" },
      { label: "To Jeddah Airport", value: "~410 km" },
      { label: "Pricing", value: "Fixed, no surge" }
    ],
    attractions: [
      { name: "Al-Masjid an-Nabawi", dist: "0 km" },
      { name: "Quba Mosque", dist: "4 km" },
      { name: "Mount Uhud", dist: "6 km" },
      { name: "Qiblatain Mosque", dist: "7 km" },
      { name: "Prince Mohammad Airport (MED)", dist: "~20 km" },
      { name: "Makkah (Masjid al-Haram)", dist: "~430 km" }
    ],
    tips: [
      "Prince Mohammad Bin Abdulaziz Airport (MED) is about 20–25 minutes from the Central Area (Markazia) hotels — pre-book your arrival transfer with meet & greet.",
      "Ziyarat tours of the holy sites usually take 3–4 hours — book a half-day or full-day car for the best value.",
      "Traffic around Masjid an-Nabawi is heavy after Friday prayers — allow extra time.",
      "For Madinah to Makkah, a private taxi is door-to-door with prayer stops; spacious SUVs suit families and luggage."
    ],
    faqs: [
      { question: "How much is a taxi from Madinah airport to the city?", answer: "A fixed-price taxi from Prince Mohammad Bin Abdulaziz Airport (MED) to central Madinah hotels starts from around SAR 80. It is about 20 km and a 25-minute drive, with meet & greet at arrivals." },
      { question: "How far is Madinah from Makkah by taxi?", answer: "Madinah to Makkah is about 430 km — roughly a 4 to 5 hour drive via the Haramain highway. The fixed fare starts from around SAR 350, with prayer and rest stops included." },
      { question: "Can the taxi drop me at my hotel near Masjid an-Nabawi?", answer: "Yes. We drop you as close to your Central Area (Markazia) hotel and Masjid an-Nabawi as vehicles are permitted, handling any prayer-time road restrictions." },
      { question: "Do you offer Madinah Ziyarat tours by car?", answer: "Yes. A half-day Ziyarat car visits Quba Mosque, Mount Uhud, Qiblatain Mosque, and other sites with a knowledgeable driver and waiting time included." },
      { question: "Is taxi available in Madinah 24/7?", answer: "Yes, we operate around the clock in Madinah for airport transfers, hotel pickups, Ziyarat, and intercity trips — at fixed prices with no surge." }
    ],
    testimonials: [
      { quote: "Arrived at Madinah airport late evening and the driver was waiting at arrivals. Quick, calm ride to our hotel by the Haram. Exactly the price quoted.", author: "Omar F.", location: "Leicester, UK", trip: "MED Airport → City" },
      { quote: "Took the Ziyarat tour — Quba, Uhud, Qiblatain. Our driver was knowledgeable and patient with the elderly in our family. Felt very well looked after.", author: "Sumaya I.", location: "Cape Town, South Africa", trip: "Madinah Ziyarat" },
      { quote: "Madinah to Makkah in a comfortable SUV with prayer stops along the way. Smooth, safe driving and a fair fixed price for the whole family.", author: "Abdullah R.", location: "Madinah", trip: "Madinah → Makkah" }
    ]
  },
  riyadh: {
    name: "Riyadh",
    nameAr: "الرياض",
    image: "https://images.unsplash.com/photo-1578895101408-1a36b834405b?auto=format&fit=crop&w=1200&q=80",
    tagline: "The Saudi Capital",
    description: "Book a taxi in Riyadh for airport transfers from King Khalid International Airport, business trips, shopping, and intercity rides to Jeddah, Dammam, or Makkah. Our drivers cover all Riyadh districts 24/7.",
    attractions: [
      { name: "Kingdom Centre Tower", dist: "City Center" },
      { name: "Diriyah (At-Turaif District)", dist: "20 km" },
      { name: "King Abdullah Financial District (KAFD)", dist: "15 km" }
    ],
    tips: [
      "Riyadh has heavy traffic between 4 PM and 7 PM. Book your taxi 30 minutes earlier than usual during these hours.",
      "Distances between Riyadh districts are large — always confirm the exact address with your driver."
    ]
  },
  jeddah: {
    name: "Jeddah",
    nameAr: "جدة",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80",
    tagline: "The Red Sea Gateway to Makkah & Madinah",
    description: "Book a fixed-price taxi in Jeddah for airport pickups from King Abdulaziz International Airport (JED), transfers to Makkah (~80 km, ~1 hour) and Madinah (~420 km, ~4–5 hours), and local rides around the Corniche, Al-Balad, and the city centre. Most Umrah and Hajj pilgrims arrive at Jeddah, making it the Kingdom's main gateway — our drivers handle 24/7 night arrivals, meet & greet, flight tracking, and Miqat stops for Ihram.",
    tldr: "Taxi Saudi Arabia provides 24/7 fixed-price taxi and private-car service in Jeddah, including King Abdulaziz International Airport (JED) pickups and transfers to Makkah (~80 km, ~1 hour) and Madinah (~420 km, ~4–5 hours). Meet & greet, flight tracking, and English/Urdu-speaking drivers included.",
    tldrFacts: [
      { label: "To Makkah", value: "~80 km · ~1 hr" },
      { label: "To Madinah", value: "~420 km · ~4–5 hr" },
      { label: "Airport", value: "JED (24/7)" },
      { label: "Pricing", value: "Fixed, no surge" }
    ],
    attractions: [
      { name: "King Abdulaziz Airport (JED)", dist: "Gateway" },
      { name: "Jeddah Corniche & Waterfront", dist: "Coastal" },
      { name: "Historic Al-Balad (UNESCO Site)", dist: "City Center" },
      { name: "King Fahd's Fountain", dist: "Coastal" },
      { name: "Makkah (Masjid al-Haram)", dist: "~80 km" },
      { name: "Madinah (Masjid an-Nabawi)", dist: "~420 km" }
    ],
    tips: [
      "Jeddah Airport (JED) has Terminal 1 (the main terminal for Saudia and most international flights), the older North Terminal, and a dedicated Hajj Terminal. Tell us your terminal when booking.",
      "For Umrah, ask the driver to stop at the Miqat on the Jeddah–Makkah road so you can enter Ihram before reaching Makkah.",
      "Late-night flights are common at JED — pre-book so a driver with a name sign is waiting at arrivals, even at 2–4 AM.",
      "Traffic near the Corniche is heavy on Thursday and Friday evenings. Plan ahead."
    ],
    faqs: [
      { question: "How much is a taxi in Jeddah?", answer: "Jeddah city rides and airport pickups are fixed-price with no surge. A Jeddah Airport (JED) to Makkah taxi starts from around SAR 180, and Jeddah to Madinah from around SAR 350. You see the exact fare before you book — tolls and taxes included." },
      { question: "Is there a taxi at Jeddah airport 24/7?", answer: "Yes. We operate at King Abdulaziz International Airport (JED) around the clock, including late-night and early-morning flights. We track your flight number, so your driver waits with a name sign even if the flight is delayed." },
      { question: "How far is Jeddah from Makkah by taxi?", answer: "Jeddah is about 80 km from Makkah — roughly a 1-hour drive on the Makkah Expressway. From Jeddah Airport (JED) it is a direct transfer, and the driver can stop at the Miqat for Ihram on request." },
      { question: "Can I book a Jeddah taxi in advance?", answer: "Yes, and for airport and Umrah transfers we recommend it. Pre-booking guarantees a vehicle and a fixed price, with meet & greet at arrivals — especially important during Umrah, Hajj, and Ramadan seasons." },
      { question: "Do the drivers speak English or Urdu?", answer: "Most of our Jeddah drivers speak English and Arabic, and many also speak Urdu — helpful for pilgrims from South Asia. You can request an Urdu-speaking driver when booking." }
    ],
    testimonials: [
      { quote: "Landed at Jeddah at 2 AM and the driver was waiting with my name sign. Stopped at the Miqat so we could enter Ihram, then straight to our Makkah hotel. Stress-free start to Umrah.", author: "Imran S.", location: "Birmingham, UK", trip: "JED → Makkah" },
      { quote: "Booked an SUV from the airport to Madinah for my parents and all the luggage. Comfortable, fixed price, and the driver took rest stops for prayer without us asking. Highly recommend.", author: "Aisha R.", location: "Toronto, Canada", trip: "JED → Madinah" },
      { quote: "Used them for a Corniche and Al-Balad day tour. The driver knew every spot and waited while we explored. Fair fixed price, very polite. Will use again next visit.", author: "Khalid M.", location: "Jeddah", trip: "Jeddah City Tour" },
    ]
  },
  dammam: {
    name: "Dammam",
    nameAr: "الدمام",
    image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1200&q=80",
    tagline: "Eastern Province Capital",
    description: "Book a taxi in Dammam for airport transfers from King Fahd International Airport, rides to Khobar, Dhahran, and Al-Khobar, and cross-border trips to Bahrain. Our drivers know the Eastern Province well.",
    attractions: [
      { name: "Half Moon Bay Beach", dist: "30 km" },
      { name: "King Abdulaziz Center for World Culture (Ithra)", dist: "20 km" },
      { name: "Dammam Corniche", dist: "City Center" }
    ],
    tips: [
      "Cross-border taxi to Bahrain via the King Fahd Causeway — contact us in advance so we can prepare the required travel documents.",
      "King Fahd International Airport is about 40 minutes from Dammam city center."
    ]
  },
  alula: {
    name: "AlUla",
    nameAr: "العلا",
    image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=80",
    tagline: "Saudi Arabia's Archaeological Wonder",
    description: "Book a taxi or full-day car hire in AlUla to visit Hegra (Mada'in Salih), Elephant Rock, Maraya, and the Old Town. Our drivers provide comfortable transport between AlUla Airport, resorts, and all tourist sites.",
    attractions: [
      { name: "Hegra — Mada'in Salih (UNESCO)", dist: "22 km" },
      { name: "Elephant Rock", dist: "10 km" },
      { name: "Maraya Concert Hall", dist: "15 km" }
    ],
    tips: [
      "Book your AlUla taxi in advance — the area is popular and vehicles fill up fast during festivals.",
      "Many resorts and sites are spread across desert terrain. An SUV is the most comfortable option."
    ]
  },
  taif: {
    name: "Taif",
    nameAr: "الطائف",
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
    tagline: "The City of Roses",
    description: "Book a taxi in Taif for day trips from Makkah and Jeddah, mountain tours, and visits to the famous rose farms. Cool climate, scenic Sarawat mountain roads, and drivers who know the winding Al Hada route well.",
    attractions: [
      { name: "Al Hada Mountain & Cable Car", dist: "10 km" },
      { name: "Shubra Palace", dist: "City Center" },
      { name: "Al Rudaf Park", dist: "5 km" }
    ],
    tips: [
      "Taif is a popular summer escape — book early during the Taif Season festival.",
      "The Makkah–Taif mountain road (Al Hada) is steep and winding; an experienced driver is recommended."
    ]
  },
  alkhobar: {
    name: "Al Khobar",
    nameAr: "الخبر",
    image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1200&q=80",
    tagline: "Eastern Province Waterfront",
    description: "Book a taxi in Al Khobar for corporate trips, Corniche outings, and transfers to Dammam, Dhahran, and Bahrain via the King Fahd Causeway. Reliable 24/7 service across the Eastern Province.",
    attractions: [
      { name: "Khobar Corniche", dist: "Coastal" },
      { name: "King Fahd Causeway (to Bahrain)", dist: "25 km" },
      { name: "Al Rashid Mall", dist: "City Center" }
    ],
    tips: [
      "Cross-border trips to Bahrain via the Causeway — share your travel documents in advance.",
      "Khobar, Dammam, and Dhahran form one metro area; confirm the exact district when booking."
    ]
  },
  yanbu: {
    name: "Yanbu",
    nameAr: "ينبع",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80",
    tagline: "Red Sea Diving & Industrial Hub",
    description: "Book a taxi in Yanbu for airport transfers, Red Sea diving spots, and intercity rides to Madinah and Jeddah. Professional drivers covering both Yanbu Al-Bahr and Yanbu Industrial City.",
    attractions: [
      { name: "Yanbu Corniche", dist: "Coastal" },
      { name: "Yanbu Industrial City", dist: "15 km" },
      { name: "Sharm Yanbu Diving Sites", dist: "Coastal" }
    ],
    tips: [
      "Yanbu to Madinah is a popular pilgrim route (about 240 km, ~2.5 hours).",
      "Confirm whether you need Yanbu Al-Bahr (city) or the Industrial City — they are far apart."
    ]
  },
  neom: {
    name: "NEOM",
    nameAr: "نيوم",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80",
    tagline: "Saudi Arabia's Giga-Project",
    description: "Book a taxi or executive car in NEOM and the Tabuk region for business visits, site transfers, and trips to the Red Sea coast. Reliable transport across the developing NEOM project zones.",
    attractions: [
      { name: "NEOM Bay", dist: "Coastal" },
      { name: "Tabuk City", dist: "Regional Hub" },
      { name: "Gulf of Aqaba (Magna)", dist: "Coastal" }
    ],
    tips: [
      "NEOM is a large development zone — share your exact site or gate access details when booking.",
      "Tabuk Airport is the main air gateway for the NEOM region."
    ]
  },
  abha: {
    name: "Abha",
    nameAr: "أبها",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
    tagline: "The Misty Mountain City of Asir",
    description: "Book a taxi in Abha for mountain tours, Soudah Peak trips, airport transfers, and rides across the Asir region. Drivers experienced on the high-altitude winding roads of southern Saudi Arabia.",
    attractions: [
      { name: "Soudah Peak & Cable Car", dist: "25 km" },
      { name: "Abha Dam Lake", dist: "City Center" },
      { name: "Green Mountain (Al Jabal Al Akhdar)", dist: "5 km" }
    ],
    tips: [
      "Abha is cool and misty year-round — very popular in summer, so book ahead during the Asir season.",
      "Mountain roads to Soudah are steep; an SUV is the most comfortable choice."
    ]
  }
};

interface PageProps {
  params: Promise<{
    city: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city } = await params;
  const cityData = CITY_DETAILS[city.toLowerCase()];

  if (!cityData) return { title: "Location Not Found" };

  return {
    title: `Taxi Service in ${cityData.name} — Airport Transfers & Rides | Taxi Saudi Arabia`,
    description: `Book a taxi in ${cityData.name}. Airport pickups, intercity rides, and Umrah transfers at fixed prices. Licensed drivers available 24/7 in ${cityData.name}, Saudi Arabia.`,
    alternates: {
      canonical: `https://taxisaudiarabia.com/locations/${city}`,
    },
    openGraph: {
      title: `Taxi Service in ${cityData.name} | Taxi Saudi Arabia`,
      description: `Book a taxi in ${cityData.name} at fixed prices. Airport transfers, Umrah rides, and intercity taxi service. Available 24/7 with licensed drivers.`,
    },
  };
}

export default async function CityLocationPage({ params }: PageProps) {
  const { city } = await params;
  const cityKey = city.toLowerCase();
  
  // Default fallback if city not strictly defined
  const cityData = CITY_DETAILS[cityKey] || {
    name: city.charAt(0).toUpperCase() + city.slice(1),
    nameAr: "",
    image: "https://images.unsplash.com/photo-1582236940866-24ba00daea8a?auto=format&fit=crop&w=1200&q=80",
    tagline: "Taxi & Car Service",
    description: `Reliable taxi and car service in ${city}, Saudi Arabia. Airport transfers, intercity rides, and local pickups with licensed drivers.`,
    attractions: [],
    tips: []
  };

  // Fetch routes connected to this city
  const cityRoutes = await db.route.findMany({
    where: {
      OR: [
        { fromCity: { contains: cityData.name, mode: 'insensitive' } },
        { toCity: { contains: cityData.name, mode: 'insensitive' } }
      ]
    },
    take: 10
  });

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8] pb-24">
      <JsonLd
        data={serviceSchema({
          name: `Taxi Service in ${cityData.name}`,
          description: cityData.description,
          path: `/locations/${cityKey}`,
          serviceType: "Local Taxi & Car Service",
          areaServed: [cityData.name],
        })}
      />
      {cityData.faqs && cityData.faqs.length > 0 && (
        <JsonLd data={faqSchema(cityData.faqs)} />
      )}
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Locations", href: "/locations" },
          { name: cityData.name, href: `/locations/${cityKey}` },
        ]}
      />
      {/* ─── HERO ─────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 overflow-hidden border-b border-[#C9A84C]/10">
        <div className="absolute inset-0 z-0">
          <Image
            src={cityData.image}
            alt={cityData.name}
            fill
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/80 to-[#0A0A0A]/40" />
        </div>

        <div className="section-container relative z-10 max-w-5xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/20 backdrop-blur-sm px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#C9A84C] mb-6">
            <MapPin className="h-3 w-3" /> Location Guide
          </span>
          <h1 className="font-heading text-4xl md:text-6xl font-bold leading-tight">
            Taxi Service in <br />
            <span className="text-[#C9A84C]">{cityData.name}</span>
          </h1>
          <p className="text-[#C9A84C] text-sm tracking-widest uppercase font-bold mt-2 mb-6">{cityData.nameAr} - {cityData.tagline}</p>
          <p className="max-w-2xl text-sm md:text-base text-[#A1A1A6] leading-relaxed">
            {cityData.description}
          </p>

          <div className="mt-8 flex gap-4">
            <Link
              href={`/book?pickup=${encodeURIComponent(cityData.name)}`}
              className="flex items-center gap-2 rounded-full bg-[#C9A84C] px-8 py-3.5 text-xs font-bold uppercase text-[#0A0A0A] hover:bg-[#B8963B] transition-all"
            >
              <Car className="h-4 w-4" />
              Book a Taxi Now
            </Link>
          </div>
        </div>
      </section>

      <div className="section-container max-w-5xl mt-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* ─── MAIN CONTENT ───────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-16">

          {/* Quick Answer (above-the-fold AI/snippet signal) */}
          {cityData.tldr && (
            <TLDRSummary answer={cityData.tldr} facts={cityData.tldrFacts} />
          )}

          {/* Available Routes */}
          <section>
            <h2 className="font-heading text-3xl font-bold mb-8">Popular Routes from/to {cityData.name}</h2>
            {cityRoutes.length > 0 ? (
              <div className="grid gap-4">
                {cityRoutes.map((route) => (
                  <Link href={`/routes/${route.slug}`} key={route.id} className="group flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl bg-[#111] border border-[#C9A84C]/15 hover:border-[#C9A84C]/40 transition-colors">
                    <div className="flex items-center gap-4 mb-4 md:mb-0">
                      <div className="font-bold">{route.fromCity}</div>
                      <ArrowRight className="h-4 w-4 text-[#C9A84C]" />
                      <div className="font-bold">{route.toCity}</div>
                    </div>
                    <div className="flex items-center justify-between md:gap-6">
                      <div className="text-right">
                        <p className="text-[0.6rem] text-[#7C8088] uppercase font-bold">Starting from</p>
                        <p className="text-[#C9A84C] font-bold">SAR {route.basePrice}</p>
                      </div>
                      <div className="bg-[#C9A84C]/10 text-[#C9A84C] rounded-full p-2 group-hover:bg-[#C9A84C] group-hover:text-[#0A0A0A] transition-colors">
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-[#A1A1A6]">Currently mapping custom routes for this city. Please contact us for a quote.</p>
            )}
            <div className="mt-6">
              <Link href="/routes" className="text-[#C9A84C] text-sm font-bold hover:underline">View all 50+ Kingdom-wide routes &rarr;</Link>
            </div>
          </section>

          {/* Local Tips */}
          {cityData.tips.length > 0 && (
            <section className="bg-[#111] border border-[#C9A84C]/15 rounded-3xl p-8">
              <h2 className="font-heading text-2xl font-bold mb-6 text-[#F5F0E8]">Local Travel Tips</h2>
              <ul className="space-y-4">
                {cityData.tips.map((tip, idx) => (
                  <li key={idx} className="flex gap-4">
                    <CheckCircle2 className="h-5 w-5 text-[#C9A84C] shrink-0 mt-0.5" />
                    <p className="text-sm text-[#A1A1A6]">{tip}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* FAQs (FAQPage schema injected above) */}
          {cityData.faqs && cityData.faqs.length > 0 && (
            <section>
              <h2 className="font-heading text-3xl font-bold mb-8 flex items-center gap-3">
                <HelpCircle className="text-[#C9A84C] h-7 w-7" />
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {cityData.faqs.map((faq, idx) => (
                  <div key={idx} className="border border-[#C9A84C]/15 rounded-2xl p-6 bg-[#111]">
                    <h3 className="font-bold text-base mb-2 text-[#F5F0E8]">{faq.question}</h3>
                    <p className="text-sm text-[#A1A1A6] leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Reviews / Testimonials (EEAT trust signals) */}
          {cityData.testimonials && cityData.testimonials.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
                <h2 className="font-heading text-3xl font-bold flex items-center gap-3">
                  <Star className="text-[#C9A84C] h-7 w-7 fill-[#C9A84C]" />
                  What {cityData.name} Travellers Say
                </h2>
                <div className="flex items-center gap-1 text-[#C9A84C]">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-[#C9A84C]" />)}
                  <span className="text-sm font-bold text-[#F5F0E8] ml-2">4.9/5</span>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {cityData.testimonials.map((t, idx) => (
                  <div key={idx} className="border border-[#C9A84C]/15 rounded-2xl p-6 bg-[#111] relative">
                    <Quote className="h-6 w-6 text-[#C9A84C]/30 mb-3" />
                    <p className="text-sm text-[#A1A1A6] leading-relaxed italic mb-4">&quot;{t.quote}&quot;</p>
                    <div className="flex items-center justify-between border-t border-[#C9A84C]/10 pt-3">
                      <div>
                        <p className="text-sm font-bold text-[#F5F0E8]">{t.author}</p>
                        <p className="text-[0.7rem] text-[#7C8088]">{t.location}</p>
                      </div>
                      <span className="text-[0.6rem] uppercase tracking-wider text-[#C9A84C] bg-[#C9A84C]/10 px-2 py-1 rounded-md">{t.trip}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>

        {/* ─── SIDEBAR ────────────────────────────────────────────── */}
        <div className="lg:col-span-1 space-y-8">
          
          {/* Attractions */}
          {cityData.attractions.length > 0 && (
            <div className="bg-[#111] border border-[#C9A84C]/15 rounded-3xl p-6">
              <h3 className="font-heading text-xl font-bold mb-6 flex items-center gap-2">
                <Building2 className="text-[#C9A84C] h-5 w-5" /> Key Destinations
              </h3>
              <div className="space-y-4">
                {cityData.attractions.map((attr, idx) => (
                  <div key={idx} className="flex justify-between items-center border-b border-[#C9A84C]/10 pb-4 last:border-0 last:pb-0">
                    <span className="text-sm font-bold text-[#F5F0E8]">{attr.name}</span>
                    <span className="text-[0.65rem] uppercase tracking-wider text-[#C9A84C] bg-[#C9A84C]/10 px-2 py-1 rounded-md">{attr.dist}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Vehicle Recommendation */}
          <div className="bg-gradient-to-br from-[#1A1A1A] to-[#111] border border-[#C9A84C]/30 rounded-3xl p-6 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-10 text-[#C9A84C]">
              <Car className="h-32 w-32" />
            </div>
            <div className="relative z-10">
              <span className="text-[0.6rem] uppercase tracking-widest text-[#C9A84C] font-bold">Recommended</span>
              <h3 className="font-heading text-xl font-bold mt-1 mb-2">SUV Class</h3>
              <p className="text-xs text-[#A1A1A6] mb-6 leading-relaxed">
                For optimal comfort and ample luggage space in {cityData.name}, our premium SUV fleet (GMC Yukon, Chevy Tahoe) is highly recommended.
              </p>
              <Link
                href={`/book?pickup=${encodeURIComponent(cityData.name)}`}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#C9A84C] py-3 text-xs font-bold uppercase text-[#0A0A0A] hover:bg-[#B8963B] transition-all"
              >
                Reserve Vehicle
              </Link>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
