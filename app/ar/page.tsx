import type { Metadata } from "next";
import { HomePage } from "@/components/sections/home-page";

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
};

export default function ArabicHome() {
  return <HomePage />;
}
