"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import { StepOne } from "./form-steps/step-one"
import { StepTwo } from "./form-steps/step-two"
import { StepThree } from "./form-steps/step-three"
import { StepFour } from "./form-steps/step-four"
import { StepFive } from "./form-steps/step-five"
import { ChevronLeft, ChevronRight, Upload, User, Briefcase, CheckCircle, History, GraduationCap } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export type WorkExperience = {
  companyName: string
  role: string
  startMonth: string
  startYear: string
  endMonth: string
  endYear: string
  description: string
  isCurrent: boolean
}

export type Education = {
  degree: string
  institute: string
  startYear: string
  endYear: string
}

export type FormData = {
  // Step 1 - CV Upload & Basic Info
  cv: File | null
  name: string
  mobileNumber: string
  email: string
  photograph: File | null
  currentLocation: string
  currentSalaryCurrency: string
  salaryRange: string
  nationality: string
  gender: string

  // Step 2 - Professional Details
  seniorityLevel: string
  reportingManager: string
  preferredLocation: string
  skills: string
  experience: string
  expectedSalaryCurrency: string
  expectedSalaryRange: string

  // Step 3 - Work History (Multiple Experiences)
  workExperiences: WorkExperience[]

  // Step 4 - Education (Multiple Entries)
  educations: Education[]

  // Step 5 - Preferences & Additional Info
  linkedinProfile: string
  portfolio: string
  preferredRole: string
  workPermitStatus: string
  employmentType: string
  workMode: string
  references: string
  noticePeriod: string
  activelySeekingToggle: string
}

const STEPS = [
  { number: 1, title: "Upload CV & Basic Info", icon: Upload },
  { number: 2, title: "Professional Details", icon: User },
  { number: 3, title: "Work History", icon: History },
  { number: 4, title: "Education", icon: GraduationCap },
  { number: 5, title: "Preferences & Additional", icon: Briefcase },
]

export default function CandidateApplicationForm() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    cv: null,
    name: "",
    mobileNumber: "",
    email: "",
    photograph: null,
    currentLocation: "",
    currentSalaryCurrency: "",
    salaryRange: "",
    nationality: "",
    gender: "",
    seniorityLevel: "",
    reportingManager: "",
    preferredLocation: "",
    skills: "",
    experience: "",
    expectedSalaryCurrency: "",
    expectedSalaryRange: "",
    workExperiences: [],
    educations: [],
    linkedinProfile: "",
    portfolio: "",
    preferredRole: "",
    workPermitStatus: "Nationality basis",
    employmentType: "Permanent",
    workMode: "Hybrid",
    references: "",
    noticePeriod: "",
    activelySeekingToggle: "Passive",
  })
  const { toast } = useToast()

  const updateFormData = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }

  // Validate required fields for each step
  const getMissingFields = (step: number): Set<string> => {
    const missing = new Set<string>()
    
    if (step === 1) {
      if (!formData.cv) missing.add("cv")
      if (!formData.name.trim()) missing.add("name")
      if (!formData.mobileNumber.trim()) missing.add("mobileNumber")
      if (!formData.email.trim()) missing.add("email")
      if (!formData.currentLocation.trim()) missing.add("currentLocation")
      if (!formData.currentSalaryCurrency) missing.add("currentSalaryCurrency")
      if (!formData.salaryRange) missing.add("salaryRange")
      if (!formData.nationality.trim()) missing.add("nationality")
      if (!formData.gender) missing.add("gender")
    }
    
    return missing
  }

  const missingFields = useMemo(() => getMissingFields(currentStep), [currentStep, formData])

  // Calculate form completion percentage
  const formCompletionPercentage = useMemo(() => {
    let filledFields = 0
    let totalFields = 0

    // Step 1 - Basic Info (9 required + 1 optional)
    totalFields += 10
    if (formData.cv) filledFields++
    if (formData.name.trim()) filledFields++
    if (formData.mobileNumber.trim()) filledFields++
    if (formData.email.trim()) filledFields++
    if (formData.photograph) filledFields++
    if (formData.currentLocation.trim()) filledFields++
    if (formData.currentSalaryCurrency) filledFields++
    if (formData.salaryRange) filledFields++
    if (formData.nationality.trim()) filledFields++
    if (formData.gender) filledFields++

    // Step 2 - Professional Details (5 required + 2 optional)
    totalFields += 7
    if (formData.seniorityLevel) filledFields++
    if (formData.reportingManager.trim()) filledFields++
    if (formData.preferredLocation.trim()) filledFields++
    if (formData.skills.trim()) filledFields++
    if (formData.experience.trim()) filledFields++
    if (formData.expectedSalaryCurrency) filledFields++
    if (formData.expectedSalaryRange) filledFields++

    // Step 3 - Work Experiences (at least 1 required, each has 6 required + 1 optional)
    // Count as complete if at least one experience is fully filled
    if (formData.workExperiences.length > 0) {
      const completeExperiences = formData.workExperiences.filter(exp => 
        exp.companyName.trim() && 
        exp.role.trim() && 
        exp.startMonth && 
        exp.startYear && 
        (exp.isCurrent || (exp.endMonth && exp.endYear))
      )
      if (completeExperiences.length > 0) {
        filledFields += 1 // Count as 1 field if at least one complete experience exists
      }
    }
    totalFields += 1

    // Step 4 - Educations (at least 1 required, each has 4 required fields)
    // Count as complete if at least one education is fully filled
    if (formData.educations.length > 0) {
      const completeEducations = formData.educations.filter(edu => 
        edu.degree.trim() && 
        edu.institute.trim() && 
        edu.startYear && 
        edu.endYear
      )
      if (completeEducations.length > 0) {
        filledFields += 1 // Count as 1 field if at least one complete education exists
      }
    }
    totalFields += 1

    // Step 5 - Preferences (3 required + 6 optional)
    totalFields += 9
    if (formData.linkedinProfile.trim()) filledFields++
    if (formData.portfolio.trim()) filledFields++
    if (formData.preferredRole.trim()) filledFields++
    if (formData.workPermitStatus) filledFields++
    if (formData.employmentType) filledFields++
    if (formData.workMode) filledFields++
    if (formData.references.trim()) filledFields++
    if (formData.noticePeriod) filledFields++
    if (formData.activelySeekingToggle) filledFields++

    return Math.round((filledFields / totalFields) * 100)
  }, [formData])

  const stepProgress = (currentStep / STEPS.length) * 100

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      const formDataToSubmit = new FormData()

      // Add all form fields to FormData
      formDataToSubmit.append("name", formData.name)
      formDataToSubmit.append("mobileNumber", formData.mobileNumber)
      formDataToSubmit.append("email", formData.email)
      formDataToSubmit.append("currentLocation", formData.currentLocation)
      formDataToSubmit.append("currentSalaryCurrency", formData.currentSalaryCurrency)
      formDataToSubmit.append("salaryRange", formData.salaryRange)
      formDataToSubmit.append("nationality", formData.nationality)
      formDataToSubmit.append("gender", formData.gender)
      formDataToSubmit.append("seniorityLevel", formData.seniorityLevel)
      formDataToSubmit.append("reportingManager", formData.reportingManager)
      formDataToSubmit.append("preferredLocation", formData.preferredLocation)
      formDataToSubmit.append("skills", formData.skills)
      formDataToSubmit.append("experience", formData.experience)
      formDataToSubmit.append("workExperiences", JSON.stringify(formData.workExperiences))
      formDataToSubmit.append("educations", JSON.stringify(formData.educations))
      formDataToSubmit.append("expectedSalaryCurrency", formData.expectedSalaryCurrency)
      formDataToSubmit.append("expectedSalaryRange", formData.expectedSalaryRange)
      formDataToSubmit.append("linkedinProfile", formData.linkedinProfile)
      formDataToSubmit.append("portfolio", formData.portfolio)
      formDataToSubmit.append("preferredRole", formData.preferredRole)
      formDataToSubmit.append("workPermitStatus", formData.workPermitStatus)
      formDataToSubmit.append("employmentType", formData.employmentType)
      formDataToSubmit.append("workMode", formData.workMode)
      formDataToSubmit.append("references", formData.references)
      formDataToSubmit.append("noticePeriod", formData.noticePeriod)
      formDataToSubmit.append("activelySeekingToggle", formData.activelySeekingToggle)

      // Add files if they exist
      if (formData.cv) {
        formDataToSubmit.append("cv", formData.cv)
      }
      if (formData.photograph) {
        formDataToSubmit.append("photograph", formData.photograph)
      }

      const { apiClient } = await import("@/lib/api-client")
      const result = await apiClient.submitApplication(formDataToSubmit)

      if (result.success && result.candidate?.id) {
        toast({
          title: "Application Submitted!",
          description: "Redirecting to your dashboard...",
        })
        
        // Redirect to candidate dashboard after a short delay
        setTimeout(() => {
          router.push(`/candidates/${result.candidate.id}`)
        }, 1500)
      } else {
        // Fallback if no candidate ID (shouldn't happen, but handle gracefully)
        setIsSubmitted(true)
        toast({
          title: "Application Submitted!",
          description: "Thank you for applying. We'll review your application and get back to you soon.",
        })
      }
    } catch (error) {
      console.error("[v0] Submission error:", error)
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="mx-auto max-w-2xl">
        <Card className="border-2 text-center">
          <CardHeader>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-3xl">Application Submitted Successfully!</CardTitle>
            <CardDescription className="text-lg mt-2">Thank you for your interest in joining our team.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              We've received your application and our recruitment team will review it shortly. You'll hear from us soon!
            </p>
            <Button
              onClick={() => {
                setIsSubmitted(false)
                setCurrentStep(1)
                setFormData({
                  cv: null,
                  name: "",
                  mobileNumber: "",
                  email: "",
                  photograph: null,
                  currentLocation: "",
                  currentSalaryCurrency: "",
                  salaryRange: "",
                  nationality: "",
                  gender: "",
                  seniorityLevel: "",
                  reportingManager: "",
                  preferredLocation: "",
                  skills: "",
                  experience: "",
                  expectedSalaryCurrency: "",
                  expectedSalaryRange: "",
                  workExperiences: [],
                  educations: [],
                  linkedinProfile: "",
                  portfolio: "",
                  preferredRole: "",
                  workPermitStatus: "Nationality basis",
                  employmentType: "Permanent",
                  workMode: "Hybrid",
                  references: "",
                  noticePeriod: "",
                  activelySeekingToggle: "Passive",
                })
              }}
              variant="outline"
              className="mt-4"
            >
              Submit Another Application
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-foreground mb-2 text-balance">Join Our Team</h1>
        <p className="text-muted-foreground text-lg">Complete your application in just 5 simple steps</p>
      </div>

      {/* Overall Form Completion Progress Bar */}
      <Card className="mb-8 border-2">
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Form Completion</Label>
              <span className="text-sm font-medium text-muted-foreground">{formCompletionPercentage}%</span>
            </div>
            <Progress value={formCompletionPercentage} className="h-3" />
            <p className="text-xs text-muted-foreground mt-1">
              Fill in all fields to complete your application
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Step Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-4">
          {STEPS.map((step) => {
            const StepIcon = step.icon
            return (
              <div
                key={step.number}
                className={`flex items-center gap-2 ${
                  currentStep === step.number
                    ? "text-primary font-semibold"
                    : currentStep > step.number
                      ? "text-primary"
                      : "text-muted-foreground"
                }`}
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${
                    currentStep === step.number
                      ? "border-primary bg-primary text-primary-foreground"
                      : currentStep > step.number
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-muted-foreground"
                  }`}
                >
                  {currentStep > step.number ? <span className="text-lg">✓</span> : <StepIcon className="h-5 w-5" />}
                </div>
                <span className="hidden md:inline text-sm">{step.title}</span>
              </div>
            )
          })}
        </div>
        <Progress value={stepProgress} className="h-2" />
      </div>

      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-2xl">
            Step {currentStep}: {STEPS[currentStep - 1].title}
          </CardTitle>
          <CardDescription>
            {currentStep === 1 && "Start by uploading your CV and providing basic information"}
            {currentStep === 2 && "Tell us about your professional background"}
            {currentStep === 3 && "Add your work experience history"}
            {currentStep === 4 && "Add your educational qualifications"}
            {currentStep === 5 && "Share your preferences and additional details"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {currentStep === 1 && <StepOne formData={formData} updateFormData={updateFormData} missingFields={missingFields} />}
          {currentStep === 2 && <StepTwo formData={formData} updateFormData={updateFormData} />}
          {currentStep === 3 && <StepThree formData={formData} updateFormData={updateFormData} />}
          {currentStep === 4 && <StepFour formData={formData} updateFormData={updateFormData} />}
          {currentStep === 5 && <StepFive formData={formData} updateFormData={updateFormData} />}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1 || isSubmitting}
              className="gap-2 bg-transparent"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            {currentStep < STEPS.length ? (
              <Button onClick={handleNext} disabled={isSubmitting} className="gap-2">
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isSubmitting} className="gap-2 bg-accent hover:bg-accent/90">
                {isSubmitting ? "Submitting..." : "Submit Application"}
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
