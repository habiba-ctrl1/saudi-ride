import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageCircle, Users } from "lucide-react";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { contactConfig } from "@/lib/config/contact";
import { GMC_CITY_COPY, GMC_QUOTE_FACTORS, type GmcCity } from "@/lib/data/gmc-cities";
import { SectionHeader, wa } from "./ui";

// Featured premium SUV block for the city hubs. Capacity, luggage, model year
// and trim are deliberately NOT stated: facts.md confirms only "GMC Yukon XL /
// Denali" as a partner-network vehicle. {{TODO}} partner-confirmed capacity,
// model years and trims, and a real photo per city.
export function GmcSection({ city }: { city: GmcCity }) {
  const c = GMC_CITY_COPY[city];
  const href = wa(c.waPrefill);
  return (
    <section id="gmc" aria-labelledby="gmc-heading" className="scroll-mt-24">
      <SectionHeader id="gmc-heading" eyebrow="Featured vehicle" title={c.heading} intro={c.intro} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="overflow-hidden rounded-[2rem] border border-[#E5E7EB] bg-white">
          <div className="relative aspect-[4/3] bg-[#F3F4F6]">
            <Image
              src="/fleet/gmc-yukon-xl.webp"
              alt="GMC Yukon XL full-size SUV available through the partner network"
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
              loading="lazy"
            />
          </div>
          <div className="space-y-4 p-6">
            <p className="flex items-start gap-2 text-sm leading-relaxed text-[#4B5563]">
              <Users className="mt-0.5 h-4 w-4 shrink-0 text-[#16A34A]" aria-hidden="true" />
              Passenger and luggage capacity is confirmed against your party when we quote. Other SUVs, executive sedans and vans are available through the same partner network.
            </p>
            <TrackedLink
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              kind="whatsapp"
              sourceLocation={`gmc_section_${city}`}
              contactUsed={contactConfig.whatsappNumber}
              path={c.path}
              routeId={`gmc_${city}`}
              className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-[#16A34A] px-6 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#15803D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A] focus-visible:ring-offset-2"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" /> Request a GMC quote on WhatsApp
            </TrackedLink>
          </div>
        </div>
        <div className="space-y-6">
          <ul className="grid gap-3 sm:grid-cols-2">
            {c.useCases.map((u) => (
              <li key={u.title} className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
                <h3 className="font-heading text-[0.95rem] font-bold text-[#1C1C1C]">{u.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-[#4B5563]">{u.text}</p>
              </li>
            ))}
          </ul>
          <div className="rounded-2xl border border-[#FACC15]/40 bg-[#FFFBEB] p-5">
            <h3 className="font-heading text-[0.95rem] font-bold text-[#1C1C1C]">When a GMC is not the right fit</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-[#4B5563]">{c.alternative}</p>
          </div>
          <div>
            <h3 className="font-heading text-[0.95rem] font-bold text-[#1C1C1C]">What your quotation depends on</h3>
            <ul className="mt-2 grid gap-x-6 gap-y-1 text-sm text-[#4B5563] sm:grid-cols-2">
              {GMC_QUOTE_FACTORS.map((f) => (
                <li key={f} className="before:mr-2 before:text-[#16A34A] before:content-['•']">{f}</li>
              ))}
            </ul>
            <p className="mt-2 text-sm text-[#6B7280]">We quote each trip individually; the fare is agreed before you book.</p>
          </div>
          <ul className="flex flex-wrap gap-2">
            {c.links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-[#16A34A]/30 px-4 text-xs font-bold text-[#15803D] hover:bg-[#F0FDF4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A]">
                  {l.label} <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
