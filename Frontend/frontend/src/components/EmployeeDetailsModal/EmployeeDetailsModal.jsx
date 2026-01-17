import React from 'react';
import { getAssignmentLogs } from '../../services/assignmentService';

const EmployeeDetailsModal = ({ employee, onClose }) => {
  if (!employee) return null;

  const employeeTasks = getAssignmentLogs().filter(
    log => log.assignedToId === employee.id
  );

  const getWorkloadColor = (workload) => {
    if (workload >= 100) return 'text-error';
    if (workload >= 80) return 'text-warning';
    return 'text-success';
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'Critical': return 'bg-error/10 text-error';
      case 'High': return 'bg-error/10 text-error';
      case 'Medium': return 'bg-warning/10 text-warning';
      case 'Low': return 'bg-success/10 text-success';
      default: return 'bg-gray-100 text-textSecondary';
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slateBrand/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-borderAudvik overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="bg-gradient-to-r from-primary to-primaryDark px-8 py-6 text-white sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center font-black text-2xl backdrop-blur-sm">
                {(employee.name || '?').split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{employee.name}</h2>
                <p className="text-sm opacity-90 mt-1 flex items-center gap-2">
                  <span>{employee.role}</span>
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

        <div className="p-8 bg-gray-50 border-b border-borderDiv">
          <div className="grid grid-cols-4 gap-6">
            <div className="bg-white p-5 rounded-xl border border-borderDiv hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <i className="fa-solid fa-briefcase text-primary text-lg"></i>
                </div>
                <p className="text-xs text-textSecondary font-bold uppercase">Projects</p>
              </div>
              <p className="text-3xl font-black text-primary">{employee.projects}</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-borderDiv hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  employee.workload >= 100 ? 'bg-error/10' :
                  employee.workload >= 80 ? 'bg-warning/10' :
                  'bg-success/10'
                }`}>
                  <i className={`fa-solid fa-chart-line text-lg ${getWorkloadColor(employee.workload)}`}></i>
                </div>
                <p className="text-xs text-textSecondary font-bold uppercase">Workload</p>
              </div>
              <p className={`text-3xl font-black ${getWorkloadColor(employee.workload)}`}>
                {employee.workload}%
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-borderDiv hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                  <i className="fa-solid fa-tasks text-success text-lg"></i>
                </div>
                <p className="text-xs text-textSecondary font-bold uppercase">Tasks</p>
              </div>
              <p className="text-3xl font-black text-success">{employeeTasks.length}</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-borderDiv hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                  <i className="fa-solid fa-chart-simple text-warning text-lg"></i>
                </div>
                <p className="text-xs text-textSecondary font-bold uppercase">Performance</p>
              </div>
              <p className="text-3xl font-black text-warning">{employee.performance}</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-textPrimary flex items-center gap-2">
              <i className="fa-solid fa-list-check text-primary"></i>
              Assigned Tasks
              <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full ml-2">
                {employeeTasks.length}
              </span>
            </h3>
          </div>

          {employeeTasks.length === 0 ? (
            <div className="text-center py-16 text-textSecondary bg-gray-50 rounded-xl border border-dashed border-borderAudvik">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-inbox text-4xl opacity-30"></i>
              </div>
              <p className="font-bold text-lg mb-2">No tasks assigned yet</p>
              <p className="text-sm">This employee is available for new assignments</p>
            </div>
          ) : (
            <div className="space-y-4">
              {employeeTasks.map((task) => (
                <div 
                  key={task.id}
                  className="bg-gray-50 border-2 border-borderDiv rounded-xl p-5 hover:bg-white hover:border-primary/30 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-bold text-textPrimary text-base">
                          {task.taskName}
                        </h4>
                        {task.priority && (
                          <span className={`text-xs px-2 py-1 rounded font-bold ${getPriorityColor(task.priority)}`}>
                            <i className="fa-solid fa-flag text-xs mr-1"></i>
                            {task.priority}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-primary font-semibold flex items-center gap-2">
                        <i className="fa-solid fa-folder text-xs"></i>
                        {task.projectName}
                      </p>
                    </div>
                    <span className="text-xs px-3 py-1.5 bg-success/10 text-success rounded-lg font-bold">
                      <i className="fa-solid fa-check-circle text-xs mr-1"></i>
                      {task.status}
                    </span>
                  </div>

                  {task.taskDescription && task.taskDescription !== task.taskName && (
                    <p className="text-sm text-textSecondary mb-3 leading-relaxed bg-white p-3 rounded-lg border border-borderAudvik">
                      {task.taskDescription}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-borderDiv">
                    <div className="flex items-center gap-4">
                      {task.assignedBy && (
                        <div className="flex items-center gap-2 text-xs">
                          <i className="fa-solid fa-user-tie text-primary"></i>
                          <span className="text-textSecondary">Assigned by:</span>
                          <span className="font-bold text-primary">{task.assignedBy}</span>
                        </div>
                      )}
                    </div>
                    {task.dueDate && (
                      <div className="flex items-center gap-2 text-xs bg-white px-3 py-1.5 rounded-lg font-semibold">
                        <i className="fa-solid fa-calendar text-error"></i>
                        <span className="text-error">
                          Due: {new Date(task.dueDate).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="px-8 py-4 bg-gray-50 border-t border-borderDiv flex items-center justify-between sticky bottom-0">
          <div className="flex items-center gap-3 text-sm text-textSecondary">
            <i className="fa-solid fa-info-circle"></i>
            <span>Last updated: {new Date().toLocaleTimeString()}</span>
          </div>
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primaryDark transition-all shadow-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailsModal;