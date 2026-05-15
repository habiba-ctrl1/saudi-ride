import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { coverageLocations } from "@/lib/data/inspiration";

export default function LocationsPage() {
  return (
    <main className="min-h-screen bg-[#f8f8f6] text-[#121417]">
      <SiteHeader />
      <section className="section-container py-14">
        <p className="text-xs uppercase tracking-[0.2em] text-[#7c8088]">Coverage</p>
        <h1 className="mt-3 text-4xl font-semibold">Locations we serve</h1>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-[#e7e4db] bg-white p-6">
            <h2 className="text-lg font-semibold">Major Cities</h2>
            <ul className="mt-3 space-y-1 text-sm text-[#525963]">
              {coverageLocations.majorCities.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-[#e7e4db] bg-white p-6">
            <h2 className="text-lg font-semibold">Tourism & Resorts</h2>
            <ul className="mt-3 space-y-1 text-sm text-[#525963]">
              {coverageLocations.tourismAndResorts.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-[#e7e4db] bg-white p-6">
            <h2 className="text-lg font-semibold">Eastern & Industrial</h2>
            <ul className="mt-3 space-y-1 text-sm text-[#525963]">
              {coverageLocations.easternAndIndustrial.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
