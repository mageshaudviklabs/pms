
import React, { useMemo } from 'react';
import EmployeeDashboardCard from '../EmployeeDashboardCard';
import EmployeeProjectsGrid from '../EmployeeProjectsGrid';
import TaskTable from '../TaskTable';
import { Project, TaskRecord, UserProfile } from '../../types';

interface Props {
  user: UserProfile;
  projects: Project[];
  tasks: TaskRecord[];
  onProjectClick: (id: string) => void;
}

const EmployeeDashboard: React.FC<Props> = ({ user, projects, tasks, onProjectClick }) => {
  // Filter for only active ecosystems (exclude Completed)
  const activeEcosystems = useMemo(() => 
    projects.filter(p => p.status !== 'Completed'), 
  [projects]);

  // Filter tasks to only include those in active ecosystems for Current Deployment views
  const activeTasks = useMemo(() => 
    tasks.filter(t => activeEcosystems.some(p => p.name.toLowerCase() === t.projectName.toLowerCase())), 
  [tasks, activeEcosystems]);

  return (
    <div className="p-6 md:p-8 max-w-[1500px] mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Personal Dashboard</h1>
          <p className="text-sm text-slate-500 font-medium leading-relaxed">
            Welcome back, {user.name}. Track your current missions and performance markers.
          </p>
        </div>
      </div>

      <div className="space-y-12">
        {/* Pass both active and all tasks for accurate stat reporting */}
        <EmployeeDashboardCard user={user} activeTasks={activeTasks} allTasks={tasks} />
        
        {/* Only show active projects in the portfolio grid */}
        <EmployeeProjectsGrid 
          projects={activeEcosystems} 
          tasks={activeTasks} 
          onProjectClick={onProjectClick}
        />
      </div>

      <div className="space-y-5 pt-8 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 rounded-full bg-sky-400" />
            <h3 className="text-xl font-bold text-slate-900">My Active Assignments</h3>
          </div>
          <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
            {activeTasks.length} Current Operations
          </div>
        </div>
        {/* Only show active tasks in the deployment stream */}
        <TaskTable tasks={activeTasks} />
      </div>
    </div>
  );
};

export default EmployeeDashboard;
