import Link from "next/link";
import { Briefcase, TrendingUp, ArrowRight, Send } from "lucide-react";
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
    <main className="min-h-screen bg-[#FAFAF7]">
      <JsonLd data={schema} />
      <Breadcrumbs items={crumbs} />

      <section className="section-container max-w-7xl pt-4 pb-10">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#006C35]/10 px-3 py-1 text-xs font-semibold text-[#006C35] mb-3">
          <Briefcase className="h-3.5 w-3.5" /> Driver Recruitment
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#1C1C1C] mb-3">
          {v.label} in Saudi Arabia
        </h1>
        <p className="max-w-2xl text-[#444] leading-relaxed mb-6">
          Join Saudi Arabia&apos;s growing network of professional drivers. {v.angle} Pick your city
          to see local earnings, demand and how to apply.
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
                  <span className="flex items-center gap-1 text-xs text-[#7C8088]">
                    <TrendingUp className="h-3 w-3" /> {c.demand} demand · SAR{" "}
                    {salary[0].toLocaleString()}–{salary[1].toLocaleString()}/mo
                  </span>
                </span>
                <ArrowRight className="h-4 w-4 flex-shrink-0 text-[#C9A84C] transition-transform group-hover:translate-x-0.5" />
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
