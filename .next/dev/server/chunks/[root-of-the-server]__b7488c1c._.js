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
"[project]/app/api/candidates/[id]/update/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PATCH",
    ()=>PATCH
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase/server.ts [app-route] (ecmascript)");
;
;
async function PATCH(request, { params }) {
    try {
        const { id } = await params;
        const formData = await request.formData();
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getSupabaseAdminClient"])();
        // Extract files
        const cvFile = formData.get("cv");
        const photographFile = formData.get("photograph");
        let cvUrl = undefined;
        let photographUrl = undefined;
        // Upload CV to Supabase Storage if a new file is provided
        if (cvFile && cvFile.size > 0) {
            const cvFileName = `${Date.now()}-${cvFile.name}`;
            const { data: cvData, error: cvError } = await supabase.storage.from("candidate-cvs").upload(cvFileName, cvFile);
            if (cvError) {
                console.error("[Update] CV upload error:", cvError);
            } else {
                const { data: { publicUrl } } = supabase.storage.from("candidate-cvs").getPublicUrl(cvData.path);
                cvUrl = publicUrl;
            }
        }
        // Upload photograph to Supabase Storage if a new file is provided
        if (photographFile && photographFile.size > 0) {
            const photoFileName = `${Date.now()}-${photographFile.name}`;
            const { data: photoData, error: photoError } = await supabase.storage.from("candidate-photos").upload(photoFileName, photographFile);
            if (photoError) {
                console.error("[Update] Photo upload error:", photoError);
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
        // Prepare candidate update data - only update fields that are provided
        // Name and email are NOT updated (they're protected)
        const candidateUpdateData = {
            mobile_number: getValue("mobileNumber"),
            current_location: getValue("currentLocation"),
            current_salary_currency: getValue("currentSalaryCurrency"),
            salary_range: getValue("salaryRange"),
            nationality: getValue("nationality"),
            gender: getValue("gender"),
            seniority_level: getValue("seniorityLevel"),
            reporting_manager: getValue("reportingManager"),
            preferred_location: getValue("preferredLocation"),
            skills: getValue("skills"),
            experience: getValue("experience"),
            expected_salary_currency: getValue("expectedSalaryCurrency"),
            expected_salary_range: getValue("expectedSalaryRange"),
            linkedin_profile: getValue("linkedinProfile"),
            portfolio: getValue("portfolio"),
            preferred_role: getValue("preferredRole"),
            work_permit_status: getValue("workPermitStatus") || "Nationality basis",
            employment_type: getValue("employmentType") || "Permanent",
            work_mode: getValue("workMode"),
            references: getValue("references"),
            notice_period: getValue("noticePeriod"),
            actively_seeking_toggle: getValue("activelySeekingToggle"),
            updated_at: new Date().toISOString()
        };
        // Only include file URLs if new files were uploaded
        if (cvUrl !== undefined) {
            candidateUpdateData.cv_url = cvUrl;
        }
        if (photographUrl !== undefined) {
            candidateUpdateData.photograph_url = photographUrl;
        }
        // Remove undefined values
        Object.keys(candidateUpdateData).forEach((key)=>candidateUpdateData[key] === undefined && delete candidateUpdateData[key]);
        // Update candidate in database
        const { data: updatedCandidate, error: updateError } = await supabase.from("candidates").update(candidateUpdateData).eq("id", id).select().single();
        if (updateError) {
            console.error("[Update] Database update error:", updateError);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Failed to update candidate",
                details: updateError.message
            }, {
                status: 500
            });
        }
        // Parse and update work experiences
        const workExperiencesJson = formData.get("workExperiences");
        if (workExperiencesJson) {
            try {
                const workExperiences = JSON.parse(workExperiencesJson);
                // Delete existing work experiences for this candidate
                await supabase.from("work_experiences").delete().eq("candidate_id", id);
                // Insert updated work experiences
                if (workExperiences.length > 0) {
                    const experiencesToInsert = workExperiences.map((exp, index)=>({
                            candidate_id: id,
                            company_name: exp.companyName,
                            role: exp.role,
                            start_month: exp.startMonth,
                            start_year: exp.startYear,
                            end_month: exp.isCurrent ? null : exp.endMonth,
                            end_year: exp.isCurrent ? null : exp.endYear,
                            description: exp.description || null,
                            is_current: exp.isCurrent,
                            display_order: index
                        }));
                    const { error: expError } = await supabase.from("work_experiences").insert(experiencesToInsert);
                    if (expError) {
                        console.error("[Update] Work experiences update error:", expError);
                    // Don't fail the whole update if work experiences fail
                    }
                }
            } catch (parseError) {
                console.error("[Update] Failed to parse work experiences:", parseError);
            }
        }
        // Parse and update educations
        const educationsJson = formData.get("educations");
        if (educationsJson) {
            try {
                const educations = JSON.parse(educationsJson);
                // Delete existing educations for this candidate
                await supabase.from("educations").delete().eq("candidate_id", id);
                // Insert updated educations
                if (educations.length > 0) {
                    const educationsToInsert = educations.map((edu, index)=>({
                            candidate_id: id,
                            degree: edu.degree,
                            institute: edu.institute,
                            start_year: edu.startYear,
                            end_year: edu.endYear,
                            display_order: index
                        }));
                    const { error: eduError } = await supabase.from("educations").insert(educationsToInsert);
                    if (eduError) {
                        console.error("[Update] Educations update error:", eduError);
                    // Don't fail the whole update if educations fail
                    }
                }
            } catch (parseError) {
                console.error("[Update] Failed to parse educations:", parseError);
            }
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            candidate: updatedCandidate
        }, {
            status: 200
        });
    } catch (error) {
        console.error("[Update] Update error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to update candidate",
            details: error instanceof Error ? error.message : "Unknown error"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__b7488c1c._.js.map