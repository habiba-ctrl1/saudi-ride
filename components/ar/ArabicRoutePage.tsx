import Link from "next/link";
import { breadcrumbSchema, faqSchema, speakableSchema, serviceSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { TLDRSummary } from "@/components/seo/TLDRSummary";
import { contactConfig } from "@/lib/config/contact";
import { ROUTES_DATA } from "@/lib/data/routes";
import WhatsAppQuoteForm from "@/components/booking/WhatsAppQuoteForm";

export interface ArabicRouteContent {
  slug: string;
  /** Hero pill text, e.g. "الرحلة التنفيذية الأكثر طلباً". */
  badge: string;
  /** Extra hero sentence appended after the route's Arabic description. */
  introExtra: string;
  tldrAnswer: string;
  tldrFacts: { label: string; value: string }[];
  whyUs: { title: string; desc: string }[];
  faqs: { question: string; answer: string }[];
}

const VEHICLES = [
  { key: "sedan", nameAr: "سيدان تنفيذية (تويوتا كامري)", pax: "3 ركاب" },
  { key: "suv", nameAr: "GMC يوكن فاخرة", pax: "6 ركاب" },
  { key: "van", nameAr: "هيونداي ستاريا (فان عائلي)", pax: "7 ركاب" },
  { key: "luxury", nameAr: "مرسيدس بنز الفئة S (VIP)", pax: "3 ركاب" },
];

// Arabic corporate (Path B) block copy, keyed by slug. The invoicing paragraph
// and button labels are shared in the JSX; only heading/intro/prefills differ.
const AR_CORPORATE: Record<string, { heading: string; intro: string; waPrefill: string; emailSubject: string; emailBody: string }> = {
  "riyadh-to-dammam": {
    heading: "تنقلات فريق عمل بين الرياض والمنطقة الشرقية؟",
    intro:
      "لممر أرامكو والظهران والخبر نوفّر سيارات سيدان تنفيذية ودفع رباعي كبيرة مع سائقين محترفين — ذهاب فقط، أو ذهاب وعودة في نفس اليوم، أو بالساعة. ويمكن تشغيل تنقلات الموظفين المنتظمة عبر حساب واحد ونقطة تواصل واحدة بدلاً من الحجز لكل رحلة.",
    waPrefill: `السلام عليكم، استفسار عن تنقلات الشركات — الرياض / الدمام (المنطقة الشرقية).\n• الشركة: \n• الرحلات والتواريخ: \n• عدد الركاب لكل رحلة: \n• نوع السيارة (سيدان تنفيذية / SUV / فان): \n• هل تحتاج فاتورة (ضريبي / أمر شراء)؟: `,
    emailSubject: "طلب عرض سعر لتنقلات الشركات — الرياض–الدمام",
    emailBody: `مرحباً فريق تاكسي السعودية،\n\nنرغب بالحصول على عرض سعر مكتوب لتنقلات الشركات على ممر الرياض–الدمام / المنطقة الشرقية.\n\n• اسم الشركة: \n• اسم وصفة المسؤول: \n• الرحلات والتواريخ: \n• عدد الركاب لكل رحلة: \n• السيارة المفضّلة (سيدان تنفيذية / SUV / فان): \n• الرقم الضريبي: \n• مرجع أمر الشراء: \n\nيرجى تأكيد تفاصيل الفوترة وسعر ثابت قبل الحجز.\n\nشكراً لكم.`,
  },
  "jeddah-to-kaec": {
    heading: "زيارة أعمال إلى مدينة الملك عبدالله الاقتصادية؟",
    intro:
      "لزيارات ميناء الملك عبدالله والوادي الصناعي ومكاتب المدينة الاقتصادية نوفّر سيارات سيدان تنفيذية ودفع رباعي مع سائقين محترفين — ذهاب فقط أو بالساعة مع وقت انتظار. ويمكن تشغيل تنقلات الشركة المنتظمة عبر حساب واحد ونقطة تواصل واحدة بدلاً من الحجز لكل رحلة.",
    waPrefill: `السلام عليكم، استفسار عن تنقلات الشركات — جدة / مدينة الملك عبدالله الاقتصادية.\n• الشركة: \n• الرحلات والتواريخ: \n• عدد الركاب لكل رحلة: \n• نوع السيارة (سيدان تنفيذية / SUV / فان): \n• هل تحتاج فاتورة (ضريبي / أمر شراء)؟: `,
    emailSubject: "طلب عرض سعر لتنقلات الشركات — جدة–المدينة الاقتصادية",
    emailBody: `مرحباً فريق تاكسي السعودية،\n\nنرغب بالحصول على عرض سعر مكتوب لتنقلات الشركات بين جدة ومدينة الملك عبدالله الاقتصادية.\n\n• اسم الشركة: \n• اسم وصفة المسؤول: \n• الرحلات والتواريخ: \n• عدد الركاب لكل رحلة: \n• السيارة المفضّلة (سيدان تنفيذية / SUV / فان): \n• الرقم الضريبي: \n• مرجع أمر الشراء: \n\nيرجى تأكيد تفاصيل الفوترة وسعر ثابت قبل الحجز.\n\nشكراً لكم.`,
  },
  "dammam-to-doha": {
    heading: "سفر أعمال عبر الحدود من الدمام إلى الدوحة؟",
    intro:
      "لسفر الأعمال عبر منفذ سلوى إلى قطر نوفّر سيارات سيدان تنفيذية ودفع رباعي مع سائقين محترفين ذوي خبرة بالعبور. ندعمك في إجراءات العبور وتحمل أنت مستنداتك السارية. ويمكن تشغيل رحلات الشركة المنتظمة عبر حساب واحد ونقطة تواصل واحدة.",
    waPrefill: `السلام عليكم، تنقل شركات عبر الحدود — الدمام / الدوحة (قطر).\n• الشركة: \n• الرحلات والتواريخ: \n• عدد الركاب لكل رحلة: \n• نوع السيارة (سيدان تنفيذية / SUV / فان): \n• هل تحتاج فاتورة (ضريبي / أمر شراء)؟: `,
    emailSubject: "طلب عرض سعر لتنقلات الشركات — الدمام–الدوحة",
    emailBody: `مرحباً فريق تاكسي السعودية،\n\nنرغب بعرض سعر مكتوب لتنقلات الشركات عبر الحدود بين الدمام والدوحة في قطر (عبر منفذ سلوى).\n\n• اسم الشركة: \n• اسم وصفة المسؤول: \n• الرحلات والتواريخ: \n• عدد الركاب لكل رحلة: \n• السيارة المفضّلة (سيدان تنفيذية / SUV / فان): \n• الرقم الضريبي: \n• مرجع أمر الشراء: \n\nيرجى تأكيد تفاصيل الفوترة وسعر ثابت قبل الحجز.\n\nشكراً لكم.`,
  },
  "riyadh-to-dubai": {
    heading: "سيارة تنفيذية مع سائق من الرياض إلى دبي؟",
    intro:
      "لمسافري الأعمال إلى الإمارات نوفّر سيارة سيدان تنفيذية أو دفع رباعي مع سائق محترف — اعمل أو استرِح في الطريق مع توقفات مخطّطة. ندعمك في إجراءات العبور وتحمل أنت مستنداتك السارية. ويمكن تشغيل تنقلات الشركة المنتظمة عبر حساب واحد ونقطة تواصل واحدة.",
    waPrefill: `السلام عليكم، سيارة تنفيذية مع سائق — الرياض / دبي (الإمارات).\n• الشركة: \n• الرحلات والتواريخ: \n• عدد الركاب لكل رحلة: \n• نوع السيارة (سيدان تنفيذية / SUV / فان): \n• هل تحتاج فاتورة (ضريبي / أمر شراء)؟: `,
    emailSubject: "طلب عرض سعر لتنقلات الشركات — الرياض–دبي",
    emailBody: `مرحباً فريق تاكسي السعودية،\n\nنرغب بعرض سعر مكتوب لسيارة تنفيذية مع سائق بين الرياض ودبي في الإمارات.\n\n• اسم الشركة: \n• اسم وصفة المسؤول: \n• الرحلات والتواريخ: \n• عدد الركاب لكل رحلة: \n• السيارة المفضّلة (سيدان تنفيذية / SUV / فان): \n• الرقم الضريبي: \n• مرجع أمر الشراء: \n\nيرجى تأكيد تفاصيل الفوترة وسعر ثابت قبل الحجز.\n\nشكراً لكم.`,
  },
};

// Arabic Umrah group & family (Path B) block copy, keyed by slug. Shared badge,
// second paragraph and buttons live in the JSX.
const AR_UMRAH: Record<string, { heading: string; intro: string; waPrefill: string; emailSubject: string; emailBody: string }> = {
  "jeddah-airport-to-swissotel-makkah": {
    heading: "مسافرون كعائلة أو مجموعة عمرة؟",
    intro:
      "للعائلات والمجموعات نوفّر سيارة دفع رباعي كبيرة أو فان ليسافر الجميع معاً مع الأمتعة — سيارة واحدة وسائق واحد من مطار جدة مباشرة إلى فندق سويس أوتيل المقام مكة. استقبال في صالة الوصول بلوحة اسم، وتوقف عند الميقات لارتداء الإحرام عند الطلب، ومساعدة في الأمتعة عند الفندق.",
    waPrefill: `السلام عليكم، نقل عمرة — من مطار جدة إلى سويس أوتيل المقام مكة.\n• رقم الرحلة ووقت الوصول: \n• عدد الركاب (كبار / أطفال): \n• الأمتعة: \n• نوع السيارة (سيدان / SUV / فان): \n• توقف عند الميقات للإحرام؟: `,
    emailSubject: "طلب عرض سعر لنقل مجموعة عمرة — من مطار جدة إلى مكة",
    emailBody: `مرحباً فريق تاكسي السعودية،\n\nنرغب بعرض سعر مكتوب لنقل معتمرين من مطار جدة إلى مكة المكرمة.\n\n• اسم الوكالة / المجموعة: \n• اسم جهة الاتصال: \n• تاريخ الوصول ورقم الرحلة: \n• عدد المعتمرين (كبار / أطفال): \n• الأمتعة: \n• السيارات المطلوبة (SUV / فان): \n• الفندق في مكة: \n• توقف عند الميقات للإحرام؟: \n\nيرجى تأكيد سعر ثابت قبل الحجز.\n\nشكراً لكم.`,
  },
  "jeddah-to-madinah": {
    heading: "مسافرون إلى المدينة كعائلة أو مجموعة؟",
    intro:
      "للعائلات ومجموعات العمرة نوفّر سيارة دفع رباعي كبيرة أو فان ليسافر الجميع معاً مع الأمتعة — سيارة واحدة وسائق واحد من جدة إلى فندقك في المدينة قرب المسجد النبوي، مع توقفات للصلاة والراحة على طريق الحرمين.",
    waPrefill: `السلام عليكم، نقل عمرة — من جدة إلى المدينة المنورة.\n• التاريخ والوقت: \n• عدد الركاب (كبار / أطفال): \n• الأمتعة: \n• نوع السيارة (سيدان / SUV / فان): \n• فندق المدينة: `,
    emailSubject: "طلب عرض سعر لنقل مجموعة عمرة — من جدة إلى المدينة",
    emailBody: `مرحباً فريق تاكسي السعودية،\n\nنرغب بعرض سعر مكتوب لنقل معتمرين من جدة إلى المدينة المنورة.\n\n• اسم الوكالة / المجموعة: \n• اسم جهة الاتصال: \n• تاريخ الرحلة: \n• عدد المعتمرين (كبار / أطفال): \n• الأمتعة: \n• السيارات المطلوبة (SUV / فان): \n• فندق المدينة: \n\nيرجى تأكيد سعر ثابت قبل الحجز.\n\nشكراً لكم.`,
  },
  "makkah-to-madinah": {
    heading: "مجموعة عمرة بين الحرمين؟",
    intro:
      "للعائلات ومجموعات العمرة نوفّر سيارة دفع رباعي كبيرة أو فان ليسافر الجميع معاً مع الأمتعة — سيارة واحدة وسائق واحد من مكة إلى فندقك في المدينة، مع إمكانية التوقف عند ميقات ذي الحليفة عند الطلب وتوقفات للصلاة والراحة على الطريق.",
    waPrefill: `السلام عليكم، نقل عمرة — من مكة إلى المدينة المنورة.\n• التاريخ والوقت: \n• عدد الركاب (كبار / أطفال): \n• الأمتعة: \n• نوع السيارة (سيدان / SUV / فان): \n• فندق المدينة: `,
    emailSubject: "طلب عرض سعر لنقل مجموعة عمرة — من مكة إلى المدينة",
    emailBody: `مرحباً فريق تاكسي السعودية،\n\nنرغب بعرض سعر مكتوب لنقل معتمرين من مكة المكرمة إلى المدينة المنورة.\n\n• اسم الوكالة / المجموعة: \n• اسم جهة الاتصال: \n• تاريخ الرحلة: \n• عدد المعتمرين (كبار / أطفال): \n• الأمتعة: \n• السيارات المطلوبة (SUV / فان): \n• فندق المدينة: \n\nيرجى تأكيد سعر ثابت قبل الحجز.\n\nشكراً لكم.`,
  },
};

// Reusable RTL Arabic route page — mirrors the curated
// app/ar/routes/jeddah-airport-to-makkah page so every Arabic route reads and
// converts identically. Prices/cities/distance come from ROUTES_DATA (Arabic
// fields already present); only the bespoke copy (badge, intro, TLDR, why-us,
// FAQs) is passed in per slug to keep each page genuinely useful, not thin.
export function ArabicRoutePage({ content }: { content: ArabicRouteContent }) {
  const route = ROUTES_DATA.find((r) => r.slug === content.slug);
  if (!route) return null;

  const h1 = `تاكسي من ${route.fromCityAr} إلى ${route.toCityAr}`;
  const arPath = `/ar/routes/${content.slug}`;
  const arCorporate = AR_CORPORATE[content.slug];
  const arUmrah = AR_UMRAH[content.slug];

  const waMessage = encodeURIComponent(
    `السلام عليكم، أرغب بحجز تاكسي من ${route.fromCityAr} إلى ${route.toCityAr}.\n\n• التاريخ والوقت: \n• عدد الركاب والأمتعة: \n• نوع السيارة: `,
  );

  return (
    <div dir="rtl" className="min-h-screen bg-[#FAFAF7] text-[#1C1C1C] pb-24" lang="ar">
      <JsonLd
        data={[
          serviceSchema({
            name: h1,
            description: route.descriptionAr,
            path: arPath,
            serviceType: "Taxi Service",
            areaServed: [route.fromCityAr, route.toCityAr],
          }),
          breadcrumbSchema([
            { name: "الرئيسية", href: "/ar" },
            { name: "الرحلات", href: "/routes" },
            { name: h1, href: arPath },
          ]),
          faqSchema(content.faqs),
          speakableSchema({ path: arPath }),
        ]}
      />

      <Breadcrumbs
        items={[
          { name: "الرئيسية", href: "/ar" },
          { name: "الرحلات", href: "/routes" },
          { name: h1, href: arPath },
        ]}
      />

      {/* HERO */}
      <section className="section-container max-w-5xl pt-32 pb-12 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 px-4 py-1.5 text-[0.65rem] font-bold text-[#16A34A] mb-6">
          {content.badge}
        </span>
        <h1 className="font-heading text-3xl md:text-5xl font-bold leading-tight mb-6">{h1}</h1>
        <p className="max-w-2xl mx-auto text-sm md:text-base text-[#6B7280] leading-relaxed mb-8">
          {route.descriptionAr} {content.introExtra}
        </p>

        <div id="speakable-summary" className="max-w-2xl mx-auto mb-10 text-right">
          <TLDRSummary answer={content.tldrAnswer} facts={content.tldrFacts} />
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <a
            href={`${contactConfig.whatsappLink}?text=${waMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#16A34A] px-8 py-3.5 text-xs font-bold text-white hover:bg-[#15803D] transition-all"
          >
            احجز عبر واتساب
          </a>
          <Link
            href="/book"
            className="inline-flex items-center gap-2 rounded-full border border-[#C9A84C]/40 px-8 py-3.5 text-xs font-bold text-[#16A34A] hover:bg-[#C9A84C]/10 transition-all"
          >
            احجز الآن أونلاين
          </Link>
        </div>
      </section>

      {/* نموذج طلب عرض سعر — سهل التعبئة، يُحوّل إلى واتساب مع تعبئة الرحلة مسبقاً */}
      {["riyadh-to-dammam", "madinah-to-alula", "jeddah-to-kaec", "jeddah-airport-to-swissotel-makkah", "dammam-to-doha", "riyadh-to-dubai", "jeddah-to-madinah", "makkah-to-madinah"].includes(content.slug) && (
        <section className="section-container max-w-2xl pb-4 text-right">
          <h2 className="font-heading text-2xl font-bold mb-2 text-center">احصل على عرض سعر رحلتك الخاصة</h2>
          <p className="text-center text-xs sm:text-sm text-[#6B7280] leading-relaxed mb-6">
            أدخل بعض التفاصيل ونؤكد لك سعراً ثابتاً عبر واتساب — نقل خاص من الباب إلى الباب مع سائق محترف. بدون عدّاد وبدون تسعير متغيّر.
          </p>
          <WhatsAppQuoteForm defaultPickup={route.fromCityAr} defaultDropoff={route.toCityAr} forceLocale="ar" />
        </section>
      )}

      {/* VEHICLES */}
      <section className="section-container max-w-5xl py-16 border-t border-[#C9A84C]/10">
        <h2 className="font-heading text-2xl font-bold mb-2 text-center">خيارات السيارات والأسعار التقديرية</h2>
        <p className="text-center text-[0.7rem] text-[#6B7280] mb-8">
          * أسعار تقديرية — السعر النهائي يُؤكد عبر واتساب أو البريد الإلكتروني.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          {VEHICLES.map((v) => (
            <div key={v.key} className="bg-white border border-[#16A34A]/12 rounded-2xl p-6 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">{v.nameAr}</h3>
                <p className="text-[0.7rem] text-[#6B7280] mt-1">{v.pax}</p>
              </div>
              <p className="font-heading text-sm font-bold text-[#16A34A] whitespace-nowrap">السعر عبر واتساب</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHY US */}
      <section className="section-container max-w-5xl py-16 border-t border-[#C9A84C]/10">
        <h2 className="font-heading text-2xl font-bold mb-8 text-center">لماذا تختار تاكسي السعودية</h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {content.whyUs.map((f) => (
            <div key={f.title} className="rounded-2xl border border-[#16A34A]/12 bg-white p-5">
              <h3 className="font-bold text-sm mb-2">{f.title}</h3>
              <p className="text-xs text-[#6B7280] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* نقل مجموعات العمرة والعائلات (المسار B) — لممرات المعتمرين */}
      {arUmrah && (
        <section className="section-container max-w-4xl py-12">
          <div className="rounded-3xl border border-[#16A34A]/15 bg-[#0F172A] p-8 text-white">
            <div className="max-w-2xl space-y-4">
              <span className="inline-flex items-center rounded-full bg-[#FACC15]/15 border border-[#FACC15]/30 px-3 py-1 text-[0.65rem] font-bold text-[#FACC15]">
                نقل مجموعات العمرة والعائلات
              </span>
              <h2 className="font-heading text-2xl font-bold">{arUmrah.heading}</h2>
              <p className="text-xs sm:text-sm text-white/75 leading-relaxed">{arUmrah.intro}</p>
              <p className="text-xs sm:text-sm text-white/75 leading-relaxed">
                تنظّمون لمجموعة عمرة أو عبر وكالة سفر؟ أرسلوا التفاصيل وعدد الأفراد ونجهّز لكم عمليات النقل بنقطة تواصل واحدة وعرض سعر مكتوب.
              </p>
              <div className="flex flex-wrap gap-3 pt-1">
                <a
                  href={`${contactConfig.whatsappLink}?text=${encodeURIComponent(arUmrah.waPrefill)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#16A34A] px-6 py-3 text-xs font-bold text-white hover:bg-[#15803D] transition-all"
                >
                  نقل المجموعة عبر واتساب
                </a>
                <a
                  href={`mailto:${contactConfig.email}?subject=${encodeURIComponent(arUmrah.emailSubject)}&body=${encodeURIComponent(arUmrah.emailBody)}`}
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-6 py-3 text-xs font-bold text-white hover:bg-white/15 transition-all"
                >
                  راسلنا لاستفسار المجموعة
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* جولة العلا الخاصة ليوم كامل (المسار B) — بعد زيارة المدينة */}
      {content.slug === "madinah-to-alula" && (
        <section className="section-container max-w-4xl py-12">
          <div className="rounded-3xl border border-[#16A34A]/15 bg-[#0F172A] p-8 text-white">
            <div className="max-w-2xl space-y-4">
              <span className="inline-flex items-center rounded-full bg-[#FACC15]/15 border border-[#FACC15]/30 px-3 py-1 text-[0.65rem] font-bold text-[#FACC15]">
                جولة العلا الخاصة ليوم كامل
              </span>
              <h2 className="font-heading text-2xl font-bold">حوّل الرحلة إلى يوم كامل في العلا</h2>
              <p className="text-xs sm:text-sm text-white/75 leading-relaxed">
                معظم الزوار لا يريدون توصيلاً باتجاه واحد فقط، بل يوماً كاملاً في العلا. احجز سيارة خاصة بالساعة مع سائقك ينتظرك بين المواقع: الحِجر (مدائن صالح) ودادان والبلدة القديمة وجبل الفيل، ثم العودة إلى المدينة أو إلى فندقك في العلا. سيارات مريحة ومكيّفة للعائلات والمجموعات الصغيرة، بسعر ثابت وبدون عدّاد.
              </p>
              <p className="text-xs sm:text-sm text-white/75 leading-relaxed">
                تنظّمون لمجموعة أو عبر وكالة سفر؟ أرسلوا التواريخ وعدد الأفراد ونجهّز لكم برنامجاً خاصاً بسائق واحد لليوم كامل.
              </p>
              <div className="flex flex-wrap gap-3 pt-1">
                <a
                  href={`${contactConfig.whatsappLink}?text=${encodeURIComponent(
                    `السلام عليكم، أرغب بجولة خاصة ليوم كامل في العلا انطلاقاً من المدينة.\n• التاريخ: \n• عدد الركاب: \n• نوع السيارة (سيدان / SUV / فان): \n• المواقع (الحِجر / دادان / البلدة القديمة / جبل الفيل): \n• العودة في نفس اليوم أم مبيت؟: `,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#16A34A] px-6 py-3 text-xs font-bold text-white hover:bg-[#15803D] transition-all"
                >
                  خطّط ليوم العلا عبر واتساب
                </a>
                <a
                  href={`mailto:${contactConfig.email}?subject=${encodeURIComponent(
                    "استفسار عن جولة خاصة في العلا — من المدينة",
                  )}&body=${encodeURIComponent(
                    `مرحباً فريق تاكسي السعودية،\n\nنرغب بسيارة خاصة لجولة يوم كامل في العلا انطلاقاً من المدينة.\n\n• اسم جهة الاتصال: \n• تاريخ الرحلة: \n• عدد الركاب: \n• السيارة المفضّلة (سيدان / SUV / فان): \n• المواقع المطلوبة (الحِجر / دادان / البلدة القديمة / جبل الفيل): \n• العودة إلى المدينة في نفس اليوم أم مبيت في العلا؟: \n\nيرجى تأكيد سعر ثابت قبل الحجز.\n\nشكراً لكم.`,
                  )}`}
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-6 py-3 text-xs font-bold text-white hover:bg-white/15 transition-all"
                >
                  راسلنا لاستفسار الجولة
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* تنقلات الشركات (المسار B) — للمسارات ذات طابع الأعمال */}
      {arCorporate && (
        <section className="section-container max-w-4xl py-12">
          <div className="rounded-3xl border border-[#16A34A]/15 bg-[#0F172A] p-8 text-white">
            <div className="max-w-2xl space-y-4">
              <span className="inline-flex items-center rounded-full bg-[#FACC15]/15 border border-[#FACC15]/30 px-3 py-1 text-[0.65rem] font-bold text-[#FACC15]">
                تنقلات الشركات والوفود
              </span>
              <h2 className="font-heading text-2xl font-bold">{arCorporate.heading}</h2>
              <p className="text-xs sm:text-sm text-white/75 leading-relaxed">{arCorporate.intro}</p>
              <p className="text-xs sm:text-sm text-white/75 leading-relaxed">
                تُصدر فواتير حجوزات الشركات عبر شريكنا المشغّل المرخّص في السعودية، لتحصل على فاتورة ضريبية نظامية. أرسل اسم شركتك والرقم الضريبي ومرجع أمر الشراء مع طلبك وسنؤكد تفاصيل الفوترة قبل إتمام الحجز.
              </p>
              <div className="flex flex-wrap gap-3 pt-1">
                <a
                  href={`${contactConfig.whatsappLink}?text=${encodeURIComponent(arCorporate.waPrefill)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#16A34A] px-6 py-3 text-xs font-bold text-white hover:bg-[#15803D] transition-all"
                >
                  عرض سعر الشركات عبر واتساب
                </a>
                <a
                  href={`mailto:${contactConfig.email}?subject=${encodeURIComponent(arCorporate.emailSubject)}&body=${encodeURIComponent(arCorporate.emailBody)}`}
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-6 py-3 text-xs font-bold text-white hover:bg-white/15 transition-all"
                >
                  راسل قسم الشركات
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="section-container max-w-4xl py-16 border-t border-[#C9A84C]/10">
        <h2 className="font-heading text-2xl font-bold mb-10 text-center">الأسئلة الشائعة</h2>
        <div className="space-y-4">
          {content.faqs.map((f) => (
            <div key={f.question} className="bg-white border border-[#16A34A]/12 rounded-2xl p-6">
              <h3 className="font-bold text-sm mb-2">{f.question}</h3>
              <p className="text-xs text-[#6B7280] leading-relaxed">{f.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* RELATED */}
      <section className="section-container max-w-4xl py-12 border-t border-[#C9A84C]/10 text-center">
        <p className="text-sm text-[#6B7280] mb-4">تحتاج مساراً آخر أو معلومات إضافية؟</p>
        <div className="flex flex-wrap justify-center gap-4 text-xs font-bold text-[#16A34A]">
          <Link href="/routes" className="hover:underline">
            جميع رحلات التاكسي في السعودية
          </Link>
          <Link href="/ar/faq" className="hover:underline">
            الأسئلة الشائعة
          </Link>
          <Link href="/ar/pricing" className="hover:underline">
            الأسعار
          </Link>
          <a href={contactConfig.whatsappLink} target="_blank" rel="noopener noreferrer" className="hover:underline">
            تواصل معنا عبر واتساب
          </a>
        </div>
      </section>
    </div>
  );
}
