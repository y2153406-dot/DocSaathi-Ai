import { NextRequest, NextResponse } from "next/server";
import { resolveBestModel, classifyGeminiError } from "@/lib/gemini-models";

// ──────────────────────────────────────────────────────────────
// POST /api/qa
//   Body (JSON): { question, documentContext, language, apiKey? }
//   Responds:    { success, answer } | { success: false, error, code }
// ──────────────────────────────────────────────────────────────

interface QARequestBody {
  question: string;
  documentContext: string;
  language?: string;
  apiKey?: string;
}

export async function POST(request: NextRequest) {
  try {
    // ── Parse JSON body ──────────────────────────────────────
    let body: QARequestBody;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON request body.", code: "BAD_REQUEST" },
        { status: 400 }
      );
    }

    const { question, documentContext, language = "english", apiKey: clientKey } = body;

    if (!question || typeof question !== "string" || question.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Question is required.", code: "MISSING_QUESTION" },
        { status: 400 }
      );
    }

    if (!documentContext || typeof documentContext !== "string" || documentContext.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Document context is required.", code: "MISSING_CONTEXT" },
        { status: 400 }
      );
    }

    // ── Resolve API key (server env first, then client-supplied) ─
    const resolvedKey = process.env.GEMINI_API_KEY?.trim() || clientKey?.trim() || "";

    if (!resolvedKey) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Gemini API key not configured. Set GEMINI_API_KEY in .env.local or provide it via the API Key Setup modal.",
          code: "MISSING_API_KEY",
        },
        { status: 401 }
      );
    }

    // ── Build language instruction ───────────────────────────
    let langInstruction = "Respond in clear English.";
    if (language === "hindi") {
      langInstruction = "आप हमेशा हिंदी में, सरल और स्पष्ट भाषा में उत्तर दें।";
    } else if (language === "hinglish") {
      langInstruction = "Please answer in Hinglish — a natural mix of Hindi and English, as spoken by students.";
    }

    // ── System instruction for strict grounding ─────────────
    const systemInstruction = `You are DocSaathi AI, a helpful assistant for Indian students and citizens.

You have been given extracted information from a document that the user uploaded.
Your ONLY job is to answer the user's question strictly using the provided document context.

CRITICAL RULES:
1. Answer ONLY from the facts in the document context below. Do NOT add outside knowledge.
2. If the document context does not contain the answer, say exactly: "This information is not found in the document. Please check the official portal or contact the issuing authority."
3. Never invent dates, fees, amounts, eligibility criteria, or rules that are not in the document.
4. Never make up or assume any government policy or regulation.
5. Keep answers concise and helpful.
6. ${langInstruction}

DOCUMENT CONTEXT:
${documentContext}`;

    // ── Call Gemini API ──────────────────────────────────────
    const { GoogleGenAI } = await import("@google/genai");
    const ai = new GoogleGenAI({ apiKey: resolvedKey });

    // Dynamically resolve best available model (cached per process)
    const primaryModel = await resolveBestModel(resolvedKey);

    // Build fallback list: primary first, then other candidates
    const modelsToTry = [
      primaryModel,
      ...["gemini-2.0-flash", "gemini-2.5-flash", "gemini-2.0-flash-lite"].filter(
        (m) => m !== primaryModel
      ),
    ];

    let answer: string | null = null;
    let lastError: any = null;

    for (const model of modelsToTry) {
      try {
        const result = await ai.models.generateContent({
          model,
          contents: [
            {
              role: "user",
              parts: [{ text: `User Question: ${question.trim()}` }],
            },
          ],
          config: {
            systemInstruction,
            temperature: 0.05,
            maxOutputTokens: 1024,
          },
        });

        const text =
          result?.candidates?.[0]?.content?.parts?.[0]?.text ||
          result?.text ||
          null;

        if (text && text.trim().length > 0) {
          answer = text.trim();
          console.log(`[DocSaathi/qa] Answer generated with model: ${model}`);
          break;
        }
      } catch (err: any) {
        lastError = err;
        const classified = classifyGeminiError(err);
        console.warn(`[DocSaathi/qa] Model ${model} failed (${classified.code}):`, err?.message);

        // Invalid key — stop immediately
        if (classified.code === "INVALID_API_KEY") {
          return NextResponse.json(
            { success: false, error: classified.message, code: classified.code },
            { status: 401 }
          );
        }
        // Quota — stop immediately
        if (classified.code === "QUOTA_EXCEEDED") {
          return NextResponse.json(
            { success: false, error: classified.message, code: classified.code },
            { status: 429 }
          );
        }
        // Model not found (404) — try next model
        continue;
      }
    }

    if (!answer) {
      const classified = lastError ? classifyGeminiError(lastError) : null;
      return NextResponse.json(
        {
          success: false,
          error: classified?.message || "Gemini API did not return a response. Please try again.",
          code: classified?.code || "GEMINI_NO_RESPONSE",
        },
        { status: classified?.httpStatus || 502 }
      );
    }

    return NextResponse.json({ success: true, answer });
  } catch (err: any) {
    console.error("[/api/qa] Unhandled error:", err);
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected server error occurred. Please try again.",
        code: "INTERNAL_ERROR",
      },
      { status: 500 }
    );
  }
}
