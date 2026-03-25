"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { GraduationCap, Plus, Save, Trash2, Pencil, X } from "lucide-react"
import type { CandidateEducation } from "@/types/candidate"

const CURRENT_YEAR = new Date().getFullYear()
const YEAR_OPTIONS = Array.from({ length: 60 }, (_, index) => `${CURRENT_YEAR - index}`)

const createEmptyEducation = (): CandidateEducation => ({
  degree: "",
  institute: "",
  startYear: "",
  endYear: "",
})

type EducationCardProps = {
  educations: CandidateEducation[]
  isSaving?: boolean
  onSave: (educations: CandidateEducation[]) => Promise<void> | void
}

export default function EducationCard({
  educations,
  isSaving = false,
  onSave,
}: EducationCardProps) {
  const [items, setItems] = useState<CandidateEducation[]>(educations)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    setItems(educations)
  }, [educations])

  const updateItem = (index: number, field: keyof CandidateEducation, value: string) => {
    setItems((prev) =>
      prev.map((item, currentIndex) =>
        currentIndex === index ? { ...item, [field]: value } : item,
      ),
    )
  }

  return (
    <Card className="rounded-2xl border border-gray-100 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-primary" />
          Education
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full hover:bg-gray-100"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? <X className="w-4 h-4" /> : <Pencil className="w-4 h-4 text-gray-400" />}
        </Button>
      </CardHeader>
      <CardContent>
        {!isEditing ? (
          <div className="space-y-3">
            {items.length === 0 ? (
              <p className="text-sm text-gray-400">No education entries yet.</p>
            ) : (
              items.map((edu, index) => {
                const initial = (edu.institute || "U").charAt(0).toUpperCase()
                return (
                  <div key={`${edu.id || "edu"}-${index}`} className="flex items-center gap-4 p-3 bg-gray-50/80 rounded-xl">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-gradient-to-br from-[#a855f7] to-[#6366f1] text-white text-sm font-bold">
                        {initial}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-900">{edu.institute || "Institute not set"}</h4>
                      <p className="text-xs text-gray-500">{edu.degree || "Degree not set"}</p>
                      <p className="text-xs text-gray-400">
                        {edu.startYear || "?"} - {edu.endYear || "?"}
                      </p>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        ) : (
          <div className="space-y-4 pt-1">
            {items.map((education, index) => (
              <div key={`edit-${education.id || "new"}-${index}`} className="space-y-3 rounded-xl border border-gray-200 p-4 bg-gray-50/50">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-sm text-gray-700">Education {index + 1}</p>
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
                  value={education.institute}
                  onChange={(e) => updateItem(index, "institute", e.target.value)}
                  placeholder="Institute / University"
                  className="text-sm"
                />
                <Input
                  value={education.degree}
                  onChange={(e) => updateItem(index, "degree", e.target.value)}
                  placeholder="Degree (e.g. Master's in Computer Science)"
                  className="text-sm"
                />
                <div className="grid gap-3 md:grid-cols-2">
                  <Input
                    list={`start-year-options-${index}`}
                    value={education.startYear}
                    onChange={(e) => updateItem(index, "startYear", e.target.value)}
                    placeholder="Start year"
                    className="text-sm"
                  />
                  <datalist id={`start-year-options-${index}`}>
                    {YEAR_OPTIONS.map((year) => (
                      <option key={year} value={year} />
                    ))}
                  </datalist>
                  <Input
                    list={`end-year-options-${index}`}
                    value={education.endYear}
                    onChange={(e) => updateItem(index, "endYear", e.target.value)}
                    placeholder="End year"
                    className="text-sm"
                  />
                  <datalist id={`end-year-options-${index}`}>
                    {YEAR_OPTIONS.map((year) => (
                      <option key={year} value={year} />
                    ))}
                  </datalist>
                </div>
              </div>
            ))}

            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setItems((prev) => [...prev, createEmptyEducation()])}>
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                Add Education
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
