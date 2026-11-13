"use client";

import React from "react";
import { Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { SupportedLanguage } from "@/types/api";

export function Footer() {
  const { t, setLanguage, language, supportedLanguages } = useLanguage();
  const { theme, applyThemeForLanguage } = useTheme();

  const handleLanguageClick = (code: SupportedLanguage) => {
    setLanguage(code, { autoTheme: true });
    applyThemeForLanguage(code);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full bg-theme-bg border-t border-theme-border/60 transition-colors duration-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12 space-y-8">
        
        {/* Top: Clean Branding & Tagline */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-theme-primary to-theme-secondary flex items-center justify-center font-display font-black text-lg text-theme-textInverse shadow-sm">
              सा
            </div>
            <div>
              <span className="font-display font-extrabold text-xl text-theme-text">
                DocSaathi<span className="text-theme-primary ml-0.5">AI</span>
              </span>
              <p className="text-xs text-theme-textMuted">
                {t.brand.tagline}
              </p>
            </div>
          </div>

          <div className="text-xs text-theme-textMuted flex items-center gap-2">
            <span>Active Theme:</span>
            <span className="px-2.5 py-1 rounded-full bg-theme-surfaceGlass border border-theme-border font-medium text-theme-text flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: theme.colors.primary }}
              />
              <span>{theme.name}</span>
            </span>
          </div>
        </div>

        {/* 15 Languages Quick Switcher Row */}
        <div className="pt-6 border-t border-theme-border/50 space-y-3 text-left">
          <div className="flex items-center gap-2 text-xs font-semibold text-theme-textMuted">
            <Globe className="w-3.5 h-3.5 text-theme-primary" />
            <span>Available in 15 Indian Languages:</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {supportedLanguages.map((l) => (
              <button
                key={l.code}
                onClick={() => handleLanguageClick(l.code)}
                className={`text-xs px-3 py-1.5 rounded-xl border transition-all duration-200 ${
                  language === l.code
                    ? "bg-theme-primary text-theme-textInverse border-theme-primary font-semibold shadow-sm"
                    : "bg-theme-surfaceGlass border-theme-border text-theme-text hover:border-theme-primary/50"
                }`}
              >
                {l.nativeName}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Rights Bar */}
        <div className="pt-6 border-t border-theme-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-theme-textMuted">
          <div>
            © {new Date().getFullYear()} DocSaathi AI — All Rights Reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>100% Client-Side Safe & Grounded AI</span>
            <span>•</span>
            <span>Multilingual Document Simplifier</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
