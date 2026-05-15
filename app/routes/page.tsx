import Link from "next/link";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { popularRoutes } from "@/lib/data/inspiration";
import { contactConfig } from "@/lib/config/contact";

export default function RoutesPage() {
  return (
    <main className="min-h-screen bg-[#f8f8f6] text-[#121417]">
      <SiteHeader />
      <section className="section-container py-14">
        <p className="text-xs uppercase tracking-[0.2em] text-[#7c8088]">Popular Routes</p>
        <h1 className="mt-3 text-4xl font-semibold">High-demand transfer corridors</h1>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {popularRoutes.map((route) => (
            <div key={route} className="rounded-xl border border-[#e7e4db] bg-white px-5 py-4 text-sm">
              {route}
            </div>
          ))}
        </div>
        <div className="mt-8 rounded-2xl border border-[#e7e4db] bg-white p-6">
          <p className="text-sm text-[#525963]">
            Need a custom route quote? Share your pickup, destination, and passenger details.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a href={contactConfig.whatsappLink} target="_blank" rel="noreferrer" className="rounded-full bg-[#121417] px-5 py-2 text-sm text-white">
              Book via WhatsApp
            </a>
            <Link href="/#booking" className="rounded-full border border-[#c7a66b] px-5 py-2 text-sm">
              Use Online Booking
            </Link>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
