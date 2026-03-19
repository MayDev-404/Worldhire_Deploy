"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  User, GraduationCap, Briefcase, FileText, 
  ChevronLeft, ChevronRight, Check, Upload, Eye, EyeOff, Plus, Trash2
} from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"
import {
  COUNTRY_CODE_OPTIONS,
  CURRENCY_OPTIONS,
  NATIONALITY_OPTIONS,
  getSalaryRangesForCurrency,
} from "@/lib/form-options"

interface FormData {
  // Step 1: Basic Info
  cv?: File
  fullName: string
  mobileNumber: string
  email: string
  photograph?: File
  currentLocation: string
  currentSalaryCurrency: string
  currentSalaryRange: string
  nationality: string
  gender: string
  
  // Step 2: Education
  educations: Array<{
    degree: string
    institute: string
    startYear: string
    endYear: string
  }>
  
  // Step 3: Professional Experience
  workExperiences: Array<{
    companyName: string
    role: string
    startMonth: string
    startYear: string
    endMonth: string
    endYear: string
    description: string
    isCurrent: boolean
  }>
  
  // Step 4: Preferences
  seniorityLevel: string
  reportingManager: string
  preferredLocation: string
  skills: string
  experience: string
  linkedinProfile: string
  portfolio: string
  preferredRole: string
  workPermitStatus: string
  employmentType: string
  workMode: string
  expectedSalaryCurrency: string
  expectedSalaryRange: string
  noticePeriod: string
  jobSearchStatus: string
  references: string
  
  // Step 5: Password
  password: string
  confirmPassword: string
}

const steps = [
  { id: 1, label: "Basic Info", icon: User },
  { id: 2, label: "Education", icon: GraduationCap },
  { id: 3, label: "Experience", icon: Briefcase },
  { id: 4, label: "Preferences", icon: FileText },
  { id: 5, label: "Password", icon: FileText },
]

const MONTH_OPTIONS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

const CURRENT_YEAR = new Date().getFullYear()
const YEAR_OPTIONS = Array.from({ length: 50 }, (_, index) => `${CURRENT_YEAR - index}`)

const EMPLOYMENT_TYPE_OPTIONS = ["Permanent", "Contract", "Part-time", "Internship", "Freelance"]
const WORK_MODE_OPTIONS = ["Onsite", "Hybrid", "Remote"]
const JOB_SEARCH_STATUS_OPTIONS = ["Active", "Passive", "Open to opportunities"]
const WORK_PERMIT_OPTIONS = [
  "Nationality basis",
  "Has valid work permit",
  "Requires sponsorship",
  "Open to relocation",
]

function createEmptyExperience() {
  return {
    companyName: "",
    role: "",
    startMonth: "",
    startYear: "",
    endMonth: "",
    endYear: "",
    description: "",
    isCurrent: false,
  }
}

function createEmptyEducation() {
  return {
    degree: "",
    institute: "",
    startYear: "",
    endYear: "",
  }
}

function getSelectedCountryCode(mobileNumber: string) {
  return (
    COUNTRY_CODE_OPTIONS.find(
      ({ value }) => mobileNumber === value || mobileNumber.startsWith(`${value} `),
    )?.value || ""
  )
}

function getPhoneNumberWithoutCountryCode(mobileNumber: string) {
  const selectedCode = getSelectedCountryCode(mobileNumber)
  return selectedCode ? mobileNumber.slice(selectedCode.length).trim() : mobileNumber
}

function buildMobileNumber(countryCode: string, localNumber: string) {
  return [countryCode, localNumber.trim()].filter(Boolean).join(" ").trim()
}

export default function CandidateSignUpForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    mobileNumber: "",
    email: "",
    currentLocation: "",
    currentSalaryCurrency: "",
    currentSalaryRange: "",
    nationality: "",
    gender: "",
    educations: [createEmptyEducation()],
    workExperiences: [createEmptyExperience()],
    seniorityLevel: "",
    reportingManager: "",
    preferredLocation: "",
    skills: "",
    experience: "",
    linkedinProfile: "",
    portfolio: "",
    preferredRole: "",
    workPermitStatus: "Nationality basis",
    employmentType: "",
    workMode: "Hybrid",
    expectedSalaryCurrency: "",
    expectedSalaryRange: "",
    noticePeriod: "",
    jobSearchStatus: "",
    references: "",
    password: "",
    confirmPassword: "",
  })

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const getMissingFieldsForStep = (step: number) => {
    switch (step) {
      case 1: {
        const missing: string[] = []

        if (!formData.cv) missing.push("CV")
        if (!formData.fullName.trim()) missing.push("Full Name")
        if (!formData.mobileNumber.trim()) missing.push("Mobile Number")
        if (!formData.email.trim()) missing.push("Email ID")
        if (!formData.currentLocation.trim()) missing.push("Current Location")
        if (!formData.preferredLocation.trim()) missing.push("Preferred Location")
        if (!formData.currentSalaryCurrency) missing.push("Current Salary Currency")
        if (!formData.currentSalaryRange) missing.push("Current Salary Range")
        if (!formData.nationality) missing.push("Nationality")
        if (!formData.gender) missing.push("Gender")

        return missing
      }
      case 2:
        return formData.educations.flatMap((education, index) => {
          const prefix = `Education ${index + 1}`
          const missing: string[] = []

          if (!education.degree.trim()) missing.push(`${prefix}: Degree`)
          if (!education.institute.trim()) missing.push(`${prefix}: Institute`)
          if (!education.startYear.trim()) missing.push(`${prefix}: Start Year`)
          if (!education.endYear.trim()) missing.push(`${prefix}: End Year`)

          return missing
        })
      case 3:
        return formData.workExperiences.flatMap((experience, index) => {
          const prefix = `Experience ${index + 1}`
          const missing: string[] = []

          if (!experience.companyName.trim()) missing.push(`${prefix}: Company`)
          if (!experience.role.trim()) missing.push(`${prefix}: Role / Job Title`)
          if (!experience.startMonth) missing.push(`${prefix}: Start Month`)
          if (!experience.startYear) missing.push(`${prefix}: Start Year`)
          if (!experience.isCurrent && !experience.endMonth) missing.push(`${prefix}: End Month`)
          if (!experience.isCurrent && !experience.endYear) missing.push(`${prefix}: End Year`)

          return missing
        })
      case 4: {
        const missing: string[] = []

        if (!formData.skills.trim()) missing.push("Skills")
        if (!formData.experience.trim()) missing.push("Experience")
        if (!formData.expectedSalaryCurrency) missing.push("Expected Salary Currency")
        if (!formData.expectedSalaryRange) missing.push("Expected Salary Range")
        if (!formData.workMode) missing.push("Work Mode")
        if (!formData.noticePeriod.trim()) missing.push("Notice Period")
        if (!formData.jobSearchStatus.trim()) missing.push("Job Search Status")

        return missing
      }
      default:
        return []
    }
  }

  const validateCurrentStep = () => {
    const missingFields = getMissingFieldsForStep(currentStep)

    if (missingFields.length === 0) {
      return true
    }

    const preview = missingFields.slice(0, 4).join(", ")
    const suffix = missingFields.length > 4 ? ", ..." : ""

    toast({
      title: "Complete required fields",
      description: `Please fill: ${preview}${suffix}`,
      variant: "destructive",
    })

    return false
  }

  const handleNext = () => {
    if (currentStep < steps.length && validateCurrentStep()) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match",
        variant: "destructive",
      })
      return
    }

    if (formData.password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // First, create the user account with email and password
      const signUpResult = await apiClient.signUp(
        formData.email,
        formData.password,
        formData.fullName
      )

      // Store tokens so subsequent authenticated requests can reuse them.
      const accessToken = signUpResult.access_token
      
      if (typeof window !== "undefined") {
        localStorage.setItem("access_token", accessToken)
        if (signUpResult.refresh_token) {
          localStorage.setItem("refresh_token", signUpResult.refresh_token)
        }
      }

      // Then, submit the full application with all profile data
      // Pass access token to link candidate to user account
      const formDataToSubmit = new FormData()

      // Basic info
      formDataToSubmit.append("name", formData.fullName)
      formDataToSubmit.append("email", formData.email)
      formDataToSubmit.append("mobileNumber", formData.mobileNumber)
      formDataToSubmit.append("currentLocation", formData.currentLocation)
      if (formData.cv) formDataToSubmit.append("cv", formData.cv)
      if (formData.photograph) formDataToSubmit.append("photograph", formData.photograph)
      
      // Additional fields
      formDataToSubmit.append("currentSalaryCurrency", formData.currentSalaryCurrency)
      formDataToSubmit.append("salaryRange", formData.currentSalaryRange)
      formDataToSubmit.append("nationality", formData.nationality)
      formDataToSubmit.append("gender", formData.gender)
      formDataToSubmit.append("seniorityLevel", formData.seniorityLevel)
      formDataToSubmit.append("reportingManager", formData.reportingManager)
      formDataToSubmit.append("preferredLocation", formData.preferredLocation)
      formDataToSubmit.append("skills", formData.skills)
      formDataToSubmit.append("experience", formData.experience)
      formDataToSubmit.append("linkedinProfile", formData.linkedinProfile)
      formDataToSubmit.append("portfolio", formData.portfolio)
      formDataToSubmit.append("preferredRole", formData.preferredRole)
      formDataToSubmit.append("workPermitStatus", formData.workPermitStatus)
      formDataToSubmit.append("employmentType", formData.employmentType)
      formDataToSubmit.append("workMode", formData.workMode)
      formDataToSubmit.append("expectedSalaryCurrency", formData.expectedSalaryCurrency)
      formDataToSubmit.append("expectedSalaryRange", formData.expectedSalaryRange)
      formDataToSubmit.append("noticePeriod", formData.noticePeriod)
      formDataToSubmit.append("activelySeekingToggle", formData.jobSearchStatus)
      formDataToSubmit.append("references", formData.references)
      
      // Work experiences and educations as JSON
      formDataToSubmit.append("workExperiences", JSON.stringify(formData.workExperiences))
      formDataToSubmit.append("educations", JSON.stringify(formData.educations))

      // Submit with authentication token to link candidate to user account
      const result = await apiClient.submitApplication(formDataToSubmit, accessToken)

      toast({
        title: "Account created!",
        description: "Your profile has been created successfully.",
      })

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Sign up failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1BasicInfo formData={formData} updateFormData={updateFormData} />
      case 2:
        return <Step2Education formData={formData} updateFormData={updateFormData} />
      case 3:
        return <Step3Experience formData={formData} updateFormData={updateFormData} />
      case 4:
        return <Step4Preferences formData={formData} updateFormData={updateFormData} />
      case 5:
        return <Step5Password formData={formData} updateFormData={updateFormData} showPassword={showPassword} setShowPassword={setShowPassword} showConfirmPassword={showConfirmPassword} setShowConfirmPassword={setShowConfirmPassword} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-[#1e40af]">
            worldhire
          </Link>
          <button className="lg:hidden">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* Progress Header */}
      <div className="bg-gradient-to-r from-[#1e40af] to-[#3b82f6] text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-2">Complete Profile</h1>
          <p className="text-blue-100">Complete your application in just {steps.length} simple steps</p>
          
          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-4 mt-8">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = currentStep === step.id
              const isCompleted = currentStep > step.id
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                    isActive 
                      ? "bg-white border-white text-[#1e40af]" 
                      : isCompleted
                      ? "bg-white border-white text-[#1e40af]"
                      : "bg-transparent border-blue-300 text-blue-200"
                  }`}>
                    {isCompleted ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      <Icon className="w-6 h-6" />
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-0.5 mx-2 ${
                      isCompleted ? "bg-white" : "bg-blue-300"
                    }`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
          {renderStep()}
          
          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>
            
            {currentStep < steps.length ? (
              <Button
                type="button"
                onClick={handleNext}
                className="bg-[#1e40af] hover:bg-[#1e3a8a] text-white flex items-center gap-2"
              >
                Continue
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-[#1e40af] hover:bg-[#1e3a8a] text-white"
              >
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Step 1: Basic Info
function Step1BasicInfo({ formData, updateFormData }: any) {
  const selectedCountryCode = getSelectedCountryCode(formData.mobileNumber)
  const phoneNumber = getPhoneNumberWithoutCountryCode(formData.mobileNumber)
  const currentSalaryRanges = getSalaryRangesForCurrency(formData.currentSalaryCurrency)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Step 1: Upload CV & Basic Info</h2>
        <p className="text-gray-600">Start by uploading your CV and providing basic information</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Upload CV *</Label>
          <div className="flex gap-2 mt-1">
            <Input
              type="file"
              accept=".pdf,.docx"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) updateFormData("cv", file)
              }}
              className="hidden"
              id="cv-upload"
            />
            <Button asChild variant="outline" className="cursor-pointer">
              <label htmlFor="cv-upload">
                <Upload className="w-4 h-4 mr-2" />
                Browse...
              </label>
            </Button>
            <Input
              value={formData.cv?.name || "No file selected."}
              readOnly
              className="flex-1"
            />
          </div>
          <p className="text-sm text-gray-500 mt-1">Accepted formats: PDF, DOCX. (Max 5MB)</p>
        </div>

        <div>
          <Label>Full Name *</Label>
          <Input
            value={formData.fullName}
            onChange={(e) => updateFormData("fullName", e.target.value)}
            placeholder="e.g. John Doe"
            required
          />
        </div>

        <div>
          <Label>Mobile Number *</Label>
          <div className="flex gap-2">
            <Select
              value={selectedCountryCode || undefined}
              onValueChange={(value) =>
                updateFormData("mobileNumber", buildMobileNumber(value, phoneNumber))
              }
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Code" />
              </SelectTrigger>
              <SelectContent>
                {COUNTRY_CODE_OPTIONS.map(({ value, label }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              value={phoneNumber}
              onChange={(e) =>
                updateFormData("mobileNumber", buildMobileNumber(selectedCountryCode, e.target.value))
              }
              placeholder="9876543210"
              required
            />
          </div>
          <p className="text-sm text-gray-500 mt-1">Choose a code or type your own in the number field</p>
        </div>

        <div>
          <Label>Email ID *</Label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => updateFormData("email", e.target.value)}
            placeholder="email@example.com"
            required
          />
        </div>

        <div>
          <Label>Photograph / Avatar (Optional)</Label>
          <div className="flex gap-2 mt-1">
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) updateFormData("photograph", file)
              }}
              className="hidden"
              id="photo-upload"
            />
            <Button asChild variant="outline" className="cursor-pointer">
              <label htmlFor="photo-upload">
                <Upload className="w-4 h-4 mr-2" />
                Browse...
              </label>
            </Button>
            <Input
              value={formData.photograph?.name || "No file selected."}
              readOnly
              className="flex-1"
            />
          </div>
        </div>

        <div>
          <Label>Current Location *</Label>
          <Input
            value={formData.currentLocation}
            onChange={(e) => updateFormData("currentLocation", e.target.value)}
            placeholder="City, Country"
            required
          />
        </div>

        <div>
          <Label>Preferred Location *</Label>
          <Input
            value={formData.preferredLocation}
            onChange={(e) => updateFormData("preferredLocation", e.target.value)}
            placeholder="Preferred city, country, or region"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Current Salary Currency *</Label>
            <Select
              value={formData.currentSalaryCurrency}
              onValueChange={(value) => {
                updateFormData("currentSalaryCurrency", value)
                updateFormData("currentSalaryRange", "")
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {CURRENCY_OPTIONS.map(({ value, label }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Current Salary Range *</Label>
            <Select
              value={formData.currentSalaryRange}
              onValueChange={(value) => updateFormData("currentSalaryRange", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={currentSalaryRanges[0]?.label || "Select range"} />
              </SelectTrigger>
              <SelectContent>
                {currentSalaryRanges.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label>Nationality *</Label>
          <Select
            value={formData.nationality}
            onValueChange={(value) => updateFormData("nationality", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select nationality" />
            </SelectTrigger>
            <SelectContent>
              {NATIONALITY_OPTIONS.map(({ value, label }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Gender *</Label>
          <RadioGroup
            value={formData.gender}
            onValueChange={(value) => updateFormData("gender", value)}
            className="mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="male" id="male" />
              <Label htmlFor="male" className="font-normal">Male</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="female" id="female" />
              <Label htmlFor="female" className="font-normal">Female</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="non-binary" id="non-binary" />
              <Label htmlFor="non-binary" className="font-normal">Non-binary</Label>
            </div>
          </RadioGroup>
          <div className="flex items-center space-x-2 mt-2">
            <Checkbox id="prefer-not-to-disclose" />
            <Label htmlFor="prefer-not-to-disclose" className="font-normal text-sm">
              Prefer not to disclose
            </Label>
          </div>
        </div>
      </div>
    </div>
  )
}

// Step 2: Education
function Step2Education({ formData, updateFormData }: any) {
  const addEducation = () => {
    updateFormData("educations", [...formData.educations, createEmptyEducation()])
  }

  const updateEducation = (index: number, field: string, value: string) => {
    const updated = [...formData.educations]
    updated[index] = { ...updated[index], [field]: value }
    updateFormData("educations", updated)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Step 2: Education Details</h2>
        <p className="text-gray-600">Tell us about your educational background</p>
      </div>

      {formData.educations.map((edu: any, index: number) => (
        <div key={index} className="space-y-4 p-4 border rounded-lg">
          <div>
            <Label>Institute / University *</Label>
            <Input
              value={edu.institute}
              onChange={(e) => updateEducation(index, "institute", e.target.value)}
              placeholder="Ex: Boston University"
              required
            />
          </div>

          <div>
            <Label>Degree *</Label>
            <Input
              value={edu.degree}
              onChange={(e) => updateEducation(index, "degree", e.target.value)}
              placeholder="Ex: Bachelor's"
              required
            />
          </div>

          <div>
            <Label>Start Year *</Label>
            <Select value={edu.startYear} onValueChange={(value) => updateEducation(index, "startYear", value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {YEAR_OPTIONS.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>End Year *</Label>
            <Select value={edu.endYear} onValueChange={(value) => updateEducation(index, "endYear", value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {YEAR_OPTIONS.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      ))}

      <Button type="button" variant="outline" onClick={addEducation} className="w-full">
        + Add School / University
      </Button>
    </div>
  )
}

// Step 3: Professional Experience
function Step3Experience({ formData, updateFormData }: any) {
  const addExperience = () => {
    updateFormData("workExperiences", [...formData.workExperiences, createEmptyExperience()])
  }

  const updateExperience = (index: number, field: string, value: any) => {
    const updated = [...formData.workExperiences]
    updated[index] = { ...updated[index], [field]: value }

    if (field === "isCurrent" && value === true) {
      updated[index].endMonth = ""
      updated[index].endYear = ""
    }

    updateFormData("workExperiences", updated)
  }

  const removeExperience = (index: number) => {
    updateFormData(
      "workExperiences",
      formData.workExperiences.filter((_: unknown, currentIndex: number) => currentIndex !== index),
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Step 3: Professional Experience</h2>
        <p className="text-gray-600">Details about your work history and expertise</p>
      </div>

      {formData.workExperiences.map((exp: any, index: number) => (
        <div key={index} className="space-y-4 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Experience {index + 1}</h3>
              <p className="text-sm text-gray-500">Add one role at a time, starting with your most recent.</p>
            </div>
            {formData.workExperiences.length > 1 && (
              <Button type="button" variant="outline" size="sm" onClick={() => removeExperience(index)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Remove
              </Button>
            )}
          </div>

          <div>
            <Label>Company or organization *</Label>
            <Input
              value={exp.companyName}
              onChange={(e) => updateExperience(index, "companyName", e.target.value)}
              placeholder="Ex: Airpop Media"
              required
            />
          </div>

          <div>
            <Label>Role / Job Title *</Label>
            <Input
              value={exp.role}
              onChange={(e) => updateExperience(index, "role", e.target.value)}
              placeholder="Ex: Product Manager"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Start Month *</Label>
              <Select value={exp.startMonth} onValueChange={(value) => updateExperience(index, "startMonth", value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {MONTH_OPTIONS.map((month) => (
                    <SelectItem key={month} value={month}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Start Year *</Label>
              <Select value={exp.startYear} onValueChange={(value) => updateExperience(index, "startYear", value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {YEAR_OPTIONS.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id={`current-role-${index}`}
              checked={exp.isCurrent}
              onCheckedChange={(checked) => updateExperience(index, "isCurrent", checked === true)}
            />
            <Label htmlFor={`current-role-${index}`} className="cursor-pointer font-normal">
              I am currently working in this role
            </Label>
          </div>

          {!exp.isCurrent && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>End Month *</Label>
                <Select value={exp.endMonth} onValueChange={(value) => updateExperience(index, "endMonth", value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    {MONTH_OPTIONS.map((month) => (
                      <SelectItem key={month} value={month}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>End Year *</Label>
                <Select value={exp.endYear} onValueChange={(value) => updateExperience(index, "endYear", value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {YEAR_OPTIONS.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div>
            <Label>Description</Label>
            <Textarea
              value={exp.description}
              onChange={(e) => updateExperience(index, "description", e.target.value)}
              placeholder="Describe your responsibilities, achievements, and impact."
              rows={4}
            />
          </div>
        </div>
      ))}

      <Button type="button" variant="outline" onClick={addExperience} className="w-full">
        <Plus className="mr-2 h-4 w-4" />
        Add Position
      </Button>
    </div>
  )
}

// Step 4: Preferences
function Step4Preferences({ formData, updateFormData }: any) {
  const expectedSalaryRanges = getSalaryRangesForCurrency(formData.expectedSalaryCurrency)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Step 4: Preferences & Additional Info</h2>
        <p className="text-gray-600">Almost there! Just a few more details</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Skills *</Label>
          <Textarea
            value={formData.skills}
            onChange={(e) => updateFormData("skills", e.target.value)}
            placeholder="List your core skills, separated by commas"
            rows={3}
          />
        </div>

        <div>
          <Label>Years of Experience *</Label>
          <Input
            value={formData.experience}
            onChange={(e) => updateFormData("experience", e.target.value)}
            placeholder="Ex: 5 years"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Seniority Level</Label>
            <Input
              value={formData.seniorityLevel}
              onChange={(e) => updateFormData("seniorityLevel", e.target.value)}
              placeholder="Ex: Mid-level, Senior"
            />
          </div>
          <div>
            <Label>Reporting Manager</Label>
            <Input
              value={formData.reportingManager}
              onChange={(e) => updateFormData("reportingManager", e.target.value)}
              placeholder="Ex: Engineering Manager"
            />
          </div>
        </div>

        <div>
          <Label>LinkedIn Profile</Label>
          <Input
            value={formData.linkedinProfile}
            onChange={(e) => updateFormData("linkedinProfile", e.target.value)}
            placeholder="https://linkedin.com/in/username"
          />
        </div>

        <div>
          <Label>Portfolio / Website (Optional)</Label>
          <Input
            value={formData.portfolio}
            onChange={(e) => updateFormData("portfolio", e.target.value)}
            placeholder="https://portfolio.com"
          />
        </div>

        <div>
          <Label>Employment Type</Label>
          <Select
            value={formData.employmentType}
            onValueChange={(value) => updateFormData("employmentType", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select employment type" />
            </SelectTrigger>
            <SelectContent>
              {EMPLOYMENT_TYPE_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Preferred Role</Label>
          <Input
            value={formData.preferredRole}
            onChange={(e) => updateFormData("preferredRole", e.target.value)}
            placeholder="Ex: Product Manager, Backend Engineer"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Work Permit Status</Label>
            <Select
              value={formData.workPermitStatus}
              onValueChange={(value) => updateFormData("workPermitStatus", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {WORK_PERMIT_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Work Mode *</Label>
            <Select
              value={formData.workMode}
              onValueChange={(value) => updateFormData("workMode", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select work mode" />
              </SelectTrigger>
              <SelectContent>
                {WORK_MODE_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Expected Salary Currency *</Label>
            <Select
              value={formData.expectedSalaryCurrency}
              onValueChange={(value) => {
                updateFormData("expectedSalaryCurrency", value)
                updateFormData("expectedSalaryRange", "")
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {CURRENCY_OPTIONS.map(({ value, label }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Expected Salary Range *</Label>
            <Select
              value={formData.expectedSalaryRange}
              onValueChange={(value) => updateFormData("expectedSalaryRange", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={expectedSalaryRanges[0]?.label || "Select range"} />
              </SelectTrigger>
              <SelectContent>
                {expectedSalaryRanges.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label>Notice Period *</Label>
          <Input
            value={formData.noticePeriod}
            onChange={(e) => updateFormData("noticePeriod", e.target.value)}
            placeholder="Ex: 30 days"
          />
        </div>

        <div>
          <Label>Job Search Status *</Label>
          <Select
            value={formData.jobSearchStatus}
            onValueChange={(value) => updateFormData("jobSearchStatus", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {JOB_SEARCH_STATUS_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>References (Optional)</Label>
          <Textarea
            value={formData.references}
            onChange={(e) => updateFormData("references", e.target.value)}
            placeholder="Name, Contact, Relation..."
            rows={4}
          />
        </div>
      </div>
    </div>
  )
}

// Step 5: Password
function Step5Password({ formData, updateFormData, showPassword, setShowPassword, showConfirmPassword, setShowConfirmPassword }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Step 5: Create Password</h2>
        <p className="text-gray-600">Create a secure password for your account</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Password *</Label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => updateFormData("password", e.target.value)}
              placeholder="Create a password"
              className="pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-1">Must be at least 6 characters</p>
        </div>

        <div>
          <Label>Confirm Password *</Label>
          <div className="relative">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(e) => updateFormData("confirmPassword", e.target.value)}
              placeholder="Confirm your password"
              className="pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

