import Link from "next/link";
import { Briefcase, TrendingUp, ArrowRight, Send, MapPin, Car, ShieldCheck } from "lucide-react";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { TLDRSummary } from "@/components/seo/TLDRSummary";
import { itemListSchema, breadcrumbSchema } from "@/lib/schema";
import { DRIVER_JOB_CITIES, JOB_VARIANTS, variantSalary, type JobVariant } from "@/lib/data/driver-jobs";

// Shared renderer for the three recruitment hub pages
// (/driver-jobs, /chauffeur-jobs, /taxi-driver-jobs).
export function DriverJobsHubBody({ variantKey }: { variantKey: JobVariant }) {
  const v = JOB_VARIANTS[variantKey];

  const crumbs = [
    { name: "Home", href: "/" },
    { name: v.label, href: v.urlBase },
  ];

  const cityLinks = DRIVER_JOB_CITIES.map((c) => ({
    name: `${v.label} in ${c.name}`,
    href: `${v.urlBase}/${c.slug}`,
  }));

  const schema = [breadcrumbSchema(crumbs), itemListSchema(cityLinks)];

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <JsonLd data={schema} />
      <Breadcrumbs items={crumbs} />

      <section className="section-container max-w-7xl pt-4 pb-10">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#006C35]/10 px-3 py-1 text-xs font-semibold text-[#006C35] mb-3">
          <Briefcase className="h-3.5 w-3.5" /> Driver Recruitment
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#1C1C1C] mb-3">
          {v.label} in Saudi Arabia
        </h1>
        <p className="max-w-3xl text-[#444] leading-relaxed mb-6">
          Join Saudi Arabia&apos;s growing network of professional drivers. {v.angle} Pick your city
          to see local earnings, demand and how to apply. Looking to book a taxi ride instead? Browse our <Link href="/services/airport-transfers" className="text-[#006C35] font-semibold underline hover:text-[#15803D]">Airport Transfers</Link>, <Link href="/services/umrah-transport" className="text-[#006C35] font-semibold underline hover:text-[#15803D]">Umrah Transport</Link>, or check out our <Link href="/fleet" className="text-[#006C35] font-semibold underline hover:text-[#15803D]">Luxury Vehicle Fleet</Link>.
        </p>

        <TLDRSummary
          answer={`Taxi Saudi Arabia is hiring for ${v.keyword} in ${DRIVER_JOB_CITIES.length}+ cities. Earnings depend on city, hours and trip type. You need a valid Saudi license and your own 2020+ vehicle. Apply online or on WhatsApp.`}
          facts={[
            { label: "Cities", value: `${DRIVER_JOB_CITIES.length}+` },
            { label: "Hours", value: "Flexible" },
            { label: "Payouts", value: "Weekly" },
            { label: "Trips", value: "Pre-booked" },
          ]}
          className="mb-8"
        />

        <Link
          href="/partners/driver-registration"
          className="inline-flex items-center gap-2 rounded-xl bg-[#006C35] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#15803D] mb-10"
        >
          <Send className="h-4 w-4" /> Apply Online Now
        </Link>

        <h2 className="text-xl sm:text-2xl font-bold text-[#1C1C1C] mb-5">Choose Your City</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {DRIVER_JOB_CITIES.map((c) => {
            const salary = variantSalary(c.salary, v.salaryFactor);
            return (
              <Link
                key={c.slug}
                href={`${v.urlBase}/${c.slug}`}
                className="group flex items-center justify-between gap-3 rounded-xl border border-black/8 bg-white px-4 py-4 transition-colors hover:border-[#006C35]/40 hover:bg-[#006C35]/5"
              >
                <span className="min-w-0">
                  <span className="block font-semibold text-[#1C1C1C] group-hover:text-[#006C35]">
                    {c.name}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-[#6B7280]">
                    <TrendingUp className="h-3 w-3" /> {c.demand} demand · SAR{" "}
                    {salary[0].toLocaleString()}–{salary[1].toLocaleString()}/mo
                  </span>
                </span>
                <ArrowRight className="h-4 w-4 flex-shrink-0 text-[#C9A84C] transition-transform group-hover:translate-x-0.5" />
              </Link>
            );
          })}
        </div>

        {/* Other recruitment tiers (cross-link the 3 hub variants) */}
        <div className="mt-10 flex flex-wrap gap-3">
          {(Object.keys(JOB_VARIANTS) as JobVariant[])
            .filter((key) => key !== variantKey)
            .map((key) => (
              <Link
                key={key}
                href={JOB_VARIANTS[key].urlBase}
                className="text-xs font-semibold text-[#006C35] hover:underline"
              >
                See {JOB_VARIANTS[key].label} →
              </Link>
            ))}
        </div>

        {/* ─── AUTHORITY TRANSFER NETWORK: PASSENGER SERVICES & MONEY PAGES ─── */}
        <div className="mt-12 rounded-3xl border border-[#006C35]/20 bg-gradient-to-br from-white via-[#FAFAF7] to-[#006C35]/5 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-[#C9A84C]/15 pb-4 mb-6">
            <div>
              <span className="text-[0.65rem] font-bold uppercase tracking-widest text-[#9a7d33]">
                Passenger Taxi &amp; Chauffeur Network
              </span>
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#1C1C1C]">
                Need a Private Taxi in Saudi Arabia Instead?
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
            Taxi Saudi Arabia is a premier licensed transport operator providing 24/7 airport transfers, Umrah pilgrimage routes, intercity rides, and GCC cross-border chauffeur services at fixed prices.
          </p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Column 1: Core City Guides */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1C1C1C] flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-[#006C35]" /> City Guides
              </h3>
              <ul className="space-y-1.5 text-xs">
                <li><Link href="/locations/riyadh" className="text-[#006C35] hover:underline font-semibold">• Taxi in Riyadh</Link></li>
                <li><Link href="/locations/jeddah" className="text-[#006C35] hover:underline font-semibold">• Taxi in Jeddah</Link></li>
                <li><Link href="/locations/makkah" className="text-[#006C35] hover:underline font-semibold">• Taxi in Makkah</Link></li>
                <li><Link href="/locations/madinah" className="text-[#006C35] hover:underline font-semibold">• Taxi in Madinah</Link></li>
                <li><Link href="/locations/dammam" className="text-[#006C35] hover:underline font-semibold">• Taxi in Dammam</Link></li>
                <li><Link href="/locations" className="text-[#444] hover:text-[#006C35] font-medium">• All 11 City Locations</Link></li>
              </ul>
            </div>

            {/* Column 2: Top Flagship Corridors */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1C1C1C] flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-[#C9A84C]" /> Top Routes
              </h3>
              <ul className="space-y-1.5 text-xs">
                <li><Link href="/routes/jeddah-airport-to-makkah" className="text-[#444] hover:text-[#006C35] font-medium">• Jeddah Airport → Makkah (SAR 249)</Link></li>
                <li><Link href="/routes/makkah-to-madinah" className="text-[#444] hover:text-[#006C35] font-medium">• Makkah → Madinah (SAR 499)</Link></li>
                <li><Link href="/routes/riyadh-to-dammam" className="text-[#444] hover:text-[#006C35] font-medium">• Riyadh → Dammam (SAR 699)</Link></li>
                <li><Link href="/routes/dammam-to-doha" className="text-[#444] hover:text-[#006C35] font-medium">• Dammam → Doha (Qatar)</Link></li>
                <li><Link href="/routes/jeddah-to-madinah" className="text-[#444] hover:text-[#006C35] font-medium">• Jeddah → Madinah (SAR 549)</Link></li>
                <li><Link href="/routes" className="text-[#006C35] hover:underline font-semibold">• All 50+ Routes</Link></li>
              </ul>
            </div>

            {/* Column 3: Commercial Services */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1C1C1C] flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-[#006C35]" /> Transport Services
              </h3>
              <ul className="space-y-1.5 text-xs">
                <li><Link href="/services/airport-transfers" className="text-[#006C35] hover:underline font-semibold">• Airport Transfers (JED, RUH, MED)</Link></li>
                <li><Link href="/services/umrah-transport" className="text-[#006C35] hover:underline font-semibold">• Umrah &amp; Pilgrimage Taxi</Link></li>
                <li><Link href="/services/corporate" className="text-[#444] hover:text-[#006C35] font-medium">• Corporate B2B Chauffeur</Link></li>
                <li><Link href="/services/intercity" className="text-[#444] hover:text-[#006C35] font-medium">• Intercity Transfers</Link></li>
                <li><Link href="/services/border-crossings" className="text-[#444] hover:text-[#006C35] font-medium">• GCC Cross-Border Taxi</Link></li>
                <li><Link href="/services" className="text-[#006C35] hover:underline font-semibold">• All 9 Elite Services</Link></li>
              </ul>
            </div>

            {/* Column 4: Fleet & Pricing */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1C1C1C] flex items-center gap-1.5">
                <Briefcase className="h-3.5 w-3.5 text-[#C9A84C]" /> Fleet &amp; Fares
              </h3>
              <ul className="space-y-1.5 text-xs">
                <li><Link href="/fleet" className="text-[#444] hover:text-[#006C35] font-medium">• Luxury Fleet Preview</Link></li>
                <li><Link href="/pricing" className="text-[#006C35] hover:underline font-semibold">• Fixed Fare Estimator</Link></li>
                <li><Link href="/faq" className="text-[#444] hover:text-[#006C35] font-medium">• Frequently Asked Questions</Link></li>
                <li><Link href="/contact" className="text-[#444] hover:text-[#006C35] font-medium">• 24/7 Booking Desk</Link></li>
                <li><Link href="/book" className="text-[#006C35] hover:underline font-bold">• Instant Booking Portal</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
