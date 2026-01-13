
import React from 'react';
import { 
  Zap, 
  CircleDot, 
  Briefcase, 
  Activity, 
  BarChart3, 
  Settings
} from 'lucide-react';
import { NavItem, TaskRecord, TrendItem, Lead } from './types';

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

export const INITIAL_TASKS: TaskRecord[] = [];

export const CAPACITY_TRENDS: TrendItem[] = [
  { label: 'FRONT END CAPACITY', value: 85, color: '#8A7AB5' },
  { label: 'BACKEND CAPACITY', value: 72, color: '#F59E0B' },
  { label: 'DATABASE OPS', value: 90, color: '#06B6D4' },
  { label: 'SYSTEM STABILITY', value: 96, color: '#EF4444' },
];
