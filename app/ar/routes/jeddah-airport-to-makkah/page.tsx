import type { Metadata } from "next";
import Link from "next/link";
import { generateMetadata as seo } from "@/lib/seo";
import { breadcrumbSchema, faqSchema, speakableSchema, SITE } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { TLDRSummary } from "@/components/seo/TLDRSummary";
import { contactConfig } from "@/lib/config/contact";
import { ROUTES_DATA } from "@/lib/data/routes";

const route = ROUTES_DATA.find((r) => r.slug === "jeddah-airport-to-makkah")!;

export const metadata: Metadata = seo({
  title: "تاكسي من مطار جدة إلى مكة المكرمة — سعر ثابت يُؤكد عبر واتساب",
  description:
    "احجز تاكسي من مطار الملك عبدالعزيز الدولي بجدة إلى مكة المكرمة بسعر ثابت يُؤكد عبر واتساب. المسافة 80 كم، والرحلة تستغرق حوالي ساعة واحدة. توقف عند الميقات، سائقون مرخصون، حجز فوري عبر واتساب.",
  path: "/ar/routes/jeddah-airport-to-makkah",
  locale: "ar",
  hreflangPaths: { en: "/routes/jeddah-airport-to-makkah", ar: "/ar/routes/jeddah-airport-to-makkah" },
});

const faqs = [
  {
    question: "كم سعر التاكسي من مطار جدة إلى مكة المكرمة؟",
    answer:
      "يبدأ سعر التاكسي من مطار جدة إلى مكة المكرمة بسعر يُؤكد عبر واتساب سعودي لسيارة سيدان، والسعر ثابت ومؤكد قبل الحجز — بدون رسوم خفية أو زيادة في وقت الذروة. تتوفر أيضاً سيارات GMC يوكن وهيونداي ستاريا للعائلات والمجموعات الكبيرة.",
  },
  {
    question: "كم تستغرق الرحلة من مطار جدة إلى مكة؟",
    answer: "المسافة حوالي 80 كم، وتستغرق الرحلة عادة ساعة واحدة عبر طريق الحرمين، حسب حركة المرور ووقت التوقف عند الميقات.",
  },
  {
    question: "هل يتوقف السائق عند الميقات لارتداء الإحرام؟",
    answer: "نعم، يتوقف السائق عند الميقات (مثل ميقات الجحفة أو قرن المنازل حسب مسارك) ليتسنى للمعتمرين ارتداء الإحرام قبل متابعة الرحلة إلى الحرم.",
  },
  {
    question: "هل يمكن الحجز عبر واتساب مباشرة؟",
    answer: "نعم، يمكنك إرسال موعد وصول رحلتك وعدد الركاب عبر واتساب وسنؤكد السعر والسائق خلال دقائق. الحجز متاح أيضاً عبر الموقع مباشرة على مدار الساعة.",
  },
  {
    question: "هل التاكسي متاح في أي وقت من اليوم أو الليل؟",
    answer: "نعم، خدمة النقل من مطار جدة إلى مكة متاحة على مدار 24 ساعة طوال أيام الأسبوع، بما يشمل رحلات الفجر والرحلات المتأخرة ليلاً لاستقبال المعتمرين والحجاج.",
  },
];

const vehicles = [
  { key: "sedan", nameAr: "سيدان تنفيذية (تويوتا كامري)", pax: "3 ركاب" },
  { key: "suv", nameAr: "GMC يوكن فاخرة", pax: "6 ركاب" },
  { key: "van", nameAr: "هيونداي ستاريا (فان عائلي)", pax: "7 ركاب" },
  { key: "luxury", nameAr: "مرسيدس بنز الفئة S (VIP)", pax: "3 ركاب" },
];

export default function JeddahAirportToMakkahArabicPage() {
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: "تاكسي من مطار جدة إلى مكة المكرمة",
    description: route.descriptionAr,
    provider: { "@id": SITE.businessId },
    itinerary: {
      "@type": "ItemList",
      itemListElement: [
        { "@type": "ListItem", position: 1, item: { "@type": "TouristAttraction", name: route.fromCityAr } },
        { "@type": "ListItem", position: 2, item: { "@type": "TouristAttraction", name: route.toCityAr } },
      ],
    },
  };

  const waMessage = encodeURIComponent(
    `السلام عليكم، أرغب بحجز تاكسي من مطار جدة إلى مكة المكرمة.\n\n• التاريخ والوقت: \n• عدد الركاب والأمتعة: \n• نوع السيارة: `
  );

  return (
    <div dir="rtl" className="min-h-screen bg-[#FAFAF7] text-[#1C1C1C] pb-24" lang="ar">
      <JsonLd
        data={[
          schemaMarkup,
          breadcrumbSchema([
            { name: "الرئيسية", href: "/ar" },
            { name: "الرحلات", href: "/routes" },
            { name: "مطار جدة إلى مكة المكرمة", href: "/ar/routes/jeddah-airport-to-makkah" },
          ]),
          faqSchema(faqs),
          speakableSchema({ path: "/ar/routes/jeddah-airport-to-makkah" }),
        ]}
      />

      <Breadcrumbs
        items={[
          { name: "الرئيسية", href: "/ar" },
          { name: "الرحلات", href: "/routes" },
          { name: "مطار جدة إلى مكة المكرمة", href: "/ar/routes/jeddah-airport-to-makkah" },
        ]}
      />

      {/* HERO */}
      <section className="section-container max-w-5xl pt-32 pb-12 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 px-4 py-1.5 text-[0.65rem] font-bold text-[#B8963B] mb-6">
          الوجهة الأكثر طلباً للمعتمرين
        </span>
        <h1 className="font-heading text-3xl md:text-5xl font-bold leading-tight mb-6">
          تاكسي من مطار جدة إلى مكة المكرمة
        </h1>
        <p className="max-w-2xl mx-auto text-sm md:text-base text-[#6B7280] leading-relaxed mb-8">
          {route.descriptionAr} السعر ثابت يُؤكد عبر واتساب، بدون رسوم خفية، مع سائقين مرخصين يتحدثون العربية والإنجليزية والأردية.
        </p>

        <div id="speakable-summary" className="max-w-2xl mx-auto mb-10 text-right">
          <TLDRSummary
            answer="تاكسي من مطار جدة إلى مكة المكرمة بسعر يُؤكد عبر واتساب، المسافة 80 كم وتستغرق الرحلة حوالي ساعة واحدة عبر طريق الحرمين، مع توقف عند الميقات وخدمة على مدار الساعة."
            facts={[
              { label: "المسافة", value: "80 كم" },
              { label: "المدة", value: "حوالي ساعة واحدة" },
              { label: "السعر", value: "على واتساب" },
              { label: "التوفر", value: "24/7" },
            ]}
          />
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
            className="inline-flex items-center gap-2 rounded-full border border-[#C9A84C]/40 px-8 py-3.5 text-xs font-bold text-[#B8963B] hover:bg-[#C9A84C]/10 transition-all"
          >
            احجز الآن أونلاين
          </Link>
        </div>
      </section>

      {/* VEHICLES */}
      <section className="section-container max-w-5xl py-16 border-t border-[#C9A84C]/10">
        <h2 className="font-heading text-2xl font-bold mb-2 text-center">خيارات السيارات والأسعار التقديرية</h2>
        <p className="text-center text-[0.7rem] text-[#6B7280] mb-8">* أسعار تقديرية — السعر النهائي يُؤكد عبر واتساب أو البريد الإلكتروني.</p>
        <div className="grid sm:grid-cols-2 gap-4">
          {vehicles.map((v) => (
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
          {[
            { title: "سعر ثابت بدون مفاجآت", desc: "السعر الذي تراه هو السعر الذي تدفعه — بدون عداد، بدون رسوم خفية، وبدون زيادة في وقت الذروة." },
            { title: "توقف عند الميقات", desc: "يعرف السائق مواقع الميقات على طريق الحرمين ويتوقف عند الحاجة لارتداء الإحرام." },
            { title: "متابعة الرحلة الجوية", desc: "نتابع رحلتك الجوية لحظة بلحظة وينتظر السائق مجاناً حتى 60 دقيقة في حال تأخر الطيران." },
            { title: "سائقون يتحدثون عدة لغات", desc: "سائقون محترفون يتحدثون العربية والإنجليزية والأردية لتسهيل التواصل معك." },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl border border-[#16A34A]/12 bg-white p-5">
              <h3 className="font-bold text-sm mb-2">{f.title}</h3>
              <p className="text-xs text-[#6B7280] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="section-container max-w-4xl py-16 border-t border-[#C9A84C]/10">
        <h2 className="font-heading text-2xl font-bold mb-10 text-center">الأسئلة الشائعة</h2>
        <div className="space-y-4">
          {faqs.map((f) => (
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
        <div className="flex flex-wrap justify-center gap-4 text-xs font-bold text-[#B8963B]">
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
