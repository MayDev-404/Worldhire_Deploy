from typing import Optional, Dict, Any
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from ..infrastructure.supabase_client import get_supabase_client
import os

# Password hashing
# Use PBKDF2 for new passwords to avoid bcrypt backend compatibility issues,
# while still allowing verification of any existing bcrypt hashes.
pwd_context = CryptContext(schemes=["pbkdf2_sha256", "bcrypt"], deprecated="auto")

# JWT Configuration
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key-change-in-production")
REFRESH_SECRET_KEY = os.getenv("JWT_REFRESH_SECRET_KEY", SECRET_KEY)  # Can use same or different key
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "15"))  # 15 minutes default
REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "7"))  # 7 days default


class AuthService:
    def __init__(self):
        self.supabase = get_supabase_client()

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """Verify a password against a hash."""
        return pwd_context.verify(plain_password, hashed_password)

    def get_password_hash(self, password: str) -> str:
        """Hash a password."""
        return pwd_context.hash(password)

    def create_access_token(self, data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
        """Create a JWT access token."""
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        
        to_encode.update({"exp": expire, "iat": datetime.utcnow()})
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt

    def verify_token(self, token: str) -> Optional[Dict[str, Any]]:
        """Verify and decode a JWT token."""
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            return payload
        except JWTError:
            return None

    def create_refresh_token(self, data: Dict[str, Any]) -> str:
        """Create a JWT refresh token (long-lived)."""
        to_encode = data.copy()
        expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
        to_encode.update({"exp": expire, "iat": datetime.utcnow(), "type": "refresh"})
        encoded_jwt = jwt.encode(to_encode, REFRESH_SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt

    def verify_refresh_token(self, token: str) -> Optional[Dict[str, Any]]:
        """Verify and decode a refresh token."""
        try:
            payload = jwt.decode(token, REFRESH_SECRET_KEY, algorithms=[ALGORITHM])
            # Verify it's a refresh token
            if payload.get("type") != "refresh":
                return None
            return payload
        except JWTError:
            return None

    async def store_refresh_token(self, user_id: str, refresh_token: str, device_info: Optional[str] = None) -> None:
        """Store refresh token in database for revocation."""
        try:
            token_data = {
                "user_id": user_id,
                "token": refresh_token,
                "device_info": device_info or "Unknown",
                "created_at": datetime.utcnow().isoformat(),
                "expires_at": (datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)).isoformat(),
            }
            self.supabase.table('refresh_tokens').insert(token_data).execute()
        except Exception:
            # If table doesn't exist, continue without storing (graceful degradation)
            pass

    async def revoke_refresh_token(self, refresh_token: str) -> bool:
        """Revoke a refresh token by deleting it from database."""
        try:
            self.supabase.table('refresh_tokens').delete().eq('token', refresh_token).execute()
            return True
        except Exception:
            return False

    async def revoke_all_user_tokens(self, user_id: str) -> bool:
        """Revoke all refresh tokens for a user (logout from all devices)."""
        try:
            self.supabase.table('refresh_tokens').delete().eq('user_id', user_id).execute()
            return True
        except Exception:
            return False

    async def sign_up(self, email: str, password: str, name: Optional[str] = None) -> Dict[str, Any]:
        """Register a new user."""
        # Check if user already exists
        existing = self.supabase.table('users').select('id').eq('email', email).execute()
        
        if existing.data and len(existing.data) > 0:
            raise ValueError("User with this email already exists")
        
        # Hash password
        hashed_password = self.get_password_hash(password)
        
        # Create user record
        user_data = {
            "email": email,
            "password_hash": hashed_password,
            "name": name or email.split('@')[0],
        }
        
        result = self.supabase.table('users').insert(user_data).execute()
        
        if not result.data or len(result.data) == 0:
            raise ValueError("Failed to create user")
        
        user = result.data[0]
        user_id = user.get('id')
        
        # Create access token (short-lived)
        access_token = self.create_access_token(data={"sub": str(user_id), "email": email})
        
        # Create refresh token (long-lived)
        refresh_token = self.create_refresh_token(data={"sub": str(user_id), "email": email})
        
        # Store refresh token in database
        await self.store_refresh_token(str(user_id), refresh_token)
        
        return {
            "user": {
                "id": user_id,
                "email": user.get("email"),
                "name": user.get("name"),
            },
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer"
        }

    async def sign_in(self, email: str, password: str) -> Dict[str, Any]:
        """Authenticate a user and return access token."""
        # Get user from database
        result = self.supabase.table('users').select('*').eq('email', email).execute()
        
        if not result.data or len(result.data) == 0:
            raise ValueError("Invalid email or password")
        
        user = result.data[0]
        password_hash = user.get('password_hash')
        
        if not password_hash:
            raise ValueError("Invalid email or password")
        
        # Verify password
        if not self.verify_password(password, password_hash):
            raise ValueError("Invalid email or password")
        
        user_id = user.get('id')
        
        # Create access token (short-lived)
        access_token = self.create_access_token(data={"sub": str(user_id), "email": email})
        
        # Create refresh token (long-lived)
        refresh_token = self.create_refresh_token(data={"sub": str(user_id), "email": email})
        
        # Store refresh token in database
        await self.store_refresh_token(str(user_id), refresh_token)
        
        # Update last login
        try:
            from datetime import timezone
            self.supabase.table('users').update({
                "last_login": datetime.now(timezone.utc).isoformat()
            }).eq('id', user_id).execute()
        except Exception:
            pass  # Don't fail if update fails
        
        return {
            "user": {
                "id": user_id,
                "email": user.get("email"),
                "name": user.get("name"),
            },
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer"
        }

    async def refresh_access_token(self, refresh_token: str) -> Dict[str, Any]:
        """Generate a new access token using a valid refresh token."""
        # Verify refresh token
        payload = self.verify_refresh_token(refresh_token)
        if not payload:
            raise ValueError("Invalid or expired refresh token")
        
        # Check if token exists in database (not revoked)
        try:
            result = self.supabase.table('refresh_tokens').select('*').eq('token', refresh_token).execute()
            if not result.data or len(result.data) == 0:
                raise ValueError("Refresh token has been revoked")
        except Exception:
            # If table doesn't exist, skip check (graceful degradation)
            pass
        
        user_id = payload.get("sub")
        email = payload.get("email")
        
        if not user_id or not email:
            raise ValueError("Invalid refresh token payload")
        
        # Generate new access token
        access_token = self.create_access_token(data={"sub": user_id, "email": email})
        
        return {
            "access_token": access_token,
            "token_type": "bearer"
        }

    async def get_current_user(self, token: str) -> Optional[Dict[str, Any]]:
        """Get current user from token."""
        payload = self.verify_token(token)
        if not payload:
            return None
        
        user_id = payload.get("sub")
        if not user_id:
            return None
        
        # Get user from database
        result = self.supabase.table('users').select('id,email,name').eq('id', user_id).execute()
        
        if not result.data or len(result.data) == 0:
            return None
        
        return result.data[0]

