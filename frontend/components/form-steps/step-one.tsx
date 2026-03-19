"use client"

import type React from "react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { FormData } from "../candidate-application-form"
import { Loader2 } from "lucide-react"
import {
  COUNTRY_CODE_OPTIONS,
  CURRENCY_OPTIONS,
  NATIONALITY_OPTIONS,
  getSalaryRangesForCurrency,
} from "@/lib/form-options"

type StepOneProps = {
  formData: FormData
  updateFormData: (data: Partial<FormData>) => void
  missingFields: Set<string>
}

export function StepOne({ formData, updateFormData, missingFields }: StepOneProps) {
  const fieldHasError = (key: string) => missingFields.has(key)
  const [isParsingCV, setIsParsingCV] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, field: "cv" | "photograph") => {
    const file = e.target.files?.[0] || null
    updateFormData({ [field]: file })

    // If CV is uploaded, parse and auto-fill using Gemma3 via Hugging Face
    if (field === "cv" && file) {
      setIsParsingCV(true)
      try {
        const { apiClient } = await import("@/lib/api-client")
        const response = await apiClient.parseCV(file)

        // Auto-fill form fields with extracted data
        const { data } = response
        const updates: Partial<FormData> = {}
        if (data.name) updates.name = data.name
        if (data.email) updates.email = data.email
        if (data.phone) updates.mobileNumber = data.phone
        if (data.location) updates.currentLocation = data.location
        if (data.nationality) updates.nationality = data.nationality
        if (data.skills) updates.skills = data.skills
        if (data.experience) updates.experience = data.experience
        if (data.linkedinProfile) updates.linkedinProfile = data.linkedinProfile
        if (data.preferredRole) updates.preferredRole = data.preferredRole
        
        // Handle structured work experiences
        if (data.workExperiences && Array.isArray(data.workExperiences) && data.workExperiences.length > 0) {
          updates.workExperiences = data.workExperiences
        }
        
        // Handle structured educations
        if (data.educations && Array.isArray(data.educations) && data.educations.length > 0) {
          updates.educations = data.educations
        }

        updateFormData(updates)
      } catch (error) {
        console.error("Error parsing CV:", error)
      } finally {
        setIsParsingCV(false)
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* CV Upload */}
      <div className="space-y-2">
        <Label htmlFor="cv" className="text-base font-semibold">
          Upload CV <span className="text-destructive">*</span>
        </Label>
        <div className="relative">
          <Input
            id="cv"
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => handleFileChange(e, "cv")}
            className="cursor-pointer file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary-foreground hover:file:bg-primary/90"
            disabled={isParsingCV}
          />
          {formData.cv && <p className="text-sm text-muted-foreground mt-2">Selected: {formData.cv.name}</p>}
          {isParsingCV && (
            <div className="flex items-center gap-2 mt-2 text-sm text-primary">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Analyzing your CV with AI and filling form fields...</span>
            </div>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          Accepted formats: PDF, DOC, DOCX (Max 5MB) - Fields will be auto-filled from your CV using AI
        </p>
      </div>

      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-base">
          Full Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          placeholder="Enter your full name"
          value={formData.name}
          onChange={(e) => updateFormData({ name: e.target.value })}
            className={fieldHasError("name") ? "border-destructive" : ""}
        />
      </div>

      {/* Mobile Number & Email - Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="mobile" className="text-base">
            Mobile Number <span className="text-destructive">*</span>
          </Label>
          <div className="flex gap-3">
            <Select
              onValueChange={(value) => {
                const digits = formData.mobileNumber.replace(/^[+\\d\\s-]+/, "").trim()
                updateFormData({ mobileNumber: `${value} ${digits}`.trim() })
              }}
            >
              <SelectTrigger className={`w-40 ${missingFields.has("mobileNumber") ? "border-destructive" : ""}`}>
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
              id="mobile"
              type="tel"
              placeholder="e.g., 5550000000"
              value={formData.mobileNumber.replace(/^[+\\d\\s-]+/, "").trim()}
              onChange={(e) =>
                updateFormData({
                  mobileNumber: `${formData.mobileNumber.match(/^[+\\d\\s-]+/)?.[0]?.trim() || ""} ${e.target.value}`.trim(),
                })
              }
              className={missingFields.has("mobileNumber") ? "border-destructive" : ""}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Choose a code or type your own in the number field (you can paste full numbers too).
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-base">
            Email ID <span className="text-destructive">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="your.email@example.com"
            value={formData.email}
            onChange={(e) => updateFormData({ email: e.target.value })}
            className={fieldHasError("email") ? "border-destructive" : ""}
          />
        </div>
      </div>

      {/* Photograph */}
      <div className="space-y-2">
        <Label htmlFor="photograph" className="text-base">
          Photograph / Avatar <span className="text-muted-foreground">(Optional)</span>
        </Label>
        <Input
          id="photograph"
          type="file"
          accept="image/*"
          onChange={(e) => handleFileChange(e, "photograph")}
          className="cursor-pointer file:mr-4 file:rounded-md file:border-0 file:bg-secondary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-secondary-foreground hover:file:bg-secondary/80"
        />
        {formData.photograph && <p className="text-sm text-muted-foreground">Selected: {formData.photograph.name}</p>}
      </div>

      {/* Current Location */}
      <div className="space-y-2">
        <Label htmlFor="currentLocation" className="text-base">
          Current Location <span className="text-destructive">*</span>
        </Label>
        <Input
          id="currentLocation"
          placeholder="City, Country"
          value={formData.currentLocation}
          onChange={(e) => updateFormData({ currentLocation: e.target.value })}
            className={fieldHasError("currentLocation") ? "border-destructive" : ""}
        />
      </div>

      {/* Current Salary Currency & Salary Range - Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="currentSalaryCurrency" className="text-base">
            Current Salary Currency <span className="text-destructive">*</span>
          </Label>
          <Select
            value={formData.currentSalaryCurrency}
            onValueChange={(value) => updateFormData({ currentSalaryCurrency: value, salaryRange: "" })}
          >
            <SelectTrigger
              id="currentSalaryCurrency"
              className={fieldHasError("currentSalaryCurrency") ? "border-destructive" : ""}
            >
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

        <div className="space-y-2">
          <Label htmlFor="salaryRange" className="text-base">
            Current Salary Range <span className="text-destructive">*</span>
          </Label>
          {(() => {
            const ranges = getSalaryRangesForCurrency(formData.currentSalaryCurrency)
            return (
              <Select
                value={formData.salaryRange}
                onValueChange={(value) => updateFormData({ salaryRange: value })}
              >
                <SelectTrigger
                  id="salaryRange"
                  className={fieldHasError("salaryRange") ? "border-destructive" : ""}
                >
                  <SelectValue placeholder={ranges[0]?.label ?? "Select range"} />
                </SelectTrigger>
                <SelectContent>
                  {ranges.map((range) => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )
          })()}
        </div>
      </div>

      {/* Nationality */}
      <div className="space-y-2">
        <Label htmlFor="nationality" className="text-base">
          Nationality <span className="text-destructive">*</span>
        </Label>
        <Select
          value={formData.nationality}
          onValueChange={(value) => updateFormData({ nationality: value })}
        >
          <SelectTrigger
            id="nationality"
            className={fieldHasError("nationality") ? "border-destructive" : ""}
          >
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

      {/* Gender */}
      <div className="space-y-3">
        <Label className="text-base">
          Gender <span className="text-destructive">*</span>
        </Label>
        <RadioGroup
          value={formData.gender}
          onValueChange={(value) => updateFormData({ gender: value })}
          className={`flex flex-col space-y-2 ${fieldHasError("gender") ? "border border-destructive rounded-md p-2" : ""}`}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Male" id="male" />
            <Label htmlFor="male" className="font-normal cursor-pointer">
              Male
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Female" id="female" />
            <Label htmlFor="female" className="font-normal cursor-pointer">
              Female
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Non-binary" id="non-binary" />
            <Label htmlFor="non-binary" className="font-normal cursor-pointer">
              Non-binary
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Prefer not to say" id="prefer-not-to-say" />
            <Label htmlFor="prefer-not-to-say" className="font-normal cursor-pointer">
              Prefer not to say
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  )
}
