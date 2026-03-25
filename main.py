"""
Railway entrypoint.

This file exists so the Procfile can run: `uvicorn main:app`.
The actual FastAPI application lives in `backend/app/main.py`.
"""

from backend.app.main import app  # noqa: F401

