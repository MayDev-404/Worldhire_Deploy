# Quick Start Guide

## Complete Frontend-Backend Separation

This project has **complete separation** between frontend (Next.js) and backend (FastAPI).

## 🚀 Getting Started

### 1. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env with your Supabase credentials

# Start backend server
uvicorn app.main:app --reload --port 8000
```

Backend will run on: **http://localhost:8000**

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env.local file
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# Start frontend
npm run dev
```

Frontend will run on: **http://localhost:3000**

## 📡 Communication Flow

```
Frontend (Next.js)  →  HTTP Request  →  Backend (FastAPI)  →  Supabase/Database
                     ←  JSON Response ←                      ←
```

**All communication goes through `/lib/api-client.ts`**

## 🔧 Environment Variables

### Frontend (frontend/.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Backend (backend/.env)
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
HUGGINGFACE_API_KEY=your-huggingface-key
CORS_ORIGINS=http://localhost:3000
```

## 📚 Documentation

- **ARCHITECTURE.md** - Complete architecture details
- **SEPARATION_SUMMARY.md** - Separation overview
- **backend/README.md** - Backend API documentation
- **backend/SETUP_ENV.md** - Environment setup guide

## ✅ Verification

1. **Backend Health:**
   ```bash
   curl http://localhost:8000/health
   ```

2. **Frontend Connection:**
   Open http://localhost:3000 and check browser console for API calls

3. **API Documentation:**
   Visit http://localhost:8000/docs for interactive API docs

## 🎯 Key Points

- ✅ Frontend = UI only (no business logic)
- ✅ Backend = All business logic and data operations
- ✅ Communication = HTTP/REST API only
- ✅ No direct database access from frontend
- ✅ All API calls through `/lib/api-client.ts`

