import Link from "next/link";
import { contactConfig } from "@/lib/config/contact";

export function SiteFooter() {
  return (
    <footer className="border-t border-[#e8e4dc] bg-white">
      <div className="section-container grid gap-8 py-10 md:grid-cols-4">
        <div>
          <p className="text-sm font-semibold tracking-[0.18em]">RIYADH LUXE TAXI</p>
          <p className="mt-2 text-sm text-[#5c626c]">Premium chauffeur service for airports, Umrah journeys, and intercity travel.</p>
        </div>
        <div>
          <p className="text-sm font-semibold">Destinations</p>
          <ul className="mt-2 space-y-1 text-sm text-[#5c626c]">
            <li>Jeddah</li>
            <li>Makkah</li>
            <li>Madinah</li>
            <li>Riyadh</li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold">Quick Links</p>
          <div className="mt-2 flex flex-col gap-1 text-sm text-[#5c626c]">
            <Link href="/track-booking">Track Booking</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold">Contact</p>
          <div className="mt-2 flex flex-col gap-1 text-sm text-[#5c626c]">
            <a href={contactConfig.primaryPhoneLink}>{contactConfig.primaryPhoneDisplay}</a>
            <a href={contactConfig.emailLink}>{contactConfig.email}</a>
            <a href={contactConfig.whatsappLink} target="_blank" rel="noreferrer">
              WhatsApp Booking
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
