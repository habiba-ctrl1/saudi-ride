import type { Metadata } from "next";
import { generateMetadata as seo } from "@/lib/seo";
import AboutPage from "@/app/about/page";

export const metadata: Metadata = seo({
  title: "من نحن — سائقون مرخصون وأسعار ثابتة",
  description:
    "تعرف على تاكسي السعودية، خدمة تاكسي وسائق خاص موثوقة بسائقين مرخصين وأسعار ثابتة، لتوصيل المطار والعمرة والتنقل بين المدن في الرياض وجدة ومكة والمدينة والدمام.",
  path: "/ar/about",
  locale: "ar",
  hreflangPaths: { en: "/about", ar: "/ar/about" },
});

export default AboutPage;
