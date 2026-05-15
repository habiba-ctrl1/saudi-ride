import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { serviceCards } from "@/lib/data/inspiration";

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-[#f8f8f6] text-[#121417]">
      <SiteHeader />
      <section className="section-container py-14">
        <p className="text-xs uppercase tracking-[0.2em] text-[#7c8088]">Services</p>
        <h1 className="mt-3 text-4xl font-semibold">Premium transfer services across Saudi Arabia</h1>
        <p className="mt-4 max-w-2xl text-sm text-[#525963]">
          Same operational strengths as your inspiration website, redesigned with a cleaner and more elegant user journey.
        </p>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {serviceCards.map((service) => (
            <article key={service.slug} className="rounded-2xl border border-[#e7e4db] bg-white p-6">
              <h2 className="text-2xl font-medium">{service.title}</h2>
              <p className="mt-2 text-sm text-[#525963]">{service.description}</p>
            </article>
          ))}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
