# DocSaathi AI 🇮🇳

> **"Understand Documents. Know What to Do Next."**

DocSaathi AI is an intelligent, multilingual document-understanding assistant designed for Bharat. It converts complex college notices, scholarship brochures, recruitment advertisements, and government scheme circulars into crystal-clear explanations and an interactive, actionable checklist in 15 Indian languages with authentic regional cultural themes.

---

## 🌟 Key Features

1. **First-Screen Region & Language Onboarding**:
   - Independent choice of Indian States/Union Territories and 15 Indian languages.
   - Beautiful searchable selection modal saved persistently in `localStorage`.
   - Native script rendering for every language.

2. **15 Regional Visual Theme Engine**:
   - Automatically maps chosen languages to authentic regional visual identities.
   - Hand-crafted SVG motif patterns (Jaali, Stepwells, Warli, Phulkari, Alpana, Dravidian Vimana, Kalamkari, Hampi wheels, Kerala palms, Pattachitra, Gamusa, Mughal arches, Chinar, and Vedic manuscripts).
   - Zero broken image dependencies; lightweight and respects reduced-motion accessibility.
   - Manual theme selector with interactive 3D preview cards.

3. **Multi-Format Document Upload**:
   - Drag-and-drop, file browsing, and mobile camera capture.
   - Supports PDF, JPG, JPEG, and PNG files up to 15MB.
   - Live image preview, file validation, and upload step animations.

4. **10-Section Multimodal Document Understanding (Gemini API)**:
   - Powered by official Google GenAI SDK (`google-genai` / `gemini-2.5-flash`).
   - Structured JSON output with zero hallucinations:
     - Document Type & Official Title
     - Simple 2-3 paragraph plain-language summary in the user's preferred language
     - Key Points & Highlights
     - Crucial Dates & Deadlines with countdown badges
     - Fees & Financial Overview (with anti-fraud advisories)
     - Eligibility & Prerequisites
     - Required Documents (Mandatory vs. Optional)
     - Missing Information flags (e.g. missing helpline numbers)
     - Caution Notes & Warnings

5. **Smart Action Checklist (Primary Feature)**:
   - Interactive task tracker extracted directly from document instructions.
   - Progress bar, completion percentage, completed vs. pending counters.
   - Checkbox toggle with celebratory confetti upon 100% completion.
   - Ability to add **Personal Tasks** clearly distinguished from **AI Extracted Tasks**.
   - One-click formatted checklist copy to clipboard and reset functionality.

6. **Microphone Voice Input & Document Chat Assistant**:
   - Interactive Q&A chat grounded strictly in document facts.
   - Suggested quick-question chips ("What is the last date?", "Am I eligible?", etc.).
   - Web Speech API microphone integration with live speech-to-text and listening pulse animation.
   - Source sentence citations for complete verifiability.

7. **Voice Audio Briefing (Text-to-Speech)**:
   - Built-in 60-second spoken summary using the browser's `speechSynthesis`.
   - Play, Pause, Resume, Stop controls with animated equalizer waveform bars.
   - Speed multipliers (1x, 1.25x, 1.5x) and language-appropriate voice matching.

8. **Export & Sharing**:
   - One-click formatted WhatsApp summary sharing with emoji bullet points.
   - Markdown summary download for offline reading.

---

## 🏗️ Architecture & Technology Stack

```
DocSaathi-AI/
├── frontend/                     # Next.js 14 App Router + TypeScript + Tailwind CSS
│   ├── src/
│   │   ├── app/                  # App routes, layout, global styles
│   │   ├── components/           # Reusable UI components & modals
│   │   ├── features/             # Upload, Analysis, Checklist, Chat, Speech, Dashboard
│   │   ├── contexts/             # Language, Theme, and Analysis React Contexts
│   │   ├── hooks/                # Web Speech, Reduced Motion, Click Outside hooks
│   │   ├── lib/                  # Centralized API client, i18n dictionary, Themes
│   │   └── types/                # Strict TypeScript contracts & interfaces
│   └── package.json
│
├── backend/                      # Python Django 6.1 + Django REST Framework
│   ├── manage.py
│   ├── config/                   # Django settings, CORS, URLs, WSGI, ASGI
│   ├── documents/                # Models, Views, Serializers, Gemini Service, Tests
│   └── requirements.txt
│
├── API_CONTRACT.md               # Complete REST API specification
├── README.md
└── .gitignore
```

### Frontend Stack:
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS with custom Indian light theme tokens
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Voice / Audio**: Browser Web Speech API (`SpeechRecognition` & `speechSynthesis`)

### Backend Stack:
- **Framework**: Django 6.1, Django REST Framework
- **Cross-Origin**: `django-cors-headers`
- **AI Engine**: Google GenAI SDK (`google-genai` 2.33.0 / Gemini 2.5 Flash)
- **PDF Extraction**: PyMuPDF (`fitz`) & Pillow
- **Database**: SQLite (Zero external database setup required for MVP)

---

## ⚙️ Environment Configuration

### Backend (`backend/.env`):
```env
# Google Gemini API Key from https://aistudio.google.com/
GEMINI_API_KEY=your_gemini_api_key_here

# Supported model: gemini-2.5-flash or gemini-1.5-flash
GEMINI_MODEL=gemini-2.5-flash

# Django settings
DJANGO_SECRET_KEY=docsaathi-ai-secret-key-change-in-production-2026
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

> **Note on Demo Mode**: If `GEMINI_API_KEY` is not provided, the backend automatically operates in high-fidelity **Demo Mode**, returning grounded sample analyses for testing without failing or crashing.

### Frontend (`frontend/.env.local`):
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_ENABLE_MOCK_FALLBACK=true
```

---

## 🚀 Quickstart & Running Locally

### Prerequisites:
- Node.js 18+ and npm
- Python 3.11+ (Python 3.14 compatible)

### 1. Setup & Run Django Backend:

```bash
# Navigate to backend directory
cd backend

# Install dependencies
pip install -r requirements.txt

# Run SQLite migrations
python manage.py migrate

# (Optional) Run backend test suite
python manage.py test

# Start Django development server on port 8000
python manage.py runserver 8000
```

The backend health check will be live at: `http://localhost:8000/api/health/`

### 2. Setup & Run Next.js Frontend:

In a new terminal window:

```bash
# Navigate to frontend directory
cd frontend

# Install npm dependencies
npm install

# Start Next.js development server on port 3000
npm run dev
```

Open your browser at: `http://localhost:3000`

---

## 🧪 Testing & Verification

### Running Backend Unit Tests:
```bash
cd backend
python manage.py test
```
Verifies:
- `GET /api/health/` returns 200 OK and service metadata
- Document upload, image processing, and structured JSON parsing
- Grounded Q&A response generation
- Document retrieval and database persistence
- Physical file and record deletion via `DELETE /api/documents/{id}/`

### Testing Frontend:
```bash
cd frontend
npm run build
```
Verifies:
- TypeScript type checking across all 15 language definitions and themes
- Next.js static and dynamic App Router compilation
- Component rendering without runtime errors

---

## 🌐 Supported Languages (15 Indian Languages)

1. **English** (`en`) — Pan-Global Modern Editorial
2. **Hindi** (`hi`) — हिन्दी (Sandstone & Jaali)
3. **Gujarati** (`gu`) — ગુજરાતી (Stepwell & Terracotta)
4. **Marathi** (`mr`) — मराठी (Warli Earth & Saffron)
5. **Punjabi** (`pa`) — ਪੰਜਾਬੀ (Phulkari Mustard & Crimson)
6. **Bengali** (`bn`) — বাংলা (Alpana Terracotta & Ivory)
7. **Tamil** (`ta`) — தமிழ் (Dravidian Temple Maroon & Gold)
8. **Telugu** (`te`) — తెలుగు (Kalamkari Indigo & Rust)
9. **Kannada** (`kn`) — ಕನ್ನಡ (Hampi Sandstone & Olive)
10. **Malayalam** (`ml`) — മലയാളം (Kerala Emerald & Copper)
11. **Odia** (`or`) — ଓଡ଼ିଆ (Pattachitra Scroll & Ochre)
12. **Assamese** (`as`) — অসমীয়া (Gamusa Scarlet & Ivory)
13. **Urdu** (`ur`) — اردو (Mughal Arches & Ink Blue, RTL layout)
14. **Kashmiri** (`ks`) — کٲشُر (Kashmiri Pine & Chinar, RTL layout)
15. **Sanskrit** (`sa`) — संस्कृतम् (Vedic Manuscript & Ochre)

---

## 🔒 Security & Privacy Practices

- **Zero Client-Side API Keys**: Gemini API keys never leak into browser code or git repositories.
- **File Restrictions**: Strict 15MB file size limits and MIME-type verification (PDF, JPG, PNG).
- **Ephemeral Storage & Privacy**: Users can trigger one-click deletion of their uploaded document and all analysis records from the server.
- **Grounded Verification**: Answers in Q&A cite source sentences to minimize misinformation.

---

## 📄 License & Credits

Built for Bharat with ❤️ by the DocSaathi AI Pair Programming Team.
Released under the MIT License.
