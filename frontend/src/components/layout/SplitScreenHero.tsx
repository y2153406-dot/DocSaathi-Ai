"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  FileUp,
  Sparkles,
  CheckCircle2,
  Volume2,
  MessageSquare,
  ArrowRight,
  ShieldAlert,
  Calendar,
  Layers,
  ChevronRight,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useAnalysis } from "@/contexts/AnalysisContext";
import { Button } from "../common/Button";
import { Badge } from "../common/Badge";
import { GlassCard } from "../common/GlassCard";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface SplitScreenHeroProps {
  onStartUpload: () => void;
  onExploreSample: () => void;
}

export function SplitScreenHero({ onStartUpload, onExploreSample }: SplitScreenHeroProps) {
  const { t, meta } = useLanguage();
  const { theme } = useTheme();
  const prefersReduced = useReducedMotion();

  const heroStats = [
    { label: t.hero.featureBullet1, icon: Layers },
    { label: t.hero.featureBullet2, icon: CheckCircle2 },
    { label: t.hero.featureBullet3, icon: Volume2 },
    { label: t.hero.featureBullet4, icon: MessageSquare },
  ];

  return (
    <section className="relative overflow-hidden py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-7 space-y-8 text-left">
            <motion.div
              initial={prefersReduced ? {} : { opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex"
            >
              <Badge variant="theme" size="md" icon={<Sparkles className="w-3.5 h-3.5" />}>
                {t.hero.badge}
              </Badge>
            </motion.div>

            {/* Editorial Title */}
            <motion.h1
              initial={prefersReduced ? {} : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black font-display text-theme-text leading-[1.12] tracking-tight"
            >
              <span>{t.hero.titlePart1} </span>
              <span className="text-theme-primary font-black">
                {t.hero.titleHighlight}
              </span>
              <br />
              <span className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-theme-textMuted">
                {t.hero.titlePart2}
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={prefersReduced ? {} : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-theme-textMuted max-w-2xl leading-relaxed"
            >
              {t.hero.subtitle}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={prefersReduced ? {} : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2"
            >
              <Button
                variant="primary"
                size="lg"
                onClick={onStartUpload}
                className="gap-3 shadow-glow"
              >
                <FileUp className="w-5 h-5" />
                <span>{t.hero.primaryCta}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>

              <Button
                variant="secondary"
                size="lg"
                onClick={onExploreSample}
                className="gap-2.5"
              >
                <Sparkles className="w-4 h-4 text-theme-primary" />
                <span>{t.hero.secondaryCta}</span>
              </Button>
            </motion.div>

            {/* 4 Feature Badges */}
            <motion.div
              initial={prefersReduced ? {} : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-theme-border/60"
            >
              {heroStats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div key={i} className="flex items-center gap-2 text-xs text-theme-text font-medium">
                    <span className="p-1.5 rounded-lg bg-theme-primary/10 text-theme-primary shrink-0">
                      <Icon className="w-3.5 h-3.5" />
                    </span>
                    <span className="line-clamp-2">{stat.label}</span>
                  </div>
                );
              })}
            </motion.div>
          </div>

          {/* Right Column: Real-Time Multimodal AI Intelligence Station */}
          <div className="lg:col-span-5 relative" style={{ perspective: 1200 }}>
            {/* Background Ambient Glow */}
            <div
              className="absolute -inset-4 rounded-3xl blur-2xl opacity-25 pointer-events-none"
              style={{ backgroundColor: theme.colors.primary }}
            />

            <motion.div
              initial={prefersReduced ? {} : { opacity: 0, scale: 0.96, rotateY: 8 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 0.8, type: "spring", stiffness: 200 }}
              className="relative space-y-4"
            >
              {/* Interactive Live Scanner & Architecture Hub Card */}
              <GlassCard
                variant="elevated"
                className="p-6 sm:p-7 relative overflow-hidden border border-theme-borderGlow"
                is3DTilt={true}
              >
                {/* 3D Cultural Watermark Background Texture */}
                {theme.artwork3D?.image3D && (
                  <div className="absolute -right-10 -bottom-10 w-52 h-52 rounded-full overflow-hidden opacity-10 pointer-events-none filter blur-[0.5px]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={theme.artwork3D.image3D}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Top Status Header: Live Engine Connection */}
                <div className="flex items-center justify-between pb-4 border-b border-theme-border/60">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                      LIVE AI ENGINE ACTIVE
                    </span>
                  </div>
                  <Badge variant="theme" size="sm" className="text-[10px] font-mono">
                    Gemini 3.5 + Django
                  </Badge>
                </div>

                {/* Animated Scanner Visualizer Frame */}
                <div className="mt-4 p-4 rounded-2xl bg-theme-surfaceGlass border border-theme-border/80 relative overflow-hidden space-y-3">
                  {/* Subtle Scanning Beam */}
                  <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-theme-primary to-transparent animate-pulse pointer-events-none opacity-80" />

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-theme-text font-display flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-theme-primary" />
                      <span>Document Intelligence Pipeline</span>
                    </span>
                    <span className="text-[10px] text-theme-textMuted font-mono">Real-Time OCR</span>
                  </div>

                  {/* 4 Core Pillars of DocSaathi */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="p-2.5 rounded-xl bg-theme-surface/70 border border-theme-border/60 text-left">
                      <span className="text-sm">🌐</span>
                      <div className="text-xs font-bold text-theme-text mt-1">15 Indian Languages</div>
                      <div className="text-[10px] text-theme-textMuted line-clamp-1">Regional explanations</div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-theme-surface/70 border border-theme-border/60 text-left">
                      <span className="text-sm">📋</span>
                      <div className="text-xs font-bold text-theme-text mt-1">Action Checklist</div>
                      <div className="text-[10px] text-theme-textMuted line-clamp-1">Deadlines & DB tracking</div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-theme-surface/70 border border-theme-border/60 text-left">
                      <span className="text-sm">🔊</span>
                      <div className="text-xs font-bold text-theme-text mt-1">Audio Briefings</div>
                      <div className="text-[10px] text-theme-textMuted line-clamp-1">Native voice summary</div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-theme-surface/70 border border-theme-border/60 text-left">
                      <span className="text-sm">💬</span>
                      <div className="text-xs font-bold text-theme-text mt-1">Grounded Q&A</div>
                      <div className="text-[10px] text-theme-textMuted line-clamp-1">Zero hallucinations</div>
                    </div>
                  </div>

                  {/* Quick Action Trigger Button */}
                  <div className="pt-2">
                    <button
                      onClick={onStartUpload}
                      className="w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 text-theme-textInverse shadow-sm hover:opacity-95 transition-all"
                      style={{ backgroundColor: theme.colors.primary }}
                    >
                      <FileUp className="w-4 h-4" />
                      <span>Upload Any Notice to Analyze Live</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
