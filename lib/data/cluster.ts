// Shared types + helpers for the city location clusters (Riyadh, Jeddah, …).
// City content lives in lib/data/<city>-cluster.ts; components in
// components/location/cluster/*. Distances/times only via routeFact() so a
// hub, its children and the route pages can never disagree (CLAUDE.md §17).
import { ROUTES_DATA } from "@/lib/data/routes";
import { DISTANCE_GUIDES } from "@/lib/data/distances";

export function fmtDuration(min: number): string {
  if (min < 60) return `~${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (m === 0) return `~${h} hr`;
  if (m === 30) return `~${h}.5 hr`;
  return `~${h} hr ${m} min`;
}

export interface RouteFact {
  slug: string;
  from: string;
  to: string;
  km: number;
  minutes: number;
  time: string;
}

export function routeFact(slug: string): RouteFact | null {
  const r = ROUTES_DATA.find((x) => x.slug === slug);
  if (!r) return null;
  return { slug, from: r.fromCity, to: r.toCity, km: r.distance, minutes: r.duration, time: fmtDuration(r.duration) };
}

/** Reverse route slug if a real page exists (e.g. riyadh-to-dubai → dubai-to-riyadh). */
export function reverseSlug(slug: string): string | null {
  const m = slug.match(/^(.+)-to-(.+)$/);
  if (!m) return null;
  const rev = `${m[2]}-to-${m[1]}`;
  return ROUTES_DATA.some((r) => r.slug === rev) ? rev : null;
}

export function distanceGuideFor(routeSlug: string): string | null {
  return DISTANCE_GUIDES.find((d) => d.routeSlug === routeSlug)?.slug ?? null;
}

export const CORPORATE_INVOICE_LINE = "Corporate invoicing can be arranged through our sister company.";

export type TripIcon = "plane" | "hotel" | "clock" | "briefcase" | "route" | "landmark" | "ticket" | "crown";

export interface TripType {
  id: string;
  icon: TripIcon;
  label: string;
  short: string;
  answer: string;
  send: string[];
  href: string;
  linkLabel: string;
  waPrefill: string;
}

export type Block =
  | { eyebrow?: string; type: "prose"; heading: string; paragraphs: string[] }
  | { eyebrow?: string; type: "cards"; heading: string; intro?: string; items: { title: string; body: string }[] }
  | { eyebrow?: string; type: "checklist"; heading: string; intro?: string; items: string[] }
  | { eyebrow?: string; type: "steps"; heading: string; intro?: string; items: { title: string; desc: string }[] }
  | { eyebrow?: string; type: "table"; heading: string; intro?: string; columns: string[]; rows: string[][] }
  | { eyebrow?: string; type: "compare"; heading: string; intro?: string; options: { title: string; when: string[]; tone: "green" | "ink" }[] }
  | { eyebrow?: string; type: "timeline"; heading: string; intro?: string; items: { time: string; title: string; desc: string }[] }
  | { eyebrow?: string; type: "routes"; heading: string; intro?: string; items: { slug: string; note: string }[] };

export interface ClusterPage {
  slug: string;
  kind: "district" | "service" | "attraction";
  name: string;
  nameAr: string;
  title: string;
  metaDescription: string;
  h1: string;
  /** Optional line under the H1 — used where the H1 itself must stay unchanged (rule 3). */
  tagline?: string;
  eyebrow: string;
  /** Omit when no accurate photo of the place exists — the hero then renders
   *  a typographic panel instead of an unrelated stock image. */
  heroImage?: string;
  heroAlt?: string;
  intro: string;
  facts: { label: string; value: string }[];
  blocks: Block[];
  ctaHeading: string;
  ctaBody: string;
  ctaLabel: string;
  waPrefill: string;
  form: { pickup?: string; dropoff?: string; vehicle?: string; tripType?: "One Way" | "Round Trip" | "By the Hour" };
  pathB?: { heading: string; body: string; emailSubject: string; emailBody: string };
  faqs: { question: string; answer: string }[];
  related: { href: string; label: string; desc: string }[];
  schema: { serviceType: string; place?: { name: string; type: "Place" | "TouristAttraction"; description: string } };
}

/** City context for the shared child-page renderer. */
export interface ClusterCity {
  slug: string;
  name: string;
  /** Sibling nav shown at the foot of every child page. */
  nav: { slug: string; label: string }[];
}

/** Path-B email body used by the child pages' RFQ link. */
export const corpEmail = (topic: string) =>
  `Hello Taxi Saudi Arabia team,\n\nWe'd like a written quote for ${topic}.\n\n• Company / organisation: \n• Contact name & role: \n• Dates: \n• Trips / addresses: \n• Passengers per trip: \n• Vehicle preference (Executive sedan / SUV / Van): \n• Invoice needed?: \n\nPlease confirm the fixed fare before booking.\n\nThank you.`;
