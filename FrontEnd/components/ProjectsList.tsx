
import React from 'react';
import { Project } from '../types';
import { FolderKanban, Users, Activity, Plus } from 'lucide-react';

interface Props {
  projects: Project[];
  onNewProject?: () => void;
  onProjectClick?: (projectId: string) => void;
  isManager?: boolean;
}

const ProjectsList: React.FC<Props> = ({ projects, onNewProject, onProjectClick, isManager = false }) => {
  return (
    <div className="bg-[#1A1C2C] rounded-[24px] p-6 text-white shadow-xl h-full flex flex-col border border-white/5 min-h-[500px]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Ecosystems</h3>
        {isManager && onNewProject && (
          <button 
            onClick={onNewProject}
            className="p-1.5 bg-[#8A7AB5]/20 text-[#8A7AB5] hover:bg-[#8A7AB5] hover:text-white rounded-lg transition-all border border-[#8A7AB5]/30 group"
            title="Manual Creation"
          >
            <Plus size={14} className="group-active:scale-90" />
          </button>
        )}
      </div>
      
      <div className="space-y-3 flex-1 overflow-y-auto pr-1 custom-scrollbar">
        {projects.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-3 py-10">
            <FolderKanban size={32} strokeWidth={1} className="opacity-20" />
            <p className="text-[9px] font-bold uppercase tracking-widest text-center">No active streams found</p>
          </div>
        ) : (
          projects.map((project) => (
            <div 
              key={project.id} 
              onClick={() => onProjectClick?.(project.id)}
              className="group p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all cursor-pointer"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-white group-hover:text-[#8A7AB5] transition-colors">{project.name}</h4>
                  <div className="flex items-center gap-1.5">
                     <div className={`w-1 h-1 rounded-full ${project.status === 'Active' ? 'bg-emerald-500' : project.status === 'Delayed' ? 'bg-rose-500' : 'bg-[#8A7AB5]'}`} />
                     <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{project.status}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 px-1.5 py-0.5 bg-white/5 rounded border border-white/5" title="Active Members">
                  <Users size={8} className="text-slate-400" />
                  <span className="text-[9px] font-black text-white">{project.members || 0}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[8px] font-bold uppercase tracking-widest text-slate-500">
                  <span>Health</span>
                  <span className={project.health > 80 ? 'text-emerald-400' : 'text-[#8A7AB5]'}>{project.health}%</span>
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ 
                      width: `${project.health}%`, 
                      backgroundColor: project.health > 80 ? '#10B981' : '#8A7AB5' 
                    }}
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <button className="w-full mt-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-[9px] font-black uppercase tracking-[0.1em] rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 group">
        <Activity size={12} className="group-hover:text-[#8A7AB5] transition-colors" />
        Full Analytics
      </button>
    </div>
  );
};

export default ProjectsList;
