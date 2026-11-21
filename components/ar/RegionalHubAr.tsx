import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Check, MessageCircle, Mail, MapPin } from "lucide-react";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqSchema, speakableSchema, itemListSchema } from "@/lib/schema";
import { contactConfig } from "@/lib/config/contact";
import { routeFact } from "@/lib/data/cluster";
import { FLEET_VEHICLES } from "@/lib/fleet-data";
import { Head, Facts, Faqs, Quote, wa, BTN_PRIMARY, BTN_GHOST } from "@/components/ar/AlulaArabic";
import { arRouteHref, kmAr, durAr, CORP_AR_R, type ArHubConfig } from "@/lib/data/regional-hubs-ar";

const SITE = "https://taxisaudiarabia.com";
const GREEN = "inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[#16A34A] px-6 text-xs font-bold text-[#FFFFFF] hover:bg-[#15803D]";
const OUTLINE = "inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-[#16A34A]/30 px-6 text-xs font-bold text-[#15803D] hover:bg-[#F0FDF4]";
const PATTERN: React.CSSProperties = {
  backgroundImage: "radial-gradient(rgba(250,204,21,0.14) 1px, transparent 1px), radial-gradient(circle at 15% 20%, rgba(22,163,74,0.35), transparent 55%)",
  backgroundSize: "22px 22px, 100% 100%",
};

// Arabic hub for secondary cities (Dammam, Jubail, Yanbu — 2026-11-22).
// All copy comes from lib/data/regional-hubs-ar.ts; layout mirrors the
// existing Arabic hubs (MakkahArabic / AlulaArabic) and reuses their UI.
export function RegionalHubAr({ c }: { c: ArHubConfig }) {
  const corridors = c.corridors.map((r) => ({ ...r, f: routeFact(r.slug) })).filter((r) => r.f);
  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "TaxiService",
      "@id": `${SITE}${c.path}#service`,
      name: c.schemaName,
      inLanguage: "ar",
      description: c.schemaDescription,
      url: `${SITE}${c.path}`,
      provider: { "@type": "Organization", name: "تاكسي السعودية", url: SITE },
      areaServed: { "@type": "City", name: c.nameAr, geo: { "@type": "GeoCoordinates", latitude: c.geo.lat, longitude: c.geo.lng } },
      availableLanguage: ["Arabic", "English"],
    },
    speakableSchema({ path: c.path }),
    itemListSchema(corridors.map((r) => ({ name: r.label, href: arRouteHref(r.slug) }))),
    faqSchema(c.faqs),
  ];

  return (
    <div dir="rtl" lang="ar" className="min-h-screen bg-[#FAFAF7] text-[#1C1C1C]">
      <JsonLd data={schema} />

      <section className="relative isolate overflow-hidden bg-[#0B1F14]">
        {c.hero ? (
          <>
            <Image src={c.hero.src} alt={c.hero.alt} fill priority sizes="100vw" className="-z-10 object-cover object-[30%_60%]" />
            <div className="absolute inset-0 -z-10 bg-gradient-to-l from-[#0B1F14] via-[#0B1F14]/85 to-[#0B1F14]/30" aria-hidden="true" />
          </>
        ) : (
          <div aria-hidden="true" className="absolute inset-0 -z-10" style={PATTERN} />
        )}
        <Breadcrumbs className="relative [&_a]:text-white/70 [&_a:hover]:text-white [&_span]:text-[#FACC15]" items={[{ name: "الرئيسية", href: "/ar" }, { name: c.nameAr, href: c.path }]} />
        <div className="section-container relative max-w-6xl pb-16 pt-6 md:pb-24 md:pt-10">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3.5 py-1.5 text-xs font-bold text-[#FACC15] backdrop-blur"><MapPin className="h-3.5 w-3.5" aria-hidden="true" /> {c.eyebrow}</p>
            <h1 className="mt-5 font-heading text-[2.1rem] font-bold leading-[1.15] text-[#FFFFFF] sm:text-5xl md:text-[3.2rem]">{c.h1}</h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-white/85 md:text-lg">{c.lede}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#quote" className={BTN_PRIMARY}>{c.ctaLabel} <ArrowLeft className="h-4 w-4" aria-hidden="true" /></a>
              <a href={wa(c.hubWa)} target="_blank" rel="noopener noreferrer" className={BTN_GHOST}><MessageCircle className="h-4 w-4" aria-hidden="true" /> احجز عبر واتساب</a>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-[0.8rem] text-white/80">
              {c.bullets.map((t) => (
                <li key={t} className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-[#FACC15]" aria-hidden="true" />{t}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section aria-labelledby="answer-heading" className="section-container relative z-10 -mt-8 max-w-6xl">
        <div className="rounded-[2rem] border border-[#16A34A]/15 bg-white p-6 shadow-[0_30px_70px_-45px_rgba(15,23,42,0.5)] md:p-9">
          <div className="grid gap-6 md:grid-cols-[auto_1fr] md:gap-8">
            <p id="answer-heading" className="text-xs font-bold text-[#16A34A] md:w-32 md:pt-1">الجواب المختصر</p>
            <p id="speakable-summary" className="text-[1.05rem] leading-relaxed text-[#1F2937] md:text-lg">{c.shortAnswer}</p>
          </div>
          <div className="mt-7"><Facts facts={c.facts} /></div>
        </div>
      </section>

      <div className="section-container max-w-6xl space-y-20 py-20 md:space-y-28 md:py-28">
        <section aria-labelledby="trip-heading">
          <Head id="trip-heading" eyebrow="ابدأ من هنا" title={c.tripHeading} intro={c.tripIntro} />
          <div className="grid gap-4 md:grid-cols-2">
            {c.trips.map((t) => (
              <article key={t.id} className="flex flex-col rounded-3xl border border-[#E5E7EB] bg-white p-6">
                <h3 className="font-heading text-lg font-bold">{t.label} <span className="text-sm font-normal text-[#6B7280]">· {t.short}</span></h3>
                <p className="mt-2 text-sm leading-relaxed text-[#4B5563]">{t.answer}</p>
                <p className="mt-4 text-xs font-bold text-[#15803D]">أرسل لنا لطلب العرض</p>
                <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
                  {t.send.map((s) => <li key={s} className="flex items-start gap-2 text-sm text-[#374151]"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[#16A34A]" aria-hidden="true" />{s}</li>)}
                </ul>
                <div className="mt-5 flex flex-wrap gap-3">
                  <a href={wa(t.waPrefill)} target="_blank" rel="noopener noreferrer" className={GREEN}><MessageCircle className="h-4 w-4" aria-hidden="true" /> اطلب عرض سعر</a>
                  <Link href={t.href} className={OUTLINE}>{t.linkLabel} <ArrowLeft className="h-4 w-4" aria-hidden="true" /></Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="local" aria-labelledby="local-heading" className="scroll-mt-24">
          <Head id="local-heading" eyebrow={c.local.eyebrow} title={c.local.heading} intro={c.local.intro} />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {c.local.items.map((it) => (
              <article key={it.title} className="flex flex-col rounded-3xl border border-[#E5E7EB] bg-white p-6">
                <h3 className="font-heading text-lg font-bold">{it.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-[#4B5563]">{it.body}</p>
                {it.href && <Link href={it.href} className="mt-4 inline-flex min-h-[44px] items-center gap-2 text-sm font-bold text-[#15803D] hover:underline">{it.linkLabel} <ArrowLeft className="h-4 w-4" aria-hidden="true" /></Link>}
              </article>
            ))}
          </div>
        </section>

        <section id="routes" aria-labelledby="routes-heading" className="scroll-mt-24">
          <Head id="routes-heading" eyebrow="مسارات لها صفحاتها" title={c.routesHeading} intro="المسافات والأوقات تقريبية ومصدرها بيانات المسارات نفسها." />
          <ol className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {corridors.map((r) => (
              <li key={r.slug} className="relative rounded-2xl border border-[#E5E7EB] bg-white p-5 hover:border-[#16A34A]/40 focus-within:border-[#16A34A]">
                <div className="flex items-center justify-between gap-3">
                  <Link href={arRouteHref(r.slug)} className="font-heading text-base font-bold text-[#1C1C1C] after:absolute after:inset-0 focus-visible:outline-none">{r.label}</Link>
                  <span className="shrink-0 text-left text-[0.8rem] font-semibold tabular-nums">{kmAr(r.f!.km)} كم <span className="block text-[0.7rem] font-normal text-[#6B7280]">{durAr(r.f!.minutes)}</span></span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[#4B5563]">{r.note}</p>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="compare-heading">
          <Head id="compare-heading" eyebrow="مقارنة صريحة" title={c.compare.heading} intro={c.compare.intro} />
          <div className="grid gap-4 md:grid-cols-2">
            {c.compare.options.map((o, i) => (
              <div key={o.title} className={`rounded-3xl p-6 md:p-7 ${i === 1 ? "bg-[#16A34A] text-[#FFFFFF]" : "border border-[#E5E7EB] bg-white"}`}>
                <h3 className="font-heading text-lg font-bold">{o.title}</h3>
                <ul className="mt-4 space-y-2.5">
                  {o.when.map((w) => <li key={w} className={`flex items-start gap-2.5 text-sm ${i === 1 ? "text-white/90" : "text-[#374151]"}`}><Check className={`mt-0.5 h-4 w-4 shrink-0 ${i === 1 ? "text-[#FACC15]" : "text-[#16A34A]"}`} aria-hidden="true" />{w}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="vehicles-heading">
          <Head id="vehicles-heading" eyebrow="اختر السيارة" title={c.vehicles.heading} intro={c.vehicles.intro} />
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {c.vehicles.items.map((t) => {
              const models = t.models.map((s) => FLEET_VEHICLES.find((v) => v.slug === s)).filter((v): v is NonNullable<typeof v> => !!v);
              return (
                <li key={t.tier} className="flex flex-col rounded-3xl border border-[#E5E7EB] bg-white p-6">
                  <h3 className="font-heading text-lg font-bold">{t.tier}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#4B5563]">{t.bestFor}</p>
                  <ul className="mt-4 flex-1 space-y-2">
                    {models.map((v) => (
                      <li key={v.slug} className="flex items-baseline justify-between gap-3 text-sm">
                        <Link href={`/fleet/${v.slug}`} className="font-semibold text-[#15803D] hover:underline" dir="ltr">{v.name}</Link>
                        <span className="shrink-0 text-[0.75rem] tabular-nums text-[#6B7280]">{v.passengers} ركاب · {v.luggage} حقائب</span>
                      </li>
                    ))}
                  </ul>
                  <a href={wa(t.waPrefill)} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-[#16A34A] px-5 text-sm font-bold text-[#15803D] hover:bg-[#F0FDF4]"><MessageCircle className="h-4 w-4" aria-hidden="true" /> اسأل عن هذه السيارة</a>
                </li>
              );
            })}
          </ul>
        </section>

        <section aria-labelledby="timing-heading">
          <Head id="timing-heading" eyebrow="خطّط لموعدك" title={c.timingHeading} />
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-[#E5E7EB] bg-[#E5E7EB] md:grid-cols-3">
            {c.timing.map((t, i) => (
              <div key={t.title} className="bg-white p-6">
                <span className="font-heading text-sm font-bold tabular-nums text-[#16A34A]">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-2 font-heading text-base font-bold">{t.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#4B5563]">{t.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="corp-heading" className="rounded-[2rem] bg-[#0B1F14] p-7 text-[#FFFFFF] md:p-10">
          <p className="text-xs font-bold text-[#FACC15]">للشركات والفرق الزائرة</p>
          <h2 id="corp-heading" className="mt-3 font-heading text-[1.75rem] font-bold leading-tight text-[#FFFFFF] md:text-[2.1rem]">{c.corporate.heading}</h2>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/80">{c.corporate.body} {CORP_AR_R}</p>
          <a href={`mailto:${contactConfig.email}?subject=${encodeURIComponent(c.corporate.emailSubject)}&body=${encodeURIComponent(c.corporate.emailBody)}`} className="mt-7 inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[#FACC15] px-6 text-xs font-bold text-[#0B1F14] hover:bg-[#FDE047]"><Mail className="h-4 w-4" aria-hidden="true" /> اطلب عرض سعر مكتوب</a>
        </section>

        <Quote
          heading={c.quote.heading}
          body={c.quote.body}
          label={c.ctaLabel}
          waPrefill={c.hubWa}
          pickup={c.nameAr}
          pathB={{ heading: "تحجز لشركة؟", body: `أرسل الرحلات عبر البريد لعرض سعر مكتوب. ${CORP_AR_R}`, emailSubject: c.corporate.emailSubject, emailBody: c.corporate.emailBody }}
        />

        <section aria-labelledby="faq-heading" className="grid grid-cols-1 gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <Head id="faq-heading" eyebrow="الأسئلة الشائعة" title={c.faqHeading} />
            <a href={wa(c.hubWa)} target="_blank" rel="noopener noreferrer" className={OUTLINE}><MessageCircle className="h-4 w-4" aria-hidden="true" /> اسأل عبر واتساب</a>
          </div>
          <Faqs faqs={c.faqs} />
        </section>

        <section aria-labelledby="related-heading">
          <h2 id="related-heading" className="mb-5 font-heading text-xl font-bold">صفحات ذات صلة</h2>
          <ul className="grid grid-cols-1 gap-x-8 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
            {c.related.map((g) => (
              <li key={g.href}>
                <Link href={g.href} className="flex min-h-[44px] items-center justify-between gap-3 border-b border-[#E5E7EB] py-2 text-sm font-semibold text-[#1C1C1C] hover:text-[#15803D]">
                  {g.label} <ArrowLeft className="h-4 w-4 shrink-0 text-[#16A34A]" aria-hidden="true" />
                </Link>
              </li>
            ))}
            <li>
              <Link href={c.enPath} className="flex min-h-[44px] items-center justify-between gap-3 border-b border-[#E5E7EB] py-2 text-sm font-semibold text-[#1C1C1C] hover:text-[#15803D]">
                <span>English version · <span dir="ltr">{c.nameEn}</span></span> <ArrowLeft className="h-4 w-4 shrink-0 text-[#16A34A]" aria-hidden="true" />
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
