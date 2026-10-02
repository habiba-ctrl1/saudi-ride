import type { BlogLink, BlogPost } from "./types";

// Fallback "Plan this trip" links for posts without a hand-picked `links`
// list. Derived from title + body so every post links into the commercial
// cluster (routes / airports / services / locations). Anchors are varied and
// descriptive on purpose — never the same exact-match anchor everywhere.
export function autoLinksFor(post: Pick<BlogPost, "title" | "content" | "slug" | "category">): BlogLink[] {
  const t = (post.title + " " + post.content).toLowerCase();
  const out: BlogLink[] = [];
  const add = (label: string, href: string) => {
    if (href !== `/blog/${post.slug}` && !out.some((l) => l.href === href)) out.push({ label, href });
  };
  const any = (...keys: string[]) => keys.some((k) => t.includes(k));
  const all = (...keys: string[]) => keys.every((k) => t.includes(k));

  if (post.category === "Car Recovery") {
    add("24/7 car recovery & satha service", "/services/car-recovery");
    if (any("riyadh")) add("Satha recovery in Riyadh", "/services/car-recovery/riyadh");
    if (any("jeddah")) add("Flatbed towing in Jeddah", "/services/car-recovery/jeddah");
    if (any("dammam")) add("Car recovery in Dammam", "/services/car-recovery/dammam");
    return out.slice(0, 6);
  }

  if (post.slug === "buying-sim-cards-jeddah-airport-stc-mobily-zain") add("Jeddah Airport SIM card quick answer", "/guides/jeddah-airport-sim-card");

  if (all("jeddah", "makkah", "airport")) add("Jeddah Airport to Makkah private transfer", "/routes/jeddah-airport-to-makkah");
  if (all("jeddah", "madinah")) add("Jeddah to Madinah transfer", "/routes/jeddah-to-madinah");
  if (any("makkah to madinah", "madinah to makkah")) add("Madinah to Makkah private car", "/routes/madinah-to-makkah");
  if (all("makkah", "taif")) add("Makkah to Taif ride", "/routes/makkah-to-taif");

  if (any("jeddah airport", "king abdulaziz")) add("Jeddah Airport (JED) pickups", "/airports/king-abdulaziz-jeddah");
  if (any("madinah airport", "prince mohammad")) add("Madinah Airport (MED) pickups", "/airports/prince-mohammad-madinah");
  if (any("riyadh airport", "king khalid", "(ruh)")) add("Riyadh Airport (RUH) transfers", "/airports/king-khalid-riyadh");

  if (any("umrah")) add("Private Umrah transport", "/services/umrah-transport");
  if (all("makkah", "ziyarat")) add("Makkah Ziyarat by private car", "/services/makkah-ziyarat");
  if (all("madinah", "ziyarat")) add("Madinah Ziyarat tour", "/services/madinah-ziyarat");
  if (any("corporate", "executive")) add("Corporate transportation", "/services/corporate");

  if (any("makkah", "mecca")) add("Getting around Makkah", "/locations/makkah");
  if (any("madinah", "medina")) add("Private car in Madinah", "/locations/madinah");
  if (any("riyadh")) add("Riyadh chauffeur service", "/locations/riyadh");
  if (any("alula", "hegra")) add("Private transfers in AlUla", "/locations/alula");

  add("Vehicle categories", "/fleet");
  add("Browse all routes", "/routes");
  return out.slice(0, 6);
}
