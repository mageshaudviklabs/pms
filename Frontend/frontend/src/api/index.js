import axios from "axios";
import { API_BASE_URL } from "../utils/constants";

/**
 * Centralized Axios Client
 * - Uses ngrok / prod backend
 * - Attaches JWT automatically
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL, // e.g. https://74d1bc2fb6ad.ngrok-free.app
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // JWT via Authorization header
});

/**
 * 🔐 Request Interceptor
 * Automatically attach access token
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * 🌐 Response Interceptor
 * Central error handling (no mutation)
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Optional: handle 401 globally later
    return Promise.reject(error);
  }
);

export default apiClient;
