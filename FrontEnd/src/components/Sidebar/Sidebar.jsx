import React from 'react';
import { UserRole } from '../../types';
import SidebarItem from './SidebarItem';
import Logo from '../Logo';

const Sidebar = ({ activeTab, setActiveTab, role }) => {
  const menuItems = role === UserRole.MANAGER ? [
    { name: 'Dashboard', icon: 'fa-table-columns' },
    { name: 'Team Overview', icon: 'fa-users' },
    { name: 'Analytics', icon: 'fa-chart-line' },
    { name: 'Help Desk', icon: 'fa-circle-question' }
  ] : [
    { name: 'Dashboard', icon: 'fa-table-columns' },
    { name: 'My Profile', icon: 'fa-user' },
    { name: 'Leave Apply', icon: 'fa-plus' },
    { name: 'Help Desk', icon: 'fa-circle-question' }
  ];

  return (
    <aside className="w-64 h-full bg-white border-r border-borderAudvik flex flex-col z-[60] shrink-0">
      <div className="h-16 flex items-center px-6 border-b border-borderAudvik">
        <Logo />
      </div>
      
      <nav className="flex-1 py-4">
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

      <div className="p-4 border-t border-borderAudvik">
        <button className="w-full flex items-center gap-4 px-4 py-3 text-sm font-semibold text-textSecondary hover:text-slateBrand transition-colors">
          <i className="fa-solid fa-arrow-right-from-bracket w-5"></i>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;