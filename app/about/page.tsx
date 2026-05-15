import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { trustStats } from "@/lib/data/inspiration";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#f8f8f6] text-[#121417]">
      <SiteHeader />
      <section className="section-container py-14">
        <p className="text-xs uppercase tracking-[0.2em] text-[#7c8088]">About</p>
        <h1 className="mt-3 text-4xl font-semibold">Your passage to VIP mobility</h1>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[#525963]">
          We provide pre-booked premium chauffeur services for Umrah pilgrims, business guests, and family travelers across Saudi Arabia.
          Our focus is reliability, respectful service, and elegant end-to-end travel.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {trustStats.map((item) => (
            <div key={item.label} className="rounded-2xl border border-[#e7e4db] bg-white p-5">
              <p className="text-2xl font-semibold text-[#c7a66b]">{item.value}</p>
              <p className="mt-1 text-sm text-[#525963]">{item.label}</p>
            </div>
          ))}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
