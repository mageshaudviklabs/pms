import apiClient from "./index.js";

export const managerService = {
  // GET /api/managers/{managerId}
  getManagerById: (managerId) =>
    apiClient.get(`/api/managers/${managerId}`),
};