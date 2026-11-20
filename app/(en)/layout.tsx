import type { Metadata } from "next";
import { RootDocument, rootMetadata } from "@/components/layout/RootDocument";

export const metadata: Metadata = rootMetadata;

export default function EnRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RootDocument lang="en" dir="ltr">
      {children}
    </RootDocument>
  );
}
