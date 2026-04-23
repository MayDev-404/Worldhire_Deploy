from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse
import logging
from typing import List, Tuple

from ..services.auth_service import AuthService

logger = logging.getLogger("backend")

# Paths that do NOT require authentication.
# Each entry is a (method, path) tuple.  method="*" matches any HTTP method.
PUBLIC_PATHS: List[Tuple[str, str]] = [
    ("*", "/"),
    ("*", "/health"),
    ("*", "/docs"),
    ("*", "/docs/oauth2-redirect"),
    ("*", "/redoc"),
    ("*", "/openapi.json"),
    ("POST", "/api/auth/sign-up"),
    ("POST", "/api/auth/sign-in"),
    ("POST", "/api/auth/refresh"),
    ("POST", "/api/auth/verify-token"),
    ("POST", "/api/auth/logout"),
    # CV parsing runs before signup — must be publicly accessible
    ("POST", "/api/parse-cv"),
    # Application submission handles auth internally via the Authorization header
    ("POST", "/api/submit-application"),
]


def _is_public(method: str, path: str) -> bool:
    """Return True if the request should bypass JWT verification."""
    # CORS preflight requests must always pass through.
    if method == "OPTIONS":
        return True

    for allowed_method, allowed_path in PUBLIC_PATHS:
        if path == allowed_path and (allowed_method == "*" or allowed_method == method):
            return True

    return False


class JWTAuthMiddleware(BaseHTTPMiddleware):
    """Middleware that enforces a valid JWT on every non-public request."""

    async def dispatch(self, request: Request, call_next):
        # Always allow CORS preflight requests.
        if request.method == "OPTIONS":
            return await call_next(request)

        method = request.method
        path = request.url.path

        # Let public / whitelisted requests through without a token.
        if _is_public(method, path):
            return await call_next(request)

        # --- Extract token from Authorization header ---
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            logger.warning(f"JWT middleware: missing/malformed Authorization header on {method} {path}")
            return JSONResponse(
                {"detail": "Authentication required. Please provide a valid Bearer token."},
                status_code=401,
            )

        token = auth_header.replace("Bearer ", "", 1)

        # --- Verify token ---
        auth_service = AuthService()
        payload = auth_service.verify_token(token)

        if payload is None:
            logger.warning(f"JWT middleware: invalid/expired token on {method} {path}")
            return JSONResponse(
                {"detail": "Invalid or expired token. Please sign in again."},
                status_code=401,
            )

        # Attach user info to request.state so downstream handlers can use it.
        request.state.user_id = payload.get("sub")
        request.state.user_email = payload.get("email")

        return await call_next(request)
