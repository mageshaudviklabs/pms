
import React, { useMemo, useState } from 'react';
import { Project, TaskRecord, Lead, UserProfile } from '../types';
import { FolderKanban, Users, Activity, ChevronLeft, LayoutGrid, ListFilter, UserPlus, X, ShieldCheck, Clock, FileText, Calendar, Link, CheckCircle2, Timer, AlertCircle, XCircle, Lock, Settings2 } from 'lucide-react';
import TaskTable from './TaskTable';
import LeadCard from './LeadCard';

interface Props {
  projects: Project[];
  tasks: TaskRecord[];
  leads: Lead[];
  onAddProject: () => void;
  onLeadClick?: (lead: Lead) => void;
  onEditTask?: (task: TaskRecord) => void;
  onDeleteTask?: (taskId: string) => void;
  onRemoveMember?: (lead: Lead, projectName: string) => void;
  onAddTask?: (projectName: string) => void;
  onUpdateProjectStatus?: (projectId: string, status: Project['status']) => void;
  isManager?: boolean;
  user: UserProfile | null;
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  isProjectCompleted: (projectName: string) => boolean;
}

const ProjectsView: React.FC<Props> = ({ 
  projects, 
  tasks, 
  leads, 
  onAddProject, 
  onLeadClick,
  onEditTask,
  onDeleteTask,
  onRemoveMember,
  onAddTask,
  onUpdateProjectStatus,
  isManager = false,
  user,
  selectedProjectId,
  setSelectedProjectId,
  isProjectCompleted
}) => {
  const [filterStatus, setFilterStatus] = useState<Project['status'] | 'All'>('All');
  
  const selectedProject = projects.find(p => p.id === selectedProjectId);
  const isCompleted = selectedProject ? isProjectCompleted(selectedProject.name) : false;

  const allProjectTasks = useMemo(() => {
    if (!selectedProject) return [];
    return tasks.filter(t => t.projectName.toLowerCase() === selectedProject.name.toLowerCase());
  }, [selectedProject, tasks]);

  const displayTasks = useMemo(() => {
    if (!selectedProject) return [];
    if (isManager) return allProjectTasks;
    return allProjectTasks.filter(t => 
      t.employeeName.toLowerCase().includes(user?.name.toLowerCase() || '')
    );
  }, [selectedProject, allProjectTasks, isManager, user]);

  const projectMembers = useMemo(() => {
    if (!selectedProject) return [];
    const projectEmployeeNames = new Set(allProjectTasks.map(t => t.employeeName.toLowerCase()));
    
    return leads
      .filter(l => projectEmployeeNames.has(l.name.toLowerCase()))
      .map(lead => {
        const isMe = user ? lead.name.toLowerCase().includes(user.name.toLowerCase()) : false;
        
        if (isManager) {
          // Scope the task count to only the current project ecosystem
          const leadProjectTasks = allProjectTasks.filter(t => 
            t.employeeName.toLowerCase() === lead.name.toLowerCase()
          );
          
          return {
            ...lead,
            availability: leadProjectTasks.length,
            tags: Array.from(new Set(leadProjectTasks.map(t => t.taskAssigned))).slice(0, 3),
            isMe
          };
        }
        
        return { ...lead, isMe };
      });
  }, [selectedProject, allProjectTasks, leads, isManager, user]);

  // Priority sorting logic
  const sortedAndFilteredProjects = useMemo(() => {
    // 1. Filter by status
    let filtered = filterStatus === 'All' 
      ? projects 
      : projects.filter(p => p.status === filterStatus);

    // 2. Sort by status priority
    const statusPriority: Record<string, number> = {
      'Active': 0,
      'Under Maintenance': 1,
      'Review': 2,
      'Delayed': 3,
      'Pending': 4,
      'Completed': 5
    };

    return [...filtered].sort((a, b) => {
      const prioA = statusPriority[a.status] ?? 99;
      const prioB = statusPriority[b.status] ?? 99;
      return prioA - prioB;
    });
  }, [projects, filterStatus]);

  const getStatusIcon = (status: TaskRecord['completionStatus']) => {
    switch (status) {
      case 'Completed': return <CheckCircle2 size={14} className="text-emerald-500" />;
      case 'In Progress': return <Timer size={14} className="text-blue-500 animate-spin-slow" />;
      case 'Pending': return <AlertCircle size={14} className="text-amber-500" />;
      case 'Delayed': return <XCircle size={14} className="text-rose-500" />;
      default: return null;
    }
  };

  const getStatusBg = (status: TaskRecord['completionStatus']) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'In Progress': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Pending': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Delayed': return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-slate-50 text-slate-500 border-slate-100';
    }
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (selectedProject && onUpdateProjectStatus) {
      onUpdateProjectStatus(selectedProject.id, e.target.value as Project['status']);
    }
  };

  if (selectedProject) {
    return (
      <div className="p-6 md:p-8 max-w-[1500px] mx-auto space-y-10 animate-in slide-in-from-right-4 duration-300">
        <button 
          onClick={() => setSelectedProjectId(null)}
          className="flex items-center gap-2 text-[10px] font-black text-[#8A7AB5] uppercase tracking-widest hover:translate-x-[-4px] transition-transform"
        >
          <ChevronLeft size={16} />
          Back to Portfolio
        </button>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#8A7AB5] text-white rounded-xl">
                <FolderKanban size={24} />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight text-slate-900">{selectedProject.name}</h1>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex flex-col gap-1">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Project Status</span>
                    {isManager ? (
                      <div className="flex items-center gap-2">
                        <select 
                          value={selectedProject.status}
                          onChange={handleStatusChange}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider border-2 border-transparent focus:border-[#8A7AB5]/20 outline-none transition-all ${
                            selectedProject.status === 'Completed' ? 'bg-slate-900 text-white' : 'bg-white text-slate-900 border-slate-100 shadow-sm'
                          }`}
                        >
                          <option value="Active">Active</option>
                          <option value="Pending">Pending</option>
                          <option value="Review">Review</option>
                          <option value="Delayed">Delayed</option>
                          <option value="Under Maintenance">Under Maintenance</option>
                          <option value="Completed">Completed</option>
                        </select>
                        <Settings2 size={12} className="text-slate-400" />
                      </div>
                    ) : (
                      <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-wider ${
                        selectedProject.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 
                        selectedProject.status === 'Completed' ? 'bg-slate-900 text-white' : 'bg-rose-50 text-rose-600'
                      }`}>
                        {selectedProject.status}
                      </span>
                    )}
                  </div>
                  <div className="h-8 w-px bg-slate-100" />
                  <div className="flex flex-col gap-1">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Protocol</span>
                    {isCompleted ? (
                      <span className="flex items-center gap-1 text-[9px] font-black text-[#8A7AB5] uppercase">
                        <Lock size={10} /> History Locked
                      </span>
                    ) : (
                      <span className="text-[9px] font-black text-emerald-500 uppercase">Operational</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Project Health</p>
              <p className={`text-2xl font-black ${selectedProject.health > 80 ? 'text-emerald-500' : 'text-[#8A7AB5]'}`}>{selectedProject.health}%</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active Members</p>
              <p className="text-2xl font-black text-slate-900">{selectedProject.members || 0}</p>
            </div>
          </div>
        </div>

        <div className="space-y-12">
          {!isManager && displayTasks.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-1 h-5 bg-[#8A7AB5] rounded-full" />
                <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">My Tasks in This Project</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {displayTasks.map((task) => (
                  <div key={task.id} className="bg-white border border-slate-100 rounded-[24px] p-6 shadow-sm hover:shadow-md transition-all space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full border text-[8px] font-black uppercase tracking-wider ${getStatusBg(task.completionStatus)}`}>
                          {getStatusIcon(task.completionStatus)}
                          {task.completionStatus}
                        </div>
                        <h4 className="text-base font-bold text-slate-900 line-clamp-2">{task.taskAssigned}</h4>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100">
                      <p className="text-[11px] text-slate-600 leading-relaxed italic">
                        {task.taskDescription || 'No description provided.'}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-[#8A7AB5]" />
                        <div className="flex flex-col">
                          <span className="text-[8px] font-black text-slate-400 uppercase">Assigned On</span>
                          <span className="text-[10px] font-bold text-slate-700">{task.date}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-sky-400" />
                        <div className="flex flex-col">
                          <span className="text-[8px] font-black text-slate-400 uppercase">Due Date</span>
                          <span className="text-[10px] font-bold text-slate-700">{task.completionDue}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText size={14} className="text-slate-400" />
                        <span className="text-[9px] font-bold text-slate-400 uppercase">From: {task.projectAssignedBy}</span>
                      </div>
                      {task.repoUrl && (
                        <a 
                          href={task.repoUrl} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="flex items-center gap-1.5 text-[9px] font-black text-[#8A7AB5] uppercase hover:underline"
                        >
                          <Link size={12} />
                          Repo Link
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-1 h-5 ${isManager ? 'bg-sky-400' : 'bg-[#8A7AB5]'} rounded-full`} />
                <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">
                  {isManager ? 'Assigned Talent' : 'Project Team'}
                </h3>
              </div>
              <div className="flex items-center gap-4">
                {isManager && onAddTask && !isCompleted && (
                  <button 
                    onClick={() => onAddTask(selectedProject.name)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-sky-400 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-sky-500 transition-colors shadow-sm"
                  >
                    <UserPlus size={12} />
                    Add Member
                  </button>
                )}
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{projectMembers.length} Specialists</span>
              </div>
            </div>
            
            {projectMembers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {projectMembers.map(lead => (
                  isManager ? (
                    <div key={lead.id} className="relative group">
                      <LeadCard 
                        lead={lead as Lead} 
                        onClick={() => onLeadClick?.(lead as Lead)}
                      />
                      {onRemoveMember && !isCompleted && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveMember(lead as Lead, selectedProject.name);
                          }}
                          className="absolute top-2 right-2 p-1 bg-white shadow-md rounded-full text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-50 z-10"
                          title="Offboard from project"
                        >
                          <X size={12} />
                        </button>
                      )}
                      {isCompleted && (
                        <div className="absolute top-2 right-2 p-1 bg-slate-50 shadow-sm rounded-full text-slate-300 z-10" title="Historical Member (Locked)">
                          <Lock size={10} />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div key={lead.id} className={`bg-white border ${lead.isMe ? 'border-[#8A7AB5] shadow-lg shadow-[#8A7AB5]/5' : 'border-slate-100'} p-4 rounded-2xl flex items-center gap-4 transition-all`}>
                      <img src={lead.avatar} className="w-12 h-12 rounded-xl object-cover" alt={lead.name} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900 truncate">{lead.name}</h4>
                          {lead.isMe && (
                            <span className="px-1.5 py-0.5 bg-[#8A7AB5] text-white text-[7px] font-black rounded uppercase">You</span>
                          )}
                        </div>
                        <p className="text-[9px] font-black text-[#8A7AB5] uppercase tracking-widest">{lead.role}</p>
                      </div>
                    </div>
                  )
                ))}
              </div>
            ) : (
              <div className="p-12 border-2 border-dashed border-slate-100 rounded-[32px] text-center bg-slate-50/50">
                <Users size={32} className="mx-auto text-slate-200 mb-3" />
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No leads assigned to this ecosystem</p>
                <p className="text-xs text-slate-400 mt-1">Assign tasks to leads to see them here.</p>
              </div>
            )}
          </div>

          <div className="space-y-4 pt-10 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-1 h-5 ${isManager ? 'bg-[#8A7AB5]' : 'bg-sky-400'} rounded-full`} />
                <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">
                  {isManager ? 'Project Workstream' : 'My Project Assignments'}
                </h3>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {displayTasks.length} {isManager ? 'Operations Active' : 'My Operations'}
              </span>
            </div>
            <TaskTable 
              tasks={displayTasks} 
              onEdit={isManager ? onEditTask : undefined}
              onDelete={isManager ? onDeleteTask : undefined}
              isReadOnly={(task) => isCompleted || task.completionStatus === 'Completed'}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-[1500px] mx-auto space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Ecosystems Portfolio</h1>
          <p className="text-sm text-slate-500 font-medium leading-relaxed">
            {isManager 
              ? 'Manage your entire project landscape and track cross-functional health.' 
              : 'View and track the status of ecosystems you are currently deployed to.'}
          </p>
        </div>

        {isManager && (
          <div className="flex items-center gap-3">
            <button 
              onClick={onAddProject}
              className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black shadow-lg shadow-slate-900/10 hover:bg-[#8A7AB5] transition-all uppercase tracking-widest active:scale-95"
            >
              <FolderKanban size={16} />
              New Ecosystem
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
        <button className={`flex items-center gap-2 px-3 py-1.5 ${isManager ? 'bg-[#8A7AB5]' : 'bg-sky-400'} text-white rounded-lg text-[9px] font-black uppercase tracking-widest`}>
          <LayoutGrid size={12} />
          Grid View
        </button>
        
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <ListFilter size={12} />
          </div>
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="pl-9 pr-4 py-1.5 bg-slate-100 text-slate-500 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-slate-200 transition-colors outline-none appearance-none cursor-pointer border-none"
          >
            <option value="All">All Ecosystems</option>
            <option value="Active">Active / In Process</option>
            <option value="Under Maintenance">Under Maintenance</option>
            <option value="Review">Review</option>
            <option value="Delayed">Delayed</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {sortedAndFilteredProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-200">
            <FolderKanban size={40} />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold text-slate-900">Empty Portfolio</h3>
            <p className="text-sm text-slate-500 max-w-xs mx-auto">
              {filterStatus !== 'All' 
                ? `No ecosystems found with status "${filterStatus}".`
                : (isManager ? 'Upload an Excel sheet or create an ecosystem manually to get started.' : 'No active projects assigned yet.')}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sortedAndFilteredProjects.map(project => (
            <div 
              key={project.id}
              onClick={() => setSelectedProjectId(project.id)}
              className={`bg-white border ${isManager ? 'border-slate-100' : 'border-slate-100/80'} p-5 rounded-2xl hover:shadow-xl hover:shadow-[#8A7AB5]/10 hover:border-[#8A7AB5]/30 transition-all cursor-pointer group flex flex-col h-full relative`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-slate-50 group-hover:bg-[#8A7AB5]/10 rounded-xl transition-colors">
                  <FolderKanban size={20} className="text-slate-400 group-hover:text-[#8A7AB5]" />
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                    project.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 
                    project.status === 'Completed' ? 'bg-slate-900 text-white' : 'bg-rose-50 text-rose-600'
                  }`}>
                    {project.status}
                  </span>
                  {isProjectCompleted(project.name) && (
                    <span className="text-[7px] font-black text-[#8A7AB5] uppercase flex items-center gap-0.5">
                      <Lock size={8} /> Locked
                    </span>
                  )}
                </div>
              </div>

              <h4 className="text-base font-bold text-slate-900 mb-1 group-hover:text-[#8A7AB5] transition-colors">{project.name}</h4>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">ID: {project.id}</p>

              <div className="mt-auto space-y-4">
                <div className="flex justify-between items-center">
                  {isManager ? (
                    <>
                      <div className="flex items-center gap-1.5">
                        <Users size={12} className="text-[#8A7AB5]" />
                        <span className="text-[10px] font-bold text-slate-600">{project.members || 0} Members</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Activity size={12} className="text-emerald-500" />
                        <span className="text-[10px] font-bold text-slate-600">{project.health}% Health</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck size={12} className="text-[#8A7AB5]" />
                        <span className="text-[10px] font-bold text-slate-600">Active Duty</span>
                      </div>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Click to View Details</span>
                    </>
                  )}
                </div>

                {isManager && (
                  <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${project.health > 80 ? 'bg-emerald-500' : 'bg-[#8A7AB5]'}`}
                      style={{ width: `${project.health}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsView;
