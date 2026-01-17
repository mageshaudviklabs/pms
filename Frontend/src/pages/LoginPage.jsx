import React from 'react';
import { UserRole } from '../types';

const LoginPage = ({ onLogin }) => {
  const loginAsManager = () => {
    onLogin({
      id: 'MGR001',
      name: 'Alex Sterling',
      role: UserRole.MANAGER,
      jobTitle: 'Senior Engineering Manager',
      avatar: 'https://picsum.photos/id/65/150/150'
    });
  };

  const loginAsEmployee = () => {
    onLogin({
      id: 'EMP102',
      name: 'Harsha S',
      role: UserRole.EMPLOYEE,
      jobTitle: 'Full Stack Engineer',
      avatar: 'https://picsum.photos/id/64/150/150'
    });
  };

  return (
    <div className="min-h-screen bg-sidebarBg flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-borderDiv">
        <div className="p-10 text-center">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6 shadow-lg shadow-primary/20">
            E
          </div>
          <h1 className="text-3xl font-bold text-textPrimary tracking-tight">ElitePMS</h1>
          <p className="text-textSecondary mt-2">Enterprise Performance Management</p>
        </div>

        <div className="px-10 pb-12 space-y-4">
          <div className="text-sm font-bold text-textSecondary uppercase tracking-widest text-center mb-6 border-b border-borderDiv pb-4">
            Select Access Portal
          </div>
          
          <button 
            onClick={loginAsManager}
            className="w-full group relative flex items-center gap-4 p-4 bg-white border border-borderDiv rounded-2xl hover:border-primary hover:shadow-md transition-all text-left"
            aria-label="Login as Manager"
          >
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
              <i className="fa-solid fa-user-tie text-xl"></i>
            </div>
            <div>
              <p className="font-bold text-textPrimary">Management Portal</p>
              <p className="text-xs text-textSecondary">Oversee teams and analytics</p>
            </div>
            <i className="fa-solid fa-chevron-right ml-auto text-borderDiv group-hover:text-primary transition-colors"></i>
          </button>

          <button 
            onClick={loginAsEmployee}
            className="w-full group relative flex items-center gap-4 p-4 bg-white border border-borderDiv rounded-2xl hover:border-success hover:shadow-md transition-all text-left"
            aria-label="Login as Employee"
          >
            <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center text-success group-hover:bg-success group-hover:text-white transition-colors">
              <i className="fa-solid fa-user-gear text-xl"></i>
            </div>
            <div>
              <p className="font-bold text-textPrimary">Employee Portal</p>
              <p className="text-xs text-textSecondary">Tasks and personal growth</p>
            </div>
            <i className="fa-solid fa-chevron-right ml-auto text-borderDiv group-hover:text-success transition-colors"></i>
          </button>

          <p className="text-[10px] text-center text-textSecondary pt-8">
            &copy; 2024 ElitePMS Global Systems. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;