"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Building2, MapPin, Save, Pencil, X } from "lucide-react"
import type { Candidate } from "@/types/candidate"

const WORK_MODE_OPTIONS = ["Onsite", "Hybrid", "Remote"]
const EMPLOYMENT_TYPE_OPTIONS = ["Permanent", "Contract", "Part-time", "Internship", "Freelance"]

type CurrentStatusProps = {
  candidate: Candidate
  isSaving?: boolean
  onSave: (payload: Partial<Candidate>) => Promise<void> | void
}

export default function CurrentStatus({ candidate, isSaving = false, onSave }: CurrentStatusProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState({
    preferred_role: candidate.preferred_role || "",
    seniority_level: candidate.seniority_level || "",
    work_mode: candidate.work_mode || "Hybrid",
    notice_period: candidate.notice_period || "",
    actively_seeking_toggle: candidate.actively_seeking_toggle || "Passive",
    employment_type: candidate.employment_type || "",
  })

  useEffect(() => {
    setDraft({
      preferred_role: candidate.preferred_role || "",
      seniority_level: candidate.seniority_level || "",
      work_mode: candidate.work_mode || "Hybrid",
      notice_period: candidate.notice_period || "",
      actively_seeking_toggle: candidate.actively_seeking_toggle || "Passive",
      employment_type: candidate.employment_type || "",
    })
  }, [candidate])

  const currentCompany = useMemo(
    () => candidate.work_experiences?.find((item) => item.isCurrent) || candidate.work_experiences?.[0],
    [candidate.work_experiences],
  )

  const companyInitial = (currentCompany?.companyName || "C").charAt(0).toUpperCase()

  return (
    <Card className="rounded-2xl border border-gray-100 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Building2 className="w-5 h-5 text-[#1e40af]" />
          Current Professional Status
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
          <div className="flex items-center gap-4 p-3 bg-gray-50/80 rounded-xl">
            <Avatar className="w-12 h-12">
              <AvatarFallback className="bg-gradient-to-br from-[#a855f7] to-[#6366f1] text-white text-lg font-bold">
                {companyInitial}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-base text-gray-900">
                {currentCompany?.role || draft.preferred_role || "Not specified"}
              </h3>
              <p className="text-sm text-gray-500">
                {currentCompany?.companyName || "No current company"}
              </p>
              <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3" />
                {candidate.current_location || "Location not set"}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 pt-1">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-600">Preferred Role</Label>
                <Input
                  value={draft.preferred_role}
                  onChange={(e) => setDraft((prev) => ({ ...prev, preferred_role: e.target.value }))}
                  placeholder="Preferred role"
                  className="text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-600">Seniority Level</Label>
                <Input
                  value={draft.seniority_level}
                  onChange={(e) => setDraft((prev) => ({ ...prev, seniority_level: e.target.value }))}
                  placeholder="e.g. Senior, Lead, Manager"
                  className="text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-600">Work Mode</Label>
                <Select
                  value={draft.work_mode}
                  onValueChange={(value) => setDraft((prev) => ({ ...prev, work_mode: value }))}
                >
                  <SelectTrigger className="text-sm"><SelectValue placeholder="Select work mode" /></SelectTrigger>
                  <SelectContent>
                    {WORK_MODE_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-600">Employment Type</Label>
                <Select
                  value={draft.employment_type}
                  onValueChange={(value) => setDraft((prev) => ({ ...prev, employment_type: value }))}
                >
                  <SelectTrigger className="text-sm"><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    {EMPLOYMENT_TYPE_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-600">Notice Period</Label>
                <Input
                  value={draft.notice_period}
                  onChange={(e) => setDraft((prev) => ({ ...prev, notice_period: e.target.value }))}
                  placeholder="e.g. 30 days"
                  className="text-sm"
                />
              </div>
            </div>
            <Button
              size="sm"
              onClick={() => { void onSave(draft); setIsEditing(false) }}
              disabled={isSaving}
            >
              <Save className="mr-1.5 h-3.5 w-3.5" />
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
