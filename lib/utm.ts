// UTM capture + session persistence. Call captureUtm() once on first load;
// getUtm() then returns the stored params for the rest of the session so a lead
// captured three pages later still carries the campaign that brought the visitor.

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;
export type Utm = Partial<Record<(typeof UTM_KEYS)[number], string>>;

const STORAGE_KEY = "tsa_utm";

export function captureUtm(): void {
  if (typeof window === "undefined") return;
  try {
    const params = new URLSearchParams(window.location.search);
    const found: Utm = {};
    for (const k of UTM_KEYS) {
      const v = params.get(k);
      if (v) found[k] = v.slice(0, 200);
    }
    // Persist only if this visit actually carries UTMs (don't clobber an earlier
    // campaign attribution with an empty set on a later internal navigation).
    if (Object.keys(found).length > 0) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(found));
    }
  } catch {
    /* storage blocked — ignore */
  }
}

export function getUtm(): Utm {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "{}") as Utm;
  } catch {
    return {};
  }
}
