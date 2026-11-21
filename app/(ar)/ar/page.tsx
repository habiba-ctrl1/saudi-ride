import type { Metadata } from "next";
import { HomePage } from "@/components/sections/home-page";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqSchema } from "@/lib/schema";
import Link from "next/link";
import { AR_CITY_HUBS } from "@/lib/data/ar-hubs";

export const metadata: Metadata = {
  title: "تاكسي السعودية — حجز توصيل المطار وسيارات العمرة | أسعار ثابتة 24/7",
  description:
    "احجز تاكسي في السعودية — توصيل من وإلى المطار، تنقل للعمرة، ورحلات بين المدن بأسعار ثابتة. سائقون يتحدثون العربية والإنجليزية، وحجز عبر واتساب على مدار الساعة.",
  alternates: {
    canonical: "https://taxisaudiarabia.com/ar",
    languages: {
      en: "https://taxisaudiarabia.com",
      ar: "https://taxisaudiarabia.com/ar",
      "x-default": "https://taxisaudiarabia.com",
    },
  },
  openGraph: {
    title: "تاكسي السعودية — حجز توصيل المطار وسيارات العمرة",
    description:
      "احجز تاكسي في السعودية بأسعار ثابتة. توصيل المطار، تنقل العمرة، ورحلات بين المدن. حجز عبر واتساب على مدار الساعة.",
    url: "https://taxisaudiarabia.com/ar",
    siteName: "Taxi Saudi Arabia",
    locale: "ar_SA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "تاكسي السعودية — حجز توصيل المطار وسيارات العمرة",
    description:
      "احجز تاكسي في السعودية بأسعار ثابتة. توصيل المطار، تنقل العمرة، ورحلات بين المدن. حجز عبر واتساب على مدار الساعة.",
  },
};

// Matches the FAQ section actually rendered in homeTranslations.ar.faq.items
// (components/sections/home-page.tsx) — kept in sync manually since that
// content lives in a client component's translation object.
const HOME_FAQS_AR = [
  {
    question: "كيف أحجز تاكسي في السعودية؟",
    answer: "يمكنك الحجز عبر منصة الحجز في موقعنا أو مباشرة عبر واتساب. حدد موقع الانطلاق والوجهة والتاريخ والوقت، وسيؤكد فريقنا رحلتك بسعر ثابت، عادة خلال ساعة إلى ساعتين.",
  },
  {
    question: "كم تكلفة تاكسي من مطار جدة إلى مكة؟",
    answer: "تُؤكد أجرة تاكسي مطار جدة إلى مكة عبر واتساب قبل الحجز — سعر ثابت بدون رسوم خفية، مع توفر السيارات العادية وخيارات عائلية أكبر.",
  },
  {
    question: "هل تقدمون نقل العمرة من المدينة؟",
    answer: "نعم، نغطي مسار مكة إلى المدينة والمدينة إلى مكة وجولات الزيارة، مع التوقف عند الميقات وسائقين محترفين.",
  },
  {
    question: "هل السائقون محترفون وذوو خبرة؟",
    answer: "بالتأكيد. يتم ترتيب جميع سائقينا من خلال شركائنا في النقل، وهم يتحدثون العربية والإنجليزية.",
  },
  {
    question: "هل لديكم مركبات للعائلات الكبيرة؟",
    answer: "نعم، نوفر سيارات SUV فاخرة مثل GMC Yukon وحافلات صغيرة مثل Toyota Hiace وHyundai Staria المثالية للمجموعات والعائلات.",
  },
];

export default function ArabicHome() {
  return (
    <>
      <JsonLd data={faqSchema(HOME_FAQS_AR)} />
      <HomePage />
      {/* Arabic city hubs — added 2026-11-22 (seo/sprint4-arabic-plan.md):
          the Arabic homepage previously linked to none of them. */}
      <section dir="rtl" lang="ar" aria-labelledby="ar-cities-heading" className="bg-[#FAFAF7] py-16">
        <div className="section-container max-w-6xl">
          <h2 id="ar-cities-heading" className="font-heading text-2xl font-bold text-[#1C1C1C] md:text-3xl">النقل الخاص في مدن المملكة</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#4B5563]">اختر مدينتك لترى خيارات النقل من المطار وداخل المدينة والرحلات إلى المدن القريبة، مع سعر ثابت يُتفق عليه قبل الحجز.</p>
          <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {AR_CITY_HUBS.map((h) => (
              <li key={h.key}>
                <Link href={h.href} className="flex min-h-[72px] flex-col justify-center rounded-2xl border border-[#E5E7EB] bg-white px-5 py-4 transition-colors hover:border-[#16A34A]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A]">
                  <span className="font-heading text-base font-bold text-[#1C1C1C]">تاكسي {h.name}</span>
                  <span className="mt-1 text-xs leading-relaxed text-[#6B7280]">{h.blurb}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
