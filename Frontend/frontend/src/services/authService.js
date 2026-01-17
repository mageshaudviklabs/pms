import apiClient from "../api";

/**
 * Login user
 * Stores JWT token in localStorage
 */
export const login = async (credentials) => {
  try {
    const response = await apiClient.post("/api/auth/login", credentials);
    const { access_token, user } = response.data;

    localStorage.setItem("access_token", access_token);
    return user;
  } catch (error) {
    console.error("Login failed:", error);
    throw new Error("Invalid credentials");
  }
};

/**
 * Logout user
 * Clears JWT token
 */
export const logout = async () => {
  try {
    await apiClient.post("/api/auth/logout");
  } catch (error) {
    console.error("Logout failed:", error);
  } finally {
    localStorage.removeItem("access_token");
  }
};

/**
 * Get currently authenticated user
 * Token is automatically attached via interceptor
 */
export const getCurrentUser = async () => {
  try {
    const response = await apiClient.get("/api/auth/me");
    return response.data;
  } catch (error) {
    console.error("Failed to get current user:", error);
    throw new Error("Authentication failed");
  }
};

/**
 * Refresh access token
 */
export const refreshToken = async () => {
  try {
    const response = await apiClient.post("/api/auth/refresh");
    const { access_token } = response.data;

    localStorage.setItem("access_token", access_token);
    return access_token;
  } catch (error) {
    console.error("Token refresh failed:", error);
    throw error;
  }
};
