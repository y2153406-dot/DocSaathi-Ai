"use client";

import React, { useState } from "react";
import {
  Play,
  Pause,
  Square,
  Volume2,
  VolumeX,
  Gauge,
  AlertCircle,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAnalysis } from "@/contexts/AnalysisContext";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import { SUPPORTED_LANGUAGES } from "@/lib/i18n";
import { SupportedLanguage } from "@/types/api";
import { GlassCard } from "@/components/common/GlassCard";
import { Button } from "@/components/common/Button";
import { Badge } from "@/components/common/Badge";

function formatTime(secs: number): string {
  if (!isFinite(secs) || isNaN(secs) || secs <= 0) return "0:00";
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

export function AudioSummaryPlayer() {
  const { t, language, meta } = useLanguage();
  const { analysis } = useAnalysis();
  const [showScript, setShowScript] = useState(false);

  const docLang = ((analysis?.language as SupportedLanguage) || language) as SupportedLanguage;
  const docMeta = SUPPORTED_LANGUAGES.find((l) => l.code === docLang) || meta;

  const {
    play,
    pause,
    resume,
    stop,
    seek,
    isPlaying,
    isPaused,
    isLoading,
    rate,
    setRate,
    currentTime,
    duration,
    audioSource,
    voiceUnsupported,
    isSupported,
  } = useSpeechSynthesis();

  if (!analysis) return null;

  const scriptToRead =
    analysis.audioScript ||
    `${analysis.title || analysis.documentType}. ${analysis.simpleSummary}. ${analysis.keyPoints.join(". ")}`;

  const handlePlayToggle = () => {
    if (isPlaying) {
      pause();
    } else if (isPaused) {
      resume();
    } else {
      play(scriptToRead, docLang, analysis.documentId);
    }
  };

  const handleStop = () => {
    stop();
  };

  const speedOptions = [0.85, 1, 1.25, 1.5];

  return (
    <GlassCard variant="default" className="p-5 sm:p-6 border border-theme-border/80">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left: Status & Audio Waveform Visualizer */}
        <div className="flex items-center gap-3.5 w-full sm:w-auto">
          <div
            onClick={handlePlayToggle}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center cursor-pointer transition-all shadow-md shrink-0 ${
              isPlaying
                ? "bg-theme-primary text-theme-textInverse shadow-glow scale-105"
                : "bg-theme-surfaceGlass border border-theme-border text-theme-primary hover:bg-theme-surfaceGlassActive"
            }`}
            title={isPlaying ? t.audio.pause : t.audio.play}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </div>

          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-theme-text font-display">
                {t.audio.heading}
              </h4>
              <Badge variant="theme" size="sm" className="text-[10px]">
                {audioSource === "neural" ? `🔊 AI Audio (${docMeta.nativeName})` : docMeta.nativeName}
              </Badge>
            </div>

            {/* Live animated equalizer bars */}
            <div className="flex items-center gap-1.5 h-4">
              <span className={`w-1 rounded-full bg-theme-primary ${isPlaying ? "h-4 animate-pulse" : "h-1.5 opacity-50"}`} />
              <span className={`w-1 rounded-full bg-theme-primary ${isPlaying ? "h-3 animate-pulse delay-75" : "h-2 opacity-50"}`} />
              <span className={`w-1 rounded-full bg-theme-primary ${isPlaying ? "h-5 animate-pulse delay-150" : "h-1.5 opacity-50"}`} />
              <span className={`w-1 rounded-full bg-theme-primary ${isPlaying ? "h-2 animate-pulse delay-100" : "h-2 opacity-50"}`} />
              <span className={`w-1 rounded-full bg-theme-primary ${isPlaying ? "h-4 animate-pulse delay-200" : "h-1.5 opacity-50"}`} />
              <span className="text-[11px] text-theme-textMuted ml-1.5 font-medium">
                {isLoading
                  ? "Loading Audio..."
                  : isPlaying
                  ? `${t.audio.statusPlaying} (${formatTime(currentTime)} / ${formatTime(duration)})`
                  : isPaused
                  ? t.audio.statusPaused
                  : t.audio.statusStopped}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Controls & Speed Switcher */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {/* Stop Button */}
          {(isPlaying || isPaused) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleStop}
              className="text-xs text-theme-textMuted hover:text-red-400"
            >
              <Square className="w-3.5 h-3.5 mr-1" />
              <span>{t.audio.stop}</span>
            </Button>
          )}

          {/* Speed Pills */}
          <div className="flex items-center gap-1 bg-theme-surfaceGlass border border-theme-border p-1 rounded-xl">
            <Gauge className="w-3.5 h-3.5 text-theme-textMuted ml-1 mr-0.5" />
            {speedOptions.map((s) => (
              <button
                key={s}
                onClick={() => setRate(s)}
                className={`text-[11px] font-mono px-2 py-1 rounded-lg transition-colors ${
                  rate === s
                    ? "bg-theme-primary text-theme-textInverse font-bold shadow-sm"
                    : "text-theme-textMuted hover:text-theme-text"
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          {/* Read Along Script Toggle */}
          <button
            type="button"
            onClick={() => setShowScript(!showScript)}
            className="flex items-center gap-1 text-[11px] font-semibold text-theme-primary hover:underline px-2 py-1 rounded-lg hover:bg-theme-primary/10 transition-colors"
          >
            <span>{showScript ? "Hide Script" : "Read Script"}</span>
            {showScript ? (
              <ChevronUp className="w-3 h-3" />
            ) : (
              <ChevronDown className="w-3 h-3" />
            )}
          </button>
        </div>
      </div>

      {/* Scrub bar when duration is known */}
      {duration > 0 && (
        <div className="mt-3 pt-2 border-t border-theme-border/40 flex items-center gap-2.5">
          <span className="text-[10px] font-mono text-theme-textMuted w-9 text-right">
            {formatTime(currentTime)}
          </span>
          <input
            type="range"
            min={0}
            max={duration}
            step={0.1}
            value={currentTime}
            onChange={(e) => seek(parseFloat(e.target.value))}
            className="flex-1 h-1.5 bg-theme-border/60 rounded-lg appearance-none cursor-pointer accent-theme-primary"
          />
          <span className="text-[10px] font-mono text-theme-textMuted w-9">
            {formatTime(duration)}
          </span>
        </div>
      )}

      {/* Expandable Native Language Script */}
      {showScript && (
        <div className="mt-3 p-3.5 rounded-xl bg-theme-surfaceGlass border border-theme-border/70 text-xs sm:text-sm text-theme-text leading-relaxed space-y-1.5 animate-fadeIn">
          <div className="flex items-center justify-between text-[11px] font-bold text-theme-primary pb-1 border-b border-theme-border/50">
            <span>🔊 Spoken Audio Briefing ({docMeta.nativeName})</span>
            <span className="text-[10px] text-theme-textMuted font-mono">Strictly {docMeta.name}</span>
          </div>
          <p className="italic font-sans whitespace-pre-wrap">{scriptToRead}</p>
        </div>
      )}

      {/* Voice warning only if browser fallback was used without native voice */}
      {voiceUnsupported && audioSource === "browser" && (
        <div className="mt-3 pt-3 border-t border-theme-border/50 flex items-center gap-2 text-[11px] text-amber-700">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{t.audio.voiceUnsupported}</span>
        </div>
      )}
    </GlassCard>
  );
}
