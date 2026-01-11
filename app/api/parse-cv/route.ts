import { type NextRequest, NextResponse } from "next/server"
import { extractCVData } from "@/lib/cv-parser"
import mammoth from "mammoth"
import { createWorker } from "tesseract.js"
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs"
import { createCanvas } from "canvas"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    let extractedText = ""

    // Extract text based on file type
    if (file.type === "application/pdf") {
      try {
        const buffer = Buffer.from(await file.arrayBuffer())
        
        if (!buffer || buffer.length === 0) {
          throw new Error("PDF buffer is empty")
        }
        
        console.log("[CV Parser] PDF file received, size:", buffer.length, "bytes")
        
        // Disable worker for Node.js - pdfjs-dist can work without it
        // This avoids Turbopack module resolution issues
        // Note: Some versions of pdfjs-dist may still try to use a worker
        // If that fails, we'll catch the error and provide a helpful message
        pdfjsLib.GlobalWorkerOptions.workerSrc = ""
        
        console.log("[CV Parser] Loading PDF and converting pages to images for OCR...")
        
        // Load the PDF document
        // Wrap in try-catch to handle worker-related errors gracefully
        let pdfDocument
        try {
          const loadingTask = pdfjsLib.getDocument({
            data: new Uint8Array(buffer),
            verbosity: 0,
          })
          pdfDocument = await loadingTask.promise
        } catch (loadError: any) {
          // If loading fails due to worker issues, provide a helpful error
          if (loadError.message && loadError.message.includes("worker")) {
            throw new Error(
              "PDF parsing failed due to worker configuration. " +
              "This is a known issue with pdfjs-dist in Next.js. " +
              "Please try a different PDF file or contact support."
            )
          }
          throw loadError
        }
        
        const numPages = pdfDocument.numPages
        
        console.log("[CV Parser] PDF loaded, pages:", numPages)
        
        // Initialize Tesseract OCR worker
        console.log("[CV Parser] Initializing Tesseract OCR...")
        const tesseractWorker = await createWorker("eng")
        
        let fullText = ""
        
        // Process each page: convert to image, then OCR
        for (let pageNum = 1; pageNum <= numPages; pageNum++) {
          console.log(`[CV Parser] Processing page ${pageNum}/${numPages}...`)
          
          const page = await pdfDocument.getPage(pageNum)
          const viewport = page.getViewport({ scale: 2.0 }) // Higher scale for better OCR quality
          
          // Create canvas and render PDF page
          const canvas = createCanvas(viewport.width, viewport.height)
          const context = canvas.getContext("2d")
          
          // Render PDF page to canvas
          const renderContext = {
            canvasContext: context,
            viewport: viewport,
          }
          
          await page.render(renderContext).promise
          
          // Convert canvas to image buffer (PNG format)
          const imageBuffer = canvas.toBuffer("image/png")
          
          // Use Tesseract OCR to extract text from the image
          console.log(`[CV Parser] Running OCR on page ${pageNum}...`)
          const { data: { text } } = await tesseractWorker.recognize(imageBuffer)
          
          fullText += text + "\n\n"
          console.log(`[CV Parser] Page ${pageNum} OCR completed, extracted ${text.length} characters`)
          
          // Clean up page resources
          page.cleanup()
        }
        
        // Clean up PDF document
        await pdfDocument.destroy()
        
        // Terminate Tesseract worker
        await tesseractWorker.terminate()
        
        extractedText = fullText.trim()
        
        console.log("[CV Parser] PDF OCR completed successfully:", {
          textLength: extractedText.length,
          numPages: numPages,
          hasText: extractedText.length > 0,
        })
        
        if (!extractedText || extractedText.trim().length === 0) {
          console.warn("[CV Parser] Warning: OCR completed but extracted text is empty")
        }
      } catch (pdfError) {
        console.error("[CV Parser] Error parsing PDF with OCR:", pdfError)
        throw new Error(`Failed to parse PDF: ${pdfError instanceof Error ? pdfError.message : "Unknown error"}`)
      }
    } else if (
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.type === "application/msword"
    ) {
      const buffer = Buffer.from(await file.arrayBuffer())
      const result = await mammoth.extractRawText({ buffer })
      extractedText = result.value
    } else {
      // Try to read as plain text
      extractedText = await file.text()
    }

    if (!extractedText || extractedText.trim().length === 0) {
      return NextResponse.json(
        { error: "Could not extract text from the file. Please ensure the file is readable." },
        { status: 400 }
      )
    }

    // Use AI to extract structured data using Gemma3 via Hugging Face
    const extractedData = await extractCVData(extractedText)

    return NextResponse.json({ data: extractedData })
  } catch (error) {
    console.error("Error parsing CV:", error)
    return NextResponse.json(
      { 
        error: "Failed to parse CV",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}
