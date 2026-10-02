import type { Metadata } from "next";
import { hasArabic, lastModified, type BlogPost, type BlogPostAr } from "@/lib/data/blog";

const DOMAIN = "https://taxisaudiarabia.com";

/** "<title> | Brand" — short brand suffix when the title is already long, so
 *  the keyword-carrying part isn't truncated in the SERP (~60 chars). */
function withBrand(t: string, ar: boolean) {
  if (ar) return t.length > 48 ? t : `${t} | تاكسي السعودية`;
  return t.length > 52 ? t : `${t} | Taxi Saudi Arabia`;
}

export function articleMetadata(post: BlogPost, arPost?: BlogPostAr): Metadata {
  const ar = !!arPost;
  const title = withBrand(arPost ? (arPost.seoTitle ?? arPost.title) : (post.seoTitle ?? post.title), ar);
  const description = arPost?.excerpt ?? post.excerpt;
  const enPath = `/blog/${post.slug}`;
  const arPath = `/ar/blog/${post.slug}`;
  const path = ar ? arPath : enPath;
  const image = `${DOMAIN}${post.coverImage}`;
  const languages = hasArabic(post.slug)
    ? { en: `${DOMAIN}${enPath}`, ar: `${DOMAIN}${arPath}`, "x-default": `${DOMAIN}${enPath}` }
    : undefined;
  const published = arPost?.publishedAt ?? post.publishedAt;

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `${DOMAIN}${path}`, ...(languages ? { languages } : {}) },
    openGraph: {
      type: "article",
      title,
      description,
      url: `${DOMAIN}${path}`,
      siteName: ar ? "تاكسي السعودية" : "Taxi Saudi Arabia",
      locale: ar ? "ar_SA" : "en_SA",
      publishedTime: published,
      modifiedTime: lastModified({ publishedAt: published, updatedAt: arPost ? arPost.updatedAt : post.updatedAt }),
      section: post.category,
      images: [{ url: image, width: 1200, height: 630, alt: arPost?.coverAlt ?? post.coverAlt }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export function indexMetadata(ar: boolean): Metadata {
  const title = ar
    ? "مدونة تاكسي السعودية | أدلة التنقل والسفر في المملكة"
    : "Saudi Arabia Transport & Travel Guides | Taxi Saudi Arabia Blog";
  const description = ar
    ? "أدلة عملية للتنقل في السعودية: توصيل المطارات، الرحلات بين المدن، العمرة، العُلا، سفر الأعمال والفعاليات — مع نصائح للحجز والأسعار."
    : "Practical guides for getting around Saudi Arabia: airport transfers, intercity routes, Umrah travel, AlUla, business trips and events — with booking and fare tips.";
  const path = ar ? "/ar/blog" : "/blog";
  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: `${DOMAIN}${path}`,
      languages: { en: `${DOMAIN}/blog`, ar: `${DOMAIN}/ar/blog`, "x-default": `${DOMAIN}/blog` },
    },
    openGraph: {
      type: "website",
      title,
      description,
      url: `${DOMAIN}${path}`,
      siteName: ar ? "تاكسي السعودية" : "Taxi Saudi Arabia",
      locale: ar ? "ar_SA" : "en_SA",
      images: [{ url: `${DOMAIN}/opengraph-image`, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description },
  };
}
