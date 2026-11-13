"use client";

import React from "react";
import { UILanguage } from "@/types";
import { uiTranslations } from "@/data/translations";
import { FileText, Heart, Shield, Sparkles } from "lucide-react";

interface FooterProps {
  uiLang: UILanguage;
}

export const Footer: React.FC<FooterProps> = ({ uiLang }) => {
  const t = uiTranslations[uiLang].footer;

  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-500 flex items-center justify-center text-white">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white font-display">
                DocSaathi <span className="text-indigo-400">AI</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              &quot;Har document ko samjho, aasaan bhasha mein.&quot;
              <br />
              Empowering students, job seekers, and citizens across India to understand complex notifications without fear or jargon.
            </p>
            <div className="flex items-center space-x-2 pt-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-900/60 text-indigo-300 border border-indigo-700/50">
                <Sparkles className="w-3 h-3 mr-1 text-indigo-400" />
                Hackathon 2026 Edition
              </span>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
              Categories
            </h4>
            <ul className="space-y-2 text-xs">
              <li>College & University Notices</li>
              <li>Post-Matric Scholarships</li>
              <li>State & Central Job Notifications</li>
              <li>PM-Kisan & Government Schemes</li>
              <li>Affidavits & Citizen Circulars</li>
            </ul>
          </div>

          {/* Supported Languages */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
              Languages & Voice
            </h4>
            <ul className="space-y-2 text-xs">
              <li>हिन्दी (Hindi)</li>
              <li>English</li>
              <li>Hinglish (Colloquial mix)</li>
              <li>Text-to-Speech (TTS) Voiceover</li>
              <li>Instant Document Q&A</li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits & Disclaimer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-3">
          <p className="flex items-center">
            {t.madeFor}
          </p>
          <div className="flex items-center space-x-1.5 text-slate-500">
            <Shield className="w-3.5 h-3.5 text-slate-500" />
            <span>{t.disclaimer}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
