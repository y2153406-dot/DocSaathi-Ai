"use client";

import React, { useState } from "react";
import {
  Globe,
  Palette,
  Eye,
  Sliders,
  Info,
  ShieldCheck,
  Check,
  Zap,
  Sparkles,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { GlassCard } from "@/components/common/GlassCard";
import { Button } from "@/components/common/Button";
import { Badge } from "@/components/common/Badge";

export function SettingsView() {
  const { t, meta, setIsLanguageModalOpen, supportedLanguages, language, setLanguage } = useLanguage();
  const { theme, setIsThemeModalOpen, bgIntensity, setBgIntensity } = useTheme();

  const [motionPreference, setMotionPreference] = useState<"standard" | "reduced">("standard");

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 py-6 text-left">
      {/* Title */}
      <div className="space-y-1">
        <h2 className="text-3xl font-extrabold text-theme-text font-display">
          {t.settings.title}
        </h2>
        <p className="text-sm text-theme-textMuted">
          Customize your linguistic preferences, cultural regional themes, and accessibility settings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Language Selection Card */}
        <GlassCard variant="default" className="p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-theme-border/60">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-theme-primary" />
              <h3 className="text-base font-bold text-theme-text font-display">
                {t.settings.languageHeading}
              </h3>
            </div>
            <Badge variant="theme" size="sm">
              {meta.script}
            </Badge>
          </div>

          <div className="p-4 rounded-2xl bg-theme-surfaceGlass border border-theme-border space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-theme-text">
                {meta.nativeName} ({meta.name})
              </span>
              <span className="text-xs uppercase font-mono text-emerald-400">Active</span>
            </div>
            <p className="text-xs text-theme-textMuted leading-relaxed">
              {meta.description}
            </p>
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={() => setIsLanguageModalOpen(true)}
            className="w-full gap-2"
          >
            <Globe className="w-4 h-4" />
            <span>Switch from 15 Languages</span>
          </Button>
        </GlassCard>

        {/* Visual Theme Card */}
        <GlassCard variant="default" className="p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-theme-border/60">
            <div className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-theme-accent" />
              <h3 className="text-base font-bold text-theme-text font-display">
                {t.settings.themeHeading}
              </h3>
            </div>
            <Badge variant="neutral" size="sm">
              {theme.region}
            </Badge>
          </div>

          <div className="p-4 rounded-2xl bg-theme-surfaceGlass border border-theme-border space-y-3">
            <div className="flex items-center gap-3">
              {theme.artwork3D?.image3D && (
                <div className="w-14 h-14 rounded-xl overflow-hidden border border-white/20 shrink-0 shadow-sm relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={theme.artwork3D.image3D}
                    alt={theme.artwork3D.monumentTitle}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-theme-text font-display truncate">
                    {theme.name}
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-white/20"
                      style={{ backgroundColor: theme.colors.primary }}
                    />
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-white/20"
                      style={{ backgroundColor: theme.colors.accent }}
                    />
                  </div>
                </div>
                <p className="text-xs text-amber-500 dark:text-amber-400 font-medium truncate mt-0.5">
                  🏛️ {theme.artwork3D?.monumentTitle}
                </p>
                <p className="text-[11px] text-theme-textMuted line-clamp-1 mt-0.5">
                  {theme.tagline}
                </p>
              </div>
            </div>

            {/* 3D Background Intensity Selector */}
            <div className="pt-2 border-t border-theme-border/60 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold text-theme-text">
                <span className="flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-theme-primary" />
                  <span>3D Background Image Visibility</span>
                </span>
                <span className="font-mono text-[10px] uppercase text-theme-primary">
                  {bgIntensity}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(["cinematic", "balanced", "subtle"] as const).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setBgIntensity(level)}
                    className={`py-1.5 px-2 rounded-xl text-xs capitalize transition-all border font-medium ${
                      bgIntensity === level
                        ? "bg-theme-primary text-theme-textInverse border-theme-primary shadow-sm"
                        : "bg-theme-surface text-theme-text border-theme-border hover:bg-theme-surfaceGlassActive"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <Button
            variant="secondary"
            size="md"
            onClick={() => setIsThemeModalOpen(true)}
            className="w-full gap-2"
          >
            <Palette className="w-4 h-4 text-theme-primary" />
            <span>Choose from 15 Cultural Themes</span>
          </Button>
        </GlassCard>

      </div>

      {/* Motion & Accessibility Card */}
      <GlassCard variant="default" className="p-6 space-y-4">
        <div className="flex items-center gap-2 text-base font-bold text-theme-text font-display pb-3 border-b border-theme-border/60">
          <Zap className="w-5 h-5 text-amber-400" />
          <span>{t.settings.motionHeading}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            onClick={() => setMotionPreference("standard")}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              motionPreference === "standard"
                ? "bg-theme-surfaceGlassActive border-theme-primary shadow-glow"
                : "bg-theme-surfaceGlass border-theme-border hover:bg-theme-surfaceGlassActive"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-theme-text">
                {t.settings.motionStandard}
              </span>
              {motionPreference === "standard" && <Check className="w-4 h-4 text-theme-primary" />}
            </div>
            <p className="text-xs text-theme-textMuted mt-1">
              Interactive 3D card tilt, spring popups, audio waves, and celebratory particles.
            </p>
          </div>

          <div
            onClick={() => setMotionPreference("reduced")}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              motionPreference === "reduced"
                ? "bg-theme-surfaceGlassActive border-theme-primary shadow-glow"
                : "bg-theme-surfaceGlass border-theme-border hover:bg-theme-surfaceGlassActive"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-theme-text">
                {t.settings.motionReduced}
              </span>
              {motionPreference === "reduced" && <Check className="w-4 h-4 text-theme-primary" />}
            </div>
            <p className="text-xs text-theme-textMuted mt-1">
              Instant fades, stationary cards, and zero 3D perspective shifts for low motion sensitivity.
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Application Info */}
      <GlassCard variant="default" className="p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-theme-border/60">
          <div className="flex items-center gap-2 text-base font-bold text-theme-text font-display">
            <Sparkles className="w-5 h-5 text-theme-primary" />
            <span>{t.settings.appInfo}</span>
          </div>
          <Badge variant="theme" size="sm">
            v1.0.0
          </Badge>
        </div>

        <p className="text-xs text-theme-textMuted leading-relaxed">
          DocSaathi AI simplifies complex notices, college circulars, and scholarship applications into clear, actionable steps with voice audio briefings and grounded Q&A across 15 Indian languages.
        </p>

        <div className="pt-2 text-xs text-theme-textMuted flex flex-wrap items-center justify-between gap-2 border-t border-theme-border/50">
          <span>{t.settings.version}</span>
          <span className="flex items-center gap-1.5 text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>100% Client-Side Safe & Grounded AI</span>
          </span>
        </div>
      </GlassCard>
    </div>
  );
}
