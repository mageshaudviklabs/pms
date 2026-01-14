
import React from 'react';

export type UserRole = 'Manager' | 'Employee';

export interface UserProfile {
  name: string;
  role: UserRole;
  avatar: string;
}

export interface TaskRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  role: string;
  date: string;
  projectName: string;
  taskAssigned: string;
  taskDescription: string;
  projectAssignedBy: string;
  startTime: string;
  endTime: string;
  completionDue: string;
  completionStatus: 'Completed' | 'In Progress' | 'Pending' | 'Delayed';
  remarks: string;
  repoUrl: string;
}

export interface Project {
  id: string;
  name: string;
  status: 'Active' | 'Delayed' | 'Review' | 'Pending' | 'Completed';
  health: number;
  members?: number;
}

export interface Lead {
  id: string;
  name: string;
  role: string;
  avatar: string;
  availability: number; 
  tags: string[];
}

export interface TrendItem {
  label: string;
  value: number;
  color: string;
}

export interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'info' | 'success' | 'warning';
}

export interface WorkstreamService {
  getTasks(): Promise<TaskRecord[]>;
  getProjects(): Promise<Project[]>;
  saveTask(task: TaskRecord): Promise<TaskRecord>;
  updateTask(task: TaskRecord): Promise<TaskRecord>;
  deleteTask(taskId: string): Promise<void>;
  saveProject(project: Project): Promise<Project>;
  processFileUpload(file: File): Promise<TaskRecord[]>;
}
