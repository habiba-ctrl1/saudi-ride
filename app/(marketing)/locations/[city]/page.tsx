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
import { MapPin, ArrowRight, Car, Building2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { serviceSchema } from "@/lib/schema";

// Static content for cities to complement dynamic route data
const CITY_DETAILS: Record<string, { name: string, nameAr: string, image: string, tagline: string, description: string, attractions: { name: string, dist: string }[], tips: string[] }> = {
  makkah: {
    name: "Makkah",
    nameAr: "مكة المكرمة",
    image: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=1200&q=80",
    tagline: "The Holiest City on Earth",
    description: "Book a taxi in Makkah for Umrah, Hajj, or daily travel. Our professional drivers provide reliable airport pickups, Masjid Al-Haram drop-offs, and Makkah to Madinah transfers. Prayer-time stops always included.",
    attractions: [
      { name: "Al-Masjid Al-Haram", dist: "0 km" },
      { name: "Jabal Al-Nour (Cave of Hira)", dist: "5 km" },
      { name: "Mina & Arafat", dist: "8-15 km" }
    ],
    tips: [
      "Vehicle access near Masjid Al-Haram may be restricted during peak prayer times — your driver will know the best drop-off point.",
      "Only Muslims are permitted to enter the city limits of Makkah.",
      "Pre-book your return taxi to Jeddah Airport in advance during Umrah and Hajj seasons to avoid delays."
    ]
  },
  madinah: {
    name: "Madinah",
    nameAr: "المدينة المنورة",
    image: "https://images.unsplash.com/photo-1564769662533-4f00a87b4056?auto=format&fit=crop&w=1200&q=80",
    tagline: "City of the Prophet ﷺ",
    description: "Book a taxi in Madinah for airport transfers, Masjid An-Nabawi visits, and Ziyarah tours. We serve pilgrims arriving at Prince Mohammad Bin Abdulaziz Airport and travelers going to and from Makkah or Jeddah.",
    attractions: [
      { name: "Al-Masjid Al-Nabawi", dist: "0 km" },
      { name: "Quba Mosque", dist: "4 km" },
      { name: "Mount Uhud", dist: "6 km" }
    ],
    tips: [
      "Ziyarah tours of the holy sites usually take 3-4 hours — book a full-day taxi for best value.",
      "Traffic around Masjid An-Nabawi is heavy after Friday prayers. Allow extra time."
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
    tagline: "The Red Sea Gateway",
    description: "Book a taxi in Jeddah for airport pickups from King Abdulaziz International Airport (KAIA), transfers to Makkah, Madinah, or Taif, and local rides around the Corniche, Al-Balad, and the city center.",
    attractions: [
      { name: "Jeddah Corniche", dist: "Coastal" },
      { name: "Historic Al-Balad (UNESCO Site)", dist: "City Center" },
      { name: "King Fahd's Fountain", dist: "Coastal" }
    ],
    tips: [
      "Jeddah Airport (KAIA) has two main terminals — North Terminal and South Terminal. Tell us which terminal when booking.",
      "Traffic near the Corniche is heavy on Thursday and Friday evenings. Plan ahead."
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
