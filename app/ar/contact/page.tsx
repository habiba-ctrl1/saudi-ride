import type { Metadata } from "next";
import { generateMetadata as seo } from "@/lib/seo";
import ContactPage from "@/app/contact/page";

export const metadata: Metadata = seo({
  title: "تواصل معنا — مكتب الحجز على مدار الساعة",
  description:
    "تواصل مع تاكسي السعودية لحجز توصيل المطار وخدمات العمرة والتنقل بين المدن. مكتب الحجز متاح على مدار الساعة عبر الهاتف أو واتساب أو البريد الإلكتروني.",
  path: "/ar/contact",
  locale: "ar",
  hreflangPaths: { en: "/contact", ar: "/ar/contact" },
});

export default ContactPage;
