"use client"

import { useEffect, useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { TrendingUp, Plus, Save, Trash2, Pencil, X, GraduationCap } from "lucide-react"
import type { CandidateWorkExperience, CandidateEducation } from "@/types/candidate"

const MONTH_OPTIONS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

const CURRENT_YEAR = new Date().getFullYear()
const YEAR_OPTIONS = Array.from({ length: 50 }, (_, index) => `${CURRENT_YEAR - index}`)

/* Fixed colors for timeline item types */
const JOB_COLOR = "#1e40af"       // Blue for jobs
const EDUCATION_COLOR = "#8b5cf6"  // Purple for education

type TimelineEntry = {
  type: "job" | "education"
  label: string
  sublabel?: string
  startYear: string
  endYear: string
  isCurrent?: boolean
}

const createEmptyExperience = (): CandidateWorkExperience => ({
  companyName: "",
  role: "",
  startMonth: "",
  startYear: "",
  endMonth: "",
  endYear: "",
  description: "",
  isCurrent: false,
})

type CareerTimelineProps = {
  workExperiences: CandidateWorkExperience[]
  educations?: CandidateEducation[]
  isSaving?: boolean
  onSave: (experiences: CandidateWorkExperience[]) => Promise<void> | void
}

export default function CareerTimeline({
  workExperiences,
  educations = [],
  isSaving = false,
  onSave,
}: CareerTimelineProps) {
  const [items, setItems] = useState<CandidateWorkExperience[]>(workExperiences)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    setItems(workExperiences)
  }, [workExperiences])

  /* Build a unified timeline from both jobs and education entries */
  const timelineEntries = useMemo(() => {
    const entries: TimelineEntry[] = []

    // Add work experiences
    items
      .filter((exp) => exp.companyName && exp.startYear)
      .forEach((exp) => {
        entries.push({
          type: "job",
          label: exp.companyName,
          sublabel: exp.role || undefined,
          startYear: exp.startYear,
          endYear: exp.isCurrent ? "Now" : exp.endYear || "?",
          isCurrent: exp.isCurrent,
        })
      })

    // Add education entries
    educations
      .filter((edu) => (edu.institute || edu.degree) && edu.startYear)
      .forEach((edu) => {
        entries.push({
          type: "education",
          label: edu.institute || edu.degree,
          sublabel: edu.institute ? edu.degree : undefined,
          startYear: edu.startYear,
          endYear: edu.endYear || "?",
        })
      })

    // Sort newest-first
    entries.sort((a, b) => {
      const yearA = parseInt(a.startYear) || 0
      const yearB = parseInt(b.startYear) || 0
      return yearB - yearA
    })

    return entries
  }, [items, educations])

  const updateItem = (
    index: number,
    field: keyof CandidateWorkExperience,
    value: string | boolean,
  ) => {
    setItems((prev) =>
      prev.map((item, currentIndex) => {
        if (currentIndex !== index) return item
        const updated = { ...item, [field]: value }
        if (field === "isCurrent" && value === true) {
          updated.endMonth = ""
          updated.endYear = ""
        }
        return updated
      }),
    )
  }

  return (
    <Card className="rounded-2xl border border-gray-100 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          Career Progression
          <TrendingUp className="w-4 h-4 text-orange-400" />
        </CardTitle>
        <div className="flex items-center gap-3">
          {/* Legend */}
          <div className="hidden sm:flex items-center gap-3 mr-1">
            <span className="flex items-center gap-1 text-xs font-medium" style={{ color: JOB_COLOR }}>
              <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: JOB_COLOR }} />
              Job
            </span>
            <span className="flex items-center gap-1 text-xs font-medium" style={{ color: EDUCATION_COLOR }}>
              <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: EDUCATION_COLOR }} />
              Education
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full hover:bg-gray-100"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? <X className="w-4 h-4" /> : <Pencil className="w-4 h-4 text-gray-400" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {!isEditing ? (
          /* Visual Timeline View */
          <div className="space-y-0">
            {timelineEntries.length === 0 ? (
              <p className="text-sm text-gray-400 py-4">No career or education history added yet.</p>
            ) : (
              timelineEntries.map((entry, index) => {
                const color = entry.type === "education" ? EDUCATION_COLOR : JOB_COLOR
                const startYear = entry.startYear || "?"
                const endYear = entry.endYear

                return (
                  <div key={`${entry.type}-${entry.label}-${index}`} className="flex items-center gap-4 py-2.5 group">
                    {/* Year range */}
                    <span className="text-sm font-semibold w-[100px] text-right shrink-0" style={{ color }}>
                      {startYear} - {endYear}
                    </span>

                    {/* Dashed line */}
                    <div className="flex-1 relative h-[2px]">
                      <div
                        className="absolute inset-0 border-t-2 border-dashed"
                        style={{ borderColor: color, opacity: 0.5 }}
                      />
                    </div>

                    {/* Icon + name */}
                    <div className="flex items-center gap-2 shrink-0">
                      <div
                        className="w-5 h-5 rounded flex items-center justify-center"
                        style={{ backgroundColor: `${color}15` }}
                      >
                        {entry.type === "education" ? (
                          <GraduationCap className="w-3 h-3" style={{ color }} />
                        ) : (
                          <svg className="w-3 h-3" style={{ color }} fill="currentColor" viewBox="0 0 20 20">
                            <path d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm3 1h2v2H7V5zm4 0h2v2h-2V5zM7 9h2v2H7V9zm4 0h2v2h-2V9zm-4 4h2v2H7v-2zm4 0h2v2h-2v-2z" />
                          </svg>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium" style={{ color: entry.type === "education" ? EDUCATION_COLOR : "rgb(55 65 81)" }}>
                          {entry.label}
                        </span>
                        {entry.sublabel && (
                          <span className="text-xs text-gray-400">{entry.sublabel}</span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        ) : (
          /* Edit Mode — only work experiences, education is edited in its own card */
          <div className="space-y-4 pt-2">
            <p className="text-xs text-gray-400">Edit work experiences here. Education entries can be edited in the Education section below.</p>
            {items.map((item, index) => (
              <div key={`edit-${item.id || "new"}-${index}`} className="space-y-3 rounded-xl border border-gray-200 p-4 bg-gray-50/50">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-sm text-gray-700">Experience {index + 1}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setItems((prev) => prev.filter((_, i) => i !== index))}
                  >
                    <Trash2 className="h-3.5 w-3.5 text-gray-400" />
                  </Button>
                </div>

                <Input
                  value={item.companyName}
                  onChange={(e) => updateItem(index, "companyName", e.target.value)}
                  placeholder="Company name"
                  className="text-sm"
                />
                <Input
                  value={item.role}
                  onChange={(e) => updateItem(index, "role", e.target.value)}
                  placeholder="Role / Job title"
                  className="text-sm"
                />

                <div className="grid gap-3 md:grid-cols-2">
                  <Select value={item.startMonth} onValueChange={(value) => updateItem(index, "startMonth", value)}>
                    <SelectTrigger className="text-sm"><SelectValue placeholder="Start month" /></SelectTrigger>
                    <SelectContent>
                      {MONTH_OPTIONS.map((month) => (
                        <SelectItem key={month} value={month}>{month}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={item.startYear} onValueChange={(value) => updateItem(index, "startYear", value)}>
                    <SelectTrigger className="text-sm"><SelectValue placeholder="Start year" /></SelectTrigger>
                    <SelectContent>
                      {YEAR_OPTIONS.map((year) => (
                        <SelectItem key={year} value={year}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`current-work-${index}`}
                    checked={item.isCurrent}
                    onCheckedChange={(checked) => updateItem(index, "isCurrent", checked === true)}
                  />
                  <label htmlFor={`current-work-${index}`} className="text-xs font-medium text-gray-600">
                    I currently work here
                  </label>
                </div>

                {!item.isCurrent && (
                  <div className="grid gap-3 md:grid-cols-2">
                    <Select value={item.endMonth || ""} onValueChange={(value) => updateItem(index, "endMonth", value)}>
                      <SelectTrigger className="text-sm"><SelectValue placeholder="End month" /></SelectTrigger>
                      <SelectContent>
                        {MONTH_OPTIONS.map((month) => (
                          <SelectItem key={month} value={month}>{month}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={item.endYear || ""} onValueChange={(value) => updateItem(index, "endYear", value)}>
                      <SelectTrigger className="text-sm"><SelectValue placeholder="End year" /></SelectTrigger>
                      <SelectContent>
                        {YEAR_OPTIONS.map((year) => (
                          <SelectItem key={year} value={year}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <Textarea
                  value={item.description || ""}
                  onChange={(e) => updateItem(index, "description", e.target.value)}
                  placeholder="Describe your responsibilities and achievements"
                  rows={3}
                  className="text-sm"
                />
              </div>
            ))}

            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setItems((prev) => [...prev, createEmptyExperience()])}>
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                Add Experience
              </Button>
              <Button size="sm" onClick={() => { void onSave(items); setIsEditing(false) }} disabled={isSaving}>
                <Save className="mr-1.5 h-3.5 w-3.5" />
                {isSaving ? "Saving..." : "Save All"}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
