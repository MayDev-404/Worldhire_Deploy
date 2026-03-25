# Backend (FastAPI) for worldhire2.0

This folder contains a FastAPI-based backend migrated from the Next.js API routes. It follows a 5-layer structure:

- api: FastAPI routes (GET and POST)
- services: business logic
- domain: Pydantic models / domain objects
- infrastructure: external systems (Supabase client, HTTP client)
- middleware: FastAPI middleware (logging, error handling)

## Quick Start

**Python:** Use **3.11, 3.12, or 3.13** if possible. **3.14** is often missing prebuilt wheels for some packages; if `pip install` fails while building `pydantic-core`, install [Python 3.12](https://www.python.org/downloads/) and create the venv with it, e.g. `py -3.12 -m venv .venv` (Windows).

From repository root:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```

## Environment Variables

Create a `.env` file in the `backend` directory (or set environment variables):

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key  # Preferred, bypasses RLS
# OR
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key  # Fallback

HUGGINGFACE_API_KEY=your_huggingface_api_key  # For AI CV parsing
HUGGINGFACE_MODEL=google/gemma-2b-it  # Optional, defaults to gemma-2b-it

# JWT Configuration (for authentication)
JWT_SECRET_KEY=your-super-secret-key-change-this-in-production
ACCESS_TOKEN_EXPIRE_MINUTES=1440  # Optional, defaults to 1440 (24 hours)
```

## API Endpoints

### Authentication
- **POST /api/auth/sign-up** — Register a new user (email, password, name)
- **POST /api/auth/sign-in** — Sign in and get access token
- **GET /api/auth/me** — Get current authenticated user (requires Bearer token)
- **POST /api/auth/verify-token** — Verify if a token is valid

### Applications
- **POST /api/submit-application** — Accepts multipart/form-data with all candidate fields and files (CV, photograph)
- **POST /api/parse-cv** — Accepts multipart/form-data with 'file' or Form data with 'text'. Returns structured CV data extracted using AI
- **GET /api/candidates/{candidate_id}** — Get candidate details by ID

## Features

- **CV Parsing**: Extracts text from PDF and DOCX files, then uses HuggingFace AI (Gemma model) to extract structured data
- **File Upload**: Handles CV and photograph uploads to Supabase Storage
- **Data Validation**: Validates all required fields before submission
- **Error Handling**: Comprehensive error handling with appropriate HTTP status codes

## Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key  # Preferred, bypasses RLS
# OR
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key  # Fallback

# HuggingFace API (for AI CV parsing)
HUGGINGFACE_API_KEY=your_huggingface_api_key
HUGGINGFACE_MODEL=google/gemma-2b-it  # Optional

# CORS Configuration (comma-separated)
CORS_ORIGINS=http://localhost:3000,https://yourdomain.com
```

## Architecture

- **Complete Separation**: Frontend and backend are completely independent
- **All business logic** is in the backend services
- **Frontend** only makes HTTP requests via `/lib/api-client.ts`
- **No direct database access** from frontend

## Notes

- The backend uses Supabase for database and storage operations
- CV parsing uses HuggingFace Inference API for AI-powered extraction
- CORS is configurable via `CORS_ORIGINS` environment variable
- See `ARCHITECTURE.md` in the root directory for detailed architecture documentation
