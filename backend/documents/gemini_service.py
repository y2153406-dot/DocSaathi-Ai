"""
DocSaathi AI - Gemini Multimodal Document Understanding Engine.
Performs fresh, independent analysis on every uploaded document (PDF or Image)
using the Google Gemini Multimodal API.
"""
import os
import re
import time
import json
import base64
import hashlib
import logging
import mimetypes
from datetime import datetime
from typing import Dict, Any, Optional, Tuple, List
import requests

logger = logging.getLogger(__name__)

class GeminiServiceError(Exception):
    """Raised when Gemini API fails, is unreachable, or returns invalid output."""
    def __init__(self, message: str, code: str = "GEMINI_ERROR", details: Optional[str] = None):
        super().__init__(message)
        self.message = message
        self.code = code
        self.details = details

# Language Name Mapping for Prompt Context
LANGUAGE_NAMES: Dict[str, str] = {
    "en": "English",
    "hi": "Hindi (हिंदी)",
    "gu": "Gujarati (ગુજરાતી)",
    "mr": "Marathi (मराठी)",
    "pa": "Punjabi (ਪੰਜਾਬੀ)",
    "bn": "Bengali (বাংলা)",
    "ta": "Tamil (தமிழ்)",
    "te": "Telugu (తెలుగు)",
    "kn": "Kannada (ಕನ್ನಡ)",
    "ml": "Malayalam (മലയാളം)",
    "or": "Odia (ଓଡ଼ିଆ)",
    "as": "Assamese (অসমীয়া)",
    "ur": "Urdu (اردو)",
    "ks": "Kashmiri (کٲشُر)",
    "sa": "Sanskrit (संस्कृतम्)",
}

STRICT_ANALYSIS_PROMPT = """You are analysing a newly uploaded document. Your task is to extract information exclusively from the actual document content supplied in this request.

Do not reuse information from previous documents or conversations.
Do not assume that the document is a scholarship notice, college notice or any predefined document type.
First identify what type of document this actually is (e.g. Bank Statement, Bank Account Letter, College Exam Notice, University Circular, Government Scheme, Utility Bill, Medical Prescription, Land Revenue Record, Identity Proof, Court Notice, etc.).
Extract only information supported by the current document.
If information is absent, return null, an empty array or 'Not mentioned in document' as appropriate.
Never invent dates, fees, eligibility, tasks or instructions.
Preserve original dates, amounts (with currency symbols like ₹, $, etc.), names, account numbers, and conditions.
Flag unreadable or ambiguous text.
Generate a new independent analysis for every uploaded document.

CRITICAL INSTRUCTIONS FOR BILINGUAL OUTPUT:
1. Target language for regional explanation: {target_language_name} ({language_code}).
2. Provide:
   - "documentType": The exact identified document type based exclusively on this file.
   - "title": Exact document headline or title from the text.
   - "simpleSummary": A clear 2-3 paragraph explanation written strictly in {target_language_name} in its authentic native script (Devanagari, Gujarati, Bengali, Tamil, Telugu, Gurmukhi, Nastaliq, etc.).
   - "simpleSummaryEnglish": The same 2-3 paragraph explanation in clear, accessible English.
   - "keyPoints": Bullet points in {target_language_name} summarizing the core facts of THIS specific document.
   - "keyPointsEnglish": The same bullet points in English.
   - "importantDates": Important deadlines, cutoffs, or events from THIS document. If none, return [].
   - "feesAndAmounts": Amounts, account balances, transaction amounts, fees, grants, or financial figures from THIS document. If none, return [].
   - "eligibility": Requirements, prerequisites, or eligibility criteria from THIS document. If none, return [].
   - "requiredDocuments": Mandatory certificates or documents to submit mentioned in THIS document. If none, return [].
   - "actionChecklist": Actionable next steps derived ONLY from instructions in THIS document. Include "task" & "description" in {target_language_name}, and "taskEnglish" & "descriptionEnglish" in English. If none, return [].
   - "missingInformation": Material missing details in this document (e.g. missing signature, unreadable stamp, absent contact info).
   - "cautionNotes": Penalties, late fees, fraud warnings, or caution notes mentioned in this document.
   - "audioScript": A natural 60-second spoken briefing strictly in {target_language_name} in its native script describing THIS document.
3. Return STRICTLY valid JSON conforming to the schema below. No surrounding markdown code blocks or text outside JSON.

JSON Output Schema:
{
  "documentType": "Detected document type",
  "title": "Exact title from document",
  "simpleSummary": "2-3 paragraph summary in {target_language_name}",
  "simpleSummaryEnglish": "2-3 paragraph summary in English",
  "keyPoints": ["Point 1 in {target_language_name}", "Point 2 in {target_language_name}"],
  "keyPointsEnglish": ["Point 1 in English", "Point 2 in English"],
  "importantDates": [
    {
      "id": "date-1",
      "title": "Event name",
      "date": "Date or Not mentioned",
      "daysLeft": null,
      "urgency": "urgent or normal",
      "note": "Context from document"
    }
  ],
  "feesAndAmounts": [
    {
      "category": "Amount category or description",
      "amount": "Exact amount mentioned",
      "details": "Details from document"
    }
  ],
  "eligibility": [
    {
      "criteria": "Criteria name",
      "requirement": "Requirement details",
      "status": "mandatory or optional"
    }
  ],
  "requiredDocuments": [
    {
      "id": "doc-1",
      "name": "Document name",
      "mandatory": true,
      "details": "Details"
    }
  ],
  "actionChecklist": [
    {
      "id": "task-1",
      "task": "Action title in {target_language_name}",
      "taskEnglish": "Action title in English",
      "description": "Guidance in {target_language_name}",
      "descriptionEnglish": "Guidance in English",
      "deadline": "Deadline or Not mentioned",
      "priority": "high or medium or low",
      "category": "Application or Payment or Submission or Verification",
      "sourceText": "Original source sentence from document"
    }
  ],
  "missingInformation": [],
  "cautionNotes": [],
  "audioScript": "Spoken briefing strictly in {target_language_name} in its native script"
}
"""

QA_SYSTEM_PROMPT = """You are DocSaathi AI's Grounded Document Q&A Assistant.
Answer the user's question about the provided document.

CRITICAL RULES:
1. Answer PRIMARILY and FLUENTLY in {target_language_name} in authentic native script (Devanagari, Tamil, Telugu, Gujarati, Bengali, Nastaliq, etc.).
2. Also provide an English translation in 'answerEnglish'.
3. Ground your answer strictly in the provided document facts.
4. If the document does not mention the answer, state clearly in {target_language_name}: "यह जानकारी दस्तावेज़ में नहीं दी गई है" (or appropriate {target_language_name} equivalent) and in 'answerEnglish': "This information is not mentioned in the uploaded document."
5. Always provide an exact quotation snippet in 'sourceSnippet' when available.
6. Return JSON:
{
  "answer": "Detailed answer in {target_language_name}",
  "answerEnglish": "Detailed answer in English",
  "sourceSnippet": "Exact sentence or quote from document, or null",
  "confidence": "high or medium or low"
}
"""

def extract_text_from_pdf(pdf_path: str) -> str:
    """Extracts raw text from a PDF file using PyMuPDF (fitz/pymupdf)."""
    text_parts: List[str] = []
    try:
        import pymupdf  # PyMuPDF
        doc = pymupdf.open(pdf_path)
        for page_num in range(len(doc)):
            page = doc[page_num]
            text = page.get_text()
            if text.strip():
                text_parts.append(f"--- Page {page_num + 1} ---\n{text}")
        doc.close()
    except Exception as e:
        logger.warning(f"PyMuPDF text extraction failed: {e}")
    return "\n\n".join(text_parts)

def render_pdf_to_images(pdf_path: str, max_pages: int = 5, dpi: int = 120) -> List[bytes]:
    """Renders PDF pages as JPEG image bytes for reliable multimodal OCR and vision."""
    images: List[bytes] = []
    try:
        import pymupdf
        doc = pymupdf.open(pdf_path)
        total_pages = min(len(doc), max_pages)
        for idx in range(total_pages):
            pix = doc[idx].get_pixmap(dpi=dpi)
            img_bytes = pix.tobytes("jpeg")
            images.append(img_bytes)
        doc.close()
    except Exception as e:
        logger.warning(f"PyMuPDF page rendering failed: {e}")
    return images

def normalize_mime_type(file_path: str, mime_type: Optional[str] = None) -> str:
    """Ensures accurate MIME type resolution even if generic application/octet-stream was passed."""
    if mime_type and mime_type not in ("application/octet-stream", "", "binary/octet-stream"):
        return mime_type
    
    ext = os.path.splitext(file_path)[1].lower()
    ext_map = {
        ".pdf": "application/pdf",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".webp": "image/webp",
        ".txt": "text/plain",
    }
    if ext in ext_map:
        return ext_map[ext]
    
    guessed, _ = mimetypes.guess_type(file_path)
    return guessed or "application/octet-stream"

def clean_json_response(raw_text: str) -> Dict[str, Any]:
    """Cleans markdown JSON fences and parses string into dictionary."""
    text = raw_text.strip()
    if text.startswith("```"):
        text = re.sub(r"^```(?:json)?\s*", "", text)
        text = re.sub(r"\s*```$", "", text)
    
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        # Fallback regex extraction of outermost JSON object
        match = re.search(r"(\{.*\})", text, re.DOTALL)
        if match:
            return json.loads(match.group(1))
        raise GeminiServiceError(
            "Gemini response did not contain valid JSON.",
            code="INVALID_AI_JSON",
            details=text[:300]
        )

def execute_gemini_rest_call(
    parts: List[Dict[str, Any]],
    candidate_models: List[str],
    api_key: str,
    timeout: int = 35
) -> Tuple[str, str]:
    """
    Executes Gemini generateContent via official REST endpoint using requests.
    This avoids Python 3.14 / httpcore Windows SSL handshake timeout bugs.
    """
    last_error: Optional[Exception] = None
    session = requests.Session()

    for model in candidate_models:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
        payload = {
            "contents": [{"parts": parts}],
            "generationConfig": {
                "temperature": 0.1,
                "responseMimeType": "application/json"
            }
        }
        
        for attempt in range(1, 3):
            try:
                logger.info(f"[DocSaathi Gemini] Sending request to model {model} (attempt {attempt})...")
                resp = session.post(
                    url,
                    json=payload,
                    headers={"Content-Type": "application/json"},
                    timeout=timeout
                )

                if resp.status_code == 200:
                    data = resp.json()
                    candidates = data.get("candidates", [])
                    if not candidates:
                        raise GeminiServiceError("Gemini returned zero candidates.", code="EMPTY_RESPONSE")
                    
                    content_parts = candidates[0].get("content", {}).get("parts", [])
                    if not content_parts:
                        raise GeminiServiceError("Gemini candidate has no parts.", code="EMPTY_PARTS")
                    
                    text = content_parts[0].get("text", "")
                    logger.info(f"[DocSaathi Gemini] Model {model} responded successfully ({len(text)} chars).")
                    return text, model

                # If 503 (high demand) or 429, wait and retry once
                if resp.status_code in (503, 429) and attempt == 1:
                    logger.warning(f"[DocSaathi Gemini] Model {model} temporary status {resp.status_code}, retrying in 1.5s...")
                    time.sleep(1.5)
                    continue

                # Handle errors
                error_data = {}
                try:
                    error_data = resp.json().get("error", {})
                except Exception:
                    pass
                
                error_msg = error_data.get("message", resp.text)
                status_code = resp.status_code
                logger.warning(f"[DocSaathi Gemini] Model {model} returned HTTP {status_code}: {error_msg}")

                if status_code == 400 and "API_KEY_INVALID" in error_msg:
                    raise GeminiServiceError(
                        "Invalid GEMINI_API_KEY. Please verify your API key in backend/.env.",
                        code="INVALID_API_KEY",
                        details=error_msg
                    )
                
                last_error = GeminiServiceError(
                    f"Gemini API error ({status_code}): {error_msg}",
                    code=f"HTTP_{status_code}",
                    details=error_msg
                )
                break

            except requests.Timeout as e:
                logger.warning(f"[DocSaathi Gemini] Timeout calling model {model} after {timeout}s (attempt {attempt}): {e}")
                last_error = GeminiServiceError(
                    f"Gemini request timed out on model {model}.",
                    code="TIMEOUT",
                    details=str(e)
                )
                if attempt == 1:
                    time.sleep(1.0)
                    continue
                break
            except GeminiServiceError:
                raise
            except Exception as e:
                logger.warning(f"[DocSaathi Gemini] Unexpected error on model {model}: {e}")
                last_error = e
                break

    if last_error:
        if isinstance(last_error, GeminiServiceError):
            raise last_error
        raise GeminiServiceError(f"Gemini call failed: {last_error}", code="API_FAILURE", details=str(last_error))
    
    raise GeminiServiceError("All candidate models failed to respond.", code="ALL_MODELS_FAILED")

def analyze_document_content(
    file_path: str,
    original_filename: str,
    mime_type: str,
    language: str = "en",
    category: str = "other"
) -> Dict[str, Any]:
    """
    Main orchestration function to analyze document strictly from its actual uploaded bytes.
    NEVER returns silent mock or cached data.
    """
    api_key = os.getenv("GEMINI_API_KEY", "").strip()
    if not api_key:
        raise GeminiServiceError(
            "GEMINI_API_KEY is not configured on the backend. Please add your key to backend/.env.",
            code="API_KEY_MISSING"
        )

    if not os.path.exists(file_path):
        raise GeminiServiceError(f"Uploaded file not found at path: {file_path}", code="FILE_NOT_FOUND")

    # 1. Read actual uploaded file bytes
    with open(file_path, "rb") as f:
        file_bytes = f.read()

    file_size = len(file_bytes)
    if file_size == 0:
        raise GeminiServiceError("The uploaded file is empty (0 bytes).", code="EMPTY_FILE")

    # 2. Document identity check - SHA-256
    file_hash = hashlib.sha256(file_bytes).hexdigest()
    normalized_mime = normalize_mime_type(file_path, mime_type)
    target_lang_name = LANGUAGE_NAMES.get(language, "English")

    logger.info(
        f"[DocSaathi Pipeline] Processing upload: filename='{original_filename}', "
        f"mime='{normalized_mime}', size={file_size} bytes, sha256={file_hash[:16]}..."
    )

    # 3. Construct multimodal parts for Gemini
    parts: List[Dict[str, Any]] = []

    if normalized_mime == "application/pdf":
        extracted_text = extract_text_from_pdf(file_path)
        if extracted_text.strip():
            parts.append({
                "text": f"DOCUMENT RAW TEXT CONTENT (Extracted from {original_filename}):\n\n{extracted_text}"
            })
        
        # Render PDF pages as JPEG images for robust multimodal visual understanding.
        # This accurately captures scanned documents, stamps, seals, tables, and handwritten signatures,
        # and avoids the Gemini REST API 400 invalid argument error with raw PDF inlineData.
        rendered_images = render_pdf_to_images(file_path, max_pages=5, dpi=120)
        for img_bytes in rendered_images:
            b64_img = base64.b64encode(img_bytes).decode("utf-8")
            parts.append({
                "inlineData": {
                    "mimeType": "image/jpeg",
                    "data": b64_img
                }
            })
        
        # Fallback if rendering produced no images and no text was extracted
        if not rendered_images and not extracted_text.strip():
            b64_pdf = base64.b64encode(file_bytes).decode("utf-8")
            parts.append({
                "inlineData": {
                    "mimeType": "application/pdf",
                    "data": b64_pdf
                }
            })
    elif normalized_mime.startswith("image/"):
        b64_img = base64.b64encode(file_bytes).decode("utf-8")
        parts.append({
            "inlineData": {
                "mimeType": normalized_mime,
                "data": b64_img
            }
        })
    elif normalized_mime == "text/plain":
        try:
            text_content = file_bytes.decode("utf-8", errors="replace")
            parts.append({
                "text": f"DOCUMENT TEXT CONTENT ({original_filename}):\n\n{text_content}"
            })
        except Exception:
            pass
    else:
        raise GeminiServiceError(
            f"Unsupported file type: '{normalized_mime}'. Please upload a PDF, PNG, JPG, or WEBP document.",
            code="UNSUPPORTED_FORMAT"
        )

    # 4. Formulate strict prompt
    prompt = (
        STRICT_ANALYSIS_PROMPT
        .replace("{target_language_name}", target_lang_name)
        .replace("{language_code}", language)
    )
    parts.append({"text": prompt})

    # 5. Candidate models ordered by quota reliability, speed and multimodal capability
    configured_model = os.getenv("GEMINI_MODEL", "gemini-3.5-flash-lite").strip() or "gemini-3.5-flash-lite"
    candidate_models: List[str] = [configured_model]
    for m in ["gemini-3.5-flash-lite", "gemini-3.5-flash", "gemini-3.8-flash"]:
        if m not in candidate_models:
            candidate_models.append(m)

    # 6. Execute live Gemini API call
    raw_response_text, model_used = execute_gemini_rest_call(
        parts=parts,
        candidate_models=candidate_models,
        api_key=api_key,
        timeout=50
    )

    # 7. Parse and validate JSON
    parsed = clean_json_response(raw_response_text)
    
    # Ensure all required top-level keys exist
    parsed["success"] = True
    parsed["documentId"] = f"doc-{datetime.now().strftime('%Y%m%d%H%M%S')}"
    parsed["originalFilename"] = original_filename
    parsed["fileHash"] = file_hash
    parsed["fileSize"] = file_size
    parsed["mimeType"] = normalized_mime
    parsed["language"] = language
    parsed["modelUsed"] = model_used
    parsed["isMockDemo"] = False

    # Normalize list defaults if model returned null
    for key in ["keyPoints", "keyPointsEnglish", "importantDates", "feesAndAmounts", "eligibility", "requiredDocuments", "actionChecklist", "missingInformation", "cautionNotes"]:
        if not isinstance(parsed.get(key), list):
            parsed[key] = []

    return parsed

def answer_document_question(
    document_context: Dict[str, Any],
    question: str,
    language: str = "en"
) -> Dict[str, Any]:
    """Answers user queries grounded strictly in the analyzed document context via Gemini."""
    api_key = os.getenv("GEMINI_API_KEY", "").strip()
    target_lang_name = LANGUAGE_NAMES.get(language, "English")

    if not api_key:
        return {
            "answer": "AI Q&A is currently unavailable because GEMINI_API_KEY is not configured.",
            "answerEnglish": "AI Q&A is currently unavailable because GEMINI_API_KEY is not configured.",
            "sourceSnippet": None,
            "confidence": "low",
            "isGrounded": False
        }

    # Prepare grounded prompt
    system_prompt = QA_SYSTEM_PROMPT.replace("{target_language_name}", target_lang_name)
    context_str = json.dumps(document_context, ensure_ascii=False)
    user_prompt = f"DOCUMENT DATA (SOURCE OF TRUTH):\n{context_str}\n\nUSER QUESTION:\n{question}"

    parts = [
        {"text": system_prompt},
        {"text": user_prompt}
    ]

    configured_model = os.getenv("GEMINI_MODEL", "gemini-3.5-flash-lite").strip() or "gemini-3.5-flash-lite"
    candidate_models = [configured_model]
    for m in ["gemini-3.5-flash-lite", "gemini-3.5-flash", "gemini-3.8-flash"]:
        if m not in candidate_models:
            candidate_models.append(m)

    try:
        raw_text, _ = execute_gemini_rest_call(
            parts=parts,
            candidate_models=candidate_models,
            api_key=api_key,
            timeout=30
        )
        parsed = clean_json_response(raw_text)
        parsed["isGrounded"] = True
        if "answer" not in parsed:
            parsed["answer"] = raw_text
        if "answerEnglish" not in parsed:
            parsed["answerEnglish"] = parsed["answer"]
        return parsed
    except Exception as e:
        logger.error(f"[DocSaathi Q&A] Gemini call failed: {e}")
        return {
            "answer": "इस दस्तावेज़ के आधार पर उत्तर देने में असमर्थ है। कृपया प्रश्न दोबारा पूछें।" if language == "hi" else "Unable to answer based on this document. Please rephrase or try again.",
            "answerEnglish": "Unable to answer based on this document. Please rephrase or try again.",
            "sourceSnippet": None,
            "confidence": "low",
            "isGrounded": False
        }
