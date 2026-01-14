
import React from 'react';
import { X, AlertTriangle, ArrowRight, Briefcase, UserMinus } from 'lucide-react';
import { Lead } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  lead: Lead | null;
  projectName: string;
}

const OffboardMemberModal: React.FC<Props> = ({ isOpen, onClose, onConfirm, lead, projectName }) => {
  if (!isOpen || !lead) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-300">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-rose-50/30">
          <div className="flex items-center gap-3 text-rose-600">
            <div className="p-2 bg-rose-100 rounded-xl">
              <AlertTriangle size={20} />
            </div>
            <h3 className="text-sm font-black uppercase tracking-tight">Confirm Offboarding</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-xl transition-colors text-slate-400">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-8 text-center">
          <div className="flex items-center justify-center gap-6">
            <div className="flex flex-col items-center gap-2">
              <div className="relative">
                <img 
                  src={lead.avatar} 
                  alt={lead.name} 
                  className="w-16 h-16 rounded-2xl object-cover border-4 border-white shadow-lg" 
                />
                <div className="absolute -bottom-1 -right-1 p-1 bg-white rounded-full shadow-sm text-[#8A7AB5]">
                   <UserMinus size={12} strokeWidth={3} />
                </div>
              </div>
              <span className="text-[10px] font-black text-slate-900 uppercase">{lead.name}</span>
            </div>

            <div className="flex items-center text-slate-200">
              <ArrowRight size={24} />
            </div>

            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-[#8A7AB5] shadow-inner">
                <Briefcase size={28} />
              </div>
              <span className="text-[10px] font-black text-slate-900 uppercase truncate max-w-[80px]">{projectName}</span>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-slate-600 leading-relaxed font-medium px-4">
              You are about to remove <span className="font-bold text-slate-900">{lead.name}</span> from the <span className="font-bold text-[#8A7AB5]">{projectName}</span> ecosystem.
            </p>
            <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100/50">
              <p className="text-[10px] text-rose-600 font-bold uppercase tracking-wider leading-relaxed">
                Warning: This will terminate all active mission assignments and workload records for this lead within this specific project. This action cannot be undone.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 py-3.5 bg-white border border-slate-200 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 py-3.5 bg-rose-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-rose-500/20 hover:bg-rose-600 transition-all"
          >
            Terminate
          </button>
        </div>
      </div>
    </div>
  );
};

export default OffboardMemberModal;
