import React from 'react';
import Header from '../Header';
import Sidebar from '../Sidebar';

const Layout = ({ children, user, activeTab, setActiveTab, onLogout }) => {
  return (
    <div className="flex h-screen w-full bg-[#F8F9FD] overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} role={user.role} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header user={user} onLogout={onLogout} />
        
        <nav className="h-10 bg-white border-b border-borderAudvik flex items-center px-8 text-[11px] font-bold text-textSecondary shrink-0">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-house opacity-40"></i>
            <span>HOME</span>
            <i className="fa-solid fa-chevron-right text-[8px] opacity-30"></i>
            <span className="text-slateBrand">{activeTab.toUpperCase()}</span>
          </div>
        </nav>
        
        <main className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-8">
          <div className="max-w-[1400px] mx-auto animate-fadeIn">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;