# Frontend-Backend Connection Testing Guide

## ✅ Current Status

- **Backend**: Running on http://localhost:8000 ✓
- **Frontend**: Running on http://localhost:3000 ✓
- **CORS**: Configured correctly ✓

## 🧪 Quick Tests

### 1. Test Backend Health
```bash
curl http://localhost:8000/health
```

### 2. Test Backend Root
```bash
curl http://localhost:8000/
```

### 3. Test from Browser Console
Open http://localhost:3000 and run in browser console:
```javascript
// Test health endpoint
fetch('http://localhost:8000/health')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);

// Test root endpoint
fetch('http://localhost:8000/')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);
```

## 🎯 Testing the Full Flow

### Test 1: CV Parsing
1. Open http://localhost:3000
2. Upload a CV file (PDF or DOCX)
3. Check browser console for any errors
4. Verify form fields are auto-filled

### Test 2: Form Submission
1. Fill out the application form
2. Submit the form
3. Check browser console for success/error messages
4. Verify data is saved to Supabase

### Test 3: Candidate View
1. After submitting, note the candidate ID from the response
2. Visit: http://localhost:3000/candidates/{candidate_id}
3. Verify candidate details are displayed

## 🔍 Debugging

### Check Backend Logs
```bash
tail -f /tmp/fastapi.log
```

### Check Frontend Logs
```bash
tail -f /tmp/nextjs.log
```

### Check Browser Network Tab
1. Open DevTools (F12)
2. Go to Network tab
3. Filter by "api" or "8000"
4. Check request/response details

## 🐛 Common Issues

### CORS Errors
- Verify backend CORS allows `http://localhost:3000`
- Check browser console for CORS error messages

### Connection Refused
- Ensure backend is running: `cd backend && uvicorn app.main:app --reload --port 8000`
- Check if port 8000 is available: `lsof -i:8000`

### 404 Errors
- Verify API endpoints match: `/api/submit-application`, `/api/parse-cv`
- Check backend routes are registered correctly

### Environment Variables
- Frontend: `NEXT_PUBLIC_API_URL` (optional, defaults to http://localhost:8000)
- Backend: Supabase and HuggingFace API keys in `.env` file

