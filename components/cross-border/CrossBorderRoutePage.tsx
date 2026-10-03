import Link from "next/link";
import Image from "next/image";
import { routeHeroImage, VEHICLE_IMAGES } from "@/lib/data/cross-border-images";
import {
  ArrowRight, MapPin, Clock, ShieldCheck, Flag, Route as RouteIcon, MessageCircle, Mail,
  CheckCircle2, Car, Users, Lightbulb, FileCheck2, ArrowLeftRight,
} from "lucide-react";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { TLDRSummary } from "@/components/seo/TLDRSummary";
import WhatsAppQuoteForm from "@/components/booking/WhatsAppQuoteForm";
import { formatDrive } from "@/components/cross-border/CorridorRouteCards";
import { TripModes } from "@/components/cross-border/TripModes";
import { contactConfig } from "@/lib/config/contact";
import { serviceSchema, faqSchema, speakableSchema } from "@/lib/schema";
import { ROUTES_DATA } from "@/lib/data/routes";
import { CORRIDORS, CROSS_BORDER_DOCUMENTS, crossBorderWhatsAppText, corridorRfqMailto, placeWithCountry, isSaudiSide } from "@/lib/data/cross-border";
import { AR_CORRIDORS, AR_DOCUMENTS, AR_XB_ROUTE_SLUGS, arDrive, arPlace, arWhatsAppText } from "@/lib/data/cross-border-ar";
import { AR_ROUTE_CONTENT_SLUGS } from "@/lib/data/routes-content-ar";
import type { CrossBorderRoutePageData, RouteStage } from "@/lib/data/cross-border-route-pages";

// Bespoke cross-border route page (EN + AR). Content per route lives in
// lib/data/cross-border-route-pages.ts (EN) and lib/data/cross-border-ar.ts
// (AR); distance/time always from ROUTES_DATA. EN H1 is "<from> to <to>" —
// identical to the old template (CLAUDE.md rule 3).

type Locale = "en" | "ar";

const STAGE_ICON = { origin: MapPin, road: RouteIcon, border: ShieldCheck, destination: Flag } as const;

// UI strings. Facts in INCLUDED are confirmed in seo/facts.md (2026-10-01/03).
const UI = {
  en: {
    home: "Home", borders: "Border Crossings", to: "to", getQuote: "Get your quote", waRoute: "WhatsApp this route",
    km: (n: number) => `~${n.toLocaleString("en-US")} km`, drivePlus: (m: number) => `~${formatDrive(m)} driving + border`, drive: (m: number) => `~${formatDrive(m)}`,
    distance: "Distance", driving: "Driving", crossing: "Crossing", bestFor: "Best for",
    journeyEyebrow: "The journey", journeyH: (l: string) => `${l}, stop by stop`, start: "Start", kmMark: (n: number) => `≈ km ${n}`,
    borderNote: (c: string) => `Every passenger completes their own exit and entry checks at ${c}. Border processing time varies and is never guaranteed, so we build margin into the pickup time.`,
    pickupCols: ["Pickup point", "Distance", "Driving"], pickupNote: "Driving time only; border time is extra. Measured road distances — your quote uses your exact pickup address.",
    who: "Who books this route", vehicles: "Choose your vehicle", quote: "Quote",
    vehicleNote: "Vehicles come from our vetted partner network. The car for your date is confirmed as eligible to cross before we send the fare.",
    tips: "Planning tips for this route", included: "Included in your fare",
    INCLUDED: ["One fixed fare in writing — no meter, no surge", "Border crossing fees for the vehicle included in the fare", "15–30 minutes of free waiting on every trip", "English- and Arabic-speaking drivers", "Free cancellation up to 24 hours before pickup", "Pay cash to the driver or by bank transfer"],
    VEHICLES: [
      { key: "Sedan", name: "Executive sedan", fit: "Solo travellers and couples, business trips" },
      { key: "VIP SUV", name: "Full-size SUV", fit: "Families, more luggage, long desert stretches" },
      { key: "Van", name: "Van", fit: "Groups and heavy luggage" },
    ],
    docsH: (c: string) => `Documents for ${c}`, faqH: (l: string) => `${l}: your questions`,
    quoteH: (l: string) => `Get your ${l} quote`, quoteP: "Send the details. We confirm an eligible vehicle and reply on WhatsApp with one fixed fare, border crossing fees included.",
    submit: "Get my cross-border quote", orWa: "Or message us on WhatsApp", rfq: "Company? Email an RFQ", invoicing: "Corporate invoicing can be arranged through our sister company.",
    related: "Related routes", ret: "Return", more: (p: string) => `More ${p} transfers`, allRoutes: (c: string) => `All Saudi Arabia – ${c} routes & border guide`,
    stickyQuote: "Get quote",
  },
  ar: {
    home: "الرئيسية", borders: "التنقل عبر الحدود", to: "إلى", getQuote: "اطلب عرض السعر", waRoute: "واتساب لهذا المسار",
    km: (n: number) => `حوالي ${n.toLocaleString("en-US")} كم`, drivePlus: (m: number) => `${arDrive(m)} قيادة + الحدود`, drive: (m: number) => arDrive(m),
    distance: "المسافة", driving: "مدة القيادة", crossing: "المنفذ", bestFor: "مناسب لـ",
    journeyEyebrow: "الرحلة", journeyH: (l: string) => `${l} محطة بمحطة`, start: "الانطلاق", kmMark: (n: number) => `≈ كم ${n}`,
    borderNote: (c: string) => `يُنهي كل راكب إجراءات الخروج والدخول بنفسه في ${c}. مدة الإجراءات الحدودية متغيرة وغير مضمونة، لذلك نترك هامشًا كافيًا في وقت الانطلاق.`,
    pickupCols: ["نقطة الانطلاق", "المسافة", "مدة القيادة"], pickupNote: "مدة القيادة فقط دون وقت الحدود. مسافات طرق مُقاسة — عرض السعر يعتمد على عنوانك الدقيق.",
    who: "من يحجز هذا المسار", vehicles: "اختر السيارة", quote: "عرض سعر",
    vehicleNote: "السيارات من شبكة شركائنا المعتمدين، ونؤكد أن السيارة المخصصة لموعدك مؤهلة لعبور الحدود قبل إرسال السعر.",
    tips: "نصائح التخطيط لهذا المسار", included: "يشمل السعر",
    INCLUDED: ["سعر ثابت مكتوب — بلا عداد وبلا زيادة", "رسوم عبور الحدود للسيارة مشمولة في السعر", "انتظار مجاني من 15 إلى 30 دقيقة في كل رحلة", "سائقون يتحدثون العربية والإنجليزية", "إلغاء مجاني حتى 24 ساعة قبل موعد الانطلاق", "الدفع نقدًا للسائق أو بتحويل بنكي"],
    VEHICLES: [
      { key: "Sedan", name: "سيدان تنفيذية", fit: "للأفراد والأزواج ورحلات العمل" },
      { key: "VIP SUV", name: "سيارة SUV كبيرة", fit: "للعائلات والأمتعة الأكثر والمسافات الصحراوية الطويلة" },
      { key: "Van", name: "فان", fit: "للمجموعات والأمتعة الكثيرة" },
    ],
    docsH: (c: string) => `الوثائق المطلوبة عند ${c}`, faqH: (l: string) => `${l}: أسئلتكم`,
    quoteH: (l: string) => `اطلب عرض سعر ${l}`, quoteP: "أرسل التفاصيل، ونؤكد سيارة مؤهلة للعبور ونرسل لك سعرًا ثابتًا واحدًا عبر واتساب يشمل رسوم عبور الحدود.",
    submit: "اطلب عرض سعر الرحلة", orWa: "أو راسلنا عبر واتساب", rfq: "شركة؟ أرسل طلب عرض سعر بالبريد", invoicing: "يمكن ترتيب فواتير الشركات عبر شركتنا الشقيقة.",
    related: "مسارات ذات صلة", ret: "رحلة العودة", more: (p: string) => `مسارات أخرى ${p}`, allRoutes: (c: string) => `جميع مسارات السعودية – ${c} ودليل المنافذ`,
    stickyQuote: "عرض سعر",
  },
} as const;

// Short node label: places for ends/borders, the stage label for road stages.
function ribbonLabel(s: RouteStage): string {
  const base = (s.kind === "road" ? s.label : s.title).split(" → ")[0].split(" (")[0].split(",")[0].split("،")[0];
  return base.length > 16 ? base.split(" ").slice(0, 2).join(" ") : base;
}

function RouteRibbon({ stages: input, rtl = false }: { stages: RouteStage[]; rtl?: boolean }) {
  // In Arabic the journey reads right-to-left, so draw the nodes reversed.
  const stages = rtl ? [...input].reverse() : input;
  // Decorative-but-informative ribbon: one node per stage, border nodes in
  // yellow. Hidden from assistive tech — the ordered timeline below carries
  // the same information as text. Order follows reading direction.
  const n = stages.length;
  return (
    <svg viewBox="0 0 600 70" className="h-auto w-full" aria-hidden role="presentation">
      <line x1="20" y1="28" x2="580" y2="28" stroke="#FFFFFF" strokeOpacity="0.35" strokeWidth="2" strokeDasharray="6 6" />
      {stages.map((s, i) => {
        const x = 20 + (560 * i) / Math.max(1, n - 1);
        const border = s.kind === "border";
        const end = s.kind === "origin" || s.kind === "destination";
        return (
          <g key={i}>
            <circle cx={x} cy={28} r={end ? 9 : 6} fill={border ? "#FACC15" : end ? "#FFFFFF" : "#86EFAC"} />
            <text x={x} y={58} textAnchor={i === 0 ? "start" : i === n - 1 ? "end" : "middle"} fontSize="12" fill="#FFFFFF" fillOpacity="0.85">
              {ribbonLabel(s)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function CrossBorderRoutePage({ data, locale = "en" }: { data: CrossBorderRoutePageData; locale?: Locale }) {
  const t = UI[locale];
  const ar = locale === "ar";
  const route = ROUTES_DATA.find((r) => r.slug === data.slug)!;
  const corridor = CORRIDORS[data.corridorSlug];
  const arC = AR_CORRIDORS[data.corridorSlug];
  const from = ar ? route.fromCityAr : route.fromCity;
  const to = ar ? route.toCityAr : route.toCity;
  const arSlugs = new Set<string>([...AR_XB_ROUTE_SLUGS, ...AR_ROUTE_CONTENT_SLUGS]);
  const routeHref = (slug: string) => (ar && arSlugs.has(slug) ? `/ar/routes/${slug}` : `/routes/${slug}`);
  const path = ar ? `/ar/routes/${data.slug}` : `/routes/${data.slug}`;
  const label = `${from} ${t.to} ${to}`;
  const pairLabel = ar ? arC.pairLabel : corridor.pairLabel.replace("↔", "–");
  const country = ar ? arC.country : corridor.country;
  const hubHref = ar ? `/ar/cross-border/${corridor.slug}` : `/cross-border/${corridor.slug}`;
  const outbound = isSaudiSide(route.fromCity, corridor);
  const waText = ar
    ? arWhatsAppText(arPlace(route.fromCityAr, outbound), arPlace(route.toCityAr, !outbound), corridor.borderDrop && outbound)
    : crossBorderWhatsAppText(route.fromCity, route.toCity, corridor);
  const waHref = `https://wa.me/${contactConfig.whatsappNumber}?text=${encodeURIComponent(waText)}`;
  const vehicleLine = ar ? "• نوع السيارة (سيدان / SUV / فان): " : "• Vehicle (Sedan / SUV / Van): ";
  const reverse = ROUTES_DATA.find((r) => r.fromCity === route.toCity && r.toCity === route.fromCity);
  const siblings = [...corridor.outbound, ...corridor.inbound]
    .filter((s) => s !== data.slug && s !== reverse?.slug && !data.related.some((r) => r.href.endsWith(`/routes/${s}`)))
    .map((s) => ROUTES_DATA.find((r) => r.slug === s))
    .filter(Boolean)
    .slice(0, 4) as typeof ROUTES_DATA;
  const docs = ar ? AR_DOCUMENTS : CROSS_BORDER_DOCUMENTS;
  const hero = routeHeroImage(route.fromCity, route.toCity);

  return (
    <div className="min-h-screen bg-[#FAFAF7] pb-28 text-[#1C1C1C] lg:pb-16">
      <JsonLd
        data={[
          serviceSchema({
            name: ar ? `نقل خاص ${label}` : `${label} private transfer`,
            description: data.quickAnswer,
            path,
            serviceType: ar ? "نقل خاص عبر الحدود" : "Private cross-border transfer",
            areaServed: ["Saudi Arabia", corridor.country],
          }),
          faqSchema(data.faqs),
          speakableSchema({ path }),
        ]}
      />
      <Breadcrumbs
        items={[
          { name: t.home, href: ar ? "/ar" : "/" },
          { name: t.borders, href: "/services/border-crossings" },
          { name: pairLabel, href: hubHref },
          { name: label, href: path },
        ]}
      />

      {/* ─── HERO ─── */}
      <section className="section-container max-w-5xl pt-3">
        <div className="relative overflow-hidden rounded-[28px] bg-[radial-gradient(120%_140%_at_0%_0%,#166534_0%,#0F2E1C_55%,#0B1F14_100%)] p-6 sm:p-10">
          {hero && (
            <>
              <Image src={hero.src} alt={ar ? hero.altAr : hero.alt} fill priority sizes="(max-width: 1024px) 100vw, 1024px" className="object-cover" />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-[#0B1F14]/95 via-[#0F2E1C]/85 to-[#0F2E1C]/45 rtl:bg-gradient-to-l" />
            </>
          )}
          <div aria-hidden className="pointer-events-none absolute -end-24 -top-24 h-72 w-72 rounded-full bg-[#FACC15]/10 blur-3xl" />
          <div className="relative z-10 space-y-5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FACC15]/40 bg-[#FACC15]/10 px-3.5 py-1 text-[0.65rem] font-bold uppercase tracking-widest text-[#FACC15]">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden /> {data.eyebrow}
            </span>
            <h1 className="font-heading max-w-3xl text-3xl font-extrabold leading-tight tracking-tight text-[#FFFFFF] sm:text-5xl">
              {from} <span className="text-[#FACC15]">{t.to}</span> {to}
              {data.h1Suffix ?? ""}
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-[#FFFFFF]/85 sm:text-base">{data.lead}</p>

            <div className="flex flex-wrap gap-2.5">
              {[
                { icon: MapPin, text: t.km(route.distance) },
                { icon: Clock, text: t.drivePlus(route.duration) },
                { icon: ShieldCheck, text: data.crossing.name },
              ].map(({ icon: Icon, text }) => (
                <span key={text} className="inline-flex items-center gap-2 rounded-xl border border-[#FFFFFF]/15 bg-[#FFFFFF]/10 px-3.5 py-2 text-xs font-semibold text-[#FFFFFF]">
                  <Icon className="h-4 w-4 text-[#FACC15]" aria-hidden /> {text}
                </span>
              ))}
            </div>

            <div className="hidden pt-2 sm:block">
              <RouteRibbon stages={data.stages} rtl={ar} />
            </div>

            <div className="flex flex-wrap gap-3 pt-1">
              <a href="#route-quote" className="btn btn-accent btn-lg">
                {t.getQuote} <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden />
              </a>
              <a href={waHref} target="_blank" rel="noopener noreferrer" className="btn btn-glass btn-lg">
                <MessageCircle className="h-4 w-4" aria-hidden /> {t.waRoute}
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="section-container mt-10 max-w-5xl space-y-12">
        {/* ─── QUICK ANSWER ─── */}
        <TLDRSummary
          label={ar ? "إجابة سريعة" : undefined}
          answer={data.quickAnswer}
          facts={[
            { label: t.distance, value: t.km(route.distance) },
            { label: t.driving, value: t.drive(route.duration) },
            { label: t.crossing, value: data.crossing.name },
            { label: t.bestFor, value: data.bestFor },
          ]}
        />

        {/* ─── JOURNEY TIMELINE ─── */}
        <section aria-labelledby="rt-journey" className="rounded-3xl border border-[#16A34A]/15 bg-white p-6 sm:p-8">
          <span className="t-eyebrow">{t.journeyEyebrow}</span>
          <h2 id="rt-journey" className="font-heading mt-1 text-2xl font-bold sm:text-3xl">{t.journeyH(label)}</h2>
          <ol className="mt-6 space-y-0">
            {data.stages.map((s, i) => {
              const Icon = STAGE_ICON[s.kind];
              const last = i === data.stages.length - 1;
              return (
                <li key={i} className="relative flex gap-4 pb-6 last:pb-0">
                  {!last && <span aria-hidden className="absolute start-[1.15rem] top-10 bottom-0 w-0 border-s-2 border-dashed border-[#16A34A]/25" />}
                  <span
                    className={`relative z-[1] flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                      s.kind === "border" ? "bg-[#FACC15]/25 text-[#854D0E]" : s.kind === "road" ? "bg-[#F0FDF4] text-[#15803D]" : "bg-[#16A34A] text-[#FFFFFF]"
                    }`}
                  >
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                      <p className="text-[0.65rem] font-bold uppercase tracking-wider text-[#6B7280]">{s.label}</p>
                      {typeof s.km === "number" && <p className="text-xs font-semibold text-[#15803D]">{s.km === 0 ? t.start : t.kmMark(s.km)}</p>}
                    </div>
                    <p className="font-semibold text-[#1C1C1C]">{s.title}</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-[#6B7280]">{s.desc}</p>
                  </div>
                </li>
              );
            })}
          </ol>
          <p className="mt-6 rounded-2xl bg-[#F0FDF4] p-4 text-sm leading-relaxed text-[#166534]">{t.borderNote(data.crossing.name)}</p>
        </section>

        {data.pickupPoints && (
          <section aria-labelledby="rt-pickups" className="rounded-3xl border border-[#16A34A]/15 bg-white p-6 sm:p-8">
            <h2 id="rt-pickups" className="font-heading text-2xl font-bold">{data.pickupPoints.heading}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#6B7280]">{data.pickupPoints.intro}</p>
            <div className="mt-4 overflow-hidden rounded-2xl border border-[#16A34A]/12">
              <table className="w-full text-start text-sm">
                <thead className="bg-[#F0FDF4] text-xs uppercase tracking-wider text-[#15803D]">
                  <tr>{t.pickupCols.map((c) => <th key={c} scope="col" className="px-4 py-3 text-start">{c}</th>)}</tr>
                </thead>
                <tbody>
                  {data.pickupPoints.rows.map((r) => (
                    <tr key={r.name} className="border-t border-[#16A34A]/10">
                      <th scope="row" className="px-4 py-3 text-start font-semibold">{r.name}</th>
                      <td className="px-4 py-3">{t.km(r.km)}</td>
                      <td className="px-4 py-3">~{r.drive}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-[#6B7280]">{t.pickupNote}</p>
          </section>
        )}

        {corridor.borderDrop && outbound && (
          <TripModes destination={to} crossing={data.crossing.name} locale={locale} />
        )}

        {/* ─── DROP-OFFS ─── */}
        <section aria-labelledby="rt-dropoffs">
          <h2 id="rt-dropoffs" className="font-heading text-2xl font-bold sm:text-3xl">{data.dropoffs.heading}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#6B7280]">{data.dropoffs.intro}</p>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {data.dropoffs.points.map((p) => (
              <li key={p.name} className="rounded-2xl border border-[#16A34A]/12 bg-white p-5">
                <p className="flex items-center gap-2 font-semibold"><Flag className="h-4 w-4 text-[#16A34A]" aria-hidden /> {p.name}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-[#6B7280]">{p.desc}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* ─── WHO BOOKS + VEHICLE FIT ─── */}
        <section aria-labelledby="rt-who" className="grid gap-5 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <h2 id="rt-who" className="font-heading flex items-center gap-2 text-2xl font-bold">
              <Users className="h-5 w-5 text-[#16A34A]" aria-hidden /> {t.who}
            </h2>
            <ul className="mt-4 space-y-3">
              {data.whoBooks.map((w) => (
                <li key={w.title} className="rounded-2xl border border-[#16A34A]/12 bg-white p-4 text-sm leading-relaxed text-[#475569]">
                  <span className="font-semibold text-[#1C1C1C]">{w.title}.</span> {w.desc}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-[#16A34A]/15 bg-white p-5 sm:p-6 lg:col-span-2">
            <h2 className="font-heading flex items-center gap-2 text-xl font-bold">
              <Car className="h-5 w-5 text-[#16A34A]" aria-hidden /> {t.vehicles}
            </h2>
            <ul className="mt-4 space-y-3">
              {t.VEHICLES.map((v) => (
                <li key={v.key} className="flex items-center justify-between gap-3 rounded-2xl bg-[#FAFAF7] p-3">
                  {VEHICLE_IMAGES[v.key] && (
                    <span className="relative h-12 w-16 shrink-0 overflow-hidden rounded-xl">
                      <Image src={VEHICLE_IMAGES[v.key].src} alt={ar ? VEHICLE_IMAGES[v.key].altAr : VEHICLE_IMAGES[v.key].alt} fill sizes="64px" className="object-cover" />
                    </span>
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold">{v.name}</span>
                    <span className="block text-xs text-[#6B7280]">{v.fit}</span>
                  </span>
                  <a
                    href={`https://wa.me/${contactConfig.whatsappNumber}?text=${encodeURIComponent(waText.replace(vehicleLine, (ar ? "• نوع السيارة: " : "• Vehicle: ") + v.name))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${t.quote} — ${v.name}, ${label}`}
                    className="inline-flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-full bg-[#16A34A] px-3.5 text-xs font-bold text-[#FFFFFF] hover:bg-[#15803D]"
                  >
                    <MessageCircle className="h-3.5 w-3.5" aria-hidden /> {t.quote}
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs leading-relaxed text-[#6B7280]">{t.vehicleNote}</p>
          </div>
        </section>

        {/* ─── TIPS + INCLUDED ─── */}
        <section aria-label={t.tips} className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-3xl border border-[#16A34A]/15 bg-white p-6">
            <h2 className="font-heading flex items-center gap-2 text-xl font-bold">
              <Lightbulb className="h-5 w-5 text-[#A16207]" aria-hidden /> {t.tips}
            </h2>
            <ul className="mt-4 space-y-3">
              {data.tips.map((x) => (
                <li key={x.title} className="text-sm leading-relaxed text-[#475569]">
                  <span className="font-semibold text-[#1C1C1C]">{x.title}.</span> {x.desc}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-[#16A34A]/20 bg-[#F0FDF4] p-6">
            <h2 className="font-heading flex items-center gap-2 text-xl font-bold">
              <CheckCircle2 className="h-5 w-5 text-[#16A34A]" aria-hidden /> {t.included}
            </h2>
            <ul className="mt-4 space-y-2.5">
              {t.INCLUDED.map((i) => (
                <li key={i} className="flex gap-2.5 text-sm text-[#166534]">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden /> {i}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {data.tradeOff && (
          <section aria-labelledby="rt-tradeoff" className="rounded-3xl border border-[#16A34A]/15 bg-white p-6 sm:p-8">
            <h2 id="rt-tradeoff" className="font-heading text-2xl font-bold">{data.tradeOff.heading}</h2>
            <div className="mt-3 space-y-3 text-[0.95rem] leading-relaxed text-[#475569]" style={{ maxWidth: "70ch" }}>
              {data.tradeOff.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </section>
        )}

        {/* ─── DOCUMENTS ─── */}
        <section aria-labelledby="rt-docs" className="rounded-3xl border border-[#FACC15]/40 bg-[#FEFCE8] p-6">
          <h2 id="rt-docs" className="font-heading flex items-center gap-2 text-xl font-bold">
            <FileCheck2 className="h-5 w-5 text-[#A16207]" aria-hidden /> {t.docsH(data.crossing.name)}
          </h2>
          <ul className="mt-3 space-y-2">
            {docs.map((d) => (
              <li key={d} className="flex gap-2 text-sm leading-relaxed text-[#475569]">
                <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#A16207]" /> {d}
              </li>
            ))}
          </ul>
        </section>

        {/* ─── FAQ ─── */}
        <section aria-labelledby="rt-faq">
          <h2 id="rt-faq" className="font-heading text-2xl font-bold sm:text-3xl">{t.faqH(label)}</h2>
          <div className="mt-5 space-y-3">
            {data.faqs.map((f) => (
              <details key={f.question} className="rounded-2xl border border-[#16A34A]/12 bg-white p-5 open:border-[#16A34A]/35">
                <summary className="cursor-pointer list-none font-semibold marker:hidden">
                  <h3 className="inline">{f.question}</h3>
                </summary>
                <p className="mt-2 text-sm leading-relaxed text-[#475569]">{f.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ─── BOOKING (Path A + Path B) ─── */}
        <section id="route-quote" aria-labelledby="rt-quote" className="scroll-mt-24 rounded-3xl border border-[#16A34A]/20 bg-[#F0FDF4] p-5 sm:p-8">
          <div className="mx-auto mb-6 max-w-2xl text-center">
            <h2 id="rt-quote" className="font-heading text-2xl font-bold sm:text-3xl">{t.quoteH(label)}</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">{t.quoteP}</p>
          </div>
          {ar ? (
            <WhatsAppQuoteForm defaultPickup={from} defaultDropoff={to} forceLocale="ar" showNotes />
          ) : (
            <WhatsAppQuoteForm
              defaultPickup={from}
              defaultDropoff={to}
              pickupPlaceholder={`Pickup address in ${from}`}
              dropoffPlaceholder={`Drop-off address in ${to}`}
              messageIntro={`Hello, I'd like a quote for a private cross-border transfer from ${placeWithCountry(route.fromCity, corridor)} to ${placeWithCountry(route.toCity, corridor)}.`}
              showNotes
              submitLabel={t.submit}
            />
          )}
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a href={waHref} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp btn-lg">
              <MessageCircle className="h-4 w-4" aria-hidden /> {t.orWa}
            </a>
            <a href={corridorRfqMailto(contactConfig.email, corridor, `${route.fromCity} to ${route.toCity}`)} className="btn btn-secondary btn-lg">
              <Mail className="h-4 w-4" aria-hidden /> {t.rfq}
            </a>
          </div>
          <p className="mt-3 text-center text-xs text-[#6B7280]">{t.invoicing}</p>
        </section>

        {/* ─── RELATED ─── */}
        <section aria-labelledby="rt-related" className="grid gap-6 md:grid-cols-2">
          <div>
            <h2 id="rt-related" className="font-heading text-xl font-bold">{t.related}</h2>
            <ul className="mt-3 space-y-2">
              {reverse && !data.related.some((r) => r.href.endsWith(`/routes/${reverse.slug}`)) && (
                <li>
                  <Link href={routeHref(reverse.slug)} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#16A34A] hover:underline">
                    <ArrowLeftRight className="h-3.5 w-3.5" aria-hidden /> {t.ret}: {ar ? reverse.fromCityAr : reverse.fromCity} {t.to} {ar ? reverse.toCityAr : reverse.toCity}
                  </Link>
                </li>
              )}
              {data.related.map((r) => (
                <li key={r.href}>
                  <Link href={r.href} className="inline-flex items-center gap-1 text-sm font-semibold text-[#16A34A] hover:underline">
                    {r.label} <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-heading text-xl font-bold">{t.more(pairLabel)}</h2>
            <ul className="mt-3 space-y-2">
              {siblings.map((r) => (
                <li key={r.slug}>
                  <Link href={routeHref(r.slug)} className="flex items-baseline justify-between gap-3 text-sm hover:text-[#16A34A]">
                    <span className="font-semibold">{ar ? r.fromCityAr : r.fromCity} {t.to} {ar ? r.toCityAr : r.toCity}</span>
                    <span className="shrink-0 text-xs text-[#6B7280]">{t.km(r.distance)}</span>
                  </Link>
                </li>
              ))}
              <li>
                <Link href={hubHref} className="inline-flex items-center gap-1 text-sm font-bold text-[#16A34A] hover:underline">
                  {t.allRoutes(country)} <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden />
                </Link>
              </li>
            </ul>
          </div>
        </section>
      </div>

      {/* ─── MOBILE STICKY CTA ─── */}
      {/* pe-20 keeps clear of the site-wide floating WhatsApp button (bottom end corner). */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#16A34A]/15 bg-[#FFFFFF]/95 py-3 ps-4 pe-20 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur lg:hidden">
        <div className="flex items-center gap-2">
          <a href="#route-quote" className="btn btn-primary flex-1 justify-center whitespace-nowrap">{t.stickyQuote}</a>
          <a href={waHref} target="_blank" rel="noopener noreferrer" aria-label={`WhatsApp — ${label}`} className="btn btn-whatsapp flex-1 justify-center">
            <MessageCircle className="h-4 w-4" aria-hidden /> WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
