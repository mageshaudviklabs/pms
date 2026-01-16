export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const ACTION_TYPES = {
  NEW_PROJECT: 'NEW_PROJECT',
  ALLOCATION: 'ALLOCATION',
  ASSIGN_TASK: 'ASSIGN_TASK'
};

export const PERFORMANCE_THRESHOLDS = {
  CRITICAL: 100,
  WARNING: 80,
  STABLE: 60
};