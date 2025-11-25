import { create } from 'zustand'
import api from '../services/api'
import { userCache, apiCache, resumeCache } from '../utils/cache'

const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,

  // Login action
  login: async (credentials) => {
    set({ isLoading: true, error: null })
    
    try {
      const response = await api.post('/auth/login', credentials)
      const { user, token } = response.data.data
      
      // Update store
      set({ 
        user, 
        token, 
        isLoading: false, 
        error: null 
      })
      
      // Set axios default header
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      // Store token in sessionStorage for session persistence
      sessionStorage.setItem('auth_token', token)
      
      return { success: true, user, token }
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed'
      set({ 
        isLoading: false, 
        error: errorMessage,
        user: null,
        token: null
      })
      
      return { success: false, error: errorMessage }
    }
  },

  // Register action
  register: async (userData) => {
    set({ isLoading: true, error: null })
    
    try {
      const response = await api.post('/auth/register', userData)
      const { user, token } = response.data.data
      
      // Update store
      set({ 
        user, 
        token, 
        isLoading: false, 
        error: null 
      })
      
      // Set axios default header
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      // Store token in sessionStorage for session persistence
      sessionStorage.setItem('auth_token', token)
      
      return { success: true, user, token }
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed'
      set({ 
        isLoading: false, 
        error: errorMessage,
        user: null,
        token: null
      })
      
      return { success: false, error: errorMessage }
    }
  },

  // Logout action
  logout: () => {
    set({ 
      user: null, 
      token: null, 
      error: null,
      isLoading: false
    })
    
    // Clear axios default header
    delete api.defaults.headers.common['Authorization']
    
    // Clear sessionStorage
    sessionStorage.removeItem('auth_token')
    
    // Clear all user-related cache
    userCache.clear()
    apiCache.clear()
    resumeCache.clear()
    
    // Auth state cleared
  },

  // Check authentication status by validating stored token
  checkAuth: async () => {
    set({ isLoading: true })
    
    try {
      // Try to get token from sessionStorage (safer than localStorage for session-based auth)
      const token = sessionStorage.getItem('auth_token')
      
      if (!token) {
        set({ isLoading: false })
        return false
      }
      
      // Set token in axios headers
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      // Verify token with server (use cache to reduce server load)
      const response = await api.get('/auth/profile', { 
        cache: true, 
        cacheTTL: 2 * 60 * 1000 // 2 minutes for auth check
      })
      const user = response.data.data.user
      
      // Token is valid, restore auth state
      set({
        user,
        token,
        isLoading: false,
        error: null
      })
      
      return true
      
    } catch (error) {
      // Token is invalid or expired, clear everything
      sessionStorage.removeItem('auth_token')
      delete api.defaults.headers.common['Authorization']
      
      set({
        user: null,
        token: null,
        isLoading: false,
        error: null
      })
      
      return false
    }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    set({ isLoading: true, error: null })
    
    try {
      const response = await api.put('/auth/profile', profileData)
      const updatedUser = response.data.data.user
      
      set({ 
        user: updatedUser, 
        isLoading: false, 
        error: null 
      })
      
      return { success: true, user: updatedUser }
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Profile update failed'
      set({ 
        isLoading: false, 
        error: errorMessage 
      })
      
      return { success: false, error: errorMessage }
    }
  },

  // Change password
  changePassword: async (passwordData) => {
    set({ isLoading: true, error: null })
    
    try {
      await api.put('/auth/change-password', passwordData)
      
      set({ 
        isLoading: false, 
        error: null 
      })
      
      return { success: true }
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Password change failed'
      set({ 
        isLoading: false, 
        error: errorMessage 
      })
      
      return { success: false, error: errorMessage }
    }
  },

  // Refresh token
  refreshToken: async () => {
    try {
      const response = await api.post('/auth/refresh-token')
      const { token } = response.data.data
      
      set({ token })
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      return { success: true, token }
      
    } catch (error) {
      console.error('Token refresh failed:', error)
      
      // Clear auth state on refresh failure
      get().logout()
      
      return { success: false, error: 'Token refresh failed' }
    }
  },

  // Clear error
  clearError: () => {
    set({ error: null })
  },

  // Get user stats
  getUserStats: () => {
    const { user } = get()
    
    if (!user) return null
    
    return {
      resumeCount: user.resumes?.length || 0,
      maxResumes: user.subscription?.features?.maxResumes || 3,
      canCreateResume: (user.resumes?.length || 0) < (user.subscription?.features?.maxResumes || 3),
      subscriptionPlan: user.subscription?.plan || 'free'
    }
  },

  // Save user preferences to MongoDB
  saveUserPreferences: async (preferences) => {
    try {
      const response = await api.put('/auth/preferences', preferences)
      const updatedUser = response.data.data.user
      
      set({ user: updatedUser })
      return { success: true }
    } catch (error) {
      console.error('Error saving preferences:', error)
      return { success: false, error: error.response?.data?.message || 'Failed to save preferences' }
    }
  }
}))

export { useAuthStore }