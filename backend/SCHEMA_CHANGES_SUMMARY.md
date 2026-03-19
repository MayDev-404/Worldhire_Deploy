# Candidate Schema Changes Summary

## Problem Identified

**Current Issue:** Candidates are not linked to user accounts. When a candidate signs up:
1. ✅ User account created in `users` table (with `password_hash`)
2. ❌ Candidate profile created in `candidates` table (without `user_id`)
3. ❌ No connection between authentication and profile

## Solution Implemented

### 1. Database Migration

**File:** `scripts/008_link_candidates_to_users.sql`

**Changes:**
- ✅ Add `user_id UUID REFERENCES users(id)` column to `candidates` table
- ✅ Create index on `user_id` for faster lookups
- ✅ Migrate existing candidates to link by email (one-time)
- ✅ Update RLS policies for user access

**Run this migration:**
```sql
-- Execute scripts/008_link_candidates_to_users.sql in Supabase SQL Editor
```

### 2. Backend Changes

**File:** `backend/app/services/application_service.py`
- ✅ Added `user_id` parameter to `submit_application()`
- ✅ Include `user_id` in candidate data when inserting

**File:** `backend/app/api/routes.py`
- ✅ Extract `user_id` from JWT token (if authenticated)
- ✅ Pass `user_id` to `submit_application()`

### 3. Frontend Changes

**File:** `frontend/components/auth/candidate-signup-form.tsx`
- ✅ Get access token after sign-up
- ✅ Pass token when submitting application

**File:** `frontend/lib/api-client.ts`
- ✅ Updated `submitApplication()` to accept optional token
- ✅ Include Authorization header if token provided

## Updated Schema

```sql
candidates (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),  -- NEW: Links to users table
  email TEXT UNIQUE,
  name TEXT,
  -- ... all other fields remain the same
)
```

## Benefits

✅ **Linked Accounts**: Candidate profiles linked to user accounts
✅ **Authentication**: Can find candidate from user_id
✅ **Security**: Users can only access their own profile
✅ **No Password Duplication**: Password stored only in `users` table
✅ **Data Integrity**: Foreign key ensures valid references

## Next Steps

1. **Run Migration:**
   ```bash
   # Execute scripts/008_link_candidates_to_users.sql in Supabase
   ```

2. **Test Flow:**
   - Sign up as candidate → creates user account
   - Submit profile → links candidate to user via `user_id`
   - Sign in → can access candidate profile via `user_id`

3. **Verify:**
   - Check that `candidates.user_id` is populated
   - Verify foreign key relationship works
   - Test RLS policies

## Current Status

✅ Migration script created
✅ Backend updated to accept `user_id`
✅ Frontend updated to pass token
⏳ **Waiting for:** You to run the migration SQL script

Once you run the migration, the system will automatically link candidates to users!
