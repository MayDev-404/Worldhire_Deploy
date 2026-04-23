import os
import httpx
import logging
from typing import Optional

logger = logging.getLogger("backend")

# Maximum number of retry attempts for transient Groq API failures
MAX_RETRIES = 3


class GroqClient:
    """HTTP client for the Groq chat-completions API (OpenAI-compatible)."""

    def __init__(self):
        self.api_key = os.getenv("GROQ_API_KEY")
        self.base_url = "https://api.groq.com/openai/v1/chat/completions"
        self.model = "llama-3.3-70b-versatile"

    async def generate_json(
        self, prompt: str, system_prompt: Optional[str] = None
    ) -> str:
        """
        Send a chat-completion request to Groq and return the assistant's
        message content.  The request uses ``response_format: json_object``
        so the model is constrained to emit valid JSON.

        Implements automatic retries with exponential back-off for transient
        HTTP errors (5xx, timeouts).
        """
        if not self.api_key:
            raise RuntimeError("GROQ_API_KEY environment variable is not set")

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})

        payload = {
            "model": self.model,
            "messages": messages,
            "temperature": 0.0,
            "response_format": {"type": "json_object"},
        }

        last_error: Exception | None = None

        for attempt in range(1, MAX_RETRIES + 1):
            try:
                async with httpx.AsyncClient(timeout=60.0) as client:
                    response = await client.post(
                        self.base_url, headers=headers, json=payload
                    )
                    response.raise_for_status()

                    data = response.json()
                    if "choices" in data and len(data["choices"]) > 0:
                        return data["choices"][0]["message"]["content"]
                    else:
                        raise ValueError("No choices returned from Groq API")

            except (httpx.TimeoutException, httpx.HTTPStatusError) as exc:
                last_error = exc
                
                # If it's an HTTP error, check if it's transient (5xx) or client (4xx)
                is_transient = isinstance(exc, httpx.TimeoutException) or (
                    isinstance(exc, httpx.HTTPStatusError) and exc.response.status_code >= 500
                )
                
                if not is_transient:
                    # Client error (4xx) — do not retry, raise immediately
                    logger.error(f"Groq API Client Error: {exc}")
                    raise
                
                logger.warning(
                    "Groq API transient error (attempt %d/%d): %s",
                    attempt,
                    MAX_RETRIES,
                    exc,
                )
                
                if attempt < MAX_RETRIES:
                    # Simple exponential back-off
                    import asyncio
                    await asyncio.sleep(attempt)
            except Exception as exc:
                # Other unexpected errors — surface immediately
                logger.exception(f"Unexpected error in Groq client: {exc}")
                raise

        # All retries exhausted
        raise RuntimeError(
            f"Groq API failed after {MAX_RETRIES} attempts: {last_error}"
        )
