import React, { useState } from 'react';
import { DUMMY_EXCEL_DATA } from '../../services/employeeService';
import { getActiveProjects } from '../../services/projectService';
import { saveAssignmentLogs } from '../../services/assignmentService';
import { UserRole } from '../../types';

const ActionOverlay = ({ type, preSelectedEmployee, onClose, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: preSelectedEmployee?.id || '',
    projectId: '',
    taskName: '',
    taskDescription: '',
    priority: 'Medium',
    dueDate: ''
  });

  const projects = getActiveProjects();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const selectedEmployee = preSelectedEmployee || 
        DUMMY_EXCEL_DATA.find(emp => emp.id === formData.employeeId);

      const selectedProject = projects.find(p => p.id === formData.projectId);

      if (selectedEmployee) {
        const assignment = {
          id: `ASG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          taskName: formData.taskName || formData.taskDescription.substring(0, 50),
          taskDescription: formData.taskDescription,
          projectName: selectedProject?.name || 'New Project Track',
          projectId: formData.projectId,
          assignedTo: selectedEmployee.name,
          assignedToId: selectedEmployee.id,
          assignedBy: 'Alex Sterling', // Get from current user context
          assignedAt: new Date().toISOString(),
          status: 'Assigned',
          priority: formData.priority,
          dueDate: formData.dueDate || null,
          source: type
        };

        saveAssignmentLogs([assignment]);
        
        if (onSuccess) {
          onSuccess(assignment);
        }
      }

      setIsSubmitting(false);
      setSuccess(true);

      setTimeout(() => {
        onClose();
      }, 1500);
    }, 1200);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getTitle = () => {
    switch (type) {
      case 'NEW_PROJECT': 
        return 'Initialize Track';
      case 'ALLOCATION': 
        return 'Resource Calibration';
      case 'ASSIGN_TASK': 
        return 'Assign Objective';
      default:
        return 'Action';
    }
  };

  const getDescription = () => {
    switch (type) {
      case 'NEW_PROJECT': 
        return 'Create a new project track and assign initial resources';
      case 'ALLOCATION': 
        return 'Adjust resource allocation and workload distribution';
      case 'ASSIGN_TASK': 
        return 'Assign a specific task or objective to a team member';
      default:
        return '';
    }
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slateBrand/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl border border-borderAudvik overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="bg-primary px-8 py-4 flex items-center justify-between text-white sticky top-0 z-10">
          <div>
            <h2 className="text-base font-bold uppercase tracking-widest">{getTitle()}</h2>
            <p className="text-xs opacity-80 mt-1">{getDescription()}</p>
          </div>
          <button onClick={onClose} className="hover:opacity-70 transition-opacity">
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        <div className="p-8">
          {!success ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Target Resource */}
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-bold text-textSecondary uppercase">
                    <i className="fa-solid fa-user mr-2"></i>
                    Target Resource
                  </label>
                  {preSelectedEmployee ? (
                    <div className="p-4 bg-bgAudvik border border-borderAudvik rounded-lg flex items-center gap-3">
                       <div className="w-10 h-10 bg-white border border-borderAudvik rounded-lg flex items-center justify-center font-bold text-primary">
                         {preSelectedEmployee.name[0]}
                       </div>
                       <div>
                         <p className="text-sm font-bold text-slateBrand">{preSelectedEmployee.name}</p>
                         <p className="text-[10px] font-bold text-textSecondary">{preSelectedEmployee.role}</p>
                       </div>
                    </div>
                  ) : (
                    <select 
                      required 
                      name="employeeId"
                      value={formData.employeeId}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-borderAudvik rounded-lg p-3 text-sm font-semibold outline-none focus:border-primary transition-all"
                    >
                      <option value="">Select Asset...</option>
                      {DUMMY_EXCEL_DATA.slice(0, 20).map(emp => (
                        <option key={emp.id} value={emp.id}>
                          {emp.name} - {emp.role} ({emp.workload}% load)
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Project Selection */}
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-bold text-textSecondary uppercase">
                    <i className="fa-solid fa-folder mr-2"></i>
                    Project
                  </label>
                  <select
                    required
                    name="projectId"
                    value={formData.projectId}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-borderAudvik rounded-lg p-3 text-sm font-semibold outline-none focus:border-primary transition-all"
                  >
                    <option value="">Select Project...</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>
                        {project.name} ({project.category})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Task Name */}
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-bold text-textSecondary uppercase">
                    <i className="fa-solid fa-pen mr-2"></i>
                    Task Name
                  </label>
                  <input
                    required
                    type="text"
                    name="taskName"
                    value={formData.taskName}
                    onChange={handleInputChange}
                    placeholder="e.g., Implement user authentication"
                    className="w-full bg-white border border-borderAudvik rounded-lg p-3 text-sm font-semibold outline-none focus:border-primary transition-all"
                  />
                </div>

                {/* Priority */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-textSecondary uppercase">
                    <i className="fa-solid fa-flag mr-2"></i>
                    Priority
                  </label>
                  <select
                    required
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-borderAudvik rounded-lg p-3 text-sm font-semibold outline-none focus:border-primary transition-all"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>

                {/* Due Date */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-textSecondary uppercase">
                    <i className="fa-solid fa-calendar mr-2"></i>
                    Due Date
                  </label>
                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    min={getTodayDate()}
                    className="w-full bg-white border border-borderAudvik rounded-lg p-3 text-sm font-semibold outline-none focus:border-primary transition-all"
                  />
                </div>

                {/* Task Description */}
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-bold text-textSecondary uppercase">
                    <i className="fa-solid fa-align-left mr-2"></i>
                    Task Description
                  </label>
                  <textarea
                    required
                    name="taskDescription"
                    value={formData.taskDescription}
                    onChange={handleInputChange}
                    placeholder="Provide detailed description of the task or objective..."
                    rows={4}
                    className="w-full bg-white border border-borderAudvik rounded-lg p-3 text-sm font-semibold outline-none focus:border-primary transition-all resize-none"
                  />
                  <p className="text-[10px] text-textSecondary">
                    Provide clear description of the task or project objective
                  </p>
                </div>
              </div>

              {type === 'NEW_PROJECT' && (
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <p className="text-xs text-primary font-semibold">
                    <i className="fa-solid fa-info-circle mr-2"></i>
                    This will create a new project track and assign the resource as lead
                  </p>
                </div>
              )}

              <div className="flex gap-4 pt-4 border-t border-borderAudvik">
                <button 
                  type="button" 
                  onClick={onClose} 
                  className="flex-1 py-3 text-sm font-bold text-textSecondary hover:text-slateBrand transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting || !formData.taskDescription.trim() || (!preSelectedEmployee && !formData.employeeId) || !formData.projectId}
                  className="btn-audvik flex-[2] py-3 rounded-lg font-bold text-sm shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                      Processing...
                    </>
                  ) : (
                    'Deploy Task'
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="py-10 text-center animate-fadeIn">
              <div className="w-20 h-20 bg-success/10 text-success rounded-full flex items-center justify-center text-4xl mx-auto mb-6 border border-success/20">
                <i className="fa-solid fa-check"></i>
              </div>
              <h3 className="text-xl font-bold text-slateBrand">Mandate Dispatched</h3>
              <p className="text-textSecondary text-sm mt-2 font-medium">
                Assignment logged and resource notified
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActionOverlay;