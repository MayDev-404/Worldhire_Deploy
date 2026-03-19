# Full Database Schema Design

This document describes the complete database schema for the hiring/application fullstack. All tables run on **Supabase (PostgreSQL)**.

---

## Entity Relationship Overview

```
users (auth)
  ├── 1:1 → candidates (via candidates.user_id)
  └── 1:N → refresh_tokens

candidates
  ├── 1:N → work_experiences
  └── 1:N → educations

storage (Supabase Storage)
  ├── bucket: candidate-cvs (private)
  └── bucket: candidate-photos (public)
```

---

## Tables

### 1. `users`

Authentication and identity. Used by the backend JWT auth (sign-up/sign-in).

| Column          | Type                     | Constraints              | Description                    |
|-----------------|--------------------------|--------------------------|--------------------------------|
| id              | UUID                     | PRIMARY KEY, DEFAULT gen_random_uuid() | User ID |
| email           | VARCHAR(255)             | UNIQUE, NOT NULL         | Login email                    |
| password_hash   | TEXT                     | NOT NULL                 | Bcrypt hash                    |
| name            | VARCHAR(255)             |                          | Display name                   |
| created_at      | TIMESTAMPTZ              | DEFAULT NOW()            |                                |
| updated_at      | TIMESTAMPTZ              | DEFAULT NOW()            |                                |
| last_login      | TIMESTAMPTZ              |                          | Last sign-in                   |
| is_active       | BOOLEAN                  | DEFAULT TRUE             | Account enabled                |

**Indexes:** `idx_users_email` on `email`  
**RLS:** Enabled. Users can SELECT own row; service_role has full access.

---

### 2. `refresh_tokens`

Stored refresh tokens for JWT refresh flow (revocation, multi-device).

| Column     | Type         | Constraints                    | Description        |
|------------|--------------|--------------------------------|--------------------|
| id         | UUID         | PRIMARY KEY, DEFAULT gen_random_uuid() | |
| user_id    | UUID         | NOT NULL, REFERENCES users(id) ON DELETE CASCADE | |
| token      | TEXT         | NOT NULL UNIQUE                | JWT refresh token  |
| device_info| VARCHAR(255) |                                | Optional device    |
| created_at | TIMESTAMPTZ  | DEFAULT NOW()                  | |
| expires_at | TIMESTAMPTZ  | NOT NULL                       | |
| revoked    | BOOLEAN      | DEFAULT FALSE                  | |
| revoked_at | TIMESTAMPTZ  |                                | |

**Indexes:** `idx_refresh_tokens_token`, `idx_refresh_tokens_user_id`, `idx_refresh_tokens_expires_at`  
**RLS:** Enabled. Service role full access.

---

### 3. `candidates`

Single table for candidate application/profile. One row per application; optional link to `users` when they sign up.

| Column                      | Type    | Constraints                    | Description |
|-----------------------------|---------|--------------------------------|-------------|
| id                          | UUID    | PRIMARY KEY, DEFAULT gen_random_uuid() | |
| user_id                     | UUID    | REFERENCES users(id) ON DELETE SET NULL | Optional link to users |
| created_at                  | TIMESTAMPTZ | DEFAULT NOW()               | |
| updated_at                  | TIMESTAMPTZ | DEFAULT NOW()               | |
| name                        | TEXT    | NOT NULL                     | |
| mobile_number               | TEXT    | NOT NULL                     | |
| email                       | TEXT    | NOT NULL UNIQUE              | |
| current_location            | TEXT    | NOT NULL                     | |
| current_salary_currency     | TEXT    | NOT NULL                     | |
| salary_range                | TEXT    | NOT NULL                     | |
| nationality                 | TEXT    | NOT NULL                     | |
| gender                      | TEXT    | NOT NULL                     | |
| cv_url                      | TEXT    |                                | |
| photograph_url              | TEXT    |                                | |
| seniority_level             | TEXT    |                                | |
| reporting_manager           | TEXT    |                                | |
| preferred_location         | TEXT    | NOT NULL                     | |
| skills                      | TEXT    | NOT NULL                     | |
| experience                  | TEXT    | NOT NULL                     | |
| work_history                | TEXT    |                                | Legacy/backup (nullable after migration) |
| education                   | TEXT    |                                | Legacy/backup (nullable after migration) |
| expected_salary_currency    | TEXT    | NOT NULL                     | |
| expected_salary_range       | TEXT    | NOT NULL                     | |
| linkedin_profile            | TEXT    |                                | |
| portfolio                   | TEXT    |                                | |
| preferred_role              | TEXT    |                                | |
| work_permit_status          | TEXT    | DEFAULT 'Nationality basis'   | |
| employment_type             | TEXT    | DEFAULT 'Permanent'           | |
| work_mode                   | TEXT    | NOT NULL DEFAULT 'Hybrid'     | |
| references                  | TEXT    |                                | |
| notice_period               | TEXT    | NOT NULL                     | |
| actively_seeking_toggle     | TEXT    | NOT NULL DEFAULT 'Passive'    | |
| application_status         | TEXT    | DEFAULT 'submitted'           | |
| profile_completion_percentage | INTEGER | DEFAULT 0                   | |

**Indexes:** `idx_candidates_email`, `idx_candidates_status`, `idx_candidates_created_at`, `idx_candidates_user_id`  
**RLS:** Enabled. Public/anon can INSERT; authenticated can SELECT/UPDATE; users can SELECT/UPDATE own row when `auth.uid() = user_id` (if using Supabase Auth from frontend).

---

### 4. `work_experiences`

One row per job/role per candidate. Replaces the denormalized `work_history` JSON on `candidates`.

| Column       | Type        | Constraints                              | Description |
|--------------|-------------|------------------------------------------|-------------|
| id           | UUID        | PRIMARY KEY, DEFAULT gen_random_uuid()   | |
| candidate_id | UUID        | NOT NULL, REFERENCES candidates(id) ON DELETE CASCADE | |
| created_at   | TIMESTAMPTZ | DEFAULT NOW()                            | |
| updated_at   | TIMESTAMPTZ | DEFAULT NOW()                            | |
| company_name | TEXT        | NOT NULL                                 | |
| role         | TEXT        | NOT NULL                                 | |
| start_month  | TEXT        | NOT NULL                                 | |
| start_year   | TEXT        | NOT NULL                                 | |
| end_month    | TEXT        |                                          | |
| end_year     | TEXT        |                                          | |
| description  | TEXT        |                                          | |
| is_current   | BOOLEAN     | DEFAULT FALSE                            | |
| display_order| INTEGER     | DEFAULT 0                                | |

**Indexes:** `idx_work_experiences_candidate_id`, `idx_work_experiences_display_order (candidate_id, display_order)`  
**RLS:** Enabled. Anyone can INSERT; authenticated can SELECT/UPDATE.

---

### 5. `educations`

One row per education entry per candidate. Replaces the denormalized `education` on `candidates`.

| Column       | Type        | Constraints                              | Description |
|--------------|-------------|------------------------------------------|-------------|
| id           | UUID        | PRIMARY KEY, DEFAULT gen_random_uuid()   | |
| candidate_id | UUID        | NOT NULL, REFERENCES candidates(id) ON DELETE CASCADE | |
| created_at   | TIMESTAMPTZ | DEFAULT NOW()                            | |
| updated_at   | TIMESTAMPTZ | DEFAULT NOW()                            | |
| degree       | TEXT        | NOT NULL                                 | |
| institute    | TEXT        | NOT NULL                                 | |
| start_year   | TEXT        | NOT NULL                                 | |
| end_year     | TEXT        | NOT NULL                                 | |
| display_order| INTEGER     | DEFAULT 0                                | |

**Indexes:** `idx_educations_candidate_id`, `idx_educations_display_order (candidate_id, display_order)`  
**RLS:** Enabled. Anyone can INSERT; authenticated can SELECT/UPDATE.

---

## Storage (Supabase Storage)

- **candidate-cvs** – Private bucket for CV files (PDF, DOC, DOCX). Only authenticated (e.g. recruiters) can read; anyone can upload for applications.
- **candidate-photos** – Public bucket for profile photos (JPEG, PNG, WebP, GIF). Public read; anyone can upload.

---

## Run Order for Migrations

For a **new database**, run scripts in this order:

1. `006_create_users_table.sql`
2. `007_create_refresh_tokens_table.sql`
3. `001_create_candidates_table.sql`
4. `004_migrate_work_history.sql` (creates `work_experiences`, makes `work_history` nullable)
5. `005_migrate_education.sql` (creates `educations`, makes `education` nullable)
6. `002_create_storage_buckets.sql`
7. `003_fix_rls_policies.sql`
8. `008_link_candidates_to_users.sql` (adds `user_id` to `candidates`, indexes, RLS, backfill)

**Or** run the single consolidated script: **`backend/scripts/000_full_schema.sql`** (idempotent; safe on empty or existing DB).

### Quick start (Supabase SQL Editor)

1. Open your Supabase project → SQL Editor.
2. Paste the contents of `backend/scripts/000_full_schema.sql`.
3. Run the script once.
4. Configure backend `.env` with `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (and `JWT_SECRET_KEY` for auth).
5. Start backend and frontend; the fullstack app will use this schema.
