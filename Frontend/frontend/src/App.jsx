import React, { useState } from 'react';
import { UserRole } from './types';
import Layout from './components/Layout';
import ManagerDashboard from './pages/ManagerDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import TeamOverview from './pages/TeamOverview';
import ProjectsTasks from './pages/ProjectsTasks';
import ActionOverlay from './components/ActionOverlay';
import ExcelImportModal from './components/ExcelImportModal';
import LoginPage from './pages/LoginPage';
import MyProfile from './pages/MyProfile';

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [activeAction, setActiveAction] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleLogin = (user) => {
    setCurrentUser(user);
    setActiveTab('Dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleActionTrigger = (type, employee) => {
    setSelectedEmployee(employee || null);
    setActiveAction(type);
  };

  const handleCloseAction = () => {
    setActiveAction(null);
    setSelectedEmployee(null);
  };

  const handleActionSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return currentUser.role === UserRole.MANAGER 
          ? <ManagerDashboard 
              key={refreshKey}
              onOpenImport={() => setIsImportModalOpen(true)} 
              onAction={handleActionTrigger} 
              user={currentUser}
            /> 
          : <EmployeeDashboard user={currentUser} />;
      case 'Projects & Tasks':
        return <ProjectsTasks user={currentUser} />;
      case 'Team Overview':
        return <TeamOverview onAction={handleActionTrigger} />;
      case 'My Profile':
        return <MyProfile user={currentUser} />;
      case 'Leave Apply':
        return (
          <div className="p-12 text-center animate-fadeIn">
            <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
              <i className="fa-solid fa-plus"></i>
            </div>
            <h3 className="text-xl font-black text-slateBrand uppercase tracking-tight">Leave Application System</h3>
            <p className="text-textSecondary mt-2 font-bold opacity-60">This module is currently being initialized for your portal.</p>
          </div>
        );
      default:
        return <div className="p-12 text-center font-bold opacity-20 uppercase tracking-widest">Module Loading...</div>;
    }
  };

  return (
    <>
      <Layout 
        user={currentUser} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout}
      >
        {renderContent()}
      </Layout>
      
      {isImportModalOpen && (
        <ExcelImportModal 
          onClose={() => setIsImportModalOpen(false)}
          onAssignmentComplete={() => setRefreshKey(prev => prev + 1)}
        />
      )}
      
      {activeAction && (
        <ActionOverlay 
          type={activeAction} 
          preSelectedEmployee={selectedEmployee}
          onClose={handleCloseAction}
          onSuccess={handleActionSuccess}
        />
      )}
    </>
  );
};

export default App;