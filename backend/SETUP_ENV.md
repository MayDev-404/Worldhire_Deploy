# Setting Up Environment Variables

## Quick Setup

1. **Copy the example file:**
   ```bash
   cd backend
   cp .env.example .env
   ```

2. **Edit the `.env` file** with your actual Supabase credentials:
   ```bash
   nano .env  # or use your preferred editor
   ```

## Required Variables

### Supabase Configuration

1. **Get your Supabase URL:**
   - Go to https://app.supabase.com
   - Select your project
   - Go to Settings → API
   - Copy the "Project URL"

2. **Get your Service Role Key (Recommended):**
   - In the same API settings page
   - Find "service_role" key (it's marked as "secret")
   - Copy this key - it bypasses Row Level Security (RLS)

3. **Or get your Anon Key (Alternative):**
   - In the same API settings page
   - Find "anon" key (public)
   - Copy this key

### HuggingFace API (for AI CV parsing)

1. **Get your HuggingFace API Key:**
   - Go to https://huggingface.co/settings/tokens
   - Create a new token or use an existing one
   - Copy the token

## Example .env File

```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
HUGGINGFACE_API_KEY=hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
HUGGINGFACE_MODEL=google/gemma-2b-it
```

## Verification

After setting up your `.env` file, restart the backend server:

```bash
# Stop the current server (Ctrl+C)
cd backend
source .venv/bin/activate  # or .venv\Scripts\activate on Windows
uvicorn app.main:app --reload --port 8000
```

Test the connection:
```bash
curl http://localhost:8000/health
```

## Troubleshooting

### Error: "Supabase environment variables not set"
- Make sure `.env` file exists in the `backend/` directory
- Check that variable names match exactly (case-sensitive)
- Restart the server after creating/editing `.env`

### Error: "Missing Supabase environment variables"
- Verify your `.env` file has `NEXT_PUBLIC_SUPABASE_URL` set
- Verify you have either `SUPABASE_SERVICE_ROLE_KEY` or `NEXT_PUBLIC_SUPABASE_ANON_KEY` set

### CV parsing not working
- Make sure `HUGGINGFACE_API_KEY` is set (optional, but needed for AI extraction)
- Without it, CV parsing will still work but won't extract structured data

