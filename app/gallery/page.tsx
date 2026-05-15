import Image from "next/image";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

const images = [
  "https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1485291571150-772bcfc10da5?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1200&q=80"
];

export default function GalleryPage() {
  return (
    <main className="min-h-screen bg-[#f8f8f6] text-[#121417]">
      <SiteHeader />
      <section className="section-container py-14">
        <p className="text-xs uppercase tracking-[0.2em] text-[#7c8088]">Gallery</p>
        <h1 className="mt-3 text-4xl font-semibold">Premium fleet & destination visuals</h1>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {images.map((src) => (
            <div key={src} className="overflow-hidden rounded-2xl border border-[#e7e4db] bg-white">
              <Image src={src} alt="Taxi service gallery" width={1200} height={800} className="h-72 w-full object-cover" />
            </div>
          ))}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
