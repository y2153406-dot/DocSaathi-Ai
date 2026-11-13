"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SplitScreenHero } from "@/components/layout/SplitScreenHero";
import { DocumentUpload } from "@/features/upload/DocumentUpload";
import { AnalysisDashboard } from "@/features/analysis/AnalysisDashboard";
import { RecentDocuments } from "@/features/dashboard/RecentDocuments";
import { SettingsView } from "@/features/dashboard/SettingsView";
import { useAnalysis } from "@/contexts/AnalysisContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { MOCK_NOTICES } from "@/lib/mockService";
import { GlassCard } from "@/components/common/GlassCard";
import { Button } from "@/components/common/Button";
import {
  Sparkles,
  FileText,
  CheckCircle2,
  Volume2,
  MessageSquare,
  ArrowRight,
  Layers,
  Upload,
} from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"home" | "upload" | "dashboard" | "settings" | "results">("home");
  const { analysis, loadPresetNotice } = useAnalysis();
  const { t } = useLanguage();

  const handleStartUpload = () => {
    setActiveTab("upload");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleExploreSample = () => {
    setActiveTab("dashboard");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAnalysisComplete = () => {
    setActiveTab("results");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex-1 flex flex-col justify-between">
      {/* Sticky Header with Navigation, Language, Theme, & Demo Toggles */}
      <Header
        activeTab={activeTab === "results" ? "upload" : activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
        {/* TAB 1: Home / Welcome Page */}
        {activeTab === "home" && (
          <div className="space-y-16">
            {/* Split Screen Hero with 3D Depth Visuals */}
            <SplitScreenHero
              onStartUpload={handleStartUpload}
              onExploreSample={handleExploreSample}
            />

            {/* If analysis already exists in session, show quick-access banner */}
            {analysis && (
              <div className="max-w-4xl mx-auto">
                <GlassCard
                  variant="interactive"
                  className="p-5 flex items-center justify-between gap-4 border border-emerald-500/40"
                  onClick={() => setActiveTab("results")}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                        Active Analysis Ready
                      </div>
                      <div className="text-sm font-bold text-theme-text font-display">
                        {analysis.title || analysis.documentType}
                      </div>
                    </div>
                  </div>
                  <Button variant="secondary" size="sm" className="gap-1.5 shrink-0">
                    <span>View Results</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </GlassCard>
              </div>
            )}

            {/* Features Highlight Section */}
            <section className="max-w-7xl mx-auto space-y-8 text-center py-6">
              <div className="space-y-2 max-w-2xl mx-auto">
                <span className="text-xs font-bold uppercase tracking-wider text-theme-primary">
                  Built for Bharat
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-theme-text font-display">
                  Everything You Need to Take Action
                </h3>
                <p className="text-xs sm:text-sm text-theme-textMuted leading-relaxed">
                  Complex government and educational documents are distilled into four clear, actionable pillars.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
                {/* Feature 1 */}
                <GlassCard variant="default" className="p-6 space-y-3" is3DTilt={true}>
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
                    <Layers className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-theme-text font-display">
                    15 Indian Languages & Regional Themes
                  </h4>
                  <p className="text-xs text-theme-textMuted leading-relaxed">
                    Read and listen in Hindi, Gujarati, Marathi, Tamil, Telugu, Urdu (RTL), Bengali, and more with authentic cultural visual identities.
                  </p>
                </GlassCard>

                {/* Feature 2 */}
                <GlassCard variant="default" className="p-6 space-y-3" is3DTilt={true}>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-theme-text font-display">
                    Smart Action Checklist
                  </h4>
                  <p className="text-xs text-theme-textMuted leading-relaxed">
                    AI automatically extracts mandatory steps, filing deadlines, and prerequisites into an interactive task tracker with progress counting.
                  </p>
                </GlassCard>

                {/* Feature 3 */}
                <GlassCard variant="default" className="p-6 space-y-3" is3DTilt={true}>
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                    <Volume2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-theme-text font-display">
                    Voice Audio Briefing
                  </h4>
                  <p className="text-xs text-theme-textMuted leading-relaxed">
                    Listen to a 60-second spoken summary using the browser’s Web Speech synthesizer, with live animated equalizer waveform and speed controls.
                  </p>
                </GlassCard>

                {/* Feature 4 */}
                <GlassCard variant="default" className="p-6 space-y-3" is3DTilt={true}>
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/15 text-purple-400 border border-purple-500/30 flex items-center justify-center">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-theme-text font-display">
                    Context-Grounded Q&A
                  </h4>
                  <p className="text-xs text-theme-textMuted leading-relaxed">
                    Ask doubts about eligibility, income thresholds, or required documents with zero hallucinations — answers are strictly grounded in notice text.
                  </p>
                </GlassCard>
              </div>
            </section>

            {/* Bottom Callout Banner */}
            <section className="max-w-5xl mx-auto">
              <GlassCard
                variant="elevated"
                className="p-8 sm:p-12 text-center space-y-6 relative overflow-hidden border border-theme-borderGlow"
              >
                <div className="space-y-2 max-w-xl mx-auto">
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-theme-text font-display">
                    Ready to Understand Your Notice?
                  </h3>
                  <p className="text-xs sm:text-sm text-theme-textMuted">
                    Upload your college circular, scholarship brochure, or government notification now.
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-4">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleStartUpload}
                    className="gap-2 shadow-glow"
                  >
                    <Upload className="w-5 h-5" />
                    <span>Upload Document File</span>
                  </Button>

                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={handleExploreSample}
                    className="gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-theme-primary" />
                    <span>Try Sample Notice</span>
                  </Button>
                </div>
              </GlassCard>
            </section>
          </div>
        )}

        {/* TAB 2: Upload Document */}
        {activeTab === "upload" && (
          <div className="py-6">
            <DocumentUpload onAnalysisComplete={handleAnalysisComplete} />
          </div>
        )}

        {/* TAB 3: Results Dashboard */}
        {activeTab === "results" && (
          <div className="py-6">
            {analysis ? (
              <AnalysisDashboard />
            ) : (
              <div className="max-w-md mx-auto text-center py-16 space-y-4">
                <FileText className="w-14 h-14 text-theme-textMuted mx-auto opacity-50" />
                <h3 className="text-lg font-bold text-theme-text font-display">
                  No Document Analyzed Yet
                </h3>
                <p className="text-xs text-theme-textMuted">
                  Please upload a notice or choose a preloaded sample notice to view the 10-section analysis.
                </p>
                <div className="pt-2 flex justify-center gap-3">
                  <Button variant="primary" size="md" onClick={() => setActiveTab("upload")}>
                    Upload Notice
                  </Button>
                  <Button variant="secondary" size="md" onClick={handleExploreSample}>
                    Load Sample
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: Dashboard */}
        {activeTab === "dashboard" && (
          <RecentDocuments
            onNavigateToUpload={() => setActiveTab("upload")}
            onNavigateToResults={() => setActiveTab("results")}
          />
        )}

        {/* TAB 5: Settings */}
        {activeTab === "settings" && <SettingsView />}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
