import { HfInference } from "@huggingface/inference"

export async function parseCVFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const text = reader.result as string
      resolve(text)
    }
    reader.onerror = reject
    reader.readAsText(file)
  })
}

export interface ExtractedCVData {
  name?: string
  email?: string
  phone?: string
  location?: string
  nationality?: string
  skills?: string
  experience?: string
  education?: string
  workHistory?: string
  linkedinProfile?: string
  currentRole?: string
  preferredRole?: string
  // New fields for structured data
  workExperiences?: Array<{
    companyName: string
    role: string
    startMonth: string
    startYear: string
    endMonth?: string
    endYear?: string
    description?: string
    isCurrent: boolean
  }>
  educations?: Array<{
    degree: string
    institute: string
    startYear: string
    endYear: string
  }>
}

export async function extractCVData(cvText: string): Promise<ExtractedCVData> {
  const hfToken = process.env.HUGGINGFACE_API_KEY
  
  if (!hfToken) {
    console.warn("HUGGINGFACE_API_KEY not set, skipping AI extraction")
    return {}
  }

  try {
    const hf = new HfInference(hfToken)
    
    // Use Gemma model - try gemma-2b-it or gemma-7b-it
    // You can change this to other Gemma variants
    const model = process.env.HUGGINGFACE_MODEL || "google/gemma-2b-it"
    
    const prompt = `Extract the following information from this CV/resume text and return it as a JSON object. Only include fields that are present in the CV.

CV Text:
${cvText.substring(0, 3000)}${cvText.length > 3000 ? "... (truncated)" : ""}

Extract and return a JSON object with these fields (only include fields that exist):
{
  "name": "full name",
  "email": "email address",
  "phone": "phone number",
  "location": "current location/city",
  "nationality": "nationality",
  "skills": "comma-separated list of skills",
  "experience": "years of experience or experience summary",
  "education": "education summary",
  "workHistory": "brief work history summary",
  "linkedinProfile": "LinkedIn URL if present",
  "currentRole": "current job title",
  "preferredRole": "preferred role if mentioned",
  "workExperiences": [
    {
      "companyName": "company name",
      "role": "job title",
      "startMonth": "month name",
      "startYear": "year",
      "endMonth": "month name or empty if current",
      "endYear": "year or empty if current",
      "description": "job description",
      "isCurrent": true or false
    }
  ],
  "educations": [
    {
      "degree": "degree name",
      "institute": "institution name",
      "startYear": "year",
      "endYear": "year"
    }
  ]
}

Return ONLY valid JSON, no additional text or markdown formatting.`

    const response = await hf.textGeneration({
      model,
      inputs: prompt,
      parameters: {
        max_new_tokens: 2000,
        temperature: 0.3,
        return_full_text: false,
      },
    })

    // Extract JSON from response
    let responseText = response.generated_text.trim()
    
    // Remove markdown code blocks if present
    responseText = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim()
    
    // Try to find JSON object in the response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      responseText = jsonMatch[0]
    }

    let extractedData: ExtractedCVData
    try {
      extractedData = JSON.parse(responseText) as ExtractedCVData
    } catch (parseError) {
      console.error("Failed to parse JSON response from AI:", parseError)
      console.error("Response text:", responseText)
      // Return empty object if JSON parsing fails
      return {}
    }
    
    // Clean and validate the data
    return {
      name: extractedData.name?.trim(),
      email: extractedData.email?.trim(),
      phone: extractedData.phone?.trim(),
      location: extractedData.location?.trim(),
      nationality: extractedData.nationality?.trim(),
      skills: extractedData.skills?.trim(),
      experience: extractedData.experience?.trim(),
      education: extractedData.education?.trim(),
      workHistory: extractedData.workHistory?.trim(),
      linkedinProfile: extractedData.linkedinProfile?.trim(),
      currentRole: extractedData.currentRole?.trim(),
      preferredRole: extractedData.preferredRole?.trim(),
      workExperiences: extractedData.workExperiences?.filter(exp => 
        exp.companyName && exp.role && exp.startYear
      ),
      educations: extractedData.educations?.filter(edu => 
        edu.degree && edu.institute && edu.startYear && edu.endYear
      ),
    }
  } catch (error) {
    console.error("Error extracting CV data with AI:", error)
    // Return empty object on error - user can fill manually
    return {}
  }
}
