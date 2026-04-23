from fastapi import APIRouter, UploadFile, File, Form, Request, HTTPException, Header, Depends
from fastapi.responses import JSONResponse
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from typing import Optional, List
from pydantic import BaseModel
from ..services.application_service import ApplicationService
from ..services.cv_service import CVService
from ..services.auth_service import AuthService

router = APIRouter()
security = HTTPBearer(auto_error=False)  # Don't auto-error if token missing


class WorkExperiencePayload(BaseModel):
    companyName: str
    role: str
    startMonth: str
    startYear: str
    endMonth: Optional[str] = None
    endYear: Optional[str] = None
    description: Optional[str] = None
    isCurrent: bool = False


class EducationPayload(BaseModel):
    degree: str
    institute: str
    startYear: str
    endYear: str


class CandidateProfileUpdateRequest(BaseModel):
    name: Optional[str] = None
    mobile_number: Optional[str] = None
    current_location: Optional[str] = None
    current_salary_currency: Optional[str] = None
    salary_range: Optional[str] = None
    nationality: Optional[str] = None
    gender: Optional[str] = None
    seniority_level: Optional[str] = None
    reporting_manager: Optional[str] = None
    preferred_location: Optional[str] = None
    skills: Optional[str] = None
    experience: Optional[str] = None
    expected_salary_currency: Optional[str] = None
    expected_salary_range: Optional[str] = None
    linkedin_profile: Optional[str] = None
    portfolio: Optional[str] = None
    preferred_role: Optional[str] = None
    work_permit_status: Optional[str] = None
    employment_type: Optional[str] = None
    work_mode: Optional[str] = None
    references: Optional[str] = None
    notice_period: Optional[str] = None
    actively_seeking_toggle: Optional[str] = None
    application_status: Optional[str] = None
    profile_completion_percentage: Optional[int] = None
    work_experiences: Optional[List[WorkExperiencePayload]] = None
    educations: Optional[List[EducationPayload]] = None


async def get_user_id_from_token(credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)) -> Optional[str]:
    """Extract user_id from JWT token if provided."""
    if not credentials:
        return None
    
    try:
        auth_service = AuthService()
        payload = auth_service.verify_token(credentials.credentials)
        if payload:
            return payload.get("sub")  # user_id is in "sub" claim
    except Exception:
        pass
    
    return None

@router.post("/submit-application")
async def submit_application(
    request: Request,
    name: str = Form(...),
    email: str = Form(...),
    mobileNumber: str = Form(...),
    currentLocation: str = Form(...),
    cv: Optional[UploadFile] = File(None),
    photograph: Optional[UploadFile] = File(None),
    workExperiences: Optional[str] = Form(None),
    educations: Optional[str] = Form(None),
    currentSalaryCurrency: Optional[str] = Form(None),
    salaryRange: Optional[str] = Form(None),
    nationality: Optional[str] = Form(None),
    gender: Optional[str] = Form(None),
    seniorityLevel: Optional[str] = Form(None),
    reportingManager: Optional[str] = Form(None),
    preferredLocation: Optional[str] = Form(None),
    skills: Optional[str] = Form(None),
    experience: Optional[str] = Form(None),
    expectedSalaryCurrency: Optional[str] = Form(None),
    expectedSalaryRange: Optional[str] = Form(None),
    linkedinProfile: Optional[str] = Form(None),
    portfolio: Optional[str] = Form(None),
    preferredRole: Optional[str] = Form(None),
    workPermitStatus: Optional[str] = Form(None),
    employmentType: Optional[str] = Form(None),
    workMode: Optional[str] = Form(None),
    references: Optional[str] = Form(None),
    noticePeriod: Optional[str] = Form(None),
    activelySeekingToggle: Optional[str] = Form(None),
):
    """Accepts multipart form data and persists candidate + uploads files to Supabase."""
    try:
        svc = ApplicationService()
        auth_service = AuthService()
        
        # Try to extract user_id from Authorization header (if authenticated)
        user_id = None
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.replace("Bearer ", "")
            payload = auth_service.verify_token(token)
            if payload:
                user_id = payload.get("sub")  # user_id from JWT token
        
        # Collect all form fields into extras dict
        extras = {
            "currentSalaryCurrency": currentSalaryCurrency,
            "salaryRange": salaryRange,
            "nationality": nationality,
            "gender": gender,
            "seniorityLevel": seniorityLevel,
            "reportingManager": reportingManager,
            "preferredLocation": preferredLocation,
            "skills": skills,
            "experience": experience,
            "expectedSalaryCurrency": expectedSalaryCurrency,
            "expectedSalaryRange": expectedSalaryRange,
            "linkedinProfile": linkedinProfile,
            "portfolio": portfolio,
            "preferredRole": preferredRole,
            "workPermitStatus": workPermitStatus,
            "employmentType": employmentType,
            "workMode": workMode,
            "references": references,
            "noticePeriod": noticePeriod,
            "activelySeekingToggle": activelySeekingToggle,
        }
        
        result = await svc.submit_application(
            name=name,
            email=email,
            mobile_number=mobileNumber,
            current_location=currentLocation,
            cv_file=cv,
            photo_file=photograph,
            work_experiences_json=workExperiences,
            educations_json=educations,
            extras=extras,
            user_id=user_id,  # Link to users table if authenticated
        )
        return JSONResponse({"success": True, "candidate": result}, status_code=200)
    except ValueError as e:
        # Validation errors
        error_msg = str(e)
        if "required" in error_msg.lower():
            return JSONResponse({"error": error_msg}, status_code=400)
        elif "already exists" in error_msg.lower():
            return JSONResponse({"error": error_msg}, status_code=409)
        else:
            return JSONResponse({"error": error_msg}, status_code=400)
    except Exception as e:
        import logging
        logger = logging.getLogger("backend")
        logger.error(f"Application submission error: {e}", exc_info=True)
        return JSONResponse({"error": str(e), "details": "Failed to process application"}, status_code=500)


@router.post("/parse-cv")
async def parse_cv(
    file: Optional[UploadFile] = File(None), 
    text: Optional[str] = Form(None),
    candidate_id: Optional[str] = Form(None)
):
    """Parses uploaded CV file or raw text and returns extracted data."""
    try:
        if not file and not text:
            return JSONResponse({"error": "No file or text provided"}, status_code=400)
        
        svc = CVService()
        parsed = await svc.parse_cv(file=file, text=text, candidate_id=candidate_id)
        return JSONResponse(parsed)
    except ValueError as e:
        return JSONResponse({"error": str(e)}, status_code=400)
    except Exception as e:
        import logging
        logger = logging.getLogger("backend")
        logger.error(f"CV parsing error: {e}", exc_info=True)
        return JSONResponse({"error": str(e), "details": "Failed to parse CV"}, status_code=500)


@router.get("/candidates/me")
async def get_my_candidate(user_id: Optional[str] = Depends(get_user_id_from_token)):
    """Get candidate profile for the currently authenticated user."""
    if not user_id:
        return JSONResponse({"error": "Authentication required"}, status_code=401)

    try:
        svc = ApplicationService()
        candidate = await svc.get_candidate_by_user_id(user_id)

        if not candidate:
            raise HTTPException(status_code=404, detail="Candidate profile not found")

        return JSONResponse({"candidate": candidate}, status_code=200)
    except HTTPException:
        raise
    except Exception as e:
        import logging
        logger = logging.getLogger("backend")
        logger.error(f"Error fetching current candidate: {e}", exc_info=True)
        return JSONResponse({"error": str(e), "details": "Failed to fetch candidate profile"}, status_code=500)


@router.put("/candidates/me")
async def update_my_candidate(
    request: CandidateProfileUpdateRequest,
    user_id: Optional[str] = Depends(get_user_id_from_token),
):
    """Update candidate profile for the currently authenticated user."""
    if not user_id:
        return JSONResponse({"error": "Authentication required"}, status_code=401)

    try:
        svc = ApplicationService()
        updated_candidate = await svc.update_candidate_by_user_id(user_id, request.model_dump())

        if not updated_candidate:
            raise HTTPException(status_code=404, detail="Candidate profile not found")

        return JSONResponse({"candidate": updated_candidate}, status_code=200)
    except HTTPException:
        raise
    except Exception as e:
        import logging
        logger = logging.getLogger("backend")
        logger.error(f"Error updating current candidate: {e}", exc_info=True)
        return JSONResponse({"error": str(e), "details": "Failed to update candidate profile"}, status_code=500)


@router.get("/candidates/{candidate_id}")
async def get_candidate(candidate_id: str):
    """Get candidate details by ID."""
    try:
        svc = ApplicationService()
        candidate = await svc.get_candidate(candidate_id)
        
        if not candidate:
            raise HTTPException(status_code=404, detail="Candidate not found")
        
        return JSONResponse({"candidate": candidate}, status_code=200)
    except HTTPException:
        raise
    except Exception as e:
        import logging
        logger = logging.getLogger("backend")
        logger.error(f"Error fetching candidate: {e}", exc_info=True)
        return JSONResponse({"error": str(e), "details": "Failed to fetch candidate"}, status_code=500)
