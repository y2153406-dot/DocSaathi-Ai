"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { SupportedLanguage } from "@/types/api";

const SPEECH_LANG_MAP: Record<SupportedLanguage, string> = {
  en: "en-IN",
  hi: "hi-IN",
  gu: "gu-IN",
  mr: "mr-IN",
  pa: "pa-IN",
  bn: "bn-IN",
  ta: "ta-IN",
  te: "te-IN",
  kn: "kn-IN",
  ml: "ml-IN",
  or: "or-IN",
  as: "as-IN",
  ur: "ur-IN",
  ks: "ur-IN",
  sa: "hi-IN",
};

interface SpeechRecognitionHook {
  isSupported: boolean;
  isListening: boolean;
  startListening: (onResult: (text: string) => void) => void;
  stopListening: () => void;
  error: string | null;
  clearError: () => void;
}

export function useSpeechRecognition(language: SupportedLanguage = "en"): SpeechRecognitionHook {
  const [isSupported, setIsSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const onResultCallbackRef = useRef<((text: string) => void) | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        setIsSupported(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
          setIsListening(true);
          setError(null);
        };

        recognition.onresult = (event: any) => {
          let currentTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          if (onResultCallbackRef.current && currentTranscript) {
            onResultCallbackRef.current(currentTranscript);
          }
        };

        recognition.onerror = (event: any) => {
          setIsListening(false);
          if (event.error === "not-allowed") {
            setError("Microphone permission denied. Please allow microphone access in your browser.");
          } else if (event.error === "no-speech") {
            // User didn't speak, not a fatal error
          } else if (event.error === "language-not-supported") {
            setError(`Speech recognition is not supported for this dialect in this browser. Falling back to English.`);
          } else {
            setError(`Speech recognition notice: ${event.error}`);
          }
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      } else {
        setIsSupported(false);
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // Ignore
        }
      }
    };
  }, []);

  const startListening = useCallback(
    (onResult: (text: string) => void) => {
      if (!recognitionRef.current) {
        setError("Speech recognition is not supported on this browser. Chrome or Edge is recommended.");
        return;
      }

      setError(null);
      onResultCallbackRef.current = onResult;

      try {
        const bcp47 = SPEECH_LANG_MAP[language] || "en-IN";
        recognitionRef.current.lang = bcp47;
        recognitionRef.current.start();
      } catch (err: any) {
        // If already started or failed
        try {
          recognitionRef.current.stop();
        } catch {
          // Ignore
        }
      }
    },
    [language]
  );

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Ignore
      }
    }
    setIsListening(false);
  }, []);

  const clearError = () => setError(null);

  return {
    isSupported,
    isListening,
    startListening,
    stopListening,
    error,
    clearError,
  };
}
