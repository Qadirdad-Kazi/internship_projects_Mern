import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
  changePassword: (passwords) => api.put('/auth/change-password', passwords),
};

// Users API
export const usersAPI = {
  getAllUsers: (params) => api.get('/users', { params }),
  getUserById: (id) => api.get(`/users/${id}`),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`),
  getInterns: (params) => api.get('/users/interns', { params }),
  assignSupervisor: (data) => api.put('/users/assign-supervisor', data),
};

// Tasks API
export const tasksAPI = {
  createTask: (taskData) => api.post('/tasks', taskData),
  getAllTasks: (params) => api.get('/tasks', { params }),
  getTaskById: (id) => api.get(`/tasks/${id}`),
  updateTask: (id, taskData) => api.put(`/tasks/${id}`, taskData),
  deleteTask: (id) => api.delete(`/tasks/${id}`),
  addFeedback: (id, feedback) => api.post(`/tasks/${id}/feedback`, feedback),
  getStatistics: (params) => api.get('/tasks/statistics', { params }),
};

// Progress API
export const progressAPI = {
  createProgress: (progressData) => api.post('/progress', progressData),
  getAllProgress: (params) => api.get('/progress', { params }),
  getProgressById: (id) => api.get(`/progress/${id}`),
  updateProgress: (id, progressData) => api.put(`/progress/${id}`, progressData),
  deleteProgress: (id) => api.delete(`/progress/${id}`),
  addFeedback: (id, feedback) => api.post(`/progress/${id}/feedback`, feedback),
  approveProgress: (id) => api.put(`/progress/${id}/approve`),
  getProgressByTask: (taskId, params) => api.get(`/progress/task/${taskId}`, { params }),
};

export default api;