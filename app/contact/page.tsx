import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { contactConfig } from "@/lib/config/contact";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#f8f8f6] text-[#121417]">
      <SiteHeader />
      <section className="section-container py-14">
        <p className="text-xs uppercase tracking-[0.2em] text-[#7c8088]">Contact</p>
        <h1 className="mt-3 text-4xl font-semibold">Speak with our booking desk</h1>
        <p className="mt-3 max-w-2xl text-sm text-[#525963]">Available 24/7 for airport, Umrah, and intercity reservations.</p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <a href={contactConfig.primaryPhoneLink} className="rounded-2xl border border-[#e7e4db] bg-white p-6">
            <p className="text-xs uppercase tracking-[0.1em] text-[#7c8088]">Primary Phone</p>
            <p className="mt-2 text-lg font-semibold">{contactConfig.primaryPhoneDisplay}</p>
          </a>
          <a href={contactConfig.emailLink} className="rounded-2xl border border-[#e7e4db] bg-white p-6">
            <p className="text-xs uppercase tracking-[0.1em] text-[#7c8088]">Email</p>
            <p className="mt-2 text-lg font-semibold">{contactConfig.email}</p>
          </a>
          <a href={contactConfig.whatsappLink} target="_blank" rel="noreferrer" className="rounded-2xl border border-[#e7e4db] bg-white p-6">
            <p className="text-xs uppercase tracking-[0.1em] text-[#7c8088]">WhatsApp</p>
            <p className="mt-2 text-lg font-semibold">Start Booking Chat</p>
          </a>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
