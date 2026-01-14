
import React from 'react';
import { Project, TaskRecord } from '../types';
import { FolderKanban, ShieldCheck, ListChecks, ArrowRight } from 'lucide-react';

interface Props {
  projects: Project[];
  tasks: TaskRecord[];
  onProjectClick?: (projectId: string) => void;
}

const EmployeeProjectsGrid: React.FC<Props> = ({ projects, tasks, onProjectClick }) => {
  // Helper to get the employee's role in a specific project
  const getRoleInProject = (projectName: string) => {
    const projectTask = tasks.find(t => t.projectName.toLowerCase() === projectName.toLowerCase());
    return projectTask ? projectTask.role : 'Specialist';
  };

  // Helper to get task count for this specific employee in this project
  const getTaskCountInProject = (projectName: string) => {
    return tasks.filter(t => t.projectName.toLowerCase() === projectName.toLowerCase()).length;
  };

  const getStatusStyle = (status: Project['status']) => {
    switch (status) {
      case 'Active': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Delayed': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'Review': return 'bg-[#8A7AB5]/10 text-[#8A7AB5] border-[#8A7AB5]/20';
      case 'Completed': return 'bg-sky-50 text-sky-600 border-sky-100';
      default: return 'bg-slate-50 text-slate-500 border-slate-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-1 h-5 bg-[#8A7AB5] rounded-full" />
        <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Current Projects Portfolio</h3>
      </div>

      {projects.length === 0 ? (
        <div className="p-10 border-2 border-dashed border-slate-100 rounded-[24px] text-center bg-white/50">
          <FolderKanban size={24} className="mx-auto text-slate-200 mb-2" />
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No assigned ecosystems found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project) => (
            <div 
              key={project.id}
              onClick={() => onProjectClick?.(project.id)}
              className="bg-white border border-slate-100 p-6 rounded-[24px] shadow-sm hover:shadow-xl hover:shadow-[#8A7AB5]/10 hover:border-[#8A7AB5]/30 transition-all group flex flex-col h-full cursor-pointer relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-5 relative z-10">
                <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-[#8A7AB5]/10 transition-colors">
                  <FolderKanban size={20} className="text-slate-400 group-hover:text-[#8A7AB5]" />
                </div>
                <div className={`px-2.5 py-1 rounded-full border text-[8px] font-black uppercase tracking-wider ${getStatusStyle(project.status)}`}>
                  {project.status}
                </div>
              </div>

              <div className="space-y-4 flex-1 relative z-10">
                <div>
                  <h4 className="text-sm font-black text-slate-900 leading-tight mb-1 group-hover:text-[#8A7AB5] transition-colors">
                    {project.name}
                  </h4>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">ID: {project.id}</p>
                </div>

                <div className="pt-4 border-t border-slate-50 space-y-3">
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck size={14} className="text-[#8A7AB5]" />
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Your Role</span>
                      <span className="text-[10px] font-bold text-slate-700">{getRoleInProject(project.name)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2.5">
                    <ListChecks size={14} className="text-sky-500" />
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">My Assignments</span>
                      <span className="text-[10px] font-bold text-slate-700">
                        {getTaskCountInProject(project.name)} {getTaskCountInProject(project.name) === 1 ? 'Task' : 'Tasks'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hover indicator */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">
                <div className="flex items-center gap-1 text-[8px] font-black text-[#8A7AB5] uppercase">
                  Details <ArrowRight size={10} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmployeeProjectsGrid;
