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
}

export async function extractCVData(cvText: string): Promise<ExtractedCVData> {
  // AI extraction disabled - return empty object
  // Users can manually fill in the form fields
  return {}
}
