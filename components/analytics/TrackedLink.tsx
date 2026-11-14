"use client";

// Anchor that fires the existing trackEvent() on click, so server-rendered
// pages (e.g. /events/[slug]) can report CTA clicks without becoming client pages.
import type { AnchorHTMLAttributes } from "react";
import { trackEvent } from "@/lib/analytics";

interface TrackedLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  kind: "whatsapp" | "phone" | "email";
  sourceLocation: string;
  /** Number or address used (never personal data). */
  contactUsed: string;
  path: string;
  routeId?: string;
  locale?: string;
}

export function TrackedLink({ kind, sourceLocation, contactUsed, path, routeId, locale = "en", onClick, ...rest }: TrackedLinkProps) {
  return (
    <a
      {...rest}
      onClick={(e) => {
        if (kind === "whatsapp") {
          trackEvent("whatsapp_click", { sourceLocation, phoneUsed: contactUsed, locale, path, routeId });
        } else if (kind === "phone") {
          trackEvent("phone_click", { sourceLocation, phoneUsed: contactUsed, locale, path });
        } else {
          trackEvent("email_click", { sourceLocation, emailUsed: contactUsed, locale, path });
        }
        onClick?.(e);
      }}
    />
  );
}
