import type { Metadata } from "next";
import { HomePage } from "@/components/sections/home-page";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "تاكسي السعودية — حجز توصيل المطار وسيارات العمرة | أسعار ثابتة 24/7",
  description:
    "احجز تاكسي في السعودية — توصيل من وإلى المطار، تنقل للعمرة، ورحلات بين المدن بأسعار ثابتة. سائقون مرخصون، وحجز عبر واتساب على مدار الساعة.",
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
    answer: "بالتأكيد. يتم ترتيب جميع سائقينا من خلال شركائنا في النقل، وهم يتحدثون العربية والإنجليزية والأردية.",
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
    </>
  );
}
