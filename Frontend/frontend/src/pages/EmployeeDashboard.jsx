import React, { useEffect, useState } from 'react';
import Card from '../components/Card';
import { employeeService } from '../api/employeeApi';
import { taskService } from '../api/taskApi';

const EmployeeDashboard = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [employeeData, setEmployeeData] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [updatingTaskId, setUpdatingTaskId] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const responseBody = await employeeService.getEmployeeById(user.id);
        setEmployeeData(responseBody.data || responseBody);
      } catch (err) {
        console.error("Dashboard data load failed", err);
      } finally {
        setLoading(false);
      }
    };

    const loadTasks = async () => {
      if (!user?.id) {
        setTasksLoading(false);
        return;
      }

      try {
        setTasksLoading(true);
        const response = await taskService.getEmployeeTasks(user.id);
        if (response.data && response.data.success) {
          setTasks(response.data.tasks || []);
        }
      } catch (err) {
        console.error("Failed to fetch employee tasks", err);
        setError("Unable to load tasks at this time.");
      } finally {
        setTasksLoading(false);
      }
    };

    loadDashboardData();
    loadTasks();
  }, [user]);

  const handleStatusUpdate = async (taskId, newStatus) => {
    const previousTasks = [...tasks];
    setUpdatingTaskId(taskId);

    // Optimistic UI Update
    setTasks(prev => prev.map(t => t.taskId === taskId ? { ...t, status: newStatus } : t));

    try {
      // Pass 'newStatus' to match the updated service signature
      await taskService.updateTaskStatus(taskId, user.id, newStatus);
    } catch (err) {
      console.error("Status update failed", err);
      // Revert on error
      setTasks(previousTasks);
      alert("Failed to sync status with server. Please ensure the status transition is valid.");
    } finally {
      setUpdatingTaskId(null);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return 'bg-error/10 text-error';
      case 'High': return 'bg-error/10 text-error';
      case 'Medium': return 'bg-warning/10 text-warning';
      case 'Low': return 'bg-success/10 text-success';
      default: return 'bg-gray-100 text-textSecondary';
    }
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case 'Completed': return 'bg-success text-white shadow-success/20';
      case 'In Progress': return 'bg-primary text-white shadow-primary/20';
      case 'Assigned': return 'bg-bgAudvik text-primary border border-primary/20';
      default: return 'bg-gray-100 text-textSecondary';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="flex flex-col items-center gap-4">
          <i className="fa-solid fa-spinner fa-spin text-3xl text-primary"></i>
          <p className="text-textSecondary font-bold animate-pulse">Initializing Dashboard...</p>
        </div>
      </div>
    );
  }

  const firstName = (employeeData?.employeeName || user?.name || 'User').split(' ')[0];
  const activeProjects = tasks.length > 0 ? new Set(tasks.map(t => t.projectName)).size : (employeeData?.noOfActiveProjects || 0);

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="bg-gradient-to-r from-primary to-primaryDark p-8 rounded-3xl text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-2">Welcome back, {firstName}!</h2>
          <p className="opacity-80">You have {tasks.length} active objectives across {activeProjects} projects.</p>
        </div>
        <i className="fa-solid fa-rocket absolute -right-8 -bottom-8 text-white/10 text-9xl -rotate-12"></i>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card title="Current Work">
            <div className="space-y-4">
              {tasksLoading ? (
                <div className="space-y-3">
                  {[1, 2].map(i => <div key={i} className="h-24 bg-gray-50 animate-pulse rounded-2xl"></div>)}
                </div>
              ) : tasks.length === 0 ? (
                <div className="text-center py-12 text-textSecondary bg-gray-50 rounded-2xl border border-dashed border-borderAudvik opacity-40">
                  <i className="fa-solid fa-inbox text-4xl mb-3"></i>
                  <p className="font-bold">Queue clear. No active tasks found.</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {tasks.map((task) => (
                    <div key={task.taskId} className="flex flex-col md:flex-row md:items-center justify-between p-6 border border-borderDiv rounded-2xl hover:border-primary/40 hover:shadow-md transition-all group bg-white">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-inner">
                          <i className="fa-solid fa-layer-group text-lg"></i>
                        </div>
                        <div>
                          <h4 className="font-bold text-textPrimary leading-tight mb-1">{task.title}</h4>
                          <span className="text-xs text-primary font-black uppercase tracking-wider flex items-center gap-1.5">
                            <i className="fa-solid fa-folder opacity-40"></i>
                            {task.projectName}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6 mt-4 md:mt-0">
                        <div className="text-right hidden sm:block">
                           <span className={`text-[9px] px-2 py-0.5 rounded-lg font-black uppercase tracking-widest ${getPriorityColor(task.priority)}`}>
                             {task.priority}
                           </span>
                        </div>

                        {/* Interactive Status Dropdown */}
                        <div className={`relative min-w-[140px] px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm ${getStatusClasses(task.status)}`}>
                          <div className="flex items-center gap-2">
                            {updatingTaskId === task.taskId ? (
                              <i className="fa-solid fa-spinner fa-spin"></i>
                            ) : (
                              <i className="fa-solid fa-circle-dot"></i>
                            )}
                            <select
                              disabled={updatingTaskId === task.taskId}
                              value={task.status}
                              onChange={(e) => handleStatusUpdate(task.taskId, e.target.value)}
                              className="bg-transparent border-none outline-none cursor-pointer w-full font-black appearance-none focus:ring-0"
                            >
                              <option value="Assigned" className="text-slateBrand bg-white">Assigned</option>
                              <option value="In Progress" className="text-slateBrand bg-white">In Progress</option>
                              <option value="Completed" className="text-slateBrand bg-white">Completed</option>
                            </select>
                            <i className="fa-solid fa-chevron-down text-[8px] pointer-events-none opacity-50"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>
        
        <div className="space-y-6">
           <Card title="Productivity Trends">
              <div className="h-40 flex items-center justify-center text-center opacity-30">
                 <div>
                   <i className="fa-solid fa-chart-line text-4xl mb-2"></i>
                   <p className="text-xs font-bold uppercase tracking-widest">Analytics Online</p>
                 </div>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;