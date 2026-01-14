
import React from 'react';
import { TaskRecord } from '../types';
import { CheckCircle2, AlertCircle, Timer, XCircle, Edit2, Trash2, Link, Upload } from 'lucide-react';

interface Props {
  tasks: TaskRecord[];
  onEdit?: (task: TaskRecord) => void;
  onDelete?: (taskId: string) => void;
}

const TaskTable: React.FC<Props> = ({ tasks, onEdit, onDelete }) => {
  const showActions = !!onEdit || !!onDelete;

  const getStatusStyle = (status: TaskRecord['completionStatus']) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'In Progress': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Pending': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Delayed': return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  const getStatusIcon = (status: TaskRecord['completionStatus']) => {
    switch (status) {
      case 'Completed': return <CheckCircle2 size={10} />;
      case 'In Progress': return <Timer size={10} className="animate-spin-slow" />;
      case 'Pending': return <AlertCircle size={10} />;
      case 'Delayed': return <XCircle size={10} />;
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1200px]">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-5 py-3 text-[9px] font-bold text-gray-400 uppercase tracking-[0.1em]">Lead</th>
              <th className="px-5 py-3 text-[9px] font-bold text-gray-400 uppercase tracking-[0.1em]">Project</th>
              <th className="px-5 py-3 text-[9px] font-bold text-gray-400 uppercase tracking-[0.1em]">Task</th>
              <th className="px-5 py-3 text-[9px] font-bold text-gray-400 uppercase tracking-[0.1em]">Assigned</th>
              <th className="px-5 py-3 text-[9px] font-bold text-gray-400 uppercase tracking-[0.1em] text-center">Timing</th>
              <th className="px-5 py-3 text-[9px] font-bold text-gray-400 uppercase tracking-[0.1em]">Status</th>
              <th className="px-5 py-3 text-[9px] font-bold text-gray-400 uppercase tracking-[0.1em]">Remarks</th>
              {showActions && <th className="px-5 py-3 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {tasks.map((task, idx) => (
              <tr key={task.id || idx} className="hover:bg-[#8A7AB5]/5 transition-colors group">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-[#8A7AB5] text-[10px] font-black">
                      {task.employeeName.charAt(0)}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold text-gray-900">{task.employeeName}</span>
                      <span className="text-[8px] font-bold text-[#8A7AB5] tracking-widest uppercase">{task.role}</span>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <span className="px-2 py-0.5 bg-white border border-gray-100 rounded text-[9px] font-bold text-slate-600 uppercase">
                    {task.projectName}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[11px] font-bold text-gray-800 line-clamp-1">{task.taskAssigned}</span>
                    {task.repoUrl && (
                      <div className="flex items-center gap-1 text-[#8A7AB5]">
                        <Link size={8} />
                        <span className="text-[8px] font-bold truncate max-w-[120px] hover:underline cursor-pointer">
                          {task.repoUrl}
                        </span>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-5 py-3">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-medium text-gray-500">by {task.projectAssignedBy}</span>
                    <span className="text-[8px] text-gray-400">{task.date}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-center">
                  <div className="flex flex-col items-center">
                    <span className="text-[9px] font-bold text-gray-700 leading-tight">{task.startTime} - {task.endTime}</span>
                    <span className="text-[8px] font-bold text-rose-400 uppercase tracking-tighter">Due: {task.completionDue}</span>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border text-[8px] font-black uppercase tracking-wider ${getStatusStyle(task.completionStatus)}`}>
                    {getStatusIcon(task.completionStatus)}
                    {task.completionStatus}
                  </div>
                </td>
                <td className="px-5 py-3">
                  <span className={`text-[9px] font-bold max-w-[120px] block truncate ${task.remarks.toLowerCase().includes('delay') ? 'text-rose-500' : 'text-emerald-500'}`}>
                    {task.remarks}
                  </span>
                </td>
                {showActions && (
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {onEdit && (
                        <button 
                          onClick={() => onEdit(task)}
                          className="p-1.5 text-slate-400 hover:text-[#8A7AB5] hover:bg-[#8A7AB5]/10 rounded-lg transition-all"
                          title="Edit Workstream"
                        >
                          <Edit2 size={14} />
                        </button>
                      )}
                      {onDelete && (
                        <button 
                          onClick={() => onDelete(task.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                          title="Terminate Task"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {tasks.length === 0 && (
        <div className="p-16 flex flex-col items-center justify-center text-gray-300">
          <Upload size={24} className="mb-2" />
          <h4 className="text-xs font-bold text-gray-500">No Stream</h4>
        </div>
      )}
    </div>
  );
};

export default TaskTable;
