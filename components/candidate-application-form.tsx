"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { StepOne } from "./form-steps/step-one"
import { StepTwo } from "./form-steps/step-two"
import { StepThree } from "./form-steps/step-three"
import { ChevronLeft, ChevronRight, Upload, User, Briefcase, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

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
  workHistory: string
  education: string
  expectedSalaryCurrency: string
  expectedSalaryRange: string

  // Step 3 - Preferences & Additional Info
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
  { number: 3, title: "Preferences & Additional", icon: Briefcase },
]

export default function CandidateApplicationForm() {
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
    workHistory: "",
    education: "",
    expectedSalaryCurrency: "",
    expectedSalaryRange: "",
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

  const progress = (currentStep / STEPS.length) * 100

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
      formDataToSubmit.append("workHistory", formData.workHistory)
      formDataToSubmit.append("education", formData.education)
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

      const response = await fetch("/api/submit-application", {
        method: "POST",
        body: formDataToSubmit,
      })

      const result = await response.json()

      if (!response.ok) {
        // Show detailed error message
        const errorMsg = result.error || result.details || "Failed to submit application"
        console.error("[v0] Submission failed:", result)
        throw new Error(errorMsg)
      }

      setIsSubmitted(true)
      toast({
        title: "Application Submitted!",
        description: "Thank you for applying. We'll review your application and get back to you soon.",
      })
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
                  workHistory: "",
                  education: "",
                  expectedSalaryCurrency: "",
                  expectedSalaryRange: "",
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
        <p className="text-muted-foreground text-lg">Complete your application in just 3 simple steps</p>
      </div>

      {/* Progress Bar */}
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
        <Progress value={progress} className="h-2" />
      </div>

      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-2xl">
            Step {currentStep}: {STEPS[currentStep - 1].title}
          </CardTitle>
          <CardDescription>
            {currentStep === 1 && "Start by uploading your CV and providing basic information"}
            {currentStep === 2 && "Tell us about your professional background"}
            {currentStep === 3 && "Share your preferences and additional details"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {currentStep === 1 && <StepOne formData={formData} updateFormData={updateFormData} />}
          {currentStep === 2 && <StepTwo formData={formData} updateFormData={updateFormData} />}
          {currentStep === 3 && <StepThree formData={formData} updateFormData={updateFormData} />}

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
