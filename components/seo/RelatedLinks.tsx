import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Ontology-based internal linking block. Drop it at the bottom of any page to link
// same-city / same-service / same-intent pages — spreads link equity and keeps
// crawlers moving through the topical cluster. Use for "Related Routes",
// "Other Cities", "Related Services", etc. Server component.
//
//   <RelatedLinks
//     title="Popular Routes"
//     links={[{ name: "Jeddah Airport to Makkah", href: "/routes/jeddah-airport-to-makkah" }, ...]}
//   />
//
// Visual: the first link is promoted to a wide "featured" tile when there are
// enough links to justify it; the rest are compact link cards with a sliding
// arrow — so the block reads as navigation, not a list of text links.
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
  const featured = links.length >= 4 ? links[0] : null;
  const rest = featured ? links.slice(1) : links;

  return (
    <section className={`section-container max-w-7xl py-12 md:py-16 ${className}`}>
      <div className="mb-6 flex items-end justify-between gap-4">
        <h2 className="t-h2 !text-[clamp(1.4rem,2.4vw,1.9rem)]">{title}</h2>
        <span aria-hidden className="hidden h-px flex-1 translate-y-[-0.6rem] bg-gradient-to-r from-[#16A34A]/25 to-transparent sm:block rtl:bg-gradient-to-l" />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3" data-stagger>
        {featured && (
          <Link
            href={featured.href}
            className="no-lift group relative flex min-h-[8.5rem] flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-[#16A34A] to-[#166534] p-5 text-[#FFFFFF] shadow-[0_14px_34px_-18px_rgba(22,163,74,0.8)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_44px_-18px_rgba(22,163,74,0.9)] sm:row-span-2"
          >
            <span aria-hidden className="absolute -end-10 -top-10 h-36 w-36 rounded-full bg-[#FACC15]/20 blur-2xl transition-transform duration-500 group-hover:scale-125" />
            <span className="relative text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[#FEF08A]">Featured</span>
            <span className="relative">
              <span className="block font-heading text-lg font-extrabold leading-snug text-[#FFFFFF]">{featured.name}</span>
              {featured.note && <span className="mt-1 block text-xs text-white/80">{featured.note}</span>}
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-[#FACC15]">
                Explore <ArrowRight className="h-4 w-4 rtl:-scale-x-100" />
              </span>
            </span>
          </Link>
        )}
        {rest.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="no-lift group flex items-center justify-between gap-3 rounded-2xl border border-[#0F172A]/[0.08] bg-white px-4 py-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#16A34A]/40 hover:shadow-[0_12px_28px_-16px_rgba(22,163,74,0.55)]"
          >
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold text-[#0F172A] transition-colors group-hover:text-[#15803D]">
                {link.name}
              </span>
              {link.note && <span className="mt-0.5 block truncate text-xs text-[#64748B]">{link.note}</span>}
            </span>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F0FDF4] text-[#16A34A] transition-colors group-hover:bg-[#16A34A] group-hover:text-[#FFFFFF]">
              <ArrowRight className="h-4 w-4 rtl:-scale-x-100" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
