import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../services/api'

const useAuthStore = create(
  persist(
    (set, get) => ({
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
        
        // Remove axios default header
        delete api.defaults.headers.common['Authorization']
        
        // Clear localStorage
        localStorage.removeItem('auth-storage')
      },

      // Check authentication status
      checkAuth: async () => {
        const { token } = get()
        
        if (!token) {
          set({ isLoading: false })
          return
        }

        set({ isLoading: true })
        
        try {
          // Set token in header
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`
          
          // Verify token by getting profile
          const response = await api.get('/auth/profile')
          const user = response.data.data.user
          
          set({ 
            user, 
            isLoading: false, 
            error: null 
          })
          
        } catch (error) {
          console.error('Auth check failed:', error)
          
          // Token is invalid, clear auth state
          set({ 
            user: null, 
            token: null, 
            isLoading: false, 
            error: null 
          })
          
          delete api.defaults.headers.common['Authorization']
          localStorage.removeItem('auth-storage')
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
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token
      })
    }
  )
)

export { useAuthStore }