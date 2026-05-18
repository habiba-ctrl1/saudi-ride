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
  image = "https://riyadhluxetaxi.com/images/og-image.jpg",
  noIndex = false,
}: SEOProps): Metadata {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const url = `https://riyadhluxetaxi.com${cleanPath}`;

  return {
    title: `${title} | Riyadh Luxe Taxi`,
    description,
    metadataBase: new URL("https://riyadhluxetaxi.com"),
    alternates: {
      canonical: url,
      languages: {
        "en": `https://riyadhluxetaxi.com${cleanPath}`,
        "ar": `https://riyadhluxetaxi.com/ar${cleanPath}`,
        "ur": `https://riyadhluxetaxi.com/ur${cleanPath}`,
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
      title: `${title} | Riyadh Luxe Taxi`,
      description,
      url,
      siteName: "Riyadh Luxe Taxi",
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
      title: `${title} | Riyadh Luxe Taxi`,
      description,
      images: [image],
    },
  };
}
