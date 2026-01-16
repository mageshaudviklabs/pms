import React, { useState, useEffect } from 'react';
import { DUMMY_EXCEL_DATA } from '../services/employeeService';
import { getAssignmentLogs } from '../services/assignmentService';
import Card from '../components/Card';
import EmployeeDetailsModal from '../components/EmployeeDetailsModal/EmployeeDetailsModal';

const ManagerDashboard = ({ onOpenImport, onAction }) => {
  const [assignmentLogs, setAssignmentLogs] = useState([]);
  const [showAllEmployees, setShowAllEmployees] = useState(false);
  const [selectedEmployeeForDetails, setSelectedEmployeeForDetails] = useState(null);
  
  // Get all employees sorted by workload (ascending)
  const allEmployees = [...DUMMY_EXCEL_DATA].sort((a, b) => a.workload - b.workload);

  useEffect(() => {
    loadAssignmentLogs();
  }, []);

  const loadAssignmentLogs = () => {
    const logs = getAssignmentLogs();
    setAssignmentLogs(logs);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getSourceIcon = (source) => {
    switch(source) {
      case 'NEW_PROJECT': return 'fa-folder-plus';
      case 'ALLOCATION': return 'fa-sliders';
      case 'ASSIGN_TASK': return 'fa-tasks';
      case 'EXCEL_IMPORT': return 'fa-file-excel';
      default: return 'fa-check';
    }
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

  const getWorkloadColor = (workload) => {
    if (workload >= 100) return 'text-error';
    if (workload >= 80) return 'text-warning';
    return 'text-success';
  };

  const getWorkloadBgColor = (workload) => {
    if (workload >= 100) return 'bg-error';
    if (workload >= 80) return 'bg-warning';
    return 'bg-success';
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <button 
          onClick={onOpenImport} 
          className="px-6 py-2 border border-primary text-primary font-bold rounded text-sm hover:bg-primary/5 transition-all"
          aria-label="Import Personnel Data"
        >
          <i className="fa-solid fa-file-upload mr-2"></i>
          Import & Auto-Assign Tasks
        </button>
        <button 
          onClick={() => onAction('NEW_PROJECT')} 
          className="btn-audvik px-6 py-2 rounded font-bold text-sm shadow-sm"
          aria-label="Initialize Track"
        >
          <i className="fa-solid fa-rocket mr-2"></i>
          Initialize Track
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Resource Bandwidth Overview */}
          <Card title="Resource Bandwidth Overview">
            <div className="h-64 flex items-center justify-center bg-bgAudvik rounded-lg border border-dashed border-borderAudvik">
              <div className="text-center opacity-40">
                <i className="fa-solid fa-chart-area text-4xl mb-2"></i>
                <p className="text-sm font-bold uppercase tracking-widest">Analytics Loading...</p>
              </div>
            </div>
          </Card>

          {/* Team Resource Overview */}
          <div className="bg-white rounded-2xl border border-borderDiv shadow-sm overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-borderDiv bg-gradient-to-r from-primary/5 to-transparent">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <i className="fa-solid fa-users text-primary text-lg"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-textPrimary">Team Resource Overview</h3>
                    <p className="text-xs text-textSecondary mt-0.5">
                      Sorted by availability • Updated just now
                    </p>
                  </div>
                  <span className="ml-2 text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-full font-bold">
                    {allEmployees.length} Members
                  </span>
                </div>
                <button 
                  onClick={() => setShowAllEmployees(!showAllEmployees)}
                  className="flex items-center gap-2 text-sm text-primary font-bold hover:bg-primary/5 px-4 py-2 rounded-lg transition-all"
                >
                  {showAllEmployees ? (
                    <>
                      <i className="fa-solid fa-chevron-up"></i>
                      Show Less
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-chevron-down"></i>
                      View All
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Scrollable Cards Container */}
            <div className="p-6 bg-gray-50/50">
              <div className="relative">
                <div className="overflow-x-auto pb-4 custom-scrollbar -mx-2 px-2">
                  <div className="flex gap-5 min-w-max">
                    {allEmployees
                      .slice(0, showAllEmployees ? allEmployees.length : 10)
                      .map((emp) => (
                        <div 
                          key={emp.id} 
                          className="w-[340px] flex-shrink-0 bg-white border-2 border-borderDiv rounded-2xl hover:border-primary/40 hover:shadow-xl transition-all duration-300 overflow-hidden"
                        >
                          {/* Card Header */}
                          <div className={`p-5 relative overflow-hidden ${
                            emp.workload >= 100 ? 'bg-gradient-to-br from-error/10 to-error/5' :
                            emp.workload >= 80 ? 'bg-gradient-to-br from-warning/10 to-warning/5' :
                            'bg-gradient-to-br from-success/10 to-success/5'
                          }`}>
                            <div className="flex items-start justify-between relative z-10">
                              <div className="flex items-center gap-3">
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg ${
                                  emp.workload >= 100 ? 'bg-gradient-to-br from-error to-error/80 text-white' :
                                  emp.workload >= 80 ? 'bg-gradient-to-br from-warning to-warning/80 text-white' :
                                  'bg-gradient-to-br from-primary to-primaryDark text-white'
                                }`}>
                                  {emp.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                  <h4 className="text-base font-bold text-textPrimary leading-tight mb-1">
                                    {emp.name}
                                  </h4>
                                  <p className="text-xs font-bold text-primary uppercase">
                                    {emp.role}
                                  </p>
                                  <p className="text-[10px] text-textSecondary mt-1 flex items-center gap-1">
                                    <i className="fa-solid fa-building text-xs"></i>
                                    {emp.department}
                                  </p>
                                </div>
                              </div>
                              {/* Eye Icon - View Details */}
                              <button 
                                onClick={() => setSelectedEmployeeForDetails(emp)}
                                className="w-11 h-11 rounded-xl bg-white/80 backdrop-blur-sm border-2 border-primary/30 flex items-center justify-center text-primary hover:bg-primary hover:text-white hover:border-primary hover:scale-110 transition-all shadow-md"
                                aria-label={`View details for ${emp.name}`}
                                title="View Employee Details"
                              >
                                <i className="fa-solid fa-eye text-lg"></i>
                              </button>
                            </div>
                            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                          </div>

                          {/* Card Body */}
                          <div className="p-5 space-y-4">
                            {/* Projects and Workload Stats */}
                            <div className="grid grid-cols-2 gap-4">
                              <div className="bg-gray-50 rounded-xl p-3 border border-borderDiv">
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                                    <i className="fa-solid fa-briefcase text-primary text-sm"></i>
                                  </div>
                                  <p className="text-[10px] text-textSecondary font-bold uppercase">Projects</p>
                                </div>
                                <p className="text-2xl font-black text-primary leading-none">{emp.projects}</p>
                              </div>
                              
                              <div className="bg-gray-50 rounded-xl p-3 border border-borderDiv">
                                <div className="flex items-center gap-2 mb-2">
                                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                    emp.workload >= 100 ? 'bg-error/10' :
                                    emp.workload >= 80 ? 'bg-warning/10' :
                                    'bg-success/10'
                                  }`}>
                                    <i className={`fa-solid fa-chart-line text-sm ${getWorkloadColor(emp.workload)}`}></i>
                                  </div>
                                  <p className="text-[10px] text-textSecondary font-bold uppercase">Workload</p>
                                </div>
                                <p className={`text-2xl font-black leading-none ${getWorkloadColor(emp.workload)}`}>
                                  {emp.workload}%
                                </p>
                              </div>
                            </div>

                            {/* Workload Progress Bar */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-textSecondary font-semibold">Capacity Usage</span>
                                <span className={`font-bold ${getWorkloadColor(emp.workload)}`}>
                                  {emp.workload >= 100 ? 'Over Limit' : 
                                   emp.workload >= 80 ? 'High' : 'Normal'}
                                </span>
                              </div>
                              <div className="relative">
                                <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full ${getWorkloadBgColor(emp.workload)} transition-all duration-700 ease-out rounded-full relative`}
                                    style={{ width: `${Math.min(emp.workload, 100)}%` }}
                                  >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20"></div>
                                  </div>
                                </div>
                                {emp.workload > 100 && (
                                  <div className="absolute -right-1 top-0 bottom-0 flex items-center">
                                    <div className="w-5 h-5 bg-error rounded-full flex items-center justify-center shadow-lg animate-pulse">
                                      <i className="fa-solid fa-exclamation text-white text-xs"></i>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Status and Performance Badges */}
                            <div className="flex items-center justify-between">
                              <span className={`text-xs px-3 py-2 rounded-lg font-bold flex items-center gap-2 ${
                                emp.workload >= 100 ? 'bg-error/10 text-error' :
                                emp.workload >= 80 ? 'bg-warning/10 text-warning' :
                                'bg-success/10 text-success'
                              }`}>
                                {emp.workload >= 100 ? (
                                  <>
                                    <i className="fa-solid fa-triangle-exclamation"></i>
                                    Overloaded
                                  </>
                                ) : emp.workload >= 80 ? (
                                  <>
                                    <i className="fa-solid fa-hourglass-half"></i>
                                    Near Capacity
                                  </>
                                ) : (
                                  <>
                                    <i className="fa-solid fa-circle-check"></i>
                                    Available
                                  </>
                                )}
                              </span>
                              <span className="text-xs text-textSecondary font-semibold bg-gray-100 px-3 py-2 rounded-lg flex items-center gap-1">
                                <i className="fa-solid fa-chart-simple text-xs"></i>
                                {emp.performance}
                              </span>
                            </div>

                            {/* Single Assign Button - Always Visible */}
                            <button 
                              onClick={() => onAction('ASSIGN_TASK', emp)}
                              className="w-full py-3 text-sm font-bold text-white bg-primary rounded-xl transition-all flex items-center justify-center gap-2 hover:bg-primaryDark hover:shadow-lg"
                            >
                              <i className="fa-solid fa-plus"></i>
                              Assign New Task
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Scroll Indicators */}
                {!showAllEmployees && allEmployees.length > 10 && (
                  <>
                    <div className="absolute left-0 top-0 bottom-4 w-12 bg-gradient-to-r from-gray-50/50 to-transparent pointer-events-none"></div>
                    <div className="absolute right-0 top-0 bottom-4 w-24 bg-gradient-to-l from-gray-50/50 to-transparent pointer-events-none"></div>
                  </>
                )}
              </div>
            </div>

            {/* Footer Statistics */}
            <div className="px-6 py-4 bg-white border-t border-borderDiv">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-success rounded-full shadow-sm"></div>
                    <span className="text-xs text-textSecondary">
                      Available: <strong className="text-success font-bold">{allEmployees.filter(e => e.workload < 80).length}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-warning rounded-full shadow-sm"></div>
                    <span className="text-xs text-textSecondary">
                      Near Capacity: <strong className="text-warning font-bold">{allEmployees.filter(e => e.workload >= 80 && e.workload < 100).length}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-error rounded-full shadow-sm animate-pulse"></div>
                    <span className="text-xs text-textSecondary">
                      Overloaded: <strong className="text-error font-bold">{allEmployees.filter(e => e.workload >= 100).length}</strong>
                    </span>
                  </div>
                </div>
                <span className="text-xs text-textSecondary font-semibold flex items-center gap-2">
                  <i className="fa-solid fa-arrow-right"></i>
                  Scroll to view more
                </span>
              </div>
            </div>
          </div>

          {/* Assignment Logs */}
          <Card 
            title={
              <div className="flex items-center gap-2">
                <span>Assignment Activity Log</span>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded font-bold">
                  {assignmentLogs.length}
                </span>
              </div>
            }
            actions={
              <button 
                onClick={loadAssignmentLogs}
                className="text-primary text-xs font-bold hover:underline"
              >
                <i className="fa-solid fa-rotate-right mr-1"></i>
                Refresh
              </button>
            }
          >
            <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
              {assignmentLogs.length === 0 ? (
                <div className="text-center py-12 text-textSecondary">
                  <i className="fa-solid fa-inbox text-4xl mb-3 opacity-30"></i>
                  <p className="font-semibold">No assignments yet</p>
                  <p className="text-sm mt-1">Upload an Excel file or initialize a track</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {assignmentLogs.map((log) => (
                    <div 
                      key={log.id} 
                      className="bg-white border-2 border-borderDiv rounded-2xl p-5 hover:border-primary/30 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-start gap-3 flex-1">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            log.source === 'NEW_PROJECT' ? 'bg-primary/10 text-primary' :
                            log.source === 'ALLOCATION' ? 'bg-warning/10 text-warning' :
                            log.source === 'EXCEL_IMPORT' ? 'bg-success/10 text-success' :
                            'bg-success/10 text-success'
                          }`}>
                            <i className={`fa-solid ${getSourceIcon(log.source)} text-lg`}></i>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-textPrimary text-base leading-tight mb-1">
                              {log.taskName}
                            </h4>
                            <p className="text-sm text-primary font-semibold">
                              <i className="fa-solid fa-folder text-xs mr-1"></i>
                              {log.projectName}
                            </p>
                          </div>
                        </div>
                        
                        <span className="text-[11px] text-textSecondary font-bold whitespace-nowrap bg-gray-100 px-3 py-1 rounded-full">
                          {formatDate(log.assignedAt)}
                        </span>
                      </div>

                      {log.taskDescription && log.taskDescription !== log.taskName && (
                        <p className="text-sm text-textSecondary mb-3 leading-relaxed">
                          {log.taskDescription}
                        </p>
                      )}

                      {log.assignedBy && (
                        <div className="mb-3 p-3 bg-bgAudvik/50 rounded-lg border border-borderAudvik">
                          <div className="flex items-center gap-2">
                            <i className="fa-solid fa-user-tie text-primary text-xs"></i>
                            <span className="text-xs text-textSecondary">Assigned by:</span>
                            <span className="text-xs font-bold text-primary">{log.assignedBy}</span>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between flex-wrap gap-3 pt-3 border-t border-borderDiv">
                        <div className="flex items-center gap-3 flex-wrap">
                          <div className="flex items-center gap-2 bg-primary/5 px-3 py-1.5 rounded-lg">
                            <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-xs">
                              {log.assignedTo ? log.assignedTo[0] : '?'}
                            </div>
                            <span className="text-xs font-bold text-primary">{log.assignedTo}</span>
                          </div>

                          {log.priority && (
                            <span className={`text-xs px-3 py-1.5 rounded-lg font-bold ${getPriorityColor(log.priority)}`}>
                              <i className="fa-solid fa-flag text-xs mr-1"></i>
                              {log.priority}
                            </span>
                          )}

                          <span className="text-xs px-3 py-1.5 bg-success/10 text-success rounded-lg font-bold">
                            <i className="fa-solid fa-check-circle text-xs mr-1"></i>
                            {log.status}
                          </span>
                        </div>

                        {log.dueDate && (
                          <div className="flex items-center gap-2 text-xs text-textSecondary bg-gray-50 px-3 py-1.5 rounded-lg">
                            <i className="fa-solid fa-calendar"></i>
                            <span className="font-semibold">
                              Due: {new Date(log.dueDate).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric', 
                                year: 'numeric' 
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
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <Card title="Team Vital Metrics">
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-borderAudvik/50">
                <span className="text-sm font-medium text-textSecondary">Total Engineers</span>
                <span className="text-lg font-bold text-slateBrand">{allEmployees.length}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-borderAudvik/50">
                <span className="text-sm font-medium text-textSecondary">Utilization</span>
                <span className="text-lg font-bold text-success">74.2%</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-borderAudvik/50">
                <span className="text-sm font-medium text-textSecondary">Active Projects</span>
                <span className="text-lg font-bold text-primary">12</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm font-medium text-textSecondary">Tasks Assigned Today</span>
                <span className="text-lg font-bold text-warning">
                  {assignmentLogs.filter(log => {
                    const today = new Date().toDateString();
                    const logDate = new Date(log.assignedAt).toDateString();
                    return today === logDate;
                  }).length}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Employee Details Modal */}
      {selectedEmployeeForDetails && (
        <EmployeeDetailsModal 
          employee={selectedEmployeeForDetails}
          onClose={() => setSelectedEmployeeForDetails(null)}
        />
      )}
    </div>
  );
};

export default ManagerDashboard;