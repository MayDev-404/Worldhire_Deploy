"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bookmark, Clock, DollarSign, MapPin, ChevronRight } from "lucide-react"
import type { Candidate } from "@/types/candidate"

type RecommendedJobsProps = {
  candidate: Candidate
  isSaving?: boolean
  onSave: (payload: Partial<Candidate>) => Promise<void> | void
}

// Generate job recommendations based on candidate's actual profile data
function generateRecommendations(candidate: Candidate) {
  const skills = (candidate.skills || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)

  const role = candidate.preferred_role || "Professional"
  const location = candidate.preferred_location || candidate.current_location || "Remote"
  const workMode = candidate.work_mode || "Hybrid"
  const salaryRange = candidate.expected_salary_range || candidate.salary_range || ""

  // Build dynamic job cards from candidate data
  const companies = [
    { name: "BYJU'S", color: "var(--primary)" },
    { name: "Meta", color: "#6366f1" },
    { name: "Google", color: "#22c55e" },
    { name: "Amazon", color: "#f59e0b" },
  ]

  const roleVariants = [
    `Senior ${role}`,
    role,
    `Lead ${role}`,
    `${role} Manager`,
  ]

  return companies.slice(0, 3).map((company, index) => {
    // Calculate a match percentage based on how many fields are filled
    const filledFields = [
      candidate.skills,
      candidate.preferred_role,
      candidate.experience,
      candidate.preferred_location,
      candidate.expected_salary_range,
      candidate.work_mode,
    ].filter(Boolean).length
    const baseMatch = 70 + filledFields * 4
    const matchPercent = Math.min(99, baseMatch - index * 7)

    // Pick relevant skills for this job
    const jobSkills = skills.slice(index, index + 3)
    if (jobSkills.length === 0) jobSkills.push(role)

    const daysAgo = index === 0 ? "2 days ago" : index === 1 ? "1 week ago" : "3 days ago"

    return {
      id: `rec-${index}`,
      title: roleVariants[index] || role,
      company: company.name,
      companyColor: company.color,
      location,
      workMode,
      salary: salaryRange,
      matchPercent,
      skills: jobSkills,
      daysAgo,
    }
  })
}

export default function RecommendedJobs({ candidate }: RecommendedJobsProps) {
  const recommendations = useMemo(() => generateRecommendations(candidate), [candidate])

  return (
    <Card className="rounded-2xl border border-gray-100 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base font-bold">Recommended Jobs</CardTitle>
        <button className="text-xs font-semibold text-primary hover:underline flex items-center gap-0.5">
          View All <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.map((job) => (
          <div key={job.id} className="border border-gray-100 rounded-xl p-3.5 space-y-3 hover:border-gray-200 transition-colors">
            {/* Header row */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2.5">
                <Avatar className="w-9 h-9 mt-0.5">
                  <AvatarFallback
                    className="text-white text-xs font-bold"
                    style={{ backgroundColor: job.companyColor }}
                  >
                    {job.company.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <h4 className="font-semibold text-sm text-gray-900 leading-tight">{job.title}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {job.company} • {job.location}
                  </p>
                  <p className="text-xs text-gray-400">{job.workMode}</p>
                </div>
              </div>
              <span className="shrink-0 text-[10px] font-bold text-[#22c55e] bg-green-50 px-2 py-0.5 rounded-full">
                {job.matchPercent}% Match
              </span>
            </div>

            {/* Salary + posted */}
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <DollarSign className="w-3 h-3" />
                {job.salary || "Competitive"}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {job.daysAgo}
              </span>
            </div>

            {/* Skills */}
            <div className="flex flex-wrap gap-1.5">
              {job.skills.map((skill) => (
                <span key={skill} className="text-[10px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                  {skill}
                </span>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-1">
              <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5 flex-1">
                <Bookmark className="w-3 h-3" />
                Save
              </Button>
              <Button size="sm" className="h-8 text-xs flex-1">
                Apply Now
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
