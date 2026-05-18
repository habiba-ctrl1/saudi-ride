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
  image = "https://riyadhtaxi.com/images/og-image.jpg",
  noIndex = false,
}: SEOProps): Metadata {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const url = `https://riyadhtaxi.com${cleanPath}`;

  return {
    title: `${title} | Riyadh Taxi`,
    description,
    metadataBase: new URL("https://riyadhtaxi.com"),
    alternates: {
      canonical: url,
      languages: {
        "en": `https://riyadhtaxi.com${cleanPath}`,
        "ar": `https://riyadhtaxi.com/ar${cleanPath}`,
        "ur": `https://riyadhtaxi.com/ur${cleanPath}`,
      },
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
      title: `${title} | Riyadh Taxi`,
      description,
      url,
      siteName: "Riyadh Taxi",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "en_SA",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Riyadh Taxi`,
      description,
      images: [image],
    },
  };
}
