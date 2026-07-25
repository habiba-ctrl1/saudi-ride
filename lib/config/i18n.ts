// Pages that have real Arabic translations and their own SSR route under app/ar/*.
export const AR_REAL_ROUTES = ["/", "/about", "/contact", "/faq", "/pricing", "/partners"];

// Noindex utility pages that still switch to Arabic client-side (via
// LanguageContext) but don't need a dedicated SSR route since they're never indexed.
export const AR_REWRITE_ROUTES = ["/book", "/track-booking", "/partners/driver-registration"];

export const AR_AVAILABLE_ROUTES = [...AR_REAL_ROUTES, ...AR_REWRITE_ROUTES];
