"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Settings, Pencil, Save, X } from "lucide-react"
import type { Candidate } from "@/types/candidate"

type ProfileHeaderProps = {
  candidate: Candidate
  initials: string
  isSaving?: boolean
  onSave: (payload: Partial<Candidate>) => Promise<void> | void
}

export default function ProfileHeader({ candidate, initials, isSaving = false, onSave }: ProfileHeaderProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState({
    name: candidate.name || "",
    current_location: candidate.current_location || "",
    preferred_location: candidate.preferred_location || "",
  })

  useEffect(() => {
    setDraft({
      name: candidate.name || "",
      current_location: candidate.current_location || "",
      preferred_location: candidate.preferred_location || "",
    })
  }, [candidate])

  const handleSave = async () => {
    await onSave(draft)
    setIsEditing(false)
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100">
      {/* Gradient Banner */}
      <div className="h-36 bg-gradient-to-r from-[#1e40af] via-[#7c3aed] to-[#6366f1] relative">
        {/* Floating avatar inside banner */}
        <div className="absolute bottom-4 left-6">
          <Avatar className="h-20 w-20 border-4 border-white/30 shadow-xl">
            {candidate.photograph_url ? (
              <img src={candidate.photograph_url} alt={candidate.name} className="h-full w-full object-cover" />
            ) : (
              <AvatarFallback className="bg-white/20 text-white text-2xl font-bold backdrop-blur-sm">
                {initials}
              </AvatarFallback>
            )}
          </Avatar>
        </div>
      </div>

      {/* Name & actions below banner */}
      <div className="px-6 py-4">
        {isEditing ? (
          <div className="space-y-3">
            <Input
              value={draft.name}
              onChange={(e) => setDraft((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Full name"
              className="text-lg font-semibold"
            />
            <Input
              value={draft.current_location}
              onChange={(e) => setDraft((prev) => ({ ...prev, current_location: e.target.value }))}
              placeholder="Current location"
            />
            <Input
              value={draft.preferred_location}
              onChange={(e) => setDraft((prev) => ({ ...prev, preferred_location: e.target.value }))}
              placeholder="Preferred location"
            />
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsEditing(false)} disabled={isSaving}>
                <X className="mr-1.5 h-3.5 w-3.5" />
                Cancel
              </Button>
              <Button size="sm" onClick={() => void handleSave()} disabled={isSaving}>
                <Save className="mr-1.5 h-3.5 w-3.5" />
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{candidate.name}</h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                title="Settings"
              >
                <Settings className="w-4 h-4 text-gray-500" />
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                title="Edit profile"
              >
                <Pencil className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
