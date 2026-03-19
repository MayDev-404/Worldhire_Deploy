"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { FormData, Education } from "../candidate-application-form"
import { Plus, Trash2 } from "lucide-react"

type StepFourProps = {
  formData: FormData
  updateFormData: (data: Partial<FormData>) => void
}

const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: 50 }, (_, i) => CURRENT_YEAR - i)

const createEmptyEducation = (): Education => ({
  degree: "",
  institute: "",
  startYear: "",
  endYear: "",
})

export function StepFour({ formData, updateFormData }: StepFourProps) {
  const educations = formData.educations || []

  const addEducation = () => {
    const newEducations = [...educations, createEmptyEducation()]
    updateFormData({ educations: newEducations })
  }

  const removeEducation = (index: number) => {
    const newEducations = educations.filter((_, i) => i !== index)
    updateFormData({ educations: newEducations })
  }

  const updateEducation = (index: number, field: keyof Education, value: string) => {
    const newEducations = [...educations]
    newEducations[index] = { ...newEducations[index], [field]: value }
    updateFormData({ educations: newEducations })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Education</h3>
          <p className="text-sm text-muted-foreground">Add your educational qualifications, starting with your highest degree</p>
        </div>
        <Button type="button" onClick={addEducation} variant="outline" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Education
        </Button>
      </div>

      {educations.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No education added yet</p>
            <Button type="button" onClick={addEducation} variant="outline" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Your First Education
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {educations.map((education, index) => (
            <Card key={index} className="border-2">
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-base">Education #{index + 1}</h4>
                  <Button
                    type="button"
                    onClick={() => removeEducation(index)}
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {/* Degree/Course */}
                <div className="space-y-2">
                  <Label htmlFor={`degree-${index}`} className="text-base">
                    Degree / Course <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id={`degree-${index}`}
                    placeholder="e.g., Bachelor of Science, Master of Business Administration"
                    value={education.degree}
                    onChange={(e) => updateEducation(index, "degree", e.target.value)}
                  />
                </div>

                {/* Institute */}
                <div className="space-y-2">
                  <Label htmlFor={`institute-${index}`} className="text-base">
                    Institute <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id={`institute-${index}`}
                    placeholder="e.g., Harvard University, MIT, Stanford University"
                    value={education.institute}
                    onChange={(e) => updateEducation(index, "institute", e.target.value)}
                  />
                </div>

                {/* Start Year & End Year */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`startYear-${index}`} className="text-base">
                      Start Year <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={education.startYear}
                      onValueChange={(value) => updateEducation(index, "startYear", value)}
                    >
                      <SelectTrigger id={`startYear-${index}`}>
                        <SelectValue placeholder="Select start year" />
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

                  <div className="space-y-2">
                    <Label htmlFor={`endYear-${index}`} className="text-base">
                      End Year <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={education.endYear}
                      onValueChange={(value) => updateEducation(index, "endYear", value)}
                    >
                      <SelectTrigger id={`endYear-${index}`}>
                        <SelectValue placeholder="Select end year" />
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
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

