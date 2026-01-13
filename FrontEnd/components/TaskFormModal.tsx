
import React, { useState } from 'react';
import { X, User, Briefcase, Calendar, FileText, Send, Link, ShieldCheck } from 'lucide-react';
import { LEADS } from '../constants';
import { TaskRecord } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (task: TaskRecord) => void;
}

const TaskFormModal: React.FC<Props> = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState<Partial<TaskRecord>>({
    employeeName: '',
    role: '',
    projectName: '',
    taskAssigned: '',
    taskDescription: '',
    projectAssignedBy: 'Manager',
    startTime: '09:00', // Default kept in state
    endTime: '18:00',   // Default kept in state
    completionDue: new Date().toISOString().split('T')[0],
    completionStatus: 'Pending',
    remarks: 'Manual Entry',
    repoUrl: ''
  });

  if (!isOpen) return null;

  const handleLeadChange = (name: string) => {
    const selectedLead = LEADS.find(l => l.name === name);
    setFormData({
      ...formData,
      employeeName: name,
      role: selectedLead ? selectedLead.role : ''
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.employeeName || !formData.projectName || !formData.taskAssigned) {
      alert('Please fill in Lead, Project, and Task');
      return;
    }

    const newTask: TaskRecord = {
      ...formData as TaskRecord,
      employeeId: `EMP-${Math.floor(Math.random() * 9999)}`,
      date: new Date().toISOString().split('T')[0],
    };

    onAdd(newTask);
    onClose();
    // Reset to defaults
    setFormData({
      employeeName: '',
      role: '',
      projectName: '',
      taskAssigned: '',
      taskDescription: '',
      projectAssignedBy: 'Manager',
      startTime: '09:00',
      endTime: '18:00',
      completionDue: new Date().toISOString().split('T')[0],
      completionStatus: 'Pending',
      remarks: 'Manual Entry',
      repoUrl: ''
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-2xl font-black text-slate-900">New Workstream</h3>
            <p className="text-sm text-slate-500 font-medium mt-1">Fill in the assignment details below.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-xl transition-colors text-slate-400">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 overflow-y-auto space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Row 1 */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <User size={12} className="text-[#8A7AB5]" /> Lead Name
              </label>
              <select 
                required
                className="w-full px-4 py-2.5 bg-slate-50 border-2 border-transparent focus:border-[#8A7AB5]/20 focus:bg-white rounded-xl outline-none text-sm font-semibold text-slate-700 transition-all appearance-none"
                value={formData.employeeName}
                onChange={e => handleLeadChange(e.target.value)}
              >
                <option value="">Select Lead...</option>
                {LEADS.map(s => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck size={12} className="text-[#8A7AB5]" /> Role
              </label>
              <input 
                type="text" 
                readOnly
                placeholder="Auto-filled"
                className="w-full px-4 py-2.5 bg-slate-100/50 border-2 border-transparent rounded-xl text-sm font-semibold text-slate-500"
                value={formData.role}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Briefcase size={12} className="text-[#8A7AB5]" /> Project Name
              </label>
              <input 
                required
                type="text" 
                placeholder="Genesis Phase 1"
                className="w-full px-4 py-2.5 bg-slate-50 border-2 border-transparent focus:border-[#8A7AB5]/20 focus:bg-white rounded-xl outline-none text-sm font-semibold text-slate-700 transition-all"
                value={formData.projectName}
                onChange={e => setFormData({...formData, projectName: e.target.value})}
              />
            </div>

            {/* Row 2 */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <FileText size={12} className="text-[#8A7AB5]" /> Task Assigned
              </label>
              <input 
                required
                type="text" 
                placeholder="Describe the primary mission"
                className="w-full px-4 py-2.5 bg-slate-50 border-2 border-transparent focus:border-[#8A7AB5]/20 focus:bg-white rounded-xl outline-none text-sm font-semibold text-slate-700 transition-all"
                value={formData.taskAssigned}
                onChange={e => setFormData({...formData, taskAssigned: e.target.value})}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Link size={12} className="text-[#8A7AB5]" /> Repo / URL
              </label>
              <input 
                type="text" 
                placeholder="https://github.com/..."
                className="w-full px-4 py-2.5 bg-slate-50 border-2 border-transparent focus:border-[#8A7AB5]/20 focus:bg-white rounded-xl outline-none text-sm font-semibold text-slate-700 transition-all"
                value={formData.repoUrl}
                onChange={e => setFormData({...formData, repoUrl: e.target.value})}
              />
            </div>

            {/* Row 3 - Start/End Time Removed, only Completion Due remains */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Calendar size={12} className="text-[#8A7AB5]" /> Completion Due
              </label>
              <input 
                type="date"
                className="w-full px-4 py-2.5 bg-slate-50 border-transparent border-2 focus:border-[#8A7AB5]/20 rounded-xl text-xs font-bold text-slate-600"
                value={formData.completionDue}
                onChange={e => setFormData({...formData, completionDue: e.target.value})}
              />
            </div>

            {/* Description */}
            <div className="md:col-span-3 lg:col-span-2 space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <FileText size={12} className="text-[#8A7AB5]" /> Task Description
              </label>
              <textarea 
                rows={2}
                placeholder="Provide detailed context for the assigned workstream..."
                className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent focus:border-[#8A7AB5]/20 focus:bg-white rounded-xl outline-none text-sm font-semibold text-slate-700 transition-all resize-none"
                value={formData.taskDescription}
                onChange={e => setFormData({...formData, taskDescription: e.target.value})}
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-slate-900/20 hover:bg-[#8A7AB5] transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
          >
            <Send size={16} />
            Commit to Lifecycle
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaskFormModal;
