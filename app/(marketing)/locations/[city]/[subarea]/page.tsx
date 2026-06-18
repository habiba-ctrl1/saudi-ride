import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MapPin, ArrowRight, Car, ShieldCheck, Star } from "lucide-react";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { serviceSchema } from "@/lib/schema";

export const revalidate = 86400; // revalidate every 24 hours

const SUB_AREAS: Record<string, { city: string; subarea: string; name: string; nameAr: string; description: string; }> = {
  // Riyadh
  "kafd": { city: "riyadh", subarea: "kafd", name: "KAFD (King Abdullah Financial District)", nameAr: "مركز الملك عبدالله المالي", description: "Premium executive transport and corporate taxi services for KAFD professionals and visitors." },
  "olaya": { city: "riyadh", subarea: "olaya", name: "Olaya", nameAr: "العليا", description: "Reliable taxi services in the heart of Riyadh's commercial district, Olaya." },
  "diplomatic-quarter": { city: "riyadh", subarea: "diplomatic-quarter", name: "Diplomatic Quarter (DQ)", nameAr: "الحي الدبلوماسي", description: "Discreet and secure luxury chauffeur services for the Diplomatic Quarter." },
  "al-malaz": { city: "riyadh", subarea: "al-malaz", name: "Al Malaz", nameAr: "الملز", description: "Local and intercity taxi bookings from Al Malaz, Riyadh." },
  "al-murabba": { city: "riyadh", subarea: "al-murabba", name: "Al Murabba", nameAr: "المربع", description: "Historical Al Murabba taxi and private transport services." },
  "diriyah": { city: "riyadh", subarea: "diriyah", name: "Diriyah", nameAr: "الدرعية", description: "Heritage tours and luxury transfers to At-Turaif and Diriyah." },
  // Jeddah
  "al-balad": { city: "jeddah", subarea: "al-balad", name: "Al Balad (Historical Jeddah)", nameAr: "البلد", description: "Explore the UNESCO heritage site with our dedicated Al Balad taxi service." },
  "corniche": { city: "jeddah", subarea: "corniche", name: "Jeddah Corniche", nameAr: "كورنيش جدة", description: "Scenic rides and immediate pickups along the Jeddah Corniche." },
  "al-hamra": { city: "jeddah", subarea: "al-hamra", name: "Al Hamra", nameAr: "الحمراء", description: "Taxi service in Al Hamra, close to King Fahd's Fountain and major consulates." },
  "obhur": { city: "jeddah", subarea: "obhur", name: "Obhur", nameAr: "أبحر", description: "Transfers to and from the beautiful resorts and beaches of Obhur." },
  "al-safaa": { city: "jeddah", subarea: "al-safaa", name: "Al Safaa", nameAr: "الصفا", description: "Fast and reliable 24/7 taxi dispatch in Al Safaa district." },
  "al-rawdah": { city: "jeddah", subarea: "al-rawdah", name: "Al Rawdah", nameAr: "الروضة", description: "Premium taxi pickups in the upscale Al Rawdah neighborhood." },
  // Makkah
  "aziziyah": { city: "makkah", subarea: "aziziyah", name: "Aziziyah", nameAr: "العزيزية", description: "Dedicated Umrah and Hajj taxi transfers from Aziziyah hotels to the Haram." },
  "ajyad": { city: "makkah", subarea: "ajyad", name: "Ajyad", nameAr: "أجياد", description: "Immediate taxi availability in Ajyad, directly adjacent to Masjid Al-Haram." },
  "al-awali-makkah": { city: "makkah", subarea: "al-awali-makkah", name: "Al Awali", nameAr: "العوالي", description: "Comfortable rides and airport transfers from Al Awali, Makkah." },
  "al-shubaikah": { city: "makkah", subarea: "al-shubaikah", name: "Al Shubaikah", nameAr: "الشبيكة", description: "Local Makkah taxi service for pilgrims residing in Al Shubaikah." },
  "al-mansour": { city: "makkah", subarea: "al-mansour", name: "Al Mansour", nameAr: "المنصور", description: "Reliable and affordable taxi rides in the Al Mansour district." },
  "mina": { city: "makkah", subarea: "mina", name: "Mina", nameAr: "منى", description: "Permitted Hajj transport and year-round transfers to the valley of Mina." },
  // Madinah
  "al-markazia": { city: "madinah", subarea: "al-markazia", name: "Al Markazia (Central Area)", nameAr: "المركزية", description: "VIP taxi and Ziyarat tours starting directly from Al Markazia hotels." },
  "qaba": { city: "madinah", subarea: "qaba", name: "Quba", nameAr: "قباء", description: "Transport to and from Quba Mosque and the surrounding district." },
  "uhud": { city: "madinah", subarea: "uhud", name: "Mount Uhud District", nameAr: "أحد", description: "Ziyarat tours and taxi service to the historic Mount Uhud." },
  "al-awali-madinah": { city: "madinah", subarea: "al-awali-madinah", name: "Al Awali", nameAr: "العوالي", description: "Airport transfers and local rides in Al Awali, Madinah." },
  // Dammam / Eastern Province
  "al-khobar": { city: "dammam", subarea: "al-khobar", name: "Al Khobar", nameAr: "الخبر", description: "Corporate and leisure taxi services across Al Khobar." },
  "dhahran": { city: "dammam", subarea: "dhahran", name: "Dhahran", nameAr: "الظهران", description: "Executive transport for Aramco facilities and Dhahran district." },
  "half-moon-bay": { city: "dammam", subarea: "half-moon-bay", name: "Half Moon Bay", nameAr: "شاطئ نصف القمر", description: "Resort transfers and private transport to Half Moon Bay." },
  "qatif": { city: "dammam", subarea: "qatif", name: "Qatif", nameAr: "القطيف", description: "Reliable local taxi and intercity transfers from Qatif." }
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
