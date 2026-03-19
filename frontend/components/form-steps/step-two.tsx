"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { FormData } from "../candidate-application-form"
import { CURRENCY_OPTIONS, getSalaryRangesForCurrency } from "@/lib/form-options"

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
              {CURRENCY_OPTIONS.map(({ value, label }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
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
                  getSalaryRangesForCurrency(formData.expectedSalaryCurrency)[0]?.label ?? "Select range"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {getSalaryRangesForCurrency(formData.expectedSalaryCurrency).map((range) => (
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
