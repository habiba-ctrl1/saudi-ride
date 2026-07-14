import { Metadata } from "next";

interface SEOProps {
  title: string;
  description: string;
  path: string;
  image?: string;
  noIndex?: boolean;
}

export function generateMetadata({
  title,
  description,
  path,
  image,
  noIndex = false,
}: SEOProps): Metadata {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const url = `https://taxisaudiarabia.com${cleanPath}`;

  // When no page-specific image is passed we omit the images field so Next.js
  // falls back to the site-wide branded card from app/opengraph-image.tsx.
  const ogImages = image
    ? [{ url: image, width: 1200, height: 630, alt: title }]
    : undefined;

  return {
    title: `${title} | Taxi Saudi Arabia`,
    description,
    metadataBase: new URL("https://taxisaudiarabia.com"),
    alternates: {
      canonical: url,
      // NOTE: /ar hreflang hataya — Arabic pages abhi exist nahi kartin (404 hreflang
      // Google ke liye bura signal hai). /ar launch par wapas add karna.
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      nocache: noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
      },
    },
    openGraph: {
      title: `${title} | Taxi Saudi Arabia`,
      description,
      url,
      siteName: "Taxi Saudi Arabia",
      ...(ogImages ? { images: ogImages } : {}),
      locale: "en_SA",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Taxi Saudi Arabia`,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}
