"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  Upload,
  Clock,
  Sparkles,
  ArrowRight,
  FolderOpen,
  Trash2,
  CheckCircle,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  FileCheck2,
  Volume2,
  Calendar,
  MessageSquare,
  Layers,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAnalysis, SavedDocSummary } from "@/contexts/AnalysisContext";
import { GlassCard } from "@/components/common/GlassCard";
import { Button } from "@/components/common/Button";
import { Badge } from "@/components/common/Badge";

interface RecentDocumentsProps {
  onNavigateToUpload: () => void;
  onNavigateToResults: () => void;
}

export function RecentDocuments({
  onNavigateToUpload,
  onNavigateToResults,
}: RecentDocumentsProps) {
  const router = useRouter();
  const { t, meta } = useLanguage();
  const {
    savedDocuments,
    loadDocument,
    deleteDocument,
    refreshDocumentsList,
    analysis,
    completedTasks,
    toggleTask,
    completedTasksCount,
    totalTasksCount,
    isAnalyzing,
  } = useAnalysis();

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);

  // Auto-select the first real document from SQLite DB if nothing is active
  useEffect(() => {
    if (!analysis && savedDocuments.length > 0 && !selectedDocId) {
      const firstDoc = savedDocuments[0];
      setSelectedDocId(firstDoc.documentId);
      loadDocument(firstDoc.documentId);
    } else if (analysis) {
      setSelectedDocId(analysis.documentId);
    }
  }, [analysis, savedDocuments, selectedDocId, loadDocument]);

  const handleSelectDoc = (docId: string) => {
    setSelectedDocId(docId);
    loadDocument(docId);
  };

  const handleOpenFullAnalysis = (docId: string) => {
    loadDocument(docId).then(() => {
      onNavigateToResults();
    });
  };

  const handleDelete = async (e: React.MouseEvent, docId: string) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this document and its analysis records?")) {
      setDeletingId(docId);
      try {
        await deleteDocument(docId);
        if (selectedDocId === docId) {
          setSelectedDocId(null);
        }
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 py-6">
      {/* Top Header Banner */}
      <GlassCard variant="elevated" className="p-6 sm:p-8 space-y-4 border border-theme-borderGlow">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-theme-primary uppercase tracking-wider">
                {t.dashboard.greeting}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live SQLite Connected
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-theme-text font-display">
              {t.dashboard.welcome}
            </h2>
            <p className="text-xs sm:text-sm text-theme-textMuted max-w-xl">
              Track simplified circulars, monitor pending action checklist deadlines, or analyze a fresh notice.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={refreshDocumentsList}
              className="gap-1.5 text-xs text-theme-textMuted"
              title="Refresh document list from database"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh</span>
            </Button>

            <Button
              variant="primary"
              size="md"
              onClick={onNavigateToUpload}
              className="gap-2 shrink-0 shadow-glow"
            >
              <Upload className="w-4 h-4" />
              <span>{t.dashboard.uploadNew}</span>
            </Button>
          </div>
        </div>

        {/* Quick Stat Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-theme-border/60">
          <div className="p-3.5 rounded-2xl bg-theme-surfaceGlass border border-theme-border">
            <span className="text-[11px] text-theme-textMuted block">Active Language</span>
            <span className="text-base font-bold text-theme-text font-display mt-0.5 block">
              {meta.nativeName}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-theme-surfaceGlass border border-theme-border">
            <span className="text-[11px] text-theme-textMuted block">{t.dashboard.totalProcessed}</span>
            <span className="text-base font-bold text-theme-primary font-mono mt-0.5 block">
              {savedDocuments.length}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-theme-surfaceGlass border border-theme-border col-span-2 sm:col-span-1">
            <span className="text-[11px] text-theme-textMuted block">{t.dashboard.tasksPending}</span>
            <span className="text-base font-bold text-amber-500 font-mono mt-0.5 block">
              {totalTasksCount - completedTasksCount > 0
                ? `${totalTasksCount - completedTasksCount} Tasks Pending`
                : "All Done"}
            </span>
          </div>
        </div>
      </GlassCard>

      {/* ============================================================= */}
      {/* REAL-TIME SELECTED DOCUMENT INSPECTOR PANEL */}
      {/* ============================================================= */}
      {analysis && (
        <GlassCard
          variant="elevated"
          className="p-6 sm:p-7 relative overflow-hidden border border-theme-borderGlow shadow-card3D space-y-5"
        >
          {/* Header: Document Title & Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-theme-border/60">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-theme-primary/15 text-theme-primary flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-theme-text truncate max-w-[200px]">
                    {analysis.documentId}
                  </span>
                  <Badge variant="success" size="sm" className="text-[10px] gap-1 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Selected Document
                  </Badge>
                </div>
                <span className="text-[11px] font-semibold tracking-wider uppercase text-theme-primary block">
                  {meta.nativeName} Real-Time Briefing
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {analysis.importantDates && analysis.importantDates[0]?.daysLeft !== undefined && (
                <Badge variant="urgent" size="sm" className="gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{analysis.importantDates[0].daysLeft} Days Left</span>
                </Badge>
              )}
              <Button
                variant="primary"
                size="sm"
                onClick={onNavigateToResults}
                className="gap-1.5 text-xs shadow-glow"
              >
                <span>View Full Results & Q&A</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>

          {/* Document Title & Extracted Summary */}
          <div className="space-y-1.5">
            <h3 className="text-xl sm:text-2xl font-black text-theme-text font-display leading-snug">
              {analysis.title || analysis.documentType}
            </h3>
            <p className="text-xs sm:text-sm text-theme-textMuted leading-relaxed">
              {analysis.simpleSummary}
            </p>
          </div>

          {/* Checklist & Audio Summary Split Area */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-1">
            {/* Real-Time Action Checklist */}
            <div className="md:col-span-7 p-4 rounded-2xl bg-theme-surfaceGlass border border-theme-border/80 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-theme-text">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Action Checklist</span>
                </span>
                <span className="text-emerald-500 font-mono font-bold">
                  {completedTasksCount} of {totalTasksCount} Done
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-theme-surface rounded-full h-2 overflow-hidden border border-theme-border/60">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${totalTasksCount > 0 ? (completedTasksCount / totalTasksCount) * 100 : 0}%`,
                  }}
                />
              </div>

              {/* Live Tasks from Database */}
              <div className="space-y-2 pt-1 max-h-48 overflow-y-auto pr-1">
                {analysis.actionChecklist && analysis.actionChecklist.length > 0 ? (
                  analysis.actionChecklist.slice(0, 4).map((item) => {
                    const isDone = !!completedTasks[item.id];
                    return (
                      <div
                        key={item.id}
                        onClick={() => toggleTask(item.id)}
                        className="flex items-start gap-2.5 p-2 rounded-xl bg-theme-surface/70 border border-theme-border/50 hover:bg-theme-surface transition-colors cursor-pointer text-left group"
                      >
                        <input
                          type="checkbox"
                          checked={isDone}
                          onChange={() => {}}
                          className="mt-0.5 rounded text-theme-primary focus:ring-0 cursor-pointer"
                        />
                        <div className="min-w-0 flex-1">
                          <span
                            className={`text-xs block ${
                              isDone ? "line-through text-theme-textMuted/60" : "font-semibold text-theme-text group-hover:text-theme-primary transition-colors"
                            }`}
                          >
                            {item.task}
                          </span>
                          {item.deadline && (
                            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                              Due: {item.deadline}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-theme-textMuted">No pending action items for this document.</p>
                )}
              </div>
            </div>

            {/* Voice Audio Summary & Q&A Teaser */}
            <div className="md:col-span-5 p-4 rounded-2xl bg-theme-primary/10 border border-theme-primary/25 flex flex-col justify-between space-y-3">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-theme-primary text-theme-textInverse">
                    <Volume2 className="w-4 h-4" />
                  </span>
                  <div>
                    <span className="text-xs font-bold text-theme-text block">Voice Audio Briefing</span>
                    <span className="text-[10px] text-theme-textMuted block">Spoken in {meta.name}</span>
                  </div>
                </div>
                <p className="text-xs text-theme-textMuted leading-relaxed pt-1">
                  Accessible audio playback explaining deadlines, eligibility, and steps in plain spoken language.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={onNavigateToResults}
                  className="w-full gap-2 text-xs"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Listen to Full Briefing</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={onNavigateToResults}
                  className="w-full gap-2 text-xs bg-theme-surface"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-theme-primary" />
                  <span>Ask Document Questions (Q&A)</span>
                </Button>
              </div>
            </div>
          </div>
        </GlassCard>
      )}

      {/* ============================================================= */}
      {/* SAVED DOCUMENTS LIST FROM SQLITE DB */}
      {/* ============================================================= */}
      <GlassCard variant="default" className="p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-theme-border/60">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-theme-primary" />
            <h3 className="text-lg font-bold text-theme-text font-display">
              {t.dashboard.recentDocs}
            </h3>
          </div>
          <span className="text-xs font-mono text-theme-textMuted">
            Click any notice to inspect in real-time
          </span>
        </div>

        {savedDocuments.length === 0 ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-theme-surfaceGlass border border-theme-border flex items-center justify-center text-theme-textMuted mx-auto opacity-60">
              <FolderOpen className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-bold text-theme-text font-display">
                {t.dashboard.emptyRecentTitle}
              </h4>
              <p className="text-xs text-theme-textMuted max-w-sm mx-auto leading-relaxed">
                {t.dashboard.emptyRecentDesc}
              </p>
            </div>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Button
                variant="primary"
                size="md"
                onClick={onNavigateToUpload}
                className="gap-2"
              >
                <Upload className="w-4 h-4" />
                <span>Upload First Document</span>
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {savedDocuments.map((doc) => {
              const isSelected = selectedDocId === doc.documentId || analysis?.documentId === doc.documentId;
              return (
                <div
                  key={doc.documentId}
                  onClick={() => handleSelectDoc(doc.documentId)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 flex items-center justify-between gap-4 text-left group ${
                    isSelected
                      ? "bg-theme-surfaceGlassActive border-theme-primary shadow-sm ring-1 ring-theme-primary/30"
                      : "bg-theme-surfaceGlass border-theme-border hover:border-theme-borderGlow hover:bg-theme-surfaceGlassActive"
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected
                          ? "bg-theme-primary text-theme-textInverse shadow-xs"
                          : "bg-theme-primary/10 text-theme-primary"
                      }`}
                    >
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <h5 className="text-sm font-bold text-theme-text group-hover:text-theme-primary transition-colors truncate font-display">
                          {doc.title || doc.filename}
                        </h5>
                        {isSelected && (
                          <Badge variant="theme" size="sm" className="text-[10px]">
                            Inspecting
                          </Badge>
                        )}
                        {doc.status === "completed" && (
                          <Badge variant="success" size="sm" className="text-[10px]">
                            Analyzed
                          </Badge>
                        )}
                        {doc.status === "failed" && (
                          <Badge variant="urgent" size="sm" className="text-[10px]">
                            Failed
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-theme-textMuted flex-wrap">
                        <span className="font-mono text-[11px] text-theme-text/80">{doc.documentId}</span>
                        <span>•</span>
                        <span>{doc.documentType}</span>
                        <span>•</span>
                        <span>
                          {new Date(doc.createdAt).toLocaleDateString([], {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        {doc.totalTasks > 0 && (
                          <>
                            <span>•</span>
                            <span className="text-theme-primary font-medium">
                              {doc.completedTasks}/{doc.totalTasks} Tasks Done
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => handleDelete(e, doc.documentId)}
                      disabled={deletingId === doc.documentId}
                      className="p-2 rounded-xl text-theme-textMuted hover:text-red-500 hover:bg-red-500/10 transition-colors"
                      title="Delete document"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenFullAnalysis(doc.documentId);
                      }}
                      className="p-2 rounded-xl bg-theme-surface hover:bg-theme-primary hover:text-theme-textInverse border border-theme-border/60 transition-colors text-theme-textMuted"
                      title="Open full analysis page"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </GlassCard>
    </div>
  );
}