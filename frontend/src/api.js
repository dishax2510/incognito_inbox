import axios from 'axios';

// Base URL for your backend API
const BASE_URL = 'http://localhost:5000/api';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      data: config.data,
    });
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', {
      status: response.status,
      url: response.config.url,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error('API Response Error:', {
      status: error.response?.status,
      url: error.config?.url,
      message: error.response?.data?.message || error.message,
    });
    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  verifyOTP: (otpData) => api.post('/auth/verify-otp', otpData),
};

// Feedback API functions
export const feedbackAPI = {
  // Send feedback
  send: (feedbackData) => {
    console.log('Sending feedback data:', feedbackData);
    return api.post('/feedback/send', feedbackData);
  },
  
  // Get feedback by email
  getByEmail: (email) => {
    console.log('Fetching feedback for email:', email);
    return api.get(`/feedback/${encodeURIComponent(email)}`);
  },
};

// Export the configured axios instance as default
export default api;