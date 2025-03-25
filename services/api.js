import axios from 'axios';

// Create an axios instance with a base URL
const api = axios.create({
  baseURL: 'https://quiz-platform-backend-omega.vercel.app/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor for authentication tokens (will be used in Phase 2)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('Token:', token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Test API connection
export const testApiConnection = async () => {
  try {
    const response = await api.get('/test');
    return response.data;
  } catch (error) {
    console.error('API test connection failed:', error);
    throw error;
  }
};

export default api;