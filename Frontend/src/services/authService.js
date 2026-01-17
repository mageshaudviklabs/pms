import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

export const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
    const { access_token, user } = response.data;

    // Store token in localStorage
    localStorage.setItem('access_token', access_token);

    // Set default authorization header
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

    return user;
  } catch (error) {
    console.error('Login failed:', error);
    throw new Error('Invalid credentials');
  }
};

export const logout = async () => {
  try {
    await axios.post(`${API_BASE_URL}/auth/logout`);
  } catch (error) {
    console.error('Logout failed:', error);
  } finally {
    // Clear token from localStorage
    localStorage.removeItem('access_token');
    delete axios.defaults.headers.common['Authorization'];
  }
};

export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('No token found');
    }

    // Set authorization header
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    const response = await axios.get(`${API_BASE_URL}/auth/me`);
    return response.data;
  } catch (error) {
    console.error('Failed to get current user:', error);
    throw new Error('Authentication failed');
  }
};

export const refreshToken = async () => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/refresh`);
    const { access_token } = response.data;

    localStorage.setItem('access_token', access_token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

    return access_token;
  } catch (error) {
    console.error('Token refresh failed:', error);
    throw error;
  }
};

// Request interceptor to add auth token to requests
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await refreshToken();
        return axios(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
