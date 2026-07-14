import Link from "next/link";
import { CheckCircle2, Briefcase, TrendingUp, MapPin, Send, MessageCircle } from "lucide-react";
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

// Shared renderer for all three keyword-variant recruitment pages
// (driver-jobs / chauffeur-jobs / taxi-driver-jobs). Each variant passes its
// key; content angle, salary skew and copy differ so pages aren't duplicates.
export function DriverJobBody({ data, variantKey }: { data: DriverJobCity; variantKey: JobVariant }) {
  const v = JOB_VARIANTS[variantKey];
  const path = `${v.urlBase}/${data.slug}`;
  const salary = variantSalary(data.salary, v.salaryFactor);
  const salaryText = `SAR ${salary[0].toLocaleString()}–${salary[1].toLocaleString()}`;

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
      answer: `A valid Saudi driving license with a clean record, a 2020-or-newer vehicle in good condition (or join with our fleet), a smartphone, and conversational Arabic or English.${v.extraRequirements.length ? ` For this role you also need: ${v.extraRequirements[0].toLowerCase()}.` : ""}`,
    },
    {
      question: `Is demand for ${v.keyword} in ${data.name} good?`,
      answer: `Demand in ${data.name} is ${data.demand.toLowerCase()}. ${data.hook}`,
    },
    {
      question: `How do I apply?`,
      answer: `Apply online through our driver registration form or message us on WhatsApp. After document and vehicle verification, you can start receiving pre-booked trips.`,
    },
  ];

  // Pre-filled mini application — driver apni details pehle message mein hi bhej deta hai
  const whatsappApply = `${contactConfig.whatsappLink}?text=${encodeURIComponent(
    `Assalamu Alaikum! I want to apply as a ${v.role.toLowerCase()} in ${data.name}. My details:\n\n` +
      `1. Full Name: \n` +
      `2. Nationality & Iqama status: \n` +
      `3. Saudi driving license type (private/public): \n` +
      `4. Own car? (model + year) or need company car: \n` +
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

  // Cross-link the same city's other two keyword variants.
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
        <p className="max-w-2xl text-[#444] leading-relaxed mb-6">
          Become a {v.role.toLowerCase()} in {data.name}, {data.region}. {v.angle} Partner with Taxi
          Saudi Arabia and get steady pre-booked trips instead of waiting for street hails.
        </p>

        <TLDRSummary
          answer={`${v.role}s in ${data.name} earn around ${salaryText}/month with Taxi Saudi Arabia. Demand is ${data.demand.toLowerCase()}. You need a valid Saudi license and a 2020+ vehicle (or join with our fleet) — apply online or on WhatsApp.`}
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

        <div className="mb-2">
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
