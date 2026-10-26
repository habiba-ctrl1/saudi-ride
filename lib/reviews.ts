// Verified-ride review links. The token is an HMAC of the quote reference, so a link can only be
// produced by us (server secret) and only works for that one ride. No DB column needed.
import { createHmac, timingSafeEqual } from "node:crypto";

const SITE = "https://taxisaudiarabia.com";

function secret() {
  return process.env.NEXTAUTH_SECRET || "";
}

export function reviewToken(ref: string): string {
  return createHmac("sha256", secret()).update(`review:${ref}`).digest("hex").slice(0, 20);
}

export function verifyReviewToken(ref: string, token: string): boolean {
  if (!secret() || !ref || !token) return false;
  const a = Buffer.from(reviewToken(ref));
  const b = Buffer.from(token);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Absolute link to put in a receipt email / WhatsApp message. */
export function reviewUrlFor(ref: string): string {
  return `${SITE}/review?ref=${encodeURIComponent(ref)}&k=${reviewToken(ref)}`;
}

/** Optional Google Business Profile review link (set NEXT_PUBLIC_GOOGLE_REVIEW_URL once the owner has it). */
export const googleReviewUrl = process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL || "";

/** Where customers leave their review: the Trustpilot "evaluate" page (override with NEXT_PUBLIC_TRUSTPILOT_URL if it ever changes). */
export const TRUSTPILOT_REVIEW_URL = process.env.NEXT_PUBLIC_TRUSTPILOT_URL || "https://www.trustpilot.com/evaluate/taxisaudiarabia.com";
