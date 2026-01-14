
import React, { useState, useEffect } from 'react';
import { X, User, Briefcase, Calendar, FileText, Send, Link, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { LEADS } from '../constants';
import { TaskRecord, Project } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (task: TaskRecord) => void;
  onUpdate?: (task: TaskRecord) => void;
  taskToEdit?: TaskRecord | null;
  preselectedProjectName?: string | null;
  projects: Project[];
}

const TaskFormModal: React.FC<Props> = ({ 
  isOpen, 
  onClose, 
  onAdd, 
  onUpdate, 
  taskToEdit, 
  preselectedProjectName,
  projects 
}) => {
  const [isNewProjectMode, setIsNewProjectMode] = useState(false);
  const [formData, setFormData] = useState<Partial<TaskRecord>>({
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

  useEffect(() => {
    if (taskToEdit) {
      setFormData(taskToEdit);
      setIsNewProjectMode(false);
    } else if (preselectedProjectName) {
      setFormData({
        employeeName: '',
        role: '',
        projectName: preselectedProjectName,
        taskAssigned: '',
        taskDescription: '',
        projectAssignedBy: 'Manager',
        startTime: '09:00',
        endTime: '18:00',
        completionDue: new Date().toISOString().split('T')[0],
        completionStatus: 'Pending',
        remarks: `Member added from ${preselectedProjectName}`,
        repoUrl: ''
      });
      setIsNewProjectMode(false);
    } else {
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
      setIsNewProjectMode(false);
    }
  }, [taskToEdit, preselectedProjectName, isOpen]);

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

    if (taskToEdit && onUpdate) {
      onUpdate(formData as TaskRecord);
    } else {
      const newTask: TaskRecord = {
        ...formData as TaskRecord,
        id: `TASK-${Date.now()}`,
        employeeId: `EMP-${Math.floor(Math.random() * 9999)}`,
        date: new Date().toISOString().split('T')[0],
      };
      onAdd(newTask);
    }
    
    onClose();
  };

  const isProjectFixed = !!preselectedProjectName && !taskToEdit;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-xl font-black text-slate-900 uppercase">
              {taskToEdit ? 'Modify Workstream' : preselectedProjectName ? `Join ${preselectedProjectName}` : 'New Workstream'}
            </h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
              {taskToEdit ? 'Adjusting existing deployment' : preselectedProjectName ? 'Assigning specialist to active ecosystem' : 'Mission Assignment Details'}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-xl transition-colors text-slate-400">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Lead */}
            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <User size={10} className="text-[#8A7AB5]" /> Lead Name
              </label>
              <select 
                required
                className="w-full px-3 py-2 bg-slate-50 border-2 border-transparent focus:border-[#8A7AB5]/20 focus:bg-white rounded-xl outline-none text-xs font-semibold text-slate-700 transition-all appearance-none"
                value={formData.employeeName}
                onChange={e => handleLeadChange(e.target.value)}
              >
                <option value="">Select Lead...</option>
                {LEADS.map(s => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>

            {/* Role */}
            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck size={10} className="text-[#8A7AB5]" /> Role
              </label>
              <input 
                type="text" 
                readOnly
                placeholder="Auto-filled"
                className="w-full px-3 py-2 bg-slate-100/50 border-2 border-transparent rounded-xl text-xs font-semibold text-slate-500"
                value={formData.role}
              />
            </div>

            {/* Project - Dynamic Select */}
            <div className="md:col-span-2 space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Briefcase size={10} className="text-[#8A7AB5]" /> Ecosystem / Project
                </label>
                {!taskToEdit && !preselectedProjectName && (
                  <button 
                    type="button"
                    onClick={() => setIsNewProjectMode(!isNewProjectMode)}
                    className="text-[8px] font-black text-[#8A7AB5] uppercase hover:underline"
                  >
                    {isNewProjectMode ? "Select Existing" : "Create New Ecosystem"}
                  </button>
                )}
                {preselectedProjectName && (
                  <span className="text-[8px] font-black text-sky-500 uppercase px-2 py-0.5 bg-sky-50 rounded">Pre-Selected</span>
                )}
              </div>
              
              {isNewProjectMode ? (
                <input 
                  required
                  type="text" 
                  placeholder="Enter new project name..."
                  className="w-full px-3 py-2 bg-[#8A7AB5]/5 border-2 border-[#8A7AB5]/20 rounded-xl outline-none text-xs font-semibold text-[#8A7AB5] transition-all"
                  value={formData.projectName}
                  onChange={e => setFormData({...formData, projectName: e.target.value})}
                  autoFocus
                />
              ) : (
                <select 
                  required
                  disabled={isProjectFixed}
                  className={`w-full px-3 py-2 border-2 border-transparent rounded-xl outline-none text-xs font-semibold transition-all appearance-none ${
                    isProjectFixed ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-slate-50 focus:border-[#8A7AB5]/20 focus:bg-white text-slate-700'
                  }`}
                  value={formData.projectName}
                  onChange={e => setFormData({...formData, projectName: e.target.value})}
                >
                  <option value="">Choose Ecosystem...</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.name}>{p.name}</option>
                  ))}
                </select>
              )}
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <FileText size={10} className="text-[#8A7AB5]" /> Task Assigned
              </label>
              <input 
                required
                type="text" 
                placeholder="Mission description"
                className="w-full px-3 py-2 bg-slate-50 border-2 border-transparent focus:border-[#8A7AB5]/20 focus:bg-white rounded-xl outline-none text-xs font-semibold text-slate-700 transition-all"
                value={formData.taskAssigned}
                onChange={e => setFormData({...formData, taskAssigned: e.target.value})}
              />
            </div>

            {/* Status Selector - Only visible during Edit or for detail work */}
            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <CheckCircle2 size={10} className="text-[#8A7AB5]" /> Work Status
              </label>
              <select 
                className="w-full px-3 py-2 bg-slate-50 border-2 border-transparent focus:border-[#8A7AB5]/20 focus:bg-white rounded-xl outline-none text-xs font-semibold text-slate-700 transition-all appearance-none"
                value={formData.completionStatus}
                onChange={e => setFormData({...formData, completionStatus: e.target.value as any})}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Delayed">Delayed</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Calendar size={10} className="text-[#8A7AB5]" /> Completion Due
              </label>
              <input 
                type="date"
                className="w-full px-3 py-2 bg-slate-50 border-transparent border-2 focus:border-[#8A7AB5]/20 rounded-xl text-[10px] font-bold text-slate-600"
                value={formData.completionDue}
                onChange={e => setFormData({...formData, completionDue: e.target.value})}
              />
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Link size={10} className="text-[#8A7AB5]" /> Repo URL
              </label>
              <input 
                type="text" 
                placeholder="https://..."
                className="w-full px-3 py-2 bg-slate-50 border-2 border-transparent focus:border-[#8A7AB5]/20 focus:bg-white rounded-xl outline-none text-xs font-semibold text-slate-700 transition-all"
                value={formData.repoUrl}
                onChange={e => setFormData({...formData, repoUrl: e.target.value})}
              />
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Manager Remarks</label>
              <textarea 
                rows={2}
                className="w-full px-3 py-2 bg-slate-50 border-2 border-transparent focus:border-[#8A7AB5]/20 focus:bg-white rounded-xl outline-none text-xs font-semibold text-slate-700 transition-all resize-none"
                value={formData.remarks}
                onChange={e => setFormData({...formData, remarks: e.target.value})}
                placeholder="Notes regarding this assignment..."
              />
            </div>
          </div>

          <button 
            type="submit"
            className={`w-full py-3 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg transition-all flex items-center justify-center gap-2 active:scale-[0.98] ${
              preselectedProjectName && !taskToEdit ? 'bg-sky-400 shadow-sky-400/10 hover:bg-sky-500' : 'bg-slate-900 shadow-slate-900/10 hover:bg-[#8A7AB5]'
            }`}
          >
            <Send size={14} />
            {taskToEdit ? 'Update Deployment' : preselectedProjectName ? 'Deploy to Ecosystem' : 'Commit Task'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaskFormModal;
