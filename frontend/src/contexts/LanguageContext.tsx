"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { SupportedLanguage } from "@/types/api";
import { LanguageMeta, TranslationDictionary } from "@/types/i18n";
import { getTranslation, isRtlLanguage, getLanguageMeta, SUPPORTED_LANGUAGES } from "@/lib/i18n";

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage, options?: { autoTheme?: boolean }) => void;
  meta: LanguageMeta;
  t: TranslationDictionary;
  isRtl: boolean;
  supportedLanguages: LanguageMeta[];
  isLanguageModalOpen: boolean;
  setIsLanguageModalOpen: (open: boolean) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = "docsaathi_preferred_language";

export function LanguageProvider({
  children,
  onLanguageChangeCallback,
}: {
  children: ReactNode;
  onLanguageChangeCallback?: (lang: SupportedLanguage) => void;
}) {
  const [language, setLanguageState] = useState<SupportedLanguage>("en");
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as SupportedLanguage | null;
      if (stored && SUPPORTED_LANGUAGES.some((l) => l.code === stored)) {
        setLanguageState(stored);
      }
    } catch {
      // Ignore localStorage read errors in restricted environments
    }
  }, []);

  const setLanguage = (newLang: SupportedLanguage, options: { autoTheme?: boolean } = { autoTheme: true }) => {
    setLanguageState(newLang);
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
    } catch {
      // Ignore
    }

    // Set dir on documentElement
    const rtl = isRtlLanguage(newLang);
    if (typeof document !== "undefined") {
      document.documentElement.dir = rtl ? "rtl" : "ltr";
      document.documentElement.lang = newLang;
    }

    if (options.autoTheme && onLanguageChangeCallback) {
      onLanguageChangeCallback(newLang);
    }
  };

  const meta = getLanguageMeta(language);
  const t = getTranslation(language);
  const isRtl = isRtlLanguage(language);

  // Sync dir on mount
  useEffect(() => {
    if (hasMounted && typeof document !== "undefined") {
      document.documentElement.dir = isRtl ? "rtl" : "ltr";
      document.documentElement.lang = language;
    }
  }, [hasMounted, isRtl, language]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        meta,
        t,
        isRtl,
        supportedLanguages: SUPPORTED_LANGUAGES,
        isLanguageModalOpen,
        setIsLanguageModalOpen,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
