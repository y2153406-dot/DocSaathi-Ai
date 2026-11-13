"use client";

import React from "react";
import { UILanguage } from "@/types";
import { UploadCloud, Cpu, Sparkles, Volume2, ShieldCheck, ListOrdered } from "lucide-react";

interface HowItWorksProps {
  uiLang: UILanguage;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ uiLang }) => {
  const steps = [
    {
      num: "01",
      icon: <UploadCloud className="w-6 h-6 text-blue-600" />,
      titleEn: "Upload Document or Photo",
      titleHi: "फोटो या PDF अपलोड करें",
      descEn: "Drop any confusing college notice, scholarship circular, or government notification in JPG, PNG, or PDF format.",
      descHi: "कोई भी कठिन नोटिस, परीक्षा फॉर्म या सरकारी आदेश PDF या फोटो के रूप में अपलोड करें।",
    },
    {
      num: "02",
      icon: <Cpu className="w-6 h-6 text-indigo-600" />,
      titleEn: "DocSaathi AI Scans Clauses",
      titleHi: "AI नियमों का विश्लेषण करता है",
      descEn: "Our parser detects important deadlines, income caps, educational qualifications, fees, and penalty rules.",
      descHi: "हमारा AI सिस्टम अंतिम तारीख, आय सीमा, योग्यता और फीस जैसे कठिन नियमों को अलग-अलग पहचानता है।",
    },
    {
      num: "03",
      icon: <Sparkles className="w-6 h-6 text-violet-600" />,
      titleEn: "Get Crystal Clear Insights",
      titleHi: "पाएं सरल भाषा में सारांश",
      descEn: "Read in Hindi, English, or Hinglish with an interactive step-by-step checklist, document checklist, and voice briefing.",
      descHi: "हिन्दी, English या Hinglish में स्पष्ट सारांश पढ़ें, ऑडियो सुनें और काम पूरा करने की चेकलिस्ट पाएं।",
    },
  ];

  return (
    <section id="how-it-works" className="py-16 bg-slate-50 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200/60">
            {uiLang === "hi" ? "सरल प्रक्रिया" : "How It Works"}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-3 font-display">
            {uiLang === "hi"
              ? "3 आसान कदमों में समझें कोई भी दस्तावेज़"
              : "Understand Any Document in 3 Simple Steps"}
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            {uiLang === "hi"
              ? "बिना किसी दलाल या साइबर कैफ़े के चक्कर काटे, अपने मोबाइल से घर बैठे जानकारी पाएं।"
              : "No legal confusion, no agent dependency. Get actionable clarity straight on your phone."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-card hover:shadow-cardHover transition-all relative group"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {step.icon}
                </div>
                <span className="text-3xl font-extrabold text-slate-200 font-display">
                  {step.num}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {uiLang === "hi" ? step.titleHi : step.titleEn}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {uiLang === "hi" ? step.descHi : step.descEn}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
