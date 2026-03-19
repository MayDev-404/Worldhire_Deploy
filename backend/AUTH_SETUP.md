# Authentication Setup Guide

## Overview

The backend now includes a complete authentication system with JWT tokens.

## Database Setup

### 1. Create Users Table

Run the SQL script in your Supabase SQL Editor:

```bash
# File: scripts/006_create_users_table.sql
```

Or manually run:
```sql
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
```

## Environment Variables

Add to `backend/.env`:

```env
# JWT Configuration
JWT_SECRET_KEY=your-super-secret-key-change-this-in-production
ACCESS_TOKEN_EXPIRE_MINUTES=1440  # 24 hours (optional, defaults to 1440)
```

**Important:** Generate a secure secret key:
```bash
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

## API Endpoints

### Sign Up
```http
POST /api/auth/sign-up
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123",
  "name": "John Doe"  // optional
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "access_token": "jwt-token-here",
  "token_type": "bearer"
}
```

### Sign In
```http
POST /api/auth/sign-in
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "access_token": "jwt-token-here",
  "token_type": "bearer"
}
```

### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### Verify Token
```http
POST /api/auth/verify-token
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "valid": true,
  "payload": {
    "sub": "user-id",
    "email": "user@example.com",
    "exp": 1234567890,
    "iat": 1234567890
  }
}
```

## Usage in Frontend

### Sign Up Example
```typescript
const response = await fetch('http://localhost:8000/api/auth/sign-up', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123',
    name: 'John Doe'
  })
});

const data = await response.json();
// Store token: localStorage.setItem('token', data.access_token);
```

### Sign In Example
```typescript
const response = await fetch('http://localhost:8000/api/auth/sign-in', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

const data = await response.json();
// Store token: localStorage.setItem('token', data.access_token);
```

### Authenticated Request Example
```typescript
const token = localStorage.getItem('token');

const response = await fetch('http://localhost:8000/api/auth/me', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const user = await response.json();
```

## Protecting Routes

To protect a route, use the `get_current_user` dependency:

```python
from ..api.auth_routes import get_current_user

@router.get("/protected-endpoint")
async def protected_endpoint(current_user: dict = Depends(get_current_user)):
    # current_user contains: {"id": "...", "email": "...", "name": "..."}
    return {"message": f"Hello {current_user['name']}"}
```

## Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT token-based authentication
- ✅ Token expiration (configurable)-30mins
- ✅ Secure password storage (never stored in plain text)
- ✅ Email uniqueness validation
- ✅ Row Level Security (RLS) on users table
- refresh token life 1 hour

## Testing
-swagger

### Test Sign Up
```bash
curl -X POST http://localhost:8000/api/auth/sign-up \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","name":"Test User"}'
```

### Test Sign In
```bash
curl -X POST http://localhost:8000/api/auth/sign-in \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

### Test Get Current User
```bash
curl -X GET http://localhost:8000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Troubleshooting

### "User with this email already exists"
- User is already registered
- Use sign-in endpoint instead

### "Invalid email or password"
- Check email and password are correct
- Ensure user exists in database

### "Invalid authentication credentials"
- Token is expired or invalid
- Request new token by signing in again

### Database errors
- Ensure users table exists
- Check Supabase connection
- Verify RLS policies are set correctly

