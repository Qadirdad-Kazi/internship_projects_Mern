import axios from 'axios'

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
  (config) => {
    // Add timestamp to prevent caching for GET requests
    if (config.method === 'get') {
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
    return response
  },
  async (error) => {
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