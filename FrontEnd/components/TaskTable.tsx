
import React from 'react';
import { TaskRecord } from '../types';
import { CheckCircle2, AlertCircle, Timer, XCircle, MoreVertical, Upload, Link } from 'lucide-react';

interface Props {
  tasks: TaskRecord[];
}

const TaskTable: React.FC<Props> = ({ tasks }) => {
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
      case 'Completed': return <CheckCircle2 size={12} />;
      case 'In Progress': return <Timer size={12} className="animate-spin-slow" />;
      case 'Pending': return <AlertCircle size={12} />;
      case 'Delayed': return <XCircle size={12} />;
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1400px]">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em]">Lead</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em]">Project</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em]">Task / Repo</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em]">Assignment</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em] text-center">Timing</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em]">Status</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em]">Remarks</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {tasks.map((task, idx) => (
              <tr key={idx} className="hover:bg-[#8A7AB5]/5 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-[#8A7AB5] text-[11px] font-black shadow-sm">
                      {task.employeeName.charAt(0)}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-gray-900">{task.employeeName}</span>
                      <span className="text-[9px] font-bold text-[#8A7AB5] tracking-widest uppercase">{task.role}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 bg-white border border-gray-100 rounded-lg text-[10px] font-bold text-slate-700 uppercase shadow-sm">
                    {task.projectName}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-gray-800 line-clamp-1">{task.taskAssigned}</span>
                    {task.repoUrl && (
                      <div className="flex items-center gap-1.5 text-[#8A7AB5]">
                        <Link size={10} />
                        <span className="text-[10px] font-bold truncate max-w-[150px] hover:underline cursor-pointer">
                          {task.repoUrl}
                        </span>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-gray-600">by {task.projectAssignedBy}</span>
                    <span className="text-[9px] text-gray-400">{task.date}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-bold text-gray-700 leading-tight">{task.startTime} - {task.endTime}</span>
                    <span className="text-[9px] font-bold text-rose-400 uppercase tracking-tighter">Due: {task.completionDue}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-wider ${getStatusStyle(task.completionStatus)}`}>
                    {getStatusIcon(task.completionStatus)}
                    {task.completionStatus}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-[10px] font-bold max-w-[150px] block truncate ${task.remarks.toLowerCase().includes('delay') ? 'text-rose-500' : 'text-emerald-500'}`}>
                    {task.remarks}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 text-gray-300 hover:text-gray-600 transition-colors">
                    <MoreVertical size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {tasks.length === 0 && (
        <div className="p-20 flex flex-col items-center justify-center text-gray-300">
          <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mb-4 border border-dashed border-gray-200">
            <Upload size={32} />
          </div>
          <h4 className="text-sm font-bold text-gray-500">No Lifecycle Data</h4>
          <p className="text-xs mt-1">Upload the deployment stream or create a new manual workstream.</p>
        </div>
      )}
    </div>
  );
};

export default TaskTable;
