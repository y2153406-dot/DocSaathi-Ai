"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { SupportedLanguage } from "@/types/api";

const BCP47_LANGUAGE_MAP: Record<SupportedLanguage, string[]> = {
  en: ["en-IN", "en-US", "en-GB", "en"],
  hi: ["hi-IN", "hi"],
  gu: ["gu-IN", "gu"],
  mr: ["mr-IN", "mr"],
  pa: ["pa-IN", "pa-Guru-IN", "pa"],
  bn: ["bn-IN", "bn-BD", "bn"],
  ta: ["ta-IN", "ta-LK", "ta"],
  te: ["te-IN", "te"],
  kn: ["kn-IN", "kn"],
  ml: ["ml-IN", "ml"],
  or: ["or-IN", "or"],
  as: ["as-IN", "bn-IN", "as"],
  ur: ["ur-IN", "ur-PK", "ur"],
  ks: ["ks-IN", "ur-IN", "ks"],
  sa: ["sa-IN", "hi-IN", "sa"],
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:8000";

export function useSpeechSynthesis() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rate, setRateState] = useState<number>(1);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [audioSource, setAudioSource] = useState<"neural" | "browser" | null>(null);
  const [voiceUnsupported, setVoiceUnsupported] = useState(false);

  // Audio elements & speech refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const availableVoicesRef = useRef<SpeechSynthesisVoice[]>([]);
  const utteranceQueueRef = useRef<SpeechSynthesisUtterance[]>([]);
  const isPlayingRef = useRef(false);

  // Sync ref
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Load browser voices
  useEffect(() => {
    if (typeof window === "undefined") return;

    const loadVoices = () => {
      if ("speechSynthesis" in window) {
        availableVoicesRef.current = window.speechSynthesis.getVoices();
      }
    };

    loadVoices();
    if ("speechSynthesis" in window) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    // Cleanup audio on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current = null;
      }
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const findBestBrowserVoice = useCallback(
    (lang: SupportedLanguage): SpeechSynthesisVoice | null => {
      const voices = availableVoicesRef.current;
      if (!voices.length) return null;
      const targetTags = BCP47_LANGUAGE_MAP[lang] || ["en-IN", "en"];

      // 1. Exact match
      for (const tag of targetTags) {
        const exact = voices.find((v) => v.lang.toLowerCase() === tag.toLowerCase());
        if (exact) return exact;
      }

      // 2. Prefix match
      for (const tag of targetTags) {
        const prefix = tag.split("-")[0].toLowerCase();
        const partial = voices.find((v) => v.lang.toLowerCase().startsWith(prefix));
        if (partial) return partial;
      }

      // Only return an Indian English voice if the target language is actually English
      if (lang === "en") {
        const indianVoice = voices.find((v) => v.lang.toLowerCase().includes("in"));
        if (indianVoice) return indianVoice;
      }

      // If no matching voice for non-English, return null so browser doesn't try English TTS on Indic script
      return null;
    },
    []
  );

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    utteranceQueueRef.current = [];
    setIsPlaying(false);
    setIsPaused(false);
    setIsLoading(false);
    setCurrentTime(0);
    setAudioSource(null);
  }, []);

  const pause = useCallback(() => {
    if (audioRef.current && isPlaying && !isPaused) {
      audioRef.current.pause();
      setIsPaused(true);
      setIsPlaying(false);
      return;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window && isPlaying) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsPlaying(false);
    }
  }, [isPlaying, isPaused]);

  const resume = useCallback(() => {
    if (audioRef.current && isPaused) {
      audioRef.current.play().catch(() => {});
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window && isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
    }
  }, [isPaused]);

  const setRate = useCallback((newRate: number) => {
    setRateState(newRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = newRate;
    }
  }, []);

  const seek = useCallback((time: number) => {
    if (audioRef.current && isFinite(time)) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  // Browser Web Speech fallback (sentence chunking)
  const playViaBrowserSpeech = useCallback(
    (text: string, lang: SupportedLanguage) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) {
        setIsLoading(false);
        return;
      }

      window.speechSynthesis.cancel();
      setAudioSource("browser");

      // Split into sentence chunks to bypass Chromium 15s freeze bug
      const chunks = text
        .split(/([।\.!\?\n]+)/)
        .filter((c) => c.trim().length > 0);

      if (!chunks.length) {
        chunks.push(text);
      }

      const voice = findBestBrowserVoice(lang);
      const targetTag = BCP47_LANGUAGE_MAP[lang]?.[0] || "hi-IN";

      if (!voice && lang !== "en") {
        setVoiceUnsupported(true);
      } else {
        setVoiceUnsupported(false);
      }

      let currentIdx = 0;
      const speakNextChunk = () => {
        if (currentIdx >= chunks.length || !isPlayingRef.current) {
          setIsPlaying(false);
          setIsPaused(false);
          setIsLoading(false);
          return;
        }

        const chunkText = chunks[currentIdx];
        currentIdx++;

        const utterance = new SpeechSynthesisUtterance(chunkText);
        utterance.rate = rate;
        utterance.lang = targetTag;
        if (voice) {
          utterance.voice = voice;
        }

        utterance.onstart = () => {
          setIsPlaying(true);
          setIsPaused(false);
          setIsLoading(false);
        };

        utterance.onend = () => {
          speakNextChunk();
        };

        utterance.onerror = () => {
          speakNextChunk();
        };

        currentUtteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
      };

      setIsPlaying(true);
      speakNextChunk();
    },
    [findBestBrowserVoice, rate]
  );

  // Master Play: High-Fidelity Neural Audio first, Browser TTS fallback
  const play = useCallback(
    (text: string, lang: SupportedLanguage = "en", documentId?: string) => {
      // Reset any active playback
      stop();

      setIsLoading(true);

      // Determine Audio Stream URL
      let streamUrl: string;
      if (documentId && documentId.startsWith("doc-")) {
        streamUrl = `${API_BASE_URL}/api/documents/${documentId}/audio/`;
      } else {
        // Use generic TTS endpoint with encoded text
        const safeText = encodeURIComponent(text.slice(0, 400));
        streamUrl = `${API_BASE_URL}/api/tts/?language=${encodeURIComponent(lang)}&text=${safeText}`;
      }

      // Try High-Fidelity HTML5 Audio
      try {
        const audio = new Audio();
        audio.preload = "auto";
        audio.playbackRate = rate;

        audio.oncanplay = () => {
          setIsLoading(false);
        };

        audio.onplay = () => {
          setIsPlaying(true);
          setIsPaused(false);
          setIsLoading(false);
          setAudioSource("neural");
          setVoiceUnsupported(false);
        };

        audio.ontimeupdate = () => {
          setCurrentTime(audio.currentTime);
          if (isFinite(audio.duration) && audio.duration > 0) {
            setDuration(audio.duration);
          }
        };

        audio.onpause = () => {
          if (audio.currentTime < audio.duration) {
            setIsPaused(true);
            setIsPlaying(false);
          }
        };

        audio.onended = () => {
          setIsPlaying(false);
          setIsPaused(false);
          setCurrentTime(0);
        };

        audio.onerror = (e) => {
          console.warn("[DocSaathi Audio] Neural stream failed, falling back to browser speech:", e);
          audioRef.current = null;
          playViaBrowserSpeech(text, lang);
        };

        audioRef.current = audio;
        audio.src = streamUrl;
        audio.play().catch((err) => {
          console.warn("[DocSaathi Audio] Autoplay or network error, falling back:", err);
          playViaBrowserSpeech(text, lang);
        });
      } catch (err) {
        console.warn("[DocSaathi Audio] HTML5 Audio creation failed:", err);
        playViaBrowserSpeech(text, lang);
      }
    },
    [rate, stop, playViaBrowserSpeech]
  );

  return {
    play,
    pause,
    resume,
    stop,
    isPlaying,
    isPaused,
    isLoading,
    rate,
    setRate,
    currentTime,
    duration,
    seek,
    audioSource,
    voiceUnsupported,
    isSupported: true,
  };
}
