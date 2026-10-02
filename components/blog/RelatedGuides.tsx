"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, ArrowRight } from "lucide-react";
import { BLOG_INBOUND } from "@/lib/data/blog/inbound";

// "Travel guides" strip rendered at the end of commercial pages (via the
// (marketing), /fleet and /pricing layouts). Renders nothing unless the
// current path has an entry in BLOG_INBOUND. Server-rendered on first paint
// (usePathname works during SSR), so the links are crawlable.
export function RelatedGuides() {
  const pathname = usePathname();
  const links = pathname ? BLOG_INBOUND[pathname.replace(/\/$/, "")] : undefined;
  if (!links?.length) return null;

  return (
    <section aria-labelledby="related-guides-h" className="bg-[#FAFAF7] pb-14 pt-4">
      <div className="section-container max-w-6xl">
        <div className="rounded-3xl border border-[#0F172A]/[0.07] bg-white p-6 md:p-8">
          <h2 id="related-guides-h" className="flex items-center gap-2 font-heading text-lg font-bold text-[#0F172A]">
            <BookOpen className="h-5 w-5 text-[#16A34A]" aria-hidden /> {pathname?.startsWith("/services/car-recovery") ? "Car recovery guides" : "Travel guides for this trip"}
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="group flex min-h-12 items-center justify-between gap-3 rounded-xl border border-[#0F172A]/[0.08] px-4 py-3 text-sm font-semibold text-[#0F172A] transition-colors hover:border-[#16A34A]/40 hover:text-[#15803D]"
                >
                  {l.label}
                  <ArrowRight className="h-4 w-4 shrink-0 text-[#16A34A] transition-transform group-hover:translate-x-0.5" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
