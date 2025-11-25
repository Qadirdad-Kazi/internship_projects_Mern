import axios from 'axios'
import { apiCache } from '../utils/cache'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
})

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    // Handle caching for GET requests
    if (config.method === 'get' && config.cache !== false) {
      const cacheKey = `${config.url}${config.params ? '?' + new URLSearchParams(config.params).toString() : ''}`
      const cached = apiCache.get(cacheKey)
      
      if (cached) {
        // Return cached response by creating a mock axios response
        return Promise.reject({
          isAxiosError: false,
          isCached: true,
          data: cached,
          status: 200,
          statusText: 'OK (Cached)',
          headers: {},
          config
        })
      }
    }
    
    // Add timestamp for non-cached GET requests
    if (config.method === 'get' && config.cache === false) {
      config.params = {
        ...config.params,
        _t: Date.now()
      }
    }
    
    return config
  },
  (error) => {
    console.error('Request interceptor error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Cache successful GET responses
    if (response.config.method === 'get' && response.config.cache !== false) {
      const cacheKey = `${response.config.url}${response.config.params ? '?' + new URLSearchParams(response.config.params).toString() : ''}`
      const cacheTTL = response.config.cacheTTL || 5 * 60 * 1000 // 5 minutes default
      apiCache.set(cacheKey, response.data, cacheTTL)
    }
    
    return response
  },
  async (error) => {
    // Handle cached responses
    if (error.isCached) {
      return Promise.resolve({
        data: error.data,
        status: error.status,
        statusText: error.statusText,
        headers: error.headers,
        config: error.config
      })
    }
    
    const originalRequest = error.config
    
    // Handle 401 errors (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      try {
        // Try to refresh token
        const { useAuthStore } = await import('../stores/authStore')
        const refreshResult = await useAuthStore.getState().refreshToken()
        
        if (refreshResult.success) {
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${refreshResult.token}`
          return api(originalRequest)
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError)
        
        // Redirect to login or clear auth state
        const { useAuthStore } = await import('../stores/authStore')
        useAuthStore.getState().logout()
        
        // Redirect to login if we're not already there
        if (window.location.pathname !== '/login') {
          window.location.href = '/login'
        }
      }
    }
    
    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error.message)
      error.message = 'Network error. Please check your connection.'
    }
    
    return Promise.reject(error)
  }
)

export default api

// API service functions
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
  changePassword: (passwordData) => api.put('/auth/change-password', passwordData),
  refreshToken: () => api.post('/auth/refresh-token'),
  deleteAccount: (passwordData) => api.delete('/auth/delete-account', { data: passwordData })
}

export const resumeAPI = {
  getResumes: (params) => api.get('/resumes', { params }),
  getResumeById: (id, params) => api.get(`/resumes/${id}`, { params }),
  createResume: (resumeData) => api.post('/resumes', resumeData),
  updateResume: (id, resumeData) => api.put(`/resumes/${id}`, resumeData),
  deleteResume: (id) => api.delete(`/resumes/${id}`),
  duplicateResume: (id) => api.post(`/resumes/${id}/duplicate`),
  generateShareLink: (id) => api.post(`/resumes/${id}/share`),
  getPublicResume: (shareId) => api.get(`/resumes/public/${shareId}`)
}

export const pdfAPI = {
  generatePDF: (id) => api.get(`/pdf/generate/${id}`, { 
    responseType: 'blob',
    timeout: 60000 // 60 seconds for PDF generation
  }),
  previewPDF: (id) => api.get(`/pdf/preview/${id}`, { 
    responseType: 'blob',
    timeout: 60000
  })
}

// Upload API (for future profile pictures, etc.)
export const uploadAPI = {
  uploadFile: (formData) => api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    timeout: 60000
  })
}

// Cache management API
export const cacheAPI = {
  // Clear all API cache
  clearAll: () => {
    apiCache.clear()
  },
  
  // Clear specific cache entries
  clearAuth: () => {
    const authKeys = ['profile', 'refresh-token']
    authKeys.forEach(key => apiCache.delete(`/auth/${key}`))
  },
  
  clearResumes: () => {
    // Clear all resume-related cache entries
    const patterns = ['/resumes', '/resumes/']
    patterns.forEach(pattern => {
      // Note: This is a simplified clear - in production you might want more sophisticated pattern matching
      apiCache.delete(pattern)
    })
  },
  
  // Invalidate cache for specific resume
  invalidateResume: (id) => {
    apiCache.delete(`/resumes/${id}`)
    apiCache.delete('/resumes') // Also clear list cache
  },
  
  // Get cache statistics
  getStats: () => {
    return {
      apiCacheSize: apiCache.has('stats') ? Object.keys(apiCache.get('stats') || {}).length : 0
    }
  }
}

// Enhanced API functions with caching options
export const cachedAPI = {
  // Get user profile with caching
  getProfile: (forceFresh = false) => api.get('/auth/profile', { 
    cache: !forceFresh,
    cacheTTL: 10 * 60 * 1000 // 10 minutes
  }),
  
  // Get resumes with caching
  getResumes: (params = {}, forceFresh = false) => api.get('/resumes', { 
    params,
    cache: !forceFresh,
    cacheTTL: 5 * 60 * 1000 // 5 minutes
  }),
  
  // Get specific resume with caching
  getResume: (id, forceFresh = false) => api.get(`/resumes/${id}`, { 
    cache: !forceFresh,
    cacheTTL: 15 * 60 * 1000 // 15 minutes for individual resumes
  }),
  
  // Get public resume with longer caching
  getPublicResume: (shareId, forceFresh = false) => api.get(`/resumes/public/${shareId}`, { 
    cache: !forceFresh,
    cacheTTL: 30 * 60 * 1000 // 30 minutes for public resumes
  })
}