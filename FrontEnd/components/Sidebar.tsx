
import React from 'react';
import { NAV_ITEMS } from '../constants';
import { LogOut } from 'lucide-react';

interface SidebarProps {
  activeId: string;
  setActiveId: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeId, setActiveId }) => {
  return (
    <div className="w-64 h-screen bg-white border-r border-gray-100 flex flex-col fixed left-0 top-0 z-20">
      {/* Brand Logo */}
      <div className="p-8 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#8A7AB5] flex items-center justify-center text-white shadow-sm">
          <span className="font-black text-sm">C</span>
        </div>
        <h1 className="text-xl font-bold tracking-tight text-slate-800">
          CORE<span className="text-[#8A7AB5]">PMS</span>
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = activeId === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveId(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all relative group ${
                isActive 
                  ? 'bg-[#8A7AB5] text-white shadow-lg shadow-[#8A7AB5]/20' 
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <span className={`${isActive ? 'text-white' : 'text-slate-400 group-hover:text-[#8A7AB5]'}`}>
                {item.icon}
              </span>
              <span className="font-semibold text-sm">{item.label}</span>
              {isActive && (
                <div className="absolute right-3 w-1.5 h-1.5 bg-white/40 rounded-full" />
              )}
            </button>
          );
        })}
      </nav>

      {/* User & Logout */}
      <div className="p-4 space-y-4">
        <div className="p-3 bg-slate-50 rounded-xl flex items-center gap-3 border border-slate-100">
          <img 
            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop" 
            className="w-10 h-10 rounded-lg object-cover"
            alt="User"
          />
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-slate-800 truncate">Alex Rivera</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Manager</span>
          </div>
        </div>
        
        <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all text-sm font-semibold group">
          <LogOut size={18} className="group-hover:translate-x-0.5 transition-transform" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
