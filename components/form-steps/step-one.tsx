"use client"

import type React from "react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { FormData } from "../candidate-application-form"
// import { Loader2 } from "lucide-react" // CV parsing disabled

type StepOneProps = {
  formData: FormData
  updateFormData: (data: Partial<FormData>) => void
}

export function StepOne({ formData, updateFormData }: StepOneProps) {
  // CV parsing feature disabled
  // const [isParsingCV, setIsParsingCV] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, field: "cv" | "photograph") => {
    const file = e.target.files?.[0] || null
    updateFormData({ [field]: file })

    // CV parsing feature commented out
    // If CV is uploaded, parse and auto-fill
    // if (field === "cv" && file) {
    //   setIsParsingCV(true)
    //   try {
    //     const formData = new FormData()
    //     formData.append("file", file)

    //     const response = await fetch("/api/parse-cv", {
    //       method: "POST",
    //       body: formData,
    //     })

    //     if (response.ok) {
    //       const { data } = await response.json()

    //       // Auto-fill form fields with extracted data
    //       const updates: Partial<FormData> = {}
    //       if (data.name) updates.name = data.name
    //       if (data.email) updates.email = data.email
    //       if (data.phone) updates.mobileNumber = data.phone
    //       if (data.location) updates.currentLocation = data.location
    //       if (data.nationality) updates.nationality = data.nationality
    //       if (data.skills) updates.skills = data.skills
    //       if (data.experience) updates.experience = data.experience
    //       if (data.education) updates.education = data.education
    //       if (data.workHistory) updates.workHistory = data.workHistory
    //       if (data.linkedinProfile) updates.linkedinProfile = data.linkedinProfile
    //       if (data.preferredRole) updates.preferredRole = data.preferredRole

    //       updateFormData(updates)
    //     }
    //   } catch (error) {
    //     console.error("Error parsing CV:", error)
    //   } finally {
    //     setIsParsingCV(false)
    //   }
    // }
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
            // disabled={isParsingCV} // CV parsing disabled
          />
          {formData.cv && <p className="text-sm text-muted-foreground mt-2">Selected: {formData.cv.name}</p>}
          {/* CV parsing feature disabled */}
          {/* {isParsingCV && (
            <div className="flex items-center gap-2 mt-2 text-sm text-primary">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Analyzing your CV and filling form fields...</span>
            </div>
          )} */}
        </div>
        <p className="text-sm text-muted-foreground">
          Accepted formats: PDF, DOC, DOCX (Max 5MB)
          {/* - Fields will be auto-filled from your CV */}
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
        />
      </div>

      {/* Mobile Number & Email - Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="mobile" className="text-base">
            Mobile Number <span className="text-destructive">*</span>
          </Label>
          <Input
            id="mobile"
            type="tel"
            placeholder="+1 (555) 000-0000"
            value={formData.mobileNumber}
            onChange={(e) => updateFormData({ mobileNumber: e.target.value })}
          />
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
            onValueChange={(value) => updateFormData({ currentSalaryCurrency: value })}
          >
            <SelectTrigger id="currentSalaryCurrency">
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="EUR">EUR</SelectItem>
              <SelectItem value="GBP">GBP</SelectItem>
              <SelectItem value="INR">INR</SelectItem>
              <SelectItem value="AUD">AUD</SelectItem>
              <SelectItem value="CAD">CAD</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="salaryRange" className="text-base">
            Current Salary Range <span className="text-destructive">*</span>
          </Label>
          <Select value={formData.salaryRange} onValueChange={(value) => updateFormData({ salaryRange: value })}>
            <SelectTrigger id="salaryRange">
              <SelectValue placeholder="50 LPA - 75 LPA" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0-25">0 - 25 LPA</SelectItem>
              <SelectItem value="25-50">25 - 50 LPA</SelectItem>
              <SelectItem value="50-75">50 - 75 LPA</SelectItem>
              <SelectItem value="75-100">75 - 100 LPA</SelectItem>
              <SelectItem value="100+">100+ LPA</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Nationality */}
      <div className="space-y-2">
        <Label htmlFor="nationality" className="text-base">
          Nationality <span className="text-destructive">*</span>
        </Label>
        <Input
          id="nationality"
          placeholder="Enter your nationality"
          value={formData.nationality}
          onChange={(e) => updateFormData({ nationality: e.target.value })}
        />
      </div>

      {/* Gender */}
      <div className="space-y-3">
        <Label className="text-base">
          Gender <span className="text-destructive">*</span>
        </Label>
        <RadioGroup
          value={formData.gender}
          onValueChange={(value) => updateFormData({ gender: value })}
          className="flex flex-col space-y-2"
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
