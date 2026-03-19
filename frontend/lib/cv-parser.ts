/**
 * Type definitions for CV parsing results.
 * The actual parsing logic has been moved to the FastAPI backend.
 */

export interface ExtractedCVData {
  name?: string
  email?: string
  phone?: string
  location?: string
  nationality?: string
  skills?: string
  experience?: string
  education?: string
  workHistory?: string
  linkedinProfile?: string
  currentRole?: string
  preferredRole?: string
  // New fields for structured data
  workExperiences?: Array<{
    companyName: string
    role: string
    startMonth: string
    startYear: string
    endMonth?: string
    endYear?: string
    description?: string
    isCurrent: boolean
  }>
  educations?: Array<{
    degree: string
    institute: string
    startYear: string
    endYear: string
  }>
}
