module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/lib/cv-parser.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "extractCVData",
    ()=>extractCVData,
    "parseCVFile",
    ()=>parseCVFile
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$huggingface$2f$inference$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@huggingface/inference/dist/esm/index.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$huggingface$2f$inference$2f$dist$2f$esm$2f$InferenceClient$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@huggingface/inference/dist/esm/InferenceClient.js [app-route] (ecmascript)");
;
async function parseCVFile(file) {
    return new Promise((resolve, reject)=>{
        const reader = new FileReader();
        reader.onload = ()=>{
            const text = reader.result;
            resolve(text);
        };
        reader.onerror = reject;
        reader.readAsText(file);
    });
}
async function extractCVData(cvText) {
    const hfToken = process.env.HUGGINGFACE_API_KEY;
    if (!hfToken) {
        console.warn("HUGGINGFACE_API_KEY not set, skipping AI extraction");
        return {};
    }
    try {
        const hf = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$huggingface$2f$inference$2f$dist$2f$esm$2f$InferenceClient$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HfInference"](hfToken);
        // Use Gemma model - try gemma-2b-it or gemma-7b-it
        // You can change this to other Gemma variants
        const model = process.env.HUGGINGFACE_MODEL || "google/gemma-2b-it";
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

Return ONLY valid JSON, no additional text or markdown formatting.`;
        const response = await hf.textGeneration({
            model,
            inputs: prompt,
            parameters: {
                max_new_tokens: 2000,
                temperature: 0.3,
                return_full_text: false
            }
        });
        // Extract JSON from response
        let responseText = response.generated_text.trim();
        // Remove markdown code blocks if present
        responseText = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        // Try to find JSON object in the response
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            responseText = jsonMatch[0];
        }
        let extractedData;
        try {
            extractedData = JSON.parse(responseText);
        } catch (parseError) {
            console.error("Failed to parse JSON response from AI:", parseError);
            console.error("Response text:", responseText);
            // Return empty object if JSON parsing fails
            return {};
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
            workExperiences: extractedData.workExperiences?.filter((exp)=>exp.companyName && exp.role && exp.startYear),
            educations: extractedData.educations?.filter((edu)=>edu.degree && edu.institute && edu.startYear && edu.endYear)
        };
    } catch (error) {
        console.error("Error extracting CV data with AI:", error);
        // Return empty object on error - user can fill manually
        return {};
    }
}
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/os [external] (os, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/worker_threads [external] (worker_threads, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("worker_threads", () => require("worker_threads"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/punycode [external] (punycode, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("punycode", () => require("punycode"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/module [external] (module, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("module", () => require("module"));

module.exports = mod;
}),
"[externals]/canvas [external] (canvas, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("canvas", () => require("canvas"));

module.exports = mod;
}),
"[project]/app/api/parse-cv/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$cv$2d$parser$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/cv-parser.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$mammoth$2f$lib$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/mammoth/lib/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tesseract$2e$js$2f$src$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/tesseract.js/src/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pdfjs$2d$dist$2f$legacy$2f$build$2f$pdf$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/pdfjs-dist/legacy/build/pdf.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$module__$5b$external$5d$__$28$module$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/module [external] (module, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$url__$5b$external$5d$__$28$url$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/url [external] (url, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$canvas__$5b$external$5d$__$28$canvas$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/canvas [external] (canvas, cjs)");
const __TURBOPACK__import$2e$meta__ = {
    get url () {
        return `file://${__turbopack_context__.P("app/api/parse-cv/route.ts")}`;
    }
};
;
;
;
;
;
;
;
;
const require = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$module__$5b$external$5d$__$28$module$2c$__cjs$29$__["createRequire"])(__TURBOPACK__import$2e$meta__.url);
// Configure worker for server-side (Node.js)
// In Next.js server-side, we can disable the worker or use a simpler approach
let workerConfigured = false;
async function configurePdfJsWorker() {
    if (workerConfigured) return;
    // For Next.js server-side, configure the worker properly
    // The worker file exists, we just need to set it up correctly
    try {
        // Get the absolute path to the worker file
        const workerPath = "[project]/node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs [app-route] (ecmascript)";
        // Convert to file:// URL for Node.js
        const workerUrl = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$url__$5b$external$5d$__$28$url$2c$__cjs$29$__["pathToFileURL"])(workerPath).href;
        // Set the worker source
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pdfjs$2d$dist$2f$legacy$2f$build$2f$pdf$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["GlobalWorkerOptions"].workerSrc = workerUrl;
        workerConfigured = true;
        console.log("[CV Parser] Worker configured with file path:", workerPath);
    } catch (error) {
        // If worker setup fails, we'll try to continue without it
        // This may cause issues, but it's better than failing completely
        console.error("[CV Parser] Failed to configure worker:", error);
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pdfjs$2d$dist$2f$legacy$2f$build$2f$pdf$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["GlobalWorkerOptions"].workerSrc = "";
        workerConfigured = true;
        console.log("[CV Parser] Continuing without worker (may cause issues)");
    }
}
async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file");
        if (!file) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "No file provided"
            }, {
                status: 400
            });
        }
        let extractedText = "";
        // Extract text based on file type
        if (file.type === "application/pdf") {
            try {
                const buffer = Buffer.from(await file.arrayBuffer());
                if (!buffer || buffer.length === 0) {
                    throw new Error("PDF buffer is empty");
                }
                console.log("[CV Parser] PDF file received, size:", buffer.length, "bytes");
                // Configure PDF.js worker
                await configurePdfJsWorker();
                console.log("[CV Parser] Loading PDF and converting pages to images for OCR...");
                // Load the PDF document with Node.js canvas factory
                const loadingTask = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pdfjs$2d$dist$2f$legacy$2f$build$2f$pdf$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getDocument"]({
                    data: new Uint8Array(buffer),
                    // Use Node.js canvas factory
                    verbosity: 0
                });
                const pdfDocument = await loadingTask.promise;
                const numPages = pdfDocument.numPages;
                console.log("[CV Parser] PDF loaded, pages:", numPages);
                // Initialize Tesseract OCR worker
                console.log("[CV Parser] Initializing Tesseract OCR...");
                const tesseractWorker = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tesseract$2e$js$2f$src$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createWorker"])("eng");
                let fullText = "";
                // Process each page: convert to image, then OCR
                for(let pageNum = 1; pageNum <= numPages; pageNum++){
                    console.log(`[CV Parser] Processing page ${pageNum}/${numPages}...`);
                    const page = await pdfDocument.getPage(pageNum);
                    const viewport = page.getViewport({
                        scale: 2.0
                    }) // Higher scale for better OCR quality
                    ;
                    // Create canvas and render PDF page
                    const canvas = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$canvas__$5b$external$5d$__$28$canvas$2c$__cjs$29$__["createCanvas"])(viewport.width, viewport.height);
                    const context = canvas.getContext("2d");
                    // Render PDF page to canvas
                    const renderContext = {
                        canvasContext: context,
                        viewport: viewport
                    };
                    await page.render(renderContext).promise;
                    // Convert canvas to image buffer (PNG format)
                    const imageBuffer = canvas.toBuffer("image/png");
                    // Use Tesseract OCR to extract text from the image
                    console.log(`[CV Parser] Running OCR on page ${pageNum}...`);
                    const { data: { text } } = await tesseractWorker.recognize(imageBuffer);
                    fullText += text + "\n\n";
                    console.log(`[CV Parser] Page ${pageNum} OCR completed, extracted ${text.length} characters`);
                    // Clean up page resources
                    page.cleanup();
                }
                // Clean up PDF document
                await pdfDocument.destroy();
                // Terminate Tesseract worker
                await tesseractWorker.terminate();
                extractedText = fullText.trim();
                console.log("[CV Parser] PDF OCR completed successfully:", {
                    textLength: extractedText.length,
                    numPages: numPages,
                    hasText: extractedText.length > 0
                });
                if (!extractedText || extractedText.trim().length === 0) {
                    console.warn("[CV Parser] Warning: OCR completed but extracted text is empty");
                }
            } catch (pdfError) {
                console.error("[CV Parser] Error parsing PDF with OCR:", pdfError);
                throw new Error(`Failed to parse PDF: ${pdfError instanceof Error ? pdfError.message : "Unknown error"}`);
            }
        } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || file.type === "application/msword") {
            const buffer = Buffer.from(await file.arrayBuffer());
            const result = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$mammoth$2f$lib$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].extractRawText({
                buffer
            });
            extractedText = result.value;
        } else {
            // Try to read as plain text
            extractedText = await file.text();
        }
        if (!extractedText || extractedText.trim().length === 0) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Could not extract text from the file. Please ensure the file is readable."
            }, {
                status: 400
            });
        }
        // Use AI to extract structured data using Gemma3 via Hugging Face
        const extractedData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$cv$2d$parser$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["extractCVData"])(extractedText);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            data: extractedData
        });
    } catch (error) {
        console.error("Error parsing CV:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to parse CV",
            details: error instanceof Error ? error.message : "Unknown error"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__dc6c7148._.js.map