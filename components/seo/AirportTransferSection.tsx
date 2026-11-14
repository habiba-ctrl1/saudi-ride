"use client";

import { MessageCircle, PlaneLanding, Info } from "lucide-react";
import { contactConfig } from "@/lib/config/contact";
import { trackEvent } from "@/lib/analytics";
import type { AirportView } from "@/lib/data/riyadh-airport-view";

/**
 * Airport-intent section for the existing Riyadh → DOH / KWI / BAH / DMM route
 * pages. One shared layout, bespoke copy per route (lib/data/riyadh-airport-intent.ts).
 * The WhatsApp CTA reuses the configured business number and fires the
 * established `whatsapp_click` event with a route identifier only.
 */
export function AirportTransferSection({ data, path, quoteAnchor, locale = "en" }: { data: AirportView; path: string; quoteAnchor?: string; locale?: "en" | "ar" }) {
  const ar = locale === "ar";
  const href = `https://wa.me/${contactConfig.whatsappNumber}?text=${encodeURIComponent(data.waText)}`;
  const id = `airport-${data.code.toLowerCase()}`;

  return (
    <section id={id} dir={ar ? "rtl" : undefined} lang={ar ? "ar" : undefined} aria-labelledby={`${id}-h`} className="scroll-mt-24 rounded-3xl border border-[#16A34A]/20 bg-white p-6 sm:p-8">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F0FDF4] px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-[#166534]">
        <PlaneLanding className="h-3.5 w-3.5" aria-hidden /> {ar ? `النزول عند المطار · ${data.code}` : `Airport drop-off · ${data.code}`}
      </span>
      <h2 id={`${id}-h`} className="font-heading mt-3 text-2xl font-bold sm:text-3xl">{data.heading}</h2>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-[#475569]" style={{ maxWidth: "70ch" }}>{data.answer}</p>

      <h3 className="font-heading mt-6 text-lg font-bold">{ar ? "مدينة أم مطار؟ حدد نقطة النزول التي تحتاجها" : "City or airport? Say which drop-off you need"}</h3>
      <ul className="mt-3 grid gap-3 sm:grid-cols-2">
        {data.distinctions.map((d) => (
          <li key={d.name} className="rounded-2xl border border-[#16A34A]/12 bg-[#FAFAF7] p-4">
            <p className="text-sm font-semibold text-[#1C1C1C]">{d.name}</p>
            <p className="mt-1 text-sm leading-relaxed text-[#475569]">{d.desc}</p>
          </li>
        ))}
      </ul>

      <h3 className="font-heading mt-6 text-lg font-bold">{ar ? "ما الذي ترسله مع طلب السعر" : "What to send with your quote request"}</h3>
      <ul className="mt-3 space-y-2">
        {data.askFor.map((a) => (
          <li key={a} className="flex gap-2 text-sm leading-relaxed text-[#475569]">
            <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#16A34A]" /> {a}
          </li>
        ))}
      </ul>

      <h3 className="font-heading mt-6 text-lg font-bold">{data.tradeOff.heading}</h3>
      <div className="mt-2 space-y-3 text-[0.95rem] leading-relaxed text-[#475569]" style={{ maxWidth: "70ch" }}>
        {data.tradeOff.body.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>

      {data.entryNote && (
        <p className="mt-5 flex gap-2 rounded-2xl border border-[#FACC15]/40 bg-[#FEFCE8] p-4 text-sm leading-relaxed text-[#475569]">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#A16207]" aria-hidden /> {data.entryNote}
        </p>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            trackEvent("whatsapp_click", {
              sourceLocation: `airport_section_${data.routeId}`,
              phoneUsed: contactConfig.whatsappNumber,
              locale,
              path,
              routeId: data.routeId,
            })
          }
          className="btn btn-whatsapp btn-lg"
        >
          <MessageCircle className="h-4 w-4" aria-hidden /> {data.cta}
        </a>
        {quoteAnchor && (
          <a href={quoteAnchor} className="text-sm font-semibold text-[#166534] underline-offset-2 hover:underline">
            {ar ? "أو استخدم نموذج طلب السعر" : "Or use the quote form"}
          </a>
        )}
      </div>
      <p className="mt-3 text-xs text-[#6B7280]">
        {ar ? "يُؤكد السعر قبل الحجز. إن تعذر فتح واتساب فاتصل أو راسلنا:" : "The fare is quoted and confirmed before you book. Call or email if WhatsApp will not open:"}{" "}
        <a href={contactConfig.primaryPhoneLink} className="underline" dir="ltr">{contactConfig.primaryPhoneDisplay}</a> ·{" "}
        <a href={`mailto:${contactConfig.email}`} className="underline">{contactConfig.email}</a>
      </p>
    </section>
  );
}
