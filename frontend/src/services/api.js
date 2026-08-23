import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://expense-vault-lsre.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true,
  timeout: 15000
});

// Attach JWT token from localStorage if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ev_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    const data = response.data;
    // Auto-store token from any response that includes one
    if (data?.data?.token) {
      localStorage.setItem('ev_token', data.data.token);
    }
    return data;
  },
  (error) => {
    // Clear token on 401
    if (error.response?.status === 401) {
      localStorage.removeItem('ev_token');
    }
    const customError = {
      message: error.response?.data?.message || error.message || 'Network error occurred',
      status: error.response?.status || 500,
      details: error.response?.data?.errors || null
    };
    return Promise.reject(customError);
  }
);

export default api;
