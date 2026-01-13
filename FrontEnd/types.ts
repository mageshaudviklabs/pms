
import React from 'react';

export interface TaskRecord {
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
