import axios from 'axios';

// Ensure the API base URL is provided via environment variables.
const API_BASE = import.meta.env.VITE_API_URL || (typeof process !== 'undefined' ? process.env.REACT_APP_API_URL : undefined);
if (!API_BASE) {
  throw new Error('CRITICAL: VITE_API_URL or REACT_APP_API_URL is not defined in your environment variables!');
}

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// ... rest of your interceptors remain the same

api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {}
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      try {
        localStorage.removeItem('token');
      } catch (e) {}
    }
    return Promise.reject(error);
  }
);

export default api;
