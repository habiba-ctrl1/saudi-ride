import Image from "next/image";
import Link from "next/link";
import { ALULA_IMG } from "@/lib/data/alula-images";
import { ArrowRight } from "lucide-react";
import { RED_SEA_NODES, RED_SEA_COMPARE, RSI_ALULA } from "@/lib/data/alula-cluster";
import { routeFact, reverseSlug } from "@/lib/data/cluster";

// Illustrative planning diagram — NOT a map. It shows which places are
// separate destinations and how a private transfer links them. Distances come
// from ROUTES_DATA via alula-cluster.ts; nothing here is to scale.
export function CrossDestinationDiagram() {
  const nodes = [RED_SEA_NODES[0], RED_SEA_NODES[1], RED_SEA_NODES[2]];
  return (
    <figure>
      <ol className="grid gap-0 lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:items-stretch">
        {nodes.map((n, i) => (
          <li key={n.id} className="contents">
            <Link
              href={n.href}
              className="group flex flex-col rounded-3xl border border-[#E5E7EB] bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#16A34A]/40 hover:shadow-[0_14px_30px_-20px_rgba(15,23,42,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A] focus-visible:ring-offset-2"
            >
              <span className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-[#15803D]">{n.sub}</span>
              <span className="mt-1 font-heading text-lg font-bold text-[#1C1C1C]">{n.title}</span>
              <span className="mt-2 flex-1 text-sm leading-relaxed text-[#4B5563]">{n.body}</span>
              <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#15803D]">
                {n.label} <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </span>
            </Link>
            {i < nodes.length - 1 && (
              <div className="flex items-center justify-center py-3 lg:px-3 lg:py-0" aria-hidden="true">
                <div className="flex flex-col items-center gap-1 lg:flex-row">
                  <span className="h-6 w-px bg-[#16A34A]/40 lg:h-px lg:w-8" />
                  <span className="rounded-full bg-[#F0FDF4] px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-[#15803D]">
                    {i === 0 ? `~${RSI_ALULA.km} km road` : "short coastal transfer"}
                  </span>
                  <span className="h-6 w-px bg-[#16A34A]/40 lg:h-px lg:w-8" />
                </div>
              </div>
            )}
          </li>
        ))}
      </ol>
      <figcaption className="mt-4 text-xs leading-relaxed text-[#6B7280]">
        Planning diagram, not a map or to scale. AlUla, Red Sea International Airport and the Shura Island / AMAALA resorts are three separate places. Road figures are routing estimates.
      </figcaption>
    </figure>
  );
}

export function DriveVsFlyTable() {
  return (
    <div className="overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white">
      <table className="w-full text-left text-sm">
        <caption className="sr-only">Private car or flight between the Red Sea and AlUla</caption>
        <thead className="hidden bg-[#F9FAFB] text-[0.7rem] uppercase tracking-[0.14em] text-[#6B7280] sm:table-header-group">
          <tr>
            <th scope="col" className="px-5 py-3 font-bold">&nbsp;</th>
            <th scope="col" className="px-5 py-3 font-bold">Private car</th>
            <th scope="col" className="px-5 py-3 font-bold">Flight</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E5E7EB]">
          {RED_SEA_COMPARE.map((r) => (
            <tr key={r.point} className="block p-4 sm:table-row sm:p-0">
              <th scope="row" className="block font-semibold text-[#1C1C1C] sm:table-cell sm:px-5 sm:py-4">{r.point}</th>
              <td className="block pt-1 text-[#4B5563] sm:table-cell sm:px-5 sm:py-4"><span className="mr-1 text-[0.65rem] font-bold uppercase tracking-wider text-[#9CA3AF] sm:hidden">Car:</span>{r.car}</td>
              <td className="block pt-1 text-[#4B5563] sm:table-cell sm:px-5 sm:py-4"><span className="mr-1 text-[0.65rem] font-bold uppercase tracking-wider text-[#9CA3AF] sm:hidden">Flight:</span>{r.fly}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Section injected on the RSI ↔ AlUla route pages.
export function RedSeaAlulaRouteSection() {
  return (
    <section aria-labelledby="red-sea-alula-heading" className="space-y-8">
      <div className="max-w-3xl">
        <p className="mb-3 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[#16A34A]">Two destinations, one transfer</p>
        <h2 id="red-sea-alula-heading" className="font-heading text-[1.6rem] font-bold leading-tight md:text-[2rem]">Combining the Red Sea with AlUla</h2>
        <p className="mt-3 text-[0.95rem] leading-relaxed text-[#4B5563]">
          AlUla is inland; Red Sea International Airport, Shura Island and AMAALA are on the coast. Travellers who stay at both need one planned leg between them — a private car runs it door to door.
        </p>
      </div>
      <figure className="overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white">
        <Image src={ALULA_IMG.road.src} alt={ALULA_IMG.road.alt} width={ALULA_IMG.road.w} height={ALULA_IMG.road.h} sizes="(min-width: 1024px) 1000px, 100vw" className="h-56 w-full object-cover sm:h-72" loading="lazy" />
        <figcaption className="px-4 py-3 text-xs text-[#6B7280]">{ALULA_IMG.road.caption}</figcaption>
      </figure>
      <CrossDestinationDiagram />
      <div>
        <h3 className="mb-3 font-heading text-lg font-bold">Drive or fly between them?</h3>
        <DriveVsFlyTable />
      </div>
    </section>
  );
}

// "Same journey, other direction + related AlUla routes" strip for every
// AlUla route page. Reverse link only renders when that route page exists.
const ALULA_SIBLINGS = [
  "alula-to-madinah", "madinah-to-alula", "alula-to-riyadh", "riyadh-to-alula", "alula-to-jeddah", "jeddah-to-alula",
  "alula-to-neom", "neom-to-alula", "alula-to-amaala", "amaala-to-alula", "alula-to-red-sea-airport", "red-sea-airport-to-alula",
];

export function AlulaRouteNav({ slug }: { slug: string }) {
  const rev = reverseSlug(slug);
  const reverse = rev ? routeFact(rev) : null;
  const siblings = ALULA_SIBLINGS.filter((s) => s !== slug && s !== rev)
    .map((s) => routeFact(s))
    .filter((f): f is NonNullable<typeof f> => f !== null)
    .slice(0, 6);
  return (
    <nav aria-label="More AlUla journeys" className="rounded-3xl border border-[#E5E7EB] bg-white p-6">
      {reverse && (
        <Link href={`/routes/${rev}`} className="group mb-5 flex items-center justify-between gap-3 rounded-2xl bg-[#F0FDF4] p-4 text-sm font-semibold text-[#15803D] hover:bg-[#DCFCE7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A]">
          Travelling the other way? {reverse.from} → {reverse.to} ({reverse.km.toLocaleString("en-US")} km)
          <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      )}
      <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[#16A34A]">More from AlUla</p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {siblings.map((f) => (
          <li key={f.slug}>
            <Link href={`/routes/${f.slug}`} className="inline-flex min-h-[36px] items-center rounded-full border border-[#E5E7EB] px-3.5 text-xs font-semibold text-[#374151] transition-colors hover:border-[#16A34A]/40 hover:text-[#15803D]">
              {f.from} → {f.to}
            </Link>
          </li>
        ))}
        <li>
          <Link href="/locations/alula" className="inline-flex min-h-[36px] items-center rounded-full bg-[#16A34A] px-3.5 text-xs font-bold uppercase tracking-wider text-[#FFFFFF] hover:bg-[#15803D]">
            AlUla private transport hub
          </Link>
        </li>
      </ul>
    </nav>
  );
}
