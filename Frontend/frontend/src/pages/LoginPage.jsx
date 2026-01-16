import React, { useState } from 'react';
import { UserRole } from '../types';
import { employeeService } from '../api/employeeApi';
import { managerService } from '../api/managerApi';

const LoginPage = ({ onLogin }) => {
  const [showIdInput, setShowIdInput] = useState(false);
  const [loginRole, setLoginRole] = useState(UserRole.EMPLOYEE);
  const [loginId, setLoginId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePortalSelect = (role) => {
    setLoginRole(role);
    setLoginId('');
    setError('');
    setShowIdInput(true);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginId.trim()) return;

    setLoading(true);
    setError('');

    try {
      if (loginRole === UserRole.MANAGER) {
        // --- Manager Login Logic ---
        const response = await managerService.getManagerById(loginId);
        const apiBody = response.data;
        const managerData = apiBody.data || apiBody;

        if (!managerData || !managerData.managerId) {
           throw new Error('Invalid manager data received');
        }

        // Store session data as requested
        localStorage.setItem("role", "manager");
        localStorage.setItem("manager", JSON.stringify(managerData));

        onLogin({
          id: managerData.managerId,
          name: managerData.managerName,
          role: UserRole.MANAGER,
          jobTitle: 'Manager', // Default title or derived if available
          department: managerData.department,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(managerData.managerName)}&background=random`
        });

      } else {
        // --- Employee Login Logic ---
        const response = await employeeService.getEmployeeProfileById(loginId);
        const apiBody = response.data;
        const employeeData = apiBody.data || apiBody;

        if (!employeeData || !employeeData.id) {
           throw new Error('Invalid employee data received');
        }

        const safeName = employeeData.name || 'Unknown Employee';
        
        onLogin({
          id: employeeData.id,
          name: safeName,
          role: UserRole.EMPLOYEE,
          jobTitle: employeeData.designation || 'Team Member',
          avatar: employeeData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(safeName)}&background=random`
        });
      }

    } catch (err) {
      console.error(err);
      const isNotFound = err.response && err.response.status === 404;
      
      if (isNotFound) {
        setError(`${loginRole === UserRole.MANAGER ? 'Manager' : 'Employee'} ID not found.`);
      } else {
        setError('Connection failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
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
          {!showIdInput ? (
            <>
              <div className="text-sm font-bold text-textSecondary uppercase tracking-widest text-center mb-6 border-b border-borderDiv pb-4">
                Select Access Portal
              </div>
              
              <button 
                onClick={() => handlePortalSelect(UserRole.MANAGER)}
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
                onClick={() => handlePortalSelect(UserRole.EMPLOYEE)}
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
            </>
          ) : (
            <form onSubmit={handleLoginSubmit} className="space-y-5 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-borderDiv pb-2">
                <span className="text-sm font-bold text-textSecondary uppercase">
                  {loginRole === UserRole.MANAGER ? 'Manager Access' : 'Employee Access'}
                </span>
                <button 
                  type="button" 
                  onClick={() => { setShowIdInput(false); setError(''); setLoginId(''); }}
                  className="text-xs font-bold text-primary hover:underline"
                >
                  Cancel
                </button>
              </div>

              <div>
                <label className="text-xs font-bold text-textSecondary mb-2 block uppercase">
                  Enter {loginRole === UserRole.MANAGER ? 'Manager' : 'Employee'} ID
                </label>
                <div className="relative">
                  <i className={`fa-solid ${loginRole === UserRole.MANAGER ? 'fa-user-tie' : 'fa-id-card'} absolute left-4 top-1/2 -translate-y-1/2 text-textSecondary`}></i>
                  <input 
                    type="text" 
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-bgAudvik border border-borderDiv rounded-xl font-bold text-textPrimary focus:border-success focus:shadow-sm outline-none transition-all"
                    placeholder={loginRole === UserRole.MANAGER ? "e.g. MGR001" : "e.g. EMP102"}
                    autoFocus
                  />
                </div>
                {error && (
                  <div className="flex items-center gap-2 mt-2 text-error animate-fadeIn">
                    <i className="fa-solid fa-circle-exclamation text-xs"></i>
                    <p className="text-xs font-bold">{error}</p>
                  </div>
                )}
              </div>

              <button 
                type="submit"
                disabled={loading || !loginId.trim()}
                className="w-full p-4 bg-success text-white font-bold rounded-xl hover:bg-green-600 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i>
                    Validating...
                  </>
                ) : (
                  <>
                    Access Dashboard
                    <i className="fa-solid fa-arrow-right"></i>
                  </>
                )}
              </button>
            </form>
          )}

          <p className="text-[10px] text-center text-textSecondary pt-8">
            &copy; 2024 ElitePMS Global Systems. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};


export default LoginPage;