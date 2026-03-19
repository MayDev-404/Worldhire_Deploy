export type CandidateWorkExperience = {
  id?: string
  companyName: string
  role: string
  startMonth: string
  startYear: string
  endMonth?: string
  endYear?: string
  description?: string
  isCurrent: boolean
  displayOrder?: number
}

export type CandidateEducation = {
  id?: string
  degree: string
  institute: string
  startYear: string
  endYear: string
  displayOrder?: number
}

export type Candidate = {
  id?: string
  created_at?: string
  updated_at?: string

  // Basic Information
  name: string
  mobile_number: string
  email: string
  current_location: string
  current_salary_currency: string
  salary_range: string
  nationality: string
  gender?: string

  // Files
  cv_url?: string
  photograph_url?: string

  // Professional Details
  seniority_level?: string
  reporting_manager?: string
  preferred_location?: string
  skills?: string
  experience?: string
  expected_salary_currency?: string
  expected_salary_range?: string

  // Preferences
  linkedin_profile?: string
  portfolio?: string
  preferred_role?: string
  work_permit_status?: string
  employment_type?: string
  work_mode?: string
  references?: string
  notice_period?: string
  actively_seeking_toggle?: string

  // Metadata
  application_status?: string
  profile_completion_percentage?: number

  // Related records
  work_experiences?: CandidateWorkExperience[]
  educations?: CandidateEducation[]
}
