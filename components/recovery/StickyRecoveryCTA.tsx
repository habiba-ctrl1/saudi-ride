"use client";

import { MessageCircle, Phone } from "lucide-react";
import { recoveryContact } from "@/lib/config/contact";

// Mobile-only sticky bottom bar for recovery pages.
// WhatsApp -> BUSINESS lead-intake number (qualify -> quote -> margin).
// Call     -> brother's Dammam number (direct call only).
export function StickyRecoveryCTA({
  waText,
  lang = "en",
}: {
  /** Raw (un-encoded) pre-filled WhatsApp message. */
  waText: string;
  lang?: "en" | "ar";
}) {
  const waHref = `https://wa.me/${recoveryContact.whatsappNumber}?text=${encodeURIComponent(waText)}`;
  const t =
    lang === "ar"
      ? { wa: "اطلب السعر عبر واتساب", call: "اتصال مباشر" }
      : { wa: "WhatsApp for a Quote", call: "Call Directly" };

  return (
    <div
      dir={lang === "ar" ? "rtl" : "ltr"}
      className="fixed bottom-0 inset-x-0 z-50 flex gap-2 border-t border-[#C9A84C]/20 bg-white/95 backdrop-blur-md p-2.5 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] sm:hidden"
    >
      <a
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-xs font-bold text-white active:scale-[0.98] transition-transform"
      >
        <MessageCircle className="h-4 w-4" /> {t.wa}
      </a>
      <a
        href={recoveryContact.phoneLink}
        className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-[#16A34A] px-4 py-3 text-xs font-bold text-white active:scale-[0.98] transition-transform"
      >
        <Phone className="h-4 w-4" /> {t.call}
      </a>
    </div>
  );
}
