import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { JsonLd } from "./JsonLd";
import { breadcrumbSchema, type Crumb } from "@/lib/schema";

// Visible breadcrumb trail + matching BreadcrumbList JSON-LD.
// Pass the full trail including Home and the current page, e.g.
//   <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Services", href: "/services" }, { name: "Umrah Taxi", href: "/services/umrah-transport" }]} />
export function Breadcrumbs({ items, className = "" }: { items: Crumb[]; className?: string }) {
  if (!items?.length) return null;

  return (
    <>
      <JsonLd data={breadcrumbSchema(items)} />
      <nav
        aria-label="Breadcrumb"
        className={`section-container max-w-7xl pt-24 pb-2 ${className}`}
      >
        <ol className="flex min-w-0 flex-wrap items-center gap-x-1 gap-y-1 text-[0.8rem] text-[#64748B]">
          {items.map((item, i) => {
            const isLast = i === items.length - 1;
            return (
              <li key={item.href} className="flex min-w-0 items-center gap-1">
                {isLast ? (
                  <span className="max-w-[16rem] truncate rounded-full bg-[#16A34A]/[0.08] px-2.5 py-1 font-semibold text-[#15803D] sm:max-w-none" aria-current="page">
                    {item.name}
                  </span>
                ) : (
                  <>
                    <Link href={item.href} className="inline-flex items-center gap-1 rounded-full px-1.5 py-1 font-medium transition-colors hover:bg-[#16A34A]/[0.06] hover:text-[#15803D]">
                      {i === 0 && <Home className="h-3.5 w-3.5" aria-hidden />}
                      {item.name}
                    </Link>
                    <ChevronRight className="rtl:-scale-x-100 h-3.5 w-3.5 shrink-0 text-[#94A3B8]" aria-hidden />
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
