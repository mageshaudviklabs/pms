import React from 'react';
import { UserRole } from '../../types';
import SidebarItem from './SidebarItem';
import Logo from '../Logo';

const Sidebar = ({ activeTab, setActiveTab, role, onLogout }) => {
  const menuItems = role === UserRole.MANAGER ? [
    { name: 'Dashboard', icon: 'fa-table-columns' },
    { name: 'Projects & Tasks', icon: 'fa-diagram-project' },
    { name: 'Team Overview', icon: 'fa-users' },
    { name: 'Analytics', icon: 'fa-chart-line' },
    { name: 'Help Desk', icon: 'fa-circle-question' }
  ] : [
    { name: 'Dashboard', icon: 'fa-table-columns' },
    { name: 'Projects & Tasks', icon: 'fa-diagram-project' },
    { name: 'My Profile', icon: 'fa-user' },
    // { name: 'Leave Apply', icon: 'fa-plus' },
    { name: 'Help Desk', icon: 'fa-circle-question' }
  ];

  return (
    <aside className="w-64 h-full bg-gradient-to-b from-[#ffffff] to-white border-r border-gray-200 flex flex-col z-[60] shrink-0 shadow-xl">
      <div className="h-16 flex items-center px-6 border-b border-gray-200 bg-white">
        <Logo />
      </div>

      <nav className="flex-1 py-6 px-3 space-y-2">
        {menuItems.map((item) => (
          <SidebarItem
            key={item.name}
            name={item.name}
            icon={item.icon}
            isActive={activeTab === item.name}
            onClick={() => setActiveTab(item.name)}
          />
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200 bg-gradient-to-b from-white to-[#F5F4F8]">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-4 px-4 py-3 text-sm font-bold text-gray-600 hover:text-white hover:bg-gradient-to-r hover:from-[#9B8AC7] hover:to-[#8B7AB7] rounded-xl transition-all group"
        >
          <i className="fa-solid fa-arrow-right-from-bracket w-5 text-base"></i>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
 