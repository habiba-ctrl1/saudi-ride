import type { Metadata } from "next";
import { generateMetadata as seo } from "@/lib/seo";

export const metadata: Metadata = seo({
  title: "Corporate & Travel Partner Program",
  description:
    "Partner with Saudi Arabia's premier transport network. Corporate accounts, travel-agency rates, hotel and Umrah-operator partnerships with priority dispatch and monthly invoicing.",
  path: "/partners",
});

export default function PartnersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
