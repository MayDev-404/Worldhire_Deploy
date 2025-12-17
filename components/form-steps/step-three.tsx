"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { FormData, WorkExperience } from "../candidate-application-form"
import { Plus, Trash2 } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

type StepThreeProps = {
  formData: FormData
  updateFormData: (data: Partial<FormData>) => void
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: 50 }, (_, i) => CURRENT_YEAR - i)

const createEmptyExperience = (): WorkExperience => ({
  companyName: "",
  role: "",
  startMonth: "",
  startYear: "",
  endMonth: "",
  endYear: "",
  description: "",
  isCurrent: false,
})

export function StepThree({ formData, updateFormData }: StepThreeProps) {
  const workExperiences = formData.workExperiences || []

  const addExperience = () => {
    const newExperiences = [...workExperiences, createEmptyExperience()]
    updateFormData({ workExperiences: newExperiences })
  }

  const removeExperience = (index: number) => {
    const newExperiences = workExperiences.filter((_, i) => i !== index)
    updateFormData({ workExperiences: newExperiences })
  }

  const updateExperience = (index: number, field: keyof WorkExperience, value: string | boolean) => {
    const newExperiences = [...workExperiences]
    newExperiences[index] = { ...newExperiences[index], [field]: value }
    
    // If "isCurrent" is checked, clear end date
    if (field === "isCurrent" && value === true) {
      newExperiences[index].endMonth = ""
      newExperiences[index].endYear = ""
    }
    
    updateFormData({ workExperiences: newExperiences })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Work Experience</h3>
          <p className="text-sm text-muted-foreground">Add your work history, starting with your most recent position</p>
        </div>
        <Button type="button" onClick={addExperience} variant="outline" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Experience
        </Button>
      </div>

      {workExperiences.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No work experience added yet</p>
            <Button type="button" onClick={addExperience} variant="outline" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Your First Experience
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {workExperiences.map((experience, index) => (
            <Card key={index} className="border-2">
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-base">Experience #{index + 1}</h4>
                  <Button
                    type="button"
                    onClick={() => removeExperience(index)}
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {/* Company Name */}
                <div className="space-y-2">
                  <Label htmlFor={`company-${index}`} className="text-base">
                    Company Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id={`company-${index}`}
                    placeholder="e.g., Google, Microsoft, ABC Corp"
                    value={experience.companyName}
                    onChange={(e) => updateExperience(index, "companyName", e.target.value)}
                  />
                </div>

                {/* Role */}
                <div className="space-y-2">
                  <Label htmlFor={`role-${index}`} className="text-base">
                    Role / Job Title <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id={`role-${index}`}
                    placeholder="e.g., Software Engineer, Product Manager"
                    value={experience.role}
                    onChange={(e) => updateExperience(index, "role", e.target.value)}
                  />
                </div>

                {/* Start Date */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`startMonth-${index}`} className="text-base">
                      Start Month <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={experience.startMonth}
                      onValueChange={(value) => updateExperience(index, "startMonth", value)}
                    >
                      <SelectTrigger id={`startMonth-${index}`}>
                        <SelectValue placeholder="Select month" />
                      </SelectTrigger>
                      <SelectContent>
                        {MONTHS.map((month) => (
                          <SelectItem key={month} value={month}>
                            {month}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`startYear-${index}`} className="text-base">
                      Start Year <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={experience.startYear}
                      onValueChange={(value) => updateExperience(index, "startYear", value)}
                    >
                      <SelectTrigger id={`startYear-${index}`}>
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        {YEARS.map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Current Job Checkbox */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`current-${index}`}
                    checked={experience.isCurrent}
                    onCheckedChange={(checked) => updateExperience(index, "isCurrent", checked === true)}
                  />
                  <Label htmlFor={`current-${index}`} className="text-sm font-normal cursor-pointer">
                    I currently work here
                  </Label>
                </div>

                {/* End Date */}
                {!experience.isCurrent && (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`endMonth-${index}`} className="text-base">
                        End Month <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={experience.endMonth}
                        onValueChange={(value) => updateExperience(index, "endMonth", value)}
                      >
                        <SelectTrigger id={`endMonth-${index}`}>
                          <SelectValue placeholder="Select month" />
                        </SelectTrigger>
                        <SelectContent>
                          {MONTHS.map((month) => (
                            <SelectItem key={month} value={month}>
                              {month}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`endYear-${index}`} className="text-base">
                        End Year <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={experience.endYear}
                        onValueChange={(value) => updateExperience(index, "endYear", value)}
                      >
                        <SelectTrigger id={`endYear-${index}`}>
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          {YEARS.map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor={`description-${index}`} className="text-base">
                    Description <span className="text-muted-foreground">(Optional)</span>
                  </Label>
                  <Textarea
                    id={`description-${index}`}
                    placeholder="Describe your responsibilities, achievements, and key contributions..."
                    value={experience.description}
                    onChange={(e) => updateExperience(index, "description", e.target.value)}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
