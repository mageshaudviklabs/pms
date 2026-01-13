
import React from 'react';
import { X, Briefcase, ExternalLink, Calendar, CheckCircle2, Timer, AlertCircle, XCircle } from 'lucide-react';
import { Lead, TaskRecord } from '../types';

interface Props {
  lead: Lead | null;
  onClose: () => void;
  allTasks: TaskRecord[];
}

const LeadDetailModal: React.FC<Props> = ({ lead, onClose, allTasks }) => {
  if (!lead) return null;

  const leadTasks = allTasks.filter(t => 
    t.employeeName.toLowerCase().includes(lead.name.toLowerCase()) ||
    lead.name.toLowerCase().includes(t.employeeName.toLowerCase())
  );

  const getStatusColor = (status: TaskRecord['completionStatus']) => {
    switch (status) {
      case 'Completed': return 'text-emerald-500';
      case 'In Progress': return 'text-blue-500';
      case 'Pending': return 'text-amber-500';
      case 'Delayed': return 'text-rose-500';
      default: return 'text-slate-400';
    }
  };

  const getStatusIcon = (status: TaskRecord['completionStatus']) => {
    switch (status) {
      case 'Completed': return <CheckCircle2 size={14} />;
      case 'In Progress': return <Timer size={14} className="animate-spin-slow" />;
      case 'Pending': return <AlertCircle size={14} />;
      case 'Delayed': return <XCircle size={14} />;
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-300">
        {/* Header Profile */}
        <div className="p-8 bg-slate-50/50 border-b border-slate-100 flex items-start justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 -mr-8 -mt-8 opacity-[0.03] text-slate-900 pointer-events-none">
             <Briefcase size={200} />
          </div>
          
          <div className="flex gap-6 items-center relative z-10">
            <div className="relative">
               <img 
                src={lead.avatar} 
                alt={lead.name} 
                className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-xl" 
              />
              <div className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-4 border-white shadow-sm ${lead.availability === 0 ? 'bg-emerald-500' : 'bg-[#8A7AB5]'}`} />
            </div>
            
            <div className="space-y-1">
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">{lead.name}</h3>
              <div className="flex items-center gap-3">
                <span className="text-xs font-black text-[#8A7AB5] uppercase tracking-widest">{lead.role}</span>
                <span className="w-1 h-1 bg-slate-300 rounded-full" />
                <span className={`text-[10px] font-bold uppercase tracking-wider ${lead.availability === 0 ? 'text-emerald-500' : 'text-[#8A7AB5]'}`}>
                  {lead.availability === 0 ? 'Available for Missions' : `${lead.availability} Active Assignments`}
                </span>
              </div>
            </div>
          </div>

          <button 
            onClick={onClose} 
            className="p-3 bg-white hover:bg-slate-100 rounded-2xl transition-all shadow-sm border border-slate-100 text-slate-400"
          >
            <X size={20} />
          </button>
        </div>

        {/* Task List Section */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          <div className="flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-sm pb-4 z-10 border-b border-slate-50 mb-4">
            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Lifecycle Stream</h4>
            <span className="px-2.5 py-1 bg-[#8A7AB5]/10 text-[#8A7AB5] text-[10px] font-bold rounded-lg uppercase">
              Current Deployment
            </span>
          </div>

          {leadTasks.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
                <CheckCircle2 size={32} />
              </div>
              <div className="space-y-1">
                <p className="text-lg font-bold text-slate-900">Lead is Fully Available</p>
                <p className="text-sm text-slate-500">Ready to be assigned to new workstreams.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {leadTasks.map((task, idx) => (
                <div key={idx} className="group p-5 bg-slate-50 border border-slate-100 rounded-2xl hover:border-[#8A7AB5]/40 hover:bg-white transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-white border border-slate-200 text-[9px] font-black text-slate-700 rounded-md uppercase tracking-tighter">
                          {task.projectName}
                        </span>
                        <span className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${getStatusColor(task.completionStatus)}`}>
                          {getStatusIcon(task.completionStatus)}
                          {task.completionStatus}
                        </span>
                      </div>
                      <h5 className="text-base font-bold text-slate-900 group-hover:text-[#8A7AB5] transition-colors">{task.taskAssigned}</h5>
                    </div>
                    {task.repoUrl && (
                      <a 
                        href={task.repoUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="p-2 bg-white rounded-lg text-slate-400 hover:text-[#8A7AB5] hover:shadow-md transition-all"
                      >
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-slate-200/50">
                    <div className="flex items-center gap-4">
                       <div className="flex items-center gap-1.5 text-slate-500">
                        <Calendar size={12} />
                        <span className="text-[10px] font-bold uppercase tracking-tight">Due: {task.completionDue}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 italic">"{task.remarks}"</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex justify-end">
           <button 
            onClick={onClose}
            className="px-8 py-3.5 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-lg shadow-slate-900/10 hover:bg-[#8A7AB5] transition-all"
           >
            Close Insight
           </button>
        </div>
      </div>
    </div>
  );
};

export default LeadDetailModal;
