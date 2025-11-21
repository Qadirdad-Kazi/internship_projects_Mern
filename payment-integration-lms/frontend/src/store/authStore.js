import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';
import api from '../utils/api';
import toast from 'react-hot-toast';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,

      // Initialize auth from stored token
      initializeAuth: () => {
        const token = Cookies.get('token');
        if (token) {
          set({ token, isAuthenticated: true });
          // Optionally fetch user profile
          get().getProfile();
        }
      },

      // Login
      login: async (credentials) => {
        set({ isLoading: true });
        try {
          const response = await api.post('/auth/login', credentials);
          const { token, user } = response.data;
          
          Cookies.set('token', token, { expires: 30 }); // 30 days
          set({ 
            user, 
            token, 
            isAuthenticated: true, 
            isLoading: false 
          });
          
          toast.success('Login successful!');
          return { success: true };
        } catch (error) {
          const message = error.response?.data?.error?.message || 'Login failed';
          toast.error(message);
          set({ isLoading: false });
          return { success: false, message };
        }
      },

      // Register
      register: async (userData) => {
        set({ isLoading: true });
        try {
          const response = await api.post('/auth/register', userData);
          const { token, user } = response.data;
          
          Cookies.set('token', token, { expires: 30 });
          set({ 
            user, 
            token, 
            isAuthenticated: true, 
            isLoading: false 
          });
          
          toast.success('Registration successful!');
          return { success: true };
        } catch (error) {
          const message = error.response?.data?.error?.message || 'Registration failed';
          toast.error(message);
          set({ isLoading: false });
          return { success: false, message };
        }
      },

      // Logout
      logout: () => {
        Cookies.remove('token');
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false 
        });
        toast.success('Logged out successfully');
      },

      // Get user profile
      getProfile: async () => {
        try {
          const response = await api.get('/auth/profile');
          set({ user: response.data.data });
          return { success: true, user: response.data.data };
        } catch (error) {
          console.error('Failed to fetch profile:', error);
          return { success: false };
        }
      },

      // Update profile
      updateProfile: async (userData) => {
        set({ isLoading: true });
        try {
          const response = await api.put('/auth/profile', userData);
          set({ 
            user: response.data.data, 
            isLoading: false 
          });
          toast.success('Profile updated successfully');
          return { success: true };
        } catch (error) {
          const message = error.response?.data?.error?.message || 'Profile update failed';
          toast.error(message);
          set({ isLoading: false });
          return { success: false, message };
        }
      },

      // Change password
      changePassword: async (passwords) => {
        set({ isLoading: true });
        try {
          await api.put('/auth/change-password', passwords);
          set({ isLoading: false });
          toast.success('Password changed successfully');
          return { success: true };
        } catch (error) {
          const message = error.response?.data?.error?.message || 'Password change failed';
          toast.error(message);
          set({ isLoading: false });
          return { success: false, message };
        }
      },

      // Forgot password
      forgotPassword: async (email) => {
        set({ isLoading: true });
        try {
          await api.post('/auth/forgot-password', { email });
          set({ isLoading: false });
          toast.success('Password reset email sent');
          return { success: true };
        } catch (error) {
          const message = error.response?.data?.error?.message || 'Failed to send reset email';
          toast.error(message);
          set({ isLoading: false });
          return { success: false, message };
        }
      },

      // Reset password
      resetPassword: async (token, password) => {
        set({ isLoading: true });
        try {
          const response = await api.post('/auth/reset-password', { token, password });
          const { token: newToken, user } = response.data;
          
          Cookies.set('token', newToken, { expires: 30 });
          set({ 
            user, 
            token: newToken, 
            isAuthenticated: true, 
            isLoading: false 
          });
          
          toast.success('Password reset successful');
          return { success: true };
        } catch (error) {
          const message = error.response?.data?.error?.message || 'Password reset failed';
          toast.error(message);
          set({ isLoading: false });
          return { success: false, message };
        }
      },

      // Check if user has premium access
      hasPremiumAccess: () => {
        const { user } = get();
        if (!user) return false;
        
        return user.subscription?.type === 'premium' && 
               user.subscription?.status === 'active' &&
               (!user.subscription?.endDate || new Date(user.subscription.endDate) > new Date());
      },

      // Check if user owns a course
      ownsCourse: (courseId) => {
        const { user } = get();
        if (!user) return false;
        
        return user.courses?.some(course => 
          course.course._id === courseId || course.course === courseId
        );
      },

      // Check user role
      hasRole: (role) => {
        const { user } = get();
        return user?.role === role;
      },

      // Check if user has any of the specified roles
      hasAnyRole: (roles) => {
        const { user } = get();
        return user && roles.includes(user.role);
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated 
      })
    }
  )
);

export { useAuthStore };