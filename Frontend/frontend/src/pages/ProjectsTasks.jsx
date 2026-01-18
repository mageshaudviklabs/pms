import React, { useState, useEffect } from 'react';
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

    // Optimistic Update
    setProjectTasks(prev => prev.map(t => t.taskId === taskId ? { ...t, status: newStatus } : t));

    try {
      // Pass 'newStatus' to match the updated service signature
      await taskService.updateTaskStatus(taskId, user.id, newStatus);
    } catch (err) {
      console.error("Status update failed", err);
      setProjectTasks(previousTasks);
      alert("Failed to update task status. Please verify your connection.");
    } finally {
      setUpdatingTaskId(null);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return 'bg-error/10 text-error border-error/20';
      case 'High': return 'bg-error/10 text-error border-error/20';
      case 'Medium': return 'bg-warning/10 text-warning border-warning/20';
      case 'Low': return 'bg-success/10 text-success border-error/20';
      default: return 'bg-gray-100 text-textSecondary border-gray-200';
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Completed': return 'bg-success text-white shadow-success/20';
      case 'In Progress': return 'bg-primary text-white shadow-primary/20';
      case 'Assigned': return 'bg-bgAudvik text-primary border border-primary/20';
      default: return 'bg-gray-100 text-textSecondary';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
        <i className="fa-solid fa-spinner fa-spin text-4xl text-primary"></i>
        <p className="text-textSecondary font-black uppercase tracking-widest text-xs opacity-60">Synchronizing Project Tracks...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
        <div className="animate-slideUp">
          <h2 className="text-3xl font-black text-slateBrand tracking-tight flex items-center gap-3">
            {selectedProject ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <i className="fa-solid fa-diagram-project text-xl"></i>
                </div>
                {selectedProject.projectName}
              </div>
            ) : (
              'Projects & Operational Tracks'
            )}
          </h2>
          <p className="text-sm text-textSecondary font-bold mt-2 opacity-70">
            {selectedProject 
              ? `Management console for ${selectedProject.projectName} task distribution.` 
              : 'Holistic overview of project vitality and strategic resource loading.'}
          </p>
        </div>
        
        {selectedProject && (
          <button 
            onClick={() => setSelectedProject(null)}
            className="px-6 py-2.5 bg-white border-2 border-borderAudvik rounded-2xl text-[11px] font-black text-slateBrand hover:border-primary/40 hover:text-primary transition-all shadow-sm flex items-center gap-2 group animate-fadeIn"
          >
            <i className="fa-solid fa-arrow-left transition-transform group-hover:-translate-x-1"></i>
            Return to Portfolio
          </button>
        )}
      </div>

      {!selectedProject ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.length === 0 ? (
            <div className="col-span-full py-32 text-center bg-white border border-dashed border-borderAudvik rounded-[3rem] animate-fadeIn">
              <div className="w-24 h-24 bg-bgAudvik rounded-full flex items-center justify-center mx-auto mb-6 text-primary/20">
                <i className="fa-solid fa-folder-open text-5xl"></i>
              </div>
              <h3 className="text-xl font-black text-slateBrand uppercase tracking-widest">No Active Projects</h3>
            </div>
          ) : (
            projects.map((proj, idx) => (
              <div 
                key={idx} 
                onClick={() => handleProjectClick(proj)}
                className="bg-white border border-borderDiv rounded-[2.5rem] p-8 hover:shadow-[0_20px_50px_rgba(142,124,195,0.15)] hover:-translate-y-2 transition-all duration-300 cursor-pointer group flex flex-col h-full animate-slideUp"
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                <div className="flex items-start justify-between mb-8">
                  <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm">
                    <i className="fa-solid fa-rocket text-2xl"></i>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-slateBrand">
                      {user.role === UserRole.MANAGER ? `${proj.assignedTasks}/${proj.totalTasks}` : proj.activeTasks}
                    </p>
                  </div>
                </div>
                <h3 className="text-xl font-black text-slateBrand truncate mb-6">{proj.projectName}</h3>
                <div className="mt-auto pt-6 flex items-center justify-between border-t border-borderDiv/50">
                  <span className="text-[11px] font-black text-primary uppercase flex items-center gap-2 group-hover:gap-4 transition-all">
                    Analyze Stream
                    <i className="fa-solid fa-arrow-right text-[9px]"></i>
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-6 animate-fadeIn">
          {tasksLoading ? (
            <div className="py-40 text-center flex flex-col items-center gap-5">
              <i className="fa-solid fa-circle-notch fa-spin text-5xl text-primary"></i>
            </div>
          ) : (
            <div className="grid gap-5">
              {projectTasks.length === 0 ? (
                <div className="text-center py-40 bg-white rounded-[3rem] border-2 border-dashed border-borderAudvik">
                  <p className="text-sm font-bold text-textSecondary opacity-50">No active tasks logged for this project track.</p>
                </div>
              ) : (
                projectTasks.map((task, idx) => (
                  <div 
                    key={task.taskId} 
                    className="bg-white p-7 border border-borderDiv rounded-[2rem] flex flex-col md:flex-row md:items-center justify-between hover:border-primary/40 transition-all duration-300 shadow-sm group animate-slideUp"
                  >
                    <div className="flex items-center gap-6 flex-1 min-w-0">
                      <div className="w-14 h-14 bg-bgAudvik rounded-2xl flex items-center justify-center text-primary">
                        <i className="fa-solid fa-file-lines text-xl opacity-50"></i>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <h4 className="font-black text-slateBrand text-lg truncate max-w-[400px]">{task.title}</h4>
                          <span className={`text-[9px] px-3 py-1 rounded-lg font-black uppercase tracking-[0.1em] border ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-[11px] text-textSecondary font-bold">
                          <span>Manager: <span className="text-slateBrand">{task.managerName}</span></span>
                          <span>Assigned to: <span className="text-slateBrand">
                            {task.assignedEmployees && task.assignedEmployees.length > 0 
                              ? task.assignedEmployees.map(e => e.employeeName).join(', ') 
                              : 'Unassigned'}
                          </span></span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-8 mt-6 md:mt-0 md:ml-8 pl-0 md:pl-8 border-t md:border-t-0 md:border-l border-borderDiv/60 pt-6 md:pt-0">
                      {/* Status Column */}
                      <div className="min-w-[150px]">
                        {user.role === UserRole.EMPLOYEE ? (
                          <div className={`relative px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${getStatusStyle(task.status)}`}>
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
                                <option value="Assigned" className="text-slateBrand bg-white">Assigned</option>
                                <option value="In Progress" className="text-slateBrand bg-white">In Progress</option>
                                <option value="Completed" className="text-slateBrand bg-white">Completed</option>
                              </select>
                              <i className="fa-solid fa-chevron-down text-[8px] pointer-events-none opacity-50"></i>
                            </div>
                          </div>
                        ) : (
                          <span className={`block text-[10px] font-black px-5 py-2.5 rounded-xl uppercase tracking-widest shadow-sm text-center ${getStatusStyle(task.status)}`}>
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
  );
};

export default ProjectsTasks;