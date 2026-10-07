import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Check, MessageCircle, Mail, MapPin, ShieldCheck, Landmark, Building2, Mountain } from "lucide-react";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqSchema, speakableSchema, itemListSchema } from "@/lib/schema";
import { contactConfig } from "@/lib/config/contact";
import WhatsAppQuoteForm from "@/components/booking/WhatsAppQuoteForm";
import { routeFact } from "@/lib/data/cluster";
import { AR_ROUTE_CONTENT_SLUGS } from "@/lib/data/routes-content-ar";
import { ALULA_AIRPORT_RESORTS } from "@/lib/data/alula-cluster";
import { ALULA_IMG } from "@/lib/data/alula-images";
import { JourneyPlannerAr } from "./JourneyPlannerAr";
import {
  AR_ALULA_FACTS, AR_ALULA_TRIPS, AR_ALULA_FLOW, AR_ALULA_ATTRACTIONS, AR_ALULA_STAYS, AR_ALULA_HOTEL_LEGS,
  AR_RED_SEA_NODES, AR_RED_SEA_COMPARE, AR_ALULA_ONWARD, AR_ALULA_TIMING, AR_ALULA_STEPS, AR_ALULA_FAQS, AR_ALULA_GUIDES,
  AR_ALULA_HUB, AR_ALULA_PAGES, AR_ALULA_CHILD_NAV, AR_FREE_WAIT, type ArChildPage, type ArBlock,
} from "@/lib/data/alula-cluster-ar";

const SITE = "https://taxisaudiarabia.com";
const wa = (t: string) => `${contactConfig.whatsappLink}?text=${encodeURIComponent(t)}`;
const HUB_PATH = "/ar/locations/alula";
const HUB_WA = "السلام عليكم، استفسار عن النقل في العلا.\n• من (مطار العلا / الفندق / مطار البحر الأحمر): \n• إلى: \n• التاريخ والوقت: \n• عدد الركاب والحقائب: \n• رقم الرحلة (لرحلات المطار): ";
const GROUP_IMAGES: Record<string, (typeof ALULA_IMG)[keyof typeof ALULA_IMG][]> = {
  heritage: [ALULA_IMG.hegra, ALULA_IMG.oldTown],
  architecture: [ALULA_IMG.maraya],
  nature: [ALULA_IMG.elephantRock],
};
const CHILD_IMAGE: Record<string, (typeof ALULA_IMG)[keyof typeof ALULA_IMG]> = {
  "private-driver": ALULA_IMG.privateDriver,
  hegra: ALULA_IMG.hegra,
  maraya: ALULA_IMG.maraya,
  "elephant-rock": ALULA_IMG.elephantRock,
};
const ICONS = { heritage: Landmark, architecture: Building2, nature: Mountain } as const;
const BTN_PRIMARY = "inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-[#FACC15] px-7 text-sm font-bold text-[#0B1F14] transition-colors hover:bg-[#FDE047] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1F14]";
const BTN_GHOST = "inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full border border-white/30 bg-white/5 px-7 text-sm font-bold text-[#FFFFFF] backdrop-blur transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white";

function Eyebrow({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return <p className={`mb-3 text-xs font-bold ${dark ? "text-[#FACC15]" : "text-[#16A34A]"}`}>{children}</p>;
}
function Head({ eyebrow, title, intro, id, dark }: { eyebrow: string; title: string; intro?: string; id?: string; dark?: boolean }) {
  return (
    <div className="mb-8 max-w-3xl md:mb-10">
      <Eyebrow dark={dark}>{eyebrow}</Eyebrow>
      <h2 id={id} className={`font-heading text-[1.6rem] font-bold leading-tight md:text-[2.1rem] ${dark ? "text-[#FFFFFF]" : "text-[#1C1C1C]"}`}>{title}</h2>
      {intro && <p className={`mt-3 text-[0.95rem] leading-relaxed ${dark ? "text-white/70" : "text-[#6B7280]"}`}>{intro}</p>}
    </div>
  );
}
function Facts({ facts }: { facts: { label: string; value: string }[] }) {
  return (
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-[#16A34A]/15 bg-[#16A34A]/15 md:grid-cols-4">
      {facts.map((f) => (
        <div key={f.label} className="bg-white p-4 md:p-5">
          <dt className="text-xs font-bold text-[#15803D]">{f.label}</dt>
          <dd className="mt-1.5 text-[0.85rem] font-semibold leading-snug text-[#1C1C1C]">{f.value}</dd>
        </div>
      ))}
    </dl>
  );
}
function Faqs({ faqs }: { faqs: { question: string; answer: string }[] }) {
  return (
    <div className="divide-y divide-[#E5E7EB] overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white">
      {faqs.map((f, i) => (
        <details key={f.question} className="group" open={i === 0}>
          <summary className="flex min-h-[56px] cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-start text-[0.95rem] font-semibold hover:bg-[#F9FAFB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#16A34A] [&::-webkit-details-marker]:hidden">
            <h3 className="font-semibold">{f.question}</h3>
            <span className="text-[#16A34A] transition-transform duration-200 group-open:rotate-45" aria-hidden="true">+</span>
          </summary>
          <p className="px-5 pb-5 text-sm leading-relaxed text-[#4B5563]">{f.answer}</p>
        </details>
      ))}
    </div>
  );
}
function Quote({ heading, body, label, waPrefill, pickup, dropoff, pathB }: { heading: string; body: string; label: string; waPrefill: string; pickup?: string; dropoff?: string; pathB?: { heading: string; body: string; emailSubject: string; emailBody: string } }) {
  return (
    <section id="quote" aria-labelledby="quote-heading" className="scroll-mt-24">
      <div className="overflow-hidden rounded-[2rem] border border-[#16A34A]/15 bg-white shadow-[0_30px_80px_-40px_rgba(15,23,42,0.35)]">
        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative bg-[#0B1F14] p-7 text-[#FFFFFF] md:p-10">
            <p className="text-xs font-bold text-[#FACC15]">اطلب عرض سعر</p>
            <h2 id="quote-heading" className="mt-3 font-heading text-[1.7rem] font-bold leading-tight">{heading}</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/75">{body}</p>
            <ul className="mt-6 space-y-2.5 text-sm text-white/85">
              {["السعر يُتفق عليه قبل الحجز — بلا عدّاد ولا رسوم ارتفاع الطلب", "إلغاء مجاني حتى 24 ساعة قبل الموعد", "الدفع نقداً للسائق أو بتحويل بنكي", "سائقون يتحدثون العربية والإنجليزية، على مدار الساعة"].map((t) => (
                <li key={t} className="flex items-start gap-2.5"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#FACC15]" aria-hidden="true" />{t}</li>
              ))}
            </ul>
            <a href={wa(waPrefill)} target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/25 px-5 text-xs font-bold text-[#FFFFFF] hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FACC15]">
              <MessageCircle className="h-4 w-4" aria-hidden="true" /> تفضل واتساب؟ راسلنا
            </a>
          </div>
          <div className="min-w-0 bg-[#FAFAF7] p-3 sm:p-6 md:p-8">
            <WhatsAppQuoteForm defaultPickup={pickup} defaultDropoff={dropoff} forceLocale="ar" submitLabel={label} />
          </div>
        </div>
        {pathB && (
          <div className="flex flex-col gap-4 border-t border-[#E5E7EB] bg-white p-6 md:flex-row md:items-center md:justify-between md:px-10">
            <div className="max-w-2xl">
              <p className="font-heading text-base font-bold">{pathB.heading}</p>
              <p className="mt-1 text-sm leading-relaxed text-[#6B7280]">{pathB.body}</p>
            </div>
            <a href={`mailto:${contactConfig.email}?subject=${encodeURIComponent(pathB.emailSubject)}&body=${encodeURIComponent(pathB.emailBody)}`} className="inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-full border border-[#16A34A]/30 px-5 text-xs font-bold text-[#15803D] hover:bg-[#F0FDF4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A]">
              <Mail className="h-4 w-4" aria-hidden="true" /> أرسل طلب عرض سعر مكتوباً
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
const routeHref = (slug: string) => (AR_ROUTE_CONTENT_SLUGS.includes(slug) ? `/ar/routes/${slug}` : `/routes/${slug}`);

/* ═══ الصفحة الرئيسية للعلا ═══ */
export function AlulaHubAr() {
  const onward = AR_ALULA_ONWARD.map((o) => ({ ...o, f: routeFact(o.slug) })).filter((o) => o.f);
  const schema = [
    {
      "@context": "https://schema.org", "@type": "TaxiService", "@id": `${SITE}${HUB_PATH}#service`,
      name: "النقل الخاص وخدمة السائق في العلا", inLanguage: "ar",
      description: "نقل خاص بحجز مسبق من مطار العلا الدولي (ULH) وتوصيل الفنادق وسائق خاص ليوم سياحي متعدد المحطات ورحلات بين المدن والبحر الأحمر عبر شبكة شركاء من السائقين المحترفين. السعر يُتفق عليه قبل الحجز.",
      url: `${SITE}${HUB_PATH}`, provider: { "@type": "Organization", name: "تاكسي السعودية", url: SITE },
      areaServed: { "@type": "City", name: "العلا", geo: { "@type": "GeoCoordinates", latitude: 26.6084, longitude: 37.9153 } },
      availableLanguage: ["Arabic", "English"],
    },
    speakableSchema({ path: HUB_PATH }),
    itemListSchema(onward.map((o) => ({ name: `${o.f!.from} إلى ${o.f!.to}`, href: routeHref(o.slug) }))),
    faqSchema(AR_ALULA_FAQS),
  ];

  return (
    <div dir="rtl" lang="ar" className="min-h-screen bg-[#FAFAF7] text-[#1C1C1C]">
      <JsonLd data={schema} />
      <section className="relative isolate overflow-hidden bg-[#0B1F14]">
        <Image src={ALULA_IMG.hubHero.src} alt={ALULA_IMG.hubHero.altAr} fill priority sizes="100vw" className="-z-10 object-cover object-[40%_55%]" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-l from-[#0B1F14] via-[#0B1F14]/80 to-[#0B1F14]/10" aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-[#0B1F14] to-transparent" aria-hidden="true" />
        <Breadcrumbs className="relative [&_a]:text-white/70 [&_a:hover]:text-white [&_span]:text-[#FACC15]" items={[{ name: "الرئيسية", href: "/ar" }, { name: "العلا", href: HUB_PATH }]} />
        <div className="section-container relative max-w-6xl pb-16 pt-6 md:pb-24 md:pt-10">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3.5 py-1.5 text-xs font-bold text-[#FACC15] backdrop-blur"><MapPin className="h-3.5 w-3.5" aria-hidden="true" /> العلا · AlUla</p>
            <h1 className="mt-5 font-heading text-[2.1rem] font-bold leading-[1.15] text-[#FFFFFF] sm:text-5xl md:text-[3.2rem]">{AR_ALULA_HUB.h1}</h1>
            <p className="mt-4 max-w-xl text-lg font-semibold leading-snug text-[#FFFFFF] md:text-xl">نقل خاص في العلا: المطار والفنادق والمعالم والرحلات بين المدن.</p>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-white/80">سيارات بحجز مسبق للزوار الدوليين والأزواج والعائلات والمجموعات — من وصولك إلى مطار العلا حتى الحِجر ومرايا وجبل الفيل، ثم إلى المدينة المنورة أو الرياض أو البحر الأحمر. سعر واحد يُتفق عليه قبل الحجز.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#quote" className={BTN_PRIMARY}>اطلب عرض سعر لرحلتي <ArrowLeft className="h-4 w-4" aria-hidden="true" /></a>
              <a href={wa(HUB_WA)} target="_blank" rel="noopener noreferrer" className={BTN_GHOST}><MessageCircle className="h-4 w-4" aria-hidden="true" /> واتساب</a>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-[0.8rem] text-white/80">
              {["نتابع رحلتك", `انتظار مجاني ${AR_FREE_WAIT}`, "سائقون بالعربية والإنجليزية", "على مدار الساعة"].map((t) => (
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
            <p id="speakable-summary" className="text-[1.05rem] leading-relaxed text-[#1F2937] md:text-lg">
              تنظم «تاكسي السعودية» نقلاً خاصاً في العلا عبر شبكة شركاء من السائقين المحترفين: استقبال بحجز مسبق مع استقبال في صالة الوصول من مطار العلا الدولي (ULH، على بعد نحو {ALULA_AIRPORT_RESORTS.km} كم من منطقة المنتجعات)، وتوصيل الفنادق، وسائق خاص لأيام متعددة المحطات إلى الحِجر والبلدة القديمة ومرايا وجبل الفيل، ورحلات بين المدن إلى المدينة المنورة والرياض وجدة ونيوم وأمالا ومطار البحر الأحمر الدولي. اطلب عرض سعر من هذه الصفحة أو عبر واتساب؛ يُتفق على السعر قبل الحجز ونتابع رحلتك.
            </p>
          </div>
          <div className="mt-7"><Facts facts={AR_ALULA_FACTS} /></div>
        </div>
      </section>

      <div className="section-container max-w-6xl space-y-20 py-20 md:space-y-28 md:py-28">
        <section aria-labelledby="trip-heading">
          <Head id="trip-heading" eyebrow="ماذا تخطط؟" title="اختر رحلتك في العلا" intro="كل خيار يوضح ما ترسله لطلب عرض السعر ويفتح الصفحة المناسبة أو طلب واتساب جاهزاً." />
          <div className="grid gap-4 md:grid-cols-2">
            {AR_ALULA_TRIPS.map((t) => (
              <article key={t.id} className="flex flex-col rounded-3xl border border-[#E5E7EB] bg-white p-6">
                <h3 className="font-heading text-lg font-bold">{t.label} <span className="text-sm font-normal text-[#6B7280]">· {t.short}</span></h3>
                <p className="mt-2 text-sm leading-relaxed text-[#4B5563]">{t.answer}</p>
                <p className="mt-4 text-xs font-bold text-[#15803D]">أرسل لنا لطلب العرض</p>
                <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
                  {t.send.map((s) => <li key={s} className="flex items-start gap-2 text-sm text-[#374151]"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[#16A34A]" aria-hidden="true" />{s}</li>)}
                </ul>
                <div className="mt-5 flex flex-wrap gap-3">
                  <a href={wa(t.waPrefill)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-[#16A34A] px-5 text-xs font-bold text-[#FFFFFF] hover:bg-[#15803D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A] focus-visible:ring-offset-2"><MessageCircle className="h-4 w-4" aria-hidden="true" /> اطلب هذه الرحلة</a>
                  <Link href={t.href} className="group inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[#16A34A]/30 px-5 text-xs font-bold text-[#15803D] hover:bg-[#F0FDF4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A] focus-visible:ring-offset-2">{t.linkLabel}<ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" aria-hidden="true" /></Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      <section id="airport" aria-labelledby="airport-heading" className="relative scroll-mt-20 overflow-hidden bg-[#0B1F14] py-20 md:py-24">
        <div className="section-container relative max-w-6xl">
          <Head dark id="airport-heading" eyebrow="مطار العلا الدولي (ULH)" title="رحلتك من مطار العلا خطوة بخطوة" intro={`ULH مطار إقليمي صغير يبعد نحو ${ALULA_AIRPORT_RESORTS.km} كم عن منطقة المنتجعات، والسيارات عند الطلب فيه محدودة — لذلك يحجز معظم الزوار مسبقاً.`} />
          <figure className="mb-10 overflow-hidden rounded-3xl border border-white/10">
            <Image src={ALULA_IMG.airport.src} alt={ALULA_IMG.airport.altAr} width={ALULA_IMG.airport.w} height={ALULA_IMG.airport.h} sizes="(min-width: 1152px) 1100px, 100vw" className="h-[220px] w-full object-cover sm:h-[300px]" loading="lazy" />
          </figure>
          <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <h3 className="mb-4 font-heading text-lg font-bold text-[#FACC15]">الوصول</h3>
              <ol className="grid gap-3 sm:grid-cols-2">
                {AR_ALULA_FLOW.arrival.map((s, i) => (
                  <li key={s.title} className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FACC15] text-sm font-bold text-[#0B1F14]">{i + 1}</span>
                    <div><p className="font-bold text-[#FFFFFF]">{s.title}</p><p className="mt-1 text-sm leading-relaxed text-white/70">{s.desc}</p></div>
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <h3 className="mb-4 font-heading text-lg font-bold text-[#FACC15]">المغادرة</h3>
              <ol className="space-y-3">
                {AR_ALULA_FLOW.departure.map((s, i) => (
                  <li key={s.title} className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#FACC15] text-sm font-bold text-[#FACC15]">{i + 1}</span>
                    <div><p className="font-bold text-[#FFFFFF]">{s.title}</p><p className="mt-1 text-sm leading-relaxed text-white/70">{s.desc}</p></div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
          <a href={wa(AR_ALULA_TRIPS[0].waPrefill)} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-[#FACC15] px-6 text-xs font-bold text-[#0B1F14] hover:bg-[#FDE047] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">خطط لاستقبالي من مطار العلا</a>
        </div>
      </section>

      <div className="section-container max-w-6xl space-y-20 py-20 md:space-y-28 md:py-28">
        <section id="hotels" aria-labelledby="hotels-heading" className="scroll-mt-20">
          <Head id="hotels-heading" eyebrow="توصيل الفنادق والمنتجعات" title="كل مشوار بين إقامتك في العلا والأماكن التي جئت من أجلها" intro="مشاوير مفردة تحجزها حسب الحاجة. اضغط على المشوار لإرسال طلب واتساب معبأ مسبقاً." />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.1fr]">
            <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6 md:p-7">
              <Image src={ALULA_IMG.stay.src} alt={ALULA_IMG.stay.altAr} width={ALULA_IMG.stay.w} height={ALULA_IMG.stay.h} sizes="(min-width: 1024px) 480px, 100vw" className="-mx-6 -mt-6 mb-5 h-44 w-[calc(100%+3rem)] max-w-none rounded-t-3xl object-cover md:-mx-7 md:-mt-7 md:w-[calc(100%+3.5rem)]" loading="lazy" />
              <p className="text-xs font-bold text-[#16A34A]">أين يقيم الزوار</p>
              <ul className="mt-4 divide-y divide-[#E5E7EB]">
                {AR_ALULA_STAYS.map((s) => <li key={s.name} className="py-3 first:pt-0 last:pb-0"><p className="font-heading text-[0.95rem] font-bold">{s.name}</p><p className="text-[0.8rem] text-[#6B7280]">{s.area} · {s.note}</p></li>)}
              </ul>
              <p className="mt-5 text-xs leading-relaxed text-[#6B7280]">وردت الأسماء لتعرف أين تبدأ الرحلات وتنتهي. «تاكسي السعودية» مستقلة عن هذه المنشآت ولا شراكة تجمعها بها.</p>
              <Link href="/routes/alula-airport-to-banyan-tree" className="mt-4 inline-flex min-h-[44px] items-center gap-2 text-sm font-bold text-[#15803D] hover:text-[#16A34A]">مثال: مطار ULH ← بانيان تري العلا <ArrowLeft className="h-4 w-4" aria-hidden="true" /></Link>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {AR_ALULA_HOTEL_LEGS.map((l) => (
                <li key={l.label}>
                  <a href={wa(l.waPrefill)} target="_blank" rel="noopener noreferrer" className="group flex h-full min-h-[96px] flex-col rounded-2xl border border-[#E5E7EB] bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#16A34A]/40 hover:shadow-[0_14px_30px_-20px_rgba(15,23,42,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A] focus-visible:ring-offset-2">
                    <span className="font-heading text-[0.9rem] font-bold group-hover:text-[#15803D]">{l.label}</span>
                    <span className="mt-1 flex-1 text-[0.8rem] text-[#6B7280]">{l.when}</span>
                    <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-[#15803D]"><MessageCircle className="h-3.5 w-3.5" aria-hidden="true" /> اطلب هذا المشوار</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="attractions" aria-labelledby="attractions-heading" className="scroll-mt-20">
          <Head id="attractions-heading" eyebrow="الوصول إلى المعالم" title="الحِجر ومرايا وجبل الفيل والبلدة القديمة — وكيف تصل إلى كل منها" intro="مجمّعة بحسب ما جئت من أجله. «تاكسي السعودية» تقدم النقل، وتُحجز الجولات الموجهة مع «تجربة العلا»." />
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            {AR_ALULA_ATTRACTIONS.map((g) => {
              const Icon = ICONS[g.id as keyof typeof ICONS];
              return (
                <article key={g.id} className="flex flex-col overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white">
                  <div className={`grid ${g.id === "heritage" ? "grid-cols-2" : "grid-cols-1"} gap-px bg-[#E5E7EB]`}>
                    {(GROUP_IMAGES[g.id] ?? []).map((im) => (
                      <Image key={im.src} src={im.src} alt={im.altAr} width={im.w} height={im.h} sizes="(min-width: 1024px) 380px, 100vw" className="h-40 w-full object-cover" loading="lazy" />
                    ))}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F0FDF4] text-[#16A34A]"><Icon className="h-5 w-5" aria-hidden="true" /></span>
                  <h3 className="mt-4 font-heading text-lg font-bold">{g.label}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-[#6B7280]">{g.intro}</p>
                  <ul className="mt-5 flex-1 space-y-4">
                    {g.items.map((it) => (
                      <li key={it.name}>
                        {it.href ? <Link href={it.href} className="group inline-flex min-h-[32px] items-center gap-1.5 font-heading text-[0.95rem] font-bold hover:text-[#15803D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A]">{it.name}<ArrowLeft className="h-3.5 w-3.5 text-[#16A34A] transition-transform group-hover:-translate-x-1" aria-hidden="true" /></Link> : <p className="font-heading text-[0.95rem] font-bold">{it.name}</p>}
                        <p className="mt-0.5 text-[0.8rem] leading-relaxed text-[#4B5563]">{it.transport}</p>
                      </li>
                    ))}
                  </ul>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section id="planner" aria-labelledby="planner-heading" className="scroll-mt-20">
          <Head id="planner-heading" eyebrow="خطط يوماً كاملاً" title="ابنِ يومك في العلا ثم أرسله لطلب عرض سعر" intro="اختر البداية وعلّم الأماكن واختر النهاية. يخبرك المخطط إن كان السائق الخاص مناسباً ويجهز رسالة واتساب." />
          <JourneyPlannerAr whatsappLink={contactConfig.whatsappLink} />
        </section>

        <section id="private-driver" aria-labelledby="decide-heading" className="scroll-mt-20">
          <Head id="decide-heading" eyebrow="اختر الحجز المناسب" title="مشوار واحد أم سائق خاص ليوم كامل أم ترتيب للشركات؟" />
          <div className="overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white">
            <table className="w-full text-start text-sm">
              <caption className="sr-only">متى تحجز مشواراً مفرداً أو سائقاً خاصاً أو ترتيباً للشركات في العلا</caption>
              <thead className="bg-[#F9FAFB] text-xs text-[#6B7280]"><tr><th scope="col" className="px-4 py-3 text-start font-bold">الحجز</th><th scope="col" className="px-4 py-3 text-start font-bold">الأنسب عندما</th></tr></thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {[["مشوار مفرد", "من المطار إلى الفندق أو من الفندق إلى معلم واحد أو رحلة باتجاه واحد إلى مدينة أخرى."], ["سائق خاص ليوم كامل", "ثلاث محطات فأكثر أو مواعيد جولات موجهة أو أطفال أو حر أو خطط قابلة للتغيير."], ["ترتيب للشركات", "فرق ومجموعات حوافز ووفود: نقطة تواصل واحدة وعرض سعر مكتوب وفواتير عند الطلب."]].map(([a, b]) => (
                  <tr key={a}><th scope="row" className="px-4 py-4 text-start align-top font-semibold">{a}</th><td className="px-4 py-4 text-[#4B5563]">{b}</td></tr>
                ))}
              </tbody>
            </table>
            <Link href="/ar/locations/alula/private-driver" className="flex items-center justify-between gap-3 border-t border-[#E5E7EB] bg-[#F0FDF4] p-4 text-sm font-semibold text-[#15803D] hover:bg-[#DCFCE7]">كيف يعمل السائق الخاص في العلا <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden="true" /></Link>
          </div>
        </section>

        <section id="red-sea" aria-labelledby="red-sea-heading" className="scroll-mt-20">
          <Head id="red-sea-heading" eyebrow="العلا مع البحر الأحمر" title="الجمع بين العلا وجزيرة شورى وأمالا ومطار البحر الأحمر الدولي" intro="هذه وجهات منفصلة. يبعد مطار البحر الأحمر الدولي عن العلا نحو 260 كم بالطريق (قرابة 4 ساعات و25 دقيقة)، لذلك يكون النقل الخاص بين الوجهتين مرحلة مخططة من الرحلة." />
          <figure className="mb-8 grid gap-4 sm:grid-cols-2">
            {[ALULA_IMG.redSea, ALULA_IMG.road].map((im) => (
              <div key={im.src} className="overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white">
                <Image src={im.src} alt={im.altAr} width={im.w} height={im.h} sizes="(min-width: 640px) 560px, 100vw" className="h-52 w-full object-cover" loading="lazy" />
                <figcaption className="px-4 py-3 text-xs leading-relaxed text-[#6B7280]">{im.captionAr}</figcaption>
              </div>
            ))}
          </figure>
          <ol className="grid gap-4 lg:grid-cols-3">
            {AR_RED_SEA_NODES.map((n) => (
              <li key={n.id}>
                <Link href={n.href} className="group flex h-full flex-col rounded-3xl border border-[#E5E7EB] bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#16A34A]/40 hover:shadow-[0_14px_30px_-20px_rgba(15,23,42,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A] focus-visible:ring-offset-2">
                  <span className="text-xs font-bold text-[#15803D]">{n.sub}</span>
                  <span className="mt-1 font-heading text-lg font-bold">{n.title}</span>
                  <span className="mt-2 flex-1 text-sm leading-relaxed text-[#4B5563]">{n.body}</span>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#15803D]">{n.label}<ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" aria-hidden="true" /></span>
                </Link>
              </li>
            ))}
          </ol>
          <p className="mt-3 text-xs text-[#6B7280]">مخطط تعريفي وليس خريطة ولا بمقياس رسم. المسافات تقديرات مسار.</p>
          <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
            <div className="overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white">
              <table className="w-full text-start text-sm">
                <caption className="sr-only">السيارة الخاصة أم الطيران بين البحر الأحمر والعلا</caption>
                <thead className="bg-[#F9FAFB] text-xs text-[#6B7280]"><tr><th scope="col" className="px-4 py-3 text-start">&nbsp;</th><th scope="col" className="px-4 py-3 text-start font-bold">سيارة خاصة</th><th scope="col" className="px-4 py-3 text-start font-bold">طيران</th></tr></thead>
                <tbody className="divide-y divide-[#E5E7EB]">
                  {AR_RED_SEA_COMPARE.map((r) => <tr key={r.point}><th scope="row" className="px-4 py-3 text-start align-top font-semibold">{r.point}</th><td className="px-4 py-3 align-top text-[#4B5563]">{r.car}</td><td className="px-4 py-3 align-top text-[#4B5563]">{r.fly}</td></tr>)}
                </tbody>
              </table>
            </div>
            <div className="flex flex-col justify-between rounded-3xl bg-[#0B1F14] p-6 text-[#FFFFFF]">
              <div>
                <p className="text-xs font-bold text-[#FACC15]">اطلب نقلاً</p>
                <p className="mt-3 font-heading text-lg font-bold">من مطار البحر الأحمر أو شورى أو أمالا إلى العلا — والعكس</p>
                <p className="mt-2 text-sm leading-relaxed text-white/75">أخبرنا بالاتجاه والمنتجع في كل طرف ورقم رحلتك. سعر واحد يُتفق عليه قبل الحجز.</p>
              </div>
              <div className="mt-6 flex flex-col gap-3">
                <Link href="/ar/routes/red-sea-airport-to-alula" className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-[#FACC15] px-5 text-xs font-bold text-[#0B1F14] hover:bg-[#FDE047] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">عرض سعر RSI ← العلا</Link>
                <Link href="/ar/routes/alula-to-red-sea-airport" className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-white/30 px-5 text-xs font-bold text-[#FFFFFF] hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">عرض سعر العلا ← RSI</Link>
              </div>
            </div>
          </div>
        </section>

        <section id="onward" aria-labelledby="onward-heading" className="scroll-mt-20">
          <Head id="onward-heading" eyebrow="تابع رحلتك" title="الانطلاق من العلا" intro="المسافات وأوقات القيادة من بيانات مساراتنا. كل بطاقة تفتح صفحة الرحلة وفيها نموذج طلب عرض." />
          <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {onward.map((o) => (
              <li key={o.slug} className="group relative flex flex-col rounded-2xl border border-[#E5E7EB] bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#16A34A]/40 hover:shadow-[0_14px_30px_-20px_rgba(15,23,42,0.45)] focus-within:border-[#16A34A]">
                <div className="flex items-start justify-between gap-3">
                  <Link href={routeHref(o.slug)} className="font-heading text-base font-bold after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none">{AR_NAMES[o.f!.from] ?? o.f!.from} ← {AR_NAMES[o.f!.to] ?? o.f!.to}</Link>
                  <span className="shrink-0 text-end text-[0.8rem] font-semibold tabular-nums">{o.f!.km.toLocaleString("en-US")} كم</span>
                </div>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-[#4B5563]">{o.note}</p>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-[#6B7280]">تقديرات مسار من بيانات المسارات؛ يؤكد السائق التوقيت ليومك. الاتجاه المعاكس بالمسافة نفسها.</p>
        </section>

        <section aria-labelledby="timing-heading">
          <Head id="timing-heading" eyebrow="قبل أن تسافر" title="ملاحظات عملية لتخطيط النقل في العلا" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {AR_ALULA_TIMING.map((t) => <article key={t.title} className="rounded-3xl border border-[#E5E7EB] bg-white p-6"><h3 className="font-heading text-base font-bold">{t.title}</h3><p className="mt-2 text-sm leading-relaxed text-[#4B5563]">{t.body}</p></article>)}
          </div>
        </section>

        <section aria-labelledby="steps-heading">
          <Head id="steps-heading" eyebrow="كيف يتم الحجز" title="اطلب، احصل على السعر، أكّد، وانطلق" />
          <ol className="grid gap-6 md:grid-cols-4 md:gap-4">
            {AR_ALULA_STEPS.map((s, i) => (
              <li key={s.title} className="flex gap-4 md:flex-col md:items-start">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#16A34A] font-heading text-sm font-bold text-[#FFFFFF]">{i + 1}</span>
                <div className="md:mt-3"><p className="font-heading font-bold">{s.title}</p><p className="mt-1 text-sm leading-relaxed text-[#4B5563]">{s.desc}</p></div>
              </li>
            ))}
          </ol>
        </section>

        <Quote
          heading="اطلب عرض سعر نقلك في العلا"
          body="أخبرنا بالرحلة: الاستقبال والوجهة والتاريخ والركاب والحقائب ورقم الرحلة لرحلات المطار. نرد عبر واتساب بالمركبة وسعر واحد ثابت قبل أي حجز."
          label="اطلب عرض سعر"
          waPrefill={HUB_WA}
          pickup="مطار العلا الدولي (ULH)"
          pathB={{ heading: "حجز لشركة أو مجموعة حوافز أو وفد؟", body: "أرسل قائمة الرحلات بالبريد لعرض سعر مكتوب. يمكن ترتيب فواتير الشركات عبر شركتنا الشقيقة.", emailSubject: "طلب عرض سعر — نقل في العلا", emailBody: "مرحباً فريق تاكسي السعودية،\n\nنرغب بعرض سعر مكتوب لنقل في العلا.\n\n• الشركة / المجموعة: \n• اسم المسؤول ومنصبه: \n• التواريخ وأرقام الرحلات: \n• الرحلات (مطار العلا / الفنادق / المعالم / البحر الأحمر / مدن أخرى): \n• عدد الركاب لكل رحلة: \n• المركبة المطلوبة: \n• هل تحتاجون فاتورة؟: \n\nشكراً لكم." }}
        />

        <section aria-labelledby="faq-heading" className="grid grid-cols-1 gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <Head id="faq-heading" eyebrow="الأسئلة الشائعة" title="أسئلة النقل في العلا وإجاباتها" intro="إجابات مختصرة لما يسأله الزوار قبل الحجز." />
            <a href={wa(HUB_WA)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[#16A34A]/30 px-5 text-xs font-bold text-[#15803D] hover:bg-[#F0FDF4]"><MessageCircle className="h-4 w-4" aria-hidden="true" /> اسأل عبر واتساب</a>
          </div>
          <Faqs faqs={AR_ALULA_FAQS} />
        </section>

        <section aria-labelledby="guides-heading">
          <h2 id="guides-heading" className="mb-5 font-heading text-xl font-bold">أدلة السفر إلى العلا</h2>
          <ul className="grid grid-cols-1 gap-x-8 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
            {AR_ALULA_GUIDES.map((g) => <li key={g.href}><Link href={g.href} className="group flex min-h-[44px] items-center justify-between gap-3 border-b border-[#E5E7EB] py-2 text-sm font-semibold hover:text-[#15803D]">{g.label}<ArrowLeft className="h-4 w-4 shrink-0 text-[#16A34A] transition-transform group-hover:-translate-x-1" aria-hidden="true" /></Link></li>)}
            <li><Link href="/locations/alula" hrefLang="en" className="group flex min-h-[44px] items-center justify-between gap-3 border-b border-[#E5E7EB] py-2 text-sm font-semibold hover:text-[#15803D]">English version of this page<ArrowLeft className="h-4 w-4 shrink-0 text-[#16A34A]" aria-hidden="true" /></Link></li>
          </ul>
        </section>
      </div>

      <section className="border-t border-[#E5E7EB] bg-white">
        <div className="section-container flex max-w-6xl flex-col items-start gap-6 py-14 pb-28 md:flex-row md:items-center md:justify-between md:pb-14">
          <div><p className="font-heading text-2xl font-bold">تخطط لزيارة العلا؟</p><p className="mt-1 text-sm text-[#6B7280]">نتابع رحلتك، ويُتفق على السعر قبل الحجز، والإلغاء مجاني حتى 24 ساعة قبل الموعد.</p></div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a href="#quote" className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[#16A34A] px-6 text-xs font-bold text-[#FFFFFF] hover:bg-[#15803D]">اطلب عرض سعر <ArrowLeft className="h-4 w-4" aria-hidden="true" /></a>
            <a href={wa(HUB_WA)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-[#16A34A]/30 px-6 text-xs font-bold text-[#15803D] hover:bg-[#F0FDF4]"><MessageCircle className="h-4 w-4" aria-hidden="true" /> واتساب</a>
          </div>
        </div>
      </section>
    </div>
  );
}

const AR_NAMES: Record<string, string> = {
  AlUla: "العلا", Madinah: "المدينة المنورة", Riyadh: "الرياض", Jeddah: "جدة", NEOM: "نيوم", AMAALA: "أمالا",
  "Red Sea International Airport": "مطار البحر الأحمر الدولي", Aqaba: "العقبة", Amman: "عمّان",
};

/* ═══ صفحات الفروع ═══ */
function Block({ b, i }: { b: ArBlock; i: number }) {
  const id = `b-${i}`;
  switch (b.type) {
    case "prose":
      return (
        <section aria-labelledby={id} className="grid grid-cols-1 gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
          <h2 id={id} className="font-heading text-[1.6rem] font-bold leading-tight md:text-[2rem]">{b.heading}</h2>
          <div className="space-y-4 text-[0.95rem] leading-relaxed text-[#374151]">{b.paragraphs.map((p) => <p key={p.slice(0, 24)}>{p}</p>)}</div>
        </section>
      );
    case "cards":
      return (
        <section aria-labelledby={id}>
          <Head id={id} eyebrow={b.eyebrow ?? "لمن"} title={b.heading} />
          <div className={`grid gap-4 ${b.items.length === 4 ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
            {b.items.map((c, n) => <article key={c.title} className="rounded-3xl border border-[#E5E7EB] bg-white p-6"><span className="font-heading text-sm font-bold tabular-nums text-[#16A34A]">{String(n + 1).padStart(2, "0")}</span><h3 className="mt-2 font-heading text-lg font-bold">{c.title}</h3><p className="mt-2 text-sm leading-relaxed text-[#4B5563]">{c.body}</p></article>)}
          </div>
        </section>
      );
    case "steps":
      return (
        <section aria-labelledby={id}>
          <Head id={id} eyebrow={b.eyebrow ?? "خطوة بخطوة"} title={b.heading} />
          <ol className="grid gap-6 md:grid-cols-4 md:gap-4">
            {b.items.map((s, n) => <li key={s.title} className="flex gap-4 md:flex-col md:items-start"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#16A34A] font-heading text-sm font-bold text-[#FFFFFF]">{n + 1}</span><div className="md:mt-3"><p className="font-heading font-bold">{s.title}</p><p className="mt-1 text-sm leading-relaxed text-[#4B5563]">{s.desc}</p></div></li>)}
          </ol>
        </section>
      );
    case "timeline":
      return (
        <section aria-labelledby={id} className="grid grid-cols-1 gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
          <div><Eyebrow>{b.eyebrow ?? "خطة مثال"}</Eyebrow><h2 id={id} className="font-heading text-[1.6rem] font-bold leading-tight md:text-[2rem]">{b.heading}</h2>{b.intro && <p className="mt-3 text-sm leading-relaxed text-[#6B7280]">{b.intro}</p>}</div>
          <ol className="relative border-r-2 border-[#16A34A]/20 pr-7">
            {b.items.map((t) => <li key={t.title} className="relative pb-7 last:pb-0"><span aria-hidden="true" className="absolute -right-[37px] top-1 h-4 w-4 rounded-full border-4 border-[#FAFAF7] bg-[#16A34A]" /><p className="text-xs font-bold text-[#15803D]">{t.time}</p><p className="mt-1 font-heading text-base font-bold">{t.title}</p><p className="mt-1 text-sm leading-relaxed text-[#4B5563]">{t.desc}</p></li>)}
          </ol>
        </section>
      );
    case "compare":
      return (
        <section aria-labelledby={id}>
          <Head id={id} eyebrow="مقارنة صادقة" title={b.heading} intro={b.intro} />
          <div className="grid gap-4 md:grid-cols-2">
            {b.options.map((o) => (
              <div key={o.title} className={`rounded-3xl p-6 md:p-7 ${o.tone === "green" ? "bg-[#16A34A] text-[#FFFFFF]" : "border border-[#E5E7EB] bg-white"}`}>
                <h3 className="font-heading text-lg font-bold">{o.title}</h3>
                <p className={`mt-1 text-xs font-bold ${o.tone === "green" ? "text-[#FACC15]" : "text-[#16A34A]"}`}>الأنسب عندما</p>
                <ul className="mt-4 space-y-2.5">{o.when.map((w) => <li key={w} className="flex items-start gap-2.5 text-sm"><Check className={`mt-0.5 h-4 w-4 shrink-0 ${o.tone === "green" ? "text-[#FACC15]" : "text-[#16A34A]"}`} aria-hidden="true" /><span className={o.tone === "green" ? "text-white/90" : "text-[#374151]"}>{w}</span></li>)}</ul>
              </div>
            ))}
          </div>
        </section>
      );
    case "checklist":
      return (
        <section aria-labelledby={id} className="rounded-3xl border border-[#16A34A]/15 bg-[#F0FDF4] p-6 md:p-9">
          <h2 id={id} className="font-heading text-[1.5rem] font-bold">{b.heading}</h2>
          <ul className="mt-6 grid gap-3 md:grid-cols-2">{b.items.map((it) => <li key={it} className="flex items-start gap-3 rounded-2xl bg-white p-4 text-sm leading-relaxed"><span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#16A34A] text-[#FFFFFF]"><Check className="h-3 w-3" aria-hidden="true" /></span>{it}</li>)}</ul>
        </section>
      );
    case "table":
      return (
        <section aria-labelledby={id}>
          <Head id={id} eyebrow={b.eyebrow ?? "في لمحة"} title={b.heading} />
          <div className="overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white">
            <table className="w-full text-start text-sm">
              <thead className="hidden bg-[#F9FAFB] text-xs text-[#6B7280] sm:table-header-group"><tr>{b.columns.map((c) => <th key={c} scope="col" className="px-5 py-3 text-start font-bold">{c}</th>)}</tr></thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {b.rows.map((r) => <tr key={r[0]} className="block p-4 sm:table-row sm:p-0">{r.map((cell, ci) => ci === 0 ? <th key={ci} scope="row" className="block text-start font-semibold sm:table-cell sm:px-5 sm:py-4">{cell}</th> : <td key={ci} className="block pt-1 text-[#4B5563] sm:table-cell sm:px-5 sm:py-4">{cell}</td>)}</tr>)}
              </tbody>
            </table>
          </div>
        </section>
      );
  }
}

export function AlulaChildPageAr({ page }: { page: ArChildPage }) {
  const path = `${HUB_PATH}/${page.slug}`;
  const service: Record<string, unknown> = {
    "@context": "https://schema.org", "@type": page.slug === "private-driver" ? "Service" : "TaxiService", "@id": `${SITE}${path}#service`,
    name: page.h1, serviceType: page.serviceType, description: page.metaDescription, url: `${SITE}${path}`, inLanguage: "ar",
    provider: { "@type": "Organization", name: "تاكسي السعودية", url: SITE }, areaServed: { "@type": "City", name: "العلا" }, availableLanguage: ["Arabic", "English"],
  };
  if (page.place) service.about = { "@type": "TouristAttraction", name: page.place.name, description: page.place.description, address: { "@type": "PostalAddress", addressLocality: "العلا", addressCountry: "SA" } };
  const siblings = AR_ALULA_CHILD_NAV.filter((n) => n.slug !== page.slug);

  return (
    <div dir="rtl" lang="ar" className="min-h-screen bg-[#FAFAF7] text-[#1C1C1C]">
      <JsonLd data={[service, speakableSchema({ path }), faqSchema(page.faqs)]} />
      <section className="relative isolate overflow-hidden bg-[#0B1F14]">
        {CHILD_IMAGE[page.slug] ? (
          <>
            <Image src={CHILD_IMAGE[page.slug].src} alt={CHILD_IMAGE[page.slug].altAr} fill priority sizes="100vw" className="-z-10 object-cover" />
            <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-l from-[#0B1F14] via-[#0B1F14]/85 to-[#0B1F14]/30" />
          </>
        ) : (
          <div aria-hidden="true" className="absolute inset-0 -z-10" style={{ backgroundImage: "radial-gradient(rgba(250,204,21,0.14) 1px, transparent 1px), radial-gradient(circle at 15% 20%, rgba(22,163,74,0.35), transparent 55%)", backgroundSize: "22px 22px, 100% 100%" }} />
        )}
        <Breadcrumbs className="relative [&_a]:text-white/70 [&_a:hover]:text-white [&_span]:text-[#FACC15]" items={[{ name: "الرئيسية", href: "/ar" }, { name: "العلا", href: HUB_PATH }, { name: page.name, href: path }]} />
        <div className="section-container max-w-6xl pb-16 pt-6 md:pb-20 md:pt-10">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3.5 py-1.5 text-xs font-bold text-[#FACC15] backdrop-blur"><MapPin className="h-3.5 w-3.5" aria-hidden="true" /> {page.eyebrow}</p>
            <h1 className="mt-5 font-heading text-[2rem] font-bold leading-[1.2] text-[#FFFFFF] sm:text-4xl md:text-5xl">{page.h1}</h1>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#quote" className={BTN_PRIMARY}>{page.ctaLabel} <ArrowLeft className="h-4 w-4" aria-hidden="true" /></a>
              <a href={wa(page.waPrefill)} target="_blank" rel="noopener noreferrer" className={BTN_GHOST}><MessageCircle className="h-4 w-4" aria-hidden="true" /> واتساب</a>
            </div>
          </div>
        </div>
      </section>

      <section className="section-container relative z-10 -mt-8 max-w-6xl" aria-label="ملخص">
        <div className="rounded-[2rem] border border-[#16A34A]/15 bg-white p-6 shadow-[0_30px_70px_-45px_rgba(15,23,42,0.5)] md:p-9">
          <p id="speakable-summary" className="text-[1.02rem] leading-relaxed text-[#1F2937] md:text-[1.1rem]">{page.intro}</p>
          <div className="mt-7"><Facts facts={page.facts} /></div>
        </div>
      </section>

      <div className="section-container max-w-6xl space-y-20 py-20 md:space-y-24 md:py-24">
        {page.blocks.map((b, i) => <Block key={i} b={b} i={i} />)}
        <Quote heading={page.ctaHeading} body={page.ctaBody} label={page.ctaLabel} waPrefill={page.waPrefill} pickup={page.form.pickupAr} dropoff={page.form.dropoffAr} pathB={page.pathB} />
        <section aria-labelledby="faq-heading" className="grid grid-cols-1 gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <Head id="faq-heading" eyebrow="الأسئلة الشائعة" title={`${page.name}: أسئلة شائعة`} />
          <Faqs faqs={page.faqs} />
        </section>
        <section aria-labelledby="related-heading">
          <h2 id="related-heading" className="mb-5 font-heading text-xl font-bold">ذو صلة في العلا</h2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {page.related.map((l) => (
              <li key={l.href}><Link href={l.href} className="group flex h-full flex-col rounded-2xl border border-[#E5E7EB] bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#16A34A]/40 hover:shadow-[0_14px_30px_-20px_rgba(15,23,42,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A] focus-visible:ring-offset-2"><span className="font-heading text-[0.95rem] font-bold group-hover:text-[#15803D]">{l.label}</span><span className="mt-1 flex-1 text-[0.8rem] leading-relaxed text-[#6B7280]">{l.desc}</span><ArrowLeft className="mt-3 h-4 w-4 text-[#16A34A] transition-transform group-hover:-translate-x-1" aria-hidden="true" /></Link></li>
            ))}
          </ul>
        </section>
        <nav aria-label="صفحات أخرى عن العلا" className="rounded-3xl border border-[#E5E7EB] bg-white p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <Link href={HUB_PATH} className="group inline-flex min-h-[44px] items-center gap-2 text-sm font-bold text-[#15803D] hover:text-[#16A34A]"><ArrowLeft className="h-4 w-4 rotate-180" aria-hidden="true" /> كل خيارات النقل في العلا</Link>
            <ul className="flex flex-wrap gap-2">{siblings.map((n) => <li key={n.slug}><Link href={`${HUB_PATH}/${n.slug}`} className="inline-flex min-h-[36px] items-center rounded-full border border-[#E5E7EB] px-3.5 text-xs font-semibold text-[#374151] hover:border-[#16A34A]/40 hover:text-[#15803D]">{n.label}</Link></li>)}</ul>
          </div>
        </nav>
      </div>
    </div>
  );
}

export { AR_ALULA_PAGES };
