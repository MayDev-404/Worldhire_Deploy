"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { FormData } from "../candidate-application-form"

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

      {/* Work History */}
      <div className="space-y-2">
        <Label htmlFor="workHistory" className="text-base">
          Work History <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="workHistory"
          placeholder="Brief overview of your work experience (companies, roles, duration)"
          value={formData.workHistory}
          onChange={(e) => updateFormData({ workHistory: e.target.value })}
          rows={5}
        />
      </div>

      {/* Education */}
      <div className="space-y-2">
        <Label htmlFor="education" className="text-base">
          Education <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="education"
          placeholder="Degree, Institution, Year of graduation"
          value={formData.education}
          onChange={(e) => updateFormData({ education: e.target.value })}
          rows={3}
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
            onValueChange={(value) => updateFormData({ expectedSalaryCurrency: value })}
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
              <SelectValue placeholder="Select range" />
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
    </div>
  )
}
