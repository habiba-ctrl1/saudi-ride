import Link from "next/link";
import Image from "next/image";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqSchema } from "@/lib/schema";
import { contactConfig } from "@/lib/config/contact";
import type { DistanceGuide, Tip } from "@/lib/data/distances";
import {
  MessageCircle, ArrowRight, Clock, MapPin, ShieldCheck, Luggage,
  CalendarClock, Car, Users, Briefcase, Fuel, Sunrise, Compass,
  Route as RouteIcon, Map as MapIcon,
} from "lucide-react";

const TIP_ICON: Record<Tip["icon"], typeof Clock> = {
  sunrise: Sunrise, fuel: Fuel, luggage: Luggage, clock: Clock,
  map: MapIcon, shield: ShieldCheck, route: RouteIcon, prayer: Compass,
};

const VEHICLES = [
  { name: "Executive Sedan", note: "Toyota Camry / Ford — 2025–26", img: "/fleet/toyota-camry.webp", icon: Car },
  { name: "Family SUV", note: "GMC Yukon", img: "/fleet/gmc-yukon-xl.webp", icon: Users },
  { name: "Group Van", note: "Hyundai Staria", img: "/fleet/hyundai-staria.webp", icon: Briefcase },
];

export function DistanceGuidePremium({ g }: { g: DistanceGuide }) {
  const WA = `${contactConfig.whatsappLink}?text=${encodeURIComponent(
    `Salam! I'd like a private taxi from ${g.fromCity} to ${g.toCity}.\n\n• Date & time: \n• Passengers & luggage: \n• Vehicle (Sedan / SUV / Van): `,
  )}`;

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#1C1C1C]">
      <JsonLd data={faqSchema(g.faqs)} />

      {/* ─── HERO ─── */}
      <section className="premium-dark-section relative min-h-[88vh] flex items-end overflow-hidden">
        <Image src={g.heroImage} alt={`Private car journey from ${g.fromCity} to ${g.toCity}, Saudi Arabia`} fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F14] via-[#0B1F14]/85 to-[#0B1F14]/55" />
        <div className="section-container relative z-10 max-w-5xl pb-16 pt-32">
          <div className="mb-6 [&_*]:!text-white/80">
            <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Distances", href: "/distance" }, { name: `${g.fromCity} to ${g.toCity}`, href: `/distance/${g.slug}` }]} />
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 backdrop-blur px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-white mb-6">
            <RouteIcon className="h-3 w-3" /> Private Intercity Transfer
          </span>
          <h1 className="text-white font-heading text-4xl md:text-6xl font-bold leading-[1.05] mb-5 max-w-3xl [text-shadow:0_2px_20px_rgba(0,0,0,0.6)]">
            {g.fromCity} to {g.toCity} Taxi
          </h1>
          <p className="text-base md:text-xl text-white/90 max-w-2xl leading-relaxed mb-8 [text-shadow:0_1px_10px_rgba(0,0,0,0.5)]">{g.valueProp}</p>

          <div className="flex items-center gap-4 mb-9">
            <div>
              <p className="text-[0.6rem] uppercase tracking-wider text-white/70">From</p>
              <p className="text-white font-heading text-xl font-bold">{g.fromCity}</p>
            </div>
            <div className="flex-1 flex items-center gap-2 max-w-[220px]">
              <span className="h-px flex-1 bg-white/40" />
              <span className="text-[0.65rem] font-semibold text-white/80 whitespace-nowrap">{g.km} km · {g.driveLabel}</span>
              <span className="h-px flex-1 bg-white/40" />
            </div>
            <div>
              <p className="text-[0.6rem] uppercase tracking-wider text-white/70">To</p>
              <p className="text-white font-heading text-xl font-bold">{g.toCity}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <a href={WA} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-8 py-4 text-sm font-bold uppercase text-white shadow-lg hover:brightness-110 transition-all">
              <MessageCircle className="h-5 w-5" /> Get a Quote on WhatsApp
            </a>
            <Link href="#vehicles" className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 backdrop-blur px-8 py-4 text-sm font-bold uppercase text-white hover:bg-white/15 transition-all">
              See vehicles &amp; route
            </Link>
          </div>
        </div>
      </section>

      {/* ─── JOURNEY OVERVIEW BAND ─── */}
      <section className="border-b border-[#16A34A]/10 bg-white">
        <div className="section-container max-w-5xl py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#16A34A]/10">
            {[
              { icon: MapPin, label: "Distance", value: `~${g.km} km` },
              { icon: Clock, label: "Typical journey", value: g.driveLabel },
              { icon: ShieldCheck, label: "Service", value: "Private, door-to-door" },
              { icon: CalendarClock, label: "Availability", value: "24/7 · pre-booked" },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-4 md:py-2">
                <f.icon className="h-5 w-5 text-[#C9A84C] shrink-0" />
                <div>
                  <p className="text-[0.58rem] uppercase tracking-wider text-[#6B7280]">{f.label}</p>
                  <p className="font-heading text-base font-bold leading-tight">{f.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHO / WHY ─── */}
      <section className="section-container max-w-5xl py-16 md:py-20">
        <div className="max-w-2xl mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-5">Why travel by private taxi?</h2>
          {g.whoBooks.map((p, i) => (
            <p key={i} className="text-[#374151] leading-relaxed mb-4">{p}</p>
          ))}
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {g.whyCards.map((w, i) => (
            <div key={i} className="rounded-3xl overflow-hidden border border-[#16A34A]/12 bg-white">
              <div className="h-44 relative"><Image src={w.img} alt={w.title} fill className="object-cover" /></div>
              <div className="p-6">
                <h3 className="font-heading text-lg font-bold mb-2">{w.title}</h3>
                <p className="text-sm text-[#6B7280] leading-relaxed">{w.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── THE ROUTE ─── */}
      <section className="bg-white border-y border-[#16A34A]/10">
        <div className="section-container max-w-5xl py-16 md:py-20">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-5">The route</h2>
          <p className="text-[#374151] leading-relaxed max-w-2xl mb-10">{g.routeIntro}</p>
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1.4fr_auto_1fr] items-center gap-3 mb-10">
            <RouteImg src={g.fromImage} label={g.fromCity} sub="Start" />
            <StripArrow />
            <RouteImg src={g.routeStripImage} label={g.highway} sub={`${g.km} km`} wide />
            <StripArrow />
            <RouteImg src={g.toImage} label={g.toCity} sub="Arrive" />
          </div>
          <div className="flex flex-wrap gap-3">
            <span className="text-[0.7rem] font-semibold text-[#6B7280] mr-1 self-center">Rest &amp; fuel stops:</span>
            {g.stops.map((s, i) => (
              <span key={i} className="inline-flex items-center gap-2 rounded-full border border-[#16A34A]/15 bg-[#F0FDF4] px-4 py-1.5 text-sm">
                <MapPin className="h-3.5 w-3.5 text-[#16A34A]" /> {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── VEHICLES ─── */}
      <section id="vehicles" className="section-container max-w-5xl py-16 md:py-20">
        <div className="max-w-2xl mb-10">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Choose your vehicle</h2>
          <p className="text-[#374151] leading-relaxed">Match the car to your group and luggage. Every option is private, with a professional driver, and the fare is confirmed on WhatsApp before you book — no surge.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {VEHICLES.map((v, i) => (
            <Link key={v.name} href={`/routes/${g.routeSlug}`} className="group rounded-3xl overflow-hidden border border-[#16A34A]/12 bg-white hover:border-[#16A34A]/40 hover:shadow-lg transition-all">
              <div className="h-48 relative bg-[#FAFAF7]"><Image src={v.img} alt={v.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" /></div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-1">
                  <v.icon className="h-4 w-4 text-[#C9A84C]" />
                  <h3 className="font-heading text-lg font-bold">{v.name}</h3>
                </div>
                <p className="text-[0.72rem] text-[#16A34A] font-semibold mb-2">{v.note}</p>
                <p className="text-sm text-[#6B7280]">{g.vehicleFits[i]}</p>
              </div>
            </Link>
          ))}
        </div>
        <p className="text-sm text-[#6B7280] mt-6">
          Larger group? We also arrange a{" "}
          <Link href="/services/group-transport" className="text-[#16A34A] font-semibold underline">Hiace or Coaster</Link>{" "}
          for the {g.fromCity}–{g.toCity} route on request.
        </p>
      </section>

      {/* ─── COMPARE ─── */}
      <section className="bg-white border-y border-[#16A34A]/10">
        <div className="section-container max-w-5xl py-16 md:py-20">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-8">Taxi vs train vs flight</h2>
          <div className="space-y-4">
            {g.compare.map((c, i) => (
              <div key={i} className={`flex items-start gap-4 rounded-2xl border p-6 ${c.best ? "border-[#16A34A]/40 bg-[#F0FDF4]" : "border-[#16A34A]/12 bg-white"}`}>
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl shrink-0 ${c.best ? "bg-[#16A34A] text-white" : "bg-[#16A34A]/10 text-[#16A34A]"}`}>
                  {c.mode === "Flight" ? <span className="text-lg">✈</span> : c.mode === "Train" ? <span className="text-lg">🚆</span> : <Car className="h-6 w-6" />}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-bold">{c.mode}</h3>
                    {c.best && <span className="rounded-full bg-[#16A34A] px-2 py-0.5 text-[0.55rem] font-bold uppercase text-white">Best for groups &amp; luggage</span>}
                  </div>
                  <p className="text-sm text-[#6B7280] leading-relaxed">{c.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TIPS ─── */}
      <section className="section-container max-w-5xl py-16 md:py-20">
        <h2 className="font-heading text-3xl md:text-4xl font-bold mb-8">Before you leave</h2>
        <div className="grid sm:grid-cols-2 gap-5">
          {g.tips.map((t, i) => {
            const Icon = TIP_ICON[t.icon] ?? Clock;
            return (
              <div key={i} className="flex items-start gap-4 rounded-2xl border border-[#16A34A]/12 bg-white p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#16A34A]/10 shrink-0"><Icon className="h-5 w-5 text-[#16A34A]" /></div>
                <p className="text-sm text-[#1C1C1C] leading-relaxed self-center">{t.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="bg-white border-y border-[#16A34A]/10">
        <div className="section-container max-w-3xl py-16 md:py-20">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-8">{g.fromCity} to {g.toCity} — FAQs</h2>
          <div className="space-y-4">
            {g.faqs.map((f, i) => (
              <div key={i} className="rounded-2xl border border-[#16A34A]/12 p-6">
                <h3 className="font-bold text-[#1C1C1C] mb-2">{f.question}</h3>
                <p className="text-sm text-[#6B7280] leading-relaxed">{f.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── RELATED ─── */}
      <section className="section-container max-w-5xl py-16 md:py-20">
        <h2 className="font-heading text-2xl md:text-3xl font-bold mb-8">Related routes &amp; guides</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {g.related.map((r) => (
            <Link key={r.href} href={r.href} className="group rounded-2xl overflow-hidden border border-[#16A34A]/12 bg-white hover:border-[#16A34A]/40 transition-all">
              <div className="h-28 relative"><Image src={r.img} alt={r.label} fill className="object-cover group-hover:scale-105 transition-transform duration-500" /></div>
              <div className="p-4"><p className="text-sm font-semibold leading-snug">{r.label}</p></div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="premium-dark-section relative overflow-hidden">
        <Image src="/gallery/vip-sedan.webp" alt="" fill className="object-cover" />
        <div className="absolute inset-0 bg-[#0B1F14]/92" />
        <div className="section-container relative z-10 max-w-3xl py-20 text-center">
          <h2 className="text-white font-heading text-3xl md:text-4xl font-bold mb-4">Ready to travel {g.fromCity} to {g.toCity}?</h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">Send us your date, passenger count, and preferred vehicle. We reply on WhatsApp with one fixed, all-in fare — no surge, no hidden fees.</p>
          <a href={WA} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-9 py-4 text-sm font-bold uppercase text-white shadow-lg hover:brightness-110 transition-all">
            <MessageCircle className="h-5 w-5" /> Get a WhatsApp Quote
          </a>
        </div>
      </section>
    </div>
  );
}

function RouteImg({ src, label, sub, wide }: { src: string; label: string; sub: string; wide?: boolean }) {
  return (
    <div className={`premium-dark-section relative rounded-2xl overflow-hidden border border-[#16A34A]/15 ${wide ? "h-32" : "h-28"}`}>
      <Image src={src} alt={label} fill className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
      <div className="absolute bottom-2 left-3">
        <p className="text-[0.55rem] uppercase tracking-wider text-white/80">{sub}</p>
        <p className="text-white font-heading text-sm font-bold">{label}</p>
      </div>
    </div>
  );
}

function StripArrow() {
  return (
    <div className="hidden sm:flex items-center justify-center text-[#16A34A]"><ArrowRight className="h-5 w-5" /></div>
  );
}
