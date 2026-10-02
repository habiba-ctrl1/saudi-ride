import { EN_POSTS } from "./posts";
import { AR_POSTS } from "./ar";
import type { BlogPost, BlogPostAr, BlogCategory } from "./types";

export * from "./types";

const byDateDesc = (a: { publishedAt: string }, b: { publishedAt: string }) =>
  b.publishedAt.localeCompare(a.publishedAt);

/** Published English posts, newest first. */
export const BLOG_POSTS: BlogPost[] = EN_POSTS.filter((p) => p.published !== false).sort(byDateDesc);

/** Arabic posts — only those whose English original is published. */
export const BLOG_POSTS_AR: BlogPostAr[] = AR_POSTS.filter((p) => BLOG_POSTS.some((e) => e.slug === p.slug)).sort(byDateDesc);

export const AR_BLOG_SLUGS = BLOG_POSTS_AR.map((p) => p.slug);

export function getPost(slug: string) {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getPostAr(slug: string) {
  return BLOG_POSTS_AR.find((p) => p.slug === slug);
}

export function hasArabic(slug: string) {
  return AR_BLOG_SLUGS.includes(slug);
}

/** Last genuine content change, for sitemap + schema dateModified. */
export function lastModified(p: { publishedAt: string; updatedAt?: string }) {
  return p.updatedAt && p.updatedAt > p.publishedAt ? p.updatedAt : p.publishedAt;
}

/** Reading time at ~200 wpm (English) / ~170 wpm (Arabic). */
export function readingMinutes(markdown: string, locale: "en" | "ar" = "en") {
  const words = markdown.replace(/[#>*_|`\-[\]()]/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(2, Math.round(words / (locale === "ar" ? 170 : 200)));
}

/** Stable heading id — keeps Arabic letters so RTL anchors work. */
export function headingId(text: string) {
  return text
    .toLowerCase()
    .replace(/[*_`]/g, "")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

/** H2 (and H3) outline parsed from the markdown — feeds the table of contents. */
export function tableOfContents(markdown: string, includeH3 = false): TocItem[] {
  const out: TocItem[] = [];
  for (const line of markdown.split("\n")) {
    const m = line.match(/^(##|###)\s+(.+?)\s*$/);
    if (!m) continue;
    const level = m[1].length as 2 | 3;
    if (level === 3 && !includeH3) continue;
    const text = m[2].replace(/[*_`]/g, "");
    out.push({ id: headingId(text), text, level });
  }
  return out;
}

/** Hand-picked related posts first, then same category, then newest. */
export function relatedPosts(post: BlogPost, count = 3): BlogPost[] {
  const pool = BLOG_POSTS.filter((p) => p.slug !== post.slug);
  const picked: BlogPost[] = [];
  const push = (p?: BlogPost) => {
    if (p && !picked.includes(p) && picked.length < count) picked.push(p);
  };
  (post.related ?? []).forEach((s) => push(pool.find((p) => p.slug === s)));
  // Car-recovery posts only ever relate to each other, and vice versa.
  const sameWorld = (p: BlogPost) => (p.category === "Car Recovery") === (post.category === "Car Recovery");
  pool.filter((p) => p.category === post.category).forEach(push);
  pool.filter(sameWorld).forEach(push);
  return picked;
}

export function postsInCategory(category: BlogCategory) {
  return BLOG_POSTS.filter((p) => p.category === category);
}
