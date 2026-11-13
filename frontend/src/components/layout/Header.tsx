"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Globe,
  Palette,
  FileText,
  LayoutDashboard,
  Settings,
  Menu,
  X,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  ShieldCheck,
  MapPin,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useAnalysis } from "@/contexts/AnalysisContext";
import { Button } from "../common/Button";
import { Badge } from "../common/Badge";

interface HeaderProps {
  activeTab?: "home" | "upload" | "dashboard" | "settings";
  onTabChange?: (tab: "home" | "upload" | "dashboard" | "settings") => void;
}

export function Header({ activeTab = "home", onTabChange }: HeaderProps) {
  const { t, meta, setIsLanguageModalOpen, isRtl } = useLanguage();
  const { theme, setIsThemeModalOpen } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "home", label: t.nav.home, icon: FileText },
    { id: "upload", label: t.nav.upload, icon: Sparkles },
    { id: "dashboard", label: t.nav.dashboard, icon: LayoutDashboard },
    { id: "settings", label: t.nav.settings, icon: Settings },
  ] as const;

  const handleNavClick = (id: "home" | "upload" | "dashboard" | "settings") => {
    if (onTabChange) onTabChange(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-theme-bg/85 border-b border-theme-border/60 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo & Tagline */}
          <div
            className="flex items-center gap-3.5 cursor-pointer select-none"
            onClick={() => handleNavClick("home")}
          >
            <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-tr from-theme-primary via-theme-accent to-theme-secondary p-[1.5px] shadow-glow flex items-center justify-center">
              <div className="w-full h-full bg-theme-bg rounded-[14px] flex items-center justify-center">
                <span className="font-display font-black text-xl text-theme-primary">
                  सा
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold text-xl sm:text-2xl tracking-tight text-theme-text">
                  DocSaathi<span className="text-theme-primary font-black ml-0.5">AI</span>
                </span>
                <Badge variant="theme" size="sm" className="hidden sm:inline-flex text-[10px]">
                  15 Languages
                </Badge>
              </div>
              <p className="text-[11px] sm:text-xs text-theme-textMuted tracking-tight hidden md:block">
                {t.brand.tagline}
              </p>
            </div>
          </div>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 bg-theme-surfaceGlass border border-theme-border/70 rounded-full px-2 py-1.5 backdrop-blur-md shadow-sm">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 select-none ${
                    isActive
                      ? "bg-theme-primary text-theme-textInverse shadow-sm"
                      : "text-theme-textMuted hover:text-theme-text hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Controls: Language Switcher, Theme Switcher, Realtime AI Status */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Realtime Live AI Engine Status */}
            <div
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 select-none shadow-xs"
              title="Real-Time Django REST API & Gemini Multimodal AI Engine Active"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live AI Engine</span>
            </div>

            {/* Region Selector Pill */}
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('open-onboarding-modal'))}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-theme-surfaceGlass border border-theme-border hover:border-theme-borderGlow text-theme-text text-xs sm:text-sm font-semibold transition-all duration-200 shadow-xs focus:outline-none"
              title="Change your Indian state or language"
            >
              <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="hidden md:inline">Region</span>
            </button>

            {/* Language Selector Pill */}
            <button
              onClick={() => setIsLanguageModalOpen(true)}
              className="flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl bg-theme-surfaceGlass border border-theme-border hover:border-theme-borderGlow text-theme-text text-xs sm:text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-glow focus:outline-none focus:ring-2 focus:ring-theme-primary"
              aria-label="Change language"
            >
              <Globe className="w-4 h-4 text-theme-primary shrink-0" />
              <span>{meta.nativeName}</span>
            </button>

            {/* Regional Theme Selector Pill */}
            <button
              onClick={() => setIsThemeModalOpen(true)}
              className="flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl bg-theme-surfaceGlass border border-theme-border hover:border-theme-borderGlow text-theme-text text-xs sm:text-sm font-semibold transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-theme-primary"
              aria-label="Change visual theme"
            >
              <span
                className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0"
                style={{ backgroundColor: theme.colors.primary }}
              />
              <span className="hidden sm:inline">{theme.name.split("&")[0].split(" ")[0]}</span>
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-theme-textMuted hover:text-theme-text bg-theme-surfaceGlass border border-theme-border rounded-xl"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-theme-border/60 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                    isActive
                      ? "bg-theme-primary text-theme-textInverse"
                      : "text-theme-textMuted hover:text-theme-text hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            <div className="pt-3 border-t border-theme-border/50 flex items-center justify-between px-4 py-2">
              <span className="text-xs text-theme-textMuted">AI Status</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live AI Engine
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
