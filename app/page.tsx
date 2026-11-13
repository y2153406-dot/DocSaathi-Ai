"use client";

import React, { useState, useEffect } from "react";
import { 
  DocumentCategory, 
  ExplanationLanguage, 
  UILanguage, 
  DocumentAnalysis, 
  SamplePreset 
} from "@/types";
import { SAMPLE_PRESETS } from "@/data/samples";
import { getPresetAnalysis, generateSmartAnalysisForUpload } from "@/lib/analyzer";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { UploadSection } from "@/components/UploadSection";
import { AnalysisResults } from "@/components/AnalysisResults";
import { HowItWorks } from "@/components/HowItWorks";
import { ApiKeyModal } from "@/components/ApiKeyModal";
import { Footer } from "@/components/Footer";
import { Sparkles, ArrowDownCircle, CheckCircle, Info } from "lucide-react";

export default function Home() {
  const [uiLang, setUiLang] = useState<UILanguage>("en");
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory>("scholarship");
  const [selectedLanguage, setSelectedLanguage] = useState<ExplanationLanguage>("hindi");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Start with NSP scholarship preset ready for instant 1-click test
  const [selectedPreset, setSelectedPreset] = useState<SamplePreset | null>(SAMPLE_PRESETS[0]);
  
  const [analysisResult, setAnalysisResult] = useState<DocumentAnalysis | null>(null);
  const [analysisError, setAnalysisError] = useState<{ message: string; code?: string } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // API Key State (stored only in browser session memory)
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [apiKey, setApiKey] = useState<string>("");
  const [notification, setNotification] = useState<{ message: string; type: "success" | "info" } | null>(null);

  // Load API key from sessionStorage if previously set in session
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("docsaathi_gemini_key");
      if (stored) setApiKey(stored);
    }
  }, []);

  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    if (typeof window !== "undefined") {
      if (key) {
        sessionStorage.setItem("docsaathi_gemini_key", key);
      } else {
        sessionStorage.removeItem("docsaathi_gemini_key");
      }
    }
    showNotification(key ? "Gemini API Key configured for live mode!" : "Switched to demo mode", "success");
  };

  const handleClearApiKey = () => {
    setApiKey("");
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("docsaathi_gemini_key");
    }
    showNotification("API key removed. Running in Verified Hackathon Demo Mode.", "info");
  };

  const showNotification = (message: string, type: "success" | "info" = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const scrollToUpload = () => {
    const el = document.getElementById("upload-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToSamples = () => {
    const el = document.getElementById("sample-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSelectSamplePreset = (presetId: string) => {
    const found = SAMPLE_PRESETS.find((p) => p.id === presetId);
    if (found) {
      setSelectedPreset(found);
      setSelectedFile(null);
      setSelectedCategory(found.category);
      scrollToUpload();
      showNotification(`Loaded preset: ${found.title}`, "info");
    }
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      const formData = new FormData();
      formData.append("category", selectedCategory);
      formData.append("language", selectedLanguage);
      if (apiKey) {
        formData.append("apiKey", apiKey);
      }

      if (selectedFile) {
        formData.append("file", selectedFile);
      } else if (selectedPreset) {
        formData.append("presetId", selectedPreset.id);
      } else {
        setAnalysisError({
          message: uiLang === "hi" 
            ? "कृपया पहले कोई दस्तावेज़ अपलोड करें या सैंपल नोटिस चुनें।" 
            : "Please upload a document or choose a sample notice first.",
        });
        setIsAnalyzing(false);
        return;
      }

      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        const errMsg = json.error || (uiLang === "hi" ? "दस्तावेज़ का विश्लेषण विफल रहा।" : "Analysis failed.");
        setAnalysisError({ message: errMsg, code: json.code });
        showNotification(errMsg, "info");
        setIsAnalyzing(false);
        return;
      }

      if (json.data) {
        setAnalysisResult(json.data);
        setAnalysisError(null);
        showNotification(
          json.source === "gemini_live"
            ? (uiLang === "hi" ? "दस्तावेज़ का लाइव जेमिनी AI विश्लेषण पूर्ण हुआ!" : "Document analyzed live using Google Gemini AI!")
            : (uiLang === "hi" ? "दस्तावेज़ का विश्लेषण तैयार है!" : "Document analysis complete!"),
          "success"
        );
        scrollToResults();
      }
    } catch (err: any) {
      console.error("Analysis client error:", err);
      const msg = err?.message || (uiLang === "hi" ? "सर्वर से कनेक्ट नहीं हो सका। कृपया पुनः प्रयास करें।" : "Could not connect to analysis service. Please try again.");
      setAnalysisError({ message: msg });
      showNotification(msg, "info");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const scrollToResults = () => {
    setTimeout(() => {
      const el = document.getElementById("results-section");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }, 200);
  };

  const handleReset = () => {
    setAnalysisResult(null);
    scrollToUpload();
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom duration-300">
          <div className="flex items-center space-x-2 px-4 py-3 rounded-2xl bg-slate-900 text-white text-xs sm:text-sm font-medium shadow-2xl border border-slate-700">
            {notification.type === "success" ? (
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            ) : (
              <Info className="w-4 h-4 text-blue-400" />
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Navbar */}
      <Navbar
        uiLang={uiLang}
        onToggleLang={setUiLang}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        hasCustomKey={Boolean(apiKey)}
        onScrollToUpload={scrollToUpload}
        onScrollToSamples={scrollToSamples}
      />

      {/* Hero Section */}
      <Hero
        uiLang={uiLang}
        onScrollToUpload={scrollToUpload}
        onSelectSamplePreset={handleSelectSamplePreset}
      />

      {/* Main Upload Workspace */}
      <UploadSection
        uiLang={uiLang}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        selectedLanguage={selectedLanguage}
        onSelectLanguage={setSelectedLanguage}
        selectedFile={selectedFile}
        onSelectFile={setSelectedFile}
        selectedPreset={selectedPreset}
        onSelectPreset={setSelectedPreset}
        isAnalyzing={isAnalyzing}
        onAnalyze={handleAnalyze}
        analysisError={analysisError}
        onRetry={handleAnalyze}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
      />

      {/* Results Section */}
      {analysisResult ? (
        <AnalysisResults
          analysis={analysisResult}
          uiLang={uiLang}
          onReset={handleReset}
          apiKey={apiKey}
        />
      ) : (
        /* Empty State / Prompt Banner */
        <div className="py-12 bg-slate-50/50 border-t border-slate-100 text-center">
          <div className="max-w-md mx-auto px-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3 shadow-xs">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              {uiLang === "hi"
                ? "आपका विश्लेषण यहाँ दिखाई देगा"
                : "Analysis Results Will Appear Here"}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {uiLang === "hi"
                ? "ऊपर 'डॉक्यूमेंट का विश्लेषण करें' बटन दबाएं और सारांश, अंतिम तारीखें, पात्रता व ऑडियो ब्रीफिंग देखें।"
                : "Hit 'Analyze Document' above to see simple summaries, important dates, fees, required documents, next steps, and voice briefing."}
            </p>
          </div>
        </div>
      )}

      {/* How It Works Section */}
      <HowItWorks uiLang={uiLang} />

      {/* Footer */}
      <Footer uiLang={uiLang} />

      {/* Optional Gemini API Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        uiLang={uiLang}
        apiKey={apiKey}
        onSaveKey={handleSaveApiKey}
        onClearKey={handleClearApiKey}
      />
    </div>
  );
}
