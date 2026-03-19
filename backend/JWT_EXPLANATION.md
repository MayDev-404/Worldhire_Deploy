# JWT Token Generation Explained

## Overview

The backend uses **python-jose** library to generate and verify JWT (JSON Web Tokens) for authentication.

## Token Generation Process

### 1. Configuration

Located in `backend/app/services/auth_service.py`:

```python
# JWT Configuration
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"  # HMAC with SHA-256
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))  # 24 hours default
```

**Key Points:**
- **SECRET_KEY**: Used to sign the token (must be kept secret!)
- **ALGORITHM**: HS256 (symmetric algorithm using shared secret)
- **Expiration**: Default 24 hours (1440 minutes), configurable via environment variable

### 2. Token Creation Method

```python
def create_access_token(self, data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT access token."""
    to_encode = data.copy()
    
    # Set expiration time
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    # Add standard JWT claims
    to_encode.update({
        "exp": expire,      # Expiration time
        "iat": datetime.utcnow()  # Issued at time
    })
    
    # Encode the token
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
```

### 3. Token Payload Structure

When a user signs up or signs in, the token contains:

```python
{
    "sub": str(user_id),    # Subject (user ID)
    "email": email,         # User's email
    "exp": <timestamp>,     # Expiration time
    "iat": <timestamp>      # Issued at time
}
```

**Example:**
```json
{
  "sub": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "exp": 1704067200,
  "iat": 1703980800
}
```

### 4. Token Generation Flow

#### Sign Up Flow:
```python
# 1. Create user in database
user = create_user(email, password, name)

# 2. Generate token with user data
access_token = create_access_token({
    "sub": str(user_id),
    "email": email
})

# 3. Return token to client
return {
    "user": {...},
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer"
}
```

#### Sign In Flow:
```python
# 1. Verify credentials
user = verify_user(email, password)

# 2. Generate token
access_token = create_access_token({
    "sub": str(user_id),
    "email": email
})

# 3. Return token
return {
    "user": {...},
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer"
}
```

## Token Structure (JWT Format)

A JWT token has 3 parts separated by dots (`.`):

```
header.payload.signature
```

### 1. Header
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```
Base64URL encoded.

### 2. Payload
```json
{
  "sub": "user-id",
  "email": "user@example.com",
  "exp": 1704067200,
  "iat": 1703980800
}
```
Base64URL encoded.

### 3. Signature
```
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  SECRET_KEY
)
```

## Token Verification

```python
def verify_token(self, token: str) -> Optional[Dict[str, Any]]:
    """Verify and decode a JWT token."""
    try:
        # Decode and verify signature
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        # Token is invalid, expired, or tampered with
        return None
```

**What happens:**
1. Decodes the token
2. Verifies the signature using SECRET_KEY
3. Checks expiration (`exp` claim)
4. Returns payload if valid, None if invalid

## Security Features

### ✅ What's Secure:
- **Password Hashing**: Passwords are hashed with bcrypt (never stored in token)
- **Token Signing**: Tokens are signed with SECRET_KEY (prevents tampering)
- **Expiration**: Tokens expire after 24 hours (configurable)
- **Algorithm**: HS256 is a secure symmetric algorithm

### ⚠️ Security Best Practices:

1. **SECRET_KEY Must Be Strong:**
   ```bash
   # Generate a secure key:
   python3 -c "import secrets; print(secrets.token_urlsafe(32))"
   ```

2. **Never Commit SECRET_KEY:**
   - Store in `.env` file
   - Add `.env` to `.gitignore`
   - Use different keys for dev/prod

3. **HTTPS in Production:**
   - Always use HTTPS to prevent token interception

4. **Token Storage:**
   - Frontend: Store in localStorage or httpOnly cookies
   - Never expose in URLs or logs

## Environment Variables

Add to `backend/.env`:

```env
# Required: Strong secret key for signing tokens
JWT_SECRET_KEY=your-generated-secret-key-here

# Optional: Token expiration in minutes (default: 1440 = 24 hours)
ACCESS_TOKEN_EXPIRE_MINUTES=1440
```

## Example Token

**Generated Token:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1NTBlODQwMC1lMjliLTQxZDQtYTcxNi00NDY2NTU0NDAwMDAiLCJlbWFpbCI6InVzZXJAZXhhbXBsZS5jb20iLCJleHAiOjE3MDQwNjcyMDAsImlhdCI6MTcwMzk4MDgwMH0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

**Decoded (for reference):**
- Header: `{"alg":"HS256","typ":"JWT"}`
- Payload: `{"sub":"550e8400-e29b-41d4-a716-446655440000","email":"user@example.com","exp":1704067200,"iat":1703980800}`
- Signature: Verified using SECRET_KEY

## Testing Token Generation

```python
from app.services.auth_service import AuthService

# Create service instance
auth_service = AuthService()

# Generate token
token = auth_service.create_access_token({
    "sub": "user-123",
    "email": "test@example.com"
})

print(f"Token: {token}")

# Verify token
payload = auth_service.verify_token(token)
print(f"Payload: {payload}")
```

## Summary

1. **Library**: `python-jose` (JWT implementation)
2. **Algorithm**: HS256 (HMAC-SHA256)
3. **Secret**: From `JWT_SECRET_KEY` environment variable
4. **Expiration**: 24 hours (configurable)
5. **Payload**: User ID (`sub`) and email
6. **Security**: Signed with secret key, expires automatically

The token is stateless - all user information needed for authentication is encoded in the token itself!

