import React, { useState, useEffect, useMemo } from 'react';
import { UserRole } from '../types';
import { projectService } from '../api/projectApi';
import { taskService } from '../api/taskApi';

const ProjectsTasks = ({ user }) => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectTasks, setProjectTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [updatingTaskId, setUpdatingTaskId] = useState(null);
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchProjectSummary();
  }, [user]);

  const fetchProjectSummary = async () => {
    try {
      setLoading(true);
      let response;
      if (user.role === UserRole.MANAGER) {
        response = await projectService.getManagerProjectSummary(user.id);
      } else {
        response = await projectService.getEmployeeProjects(user.id);
      }
      setProjects(response.data.projects || []);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectClick = async (project) => {
    setSelectedProject(project);
    setStatusFilter('All');
    setPriorityFilter('All');
    setSearchQuery('');
    
    try {
      setTasksLoading(true);
      let response;
      if (user.role === UserRole.MANAGER) {
        response = await projectService.getProjectTasks(project.projectName);
      } else {
        response = await projectService.getEmployeeProjectTasks(user.id, project.projectName);
      }
      setProjectTasks(response.data.tasks || []);
    } catch (error) {
      console.error("Failed to fetch project tasks:", error);
    } finally {
      setTasksLoading(false);
    }
  };

  const handleStatusUpdate = async (taskId, newStatus) => {
    const previousTasks = [...projectTasks];
    setUpdatingTaskId(taskId);

    setProjectTasks(prev => prev.map(t => t.taskId === taskId ? { ...t, status: newStatus } : t));

    try {
      await taskService.updateTaskStatus(taskId, user.id, newStatus);
    } catch (err) {
      console.error("Status update failed", err);
      setProjectTasks(previousTasks);
      alert("Failed to update task status. Please verify your connection.");
    } finally {
      setUpdatingTaskId(null);
    }
  };

  // Filtered tasks
  const filteredTasks = useMemo(() => {
    return projectTasks.filter(task => {
      const matchesStatus = statusFilter === 'All' || task.status === statusFilter;
      const matchesPriority = priorityFilter === 'All' || task.priority === priorityFilter;
      const matchesSearch = searchQuery === '' || 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.managerName.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesStatus && matchesPriority && matchesSearch;
    });
  }, [projectTasks, statusFilter, priorityFilter, searchQuery]);

  const projectEmployeeSummary = useMemo(() => {
    if (!projectTasks.length) return [];
    
    const summaryMap = {};
    
    projectTasks.forEach(task => {
      if (task.assignedEmployees && Array.isArray(task.assignedEmployees)) {
        task.assignedEmployees.forEach(emp => {
          if (!summaryMap[emp.employeeId]) {
            summaryMap[emp.employeeId] = {
              name: emp.employeeName,
              count: 0
            };
          }
          summaryMap[emp.employeeId].count += 1;
        });
      }
    });
    
    return Object.values(summaryMap).sort((a, b) => b.count - a.count);
  }, [projectTasks]);

  // Calculate project statistics
  const projectStats = useMemo(() => {
    if (!projects.length) return { total: 0, active: 0, completed: 0 };
    
    return {
      total: projects.length,
      active: projects.filter(p => p.assignedTasks < p.totalTasks).length,
      completed: projects.filter(p => p.assignedTasks === p.totalTasks).length,
    };
  }, [projects]);

  const getProjectHealth = (project) => {
    const assigned = user.role === UserRole.MANAGER ? project.assignedTasks : 0;
    const total = user.role === UserRole.MANAGER ? project.totalTasks : 0;
    
    if (assigned === total) return { status: 'Completed', color: 'success', icon: 'check-circle' };
    if (assigned >= total * 0.7) return { status: 'On Track', color: 'success', icon: 'circle-check' };
    if (assigned >= total * 0.4) return { status: 'In Progress', color: 'warning', icon: 'clock' };
    return { status: 'At Risk', color: 'error', icon: 'exclamation-triangle' };
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return 'bg-red-50 text-red-600 border-red-300';
      case 'High': return 'bg-red-50 text-red-600 border-red-300';
      case 'Medium': return 'bg-amber-50 text-amber-600 border-amber-300';
      case 'Low': return 'bg-emerald-50 text-emerald-600 border-emerald-300';
      default: return 'bg-gray-100 text-gray-600 border-gray-300';
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-500 text-white shadow-emerald-200';
      case 'In Progress': return 'bg-[#9B8AC7] text-white shadow-[#9B8AC7]/20';
      case 'Assigned': return 'bg-white text-[#9B8AC7] border-2 border-[#9B8AC7]/30';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const calculateProgress = (project) => {
    if (user.role === UserRole.MANAGER) {
      return (project.assignedTasks / project.totalTasks) * 100;
    }
    return 100;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#E8E4F0] flex flex-col justify-center items-center gap-4">
        <div className="w-16 h-16 border-4 border-[#9B8AC7]/30 border-t-[#9B8AC7] rounded-full animate-spin"></div>
        <p className="text-gray-700 font-bold text-lg">Synchronizing Project Tracks...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E8E4F0] p-8">
      <div className="space-y-8 animate-fadeIn max-w-[1600px] mx-auto">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-2">
          <div className="animate-slideUp">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
              {selectedProject ? (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#9B8AC7] to-[#8B7AB7] rounded-xl flex items-center justify-center text-white border-2 border-[#8B7AB7] shadow-lg">
                    <i className="fa-solid fa-diagram-project text-xl"></i>
                  </div>
                  {selectedProject.projectName}
                </div>
              ) : (
                <>
                  <div className="w-10 h-10 bg-gradient-to-br from-[#9B8AC7] to-[#8B7AB7] rounded-xl flex items-center justify-center text-white border-2 border-[#8B7AB7] shadow-lg">
                    <i className="fa-solid fa-rocket text-xl"></i>
                  </div>
                  Projects & Operational Tracks
                </>
              )}
            </h2>
            <p className="text-sm text-gray-600 font-bold mt-2 opacity-70">
              {selectedProject 
                ? `Management console for ${selectedProject.projectName} task distribution.` 
                : 'Holistic overview of project vitality and strategic resource loading.'}
            </p>
          </div>
          
          {selectedProject && (
            <button 
              onClick={() => setSelectedProject(null)}
              className="px-6 py-2.5 bg-white border-2 border-gray-300 rounded-2xl text-[11px] font-black text-gray-700 hover:border-[#9B8AC7] hover:text-[#9B8AC7] transition-all shadow-sm flex items-center gap-2 group"
            >
              <i className="fa-solid fa-arrow-left transition-transform group-hover:-translate-x-1"></i>
              Return to Portfolio
            </button>
          )}
        </div>

        {!selectedProject ? (
          <>
            {/* Stats Overview */}
            {user.role === UserRole.MANAGER && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slideUp">
                <div className="bg-white border-2 border-gray-300 rounded-3xl p-6 shadow-md hover:shadow-lg transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#9B8AC7]/20 to-[#8B7AB7]/20 rounded-2xl flex items-center justify-center border-2 border-[#9B8AC7]/30">
                      <i className="fa-solid fa-folder-open text-xl text-[#9B8AC7]"></i>
                    </div>
                    <span className="text-3xl font-black text-[#9B8AC7]">{projectStats.total}</span>
                  </div>
                  <h4 className="text-sm font-bold text-gray-700 opacity-70 uppercase tracking-wide">Total Projects</h4>
                </div>

                <div className="bg-white border-2 border-gray-300 rounded-3xl p-6 shadow-md hover:shadow-lg transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl flex items-center justify-center border-2 border-amber-300">
                      <i className="fa-solid fa-spinner text-xl text-amber-600"></i>
                    </div>
                    <span className="text-3xl font-black text-amber-600">{projectStats.active}</span>
                  </div>
                  <h4 className="text-sm font-bold text-gray-700 opacity-70 uppercase tracking-wide">In Progress</h4>
                </div>

                <div className="bg-white border-2 border-gray-300 rounded-3xl p-6 shadow-md hover:shadow-lg transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center border-2 border-emerald-300">
                      <i className="fa-solid fa-check-circle text-xl text-emerald-600"></i>
                    </div>
                    <span className="text-3xl font-black text-emerald-600">{projectStats.completed}</span>
                  </div>
                  <h4 className="text-sm font-bold text-gray-700 opacity-70 uppercase tracking-wide">Completed</h4>
                </div>
              </div>
            )}

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.length === 0 ? (
                <div className="col-span-full py-32 text-center bg-white border-2 border-dashed border-gray-300 rounded-[3rem] animate-fadeIn shadow-md">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300 border-2 border-gray-300">
                    <i className="fa-solid fa-folder-open text-5xl"></i>
                  </div>
                  <h3 className="text-xl font-black text-gray-900 uppercase tracking-widest">No Active Projects</h3>
                </div>
              ) : (
                projects.map((proj, idx) => {
                  const progress = calculateProgress(proj);
                  const health = getProjectHealth(proj);
                  
                  return (
                    <div 
                      key={idx} 
                      onClick={() => handleProjectClick(proj)}
                      className="bg-white border-2 border-gray-300 rounded-[2.5rem] p-8 hover:shadow-xl hover:border-[#9B8AC7] hover:-translate-y-2 transition-all duration-300 cursor-pointer group flex flex-col h-full animate-slideUp relative overflow-hidden shadow-md"
                      style={{ animationDelay: `${idx * 80}ms` }}
                    >
                      {/* Background Pattern */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#9B8AC7]/5 rounded-full blur-3xl -z-0"></div>
                      
                      {/* Header */}
                      <div className="flex items-start justify-between mb-6 relative z-10">
                        <div className="w-14 h-14 bg-gradient-to-br from-[#9B8AC7] to-[#8B7AB7] rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-all duration-500 shadow-lg border-2 border-[#8B7AB7]">
                          <i className="fa-solid fa-rocket text-2xl"></i>
                        </div>
                        
                        {/* Status Badge */}
                        <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 bg-${health.color === 'success' ? 'emerald' : health.color === 'warning' ? 'amber' : 'red'}-50 text-${health.color === 'success' ? 'emerald' : health.color === 'warning' ? 'amber' : 'red'}-600 border-2 border-${health.color === 'success' ? 'emerald' : health.color === 'warning' ? 'amber' : 'red'}-300`}>
                          <i className={`fa-solid fa-${health.icon}`}></i>
                          {health.status}
                        </span>
                      </div>

                      {/* Project Name */}
                      <h3 className="text-xl font-black text-gray-900 mb-4 truncate relative z-10">{proj.projectName}</h3>

                      {/* Progress Section - NO PERCENTAGE */}
                      <div className="mb-6 relative z-10">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">Task Progress</span>
                          <span className="text-lg font-black text-[#9B8AC7]">
                            {user.role === UserRole.MANAGER ? `${proj.assignedTasks}/${proj.totalTasks}` : proj.activeTasks}
                          </span>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden border-2 border-gray-300">
                          <div 
                            className={`h-full bg-gradient-to-r from-[#9B8AC7] to-[#8B7AB7] transition-all duration-500 rounded-full`}
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="mt-auto pt-6 flex items-center justify-between border-t-2 border-gray-200 relative z-10">
                        <span className="text-[11px] font-black text-[#9B8AC7] uppercase flex items-center gap-2 group-hover:gap-4 transition-all">
                          View Details
                          <i className="fa-solid fa-arrow-right text-[9px]"></i>
                        </span>
                        
                        {/* Task Count Badge */}
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-600 px-3 py-1.5 bg-gray-50 rounded-lg border-2 border-gray-200">
                          <i className="fa-solid fa-tasks text-[#9B8AC7]"></i>
                          <span>{user.role === UserRole.MANAGER ? proj.totalTasks : proj.activeTasks} tasks</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        ) : (
          <div className="space-y-6 animate-fadeIn">
            {/* Filter Bar */}
            <div className="bg-white border-2 border-gray-300 rounded-3xl p-6 shadow-md">
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                {/* Search */}
                <div className="relative flex-1 w-full lg:max-w-md">
                  <i className="fa-solid fa-search absolute left-5 top-1/2 -translate-y-1/2 text-[#9B8AC7] text-lg"></i>
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-14 pr-4 py-4 bg-white border-2 border-gray-300 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#9B8AC7]/30 focus:border-[#9B8AC7] transition-all shadow-sm"
                  />
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-3 items-center">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-5 py-3 bg-white border-2 border-gray-300 rounded-xl text-xs font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#9B8AC7]/20 focus:border-[#9B8AC7] cursor-pointer shadow-sm"
                  >
                    <option value="All">All Status</option>
                    <option value="Assigned">Assigned</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>

                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="px-5 py-3 bg-white border-2 border-gray-300 rounded-xl text-xs font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#9B8AC7]/20 focus:border-[#9B8AC7] cursor-pointer shadow-sm"
                  >
                    <option value="All">All Priority</option>
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>

                  {(statusFilter !== 'All' || priorityFilter !== 'All' || searchQuery !== '') && (
                    <button
                      onClick={() => {
                        setStatusFilter('All');
                        setPriorityFilter('All');
                        setSearchQuery('');
                      }}
                      className="px-4 py-3 bg-red-50 text-red-600 border-2 border-red-200 rounded-xl text-xs font-bold hover:bg-red-100 transition-all shadow-sm"
                    >
                      <i className="fa-solid fa-times mr-2"></i>
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Results Count */}
              <div className="mt-4 pt-4 border-t-2 border-gray-200">
                <p className="text-xs font-bold text-gray-600">
                  Showing <span className="text-[#9B8AC7] font-black">{filteredTasks.length}</span> of <span className="text-gray-900 font-black">{projectTasks.length}</span> tasks
                </p>
              </div>
            </div>

            {/* Team Members Section */}
            {user.role === UserRole.MANAGER && !tasksLoading && projectEmployeeSummary.length > 0 && (
              <div className="bg-white border-2 border-gray-300 rounded-3xl p-6 shadow-md animate-slideUp">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#9B8AC7]/20 to-[#8B7AB7]/20 rounded-xl flex items-center justify-center border-2 border-[#9B8AC7]/30">
                    <i className="fa-solid fa-users text-xl text-[#9B8AC7]"></i>
                  </div>
                  <div>
                    <h3 className="text-base font-black text-gray-900 uppercase tracking-wide">TEAM MEMBERS</h3>
                    <p className="text-xs text-gray-600 font-medium">{projectEmployeeSummary.length} employees working on this project</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  {projectEmployeeSummary.map((emp, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-center gap-3 px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-2xl shadow-sm hover:shadow-md hover:border-[#9B8AC7] transition-all group"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-[#9B8AC7] to-[#8B7AB7] rounded-xl flex items-center justify-center text-white font-black text-sm border-2 border-[#8B7AB7] shadow-md">
                        {emp.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900">{emp.name}</span>
                        <span className="text-[10px] font-bold text-[#9B8AC7]">{emp.count} {emp.count === 1 ? 'task' : 'tasks'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tasks List */}
            {tasksLoading ? (
              <div className="py-40 text-center flex flex-col items-center gap-5">
                <div className="w-16 h-16 border-4 border-[#9B8AC7]/30 border-t-[#9B8AC7] rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="grid gap-5">
                {filteredTasks.length === 0 ? (
                  <div className="text-center py-40 bg-white rounded-[3rem] border-2 border-dashed border-gray-300 shadow-md">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-gray-300">
                      <i className="fa-solid fa-filter text-3xl text-gray-300"></i>
                    </div>
                    <p className="text-lg font-black text-gray-900 mb-2">No tasks found</p>
                    <p className="text-sm font-medium text-gray-600 opacity-70">
                      {searchQuery || statusFilter !== 'All' || priorityFilter !== 'All'
                        ? 'Try adjusting your filters'
                        : 'No active tasks logged for this project track.'}
                    </p>
                  </div>
                ) : (
                  filteredTasks.map((task, idx) => (
                    <div 
                      key={task.taskId} 
                      className="bg-white p-7 border-2 border-gray-300 rounded-[2rem] hover:border-[#9B8AC7] hover:shadow-xl transition-all duration-300 group animate-slideUp shadow-md"
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        {/* Task Info */}
                        <div className="flex items-start gap-6 flex-1 min-w-0">
                          <div className="w-14 h-14 bg-gradient-to-br from-gray-100 to-[#9B8AC7]/10 rounded-2xl flex items-center justify-center text-[#9B8AC7] shrink-0 group-hover:from-[#9B8AC7]/10 group-hover:to-[#9B8AC7]/20 transition-all border-2 border-[#9B8AC7]/30 shadow-sm">
                            <i className="fa-solid fa-file-lines text-xl"></i>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-3 mb-3">
                              <h4 className="font-black text-gray-900 text-lg truncate max-w-[400px]">{task.title}</h4>
                              <span className={`text-[9px] px-3 py-1.5 rounded-lg font-black uppercase tracking-[0.1em] border-2 ${getPriorityColor(task.priority)}`}>
                                {task.priority}
                              </span>
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] text-gray-600 font-bold">
                              <span className="flex items-center gap-2">
                                <i className="fa-solid fa-user-tie text-[#9B8AC7]"></i>
                                Manager: <span className="text-gray-900">{task.managerName}</span>
                              </span>
                              <span className="flex items-center gap-2">
                                <i className="fa-solid fa-users text-[#9B8AC7]"></i>
                                Assigned to: <span className="text-gray-900">
                                  {task.assignedEmployees && task.assignedEmployees.length > 0 
                                    ? task.assignedEmployees.map(e => e.employeeName).join(', ') 
                                    : 'Unassigned'}
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Status Column */}
                        <div className="flex items-center gap-4 lg:pl-8 lg:border-l-2 border-gray-200">
                          {user.role === UserRole.EMPLOYEE ? (
                            <div className={`relative min-w-[160px] px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${getStatusStyle(task.status)}`}>
                              <div className="flex items-center justify-between gap-2">
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
                                  <option value="Assigned" className="text-gray-900 bg-white">Assigned</option>
                                  <option value="In Progress" className="text-gray-900 bg-white">In Progress</option>
                                  <option value="Completed" className="text-gray-900 bg-white">Completed</option>
                                </select>
                                <i className="fa-solid fa-chevron-down text-[8px] pointer-events-none opacity-50"></i>
                              </div>
                            </div>
                          ) : (
                            <span className={`block text-[10px] font-black px-5 py-3 rounded-xl uppercase tracking-widest shadow-sm text-center min-w-[140px] ${getStatusStyle(task.status)}`}>
                              {task.status}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsTasks;