import Link from "next/link";
import { breadcrumbSchema, faqSchema, speakableSchema, serviceSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { TLDRSummary } from "@/components/seo/TLDRSummary";
import { contactConfig } from "@/lib/config/contact";
import { ROUTES_DATA } from "@/lib/data/routes";

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
