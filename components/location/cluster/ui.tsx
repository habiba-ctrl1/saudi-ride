import Link from "next/link";
import { ArrowRight, ChevronDown, MessageCircle, Mail, ShieldCheck } from "lucide-react";
import WhatsAppQuoteForm from "@/components/booking/WhatsAppQuoteForm";
import { contactConfig } from "@/lib/config/contact";

// Shared building blocks for the city cluster hubs and its child pages. Server
// components only — interactive pieces live in their own client files.

export const wa = (text: string) => `${contactConfig.whatsappLink}?text=${encodeURIComponent(text)}`;

export function SectionHeader({ eyebrow, title, intro, id, tone = "light", align = "left" }: { eyebrow: string; title: string; intro?: string; id?: string; tone?: "light" | "dark"; align?: "left" | "center" }) {
  const dark = tone === "dark";
  return (
    <div className={`mb-8 md:mb-10 ${align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-3xl"}`}>
      <p className={`mb-3 text-[0.7rem] font-bold uppercase tracking-[0.2em] ${dark ? "text-[#FACC15]" : "text-[#16A34A]"}`}>{eyebrow}</p>
      <h2 id={id} className={`font-heading text-[1.75rem] font-bold leading-tight md:text-[2.25rem] ${dark ? "text-[#FFFFFF]" : "text-[#1C1C1C]"}`}>{title}</h2>
      {intro && <p className={`mt-3 text-[0.95rem] leading-relaxed ${dark ? "text-white/70" : "text-[#6B7280]"}`}>{intro}</p>}
    </div>
  );
}

export function FactsStrip({ facts }: { facts: { label: string; value: string }[] }) {
  return (
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-[#16A34A]/15 bg-[#16A34A]/15 md:grid-cols-4">
      {facts.map((f) => (
        <div key={f.label} className="bg-white p-4 md:p-5">
          <dt className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-[#15803D]">{f.label}</dt>
          <dd className="mt-1.5 text-[0.85rem] font-semibold leading-snug text-[#1C1C1C]">{f.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function FaqList({ faqs }: { faqs: { question: string; answer: string }[] }) {
  return (
    <div className="divide-y divide-[#E5E7EB] overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white">
      {faqs.map((f, i) => (
        <details key={f.question} className="group" open={i === 0}>
          <summary className="flex min-h-[56px] cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left text-[0.95rem] font-semibold text-[#1C1C1C] transition-colors hover:bg-[#F9FAFB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#16A34A] md:px-6 [&::-webkit-details-marker]:hidden">
            <h3 className="font-semibold">{f.question}</h3>
            <ChevronDown className="h-4 w-4 shrink-0 text-[#16A34A] transition-transform duration-200 group-open:rotate-180" aria-hidden="true" />
          </summary>
          <p className="px-5 pb-5 text-sm leading-relaxed text-[#4B5563] md:px-6">{f.answer}</p>
        </details>
      ))}
    </div>
  );
}

export function LinkCards({ links }: { links: { href: string; label: string; desc: string }[] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {links.map((l) => (
        <li key={l.href}>
          <Link href={l.href} className="group flex h-full flex-col rounded-2xl border border-[#E5E7EB] bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#16A34A]/40 hover:shadow-[0_14px_30px_-20px_rgba(15,23,42,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A] focus-visible:ring-offset-2">
            <span className="font-heading text-[0.95rem] font-bold text-[#1C1C1C] group-hover:text-[#15803D]">{l.label}</span>
            <span className="mt-1 flex-1 text-[0.8rem] leading-relaxed text-[#6B7280]">{l.desc}</span>
            <ArrowRight className="mt-3 h-4 w-4 text-[#16A34A] transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function QuoteSection({
  id = "quote",
  heading,
  body,
  submitLabel,
  form,
  waPrefill,
  pathB,
}: {
  id?: string;
  heading: string;
  body: string;
  submitLabel: string;
  form: { pickup?: string; dropoff?: string; vehicle?: string; tripType?: "One Way" | "Round Trip" | "By the Hour" };
  waPrefill: string;
  pathB?: { heading: string; body: string; emailSubject: string; emailBody: string };
}) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-24">
      <div className="overflow-hidden rounded-[2rem] border border-[#16A34A]/15 bg-white shadow-[0_30px_80px_-40px_rgba(15,23,42,0.35)]">
        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative min-w-0 bg-[#0B1F14] p-7 text-[#FFFFFF] md:p-10">
            <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-[#16A34A]/30 blur-3xl" aria-hidden="true" />
            <div className="relative">
              <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[#FACC15]">Request a quote</p>
              <h2 id={`${id}-heading`} className="mt-3 font-heading text-[1.75rem] font-bold leading-tight md:text-[2rem]">{heading}</h2>
              <p className="mt-3 text-sm leading-relaxed text-white/75">{body}</p>
              <ul className="mt-6 space-y-2.5 text-sm text-white/85">
                {["Fare agreed before booking — no meter, no surge", "Free cancellation up to 24 hours before pickup", "Cash to the driver or bank transfer", "English- & Arabic-speaking drivers, 24/7"].map((t) => (
                  <li key={t} className="flex items-start gap-2.5">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#FACC15]" aria-hidden="true" />
                    {t}
                  </li>
                ))}
              </ul>
              <a href={wa(waPrefill)} target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/25 px-5 text-xs font-bold uppercase tracking-wider text-[#FFFFFF] transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FACC15]">
                <MessageCircle className="h-4 w-4" aria-hidden="true" /> Prefer WhatsApp? Message us
              </a>
            </div>
          </div>
          <div className="min-w-0 bg-[#FAFAF7] p-3 sm:p-6 md:p-8">
            <WhatsAppQuoteForm defaultPickup={form.pickup} defaultDropoff={form.dropoff} defaultVehicle={form.vehicle} defaultTripType={form.tripType} submitLabel={submitLabel} />
          </div>
        </div>
        {pathB && (
          <div className="flex flex-col gap-4 border-t border-[#E5E7EB] bg-white p-6 md:flex-row md:items-center md:justify-between md:px-10">
            <div className="max-w-2xl">
              <p className="font-heading text-base font-bold text-[#1C1C1C]">{pathB.heading}</p>
              <p className="mt-1 text-sm leading-relaxed text-[#6B7280]">{pathB.body}</p>
            </div>
            <a
              href={`mailto:${contactConfig.email}?subject=${encodeURIComponent(pathB.emailSubject)}&body=${encodeURIComponent(pathB.emailBody)}`}
              className="inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-full border border-[#16A34A]/30 px-5 text-xs font-bold uppercase tracking-wider text-[#15803D] transition-colors hover:bg-[#F0FDF4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A] focus-visible:ring-offset-2"
            >
              <Mail className="h-4 w-4" aria-hidden="true" /> Email a written RFQ
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
