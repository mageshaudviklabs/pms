
import React from 'react';
import { Lead } from '../types';

interface Props {
  lead: Lead;
  onClick?: () => void;
}

const LeadCard: React.FC<Props> = ({ lead, onClick }) => {
  // Logic: 0 tasks = Available (Green), 1+ tasks = Busy (Lavender/Blue)
  const maxVisualTasks = 5;
  const progressPercentage = Math.min((lead.availability / maxVisualTasks) * 100, 100);
  const strokeDashoffset = 132 * (1 - progressPercentage / 100);

  return (
    <div 
      onClick={onClick}
      className="bg-white border border-slate-100 rounded-2xl p-5 hover:shadow-xl hover:shadow-[#8A7AB5]/10 hover:border-[#8A7AB5]/30 transition-all duration-300 group relative overflow-hidden cursor-pointer active:scale-[0.98]"
    >
      <div className="flex items-start justify-between mb-6">
        <div className="flex gap-4">
          <div className="relative">
            <div className={`p-0.5 rounded-xl border-2 transition-colors duration-500 ${lead.availability === 0 ? 'border-emerald-500' : 'border-[#8A7AB5]'}`}>
              <img 
                src={lead.avatar} 
                alt={lead.name} 
                className="w-14 h-14 rounded-lg object-cover" 
              />
            </div>
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white transition-colors duration-500 ${lead.availability === 0 ? 'bg-emerald-500' : 'bg-[#8A7AB5]'}`} />
          </div>
          <div className="pt-1">
            <h4 className="text-base font-bold text-slate-900 group-hover:text-[#8A7AB5] transition-colors">{lead.name}</h4>
            <span className="text-[10px] font-black text-[#8A7AB5] tracking-widest uppercase">{lead.role}</span>
          </div>
        </div>
        
        <div className="relative w-12 h-12 flex items-center justify-center">
          <svg className="absolute w-full h-full -rotate-90">
            <circle
              cx="24" cy="24" r="21"
              fill="none" stroke="#F1F5F9" strokeWidth="3"
            />
            <circle
              cx="24" cy="24" r="21"
              fill="none" 
              stroke={lead.availability === 0 ? '#10B981' : '#8A7AB5'} 
              strokeWidth="3"
              strokeDasharray="132"
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <span className="text-sm font-black text-slate-900">{lead.availability}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {lead.availability === 0 ? (
          <span className="px-3 py-1.5 bg-emerald-50 text-[10px] font-black text-emerald-600 rounded-lg tracking-widest uppercase border border-emerald-100">
            Available Lead
          </span>
        ) : (
          lead.tags.map((tag, i) => (
            <span 
              key={i} 
              className="px-3 py-1.5 bg-slate-50 text-[9px] font-bold text-slate-600 rounded-lg tracking-tight whitespace-nowrap overflow-hidden text-ellipsis max-w-[140px] border border-slate-100 group-hover:border-[#8A7AB5]/20 group-hover:bg-white transition-all"
              title={tag}
            >
              {tag.toUpperCase()}
            </span>
          ))
        )}
      </div>

      {/* View Detail Hint */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-[8px] font-black text-[#8A7AB5] uppercase tracking-tighter">Click for Detail</span>
      </div>
    </div>
  );
};

export default LeadCard;
