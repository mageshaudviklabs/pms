import apiClient from "./index.js";

export const projectService = {
  // Manager: Project Summaries
  getManagerProjectSummary: (managerId) => 
    apiClient.get(`/api/projects/manager/${managerId}/summary/`),

  // Manager: Project Tasks
  getProjectTasks: (projectName) => 
    apiClient.get(`/api/projects/${encodeURIComponent(projectName)}/tasks/`),

  // Employee: My Projects
  getEmployeeProjects: (employeeId) => 
    apiClient.get(`/api/projects/employee/${employeeId}/`),

  // Employee: My Tasks within a Project
  getEmployeeProjectTasks: (employeeId, projectName) => 
    apiClient.get(`/api/projects/employee/${employeeId}/${encodeURIComponent(projectName)}/`),
};