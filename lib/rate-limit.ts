// In-memory rate limiter — no Redis dependency required for edge/serverless.
// Suitable for single-instance deployments; for multi-instance use Redis.

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Prune stale entries every 5 minutes to avoid memory bloat.
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store.entries()) {
      if (entry.resetAt < now) store.delete(key);
    }
  }, 5 * 60 * 1000);
}

interface RateLimitOptions {
  /** Unique key scoping this limit (e.g. `"otp:${phone}"`) */
  key: string;
  /** Max requests allowed in the window */
  limit: number;
  /** Window duration in milliseconds */
  windowMs: number;
}

interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
}

export function rateLimit({ key, limit, windowMs }: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    const resetAt = now + windowMs;
    store.set(key, { count: 1, resetAt });
    return { success: true, remaining: limit - 1, resetAt };
  }

  entry.count += 1;

  if (entry.count > limit) {
    return { success: false, remaining: 0, resetAt: entry.resetAt };
  }

  return { success: true, remaining: limit - entry.count, resetAt: entry.resetAt };
}

// Pre-configured limiters matching spec requirements
export const AUTH_LIMIT = { limit: 10, windowMs: 15 * 60 * 1000 };   // 10/15min
export const OTP_LIMIT  = { limit: 3,  windowMs: 60 * 60 * 1000 };   // 3/hour
export const FARES_LIMIT = { limit: 30, windowMs: 60 * 1000 };        // 30/min
export const BOOKING_LIMIT = { limit: 5, windowMs: 60 * 60 * 1000 }; // 5/hour
