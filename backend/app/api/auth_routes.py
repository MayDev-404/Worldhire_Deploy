from fastapi import APIRouter, HTTPException, Depends, Header
from fastapi.responses import JSONResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr
from typing import Optional
from ..services.auth_service import AuthService

router = APIRouter()
security = HTTPBearer()


# Request models
class SignUpRequest(BaseModel):
    email: EmailStr
    password: str
    name: Optional[str] = None


class SignInRequest(BaseModel):
    email: EmailStr
    password: str


class RefreshTokenRequest(BaseModel):
    refresh_token: str


class LogoutRequest(BaseModel):
    refresh_token: str


class RefreshTokenRequest(BaseModel):
    refresh_token: str


class LogoutRequest(BaseModel):
    refresh_token: str


# Response models
class AuthResponse(BaseModel):
    user: dict
    access_token: str
    token_type: str


# Dependency to get current user
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Dependency to get current authenticated user."""
    token = credentials.credentials
    auth_service = AuthService()
    user = await auth_service.get_current_user(token)
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    
    return user


@router.post("/sign-up", response_model=AuthResponse)
async def sign_up(request: SignUpRequest):
    """Register a new user."""
    try:
        auth_service = AuthService()
        result = await auth_service.sign_up(
            email=request.email,
            password=request.password,
            name=request.name
        )
        return JSONResponse(result, status_code=201)
    except ValueError as e:
        return JSONResponse({"error": str(e)}, status_code=400)
    except Exception as e:
        import logging
        logger = logging.getLogger("backend")
        logger.error(f"Sign up error: {e}", exc_info=True)
        return JSONResponse({"error": "Failed to create user", "details": str(e)}, status_code=500)


@router.post("/sign-in", response_model=AuthResponse)
async def sign_in(request: SignInRequest):
    """Sign in and get access token."""
    try:
        auth_service = AuthService()
        result = await auth_service.sign_in(
            email=request.email,
            password=request.password
        )
        return JSONResponse(result, status_code=200)
    except ValueError as e:
        return JSONResponse({"error": str(e)}, status_code=401)
    except Exception as e:
        import logging
        logger = logging.getLogger("backend")
        logger.error(f"Sign in error: {e}", exc_info=True)
        return JSONResponse({"error": "Failed to authenticate", "details": str(e)}, status_code=500)


@router.get("/me")
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    """Get current authenticated user information."""
    return JSONResponse({"user": current_user}, status_code=200)


@router.post("/verify-token")
async def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Verify if a token is valid."""
    token = credentials.credentials
    auth_service = AuthService()
    payload = auth_service.verify_token(token)
    
    if not payload:
        return JSONResponse({"valid": False}, status_code=401)
    
    return JSONResponse({"valid": True, "payload": payload}, status_code=200)


@router.post("/refresh")
async def refresh_token(request: RefreshTokenRequest):
    """Refresh access token using refresh token."""
    try:
        auth_service = AuthService()
        result = await auth_service.refresh_access_token(request.refresh_token)
        return JSONResponse(result, status_code=200)
    except ValueError as e:
        return JSONResponse({"error": str(e)}, status_code=401)
    except Exception as e:
        import logging
        logger = logging.getLogger("backend")
        logger.error(f"Token refresh error: {e}", exc_info=True)
        return JSONResponse({"error": "Failed to refresh token", "details": str(e)}, status_code=500)


@router.post("/logout")
async def logout(request: LogoutRequest):
    """Logout and revoke refresh token."""
    try:
        auth_service = AuthService()
        await auth_service.revoke_refresh_token(request.refresh_token)
        return JSONResponse({"message": "Logged out successfully"}, status_code=200)
    except Exception as e:
        import logging
        logger = logging.getLogger("backend")
        logger.error(f"Logout error: {e}", exc_info=True)
        return JSONResponse({"error": "Failed to logout", "details": str(e)}, status_code=500)

