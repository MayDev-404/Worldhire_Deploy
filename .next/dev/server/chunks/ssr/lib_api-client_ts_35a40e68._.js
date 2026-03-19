module.exports = [
"[project]/lib/api-client.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * API client configuration for FastAPI backend
 */ __turbopack_context__.s([
    "apiClient",
    ()=>apiClient
]);
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
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
}),
];

//# sourceMappingURL=lib_api-client_ts_35a40e68._.js.map