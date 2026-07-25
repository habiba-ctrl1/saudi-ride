import type { Metadata } from "next";
import { generateMetadata as seo } from "@/lib/seo";
import FaqPage from "@/app/faq/page";

export const metadata: Metadata = seo({
  title: "الأسئلة الشائعة — الحجز والأسعار والعمرة",
  description:
    "إجابات على الأسئلة الشائعة حول حجز تاكسي في السعودية — الأسعار الثابتة، توصيل المطار، تنقل العمرة، الحجز عبر واتساب، طرق الدفع، وأوقات الانتظار.",
  path: "/ar/faq",
  locale: "ar",
  hreflangPaths: { en: "/faq", ar: "/ar/faq" },
});

export default FaqPage;
