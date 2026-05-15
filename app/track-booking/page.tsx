import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export default function TrackBookingPage() {
  return (
    <main className="min-h-screen bg-[#f8f8f6] text-[#121417]">
      <SiteHeader />
      <section className="section-container py-14">
        <p className="text-xs uppercase tracking-[0.2em] text-[#7c8088]">Track Booking</p>
        <h1 className="mt-3 text-4xl font-semibold">Check your booking status</h1>
        <p className="mt-4 max-w-2xl text-sm text-[#525963]">
          Enter your booking reference and WhatsApp number. We will show the latest chauffeur status in future update.
        </p>
        <form className="mt-8 max-w-xl rounded-2xl border border-[#e7e4db] bg-white p-6">
          <input
            type="text"
            placeholder="Booking ID (e.g. BK-1715268000)"
            className="mb-3 w-full rounded-xl border border-[#d8dde3] px-4 py-3 text-sm outline-none focus:border-[#c7a66b]"
          />
          <input
            type="text"
            placeholder="WhatsApp Number"
            className="mb-4 w-full rounded-xl border border-[#d8dde3] px-4 py-3 text-sm outline-none focus:border-[#c7a66b]"
          />
          <button type="button" className="rounded-full bg-[#121417] px-5 py-2 text-sm text-white">
            Track Now
          </button>
        </form>
      </section>
      <SiteFooter />
    </main>
  );
}
