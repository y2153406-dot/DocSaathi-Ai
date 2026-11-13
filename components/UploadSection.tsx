"use client";

import React, { useState, useRef, ChangeEvent, DragEvent } from "react";
import { DocumentCategory, ExplanationLanguage, UILanguage, SamplePreset } from "@/types";
import { uiTranslations } from "@/data/translations";
import { SAMPLE_PRESETS } from "@/data/samples";
import { 
  UploadCloud, 
  FileText, 
  Image as ImageIcon, 
  X, 
  GraduationCap, 
  Briefcase, 
  Landmark, 
  BookOpen, 
  HelpCircle, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Loader2,
  FileSearch,
  Eye,
  RefreshCw
} from "lucide-react";

interface UploadSectionProps {
  uiLang: UILanguage;
  selectedCategory: DocumentCategory;
  onSelectCategory: (category: DocumentCategory) => void;
  selectedLanguage: ExplanationLanguage;
  onSelectLanguage: (lang: ExplanationLanguage) => void;
  selectedFile: File | null;
  onSelectFile: (file: File | null) => void;
  selectedPreset: SamplePreset | null;
  onSelectPreset: (preset: SamplePreset | null) => void;
  isAnalyzing: boolean;
  onAnalyze: () => void;
  analysisError?: { message: string; code?: string } | null;
  onRetry?: () => void;
  onOpenApiKeyModal?: () => void;
}

export const UploadSection: React.FC<UploadSectionProps> = ({
  uiLang,
  selectedCategory,
  onSelectCategory,
  selectedLanguage,
  onSelectLanguage,
  selectedFile,
  onSelectFile,
  selectedPreset,
  onSelectPreset,
  isAnalyzing,
  onAnalyze,
  analysisError,
  onRetry,
  onOpenApiKeyModal,
}) => {
  const t = uiTranslations[uiLang].upload;
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);

  // Cycle loading steps during analysis
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAnalyzing) {
      setLoadingStepIndex(0);
      interval = setInterval(() => {
        setLoadingStepIndex((prev) => (prev + 1) % t.loadingSteps.length);
      }, 900);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing, t.loadingSteps.length]);

  // Handle file validation
  const validateAndSetFile = (file: File) => {
    setErrorMessage(null);
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg", "application/pdf"];
    
    if (!validTypes.includes(file.type) && !file.name.match(/\.(jpg|jpeg|png|webp|pdf)$/i)) {
      setErrorMessage(
        uiLang === "hi"
          ? "कृपया केवल वैध PDF या फ़ोटो (JPG, PNG, WEBP) फ़ाइल चुनें।"
          : "Please upload a valid PDF or image file (JPG, PNG, WEBP)."
      );
      return;
    }

    // 15MB limit
    if (file.size > 15 * 1024 * 1024) {
      setErrorMessage(
        uiLang === "hi"
          ? "फ़ाइल का आकार 15MB से कम होना चाहिए।"
          : "File size exceeds 15MB limit. Please upload a smaller document."
      );
      return;
    }

    // Clear any preset if user uploads custom file
    onSelectPreset(null);
    onSelectFile(file);

    // If image, create preview URL
    if (file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setImagePreviewUrl(url);
    } else {
      setImagePreviewUrl(null);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveFile = () => {
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
      setImagePreviewUrl(null);
    }
    onSelectFile(null);
    onSelectPreset(null);
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleChoosePreset = (preset: SamplePreset) => {
    setErrorMessage(null);
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
      setImagePreviewUrl(null);
    }
    onSelectFile(null);
    onSelectPreset(preset);
    onSelectCategory(preset.category);
  };

  const categoryOptions: { id: DocumentCategory; icon: React.ReactNode; label: string; desc: string }[] = [
    {
      id: "college",
      icon: <BookOpen className="w-5 h-5 text-emerald-600" />,
      label: t.categories.college,
      desc: uiLang === "hi" ? "परीक्षा, उपस्थिति, बैक-पेपर" : "Exam forms, attendance, backlog circulars",
    },
    {
      id: "scholarship",
      icon: <GraduationCap className="w-5 h-5 text-blue-600" />,
      label: t.categories.scholarship,
      desc: uiLang === "hi" ? "NSP, राज्य छात्रवृत्ति, फीस प्रतिपूर्ति" : "NSP, fee waiver, maintenance stipend",
    },
    {
      id: "job",
      icon: <Briefcase className="w-5 h-5 text-amber-600" />,
      label: t.categories.job,
      desc: uiLang === "hi" ? "SSC, रेलवे, पुलिस, सरकारी नौकरी" : "SSC, IBPS, UPSC, state police recruitment",
    },
    {
      id: "government",
      icon: <Landmark className="w-5 h-5 text-purple-600" />,
      label: t.categories.government,
      desc: uiLang === "hi" ? "PM-Kisan, राशन, आधार, सब्सिडी योजना" : "PM-Kisan, subsidy, e-KYC, civil notices",
    },
    {
      id: "other",
      icon: <HelpCircle className="w-5 h-5 text-slate-600" />,
      label: t.categories.other,
      desc: uiLang === "hi" ? "एफिडेविट, एग्रीमेंट, अन्य दस्तावेज" : "Agreements, letters, general forms",
    },
  ];

  const hasDocument = Boolean(selectedFile || selectedPreset);

  return (
    <section id="upload-section" className="py-12 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">
            {t.sectionTitle}
          </h2>
          <p className="mt-1.5 text-sm sm:text-base text-slate-600">
            {t.sectionDesc}
          </p>
        </div>

        {/* Upload Container Box */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-card p-6 sm:p-8 space-y-8">
          {/* 1. Drag & Drop Upload Zone */}
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png,.webp"
              className="hidden"
            />

            {!hasDocument ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative cursor-pointer border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center transition-all ${
                  isDragOver
                    ? "border-indigo-500 bg-indigo-50/70 scale-[1.01]"
                    : "border-slate-300 hover:border-indigo-400 hover:bg-slate-50/80"
                }`}
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-xs">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-slate-800">
                  {t.dropzoneTitle}
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">
                  {t.dropzoneSubtitle}
                </p>

                <div className="mt-5 flex items-center justify-center gap-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                    <FileText className="w-3.5 h-3.5 mr-1 text-slate-500" />
                    PDF Document
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                    <ImageIcon className="w-3.5 h-3.5 mr-1 text-slate-500" />
                    JPG / PNG Photo
                  </span>
                </div>
              </div>
            ) : (
              /* Selected Document Preview Card */
              <div className="relative rounded-2xl border-2 border-indigo-200 bg-gradient-to-r from-indigo-50/40 via-white to-blue-50/30 p-5 sm:p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start sm:items-center space-x-4">
                    {/* Icon or Image thumbnail */}
                    {imagePreviewUrl ? (
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-indigo-200 bg-white shrink-0 shadow-xs">
                        <img
                          src={imagePreviewUrl}
                          alt="Document Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 shrink-0">
                        <FileText className="w-7 h-7" />
                      </div>
                    )}

                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-indigo-100 text-indigo-700">
                          {selectedPreset ? "Demo Sample Notice" : "Uploaded File"}
                        </span>
                        {selectedPreset && (
                          <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-100 text-emerald-800">
                            {selectedPreset.previewBadge}
                          </span>
                        )}
                      </div>
                      <h4 className="text-base font-bold text-slate-900 truncate mt-1">
                        {selectedFile ? selectedFile.name : selectedPreset?.fileName}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {selectedFile
                          ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • ${selectedFile.type || "Document"}`
                          : `${selectedPreset?.fileSize} • Verified Official Notice`}
                      </p>
                    </div>
                  </div>

                  {/* Actions: change or remove */}
                  <div className="flex items-center space-x-2 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition-colors"
                    >
                      {t.changeFile}
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="p-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                      title={t.removeFile}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Snippet preview if preset */}
                {selectedPreset && (
                  <div className="mt-3.5 pt-3 border-t border-indigo-100 text-xs text-slate-600 italic">
                    &quot;{selectedPreset.previewSnippet}&quot;
                  </div>
                )}
              </div>
            )}

            {/* Error Notification Banner */}
            {errorMessage && (
              <div className="mt-3 flex items-center space-x-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>

          {/* Quick Presets Picker */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                {t.quickSamplesLabel}
              </label>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SAMPLE_PRESETS.map((preset) => {
                const isCurrent = selectedPreset?.id === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleChoosePreset(preset)}
                    className={`text-left p-2.5 rounded-xl border transition-all text-xs ${
                      isCurrent
                        ? "border-indigo-600 bg-indigo-50/90 text-indigo-950 font-semibold shadow-xs ring-1 ring-indigo-400"
                        : "border-slate-200 bg-slate-50/50 hover:bg-slate-100/80 text-slate-700"
                    }`}
                  >
                    <div className="flex items-center space-x-1.5 mb-1">
                      {preset.category === "scholarship" && <GraduationCap className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                      {preset.category === "job" && <Briefcase className="w-3.5 h-3.5 text-amber-600 shrink-0" />}
                      {preset.category === "college" && <BookOpen className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                      {preset.category === "government" && <Landmark className="w-3.5 h-3.5 text-purple-600 shrink-0" />}
                      <span className="font-semibold truncate text-[11px]">{preset.category.toUpperCase()}</span>
                    </div>
                    <p className="truncate text-slate-800">{preset.title}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Document Category Selector */}
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-3">
              {t.categoryLabel}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {categoryOptions.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => onSelectCategory(cat.id)}
                    className={`flex items-start p-3.5 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? "border-indigo-600 bg-indigo-50/80 shadow-xs ring-2 ring-indigo-500/20"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/70"
                    }`}
                  >
                    <div className={`p-2 rounded-xl shrink-0 mr-3 ${isSelected ? "bg-white shadow-xs" : "bg-slate-100"}`}>
                      {cat.icon}
                    </div>
                    <div className="min-w-0">
                      <p className={`text-sm font-bold ${isSelected ? "text-indigo-950" : "text-slate-800"}`}>
                        {cat.label}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                        {cat.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Explanation Language Selector */}
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-3">
              {t.languageLabel}
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(["hindi", "hinglish", "english"] as ExplanationLanguage[]).map((lang) => {
                const isSelected = selectedLanguage === lang;
                return (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => onSelectLanguage(lang)}
                    className={`py-3 px-3 rounded-2xl border text-center transition-all ${
                      isSelected
                        ? "border-indigo-600 bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/25"
                        : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium"
                    }`}
                  >
                    <span className="block text-sm sm:text-base">
                      {lang === "hindi" && "हिन्दी"}
                      {lang === "hinglish" && "Hinglish"}
                      {lang === "english" && "English"}
                    </span>
                    <span className={`block text-[11px] mt-0.5 ${isSelected ? "text-indigo-100" : "text-slate-400"}`}>
                      {lang === "hindi" && "प्योर हिन्दी में"}
                      {lang === "hinglish" && "Easy Bolchal"}
                      {lang === "english" && "Plain English"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Action Button with Loading Feedback & Error / Retry */}
          <div className="pt-2 space-y-3">
            {analysisError && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 animate-in fade-in duration-200 space-y-2.5">
                <div className="flex items-start space-x-2.5">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div className="flex-1 text-xs sm:text-sm">
                    <p className="font-bold text-rose-950">
                      {uiLang === "hi" ? "विश्लेषण विफल रहा" : "Analysis Encountered An Issue"}
                    </p>
                    <p className="mt-0.5 text-rose-800 leading-relaxed">{analysisError.message}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1 pl-7">
                  {onRetry && (
                    <button
                      type="button"
                      onClick={onRetry}
                      disabled={isAnalyzing}
                      className="inline-flex items-center px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition-colors shadow-xs"
                    >
                      <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                      {uiLang === "hi" ? "पुनः प्रयास करें (Retry)" : "Retry Analysis"}
                    </button>
                  )}
                  {analysisError.code === "MISSING_API_KEY" && onOpenApiKeyModal && (
                    <button
                      type="button"
                      onClick={onOpenApiKeyModal}
                      className="inline-flex items-center px-3 py-1.5 rounded-xl bg-white hover:bg-rose-100/70 text-rose-900 border border-rose-300 font-semibold text-xs transition-colors"
                    >
                      {uiLang === "hi" ? "API Key दर्ज करें" : "Configure API Key"}
                    </button>
                  )}
                </div>
              </div>
            )}

            <button
              type="button"
              disabled={!hasDocument || isAnalyzing}
              onClick={onAnalyze}
              className={`w-full py-4 px-6 rounded-2xl text-base sm:text-lg font-bold text-white transition-all flex items-center justify-center shadow-lg ${
                !hasDocument || isAnalyzing
                  ? "bg-slate-300 cursor-not-allowed shadow-none"
                  : "bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-700 hover:from-blue-700 hover:to-violet-800 shadow-indigo-500/30 hover:shadow-indigo-500/40 hover:scale-[1.01] active:scale-[0.99]"
              }`}
            >
              {isAnalyzing ? (
                <div className="flex items-center space-x-3">
                  <Loader2 className="w-6 h-6 animate-spin text-white" />
                  <span>{t.analyzingText}</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-yellow-300" />
                  <span>{t.analyzeButton}</span>
                </div>
              )}
            </button>

            {/* Stepped progress indicators when analyzing */}
            {isAnalyzing && (
              <div className="mt-4 p-4 rounded-xl bg-indigo-50 border border-indigo-100 animate-in fade-in duration-300">
                <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-900">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                  <span>{t.loadingSteps[loadingStepIndex]}</span>
                </div>
                <div className="w-full bg-indigo-200/60 rounded-full h-1.5 mt-2.5 overflow-hidden">
                  <div
                    className="bg-indigo-600 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${((loadingStepIndex + 1) / t.loadingSteps.length) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {!hasDocument && (
              <p className="text-center text-xs text-slate-400 mt-2.5">
                {uiLang === "hi"
                  ? "विश्लेषण शुरू करने के लिए फ़ाइल अपलोड करें या ऊपर दिए गए सैंपल में से किसी एक को चुनें।"
                  : "Upload a document above or pick one of the sample notices to start analysis."}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
