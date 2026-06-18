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
  image = "https://taxisaudiarabia.com/images/og-image.jpg",
  noIndex = false,
}: SEOProps): Metadata {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const url = `https://taxisaudiarabia.com${cleanPath}`;

  return {
    title: `${title} | Taxi Saudi Arabia`,
    description,
    metadataBase: new URL("https://taxisaudiarabia.com"),
    alternates: {
      canonical: url,
      languages: {
        "en": `https://taxisaudiarabia.com${cleanPath}`,
        "ar": `https://taxisaudiarabia.com/ar${cleanPath}`,
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
      title: `${title} | Taxi Saudi Arabia`,
      description,
      url,
      siteName: "Taxi Saudi Arabia",
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
      title: `${title} | Taxi Saudi Arabia`,
      description,
      images: [image],
    },
  };
}
