import Link from "next/link";
import { ArrowRight, Car, Route as RouteIcon, MapPin } from "lucide-react";

// Dark-themed contextual internal-linking block for the service pages.
// Renders related services, popular routes, and top city pages with
// descriptive anchor text. `currentPath` removes the current page from
// the services column so links stay relevant. Server component.
const SERVICES: { href: string; label: string }[] = [
  { href: "/services/airport-transfers", label: "Airport transfer taxi service" },
  { href: "/services/intercity", label: "Intercity taxi between cities" },
  { href: "/services/car-recovery", label: "Car recovery & tow truck (satha)" },
  { href: "/services/umrah-transport", label: "Umrah transport service" },
  { href: "/services/makkah-ziyarat", label: "Makkah Ziyarat tours by car" },
  { href: "/services/madinah-ziyarat", label: "Madinah Ziyarat tours by car" },
  { href: "/services/corporate", label: "Corporate & business travel" },
  { href: "/services/vip-luxury", label: "VIP & luxury car service" },
  { href: "/services/border-crossings", label: "GCC border-crossing taxi" },
];

const ROUTES: { href: string; label: string }[] = [
  { href: "/routes/jeddah-airport-to-makkah", label: "Jeddah Airport to Makkah taxi" },
  { href: "/routes/makkah-to-madinah", label: "Makkah to Madinah taxi" },
  { href: "/routes/jeddah-to-madinah", label: "Jeddah to Madinah taxi" },
  { href: "/routes/madinah-to-makkah", label: "Madinah to Makkah taxi" },
  { href: "/routes/riyadh-to-dammam", label: "Riyadh to Dammam taxi" },
  { href: "/routes/makkah-to-taif", label: "Makkah to Taif taxi" },
];

const CITIES: { href: string; label: string }[] = [
  { href: "/locations/makkah", label: "Makkah taxi service" },
  { href: "/locations/madinah", label: "Madinah taxi service" },
  { href: "/locations/jeddah", label: "Jeddah taxi service" },
  { href: "/locations/riyadh", label: "Riyadh taxi service" },
  { href: "/locations/dammam", label: "Dammam taxi service" },
  { href: "/locations/taif", label: "Taif taxi service" },
];

function LinkColumn({
  title,
  icon: Icon,
  links,
}: {
  title: string;
  icon: typeof Car;
  links: { href: string; label: string }[];
}) {
  return (
    <div className="bg-white border border-[#16A34A]/12 rounded-3xl p-7">
      <h3 className="font-heading text-lg font-bold text-[#1C1C1C] mb-5 flex items-center gap-2.5">
        <Icon className="h-5 w-5 text-[#C9A84C]" />
        {title}
      </h3>
      <ul className="space-y-3">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="group inline-flex items-start gap-2 text-sm text-[#6B7280] hover:text-[#16A34A] transition-colors"
            >
              <ArrowRight className="h-3.5 w-3.5 mt-0.5 shrink-0 text-[#C9A84C]/60 group-hover:text-[#16A34A] transition-colors" />
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ServiceRelatedLinks({ currentPath }: { currentPath?: string }) {
  const services = SERVICES.filter((s) => s.href !== currentPath).slice(0, 6);

  return (
    <section className="section-container max-w-7xl py-20 border-t border-[#C9A84C]/10">
      <div className="text-center mb-14">
        <h2 className="font-heading text-3xl font-bold mb-3 text-[#1C1C1C]">Explore More Taxi Services</h2>
        <p className="text-[#6B7280] text-sm max-w-2xl mx-auto">
          Discover related services, popular routes, and city taxi pages across Saudi Arabia — or{" "}
          <Link href="/book" className="text-[#16A34A] hover:underline">book your transfer now</Link>.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <LinkColumn title="Related Services" icon={Car} links={services} />
        <LinkColumn title="Popular Routes" icon={RouteIcon} links={ROUTES} />
        <LinkColumn title="Taxi by City" icon={MapPin} links={CITIES} />
      </div>

      <div className="mt-10 text-center">
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#6B7280] hover:text-[#16A34A] transition-colors"
        >
          Need help planning? Contact our team <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
