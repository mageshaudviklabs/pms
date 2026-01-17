import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import Card from '../components/Card';
import { employeeService } from '../api/employeeApi';
import { taskService } from '../api/taskApi';

const EmployeeDashboard = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [employeeData, setEmployeeData] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        // Fetch employee core data
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

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return 'bg-error/10 text-error';
      case 'High': return 'bg-error/10 text-error';
      case 'Medium': return 'bg-warning/10 text-warning';
      case 'Low': return 'bg-success/10 text-success';
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
  const availability = employeeData?.availabilityStatus || 'Active';

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="bg-gradient-to-r from-primary to-primaryDark p-8 rounded-3xl text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-2">Welcome back, {firstName}!</h2>
          <p className="opacity-80">You have {tasks.length} active {tasks.length === 1 ? 'task' : 'tasks'} across {activeProjects} {activeProjects === 1 ? 'project' : 'projects'}.</p>
          <div className="mt-6 flex gap-3">
            <button className="bg-white text-primary px-4 py-2 rounded-xl font-bold text-sm shadow-sm hover:bg-gray-50 transition-all">
              Log Hours
            </button>
            <button className="bg-primaryDark/50 border border-white/20 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-primaryDark/70 transition-all">
              View Roadmap
            </button>
          </div>
        </div>
        <i className="fa-solid fa-rocket absolute -right-8 -bottom-8 text-white/10 text-9xl -rotate-12"></i>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card title="Current Work">
            <div className="space-y-4">
              {tasksLoading ? (
                <div className="space-y-3">
                  {[1, 2].map(i => (
                    <div key={i} className="h-20 bg-gray-100 animate-pulse rounded-xl"></div>
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-8 text-error">
                  <i className="fa-solid fa-triangle-exclamation text-2xl mb-2"></i>
                  <p className="font-bold">{error}</p>
                </div>
              ) : tasks.length === 0 ? (
                <div className="text-center py-12 text-textSecondary bg-gray-50 rounded-xl border border-dashed border-borderAudvik">
                  <i className="fa-solid fa-inbox text-4xl mb-3 opacity-30"></i>
                  <p className="font-bold">No active tasks assigned.</p>
                  <p className="text-sm">Enjoy your breathing room!</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {tasks.map((task) => (
                    <div 
                      key={task.taskId} 
                      className="flex flex-col md:flex-row md:items-center justify-between p-5 border border-borderDiv rounded-2xl hover:border-primary/40 hover:shadow-md transition-all group bg-white"
                    >
                      <div className="flex gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                          <i className="fa-solid fa-layer-group text-lg"></i>
                        </div>
                        <div>
                          <h4 className="font-bold text-textPrimary leading-tight mb-1">{task.title}</h4>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                            <span className="text-xs text-primary font-bold flex items-center gap-1">
                              <i className="fa-solid fa-folder text-[10px]"></i>
                              {task.projectName}
                            </span>
                            <span className="text-[10px] text-textSecondary flex items-center gap-1">
                              <i className="fa-solid fa-user-tie text-[10px]"></i>
                              From: {task.managerName}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 mt-4 md:mt-0 justify-between md:justify-end">
                        <div className="flex flex-col items-end gap-1">
                          <span className={`text-[10px] px-2 py-0.5 rounded font-black uppercase tracking-wider ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                          {task.deadline && (
                            <span className="text-[10px] font-bold text-error flex items-center gap-1">
                              <i className="fa-solid fa-calendar-day"></i>
                              {new Date(task.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                          )}
                        </div>
                        <div className="h-8 w-px bg-borderDiv hidden md:block"></div>
                        <span className="text-xs font-bold text-success bg-success/10 px-3 py-1.5 rounded-lg flex items-center gap-1">
                          <i className="fa-solid fa-circle-check text-[10px]"></i>
                          {task.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card title="Productivity (Tasks Done)">
              <div className="h-48 flex items-center justify-center text-center">
                 <div className="opacity-40">
                   <i className="fa-solid fa-chart-bar text-4xl mb-2"></i>
                   <p className="text-textSecondary text-sm font-bold">Historical data syncing...</p>
                 </div>
              </div>
            </Card>

            <Card title="Performance Insight">
              <p className="text-xs text-textSecondary mb-4">Current Availability Status</p>
              <div className="flex items-center justify-center py-4">
                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-3 shadow-inner ${
                    availability === 'Busy' ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'
                  }`}>
                    <i className="fa-solid fa-bolt-lightning text-2xl"></i>
                  </div>
                  <h3 className="text-xl font-black text-textPrimary">{availability}</h3>
                  <p className="text-xs font-bold text-textSecondary uppercase mt-1">Status</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="space-y-8">
          <Card title="Reviews & Growth">
            <div className="space-y-6">
              <div className="relative pl-6 border-l-2 border-primary/20">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary border-4 border-white"></div>
                <p className="text-xs font-bold text-textSecondary uppercase mb-1">Quarterly Review</p>
                <p className="text-sm font-bold text-textPrimary">No pending reviews</p>
              </div>
            </div>
          </Card>

          <Card title="Skill Growth">
             <div className="h-32 flex items-center justify-center text-center">
                 <div className="opacity-30">
                    <i className="fa-solid fa-graduation-cap text-3xl mb-2"></i>
                    <p className="text-textSecondary text-xs font-bold">L&D path not initialized</p>
                 </div>
             </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
