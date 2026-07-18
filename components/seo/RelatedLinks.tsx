import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Ontology-based internal linking block. Drop it at the bottom of any page to link
// same-city / same-service / same-intent pages — spreads link equity and keeps
// crawlers moving through the topical cluster. Use for "Related Routes",
// "Other Cities", "Related Services", etc. Server component.
//
//   <RelatedLinks
//     title="Driver Jobs in Other Cities"
//     links={[{ name: "Driver Jobs in Jeddah", href: "/driver-jobs/jeddah" }, ...]}
//   />
export interface RelatedLink {
  name: string;
  href: string;
  note?: string;
}

export function RelatedLinks({
  title,
  links,
  className = "",
}: {
  title: string;
  links: RelatedLink[];
  className?: string;
}) {
  if (!links?.length) return null;

  return (
    <section className={`section-container max-w-7xl py-10 ${className}`}>
      <h2 className="text-xl sm:text-2xl font-bold text-[#1C1C1C] mb-5">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group flex items-center justify-between gap-3 rounded-xl border border-black/8 bg-white px-4 py-3 transition-colors hover:border-[#006C35]/40 hover:bg-[#006C35]/5"
          >
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium text-[#1C1C1C] group-hover:text-[#006C35]">
                {link.name}
              </span>
              {link.note && (
                <span className="block truncate text-xs text-[#6B7280]">{link.note}</span>
              )}
            </span>
            <ArrowRight className="h-4 w-4 flex-shrink-0 text-[#C9A84C] transition-transform group-hover:translate-x-0.5" />
          </Link>
        ))}
      </div>
    </section>
  );
}
