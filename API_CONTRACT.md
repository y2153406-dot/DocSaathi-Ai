# DocSaathi AI — REST API Contract & Specification

**Version**: 1.0.0  
**Tagline**: "Understand Documents. Know What to Do Next."  
**Backend Framework**: Django 6.1 + Django REST Framework  
**Frontend**: Next.js 14 App Router + TypeScript + Tailwind CSS  

---

## 1. Architecture Overview

DocSaathi AI connects a Next.js App Router presentation layer with a Django REST Framework AI backend:

```
[ Next.js Frontend ] (Port 3000)
       │
       │ HTTP / JSON / Multipart
       ▼
[ Django Backend ] (Port 8000)
       │
       ├── SQLite (Document Metadata & Analysis Storage)
       └── Google GenAI SDK (Gemini 2.5 Flash Multimodal OCR & Q&A)
```

- **Frontend Base URL Configuration**:
  ```env
  NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
  ```
- **Security & Privacy**:
  - Gemini API keys are maintained strictly server-side in `backend/.env`.
  - Sensitive document bytes are never logged.
  - Endpoints validate file types and file sizes (15MB maximum).
  - Explicit document deletion is supported via `DELETE /api/documents/{document_id}/`.

---

## 2. API Endpoints

### 2.1 Service Health Check

- **Path**: `GET /api/health/`
- **Description**: Returns backend service status, database connectivity, and Gemini API configuration state.
- **Request**: None

#### Success Response (`200 OK`):
```json
{
  "status": "healthy",
  "service": "DocSaathi AI Backend Service",
  "version": "1.0.0",
  "timestamp": "2026-11-12T22:00:00.000000",
  "geminiConfigured": true,
  "geminiModel": "gemini-2.5-flash",
  "database": "sqlite3",
  "supportedLanguagesCount": 15,
  "features": [
    "Multimodal Document Analysis (Gemini)",
    "Action Checklist Extraction",
    "Context-Grounded Document Q&A",
    "Multilingual Support (15 Indian Languages)",
    "Document Audio Briefing Synthesis",
    "Secure Document Deletion"
  ]
}
```

---

### 2.2 Upload & Analyze Document

- **Path**: `POST /api/documents/analyze/` (Alias: `POST /api/analyze/`)
- **Method**: `POST`
- **Content-Type**: `multipart/form-data`
- **Timeout**: Up to 50 seconds for heavy OCR/LLM processing

#### Request Form Fields:
| Field | Type | Required | Description |
|---|---|---|---|
| `file` | `File` (Binary) | Yes | PDF, JPG, JPEG, or PNG file (Max 15MB). |
| `language` | `string` | No | Target output ISO code: `en`, `hi`, `gu`, `mr`, `pa`, `bn`, `ta`, `te`, `kn`, `ml`, `or`, `as`, `ur`, `ks`, `sa` (default: `en`). |
| `category` | `string` | No | Document category: `scholarship`, `college`, `government`, `job`, `other`. |

#### Success Response (`200 OK`):
```json
{
  "success": true,
  "documentId": "doc-a81f3d4201",
  "language": "hi",
  "documentType": "Scholarship Notice",
  "title": "National Post-Matric Scholarship Scheme 2026-27",
  "simpleSummary": "यह नोटिस राष्ट्रीय पोस्ट-मैट्रिक छात्रवृत्ति के बारे में है...",
  "keyPoints": [
    "छात्रवृत्ति आवेदन 2026 चक्र के लिए खुले हैं।",
    "अंतिम तिथि 30 नवंबर 2026 है।",
    "सालाना पारिवारिक आय ₹2,50,000 से कम होनी चाहिए।"
  ],
  "importantDates": [
    {
      "id": "date-1",
      "title": "Online Registration Deadline",
      "date": "2026-11-30",
      "daysLeft": 18,
      "urgency": "urgent",
      "note": "Late submissions will strictly not be accepted."
    }
  ],
  "feesAndAmounts": [
    {
      "category": "Application Processing Fee",
      "amount": "₹0 (Free of charge)",
      "details": "No agent fee authorized."
    },
    {
      "category": "Financial Grant / Entitlement",
      "amount": "Up to ₹50,000 / year",
      "details": "Disbursed via DBT into Aadhaar linked account."
    }
  ],
  "eligibility": [
    {
      "criteria": "Educational Status",
      "requirement": "Enrolled in recognized Higher Secondary or Degree program",
      "status": "mandatory"
    },
    {
      "criteria": "Annual Family Income",
      "requirement": "Must not exceed ₹2,50,000 per annum",
      "status": "mandatory"
    }
  ],
  "requiredDocuments": [
    {
      "id": "doc-1",
      "name": "Income Certificate",
      "mandatory": true,
      "details": "Issued by Tehsildar or revenue authority"
    },
    {
      "id": "doc-2",
      "name": "Aadhaar Card",
      "mandatory": true,
      "details": "Active bank seeding required"
    }
  ],
  "actionChecklist": [
    {
      "id": "task-1",
      "task": "Complete Online Application Form",
      "description": "Register on the official portal and fill candidate credentials.",
      "deadline": "2026-11-30",
      "priority": "high",
      "category": "Application",
      "sourceText": "Candidates are instructed to fill the online application before cutoff."
    }
  ],
  "missingInformation": [
    "Contact phone number of grievance officer is not specified."
  ],
  "cautionNotes": [
    "Beware of fraudulent cyber cafes charging fees."
  ],
  "audioScript": "Welcome to DocSaathi AI. Here is the summary of your notice...",
  "isMockDemo": false
}
```

---

### 2.3 Ask Document (Context-Grounded Q&A)

- **Path**: `POST /api/documents/ask/` (Alias: `POST /api/ask/`)
- **Method**: `POST`
- **Content-Type**: `application/json`

#### Request Payload:
```json
{
  "document_id": "doc-a81f3d4201",
  "question": "What is the last date to apply?",
  "language": "hi"
}
```

#### Success Response (`200 OK`):
```json
{
  "success": true,
  "documentId": "doc-a81f3d4201",
  "question": "What is the last date to apply?",
  "answer": "The last date for online application registration is 30th November 2026.",
  "sourceSnippet": "Online Registration Deadline: 2026-11-30. Late submissions will strictly not be entertained.",
  "confidence": "high",
  "isGrounded": true,
  "timestamp": "10:15 PM"
}
```

---

### 2.4 Retrieve Analyzed Document

- **Path**: `GET /api/documents/{document_id}/`
- **Method**: `GET`

#### Success Response (`200 OK`):
Returns the complete structured analysis response object for the specified document ID.

#### Error Response (`404 Not Found`):
```json
{
  "success": false,
  "error": {
    "code": "DOCUMENT_NOT_FOUND",
    "message": "Document with ID 'doc-xyz' was not found."
  }
}
```

---

### 2.5 Delete Document

- **Path**: `DELETE /api/documents/{document_id}/`
- **Method**: `DELETE`
- **Description**: Permanently purges document analysis from database and deletes the uploaded binary from media storage.

#### Success Response (`200 OK`):
```json
{
  "success": true,
  "message": "Document 'doc-a81f3d4201' deleted successfully from server."
}
```

---

### 2.6 List Recent Documents

- **Path**: `GET /api/documents/`
- **Method**: `GET`

#### Success Response (`200 OK`):
```json
{
  "success": true,
  "documents": [
    {
      "documentId": "doc-a81f3d4201",
      "filename": "Scholarship_Circular_2026.pdf",
      "category": "scholarship",
      "language": "hi",
      "createdAt": "2026-11-12T22:04:45.870000",
      "title": "National Post-Matric Scholarship Scheme 2026-27",
      "documentType": "Scholarship Notice",
      "isDemo": false
    }
  ]
}
```

---

## 3. Supported Languages (15 Indian Languages)

| Code | Language | Native Name | Script | Direction | Default Theme |
|---|---|---|---|---|---|
| `en` | English | English | Latin | LTR | `editorial-english` |
| `hi` | Hindi | हिन्दी | Devanagari | LTR | `jaali-hindi` |
| `gu` | Gujarati | ગુજરાતી | Gujarati | LTR | `stepwell-gujarati` |
| `mr` | Marathi | मराठी | Devanagari | LTR | `warli-marathi` |
| `pa` | Punjabi | ਪੰਜਾਬੀ | Gurmukhi | LTR | `phulkari-punjabi` |
| `bn` | Bengali | বাংলা | Bengali | LTR | `alpana-bengali` |
| `ta` | Tamil | தமிழ் | Tamil | LTR | `dravidian-tamil` |
| `te` | Telugu | తెలుగు | Telugu | LTR | `kalamkari-telugu` |
| `kn` | Kannada | ಕನ್ನಡ | Kannada | LTR | `hampi-kannada` |
| `ml` | Malayalam | മലയാളം | Malayalam | LTR | `kerala-malayalam` |
| `or` | Odia | ଓଡ଼ିଆ | Odia | LTR | `pattachitra-odia` |
| `as` | Assamese | অসমীয়া | Bengali-Assamese | LTR | `gamusa-assamese` |
| `ur` | Urdu | اردو | Nastaliq/Perso-Arabic | RTL | `arches-urdu` |
| `ks` | Kashmiri | کٲشُر | Nastaliq/Perso-Arabic | RTL | `floral-kashmiri` |
| `sa` | Sanskrit | संस्कृतम् | Devanagari | LTR | `manuscript-sanskrit` |

---

## 4. Error Codes Specification

| HTTP Status | Error Code | Description |
|---|---|---|
| 400 | `VALIDATION_ERROR` | Missing or invalid request parameter. |
| 404 | `DOCUMENT_NOT_FOUND` | Document ID was not found in SQLite storage. |
| 413 | `FILE_TOO_LARGE` | Document file exceeds maximum 15MB limit. |
| 415 | `UNSUPPORTED_FILE_TYPE` | File is not PDF, JPG, JPEG, or PNG. |
| 500 | `PROCESSING_ERROR` | Document analysis or parsing failed. |
