import type { Metadata } from "next";
import { RootDocument, rootMetadata } from "@/components/layout/RootDocument";

// Same default metadata as the English root so /ar pages inherit identical
// defaults (each /ar page still overrides title/description as before).
export const metadata: Metadata = rootMetadata;

export default function ArRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RootDocument lang="ar" dir="rtl">
      {children}
    </RootDocument>
  );
}
