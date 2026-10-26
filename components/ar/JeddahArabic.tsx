import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Check, MessageCircle, Mail, MapPin } from "lucide-react";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqSchema, speakableSchema, itemListSchema } from "@/lib/schema";
import { contactConfig } from "@/lib/config/contact";
import { routeFact } from "@/lib/data/cluster";
import { AR_ROUTE_CONTENT_SLUGS } from "@/lib/data/routes-content-ar";
import { Head, Facts, Faqs, Quote, wa, BTN_PRIMARY, BTN_GHOST } from "@/components/ar/AlulaArabic";
import {
  AR_JEDDAH_HUB, AR_JEDDAH_FACTS, AR_JEDDAH_TRIPS, AR_JEDDAH_FLOW, AR_JEDDAH_CORRIDORS, AR_JEDDAH_AREAS,
  AR_JEDDAH_VEHICLES, AR_JEDDAH_TIMING, AR_JEDDAH_STEPS, AR_JEDDAH_FAQS, AR_JEDDAH_GUIDES, AR_FREE_WAIT, CORP_AR,
} from "@/lib/data/jeddah-cluster-ar";

const SITE = "https://taxisaudiarabia.com";
const HUB_PATH = "/ar/locations/jeddah";
const HUB_WA = "السلام عليكم، استفسار عن النقل في جدة.\n• من: \n• إلى: \n• التاريخ والوقت: \n• عدد الركاب والحقائب: \n• السيارة (سيدان / دفع رباعي / فان / كوستر): \n• رقم الرحلة (إن كان مطاراً): ";
const GREEN = "inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[#16A34A] px-6 text-xs font-bold text-[#FFFFFF] hover:bg-[#15803D]";
const OUTLINE = "inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-[#16A34A]/30 px-6 text-xs font-bold text-[#15803D] hover:bg-[#F0FDF4]";
const routeHref = (slug: string) => (AR_ROUTE_CONTENT_SLUGS.includes(slug) ? `/ar/routes/${slug}` : `/routes/${slug}`);

const CORP_EMAIL = {
  heading: "تحجز لشركة أو مجموعة؟",
  body: `أرسل قائمة رحلاتك بالبريد لنرد بعرض سعر مكتوب. ${CORP_AR}`,
  emailSubject: "طلب عرض سعر نقل — جدة",
  emailBody: "السلام عليكم فريق تاكسي السعودية،\n\nنرغب بعرض سعر مكتوب للنقل في جدة.\n\n• الشركة / المجموعة: \n• اسم المسؤول: \n• التواريخ وأرقام الرحلات: \n• الرحلات (مطار جدة / مكة / المدينة / فندق): \n• عدد الركاب لكل رحلة: \n• المركبة المطلوبة: \n\nنرجو تأكيد السعر الثابت قبل الحجز.\n\nشكراً.",
};

export function JeddahHubAr() {
  const corridors = AR_JEDDAH_CORRIDORS.map((c) => ({ ...c, f: routeFact(c.slug) })).filter((c) => c.f);
  const schema = [
    {
      "@context": "https://schema.org", "@type": "TaxiService", "@id": `${SITE}${HUB_PATH}#service`,
      name: "تاكسي ونقل خاص وسيارة مع سائق في جدة", inLanguage: "ar",
      description: "نقل خاص بحجز مسبق في جدة: من مطار الملك عبدالعزيز وإليه، وجدة–مكة وجدة–المدينة وجدة–الطائف، ونقل الفنادق، وسيارة مع سائق بالساعة، عبر شبكة شركاء. السعر يُتفق عليه قبل الحجز.",
      url: `${SITE}${HUB_PATH}`, provider: { "@type": "Organization", name: "تاكسي السعودية", url: SITE },
      areaServed: { "@type": "City", name: "جدة", geo: { "@type": "GeoCoordinates", latitude: 21.5433, longitude: 39.1728 } },
      availableLanguage: ["Arabic", "English"],
    },
    speakableSchema({ path: HUB_PATH }),
    itemListSchema(corridors.map((c) => ({ name: c.label, href: routeHref(c.slug) }))),
    faqSchema(AR_JEDDAH_FAQS),
  ];

  return (
    <div dir="rtl" lang="ar" className="min-h-screen bg-[#FAFAF7] text-[#1C1C1C]">
      <JsonLd data={schema} />
      <section className="relative isolate overflow-hidden bg-[#0B1F14]">
        <Image src="/locations/jeddah-hero.webp" alt="كورنيش جدة وأمواج البحر الأحمر عند الصخور وأبراج على الساحل" fill priority sizes="100vw" className="-z-10 object-cover object-[50%_40%]" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-l from-[#0B1F14] via-[#0B1F14]/85 to-[#0B1F14]/30" aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-[#0B1F14] to-transparent" aria-hidden="true" />
        <Breadcrumbs className="relative [&_a]:text-white/70 [&_a:hover]:text-white [&_span]:text-[#FACC15]" items={[{ name: "الرئيسية", href: "/ar" }, { name: "جدة", href: HUB_PATH }]} />
        <div className="section-container relative max-w-6xl pb-16 pt-6 md:pb-24 md:pt-10">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3.5 py-1.5 text-xs font-bold text-[#FACC15] backdrop-blur"><MapPin className="h-3.5 w-3.5" aria-hidden="true" /> جدة · Jeddah</p>
            <h1 className="mt-5 font-heading text-[2.1rem] font-bold leading-[1.15] text-[#FFFFFF] sm:text-5xl md:text-[3.2rem]">{AR_JEDDAH_HUB.h1}</h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-white/85 md:text-lg">
              سيارات خاصة بحجز مسبق للمسافرين والعائلات والمعتمرين والشركات: استقبال من مطار الملك عبدالعزيز، ورحلات إلى مكة والمدينة والطائف، ونقل الفنادق، أو سيارة مع سائق بالساعة. السعر يُتفق عليه قبل الحجز.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#quote" className={BTN_PRIMARY}>اطلب عرض سعر لرحلتي في جدة <ArrowLeft className="h-4 w-4" aria-hidden="true" /></a>
              <a href={wa(HUB_WA)} target="_blank" rel="noopener noreferrer" className={BTN_GHOST}><MessageCircle className="h-4 w-4" aria-hidden="true" /> احجز عبر واتساب</a>
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
              تنظم «تاكسي السعودية» نقلاً خاصاً في جدة عبر شبكة شركاء من السائقين المحترفين: استقبال من مطار الملك عبدالعزيز الدولي (JED) وتوصيل إليه، وجدة–مكة، وجدة–المدينة، وجدة–الطائف، ونقل الفنادق، وسيارة مع سائق بالساعة. تختار المركبة، ويُتفق على السعر قبل الحجز، والإلغاء مجاني حتى 24 ساعة قبل الموعد.
            </p>
          </div>
          <div className="mt-7"><Facts facts={AR_JEDDAH_FACTS} /></div>
        </div>
      </section>

      <div className="section-container max-w-6xl space-y-20 py-20 md:space-y-28 md:py-28">
        <section aria-labelledby="trip-heading">
          <Head id="trip-heading" eyebrow="ابدأ من هنا" title="ما نوع رحلتك في جدة؟" intro="اختر الأقرب لحاجتك. كل خيار يوضح ما ترسله لطلب عرض السعر ويفتح الصفحة التي تغطيه." />
          <div data-stagger className="grid gap-4 md:grid-cols-2">
            {AR_JEDDAH_TRIPS.map((t) => (
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

        <section id="routes" aria-labelledby="routes-heading" className="scroll-mt-24">
          <Head id="routes-heading" eyebrow="أشهر المسارات" title="نقل خاص من جدة وإليها" intro="لكل مسار صفحته ونموذج عرض السعر. المسافات والأوقات تقريبية ومصدرها بيانات المسارات نفسها." />
          <ol data-stagger className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {corridors.map((c) => (
              <li key={c.slug} className="group relative overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-5 transition-colors hover:border-[#16A34A]/40 focus-within:border-[#16A34A]">
                <div className="flex items-center justify-between gap-3">
                  <Link href={routeHref(c.slug)} className="font-heading text-base font-bold after:absolute after:inset-0 focus-visible:outline-none">{c.label}</Link>
                  <span className="shrink-0 text-start text-[0.8rem] font-semibold tabular-nums">{c.f!.km} كم</span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[#4B5563]">{c.note}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <section id="airport" aria-labelledby="airport-heading" className="relative scroll-mt-20 overflow-hidden bg-[#0B1F14] py-20 md:py-24">
        <div className="section-container relative max-w-6xl">
          <Head dark id="airport-heading" eyebrow="مطار الملك عبدالعزيز (JED)" title="من مطار جدة إلى فندقك والعكس" intro="يضم المطار الصالة 1 والصالة الشمالية وصالة الحج. أرسل رقم رحلتك ونتولى الباقي." />
          <ol data-stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {AR_JEDDAH_FLOW.map((s, i) => (
              <li key={s.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FACC15] text-sm font-bold text-[#0B1F14]">{i + 1}</span>
                <p className="mt-3 font-bold text-[#FFFFFF]">{s.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-white/75">{s.desc}</p>
              </li>
            ))}
          </ol>
          <div className="mt-8"><a href={wa(AR_JEDDAH_TRIPS[0].waPrefill)} target="_blank" rel="noopener noreferrer" className={BTN_PRIMARY}>خطّط لنقل المطار</a></div>
        </div>
      </section>

      <div className="section-container max-w-6xl space-y-20 py-20 md:space-y-28 md:py-28">
        <section id="areas" aria-labelledby="areas-heading" className="scroll-mt-24">
          <Head id="areas-heading" eyebrow="نقل الفنادق والأحياء" title="من وإلى فندقك في جدة" intro="الاستلام والتوصيل عند فندقك المؤكد، ولا ندّعي شراكة مع أي فندق. صفحات الأحياء التالية متوفرة بالإنجليزية حالياً:" />
          <ul data-stagger className="grid gap-2 sm:grid-cols-2">
            {AR_JEDDAH_AREAS.map((a) => (
              <li key={a.slug}>
                <Link href={`/locations/jeddah/${a.slug}`} className="group flex min-h-[60px] items-center justify-between gap-3 rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 hover:border-[#16A34A]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A]">
                  <span><span className="block text-sm font-semibold group-hover:text-[#15803D]">{a.name}</span><span className="block text-xs text-[#6B7280]">{a.what}</span></span>
                  <ArrowLeft className="h-4 w-4 shrink-0 text-[#16A34A]" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-[#4B5563]">حيّك غير موجود؟ أرسل عنوانك والرحلة المطلوبة. <a href={wa(AR_JEDDAH_TRIPS[5].waPrefill)} target="_blank" rel="noopener noreferrer" className="font-semibold text-[#15803D] hover:underline">اطلب نقلاً فندقياً</a></p>
        </section>

        <section aria-labelledby="hourly-heading" className="rounded-[2rem] border border-[#E5E7EB] bg-white p-7 md:p-10">
          <h2 id="hourly-heading" className="font-heading text-[1.6rem] font-bold md:text-[2rem]">سيارة مع سائق بالساعة في جدة</h2>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[#4B5563]">ثلاث محطات فأكثر، أو جولة في البلد والكورنيش، أو اجتماعات قد تطول، أو مشاوير عائلية وتسوق — احجز سيارة وسائقاً لنصف يوم أو يوم كامل. تنتظرك السيارة أمام كل محطة ويُتفق على سعر الفترة كاملة قبل الحجز. وهذا يختلف عن النقل من نقطة إلى نقطة، حيث تنتهي الرحلة عند الوجهة.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={wa(AR_JEDDAH_TRIPS[4].waPrefill)} target="_blank" rel="noopener noreferrer" className={GREEN}><MessageCircle className="h-4 w-4" aria-hidden="true" /> اطلب سيارة مع سائق بالساعة</a>
            <Link href="/locations/jeddah/private-driver" className={OUTLINE}>صفحة السائق الخاص (بالإنجليزية) <ArrowLeft className="h-4 w-4" aria-hidden="true" /></Link>
          </div>
        </section>

        <section aria-labelledby="vehicle-heading">
          <Head id="vehicle-heading" eyebrow="المركبات" title="أي مركبة تناسب مجموعتك وحقائبك؟" intro="تُؤكد المركبة وسعتها حسب تاريخ رحلتك ومسارها وعدد الركاب والحقائب عند إرسال عرض السعر. الحافلات الأكبر تُرتب عند الطلب." />
          <ul data-stagger className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {AR_JEDDAH_VEHICLES.map((v) => (
              <li key={v.href} className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
                <p className="font-heading text-base font-bold">{v.label}</p>
                <p className="mt-1 text-sm leading-relaxed text-[#4B5563]">{v.forWho}</p>
                <Link href={v.href} className="mt-2 inline-block text-xs font-bold text-[#15803D] hover:underline">تفاصيل الفئة</Link>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-[#4B5563]">المركبات تتوفر عبر شبكة شركائنا. <Link href="/fleet" className="font-semibold text-[#15803D] hover:underline">كل فئات المركبات</Link></p>
        </section>

        <section aria-labelledby="timing-heading">
          <Head id="timing-heading" eyebrow="خطّط لوقتك" title="ما الذي يغيّر مدة الرحلة في جدة" />
          <div data-stagger className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-[#E5E7EB] bg-[#E5E7EB] sm:grid-cols-2 lg:grid-cols-3">
            {AR_JEDDAH_TIMING.map((t, i) => (
              <div key={t.title} className="bg-white p-6"><span className="font-heading text-sm font-bold text-[#16A34A]">{String(i + 1).padStart(2, "0")}</span><h3 className="mt-2 font-heading text-base font-bold">{t.title}</h3><p className="mt-2 text-sm leading-relaxed text-[#4B5563]">{t.body}</p></div>
            ))}
          </div>
          <div className="mt-12 rounded-3xl border border-[#16A34A]/15 bg-[#F0FDF4] p-6 md:p-8">
            <h3 className="font-heading text-lg font-bold">كيف يتم الحجز</h3>
            <ol data-stagger className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {AR_JEDDAH_STEPS.map((s, i) => (
                <li key={s.title}><span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#16A34A] text-sm font-bold text-[#FFFFFF]">{i + 1}</span><p className="mt-3 font-bold">{s.title}</p><p className="mt-1 text-sm leading-relaxed text-[#4B5563]">{s.desc}</p></li>
              ))}
            </ol>
          </div>
        </section>

        <section aria-labelledby="corp-heading" className="rounded-[2rem] bg-[#0B1F14] p-7 text-[#FFFFFF] md:p-10">
          <p className="text-xs font-bold text-[#FACC15]">للشركات والمجموعات وكبار الضيوف</p>
          <h2 id="corp-heading" className="mt-3 font-heading text-[1.6rem] font-bold leading-tight text-[#FFFFFF] md:text-[2rem]">نقل الشركات والمجموعات في جدة بعرض سعر مكتوب</h2>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/80">منظمو الرحلات وسفر الشركات والوفود وكبار الضيوف يحصلون على جهة اتصال واحدة وتشكيلة من السيدان والدفع الرباعي والفان والكوستر عبر شبكة شركائنا. الحافلات الأكبر عند الطلب. {CORP_AR}</p>
          <ul className="mt-5 grid max-w-3xl gap-2 text-sm text-white/85 sm:grid-cols-3">
            {["عرض سعر مكتوب بالبريد", "سعر ثابت يُتفق عليه قبل الحجز", "فواتير الشركات عبر شركتنا الشقيقة"].map((t) => (
              <li key={t} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[#FACC15]" aria-hidden="true" />{t}</li>
            ))}
          </ul>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href={`mailto:${contactConfig.email}?subject=${encodeURIComponent(CORP_EMAIL.emailSubject)}&body=${encodeURIComponent(CORP_EMAIL.emailBody)}`} className="inline-flex min-h-[48px] items-center gap-2 rounded-full bg-[#FACC15] px-6 text-xs font-bold text-[#0B1F14] hover:bg-[#FDE047]"><Mail className="h-4 w-4" aria-hidden="true" /> اطلب عرضاً مكتوباً للشركات</a>
          </div>
        </section>

        <Quote heading="اطلب عرض سعر لرحلتك في جدة" body="أخبرنا برحلتك: نقطة الاستلام والوجهة والتاريخ والركاب والحقائب ورقم الرحلة للمطار. نرد على واتساب بالمركبة وسعر واحد ثابت قبل أي حجز." label="اطلب عرض سعر" waPrefill={HUB_WA} pickup="جدة" pathB={CORP_EMAIL} />

        <section aria-labelledby="faq-heading" className="grid grid-cols-1 gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div><Head id="faq-heading" eyebrow="أسئلة شائعة" title="أسئلة النقل في جدة" intro="إجابات قصيرة على ما يسأل عنه المسافرون قبل الحجز." /></div>
          <Faqs faqs={AR_JEDDAH_FAQS} />
        </section>

        <section aria-labelledby="guides-heading">
          <h2 id="guides-heading" className="mb-5 font-heading text-xl font-bold">أدلة وخدمات ذات صلة</h2>
          <ul className="grid grid-cols-1 gap-x-8 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
            {AR_JEDDAH_GUIDES.map((g) => (
              <li key={g.href}><Link href={g.href} className="group flex min-h-[44px] items-center justify-between gap-3 border-b border-[#E5E7EB] py-2 text-sm font-semibold hover:text-[#15803D]">{g.label}<ArrowLeft className="h-4 w-4 shrink-0 text-[#16A34A]" aria-hidden="true" /></Link></li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
