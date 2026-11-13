"use client";

import React, { useState } from "react";
import { UILanguage } from "@/types";
import { uiTranslations } from "@/data/translations";
import { FileText, Sparkles, Languages, KeyRound, CheckCircle2, Menu, X, ArrowRight } from "lucide-react";

interface NavbarProps {
  uiLang: UILanguage;
  onToggleLang: (lang: UILanguage) => void;
  onOpenApiKeyModal: () => void;
  hasCustomKey: boolean;
  onScrollToUpload: () => void;
  onScrollToSamples: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  uiLang,
  onToggleLang,
  onOpenApiKeyModal,
  hasCustomKey,
  onScrollToUpload,
  onScrollToSamples,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = uiTranslations[uiLang].nav;

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Tagline */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 ring-2 ring-indigo-50">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold tracking-tight text-slate-900 font-display">
                  DocSaathi <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">AI</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                  <Sparkles className="w-3 h-3 mr-1 text-indigo-500" />
                  Hackathon MVP
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden md:block">
                {t.tagline}
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <button
              onClick={onScrollToSamples}
              className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
            >
              {t.samples}
            </button>
            <a
              href="#how-it-works"
              className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
            >
              {t.howItWorks}
            </a>

            {/* Language Selector */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => onToggleLang('en')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  uiLang === 'en'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                English
              </button>
              <button
                onClick={() => onToggleLang('hi')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  uiLang === 'hi'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                हिन्दी
              </button>
            </div>

            {/* Demo Status & API Key Setup */}
            <button
              onClick={onOpenApiKeyModal}
              className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                hasCustomKey
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100'
              }`}
              title="Configure Gemini API Key (Optional)"
            >
              {hasCustomKey ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                  Live Gemini Connected
                </>
              ) : (
                <>
                  <KeyRound className="w-3.5 h-3.5 mr-1.5 text-violet-600" />
                  {t.apiKeyButton}
                </>
              )}
            </button>

            {/* Action CTA */}
            <button
              onClick={onScrollToUpload}
              className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-indigo-600/20 transition-all hover:shadow-indigo-600/30 active:scale-95"
            >
              Upload Document
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2 lg:hidden">
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                onClick={() => onToggleLang('en')}
                className={`px-2 py-1 rounded text-xs font-semibold ${
                  uiLang === 'en' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => onToggleLang('hi')}
                className={`px-2 py-1 rounded text-xs font-semibold ${
                  uiLang === 'hi' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
                }`}
              >
                हि
              </button>
            </div>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-4 shadow-lg animate-in slide-in-from-top duration-200">
          <div className="text-xs text-slate-500 font-medium px-2">
            {t.tagline}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                onScrollToSamples();
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 border border-slate-200"
            >
              {t.samples}
            </button>
            <button
              onClick={() => {
                onOpenApiKeyModal();
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 rounded-lg text-sm font-medium text-violet-700 bg-violet-50 border border-violet-200"
            >
              {hasCustomKey ? "Live Key Configured" : t.apiKeyButton}
            </button>
          </div>
          <button
            onClick={() => {
              onScrollToUpload();
              setMobileMenuOpen(false);
            }}
            className="w-full py-2.5 rounded-xl text-center text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md shadow-indigo-600/20"
          >
            Upload Document Now
          </button>
        </div>
      )}
    </header>
  );
};
