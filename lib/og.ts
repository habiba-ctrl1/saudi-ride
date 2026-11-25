// Site-wide fallback share card (app/opengraph-image.tsx). A page's own
// `openGraph` object replaces the root one entirely, so any page that sets
// openGraph without its own photo must add this explicitly.
export const DEFAULT_OG_IMAGES = [
  { url: "https://taxisaudiarabia.com/opengraph-image", width: 1200, height: 630, alt: "Taxi Saudi Arabia" },
];
