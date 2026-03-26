from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
import os
from .api import routes
from .api import auth_routes
from .middleware.logging import RequestLoggingMiddleware
from .middleware.auth import JWTAuthMiddleware

# Load environment variables from .env file
load_dotenv()

app = FastAPI(
    title="worldhire2_backend",
    description="FastAPI backend for hiring website form",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    # Production CORS: include the full Vercel URL (https) for the frontend.
    # Configure via env in Railway: FRONTEND_URL or CORS_ORIGINS (comma-separated).
    allow_origins=[
        origin.rstrip("/")
        for origin in (
            os.getenv("CORS_ORIGINS")
            or os.getenv("FRONTEND_URL", "https://worldhire-deploy.vercel.app")
        ).split(",")
        if origin.strip()
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(RequestLoggingMiddleware)

app.add_middleware(JWTAuthMiddleware)

@app.get("/")
async def root():
    """Root endpoint with API information."""
    return JSONResponse({
        "message": "WorldHire2 Backend API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health",
        "endpoints": {
                "auth": {
                    "sign_up": "POST /api/auth/sign-up",
                    "sign_in": "POST /api/auth/sign-in",
                    "refresh": "POST /api/auth/refresh",
                    "logout": "POST /api/auth/logout",
                    "me": "GET /api/auth/me",
                    "verify_token": "POST /api/auth/verify-token"
                },
            "submit_application": "POST /api/submit-application",
            "parse_cv": "POST /api/parse-cv",
            "get_candidate": "GET /api/candidates/{candidate_id}"
        }
    })

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return JSONResponse({"status": "healthy", "service": "worldhire2_backend"})

app.include_router(auth_routes.router, prefix="/api/auth", tags=["authentication"])
app.include_router(routes.router, prefix="/api", tags=["applications"])

