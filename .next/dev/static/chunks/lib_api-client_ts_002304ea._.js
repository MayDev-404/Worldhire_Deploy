(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/api-client.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * API client configuration for FastAPI backend
 */ __turbopack_context__.s([
    "apiClient",
    ()=>apiClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
const API_BASE_URL = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const apiClient = {
    baseUrl: API_BASE_URL,
    async parseCV (file) {
        const formData = new FormData();
        formData.append('file', file);
        const response = await fetch(`${API_BASE_URL}/api/parse-cv`, {
            method: 'POST',
            body: formData
        });
        if (!response.ok) {
            const error = await response.json().catch(()=>({
                    error: 'Failed to parse CV'
                }));
            throw new Error(error.error || 'Failed to parse CV');
        }
        return response.json();
    },
    async submitApplication (formData) {
        const response = await fetch(`${API_BASE_URL}/api/submit-application`, {
            method: 'POST',
            body: formData
        });
        if (!response.ok) {
            const error = await response.json().catch(()=>({
                    error: 'Failed to submit application'
                }));
            throw new Error(error.error || error.details || 'Failed to submit application');
        }
        return response.json();
    },
    async getCandidate (candidateId) {
        const response = await fetch(`${API_BASE_URL}/api/candidates/${candidateId}`, {
            method: 'GET'
        });
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Candidate not found');
            }
            const error = await response.json().catch(()=>({
                    error: 'Failed to fetch candidate'
                }));
            throw new Error(error.error || 'Failed to fetch candidate');
        }
        return response.json();
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=lib_api-client_ts_002304ea._.js.map