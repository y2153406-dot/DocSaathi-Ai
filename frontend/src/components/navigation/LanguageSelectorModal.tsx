"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Globe, Sparkles, ArrowRight } from "lucide-react";
import { Modal } from "../common/Modal";
import { Button } from "../common/Button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { SupportedLanguage } from "@/types/api";
import { getThemeForLanguage } from "@/lib/themes";
import { ThemePreviewCard3D } from "../themes/ThemePreviewCard3D";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function LanguageSelectorModal() {
  const {
    language,
    setLanguage,
    supportedLanguages,
    isLanguageModalOpen,
    setIsLanguageModalOpen,
    t,
  } = useLanguage();
  const { applyThemeForLanguage } = useTheme();
  const prefersReduced = useReducedMotion();

  const [selectedLang, setSelectedLang] = useState<SupportedLanguage>(language);
  const [showThemePreviewPopup, setShowThemePreviewPopup] = useState(false);

  const handleSelectLanguage = (code: SupportedLanguage) => {
    setSelectedLang(code);
    setLanguage(code, { autoTheme: true });
    applyThemeForLanguage(code);
    setShowThemePreviewPopup(true);
  };

  const handleConfirmAndClose = () => {
    setLanguage(selectedLang, { autoTheme: true });
    applyThemeForLanguage(selectedLang);
    setIsLanguageModalOpen(false);
    setShowThemePreviewPopup(false);
  };

  const mappedTheme = getThemeForLanguage(selectedLang);

  return (
    <>
      <Modal
        isOpen={isLanguageModalOpen}
        onClose={() => setIsLanguageModalOpen(false)}
        maxWidth="4xl"
        title={t.settings.languageHeading}
        description="Choose your preferred regional language. DocSaathi AI will automatically adapt the visual identity and font typography."
      >
        <div className="space-y-6">
          {/* 15 Languages Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 max-h-[55vh] overflow-y-auto p-1">
            {supportedLanguages.map((langMeta) => {
              const isSelected = selectedLang === langMeta.code;
              const theme = getThemeForLanguage(langMeta.code);

              return (
                <motion.div
                  key={langMeta.code}
                  whileHover={prefersReduced ? {} : { y: -2, scale: 1.01 }}
                  whileTap={prefersReduced ? {} : { scale: 0.99 }}
                  onClick={() => handleSelectLanguage(langMeta.code)}
                  className={`relative cursor-pointer p-4 rounded-2xl border transition-all duration-200 text-left select-none ${
                    isSelected
                      ? "bg-theme-surfaceGlassActive border-theme-primary shadow-glow ring-2 ring-theme-primary/30"
                      : "bg-theme-surfaceGlass border-theme-border hover:border-theme-borderGlow hover:bg-theme-surfaceGlassActive"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-base font-bold text-theme-text font-display">
                          {langMeta.nativeName}
                        </span>
                        <span className="text-xs text-theme-textMuted">
                          ({langMeta.name})
                        </span>
                      </div>
                      <span className="text-[11px] font-medium text-theme-primary block mt-0.5">
                        {langMeta.region}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Theme color swatch indicator */}
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0"
                        style={{ backgroundColor: theme.colors.primary }}
                        title={`Default theme: ${theme.name}`}
                      />
                      {isSelected && (
                        <span className="w-5 h-5 rounded-full bg-theme-primary text-theme-textInverse flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-theme-textMuted mt-2 line-clamp-2 leading-relaxed">
                    {langMeta.description}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-theme-border/50 flex items-center justify-between text-[11px] text-theme-textMuted">
                    <span>Theme: {theme.name}</span>
                    <span className="uppercase font-mono text-[10px] opacity-75">
                      {langMeta.direction.toUpperCase()}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom Bar: Selection Confirmation & Continue */}
          <div className="pt-4 border-t border-theme-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span
                className="w-4 h-4 rounded-full border border-white/30"
                style={{ backgroundColor: mappedTheme.colors.primary }}
              />
              <span className="text-sm text-theme-text">
                Selected: <strong className="text-theme-primary">{mappedTheme.nativeName}</strong> ({mappedTheme.name})
              </span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button
                variant="secondary"
                size="md"
                onClick={() => setIsLanguageModalOpen(false)}
                className="w-full sm:w-auto"
              >
                {t.common.cancel}
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={handleConfirmAndClose}
                className="w-full sm:w-auto gap-2"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Floating 3D Theme Preview Popup triggered when language selected */}
      <AnimatePresence>
        {showThemePreviewPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="pointer-events-auto w-full max-w-md"
            >
              <ThemePreviewCard3D
                themeConfig={mappedTheme}
                isActive={true}
                isFloatingPopup={true}
                onClose={() => setShowThemePreviewPopup(false)}
                onApply={() => {
                  setShowThemePreviewPopup(false);
                  setIsLanguageModalOpen(false);
                }}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
