"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { FormData } from "../candidate-application-form"

type StepThreeProps = {
  formData: FormData
  updateFormData: (data: Partial<FormData>) => void
}

export function StepThree({ formData, updateFormData }: StepThreeProps) {
  return (
    <div className="space-y-6">
      {/* LinkedIn Profile */}
      <div className="space-y-2">
        <Label htmlFor="linkedinProfile" className="text-base">
          LinkedIn Profile
        </Label>
        <Input
          id="linkedinProfile"
          type="url"
          placeholder="https://linkedin.com/in/yourprofile"
          value={formData.linkedinProfile}
          onChange={(e) => updateFormData({ linkedinProfile: e.target.value })}
        />
      </div>

      {/* Portfolio */}
      <div className="space-y-2">
        <Label htmlFor="portfolio" className="text-base">
          Portfolio / Work Showcase
        </Label>
        <Textarea
          id="portfolio"
          placeholder="Links to your portfolio, GitHub, Behance, or any showcase of previous work"
          value={formData.portfolio}
          onChange={(e) => updateFormData({ portfolio: e.target.value })}
          rows={3}
        />
      </div>

      {/* Preferred Role */}
      <div className="space-y-2">
        <Label htmlFor="preferredRole" className="text-base">
          Preferred Role
        </Label>
        <Input
          id="preferredRole"
          placeholder="e.g., Frontend Developer, Product Manager, Data Analyst"
          value={formData.preferredRole}
          onChange={(e) => updateFormData({ preferredRole: e.target.value })}
        />
      </div>

      {/* Work Permit Status */}
      <div className="space-y-2">
        <Label htmlFor="workPermitStatus" className="text-base">
          Work Permit Status
        </Label>
        <Select
          value={formData.workPermitStatus}
          onValueChange={(value) => updateFormData({ workPermitStatus: value })}
        >
          <SelectTrigger id="workPermitStatus">
            <SelectValue placeholder="Nationality basis" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Nationality basis">Nationality basis</SelectItem>
            <SelectItem value="Work Permit Holder">Work Permit Holder</SelectItem>
            <SelectItem value="Citizen">Citizen</SelectItem>
            <SelectItem value="Permanent Resident">Permanent Resident</SelectItem>
            <SelectItem value="Visa Sponsorship Required">Visa Sponsorship Required</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Employment Type */}
      <div className="space-y-2">
        <Label htmlFor="employmentType" className="text-base">
          Employment Type
        </Label>
        <Select value={formData.employmentType} onValueChange={(value) => updateFormData({ employmentType: value })}>
          <SelectTrigger id="employmentType">
            <SelectValue placeholder="Permanent" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Permanent">Permanent</SelectItem>
            <SelectItem value="Contract">Contract</SelectItem>
            <SelectItem value="Temporary">Temporary</SelectItem>
            <SelectItem value="Freelance">Freelance</SelectItem>
            <SelectItem value="Internship">Internship</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Work Mode (WFH/WFO/Hybrid) */}
      <div className="space-y-3">
        <Label className="text-base">
          Work Mode Preference <span className="text-destructive">*</span>
        </Label>
        <RadioGroup
          value={formData.workMode}
          onValueChange={(value) => updateFormData({ workMode: value })}
          className="flex flex-col space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="WFH" id="wfh" />
            <Label htmlFor="wfh" className="font-normal cursor-pointer">
              Work From Home (WFH)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="WFO" id="wfo" />
            <Label htmlFor="wfo" className="font-normal cursor-pointer">
              Work From Office (WFO)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Hybrid" id="hybrid" />
            <Label htmlFor="hybrid" className="font-normal cursor-pointer">
              Hybrid
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* References */}
      <div className="space-y-2">
        <Label htmlFor="references" className="text-base">
          References
        </Label>
        <Textarea
          id="references"
          placeholder="Provide contact information for professional references"
          value={formData.references}
          onChange={(e) => updateFormData({ references: e.target.value })}
          rows={3}
        />
      </div>

      {/* Notice Period */}
      <div className="space-y-2">
        <Label htmlFor="noticePeriod" className="text-base">
          Notice Period <span className="text-destructive">*</span>
        </Label>
        <Select value={formData.noticePeriod} onValueChange={(value) => updateFormData({ noticePeriod: value })}>
          <SelectTrigger id="noticePeriod">
            <SelectValue placeholder="Select notice period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Immediate">Immediate</SelectItem>
            <SelectItem value="1 week">1 week</SelectItem>
            <SelectItem value="2 weeks">2 weeks</SelectItem>
            <SelectItem value="1 month">1 month</SelectItem>
            <SelectItem value="2 months">2 months</SelectItem>
            <SelectItem value="3 months">3 months</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Actively Seeking Toggle */}
      <div className="space-y-3">
        <Label className="text-base">
          Job Search Status <span className="text-destructive">*</span>
        </Label>
        <RadioGroup
          value={formData.activelySeekingToggle}
          onValueChange={(value) => updateFormData({ activelySeekingToggle: value })}
          className="flex flex-col space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Actively Seeking" id="active" />
            <Label htmlFor="active" className="font-normal cursor-pointer">
              Actively Seeking
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Passive" id="passive" />
            <Label htmlFor="passive" className="font-normal cursor-pointer">
              Passive (Open to opportunities)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Not Looking" id="not-looking" />
            <Label htmlFor="not-looking" className="font-normal cursor-pointer">
              Not Looking
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  )
}
