import { Metadata } from "next";
import { MapPin, ArrowRight, Car, Building2, CheckCircle2, PlaneLanding, HelpCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { serviceSchema, faqSchema } from "@/lib/schema";
import { TLDRSummary } from "@/components/seo/TLDRSummary";

export const revalidate = 86400;

export function generateStaticParams() {
  return [
    { slug: "king-abdulaziz-jeddah" },
    { slug: "prince-mohammad-madinah" },
    { slug: "king-khalid-riyadh" },
    { slug: "king-fahd-dammam" },
    { slug: "taif-regional" },
    { slug: "tabuk-regional" },
    { slug: "alula" },
    { slug: "abha-regional" },
  ];
}

const AIRPORT_DETAILS: Record<string, { name: string, code: string, nameAr: string, image: string, tagline: string, description: string, terminals: { name: string, desc: string }[], tips: string[], priorityRoutes: string[], tldr?: string, tldrFacts?: { label: string, value: string }[], faqs?: { question: string, answer: string }[] }> = {
  "king-abdulaziz-jeddah": {
    name: "King Abdulaziz International Airport",
    code: "JED",
    nameAr: "مطار الملك عبدالعزيز الدولي",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80",
    tagline: "The Main Gateway for Umrah & Hajj",
    description: "Pre-book a fixed-price taxi from King Abdulaziz International Airport (JED) to Makkah (~1 hour), Madinah, or your Jeddah hotel. Meet & greet at arrivals with a name sign, live flight tracking, no surge pricing, and 24/7 service — including late-night and early-morning pilgrim flights. Drivers can stop at the Miqat so you enter Ihram before reaching Makkah.",
    tldr: "A taxi from Jeddah Airport (JED) to Makkah takes about 1 hour and is fixed-price from SAR 180. Drivers track your flight and meet you at arrivals with a name sign, 24/7 — including late-night flights — and can stop at the Miqat for Ihram on the way to Makkah.",
    tldrFacts: [
      { label: "JED → Makkah", value: "~1 hr · from SAR 180" },
      { label: "JED → Madinah", value: "~4–5 hr" },
      { label: "Meet & greet", value: "Included" },
      { label: "Hours", value: "24/7" }
    ],
    terminals: [
      { name: "Terminal 1", desc: "The main modern terminal — Saudia plus most international and domestic flights. Largest arrivals hall; pre-booked drivers meet you here." },
      { name: "North Terminal", desc: "Older terminal used by some international carriers (e.g. flynas and others). Confirm your terminal from your boarding pass." },
      { name: "Hajj Terminal", desc: "Dedicated terminal for Hajj and Umrah charter flights during the pilgrimage seasons." }
    ],
    tips: [
      "Our drivers track your flight and wait up to 60 minutes free of charge — no extra cost if your flight is delayed.",
      "For Umrah, tell us if you need a Miqat stop so you can enter Ihram before reaching Makkah.",
      "Meet & greet is included — your driver waits in the arrivals hall holding a sign with your name.",
      "Confirm your terminal (Terminal 1, North, or Hajj) when booking so your driver meets you at the right arrivals exit."
    ],
    priorityRoutes: ["jeddah-airport-to-makkah", "jeddah-airport-to-madinah", "jeddah-airport-to-taif"],
    faqs: [
      { question: "How much is a taxi from Jeddah airport to Makkah?", answer: "A fixed-price taxi from King Abdulaziz International Airport (JED) to Makkah starts from around SAR 180 for a sedan, with larger SUVs and vans available. The price is confirmed before you book — no surge, tolls included." },
      { question: "Is there a taxi at Jeddah airport at night?", answer: "Yes. We operate 24/7 at JED, including late-night and early-morning arrivals. Because we track your flight, your driver is waiting with a name sign even on 2–4 AM landings." },
      { question: "Where do I meet my driver at Jeddah airport?", answer: "Your driver meets you inside the arrivals hall of your terminal (Terminal 1, North Terminal, or the Hajj Terminal) holding a sign with your name. Confirm your terminal when booking so we meet you at the right exit." },
      { question: "Can the driver stop at the Miqat for Ihram?", answer: "Yes. On the Jeddah Airport to Makkah route, simply ask and the driver will stop at the Miqat so you can change into Ihram and make your intention before entering the Haram boundary." },
      { question: "What happens if my flight is delayed?", answer: "Nothing extra to pay. We monitor your flight number in real time and adjust the pickup automatically, with up to 60 minutes of free waiting after you land." },
      { question: "Is there a taxi service at the Hajj Terminal?", answer: "Yes. During Hajj and Umrah seasons we serve the dedicated Hajj Terminal. Pre-book and share your flight details so your driver meets you at the correct terminal." }
    ]
  },
  "prince-mohammad-madinah": {
    name: "Prince Mohammad Bin Abdulaziz Airport",
    code: "MED",
    nameAr: "مطار الأمير محمد بن عبدالعزيز",
    image: "https://images.unsplash.com/photo-1564769662533-4f00a87b4056?auto=format&fit=crop&w=1200&q=80",
    tagline: "Gateway to the Prophet's City",
    description: "Pre-book a fixed-price taxi from Prince Mohammad Bin Abdulaziz Airport (MED) to your Madinah hotel near Masjid an-Nabawi (~20 km, ~25 min), or a long-distance transfer to Makkah. Meet & greet at arrivals, flight tracking, and 24/7 service for pilgrims.",
    tldr: "A taxi from Prince Mohammad Bin Abdulaziz Airport (MED) to central Madinah hotels takes about 25 minutes and is fixed-price from SAR 80. Drivers track your flight and meet you at arrivals with a name sign, 24/7.",
    tldrFacts: [
      { label: "MED → City", value: "~25 min · from SAR 80" },
      { label: "MED → Makkah", value: "~4.5–5 hr" },
      { label: "Meet & greet", value: "Included" },
      { label: "Hours", value: "24/7" }
    ],
    terminals: [
      { name: "Main Terminal", desc: "Award-winning terminal handling all international and domestic passenger flights. Pre-booked drivers meet you in the arrivals hall." },
      { name: "Hajj Pavilion", desc: "Dedicated facility opened for Hajj and peak Umrah charter flights." }
    ],
    tips: [
      "The airport is about 20–25 minutes from the Central Area (Markazia) hotels near Masjid an-Nabawi.",
      "We track your flight and include meet & greet — your driver waits with a name sign, even for delayed or late-night arrivals.",
      "We provide spacious vans (Hyundai Staria, Mercedes Sprinter) for large families with luggage.",
      "Travelling onward to Makkah? Book a direct MED to Makkah transfer (~450 km) with prayer and rest stops."
    ],
    priorityRoutes: ["madinah-airport-to-makkah", "madinah-airport-to-city"],
    faqs: [
      { question: "How much is a taxi from Madinah airport to the city?", answer: "A fixed-price taxi from Prince Mohammad Bin Abdulaziz Airport (MED) to central Madinah hotels starts from around SAR 80. It is about 20 km and a 25-minute drive, with meet & greet at arrivals." },
      { question: "Is there a taxi at Madinah airport at night?", answer: "Yes. We operate 24/7 at MED, including late-night and early-morning arrivals. We track your flight so your driver waits with a name sign even if the flight is delayed." },
      { question: "Where do I meet my driver at Madinah airport?", answer: "Your driver meets you in the arrivals hall of the main terminal holding a sign with your name, and helps with your luggage to the vehicle." },
      { question: "Can I travel directly from Madinah airport to Makkah?", answer: "Yes. We offer a direct MED to Makkah transfer (about 450 km, ~4.5–5 hours) with prayer and rest stops, ideal for pilgrims connecting between the Holy Cities." },
      { question: "Do you have vehicles for large families with luggage?", answer: "Yes. We provide spacious vans such as the Hyundai Staria and Mercedes Sprinter, plus SUVs, for families with extra luggage arriving at MED." }
    ]
  },
  "king-khalid-riyadh": {
    name: "King Khalid International Airport",
    code: "RUH",
    nameAr: "مطار الملك خالد الدولي",
    image: "https://images.unsplash.com/photo-1578895101408-1a36b834405b?auto=format&fit=crop&w=1200&q=80",
    tagline: "The Capital Hub",
    description: "Executive airport transfers from King Khalid International Airport (RUH) in Riyadh. Premium chauffeur services for business travelers heading to KAFD, Olaya, or Diplomatic Quarter.",
    terminals: [
      { name: "Terminal 5", desc: "Dedicated exclusively to domestic flights." },
      { name: "Terminals 1 & 2", desc: "International flights depending on the airline." },
      { name: "Terminal 3 & 4", desc: "Recently renovated for expanding international capacity." }
    ],
    tips: [
      "Riyadh airport is 35km north of the city center. Expect a 30-45 minute drive.",
      "Corporate invoicing and VAT receipts are provided for business travelers."
    ],
    priorityRoutes: ["riyadh-airport-to-city"]
  },
  "king-fahd-dammam": {
    name: "King Fahd International Airport",
    code: "DMM",
    nameAr: "مطار الملك فهد الدولي",
    image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1200&q=80",
    tagline: "The Eastern Gateway",
    description: "Pre-book your taxi from King Fahd International Airport (DMM) to Dammam, Al Khobar, Dhahran, or Jubail. Cross-border transfers to Bahrain also available upon request.",
    terminals: [
      { name: "Main Terminal", desc: "Six-level terminal handling all passenger traffic." }
    ],
    tips: [
      "DMM is the largest airport in the world by area, located 20km northwest of Dammam.",
      "For transfers to Bahrain, please provide passport details 24 hours in advance."
    ],
    priorityRoutes: ["dammam-to-doha", "dammam-to-manama"]
  },
  "taif-regional": {
    name: "Taif Regional Airport",
    code: "TIF",
    nameAr: "مطار الطائف الإقليمي",
    image: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=1200&q=80",
    tagline: "The Summer Capital Airport",
    description: "Taxi transfers from Taif Regional Airport to Taif city, Makkah, and Jeddah. Ideal for locals and tourists enjoying the pleasant mountain climate of Taif.",
    terminals: [
      { name: "Main Terminal", desc: "Single terminal building for all flights." }
    ],
    tips: [
      "Many pilgrims land in Taif to put on Ihram at Miqat Qarn al-Manazil (Al-Sail Al-Kabeer).",
      "The drive from Taif Airport to Makkah takes approximately 1.5 to 2 hours."
    ],
    priorityRoutes: ["taif-to-makkah"]
  },
  "tabuk-regional": {
    name: "Tabuk Regional Airport",
    code: "TUU",
    nameAr: "مطار تبوك الإقليمي",
    image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=80",
    tagline: "Gateway to the North",
    description: "Book a taxi from Tabuk Regional Airport for seamless transfers to NEOM, Amaala, and surrounding northern destinations. Comfortable SUVs available.",
    terminals: [
      { name: "Main Terminal", desc: "Single terminal serving domestic and limited regional flights." }
    ],
    tips: [
      "The drive to NEOM basecamps is roughly 2.5 hours. Pre-booking an SUV is highly recommended.",
      "Bottled water and Wi-Fi are provided on all long-distance transfers."
    ],
    priorityRoutes: ["tabuk-airport-to-neom"]
  },
  "alula": {
    name: "AlUla International Airport",
    code: "ULH",
    nameAr: "مطار العلا الدولي",
    image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=80",
    tagline: "Arrival at the Ancient Oasis",
    description: "Exclusive airport transfers from AlUla Airport (ULH) to your desert resort or Hegra. Luxury vehicles tailored for a premium tourist experience.",
    terminals: [
      { name: "Main Terminal", desc: "Boutique airport terminal serving the heritage site." }
    ],
    tips: [
      "Ensure you book your transfer in advance as on-demand taxis are extremely limited at ULH.",
      "Our luxury fleet (Cadillac Escalade, Mercedes S-Class) perfectly matches AlUla's premium resorts."
    ],
    priorityRoutes: ["alula-airport-to-resorts", "alula-to-medina"]
  },
  "abha-regional": {
    name: "Abha International Airport",
    code: "AHB",
    nameAr: "مطار أبها الدولي",
    image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1200&q=80",
    tagline: "The Aseer Mountains Hub",
    description: "Taxi transfers from Abha Airport to the city center, Soudah Peak, and surrounding Aseer region. Comfortable rides through the mountain roads.",
    terminals: [
      { name: "Main Terminal", desc: "Serves domestic and regional flights across the GCC." }
    ],
    tips: [
      "Mountain roads require experienced drivers, which our team guarantees.",
      "The airport is just 18km from the center of Abha."
    ],
    priorityRoutes: ["abha-airport-to-soudah"]
  }
};

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const airportData = AIRPORT_DETAILS[slug.toLowerCase()];

  if (!airportData) return { title: "Airport Not Found" };

  return {
    title: `Taxi from ${airportData.name} (${airportData.code}) | Taxi Saudi Arabia`,
    description: `Book your airport transfer from ${airportData.name}. Reliable taxi service, fixed prices, and meet & greet included at ${airportData.code} airport.`,
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

  // Fetch routes connected to this airport
  const airportRoutes = await db.route.findMany({
    where: {
      OR: [
        { fromCity: { contains: airportData.code, mode: 'insensitive' } },
        { toCity: { contains: airportData.code, mode: 'insensitive' } },
        { slug: { in: airportData.priorityRoutes } }
      ]
    },
    take: 6
  });

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8] pb-24">
      <JsonLd
        data={serviceSchema({
          name: `Airport Taxi Service at ${airportData.name} (${airportData.code})`,
          description: airportData.description,
          path: `/airports/${airportKey}`,
          serviceType: "Airport Transfer",
          areaServed: [airportData.name],
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
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/80 to-[#0A0A0A]/40" />
        </div>

        <div className="section-container relative z-10 max-w-5xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/20 backdrop-blur-sm px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#C9A84C] mb-6">
            <PlaneLanding className="h-3 w-3" /> Airport Transfer
          </span>
          <h1 className="font-heading text-4xl md:text-5xl font-bold leading-tight mb-2">
            Taxi Service from <br />
            <span className="text-[#C9A84C]">{airportData.name}</span>
          </h1>
          <p className="text-[#C9A84C] text-lg tracking-widest font-bold mb-6">{airportData.code} - {airportData.nameAr}</p>
          <p className="max-w-2xl text-sm md:text-base text-[#A1A1A6] leading-relaxed">
            {airportData.description}
          </p>

          <div className="mt-8 flex gap-4">
            <Link
              href={`/book?pickup=${encodeURIComponent(airportData.name)}`}
              className="flex items-center gap-2 rounded-full bg-[#C9A84C] px-8 py-3.5 text-xs font-bold uppercase text-[#0A0A0A] hover:bg-[#B8963B] transition-all"
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
            <h2 className="font-heading text-3xl font-bold mb-8">Popular Routes from {airportData.code}</h2>
            {airportRoutes.length > 0 ? (
              <div className="grid gap-4">
                {airportRoutes.map((route) => (
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
              <p className="text-[#A1A1A6]">Currently mapping custom routes for this airport. Please contact us for a quote.</p>
            )}
            <div className="mt-6">
              <Link href="/routes" className="text-[#C9A84C] text-sm font-bold hover:underline">View all Kingdom-wide routes &rarr;</Link>
            </div>
          </section>

          {/* Local Tips */}
          {airportData.tips.length > 0 && (
            <section className="bg-[#111] border border-[#C9A84C]/15 rounded-3xl p-8">
              <h2 className="font-heading text-2xl font-bold mb-6 text-[#F5F0E8]">Arrival & Transfer Tips</h2>
              <ul className="space-y-4">
                {airportData.tips.map((tip, idx) => (
                  <li key={idx} className="flex gap-4">
                    <CheckCircle2 className="h-5 w-5 text-[#C9A84C] shrink-0 mt-0.5" />
                    <p className="text-sm text-[#A1A1A6]">{tip}</p>
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
                  <div key={idx} className="border border-[#C9A84C]/15 rounded-2xl p-6 bg-[#111]">
                    <h3 className="font-bold text-base mb-2 text-[#F5F0E8]">{faq.question}</h3>
                    <p className="text-sm text-[#A1A1A6] leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>

        {/* ─── SIDEBAR ────────────────────────────────────────────── */}
        <div className="lg:col-span-1 space-y-8">
          
          {/* Terminals */}
          {airportData.terminals.length > 0 && (
            <div className="bg-[#111] border border-[#C9A84C]/15 rounded-3xl p-6">
              <h3 className="font-heading text-xl font-bold mb-6 flex items-center gap-2">
                <Building2 className="text-[#C9A84C] h-5 w-5" /> Terminals
              </h3>
              <div className="space-y-4">
                {airportData.terminals.map((term, idx) => (
                  <div key={idx} className="border-b border-[#C9A84C]/10 pb-4 last:border-0 last:pb-0">
                    <div className="text-sm font-bold text-[#F5F0E8] mb-1">{term.name}</div>
                    <p className="text-[0.7rem] text-[#A1A1A6]">{term.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FAQ Schema Placeholder (Blueprint requirement) */}
          <div className="bg-gradient-to-br from-[#1A1A1A] to-[#111] border border-[#C9A84C]/30 rounded-3xl p-6 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-10 text-[#C9A84C]">
              <PlaneLanding className="h-32 w-32" />
            </div>
            <div className="relative z-10">
              <span className="text-[0.6rem] uppercase tracking-widest text-[#C9A84C] font-bold">Included</span>
              <h3 className="font-heading text-xl font-bold mt-1 mb-2">Meet & Greet</h3>
              <p className="text-xs text-[#A1A1A6] mb-6 leading-relaxed">
                Your driver will be waiting in the arrivals hall with a name sign. We track your flight for delays. 60 minutes of free waiting time included.
              </p>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
