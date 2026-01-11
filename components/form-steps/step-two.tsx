"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { FormData } from "../candidate-application-form"

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

type StepTwoProps = {
  formData: FormData
  updateFormData: (data: Partial<FormData>) => void
}

export function StepTwo({ formData, updateFormData }: StepTwoProps) {
  return (
    <div className="space-y-6">
      {/* Seniority Level & Reporting Manager - Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="seniorityLevel" className="text-base">
            Seniority Level
          </Label>
          <Select value={formData.seniorityLevel} onValueChange={(value) => updateFormData({ seniorityLevel: value })}>
            <SelectTrigger id="seniorityLevel">
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Entry Level">Entry Level</SelectItem>
              <SelectItem value="Junior">Junior</SelectItem>
              <SelectItem value="Mid-Level">Mid-Level</SelectItem>
              <SelectItem value="Senior">Senior</SelectItem>
              <SelectItem value="Lead">Lead</SelectItem>
              <SelectItem value="Manager">Manager</SelectItem>
              <SelectItem value="Director">Director</SelectItem>
              <SelectItem value="Executive">Executive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="reportingManager" className="text-base">
            Reporting Manager
          </Label>
          <Input
            id="reportingManager"
            placeholder="Manager's name or title"
            value={formData.reportingManager}
            onChange={(e) => updateFormData({ reportingManager: e.target.value })}
          />
        </div>
      </div>

      {/* Preferred Location */}
      <div className="space-y-2">
        <Label htmlFor="preferredLocation" className="text-base">
          Preferred Location <span className="text-destructive">*</span>
        </Label>
        <Input
          id="preferredLocation"
          placeholder="City, Country or Remote"
          value={formData.preferredLocation}
          onChange={(e) => updateFormData({ preferredLocation: e.target.value })}
        />
      </div>

      {/* Skills */}
      <div className="space-y-2">
        <Label htmlFor="skills" className="text-base">
          Skills <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="skills"
          placeholder="List your key skills (e.g., JavaScript, React, Node.js, Project Management)"
          value={formData.skills}
          onChange={(e) => updateFormData({ skills: e.target.value })}
          rows={3}
        />
      </div>

      {/* Experience */}
      <div className="space-y-2">
        <Label htmlFor="experience" className="text-base">
          Years of Experience <span className="text-destructive">*</span>
        </Label>
        <Input
          id="experience"
          placeholder="e.g., 5 years"
          value={formData.experience}
          onChange={(e) => updateFormData({ experience: e.target.value })}
        />
      </div>

      {/* Expected Salary Currency & Expected Salary Range - Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="expectedSalaryCurrency" className="text-base">
            Expected Salary Currency <span className="text-destructive">*</span>
          </Label>
          <Select
            value={formData.expectedSalaryCurrency}
            onValueChange={(value) => updateFormData({ expectedSalaryCurrency: value, expectedSalaryRange: "" })}
          >
            <SelectTrigger id="expectedSalaryCurrency">
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
          <Label htmlFor="expectedSalaryRange" className="text-base">
            Expected Salary Range <span className="text-destructive">*</span>
          </Label>
          <Select
            value={formData.expectedSalaryRange}
            onValueChange={(value) => updateFormData({ expectedSalaryRange: value })}
          >
            <SelectTrigger id="expectedSalaryRange">
              <SelectValue
                placeholder={
                  (SALARY_RANGE_OPTIONS[formData.expectedSalaryCurrency] ||
                    SALARY_RANGE_OPTIONS.DEFAULT)[0]?.label ?? "Select range"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {(SALARY_RANGE_OPTIONS[formData.expectedSalaryCurrency] || SALARY_RANGE_OPTIONS.DEFAULT).map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
