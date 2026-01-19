import apiClient from "./index.js";

export const taskService = {
  // POST /api/tasks/create
  createTask: (taskData) => apiClient.post("/api/tasks/create/", taskData),
  
  // POST /api/tasks/{taskId}/assign
  assignTask: (taskId, assignmentData) => apiClient.post(`/api/tasks/${taskId}/assign/`, assignmentData),
  
  // GET /api/tasks/queue/{managerId}
  getTaskQueue: (managerId) => apiClient.get(`/api/tasks/queue/${managerId}/`),

  // GET /api/tasks/ (Fetch all tasks for metrics)
  getAllTasks: () => apiClient.get("/api/tasks/"),

  // GET /api/tasks/employee/{employeeId} (Fetch tasks for a specific employee)
  getEmployeeTasks: (employeeId) => apiClient.get(`/api/tasks/employee/${employeeId}`),

  // PATCH /api/tasks/{taskId}/employee-status (Update task status by employee)
  updateTaskStatus: (taskId, employeeId, newStatus) => 
    apiClient.patch(`/api/tasks/${taskId}/employee-status/`, {
      employeeId,
      newStatus
    }),

  // POST /api/tasks/import/preview (Upload Excel)
  importPreview: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient.post("/api/tasks/import/preview/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // POST /api/tasks/import/confirm (Confirm & Assign)
  confirmImport: (managerId, tasks) => apiClient.post("/api/tasks/import/confirm/", {
    managerId,
    tasks
  }),
};