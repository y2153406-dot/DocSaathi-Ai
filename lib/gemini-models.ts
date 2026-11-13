/**
 * Gemini model resolution for DocSaathi AI.
 *
 * Problem: Model IDs that exist today may be deprecated tomorrow.
 * Solution: At runtime, dynamically pick the best available Flash model
 * that actually supports generateContent for the given API key.
 *
 * Model preference order (cost-effective → capable):
 *  1. gemini-2.0-flash        — stable, multimodal, free tier friendly
 *  2. gemini-2.5-flash        — more capable, thinking model
 *  3. gemini-2.0-flash-lite   — lightweight fallback
 *  4. gemini-1.5-flash-latest — last resort (may be deprecated)
 *
 * The list() call is cheap (<100ms) and results are cached per process lifetime.
 */

import { GoogleGenAI } from "@google/genai";

// Ordered preference list — we stop at the first one the API confirms available
const PREFERRED_MODELS = [
  "gemini-2.0-flash",
  "gemini-2.5-flash",
  "gemini-2.0-flash-lite",
  "gemini-1.5-flash-latest",
];

// Process-level cache: { apiKeyPrefix -> modelName }
// We use only the first 8 chars of the key as cache discriminator (never log the full key)
const resolvedModelCache = new Map<string, string>();

/**
 * Returns the best Gemini model name available for generateContent.
 * Queries the live API models.list on first call per key prefix; caches result.
 */
export async function resolveBestModel(apiKey: string): Promise<string> {
  const cacheKey = apiKey.slice(0, 8); // safe cache discriminator
  if (resolvedModelCache.has(cacheKey)) {
    return resolvedModelCache.get(cacheKey)!;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const availableNames = new Set<string>();

    // Paginate through all models
    const page = await ai.models.list();
    for await (const m of page) {
      if (m.name) {
        // SDK returns "models/gemini-2.0-flash" — strip the prefix
        const bare = m.name.replace(/^models\//, "");
        const actions: string[] = (m as any).supportedActions ?? [];
        // Only include models that explicitly support generateContent
        if (actions.length === 0 || actions.includes("generateContent")) {
          availableNames.add(bare);
        }
      }
    }

    // Pick first preferred model that is confirmed available
    for (const candidate of PREFERRED_MODELS) {
      if (availableNames.has(candidate)) {
        resolvedModelCache.set(cacheKey, candidate);
        console.log(`[DocSaathi] Selected Gemini model: ${candidate} (from ${availableNames.size} available)`);
        return candidate;
      }
    }

    // Fallback: pick any flash model from available set
    const anyFlash = [...availableNames].find(
      (n) => n.includes("flash") && !n.includes("thinking")
    );
    if (anyFlash) {
      resolvedModelCache.set(cacheKey, anyFlash);
      console.log(`[DocSaathi] Fallback Gemini model: ${anyFlash}`);
      return anyFlash;
    }
  } catch (err: any) {
    // If models.list itself fails (e.g. bad key), fall through to static default
    console.warn("[DocSaathi] models.list() failed:", err?.message);
  }

  // Static safe default — gemini-2.0-flash is the most broadly available model
  const staticDefault = "gemini-2.0-flash";
  resolvedModelCache.set(cacheKey, staticDefault);
  return staticDefault;
}

/**
 * Classify Gemini API errors into user-friendly codes.
 * Avoids falsely labelling a 404 (model not found) as an invalid key.
 */
export function classifyGeminiError(err: any): {
  code: string;
  message: string;
  httpStatus: number;
} {
  const msg: string = err?.message || String(err);
  const status: number = err?.status ?? err?.httpErrorCode ?? 0;

  if (status === 401 || msg.includes("API_KEY_INVALID") || msg.includes("PERMISSION_DENIED")) {
    return {
      code: "INVALID_API_KEY",
      message: "Invalid Gemini API key. Please check your key and try again.",
      httpStatus: 401,
    };
  }

  if (status === 404 || msg.includes("is not found") || msg.includes("not found for API version")) {
    return {
      code: "MODEL_NOT_FOUND",
      message:
        "The selected Gemini model is not available for your API key. The app will retry with another model automatically.",
      httpStatus: 502,
    };
  }

  if (status === 429 || msg.includes("RESOURCE_EXHAUSTED") || msg.includes("quota")) {
    return {
      code: "QUOTA_EXCEEDED",
      message: "Gemini API quota exceeded. Please wait a moment and try again, or upgrade your API plan.",
      httpStatus: 429,
    };
  }

  if (status === 400 || msg.includes("INVALID_ARGUMENT")) {
    return {
      code: "INVALID_REQUEST",
      message: `Invalid request sent to Gemini API: ${msg}`,
      httpStatus: 400,
    };
  }

  return {
    code: "GEMINI_API_ERROR",
    message: `Gemini API error: ${msg}`,
    httpStatus: 502,
  };
}
