# Candidate Schema Recommendations

## Current Issue

**Problem:** Candidates are not linked to user accounts. When a candidate signs up:
1. ✅ User account is created in `users` table (with `password_hash`)
2. ❌ Candidate profile is created in `candidates` table (without `user_id`)
3. ❌ No connection between the two tables

## Recommended Solution

### 1. Add `user_id` Foreign Key to Candidates Table

**Migration Script:** `scripts/008_link_candidates_to_users.sql`

This will:
- Add `user_id UUID REFERENCES users(id)` column to `candidates` table
- Link existing candidates to users by email (one-time migration)
- Create index for faster lookups
- Update RLS policies for user access

### 2. Update Backend to Accept `user_id`

**Changes needed in `application_service.py`:**
- Accept `user_id` parameter in `submit_application()`
- Include `user_id` when inserting candidate data
- Link candidate profile to authenticated user

**Changes needed in `routes.py`:**
- Extract `user_id` from JWT token (if authenticated)
- Pass `user_id` to `submit_application()`
- Handle both authenticated and unauthenticated submissions

### 3. Updated Schema Structure

```sql
candidates (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),  -- NEW: Links to users table
  email TEXT UNIQUE,
  name TEXT,
  -- ... all other fields
)
```

## Benefits

✅ **Single Source of Truth**: One user account per candidate
✅ **Authentication**: Can find candidate profile from user_id
✅ **Security**: Users can only access their own profile
✅ **Data Integrity**: Foreign key ensures valid user references
✅ **No Duplication**: Password stored only in `users` table

## Implementation Steps

1. **Run Migration:**
   ```sql
   -- Run scripts/008_link_candidates_to_users.sql in Supabase
   ```

2. **Update Backend:**
   - Modify `submit_application()` to accept `user_id`
   - Extract user from JWT token in routes
   - Link candidate to user account

3. **Update Frontend:**
   - Pass `user_id` from sign-up response
   - Include `user_id` in application submission

## Alternative Approach (If you prefer)

If you want to store password in candidates table instead:

```sql
ALTER TABLE candidates 
ADD COLUMN password_hash TEXT;
```

**But this is NOT recommended** because:
- ❌ Duplicates password storage
- ❌ Breaks separation of concerns
- ❌ Harder to manage authentication
- ❌ Can't reuse authentication logic

## Recommended: Link via Foreign Key

The best approach is to **link candidates to users** via `user_id` foreign key.

This maintains:
- ✅ Clean separation (auth in `users`, profile in `candidates`)
- ✅ Single password storage location
- ✅ Reusable authentication system
- ✅ Easy to query: "Get candidate profile for user X"

