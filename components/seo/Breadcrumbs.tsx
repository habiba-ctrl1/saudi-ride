import Link from "next/link";
import { ChevronRight } from "lucide-react";
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
        <ol className="flex flex-wrap items-center gap-1.5 text-xs text-[#7C8088]">
          {items.map((item, i) => {
            const isLast = i === items.length - 1;
            return (
              <li key={item.href} className="flex items-center gap-1.5">
                {isLast ? (
                  <span className="text-[#C9A84C] font-medium" aria-current="page">
                    {item.name}
                  </span>
                ) : (
                  <>
                    <Link href={item.href} className="hover:text-[#C9A84C] transition-colors">
                      {item.name}
                    </Link>
                    <ChevronRight className="h-3 w-3 text-[#7C8088]/60" />
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
