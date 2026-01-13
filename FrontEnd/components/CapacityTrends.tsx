
import React from 'react';
import { CAPACITY_TRENDS } from '../constants';

const CapacityTrends: React.FC = () => {
  return (
    <div className="bg-[#1A1C2C] rounded-3xl p-8 text-white shadow-2xl h-full flex flex-col">
      <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-10">Capacity Trends</h3>
      
      <div className="space-y-8 flex-1">
        {CAPACITY_TRENDS.map((item, idx) => (
          <div key={idx} className="space-y-3">
            <div className="flex justify-between items-end">
              <span className="text-[10px] font-bold tracking-[0.1em] text-slate-400 uppercase">{item.label}</span>
              <span className="text-xs font-black text-[#8A7AB5]">{item.value}%</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full transition-all duration-1000 ease-out rounded-full shadow-[0_0_10px_rgba(138,122,181,0.3)]"
                style={{ width: `${item.value}%`, backgroundColor: item.color }}
              />
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-12 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all active:scale-[0.98]">
        Download Analytics
      </button>
    </div>
  );
};

export default CapacityTrends;
