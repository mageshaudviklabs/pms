
import React from 'react';
import { Search, Bell } from 'lucide-react';

const TopHeader: React.FC = () => {
  return (
    <div className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-10 sticky top-0 z-10">
      <div className="flex flex-col">
        <span className="text-[10px] font-black text-[#8A7AB5] uppercase tracking-widest leading-none mb-1">Active View</span>
        <h2 className="text-xl font-bold text-slate-900 leading-none">Command Center</h2>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#8A7AB5] transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search resources..." 
            className="pl-12 pr-6 py-2.5 bg-slate-50 border-transparent border-2 focus:border-[#8A7AB5]/20 focus:bg-white rounded-xl text-sm w-72 transition-all outline-none text-slate-600 font-medium"
          />
        </div>
        
        <button className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:text-[#8A7AB5] hover:bg-white border border-slate-100 transition-all relative">
          <Bell size={20} />
          <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
        </button>

        <button className="px-6 py-2.5 bg-slate-900 text-white text-xs font-black rounded-xl hover:bg-slate-800 transition-all uppercase tracking-widest shadow-lg shadow-slate-900/10">
          Exit
        </button>
      </div>
    </div>
  );
};

export default TopHeader;
