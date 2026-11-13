"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Globe2,
  Search,
  Check,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Languages,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { SupportedLanguage } from "@/types/api";
import { SUPPORTED_LANGUAGES } from "@/lib/i18n";

export const INDIAN_REGIONS = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Delhi (NCT)",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu & Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Chandigarh",
  "Puducherry",
];

const ONBOARDING_KEY = "docsaathi_onboarding_completed";
const REGION_STORAGE_KEY = "docsaathi_preferred_region";

export function FirstTimeOnboardingModal() {
  const { language, setLanguage } = useLanguage();
  const { applyThemeForLanguage } = useTheme();

  const [isOpen, setIsOpen] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  const [selectedRegion, setSelectedRegion] = useState<string>("Delhi (NCT)");
  const [selectedLang, setSelectedLang] = useState<SupportedLanguage>(language || "en");

  const [regionSearch, setRegionSearch] = useState("");
  const [langSearch, setLangSearch] = useState("");
  const [step, setStep] = useState<"region" | "language">("region");

  useEffect(() => {
    try {
      const completed = localStorage.getItem(ONBOARDING_KEY);
      const storedRegion = localStorage.getItem(REGION_STORAGE_KEY);
      if (storedRegion) {
        setSelectedRegion(storedRegion);
      }
      if (!completed) {
        setIsOpen(true);
      }
    } catch {
      // In restricted environments, do not block
    }
    setHasChecked(true);
  }, []);

  // Listen to custom event to reopen from settings or header
  useEffect(() => {
    const handleReopen = () => {
      setStep("region");
      setIsOpen(true);
    };
    window.addEventListener("open-onboarding-modal", handleReopen);
    return () => window.removeEventListener("open-onboarding-modal", handleReopen);
  }, []);

  if (!hasChecked || !isOpen) return null;

  const filteredRegions = INDIAN_REGIONS.filter((r) =>
    r.toLowerCase().includes(regionSearch.toLowerCase())
  );

  const filteredLanguages = SUPPORTED_LANGUAGES.filter(
    (l) =>
      l.name.toLowerCase().includes(langSearch.toLowerCase()) ||
      l.nativeName.toLowerCase().includes(langSearch.toLowerCase())
  );

  const handleComplete = () => {
    try {
      localStorage.setItem(ONBOARDING_KEY, "true");
      localStorage.setItem(REGION_STORAGE_KEY, selectedRegion);
    } catch {
      // Ignore
    }
    // Apply selected language and matching default regional theme
    setLanguage(selectedLang, { autoTheme: true });
    applyThemeForLanguage(selectedLang);
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/40 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto"
        >
          {/* Top Decorative Warm Accent Banner */}
          <div className="h-2.5 w-full bg-gradient-to-r from-amber-500 via-orange-500 to-indigo-600" />

          {/* Modal Header */}
          <div className="p-6 sm:p-8 text-center space-y-2 border-b border-slate-100 bg-gradient-to-b from-amber-50/40 to-transparent">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Namaste! Welcome to DocSaathi AI</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
              {step === "region" ? "Choose Your Region" : "Choose Your Preferred Language"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
              {step === "region"
                ? "Select your state or union territory to personalize local schemes and notices."
                : "Select the language you want documents explained in. Region and language are independent."}
            </p>

            {/* Stepper Dots */}
            <div className="flex items-center justify-center gap-3 pt-3">
              <button
                type="button"
                onClick={() => setStep("region")}
                className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full transition-all ${
                  step === "region"
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>1. Region ({selectedRegion})</span>
              </button>

              <ArrowRight className="w-3 h-3 text-slate-400" />

              <button
                type="button"
                onClick={() => setStep("language")}
                className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full transition-all ${
                  step === "language"
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <Globe2 className="w-3.5 h-3.5" />
                <span>2. Language</span>
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6 sm:p-8 space-y-4">
            {/* STEP 1: REGION SELECTION */}
            {step === "region" && (
              <div className="space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={regionSearch}
                    onChange={(e) => setRegionSearch(e.target.value)}
                    placeholder="Search Indian states or territories..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                  />
                </div>

                {/* Region Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[260px] overflow-y-auto pr-1">
                  {filteredRegions.map((region) => {
                    const isSelected = selectedRegion === region;
                    return (
                      <button
                        key={region}
                        type="button"
                        onClick={() => setSelectedRegion(region)}
                        className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                          isSelected
                            ? "bg-amber-500/10 border-amber-500 text-amber-950 font-bold shadow-xs"
                            : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 text-xs font-medium"
                        }`}
                      >
                        <span className="line-clamp-1">{region}</span>
                        {isSelected && (
                          <Check className="w-4 h-4 text-amber-600 shrink-0 ml-1.5" />
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                  <span className="text-xs text-slate-500">
                    Selected: <strong className="text-slate-900">{selectedRegion}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => setStep("language")}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-sm transition-all"
                  >
                    <span>Next: Select Language</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: LANGUAGE SELECTION */}
            {step === "language" && (
              <div className="space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={langSearch}
                    onChange={(e) => setLangSearch(e.target.value)}
                    placeholder="Search 15 Indian languages..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                  />
                </div>

                {/* Languages Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[260px] overflow-y-auto pr-1">
                  {filteredLanguages.map((lang) => {
                    const isSelected = selectedLang === lang.code;
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => setSelectedLang(lang.code)}
                        className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                          isSelected
                            ? "bg-indigo-50 border-indigo-600 text-indigo-950 shadow-xs"
                            : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-base font-bold font-display text-slate-900">
                            {lang.nativeName}
                          </span>
                          {isSelected && (
                            <Check className="w-4 h-4 text-indigo-600 shrink-0 ml-1.5" />
                          )}
                        </div>
                        <span className="text-xs text-slate-500 mt-0.5">
                          {lang.name} {lang.direction === "rtl" ? "• RTL" : ""}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Independent Choice Disclaimer */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2 text-xs text-slate-600">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Your preferred theme will automatically match <strong>{SUPPORTED_LANGUAGES.find(l => l.code === selectedLang)?.name}</strong>. You can change themes anytime.
                  </span>
                </div>

                {/* Footer Buttons */}
                <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setStep("region")}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900"
                  >
                    ← Back to Region
                  </button>

                  <button
                    type="button"
                    onClick={handleComplete}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-indigo-600 hover:from-amber-700 hover:to-indigo-700 text-white font-bold text-sm shadow-md transition-all"
                  >
                    <span>Continue to DocSaathi AI</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
