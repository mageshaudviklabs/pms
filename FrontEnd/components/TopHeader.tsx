
import React from 'react';
import { Search, Bell } from 'lucide-react';

const TopHeader: React.FC = () => {
  return (
    <div className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex flex-col">
        <span className="text-[9px] font-black text-[#8A7AB5] uppercase tracking-widest leading-none mb-0.5">Active View</span>
        <h2 className="text-lg font-bold text-slate-900 leading-none">Command Center</h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#8A7AB5] transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Search..." 
            className="pl-10 pr-4 py-2 bg-slate-50 border-transparent border-2 focus:border-[#8A7AB5]/20 focus:bg-white rounded-xl text-xs w-60 transition-all outline-none text-slate-600 font-medium"
          />
        </div>
        
        <button className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:text-[#8A7AB5] hover:bg-white border border-slate-100 transition-all relative">
          <Bell size={18} />
          <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
        </button>

        <button className="px-4 py-2 bg-slate-900 text-white text-[10px] font-black rounded-lg hover:bg-slate-800 transition-all uppercase tracking-widest shadow-md shadow-slate-900/10">
          Exit
        </button>
      </div>
    </div>
  );
};

export default TopHeader;
