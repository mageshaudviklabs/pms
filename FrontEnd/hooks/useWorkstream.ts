
import { useState, useMemo, useCallback } from 'react';
import { TaskRecord, Project, UserProfile, Lead } from '../types';
import { PROJECTS as INITIAL_PROJECTS, LEADS, INITIAL_TASKS } from '../constants';
import { WorkstreamService } from '../services/workstreamService';

export const useWorkstream = (user: UserProfile | null) => {
  const [tasks, setTasks] = useState<TaskRecord[]>(INITIAL_TASKS);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS as Project[]);
  const [isImporting, setIsImporting] = useState(false);

  const isManager = user?.role === 'Manager';

  // Helper to check if a project is completed based on its name
  const isProjectCompleted = useCallback((projectName: string) => {
    const proj = projects.find(p => p.name.toLowerCase() === projectName.toLowerCase());
    return proj?.status === 'Completed';
  }, [projects]);

  const handleUpdateProjectStatus = useCallback((projectId: string, newStatus: Project['status']) => {
    if (!isManager) return;
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, status: newStatus } : p));
  }, [isManager]);

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
        (t.employeeName.toLowerCase().includes(lead.name.toLowerCase()) ||
        lead.name.toLowerCase().includes(t.employeeName.toLowerCase())) &&
        t.completionStatus !== 'Completed' &&
        !isProjectCompleted(t.projectName)
      );
      
      return {
        ...lead,
        availability: leadTasks.length,
        tags: Array.from(new Set(leadTasks.map(t => t.taskAssigned))).slice(0, 3)
      };
    });

    if (isManager) return [...mappedLeads].sort((a, b) => a.availability - b.availability);
    return mappedLeads.filter(l => l.name.toLowerCase().includes(user?.name.toLowerCase() || ''));
  }, [tasks, isManager, user, isProjectCompleted]);

  const handleClearTasks = useCallback(() => {
    if (isManager && confirm('Are you sure you want to clear all current workload records?')) {
      // Logic: If any task belongs to a completed project, don't clear it to preserve history
      setTasks(prev => prev.filter(t => isProjectCompleted(t.projectName)));
      alert('Only tasks in active projects were cleared. History in completed projects is preserved.');
    }
  }, [isManager, isProjectCompleted]);

  const handleAddProject = useCallback((newProj: Project) => {
    if (!isManager) return;
    setProjects(prev => {
      if (prev.find(p => p.name.toLowerCase() === newProj.name.toLowerCase())) return prev;
      return [...prev, newProj];
    });
  }, [isManager]);

  const handleAddTask = useCallback((newTask: TaskRecord) => {
    if (!isManager) return;
    
    if (isProjectCompleted(newTask.projectName)) {
      alert(`Cannot add tasks to "${newTask.projectName}" as it is marked as Completed. Revert project status to active state first.`);
      return;
    }

    setTasks(prev => [...prev, { ...newTask, id: newTask.id || `TASK-${Date.now()}` }]);
    setProjects(prev => {
      const exists = prev.find(p => p.name.toLowerCase() === newTask.projectName.toLowerCase());
      if (!exists) {
        return [...prev, WorkstreamService.generateAutoProject(newTask.projectName)];
      }
      return prev;
    });
  }, [isManager, isProjectCompleted]);

  const handleUpdateTask = useCallback((updatedTask: TaskRecord) => {
    if (!isManager) return;

    if (isProjectCompleted(updatedTask.projectName)) {
      alert(`This task belongs to a Completed project and is read-only. Change project status to enable editing.`);
      return;
    }

    const existingTask = tasks.find(t => t.id === updatedTask.id);
    if (existingTask && existingTask.completionStatus === 'Completed') {
      alert('This task is already marked as Completed and is now read-only to preserve history.');
      return;
    }

    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
  }, [isManager, isProjectCompleted, tasks]);

  const handleDeleteTask = useCallback((taskId: string) => {
    if (!isManager) return;
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    if (isProjectCompleted(task.projectName)) {
      alert(`Cannot delete records from a Completed project. Revert project status to modify history.`);
      return;
    }

    if (task.completionStatus === 'Completed') {
      alert('Completed tasks are permanent and cannot be deleted to preserve work history.');
      return;
    }

    if (confirm('Are you sure you want to remove this task from the workstream?')) {
      setTasks(prev => prev.filter(t => t.id !== taskId));
    }
  }, [isManager, tasks, isProjectCompleted]);

  const executeOffboarding = useCallback((lead: Lead, projectName: string) => {
    if (!isManager) return;

    if (isProjectCompleted(projectName)) {
      alert(`History preserved: Offboarding is disabled for Completed projects.`);
      return;
    }

    setTasks(prev => {
      const filtered = prev.filter(t => 
        !(t.employeeName.toLowerCase() === lead.name.toLowerCase() && 
          t.projectName.toLowerCase() === projectName.toLowerCase() &&
          t.completionStatus !== 'Completed')
      );
      
      const removedCount = prev.length - filtered.length;
      if (removedCount > 0) {
        alert(`${lead.name} offboarded. ${removedCount} active tasks removed. Completed logs were preserved in project history.`);
      } else {
        alert(`${lead.name} has no active tasks to remove. Historical completed logs are preserved.`);
      }
      return filtered;
    });
  }, [isManager, isProjectCompleted]);

  const handleFileUpload = useCallback(async (file: File) => {
    if (!isManager) return;
    setIsImporting(true);
    try {
      const importedTasks = await WorkstreamService.processFileUpload(file);
      // Logic: Only allow importing tasks into non-completed projects
      const validTasks = importedTasks.filter(t => !isProjectCompleted(t.projectName));
      
      if (validTasks.length < importedTasks.length) {
        alert(`Warning: ${importedTasks.length - validTasks.length} tasks skipped because they belong to Completed projects.`);
      }

      setTasks(prev => [...prev, ...validTasks]);
      
      const uniqueProjectNames = Array.from(new Set(validTasks.map(t => t.projectName)));
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
  }, [isManager, isProjectCompleted]);

  return {
    tasks,
    projects,
    setProjects,
    isImporting,
    visibleTasks,
    dashboardProjects,
    dynamicLeads,
    handleClearTasks,
    handleAddProject,
    handleAddTask,
    handleUpdateTask,
    handleDeleteTask,
    handleUpdateProjectStatus,
    executeOffboarding,
    handleFileUpload,
    isProjectCompleted
  };
};
