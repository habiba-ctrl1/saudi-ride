"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/lib/context/LanguageContext";
import { ReactNode } from "react";
import { Toaster } from "sonner";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark" enableSystem={false}>
        <LanguageProvider>
          {children}
          <Toaster theme="dark" position="top-right" closeButton richColors />
        </LanguageProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
