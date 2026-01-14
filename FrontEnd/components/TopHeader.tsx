
import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, X, Check, Trash2 } from 'lucide-react';
import { UserProfile, AppNotification } from '../types';

interface Props {
  activeNav?: string;
  onLogout?: () => void;
  user?: UserProfile | null;
  notifications: AppNotification[];
  onMarkRead: (id: string) => void;
  onClearNotifications: () => void;
}

const TopHeader: React.FC<Props> = ({ 
  activeNav = 'command', 
  onLogout, 
  user, 
  notifications,
  onMarkRead,
  onClearNotifications
}) => {
  const isManager = user?.role === 'Manager';
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getTitle = () => {
    switch(activeNav) {
      case 'command': return isManager ? 'Command Center' : 'Personal Dashboard';
      case 'projects': return 'Ecosystems Portfolio';
      case 'overview': return 'Executive Overview';
      case 'performance': return 'Performance Metrics';
      case 'analytics': return 'Data Analytics';
      case 'settings': return 'System Settings';
      default: return isManager ? 'Command Center' : 'Personal Dashboard';
    }
  };

  return (
    <div className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex flex-col">
        <span className="text-[9px] font-black text-[#8A7AB5] uppercase tracking-widest leading-none mb-0.5">Active View</span>
        <h2 className="text-lg font-bold text-slate-900 leading-none">{getTitle()}</h2>
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
        
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`p-2 rounded-xl border transition-all relative ${
              showNotifications ? 'bg-white text-[#8A7AB5] border-[#8A7AB5]/20 shadow-sm' : 'bg-slate-50 text-slate-400 hover:text-[#8A7AB5] hover:bg-white border-slate-100'
            }`}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-100 rounded-2xl shadow-2xl shadow-slate-200/60 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="p-4 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Notifications</h4>
                {notifications.length > 0 && (
                  <button onClick={onClearNotifications} className="text-[9px] font-bold text-slate-400 hover:text-rose-500 flex items-center gap-1 uppercase transition-colors">
                    <Trash2 size={10} /> Clear
                  </button>
                )}
              </div>
              <div className="max-h-[350px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <Bell size={24} className="mx-auto text-slate-200 mb-2 opacity-50" />
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No alerts to display</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-50">
                    {notifications.map((n) => (
                      <div 
                        key={n.id} 
                        className={`p-4 hover:bg-slate-50 transition-colors flex gap-3 relative ${!n.read ? 'bg-[#8A7AB5]/5' : ''}`}
                      >
                        <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!n.read ? 'bg-[#8A7AB5]' : 'bg-transparent'}`} />
                        <div className="flex-1 space-y-1">
                          <p className="text-[11px] font-black text-slate-900 uppercase leading-none">{n.title}</p>
                          <p className="text-[10px] text-slate-500 font-medium leading-tight">{n.message}</p>
                          <p className="text-[8px] font-bold text-slate-300 uppercase tracking-tighter">{n.timestamp}</p>
                        </div>
                        {!n.read && (
                          <button 
                            onClick={() => onMarkRead(n.id)}
                            className="p-1.5 bg-white text-slate-300 hover:text-[#8A7AB5] hover:bg-white border border-slate-100 rounded-lg h-fit transition-all"
                            title="Mark as Read"
                          >
                            <Check size={12} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <button 
          onClick={onLogout}
          className="px-4 py-2 bg-slate-900 text-white text-[10px] font-black rounded-lg hover:bg-slate-800 transition-all uppercase tracking-widest shadow-md shadow-slate-900/10"
        >
          Exit
        </button>
      </div>
    </div>
  );
};

export default TopHeader;
