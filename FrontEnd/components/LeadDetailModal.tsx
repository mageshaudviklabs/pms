
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
             <Briefcase size