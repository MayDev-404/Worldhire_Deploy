# Hiring Website Form

A full-stack application for candidate application submission with CV parsing and AI-powered data extraction.

## Project Structure

```
.
├── frontend/          # Next.js frontend application
├── backend/           # FastAPI backend application
└── scripts/           # Database migration scripts
```

## Quick Start

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
# Create .env file with Supabase credentials
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
# Create .env.local with NEXT_PUBLIC_API_URL=http://localhost:8000
npm run dev
```

## Architecture

This project follows **complete frontend-backend separation**:

- **Frontend**: Next.js 16 + React 19 (UI only)
- **Backend**: FastAPI (all business logic)
- **Communication**: HTTP/REST API

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed documentation.

## Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Complete architecture overview
- [QUICK_START.md](./QUICK_START.md) - Getting started guide
- [SEPARATION_SUMMARY.md](./SEPARATION_SUMMARY.md) - Frontend-backend separation
- [frontend/README.md](./frontend/README.md) - Frontend documentation
- [backend/README.md](./backend/README.md) - Backend API documentation

## Features

- ✅ Multi-step candidate application form
- ✅ CV file upload and parsing (PDF, DOCX)
- ✅ AI-powered CV data extraction (HuggingFace)
- ✅ Candidate dashboard
- ✅ File storage (Supabase Storage)
- ✅ Complete frontend-backend separation

## Technology Stack

**Frontend:**
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui

**Backend:**
- FastAPI
- Python 3.8+
- Supabase (PostgreSQL + Storage)
- HuggingFace API

## License

MIT

