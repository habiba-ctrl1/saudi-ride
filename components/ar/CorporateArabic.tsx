import Link from "next/link";
import { ArrowLeft, Check, MessageCircle, Mail } from "lucide-react";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqSchema, speakableSchema } from "@/lib/schema";
import { contactConfig } from "@/lib/config/contact";
import { Head, Facts, Faqs, Quote, wa, BTN_PRIMARY, BTN_GHOST } from "@/components/ar/AlulaArabic";

// Arabic twin of /services/corporate (added 2026-10-26).
// Arabic SERP check (2026-10-26, standard search): «نقل شركات جدة / توصيل موظفين»
// returns Mourjan classifieds and driver-job ads only — no dedicated corporate
// booking pages — so one sitewide Arabic page is justified.
// Facts per seo/facts.md only: written quote by email, fixed fare agreed before
// booking, invoicing via sister company (never named), cash or bank transfer,
// e-receipt on request, free cancellation up to 24h, Arabic/English drivers, 24/7.
// No account manager / SLA / discounts / priority claims (not in facts.md).

const SITE = "https://taxisaudiarabia.com";
export const AR_CORP_PATH = "/ar/services/corporate";
const CORP_AR = "يمكن ترتيب فواتير الشركات عبر شركتنا الشقيقة.";

export const AR_CORP = {
  title: "نقل الشركات في السعودية | سيارات مع سائق وعرض سعر مكتوب",
  metaDescription: "نقل خاص للشركات والوفود في السعودية: استقبال المطار، سائق بالساعة أو ليوم كامل، ورحلات بين المدن. عرض سعر مكتوب بالبريد، وسعر ثابت قبل الحجز، وفواتير عبر شركتنا الشقيقة.",
  h1: "نقل الشركات والوفود في السعودية",
};

const FACTS = [
  { label: "عرض السعر", value: "مكتوب بالبريد أو واتساب" },
  { label: "السعر", value: "ثابت قبل الحجز" },
  { label: "الفواتير", value: "عبر شركتنا الشقيقة" },
  { label: "الدفع", value: "نقداً للسائق أو تحويل بنكي" },
  { label: "الإلغاء", value: "مجاني حتى 24 ساعة قبل الموعد" },
  { label: "السائقون", value: "يتحدثون العربية والإنجليزية" },
  { label: "الخدمة", value: "على مدار الساعة" },
  { label: "المركبات", value: "من السيدان إلى الكوستر" },
];

const USES = [
  { title: "استقبال المطار للضيوف والوفود", body: "نتابع رحلات الوصول ويلتقي السائق ضيفك بعد استلام الأمتعة. أرسل أرقام الرحلات وأعداد الركاب لنرتب المركبات حسب موجات الوصول." },
  { title: "سائق بالساعة أو ليوم كامل", body: "سيارة وسائق تنتظر أمام كل اجتماع أو محطة، مناسبة لزيارات متعددة في اليوم نفسه أو جدول قد يتغير." },
  { title: "رحلات بين المدن", body: "الرياض وجدة والدمام ومكة والمدينة وغيرها بسيارة خاصة، مع توقفات الراحة والصلاة عند الطلب وسعر يُتفق عليه قبل السفر." },
  { title: "المعارض والفعاليات والمؤتمرات", body: "نقل بين المطار والفندق وقاعة الفعالية. أرسل اسم الفعالية والتواريخ وعدد الضيوف لنقدّم عرضاً يغطي الرحلات كلها." },
  { title: "مجموعات كبيرة", body: "فانات وكوسترات وحافلات أكبر عند الطلب عبر شبكة شركائنا، حسب العدد والأمتعة." },
];

const CITIES = [
  { label: "نقل الشركات في جدة", href: "/ar/locations/jeddah" },
  { label: "النقل الخاص في مكة المكرمة", href: "/ar/locations/makkah" },
  { label: "النقل الخاص في المدينة المنورة", href: "/ar/locations/madinah" },
  { label: "الرياض (بالإنجليزية)", href: "/locations/riyadh" },
];

const FAQS = [
  { question: "ما هي خدمة نقل الشركات؟", answer: "هي سيارة خاصة مع سائق محترف تُحجز مسبقاً لسفر الشركة: استقبال المطار، واجتماعات اليوم، ورحلات بين المدن، وسائق بالساعة. تُرتَّب عبر شبكة شركائنا ويُتفق على السعر قبل الحجز." },
  { question: "كيف تتم فواتير الشركات؟", answer: `${CORP_AR} أرسل اسم الشركة والرقم الضريبي ورقم أمر الشراء مع طلبك، ونؤكد تفاصيل الفاتورة قبل إتمام الحجز.` },
  { question: "هل يمكن أن تحجز شركة رحلات لعدة موظفين؟", answer: "نعم. أرسل أسماء المسافرين والمسارات والتواريخ وأعداد الركاب بالبريد أو واتساب، ونرد بعرض سعر واحد يغطيها مع سعر ثابت قبل الحجز." },
  { question: "هل السعر ثابت لرحلات الشركات؟", answer: "نعم. يُعرض السعر ويُتفق عليه قبل الحجز — بلا عدّاد ولا زيادة وقت الذروة — فتعرف التكلفة قبل الاعتماد والمصروفات." },
  { question: "كيف يتم الدفع؟", answer: "الدفع نقداً للسائق أو بتحويل بنكي، ويمكن إصدار إيصال إلكتروني عند الطلب." },
  { question: "هل يمكن الإلغاء؟", answer: "نعم. الإلغاء مجاني حتى 24 ساعة قبل موعد الاستلام، ويمكن تعديل الوقت أو العنوان عبر واتساب." },
];

const CORP_EMAIL = {
  heading: "تحجز لشركة أو وفد؟",
  body: `أرسل المدن والتواريخ وأعداد الركاب بالبريد لنرد بعرض سعر مكتوب. ${CORP_AR}`,
  emailSubject: "طلب عرض سعر نقل شركات",
  emailBody: "السلام عليكم فريق تاكسي السعودية،\n\nنرغب بعرض سعر مكتوب لنقل الشركات.\n\n• الشركة: \n• اسم المسؤول والمسمى: \n• المدن / المسارات: \n• التواريخ: \n• عدد الركاب لكل رحلة: \n• المركبة المطلوبة (سيدان / دفع رباعي / فان / كوستر): \n• الفوترة (الرقم الضريبي / أمر الشراء): \n\nنرجو تأكيد تفاصيل الفاتورة والسعر الثابت قبل الحجز.\n\nشكراً.",
};

const WA = "السلام عليكم، أريد عرض سعر لنقل شركة.\n• الشركة: \n• المدن / المسارات: \n• التواريخ: \n• عدد الركاب: \n• المركبة (سيدان / دفع رباعي / فان / كوستر): \n• هل تحتاجون فاتورة؟: ";

const GREEN = "inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[#16A34A] px-6 text-xs font-bold text-[#FFFFFF] hover:bg-[#15803D]";

export function CorporateAr() {
  const schema = [
    {
      "@context": "https://schema.org", "@type": "Service", "@id": `${SITE}${AR_CORP_PATH}#service`, inLanguage: "ar",
      name: "نقل الشركات والوفود في السعودية", serviceType: "نقل خاص للشركات",
      description: "نقل خاص للشركات والوفود بحجز مسبق: استقبال المطار وسائق بالساعة ورحلات بين المدن، عبر شبكة شركاء. عرض سعر مكتوب وسعر ثابت قبل الحجز.",
      url: `${SITE}${AR_CORP_PATH}`, provider: { "@type": "Organization", name: "تاكسي السعودية", url: SITE },
      areaServed: { "@type": "Country", name: "المملكة العربية السعودية" },
      availableLanguage: ["Arabic", "English"],
    },
    speakableSchema({ path: AR_CORP_PATH }),
    faqSchema(FAQS),
  ];
  return (
    <div dir="rtl" lang="ar" className="min-h-screen bg-[#FAFAF7] text-[#1C1C1C]">
      <JsonLd data={schema} />
      <section className="relative isolate overflow-hidden bg-[#0B1F14]">
        <Breadcrumbs className="relative [&_a]:text-white/70 [&_a:hover]:text-white [&_span]:text-[#FACC15]" items={[{ name: "الرئيسية", href: "/ar" }, { name: "نقل الشركات", href: AR_CORP_PATH }]} />
        <div className="section-container relative max-w-6xl pb-16 pt-6 md:pb-24 md:pt-10">
          <div className="max-w-2xl">
            <h1 className="font-heading text-[2.1rem] font-bold leading-[1.15] text-[#FFFFFF] sm:text-5xl">{AR_CORP.h1}</h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-white/85 md:text-lg">
              سيارات خاصة مع سائقين محترفين لسفر الشركات والوفود: استقبال المطار، وسائق بالساعة أو ليوم كامل، ورحلات بين المدن. عرض سعر مكتوب بالبريد، وسعر ثابت قبل الحجز، وفواتير الشركات عبر شركتنا الشقيقة.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#quote" className={BTN_PRIMARY}>اطلب عرض سعر للشركة <ArrowLeft className="h-4 w-4" aria-hidden="true" /></a>
              <a href={wa(WA)} target="_blank" rel="noopener noreferrer" className={BTN_GHOST}><MessageCircle className="h-4 w-4" aria-hidden="true" /> واتساب</a>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="answer-heading" className="section-container relative z-10 -mt-8 max-w-6xl">
        <div className="rounded-[2rem] border border-[#16A34A]/15 bg-white p-6 shadow-[0_30px_70px_-45px_rgba(15,23,42,0.5)] md:p-9">
          <div className="grid gap-6 md:grid-cols-[auto_1fr] md:gap-8">
            <p id="answer-heading" className="text-xs font-bold text-[#16A34A] md:w-32 md:pt-1">الجواب المختصر</p>
            <p id="speakable-summary" className="text-[1.05rem] leading-relaxed text-[#1F2937] md:text-lg">
              تنظم «تاكسي السعودية» نقلاً خاصاً للشركات والوفود عبر شبكة شركاء من السائقين المحترفين: استقبال المطار، وسائق بالساعة أو ليوم كامل، ورحلات بين المدن. ترسل مساراتك وتواريخك فيصلك عرض سعر مكتوب بسعر ثابت قبل الحجز، ويمكن ترتيب فواتير الشركات عبر شركتنا الشقيقة.
            </p>
          </div>
          <div className="mt-7"><Facts facts={FACTS} /></div>
        </div>
      </section>

      <div className="section-container max-w-6xl space-y-20 py-20 md:space-y-28 md:py-28">
        <section aria-labelledby="uses-heading">
          <Head id="uses-heading" eyebrow="ما الذي نغطيه" title="ما أنواع رحلات الشركات التي نرتبها؟" intro="اختر الأقرب لحاجتك، وأرسل التفاصيل لنقدّم عرضاً مكتوباً يغطي الرحلات كلها." />
          <div data-stagger className="grid gap-4 md:grid-cols-2">
            {USES.map((u) => (
              <article key={u.title} className="rounded-3xl border border-[#E5E7EB] bg-white p-6">
                <h3 className="font-heading text-lg font-bold">{u.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#4B5563]">{u.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="decide-heading" className="rounded-[2rem] border border-[#E5E7EB] bg-white p-7 md:p-10">
          <h2 id="decide-heading" className="font-heading text-[1.6rem] font-bold md:text-[2rem]">حجز رحلة واحدة أم عرض سعر لبرنامج كامل؟</h2>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[#4B5563]">الرحلة الواحدة أسرع عبر واتساب. أما إذا كانت لديك عدة رحلات أو عدة مسافرين أو تحتاج فاتورة فالأنسب عرض سعر مكتوب واحد بالبريد. وإن لم تكن متأكداً فأرسل التفاصيل على واتساب ونخبرك بالأنسب.</p>
          <ul data-stagger className="mt-5 grid gap-2 text-sm text-[#374151] sm:grid-cols-3">
            {["عرض سعر مكتوب بالبريد", "سعر ثابت يُتفق عليه قبل الحجز", "فواتير الشركات عبر شركتنا الشقيقة"].map((t) => (
              <li key={t} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[#16A34A]" aria-hidden="true" />{t}</li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={`mailto:${contactConfig.email}?subject=${encodeURIComponent(CORP_EMAIL.emailSubject)}&body=${encodeURIComponent(CORP_EMAIL.emailBody)}`} className={GREEN}><Mail className="h-4 w-4" aria-hidden="true" /> اطلب عرضاً مكتوباً بالبريد</a>
          </div>
        </section>

        <section aria-labelledby="cities-heading">
          <Head id="cities-heading" eyebrow="المدن" title="أين نرتب نقل الشركات؟" intro="الرياض وجدة والدمام ومكة والمدينة وغيرها عبر شبكة شركائنا. تفاصيل كل مدينة هنا:" />
          <ul data-stagger className="grid gap-2 sm:grid-cols-2">
            {CITIES.map((c) => (
              <li key={c.href}><Link href={c.href} className="group flex min-h-[56px] items-center justify-between gap-3 rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm font-semibold hover:border-[#16A34A]/40 hover:text-[#15803D]">{c.label}<ArrowLeft className="h-4 w-4 shrink-0 text-[#16A34A]" aria-hidden="true" /></Link></li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-[#4B5563]">فئات المركبات المتاحة عبر الشبكة في <Link href="/fleet" className="font-semibold text-[#15803D] hover:underline">صفحة المركبات</Link> (بالإنجليزية).</p>
        </section>

        <Quote heading="اطلب عرض سعر لشركتك" body="أرسل المدن والتواريخ وأعداد الركاب. نرد بالمركبة وسعر ثابت قبل أي حجز، ونؤكد تفاصيل الفاتورة قبل إتمام الحجز." label="اطلب عرض سعر" waPrefill={WA} pickup="الشركة" pathB={CORP_EMAIL} />

        <section aria-labelledby="faq-heading" className="grid grid-cols-1 gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div><Head id="faq-heading" eyebrow="أسئلة شائعة" title="أسئلة نقل الشركات" intro="إجابات قصيرة على ما تسأل عنه الشركات قبل الحجز." /></div>
          <Faqs faqs={FAQS} />
        </section>
      </div>
    </div>
  );
}
