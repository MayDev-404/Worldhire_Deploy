// CV parsing feature disabled
// import { type NextRequest, NextResponse } from "next/server"
// import { extractCVData } from "@/lib/cv-parser"
// import mammoth from "mammoth"
// import pdf from "pdf-parse"

// export async function POST(request: NextRequest) {
//   try {
//     const formData = await request.formData()
//     const file = formData.get("file") as File

//     if (!file) {
//       return NextResponse.json({ error: "No file provided" }, { status: 400 })
//     }

//     let extractedText = ""

//     // Extract text based on file type
//     if (file.type === "application/pdf") {
//       const buffer = Buffer.from(await file.arrayBuffer())
//       const data = await pdf(buffer)
//       extractedText = data.text
//     } else if (
//       file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
//       file.type === "application/msword"
//     ) {
//       const buffer = Buffer.from(await file.arrayBuffer())
//       const result = await mammoth.extractRawText({ buffer })
//       extractedText = result.value
//     } else {
//       // Try to read as plain text
//       extractedText = await file.text()
//     }

//     // Use AI to extract structured data
//     const extractedData = await extractCVData(extractedText)

//     return NextResponse.json({ data: extractedData })
//   } catch (error) {
//     console.error("Error parsing CV:", error)
//     return NextResponse.json({ error: "Failed to parse CV" }, { status: 500 })
//   }
// }

// Return a disabled response
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  return NextResponse.json({ error: "CV parsing feature is disabled" }, { status: 503 })
}
