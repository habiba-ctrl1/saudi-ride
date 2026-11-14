import Link from "next/link";
import { ArrowRight, Car, Route as RouteIcon, MapPin } from "lucide-react";

// Dark-themed contextual internal-linking block for the service pages.
// Renders related services, popular routes, and top city pages with
// descriptive anchor text. `currentPath` removes the current page from
// the services column so links stay relevant. Server component.
const SERVICES: { href: string; label: string }[] = [
  { href: "/services/airport-transfers", label: "Airport transfer taxi service" },
  { href: "/services/intercity", label: "Intercity taxi between cities" },
  { href: "/services/long-distance", label: "Long distance intercity transfers" },
  { href: "/services/hotel-transfers", label: "Hotel-to-hotel & airport transfers" },
  { href: "/services/car-recovery", label: "Car recovery & tow truck (satha)" },
  { href: "/services/umrah-transport", label: "Umrah transport service" },
  { href: "/services/makkah-ziyarat", label: "Makkah Ziyarat tours by car" },
  { href: "/services/madinah-ziyarat", label: "Madinah Ziyarat tours by car" },
  { href: "/services/taif-ziyarat", label: "Taif Ziyarat & mountain day trip" },
  { href: "/services/badr-ziyarat", label: "Badr battlefield Ziyarat tour" },
  { href: "/services/corporate", label: "Corporate & business travel" },
  { href: "/services/vip-transportation", label: "VIP transportation Riyadh" },
  { href: "/services/wedding-car-rental", label: "Wedding car rental & bridal cars" },
  { href: "/services/border-crossings", label: "GCC border-crossing taxi" },
  { href: "/services/corporate-bahrain-transport", label: "Corporate Bahrain transport (B2B)" },
];

const ROUTES: { href: string; label: string }[] = [
  { href: "/routes/jeddah-airport-to-makkah", label: "Jeddah Airport to Makkah taxi" },
  { href: "/routes/makkah-to-madinah", label: "Makkah to Madinah taxi" },
  { href: "/routes/jeddah-to-madinah", label: "Jeddah to Madinah taxi" },
  { href: "/routes/madinah-to-makkah", label: "Madinah to Makkah taxi" },
  { href: "/routes/riyadh-to-dammam", label: "Riyadh to Dammam taxi" },
  { href: "/routes/makkah-to-taif", label: "Makkah to Taif taxi" },
  { href: "/routes/dammam-to-doha", label: "Dammam to Doha cross-border taxi" },
  { href: "/routes/riyadh-to-neom", label: "Riyadh to NEOM taxi" },
];

const CITIES: { href: string; label: string }[] = [
  { href: "/locations/makkah", label: "Makkah taxi service" },
  { href: "/locations/madinah", label: "Madinah taxi service" },
  { href: "/locations/jeddah", label: "Jeddah chauffeur service" },
  { href: "/locations/riyadh", label: "Riyadh taxi service" },
  { href: "/locations/dammam", label: "Dammam taxi service" },
  { href: "/locations/taif", label: "Taif chauffeur service" },
  { href: "/locations/tabuk", label: "Tabuk taxi & chauffeur service" },
];

function LinkColumn({
  title,
  icon: Icon,
  links,
  accent = false,
}: {
  title: string;
  icon: typeof Car;
  links: { href: string; label: string }[];
  accent?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl p-6 sm:p-7 ${
        accent
          ? "bg-gradient-to-br from-[#16A34A] to-[#166534] text-[#FFFFFF] shadow-[0_20px_44px_-24px_rgba(22,163,74,0.9)]"
          : "border border-[#0F172A]/[0.07] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
      }`}
    >
      {accent && <span aria-hidden className="absolute -end-12 -top-12 h-40 w-40 rounded-full bg-[#FACC15]/20 blur-2xl" />}
      <h3 className={`relative mb-4 flex items-center gap-3 font-heading text-lg font-bold ${accent ? "!text-[#FFFFFF]" : "text-[#0F172A]"}`}>
        <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${accent ? "bg-white/15 text-[#FACC15]" : "bg-[#F0FDF4] text-[#16A34A]"}`}>
          <Icon className="h-5 w-5" />
        </span>
        {title}
      </h3>
      <ul className="relative">
        {links.map((l) => (
          <li key={l.href} className={`border-t first:border-t-0 ${accent ? "border-white/15" : "border-[#0F172A]/[0.06]"}`}>
            <Link
              href={l.href}
              className={`group flex items-center justify-between gap-3 py-2.5 text-sm font-medium transition-colors ${
                accent ? "text-white/85 hover:text-[#FACC15]" : "text-[#334155] hover:text-[#15803D]"
              }`}
            >
              <span>{l.label}</span>
              <ArrowRight
                className={`h-3.5 w-3.5 shrink-0 opacity-50 transition-all group-hover:opacity-100 rtl:-scale-x-100 ${accent ? "" : "text-[#16A34A]"}`}
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ServiceRelatedLinks({ currentPath }: { currentPath?: string }) {
  const services = SERVICES.filter((s) => s.href !== currentPath).slice(0, 8);

  return (
    <section className="section-container max-w-7xl py-16 md:py-24">
      <div className="section-head is-center mb-10 md:mb-12">
        <span className="t-eyebrow">Keep exploring</span>
        <h2 className="t-h2">Explore More Taxi Services</h2>
        <p className="t-lead">
          Discover related services, popular routes, and city taxi pages across Saudi Arabia — or{" "}
          <Link href="/book" className="font-semibold text-[#15803D] underline decoration-[#16A34A]/30 underline-offset-4 hover:decoration-[#16A34A]">book your transfer now</Link>.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3" data-stagger>
        <LinkColumn title="Related Services" icon={Car} links={services} />
        <LinkColumn title="Popular Routes" icon={RouteIcon} links={ROUTES} accent />
        <LinkColumn title="Taxi by City" icon={MapPin} links={CITIES} />
      </div>

      <div className="mt-10 text-center">
        <Link href="/contact" className="btn btn-ghost btn-sm">
          Need help planning? Contact our team <ArrowRight className="rtl:-scale-x-100" />
        </Link>
      </div>
    </section>
  );
}
