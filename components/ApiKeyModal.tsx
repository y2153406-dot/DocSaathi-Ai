"use client";

import React, { useState } from "react";
import { UILanguage } from "@/types";
import { X, KeyRound, ShieldCheck, Sparkles, ExternalLink, Check, Trash2 } from "lucide-react";

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  uiLang: UILanguage;
  apiKey: string;
  onSaveKey: (key: string) => void;
  onClearKey: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  uiLang,
  apiKey,
  onSaveKey,
  onClearKey,
}) => {
  const [tempKey, setTempKey] = useState(apiKey);
  const [showKey, setShowKey] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveKey(tempKey.trim());
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 800);
  };

  const handleClear = () => {
    setTempKey("");
    onClearKey();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-xs">
            <KeyRound className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              {uiLang === "hi" ? "Gemini API सेटअप (वैकल्पिक)" : "Gemini API Setup (Optional)"}
            </h3>
            <p className="text-xs text-slate-500">
              {uiLang === "hi"
                ? "हैकाथॉन डेमो या लाइव AI मोड चुनें"
                : "Choose between Verified Demo Mode or Live Gemini Mode"}
            </p>
          </div>
        </div>

        {/* Explanatory Callout */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs text-slate-600">
          <div className="flex items-center space-x-1.5 font-bold text-slate-800">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Hackathon Testing Notice</span>
          </div>
          <p>
            {uiLang === "hi"
              ? "DocSaathi AI बिना किसी API Key के भी 4 वास्तविक सैंपल दस्तावेज़ों (स्कॉलरशिप, नौकरी, कॉलेज, पीएम-किसान) के साथ 100% काम करता है।"
              : "DocSaathi AI works out-of-the-box with 4 verified realistic presets (Scholarships, SSC CGL, University Exams, PM-Kisan) without needing any API key."}
          </p>
          <p>
            {uiLang === "hi"
              ? "यदि आप किसी भी नए कस्टम दस्तावेज़ पर लाइव जेमिनी मॉडल चलाना चाहते हैं, तो अपनी API कुंजी यहाँ दर्ज कर सकते हैं या .env.local में GEMINI_API_KEY सेट कर सकते हैं।"
              : "To run live AI parsing on custom uploaded documents, set GEMINI_API_KEY in .env.local on the server or enter your key here."}
          </p>
        </div>

        {/* Privacy & Security Guarantee */}
        <div className="mt-4 flex items-start space-x-2 text-xs text-emerald-800 bg-emerald-50/80 p-3 rounded-xl border border-emerald-200/60">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>
            {uiLang === "hi"
              ? "सुरक्षा गारंटी: आपकी कुंजी केवल आपके ब्राउज़र मेमोरी में रहती है और कभी भी किसी डेटाबेस या सार्वजनिक कोड में स्टोर नहीं होती।"
              : "Security guarantee: Your API key is stored only in local browser session memory and is never logged or exposed in client bundles."}
          </span>
        </div>

        {/* Input */}
        <div className="mt-5 space-y-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Google Gemini API Key
          </label>
          <div className="relative">
            <input
              type={showKey ? "text" : "password"}
              value={tempKey}
              onChange={(e) => setTempKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-20"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 px-2.5 py-1 text-xs text-slate-500 hover:text-slate-800 font-medium"
            >
              {showKey ? "Hide" : "Show"}
            </button>
          </div>
          <p className="text-[11px] text-slate-400">
            Get a free API key at{" "}
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 underline inline-flex items-center"
            >
              Google AI Studio <ExternalLink className="w-3 h-3 ml-0.5" />
            </a>
          </p>
        </div>

        {/* Modal Buttons */}
        <div className="mt-6 flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
          {apiKey ? (
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1.5" />
              Clear Key
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/20 active:scale-95"
            >
              {saveSuccess ? (
                <>
                  <Check className="w-4 h-4 mr-1.5" />
                  Saved!
                </>
              ) : (
                "Save & Apply"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
