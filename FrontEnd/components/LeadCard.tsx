
import React from 'react';
import { Lead } from '../types';

interface Props {
  lead: Lead;
  onClick?: () => void;
}

const LeadCard: React.FC<Props> = ({ lead, onClick }) => {
  const maxVisualTasks = 5;
  const progressPercentage = Math.min((lead.availability / maxVisualTasks) * 100, 100);
  const strokeDashoffset = 113 * (1 - progressPercentage / 100); // Adjusted for smaller R

  return (
    <div 
      onClick={onClick}
      className="bg-white border border-slate-100 rounded-xl p-4 hover:shadow-lg hover:shadow-[#8A7AB5]/10 hover:border-[#8A7AB5]/30 transition-all duration-300 group relative overflow-hidden cursor-pointer active:scale-[0.98]"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex gap-3">
          <div className="relative">
            <div className={`p-0.5 rounded-lg border-2 transition-colors duration-500 ${lead.availability === 0 ? 'border-emerald-500' : 'border-[#8A7AB5]'}`}>
              <img 
                src={lead.avatar} 
                alt={lead.name} 
                className="w-11 h-11 rounded-md object-cover" 
              />
            </div>
            <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white transition-colors duration-500 ${lead.availability === 0 ? 'bg-emerald-500' : 'bg-[#8A7AB5]'}`} />
          </div>
          <div className="pt-0.5">
            <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#8A7AB5] transition-colors">{lead.name}</h4>
            <span className="text-[9px] font-black text-[#8A7AB5] tracking-widest uppercase">{lead.role}</span>
          </div>
        </div>
        
        <div className="relative w-10 h-10 flex items-center justify-center">
          <svg className="absolute w-full h-full -rotate-90">
            <circle
              cx="20" cy="20" r="18"
              fill="none" stroke="#F1F5F9" strokeWidth="2.5"
            />
            <circle
              cx="20" cy="20" r="18"
              fill="none" 
              stroke={lead.availability === 0 ? '#10B981' : '#8A7AB5'} 
              strokeWidth="2.5"
              strokeDasharray="113"
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <span className="text-xs font-black text-slate-900">{lead.availability}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {lead.availability === 0 ? (
          <span className="px-2 py-1 bg-emerald-50 text-[9px] font-black text-emerald-600 rounded-md tracking-wider uppercase border border-emerald-100">
            Available
          </span>
        ) : (
          lead.tags.map((tag, i) => (
            <span 
              key={i} 
              className="px-2 py-1 bg-slate-50 text-[8px] font-bold text-slate-600 rounded-md tracking-tight whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px] border border-slate-100 group-hover:border-[#8A7AB5]/20 group-hover:bg-white transition-all"
              title={tag}
            >
              {tag.toUpperCase()}
            </span>
          ))
        )}
      </div>

      <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-[7px] font-black text-[#8A7AB5] uppercase tracking-tighter">View</span>
      </div>
    </div>
  );
};

export default LeadCard;
