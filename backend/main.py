"""
Railway/Nixpacks entrypoint.

Nixpacks start command runs from repo root:
  cd backend && python -m uvicorn main:app ...

The actual FastAPI app lives in `backend/app/main.py`.
"""

from app.main import app  # noqa: F401

