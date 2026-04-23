/**
 * API Client for FastAPI Backend
 * 
 * This is the ONLY way the frontend communicates with the backend.
 * All business logic, database operations, and external API calls
 * are handled by the FastAPI backend.
 * 
 * Environment Variable:
 * - NEXT_PUBLIC_API_URL: Backend API base URL (default: http://localhost:8000)
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

/**
 * API Error class for better error handling
 */
export class APIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public details?: any
  ) {
    super(message)
    this.name = 'APIError'
  }
}

/**
 * Centralized API client for all backend communication
 */
export const apiClient = {
  baseUrl: API_BASE_URL,

  /**
   * Generic fetch wrapper with error handling
   */
  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
        },
      })

      const data = await response.json().catch(() => ({}))
      
      if (!response.ok) {
        // If 401, check if we can refresh or if we need to log out.
        // Prevent infinite loops by avoiding retry on the refresh endpoint itself.
        if (response.status === 401 && !endpoint.includes('/api/auth/refresh')) {
          const refreshTokenStr = typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null;
          
          if (refreshTokenStr) {
            try {
              // Try to refresh
              const refreshResponse = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refresh_token: refreshTokenStr }),
              });
              
              if (refreshResponse.ok) {
                const refreshData = await refreshResponse.json();
                
                // Update tokens
                if (typeof window !== 'undefined') {
                  localStorage.setItem('access_token', refreshData.access_token);
                  if (refreshData.refresh_token) {
                    localStorage.setItem('refresh_token', refreshData.refresh_token);
                  }
                }
                
                // Retry the original request with the new token
                options.headers = {
                  ...options.headers,
                  'Authorization': `Bearer ${refreshData.access_token}`
                };
                return apiClient.request<T>(endpoint, options);
              }
            } catch (e) {
              // Refresh failed, proceed to logout
            }
          }
          
          // If no refresh token, or refresh token failed, logout
          if (typeof window !== 'undefined') {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('token');
            // Redirect to signin if we're not already there
            if (!window.location.pathname.includes('/signin')) {
               window.location.href = '/signin';
            }
          }
        }

        throw new APIError(
          data.error || data.message || `Request failed with status ${response.status}`,
          response.status,
          data.details || data
        )
      }

      return data as T
    } catch (error) {
      if (error instanceof APIError) {
        throw error
      }
      throw new APIError(
        error instanceof Error ? error.message : 'Network error occurred',
        0,
        error
      )
    }
  },

  /**
   * Parse CV file and extract structured data via Groq (LLaMA 3 70B)
   */
  async parseCV(file: File): Promise<{
    mapped_candidate_data: Record<string, any>
    raw_extraction: Record<string, any>
    cv_url: string | null
    success: boolean
  }> {
    const formData = new FormData()
    formData.append('file', file)
    
    return this.request<{
      mapped_candidate_data: Record<string, any>
      raw_extraction: Record<string, any>
      cv_url: string | null
      success: boolean
    }>('/api/parse-cv', {
      method: 'POST',
      body: formData,
    })
  },

  /**
   * Submit candidate application
   */
  async submitApplication(formData: FormData, token?: string): Promise<{
    success: boolean
    candidate: {
      id: string
      [key: string]: any
    }
  }> {
    const headers: HeadersInit = {}
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    return this.request<{
      success: boolean
      candidate: { id: string; [key: string]: any }
    }>('/api/submit-application', {
      method: 'POST',
      headers,
      body: formData,
    })
  },

  /**
   * Get candidate details by ID
   */
  async getCandidate(candidateId: string): Promise<{
    candidate: any
  }> {
    return this.request<{ candidate: any }>(`/api/candidates/${candidateId}`, {
      method: 'GET',
    })
  },

  /**
   * Get current authenticated candidate profile
   */
  async getMyCandidateProfile(token: string): Promise<{
    candidate: any
  }> {
    return this.request<{ candidate: any }>('/api/candidates/me', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
    })
  },

  /**
   * Update current authenticated candidate profile
   */
  async updateMyCandidateProfile(token: string, payload: Record<string, unknown>): Promise<{
    candidate: any
  }> {
    return this.request<{ candidate: any }>('/api/candidates/me', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
  },

  /**
   * Health check endpoint
   */
  async healthCheck(): Promise<{
    status: string
    service: string
  }> {
    return this.request<{ status: string; service: string }>('/health', {
      method: 'GET',
    })
  },

  /**
   * Authentication: Sign up
   */
  async signUp(email: string, password: string, name?: string): Promise<{
    user: { id: string; email: string; name?: string }
    access_token: string
    refresh_token?: string
    token_type: string
  }> {
    return this.request<{
      user: { id: string; email: string; name?: string }
      access_token: string
      refresh_token?: string
      token_type: string
    }>('/api/auth/sign-up', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    })
  },

  /**
   * Authentication: Sign in
   */
  async signIn(email: string, password: string): Promise<{
    user: { id: string; email: string; name?: string }
    access_token: string
    refresh_token?: string
    token_type: string
  }> {
    return this.request<{
      user: { id: string; email: string; name?: string }
      access_token: string
      refresh_token?: string
      token_type: string
    }>('/api/auth/sign-in', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
  },

  /**
   * Authentication: Get current user
   */
  async getCurrentUser(token: string): Promise<{
    user: { id: string; email: string; name?: string }
  }> {
    return this.request<{
      user: { id: string; email: string; name?: string }
    }>('/api/auth/me', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
    })
  },

  /**
   * Authentication: Verify token
   */
  async verifyToken(token: string): Promise<{
    valid: boolean
    payload?: any
  }> {
    return this.request<{ valid: boolean; payload?: any }>('/api/auth/verify-token', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
    })
  },

  /**
   * Authentication: Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<{
    access_token: string
    token_type: string
  }> {
    return this.request<{
      access_token: string
      token_type: string
    }>('/api/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    })
  },

  /**
   * Authentication: Logout
   */
  async logout(refreshToken: string): Promise<{
    message: string
  }> {
    return this.request<{ message: string }>('/api/auth/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    })
  },
}

