"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import {
  AnalysisResponse,
  ChatMessage,
  SupportedLanguage,
  ActionChecklistItem,
} from "@/types/api";
import {
  analyzeDocumentApi,
  askDocumentApi,
  getDocumentApi,
  deleteDocumentApi,
  listDocumentsApi,
  toggleChecklistItemApi,
  ApiError,
} from "@/lib/api";
import { getMockAnalysis, MOCK_NOTICES } from "@/lib/mockService";
import { useLanguage } from "./LanguageContext";

export interface SavedDocSummary {
  documentId: string;
  filename: string;
  fileHash?: string;
  fileSize?: number;
  language: string;
  region?: string;
  category?: string;
  status: string;
  title: string;
  documentType: string;
  totalTasks: number;
  completedTasks: number;
  createdAt: string;
  isMock?: boolean;
}

interface AnalysisContextType {
  file: File | null;
  setFile: (file: File | null) => void;
  filePreviewUrl: string | null;
  analysis: AnalysisResponse | null;
  setAnalysis: (res: AnalysisResponse | null) => void;
  isAnalyzing: boolean;
  analyzingStep: number;
  analysisError: { message: string; code?: string; details?: string | null } | null;
  clearAnalysisError: () => void;
  runAnalysis: (targetLang?: SupportedLanguage, category?: string) => Promise<boolean>;
  
  // Document Operations
  loadDocument: (documentId: string) => Promise<void>;
  deleteDocument: (documentId: string) => Promise<void>;
  savedDocuments: SavedDocSummary[];
  refreshDocumentsList: () => Promise<void>;

  // Checklist State & DB Persistence
  completedTasks: Record<string, boolean>;
  toggleTask: (taskId: string) => void;
  resetChecklist: () => void;
  completedTasksCount: number;
  totalTasksCount: number;
  checklistProgress: number;

  // Q&A State & DB Persistence
  chatMessages: ChatMessage[];
  isAsking: boolean;
  askQuestion: (question: string) => Promise<void>;

  // Mock / Sample Notice Explorer
  isMockMode: boolean;
  setIsMockMode: (mode: boolean) => void;
  loadPresetNotice: (presetId: string) => void;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export function AnalysisProvider({ children }: { children: ReactNode }) {
  const { language } = useLanguage();
  const [file, setFileState] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzingStep, setAnalyzingStep] = useState(1);
  const [analysisError, setAnalysisError] = useState<{
    message: string;
    code?: string;
    details?: string | null;
  } | null>(null);

  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isAsking, setIsAsking] = useState(false);
  const [isMockMode, setIsMockMode] = useState(false);
  const [savedDocuments, setSavedDocuments] = useState<SavedDocSummary[]>([]);

  // Fetch real document list from backend
  const refreshDocumentsList = useCallback(async () => {
    try {
      const data = await listDocumentsApi();
      if (data && data.documents) {
        setSavedDocuments(data.documents);
      }
    } catch {
      // Offline or network error
    }
  }, []);

  useEffect(() => {
    refreshDocumentsList();
  }, [refreshDocumentsList]);

  const setFile = (newFile: File | null) => {
    setFileState(newFile);
    setAnalysis(null);
    setAnalysisError(null);
    setCompletedTasks({});
    setChatMessages([]);

    if (filePreviewUrl) {
      URL.revokeObjectURL(filePreviewUrl);
      setFilePreviewUrl(null);
    }
    if (newFile && newFile.type.startsWith("image/")) {
      setFilePreviewUrl(URL.createObjectURL(newFile));
    }
  };

  const clearAnalysisError = () => setAnalysisError(null);

  // Load a document from backend DB by ID
  const loadDocument = async (documentId: string) => {
    // If mock ID, load mock preset
    if (documentId.startsWith("mock-")) {
      const presetId = documentId.replace("mock-", "");
      loadPresetNotice(presetId);
      return;
    }

    setIsAnalyzing(true);
    setAnalysis(null);
    setAnalysisError(null);
    setCompletedTasks({});
    setChatMessages([]);

    try {
      const docData = await getDocumentApi(documentId);
      setAnalysis(docData);

      // Restore checklist status
      const completedMap: Record<string, boolean> = {};
      (docData.actionChecklist || []).forEach((item: ActionChecklistItem) => {
        if (item.isCompleted) {
          completedMap[item.id] = true;
        }
      });
      setCompletedTasks(completedMap);

      // Restore chat history with both user questions and AI answers
      if (docData.chatHistory && Array.isArray(docData.chatHistory)) {
        const restoredChats: ChatMessage[] = [];
        docData.chatHistory.forEach((ch: any) => {
          if (ch.question) {
            restoredChats.push({
              id: `u-${ch.id}`,
              sender: "user",
              text: ch.question,
              question: ch.question,
              timestamp: ch.timestamp || "Earlier",
            });
          }
          if (ch.answer) {
            restoredChats.push({
              id: `ai-${ch.id}`,
              sender: "ai",
              text: ch.answer,
              answer: ch.answer,
              answerEnglish: ch.answerEnglish,
              sourceSnippet: ch.sourceSnippet,
              confidence: ch.confidence,
              isGrounded: ch.isGrounded,
              timestamp: ch.timestamp || "Earlier",
            });
          }
        });
        setChatMessages(restoredChats);
      }
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setAnalysisError({
          message: err.message,
          code: err.code,
          details: err.details,
        });
      } else {
        setAnalysisError({
          message: `Failed to load document '${documentId}'.`,
          code: "LOAD_ERROR",
        });
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Delete document
  const deleteDocument = async (documentId: string) => {
    try {
      await deleteDocumentApi(documentId);
      if (analysis && analysis.documentId === documentId) {
        setAnalysis(null);
        setCompletedTasks({});
        setChatMessages([]);
      }
      await refreshDocumentsList();
    } catch (err: unknown) {
      console.error("Failed to delete document:", err);
    }
  };

  // Run fresh analysis on uploaded file
  const runAnalysis = async (targetLang?: SupportedLanguage, category?: string): Promise<boolean> => {
    if (!file) {
      setAnalysisError({
        message: "No document selected. Please select a PDF or image file first.",
        code: "NO_FILE_SELECTED",
      });
      return false;
    }

    if (isAnalyzing) return false;

    const lang = targetLang || language;
    setIsAnalyzing(true);
    setAnalysis(null);
    setAnalysisError(null);
    setCompletedTasks({});
    setChatMessages([]);
    setAnalyzingStep(1);

    const stepInterval = setInterval(() => {
      setAnalyzingStep((prev) => (prev < 4 ? prev + 1 : prev));
    }, 900);

    try {
      const result = await analyzeDocumentApi(file, lang, category);
      setAnalysis(result);
      setCompletedTasks({});
      setChatMessages([]);

      // Refresh list to include newly saved document
      await refreshDocumentsList();
      return true;
    } catch (err: unknown) {
      setAnalysis(null);
      if (err instanceof ApiError) {
        setAnalysisError({
          message: err.message,
          code: err.code,
          details: err.details,
        });
      } else {
        setAnalysisError({
          message: "Failed to analyze document. Please check network connection or try again.",
          code: "UNKNOWN_ERROR",
        });
      }
      return false;
    } finally {
      clearInterval(stepInterval);
      setIsAnalyzing(false);
    }
  };

  // Toggle checklist item with DB persistence
  const toggleTask = (taskId: string) => {
    const nextState = !completedTasks[taskId];
    setCompletedTasks((prev) => ({
      ...prev,
      [taskId]: nextState,
    }));

    // If active document is saved in backend, persist the change to Django database
    if (analysis && analysis.documentId && !analysis.documentId.startsWith("mock-")) {
      toggleChecklistItemApi(analysis.documentId, taskId, nextState)
        .then(() => refreshDocumentsList())
        .catch((e) => console.warn("Failed to persist checklist state:", e));
    }
  };

  const resetChecklist = () => {
    setCompletedTasks({});
  };

  const checklistItems: ActionChecklistItem[] = analysis?.actionChecklist || [];
  const totalTasksCount = checklistItems.length;
  const completedTasksCount = checklistItems.filter(
    (item) => !!completedTasks[item.id]
  ).length;
  const checklistProgress =
    totalTasksCount > 0
      ? Math.round((completedTasksCount / totalTasksCount) * 100)
      : 0;

  // Ask question with DB persistence
  const askQuestion = async (question: string) => {
    if (!analysis || !question.trim()) return;

    const nowStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: question.trim(),
      question: question.trim(),
      timestamp: nowStr,
    };
    setChatMessages((prev) => [...prev, userMsg]);

    setIsAsking(true);
    try {
      const response = await askDocumentApi(
        analysis.documentId,
        question,
        language
      );

      const aiMsg: ChatMessage = {
        id: response.id || `ai-${Date.now()}`,
        sender: "ai",
        text: response.answer,
        answer: response.answer,
        answerEnglish: response.answerEnglish,
        sourceSnippet: response.sourceSnippet,
        confidence: response.confidence,
        isGrounded: response.isGrounded,
        timestamp: response.timestamp || nowStr,
      };

      setChatMessages((prev) => [...prev, aiMsg]);
    } catch (error: unknown) {
      const fallbackMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: "ai",
        text: "I couldn't process this question right now. Please try again.",
        answer: "I couldn't process this question right now. Please try again.",
        answerEnglish: "I couldn't process this question right now. Please try again.",
        timestamp: nowStr,
      };
      setChatMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsAsking(false);
    }
  };

  // Mock notice loader for testing & UI preview
  const loadPresetNotice = (presetId: string) => {
    const mock = getMockAnalysis(presetId, language);
    setAnalysis(mock);
    setCompletedTasks({});
    setChatMessages([]);
  };

  return (
    <AnalysisContext.Provider
      value={{
        file,
        setFile,
        filePreviewUrl,
        analysis,
        setAnalysis,
        isAnalyzing,
        analyzingStep,
        analysisError,
        clearAnalysisError,
        runAnalysis,
        loadDocument,
        deleteDocument,
        savedDocuments,
        refreshDocumentsList,
        completedTasks,
        toggleTask,
        resetChecklist,
        completedTasksCount,
        totalTasksCount,
        checklistProgress,
        chatMessages,
        isAsking,
        askQuestion,
        isMockMode,
        setIsMockMode,
        loadPresetNotice,
      }}
    >
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysis() {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error("useAnalysis must be used within an AnalysisProvider");
  }
  return context;
}
