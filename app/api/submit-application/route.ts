import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient, getSupabaseAdminClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    // Check Supabase configuration before proceeding
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseKey || 
        supabaseUrl.includes('your-supabase') || 
        supabaseKey.includes('your-supabase') ||
        supabaseUrl === 'your-supabase-project-url' ||
        supabaseKey === 'your-supabase-anon-key') {
      console.error("[v0] Supabase configuration error: Missing or placeholder credentials")
      console.error("[v0] URL:", supabaseUrl ? "Set (but placeholder)" : "Missing")
      console.error("[v0] Key:", supabaseKey ? "Set (but placeholder)" : "Missing")
      return NextResponse.json(
        { 
          error: "Supabase credentials not configured",
          details: "Please update your .env.local file with your actual Supabase project URL and anon key. Get them from: https://app.supabase.com → Your Project → Settings → API"
        },
        { status: 500 }
      )
    }
    
    // Use admin client for server-side operations (bypasses RLS)
    // This is safe because it's server-side only and never exposed to the client
    let supabase
    try {
      // Try to use service role key first (bypasses RLS), fall back to regular client
      try {
        supabase = getSupabaseAdminClient()
        console.log("[v0] Using admin client (bypasses RLS)")
      } catch {
        // Fall back to regular server client if service role key not available
        supabase = await getSupabaseServerClient()
        console.log("[v0] Using regular server client")
      }
    } catch (supabaseError) {
      console.error("[v0] Supabase client creation error:", supabaseError)
      return NextResponse.json(
        { 
          error: "Server configuration error. Please contact support.",
          details: supabaseError instanceof Error ? supabaseError.message : "Failed to initialize database connection"
        },
        { status: 500 }
      )
    }

    // Extract files
    const cvFile = formData.get("cv") as File | null
    const photographFile = formData.get("photograph") as File | null

    let cvUrl = null
    let photographUrl = null

    // Upload CV to Supabase Storage (private bucket)
    if (cvFile) {
      const cvFileName = `${Date.now()}-${cvFile.name}`
      const { data: cvData, error: cvError } = await supabase.storage.from("candidate-cvs").upload(cvFileName, cvFile)

      if (cvError) {
        console.error("[v0] CV upload error:", cvError)
      } else {
        // For private buckets, getPublicUrl() returns a URL that requires authentication to access
        // Authenticated recruiters can access CVs via this URL
        const {
          data: { publicUrl },
        } = supabase.storage.from("candidate-cvs").getPublicUrl(cvData.path)
        cvUrl = publicUrl
      }
    }

    // Upload photograph to Supabase Storage
    if (photographFile) {
      const photoFileName = `${Date.now()}-${photographFile.name}`
      const { data: photoData, error: photoError } = await supabase.storage
        .from("candidate-photos")
        .upload(photoFileName, photographFile)

      if (photoError) {
        console.error("[v0] Photo upload error:", photoError)
      } else {
        const {
          data: { publicUrl },
        } = supabase.storage.from("candidate-photos").getPublicUrl(photoData.path)
        photographUrl = publicUrl
      }
    }

    // Helper function to get form value or null if empty
    const getValue = (key: string): string | null => {
      const value = formData.get(key) as string
      return value && value.trim() !== "" ? value.trim() : null
    }

    // Helper function to get required form value
    const getRequiredValue = (key: string, fieldName: string): string => {
      const value = formData.get(key) as string
      if (!value || value.trim() === "") {
        throw new Error(`${fieldName} is required`)
      }
      return value.trim()
    }

    // Validate required fields
    try {
      getRequiredValue("name", "Name")
      getRequiredValue("mobileNumber", "Mobile Number")
      getRequiredValue("email", "Email")
      getRequiredValue("currentLocation", "Current Location")
      getRequiredValue("currentSalaryCurrency", "Current Salary Currency")
      getRequiredValue("salaryRange", "Current Salary Range")
      getRequiredValue("nationality", "Nationality")
      getRequiredValue("gender", "Gender")
      getRequiredValue("preferredLocation", "Preferred Location")
      getRequiredValue("skills", "Skills")
      getRequiredValue("experience", "Experience")
      getRequiredValue("education", "Education")
      getRequiredValue("expectedSalaryCurrency", "Expected Salary Currency")
      getRequiredValue("expectedSalaryRange", "Expected Salary Range")
      getRequiredValue("workMode", "Work Mode")
      getRequiredValue("noticePeriod", "Notice Period")
      getRequiredValue("activelySeekingToggle", "Job Search Status")
    } catch (validationError) {
      return NextResponse.json(
        { error: validationError instanceof Error ? validationError.message : "Validation failed" },
        { status: 400 }
      )
    }

    // Prepare candidate data - convert empty strings to null for optional fields
    const candidateData = {
      name: getRequiredValue("name", "Name"),
      mobile_number: getRequiredValue("mobileNumber", "Mobile Number"),
      email: getRequiredValue("email", "Email"),
      current_location: getRequiredValue("currentLocation", "Current Location"),
      current_salary_currency: getRequiredValue("currentSalaryCurrency", "Current Salary Currency"),
      salary_range: getRequiredValue("salaryRange", "Current Salary Range"),
      nationality: getRequiredValue("nationality", "Nationality"),
      gender: getRequiredValue("gender", "Gender"),
      cv_url: cvUrl,
      photograph_url: photographUrl,
      seniority_level: getValue("seniorityLevel"),
      reporting_manager: getValue("reportingManager"),
      preferred_location: getRequiredValue("preferredLocation", "Preferred Location"),
      skills: getRequiredValue("skills", "Skills"),
      experience: getRequiredValue("experience", "Experience"),
      education: getRequiredValue("education", "Education"),
      expected_salary_currency: getRequiredValue("expectedSalaryCurrency", "Expected Salary Currency"),
      expected_salary_range: getRequiredValue("expectedSalaryRange", "Expected Salary Range"),
      linkedin_profile: getValue("linkedinProfile"),
      portfolio: getValue("portfolio"),
      preferred_role: getValue("preferredRole"),
      work_permit_status: getValue("workPermitStatus") || "Nationality basis",
      employment_type: getValue("employmentType") || "Permanent",
      work_mode: getRequiredValue("workMode", "Work Mode"),
      references: getValue("references"),
      notice_period: getRequiredValue("noticePeriod", "Notice Period"),
      actively_seeking_toggle: getRequiredValue("activelySeekingToggle", "Job Search Status"),
      application_status: "submitted",
      profile_completion_percentage: 100,
    }

    // Insert candidate into database
    console.log("[v0] Attempting to insert candidate data...")
    console.log("[v0] Candidate data keys:", Object.keys(candidateData))
    console.log("[v0] Required fields check:", {
      name: !!candidateData.name,
      email: !!candidateData.email,
      mobile_number: !!candidateData.mobile_number,
      preferred_location: !!candidateData.preferred_location,
      skills: !!candidateData.skills,
      work_mode: !!candidateData.work_mode,
      notice_period: !!candidateData.notice_period,
    })
    
    const { data, error } = await supabase.from("candidates").insert(candidateData).select().single()

    if (error) {
      console.error("[v0] Database insert error:", error)
      console.error("[v0] Error code:", error.code)
      console.error("[v0] Error message:", error.message)
      console.error("[v0] Error details:", JSON.stringify(error, null, 2))
      console.error("[v0] Error hint:", error.hint)
      
      // Handle duplicate email error gracefully
      if (error.code === '23505' || (error.message && error.message.includes('unique constraint'))) {
        return NextResponse.json(
          { error: "An application with this email already exists. Please use a different email address." },
          { status: 409 }
        )
      }
      
      // Handle NOT NULL constraint violations
      if (error.code === '23502' || (error.message && error.message.includes('null value'))) {
        return NextResponse.json(
          { error: "Missing required fields. Please fill in all required information.", details: error.message },
          { status: 400 }
        )
      }
      
      // Handle RLS (Row Level Security) policy violations
      if (error.code === '42501' || (error.message && error.message.includes('row-level security'))) {
        return NextResponse.json(
          { 
            error: "Database security policy error",
            details: "Please run the SQL script '003_fix_rls_policies.sql' in your Supabase SQL Editor to fix the database permissions.",
            hint: "The RLS policy needs to allow public inserts for the registration form"
          },
          { status: 500 }
        )
      }
      
      // Return detailed error for debugging
      return NextResponse.json(
        { 
          error: "Failed to submit application", 
          details: error.message,
          code: error.code,
          hint: error.hint 
        }, 
        { status: 500 }
      )
    }

    // Parse and insert work experiences
    const workExperiencesJson = formData.get("workExperiences") as string
    if (workExperiencesJson) {
      try {
        const workExperiences = JSON.parse(workExperiencesJson) as Array<{
          companyName: string
          role: string
          startMonth: string
          startYear: string
          endMonth: string
          endYear: string
          description: string
          isCurrent: boolean
        }>

        if (workExperiences.length > 0 && data?.id) {
          const experiencesToInsert = workExperiences.map((exp) => ({
            candidate_id: data.id,
            company_name: exp.companyName,
            role: exp.role,
            start_month: exp.startMonth,
            start_year: exp.startYear,
            end_month: exp.isCurrent ? null : exp.endMonth,
            end_year: exp.isCurrent ? null : exp.endYear,
            description: exp.description || null,
            is_current: exp.isCurrent,
          }))

          const { error: expError } = await supabase
            .from("work_experiences")
            .insert(experiencesToInsert)

          if (expError) {
            console.error("[v0] Work experiences insert error:", expError)
            // Don't fail the whole submission if work experiences fail
            // Just log the error
          }
        }
      } catch (parseError) {
        console.error("[v0] Failed to parse work experiences:", parseError)
        // Don't fail the whole submission
      }
    }

    return NextResponse.json({ success: true, candidate: data }, { status: 200 })
  } catch (error) {
    console.error("[v0] Application submission error:", error)
    console.error("[v0] Error stack:", error instanceof Error ? error.stack : "No stack trace")
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
    
    // Check if it's a Supabase connection error
    if (errorMessage.includes("Missing Supabase") || errorMessage.includes("Supabase")) {
      return NextResponse.json(
        { 
          error: "Server configuration error. Please contact support.",
          details: "Database connection is not properly configured"
        },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { 
        error: "Failed to process application",
        details: errorMessage,
        type: error instanceof Error ? error.constructor.name : typeof error
      }, 
      { status: 500 }
    )
  }
}
