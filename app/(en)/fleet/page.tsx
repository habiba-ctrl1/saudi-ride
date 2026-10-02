"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Users, Luggage, Car, MessageCircle, ArrowRight, Check, CarFront, Truck, Crown, Bus, LayoutGrid, ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { contactConfig } from "@/lib/config/contact";
import { FLEET_VEHICLES, fleetShowcaseImage, type FleetVehicle, type VehicleCategory } from "@/lib/fleet-data";
import { trustStats } from "@/lib/config/stats";
import { TLDRSummary } from "@/components/seo/TLDRSummary";
import { trackEvent } from "@/lib/analytics";

type CategoryKey = "all" | VehicleCategory;

const CATEGORIES: { key: CategoryKey; label: string; icon: typeof Car }[] = [
  { key: "all", label: "All Cars", icon: LayoutGrid },
  { key: "sedan", label: "Sedans", icon: Car },
  { key: "suv", label: "SUVs", icon: CarFront },
  { key: "van", label: "Vans", icon: Truck },
  { key: "luxury", label: "Luxury", icon: Crown },
  { key: "bus", label: "Buses", icon: Bus },
];

const GROUP_ORDER: VehicleCategory[] = ["sedan", "suv", "van", "luxury", "bus"];
const CATEGORY_LABEL: Record<VehicleCategory, string> = {
  sedan: "Sedan", suv: "SUV", van: "Van", luxury: "Luxury", bus: "Bus",
};

function waRequestLink(v: FleetVehicle) {
  const text =
    `Salam! I'd like to request the ${v.name} (${v.subtitle}) with Taxi Saudi Arabia.\n\n` +
    `• From: \n• To: \n• Date & time: \n• Passengers & luggage: \n• Vehicle: ${v.name}`;
  return `https://wa.me/${contactConfig.whatsappNumber}?text=${encodeURIComponent(text)}`;
}

const HERO_WA = `https://wa.me/${contactConfig.whatsappNumber}?text=${encodeURIComponent(
  "Salam! I'd like a quote for a private car with Taxi Saudi Arabia.\n\n• From: \n• To: \n• Date & time: \n• Passengers & luggage: \n• Vehicle (Sedan / SUV / Van / Bus): ",
)}`;

export default function FleetPage() {
  const [active, setActive] = useState<CategoryKey>("all");
  const reduce = useReducedMotion();

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: FLEET_VEHICLES.length };
    for (const v of FLEET_VEHICLES) c[v.category] = (c[v.category] ?? 0) + 1;
    return c;
  }, []);

  const groups = GROUP_ORDER.filter((g) => active === "all" || g === active)
    .map((g) => ({ key: g, label: CATEGORIES.find((c) => c.key === g)!.label, icon: CATEGORIES.find((c) => c.key === g)!.icon, items: FLEET_VEHICLES.filter((v) => v.category === g) }))
    .filter((g) => g.items.length > 0);

  // Capacity at a glance — derived only from the vehicle data above.
  const capacity = GROUP_ORDER.map((g) => {
    const items = FLEET_VEHICLES.filter((v) => v.category === g);
    return {
      key: g,
      label: CATEGORIES.find((c) => c.key === g)!.label,
      icon: CATEGORIES.find((c) => c.key === g)!.icon,
      pax: Math.max(...items.map((v) => v.passengers)),
      paxMin: Math.min(...items.map((v) => v.passengers)),
      bags: Math.max(...items.map((v) => v.luggage)),
    };
  });
  const maxPax = Math.max(...capacity.map((c) => c.pax));

  const heroVehicle = FLEET_VEHICLES.find((v) => v.slug === "mercedes-v-class") ?? FLEET_VEHICLES[0];

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#1C1C1C]">
      {/* ─── HERO ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-28 pb-14 md:pt-32 md:pb-20">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_100%_0%,rgba(22,163,74,0.10),transparent_60%),radial-gradient(50%_50%_at_0%_100%,rgba(250,204,21,0.10),transparent_60%)]" />

        <div className="wrap wrap-wide relative z-10">
          <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
            <motion.div initial={reduce ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
              <span className="t-eyebrow">Our Cars</span>
              <h1 className="t-display mt-4 !text-[clamp(2.1rem,3.6vw,3.1rem)]">
                Cars for Hire in Saudi Arabia
                <span className="mt-1 block text-[#16A34A]">Sedans, SUVs, Vans &amp; Buses</span>
              </h1>
              <p className="t-lead mt-5">
                Choose from sedans, SUVs, minivans, and buses — all clean, comfortable, and available 24/7 with a professional driver across Saudi Arabia, the GCC, and beyond. Clear prices confirmed on WhatsApp, no hidden fees.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href={HERO_WA}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent("whatsapp_click", { sourceLocation: "fleet_hero", phoneUsed: contactConfig.whatsappNumber, locale: "en", path: "/fleet" })}
                  className="btn btn-primary btn-lg"
                >
                  <MessageCircle /> Get a Quote on WhatsApp
                </a>
                <a href="#fleet-catalogue" className="btn btn-secondary btn-lg">
                  Browse the Fleet <ArrowRight className="rotate-90" />
                </a>
              </div>

              <dl className="mt-10 grid max-w-xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[#0F172A]/[0.07] bg-[#0F172A]/[0.07] sm:grid-cols-4">
                {[
                  { value: trustStats.vehicleClasses, label: "Vehicle Classes" },
                  { value: trustStats.licensedDrivers, label: "Professional Drivers" },
                  { value: trustStats.activeChauffeurs, label: "Available 24/7" },
                  { value: trustStats.fixedPriceGuarantee, label: "Clear Quotes on WhatsApp" },
                ].map((s) => (
                  <div key={s.label} className="bg-white px-4 py-3.5">
                    <dt className="sr-only">{s.label}</dt>
                    <dd>
                      <span className="block font-heading text-xl font-extrabold text-[#15803D]">{s.value}</span>
                      <span className="mt-0.5 block text-[0.72rem] font-semibold leading-snug text-[#64748B]">{s.label}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            </motion.div>

            {/* Hero visual — real fleet photo (plates obscured), framed. */}
            <motion.div
              initial={reduce ? false : { opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="relative"
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-[28px] bg-[#E8EEE9] shadow-[0_40px_80px_-40px_rgba(15,23,42,0.55)] ring-1 ring-black/5">
                <Image
                  src={fleetShowcaseImage(heroVehicle)}
                  alt={`${heroVehicle.name} vehicles available through Taxi Saudi Arabia`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 48vw"
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-5 start-5 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-[0_18px_40px_-18px_rgba(15,23,42,0.45)] ring-1 ring-black/5 sm:start-8">
                <span className="icon-tile !h-10 !w-10"><ShieldCheck /></span>
                <span>
                  <span className="block text-sm font-bold text-[#0F172A]">{heroVehicle.name}</span>
                  <span className="block text-xs text-[#64748B]">{heroVehicle.subtitle} · up to {heroVehicle.passengers} passengers</span>
                </span>
              </div>
            </motion.div>
          </div>

          <TLDRSummary
            answer="Taxi Saudi Arabia operates a fleet of sedans (Camry), premium SUVs (Yukon XL), VIP minivans (Mercedes V-Class), luxury vans (Sprinter VIP), and buses (Coaster) with 24/7 licensed chauffeurs across all Saudi cities."
            facts={[
              { label: "Vehicles", value: "10+ Models" },
              { label: "VIP Options", value: "S-Class, V-Class, Sprinter" },
              { label: "Drivers", value: "Licensed 24/7" },
              { label: "Fares", value: "Fixed upfront pricing" },
            ]}
            className="mt-14 md:mt-16"
          />
        </div>
      </section>

      {/* Sticky nav lives inside this wrapper so it releases after the catalogue. */}
      <div>
      {/* ─── CATEGORY NAV ─────────────────────────────────────────── */}
      <div id="fleet-catalogue" className="sticky top-14 z-30 border-y border-[#0F172A]/[0.06] bg-[#FAFAF7]/90 backdrop-blur-md sm:top-16">
        <div className="wrap wrap-wide py-3">
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" role="group" aria-label="Filter vehicles by category">
            {CATEGORIES.map((cat) => {
              const on = active === cat.key;
              const n = counts[cat.key] ?? 0;
              return (
                <button
                  key={cat.key}
                  type="button"
                  aria-pressed={on}
                  disabled={n === 0}
                  onClick={() => setActive(cat.key)}
                  className={`group inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40 ${
                    on
                      ? "border-[#16A34A] bg-[#16A34A] text-[#FFFFFF] shadow-[0_8px_20px_-8px_rgba(22,163,74,0.7)]"
                      : "border-[#0F172A]/10 bg-white text-[#334155] hover:border-[#16A34A]/50 hover:text-[#15803D]"
                  }`}
                >
                  <cat.icon className="h-4 w-4" aria-hidden />
                  {cat.label}
                  <span className={`rounded-full px-2 py-0.5 text-[0.7rem] font-bold ${on ? "bg-white/20 text-[#FFFFFF]" : "bg-[#F1F5F9] text-[#64748B]"}`}>{n}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── CATALOGUE ───────────────────────────────────────────── */}
      <div className="wrap wrap-wide py-12 md:py-16" aria-live="polite">
        <motion.div
            key={active}
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-16 md:space-y-20"
          >
            {groups.map((g) => (
              <section key={g.key} aria-labelledby={`fleet-${g.key}`}>
                <div className="mb-6 flex items-end justify-between gap-4 border-b border-[#0F172A]/[0.07] pb-4">
                  <h2 id={`fleet-${g.key}`} className="flex items-center gap-3 font-heading text-[clamp(1.4rem,2.4vw,1.85rem)] font-extrabold tracking-tight text-[#0F172A]">
                    <span className="icon-tile !h-10 !w-10"><g.icon /></span>
                    {g.label}
                  </h2>
                  <span className="t-meta shrink-0">{g.items.length} vehicle{g.items.length !== 1 ? "s" : ""}</span>
                </div>
                <GroupGrid items={g.items} priorityFirst={false} />
              </section>
            ))}
          </motion.div>
      </div>
      </div>

      {/* ─── CAPACITY AT A GLANCE ────────────────────────────────── */}
      <section className="border-t border-[#0F172A]/[0.06] bg-white py-16 md:py-24">
        <div className="wrap">
          <div className="section-head">
            <span className="t-eyebrow">Capacity at a glance</span>
            <h2 className="t-h2">Which vehicle class fits your group?</h2>
            <p className="t-lead">Maximum passengers and large bags per class, taken from the vehicles listed above.</p>
          </div>
          <ul className="mt-10 space-y-3" data-stagger>
            {capacity.map((c) => (
              <li key={c.key}>
                <button
                  type="button"
                  onClick={() => {
                    setActive(c.key);
                    document.getElementById("fleet-catalogue")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
                  }}
                  className="group grid w-full grid-cols-[auto_1fr] items-center gap-x-4 gap-y-2 rounded-2xl border border-[#0F172A]/[0.07] bg-[#FAFAF7] p-4 text-start transition-colors hover:border-[#16A34A]/40 hover:bg-[#F4FAF5] sm:grid-cols-[10rem_1fr_auto] sm:p-5"
                >
                  <span className="flex items-center gap-3">
                    <span className="icon-tile !h-10 !w-10"><c.icon /></span>
                    <span className="font-heading text-base font-bold text-[#0F172A]">{c.label}</span>
                  </span>
                  <span className="col-span-2 sm:col-span-1">
                    <span className="block h-3 overflow-hidden rounded-full bg-[#E5ECE7]">
                      <span
                        className="block h-full rounded-full bg-gradient-to-r from-[#16A34A] to-[#22C55E] transition-[width] duration-700"
                        style={{ width: `${Math.max(8, (c.pax / maxPax) * 100)}%` }}
                      />
                    </span>
                  </span>
                  <span className="col-span-2 flex items-center gap-4 text-sm font-semibold text-[#334155] sm:col-span-1 sm:justify-end">
                    <span className="inline-flex items-center gap-1.5"><Users className="h-4 w-4 text-[#16A34A]" aria-hidden />{c.paxMin === c.pax ? c.pax : `${c.paxMin}–${c.pax}`} pax</span>
                    <span className="inline-flex items-center gap-1.5"><Luggage className="h-4 w-4 text-[#16A34A]" aria-hidden />up to {c.bags} bags</span>
                    <ArrowRight className="hidden h-4 w-4 text-[#16A34A] sm:block rtl:rotate-180" aria-hidden />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ─── BOTTOM CTA ───────────────────────────────────────────── */}
      <section className="wrap py-16 md:py-24">
        <div className="card relative grid items-center gap-8 overflow-hidden p-7 sm:p-10 md:grid-cols-[1.4fr_1fr] md:p-12">
          <span aria-hidden className="absolute inset-y-0 start-0 w-1.5 bg-gradient-to-b from-[#16A34A] to-[#FACC15]" />
          <div>
            <span className="t-eyebrow">Group & Corporate Bookings</span>
            <h2 className="t-h2 mt-3 !text-[clamp(1.5rem,2.6vw,2.1rem)]">Need a specific car type or a long-term booking?</h2>
            <p className="mt-3 max-w-xl text-[0.98rem] leading-relaxed text-[#475569]">
              We handle corporate accounts, Umrah group transport, wedding car hire, and long-term vehicle arrangements across Saudi Arabia. Contact us to get a custom quote.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <a
              href={`https://wa.me/${contactConfig.whatsappNumber}?text=${encodeURIComponent("Salam! I would like a price quote for a car.\n\n• From: \n• To: \n• Date & time: \n• Passengers & luggage: \n• Vehicle (Sedan / SUV / Van / Bus): ")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-lg btn-block"
            >
              <MessageCircle /> Get a Price on WhatsApp
            </a>
            <Link href="/contact" className="btn btn-secondary btn-lg btn-block">
              Send Inquiry Form <ArrowRight className="rtl:rotate-180" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ─── Layout per group ───────────────────────────────────────────────────── */
function GroupGrid({ items, priorityFirst }: { items: FleetVehicle[]; priorityFirst: boolean }) {
  const n = items.length;
  if (n >= 5) {
    // One editorial feature + the rest in a 3-up grid (6 → two even rows).
    return (
      <div className="space-y-6">
        <VehicleCard vehicle={items[0]} featured priority={priorityFirst} />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.slice(1).map((v) => <VehicleCard key={v.slug} vehicle={v} />)}
        </div>
      </div>
    );
  }
  if (n === 1) return <VehicleCard vehicle={items[0]} featured />;
  const cols = n === 2 || n === 4 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3";
  return (
    <div className={`grid gap-6 ${cols}`}>
      {items.map((v) => <VehicleCard key={v.slug} vehicle={v} large={n === 2 || n === 4} />)}
    </div>
  );
}

/* ─── Vehicle card ───────────────────────────────────────────────────────── */
function VehicleCard({ vehicle: v, featured = false, large = false, priority = false }: { vehicle: FleetVehicle; featured?: boolean; large?: boolean; priority?: boolean }) {
  const specs = [
    { icon: Users, value: String(v.passengers), label: "Passengers" },
    { icon: Luggage, value: String(v.luggage), label: "Bags" },
    { icon: Car, value: CATEGORY_LABEL[v.category], label: "Type" },
  ];
  const trackWa = () =>
    trackEvent("whatsapp_click", { sourceLocation: `fleet_card_${v.slug}`, phoneUsed: contactConfig.whatsappNumber, locale: "en", path: "/fleet" });

  return (
    <article
      className={`card group flex overflow-hidden transition-[translate,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-[#16A34A]/30 hover:shadow-[0_24px_50px_-28px_rgba(15,23,42,0.45)] ${
        featured ? "flex-col lg:flex-row" : "flex-col"
      }`}
    >
      <Link
        href={`/fleet/${v.slug}`}
        aria-label={`${v.name} — full specs & gallery`}
        className={`no-lift relative block shrink-0 overflow-hidden bg-[#E8EEE9] ${featured ? "aspect-[16/10] lg:aspect-auto lg:w-[58%]" : "aspect-[16/10]"}`}
      >
        <Image
          src={fleetShowcaseImage(v)}
          alt={`${v.name} — ${v.subtitle}`}
          fill
          priority={priority}
          sizes={featured ? "(max-width: 1024px) 100vw, 58vw" : large ? "(max-width: 640px) 100vw, 50vw" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
        <span aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/25 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <span className="absolute start-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[0.7rem] font-bold text-[#15803D] shadow-sm backdrop-blur">
          {v.badge}
        </span>
      </Link>

      <div className={`flex flex-1 flex-col ${featured ? "p-6 sm:p-8 lg:p-10 lg:justify-center" : "p-5 sm:p-6"}`}>
        <p className="t-meta uppercase tracking-[0.14em]">{v.subtitle}</p>
        <h3 className={`mt-1.5 font-heading font-extrabold leading-tight tracking-tight text-[#0F172A] ${featured ? "text-[clamp(1.5rem,2.4vw,2rem)]" : "text-[1.2rem]"}`}>
          <Link href={`/fleet/${v.slug}`} className="transition-colors hover:text-[#15803D]">{v.name}</Link>
        </h3>

        <dl className="mt-4 grid grid-cols-3 gap-2">
          {specs.map((s) => (
            <div key={s.label} className="flex min-w-0 flex-col items-center rounded-xl border border-[#0F172A]/[0.06] bg-[#F6F8F6] px-2.5 py-2.5 text-center">
              <s.icon className="h-4 w-4 text-[#16A34A]" aria-hidden />
              <dt className="order-3 text-[0.68rem] font-semibold uppercase tracking-wide text-[#64748B]">{s.label}</dt>
              <dd className="order-2 mt-1 max-w-full truncate text-sm font-bold text-[#0F172A]">{s.value}</dd>
            </div>
          ))}
        </dl>

        <p className={`mt-4 text-sm leading-relaxed text-[#475569] ${featured ? "" : "line-clamp-2"}`}>{v.description}</p>

        <ul className={`mt-4 flex flex-wrap gap-1.5 ${featured ? "" : "mb-1"}`}>
          {v.features.slice(0, 3).map((f) => (
            <li key={f} className="inline-flex items-center gap-1 rounded-full bg-[#F0FDF4] px-2.5 py-1 text-[0.74rem] font-semibold text-[#166534]">
              <Check className="h-3 w-3" aria-hidden /> {f}
            </li>
          ))}
        </ul>

        <div className={`mt-auto pt-5 ${featured ? "lg:mt-8" : ""}`}>
          <div className={`grid gap-2 ${featured ? "sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2" : large ? "xl:grid-cols-2" : ""}`}>
            <a href={waRequestLink(v)} target="_blank" rel="noopener noreferrer" onClick={trackWa} className="btn btn-primary">
              <MessageCircle /> Request This Vehicle
            </a>
            <Link href={`/book?vehicle=${v.slug}`} className="btn btn-secondary">
              Book Now <ArrowRight className="rtl:rotate-180" />
            </Link>
          </div>
          <Link
            href={`/fleet/${v.slug}`}
            className="mt-3 inline-flex min-h-9 items-center gap-1.5 text-sm font-semibold text-[#475569] transition-colors hover:text-[#15803D]"
          >
            View full specs &amp; gallery <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </Link>
        </div>
      </div>
    </article>
  );
}
