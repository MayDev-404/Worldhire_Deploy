from typing import Dict, Any, List

class FormMapper:
    """Maps raw JSON generated from Groq into the correct format for the frontend candidate form."""
    
    @staticmethod
    def map_to_form(raw_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Maps Groq extracted fields to form fields.
        """
        # Ensure raw_data is a dictionary
        if not isinstance(raw_data, dict):
            raw_data = {}

        # Safely extract arrays
        skills = raw_data.get("skills", [])
        experience = raw_data.get("experience", [])
        education = raw_data.get("education", [])
        
        # Join skills if it's an array
        skills_str = ", ".join(skills) if isinstance(skills, list) else str(skills) if skills else None

        # Map work experiences
        work_experiences = []
        for exp in (experience if isinstance(experience, list) else []):
            if not isinstance(exp, dict):
                continue
                
            start_date = exp.get("start_date", "") or ""
            end_date = exp.get("end_date", "") or ""
            
            # Basic parsing of 'YYYY' or 'Month YYYY' for startMonth/startYear
            start_month, start_year = FormMapper._parse_date(start_date)
            end_month, end_year = FormMapper._parse_date(end_date)
            
            is_current = (not end_year and not end_month) or str(end_date).lower() in ['present', 'current', 'now']
            
            work_experiences.append({
                "companyName": exp.get("company", ""),
                "role": exp.get("role", ""),
                "startMonth": start_month,
                "startYear": start_year,
                "endMonth": end_month if not is_current else None,
                "endYear": end_year if not is_current else None,
                "description": exp.get("description", ""),
                "isCurrent": is_current
            })

        # Map educations
        educations = []
        for edu in (education if isinstance(education, list) else []):
            if not isinstance(edu, dict):
                continue
                
            educations.append({
                "degree": edu.get("degree", ""),
                "institute": edu.get("institution", ""),
                "startYear": str(edu.get("start_year", "")),
                "endYear": str(edu.get("end_year", ""))
            })

        # Return the final mapped form object
        mapped = {
            "name": raw_data.get("full_name"),
            "email": raw_data.get("email"),
            "mobileNumber": raw_data.get("phone"),
            "currentLocation": raw_data.get("location"),
            "linkedinProfile": raw_data.get("linkedin"),
            "portfolio": raw_data.get("portfolio") or raw_data.get("github"), # Fallback to github if portfolio is missing
            "skills": skills_str,
            "workExperiences": work_experiences,
            "educations": educations,
            # Pass through extra metadata that might be useful
            "projects": raw_data.get("projects", []),
            "certifications": raw_data.get("certifications"),
        }

        # Remove None values so we don't overwrite existing user data with nulls
        return {k: v for k, v in mapped.items() if v is not None}

    @staticmethod
    def _parse_date(date_str: str) -> tuple[str, str]:
        """Tries to parse a date string into (Month, Year). Returns ('', '') if failed."""
        if not date_str:
            return "", ""
        
        parts = str(date_str).strip().split()
        if len(parts) == 1:
            # Assume it's a year
            return "", parts[0]
        elif len(parts) >= 2:
            return parts[0], parts[1]
        
        return "", ""
