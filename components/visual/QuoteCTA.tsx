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

  const secondaryCls = tone === "onDark" ? "btn-glass" : "btn-secondary";

  return (
    <div
      className={`flex flex-col sm:flex-row gap-3 ${align === "center" ? "justify-center" : "justify-start"} ${className}`}
    >
      <Link
        href={primaryHref}
        className={`btn btn-lg ${tone === "onDark" ? "btn-accent" : "btn-primary"}`}
      >
        {primaryLabel}
        <ArrowRight className="rtl:rotate-180" />
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
        className={`btn btn-lg ${secondaryCls}`}
      >
        <MessageCircle />
        {secondaryLabel}
      </a>
    </div>
  );
}
