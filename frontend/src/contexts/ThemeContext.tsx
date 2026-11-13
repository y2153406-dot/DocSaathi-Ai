"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { ThemeConfig, ThemeId } from "@/types/themes";
import { THEMES, getThemeById, getThemeForLanguage } from "@/lib/themes";
import { SupportedLanguage } from "@/types/api";

export type BackgroundIntensity = "cinematic" | "balanced" | "subtle";

interface ThemeContextType {
  theme: ThemeConfig;
  themeId: ThemeId;
  setThemeById: (id: ThemeId) => void;
  applyThemeForLanguage: (lang: SupportedLanguage) => void;
  allThemes: ThemeConfig[];
  previewTheme: ThemeConfig | null;
  setPreviewTheme: (theme: ThemeConfig | null) => void;
  isThemeModalOpen: boolean;
  setIsThemeModalOpen: (open: boolean) => void;
  bgIntensity: BackgroundIntensity;
  setBgIntensity: (intensity: BackgroundIntensity) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "docsaathi_preferred_theme";
const BG_INTENSITY_STORAGE_KEY = "docsaathi_bg_intensity";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeIdState] = useState<ThemeId>("editorial-english");
  const [previewTheme, setPreviewTheme] = useState<ThemeConfig | null>(null);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [bgIntensity, setBgIntensityState] = useState<BackgroundIntensity>("cinematic");
  const [hasMounted, setHasMounted] = useState(false);

  const applyCssVariables = useCallback((config: ThemeConfig) => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    const { colors } = config;

    root.style.setProperty("--theme-bg", colors.bgStart);
    root.style.setProperty("--theme-bg-start", colors.bgStart);
    root.style.setProperty("--theme-bg-end", colors.bgEnd);
    root.style.setProperty("--theme-surface", colors.surface);
    root.style.setProperty("--theme-surface-glass", colors.surfaceGlass);
    root.style.setProperty("--theme-surface-glass-active", colors.surfaceGlassActive);
    root.style.setProperty("--theme-border", colors.border);
    root.style.setProperty("--theme-border-glow", colors.borderGlow);
    root.style.setProperty("--theme-primary", colors.primary);
    root.style.setProperty("--theme-primary-hover", colors.primaryHover);
    root.style.setProperty("--theme-secondary", colors.secondary);
    root.style.setProperty("--theme-accent", colors.accent);
    root.style.setProperty("--theme-accent-soft", colors.accentSoft);
    root.style.setProperty("--theme-text", colors.text);
    root.style.setProperty("--theme-text-muted", colors.textMuted);
    root.style.setProperty("--theme-text-inverse", colors.textInverse);
    root.style.setProperty("--font-primary", config.fontFamily);
    root.style.setProperty("--font-display", config.displayFont);
    root.style.setProperty("--theme-radius", config.borderRadius);
  }, []);

  useEffect(() => {
    setHasMounted(true);
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY) as ThemeId | null;
      if (stored && THEMES[stored]) {
        setThemeIdState(stored);
        applyCssVariables(THEMES[stored]);
      } else {
        applyCssVariables(THEMES["editorial-english"]);
      }
      const storedIntensity = localStorage.getItem(BG_INTENSITY_STORAGE_KEY) as BackgroundIntensity | null;
      if (storedIntensity && ["cinematic", "balanced", "subtle"].includes(storedIntensity)) {
        setBgIntensityState(storedIntensity);
      }
    } catch {
      applyCssVariables(THEMES["editorial-english"]);
    }
  }, [applyCssVariables]);

  const setBgIntensity = (intensity: BackgroundIntensity) => {
    setBgIntensityState(intensity);
    try {
      localStorage.setItem(BG_INTENSITY_STORAGE_KEY, intensity);
    } catch {
      // Ignore
    }
  };

  const setThemeById = (id: ThemeId) => {
    if (!THEMES[id]) return;
    setThemeIdState(id);
    applyCssVariables(THEMES[id]);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, id);
    } catch {
      // Ignore
    }
  };

  const applyThemeForLanguage = (lang: SupportedLanguage) => {
    const defaultTheme = getThemeForLanguage(lang);
    setThemeIdState(defaultTheme.id);
    applyCssVariables(defaultTheme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, defaultTheme.id);
    } catch {
      // Ignore
    }
  };

  const currentTheme = THEMES[themeId] || THEMES["editorial-english"];
  const allThemes = Object.values(THEMES);

  return (
    <ThemeContext.Provider
      value={{
        theme: currentTheme,
        themeId,
        setThemeById,
        applyThemeForLanguage,
        allThemes,
        previewTheme,
        setPreviewTheme,
        isThemeModalOpen,
        setIsThemeModalOpen,
        bgIntensity,
        setBgIntensity,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
