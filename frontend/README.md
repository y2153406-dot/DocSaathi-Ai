# DocSaathi AI — Frontend 🇮🇳

> **"Understand Documents. Know What to Do Next."**  
> *Har document ko samjho, aasaan bhasha mein.*

DocSaathi AI is a production-grade, responsive multilingual document-understanding web application built for Bharat. It transforms confusing Indian college circulars, government gazettes, scholarship forms, and job notifications into crystal-clear actionable summaries, interactive smart task checklists, voice audio briefings, and grounded Q&A in **15 Indian languages** with **15 authentic regional cultural themes**.

---

## 👥 Team Structure

This project is built by a dedicated three-member engineering team:

- **Sheetal** (*Frontend Architect*): Frontend architecture, app routing, centralized i18n translation system (15 languages + Urdu/Kashmiri RTL), and Regional Theme Engine (15 cultural identities).
- **Yash** (*Backend Lead*): Backend inference service (isolated in `backend/`), OCR extraction pipeline, and Gemini API server-side orchestration.
- **Surbhi** (*Feature UI Engineer*): Interactive feature components (Smart Action Checklist, Web Speech TTS Player, Context-Grounded Document Q&A Chat, and Camera Capture).

> **Architectural Boundary**: All frontend code strictly resides in `frontend/`. Yash's backend is completely preserved in `backend/`. Frontend and backend communicate exclusively via [`API_CONTRACT.md`](../API_CONTRACT.md).

---

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (Strict mode)
- **Styling**: Tailwind CSS with custom CSS variables for 15 regional palettes
- **Animation & 3D**: Framer Motion (Smooth springs, perspective tilt, 3D card depth)
- **Icons**: Lucide React
- **Validation**: Zod (Runtime validation for all backend payloads)
- **Audio**: Web Speech Synthesis API (`window.speechSynthesis`)
- **Celebration**: Canvas Confetti

---

## 🌐 15 Supported Indian Languages

| Language | Code | Script | Direction | Default Regional Theme |
|---|---|---|---|---|
| **English** | `en` | Latin | LTR | Editorial Slate |
| **हिन्दी (Hindi)** | `hi` | Devanagari | LTR | Sandstone & Indigo Jaali |
| **ગુજરાતી (Gujarati)** | `gu` | Gujarati | LTR | Adalaj Stepwell & Indigo |
| **मराठी (Marathi)** | `mr` | Devanagari | LTR | Warli Earth & Saffron |
| **ਪੰਜਾਬੀ (Punjabi)** | `pa` | Gurmukhi | LTR | Phulkari Mustard & Royal Blue |
| **বাংলা (Bengali)** | `bn` | Bengali | LTR | Alpana Ivory & Terracotta |
| **தமிழ் (Tamil)** | `ta` | Tamil | LTR | Dravidian Temple Maroon & Gold |
| **తెలుగు (Telugu)** | `te` | Telugu | LTR | Kalamkari Indigo & Rust |
| **ಕನ್ನಡ (Kannada)** | `kn` | Kannada | LTR | Hampi Sandstone & Olive |
| **മലയാളം (Malayalam)** | `ml` | Malayalam | LTR | Kerala Monsoon Emerald & Copper |
| **ଓଡ଼ିଆ (Odia)** | `or` | Odia | LTR | Pattachitra Vermilion & Gold |
| **অসমীয়া (Assamese)** | `as` | Assamese | LTR | Assamese Gamusa Woven Red |
| **اردو (Urdu)** | `ur` | Nastaliq | **RTL** | Architectural Arches & Gilded Blue |
| **کٲشُر (Kashmiri)** | `ks` | Nastaliq | **RTL** | Kashmiri Pine & Chinar Amber |
| **संस्कृतम् (Sanskrit)** | `sa` | Devanagari | LTR | Ancient Manuscript Ochre & Umber |

---

## 🎨 15 Regional Cultural Themes

Selecting a language automatically activates its default cultural theme. Users can also manually pick any theme independently without altering their interface language:

1. **Editorial English**: Clean, modern slate, cool gray, and indigo.
2. **Jaali Hindi**: Warm sandstone, royal indigo, and geometric haveli jaali lattice.
3. **Stepwell Gujarati**: Symmetrical Adalaj staircase angles, terracotta, and deep Kutchi indigo.
4. **Warli Marathi**: Earthy red-brown clay, saffron accents, and tribal Warli line harmony.
5. **Phulkari Punjabi**: Mustard yellow, warm madder red, and geometric diamond embroidery.
6. **Alpana Bengali**: Rice-flour flowing curves, serene ivory, and terracotta scroll borders.
7. **Dravidian Tamil**: Gopuram architectural tiers, temple crimson-maroon, and antique bronze gold.
8. **Kalamkari Telugu**: Natural vegetable dye indigo, earthy rust, and tree-of-life vines.
9. **Hampi Kannada**: Megalithic granite pillars, boulder sandstone, and muted olive stone.
10. **Kerala Malayalam**: Monsoon green, backwater palm canopies, and temple copper bells.
11. **Pattachitra Odia**: Mineral vermilion, turmeric yellow, and ornate scroll borders.
12. **Gamusa Assamese**: Crisp muga ivory and handwoven geometric red phool motifs.
13. **Arches Urdu**: Midnight ink-blue, Mehrab cusp arches, and gilded filigree.
14. **Floral Kashmiri**: Lacquer papier-mâché, deodar pine green, and glowing chinar amber.
15. **Manuscript Sanskrit**: Palm-leaf parchment, sacred ochre, and deep calligraphy ink.

---

## 🚀 Running the Frontend Locally

### 1. Prerequisites
- Node.js >= 18.0 (Node 20+ recommended)
- npm >= 9.0

### 2. Navigate to Frontend Directory
```bash
cd frontend
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment
Copy the example environment configuration:
```bash
cp .env.example .env.local
```
Key variables:
- `NEXT_PUBLIC_API_BASE_URL`: Base URL for Yash's backend service (defaults to `http://localhost:8000`).
- `NEXT_PUBLIC_ENABLE_MOCK_FALLBACK`: Set to `true` to enable instant offline demo fallback when the backend is offline.

### 5. Start Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 6. Production Build
```bash
npm run build
npm run start
```

---

## 📁 Frontend Architecture

```
frontend/
├── public/
│   ├── images/
│   └── patterns/
├── src/
│   ├── app/
│   │   ├── globals.css                # Custom CSS variables, typography & RTL rules
│   │   ├── layout.tsx                 # Root layout with providers & dynamic decorative layers
│   │   └── page.tsx                   # Main app router (Home, Upload, Results, Dashboard, Settings)
│   ├── components/
│   │   ├── common/                    # GlassCard, Button, Badge, Modal, SkeletonLoader
│   │   ├── layout/                    # Header, Footer, SplitScreenHero
│   │   ├── navigation/                # LanguageSelectorModal, ThemeSelectorModal
│   │   └── themes/                    # ThemeDecorativeLayer, ThemePreviewCard3D
│   ├── contexts/
│   │   ├── LanguageContext.tsx        # Active language, RTL management, dictionary hook
│   │   ├── ThemeContext.tsx           # Regional Theme engine, CSS properties injector
│   │   └── AnalysisContext.tsx        # Upload state, checklist status, chat history, demo mode
│   ├── features/
│   │   ├── analysis/                  # 10-section structured AnalysisDashboard
│   │   ├── checklist/                 # SmartActionChecklist with confetti & clipboard copy
│   │   ├── chat/                      # Grounded DocumentChat Q&A interface
│   │   ├── dashboard/                 # RecentDocuments & SettingsView
│   │   ├── speech/                    # AudioSummaryPlayer with animated visualizer
│   │   └── upload/                    # Drag-and-drop & camera capture DocumentUpload
│   ├── hooks/
│   │   ├── useSpeechSynthesis.ts      # Web Speech API wrapper with voice selector
│   │   ├── useReducedMotion.ts        # Accessibility motion detector
│   │   └── useClickOutside.ts         # Modal backdrop dismissal
│   ├── lib/
│   │   ├── api.ts                     # Centralized API service with timeout & CORS diagnostics
│   │   ├── i18n.ts                    # Complete 15-language dictionary
│   │   ├── themes.ts                  # 15 regional cultural visual theme definitions
│   │   ├── validations.ts             # Zod validation schemas
│   │   ├── mockService.ts             # Verified authentic Indian notice mock dataset
│   │   └── utils.ts                   # Class merge & utility helpers
│   └── types/
│       ├── api.ts                     # API request/response TypeScript interfaces
│       ├── i18n.ts                    # Language metadata & translation dictionary types
│       └── themes.ts                  # Theme configuration types
├── .env.example
├── API_CONTRACT.md
├── next.config.mjs
├── package.json
├── postcss.config.js
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🔒 Security & Privacy

- **Zero Secret Exposure**: No Gemini API keys or service account credentials are stored in frontend code.
- **Client-Side Safe**: All LLM queries are routed through Yash's backend proxy (`/api/analyze` & `/api/ask`).
- **Grounded Responses**: AI answers strictly reference text found within the notice, preventing hallucinations.
