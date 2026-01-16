import apiClient from "../api";

/**
 * 🔹 Used by TeamOverview & hooks
 * Fetch ONLY employee profile data
 */
export const fetchEmployees = async () => {
  const response = await apiClient.get("/api/employees/profile");
  return response.data;
};

/**
 * 🔹 Service object (kept for future / other pages)
 * These still point to task/workload-based APIs
 */
export const employeeService = {
  // Full employee data (tasks, workload, etc.)
  getAllEmployees: () =>
    apiClient.get("/api/employees/"),

  // Single employee (full data)
  getEmployeeById: (employeeId) =>
    apiClient.get(`/api/employees/${employeeId}`),

  // Ranking (workload-based)
  getEmployeeRanking: () =>
    apiClient.get("/api/employees/ranking"),

  // Notifications
  getEmployeeNotifications: (employeeId, unreadOnly = false) =>
    apiClient.get(`/api/employees/${employeeId}/notifications`, {
      params: { unread_only: unreadOnly },
    }),

  // Task history
  getEmployeeTaskHistory: (employeeId) =>
    apiClient.get(`/api/employees/${employeeId}/task-history`),

  // ✅ NEW: profile-only single employee
  getEmployeeProfileById: (employeeId) =>
    apiClient.get(`/api/employees/profile/${employeeId}`),
};
