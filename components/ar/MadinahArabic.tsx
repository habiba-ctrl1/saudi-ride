import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Check, MessageCircle, Mail, MapPin } from "lucide-react";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqSchema, speakableSchema, itemListSchema } from "@/lib/schema";
import { contactConfig } from "@/lib/config/contact";
import { routeFact } from "@/lib/data/cluster";
import { FLEET_VEHICLES } from "@/lib/fleet-data";
import { AR_ROUTE_CONTENT_SLUGS } from "@/lib/data/routes-content-ar";
import { MadinahRouteMap } from "@/components/location/cluster/MadinahRouteMap";
import { Head, Facts, Faqs, Quote, wa, BTN_PRIMARY, BTN_GHOST } from "@/components/ar/AlulaArabic";
import {
  AR_MADINAH_HUB, AR_MADINAH_FACTS, AR_MADINAH_TRIPS, AR_MED_FLOW, AR_MADINAH_CORRIDORS, AR_ZIYARAT_STOPS,
  AR_MADINAH_VEHICLES, AR_MADINAH_TIMING, AR_MADINAH_STEPS, AR_MADINAH_FAQS, AR_MADINAH_GUIDES, AR_FREE_WAIT, CORP_AR, dur,
} from "@/lib/data/madinah-cluster-ar";

const SITE = "https://taxisaudiarabia.com";
const HUB_PATH = "/ar/locations/madinah";
const HUB_WA = "السلام عليكم، استفسار عن النقل في المدينة المنورة.\n• من: \n• إلى: \n• التاريخ والوقت: \n• عدد الركاب والحقائب: \n• السيارة (سيدان / دفع رباعي / ستاريا / فان / كوستر): \n• رقم الرحلة (للمطار): ";
const GREEN = "inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[#16A34A] px-6 text-xs font-bold text-[#FFFFFF] hover:bg-[#15803D]";
const OUTLINE = "inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-[#16A34A]/30 px-6 text-xs font-bold text-[#15803D] hover:bg-[#F0FDF4]";
const routeHref = (slug: string) => (AR_ROUTE_CONTENT_SLUGS.includes(slug) ? `/ar/routes/${slug}` : `/routes/${slug}`);

const CORP_EMAIL = {
  heading: "تحجز لشركة أو مجموعة عمرة؟",
  body: `أرسل قائمة رحلاتك بالبريد لنرد بعرض سعر مكتوب. ${CORP_AR}`,
  emailSubject: "طلب عرض سعر نقل — المدينة المنورة",
  emailBody: "السلام عليكم فريق تاكسي السعودية،\n\nنرغب بعرض سعر مكتوب للنقل في المدينة المنورة.\n\n• الشركة / المجموعة: \n• اسم المسؤول: \n• التواريخ وأرقام الرحلات: \n• الرحلات (مطار المدينة / فندق / زيارات / مكة): \n• عدد الركاب لكل رحلة: \n• المركبة المطلوبة: \n\nنرجو تأكيد السعر الثابت قبل الحجز.\n\nشكراً لكم.",
};

function fleetCaps(slug: string) {
  const v = FLEET_VEHICLES.find((x) => x.slug === slug);
  return v ? { passengers: v.passengers, luggage: v.luggage } : null;
}

function VehicleGrid() {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {AR_MADINAH_VEHICLES.map((v) => {
        const c = fleetCaps(v.slug);
        return (
          <li key={v.slug} className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
            <p className="font-heading text-base font-bold">{v.label}</p>
            <p className="mt-1 text-sm leading-relaxed text-[#4B5563]">{v.forWho}</p>
            {c && <p className="mt-2 text-xs font-semibold text-[#15803D]">حتى {c.passengers} ركاب · {c.luggage} حقائب</p>}
            <Link href={v.href} className="mt-2 inline-block text-xs font-bold text-[#15803D] hover:underline">تفاصيل الفئة</Link>
          </li>
        );
      })}
    </ul>
  );
}

/* ═══ الصفحة الرئيسية للمدينة المنورة ═══ */
export function MadinahHubAr() {
  const corridors = AR_MADINAH_CORRIDORS.map((c) => ({ ...c, f: routeFact(c.slug) })).filter((c) => c.f);
  const med = routeFact("madinah-airport-to-city")!;
  const schema = [
    {
      "@context": "https://schema.org", "@type": "TaxiService", "@id": `${SITE}${HUB_PATH}#service`,
      name: "تاكسي ونقل خاص وسيارة مع سائق في المدينة المنورة", inLanguage: "ar",
      description: "نقل خاص بحجز مسبق في المدينة المنورة: من مطار المدينة وإليه، وفنادق المنطقة المركزية، وزيارات المدينة بالسيارة، وسيارة مع سائق بالساعة، والرحلات إلى مكة وجدة والعلا والرياض وينبع عبر شبكة شركاء. السعر يُتفق عليه قبل الحجز.",
      url: `${SITE}${HUB_PATH}`, provider: { "@type": "Organization", name: "تاكسي السعودية", url: SITE },
      areaServed: { "@type": "City", name: "المدينة المنورة", geo: { "@type": "GeoCoordinates", latitude: 24.4672, longitude: 39.6111 } },
      availableLanguage: ["Arabic", "English"],
    },
    speakableSchema({ path: HUB_PATH }),
    itemListSchema(corridors.map((c) => ({ name: c.label, href: routeHref(c.slug) }))),
    faqSchema(AR_MADINAH_FAQS),
  ];

  return (
    <div dir="rtl" lang="ar" className="min-h-screen bg-[#FAFAF7] text-[#1C1C1C]">
      <JsonLd data={schema} />
      <section className="relative isolate overflow-hidden bg-[#0B1F14]">
        <Image src="/locations/madinah-hero.webp" alt="مظلات ساحة المسجد النبوي في المدينة المنورة تحت ضوء الشمس" fill priority sizes="100vw" className="-z-10 object-cover object-[50%_18%]" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-l from-[#0B1F14] via-[#0B1F14]/85 to-[#0B1F14]/30" aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-[#0B1F14] to-transparent" aria-hidden="true" />
        <Breadcrumbs className="relative [&_a]:text-white/70 [&_a:hover]:text-white [&_span]:text-[#FACC15]" items={[{ name: "الرئيسية", href: "/ar" }, { name: "المدينة المنورة", href: HUB_PATH }]} />
        <div className="section-container relative max-w-6xl pb-16 pt-6 md:pb-24 md:pt-10">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3.5 py-1.5 text-xs font-bold text-[#FACC15] backdrop-blur"><MapPin className="h-3.5 w-3.5" aria-hidden="true" /> المدينة المنورة · Madinah</p>
            <h1 className="mt-5 font-heading text-[2.1rem] font-bold leading-[1.15] text-[#FFFFFF] sm:text-5xl md:text-[3.2rem]">{AR_MADINAH_HUB.h1}</h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-white/85 md:text-lg">
              نقل خاص بحجز مسبق من مطار المدينة وإليه، وإلى فنادق المنطقة المركزية قرب المسجد النبوي، وزيارات المدينة بالسيارة، وسيارة مع سائق بالساعة، والرحلات إلى مكة وجدة والعلا. أخبرنا بالمسار والتاريخ وعدد الركاب ونؤكد لك سعراً واحداً على واتساب قبل الحجز.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#quote" className={BTN_PRIMARY}>اطلب عرض سعر لرحلتي في المدينة <ArrowLeft className="h-4 w-4" aria-hidden="true" /></a>
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
              تنظم «تاكسي السعودية» نقلاً خاصاً في المدينة المنورة عبر شبكة شركاء من السائقين المحترفين: من مطار الأمير محمد بن عبدالعزيز الدولي (نحو {med.km} كم عن وسط المدينة) وإليه، ونقل الفنادق حول المسجد النبوي، وزيارات المدينة بالسيارة، وسيارة مع سائق بالساعة، والرحلات إلى مكة المكرمة وجدة والعلا. تختار المركبة، ويُؤكد السعر قبل الحجز، والإلغاء مجاني حتى 24 ساعة قبل الموعد.
            </p>
          </div>
          <div className="mt-7"><Facts facts={AR_MADINAH_FACTS} /></div>
        </div>
      </section>

      <div className="section-container max-w-6xl space-y-20 py-20 md:space-y-28 md:py-28">
        <section aria-labelledby="trip-heading">
          <Head id="trip-heading" eyebrow="ابدأ من هنا" title="أي رحلة تحتاج في المدينة المنورة؟" intro="اختر الأقرب لحاجتك. كل خيار يوضح ما ترسله لطلب عرض السعر ويفتح الصفحة المختصة به." />
          <div className="grid gap-4 md:grid-cols-2">
            {AR_MADINAH_TRIPS.map((t) => (
              <article key={t.id} className="flex flex-col rounded-3xl border border-[#E5E7EB] bg-white p-6">
                <h3 className="font-heading text-lg font-bold">{t.label} <span className="text-sm font-normal text-[#6B7280]">· {t.short}</span></h3>
                <p className="mt-2 text-sm leading-relaxed text-[#4B5563]">{t.answer}</p>
                <p className="mt-4 text-xs font-bold text-[#15803D]">أرسل لنا لطلب العرض</p>
                <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
                  {t.send.map((s) => <li key={s} className="flex items-start gap-2 text-sm text-[#374151]"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[#16A34A]" aria-hidden="true" />{s}</li>)}
                </ul>
                <div className="mt-5 flex flex-wrap gap-3">
                  <a href={wa(t.waPrefill)} target="_blank" rel="noopener noreferrer" className={GREEN}><MessageCircle className="h-4 w-4" aria-hidden="true" /> اطلب عرض سعر</a>
                  {t.href.startsWith("#") ? <a href={t.href} className={OUTLINE}>{t.linkLabel} <ArrowLeft className="h-4 w-4" aria-hidden="true" /></a> : <Link href={t.href} className={OUTLINE}>{t.linkLabel} <ArrowLeft className="h-4 w-4" aria-hidden="true" /></Link>}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="routes" aria-labelledby="routes-heading" className="scroll-mt-24">
          <Head id="routes-heading" eyebrow="المسارات بين المدن" title="نقل خاص من المدينة المنورة وإليها" intro="لكل مسار صفحته ونموذج عرض السعر. المسافات والأوقات تقريبية وتأتي من بيانات المسارات نفسها المستخدمة في صفحات المسارات." />
          <MadinahRouteMap ar />
          <ol className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-2">
            {corridors.map((c) => (
              <li key={c.slug} className="group relative overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-5 transition-colors hover:border-[#16A34A]/40 focus-within:border-[#16A34A]">
                <div className="flex items-center justify-between gap-3">
                  <Link href={routeHref(c.slug)} className="font-heading text-base font-bold after:absolute after:inset-0 focus-visible:outline-none">{c.label}</Link>
                  <span className="shrink-0 text-start text-[0.8rem] font-semibold tabular-nums">{c.f!.km} كم · {dur(c.f!.minutes)}</span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[#4B5563]">{c.note}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <section id="airport" aria-labelledby="airport-heading" className="relative scroll-mt-20 overflow-hidden bg-[#0B1F14] py-20 md:py-24">
        <div className="section-container relative max-w-6xl">
          <Head dark id="airport-heading" eyebrow="نقل مطار المدينة" title="من المطار إلى فندقك في المدينة والعكس" intro={`مطار الأمير محمد بن عبدالعزيز الدولي (MED) يبعد نحو ${med.km} كم عن المنطقة المركزية، أي ${dur(med.minutes)} تقريباً في الطريق الخالي. احجز مسبقاً وأرسل رقم رحلتك ويستقبلك السائق في صالة الوصول.`} />
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {AR_MED_FLOW.map((s, i) => (
              <li key={s.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FACC15] text-sm font-bold text-[#0B1F14]">{i + 1}</span>
                <p className="mt-3 font-bold text-[#FFFFFF]">{s.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-white/75">{s.desc}</p>
              </li>
            ))}
          </ol>
          <div className="mt-8"><a href={wa(AR_MADINAH_TRIPS[0].waPrefill)} target="_blank" rel="noopener noreferrer" className={BTN_PRIMARY}>خطّط لنقل المطار</a></div>
        </div>
      </section>

      <div className="section-container max-w-6xl space-y-20 py-20 md:space-y-28 md:py-28">
        <section id="hotels" aria-labelledby="hotels-heading" className="scroll-mt-24">
          <Head id="hotels-heading" eyebrow="فنادق المنطقة المركزية" title="نقل من وإلى فندقك قرب المسجد النبوي" intro="المنطقة المركزية هي الحي المحيط بالمسجد النبوي حيث تقع أغلب فنادق المعتمرين، ودخول المركبات إليها مقيّد. لذلك يتوقف السائق عند أقرب نقطة مسموحة من فندقك." />
          <ul className="grid gap-3 text-sm leading-relaxed text-[#4B5563] md:grid-cols-2">
            {[
              "أرسل اسم الفندق بدقة، فهو الذي يحدد نقطة النزول المسموحة.",
              "قد تُبطئ مواعيد الصلاة ويوم الجمعة الطرق حول المسجد، ويحسب موعد الاستلام ذلك.",
              "قد تحتاج إلى حمّال أو مشي قصير من نقطة النزول، فأخبرنا بالحقائب الثقيلة أو احتياجات الحركة.",
              "لا ندّعي أي شراكة مع فندق: يلتقيك السائق عند فندقك المؤكد.",
            ].map((t) => <li key={t} className="flex gap-3 rounded-2xl border border-[#E5E7EB] bg-white p-4"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[#16A34A]" aria-hidden="true" />{t}</li>)}
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={wa(AR_MADINAH_TRIPS[1].waPrefill)} target="_blank" rel="noopener noreferrer" className={GREEN}><MessageCircle className="h-4 w-4" aria-hidden="true" /> اطلب نقل الفندق</a>
            <Link href="/routes/madinah-airport-to-madinah-markaziyah" className={OUTLINE}>من المطار إلى فنادق المنطقة المركزية <ArrowLeft className="h-4 w-4" aria-hidden="true" /></Link>
          </div>
        </section>

        <section id="ziyarat" aria-labelledby="ziyarat-heading" className="scroll-mt-24">
          <Head id="ziyarat-heading" eyebrow="زيارات المدينة المنورة" title="سيارة خاصة بين مواقع الزيارة التي تختارها" intro="تنقلك السيارة من موقع إلى آخر وتنتظرك عند كل محطة، فلا يضطر كبار السن والأطفال للبحث عن مركبة. خدمة نقل فقط، لا نوفّر مرشداً ولا إرشاداً دينياً. المسافات تقريبية بالطريق من المسجد النبوي." />
          <ol className="grid gap-3 sm:grid-cols-2">
            {AR_ZIYARAT_STOPS.map((s) => (
              <li key={s.name} className="rounded-2xl border border-[#E5E7EB] bg-white p-5"><p className="font-heading text-base font-bold">{s.name}</p><p className="mt-2 text-sm leading-relaxed text-[#4B5563]">{s.note}</p></li>
            ))}
          </ol>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={wa(AR_MADINAH_TRIPS[2].waPrefill)} target="_blank" rel="noopener noreferrer" className={GREEN}><MessageCircle className="h-4 w-4" aria-hidden="true" /> احجز سيارة زيارات المدينة</a>
            <Link href="/services/madinah-ziyarat" className={OUTLINE}>مخطط الزيارات والمسار (بالإنجليزية) <ArrowLeft className="h-4 w-4" aria-hidden="true" /></Link>
          </div>
        </section>

        <section aria-labelledby="hourly-heading" className="rounded-[2rem] border border-[#E5E7EB] bg-white p-7 md:p-10">
          <h2 id="hourly-heading" className="font-heading text-[1.6rem] font-bold md:text-[2rem]">سيارة مع سائق بالساعة في المدينة المنورة</h2>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[#4B5563]">ثلاث محطات فأكثر، أو والدان كبيران في السن، أو أطفال، أو خطة تتغير حسب مواعيد الصلاة — احجز سيارة وسائقاً لنصف يوم أو يوم كامل. تنتظرك السيارة أمام كل محطة ويُتفق على سعر الفترة كلها قبل الحجز.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={wa(AR_MADINAH_TRIPS[3].waPrefill)} target="_blank" rel="noopener noreferrer" className={GREEN}><MessageCircle className="h-4 w-4" aria-hidden="true" /> اطلب سيارة مع سائق بالساعة</a>
            <Link href="/locations/madinah/private-driver" className={OUTLINE}>صفحة السائق الخاص (بالإنجليزية) <ArrowLeft className="h-4 w-4" aria-hidden="true" /></Link>
          </div>
        </section>

        <section aria-labelledby="vehicle-heading">
          <Head id="vehicle-heading" eyebrow="المركبات" title="أي مركبة تناسب مجموعتك وحقائبك؟" intro="تُؤكد المركبة حسب تاريخ رحلتك ومسارها وعدد الركاب والحقائب. الحافلات الأكبر تُرتب عند الطلب." />
          <VehicleGrid />
          <p className="mt-4 text-sm text-[#4B5563]">المركبات تتوفر عبر شبكة شركائنا. <Link href="/fleet" className="font-semibold text-[#15803D] hover:underline">كل فئات المركبات</Link></p>
        </section>

        <section aria-labelledby="timing-heading">
          <Head id="timing-heading" eyebrow="خطّط لوقتك" title="ما الذي يغيّر مدة الرحلة في المدينة" />
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-[#E5E7EB] bg-[#E5E7EB] sm:grid-cols-2 lg:grid-cols-3">
            {AR_MADINAH_TIMING.map((t, i) => (
              <div key={t.title} className="bg-white p-6"><span className="font-heading text-sm font-bold text-[#16A34A]">{String(i + 1).padStart(2, "0")}</span><h3 className="mt-2 font-heading text-base font-bold">{t.title}</h3><p className="mt-2 text-sm leading-relaxed text-[#4B5563]">{t.body}</p></div>
            ))}
          </div>
          <div className="mt-12 rounded-3xl border border-[#16A34A]/15 bg-[#F0FDF4] p-6 md:p-8">
            <h3 className="font-heading text-lg font-bold">كيف يتم الحجز</h3>
            <ol className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {AR_MADINAH_STEPS.map((s, i) => (
                <li key={s.title}><span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#16A34A] text-sm font-bold text-[#FFFFFF]">{i + 1}</span><p className="mt-3 font-bold">{s.title}</p><p className="mt-1 text-sm leading-relaxed text-[#4B5563]">{s.desc}</p></li>
              ))}
            </ol>
          </div>
        </section>

        <section aria-labelledby="corp-heading" className="rounded-[2rem] bg-[#0B1F14] p-7 text-[#FFFFFF] md:p-10">
          <p className="text-xs font-bold text-[#FACC15]">للشركات ومجموعات العمرة والوفود</p>
          <h2 id="corp-heading" className="mt-3 font-heading text-[1.6rem] font-bold leading-tight text-[#FFFFFF] md:text-[2rem]">نقل الشركات والمجموعات في المدينة المنورة بعرض سعر مكتوب</h2>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/80">منظمو مجموعات العمرة وسفر الشركات والوفود يحصلون على جهة اتصال واحدة وتشكيلة من السيدان التنفيذية والدفع الرباعي والفانات والكوسترات عبر شبكة شركائنا. الحافلات الأكبر تُرتب عند الطلب. {CORP_AR}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href={`mailto:${contactConfig.email}?subject=${encodeURIComponent(CORP_EMAIL.emailSubject)}&body=${encodeURIComponent(CORP_EMAIL.emailBody)}`} className="inline-flex min-h-[48px] items-center gap-2 rounded-full bg-[#FACC15] px-6 text-xs font-bold text-[#0B1F14] hover:bg-[#FDE047]"><Mail className="h-4 w-4" aria-hidden="true" /> اطلب عرض سعر مكتوب</a>
          </div>
        </section>

        <Quote heading="اطلب عرض سعر لرحلتك في المدينة المنورة" body="أخبرنا برحلتك: نقطة الاستلام والوجهة والتاريخ والركاب والحقائب ورقم الرحلة للمطار. نرد على واتساب بالمركبة وسعر واحد ثابت قبل أي حجز." label="اطلب عرض سعر" waPrefill={HUB_WA} pickup="المدينة المنورة" pathB={CORP_EMAIL} />

        <section aria-labelledby="faq-heading" className="grid grid-cols-1 gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div><Head id="faq-heading" eyebrow="أسئلة شائعة" title="أسئلة النقل في المدينة المنورة" intro="إجابات قصيرة على ما يسأل عنه المسافرون قبل الحجز." /></div>
          <Faqs faqs={AR_MADINAH_FAQS} />
        </section>

        <section aria-labelledby="guides-heading">
          <h2 id="guides-heading" className="mb-5 font-heading text-xl font-bold">أدلة المدينة المنورة وخدمات ذات صلة</h2>
          <ul className="grid grid-cols-1 gap-x-8 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
            {AR_MADINAH_GUIDES.map((g) => (
              <li key={g.href}><Link href={g.href} className="group flex min-h-[44px] items-center justify-between gap-3 border-b border-[#E5E7EB] py-2 text-sm font-semibold hover:text-[#15803D]">{g.label}<ArrowLeft className="h-4 w-4 shrink-0 text-[#16A34A]" aria-hidden="true" /></Link></li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-[#4B5563]">تسافر إلى مكة أيضاً؟ راجع <Link href="/ar/locations/makkah" className="font-semibold text-[#15803D] hover:underline">النقل الخاص في مكة المكرمة</Link> أو <Link href="/ar/locations/alula" className="font-semibold text-[#15803D] hover:underline">العلا</Link>.</p>
        </section>
      </div>
    </div>
  );
}
