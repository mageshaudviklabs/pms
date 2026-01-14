
import { useState, useMemo, useCallback } from 'react';
import { TaskRecord, Project, UserProfile, Lead } from '../types';
import { PROJECTS as INITIAL_PROJECTS, LEADS } from '../constants';
import { WorkstreamService } from '../services/workstreamService';

export const useWorkstream = (user: UserProfile | null) => {
  const [tasks, setTasks] = useState<TaskRecord[]>([]);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS as Project[]);
  const [isImporting, setIsImporting] = useState(false);

  const isManager = user?.role === 'Manager';

  const visibleTasks = useMemo(() => {
    if (!user) return [];
    if (isManager) return tasks;
    return tasks.filter(t => t.employeeName.toLowerCase().includes(user.name.toLowerCase()));
  }, [tasks, user, isManager]);

  const dashboardProjects = useMemo(() => {
    const baseProjects = isManager 
      ? projects 
      : projects.filter(p => visibleTasks.some(t => t.projectName.toLowerCase() === p.name.toLowerCase()));

    return baseProjects.map(p => {
      const pTasks = tasks.filter(t => t.projectName.toLowerCase() === p.name.toLowerCase());
      return { ...p, members: new Set(pTasks.map(t => t.employeeName.toLowerCase())).size };
    });
  }, [projects, tasks, isManager, visibleTasks]);

  const dynamicLeads = useMemo(() => {
    const mappedLeads = LEADS.map(lead => {
      const leadTasks = tasks.filter(t => 
        t.employeeName.toLowerCase().includes(lead.name.toLowerCase()) ||
        lead.name.toLowerCase().includes(t.employeeName.toLowerCase())
      );
      return {
        ...lead,
        availability: leadTasks.length,
        tags: Array.from(new Set(leadTasks.map(t => t.taskAssigned))).slice(0, 3)
      };
    });

    if (isManager) return [...mappedLeads].sort((a, b) => a.availability - b.availability);
    return mappedLeads.filter(l => l.name.toLowerCase().includes(user?.name.toLowerCase() || ''));
  }, [tasks, isManager, user]);

  const handleClearTasks = useCallback(() => {
    if (isManager && confirm('Are you sure you want to clear all current workload records?')) {
      setTasks([]);
    }
  }, [isManager]);

  const handleAddProject = useCallback((newProj: Project) => {
    if (!isManager) return;
    setProjects(prev => {
      if (prev.find(p => p.name.toLowerCase() === newProj.name.toLowerCase())) return prev;
      return [...prev, newProj];
    });
  }, [isManager]);

  const handleAddTask = useCallback((newTask: TaskRecord) => {
    if (!isManager) return;
    setTasks(prev => [...prev, { ...newTask, id: newTask.id || `TASK-${Date.now()}` }]);
    setProjects(prev => {
      const exists = prev.find(p => p.name.toLowerCase() === newTask.projectName.toLowerCase());
      if (!exists) {
        return [...prev, WorkstreamService.generateAutoProject(newTask.projectName)];
      }
      return prev;
    });
  }, [isManager]);

  const handleUpdateTask = useCallback((updatedTask: TaskRecord) => {
    if (!isManager) return;
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
  }, [isManager]);

  const handleDeleteTask = useCallback((taskId: string) => {
    if (!isManager) return;
    if (confirm('Are you sure you want to remove this task from the workstream?')) {
      setTasks(prev => prev.filter(t => t.id !== taskId));
    }
  }, [isManager]);

  const executeOffboarding = useCallback((lead: Lead, projectName: string) => {
    if (!isManager) return;
    setTasks(prev => prev.filter(t => 
      !(t.employeeName.toLowerCase() === lead.name.toLowerCase() && 
        t.projectName.toLowerCase() === projectName.toLowerCase())
    ));
  }, [isManager]);

  const handleFileUpload = useCallback(async (file: File) => {
    if (!isManager) return;
    setIsImporting(true);
    try {
      const importedTasks = await WorkstreamService.processFileUpload(file);
      setTasks(prev => [...prev, ...importedTasks]);
      
      const uniqueProjectNames = Array.from(new Set(importedTasks.map(t => t.projectName)));
      setProjects(prev => {
        const newEntries: Project[] = [];
        uniqueProjectNames.forEach(name => {
          if (!prev.find(p => p.name.toLowerCase() === name.toLowerCase())) {
            newEntries.push({
              id: `PRJ-XL-${Math.floor(Math.random() * 1000)}`,
              name: name,
              status: 'Active',
              health: 90
            });
          }
        });
        return [...prev, ...newEntries];
      });
    } catch (error) {
      alert('Error parsing file.');
    } finally {
      setIsImporting(false);
    }
  }, [isManager]);

  return {
    tasks,
    projects,
    isImporting,
    visibleTasks,
    dashboardProjects,
    dynamicLeads,
    handleClearTasks,
    handleAddProject,
    handleAddTask,
    handleUpdateTask,
    handleDeleteTask,
    executeOffboarding,
    handleFileUpload
  };
};
