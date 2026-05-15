import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { fleetShowcase } from "@/lib/data/inspiration";

export default function FleetPage() {
  return (
    <main className="min-h-screen bg-[#f8f8f6] text-[#121417]">
      <SiteHeader />
      <section className="section-container py-14">
        <p className="text-xs uppercase tracking-[0.2em] text-[#7c8088]">Fleet</p>
        <h1 className="mt-3 text-4xl font-semibold">Elegant fleet for every travel profile</h1>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {fleetShowcase.map((car) => (
            <article key={car.name} className="rounded-2xl border border-[#e7e4db] bg-white p-6">
              <h2 className="text-2xl font-semibold">{car.name}</h2>
              <p className="mt-2 text-sm text-[#525963]">
                {car.passengers} passengers • {car.luggage} luggage
              </p>
              <ul className="mt-4 space-y-1 text-sm text-[#525963]">
                {car.features.map((feature) => (
                  <li key={feature}>- {feature}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
