import React from 'react';
import Header from '../Header';
import Sidebar from '../Sidebar';

const Layout = ({ children, user, activeTab, setActiveTab, onLogout }) => {
  return (
    <div className="flex h-screen w-full bg-[#F8F9FD] overflow-hidden">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        role={user.role} 
        onLogout={onLogout} 
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header user={user} onLogout={onLogout} activeTab={activeTab} />
        
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