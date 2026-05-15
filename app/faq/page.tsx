import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { faqItems } from "@/lib/data/inspiration";

export default function FaqPage() {
  return (
    <main className="min-h-screen bg-[#f8f8f6] text-[#121417]">
      <SiteHeader />
      <section className="section-container py-14">
        <p className="text-xs uppercase tracking-[0.2em] text-[#7c8088]">FAQ</p>
        <h1 className="mt-3 text-4xl font-semibold">Frequently asked questions</h1>
        <div className="mt-8 space-y-4">
          {faqItems.map((item) => (
            <details key={item.question} className="rounded-2xl border border-[#e7e4db] bg-white p-5">
              <summary className="cursor-pointer text-lg font-medium">{item.question}</summary>
              <p className="mt-3 text-sm leading-relaxed text-[#525963]">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
