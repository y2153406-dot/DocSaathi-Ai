"use client";

import React from "react";
import { UILanguage } from "@/types";
import { uiTranslations } from "@/data/translations";
import { Sparkles, ArrowRight, ShieldCheck, Zap, Volume2, CheckCircle, FileCheck2, GraduationCap, Briefcase, Landmark, BookOpen } from "lucide-react";

interface HeroProps {
  uiLang: UILanguage;
  onScrollToUpload: () => void;
  onSelectSamplePreset: (presetId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  uiLang,
  onScrollToUpload,
  onSelectSamplePreset,
}) => {
  const t = uiTranslations[uiLang].hero;

  return (
    <div className="relative overflow-hidden pt-8 pb-14 lg:pt-16 lg:pb-20 bg-gradient-to-b from-indigo-50/50 via-white to-white">
      {/* Decorative gradient blur spheres */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-blue-400/15 via-indigo-400/20 to-violet-400/15 blur-3xl -z-10 rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 shadow-xs">
            <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
            <span className="text-xs sm:text-sm font-semibold text-indigo-900 tracking-wide">
              {t.badge}
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] font-display">
            {t.titleMain}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-600 to-violet-600 underline decoration-indigo-200 decoration-wavy decoration-2">
              {t.titleHighlight}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto">
            {t.subtitle}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={onScrollToUpload}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-700 hover:from-blue-700 hover:to-violet-800 shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Zap className="w-5 h-5 mr-2 text-yellow-300" />
              {t.ctaButton}
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
            <a
              href="#sample-section"
              className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-3.5 rounded-xl text-base font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-xs hover:border-slate-300 transition-all"
            >
              <BookOpen className="w-5 h-5 mr-2 text-indigo-600" />
              {t.trySampleButton}
            </a>
          </div>

          {/* Value Props Pills */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 pt-6 text-xs sm:text-sm">
            <div className="flex items-center justify-center space-x-2 py-2 px-3 rounded-xl bg-white border border-slate-200/80 shadow-xs text-slate-700 font-medium">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{t.stat1}</span>
            </div>
            <div className="flex items-center justify-center space-x-2 py-2 px-3 rounded-xl bg-white border border-slate-200/80 shadow-xs text-slate-700 font-medium">
              <Zap className="w-4 h-4 text-indigo-500 shrink-0" />
              <span>{t.stat2}</span>
            </div>
            <div className="flex items-center justify-center space-x-2 py-2 px-3 rounded-xl bg-white border border-slate-200/80 shadow-xs text-slate-700 font-medium">
              <Volume2 className="w-4 h-4 text-violet-500 shrink-0" />
              <span>{t.stat3}</span>
            </div>
            <div className="flex items-center justify-center space-x-2 py-2 px-3 rounded-xl bg-white border border-slate-200/80 shadow-xs text-slate-700 font-medium">
              <ShieldCheck className="w-4 h-4 text-blue-500 shrink-0" />
              <span>{t.stat4}</span>
            </div>
          </div>
        </div>

        {/* Quick Demo Preloads Bar */}
        <div id="sample-section" className="mt-12 max-w-4xl mx-auto bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-slate-100 gap-2">
            <div className="flex items-center space-x-2">
              <FileCheck2 className="w-5 h-5 text-indigo-600" />
              <span className="text-sm font-semibold text-slate-900">
                ⚡ {uiLang === 'hi' ? 'सीधे सैंपल नोटिस से टेस्ट करें:' : 'Try instant test with realistic Indian notices:'}
              </span>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              {uiLang === 'hi' ? 'क्लिक करते ही विश्लेषण शुरू करें' : '1-click to auto-fill and explore'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            <button
              onClick={() => onSelectSamplePreset("scholarship-nsp")}
              className="group text-left p-2.5 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 transition-all flex items-start space-x-2.5"
            >
              <div className="p-2 rounded-lg bg-blue-100 text-blue-700 group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-900 truncate">NSP Scholarship 2026</p>
                <p className="text-[11px] text-slate-500 truncate">₹50k grant for students</p>
              </div>
            </button>

            <button
              onClick={() => onSelectSamplePreset("job-ssc")}
              className="group text-left p-2.5 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 transition-all flex items-start space-x-2.5"
            >
              <div className="p-2 rounded-lg bg-amber-100 text-amber-700 group-hover:bg-amber-600 group-hover:text-white transition-colors shrink-0">
                <Briefcase className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-900 truncate">SSC CGL 2026</p>
                <p className="text-[11px] text-slate-500 truncate">14,800+ Officer Posts</p>
              </div>
            </button>

            <button
              onClick={() => onSelectSamplePreset("college-exam")}
              className="group text-left p-2.5 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 transition-all flex items-start space-x-2.5"
            >
              <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors shrink-0">
                <BookOpen className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-900 truncate">University Exam Circular</p>
                <p className="text-[11px] text-slate-500 truncate">Backlog fee & 75% rule</p>
              </div>
            </button>

            <button
              onClick={() => onSelectSamplePreset("govt-pmkisan")}
              className="group text-left p-2.5 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 transition-all flex items-start space-x-2.5"
            >
              <div className="p-2 rounded-lg bg-purple-100 text-purple-700 group-hover:bg-purple-600 group-hover:text-white transition-colors shrink-0">
                <Landmark className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-900 truncate">PM Kisan e-KYC</p>
                <p className="text-[11px] text-slate-500 truncate">₹2,000 Installment rule</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
