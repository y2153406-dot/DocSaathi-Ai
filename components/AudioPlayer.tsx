"use client";

import React, { useState, useEffect, useRef } from "react";
import { ExplanationLanguage, UILanguage } from "@/types";
import { Volume2, VolumeX, Play, Pause, RotateCcw, Sparkles } from "lucide-react";

interface AudioPlayerProps {
  textToSpeak: string;
  language: ExplanationLanguage;
  uiLang: UILanguage;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  textToSpeak,
  language,
  uiLang,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [supported, setSupported] = useState(true);
  const [progress, setProgress] = useState(0);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Pick the best available voice for the selected language
  const pickBestVoice = (lang: typeof language) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
    const voices = window.speechSynthesis.getVoices();
    if (!voices.length) return null;

    if (lang === "hindi" || lang === "hinglish") {
      // Prefer hi-IN voices
      const hiIN = voices.find((v) => v.lang === "hi-IN");
      if (hiIN) return hiIN;
      const hi = voices.find((v) => v.lang.startsWith("hi"));
      if (hi) return hi;
    }
    // Fall back to en-IN → en-GB → en-US
    const enIN = voices.find((v) => v.lang === "en-IN");
    if (enIN) return enIN;
    const enGB = voices.find((v) => v.lang === "en-GB");
    if (enGB) return enGB;
    return voices.find((v) => v.lang.startsWith("en")) || null;
  };

  useEffect(() => {
    if (typeof window !== "undefined" && !("speechSynthesis" in window)) {
      setSupported(false);
      return;
    }
    // Voices may load asynchronously — pre-select once ready
    const loadVoices = () => {
      const v = pickBestVoice(language);
      setSelectedVoice(v);
    };
    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [language]);

  // Stop speech when document or text changes
  useEffect(() => {
    handleStop();
  }, [textToSpeak]);

  const startProgressSimulator = () => {
    setProgress(0);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    const durationEstimate = (textToSpeak.length / 15) * 1000; // rough ms
    const step = 200;
    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const next = prev + (step / durationEstimate) * 100;
        if (next >= 100) {
          clearInterval(progressIntervalRef.current!);
          return 100;
        }
        return next;
      });
    }, step);
  };

  const handlePlay = () => {
    if (!supported || typeof window === "undefined") return;

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utteranceRef.current = utterance;

    // Use the pre-selected best voice; fall back to lang tag
    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang;
    } else if (language === "hindi" || language === "hinglish") {
      utterance.lang = "hi-IN";
    } else {
      utterance.lang = "en-IN";
    }

    utterance.rate = speechRate;

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
      startProgressSimulator();
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setProgress(100);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handlePause = () => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsPlaying(false);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    }
  };

  const handleStop = () => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
      setProgress(0);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    }
  };

  const changeRate = (newRate: number) => {
    setSpeechRate(newRate);
    if (isPlaying) {
      handleStop();
      setTimeout(handlePlay, 100);
    }
  };

  return (
    <div className="bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-700 rounded-3xl p-5 sm:p-6 text-white shadow-xl shadow-indigo-600/20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Info */}
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/20">
            <Volume2 className="w-6 h-6 text-yellow-300" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-base font-bold">
                {uiLang === "hi" ? "ऑडियो वॉइस सारांश सुनें" : "Listen to Voice Briefing"}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/20 text-white uppercase tracking-wider">
                {language}
              </span>
            </div>
            <p className="text-xs text-indigo-100 mt-0.5">
              {uiLang === "hi"
                ? "इस दस्तावेज़ का आसान भाषा में वॉयसओवर सुनें"
                : "Spoken audio summary of this document in clear natural voice."}
            </p>
          </div>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3 self-end sm:self-center">
          {/* Rate pills */}
          <div className="flex items-center bg-black/20 p-1 rounded-xl text-xs font-semibold">
            {[1, 1.25, 1.5].map((rate) => (
              <button
                key={rate}
                type="button"
                onClick={() => changeRate(rate)}
                className={`px-2 py-1 rounded-lg transition-colors ${
                  speechRate === rate ? "bg-white text-indigo-900" : "text-white/80 hover:text-white"
                }`}
              >
                {rate}x
              </button>
            ))}
          </div>

          {/* Play/Pause Button */}
          {!isPlaying ? (
            <button
              type="button"
              onClick={handlePlay}
              className="inline-flex items-center px-4 py-2.5 rounded-xl bg-white text-indigo-950 font-bold text-xs sm:text-sm shadow-md hover:bg-yellow-300 hover:text-slate-900 transition-all hover:scale-105 active:scale-95"
            >
              <Play className="w-4 h-4 mr-1.5 fill-current" />
              {isPaused
                ? uiLang === "hi" ? "जारी रखें" : "Resume"
                : uiLang === "hi" ? "सुनें" : "Play Briefing"}
            </button>
          ) : (
            <button
              type="button"
              onClick={handlePause}
              className="inline-flex items-center px-4 py-2.5 rounded-xl bg-yellow-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md hover:bg-yellow-300 transition-all"
            >
              <Pause className="w-4 h-4 mr-1.5 fill-current" />
              {uiLang === "hi" ? "रोकें" : "Pause"}
            </button>
          )}

          {/* Reset */}
          <button
            type="button"
            onClick={handleStop}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Visualizer Waveform Bar */}
      <div className="mt-4 pt-4 border-t border-white/10 flex items-center space-x-3">
        <div className="flex-1 bg-white/20 h-2 rounded-full overflow-hidden">
          <div
            className="bg-yellow-300 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Animated equalizer waves when playing */}
        {isPlaying && (
          <div className="flex items-center space-x-1 h-4">
            <span className="w-1 bg-yellow-300 rounded-full animate-bounce h-3" />
            <span className="w-1 bg-yellow-300 rounded-full animate-bounce [animation-delay:0.15s] h-4" />
            <span className="w-1 bg-yellow-300 rounded-full animate-bounce [animation-delay:0.3s] h-2" />
            <span className="w-1 bg-yellow-300 rounded-full animate-bounce [animation-delay:0.45s] h-4" />
          </div>
        )}
      </div>
    </div>
  );
};
