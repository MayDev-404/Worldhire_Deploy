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
  missingFields: Set<string>
}

const COUNTRY_CODES = [
  { code: "+1", label: "United States / Canada (+1)" },
  { code: "+44", label: "United Kingdom (+44)" },
  { code: "+61", label: "Australia (+61)" },
  { code: "+65", label: "Singapore (+65)" },
  { code: "+81", label: "Japan (+81)" },
  { code: "+91", label: "India (+91)" },
  { code: "+971", label: "UAE (+971)" },
  { code: "+49", label: "Germany (+49)" },
  { code: "+33", label: "France (+33)" },
  { code: "+34", label: "Spain (+34)" },
  { code: "+39", label: "Italy (+39)" },
  { code: "+46", label: "Sweden (+46)" },
  { code: "+47", label: "Norway (+47)" },
  { code: "+45", label: "Denmark (+45)" },
  { code: "+352", label: "Luxembourg (+352)" },
  { code: "+353", label: "Ireland (+353)" },
  { code: "+41", label: "Switzerland (+41)" },
  { code: "+86", label: "China (+86)" },
  { code: "+852", label: "Hong Kong (+852)" },
  { code: "+853", label: "Macau (+853)" },
  { code: "+82", label: "South Korea (+82)" },
  { code: "+62", label: "Indonesia (+62)" },
  { code: "+60", label: "Malaysia (+60)" },
  { code: "+63", label: "Philippines (+63)" },
  { code: "+64", label: "New Zealand (+64)" },
  { code: "+55", label: "Brazil (+55)" },
  { code: "+52", label: "Mexico (+52)" },
  { code: "+54", label: "Argentina (+54)" },
  { code: "+27", label: "South Africa (+27)" },
  { code: "+234", label: "Nigeria (+234)" },
  { code: "+966", label: "Saudi Arabia (+966)" },
  { code: "+20", label: "Egypt (+20)" },
]

const SALARY_RANGE_OPTIONS: Record<string, { label: string; value: string }[]> = {
  USD: [
    { label: "Under 50k USD", value: "0-50k USD" },
    { label: "50k - 100k USD", value: "50k-100k USD" },
    { label: "100k - 150k USD", value: "100k-150k USD" },
    { label: "150k - 200k USD", value: "150k-200k USD" },
    { label: "200k+ USD", value: "200k+ USD" },
  ],
  EUR: [
    { label: "Under 40k EUR", value: "0-40k EUR" },
    { label: "40k - 70k EUR", value: "40k-70k EUR" },
    { label: "70k - 100k EUR", value: "70k-100k EUR" },
    { label: "100k - 140k EUR", value: "100k-140k EUR" },
    { label: "140k+ EUR", value: "140k+ EUR" },
  ],
  GBP: [
    { label: "Under 30k GBP", value: "0-30k GBP" },
    { label: "30k - 60k GBP", value: "30k-60k GBP" },
    { label: "60k - 90k GBP", value: "60k-90k GBP" },
    { label: "90k - 120k GBP", value: "90k-120k GBP" },
    { label: "120k+ GBP", value: "120k+ GBP" },
  ],
  INR: [
    { label: "Under 5 LPA", value: "0-5 LPA" },
    { label: "5 - 10 LPA", value: "5-10 LPA" },
    { label: "10 - 20 LPA", value: "10-20 LPA" },
    { label: "20 - 40 LPA", value: "20-40 LPA" },
    { label: "40+ LPA", value: "40+ LPA" },
  ],
  AUD: [
    { label: "Under 70k AUD", value: "0-70k AUD" },
    { label: "70k - 100k AUD", value: "70k-100k AUD" },
    { label: "100k - 140k AUD", value: "100k-140k AUD" },
    { label: "140k - 180k AUD", value: "140k-180k AUD" },
    { label: "180k+ AUD", value: "180k+ AUD" },
  ],
  CAD: [
    { label: "Under 60k CAD", value: "0-60k CAD" },
    { label: "60k - 90k CAD", value: "60k-90k CAD" },
    { label: "90k - 130k CAD", value: "90k-130k CAD" },
    { label: "130k - 170k CAD", value: "130k-170k CAD" },
    { label: "170k+ CAD", value: "170k+ CAD" },
  ],
  DEFAULT: [
    { label: "Entry", value: "Entry" },
    { label: "Mid", value: "Mid" },
    { label: "Senior", value: "Senior" },
    { label: "Lead", value: "Lead" },
  ],
}

export function StepOne({ formData, updateFormData, missingFields }: StepOneProps) {
  const fieldHasError = (key: string) => missingFields.has(key)
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
                {COUNTRY_CODES.map(({ code, label }) => (
                  <SelectItem key={code} value={code}>
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
          {(() => {
            const ranges = SALARY_RANGE_OPTIONS[formData.currentSalaryCurrency] || SALARY_RANGE_OPTIONS.DEFAULT
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
        <Input
          id="nationality"
          placeholder="Enter your nationality"
          value={formData.nationality}
          onChange={(e) => updateFormData({ nationality: e.target.value })}
            className={fieldHasError("nationality") ? "border-destructive" : ""}
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
