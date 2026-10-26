// One subject convention for every INTERNAL email so Gmail can label them automatically:
//   [TSA] <Category> · <details>        — alerts to the owner (new lead, contact, driver application, urgent…)
//   [TSA copy] <Document> · REF · Name  — record copy of what a customer was sent (quotation, receipt, …)
// Customer-facing subjects stay human ("Your Quotation TSA-2026-0042 — Taxi Saudi Arabia").

export const TAG = "[TSA]";
export const COPY_TAG = "[TSA copy]";

const clean = (s: unknown) => String(s ?? "").replace(/\s+/g, " ").trim();

/** Alert subject: `[TSA] Lead · Website quote · TSA-2026-0042 · A → B`. Empty parts are skipped. */
export function alertSubject(category: string, ...parts: unknown[]) {
  return [`${TAG} ${clean(category)}`, ...parts.map(clean).filter(Boolean)].join(" · ").slice(0, 180);
}

/** Record-copy subject: `[TSA copy] Quotation · TSA-2026-0042 · Ahmed Khan`. */
export function copySubject(document: string, ref: string, name: string) {
  return [`${COPY_TAG} ${clean(document)}`, clean(ref), clean(name)].filter(Boolean).join(" · ").slice(0, 180);
}
