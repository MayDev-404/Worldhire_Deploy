import io
import json
import logging
from typing import Optional, Any, Dict
from fastapi import UploadFile
from PyPDF2 import PdfReader

from ..infrastructure.groq_client import GroqClient
from ..infrastructure.storage_service import StorageService
from .form_mapper import FormMapper

logger = logging.getLogger("backend")

class CVService:
    def __init__(self):
        self.groq_client = GroqClient()
        self.storage_service = StorageService()
        self.form_mapper = FormMapper()

    async def _extract_text_from_file(self, file: UploadFile) -> str:
        """Extract raw text from uploaded file."""
        contents = await file.read()
        await file.seek(0)
        
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

    async def _extract_cv_data_with_groq(self, cv_text: str) -> Dict[str, Any]:
        """Extract structured data from CV text using Groq LLaMA 3."""
        
        system_prompt = (
            "You are an expert CV/Resume parser. Your task is to extract exact information "
            "from the provided CV text. You must output ONLY valid JSON, with no markdown formatting, "
            "no explanations, and no hallucinated missing fields. If data is not found, use null or empty array."
        )
        
        prompt = f"""Extract the following structured information from this CV text:

{cv_text[:10000]}{'... (truncated)' if len(cv_text) > 10000 else ''}

Return a JSON object strictly following this structure:
{{
  "full_name": "Applicant's full name",
  "email": "Email address",
  "phone": "Phone number",
  "linkedin": "LinkedIn profile URL",
  "github": "GitHub profile URL",
  "portfolio": "Portfolio URL or personal website",
  "skills": ["Skill 1", "Skill 2"],
  "experience": [
    {{
      "company": "Company Name",
      "role": "Job Title",
      "start_date": "MM YYYY or YYYY",
      "end_date": "MM YYYY, YYYY, or Present/Current/null if current",
      "description": "Brief description of responsibilities and achievements"
    }}
  ],
  "education": [
    {{
      "institution": "University/Institution name",
      "degree": "Degree name",
      "field": "Field of study",
      "start_year": "YYYY",
      "end_year": "YYYY or null if current"
    }}
  ],
  "projects": [
    {{
      "name": "Project name",
      "description": "Project description",
      "tech_stack": "Technologies used (in a single string)"
    }}
  ],
  "certifications": "String of certifications if any",
  "location": "City, Country, or current location"
}}"""

        try:
            json_response = await self.groq_client.generate_json(prompt, system_prompt)
            # Remove any potential markdown wrappers if the model ignores the instruction
            json_response = json_response.strip()
            if json_response.startswith('```json'):
                json_response = json_response[7:]
            if json_response.endswith('```'):
                json_response = json_response[:-3]
                
            return json.loads(json_response.strip())
        except Exception as e:
            logger.error(f"Groq API extraction failed: {e}")
            raise RuntimeError(f"Failed to extract CV data: {e}")

    async def parse_cv(self, file: Optional[UploadFile] = None, text: Optional[str] = None, candidate_id: Optional[str] = None) -> Dict[str, Any]:
        """Parse CV file or text, extract structured data using Groq, and map to application schema."""
        extracted_text = ""
        cv_url = None

        if file:
            extracted_text = await self._extract_text_from_file(file)
            if not extracted_text or not extracted_text.strip():
                raise ValueError("Could not extract text from the file. Please ensure the file is readable.")
                
            # Upload file to storage and record metadata
            try:
                cv_url = await self.storage_service.upload_cv(file, candidate_id)
            except Exception as e:
                logger.warning(f"File upload to Supabase failed during parsing: {e}")
                
        elif text:
            extracted_text = text
        else:
            raise ValueError("No file or text provided")

        # Extract structured data using Groq
        raw_cv_data = await self._extract_cv_data_with_groq(extracted_text)
        
        # Map raw JSON to frontend candidate form schema
        mapped_data = self.form_mapper.map_to_form(raw_cv_data)
        
        return {
            "mapped_candidate_data": mapped_data,
            "raw_extraction": raw_cv_data,
            "cv_url": cv_url,
            "success": True
        }
