"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AnalysisDashboard } from "@/features/analysis/AnalysisDashboard";
import { useAnalysis } from "@/contexts/AnalysisContext";
import { GlassCard } from "@/components/common/GlassCard";
import { Button } from "@/components/common/Button";
import { Badge } from "@/components/common/Badge";
import {
  ArrowLeft,
  FileText,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

export default function DocumentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const docId = params?.id as string;
  const { analysis, loadDocument, isAnalyzing, analysisError } = useAnalysis();
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    if (docId) {
      loadDocument(docId).finally(() => {
        setInitialLoading(false);
      });
    }
  }, [docId]);

  return (
    <div className="flex-1 flex flex-col justify-between min-h-screen">
      {/* Header */}
      <Header activeTab="dashboard" onTabChange={() => router.push("/")} />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto w-full">
        {/* Navigation Breadcrumb Bar */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/")}
            className="gap-2 text-theme-textMuted hover:text-theme-text"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Button>

          {analysis && (
            <div className="flex items-center gap-2">
              <Badge variant="neutral" size="sm" className="font-mono text-[11px]">
                ID: {analysis.documentId}
              </Badge>
              {analysis.language && (
                <Badge variant="primary" size="sm" className="uppercase text-[11px]">
                  Lang: {analysis.language}
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Loading State */}
        {(initialLoading || isAnalyzing) && (
          <div className="py-24 text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-theme-primary/10 border border-theme-primary/30 flex items-center justify-center text-theme-primary mx-auto animate-pulse">
              <FileText className="w-8 h-8 animate-bounce" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-theme-text font-display">
                Loading Document Analysis...
              </h3>
              <p className="text-xs text-theme-textMuted max-w-md mx-auto">
                Retrieving verified analysis, persisted action checklist, and grounded Q&A history from the secure database.
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {!initialLoading && !isAnalyzing && analysisError && (
          <div className="max-w-lg mx-auto py-16">
            <GlassCard variant="default" className="p-8 text-center space-y-5 border border-red-500/30">
              <div className="w-14 h-14 rounded-2xl bg-red-500/15 text-red-400 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-theme-text font-display">
                  Unable to Load Document
                </h3>
                <p className="text-xs text-theme-textMuted leading-relaxed">
                  {analysisError.message || "This document could not be retrieved from the database."}
                </p>
              </div>
              <div className="pt-2 flex justify-center gap-3">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => loadDocument(docId)}
                  className="gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Retry Loading</span>
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => router.push("/")}
                >
                  Return to Dashboard
                </Button>
              </div>
            </GlassCard>
          </div>
        )}

        {/* Loaded Document Analysis */}
        {!initialLoading && !isAnalyzing && analysis && (
          <div className="space-y-6">
            <AnalysisDashboard />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
