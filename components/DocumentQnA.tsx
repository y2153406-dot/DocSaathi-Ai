"use client";

import React, { useState, useRef, useEffect } from "react";
import { DocumentAnalysis, UILanguage } from "@/types";
import { MessageSquare, Send, Sparkles, User, Bot, Check, Copy, AlertTriangle, RefreshCw } from "lucide-react";

interface DocumentQnAProps {
  analysis: DocumentAnalysis;
  uiLang: UILanguage;
  apiKey?: string; // passed from page.tsx (session-stored key)
}

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  isError?: boolean;
}

// ──────────────────────────────────────────────────────────────
// Build a concise context string from the DocumentAnalysis so
// Gemini can ground its answers strictly in document facts.
// ──────────────────────────────────────────────────────────────
function buildDocumentContext(analysis: DocumentAnalysis): string {
  const lines: string[] = [];
  lines.push(`DOCUMENT TITLE: ${analysis.title}`);
  lines.push(`CATEGORY: ${analysis.category}`);
  lines.push(`TAGLINE: ${analysis.tagline}`);
  lines.push(`OFFICIAL SOURCE: ${analysis.officialSource || "Not mentioned"}`);
  lines.push(`OFFICIAL PORTAL: ${analysis.portalUrl || "Not mentioned"}`);
  lines.push(`KEY HIGHLIGHT: ${analysis.keyHighlight}`);

  lines.push("\nSIMPLE SUMMARY:");
  analysis.simpleSummary.forEach((s, i) => lines.push(`  ${i + 1}. ${s}`));

  lines.push("\nIMPORTANT DATES & DEADLINES:");
  analysis.importantDates.forEach((d) =>
    lines.push(`  • ${d.title}: ${d.date}${d.daysLeft !== undefined ? ` (${d.daysLeft} days remaining)` : ""}`)
  );

  lines.push("\nELIGIBILITY CRITERIA:");
  analysis.eligibility.forEach((e) => lines.push(`  • ${e.field}: ${e.requirement}`));

  lines.push("\nFEES & FINANCIAL DETAILS:");
  lines.push(`  Overview: ${analysis.financials.overview}`);
  analysis.financials.items.forEach((f) =>
    lines.push(`  • ${f.category}: ${f.amount}${f.details ? ` — ${f.details}` : ""}`)
  );
  if (analysis.financials.importantNote) {
    lines.push(`  Note: ${analysis.financials.importantNote}`);
  }

  lines.push("\nREQUIRED DOCUMENTS:");
  analysis.requiredDocuments.forEach((d) =>
    lines.push(`  • ${d.name} (${d.mandatory ? "Mandatory" : "Optional"})${d.notes ? `: ${d.notes}` : ""}`)
  );

  lines.push("\nNEXT STEPS / ACTION PLAN:");
  analysis.nextSteps.forEach((s) => lines.push(`  ${s.step}. ${s.title}: ${s.description}`));

  if (analysis.unclearOrMissingInfo && analysis.unclearOrMissingInfo.length > 0) {
    lines.push("\nUNCLEAR OR MISSING INFORMATION IN DOCUMENT:");
    analysis.unclearOrMissingInfo.forEach((u) => lines.push(`  • ${u}`));
  }

  if (analysis.faq && analysis.faq.length > 0) {
    lines.push("\nFREQUENTLY ASKED QUESTIONS FROM DOCUMENT:");
    analysis.faq.forEach((f) => lines.push(`  Q: ${f.question}\n  A: ${f.answer}`));
  }

  if (analysis.warnings && analysis.warnings.length > 0) {
    lines.push("\nWARNINGS:");
    analysis.warnings.forEach((w) => lines.push(`  ⚠ ${w}`));
  }

  return lines.join("\n");
}

export const DocumentQnA: React.FC<DocumentQnAProps> = ({ analysis, uiLang, apiKey }) => {
  const documentContext = useRef<string>(buildDocumentContext(analysis));

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-msg",
      sender: "ai",
      text:
        uiLang === "hi"
          ? `नमस्ते! मैं इस दस्तावेज़ (${analysis.title}) का DocSaathi AI सहायक हूँ। तारीखें, पात्रता, फ़ीस या कागज़ात – कुछ भी पूछें, मैं केवल इस दस्तावेज़ के आधार पर उत्तर दूंगा।`
          : `Hello! I'm DocSaathi AI assistant for "${analysis.title}". Ask me anything — dates, eligibility, fees, required documents. I answer strictly from this document's content.`,
      timestamp: "Just now",
    },
  ]);
  const [inputQuery, setInputQuery] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  // ── Call /api/qa (server-side Gemini) ────────────────────
  const fetchGeminiAnswer = async (question: string): Promise<string> => {
    const res = await fetch("/api/qa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question,
        documentContext: documentContext.current,
        language: analysis.language,
        apiKey: apiKey || "",
      }),
    });

    const json = await res.json();

    if (!res.ok || !json.success) {
      // Surface a user-friendly error
      if (json.code === "MISSING_API_KEY" || json.code === "INVALID_API_KEY") {
        throw new Error(
          uiLang === "hi"
            ? "Gemini API key सेट नहीं है। ऊपर 'API Key Setup' बटन से अपनी key दर्ज करें।"
            : "Gemini API key not configured. Click the 'API Key Setup' button in the top menu."
        );
      }
      throw new Error(json.error || (uiLang === "hi" ? "उत्तर प्राप्त नहीं हो सका।" : "Could not get an answer."));
    }

    return json.answer as string;
  };

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || isThinking) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery("");
    setIsThinking(true);

    try {
      const answer = await fetchGeminiAnswer(query);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: "ai",
          text: answer,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: "ai",
          text: err?.message || (uiLang === "hi" ? "कुछ गड़बड़ हो गई, दोबारा कोशिश करें।" : "Something went wrong. Please try again."),
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isError: true,
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-card p-6 sm:p-7 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              {uiLang === "hi" ? "इस दस्तावेज़ के बारे में सवाल पूछें" : "Ask Questions About This Document"}
            </h3>
            <p className="text-xs text-slate-500">
              {apiKey
                ? uiLang === "hi"
                  ? "🟢 AI केवल इस दस्तावेज़ के तथ्यों के आधार पर उत्तर देगा।"
                  : "🟢 Powered by Google Gemini — answers grounded strictly in this document."
                : uiLang === "hi"
                ? "🟡 API key सेट करें लाइव AI उत्तरों के लिए।"
                : "🟡 Set API key for live AI answers."}
            </p>
          </div>
        </div>
      </div>

      {/* No API key banner */}
      {!apiKey && (
        <div className="flex items-start space-x-3 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>
            {uiLang === "hi"
              ? "Gemini API key उपलब्ध नहीं है। लाइव AI Q&A के लिए ऊपर नेवबार में 'API Key Setup' बटन क्लिक करें।"
              : "Gemini API key not found. Click 'API Key Setup' in the navbar for live AI-powered Q&A from this document."}
          </span>
        </div>
      )}

      {/* Suggested Quick Question Chips */}
      {analysis.faq.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500 mr-1.5" />
            {uiLang === "hi" ? "त्वरित सवाल (क्लिक करें):" : "Suggested Quick Questions:"}
          </p>
          <div className="flex flex-wrap gap-2">
            {analysis.faq.slice(0, 4).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSend(item.question)}
                disabled={isThinking}
                className="text-left text-xs bg-indigo-50/70 hover:bg-indigo-100/80 text-indigo-900 font-medium px-3 py-1.5 rounded-xl border border-indigo-200/70 transition-all hover:scale-[1.02] disabled:opacity-50"
              >
                {item.question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Messages Log */}
      <div className="max-h-80 overflow-y-auto space-y-3 p-4 rounded-2xl bg-slate-50/60 border border-slate-200/70">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start space-x-2.5 ${m.sender === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
          >
            {/* Avatar */}
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                m.sender === "user"
                  ? "bg-indigo-600 text-white"
                  : m.isError
                  ? "bg-rose-100 text-rose-700"
                  : "bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-xs"
              }`}
            >
              {m.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Bubble */}
            <div
              className={`max-w-[85%] rounded-2xl p-3 text-xs sm:text-sm leading-relaxed relative group ${
                m.sender === "user"
                  ? "bg-indigo-600 text-white rounded-tr-none shadow-xs"
                  : m.isError
                  ? "bg-rose-50 text-rose-900 rounded-tl-none border border-rose-200"
                  : "bg-white text-slate-800 rounded-tl-none border border-slate-200 shadow-xs"
              }`}
            >
              <div className="whitespace-pre-line">{m.text}</div>
              <div
                className={`flex items-center justify-between text-[10px] mt-1.5 ${
                  m.sender === "user" ? "text-indigo-200" : "text-slate-400"
                }`}
              >
                <span>{m.timestamp}</span>
                {m.sender === "ai" && !m.isError && (
                  <button
                    onClick={() => copyToClipboard(m.text, m.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 text-slate-500 hover:text-indigo-600"
                    title="Copy Answer"
                  >
                    {copiedId === m.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  </button>
                )}
                {m.isError && (
                  <button
                    onClick={() => handleSend(messages[messages.indexOf(m) - 1]?.text)}
                    className="flex items-center ml-2 text-rose-600 hover:text-rose-800"
                    title="Retry"
                  >
                    <RefreshCw className="w-3 h-3 mr-0.5" />
                    {uiLang === "hi" ? "पुनः प्रयास" : "Retry"}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {isThinking && (
          <div className="flex items-center space-x-2 text-xs text-slate-500 p-2">
            <Bot className="w-4 h-4 text-indigo-600 animate-bounce" />
            <span className="italic">
              {uiLang === "hi" ? "दस्तावेज़ से उत्तर खोजा जा रहा है..." : "Searching document for your answer..."}
            </span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Field */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center space-x-2"
      >
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder={
            uiLang === "hi"
              ? "उदा. क्या फाइनल ईयर वाले भर सकते हैं? अंतिम तिथि कब है?"
              : "e.g. Can final year students apply? What is the last date?"
          }
          className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          disabled={isThinking}
        />
        <button
          type="submit"
          disabled={!inputQuery.trim() || isThinking}
          className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-semibold text-sm transition-all flex items-center shadow-md shadow-indigo-600/20 active:scale-95"
        >
          <Send className="w-4 h-4 mr-1.5" />
          <span>{uiLang === "hi" ? "पूछें" : "Ask"}</span>
        </button>
      </form>

      {/* AI Disclaimer */}
      <p className="text-[11px] text-slate-400 text-center">
        {uiLang === "hi"
          ? "DocSaathi AI केवल अपलोड किए गए दस्तावेज़ के तथ्यों के आधार पर उत्तर देता है। महत्वपूर्ण जानकारी आधिकारिक स्रोत से सत्यापित करें।"
          : "DocSaathi AI answers only from this document. Always verify critical information against the official source."}
      </p>
    </div>
  );
};
