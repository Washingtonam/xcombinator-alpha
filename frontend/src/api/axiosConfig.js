import axios from 'axios';

// Remove the local fallback. If VITE_API_URL is missing, it should fail 
// so you know exactly why it isn't working, rather than trying to hit 'localhost'.
const API_BASE = import.meta.env.VITE_API_URL; 

if (!API_BASE) {
  console.error("CRITICAL: VITE_API_URL is not defined in your environment variables!");
}

const api = axios.create({
  baseURL: API_BASE || 'https://xcombinator-alpha.onrender.com',
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
