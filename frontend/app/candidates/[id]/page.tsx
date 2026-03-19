import { notFound } from "next/navigation"
import type { Candidate } from "@/types/candidate"
import { apiClient } from "@/lib/api-client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, Mail, Phone, MapPin, Briefcase, GraduationCap, FileText, ExternalLink, User } from "lucide-react"

type Props = {
  // Next may pass `params` as a plain object or a Promise that resolves to the object.
  params: { id: string } | Promise<{ id: string }>
}

export default async function CandidatePage({ params }: Props) {
  // `params` can be a Promise in some Next.js configurations; await it to unwrap.
  const { id } = await params
  
  try {
    const result = await apiClient.getCandidate(id)
    const candidate = result.candidate as Candidate
    
    if (!candidate) {
      notFound()
    }

    const statusColors: Record<string, string> = {
      submitted: "bg-blue-500",
      reviewed: "bg-yellow-500",
      shortlisted: "bg-green-500",
      rejected: "bg-red-500",
    }

    return (
      <div className="min-h-screen bg-background py-8 px-4">
        <div className="mx-auto max-w-6xl space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground">Candidate Dashboard</h1>
              <p className="text-muted-foreground mt-2">Welcome back, {candidate.name}</p>
            </div>
            <Badge 
              className={`${statusColors[candidate.application_status || 'submitted'] || 'bg-gray-500'} text-white`}
            >
              {candidate.application_status || 'submitted'}
            </Badge>
          </div>

          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Application Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Your application has been successfully submitted and is under review. 
                Our recruitment team will get back to you soon.
              </p>
              {candidate.profile_completion_percentage && (
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Profile Completion</span>
                    <span>{candidate.profile_completion_percentage}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${candidate.profile_completion_percentage}%` }}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{candidate.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">Mobile</p>
                    <p className="font-medium">{candidate.mobile_number}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium">{candidate.current_location}</p>
                  </div>
                </div>
                {candidate.nationality && (
                  <div>
                    <p className="text-sm text-muted-foreground">Nationality</p>
                    <p className="font-medium">{candidate.nationality}</p>
                  </div>
                )}
                {candidate.gender && (
                  <div>
                    <p className="text-sm text-muted-foreground">Gender</p>
                    <p className="font-medium">{candidate.gender}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Professional Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Professional Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {candidate.skills && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {candidate.skills.split(',').map((skill, idx) => (
                        <Badge key={idx} variant="secondary">{skill.trim()}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {candidate.experience && (
                  <div>
                    <p className="text-sm text-muted-foreground">Experience</p>
                    <p className="font-medium">{candidate.experience}</p>
                  </div>
                )}
                {candidate.preferred_location && (
                  <div>
                    <p className="text-sm text-muted-foreground">Preferred Location</p>
                    <p className="font-medium">{candidate.preferred_location}</p>
                  </div>
                )}
                {candidate.preferred_role && (
                  <div>
                    <p className="text-sm text-muted-foreground">Preferred Role</p>
                    <p className="font-medium">{candidate.preferred_role}</p>
                  </div>
                )}
                {candidate.work_mode && (
                  <div>
                    <p className="text-sm text-muted-foreground">Work Mode</p>
                    <p className="font-medium">{candidate.work_mode}</p>
                  </div>
                )}
                {candidate.notice_period && (
                  <div>
                    <p className="text-sm text-muted-foreground">Notice Period</p>
                    <p className="font-medium">{candidate.notice_period}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Salary Information */}
          {(candidate.current_salary_currency || candidate.expected_salary_currency) && (
            <Card>
              <CardHeader>
                <CardTitle>Salary Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {candidate.current_salary_currency && candidate.salary_range && (
                    <div>
                      <p className="text-sm text-muted-foreground">Current Salary</p>
                      <p className="font-medium">
                        {candidate.current_salary_currency} {candidate.salary_range}
                      </p>
                    </div>
                  )}
                  {candidate.expected_salary_currency && candidate.expected_salary_range && (
                    <div>
                      <p className="text-sm text-muted-foreground">Expected Salary</p>
                      <p className="font-medium">
                        {candidate.expected_salary_currency} {candidate.expected_salary_range}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Documents */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Documents
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {candidate.cv_url && (
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">CV / Resume</p>
                      <p className="text-sm text-muted-foreground">Uploaded document</p>
                    </div>
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <a href={candidate.cv_url} target="_blank" rel="noreferrer">
                      View <ExternalLink className="h-4 w-4 ml-2" />
                    </a>
                  </Button>
                </div>
              )}
              {candidate.photograph_url && (
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Photograph</p>
                      <p className="text-sm text-muted-foreground">Profile picture</p>
                    </div>
                  </div>
                  <img 
                    src={candidate.photograph_url} 
                    alt={`${candidate.name} photo`} 
                    className="h-16 w-16 rounded-lg object-cover"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Additional Links */}
          {(candidate.linkedin_profile || candidate.portfolio) && (
            <Card>
              <CardHeader>
                <CardTitle>Additional Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {candidate.linkedin_profile && (
                  <Button asChild variant="outline" className="w-full justify-start">
                    <a href={candidate.linkedin_profile} target="_blank" rel="noreferrer">
                      LinkedIn Profile <ExternalLink className="h-4 w-4 ml-2" />
                    </a>
                  </Button>
                )}
                {candidate.portfolio && (
                  <Button asChild variant="outline" className="w-full justify-start">
                    <a href={candidate.portfolio} target="_blank" rel="noreferrer">
                      Portfolio <ExternalLink className="h-4 w-4 ml-2" />
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex gap-4">
            <Button asChild>
              <a href="/">Submit Another Application</a>
            </Button>
            <Button variant="outline" asChild>
              <a href={`/candidates/${id}/edit`}>Edit Application</a>
            </Button>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error fetching candidate:", error)
    notFound()
  }
}
