
import React from 'react';
import { NAV_ITEMS } from '../constants';
import { LogOut } from 'lucide-react';
import { UserProfile } from '../types';

interface SidebarProps {
  activeId: string;
  setActiveId: (id: string) => void;
  onLogout?: () => void;
  user: UserProfile;
}

const Sidebar: React.FC<SidebarProps> = ({ activeId, setActiveId, onLogout, user }) => {
  const isManager = user.role === 'Manager';

  // Filter out Analytics for employees
  const filteredNavItems = NAV_ITEMS.filter(item => {
    if (!isManager && item.id === 'analytics') return false;
    return true;
  });

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-100 flex flex-col fixed left-0 top-0 z-20">
      {/* Brand Logo */}
      <div className="p-6 flex items-center gap-2.5">
        <div className="w-7 h-7 rounded bg-[#8A7AB5] flex items-center justify-center text-white shadow-sm">
          <span className="font-black text-xs">C</span>
        </div>
        <h1 className="text-lg font-bold tracking-tight text-slate-800">
          CORE<span className="text-[#8A7AB5]">PMS</span>
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-0.5">
        {filteredNavItems.map((item) => {
          const isActive = activeId === item.id;
          // Rename 'Command' for employees
          const label = (!isManager && item.id === 'command') ? 'Personal Dashboard' : item.label;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveId(item.id)}
              className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-lg transition-all relative group ${
                isActive 
                  ? 'bg-[#8A7AB5] text-white shadow-md shadow-[#8A7AB5]/20' 
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <span className={`${isActive ? 'text-white' : 'text-slate-400 group-hover:text-[#8A7AB5]'}`}>
                {item.icon}
              </span>
              <span className="font-semibold text-[13px]">{label}</span>
              {isActive && (
                <div className="absolute right-3 w-1 h-1 bg-white/40 rounded-full" />
              )}
            </button>
          );
        })}
      </nav>

      {/* User & Logout */}
      <div className="p-4 space-y-3">
        <div className="p-2.5 bg-slate-50 rounded-xl flex items-center gap-2.5 border border-slate-100">
          <img 
            src={user.avatar} 
            className="w-8 h-8 rounded-lg object-cover"
            alt="User"
          />
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] font-bold text-slate-800 truncate">{user.name}</span>
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">{user.role}</span>
          </div>
        </div>
        
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all text-xs font-semibold group"
        >
          <LogOut size={16} className="group-hover:translate-x-0.5 transition-transform" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
