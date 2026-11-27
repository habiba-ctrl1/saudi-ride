import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ROUTES_DATA } from "@/lib/data/routes";
import { AR_ALULA_ROUTE_SLUGS } from "@/lib/data/routes-content-ar-alula";
import { AR_ROUTE_CONTENT_SLUGS } from "@/lib/data/routes-content-ar";

// شريط روابط رحلات العلا (الاتجاه المعاكس + رحلات مرتبطة + صفحة العلا الرئيسية).
export function AlulaRouteNavAr({ slug }: { slug: string }) {
  const m = slug.match(/^(.+)-to-(.+)$/);
  const rev = m ? `${m[2]}-to-${m[1]}` : null;
  const live = (s: string) => AR_ROUTE_CONTENT_SLUGS.includes(s) && ROUTES_DATA.some((r) => r.slug === s);
  const reverse = rev && live(rev) ? ROUTES_DATA.find((r) => r.slug === rev)! : null;
  const siblings = AR_ALULA_ROUTE_SLUGS.filter((s) => s !== slug && s !== rev && live(s)).slice(0, 6).map((s) => ROUTES_DATA.find((r) => r.slug === s)!);
  return (
    <nav aria-label="رحلات أخرى من العلا" className="section-container max-w-4xl py-10 border-t border-[#C9A84C]/10 text-right">
      {reverse && (
        <Link href={`/ar/routes/${reverse.slug}`} className="group mb-5 flex items-center justify-between gap-3 rounded-2xl bg-[#F0FDF4] p-4 text-sm font-semibold text-[#15803D] hover:bg-[#DCFCE7]">
          هل تسافر بالاتجاه المعاكس؟ {reverse.fromCityAr} ← {reverse.toCityAr} ({reverse.distance.toLocaleString("en-US")} كم)
          <ArrowLeft className="h-4 w-4 shrink-0 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
        </Link>
      )}
      <p className="text-[0.7rem] font-bold text-[#16A34A]">المزيد من رحلات العلا</p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {siblings.map((r) => (
          <li key={r.slug}>
            <Link href={`/ar/routes/${r.slug}`} className="inline-flex min-h-[36px] items-center rounded-full border border-[#E5E7EB] px-3.5 text-xs font-semibold text-[#374151] hover:border-[#16A34A]/40 hover:text-[#15803D]">
              {r.fromCityAr} ← {r.toCityAr}
            </Link>
          </li>
        ))}
        <li>
          <Link href="/ar/locations/alula" className="inline-flex min-h-[36px] items-center rounded-full bg-[#16A34A] px-3.5 text-xs font-bold text-[#FFFFFF] hover:bg-[#15803D]">
            النقل الخاص في العلا
          </Link>
        </li>
      </ul>
    </nav>
  );
}
