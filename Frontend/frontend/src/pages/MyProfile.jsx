import React, { useEffect, useState } from 'react';
import Card from '../components/Card';
import { employeeService } from '../api/employeeApi';

const MyProfile = ({ user }) => {
  const [profile, setProfile] = useState(null);
  const [historyData, setHistoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview'); // Overview | Active Tasks | Task History

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const [profileRes, historyRes] = await Promise.all([
          employeeService.getEmployeeProfileById(user.id),
          employeeService.getEmployeeTaskHistory(user.id)
        ]);
        
        setProfile(profileRes.data.data || profileRes.data);
        setHistoryData(historyRes.data);
      } catch (error) {
        console.error('Failed to fetch profile or history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
        <i className="fa-solid fa-spinner fa-spin text-4xl text-primary"></i>
        <p className="text-[10px] font-black uppercase tracking-widest text-textSecondary opacity-60">Loading Mandate Records...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-20 opacity-50">
        <i className="fa-solid fa-user-slash text-6xl mb-4 text-primary/20"></i>
        <p className="text-xl font-bold">Profile not found</p>
      </div>
    );
  }

  const initials = (profile.name || user.name || '?').split(' ').map(n => n[0]).join('');
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
    <div className="max-w-5xl mx-auto space-y-6 animate-slideUp">
      {/* Header Info Card */}
      <Card>
        <div className="p-6 md:p-10 flex flex-col md:flex-row items-center gap-8">
          <div className="w-28 h-28 bg-primary rounded-[2.5rem] flex items-center justify-center text-white text-4xl font-black shadow-xl border-4 border-white">
            {initials}
          </div>
          <div className="text-center md:text-left flex-1">
            <h2 className="text-4xl font-black text-slateBrand tracking-tighter">{profile.name}</h2>
            <p className="text-primary font-black uppercase tracking-widest text-sm mt-1">{profile.designation}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 mt-6">
              <span className="text-xs font-bold text-textSecondary flex items-center gap-2">
                <i className="fa-solid fa-id-badge text-primary opacity-40"></i> {profile.id}
              </span>
              <span className="text-xs font-bold text-textSecondary flex items-center gap-2">
                <i className="fa-solid fa-building text-primary opacity-40"></i> {profile.department}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Navigation Tabs */}
      <div className="bg-white border border-borderAudvik rounded-[2rem] px-8 flex gap-8 shadow-sm overflow-x-auto">
        {['Overview', 'Active Tasks', 'Task History'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-5 text-[11px] font-black uppercase tracking-[0.2em] transition-all relative whitespace-nowrap ${
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

      {/* Tab Content */}
      <div className="pb-12 space-y-8 min-h-[400px]">
        {activeTab === 'Overview' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Stats Summary Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-8 rounded-[2.5rem] border border-borderAudvik shadow-sm flex items-center justify-between group hover:border-primary/40 transition-all">
                <div>
                  <p className="text-[10px] font-black text-textSecondary uppercase tracking-widest mb-1">Total Assigned</p>
                  <p className="text-4xl font-black text-slateBrand">{summary.totalTasksAssigned}</p>
                </div>
                <div className="w-14 h-14 bg-bgAudvik rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-inner border border-borderAudvik">
                  <i className="fa-solid fa-list-check text-2xl"></i>
                </div>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] border border-borderAudvik shadow-sm flex items-center justify-between group hover:border-primary/40 transition-all">
                <div>
                  <p className="text-[10px] font-black text-textSecondary uppercase tracking-widest mb-1">Currently Active</p>
                  <p className="text-4xl font-black text-primary">{summary.currentlyActive}</p>
                </div>
                <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-inner border border-primary/10">
                  <i className="fa-solid fa-bolt text-2xl"></i>
                </div>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] border border-borderAudvik shadow-sm flex items-center justify-between group hover:border-primary/40 transition-all">
                <div>
                  <p className="text-[10px] font-black text-textSecondary uppercase tracking-widest mb-1">Objectives Completed</p>
                  <p className="text-4xl font-black text-success">{summary.completed}</p>
                </div>
                <div className="w-14 h-14 bg-success/5 rounded-2xl flex items-center justify-center text-success group-hover:bg-success group-hover:text-white transition-all shadow-inner border border-success/10">
                  <i className="fa-solid fa-circle-check text-2xl"></i>
                </div>
              </div>
            </div>

            {/* Additional Overview Stats */}
            <div className="bg-white p-10 border border-borderAudvik rounded-[3rem] text-center opacity-40">
              <i className="fa-solid fa-chart-line text-5xl mb-4 text-primary"></i>
              <p className="text-sm font-black uppercase tracking-widest">Performance Heatmap Initializing...</p>
            </div>
          </div>
        )}

        {activeTab === 'Active Tasks' && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="text-xl font-black text-slateBrand uppercase tracking-tight px-2 flex items-center gap-3">
               <div className="w-2 h-8 bg-primary rounded-full"></div>
               Active Objectives
            </h3>
            <div className="grid gap-4">
              {history.activeTasks.length === 0 ? (
                <div className="p-20 text-center bg-white border border-dashed border-borderAudvik rounded-[3rem] opacity-50">
                  <p className="text-sm font-bold text-textSecondary uppercase tracking-widest">No active tasks in queue</p>
                </div>
              ) : (
                history.activeTasks.map((task, idx) => (
                  <div key={idx} className="bg-white p-8 border border-borderAudvik rounded-[2.5rem] flex flex-col md:flex-row md:items-center justify-between hover:shadow-xl transition-all group border-l-8 border-l-primary">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-bgAudvik rounded-[1.5rem] flex items-center justify-center text-primary border border-borderAudvik shadow-inner group-hover:bg-primary group-hover:text-white transition-colors duration-500">
                        <i className="fa-solid fa-file-contract text-2xl opacity-60"></i>
                      </div>
                      <div>
                        <h4 className="font-black text-slateBrand text-xl leading-tight mb-2">{task.taskTitle || task.title}</h4>
                        <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-[11px] font-bold text-textSecondary uppercase tracking-widest">
                          <span className="flex items-center gap-2"><i className="fa-solid fa-user-tie text-primary/40"></i> Manager: <span className="text-primary">{task.managerName}</span></span>
                          <span className="flex items-center gap-2"><i className="fa-solid fa-calendar-day text-primary/40"></i> Assigned: {new Date(task.assignedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 md:mt-0">
                      <span className={`px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border shadow-sm ${getStatusStyle(task.status)}`}>
                        {task.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'Task History' && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h3 className="text-xl font-black text-slateBrand uppercase tracking-tight px-2 mb-6 flex items-center gap-3">
                <div className="w-2 h-8 bg-success rounded-full"></div>
                Completed Objectives
              </h3>
              <div className="grid gap-4">
                {history.completedTasks.length === 0 ? (
                  <div className="p-20 text-center bg-white border border-dashed border-borderAudvik rounded-[3rem] opacity-50">
                    <p className="text-sm font-bold text-textSecondary uppercase tracking-widest">No completed objectives yet</p>
                  </div>
                ) : (
                  history.completedTasks.map((task, idx) => (
                    <div key={idx} className="bg-white p-8 border border-borderAudvik rounded-[2.5rem] flex flex-col md:flex-row md:items-center justify-between grayscale hover:grayscale-0 opacity-80 hover:opacity-100 transition-all border-l-8 border-l-success shadow-sm">
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-success/5 rounded-2xl flex items-center justify-center text-success border border-success/10">
                          <i className="fa-solid fa-check-double text-xl"></i>
                        </div>
                        <div>
                          <h4 className="font-black text-slateBrand text-xl mb-2">{task.taskTitle || task.title}</h4>
                          <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-[11px] font-bold text-textSecondary uppercase tracking-widest">
                            <span className="flex items-center gap-2"><i className="fa-solid fa-clock-rotate-left text-success/40"></i> Completed: <span className="text-success">{new Date(task.completedAt).toLocaleDateString()}</span></span>
                            <span className="flex items-center gap-2"><i className="fa-solid fa-calendar text-textSecondary/40"></i> Manager: {task.managerName}</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-6 md:mt-0">
                        <span className="px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border bg-success/5 text-success border-success/20 shadow-sm">
                          Completed
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Chronological Audit Log */}
            <div className="pt-8">
               <h3 className="text-xl font-black text-slateBrand uppercase tracking-tight px-2 mb-6 flex items-center gap-3">
                <div className="w-2 h-8 bg-slateBrand/20 rounded-full"></div>
                Operational Audit Log
              </h3>
              <div className="relative pl-8 border-l-2 border-borderAudvik space-y-6">
                {history.fullHistory.length === 0 ? (
                  <p className="text-xs font-bold text-textSecondary italic opacity-40">No historical activity records available.</p>
                ) : (
                  history.fullHistory.map((item, idx) => (
                    <div key={idx} className="relative">
                      <div className="absolute -left-[41px] top-1 w-4 h-4 rounded-full border-4 border-white bg-primary shadow-sm"></div>
                      <div className="bg-white p-6 border border-borderAudvik rounded-[2rem] shadow-sm flex items-center gap-6">
                        <span className="text-[10px] font-black text-textSecondary opacity-40 uppercase tracking-tighter whitespace-nowrap min-w-[100px]">
                          {new Date(item.timestamp).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <p className="text-xs font-bold text-slateBrand flex-1">
                          <span className="text-primary">{item.taskTitle || item.title}</span> 
                          <span className="mx-2 text-[10px] text-textSecondary opacity-60 font-medium">was updated to</span>
                          <span className={`ml-2 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${getStatusStyle(item.status)}`}>
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
    </div>
  );
};

export default MyProfile;