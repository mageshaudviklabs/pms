
import React from 'react';
import { Plus, Upload, Trash2 } from 'lucide-react';
import LeadCard from '../LeadCard';
import ProjectsList from '../ProjectsList';
import TaskTable from '../TaskTable';
import { Lead, Project, TaskRecord } from '../../types';

interface Props {
  leads: Lead[];
  projects: Project[];
  tasks: TaskRecord[];
  isImporting: boolean;
  onLeadClick: (lead: Lead) => void;
  onProjectClick: (id: string) => void;
  onNewTask: () => void;
  onNewProject: () => void;
  onImportClick: () => void;
  onClearTasks: () => void;
  onEditTask: (task: TaskRecord) => void;
  onDeleteTask: (id: string) => void;
}

const ManagerDashboard: React.FC<Props> = ({
  leads,
  projects,
  tasks,
  isImporting,
  onLeadClick,
  onProjectClick,
  onNewTask,
  onNewProject,
  onImportClick,
  onClearTasks,
  onEditTask,
  onDeleteTask
}) => {
  return (
    <div className="p-6 md:p-8 max-w-[1500px] mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Command Center</h1>
          <p className="text-sm text-slate-500 font-medium leading-relaxed">
            Global project lifecycle hub. Manage all active workstreams and talent allocation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {tasks.length > 0 && (
            <button onClick={onClearTasks} className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-rose-100 text-rose-500 rounded-xl text-[10px] font-black shadow-sm hover:bg-rose-50 transition-all uppercase tracking-widest">
              <Trash2 size={14} /> Reset
            </button>
          )}
          <button onClick={onImportClick} disabled={isImporting} className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-slate-100 text-slate-800 rounded-xl text-[10px] font-black shadow-sm hover:border-[#8A7AB5]/30 hover:bg-slate-50 transition-all uppercase tracking-widest disabled:opacity-50">
            <Upload size={14} className="text-[#8A7AB5]" /> {isImporting ? '...' : 'Upload'}
          </button>
          <button onClick={onNewTask} className="flex items-center gap-2 px-6 py-2.5 bg-sky-400 text-white rounded-xl text-[10px] font-black shadow-lg shadow-sky-400/20 hover:bg-sky-500 transition-all uppercase tracking-widest active:scale-95">
            <Plus size={16} /> New Task
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <div className="xl:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Assignment Ranking</h3>
            <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[9px] font-black rounded uppercase tracking-wider">PMS Live</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {leads.map(lead => (
              <LeadCard key={lead.id} lead={lead} onClick={() => onLeadClick(lead)} />
            ))}
          </div>
        </div>
        <div className="xl:col-span-4 sticky top-24">
          <ProjectsList 
            isManager={true}
            projects={projects} 
            onNewProject={onNewProject} 
            onProjectClick={onProjectClick}
          />
        </div>
      </div>

      <div className="space-y-5 pt-8 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 rounded-full bg-[#8A7AB5]" />
            <h3 className="text-xl font-bold text-slate-900">Global Task Stream</h3>
          </div>
          <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
            {tasks.length} Records
          </div>
        </div>
        <TaskTable tasks={tasks} onEdit={onEditTask} onDelete={onDeleteTask} />
      </div>
    </div>
  );
};

export default ManagerDashboard;
