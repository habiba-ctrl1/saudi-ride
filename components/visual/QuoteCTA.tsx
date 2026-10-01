"use client";

import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { contactConfig } from "@/lib/config/contact";
import { buildWhatsAppUrl, type WhatsAppPrefill } from "@/lib/whatsapp";
import { trackEvent } from "@/lib/analytics";

/**
 * The site's one CTA pairing: a primary quote action + a secondary WhatsApp
 * action. Keeps label vocabulary, sizing and hover behaviour identical
 * everywhere so no page hand-rolls its own button pair.
 *
 * - `primaryLabel` is context-aware ("Get a Quote", "Get Airport Transfer
 *   Quote", "Request Corporate Quote", …) — the caller chooses wording that
 *   matches page intent.
 * - `prefill` feeds the structured WhatsApp message (From/To/Date/Passengers/
 *   Vehicle); the secondary button opens it pre-composed.
 * - `primaryHref` defaults to the shared quote form; pass `#booking-console`
 *   on the homepage or a page-level form anchor where one exists.
 */
export function QuoteCTA({
  prefill,
  primaryLabel = "Get a Quote",
  secondaryLabel = "WhatsApp Us",
  primaryHref = "/book",
  tone = "onLight",
  align = "start",
  source = "quote_cta",
  className = "",
}: {
  prefill: WhatsAppPrefill;
  primaryLabel?: string;
  secondaryLabel?: string;
  primaryHref?: string;
  tone?: "onLight" | "onDark";
  align?: "start" | "center";
  source?: string;
  className?: string;
}) {
  const pathname = usePathname();
  const waUrl = buildWhatsAppUrl(prefill);

  const secondaryCls =
    tone === "onDark"
      ? "border border-white/25 bg-white/10 text-white hover:bg-white/20"
      : "border border-[#16A34A]/25 bg-white text-[#15803D] hover:bg-[#F0FDF4] hover:border-[#16A34A]/50";

  return (
    <div
      className={`flex flex-col sm:flex-row gap-3 ${align === "center" ? "justify-center" : "justify-start"} ${className}`}
    >
      <Link
        href={primaryHref}
        className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#16A34A] px-7 text-sm font-bold text-white shadow-[0_8px_24px_rgba(22,163,74,0.32)] transition-all duration-200 hover:bg-[#15803D] hover:shadow-[0_10px_30px_rgba(22,163,74,0.45)] active:translate-y-px focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#16A34A]/30"
      >
        {primaryLabel}
        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
      </Link>
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() =>
          trackEvent("whatsapp_click", {
            sourceLocation: source,
            phoneUsed: contactConfig.whatsappNumber,
            locale: "en",
            path: pathname,
          })
        }
        className={`group inline-flex h-12 items-center justify-center gap-2 rounded-full px-7 text-sm font-bold transition-all duration-200 active:translate-y-px focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#16A34A]/30 ${secondaryCls}`}
      >
        <MessageCircle className="h-4 w-4" />
        {secondaryLabel}
      </a>
    </div>
  );
}
