import apiClient from "../api";

export const managerService = {
  // GET /api/managers/{managerId}
  getManagerById: (managerId) =>
    apiClient.get(`/api/managers/${managerId}`),
};
