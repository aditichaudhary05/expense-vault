import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true,
  timeout: 10000
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const customError = {
      message: error.response?.data?.message || error.message || 'Network error occurred',
      status: error.response?.status || 500,
      details: error.response?.data?.errors || null
    };
    return Promise.reject(customError);
  }
);

export default api;
