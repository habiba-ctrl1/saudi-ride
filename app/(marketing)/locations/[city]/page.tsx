export const dynamic = "force-dynamic";
export const revalidate = 86400; // revalidate every 24 hours

// No notFound import
import { db } from "@/lib/db";
import { Metadata } from "next";
import { MapPin, ArrowRight, Car, Building2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Static content for cities to complement dynamic route data
const CITY_DETAILS: Record<string, { name: string, nameAr: string, image: string, tagline: string, description: string, attractions: { name: string, dist: string }[], tips: string[] }> = {
  makkah: {
    name: "Makkah",
    nameAr: "مكة المكرمة",
    image: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=1200&q=80",
    tagline: "The Holiest City on Earth",
    description: "Experience premium chauffeur service in Makkah with our fleet of luxury vehicles. Our professional drivers ensure a peaceful and comfortable journey for your Umrah or Hajj pilgrimage.",
    attractions: [
      { name: "Al-Masjid Al-Haram", dist: "0 km" },
      { name: "Jabal Al-Nour (Cave of Hira)", dist: "5 km" },
      { name: "Mina & Arafat", dist: "8-15 km" }
    ],
    tips: [
      "Access to the central Haram area may be restricted during prayer times.",
      "Only Muslims are permitted to enter the city limits of Makkah.",
      "Pre-book your return transfer to Jeddah Airport well in advance during peak seasons."
    ]
  },
  madinah: {
    name: "Madinah",
    nameAr: "المدينة المنورة",
    image: "https://images.unsplash.com/photo-1564769662533-4f00a87b4056?auto=format&fit=crop&w=1200&q=80",
    tagline: "City of the Prophet ﷺ",
    description: "Seamless and serene transfers in Madinah. Whether arriving at Prince Mohammad Bin Abdulaziz Airport or visiting the holy sites, our luxury taxis are at your service.",
    attractions: [
      { name: "Al-Masjid Al-Nabawi", dist: "0 km" },
      { name: "Quba Mosque", dist: "4 km" },
      { name: "Mount Uhud", dist: "6 km" }
    ],
    tips: [
      "Ziyarah tours usually take 3-4 hours and can be booked as a dedicated package.",
      "Traffic around the central area is heavy after Friday prayers."
    ]
  },
  riyadh: {
    name: "Riyadh",
    nameAr: "الرياض",
    image: "https://images.unsplash.com/photo-1578895101408-1a36b834405b?auto=format&fit=crop&w=1200&q=80",
    tagline: "The Saudi Capital",
    description: "Executive transport across Saudi Arabia's bustling capital. From the airport to the Financial District, travel with uncompromising luxury and punctuality.",
    attractions: [
      { name: "Kingdom Centre", dist: "City Center" },
      { name: "Diriyah (At-Turaif)", dist: "20 km" },
      { name: "KAFD", dist: "15 km" }
    ],
    tips: [
      "Riyadh experiences heavy rush hour traffic between 4 PM and 7 PM.",
      "Distances between districts are significant; choose a comfortable vehicle."
    ]
  },
  jeddah: {
    name: "Jeddah",
    nameAr: "جدة",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80",
    tagline: "The Red Sea Gateway",
    description: "Premium taxi services connecting Jeddah's airport, waterfront resorts, and the historic Al-Balad district.",
    attractions: [
      { name: "Jeddah Corniche", dist: "Coastal" },
      { name: "Historic Al-Balad", dist: "City Center" },
      { name: "King Fahd's Fountain", dist: "Coastal" }
    ],
    tips: [
      "Jeddah Airport has multiple terminals; ensure you specify which one you are arriving at.",
      "The Corniche area is very popular and busy during weekends."
    ]
  },
  dammam: {
    name: "Dammam",
    nameAr: "الدمام",
    image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1200&q=80",
    tagline: "Eastern Province Capital",
    description: "Reliable executive transfers across the Dammam metropolis, including Khobar, Dhahran, and King Fahd Airport.",
    attractions: [
      { name: "Half Moon Bay", dist: "30 km" },
      { name: "King Abdulaziz Center (Ithra)", dist: "20 km" },
      { name: "Dammam Corniche", dist: "City Center" }
    ],
    tips: [
      "Cross-border transfers to Bahrain via the Causeway require pre-arranged documentation.",
      "Airport is located about 40 minutes from the city center."
    ]
  },
  alula: {
    name: "AlUla",
    nameAr: "العلا",
    image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=80",
    tagline: "Saudi Arabia's Archaeological Wonder",
    description: "Experience the majestic heritage of AlUla with our premium chauffeurs. We offer transfers between the airport, luxury resorts, and historical sites.",
    attractions: [
      { name: "Hegra (Mada'in Salih)", dist: "22 km" },
      { name: "Elephant Rock", dist: "10 km" },
      { name: "Maraya Concert Hall", dist: "15 km" }
    ],
    tips: [
      "Book your rides well in advance as premium vehicles are in high demand.",
      "Most resorts are located in desert areas; SUVs are recommended for comfort."
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
    title: `Premium Taxi & Chauffeur Service in ${cityData.name} | Book Now`,
    description: `Book a luxury taxi in ${cityData.name}. Fixed-rate transfers, airport pickups, and executive chauffeur service across ${cityData.name}.`,
    alternates: {
      canonical: `/locations/${city}`,
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
    tagline: "Premium Chauffeur Service",
    description: `Executive transport and luxury taxi services in ${city}.`,
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
      {/* ─── HERO ─────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 overflow-hidden border-b border-[#C9A84C]/10">
        <div className="absolute inset-0 z-0">
          <Image src={cityData.image} alt={cityData.name} fill className="object-cover" />
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
              Book a Ride
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
