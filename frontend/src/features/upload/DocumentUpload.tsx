"use client";

import React, { useRef, useState, useEffect, ChangeEvent, DragEvent } from "react";
import {
  UploadCloud,
  FileText,
  Image as ImageIcon,
  Camera,
  X,
  RefreshCw,
  AlertCircle,
  Sparkles,
  CheckCircle,
  FileCheck,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAnalysis } from "@/contexts/AnalysisContext";
import { GlassCard } from "@/components/common/GlassCard";
import { Button } from "@/components/common/Button";
import { Badge } from "@/components/common/Badge";
import { DocumentCategory, SupportedLanguage } from "@/types/api";
import { MOCK_NOTICES } from "@/lib/mockService";

const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024; // 15MB
const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
];

interface DocumentUploadProps {
  onAnalysisComplete?: () => void;
}

export function DocumentUpload({ onAnalysisComplete }: DocumentUploadProps) {
  const { t, language } = useLanguage();
  const {
    file,
    setFile,
    filePreviewUrl,
    runAnalysis,
    isAnalyzing,
    analyzingStep,
    analysisError,
    clearAnalysisError,
    savedDocuments,
    loadDocument,
  } = useAnalysis();

  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory>("scholarship");
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>(language);

  // Synchronize upload language when global language preference changes
  useEffect(() => {
    setSelectedLanguage(language);
  }, [language]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const categories: { id: DocumentCategory; label: string }[] = [
    { id: "scholarship", label: "Scholarship" },
    { id: "college", label: "College Notice" },
    { id: "government", label: "Govt Scheme" },
    { id: "job", label: "Job Circular" },
    { id: "other", label: "Other Notice" },
  ];

  const handleValidateAndSetFile = (uploadedFile: File) => {
    setValidationError(null);
    clearAnalysisError();

    if (uploadedFile.size > MAX_FILE_SIZE_BYTES) {
      setValidationError(t.upload.errorTooLarge);
      return;
    }

    if (!ALLOWED_MIME_TYPES.includes(uploadedFile.type.toLowerCase())) {
      setValidationError(t.upload.errorInvalidType);
      return;
    }

    setFile(uploadedFile);
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleValidateAndSetFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleValidateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleAnalyze = async () => {
    const success = await runAnalysis(selectedLanguage, selectedCategory);
    if (success && onAnalysisComplete) {
      onAnalysisComplete();
    }
  };

  const stepMessages = [
    t.upload.analyzingStep1,
    t.upload.analyzingStep2,
    t.upload.analyzingStep3,
    t.upload.analyzingStep4,
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Heading */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-extrabold text-theme-text font-display">
          {t.upload.heading}
        </h2>
        <p className="text-sm text-theme-textMuted max-w-lg mx-auto">
          {t.upload.subheading}
        </p>
      </div>

      {/* Main Upload Dropzone Card */}
      <GlassCard
        variant="elevated"
        className={`p-6 sm:p-10 transition-all duration-300 relative ${
          isDragging
            ? "border-theme-primary ring-4 ring-theme-primary/20 bg-theme-surfaceGlassActive"
            : "border-theme-border hover:border-theme-borderGlow"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Hidden inputs */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,image/jpeg,image/png,application/pdf"
          className="hidden"
          onChange={handleFileInputChange}
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleFileInputChange}
        />

        {!file ? (
          /* Empty Dropzone State */
          <div className="flex flex-col items-center justify-center text-center py-8 sm:py-12 space-y-5">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-20 h-20 rounded-3xl bg-theme-primary/10 border border-theme-primary/30 flex items-center justify-center text-theme-primary cursor-pointer hover:scale-105 transition-transform shadow-glow"
            >
              <UploadCloud className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-theme-text font-display">
                {t.upload.dropzoneTitle}
              </h3>
              <p className="text-xs text-theme-textMuted">
                {t.upload.dropzoneSubtitle}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Button
                variant="primary"
                size="md"
                onClick={() => fileInputRef.current?.click()}
                className="gap-2"
              >
                <FileText className="w-4 h-4" />
                <span>Select Document File</span>
              </Button>

              <Button
                variant="secondary"
                size="md"
                onClick={() => cameraInputRef.current?.click()}
                className="gap-2"
              >
                <Camera className="w-4 h-4 text-theme-primary" />
                <span>{t.upload.cameraButton}</span>
              </Button>
            </div>
          </div>
        ) : (
          /* Selected File Preview State */
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-theme-border/60">
              <span className="text-xs font-bold uppercase tracking-wider text-theme-textMuted">
                {t.upload.selectedFile}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="gap-1.5 text-xs"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{t.upload.change}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFile(null)}
                  className="gap-1.5 text-xs text-red-400 hover:text-red-300"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>{t.upload.remove}</span>
                </Button>
              </div>
            </div>

            {/* File Details Box */}
            <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-theme-surfaceGlass border border-theme-border">
              {filePreviewUrl ? (
                <div className="w-20 h-20 rounded-xl overflow-hidden border border-white/20 shrink-0 bg-black/40">
                  <img
                    src={filePreviewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-theme-primary/15 text-theme-primary border border-theme-primary/30 flex items-center justify-center shrink-0">
                  <FileText className="w-8 h-8" />
                </div>
              )}

              <div className="space-y-1 text-center sm:text-left flex-1 min-w-0">
                <h4 className="text-base font-bold text-theme-text truncate font-display">
                  {file.name}
                </h4>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-theme-textMuted">
                  <span>{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                  <span>•</span>
                  <span className="uppercase font-mono">{file.type.split("/")[1] || "DOC"}</span>
                  <span>•</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <FileCheck className="w-3 h-3" /> Ready for AI Analysis
                  </span>
                </div>
              </div>
            </div>

            {/* Category & Language Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-theme-textMuted mb-2">
                  {t.upload.categoryLabel}
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCategory(c.id)}
                      className={`text-xs px-3 py-1.5 rounded-xl border transition-colors ${
                        selectedCategory === c.id
                          ? "bg-theme-primary text-theme-textInverse border-theme-primary font-semibold"
                          : "bg-theme-surfaceGlass border-theme-border text-theme-text hover:bg-white/5"
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-theme-textMuted mb-2">
                  {t.upload.languageLabel}
                </label>
                <div className="text-xs text-theme-textMuted p-2 rounded-xl bg-theme-surfaceGlass border border-theme-border flex items-center justify-between">
                  <span>Explaining in: <strong className="text-theme-text">{selectedLanguage.toUpperCase()}</strong></span>
                  <span className="text-emerald-400 text-[11px]">Synced with Header</span>
                </div>
              </div>
            </div>

            {/* Action Button & Analyzing Progress */}
            <div className="pt-4 border-t border-theme-border/60">
              {isAnalyzing ? (
                <div className="space-y-4 py-4 text-center">
                  <div className="flex items-center justify-center gap-3">
                    <span className="relative flex h-3.5 w-3.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-theme-primary opacity-75" />
                      <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-theme-primary" />
                    </span>
                    <span className="text-base font-bold text-theme-text font-display">
                      {t.upload.analyzing}
                    </span>
                  </div>

                  <p className="text-xs text-theme-primary font-medium animate-pulse">
                    {stepMessages[analyzingStep - 1] || stepMessages[0]}
                  </p>

                  <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden max-w-md mx-auto">
                    <div
                      className="bg-gradient-to-r from-theme-primary to-theme-secondary h-full rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${analyzingStep * 25}%` }}
                    />
                  </div>
                </div>
              ) : (
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleAnalyze}
                  className="w-full gap-2.5 shadow-glow py-4 text-base"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>{t.upload.analyzeButton}</span>
                </Button>
              )}
            </div>
          </div>
        )}
      </GlassCard>

      {/* Validation or API Errors */}
      {(validationError || analysisError) && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-start justify-between gap-3 shadow-xs">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-600" />
            <div className="space-y-1">
              <div className="font-semibold text-red-900">Analysis Notice</div>
              <p className="text-xs leading-relaxed text-red-700">
                {validationError || analysisError?.message}
              </p>
              {analysisError?.details && (
                <p className="text-[11px] text-red-500 font-mono">
                  Details: {analysisError.details}
                </p>
              )}
            </div>
          </div>
          {analysisError && file && !isAnalyzing && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleAnalyze}
              className="shrink-0 text-xs text-red-700 border-red-300 hover:bg-red-100"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1" />
              Retry
            </Button>
          )}
        </div>
      )}

      {/* Real-Time Database Quick-Access or Capability Highlights */}
      {savedDocuments && savedDocuments.length > 0 ? (
        <div className="pt-2 space-y-3 text-center sm:text-left">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-theme-textMuted tracking-wider uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-theme-primary" />
              <span>Recently Analyzed Real Documents (DB)</span>
            </span>
            <span className="text-[11px] font-mono text-emerald-500 font-semibold">
              Live SQLite Records
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {savedDocuments.slice(0, 4).map((doc) => (
              <div
                key={doc.documentId}
                onClick={async () => {
                  await loadDocument(doc.documentId);
                  if (onAnalysisComplete) onAnalysisComplete();
                }}
                className="p-3.5 rounded-2xl bg-theme-surfaceGlass border border-theme-border hover:border-theme-borderGlow hover:bg-theme-surfaceGlassActive cursor-pointer transition-all duration-200 flex items-center justify-between gap-3 text-left group shadow-xs"
              >
                <div className="space-y-0.5 min-w-0">
                  <h5 className="text-xs font-bold text-theme-text group-hover:text-theme-primary transition-colors truncate">
                    {doc.title || doc.filename}
                  </h5>
                  <p className="text-[11px] text-theme-textMuted truncate">
                    {doc.documentType} • {new Date(doc.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Badge variant="success" size="sm" className="shrink-0 text-[10px]">
                  Loaded
                </Badge>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 rounded-2xl bg-theme-surfaceGlass border border-theme-border/60">
            <span className="text-base">⚡</span>
            <div className="text-xs font-bold text-theme-text mt-1">Live Gemini AI</div>
            <div className="text-[10px] text-theme-textMuted">Zero-hallucination extraction</div>
          </div>
          <div className="p-3 rounded-2xl bg-theme-surfaceGlass border border-theme-border/60">
            <span className="text-base">📄</span>
            <div className="text-xs font-bold text-theme-text mt-1">PyMuPDF Engine</div>
            <div className="text-[10px] text-theme-textMuted">High-fidelity parsing</div>
          </div>
          <div className="p-3 rounded-2xl bg-theme-surfaceGlass border border-theme-border/60">
            <span className="text-base">🇮🇳</span>
            <div className="text-xs font-bold text-theme-text mt-1">15 Indian Languages</div>
            <div className="text-[10px] text-theme-textMuted">Native regional translation</div>
          </div>
          <div className="p-3 rounded-2xl bg-theme-surfaceGlass border border-theme-border/60">
            <span className="text-base">💾</span>
            <div className="text-xs font-bold text-theme-text mt-1">SQLite DB Storage</div>
            <div className="text-[10px] text-theme-textMuted">Full task persistence</div>
          </div>
        </div>
      )}
    </div>
  );
}
