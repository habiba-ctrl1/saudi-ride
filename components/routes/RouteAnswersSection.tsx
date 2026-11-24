import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ROUTE_ANSWERS } from "@/lib/data/route-answers";

/** Bespoke, query-led answers for a route. Renders nothing when the route has none. */
export function RouteAnswersSection({ slug }: { slug: string }) {
  const data = ROUTE_ANSWERS[slug];
  if (!data) return null;
  return (
    <section className="max-w-3xl" aria-labelledby="route-answers">
      <h2 id="route-answers" className="font-heading text-2xl font-bold mb-3 text-[#1C1C1C]">{data.heading}</h2>
      <p className="text-sm leading-relaxed text-[#374151]">{data.intro}</p>
      {data.table && (
        <table className="mt-5 w-full border-collapse text-sm">
          <caption className="mb-2 text-start text-xs text-[#6B7280]">{data.table.caption}</caption>
          <thead>
            <tr className="border-b border-[#16A34A]/25 text-start">
              <th scope="col" className="py-2 pe-4 text-start font-bold">From and to</th>
              <th scope="col" className="py-2 text-end font-bold">By road</th>
            </tr>
          </thead>
          <tbody>
            {data.table.rows.map((r) => (
              <tr key={r.label} className="border-b border-[#16A34A]/12">
                <th scope="row" className="py-2.5 pe-4 text-start font-normal text-[#374151]">{r.label}</th>
                <td className="whitespace-nowrap py-2.5 text-end font-semibold">about {r.km} km</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="mt-6 space-y-5">
        {data.qa.map((x) => (
          <div key={x.q}>
            <h3 className="mb-1 text-base font-bold text-[#1C1C1C]">{x.q}</h3>
            <p className="text-sm leading-relaxed text-[#374151]">{x.a}</p>
          </div>
        ))}
      </div>
      <ul className="mt-6 flex flex-wrap gap-2">
        {data.links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="chip min-h-[44px]">
              <ArrowRight className="rtl:-scale-x-100" />
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
