"use client";

import React, { useState, FormEvent } from "react";
import {
  MessageSquare,
  Send,
  Sparkles,
  Bot,
  User,
  Quote,
  ShieldCheck,
  HelpCircle,
  Mic,
  MicOff,
  AlertCircle,
  RotateCcw,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAnalysis } from "@/contexts/AnalysisContext";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import { GlassCard } from "@/components/common/GlassCard";
import { Button } from "@/components/common/Button";
import { Badge } from "@/components/common/Badge";

export function DocumentChat() {
  const { t, language, meta } = useLanguage();
  const { analysis, chatMessages, isAsking, askQuestion, isMockMode } = useAnalysis();
  const [inputQuestion, setInputQuestion] = useState("");
  const { play, stop, isPlaying } = useSpeechSynthesis();

  const {
    isSupported: isMicSupported,
    isListening,
    startListening,
    stopListening,
    error: micError,
    clearError: clearMicError,
  } = useSpeechRecognition(language);

  if (!analysis) return null;

  const defaultSuggestedQuestions = [
    "What is this document about?",
    "What is the last date to apply?",
    "What documents are strictly mandatory?",
    "Am I eligible under the income limit?",
    "What should I do next?",
  ];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputQuestion.trim() || isAsking) return;
    const q = inputQuestion.trim();
    setInputQuestion("");
    await askQuestion(q);
  };

  const handleChipClick = (question: string) => {
    setInputQuestion(question);
    askQuestion(question);
  };

  const handleMicToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening((transcript) => {
        setInputQuestion(transcript);
      });
    }
  };

  return (
    <GlassCard variant="elevated" className="p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-theme-border/60">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-theme-primary/10 text-theme-primary">
              <MessageSquare className="w-5 h-5" />
            </span>
            <h3 className="text-xl font-bold text-theme-text font-display">
              {t.chat.heading}
            </h3>
          </div>
          <p className="text-xs text-theme-textMuted">
            {t.chat.subheading}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Grounded In Document</span>
          </span>
        </div>
      </div>

      {/* Suggested Questions Chips */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-theme-textMuted flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-theme-primary" />
          <span>{t.chat.suggestedQuestions}</span>
        </span>
        <div className="flex flex-wrap gap-2">
          {defaultSuggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleChipClick(q)}
              className="text-xs px-3 py-1.5 rounded-xl bg-theme-surfaceGlass border border-theme-border hover:border-theme-borderGlow text-theme-text hover:text-theme-primary transition-all text-left shadow-xs"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="space-y-4 max-h-[380px] overflow-y-auto p-1 pr-2">
        {chatMessages.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-theme-surfaceGlass/40 border border-theme-border/60 space-y-2">
            <Bot className="w-8 h-8 text-theme-textMuted mx-auto opacity-50" />
            <p className="text-xs text-theme-textMuted max-w-sm mx-auto">
              {t.chat.emptyChat}
            </p>
          </div>
        ) : (
          chatMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.sender === "ai" && (
                <div className="w-8 h-8 rounded-xl bg-theme-primary/10 text-theme-primary border border-theme-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-4 space-y-2 text-left ${
                  msg.sender === "user"
                    ? "bg-theme-primary text-theme-textInverse shadow-sm"
                    : "bg-white border border-theme-border text-theme-text shadow-sm"
                }`}
              >
                <div className="flex items-center justify-between gap-4 text-[10px] opacity-75">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold uppercase tracking-wider">
                      {msg.sender === "user" ? "You" : "DocSaathi AI"}
                    </span>
                    {msg.sender === "ai" && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-theme-primary/10 text-theme-primary">
                        {meta.nativeName}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {msg.sender === "ai" && (
                      <button
                        type="button"
                        onClick={() => (isPlaying ? stop() : play(msg.text, language))}
                        className="text-[11px] flex items-center gap-1 text-theme-primary hover:underline font-semibold"
                        title={`Listen in ${meta.nativeName}`}
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>{isPlaying ? "Stop" : "Listen"}</span>
                      </button>
                    )}
                    <span>{msg.timestamp}</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                  {msg.text}
                </p>

                {/* English Translation if available */}
                {msg.sender === "ai" && msg.answerEnglish && msg.answerEnglish !== msg.text && (
                  <div className="mt-2 pt-2 border-t border-slate-100 text-xs text-slate-600 bg-slate-50/80 p-2.5 rounded-xl space-y-1">
                    <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      <span>🇬🇧 English Translation</span>
                    </div>
                    <p className="leading-relaxed font-sans">{msg.answerEnglish}</p>
                  </div>
                )}

                {/* Source Snippet Citation */}
                {msg.sourceSnippet && (
                  <div className="pt-2 border-t border-slate-200/60 text-[11px] space-y-1">
                    <span className="font-semibold flex items-center gap-1 text-amber-700">
                      <Quote className="w-3 h-3" />
                      <span>{t.chat.sourceReference}</span>
                    </span>
                    <blockquote className="italic opacity-90 pl-2 border-l-2 border-amber-500/60 text-slate-700">
                      {msg.sourceSnippet}
                    </blockquote>
                  </div>
                )}
              </div>

              {msg.sender === "user" && (
                <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-800 border border-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))
        )}

        {isAsking && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-theme-primary/15 text-theme-primary flex items-center justify-center shrink-0 animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-2xl bg-white border border-theme-border flex items-center gap-2 text-xs text-theme-textMuted shadow-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-theme-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-theme-primary" />
              </span>
              <span>{t.chat.asking}</span>
            </div>
          </div>
        )}
      </div>

      {/* Mic Notice / Permission Warning */}
      {micError && (
        <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs text-amber-800">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{micError}</span>
          </div>
          <button
            type="button"
            onClick={clearMicError}
            className="text-[10px] font-bold underline ml-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Active Listening Waveform Banner */}
      {isListening && (
        <div className="p-2 rounded-xl bg-red-50 border border-red-200 flex items-center justify-between text-xs text-red-700 animate-pulse">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
            <span className="font-semibold">Listening to your question in {meta.name}... Speak now.</span>
          </div>
          <button
            type="button"
            onClick={stopListening}
            className="text-xs font-bold px-2 py-0.5 rounded bg-red-600 text-white"
          >
            Done
          </button>
        </div>
      )}

      {/* Input Form with Microphone Button */}
      <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
        {/* Voice Input Button */}
        <button
          type="button"
          onClick={handleMicToggle}
          title={
            isListening
              ? "Stop Voice Recording"
              : isMicSupported
              ? `Ask with Microphone (${meta.name})`
              : "Microphone not supported on this browser"
          }
          className={`p-3 rounded-xl border transition-all shrink-0 flex items-center justify-center ${
            isListening
              ? "bg-red-500 text-white border-red-600 shadow-md animate-pulse ring-2 ring-red-300"
              : isMicSupported
              ? "bg-white hover:bg-slate-50 text-slate-700 border-theme-border hover:border-theme-primary shadow-xs"
              : "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
          }`}
          disabled={!isMicSupported || isAsking}
        >
          {isListening ? (
            <MicOff className="w-4 h-4" />
          ) : (
            <Mic className="w-4 h-4 text-theme-primary" />
          )}
        </button>

        {/* Text Input */}
        <input
          type="text"
          value={inputQuestion}
          onChange={(e) => setInputQuestion(e.target.value)}
          placeholder={isListening ? "Listening... speak your question" : t.chat.placeholder}
          disabled={isAsking}
          className="flex-1 bg-white border border-theme-border rounded-xl px-4 py-3 text-xs sm:text-sm text-theme-text placeholder:text-theme-textMuted focus:outline-none focus:ring-2 focus:ring-theme-primary shadow-xs"
        />

        {/* Send Button */}
        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={!inputQuestion.trim() || isAsking}
          className="shrink-0 font-bold"
        >
          <Send className="w-4 h-4 mr-1" />
          <span className="hidden sm:inline">{t.chat.send}</span>
        </Button>
      </form>

      {/* Grounded Notice Disclaimer */}
      <div className="text-center text-[11px] text-theme-textMuted flex items-center justify-center gap-1.5 pt-1">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        <span>{t.chat.groundedNotice}</span>
      </div>
    </GlassCard>
  );
}
