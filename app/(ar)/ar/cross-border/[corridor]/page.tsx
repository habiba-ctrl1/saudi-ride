import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Globe, MessageSquare, Mail, Users, Car, Info } from "lucide-react";
import { generateMetadata as seo } from "@/lib/seo";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { TLDRSummary } from "@/components/seo/TLDRSummary";
import WhatsAppQuoteForm from "@/components/booking/WhatsAppQuoteForm";
import { BorderJourney } from "@/components/cross-border/BorderJourney";
import { CorridorRouteCards } from "@/components/cross-border/CorridorRouteCards";
import { CrossBorderEssentials } from "@/components/cross-border/CrossBorderEssentials";
import { TripModes } from "@/components/cross-border/TripModes";
import { contactConfig } from "@/lib/config/contact";
import { CORRIDOR_HERO } from "@/lib/data/cross-border-images";
import { serviceSchema, faqSchema, itemListSchema, speakableSchema } from "@/lib/schema";
import { CORRIDORS, CORRIDOR_SLUGS, corridorRoutes, corridorRfqMailto, type CorridorSlug } from "@/lib/data/cross-border";
import { AR_CORRIDORS, AR_XB_ROUTE_SLUGS } from "@/lib/data/cross-border-ar";
import { AR_ROUTE_CONTENT_SLUGS } from "@/lib/data/routes-content-ar";

// Arabic corridor hubs (/ar/cross-border/[corridor]) — content in
// lib/data/cross-border-ar.ts, routes/distances from ROUTES_DATA via the
// English corridor definition. Added 2026-10-03.
export const dynamicParams = false;

export function generateStaticParams() {
  return CORRIDOR_SLUGS.map((corridor) => ({ corridor }));
}

type Props = { params: Promise<{ corridor: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { corridor } = await params;
  const a = AR_CORRIDORS[corridor as CorridorSlug];
  if (!a) return {};
  return seo({
    title: a.title,
    description: a.description,
    path: `/ar/cross-border/${corridor}`,
    locale: "ar",
    hreflangPaths: { en: `/cross-border/${corridor}`, ar: `/ar/cross-border/${corridor}` },
  });
}

export default async function ArCorridorPage({ params }: Props) {
  const { corridor } = await params;
  const c = CORRIDORS[corridor as CorridorSlug];
  const a = AR_CORRIDORS[corridor as CorridorSlug];
  if (!c || !a) notFound();

  const { outbound, inbound } = corridorRoutes(c);
  const all = [...outbound, ...inbound];
  const arSlugs = [...AR_XB_ROUTE_SLUGS, ...AR_ROUTE_CONTENT_SLUGS];
  const shortest = [...outbound].sort((x, y) => x.distance - y.distance)[0];
  const path = `/ar/cross-border/${c.slug}`;
  const waText =
    `السلام عليكم، أرغب بعرض سعر لنقل خاص عبر الحدود بين السعودية و${a.country}.\n\n` +
    `• من (المدينة / العنوان): \n• إلى (المدينة / العنوان): \n• التاريخ والوقت: \n• عدد الركاب والحقائب: \n• نوع السيارة (سيدان / SUV / فان): \n• نوع الرحلة (ذهاب / ذهاب وعودة): \n\nأرجو تأكيد التوفر والسعر الإجمالي.`;
  const waHref = `https://wa.me/${contactConfig.whatsappNumber}?text=${encodeURIComponent(waText)}`;
  const others = CORRIDOR_SLUGS.filter((s) => s !== c.slug);

  return (
    <div className="min-h-screen bg-[#FAFAF7] pb-24 text-[#1C1C1C]">
      <JsonLd
        data={[
          serviceSchema({ name: `نقل خاص ${a.pairLabel}`, description: a.description, path, serviceType: "نقل خاص عبر الحدود", areaServed: ["Saudi Arabia", c.country === "UAE" ? "United Arab Emirates" : c.country] }),
          itemListSchema(all.map((r) => ({ name: `${r.fromCityAr} إلى ${r.toCityAr}`, href: arSlugs.includes(r.slug) ? `/ar/routes/${r.slug}` : `/routes/${r.slug}` }))),
          faqSchema(a.faqs),
          speakableSchema({ path }),
        ]}
      />
      <Breadcrumbs items={[{ name: "الرئيسية", href: "/ar" }, { name: "التنقل عبر الحدود", href: "/services/border-crossings" }, { name: a.pairLabel, href: path }]} />

      {/* ─── HERO ─── */}
      <section className="section-container max-w-5xl pt-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-bl from-[#16A34A] via-[#15803D] to-[#116B32] p-7 sm:p-10">
          <div className="pointer-events-none absolute inset-y-0 end-0 hidden w-1/2 sm:block">
            <Image src={CORRIDOR_HERO[c.slug].src} alt={CORRIDOR_HERO[c.slug].altAr} fill priority sizes="(max-width: 640px) 0vw, 50vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-l from-[#16A34A] via-[#16A34A]/70 to-transparent" />
          </div>
          <div className="relative z-10 max-w-xl space-y-5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FACC15]/40 bg-[#FACC15]/15 px-3.5 py-1 text-xs font-bold text-[#FACC15]">
              <Globe className="h-3.5 w-3.5" aria-hidden /> {a.pairLabel}
            </span>
            <h1 className="font-heading text-3xl font-extrabold leading-tight text-[#FFFFFF] sm:text-4xl">{a.h1}</h1>
            <p className="text-sm leading-relaxed text-[#FFFFFF]/85 sm:text-base">سيارة خاصة محجوزة مسبقًا مع سائق محترف، من الباب إلى الباب عبر {a.crossingShort}. سعر ثابت مكتوب قبل الحجز ورسوم عبور السيارة مشمولة.</p>
            <div className="flex flex-wrap gap-3 pt-1">
              <a href="#corridor-quote" className="btn btn-accent btn-lg">اطلب عرض سعر <ArrowLeft className="h-4 w-4" aria-hidden /></a>
              <a href={waHref} target="_blank" rel="noopener noreferrer" className="btn btn-glass btn-lg"><MessageSquare className="h-4 w-4" aria-hidden /> تحقق من التوفر عبر واتساب</a>
            </div>
          </div>
        </div>
      </section>

      <div className="section-container mt-10 max-w-5xl space-y-12">
        <TLDRSummary
          label="إجابة سريعة"
          answer={a.quickAnswer}
          facts={[
            { label: "المنفذ", value: a.crossingShort },
            ...(shortest ? [{ label: "أقصر مسار", value: `${shortest.fromCityAr}: حوالي ${shortest.distance} كم` }] : []),
            { label: "المسارات", value: `${all.length} مسارًا` },
            { label: "السعر", value: "ثابت ومكتوب" },
          ]}
        />

        <section aria-labelledby="xb-routes" className="space-y-6">
          <div>
            <span className="t-eyebrow">المسارات</span>
            <h2 id="xb-routes" className="font-heading mt-1 text-2xl font-bold sm:text-3xl">مسارات النقل الخاص {a.pairLabel}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#6B7280]">المسافات ومدد القيادة لا تشمل وقت الحدود المتغير. لكل مسار صفحته وأسئلته ونموذج عرض السعر.</p>
          </div>
          <CorridorRouteCards heading={`من السعودية إلى ${a.country}`} routes={outbound} locale="ar" arSlugs={arSlugs} />
          <CorridorRouteCards heading={`من ${a.country} إلى السعودية`} routes={inbound} locale="ar" arSlugs={arSlugs} />
        </section>

        <section aria-labelledby="xb-overview" className="rounded-3xl border border-[#16A34A]/15 bg-white p-6 sm:p-8">
          <h2 id="xb-overview" className="font-heading text-2xl font-bold">لمن هذا المسار ومن أين ننطلق</h2>
          <div className="mt-4 space-y-4 text-[0.95rem] leading-relaxed text-[#475569]" style={{ maxWidth: "70ch" }}>
            {a.overview.map((p) => <p key={p}>{p}</p>)}
          </div>
        </section>

        <BorderJourney eyebrow="المنفذ الحدودي" heading={`ماذا يحدث عند ${a.crossingShort}`} stages={a.journey} />
        <div className="flex gap-3 rounded-2xl border border-[#16A34A]/20 bg-[#F0FDF4] p-4 text-sm leading-relaxed text-[#166534]">
          <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          <p>{a.crossingNote} مدة الإجراءات الحدودية غير مضمونة.</p>
        </div>

        <section aria-labelledby="xb-practical">
          <h2 id="xb-practical" className="font-heading text-2xl font-bold">ملاحظات عملية لرحلات {a.country}</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {a.practical.map((p) => (
              <div key={p.title} className="rounded-2xl border border-[#16A34A]/12 bg-white p-5">
                <h3 className="font-semibold">{p.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-[#6B7280]">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="xb-who" className="grid gap-5 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 id="xb-who" className="font-heading flex items-center gap-2 text-2xl font-bold"><Users className="h-5 w-5 text-[#16A34A]" aria-hidden /> من يحجز هذه الرحلات</h2>
            <ul className="mt-4 space-y-3">
              {a.useCases.map((u) => (
                <li key={u.title} className="rounded-2xl border border-[#16A34A]/12 bg-white p-4 text-sm leading-relaxed text-[#475569]"><span className="font-semibold text-[#1C1C1C]">{u.title}.</span> {u.desc}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-[#16A34A]/15 bg-white p-6">
            <h2 className="font-heading flex items-center gap-2 text-xl font-bold"><Car className="h-5 w-5 text-[#16A34A]" aria-hidden /> فئات السيارات</h2>
            <ul className="mt-3 space-y-2 text-sm text-[#475569]">
              <li><span className="font-semibold text-[#1C1C1C]">سيدان تنفيذية</span> — حتى 3 ركاب</li>
              <li><span className="font-semibold text-[#1C1C1C]">SUV كبيرة</span> — للعائلات والأمتعة الأكثر</li>
              <li><span className="font-semibold text-[#1C1C1C]">فان</span> — للمجموعات والأمتعة الكثيرة</li>
              <li><span className="font-semibold text-[#1C1C1C]">كوستر</span> — للوفود عند الطلب</li>
            </ul>
            <p className="mt-3 text-xs leading-relaxed text-[#6B7280]">السيارات من شبكة شركائنا المعتمدين، ونؤكد أهلية سيارة موعدك للعبور قبل إرسال السعر.</p>
          </div>
        </section>

        {a.tradeOff && (
          <section aria-labelledby="xb-tradeoff" className="rounded-3xl border border-[#16A34A]/15 bg-white p-6 sm:p-8">
            <h2 id="xb-tradeoff" className="font-heading text-2xl font-bold">{a.tradeOff.heading}</h2>
            <div className="mt-4 space-y-3 text-[0.95rem] leading-relaxed text-[#475569]" style={{ maxWidth: "70ch" }}>
              {a.tradeOff.body.map((p) => <p key={p}>{p}</p>)}
            </div>
          </section>
        )}

        {c.borderDrop && <TripModes destination={a.country} crossing="الحدود" locale="ar" />}

        <CrossBorderEssentials locale="ar" />

        <section aria-labelledby="xb-faq">
          <h2 id="xb-faq" className="font-heading text-2xl font-bold">أسئلة عن النقل إلى {a.country}</h2>
          <div className="mt-5 space-y-3">
            {a.faqs.map((f) => (
              <details key={f.question} className="rounded-2xl border border-[#16A34A]/12 bg-white p-5 open:border-[#16A34A]/35">
                <summary className="cursor-pointer list-none font-semibold marker:hidden"><h3 className="inline">{f.question}</h3></summary>
                <p className="mt-2 text-sm leading-relaxed text-[#475569]">{f.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section id="corridor-quote" aria-labelledby="xb-quote" className="scroll-mt-24 rounded-3xl border border-[#16A34A]/20 bg-[#F0FDF4] p-5 sm:p-8">
          <div className="mx-auto mb-6 max-w-2xl text-center">
            <h2 id="xb-quote" className="font-heading text-2xl font-bold sm:text-3xl">خطط لرحلتك الخاصة إلى {a.country}</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">أرسل المسار والتاريخ، ونؤكد سيارة مؤهلة ونرسل لك سعرًا ثابتًا واحدًا عبر واتساب. يحمل كل راكب وثائق سفره السارية.</p>
          </div>
          <WhatsAppQuoteForm defaultDropoff={a.country} forceLocale="ar" showNotes />
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a href={corridorRfqMailto(contactConfig.email, c)} className="btn btn-secondary btn-lg"><Mail className="h-4 w-4" aria-hidden /> طلب عرض سعر للشركات بالبريد</a>
            <p className="max-w-xs text-center text-xs leading-relaxed text-[#6B7280]">عروض أسعار مكتوبة للشركات والوفود. يمكن ترتيب فواتير الشركات عبر شركتنا الشقيقة.</p>
          </div>
        </section>

        <section aria-labelledby="xb-related">
          <h2 id="xb-related" className="font-heading text-xl font-bold">ممرات عبور أخرى</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {others.map((s) => (
              <li key={s}>
                <Link href={`/ar/cross-border/${s}`} className="inline-flex items-center gap-1 text-sm font-semibold text-[#16A34A] hover:underline">
                  من السعودية إلى {AR_CORRIDORS[s].country} عبر {AR_CORRIDORS[s].crossingShort} <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
                </Link>
              </li>
            ))}
            <li>
              <Link href={`/cross-border/${c.slug}`} className="inline-flex items-center gap-1 text-sm font-semibold text-[#16A34A] hover:underline">English version <ArrowLeft className="h-3.5 w-3.5" aria-hidden /></Link>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
