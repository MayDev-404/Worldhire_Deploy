from typing import Optional, Any, Dict
from fastapi import UploadFile
from PyPDF2 import PdfReader
import io
import os
import json
import httpx


class CVService:
    async def _extract_text_from_file(self, file: UploadFile) -> str:
        """Extract raw text from uploaded file."""
        contents = await file.read()
        
        # Try PDF
        if file.content_type == 'application/pdf' or (file.filename and file.filename.lower().endswith('.pdf')):
            try:
                reader = PdfReader(io.BytesIO(contents))
                full_text = []
                for p in reader.pages:
                    txt = p.extract_text() or ""
                    full_text.append(txt)
                return "\n\n".join(full_text).strip()
            except Exception as e:
                raise RuntimeError(f"PDF parsing failed: {e}")

        # Try docx
        if file.filename and file.filename.lower().endswith('.docx'):
            try:
                import docx
                doc = docx.Document(io.BytesIO(contents))
                paragraphs = [p.text for p in doc.paragraphs]
                return "\n\n".join(paragraphs)
            except Exception as e:
                raise RuntimeError(f"DOCX parsing failed: {e}")

        # Fallback: try decode as text
        try:
            decoded = contents.decode('utf-8')
            return decoded
        except Exception:
            raise RuntimeError("Unsupported file type or binary content")

    async def _extract_cv_data_with_ai(self, cv_text: str) -> Dict[str, Any]:
        """Extract structured data from CV text using HuggingFace AI."""
        hf_token = os.getenv('HUGGINGFACE_API_KEY')
        
        if not hf_token:
            # Return empty structure if no API key
            return {}
        
        model = os.getenv('HUGGINGFACE_MODEL', 'google/gemma-2b-it')
        
        prompt = f"""Extract the following information from this CV/resume text and return it as a JSON object. Only include fields that are present in the CV.

CV Text:
{cv_text[:3000]}{'... (truncated)' if len(cv_text) > 3000 else ''}

Extract and return a JSON object with these fields (only include fields that exist):
{{
  "name": "full name",
  "email": "email address",
  "phone": "phone number",
  "location": "current location/city",
  "nationality": "nationality",
  "skills": "comma-separated list of skills",
  "experience": "years of experience or experience summary",
  "education": "education summary",
  "workHistory": "brief work history summary",
  "linkedinProfile": "LinkedIn URL if present",
  "currentRole": "current job title",
  "preferredRole": "preferred role if mentioned",
  "workExperiences": [
    {{
      "companyName": "company name",
      "role": "job title",
      "startMonth": "month name",
      "startYear": "year",
      "endMonth": "month name or empty if current",
      "endYear": "year or empty if current",
      "description": "job description",
      "isCurrent": true or false
    }}
  ],
  "educations": [
    {{
      "degree": "degree name",
      "institute": "institution name",
      "startYear": "year",
      "endYear": "year"
    }}
  ]
}}

Return ONLY valid JSON, no additional text or markdown formatting."""

        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    f"https://api-inference.huggingface.co/models/{model}",
                    headers={"Authorization": f"Bearer {hf_token}"},
                    json={
                        "inputs": prompt,
                        "parameters": {
                            "max_new_tokens": 2000,
                            "temperature": 0.3,
                            "return_full_text": False,
                        }
                    }
                )
                response.raise_for_status()
                result = response.json()
                
                # Extract generated text
                generated_text = ""
                if isinstance(result, list) and len(result) > 0:
                    generated_text = result[0].get('generated_text', '')
                elif isinstance(result, dict):
                    generated_text = result.get('generated_text', '')
                
                # Clean up response text
                generated_text = generated_text.strip()
                generated_text = generated_text.replace('```json\n', '').replace('```\n', '').replace('```', '').strip()
                
                # Try to find JSON object in the response
                json_match = None
                if '{' in generated_text:
                    start = generated_text.find('{')
                    brace_count = 0
                    end = start
                    for i in range(start, len(generated_text)):
                        if generated_text[i] == '{':
                            brace_count += 1
                        elif generated_text[i] == '}':
                            brace_count -= 1
                            if brace_count == 0:
                                end = i + 1
                                break
                    if end > start:
                        json_match = generated_text[start:end]
                
                if json_match:
                    extracted_data = json.loads(json_match)
                    # Clean and validate
                    return {
                        "name": extracted_data.get("name", "").strip() if extracted_data.get("name") else None,
                        "email": extracted_data.get("email", "").strip() if extracted_data.get("email") else None,
                        "phone": extracted_data.get("phone", "").strip() if extracted_data.get("phone") else None,
                        "location": extracted_data.get("location", "").strip() if extracted_data.get("location") else None,
                        "nationality": extracted_data.get("nationality", "").strip() if extracted_data.get("nationality") else None,
                        "skills": extracted_data.get("skills", "").strip() if extracted_data.get("skills") else None,
                        "experience": extracted_data.get("experience", "").strip() if extracted_data.get("experience") else None,
                        "education": extracted_data.get("education", "").strip() if extracted_data.get("education") else None,
                        "workHistory": extracted_data.get("workHistory", "").strip() if extracted_data.get("workHistory") else None,
                        "linkedinProfile": extracted_data.get("linkedinProfile", "").strip() if extracted_data.get("linkedinProfile") else None,
                        "currentRole": extracted_data.get("currentRole", "").strip() if extracted_data.get("currentRole") else None,
                        "preferredRole": extracted_data.get("preferredRole", "").strip() if extracted_data.get("preferredRole") else None,
                        "workExperiences": [
                            exp for exp in extracted_data.get("workExperiences", [])
                            if exp.get("companyName") and exp.get("role") and exp.get("startYear")
                        ] if extracted_data.get("workExperiences") else None,
                        "educations": [
                            edu for edu in extracted_data.get("educations", [])
                            if edu.get("degree") and edu.get("institute") and edu.get("startYear") and edu.get("endYear")
                        ] if extracted_data.get("educations") else None,
                    }
                else:
                    return {}
        except Exception as e:
            # Log error but don't fail - return empty structure
            import logging
            logger = logging.getLogger("backend")
            logger.warning(f"AI extraction failed: {e}")
            return {}

    async def parse_cv(self, file: Optional[UploadFile] = None, text: Optional[str] = None) -> Dict[str, Any]:
        """Parse CV file or text and extract structured data using AI."""
        if text:
            # If raw text provided, extract with AI
            extracted = await self._extract_cv_data_with_ai(text)
            return extracted

        if not file:
            raise ValueError("No file or text provided")

        # Extract text from file
        extracted_text = await self._extract_text_from_file(file)
        
        if not extracted_text or not extracted_text.strip():
            raise ValueError("Could not extract text from the file. Please ensure the file is readable.")

        # Extract structured data using AI
        extracted_data = await self._extract_cv_data_with_ai(extracted_text)
        
        return extracted_data
