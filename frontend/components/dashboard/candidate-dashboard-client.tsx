"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/dashboard/sidebar"
import DashboardHeader from "@/components/dashboard/header"
import ProfileHeader from "@/components/dashboard/profile-header"
import CareerTimeline from "@/components/dashboard/career-timeline"
import SkillsSection from "@/components/dashboard/skills-section"
import CurrentStatus from "@/components/dashboard/current-status"
import EducationCard from "@/components/dashboard/education-card"
import RecommendedJobs from "@/components/dashboard/recommended-jobs"
import FloatingButton from "@/components/dashboard/floating-button"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api-client"
import type { Candidate, CandidateEducation, CandidateWorkExperience } from "@/types/candidate"

type SavePayload = Partial<Candidate> & {
  work_experiences?: CandidateWorkExperience[]
  educations?: CandidateEducation[]
}

export default function CandidateDashboardClient() {
  const router = useRouter()
  const { toast } = useToast()
  const [candidate, setCandidate] = useState<Candidate | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [savingSection, setSavingSection] = useState<string | null>(null)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  const getStoredToken = useCallback(() => {
    if (typeof window === "undefined") return null
    return localStorage.getItem("access_token") || localStorage.getItem("token")
  }, [])

  const loadCandidate = useCallback(async () => {
    const token = getStoredToken()
    if (!token) {
      router.push("/signin")
      return
    }

    try {
      const result = await apiClient.getMyCandidateProfile(token)
      setCandidate(result.candidate)
    } catch (error) {
      toast({
        title: "Unable to load dashboard",
        description: error instanceof Error ? error.message : "Please sign in again.",
        variant: "destructive",
      })
      router.push("/signin")
    } finally {
      setIsLoading(false)
    }
  }, [getStoredToken, router, toast])

  useEffect(() => {
    void loadCandidate()
  }, [loadCandidate])

  const saveSection = async (section: string, payload: SavePayload) => {
    const token = getStoredToken()
    if (!token) {
      router.push("/signin")
      return
    }

    setSavingSection(section)

    try {
      const result = await apiClient.updateMyCandidateProfile(token, payload)
      setCandidate(result.candidate)
      toast({
        title: "Saved",
        description: "Your profile has been updated.",
      })
    } catch (error) {
      toast({
        title: "Save failed",
        description: error instanceof Error ? error.message : "Could not update your profile.",
        variant: "destructive",
      })
    } finally {
      setSavingSection(null)
    }
  }

  const handleStatusChange = async (status: string) => {
    await saveSection("status", { actively_seeking_toggle: status })
  }

  const initials = useMemo(() => {
    if (!candidate?.name) return "CU"
    return candidate.name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() || "")
      .join("")
  }, [candidate?.name])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f9fc]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-400 font-medium">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!candidate) {
    return null
  }

  return (
    <div className="flex h-screen bg-[#f8f9fc]">
      {/* Left Sidebar */}
      <Sidebar
        candidate={candidate}
        initials={initials}
        onStatusChange={(status) => void handleStatusChange(status)}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <DashboardHeader
          candidateName={candidate.name}
          initials={initials}
          onMobileMenuToggle={() => setIsMobileSidebarOpen((prev) => !prev)}
        />

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-[1200px] mx-auto px-6 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
              {/* Center Column — Main Profile Content */}
              <div className="space-y-5 min-w-0">
                <ProfileHeader
                  candidate={candidate}
                  initials={initials}
                  isSaving={savingSection === "profile"}
                  onSave={(payload) => saveSection("profile", payload)}
                />
                <CareerTimeline
                  workExperiences={candidate.work_experiences || []}
                  educations={candidate.educations || []}
                  isSaving={savingSection === "experience"}
                  onSave={(work_experiences) => saveSection("experience", { work_experiences })}
                />
                <SkillsSection
                  skills={candidate.skills || ""}
                  isSaving={savingSection === "skills"}
                  onSave={(skills) => saveSection("skills", { skills })}
                />
                <CurrentStatus
                  candidate={candidate}
                  isSaving={savingSection === "status"}
                  onSave={(payload) => saveSection("status", payload)}
                />
                <EducationCard
                  educations={candidate.educations || []}
                  isSaving={savingSection === "education"}
                  onSave={(educations) => saveSection("education", { educations })}
                />
              </div>

              {/* Right Column — Recommended Jobs */}
              <div className="hidden lg:block">
                <div className="sticky top-6">
                  <RecommendedJobs
                    candidate={candidate}
                    isSaving={savingSection === "preferences"}
                    onSave={(payload) => saveSection("preferences", payload)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FloatingButton />
    </div>
  )
}
