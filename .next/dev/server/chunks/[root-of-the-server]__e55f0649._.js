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
"[project]/lib/supabase/server.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getSupabaseAdminClient",
    ()=>getSupabaseAdminClient,
    "getSupabaseServerClient",
    ()=>getSupabaseServerClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/index.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/createServerClient.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$esm$2f$wrapper$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/esm/wrapper.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-route] (ecmascript)");
;
;
;
async function getSupabaseServerClient() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    const supabaseUrl = ("TURBOPACK compile-time value", "https://gvgiuapkzipnsczzymxs.supabase.co");
    const supabaseKey = ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2Z2l1YXBremlwbnNjenp5bXhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU2MTY4MzcsImV4cCI6MjA4MTE5MjgzN30.n6889M7O5X1GHajDJfdr6tlzLpekl90YozCLyDxlkBs");
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createServerClient"])(supabaseUrl, supabaseKey, {
        cookies: {
            getAll () {
                return cookieStore.getAll();
            },
            setAll (cookiesToSet) {
                try {
                    cookiesToSet.forEach(({ name, value, options })=>cookieStore.set(name, value, options));
                } catch  {
                // Ignore errors from middleware
                }
            }
        }
    });
}
function getSupabaseAdminClient() {
    const supabaseUrl = ("TURBOPACK compile-time value", "https://gvgiuapkzipnsczzymxs.supabase.co");
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2Z2l1YXBremlwbnNjenp5bXhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU2MTY4MzcsImV4cCI6MjA4MTE5MjgzN30.n6889M7O5X1GHajDJfdr6tlzLpekl90YozCLyDxlkBs");
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    // Use service role key if available, otherwise fall back to anon key
    // Service role key bypasses RLS policies
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$esm$2f$wrapper$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createClient"])(supabaseUrl, serviceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });
}
}),
"[project]/app/api/submit-application/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase/server.ts [app-route] (ecmascript)");
;
;
async function POST(request) {
    try {
        const formData = await request.formData();
        // Check Supabase configuration before proceeding
        const supabaseUrl = ("TURBOPACK compile-time value", "https://gvgiuapkzipnsczzymxs.supabase.co");
        const supabaseKey = ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2Z2l1YXBremlwbnNjenp5bXhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU2MTY4MzcsImV4cCI6MjA4MTE5MjgzN30.n6889M7O5X1GHajDJfdr6tlzLpekl90YozCLyDxlkBs");
        if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your-supabase') || supabaseKey.includes('your-supabase') || supabaseUrl === 'your-supabase-project-url' || supabaseKey === 'your-supabase-anon-key') {
            console.error("[v0] Supabase configuration error: Missing or placeholder credentials");
            console.error("[v0] URL:", ("TURBOPACK compile-time truthy", 1) ? "Set (but placeholder)" : "TURBOPACK unreachable");
            console.error("[v0] Key:", ("TURBOPACK compile-time truthy", 1) ? "Set (but placeholder)" : "TURBOPACK unreachable");
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Supabase credentials not configured",
                details: "Please update your .env.local file with your actual Supabase project URL and anon key. Get them from: https://app.supabase.com → Your Project → Settings → API"
            }, {
                status: 500
            });
        }
        // Use admin client for server-side operations (bypasses RLS)
        // This is safe because it's server-side only and never exposed to the client
        let supabase;
        try {
            // Try to use service role key first (bypasses RLS), fall back to regular client
            try {
                supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getSupabaseAdminClient"])();
                console.log("[v0] Using admin client (bypasses RLS)");
            } catch  {
                // Fall back to regular server client if service role key not available
                supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getSupabaseServerClient"])();
                console.log("[v0] Using regular server client");
            }
        } catch (supabaseError) {
            console.error("[v0] Supabase client creation error:", supabaseError);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Server configuration error. Please contact support.",
                details: supabaseError instanceof Error ? supabaseError.message : "Failed to initialize database connection"
            }, {
                status: 500
            });
        }
        // Extract files
        const cvFile = formData.get("cv");
        const photographFile = formData.get("photograph");
        let cvUrl = null;
        let photographUrl = null;
        // Upload CV to Supabase Storage (private bucket)
        if (cvFile) {
            const cvFileName = `${Date.now()}-${cvFile.name}`;
            const { data: cvData, error: cvError } = await supabase.storage.from("candidate-cvs").upload(cvFileName, cvFile);
            if (cvError) {
                console.error("[v0] CV upload error:", cvError);
            } else {
                // For private buckets, getPublicUrl() returns a URL that requires authentication to access
                // Authenticated recruiters can access CVs via this URL
                const { data: { publicUrl } } = supabase.storage.from("candidate-cvs").getPublicUrl(cvData.path);
                cvUrl = publicUrl;
            }
        }
        // Upload photograph to Supabase Storage
        if (photographFile) {
            const photoFileName = `${Date.now()}-${photographFile.name}`;
            const { data: photoData, error: photoError } = await supabase.storage.from("candidate-photos").upload(photoFileName, photographFile);
            if (photoError) {
                console.error("[v0] Photo upload error:", photoError);
            } else {
                const { data: { publicUrl } } = supabase.storage.from("candidate-photos").getPublicUrl(photoData.path);
                photographUrl = publicUrl;
            }
        }
        // Helper function to get form value or null if empty
        const getValue = (key)=>{
            const value = formData.get(key);
            return value && value.trim() !== "" ? value.trim() : null;
        };
        // Helper function to get required form value
        const getRequiredValue = (key, fieldName)=>{
            const value = formData.get(key);
            if (!value || value.trim() === "") {
                throw new Error(`${fieldName} is required`);
            }
            return value.trim();
        };
        // Validate required fields
        try {
            getRequiredValue("name", "Name");
            getRequiredValue("mobileNumber", "Mobile Number");
            getRequiredValue("email", "Email");
            getRequiredValue("currentLocation", "Current Location");
            getRequiredValue("currentSalaryCurrency", "Current Salary Currency");
            getRequiredValue("salaryRange", "Current Salary Range");
            getRequiredValue("nationality", "Nationality");
            getRequiredValue("gender", "Gender");
            getRequiredValue("preferredLocation", "Preferred Location");
            getRequiredValue("skills", "Skills");
            getRequiredValue("experience", "Experience");
            getRequiredValue("workHistory", "Work History");
            getRequiredValue("education", "Education");
            getRequiredValue("expectedSalaryCurrency", "Expected Salary Currency");
            getRequiredValue("expectedSalaryRange", "Expected Salary Range");
            getRequiredValue("workMode", "Work Mode");
            getRequiredValue("noticePeriod", "Notice Period");
            getRequiredValue("activelySeekingToggle", "Job Search Status");
        } catch (validationError) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: validationError instanceof Error ? validationError.message : "Validation failed"
            }, {
                status: 400
            });
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
            work_history: getRequiredValue("workHistory", "Work History"),
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
            profile_completion_percentage: 100
        };
        // Insert candidate into database
        console.log("[v0] Attempting to insert candidate data...");
        console.log("[v0] Candidate data keys:", Object.keys(candidateData));
        console.log("[v0] Required fields check:", {
            name: !!candidateData.name,
            email: !!candidateData.email,
            mobile_number: !!candidateData.mobile_number,
            preferred_location: !!candidateData.preferred_location,
            skills: !!candidateData.skills,
            work_mode: !!candidateData.work_mode,
            notice_period: !!candidateData.notice_period
        });
        const { data, error } = await supabase.from("candidates").insert(candidateData).select().single();
        if (error) {
            console.error("[v0] Database insert error:", error);
            console.error("[v0] Error code:", error.code);
            console.error("[v0] Error message:", error.message);
            console.error("[v0] Error details:", JSON.stringify(error, null, 2));
            console.error("[v0] Error hint:", error.hint);
            // Handle duplicate email error gracefully
            if (error.code === '23505' || error.message && error.message.includes('unique constraint')) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: "An application with this email already exists. Please use a different email address."
                }, {
                    status: 409
                });
            }
            // Handle NOT NULL constraint violations
            if (error.code === '23502' || error.message && error.message.includes('null value')) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: "Missing required fields. Please fill in all required information.",
                    details: error.message
                }, {
                    status: 400
                });
            }
            // Handle RLS (Row Level Security) policy violations
            if (error.code === '42501' || error.message && error.message.includes('row-level security')) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: "Database security policy error",
                    details: "Please run the SQL script '003_fix_rls_policies.sql' in your Supabase SQL Editor to fix the database permissions.",
                    hint: "The RLS policy needs to allow public inserts for the registration form"
                }, {
                    status: 500
                });
            }
            // Return detailed error for debugging
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Failed to submit application",
                details: error.message,
                code: error.code,
                hint: error.hint
            }, {
                status: 500
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            candidate: data
        }, {
            status: 200
        });
    } catch (error) {
        console.error("[v0] Application submission error:", error);
        console.error("[v0] Error stack:", error instanceof Error ? error.stack : "No stack trace");
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        // Check if it's a Supabase connection error
        if (errorMessage.includes("Missing Supabase") || errorMessage.includes("Supabase")) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Server configuration error. Please contact support.",
                details: "Database connection is not properly configured"
            }, {
                status: 500
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to process application",
            details: errorMessage,
            type: error instanceof Error ? error.constructor.name : typeof error
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__e55f0649._.js.map