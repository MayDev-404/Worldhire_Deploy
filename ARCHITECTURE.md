# Architecture: Frontend-Backend Separation

This project follows a **complete separation** between frontend and backend, with all business logic and data operations handled by the FastAPI backend.

## Architecture Overview

```
┌─────────────────┐         HTTP/REST API         ┌─────────────────┐
│                 │ ────────────────────────────> │                 │
│   Next.js       │                               │   FastAPI       │
│   Frontend      │ <──────────────────────────── │   Backend       │
│                 │         JSON Responses        │                 │
└─────────────────┘                               └─────────────────┘
        │                                                    │
        │                                                    │
        │                                                    │
        │                                                    ▼
        │                                          ┌─────────────────┐
        │                                          │   Supabase      │
        │                                          │   (Database &   │
        │                                          │    Storage)     │
        │                                          └─────────────────┘
        │
        ▼
┌─────────────────┐
│   User Browser   │
└─────────────────┘
```

## Frontend (Next.js)

**Location:** `/` (root directory)

**Responsibilities:**
- ✅ UI/UX rendering
- ✅ User interactions
- ✅ Form validation (client-side)
- ✅ API calls to backend
- ❌ NO business logic
- ❌ NO database access
- ❌ NO external API calls (except through backend)
- ❌ NO file processing

**Technology Stack:**
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui components

**API Communication:**
- All API calls go through `/lib/api-client.ts`
- Base URL: `NEXT_PUBLIC_API_URL` (default: `http://localhost:8000`)
- All requests are HTTP/REST calls to FastAPI backend

## Backend (FastAPI)

**Location:** `/backend`

**Responsibilities:**
- ✅ All business logic
- ✅ Database operations (Supabase)
- ✅ File processing (CV parsing, uploads)
- ✅ External API calls (HuggingFace AI)
- ✅ Data validation
- ✅ Authentication/Authorization (if needed)
- ✅ Error handling

**Technology Stack:**
- FastAPI
- Python 3.8+
- Supabase (PostgreSQL + Storage)
- HuggingFace API (for AI CV parsing)

**API Endpoints:**
- `GET /` - API information
- `GET /health` - Health check
- `POST /api/submit-application` - Submit candidate application
- `POST /api/parse-cv` - Parse CV file
- `GET /api/candidates/{id}` - Get candidate details

## Communication Flow

### Example: Submitting an Application

1. **User fills form** → Frontend (React component)
2. **User clicks submit** → Frontend calls `apiClient.submitApplication()`
3. **HTTP POST request** → `http://localhost:8000/api/submit-application`
4. **Backend receives** → FastAPI route handler
5. **Business logic** → ApplicationService processes data
6. **Database operation** → Supabase client saves to database
7. **File upload** → Supabase Storage for CV/photos
8. **Response** → JSON with candidate ID
9. **Frontend receives** → Redirects to candidate dashboard

## Environment Variables

### Frontend (.env.local)
```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000

# Optional: For production
# NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

### Backend (backend/.env)
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# HuggingFace API (for CV parsing)
HUGGINGFACE_API_KEY=your-huggingface-key

# CORS Configuration (comma-separated)
CORS_ORIGINS=http://localhost:3000,https://yourdomain.com
```

## Key Principles

### ✅ DO in Frontend
- Make HTTP requests to backend API
- Handle UI state and user interactions
- Client-side form validation
- Display data from backend responses
- Handle loading and error states

### ❌ DON'T in Frontend
- Direct database queries
- Business logic processing
- File processing/parsing
- External API calls (except through backend)
- Sensitive operations

### ✅ DO in Backend
- All business logic
- Database operations
- File processing
- External API integrations
- Data validation
- Error handling

### ❌ DON'T in Backend
- UI rendering
- Client-side JavaScript
- Frontend routing

## File Structure

```
project/
├── frontend/               # Next.js frontend
│   ├── app/               # Next.js app router (pages/components)
│   │   ├── page.tsx       # Home page
│   │   └── candidates/    # Candidate pages
│   ├── components/        # React components
│   ├── lib/
│   │   └── api-client.ts  # ONLY way to communicate with backend
│   ├── public/            # Static assets
│   ├── hooks/             # React hooks
│   ├── types/             # TypeScript types
│   ├── package.json       # Frontend dependencies
│   └── .env.local         # Frontend environment variables
├── backend/               # FastAPI backend
│   ├── app/
│   │   ├── api/           # API routes
│   │   ├── services/      # Business logic
│   │   ├── infrastructure/# External clients (Supabase, HTTP)
│   │   └── main.py        # FastAPI app
│   ├── requirements.txt   # Backend dependencies
│   └── .env               # Backend environment variables
└── scripts/               # Database migration scripts
```

## Running the Application

### Development

**Terminal 1 - Backend:**
```bash
cd backend
source .venv/bin/activate
uvicorn app.main:app --reload --port 8000
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### Production

**Backend:**
- Deploy FastAPI to server/cloud (e.g., Railway, Render, AWS)
- Set environment variables
- Run with production ASGI server (e.g., Gunicorn + Uvicorn)

**Frontend:**
- Build: `npm run build`
- Deploy to Vercel, Netlify, or similar
- Set `NEXT_PUBLIC_API_URL` to production backend URL

## API Client Usage

```typescript
import { apiClient } from '@/lib/api-client'

// Parse CV
const result = await apiClient.parseCV(file)
const extractedData = result.data

// Submit application
const response = await apiClient.submitApplication(formData)
const candidateId = response.candidate.id

// Get candidate
const candidate = await apiClient.getCandidate(candidateId)
```

## Benefits of This Architecture

1. **Clear Separation**: Frontend and backend are completely independent
2. **Scalability**: Can scale frontend and backend separately
3. **Security**: Sensitive operations stay on backend
4. **Maintainability**: Clear boundaries and responsibilities
5. **Flexibility**: Can swap frontend or backend technology
6. **Testing**: Can test frontend and backend independently

## Migration Notes

- ✅ Removed all Next.js API routes (`/app/api/`)
- ✅ Removed direct Supabase client usage from frontend
- ✅ All database operations go through FastAPI backend
- ✅ Frontend only makes HTTP requests to backend

