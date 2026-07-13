import type { Metadata } from "next";
import { generateMetadata as seo } from "@/lib/seo";

export const metadata: Metadata = seo({
  title: "Book Your Taxi Online",
  description:
    "Book your taxi in Saudi Arabia — enter pickup and drop-off to get an instant fixed price for airport transfers, Umrah transport and intercity rides.",
  path: "/book",
  noIndex: true,
});

export default function BookLayout({ children }: { children: React.ReactNode }) {
  return children;
}
