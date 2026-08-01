"use client";

import { useState, useEffect } from "react";
import { X, MessageCircle, PhoneCall, ArrowRight } from "lucide-react";
import { contactConfig } from "@/lib/config/contact";

/**
 * ScrollCTA — a bottom-sheet CTA that slides in after the user scrolls
 * past 40 % of the page. Dismissed for the session on close.
 * Designed for mobile-first but works on desktop as a slim bar.
 */
export function ScrollCTA() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Don't re-show if already dismissed this session
    if (sessionStorage.getItem("scrollCTADismissed")) {
      setDismissed(true);
      return;
    }

    function onScroll() {
      const scrollPercent =
        window.scrollY / (document.body.scrollHeight - window.innerHeight);
      if (scrollPercent > 0.35) {
        setVisible(true);
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function dismiss() {
    setDismissed(true);
    sessionStorage.setItem("scrollCTADismissed", "1");
  }

  if (dismissed || !visible) return null;

  return (
    <div
      className="fixed bottom-0 inset-x-0 z-50 animate-slide-up"
      role="dialog"
      aria-label="Quick quote popup"
    >
      {/* Backdrop blur bar */}
      <div className="mx-auto max-w-2xl px-4 pb-4">
        <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-[#1C1C1C]/95 backdrop-blur-xl shadow-[0_-8px_40px_rgba(0,0,0,0.35)] p-5">
          {/* Close button */}
          <button
            onClick={dismiss}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Close popup"
          >
            <X className="h-4 w-4 text-white/70" />
          </button>

          {/* Content */}
          <p className="font-heading text-base md:text-lg font-bold text-white pr-8">
            Need a quick price?
          </p>
          <p className="mt-1 text-xs text-white/60 max-w-md">
            Get a fixed-price quote on WhatsApp, usually within 1–2 hours — no hidden fees.
          </p>

          {/* Buttons */}
          <div className="mt-4 flex flex-col sm:flex-row gap-2.5">
            <a
              href={contactConfig.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-xs font-bold uppercase text-white hover:bg-[#1EBE5B] transition-all shadow-md"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp Quote
            </a>
            <a
              href="#booking-console"
              onClick={dismiss}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#16A34A] px-6 py-3 text-xs font-bold uppercase text-white hover:bg-[#15803D] transition-all shadow-md"
            >
              <ArrowRight className="h-4 w-4" />
              Calculate Price
            </a>
            <a
              href={contactConfig.primaryPhoneLink}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3 text-xs font-bold uppercase text-white/80 hover:bg-white/10 transition-all"
            >
              <PhoneCall className="h-4 w-4" />
              Call Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
