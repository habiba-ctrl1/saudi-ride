import Link from "next/link";
import Image from "next/image";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "./Reveal";

export interface RelatedItem {
  label: string;
  href: string;
  /** Optional sub-line, e.g. a route's distance or a service one-liner. Never
   *  fabricate — pass only real data. */
  meta?: string;
  icon?: LucideIcon;
  /** Optional image for destination-style cards. */
  image?: string;
}

/**
 * Visual internal-linking grid — turns a list of related routes / services /
 * destinations into scannable interactive cards instead of a paragraph of
 * links. Three presets share one hover language (lift + arrow slide + border
 * warm). Use real, contextually-relevant links only; this is UX first, SEO
 * second.
 *
 *  variant="link"        compact icon + label + arrow (services, routes)
 *  variant="route"       origin→destination style label with meta sub-line
 *  variant="destination" image-led card (cities / locations)
 */
export function RelatedGrid({
  heading,
  intro,
  items,
  variant = "link",
  columns = 3,
}: {
  heading?: string;
  intro?: string;
  items: RelatedItem[];
  variant?: "link" | "route" | "destination";
  columns?: 2 | 3 | 4;
}) {
  const colCls =
    columns === 4
      ? "sm:grid-cols-2 lg:grid-cols-4"
      : columns === 2
        ? "sm:grid-cols-2"
        : "sm:grid-cols-2 lg:grid-cols-3";

  return (
    <div>
      {heading && (
        <Reveal className="mb-8 max-w-2xl">
          <h2 className="text-section-title text-[#0F172A]">{heading}</h2>
          {intro && <p className="mt-3 text-body-lg text-[#6B7280]">{intro}</p>}
        </Reveal>
      )}
      <RevealGroup className={`grid grid-cols-1 gap-4 ${colCls}`}>
        {items.map((item) => (
          <RevealItem key={item.href}>
            {variant === "destination" ? (
              <DestinationCard item={item} />
            ) : (
              <LinkCard item={item} isRoute={variant === "route"} />
            )}
          </RevealItem>
        ))}
      </RevealGroup>
    </div>
  );
}

function LinkCard({ item, isRoute }: { item: RelatedItem; isRoute: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className="group flex h-full items-center gap-4 rounded-2xl border border-[#16A34A]/12 bg-white p-5 transition-all duration-200 hover:-translate-y-1 hover:border-[#16A34A]/35 hover:shadow-[0_14px_40px_rgba(22,163,74,0.1)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#16A34A]/20"
    >
      {Icon && (
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#16A34A]/10 text-[#16A34A] transition-colors group-hover:bg-[#16A34A] group-hover:text-white">
          <Icon className="h-5 w-5" />
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className={`block truncate font-bold text-[#0F172A] ${isRoute ? "text-[0.95rem]" : "text-sm"}`}>
          {item.label}
        </span>
        {item.meta && <span className="mt-0.5 block truncate text-xs text-[#6B7280]">{item.meta}</span>}
      </span>
      <ArrowRight className="h-4 w-4 shrink-0 text-[#16A34A] transition-transform duration-200 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
    </Link>
  );
}

function DestinationCard({ item }: { item: RelatedItem }) {
  return (
    <Link
      href={item.href}
      className="group relative block aspect-[4/3] overflow-hidden rounded-2xl border border-[#16A34A]/12 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#16A34A]/20"
    >
      {item.image && (
        <Image
          src={item.image}
          alt={item.label}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4">
        <span>
          <span className="block font-heading text-lg font-bold text-white">{item.label}</span>
          {item.meta && <span className="mt-0.5 block text-xs text-white/80">{item.meta}</span>}
        </span>
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-colors group-hover:bg-[#16A34A]">
          <ArrowRight className="h-4 w-4 rtl:rotate-180" />
        </span>
      </div>
    </Link>
  );
}
