import apiClient from "./index.js";

/**
 * 🔹 Used by TeamOverview & hooks
 * Fetch ONLY employee profile data
 */
export const fetchEmployees = async () => {
  const response = await apiClient.get("/api/employees/profile/");
  return response.data;
};

/**
 * 🔹 Service object
 */
export const employeeService = {
  // Full employee data
  getAllEmployees: () =>
    apiClient.get("/api/employees/"),

  // Single employee
  getEmployeeById: (employeeId) =>
    apiClient.get(`/api/employees/${employeeId}/`),

  // Ranking
  getEmployeeRanking: () =>
    apiClient.get("/api/employees/ranking/"),

  // Notifications
  getEmployeeNotifications: (employeeId, unreadOnly = false) =>
    apiClient.get(`/api/employees/${employeeId}/notifications/`, {
      params: { unread_only: unreadOnly },
    }),

  // Task history
  getEmployeeTaskHistory: (employeeId) =>
    apiClient.get(`/api/employees/${employeeId}/task-history/`),

  // profile-only single employee
  getEmployeeProfileById: (employeeId) =>
    apiClient.get(`/api/employees/profile/${employeeId}/`),
};