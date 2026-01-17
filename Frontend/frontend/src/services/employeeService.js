import apiClient from "../api";

/**
 * Employee API service
 * Uses centralized apiClient (with auth interceptor)
 */
export const employeeService = {
  // GET /api/employees/
  getAllEmployees: async () => {
    const response = await apiClient.get("/api/employees/");
    return response.data;
  },

  // GET /api/employees/ranking
  getEmployeeRanking: async () => {
    const response = await apiClient.get("/api/employees/ranking");
    return response.data;
  },

  // GET /api/employees/{employee_id}
  getEmployeeById: async (employeeId) => {
    const response = await apiClient.get(`/api/employees/${employeeId}`);
    return response.data;
  },

  // GET /api/employees/{employee_id}/notifications
  getEmployeeNotifications: async (employeeId, unreadOnly = false) => {
    const response = await apiClient.get(
      `/api/employees/${employeeId}/notifications`,
      { params: { unread_only: unreadOnly } }
    );
    return response.data;
  },

  // GET /api/employees/{employee_id}/task-history
  getEmployeeTaskHistory: async (employeeId) => {
    const response = await apiClient.get(
      `/api/employees/${employeeId}/task-history`
    );
    return response.data;
  },
};
