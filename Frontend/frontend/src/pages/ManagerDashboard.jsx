import React, { useState, useEffect, useMemo } from 'react';
import useEmployees from '../hooks/useEmployees';
import { getAssignmentLogs } from '../services/assignmentService';
import { taskService } from '../api/taskApi';
import { employeeService } from '../api/employeeApi';
import Card from '../components/Card';
import EmployeeDetailsModal from '../components/EmployeeDetailsModal/EmployeeDetailsModal';

// --- Redesigned Employee Resource Card Component ---
const EmployeeResourceCard = ({ employee, onAction, onViewDetails }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await taskService.getEmployeeTasks(employee.id);
        if (response.data && response.data.success) {
          setTasks(response.data.tasks || []);
        }
      } catch (error) {
        console.error(`Failed to fetch tasks for ${employee.name}`, error);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [employee.id]);

  const activeTasks = tasks.filter(t => t.status === 'Assigned' || t.status === 'In Progress');
  const activeCount = activeTasks.length;

  // Status Logic: 0-1 Available, 2-3 Moderate, 4+ Busy
  const getStatus = () => {
    if (activeCount >= 4) return { label: 'BUSY', color: 'bg-error/10 text-error border-error/20' };
    if (activeCount >= 2) return { label: 'MODERATE', color: 'bg-warning/10 text-warning border-warning/20' };
    return { label: 'AVAILABLE', color: 'bg-success/10 text-success border-success/20' };
  };

  const status = getStatus();

  if (loading) {
    return (
      <div className="bg-white border border-borderDiv rounded-[2rem] p-6 h-48 flex items-center justify-center animate-pulse">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div 
      onClick={onViewDetails}
      className="bg-white border border-borderDiv rounded-[2rem] p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col group relative h-full cursor-pointer overflow-hidden"
    >
      {/* Top Section: Avatar, Name, Role, Counter */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          {/* Avatar with dynamic border based on workload */}
          <div className={`w-14 h-14 rounded-2xl border-2 p-0.5 transition-colors ${
            activeCount >= 4 ? 'border-error/40' : activeCount >= 2 ? 'border-warning/40' : 'border-success/40'
          }`}>
            <div className="w-full h-full bg-bgAudvik rounded-[10px] flex items-center justify-center font-bold text-primary text-xl overflow-hidden shadow-inner">
               {(employee.name || '?').split(' ').map(n => n[0]).join('')}
            </div>
          </div>
          
          <div className="min-w-0">
            <h4 className="text-base font-bold text-textPrimary leading-tight truncate" title={employee.name}>
              {employee.name}
            </h4>
            <p className="text-[10px] font-bold text-primary uppercase tracking-wider mt-0.5 truncate opacity-80">
              {employee.designation}
            </p>
            <p className="text-[10px] text-textSecondary font-medium truncate opacity-60">
              {employee.department}
            </p>
          </div>
        </div>

        {/* Task Counter Gauge Visual - Explicitly showing Active Count */}
        <div className="relative w-11 h-11 flex-shrink-0">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="22"
              cy="22"
              r="18"
              stroke="currentColor"
              strokeWidth="4"
              fill="transparent"
              className="text-bgAudvik"
            />
            <circle
              cx="22"
              cy="22"
              r="18"
              stroke="currentColor"
              strokeWidth="4"
              fill="transparent"
              strokeDasharray={113}
              strokeDashoffset={113 - (Math.min(activeCount, 4) / 4) * 113}
              className={`transition-all duration-700 ${
                activeCount >= 4 ? 'text-error' : activeCount >= 2 ? 'text-warning' : 'text-primary'
              }`}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col pt-0.5">
            <span className="text-sm font-black text-slateBrand leading-none">{activeCount}</span>
            <span className="text-[6px] font-bold text-textSecondary uppercase tracking-tighter opacity-70">Active</span>
          </div>
        </div>
      </div>

      {/* Tags Section: Availability and Active Tasks chips */}
      <div className="flex flex-wrap gap-2 items-center mb-6">
        <span className={`text-[9px] px-2.5 py-1 rounded-lg border font-black tracking-widest ${status.color}`}>
          {status.label}
        </span>
        
        {activeTasks.length > 0 ? (
          <>
            {activeTasks.slice(0, 2).map((t, i) => (
              <span key={i} className="text-[9px] px-2.5 py-1 rounded-lg font-bold bg-bgAudvik text-textSecondary border border-borderAudvik truncate max-w-[100px] shadow-sm" title={t.title}>
                {t.title.toUpperCase()}
              </span>
            ))}
            {activeTasks.length > 2 && (
              <span className="text-[9px] font-bold text-primary bg-primary/5 px-2 py-1 rounded-lg border border-primary/10">
                +{activeTasks.length - 2}
              </span>
            )}
          </>
        ) : (
          <span className="text-[9px] font-bold text-textSecondary italic opacity-40 tracking-wider">NO ACTIVE OBJECTIVES</span>
        )}
      </div>

      {/* Footer Stats & Actions */}
      <div className="mt-auto pt-4 border-t border-borderDiv/50 flex items-center justify-end">
        <div className="flex items-center gap-2 w-full">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onAction('ASSIGN_TASK', employee);
            }}
            className="w-full py-2.5 bg-white border border-borderAudvik text-primary text-[10px] font-bold rounded-xl hover:bg-primary hover:text-white transition-all shadow-sm active:scale-95 flex items-center justify-center gap-1.5"
          >
            <i className="fa-solid fa-plus-circle"></i>
            Assign New Task
          </button>
        </div>
      </div>
    </div>
  );
};

const ManagerDashboard = ({ onOpenImport, onAction, user }) => {
  const { employees: profileEmployees, loading: profilesLoading } = useEmployees();
  const [assignmentLogs, setAssignmentLogs] = useState([]);
  const [selectedEmployeeForDetails, setSelectedEmployeeForDetails] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    loadAssignmentLogs();
  }, [user, refreshKey]);

  const loadAssignmentLogs = async () => {
    const managerId = user?.id || JSON.parse(localStorage.getItem('manager'))?.managerId;
    
    if (managerId) {
      try {
        const response = await taskService.getTaskQueue(managerId);
        const tasks = response.data.tasks || [];

        const mappedLogs = tasks.map(task => ({
          id: task.taskId,
          taskName: task.title,
          projectName: task.metadata?.projectName || task.projectName || 'General',
          taskDescription: task.description,
          assignedBy: task.managerName,
          assignedTo: (task.assignedEmployees && task.assignedEmployees.length > 0)
            ? task.assignedEmployees.map(e => e.employeeName).join(', ')
            : (task.employeeName || 'Unassigned'),
          assignedToId: (task.assignedEmployees && task.assignedEmployees.length > 0)
            ? task.assignedEmployees[0].employeeId
            : (task.employeeId || null),
          assignedAt: task.assignedAt || task.createdAt,
          status: task.status,
          priority: task.priority,
          dueDate: task.deadline,
          source: 'ASSIGN_TASK'
        }));

        mappedLogs.sort((a, b) => new Date(b.assignedAt) - new Date(a.assignedAt));
        setAssignmentLogs(mappedLogs);
      } catch (error) {
        console.error("Failed to load task queue from API", error);
      }
    }
  };

  // Derive active task count per employee from existing manager queue for sorting purposes
  const employeeActiveCounts = useMemo(() => {
    const counts = {};
    assignmentLogs.forEach(log => {
      if (log.status === 'Assigned' || log.status === 'In Progress') {
        const id = log.assignedToId;
        if (id) {
          counts[id] = (counts[id] || 0) + 1;
        }
      }
    });
    return counts;
  }, [assignmentLogs]);

  // Sort employee list: Ascending order of active tasks (0 tasks first)
  const sortedEmployees = useMemo(() => {
    if (!profileEmployees) return [];
    return [...profileEmployees].sort((a, b) => {
      const countA = employeeActiveCounts[a.id] || 0;
      const countB = employeeActiveCounts[b.id] || 0;
      return countA - countB;
    });
  }, [profileEmployees, employeeActiveCounts]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
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

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'Critical': return 'bg-error/10 text-error';
      case 'High': return 'bg-error/10 text-error';
      case 'Medium': return 'bg-warning/10 text-warning';
      case 'Low': return 'bg-success/10 text-success';
      default: return 'bg-gray-100 text-textSecondary';
    }
  };

  if (profilesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <i className="fa-solid fa-spinner fa-spin text-4xl text-primary"></i>
          <p className="text-textSecondary font-black tracking-widest uppercase opacity-70">Synchronizing Personnel Records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Action Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slateBrand tracking-tight">Personnel Overview</h2>
          <p className="text-sm text-textSecondary font-bold opacity-70">Real-time active workload and objective tracking</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={onOpenImport} 
            className="px-6 py-2.5 bg-white border-2 border-borderAudvik text-slateBrand font-black rounded-2xl text-[10px] uppercase tracking-widest hover:border-primary/40 hover:text-primary transition-all shadow-sm flex items-center gap-2"
          >
            <i className="fa-solid fa-file-excel"></i>
            Excel Auto-Assign
          </button>
          <button 
            onClick={() => onAction('NEW_PROJECT')} 
            className="btn-audvik px-6 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 flex items-center gap-2"
          >
            <i className="fa-solid fa-plus-circle"></i>
            Initialize Track
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Team Cards */}
        <div className="lg:col-span-8 space-y-8">
          <Card title="Operational Distribution Analytics">
            <div className="h-64 flex items-center justify-center bg-bgAudvik rounded-[2.5rem] border border-dashed border-borderAudvik">
              <div className="text-center opacity-40">
                <i className="fa-solid fa-chart-line text-4xl mb-3 text-primary"></i>
                <p className="text-sm font-black uppercase tracking-widest text-slateBrand">Predictive Engine Syncing</p>
                <p className="text-[10px] text-textSecondary font-bold mt-1">Live active task metrics are displayed in the resource cards above</p>
              </div>
            </div>
          </Card>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-slateBrand flex items-center gap-2">
                <i className="fa-solid fa-users text-primary"></i>
                Team Resource Overview
                <span className="text-xs font-bold px-3 py-1 bg-primary/10 text-primary rounded-full">{profileEmployees.length} Members</span>
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sortedEmployees.map((emp) => (
                <EmployeeResourceCard 
                  key={emp.id} 
                  employee={emp} 
                  onAction={onAction} 
                  onViewDetails={() => setSelectedEmployeeForDetails(emp)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Activity & Vital Metrics */}
        <div className="lg:col-span-4 space-y-8">
          <Card title="Team Vital Metrics">
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-borderAudvik">
                <div>
                  <p className="text-[10px] font-black text-textSecondary uppercase tracking-widest">Efficiency Rating</p>
                  <p className="text-xl font-black text-success">98.2%</p>
                </div>
                <div className="w-10 h-10 bg-success/5 text-success rounded-2xl flex items-center justify-center border border-success/10 shadow-sm">
                  <i className="fa-solid fa-gauge-high"></i>
                </div>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-borderAudvik">
                <div>
                  <p className="text-[10px] font-black text-textSecondary uppercase tracking-widest">Active Personnel</p>
                  <p className="text-xl font-black text-slateBrand">{profileEmployees.length}</p>
                </div>
                <div className="w-10 h-10 bg-primary/5 text-primary rounded-2xl flex items-center justify-center border border-primary/10 shadow-sm">
                  <i className="fa-solid fa-user-gear"></i>
                </div>
              </div>
            </div>
          </Card>

          <Card title="Dispatch Activity Log" actions={<button onClick={() => setRefreshKey(k => k + 1)} className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline"><i className="fa-solid fa-rotate-right mr-1"></i> Sync</button>}>
            <div className="max-h-[600px] overflow-y-auto custom-scrollbar space-y-4 pr-1">
              {assignmentLogs.length === 0 ? (
                <div className="text-center py-20 text-textSecondary opacity-30 italic"><p className="text-xs font-bold uppercase">No recent activity found.</p></div>
              ) : (
                assignmentLogs.map((log) => (
                  <div key={log.id} className="bg-white border border-borderDiv rounded-[1.5rem] p-4 hover:border-primary/30 transition-all shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <div className="min-w-0">
                        <h4 className="font-bold text-slateBrand text-xs truncate" title={log.taskName}>{log.taskName}</h4>
                        <p className="text-[9px] text-primary font-black uppercase tracking-widest mt-0.5">{log.projectName}</p>
                      </div>
                      <span className="text-[9px] text-textSecondary font-black bg-bgAudvik px-2 py-1 rounded-lg border border-borderAudvik whitespace-nowrap shadow-sm">{formatDate(log.assignedAt)}</span>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-borderDiv border-dashed">
                      <div className="flex items-center gap-2">
                         <div className="w-6 h-6 bg-slateBrand text-white rounded-lg flex items-center justify-center text-[9px] font-black shadow-inner">{log.assignedTo[0]}</div>
                         <span className="text-[10px] font-black text-slateBrand truncate max-w-[100px]">{log.assignedTo}</span>
                      </div>
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${getPriorityColor(log.priority)} uppercase tracking-tighter`}>{log.priority}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>

      {selectedEmployeeForDetails && (
        <EmployeeDetailsModal employee={selectedEmployeeForDetails} onClose={() => setSelectedEmployeeForDetails(null)} />
      )}
    </div>
  );
};

export default ManagerDashboard;