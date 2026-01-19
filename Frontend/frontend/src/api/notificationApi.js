import apiClient from "./index.js";

export const notificationService = {
  // GET notifications for employee
  getNotifications: (employeeId) =>
    apiClient.get(`/api/notifications/employee/${employeeId}`),

  // PATCH single notification as read
  markAsRead: (notificationId) =>
    apiClient.patch(`/api/notifications/${notificationId}/read`),

  // PATCH mark all as read
  markAllAsRead: (employeeId) =>
    apiClient.patch(`/api/notifications/employee/${employeeId}/read-all`),
};
