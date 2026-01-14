
import React, { useState } from 'react';
import { X, FolderPlus, Activity, Shield } from 'lucide-react';
import { Project } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (project: Project) => void;
}

const ProjectFormModal: React.FC<Props> = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [status, setStatus] = useState<Project['status']>('Active');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    onAdd({
      id: `PRJ-${Math.floor(Math.random() * 1000)}`,
      name,
      status,
      health: 100
    });
    setName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-300">
        <div className="p-5 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#8A7AB5] text-white rounded-lg">
              <FolderPlus size={18} />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">New Ecosystem</h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Initialize Project</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-white rounded-lg transition-colors text-slate-400">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Shield size={10} className="text-[#8A7AB5]" /> Project Identifier
            </label>
            <input 
              required
              type="text" 
              placeholder="e.g. Phoenix Engine"
              className="w-full px-3 py-2 bg-slate-50 border-2 border-transparent focus:border-[#8A7AB5]/20 focus:bg-white rounded-xl outline-none text-xs font-semibold text-slate-700 transition-all"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Activity size={10} className="text-[#8A7AB5]" /> Initial Status
            </label>
            <select 
              className="w-full px-3 py-2 bg-slate-50 border-2 border-transparent focus:border-[#8A7AB5]/20 focus:bg-white rounded-xl outline-none text-xs font-semibold text-slate-700 transition-all appearance-none"
              value={status}
              onChange={e => setStatus(e.target.value as any)}
            >
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Review">Review</option>
            </select>
          </div>

          <button 
            type="submit"
            className="w-full py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-slate-900/10 hover:bg-[#8A7AB5] transition-all active:scale-[0.98]"
          >
            Create Ecosystem
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProjectFormModal;
