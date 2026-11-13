import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { DocumentCategory, ExplanationLanguage } from "@/types";
import { getPresetAnalysis, validateDocumentAnalysis } from "@/lib/analyzer";
import { resolveBestModel, classifyGeminiError } from "@/lib/gemini-models";

export const maxDuration = 60; // Allow sufficient time for multimodal PDF scanning

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const presetId = formData.get("presetId") as string | null;
    const category = ((formData.get("category") as DocumentCategory) || "other");
    const language = ((formData.get("language") as ExplanationLanguage) || "hindi");

    // Server-only environment variable reading, with optional client override for testing
    const serverApiKey = process.env.GEMINI_API_KEY?.trim();
    const clientApiKey = (
      req.headers.get("x-gemini-key") ||
      (formData.get("apiKey") as string | null)
    )?.trim();
    const apiKey = serverApiKey || clientApiKey;

    // 1. If it's a preloaded preset notice and no custom file is uploaded:
    const file = formData.get("file") as File | null;
    if (presetId && (!file || file.size === 0)) {
      const presetData = getPresetAnalysis(presetId, language);
      if (presetData) {
        return NextResponse.json({
          success: true,
          data: presetData,
          source: "preset_demo",
        });
      }
    }

    // 2. Validate uploaded file
    if (!file || file.size === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No file was uploaded. Please upload a PDF or image document.",
          code: "MISSING_FILE",
        },
        { status: 400 }
      );
    }

    // File size check
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: `File size exceeds the 15MB limit (Uploaded: ${(file.size / (1024 * 1024)).toFixed(1)}MB). Please upload a smaller file.`,
          code: "FILE_TOO_LARGE",
        },
        { status: 400 }
      );
    }

    // MIME type check
    const mimeType = file.type || "application/pdf";
    const isAllowedMime = ALLOWED_MIME_TYPES.some(
      (type) => mimeType.toLowerCase().startsWith(type) || file.name.match(/\.(pdf|jpe?g|png|webp)$/i)
    );

    if (!isAllowedMime) {
      return NextResponse.json(
        {
          success: false,
          error: "Unsupported file format. Please upload a PDF, JPG, PNG, or WEBP document.",
          code: "UNSUPPORTED_MEDIA_TYPE",
        },
        { status: 415 }
      );
    }

    // 3. API Key check
    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: "GEMINI_API_KEY is not configured in .env.local. Please add your GEMINI_API_KEY in .env.local on the server or enter it in the setup modal to analyze custom uploaded documents.",
          code: "MISSING_API_KEY",
        },
        { status: 401 }
      );
    }

    // 4. Convert file to base64 for multimodal ingestion
    const arrayBuffer = await file.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString("base64");

    // 5. Build strict prompt grounded in document facts
    const langInstructions = 
      language === "hindi"
        ? `Output Language: Pure, everyday Hindi (हिन्दी, Devanagari script).
All explanations, summary points, action steps, audioScript, and titles must be in accessible conversational Hindi that common citizens and students easily understand.
If any date, fee, eligibility rule, or document is not explicitly mentioned in the file, state: "दस्तावेज़ में उल्लेख नहीं है".`
        : language === "hinglish"
        ? `Output Language: Conversational Hinglish (Hindi written in Roman/English script, e.g. "Is notice ke mutabik last date... Apply karne ke liye scholarships portal par jayein...").
All text must be in natural Hinglish used by Indian students.
If any date, fee, eligibility rule, or document is not explicitly mentioned in the file, state: "Document mein mention nahi hai".`
        : `Output Language: Plain English with zero legal jargon or bureaucratic confusion.
If any date, fee, eligibility rule, or document is not explicitly mentioned in the file, state: "Not found in document".`;

    const systemInstruction = `You are DocSaathi AI, an expert document simplification assistant for India.
Your mission is to analyze official notices, circulars, college exam forms, scholarship guidelines, government schemes, and job notifications, converting intimidating legal jargon into crystal-clear actionable steps.

STRICT FACTUAL GROUNDING RULES:
1. NEVER invent, hallucinate, or assume any dates, deadlines, eligibility criteria, fees, or documents.
2. If any piece of information is missing, absent, or cannot be found in the document, you MUST explicitly write "${language === 'hindi' ? 'दस्तावेज़ में उल्लेख नहीं है' : language === 'hinglish' ? 'Document mein mention nahi hai' : 'Not found in document'}".
3. If dates or deadlines are ambiguous, specify that under "unclearOrMissingInfo".
4. Identify any missing official URLs, unclear verification procedures, or missing contact details and list them under "unclearOrMissingInfo".

${langInstructions}

OUTPUT SCHEMA:
Return ONLY a valid JSON object matching this exact structure:
{
  "title": "string (Concise official heading)",
  "tagline": "string (One line high-level summary)",
  "officialSource": "string (Issuing ministry, university, or department)",
  "portalUrl": "string (Official website URL if visible in document, else '')",
  "keyHighlight": "string (The single most important urgent takeaway or deadline)",
  "simpleSummary": [
    "string (3 to 5 bullet points explaining what this notice is about simply)"
  ],
  "importantDates": [
    {
      "title": "string (Milestone title, e.g. Application Deadline, Exam Date)",
      "date": "string (Exact date mentioned, or not found message)",
      "status": "urgent" | "active" | "future",
      "badge": "string (Short badge like 'Deadline', 'Exam', 'Start')",
      "daysLeft": 0
    }
  ],
  "eligibility": [
    {
      "field": "string (e.g. Qualification, Age, Income limit, Category)",
      "requirement": "string (Exact requirement stated)",
      "highlight": "string (Short tag)"
    }
  ],
  "financials": {
    "overview": "string (Overview of fees, stipends or subsidies)",
    "items": [
      {
        "category": "string (e.g. General Category Fee, Reserved, Concession)",
        "amount": "string (Exact amount or 'Free' or not found message)",
        "details": "string (Payment mode or specific note)"
      }
    ],
    "importantNote": "string (Warning against fraud, middlemen, or payment guidelines)"
  },
  "requiredDocuments": [
    {
      "name": "string (Document name)",
      "mandatory": true,
      "notes": "string (Attestation, format, or specifications)"
    }
  ],
  "nextSteps": [
    {
      "id": "step1",
      "step": 1,
      "title": "string (Clear action title)",
      "description": "string (Sequential instruction of what to do first, next, and finally)",
      "actionUrl": "string (URL if mentioned)"
    }
  ],
  "unclearOrMissingInfo": [
    "string (Explicit list of any crucial info omitted, missing helpline, absent links, or ambiguous clauses)"
  ],
  "audioScript": "string (A conversational 60-90 second spoken briefing script explaining this entire document simply as if talking directly to a friend)",
  "faq": [
    {
      "id": "q1",
      "question": "string (Most obvious practical doubt an applicant would ask)",
      "answer": "string (Strictly grounded factual answer from the document)"
    }
  ],
  "warnings": [
    "string (Any legal penalties, late fees, or strict instructions found in document)"
  ]
}`;

    // 6. Call Google Gen AI SDK — dynamically resolve best available model
    const ai = new GoogleGenAI({ apiKey });

    // Resolve the best model for this API key (cached after first call)
    const modelName = await resolveBestModel(apiKey);

    let rawResponseText = "";
    let lastError: any = null;

    // Try resolved model first, then fallback candidates
    const modelsToTry = [
      modelName,
      ...["gemini-2.0-flash", "gemini-2.5-flash", "gemini-2.0-flash-lite"].filter(
        (m) => m !== modelName
      ),
    ];

    for (const model of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: [
            {
              inlineData: {
                mimeType,
                data: base64Data,
              },
            },
            {
              text: `Analyze this uploaded document (${file.name}, Category: ${category}). Extract all dates, eligibility conditions, fees, documents, next actions, and ambiguities according to the system instructions.`,
            },
          ],
          config: {
            systemInstruction,
            responseMimeType: "application/json",
            temperature: 0.1,
          },
        });

        if (response && response.text) {
          rawResponseText = response.text;
          console.log(`[DocSaathi] Analysis succeeded with model: ${model}`);
          break;
        }
      } catch (err: any) {
        lastError = err;
        const classified = classifyGeminiError(err);
        console.warn(`[DocSaathi] Model ${model} failed (${classified.code}):`, err?.message);

        // If invalid API key — no point trying other models
        if (classified.code === "INVALID_API_KEY") {
          return NextResponse.json(
            { success: false, error: classified.message, code: classified.code },
            { status: 401 }
          );
        }
        // For quota errors — surface immediately
        if (classified.code === "QUOTA_EXCEEDED") {
          return NextResponse.json(
            { success: false, error: classified.message, code: classified.code },
            { status: 429 }
          );
        }
        // For 404 model-not-found — invalidate cache and try next model
        if (classified.code === "MODEL_NOT_FOUND") {
          const cacheKey = apiKey.slice(0, 8);
          // Force next call to re-resolve
          continue;
        }
      }
    }

    if (!rawResponseText) {
      const classified = lastError ? classifyGeminiError(lastError) : null;
      return NextResponse.json(
        {
          success: false,
          error: classified?.message || "Gemini did not return a response. Please try again.",
          code: classified?.code || "GEMINI_API_ERROR",
        },
        { status: classified?.httpStatus || 502 }
      );
    }

    // 7. Parse & Validate JSON
    const cleanJson = rawResponseText
      .replace(/^```json\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();

    let parsedJson: any;
    try {
      parsedJson = JSON.parse(cleanJson);
    } catch (parseErr) {
      console.error("Failed to parse Gemini response as JSON:", rawResponseText);
      return NextResponse.json(
        {
          success: false,
          error: "The AI model returned an unparseable response. Please retry.",
          code: "PARSE_ERROR",
        },
        { status: 502 }
      );
    }

    const validatedAnalysis = validateDocumentAnalysis(parsedJson, category, language, true);

    return NextResponse.json({
      success: true,
      data: validatedAnalysis,
      source: "gemini_live",
    });
  } catch (error: any) {
    console.error("Unhandled error in /api/analyze route:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "An unexpected error occurred while analyzing the document.",
        code: "INTERNAL_ERROR",
      },
      { status: 500 }
    );
  }
}
