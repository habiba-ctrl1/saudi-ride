import Link from "next/link";
import { CheckCircle2, Briefcase, TrendingUp, MapPin, Send, MessageCircle, Car } from "lucide-react";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { TLDRSummary } from "@/components/seo/TLDRSummary";
import { DistanceTable } from "@/components/seo/DistanceTable";
import { RelatedLinks } from "@/components/seo/RelatedLinks";
import { jobPostingSchema, faqSchema, breadcrumbSchema } from "@/lib/schema";
import { contactConfig } from "@/lib/config/contact";
import {
  DRIVER_JOB_CITIES,
  DRIVER_REQUIREMENTS,
  DRIVER_BENEFITS,
  JOB_VARIANTS,
  variantSalary,
  type DriverJobCity,
  type JobVariant,
} from "@/lib/data/driver-jobs";

export interface CityMoneyLinks {
  locationSlug?: string;
  locationName?: string;
  airportSlug?: string;
  airportName?: string;
  topRoutes: { name: string; href: string }[];
  topServices: { name: string; href: string }[];
}

// Complete 18-city authority transfer map linking driver job pages directly to commercial money pages
export const CITY_MONEY_LINKS: Record<string, CityMoneyLinks> = {
  riyadh: {
    locationSlug: "riyadh",
    locationName: "Riyadh Taxi Guide",
    airportSlug: "king-khalid-riyadh",
    airportName: "King Khalid Airport (RUH) Taxi",
    topRoutes: [
      { name: "Riyadh to Dammam Taxi (From SAR 699)", href: "/routes/riyadh-to-dammam" },
      { name: "Riyadh to Makkah Transfer (From SAR 550)", href: "/routes/riyadh-to-makkah" },
      { name: "Riyadh to Dubai Cross-Border Taxi", href: "/routes/riyadh-to-dubai" },
    ],
    topServices: [
      { name: "Riyadh B2B Corporate Transport", href: "/services/corporate" },
      { name: "24/7 Car Recovery Satha in Riyadh", href: "/services/car-recovery/riyadh" },
    ],
  },
  jeddah: {
    locationSlug: "jeddah",
    locationName: "Jeddah Taxi Guide",
    airportSlug: "king-abdulaziz-jeddah",
    airportName: "Jeddah Airport (JED) Pickups",
    topRoutes: [
      { name: "Jeddah Airport to Makkah (From SAR 249)", href: "/routes/jeddah-airport-to-makkah" },
      { name: "Jeddah to Madinah Taxi (From SAR 549)", href: "/routes/jeddah-to-madinah" },
      { name: "Jeddah to KAEC Transfer", href: "/routes/jeddah-to-kaec" },
    ],
    topServices: [
      { name: "Umrah Taxi & Pilgrimage Transport", href: "/services/umrah-transport" },
      { name: "Airport Taxi Service Jeddah", href: "/services/airport-transfers" },
    ],
  },
  makkah: {
    locationSlug: "makkah",
    locationName: "Makkah Taxi Service",
    topRoutes: [
      { name: "Makkah to Madinah Taxi (From SAR 499)", href: "/routes/makkah-to-madinah" },
      { name: "Makkah to Jeddah Airport Taxi", href: "/routes/makkah-to-jeddah-airport" },
      { name: "Makkah to Taif Transfer", href: "/routes/makkah-to-taif" },
    ],
    topServices: [
      { name: "Makkah Ziyarat Holy Sites Tour", href: "/services/makkah-ziyarat" },
      { name: "Umrah Transport Services", href: "/services/umrah-transport" },
    ],
  },
  madinah: {
    locationSlug: "madinah",
    locationName: "Madinah Taxi Guide",
    airportSlug: "prince-mohammad-madinah",
    airportName: "Madinah Airport (MED) Pickups",
    topRoutes: [
      { name: "Madinah to Makkah Taxi (From SAR 499)", href: "/routes/madinah-to-makkah" },
      { name: "Madinah to Jeddah Airport Transfer", href: "/routes/madinah-to-jeddah-airport" },
      { name: "Madinah to AlUla Taxi", href: "/routes/madinah-to-alula" },
    ],
    topServices: [
      { name: "Madinah Ziyarat Guided Tours", href: "/services/madinah-ziyarat" },
      { name: "Umrah Pilgrimage Transfers", href: "/services/umrah-transport" },
    ],
  },
  dammam: {
    locationSlug: "dammam",
    locationName: "Dammam Taxi Service",
    airportSlug: "king-fahd-dammam",
    airportName: "King Fahd Airport (DMM) Taxi",
    topRoutes: [
      { name: "Dammam to Doha (Qatar) Taxi", href: "/routes/dammam-to-doha" },
      { name: "Dammam to Riyadh Taxi (From SAR 699)", href: "/routes/riyadh-to-dammam" },
      { name: "Dammam to Kuwait Cross-Border Transfer", href: "/routes/dammam-to-kuwait" },
    ],
    topServices: [
      { name: "GCC Cross-Border Taxi Service", href: "/services/border-crossings" },
      { name: "Intercity Executive Taxi Dammam", href: "/services/intercity" },
    ],
  },
  khobar: {
    locationSlug: "alkhobar",
    locationName: "Al Khobar Taxi Guide",
    topRoutes: [
      { name: "Al Khobar to Bahrain Causeway Taxi", href: "/services/border-crossings" },
      { name: "Al Khobar to Dammam Airport Taxi", href: "/services/airport-transfers" },
      { name: "Al Khobar to Riyadh Transfer", href: "/routes/riyadh-to-dammam" },
    ],
    topServices: [
      { name: "GCC Cross-Border Chauffeur", href: "/services/border-crossings" },
      { name: "Corporate B2B Transport Khobar", href: "/services/corporate" },
    ],
  },
  taif: {
    locationSlug: "taif",
    locationName: "Taif Taxi Service",
    airportSlug: "taif-regional",
    airportName: "Taif Regional Airport (TIF) Taxi",
    topRoutes: [
      { name: "Jeddah to Taif Taxi (From SAR 200)", href: "/routes/jeddah-to-taif" },
      { name: "Makkah to Taif Transfer", href: "/routes/makkah-to-taif" },
    ],
    topServices: [
      { name: "Taif Ziyarat & Mountain Tours", href: "/services/taif-ziyarat" },
      { name: "Intercity Transfers Taif", href: "/services/intercity" },
    ],
  },
  alula: {
    locationSlug: "alula",
    locationName: "AlUla Taxi & Tours",
    airportSlug: "alula",
    airportName: "AlUla International Airport (ULH) Taxi",
    topRoutes: [
      { name: "Madinah to AlUla Taxi", href: "/routes/madinah-to-alula" },
      { name: "Tabuk Airport to NEOM / AlUla", href: "/routes/tabuk-airport-to-neom" },
    ],
    topServices: [
      { name: "Saudi Heritage & Tourism Tours", href: "/services/tourism" },
      { name: "VIP Luxury Chauffeur AlUla", href: "/services/vip-luxury" },
    ],
  },
  tabuk: {
    locationSlug: "neom",
    locationName: "NEOM & Tabuk Transport",
    topRoutes: [
      { name: "Tabuk Airport to NEOM (From SAR 200)", href: "/routes/tabuk-airport-to-neom" },
      { name: "Tabuk to Madinah Transfer", href: "/routes/madinah-to-tabuk" },
    ],
    topServices: [
      { name: "NEOM & Red Sea Transport", href: "/locations/neom" },
      { name: "Airport Transfers Tabuk", href: "/services/airport-transfers" },
    ],
  },
  abha: {
    locationSlug: "abha",
    locationName: "Abha Taxi Guide",
    airportSlug: "abha-regional",
    airportName: "Abha Regional Airport (AHB) Taxi",
    topRoutes: [
      { name: "Jeddah to Abha Transfer", href: "/routes/jeddah-to-abha" },
    ],
    topServices: [
      { name: "Abha Intercity & Mountain Transfers", href: "/services/intercity" },
      { name: "Tourism & Heritage Car Hire", href: "/services/tourism" },
    ],
  },
  yanbu: {
    locationSlug: "yanbu",
    locationName: "Yanbu Taxi Service",
    topRoutes: [
      { name: "Jeddah to Yanbu Taxi", href: "/services/intercity" },
      { name: "Madinah to Yanbu Transfer", href: "/services/intercity" },
    ],
    topServices: [
      { name: "Industrial & Corporate Transfers", href: "/services/corporate" },
      { name: "Red Sea Coast Taxi Service", href: "/services/intercity" },
    ],
  },
  jubail: {
    topRoutes: [
      { name: "Jubail to Dammam Airport Taxi", href: "/services/airport-transfers" },
      { name: "Jubail to Bahrain Causeway Taxi", href: "/services/border-crossings" },
    ],
    topServices: [
      { name: "Industrial City B2B Corporate Fleet", href: "/services/corporate" },
      { name: "Long-Distance Intercity Taxi", href: "/services/intercity" },
    ],
  },
  dhahran: {
    locationSlug: "alkhobar",
    locationName: "Dhahran & Al Khobar Taxi",
    topRoutes: [
      { name: "Dhahran to Dammam Airport Taxi", href: "/services/airport-transfers" },
      { name: "Dhahran to Riyadh Transfer", href: "/routes/riyadh-to-dammam" },
    ],
    topServices: [
      { name: "Aramco & Corporate Transport", href: "/services/corporate" },
      { name: "GCC Border Crossing Taxi", href: "/services/border-crossings" },
    ],
  },
  "khamis-mushait": {
    locationSlug: "abha",
    locationName: "Asir Region Taxi Service",
    topRoutes: [
      { name: "Khamis Mushait to Abha Airport", href: "/services/airport-transfers" },
      { name: "Asir Region Intercity Rides", href: "/services/intercity" },
    ],
    topServices: [
      { name: "Family SUV & Van Hire", href: "/fleet" },
      { name: "Airport Taxi Service", href: "/services/airport-transfers" },
    ],
  },
  buraidah: {
    topRoutes: [
      { name: "Riyadh to Buraydah Taxi", href: "/routes/riyadh-to-buraydah" },
    ],
    topServices: [
      { name: "Al-Qassim Regional Taxi", href: "/services/intercity" },
      { name: "Fixed Price Airport Transfers", href: "/services/airport-transfers" },
    ],
  },
  "al-ahsa": {
    topRoutes: [
      { name: "Riyadh to Al-Ahsa Taxi", href: "/routes/riyadh-to-alahsa" },
    ],
    topServices: [
      { name: "Eastern Province Intercity Taxi", href: "/services/intercity" },
      { name: "Corporate Fleet Rental", href: "/services/corporate" },
    ],
  },
  hail: {
    topRoutes: [
      { name: "Riyadh to Hail Taxi", href: "/routes/riyadh-to-hail" },
    ],
    topServices: [
      { name: "Hail Regional Taxi & Transfers", href: "/services/intercity" },
      { name: "Airport Taxi Service", href: "/services/airport-transfers" },
    ],
  },
  najran: {
    topRoutes: [
      { name: "Najran Intercity Car Service", href: "/services/intercity" },
    ],
    topServices: [
      { name: "Airport Transfer Service", href: "/services/airport-transfers" },
      { name: "Long-Distance Car Service", href: "/services/intercity" },
    ],
  },
  "al-qassim": {
    topRoutes: [
      { name: "Riyadh to Buraydah / Qassim Taxi", href: "/routes/riyadh-to-buraydah" },
    ],
    topServices: [
      { name: "Al-Qassim Regional Taxi", href: "/services/intercity" },
      { name: "Airport Taxi Service", href: "/services/airport-transfers" },
    ],
  },
};

export function DriverJobBody({ data, variantKey }: { data: DriverJobCity; variantKey: JobVariant }) {
  const v = JOB_VARIANTS[variantKey];
  const path = `${v.urlBase}/${data.slug}`;
  const salary = variantSalary(data.salary, v.salaryFactor);
  const salaryText = `SAR ${salary[0].toLocaleString()}–${salary[1].toLocaleString()}`;
  const cityMoney = CITY_MONEY_LINKS[data.slug];

  const crumbs = [
    { name: "Home", href: "/" },
    { name: v.label, href: v.urlBase },
    { name: data.name, href: path },
  ];

  const faqs = [
    {
      question: `How much can a ${v.role.toLowerCase()} earn in ${data.name}?`,
      answer: `${v.role}s partnering with Taxi Saudi Arabia in ${data.name} typically earn ${salaryText} per month depending on hours, vehicle class and season. ${v.focusTrip} and Umrah trips pay the most.`,
    },
    {
      question: `What do I need to start as a ${v.role.toLowerCase()} in ${data.name}?`,
      answer: `A valid Saudi driving license with a clean record, your own 2020-or-newer vehicle in good condition (drivers must have their own car to apply), a smartphone, and conversational Arabic or English.${v.extraRequirements.length ? ` For this role you also need: ${v.extraRequirements[0].toLowerCase()}.` : ""}`,
    },
    {
      question: `Is demand for ${v.keyword} in ${data.name} good?`,
      answer: `Demand in ${data.name} is ${data.demand.toLowerCase()}. ${data.hook}`,
    },
    {
      question: `How do I apply or book a ride?`,
      answer: `Drivers can apply online through our registration form or via WhatsApp. If you are looking to book a passenger ride in ${data.name} instead of driving, check out our fixed taxi fares or book online directly.`,
    },
  ];

  const whatsappApply = `${contactConfig.whatsappLink}?text=${encodeURIComponent(
    `Assalamu Alaikum! I want to apply as a ${v.role.toLowerCase()} in ${data.name}. My details:\n\n` +
      `1. Full Name: \n` +
      `2. Nationality & Iqama status: \n` +
      `3. Saudi driving license type (private/public): \n` +
      `4. Your own car — model + year (required to apply): \n` +
      `5. Driving experience (years / Uber / Careem?): \n` +
      `6. Languages (Arabic/English/Urdu): \n` +
      `7. Availability (full-time / part-time): \n` +
      `8. Current city/area: `,
  )}`;

  const requirements = [...DRIVER_REQUIREMENTS, ...v.extraRequirements];

  const schema = [
    breadcrumbSchema(crumbs),
    jobPostingSchema({
      title: `${v.role} — ${data.name}`,
      description: `Work as a ${v.role.toLowerCase()} with Taxi Saudi Arabia in ${data.name}, ${data.region}. ${v.angle} Transparent fares and weekly payouts. Indicative earnings ${salaryText}/month.`,
      path,
      city: data.name,
      region: data.region,
      salary,
    }),
    faqSchema(faqs),
  ];

  const otherVariants = (Object.keys(JOB_VARIANTS) as JobVariant[])
    .filter((k) => k !== variantKey)
    .map((k) => ({
      name: `${JOB_VARIANTS[k].label} in ${data.name}`,
      href: `${JOB_VARIANTS[k].urlBase}/${data.slug}`,
    }));

  return (
    <main className="min-h-screen bg-[#FAFAF7]">
      <JsonLd data={schema} />
      <Breadcrumbs items={crumbs} />

      <section className="section-container max-w-7xl pt-4 pb-8">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#006C35]/10 px-3 py-1 text-xs font-semibold text-[#006C35]">
            <Briefcase className="h-3.5 w-3.5" /> {v.label}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F4E4BC]/50 px-3 py-1 text-xs font-semibold text-[#9a7d33]">
            <TrendingUp className="h-3.5 w-3.5" /> {data.demand} demand
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#1C1C1C] mb-3">
          {v.label} in {data.name}
        </h1>
        <p className="max-w-3xl text-[#444] leading-relaxed mb-6">
          Become a {v.role.toLowerCase()} in {data.name}, {data.region}. {v.angle} Partner with Taxi
          Saudi Arabia and get steady pre-booked trips instead of waiting for street hails.
          {cityMoney?.locationSlug && (
            <> Looking to book a ride instead? Visit our <Link href={`/locations/${cityMoney.locationSlug}`} className="text-[#006C35] font-semibold underline hover:text-[#15803D]">Taxi in {data.name} Guide</Link> or check our <Link href="/services/airport-transfers" className="text-[#006C35] font-semibold underline hover:text-[#15803D]">Airport Transfer Services</Link>.</>
          )}
        </p>

        <TLDRSummary
          answer={`${v.role}s in ${data.name} earn around ${salaryText}/month with Taxi Saudi Arabia. Demand is ${data.demand.toLowerCase()}. You need a valid Saudi license and your own 2020+ vehicle — apply online or on WhatsApp.`}
          facts={[
            { label: "Earnings", value: `${salaryText}/mo` },
            { label: "Demand", value: data.demand },
            { label: "Region", value: data.region.replace(" Province", "") },
            { label: "Type", value: "Full / Part-time" },
          ]}
          className="mb-8"
        />

        <div className="flex flex-wrap gap-3 mb-10">
          <Link
            href="/partners/driver-registration"
            className="inline-flex items-center gap-2 rounded-xl bg-[#006C35] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#15803D]"
          >
            <Send className="h-4 w-4" /> Apply Online
          </Link>
          <a
            href={whatsappApply}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-[#006C35]/30 bg-white px-5 py-3 text-sm font-semibold text-[#006C35] transition-colors hover:bg-[#006C35]/5"
          >
            <MessageCircle className="h-4 w-4" /> Apply on WhatsApp
          </a>
        </div>

        <div className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1C1C1C] mb-4">
            Earnings &amp; Demand in {data.name}
          </h2>
          <DistanceTable
            caption={`${v.role} earnings snapshot — ${data.name}`}
            columns={["Trip type", "Typical demand", "Why it pays"]}
            rows={[
              [v.focusTrip, "High", "Fixed long-distance fares"],
              ["Umrah / Ziyarat trips", data.region.includes("Makkah") || data.region.includes("Madinah") ? "Very High" : "Seasonal", "Multi-stop, full-day bookings"],
              ["Corporate / business", data.demand, "Repeat premium clients"],
              ["Intercity routes", "Steady", "High-value point-to-point"],
            ]}
          />
        </div>

        <div className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1C1C1C] mb-4">
            Where the Trips Come From
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {data.hubs.map((hub) => (
              <li
                key={hub}
                className="flex items-start gap-2 rounded-xl border border-black/8 bg-white px-4 py-3"
              >
                <MapPin className="h-4 w-4 flex-shrink-0 text-[#C9A84C] mt-0.5" />
                <span className="text-sm text-[#1C1C1C]">{hub}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid gap-8 md:grid-cols-2 mb-10">
          <div>
            <h2 className="text-xl font-bold text-[#1C1C1C] mb-4">Requirements</h2>
            <ul className="space-y-2.5">
              {requirements.map((r) => (
                <li key={r} className="flex items-start gap-2 text-sm text-[#444]">
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-[#006C35] mt-0.5" />
                  {r}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#1C1C1C] mb-4">Why Drive With Us</h2>
            <ul className="space-y-2.5">
              {DRIVER_BENEFITS.map((b) => (
                <li key={b} className="flex items-start gap-2 text-sm text-[#444]">
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-[#C9A84C] mt-0.5" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1C1C1C] mb-4">
            {v.label} in {data.name} — FAQ
          </h2>
          <div className="space-y-3">
            {faqs.map((f) => (
              <details
                key={f.question}
                className="group rounded-xl border border-black/8 bg-white p-4"
              >
                <summary className="cursor-pointer list-none font-medium text-[#1C1C1C] flex items-center justify-between">
                  {f.question}
                  <span className="text-[#C9A84C] group-open:rotate-45 transition-transform text-lg leading-none">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm text-[#444] leading-relaxed">{f.answer}</p>
              </details>
            ))}
          </div>
        </div>

        {/* ─── AUTHORITY TRANSFER NETWORK: NEED TRANSPORTATION IN THIS CITY? ─── */}
        <div className="mt-12 rounded-3xl border border-[#006C35]/20 bg-gradient-to-br from-white via-[#FAFAF7] to-[#006C35]/5 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-[#C9A84C]/15 pb-4 mb-6">
            <div>
              <span className="text-[0.65rem] font-bold uppercase tracking-widest text-[#9a7d33]">
                Taxi &amp; Chauffeur Booking Services
              </span>
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#1C1C1C]">
                Need Private Transportation in {data.name}?
              </h2>
            </div>
            <Link
              href="/book"
              className="inline-flex items-center gap-2 rounded-full bg-[#006C35] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#15803D] transition-colors"
            >
              <Car className="h-3.5 w-3.5" />
              Book a Taxi Online &rarr;
            </Link>
          </div>

          <p className="text-xs sm:text-sm text-[#444] leading-relaxed mb-6">
            Taxi Saudi Arabia provides 24/7 licensed taxi services, airport transfers, Umrah transport, and intercity rides across {data.name} and {data.region}. Fixed prices with no surge fees.
          </p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Column 1: City & Airport Guides */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1C1C1C] flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-[#006C35]" /> {data.name} City &amp; Airport
              </h3>
              <ul className="space-y-1.5 text-xs">
                {cityMoney?.locationSlug && (
                  <li>
                    <Link href={`/locations/${cityMoney.locationSlug}`} className="text-[#006C35] hover:underline font-semibold flex items-center gap-1">
                      • {cityMoney.locationName ?? `Taxi Service in ${data.name}`}
                    </Link>
                  </li>
                )}
                {cityMoney?.airportSlug ? (
                  <li>
                    <Link href={`/airports/${cityMoney.airportSlug}`} className="text-[#006C35] hover:underline font-semibold flex items-center gap-1">
                      • {cityMoney.airportName ?? `${data.name} Airport Transfers`}
                    </Link>
                  </li>
                ) : (
                  <li>
                    <Link href="/services/airport-transfers" className="text-[#006C35] hover:underline font-semibold flex items-center gap-1">
                      • 24/7 Airport Transfer Service
                    </Link>
                  </li>
                )}
                <li>
                  <Link href="/pricing" className="text-[#444] hover:text-[#006C35] font-medium flex items-center gap-1">
                    • View Fixed Taxi Fares &amp; Calculator
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2: Popular Routes from this City */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1C1C1C] flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-[#C9A84C]" /> Top Routes from {data.name}
              </h3>
              <ul className="space-y-1.5 text-xs">
                {cityMoney?.topRoutes.map((r) => (
                  <li key={r.href + r.name}>
                    <Link href={r.href} className="text-[#444] hover:text-[#006C35] font-medium flex items-center gap-1">
                      • {r.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/routes" className="text-[#006C35] hover:underline font-semibold flex items-center gap-1">
                    • Browse All 50+ Kingdom-Wide Routes
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Premium Services & Fleet */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1C1C1C] flex items-center gap-1.5">
                <Briefcase className="h-3.5 w-3.5 text-[#006C35]" /> Premium Services &amp; Fleet
              </h3>
              <ul className="space-y-1.5 text-xs">
                {cityMoney?.topServices.map((s) => (
                  <li key={s.href + s.name}>
                    <Link href={s.href} className="text-[#444] hover:text-[#006C35] font-medium flex items-center gap-1">
                      • {s.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/fleet" className="text-[#444] hover:text-[#006C35] font-medium flex items-center gap-1">
                    • Fleet (GMC Yukon, Staria, Camry)
                  </Link>
                </li>
                <li>
                  <Link href="/services/corporate" className="text-[#444] hover:text-[#006C35] font-medium flex items-center gap-1">
                    • Corporate B2B Account Setup
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <RelatedLinks title={`Also Hiring in ${data.name}`} links={otherVariants} />

      <RelatedLinks
        title={`${v.label} in Other Cities`}
        links={DRIVER_JOB_CITIES.filter((c) => c.slug !== data.slug)
          .slice(0, 9)
          .map((c) => ({
            name: `${v.label} in ${c.name}`,
            href: `${v.urlBase}/${c.slug}`,
            note: `${c.demand} demand`,
          }))}
      />
    </main>
  );
}
