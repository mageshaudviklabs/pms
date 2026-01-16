
import React from 'react';
import { TaskRecord, UserProfile } from '../types';
import { Briefcase, Target, Clock, AlertTriangle, CheckCircle2, History } from 'lucide-react';

interface Props {
  user: UserProfile;
  activeTasks: TaskRecord[]; // Filtered for active projects only
  allTasks: TaskRecord[];    // All tasks for history/completed count
}

const EmployeeDashboardCard: React.FC<Props> = ({ user, activeTasks, allTasks }) => {
  const activeCount = activeTasks.length;
  const activeEcosystemsCount = new Set(activeTasks.map(t => t.projectName)).size;
  const delayedCount = activeTasks.filter(t => t.completionStatus === 'Delayed').length;
  const inProgressCount = activeTasks.filter(t => t.completionStatus === 'In Progress').length;
  
  // Historical achievement: Count all completed tasks across all projects
  const totalCompletedCount = allTasks.filter(t => t.completionStatus === 'Completed').length;

  return (
    <div className="bg-white border border-slate-100 rounded-[32px] overflow-hidden shadow-xl shadow-slate-200/40 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="p-8 md:p-10 flex flex-col xl:flex-row gap-10 items-center xl:items-start">
        {/* Profile Section */}
        <div className="flex flex-col items-center text-center space-y-4 min-w-[200px]">
          <div className="relative">
            <div className="p-1 rounded-[32px] border-4 border-[#8A7AB5]/20">
              <img 
                src={user.avatar} 
                className="w-32 h-32 rounded-[28px] object-cover shadow-2xl"
                alt={user.name}
              />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center text-white">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 leading-tight">{user.name}</h2>
            <p className="text-[10px] font-black text-[#8A7AB5] uppercase tracking-[0.3em] mt-1">{user.role}</p>
          </div>
        </div>

        {/* Vertical Divider */}
        <div className="hidden xl:block w-px bg-slate-100 self-stretch" />

        {/* Stats Grid - 5 Cards */}
        <div className="flex-1 w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
          <div className="bg-slate-50/50 p-5 rounded-[24px] border border-slate-100 hover:bg-white hover:shadow-lg transition-all group">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-[#8A7AB5]/10 rounded-xl text-[#8A7AB5] group-hover:bg-[#8A7AB5] group-hover:text-white transition-colors">
                <Target size={16} />
              </div>
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Active Missions</span>
            </div>
            <p className="text-2xl font-black text-slate-900">{activeCount}</p>
          </div>

          <div className="bg-slate-50/50 p-5 rounded-[24px] border border-slate-100 hover:bg-white hover:shadow-lg transition-all group">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-sky-400/10 rounded-xl text-sky-500 group-hover:bg-sky-400 group-hover:text-white transition-colors">
                <Briefcase size={16} />
              </div>
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Active Ecosystems</span>
            </div>
            <p className="text-2xl font-black text-slate-900">{activeEcosystemsCount}</p>
          </div>

          <div className="bg-slate-50/50 p-5 rounded-[24px] border border-slate-100 hover:bg-white hover:shadow-lg transition-all group">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-amber-400/10 rounded-xl text-amber-500 group-hover:bg-amber-400 group-hover:text-white transition-colors">
                <Clock size={16} />
              </div>
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">In Progress</span>
            </div>
            <p className="text-2xl font-black text-slate-900">{inProgressCount}</p>
          </div>

          <div className="bg-slate-50/50 p-5 rounded-[24px] border border-slate-100 hover:bg-white hover:shadow-lg transition-all group">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-rose-400/10 rounded-xl text-rose-500 group-hover:bg-rose-400 group-hover:text-white transition-colors">
                <AlertTriangle size={16} />
              </div>
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Delayed</span>
            </div>
            <p className="text-2xl font-black text-slate-900">{delayedCount}</p>
          </div>

          {/* New Completed Missions Stat Card */}
          <div className="bg-emerald-50/30 p-5 rounded-[24px] border border-emerald-100/50 hover:bg-white hover:shadow-lg transition-all group">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                <CheckCircle2 size={16} />
              </div>
              <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">Completed Missions</span>
            </div>
            <p className="text-2xl font-black text-emerald-700">{totalCompletedCount}</p>
          </div>
        </div>
      </div>

      {/* Mission Progress Footer */}
      <div className="px-8 py-6 bg-slate-50/80 border-t border-slate-100 flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <History size={16} className="text-[#8A7AB5]" />
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Performance Record Logged</span>
          </div>
          <div className="h-4 w-px bg-slate-200" />
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-sky-400" />
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Active Deployment Monitoring</span>
          </div>
        </div>
        
        <div className="flex-1 max-w-md h-2 bg-white rounded-full overflow-hidden border border-slate-200 shadow-inner">
          <div 
            className="h-full bg-gradient-to-r from-[#8A7AB5] to-sky-400 transition-all duration-1000 ease-out"
            style={{ width: activeCount > 0 ? `${(activeTasks.filter(t => t.completionStatus === 'Completed').length / activeCount) * 100}%` : '0%' }}
          />
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboardCard;
