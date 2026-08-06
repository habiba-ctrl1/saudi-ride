"use client";

// Keeps <html lang> and <html dir> in sync with the active locale so Arabic
// renders as lang="ar" dir="rtl" (and everything else lang="<x>" dir="ltr").
// Doing it here means it can never drift per-page. Runs on the client after
// hydration; Googlebot (which renders JS) and screen readers see the correct
// attributes on every navigation.

import { useEffect } from "react";
import { useLanguage } from "@/lib/context/LanguageContext";

export function HtmlLangSync() {
  const { language } = useLanguage();
  useEffect(() => {
    const el = document.documentElement;
    el.lang = language;
    el.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);
  return null;
}
