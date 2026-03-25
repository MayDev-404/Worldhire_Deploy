"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Save, Pencil, X } from "lucide-react"

type SkillsSectionProps = {
  skills: string
  isSaving?: boolean
  onSave: (skills: string) => Promise<void> | void
}

export default function SkillsSection({ skills, isSaving = false, onSave }: SkillsSectionProps) {
  const [draftSkills, setDraftSkills] = useState(skills)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    setDraftSkills(skills)
  }, [skills])

  const parsedSkills = useMemo(
    () =>
      draftSkills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
    [draftSkills],
  )

  // First half = Top Skills, Second half = Key Competencies
  const topSkills = parsedSkills.slice(0, Math.ceil(parsedSkills.length / 2))
  const competencies = parsedSkills.slice(Math.ceil(parsedSkills.length / 2))

  return (
    <div className="space-y-4">
      {/* Top Skills */}
      <Card className="rounded-2xl border border-gray-100 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-lg font-bold flex items-center gap-1">
            Top Skills<span className="text-blue-500">✦</span>
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
          {isEditing ? (
            <div className="space-y-3">
              <Textarea
                value={draftSkills}
                onChange={(e) => setDraftSkills(e.target.value)}
                placeholder="Add comma-separated skills (e.g. React, TypeScript, Leadership)"
                rows={3}
                className="text-sm"
              />
              <Button
                size="sm"
                onClick={() => { void onSave(draftSkills); setIsEditing(false) }}
                disabled={isSaving}
              >
                <Save className="mr-1.5 h-3.5 w-3.5" />
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {topSkills.length > 0 ? (
                topSkills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-primary to-[#6366f1] text-white shadow-sm"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-sm text-gray-400">No skills added yet.</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Key Competencies */}
      <Card className="rounded-2xl border border-gray-100 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold flex items-center gap-1">
            Key Competencies<span className="text-orange-400">✦</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {competencies.length > 0 ? (
              competencies.map((competency) => (
                <span
                  key={competency}
                  className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-[#ef4444] to-[#f97316] text-white shadow-sm"
                >
                  {competency}
                </span>
              ))
            ) : topSkills.length > 0 ? (
              /* Fallback: show all skills as competencies if there are few */
              topSkills.slice(0, 4).map((competency) => (
                <span
                  key={competency}
                  className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-[#ef4444] to-[#f97316] text-white shadow-sm"
                >
                  {competency}
                </span>
              ))
            ) : (
              <p className="text-sm text-gray-400">Add skills to generate competencies.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
