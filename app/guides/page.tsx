import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { guidePosts } from "@/lib/data/inspiration";

export default function GuidesPage() {
  return (
    <main className="min-h-screen bg-[#f8f8f6] text-[#121417]">
      <SiteHeader />
      <section className="section-container py-14">
        <p className="text-xs uppercase tracking-[0.2em] text-[#7c8088]">Travel Guides</p>
        <h1 className="mt-3 text-4xl font-semibold">Latest travel guides for pilgrims & visitors</h1>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {guidePosts.map((guide) => (
            <article key={guide} className="rounded-2xl border border-[#e7e4db] bg-white p-6">
              <h2 className="text-lg font-medium">{guide}</h2>
              <p className="mt-2 text-sm text-[#525963]">Detailed walkthrough and practical tips for smoother travel in KSA.</p>
            </article>
          ))}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
