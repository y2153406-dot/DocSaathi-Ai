# DocSaathi AI — Backend Service

**Owner**: Yash (Backend Engineer)

This directory is strictly reserved for the Python / FastAPI / Node backend service for DocSaathi AI.

- Frontend code resides strictly in `frontend/`.
- Frontend communicates with the backend via REST endpoints defined in [`API_CONTRACT.md`](../API_CONTRACT.md).
- Endpoints proposed:
  - `POST /api/analyze` (multipart/form-data with `file` and `language`)
  - `POST /api/ask` (JSON with `documentId`, `question`, and `language`)
- Refer to `API_CONTRACT.md` for schemas, error codes, and field specifications.
