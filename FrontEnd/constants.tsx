
import React from 'react';
import { 
  Zap, 
  CircleDot, 
  Briefcase, 
  Activity, 
  BarChart3, 
  Settings
} from 'lucide-react';
import { NavItem, TaskRecord, TrendItem, Lead, Project } from './types';

export const COLORS = {
  primary: '#8A7AB5',    // AudvikLabs Lavender
  primaryLight: '#EBE8F4',
  secondary: '#1A1C2C',  // Dark accent for Trends card
  bg: '#F8F9FD',
  sidebar: '#FFFFFF',
  textHeader: '#111827',
  textSecondary: '#6B7280',
};

export const NAV_ITEMS: NavItem[] = [
  { id: 'command', label: 'Command', icon: <Zap size={18} /> },
  { id: 'overview', label: 'Overview', icon: <CircleDot size={18} /> },
  { id: 'projects', label: 'Projects', icon: <Briefcase size={18} /> },
  { id: 'performance', label: 'Performance', icon: <Activity size={18} /> },
  { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={18} /> },
  { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
];

export const LEADS: Lead[] = [
  {
    id: 'S1',
    name: 'Aniket Baral',
    role: 'FRONT END',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    availability: 0,
    tags: ['UI COMPONENTS', 'ANIMATIONS']
  },
  {
    id: 'S2',
    name: 'Magesh',
    role: 'BACKEND',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
    availability: 0,
    tags: []
  },
  {
    id: 'S3',
    name: 'Tanishka Singh',
    role: 'DATABASE',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    availability: 0,
    tags: []
  },
  {
    id: 'S4',
    name: 'Rishi Raj',
    role: 'BACKEND',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
    availability: 0,
    tags: []
  },
  {
    id: 'S5',
    name: 'Viraj Ray',
    role: 'FRONT END',
    avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop',
    availability: 0,
    tags: []
  },
  {
    id: 'S6',
    name: 'S Harsha',
    role: 'FRONT END',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop',
    availability: 0,
    tags: []
  }
];

export const PROJECTS: Project[] = [
  {
    id: 'PRJ-ALPHA',
    name: 'Project Alpha',
    status: 'Completed',
    health: 100,
    members: 3
  },
  {
    id: 'PRJ-LEGACY',
    name: 'Legacy Migration',
    status: 'Completed',
    health: 100,
    members: 3
  }
];

export const INITIAL_TASKS: TaskRecord[] = [
  {
    id: 'T-001',
    employeeId: 'S1',
    employeeName: 'Aniket Baral',
    role: 'FRONT END',
    date: '2024-11-10',
    projectName: 'Project Alpha',
    taskAssigned: 'UI Architecture Design',
    taskDescription: 'Drafted the core component structure and theme provider.',
    projectAssignedBy: 'Alex Rivera',
    startTime: '09:00',
    endTime: '18:00',
    completionDue: '2024-11-15',
    completionStatus: 'Completed',
    remarks: 'Architecture approved by CTO',
    repoUrl: 'https://github.com/audvik/alpha-core'
  },
  {
    id: 'T-002',
    employeeId: 'S2',
    employeeName: 'Magesh',
    role: 'BACKEND',
    date: '2024-11-12',
    projectName: 'Project Alpha',
    taskAssigned: 'REST API Implementation',
    taskDescription: 'Implemented Node.js endpoints for the Alpha module.',
    projectAssignedBy: 'Alex Rivera',
    startTime: '10:00',
    endTime: '19:00',
    completionDue: '2024-11-20',
    completionStatus: 'Completed',
    remarks: 'All tests passed with 95% coverage',
    repoUrl: 'https://github.com/audvik/alpha-api'
  },
  {
    id: 'T-005',
    employeeId: 'S3',
    employeeName: 'Tanishka Singh',
    role: 'DATABASE',
    date: '2024-11-14',
    projectName: 'Project Alpha',
    taskAssigned: 'Query Optimization',
    taskDescription: 'Indexed primary tables for faster data retrieval in Alpha dashboard.',
    projectAssignedBy: 'Alex Rivera',
    startTime: '09:00',
    endTime: '17:00',
    completionDue: '2024-11-18',
    completionStatus: 'Completed',
    remarks: 'Performance improved by 40%',
    repoUrl: 'https://github.com/audvik/alpha-db'
  },
  {
    id: 'T-003',
    employeeId: 'S4',
    employeeName: 'Rishi Raj',
    role: 'BACKEND',
    date: '2024-12-05',
    projectName: 'Legacy Migration',
    taskAssigned: 'PostgreSQL Schema Mapping',
    taskDescription: 'Mapped legacy Oracle schemas to new PostgreSQL instances.',
    projectAssignedBy: 'Alex Rivera',
    startTime: '09:00',
    endTime: '17:30',
    completionDue: '2024-12-10',
    completionStatus: 'Completed',
    remarks: 'Data integrity verified',
    repoUrl: 'https://github.com/audvik/legacy-db'
  },
  {
    id: 'T-008',
    employeeId: 'S5',
    employeeName: 'Viraj Ray',
    role: 'FRONT END',
    date: '2024-12-08',
    projectName: 'Legacy Migration',
    taskAssigned: 'Legacy UI Porting',
    taskDescription: 'Migrated old JSP pages to React functional components.',
    projectAssignedBy: 'Alex Rivera',
    startTime: '10:00',
    endTime: '19:00',
    completionDue: '2024-12-15',
    completionStatus: 'Completed',
    remarks: 'Responsive design implemented',
    repoUrl: 'https://github.com/audvik/legacy-ui'
  },
  {
    id: 'T-009',
    employeeId: 'S6',
    employeeName: 'S Harsha',
    role: 'FRONT END',
    date: '2024-12-10',
    projectName: 'Legacy Migration',
    taskAssigned: 'State Management Setup',
    taskDescription: 'Configured Redux Toolkit for complex migration workflows.',
    projectAssignedBy: 'Alex Rivera',
    startTime: '09:30',
    endTime: '18:30',
    completionDue: '2024-12-18',
    completionStatus: 'Completed',
    remarks: 'Clean architecture maintained',
    repoUrl: 'https://github.com/audvik/legacy-state'
  },
  {
    id: 'T-004',
    employeeId: 'S4',
    employeeName: 'Rishi Raj',
    role: 'BACKEND',
    date: '2024-12-12',
    projectName: 'Legacy Migration',
    taskAssigned: 'Data Transfer Scripts',
    taskDescription: 'Developed Python ETL scripts for high-speed migration.',
    projectAssignedBy: 'Alex Rivera',
    startTime: '11:00',
    endTime: '20:00',
    completionDue: '2024-12-15',
    completionStatus: 'Completed',
    remarks: 'Zero downtime achieved during cutover',
    repoUrl: 'https://github.com/audvik/migration-scripts'
  }
];

export const CAPACITY_TRENDS: TrendItem[] = [
  { label: 'FRONT END CAPACITY', value: 85, color: '#8A7AB5' },
  { label: 'BACKEND CAPACITY', value: 72, color: '#F59E0B' },
  { label: 'DATABASE OPS', value: 90, color: '#06B6D4' },
  { label: 'SYSTEM STABILITY', value: 96, color: '#EF4444' },
];
