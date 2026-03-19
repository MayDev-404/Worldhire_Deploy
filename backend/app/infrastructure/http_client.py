import httpx
from typing import Any, Dict, Optional

async def post_json(url: str, payload: Dict[str, Any], headers: Optional[Dict[str, str]] = None, timeout: int = 10) -> Dict[str, Any]:
    """Generic helper to perform POST requests with JSON payloads."""
    async with httpx.AsyncClient(timeout=timeout) as client:
        resp = await client.post(url, json=payload, headers=headers)
        resp.raise_for_status()
        return resp.json()
