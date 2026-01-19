import React, { useState, useEffect } from 'react';
import { employeeService } from '../../api/employeeApi';

const EmployeeDetailsModal = ({ employee, onClose }) => {
  const [historyData, setHistoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview'); // Overview | Active Tasks | Task History

  useEffect(() => {
    const fetchEmployeeData = async () => {
      if (!employee?.id) return;
      try {
        setLoading(true);
        const response = await employeeService.getEmployeeTaskHistory(employee.id);
        if (response.data) {
          setHistoryData(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch employee history for modal:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployeeData();
  }, [employee?.id]);

  if (!employee) return null;

  const summary = historyData?.summary || { totalTasksAssigned: 0, currentlyActive: 0, completed: 0 };
  const history = historyData?.taskHistory || { activeTasks: [], completedTasks: [], fullHistory: [] };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Completed': return 'bg-success/10 text-success border-success/20';
      case 'In Progress': return 'bg-primary/10 text-primary border-primary/20';
      case 'Assigned': return 'bg-warning/10 text-warning border-warning/20';
      default: return 'bg-gray-100 text-textSecondary border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slateBrand/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl border border-borderAudvik overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header Section */}
        <div className="bg-gradient-to-r from-primary to-primaryDark px-8 py-8 text-white shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-white/20 rounded-[1.8rem] flex items-center justify-center font-black text-3xl backdrop-blur-sm border border-white/20 shadow-xl">
                {(employee.name || '?').split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h2 className="text-3xl font-black tracking-tight">{employee.name}</h2>
                <div className="flex items-center gap-3 mt-1.5">
                  <p className="text-sm font-bold opacity-90">{employee.designation}</p>
                  <span className="opacity-30">•</span>
                  <p className="text-[11px] font-black uppercase tracking-widest opacity-80">{employee.department}</p>
                </div>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="w-12 h-12 rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center border border-white/10"
            >
              <i className="fa-solid fa-xmark text-2xl"></i>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white border-b border-borderDiv px-8 flex gap-8 shrink-0">
          {['Overview', 'Active Tasks', 'Task History'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-5 text-xs font-black uppercase tracking-widest transition-all relative ${
                activeTab === tab ? 'text-primary' : 'text-textSecondary hover:text-slateBrand'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full"></div>
              )}
            </button>
          ))}
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-bgAudvik/30">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 opacity-30">
              <i className="fa-solid fa-circle-notch fa-spin text-5xl mb-6 text-primary"></i>
              <p className="font-black text-sm uppercase tracking-widest">Aggregating Personnel Metrics...</p>
            </div>
          ) : (
            <div className="animate-fadeIn">
              {activeTab === 'Overview' && (
                <div className="space-y-8">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-3xl border border-borderDiv shadow-sm">
                      <p className="text-[10px] font-black text-textSecondary uppercase tracking-widest mb-2">Total Assigned</p>
                      <p className="text-3xl font-black text-slateBrand">{summary.totalTasksAssigned}</p>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-borderDiv shadow-sm">
                      <p className="text-[10px] font-black text-textSecondary uppercase tracking-widest mb-2">Active Objectives</p>
                      <p className="text-3xl font-black text-primary">{summary.currentlyActive}</p>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-borderDiv shadow-sm">
                      <p className="text-[10px] font-black text-textSecondary uppercase tracking-widest mb-2">Successful Completions</p>
                      <p className="text-3xl font-black text-success">{summary.completed}</p>
                    </div>
                  </div>

                  {/* Resource Details */}
                  <div className="bg-white rounded-[2rem] border border-borderDiv p-8 shadow-sm">
                    <h4 className="text-sm font-black text-slateBrand uppercase tracking-widest mb-6 flex items-center gap-2">
                      <i className="fa-solid fa-id-card text-primary opacity-50"></i>
                      Strategic Resource Profile
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12">
                      <div>
                        <p className="text-[10px] font-black text-textSecondary uppercase tracking-widest mb-1 opacity-60">Employee ID</p>
                        <p className="font-bold text-slateBrand">{employee.id}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-textSecondary uppercase tracking-widest mb-1 opacity-60">Email Address</p>
                        <p className="font-bold text-slateBrand">{employee.email || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-textSecondary uppercase tracking-widest mb-1 opacity-60">Department</p>
                        <p className="font-bold text-slateBrand">{employee.department}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-textSecondary uppercase tracking-widest mb-1 opacity-60">Designation</p>
                        <p className="font-bold text-slateBrand">{employee.designation}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'Active Tasks' && (
                <div className="space-y-4">
                  {history.activeTasks.length === 0 ? (
                    <div className="py-20 text-center opacity-30">
                      <i className="fa-solid fa-inbox text-5xl mb-4"></i>
                      <p className="text-xs font-black uppercase tracking-widest">No currently active tasks</p>
                    </div>
                  ) : (
                    history.activeTasks.map((task, idx) => (
                      <div key={idx} className="bg-white p-6 border border-borderDiv rounded-[2rem] hover:shadow-lg transition-all group flex flex-col md:flex-row md:items-center justify-between">
                        <div>
                          <h4 className="font-black text-slateBrand text-lg mb-1">{task.taskTitle || task.title}</h4>
                          <div className="flex flex-wrap items-center gap-6 text-[11px] font-bold text-textSecondary uppercase tracking-widest">
                            <span className="flex items-center gap-1.5"><i className="fa-solid fa-user-tie text-primary/40"></i> Manager: <span className="text-slateBrand">{task.managerName}</span></span>
                            <span className="flex items-center gap-1.5"><i className="fa-solid fa-calendar text-textSecondary/40"></i> Assigned: {new Date(task.assignedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="mt-4 md:mt-0">
                          <span className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border shadow-sm ${getStatusStyle(task.status)}`}>
                            {task.status}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'Task History' && (
                <div className="space-y-8">
                  {/* Completion History */}
                  <div>
                    <h5 className="text-[10px] font-black text-textSecondary uppercase tracking-widest mb-4 px-2">Completed Mandates</h5>
                    <div className="space-y-3">
                      {history.completedTasks.length === 0 ? (
                        <div className="py-12 text-center opacity-20 border border-dashed border-borderAudvik rounded-2xl">
                          <p className="text-xs font-bold uppercase tracking-widest">No historical completions</p>
                        </div>
                      ) : (
                        history.completedTasks.map((task, idx) => (
                          <div key={idx} className="bg-white px-6 py-4 border border-borderDiv rounded-2xl flex items-center justify-between grayscale hover:grayscale-0 transition-all opacity-80 hover:opacity-100 shadow-sm">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-success/5 text-success rounded-xl flex items-center justify-center border border-success/10 shadow-sm">
                                <i className="fa-solid fa-check"></i>
                              </div>
                              <div>
                                <h4 className="font-bold text-slateBrand text-sm">{task.taskTitle || task.title}</h4>
                                <p className="text-[10px] text-textSecondary font-medium">Completed on {new Date(task.completedAt).toLocaleDateString()} | Mgr: {task.managerName}</p>
                              </div>
                            </div>
                            <span className="text-[9px] font-black uppercase text-success bg-success/5 px-3 py-1.5 rounded-xl border border-success/20 shadow-sm">Completed</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Activity Audit Timeline */}
                  <div>
                    <h5 className="text-[10px] font-black text-textSecondary uppercase tracking-widest mb-4 px-2">Personnel Activity Log</h5>
                    <div className="bg-white border border-borderDiv rounded-[2rem] p-8 space-y-6 relative overflow-hidden">
                      {history.fullHistory.length === 0 ? (
                        <p className="text-xs font-bold text-textSecondary opacity-30 italic">Log stream empty.</p>
                      ) : (
                        history.fullHistory.map((item, idx) => (
                          <div key={idx} className="flex gap-6 items-start animate-fadeIn">
                            <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0 shadow-glow"></div>

                            <div className="flex-1 min-w-0">
                              <p className="text-[10px] font-black text-textSecondary opacity-40 uppercase tracking-tighter mb-1">
                                {item.completedAt || item.assignedAt
                                  ? new Date(item.completedAt || item.assignedAt).toLocaleString()
                                  : "—"}
                              </p>

                              <p className="text-xs font-bold text-slateBrand leading-relaxed">
                                {item.taskTitle || item.title}
                                <span className="text-[10px] font-medium text-textSecondary opacity-60 mx-1">
                                  updated to
                                </span>
                                <span
                                  className={`ml-2 px-2 py-0.5 rounded text-[9px] font-black uppercase border shadow-sm ${getStatusStyle(
                                    item.status
                                  )}`}
                                >
                                  {item.status}
                                </span>
                              </p>
                            </div>
                          </div>
                        ))

                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-8 py-6 bg-white border-t border-borderDiv flex items-center justify-between shrink-0">
          <p className="text-[10px] font-black text-textSecondary uppercase tracking-widest opacity-40">
            Operational Personnel View v2.5
          </p>
          <button 
            onClick={onClose}
            className="px-10 py-3 bg-slateBrand text-white font-black rounded-2xl hover:bg-black transition-all shadow-lg text-[10px] uppercase tracking-widest active:scale-95"
          >
            Close Operational Window
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailsModal;