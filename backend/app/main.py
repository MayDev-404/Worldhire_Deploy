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

app.add_middleware(RequestLoggingMiddleware)

# CORS Configuration - Allow frontend to call backend
# Get allowed origins from environment variable or default to localhost
allowed_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
allowed_origins = [origin.strip() for origin in allowed_origins]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

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

