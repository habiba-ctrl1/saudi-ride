import type { Metadata } from "next";
import { generateMetadata as seo } from "@/lib/seo";
import PartnersPage from "@/app/partners/page";

export const metadata: Metadata = seo({
  title: "برنامج الشراكة للشركات والوكالات السياحية",
  description:
    "تعاون مع أكبر شبكة نقل في السعودية. حسابات شركات، أسعار خاصة لوكالات السفر، وشراكات مع الفنادق ومشغلي العمرة مع أولوية في التوصيل وفوترة شهرية.",
  path: "/ar/partners",
  locale: "ar",
  hreflangPaths: { en: "/partners", ar: "/ar/partners" },
});

export default PartnersPage;
