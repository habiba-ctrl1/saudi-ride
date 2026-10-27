import Link from "next/link";
import {
  ArrowRight, MapPin, Clock, MessageCircle, Mail, CheckCircle2, Car, Users, Lightbulb, Flag, Route as RouteIcon, Scale,
} from "lucide-react";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { TLDRSummary } from "@/components/seo/TLDRSummary";
import WhatsAppQuoteForm from "@/components/booking/WhatsAppQuoteForm";
import { formatDrive } from "@/components/cross-border/CorridorRouteCards";
import { contactConfig } from "@/lib/config/contact";
import { serviceSchema, faqSchema, speakableSchema } from "@/lib/schema";
import { ROUTES_DATA } from "@/lib/data/routes";
import type { SouthernRoutePageData } from "@/lib/data/southern-cluster";

// Bespoke southern-corridor route page (Abha ↔ Jizan, Najran → Abha).
// Copy lives in lib/data/southern-cluster.ts; distance/time always come from
// ROUTES_DATA so this page can never disagree with the route list.

const INCLUDED = [
  "One fixed fare, confirmed in writing on WhatsApp — no meter, no surge",
  "15–30 minutes of free waiting on every trip",
  "We track your flight on airport pickups",
  "English- and Arabic-speaking drivers",
  "Free cancellation up to 24 hours before pickup",
  "Pay cash to the driver or by bank transfer; e-receipt on request",
];

const VEHICLES = [
  { name: "Executive sedan", fit: "Solo travellers and couples, business trips" },
  { name: "Full-size SUV", fit: "Families, more luggage, mountain sections" },
  { name: "Van", fit: "Groups and heavy luggage" },
];

const STAGE_ICON = { origin: MapPin, road: RouteIcon, destination: Flag } as const;

export default function SouthernRoutePage({ data }: { data: SouthernRoutePageData }) {
  const route = ROUTES_DATA.find((r) => r.slug === data.slug)!;
  const path = `/routes/${data.slug}`;
  const label = `${data.fromPlace} to ${data.toPlace}`;
  const km = `~${route.distance} km`;
  const drive = `~${formatDrive(route.duration)}`;
  const waText =
    `Hello, I'd like a quote for a private transfer from ${data.fromPlace} to ${data.toPlace}.\n\n` +
    `• From: \n• To: \n• Date & time: \n• Passengers & luggage: \n• Vehicle (Sedan / SUV / Van): \n• Trip type (one-way / return): \n\n` +
    `Please confirm availability and the total fare.`;
  const waHref = `https://wa.me/${contactConfig.whatsappNumber}?text=${encodeURIComponent(waText)}`;
  const vehicleWa = (v: string) =>
    `https://wa.me/${contactConfig.whatsappNumber}?text=${encodeURIComponent(waText.replace("• Vehicle (Sedan / SUV / Van): ", `• Vehicle: ${v}`))}`;
  const mailto = `mailto:${contactConfig.email}?subject=${encodeURIComponent(`Corporate transfer RFQ — ${label}`)}&body=${encodeURIComponent(
    `Hello Taxi Saudi Arabia team,\n\nWe'd like a written quote for private transfers on ${label}.\n\n• Company name: \n• Contact name & role: \n• Dates & times: \n• Passengers per trip: \n• Vehicles (Executive sedan / SUV / Van / Coaster): \n• One-way or return / waiting: \n• Invoicing needed (VAT / PO)?: \n`,
  )}`;

  return (
    <div className="min-h-screen bg-[#FAFAF7] pb-28 text-[#1C1C1C] lg:pb-16">
      <JsonLd
        data={[
          serviceSchema({
            name: `${label} private transfer`,
            description: data.quickAnswer,
            path,
            serviceType: "Private intercity transfer",
            areaServed: [data.fromPlace, data.toPlace, "Saudi Arabia"],
          }),
          faqSchema(data.faqs),
          speakableSchema({ path }),
        ]}
      />
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Routes", href: "/routes" },
          { name: label, href: path },
        ]}
      />

      {/* ─── HERO ─── */}
      <section className="section-container max-w-5xl pt-3">
        <div className="relative overflow-hidden rounded-[28px] bg-[radial-gradient(120%_140%_at_0%_0%,#166534_0%,#0F2E1C_55%,#0B1F14_100%)] p-6 sm:p-10">
          <div aria-hidden className="pointer-events-none absolute -end-24 -top-24 h-72 w-72 rounded-full bg-[#FACC15]/10 blur-3xl" />
          <div className="relative z-10 space-y-5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FACC15]/40 bg-[#FACC15]/10 px-3.5 py-1 text-[0.65rem] font-bold uppercase tracking-widest text-[#FACC15]">
              {data.eyebrow}
            </span>
            <h1 className="font-heading max-w-3xl text-3xl font-extrabold leading-tight tracking-tight text-[#FFFFFF] sm:text-5xl">{data.h1}</h1>
            <p className="max-w-2xl text-sm leading-relaxed text-[#FFFFFF]/85 sm:text-base">{data.lead}</p>
            <div className="flex flex-wrap gap-2.5">
              {[{ icon: MapPin, text: `${km} by road` }, { icon: Clock, text: `${drive} driving` }].map(({ icon: Icon, text }) => (
                <span key={text} className="inline-flex items-center gap-2 rounded-xl border border-[#FFFFFF]/15 bg-[#FFFFFF]/10 px-3.5 py-2 text-xs font-semibold text-[#FFFFFF]">
                  <Icon className="h-4 w-4 text-[#FACC15]" aria-hidden /> {text}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-3 pt-1">
              <a href="#route-quote" className="btn btn-accent btn-lg">Get your quote <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden /></a>
              <a href={waHref} target="_blank" rel="noopener noreferrer" className="btn btn-glass btn-lg"><MessageCircle className="h-4 w-4" aria-hidden /> WhatsApp this route</a>
            </div>
          </div>
        </div>
      </section>

      <div className="section-container mt-10 max-w-5xl space-y-12">
        <TLDRSummary
          answer={data.quickAnswer}
          facts={[
            { label: "Distance", value: `${km} (approx.)` },
            { label: "Driving", value: `${drive} (approx.)` },
            { label: "Fare", value: "Fixed, confirmed on WhatsApp" },
            { label: "Best for", value: data.bestFor },
          ]}
        />

        {/* ─── JOURNEY ─── */}
        <section aria-labelledby="sr-journey" className="rounded-3xl border border-[#16A34A]/15 bg-white p-6 sm:p-8">
          <span className="t-eyebrow">The journey</span>
          <h2 id="sr-journey" className="font-heading mt-1 text-2xl font-bold sm:text-3xl">{label}, stage by stage</h2>
          <ol className="mt-6">
            {data.stages.map((s, i) => {
              const Icon = STAGE_ICON[s.kind];
              const last = i === data.stages.length - 1;
              return (
                <li key={s.title} className="relative flex gap-4 pb-6 last:pb-0">
                  {!last && <span aria-hidden className="absolute start-[1.15rem] top-10 bottom-0 w-0 border-s-2 border-dashed border-[#16A34A]/25" />}
                  <span className={`relative z-[1] flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${s.kind === "road" ? "bg-[#F0FDF4] text-[#15803D]" : "bg-[#16A34A] text-[#FFFFFF]"}`}>
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[0.65rem] font-bold uppercase tracking-wider text-[#6B7280]">{s.label}</p>
                    <p className="font-semibold">{s.title}</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-[#6B7280]">{s.desc}</p>
                  </div>
                </li>
              );
            })}
          </ol>
          <p className="mt-6 rounded-2xl bg-[#F0FDF4] p-4 text-sm leading-relaxed text-[#166534]">
            Distance is the measured road distance and driving time is an estimate. Traffic, weather and stops change the real time, so we plan your pickup with margin and never promise an exact arrival minute.
          </p>
        </section>

        {/* ─── TRADE-OFF ─── */}
        <section aria-labelledby="sr-tradeoff" className="rounded-3xl border border-[#16A34A]/15 bg-white p-6 sm:p-8">
          <h2 id="sr-tradeoff" className="font-heading flex items-center gap-2 text-2xl font-bold">
            <Scale className="h-5 w-5 text-[#16A34A]" aria-hidden /> {data.tradeOff.heading}
          </h2>
          <div className="mt-3 space-y-3 text-[0.95rem] leading-relaxed text-[#475569]" style={{ maxWidth: "70ch" }}>
            {data.tradeOff.body.map((p) => <p key={p}>{p}</p>)}
          </div>
        </section>

        {/* ─── END POINTS ─── */}
        <section aria-labelledby="sr-points">
          <h2 id="sr-points" className="font-heading text-2xl font-bold sm:text-3xl">{data.endPoints.heading}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#6B7280]">{data.endPoints.intro}</p>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {data.endPoints.points.map((p) => (
              <li key={p.name} className="rounded-2xl border border-[#16A34A]/12 bg-white p-5">
                <p className="flex items-center gap-2 font-semibold"><Flag className="h-4 w-4 text-[#16A34A]" aria-hidden /> {p.name}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-[#6B7280]">{p.desc}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* ─── WHO + VEHICLES ─── */}
        <section aria-labelledby="sr-who" className="grid gap-5 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <h2 id="sr-who" className="font-heading flex items-center gap-2 text-2xl font-bold"><Users className="h-5 w-5 text-[#16A34A]" aria-hidden /> Who books this route</h2>
            <ul className="mt-4 space-y-3">
              {data.whoBooks.map((w) => (
                <li key={w.title} className="rounded-2xl border border-[#16A34A]/12 bg-white p-4 text-sm leading-relaxed text-[#475569]"><span className="font-semibold text-[#1C1C1C]">{w.title}.</span> {w.desc}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-[#16A34A]/15 bg-white p-5 sm:p-6 lg:col-span-2">
            <h2 className="font-heading flex items-center gap-2 text-xl font-bold"><Car className="h-5 w-5 text-[#16A34A]" aria-hidden /> Choose your vehicle</h2>
            <ul className="mt-4 space-y-3">
              {VEHICLES.map((v) => (
                <li key={v.name} className="flex items-center justify-between gap-3 rounded-2xl bg-[#FAFAF7] p-3">
                  <span className="min-w-0 flex-1"><span className="block text-sm font-semibold">{v.name}</span><span className="block text-xs text-[#6B7280]">{v.fit}</span></span>
                  <a href={vehicleWa(v.name)} target="_blank" rel="noopener noreferrer" aria-label={`Quote — ${v.name}, ${label}`} className="inline-flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-full bg-[#16A34A] px-3.5 text-xs font-bold text-[#FFFFFF] hover:bg-[#15803D]">
                    <MessageCircle className="h-3.5 w-3.5" aria-hidden /> Quote
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs leading-relaxed text-[#6B7280]">Vehicles come from our partner network. The exact vehicle is confirmed with your fare.</p>
          </div>
        </section>

        {/* ─── TIPS + INCLUDED ─── */}
        <section aria-label="Planning tips" className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-3xl border border-[#16A34A]/15 bg-white p-6">
            <h2 className="font-heading flex items-center gap-2 text-xl font-bold"><Lightbulb className="h-5 w-5 text-[#A16207]" aria-hidden /> Planning tips for this route</h2>
            <ul className="mt-4 space-y-3">
              {data.tips.map((x) => <li key={x.title} className="text-sm leading-relaxed text-[#475569]"><span className="font-semibold text-[#1C1C1C]">{x.title}.</span> {x.desc}</li>)}
            </ul>
          </div>
          <div className="rounded-3xl border border-[#16A34A]/20 bg-[#F0FDF4] p-6">
            <h2 className="font-heading flex items-center gap-2 text-xl font-bold"><CheckCircle2 className="h-5 w-5 text-[#16A34A]" aria-hidden /> Included in your fare</h2>
            <ul className="mt-4 space-y-2.5">
              {INCLUDED.map((i) => <li key={i} className="flex gap-2.5 text-sm text-[#166534]"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden /> {i}</li>)}
            </ul>
          </div>
        </section>

        {/* ─── FAQ ─── */}
        <section aria-labelledby="sr-faq">
          <h2 id="sr-faq" className="font-heading text-2xl font-bold sm:text-3xl">{label}: your questions</h2>
          <div className="mt-5 space-y-3">
            {data.faqs.map((f) => (
              <details key={f.question} className="rounded-2xl border border-[#16A34A]/12 bg-white p-5 open:border-[#16A34A]/35">
                <summary className="cursor-pointer list-none font-semibold marker:hidden"><h3 className="inline">{f.question}</h3></summary>
                <p className="mt-2 text-sm leading-relaxed text-[#475569]">{f.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ─── BOOKING (Path A + Path B) ─── */}
        <section id="route-quote" aria-labelledby="sr-quote" className="scroll-mt-24 rounded-3xl border border-[#16A34A]/20 bg-[#F0FDF4] p-5 sm:p-8">
          <div className="mx-auto mb-6 max-w-2xl text-center">
            <h2 id="sr-quote" className="font-heading text-2xl font-bold sm:text-3xl">Get your {label} quote</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">Send the details. We reply on WhatsApp with one fixed fare for the vehicle you choose.</p>
          </div>
          <WhatsAppQuoteForm
            defaultPickup={data.fromPlace}
            defaultDropoff={data.toPlace}
            pickupPlaceholder={`Pickup address in ${data.fromPlace}`}
            dropoffPlaceholder={`Drop-off address in ${data.toPlace}`}
            messageIntro={`Hello, I'd like a quote for a private transfer from ${data.fromPlace} to ${data.toPlace}.`}
            showNotes
            submitLabel="Get my quote"
          />
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a href={waHref} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp btn-lg"><MessageCircle className="h-4 w-4" aria-hidden /> Or message us on WhatsApp</a>
            <a href={mailto} className="btn btn-secondary btn-lg"><Mail className="h-4 w-4" aria-hidden /> Company? Email an RFQ</a>
          </div>
          <p className="mt-3 text-center text-xs text-[#6B7280]">Corporate invoicing can be arranged through our sister company.</p>
        </section>

        {/* ─── RELATED ─── */}
        <section aria-labelledby="sr-related">
          <h2 id="sr-related" className="font-heading text-xl font-bold">Related pages</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {data.related.map((r) => (
              <li key={r.href}>
                <Link href={r.href} className="inline-flex items-center gap-1 text-sm font-semibold text-[#16A34A] hover:underline">{r.label} <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden /></Link>
              </li>
            ))}
            <li><Link href="/fleet" className="inline-flex items-center gap-1 text-sm font-semibold text-[#16A34A] hover:underline">Vehicle categories <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden /></Link></li>
          </ul>
        </section>
      </div>

      {/* ─── MOBILE STICKY CTA ─── */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#16A34A]/15 bg-[#FFFFFF]/95 py-3 ps-4 pe-20 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur lg:hidden">
        <div className="flex items-center gap-2">
          <a href="#route-quote" className="btn btn-primary flex-1 justify-center whitespace-nowrap">Get quote</a>
          <a href={waHref} target="_blank" rel="noopener noreferrer" aria-label={`WhatsApp — ${label}`} className="btn btn-whatsapp flex-1 justify-center"><MessageCircle className="h-4 w-4" aria-hidden /> WhatsApp</a>
        </div>
      </div>
    </div>
  );
}
