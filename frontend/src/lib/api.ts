import {
  AnalysisResponse,
  AskQuestionResponse,
  SupportedLanguage,
  ApiErrorResponse,
  ActionChecklistItem,
  ChatMessage,
} from "@/types/api";
import {
  validateAnalysisResponse,
  validateAskQuestionResponse,
} from "./validations";
import { getMockAnalysis, getMockAnswer } from "./mockService";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:8000";

const SESSION_KEY = "docsaathi_session_id";

/**
 * Retrieves or initializes an anonymous, persistent session identifier
 */
export function getSessionId(): string {
  if (typeof window === "undefined") return "server-session";
  try {
    let sid = localStorage.getItem(SESSION_KEY);
    if (!sid) {
      sid = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
      localStorage.setItem(SESSION_KEY, sid);
    }
    return sid;
  } catch {
    return "default-session";
  }
}

export class ApiError extends Error {
  code: string;
  details?: string | null;
  status?: number;

  constructor(message: string, code = "API_ERROR", details?: string | null, status?: number) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.details = details;
    this.status = status;
  }
}

/**
 * Upload and analyze document via Gemini backend service
 * Endpoint: POST /api/documents/analyze/
 */
export async function analyzeDocumentApi(
  file: File,
  language: SupportedLanguage,
  category?: string,
  options?: { signal?: AbortSignal; forceMock?: boolean; region?: string }
): Promise<AnalysisResponse> {
  // If user explicitly requested mock mode in settings
  if (options?.forceMock) {
    await new Promise((resolve) => setTimeout(resolve, 1400));
    return getMockAnalysis("nsp-scholarship-2026", language);
  }

  const sessionId = getSessionId();
  const formData = new FormData();
  formData.append("file", file);
  formData.append("language", language);
  formData.append("session_id", sessionId);
  if (options?.region) {
    formData.append("region", options.region);
  }
  if (category) {
    formData.append("category", category);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout for heavy OCR/LLM
    const signal = options?.signal || controller.signal;

    const res = await fetch(`${API_BASE_URL}/api/documents/analyze/`, {
      method: "POST",
      headers: {
        "X-Session-ID": sessionId,
      },
      body: formData,
      signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      let errorBody: ApiErrorResponse | null = null;
      try {
        errorBody = await res.json();
      } catch {
        // Non-JSON error payload
      }

      if (errorBody && !errorBody.success && errorBody.error) {
        throw new ApiError(
          errorBody.error.message,
          errorBody.error.code,
          errorBody.error.details,
          res.status
        );
      }

      if (res.status === 413) {
        throw new ApiError(
          "Document exceeds size limit. Maximum allowed size is 15MB.",
          "FILE_TOO_LARGE",
          null,
          413
        );
      }

      if (res.status === 415) {
        throw new ApiError(
          "Unsupported document format. Please upload PDF, JPG, or PNG.",
          "UNSUPPORTED_FILE_TYPE",
          null,
          415
        );
      }

      throw new ApiError(
        `Backend service error (HTTP ${res.status}).`,
        "BACKEND_ERROR",
        res.statusText,
        res.status
      );
    }

    const json = await res.json();
    const parsed = validateAnalysisResponse(json);

    if (!parsed.success) {
      console.warn("Backend response format warning:", parsed.error);
      return json as AnalysisResponse;
    }

    return parsed.data as AnalysisResponse;
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      throw error;
    }

    const isAbort = error instanceof DOMException && error.name === "AbortError";
    if (isAbort) {
      throw new ApiError(
        "Analysis request timed out after 60 seconds. The server might be processing a large document.",
        "REQUEST_TIMEOUT"
      );
    }

    throw new ApiError(
      `Unable to reach backend service at ${API_BASE_URL}. Please ensure the Django backend is running.`,
      "NETWORK_ERROR",
      String(error)
    );
  }
}

/**
 * Ask document questions (Q&A)
 * Endpoint: POST /api/documents/ask/
 */
export async function askDocumentApi(
  documentId: string,
  question: string,
  language: SupportedLanguage,
  options?: { signal?: AbortSignal; forceMock?: boolean }
): Promise<AskQuestionResponse> {
  if (options?.forceMock || documentId.startsWith("mock-")) {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return getMockAnswer(documentId, question, language);
  }

  try {
    const res = await fetch(`${API_BASE_URL}/api/documents/ask/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Session-ID": getSessionId(),
      },
      body: JSON.stringify({
        document_id: documentId,
        documentId,
        question,
        language,
      }),
      signal: options?.signal,
    });

    if (!res.ok) {
      throw new ApiError(
        `Q&A backend service error (Status ${res.status}).`,
        "QA_BACKEND_ERROR",
        null,
        res.status
      );
    }

    const json = await res.json();
    const parsed = validateAskQuestionResponse(json);
    if (!parsed.success) {
      return json as AskQuestionResponse;
    }
    return parsed.data as AskQuestionResponse;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(
      `Unable to reach backend service at ${API_BASE_URL}.`,
      "QA_NETWORK_ERROR",
      String(error)
    );
  }
}

/**
 * Fetch a previously analyzed document from backend
 * Endpoint: GET /api/documents/{document_id}/
 */
export async function getDocumentApi(documentId: string): Promise<AnalysisResponse> {
  const res = await fetch(`${API_BASE_URL}/api/documents/${documentId}/`, {
    headers: {
      "X-Session-ID": getSessionId(),
    },
  });

  if (!res.ok) {
    throw new ApiError(
      `Failed to fetch document ${documentId}`,
      "FETCH_ERROR",
      res.statusText,
      res.status
    );
  }
  return res.json();
}

/**
 * Delete a document and its cascading records from backend
 * Endpoint: DELETE /api/documents/{document_id}/
 */
export async function deleteDocumentApi(
  documentId: string
): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API_BASE_URL}/api/documents/${documentId}/`, {
    method: "DELETE",
    headers: {
      "X-Session-ID": getSessionId(),
    },
  });

  if (!res.ok) {
    throw new ApiError(
      `Failed to delete document ${documentId}`,
      "DELETE_ERROR",
      res.statusText,
      res.status
    );
  }
  return res.json();
}

/**
 * List all saved documents for this session
 * Endpoint: GET /api/documents/
 */
export async function listDocumentsApi(): Promise<{
  success: boolean;
  documents: Array<{
    documentId: string;
    filename: string;
    fileHash: string;
    fileSize: number;
    language: string;
    region: string;
    category: string;
    status: string;
    title: string;
    documentType: string;
    totalTasks: number;
    completedTasks: number;
    createdAt: string;
  }>;
}> {
  const sid = getSessionId();
  const res = await fetch(`${API_BASE_URL}/api/documents/?session_id=${encodeURIComponent(sid)}`, {
    headers: {
      "X-Session-ID": sid,
    },
  });

  if (!res.ok) {
    throw new ApiError(
      `Failed to list documents`,
      "LIST_ERROR",
      res.statusText,
      res.status
    );
  }
  return res.json();
}

/**
 * Persist checklist item completion status to database
 * Endpoint: PATCH /api/documents/{document_id}/checklist/{item_id}/
 */
export async function toggleChecklistItemApi(
  documentId: string,
  itemId: string,
  isCompleted: boolean
): Promise<{ success: boolean; isCompleted: boolean; item: any }> {
  const res = await fetch(
    `${API_BASE_URL}/api/documents/${documentId}/checklist/${itemId}/`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-Session-ID": getSessionId(),
      },
      body: JSON.stringify({ is_completed: isCompleted }),
    }
  );

  if (!res.ok) {
    throw new ApiError(
      `Failed to update checklist item`,
      "CHECKLIST_UPDATE_ERROR",
      res.statusText,
      res.status
    );
  }
  return res.json();
}

/**
 * Retry analyzing a failed or previously uploaded document
 * Endpoint: POST /api/documents/{document_id}/retry/
 */
export async function retryDocumentApi(documentId: string): Promise<AnalysisResponse> {
  const res = await fetch(`${API_BASE_URL}/api/documents/${documentId}/retry/`, {
    method: "POST",
    headers: {
      "X-Session-ID": getSessionId(),
    },
  });

  if (!res.ok) {
    throw new ApiError(
      `Failed to retry document analysis`,
      "RETRY_ERROR",
      res.statusText,
      res.status
    );
  }
  return res.json();
}

/**
 * Health check endpoint
 * Endpoint: GET /api/health/
 */
export async function checkHealthApi(): Promise<any> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/health/`);
    if (!res.ok) return { status: "unhealthy", statusText: res.statusText };
    return res.json();
  } catch (error) {
    return { status: "offline", error: String(error) };
  }
}
