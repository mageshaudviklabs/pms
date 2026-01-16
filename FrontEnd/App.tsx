
import React, { useState, useRef, useEffect, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import TopHeader from './components/TopHeader';
import ProjectsView from './components/ProjectsView';
import TaskFormModal from './components/TaskFormModal';
import ProjectFormModal from './components/ProjectFormModal';
import LeadDetailModal from './components/LeadDetailModal';
import OffboardMemberModal from './components/OffboardMemberModal';
import LoginPage from './components/LoginPage';
import ManagerDashboard from './components/dashboard/ManagerDashboard';
import EmployeeDashboard from './components/dashboard/EmployeeDashboard';

import { useAuth } from './hooks/useAuth';
import { useNavigation } from './hooks/useNavigation';
import { useWorkstream } from './hooks/useWorkstream';
import { TaskRecord, Lead, AppNotification } from './types';
import { LEADS } from './constants';

const App: React.FC = () => {
  const { user, isManager, isLoading, error, handleLogin, handleLogout: authLogout } = useAuth();
  const { 
    activeNav, 
    selectedProjectId, 
    handleNavChange, 
    navigateToProject, 
    setSelectedProjectId,
    resetNavigation 
  } = useNavigation();
  
  const {
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
    handleUpdateProjectStatus,
    executeOffboarding,
    handleFileUpload,
    isProjectCompleted
  } = useWorkstream(user);

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [taskToEdit, setTaskToEdit] = useState<TaskRecord | null>(null);
  const [preselectedProjectName, setPreselectedProjectName] = useState<string | null>(null);
  const [offboardContext, setOffboardContext] = useState<{lead: Lead, projectName: string} | null>(null);
  
  // Notification states
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const prevTasksLengthRef = useRef(tasks.length);

  // Derive the currently "opened" project name for contextual filtering
  const activeProjectName = useMemo(() => {
    if (activeNav !== 'projects' || !selectedProjectId) return undefined;
    const proj = projects.find(p => p.id === selectedProjectId);
    return proj?.name;
  }, [activeNav, selectedProjectId, projects]);

  // Monitor for new tasks and notify the employee
  useEffect(() => {
    if (user?.role === 'Employee' && tasks.length > prevTasksLengthRef.current) {
      const newTasks = tasks.slice(prevTasksLengthRef.current);
      const myNewTasks = newTasks.filter(t => 
        t.employeeName.toLowerCase().includes(user.name.toLowerCase())
      );
      
      if (myNewTasks.length > 0) {
        const newNotifs: AppNotification[] = myNewTasks.map(t => ({
          id: `notif-${Date.now()}-${Math.random()}`,
          title: 'New Mission Assigned',
          message: `You've been assigned to: ${t.taskAssigned} in ${t.projectName}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          read: false,
          type: 'success'
        }));
        setNotifications(prev => [...newNotifs, ...prev]);
      }
    }
    prevTasksLengthRef.current = tasks.length;
  }, [tasks, user]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogout = () => {
    authLogout();
    setNotifications([]);
    resetNavigation();
  };

  const onMarkRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const onClearNotifications = () => {
    setNotifications([]);
  };

  const onEditTask = (task: TaskRecord) => {
    setPreselectedProjectName(null);
    setTaskToEdit(task);
    setIsFormOpen(true);
  };

  const onAddTaskToProject = (projectName: string) => {
    setTaskToEdit(null);
    setPreselectedProjectName(projectName);
    setIsFormOpen(true);
  };

  const renderContent = () => {
    if (!user) return null;

    switch (activeNav) {
      case 'projects':
        return (
          <ProjectsView 
            isManager={isManager}
            projects={dashboardProjects} 
            tasks={tasks} 
            leads={LEADS} 
            onAddProject={() => isManager && setIsProjectModalOpen(true)} 
            onLeadClick={setSelectedLead}
            onEditTask={isManager ? onEditTask : undefined}
            onDeleteTask={isManager ? handleDeleteTask : undefined}
            onRemoveMember={isManager ? (l, p) => setOffboardContext({ lead: l, projectName: p }) : undefined}
            onAddTask={isManager ? onAddTaskToProject : undefined}
            onUpdateProjectStatus={isManager ? handleUpdateProjectStatus : undefined}
            user={user}
            selectedProjectId={selectedProjectId}
            setSelectedProjectId={setSelectedProjectId}
            isProjectCompleted={isProjectCompleted}
          />
        );
      case 'command':
      default:
        return isManager ? (
          <ManagerDashboard 
            leads={dynamicLeads}
            projects={dashboardProjects}
            tasks={visibleTasks}
            isImporting={isImporting}
            onLeadClick={setSelectedLead}
            onProjectClick={navigateToProject}
            onNewTask={() => { setTaskToEdit(null); setPreselectedProjectName(null); setIsFormOpen(true); }}
            onNewProject={() => setIsProjectModalOpen(true)}
            onImportClick={() => fileInputRef.current?.click()}
            onClearTasks={handleClearTasks}
            onEditTask={onEditTask}
            onDeleteTask={handleDeleteTask}
            isProjectCompleted={isProjectCompleted}
          />
        ) : (
          <EmployeeDashboard 
            user={user}
            projects={dashboardProjects}
            tasks={visibleTasks}
            onProjectClick={navigateToProject}
          />
        );
    }
  };

  if (!user) return <LoginPage onLogin={handleLogin} error={error} isLoading={isLoading} />;

  return (
    <div className="flex min-h-screen bg-[#F8F9FD] text-slate-900">
      <Sidebar activeId={activeNav} setActiveId={handleNavChange} onLogout={handleLogout} user={user} />
      <main className="flex-1 ml-64 transition-all duration-300">
        <TopHeader 
          activeNav={activeNav} 
          onLogout={handleLogout} 
          user={user} 
          notifications={notifications}
          onMarkRead={onMarkRead}
          onClearNotifications={onClearNotifications}
        />
        {renderContent()}
      </main>

      {isManager && (
        <>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])} 
            accept=".xlsx,.xls,.csv" 
            className="hidden" 
          />
          <TaskFormModal 
            isOpen={isFormOpen} 
            onClose={() => { setIsFormOpen(false); setTaskToEdit(null); setPreselectedProjectName(null); }} 
            onAdd={handleAddTask} 
            onUpdate={handleUpdateTask}
            taskToEdit={taskToEdit}
            preselectedProjectName={preselectedProjectName}
            projects={projects}
          />
          <ProjectFormModal isOpen={isProjectModalOpen} onClose={() => setIsProjectModalOpen(false)} onAdd={handleAddProject} />
          <OffboardMemberModal 
            isOpen={!!offboardContext}
            lead={offboardContext?.lead || null}
            projectName={offboardContext?.projectName || ''}
            onClose={() => setOffboardContext(null)}
            onConfirm={() => offboardContext && executeOffboarding(offboardContext.lead, offboardContext.projectName)}
          />
        </>
      )}

      <LeadDetailModal 
        lead={selectedLead} 
        onClose={() => setSelectedLead(null)} 
        allTasks={tasks} 
        projects={projects} 
        filterByProjectName={activeProjectName}
      />
    </div>
  );
};

export default App;
