# DocSaathi AI — Shared API Contract Specification (Frontend Copy)

See root [`../API_CONTRACT.md`](../API_CONTRACT.md) for full contract documentation and Yash questions.

### Base URL:
- `NEXT_PUBLIC_API_BASE_URL` (defaults to `http://localhost:8000`)

### Endpoints:
- `POST /api/analyze` - Multipart form with `file` and `language`.
- `POST /api/ask` - JSON with `documentId`, `question`, and `language`.

All types are validated using Zod in `src/lib/validations.ts` and encapsulated in `src/lib/api.ts`.
