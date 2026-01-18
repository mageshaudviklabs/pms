import React, { useState, useEffect } from 'react';
import { taskService } from '../../api/taskApi';

const EmployeeDetailsModal = ({ employee, onClose }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployeeTasks = async () => {
      if (!employee?.id) return;
      try {
        setLoading(true);
        const response = await taskService.getEmployeeTasks(employee.id);
        if (response.data && response.data.success) {
          setTasks(response.data.tasks || []);
        }
      } catch (error) {
        console.error("Failed to fetch tasks for modal:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployeeTasks();
  }, [employee?.id]);

  if (!employee) return null;

  const activeTasks = tasks.filter(t => t.status === 'Assigned' || t.status === 'In Progress');
  const uniqueProjects = new Set(tasks.map(t => t.projectName || t.metadata?.projectName)).size;

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'Critical': return 'bg-error/10 text-error';
      case 'High': return 'bg-error/10 text-error';
      case 'Medium': return 'bg-warning/10 text-warning';
      case 'Low': return 'bg-success/10 text-success';
      default: return 'bg-gray-100 text-textSecondary';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Completed': return 'bg-success/10 text-success';
      case 'In Progress': return 'bg-primary/10 text-primary';
      case 'Assigned': return 'bg-warning/10 text-warning';
      default: return 'bg-gray-100 text-textSecondary';
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slateBrand/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-borderAudvik overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-primary to-primaryDark px-8 py-6 text-white sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center font-black text-2xl backdrop-blur-sm">
                {(employee.name || '?').split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{employee.name}</h2>
                <p className="text-sm opacity-90 mt-1 flex items-center gap-2">
                  <span>{employee.designation}</span>
                  <span className="opacity-50">•</span>
                  <span>{employee.department}</span>
                </p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="w-10 h-10 rounded-full hover:bg-white/20 transition-all flex items-center justify-center"
            >
              <i className="fa-solid fa-xmark text-2xl"></i>
            </button>
          </div>
        </div>

        {/* Summary Metrics Section (Workload removed) */}
        <div className="p-8 bg-gray-50 border-b border-borderDiv">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-xl border border-borderDiv hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <i className="fa-solid fa-bolt text-primary text-lg"></i>
                </div>
                <p className="text-xs text-textSecondary font-bold uppercase">Active Tasks</p>
              </div>
              <p className="text-3xl font-black text-primary">{activeTasks.length}</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-borderDiv hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                  <i className="fa-solid fa-list-check text-success text-lg"></i>
                </div>
                <p className="text-xs text-textSecondary font-bold uppercase">Total Assigned</p>
              </div>
              <p className="text-3xl font-black text-success">{tasks.length}</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-borderDiv hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                  <i className="fa-solid fa-layer-group text-warning text-lg"></i>
                </div>
                <p className="text-xs text-textSecondary font-bold uppercase">Active Projects</p>
              </div>
              <p className="text-3xl font-black text-warning">{uniqueProjects}</p>
            </div>
          </div>
        </div>

        {/* Task List Section */}
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-textPrimary flex items-center gap-2">
              <i className="fa-solid fa-clipboard-list text-primary"></i>
              Task Manifest
            </h3>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 opacity-30">
              <i className="fa-solid fa-circle-notch fa-spin text-4xl mb-4"></i>
              <p className="font-bold">Retrieving assignments...</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-16 text-textSecondary bg-gray-50 rounded-xl border border-dashed border-borderAudvik">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-inbox text-4xl opacity-30"></i>
              </div>
              <p className="font-bold text-lg mb-2">No tasks assigned yet</p>
              <p className="text-sm">This resource is currently available for allocation.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
                <div 
                  key={task.taskId || task.id}
                  className="bg-gray-50 border border-borderDiv rounded-xl p-5 hover:bg-white hover:border-primary/30 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-textPrimary text-base truncate">
                          {task.title || task.taskName}
                        </h4>
                        {task.priority && (
                          <span className={`text-[10px] px-2 py-0.5 rounded font-black uppercase tracking-wider ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-primary font-bold flex items-center gap-1.5 uppercase tracking-wide">
                        <i className="fa-solid fa-folder"></i>
                        {task.projectName || task.metadata?.projectName || 'General'}
                      </p>
                    </div>
                    <span className={`text-[10px] px-2.5 py-1.5 rounded-lg font-black uppercase tracking-widest ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-between pt-3 border-t border-borderDiv mt-3 gap-4">
                    <div className="flex items-center gap-4 text-[11px]">
                      {task.managerName && (
                        <div className="flex items-center gap-1.5">
                          <i className="fa-solid fa-user-tie text-primary opacity-60"></i>
                          <span className="text-textSecondary font-bold">Manager:</span>
                          <span className="font-black text-slateBrand">{task.managerName}</span>
                        </div>
                      )}
                      {(task.assignedAt || task.createdAt) && (
                        <div className="flex items-center gap-1.5">
                          <i className="fa-solid fa-calendar-check text-textSecondary opacity-60"></i>
                          <span className="text-textSecondary font-bold">Assigned:</span>
                          <span className="font-black text-slateBrand">
                            {new Date(task.assignedAt || task.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {task.deadline && (
                      <div className="flex items-center gap-1.5 text-[11px] bg-error/5 px-2.5 py-1 rounded-lg">
                        <i className="fa-solid fa-clock text-error"></i>
                        <span className="font-black text-error">DUE {new Date(task.deadline).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-8 py-4 bg-gray-50 border-t border-borderDiv flex items-center justify-between sticky bottom-0">
          <div className="flex items-center gap-3 text-xs text-textSecondary font-bold uppercase tracking-wider">
            <i className="fa-solid fa-info-circle text-primary"></i>
            <span>Real-time Data Stream</span>
          </div>
          <button 
            onClick={onClose}
            className="px-8 py-2.5 bg-slateBrand text-white font-black rounded-xl hover:bg-black transition-all shadow-md text-xs uppercase tracking-widest"
          >
            Close View
          </button>
        </div>
      </div>
    </div>
  );
};


export default EmployeeDetailsModal;