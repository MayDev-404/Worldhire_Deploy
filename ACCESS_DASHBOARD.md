# How to Access the Candidate Dashboard

## Quick Access

### Option 1: Direct URL
Once your frontend is running, navigate to:
```
http://localhost:3000/dashboard
```

### Option 2: From Landing Page
1. Go to the landing page: `http://localhost:3000`
2. Click the "Dashboard" link in the header (visible on desktop)
3. Or use the navigation menu

## Starting the Frontend

### Step 1: Navigate to Frontend Directory
```bash
cd frontend
```

### Step 2: Install Dependencies (if not already done)
```bash
npm install
```

### Step 3: Start Development Server
```bash
npm run dev
```

### Step 4: Open in Browser
Open your browser and go to:
```
http://localhost:3000/dashboard
```

## Available Dashboard Routes

- **Main Dashboard**: `/dashboard`
- **Opportunities**: `/dashboard/opportunities`
- **Inbox**: `/dashboard/inbox`

## Authentication (Optional)

Currently, the dashboard is accessible without authentication. If you want to add authentication:

1. Sign up at `/signup?type=candidate`
2. Sign in at `/signin`
3. The token will be stored in localStorage
4. You can then protect the dashboard routes

## Troubleshooting

### Frontend Not Running?
```bash
cd frontend
npm run dev
```

### Port 3000 Already in Use?
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- -p 3001
```

### Build Errors?
```bash
cd frontend
npm install
npm run build
```

## Quick Test

1. **Start backend** (if not running):
   ```bash
   cd backend
   source .venv/bin/activate
   uvicorn app.main:app --reload --port 8000
   ```

2. **Start frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access dashboard**:
   - Open browser: `http://localhost:3000/dashboard`

## Dashboard Features

- ✅ User profile with avatar
- ✅ Job search status (Active/Passive/Discreet)
- ✅ Career timeline
- ✅ Skills and competencies
- ✅ Current professional status
- ✅ Education information
- ✅ Recommended jobs with match percentages
- ✅ AI Assistant button
- ✅ Notifications
- ✅ Navigation sidebar

Enjoy exploring the dashboard! 🚀

