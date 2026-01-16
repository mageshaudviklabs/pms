import React, { useState, useEffect } from 'react';
import { getAvailableResources } from '../services/employeeService';
import { getAssignmentLogs } from '../services/assignmentService';
import Card from '../components/Card';

const ManagerDashboard = ({ onOpenImport, onAction }) => {
  const [assignmentLogs, setAssignmentLogs] = useState([]);
  const availableResources = getAvailableResources().slice(0, 4);

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

  return (
    <div className="space-y-6 animate-fadeIn">
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
        <div className="lg:col-span-2 space-y-6">
          <Card title="Resource Bandwidth Overview">
            <div className="h-64 flex items-center justify-center bg-bgAudvik rounded-lg border border-dashed border-borderAudvik">
              <div className="text-center opacity-40">
                <i className="fa-solid fa-chart-area text-4xl mb-2"></i>
                <p className="text-sm font-bold uppercase tracking-widest">Analytics Loading...</p>
              </div>
            </div>
          </Card>

          <Card title="Immediate Capacity Assets">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableResources.map(emp => (
                <div key={emp.id} className="p-4 bg-bgAudvik/40 border border-borderAudvik rounded-lg flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-primary/10 text-primary flex items-center justify-center font-bold">
                      {emp.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slateBrand">{emp.name}</p>
                      <p className="text-[10px] font-bold text-primary uppercase">{emp.role}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => onAction('ASSIGN_TASK', emp)} 
                    className="w-8 h-8 rounded-full bg-white border border-borderAudvik flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all"
                    aria-label={`Assign task to ${emp.name}`}
                  >
                    <i className="fa-solid fa-plus text-xs"></i>
                  </button>
                </div>
              ))}
            </div>
          </Card>

          {/* Assignment Logs Section */}
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
                      className="bg-white border-2 border-borderDiv rounded-2xl p-5 hover:border-primary/30 hover:shadow-md transition-all group"
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-start gap-3 flex-1">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            log.source === 'NEW_PROJECT' ? 'bg-primary/10 text-primary' :
                            log.source === 'ALLOCATION' ? 'bg-warning/10 text-warning' :
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

                      {/* Description */}
                      {log.taskDescription && log.taskDescription !== log.taskName && (
                        <p className="text-sm text-textSecondary mb-3 leading-relaxed">
                          {log.taskDescription}
                        </p>
                      )}

                      {/* Footer with metadata */}
                      <div className="flex items-center justify-between flex-wrap gap-3 pt-3 border-t border-borderDiv">
                        <div className="flex items-center gap-3 flex-wrap">
                          {/* Assigned To */}
                          <div className="flex items-center gap-2 bg-primary/5 px-3 py-1.5 rounded-lg">
                            <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-xs">
                              {log.assignedTo ? log.assignedTo[0] : '?'}
                            </div>
                            <span className="text-xs font-bold text-primary">{log.assignedTo}</span>
                          </div>

                          {/* Priority */}
                          {log.priority && (
                            <span className={`text-xs px-3 py-1.5 rounded-lg font-bold ${getPriorityColor(log.priority)}`}>
                              <i className="fa-solid fa-flag text-xs mr-1"></i>
                              {log.priority}
                            </span>
                          )}

                          {/* Status */}
                          <span className="text-xs px-3 py-1.5 bg-success/10 text-success rounded-lg font-bold">
                            <i className="fa-solid fa-check-circle text-xs mr-1"></i>
                            {log.status}
                          </span>
                        </div>

                        {/* Due Date */}
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

        <div className="space-y-6">
          <Card title="Team Vital Metrics">
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-borderAudvik/50">
                <span className="text-sm font-medium text-textSecondary">Total Engineers</span>
                <span className="text-lg font-bold text-slateBrand">50</span>
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
    </div>
  );
};

export default ManagerDashboard;