import axios, { AxiosResponse } from 'axios';
import { AuthRequest, AuthResponse, Trail, CreateTrailRequest, UpdateTrailRequest, TrailsResponse, TrailFilters } from '../types';

const API_BASE_URL = 'http://localhost:3001/api';

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
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (data: AuthRequest): Promise<AuthResponse> => {
    const response: AxiosResponse<{ success: boolean; data: AuthResponse }> = await api.post('/auth/register', data);
    return response.data.data;
  },

  login: async (data: AuthRequest): Promise<AuthResponse> => {
    const response: AxiosResponse<{ success: boolean; data: AuthResponse }> = await api.post('/auth/login', data);
    return response.data.data;
  },

  getProfile: async (): Promise<any> => {
    const response: AxiosResponse<{ success: boolean; data: any }> = await api.get('/auth/profile');
    return response.data.data;
  },
};

// Trails API
export const trailsAPI = {
  getTrails: async (filters: TrailFilters = {}): Promise<TrailsResponse> => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response: AxiosResponse<{ success: boolean; data: TrailsResponse }> = await api.get(`/trails?${params.toString()}`);
    return response.data.data;
  },

  getTrailById: async (id: number): Promise<Trail> => {
    const response: AxiosResponse<{ success: boolean; data: Trail }> = await api.get(`/trails/${id}`);
    return response.data.data;
  },

  createTrail: async (data: CreateTrailRequest): Promise<Trail> => {
    const response: AxiosResponse<{ success: boolean; data: Trail }> = await api.post('/trails', data);
    return response.data.data;
  },

  updateTrail: async (id: number, data: Partial<CreateTrailRequest>): Promise<Trail> => {
    const response: AxiosResponse<{ success: boolean; data: Trail }> = await api.put(`/trails/${id}`, data);
    return response.data.data;
  },

  deleteTrail: async (id: number): Promise<void> => {
    await api.delete(`/trails/${id}`);
  },
};

// Weather API
export const weatherAPI = {
  getTrailsWeather: () => api.get('/weather/trails'),
  getTrailWeather: (id: number) => api.get(`/weather/trails/${id}`),
  getWeatherAlerts: () => api.get('/weather/alerts'),
};

// Stats API
export const statsAPI = {
  getUserStats: () => api.get('/stats/user'),
  getPublicStats: () => api.get('/stats/public'),
  getTrailStats: (id: number) => api.get(`/stats/trail/${id}`),
};

export default api;

