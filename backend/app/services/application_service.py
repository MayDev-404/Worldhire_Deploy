from typing import Optional, Any, Dict, List, Tuple
from ..infrastructure.supabase_client import get_supabase_client
from ..infrastructure.storage_service import StorageService
from fastapi import UploadFile
import json
import logging

logger = logging.getLogger("backend")


class ApplicationService:
    def _extract_rows(self, response: Any) -> List[Dict[str, Any]]:
        """Normalize Supabase response formats into a list of rows."""
        if hasattr(response, 'data') and isinstance(response.data, list):
            return response.data
        if isinstance(response, dict) and isinstance(response.get('data'), list):
            return response['data']
        return []

    def _serialize_work_experiences(self, rows: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        return [
            {
                "id": row.get("id"),
                "companyName": row.get("company_name", ""),
                "role": row.get("role", ""),
                "startMonth": row.get("start_month", ""),
                "startYear": row.get("start_year", ""),
                "endMonth": row.get("end_month") or "",
                "endYear": row.get("end_year") or "",
                "description": row.get("description") or "",
                "isCurrent": row.get("is_current", False),
                "displayOrder": row.get("display_order", 0),
            }
            for row in rows
        ]

    def _serialize_educations(self, rows: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        return [
            {
                "id": row.get("id"),
                "degree": row.get("degree", ""),
                "institute": row.get("institute", ""),
                "startYear": row.get("start_year", ""),
                "endYear": row.get("end_year", ""),
                "displayOrder": row.get("display_order", 0),
            }
            for row in rows
        ]

    async def _get_candidate_relations(self, candidate_id: str) -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]]]:
        supabase = get_supabase_client()
        work_rows = self._extract_rows(
            supabase.table('work_experiences')
            .select('*')
            .eq('candidate_id', candidate_id)
            .order('display_order')
            .execute()
        )
        education_rows = self._extract_rows(
            supabase.table('educations')
            .select('*')
            .eq('candidate_id', candidate_id)
            .order('display_order')
            .execute()
        )
        return (
            self._serialize_work_experiences(work_rows),
            self._serialize_educations(education_rows),
        )

    def _get_value(self, key: str, extras: Optional[Dict[str, Any]], required: bool = False) -> Optional[str]:
        """Helper to get form value or null if empty."""
        value = extras.get(key) if extras and key in extras else None
        if isinstance(value, str):
            value = value.strip() if value else None
        if required and (value is None or value == ""):
            raise ValueError(f"{key} is required")
        return value if value else None

    async def submit_application(
        self,
        name: str,
        email: str,
        mobile_number: str,
        current_location: str,
        cv_file: Optional[UploadFile] = None,
        photo_file: Optional[UploadFile] = None,
        work_experiences_json: Optional[str] = None,
        educations_json: Optional[str] = None,
        extras: Optional[Dict[str, Any]] = None,
        user_id: Optional[str] = None,  # Link to users table
    ) -> Dict[str, Any]:
        supabase = get_supabase_client()

        # Validate required fields
        required_fields = {
            "currentSalaryCurrency": "Current Salary Currency",
            "salaryRange": "Current Salary Range",
            "nationality": "Nationality",
            "gender": "Gender",
            "preferredLocation": "Preferred Location",
            "skills": "Skills",
            "experience": "Experience",
            "expectedSalaryCurrency": "Expected Salary Currency",
            "expectedSalaryRange": "Expected Salary Range",
            "workMode": "Work Mode",
            "noticePeriod": "Notice Period",
            "activelySeekingToggle": "Job Search Status",
        }
        
        for field_key, field_name in required_fields.items():
            self._get_value(field_key, extras, required=True)

        cv_url = None
        photo_url = None
        storage = StorageService()

        # Upload CV via StorageService
        if cv_file:
            try:
                cv_url = await storage.upload_cv(cv_file)
            except Exception as e:
                logger.error(f"CV upload error: {e}")

        # Upload photo via StorageService
        if photo_file:
            try:
                photo_url = await storage.upload_photo(photo_file)
            except Exception as e:
                logger.error(f"Photo upload error: {e}")

        # Prepare candidate data with all fields
        candidate_data = {
            "user_id": user_id,  # Link to users table (if provided)
            "name": name,
            "mobile_number": mobile_number,
            "email": email,
            "current_location": current_location,
            "current_salary_currency": self._get_value("currentSalaryCurrency", extras, required=True),
            "salary_range": self._get_value("salaryRange", extras, required=True),
            "nationality": self._get_value("nationality", extras, required=True),
            "gender": self._get_value("gender", extras, required=True),
            "cv_url": cv_url,
            "photograph_url": photo_url,
            "seniority_level": self._get_value("seniorityLevel", extras),
            "reporting_manager": self._get_value("reportingManager", extras),
            "preferred_location": self._get_value("preferredLocation", extras, required=True),
            "skills": self._get_value("skills", extras, required=True),
            "experience": self._get_value("experience", extras, required=True),
            "expected_salary_currency": self._get_value("expectedSalaryCurrency", extras, required=True),
            "expected_salary_range": self._get_value("expectedSalaryRange", extras, required=True),
            "linkedin_profile": self._get_value("linkedinProfile", extras),
            "portfolio": self._get_value("portfolio", extras),
            "preferred_role": self._get_value("preferredRole", extras),
            "work_permit_status": self._get_value("workPermitStatus", extras) or "Nationality basis",
            "employment_type": self._get_value("employmentType", extras) or "Permanent",
            "work_mode": self._get_value("workMode", extras, required=True),
            "references": self._get_value("references", extras),
            "notice_period": self._get_value("noticePeriod", extras, required=True),
            "actively_seeking_toggle": self._get_value("activelySeekingToggle", extras, required=True),
            "application_status": "submitted",
            "profile_completion_percentage": 100,
        }

        # Insert candidate
        try:
            insert_resp = supabase.table('candidates').insert(candidate_data).execute()
            inserted = None
            
            # Handle different response formats from supabase-py
            if hasattr(insert_resp, 'data') and insert_resp.data:
                inserted = insert_resp.data[0] if isinstance(insert_resp.data, list) and len(insert_resp.data) > 0 else None
            elif isinstance(insert_resp, dict):
                if 'data' in insert_resp and isinstance(insert_resp['data'], list) and len(insert_resp['data']) > 0:
                    inserted = insert_resp['data'][0]
            elif hasattr(insert_resp, '__iter__'):
                # Try to get first item if iterable
                try:
                    data_list = list(insert_resp)
                    if data_list and isinstance(data_list[0], dict):
                        inserted = data_list[0]
                except:
                    pass
            
            if not inserted:
                raise ValueError("Failed to insert candidate - no data returned")
            
            candidate_id = inserted.get('id') if isinstance(inserted, dict) else None
            
            if not candidate_id:
                raise ValueError("Failed to get candidate ID after insert")

            # Insert work experiences
            if work_experiences_json and candidate_id:
                try:
                    experiences = json.loads(work_experiences_json)
                    if isinstance(experiences, list) and len(experiences) > 0:
                        records = []
                        for exp in experiences:
                            if isinstance(exp, dict):
                                records.append({
                                    "candidate_id": candidate_id,
                                    "company_name": exp.get('companyName'),
                                    "role": exp.get('role'),
                                    "start_month": exp.get('startMonth'),
                                    "start_year": exp.get('startYear'),
                                    "end_month": None if exp.get('isCurrent') else exp.get('endMonth'),
                                    "end_year": None if exp.get('isCurrent') else exp.get('endYear'),
                                    "description": exp.get('description'),
                                    "is_current": exp.get('isCurrent', False),
                                })
                        if records:
                            supabase.table('work_experiences').insert(records).execute()
                except Exception as e:
                    logger.warning(f"Work experiences insert error: {e}")

            # Insert educations
            if educations_json and candidate_id:
                try:
                    educations = json.loads(educations_json)
                    if isinstance(educations, list) and len(educations) > 0:
                        records = []
                        for idx, edu in enumerate(educations):
                            if isinstance(edu, dict):
                                records.append({
                                    "candidate_id": candidate_id,
                                    "degree": edu.get('degree'),
                                    "institute": edu.get('institute'),
                                    "start_year": edu.get('startYear'),
                                    "end_year": edu.get('endYear'),
                                    "display_order": idx,
                                })
                        if records:
                            supabase.table('educations').insert(records).execute()
                except Exception as e:
                    logger.warning(f"Educations insert error: {e}")

            return inserted
        except Exception as e:
            logger.error(f"Database insert error: {e}")
            
            # Handle specific error cases
            error_str = str(e).lower()
            if 'unique constraint' in error_str or 'duplicate' in error_str:
                raise ValueError("An application with this email already exists. Please use a different email address.")
            elif 'null value' in error_str or 'not null' in error_str:
                raise ValueError("Missing required fields. Please fill in all required information.")
            else:
                raise ValueError(f"Failed to submit application: {str(e)}")

    async def get_candidate(self, candidate_id: str) -> Optional[Dict[str, Any]]:
        """Get candidate by ID."""
        supabase = get_supabase_client()
        try:
            result = supabase.table('candidates').select('*').eq('id', candidate_id).execute()
            
            if hasattr(result, 'data') and result.data:
                return result.data[0] if isinstance(result.data, list) and len(result.data) > 0 else None
            elif isinstance(result, dict) and 'data' in result:
                data = result['data']
                return data[0] if isinstance(data, list) and len(data) > 0 else None
            return None
        except Exception as e:
            logger.error(f"Error fetching candidate: {e}")
            return None

    async def get_candidate_by_user_id(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Get candidate profile by linked user ID, including related records."""
        supabase = get_supabase_client()
        try:
            result = supabase.table('candidates').select('*').eq('user_id', user_id).limit(1).execute()
            rows = self._extract_rows(result)
            if not rows:
                return None

            candidate = rows[0]
            candidate_id = candidate.get('id')
            if candidate_id:
                work_experiences, educations = await self._get_candidate_relations(candidate_id)
                candidate['work_experiences'] = work_experiences
                candidate['educations'] = educations

            return candidate
        except Exception as e:
            logger.error(f"Error fetching candidate by user_id: {e}")
            return None

    async def update_candidate_by_user_id(self, user_id: str, payload: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update a candidate profile and replace related records."""
        supabase = get_supabase_client()
        candidate = await self.get_candidate_by_user_id(user_id)
        if not candidate:
            return None

        candidate_id = candidate.get('id')
        if not candidate_id:
            return None

        candidate_fields = {
            "name",
            "mobile_number",
            "current_location",
            "current_salary_currency",
            "salary_range",
            "nationality",
            "gender",
            "seniority_level",
            "reporting_manager",
            "preferred_location",
            "skills",
            "experience",
            "expected_salary_currency",
            "expected_salary_range",
            "linkedin_profile",
            "portfolio",
            "preferred_role",
            "work_permit_status",
            "employment_type",
            "work_mode",
            "references",
            "notice_period",
            "actively_seeking_toggle",
            "application_status",
            "profile_completion_percentage",
        }
        candidate_updates = {
            key: value
            for key, value in payload.items()
            if key in candidate_fields and value is not None
        }

        if candidate_updates:
            supabase.table('candidates').update(candidate_updates).eq('id', candidate_id).execute()

        if payload.get('work_experiences') is not None:
            supabase.table('work_experiences').delete().eq('candidate_id', candidate_id).execute()
            work_records = []
            for index, exp in enumerate(payload.get('work_experiences') or []):
                if isinstance(exp, dict):
                    work_records.append({
                        "candidate_id": candidate_id,
                        "company_name": exp.get('companyName'),
                        "role": exp.get('role'),
                        "start_month": exp.get('startMonth'),
                        "start_year": exp.get('startYear'),
                        "end_month": None if exp.get('isCurrent') else exp.get('endMonth'),
                        "end_year": None if exp.get('isCurrent') else exp.get('endYear'),
                        "description": exp.get('description'),
                        "is_current": exp.get('isCurrent', False),
                        "display_order": index,
                    })
            if work_records:
                supabase.table('work_experiences').insert(work_records).execute()

        if payload.get('educations') is not None:
            supabase.table('educations').delete().eq('candidate_id', candidate_id).execute()
            education_records = []
            for index, edu in enumerate(payload.get('educations') or []):
                if isinstance(edu, dict):
                    education_records.append({
                        "candidate_id": candidate_id,
                        "degree": edu.get('degree'),
                        "institute": edu.get('institute'),
                        "start_year": edu.get('startYear'),
                        "end_year": edu.get('endYear'),
                        "display_order": index,
                    })
            if education_records:
                supabase.table('educations').insert(education_records).execute()

        return await self.get_candidate_by_user_id(user_id)
