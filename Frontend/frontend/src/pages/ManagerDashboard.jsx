import React, { useState, useEffect, useMemo } from 'react';
import useEmployees from '../hooks/useEmployees';
import { taskService } from '../api/taskApi';
import EmployeeDetailsModal from '../components/EmployeeDetailsModal/EmployeeDetailsModal';
 
// --- Horizontal Scrollable Employee Card ---
const HorizontalEmployeeCard = ({ employee, onAction, onViewDetails }) => {
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
 
  const getStatus = () => {
    if (activeCount >= 4) return { label: 'BUSY', color: 'bg-red-50 text-red-600 border-red-200' };
    if (activeCount >= 2) return { label: 'MODERATE', color: 'bg-amber-50 text-amber-600 border-amber-200' };
    return { label: 'AVAILABLE', color: 'bg-emerald-50 text-emerald-600 border-emerald-200' };
  };
 
  const status = getStatus();
 
  if (loading) {
    return (
      <div className="flex-shrink-0 w-[280px] bg-white border-2 border-gray-300 rounded-2xl p-5 shadow-md flex items-center justify-center h-[240px]">
        <div className="w-8 h-8 border-3 border-[#9B8AC7]/30 border-t-[#9B8AC7] rounded-full animate-spin"></div>
      </div>
    );
  }
 
  return (
    <div className="flex-shrink-0 w-[280px] bg-white border-2 border-gray-300 rounded-2xl p-5 hover:border-[#9B8AC7] hover:shadow-xl transition-all h-full">
      {/* Header Section */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Avatar */}
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#9B8AC7] to-[#8B7AB7] flex items-center justify-center text-white font-black text-lg shadow-lg flex-shrink-0">
            {(employee.name || '?').split(' ').map(n => n[0]).join('')}
          </div>
         
          <div className="flex-1 min-w-0">
            <h4 className="font-black text-gray-900 text-sm truncate mb-0.5" title={employee.name}>
              {employee.name}
            </h4>
            <p className="text-xs text-[#9B8AC7] font-bold uppercase truncate">
              {employee.designation}
            </p>
            <p className="text-xs text-gray-500 truncate">{employee.department}</p>
          </div>
        </div>
 
        {/* Active Counter Badge */}
        <div className="text-center bg-gray-50 rounded-xl px-3 py-1.5 border-2 border-gray-200 flex-shrink-0 ml-2">
          <div className="text-2xl font-black text-gray-900 leading-none">{activeCount}</div>
          <div className="text-[8px] text-gray-500 font-bold uppercase mt-0.5">ACTIVE</div>
        </div>
      </div>
 
      {/* Status Badge */}
      <div className="mb-4">
        <span className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border-2 font-bold uppercase ${status.color}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${
            activeCount >= 4 ? 'bg-red-500' : activeCount >= 2 ? 'bg-amber-500' : 'bg-emerald-500'
          } animate-pulse`}></span>
          {status.label}
        </span>
      </div>
 
      {/* Spacer */}
      <div className="flex-1 mb-4"></div>
 
      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAction('ASSIGN_TASK', employee);
          }}
          className="flex-1 py-2.5 bg-white border-2 border-[#9B8AC7] text-[#9B8AC7] text-xs font-bold rounded-xl hover:bg-[#9B8AC7]/10 transition-all"
        >
          Assign Task
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails();
          }}
          className="flex-1 py-2.5 bg-gradient-to-r from-[#9B8AC7] to-[#8B7AB7] text-white text-xs font-bold rounded-xl hover:from-[#8B7AB7] hover:to-[#7B6AA7] transition-all shadow-md border-2 border-[#8B7AB7]"
        >
          Work History
        </button>
      </div>
    </div>
  );
};
 
// --- Grid Employee Card (for View All modal) ---
const GridEmployeeCard = ({ employee, onAction, onViewDetails }) => {
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
 
  const getStatus = () => {
    if (activeCount >= 4) return { label: 'BUSY', color: 'bg-red-50 text-red-600 border-red-200' };
    if (activeCount >= 2) return { label: 'MODERATE', color: 'bg-amber-50 text-amber-600 border-amber-200' };
    return { label: 'AVAILABLE', color: 'bg-emerald-50 text-emerald-600 border-emerald-200' };
  };
 
  const status = getStatus();
 
  if (loading) {
    return (
      <div className="bg-white border-2 border-gray-300 rounded-2xl p-6 shadow-md flex items-center justify-center h-[240px]">
        <div className="w-8 h-8 border-3 border-[#9B8AC7]/30 border-t-[#9B8AC7] rounded-full animate-spin"></div>
      </div>
    );
  }
 
  return (
    <div className="bg-white border-2 border-gray-300 rounded-2xl p-5 hover:border-[#9B8AC7] hover:shadow-xl transition-all">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#9B8AC7] to-[#8B7AB7] flex items-center justify-center text-white font-black text-lg shadow-lg">
            {(employee.name || '?').split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-black text-gray-900 text-sm truncate mb-0.5">{employee.name}</h4>
            <p className="text-xs text-[#9B8AC7] font-bold uppercase truncate">{employee.designation}</p>
            <p className="text-xs text-gray-500 truncate">{employee.department}</p>
          </div>
        </div>
        <div className="text-center bg-gray-50 rounded-xl px-3 py-1.5 border-2 border-gray-200 flex-shrink-0">
          <div className="text-2xl font-black text-gray-900 leading-none">{activeCount}</div>
          <div className="text-[8px] text-gray-500 font-bold uppercase mt-0.5">ACTIVE</div>
        </div>
      </div>
 
      {/* Status Badge */}
      <div className="mb-4">
        <span className={`inline-block text-xs px-3 py-1.5 rounded-lg border-2 font-bold uppercase ${status.color}`}>
          {status.label}
        </span>
      </div>
 
      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAction('ASSIGN_TASK', employee);
          }}
          className="flex-1 py-2.5 bg-white border-2 border-[#9B8AC7] text-[#9B8AC7] text-xs font-bold rounded-xl hover:bg-[#9B8AC7]/10 transition-all"
        >
          Assign Task
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails();
          }}
          className="flex-1 py-2.5 bg-gradient-to-r from-[#9B8AC7] to-[#8B7AB7] text-white text-xs font-bold rounded-xl hover:from-[#8B7AB7] hover:to-[#7B6AA7] transition-all shadow-md border-2 border-[#8B7AB7]"
        >
          Work History
        </button>
      </div>
    </div>
  );
};
 
// --- View All Employees Modal ---
const ViewAllEmployeesModal = ({ employees, onClose, onAction, onViewDetails }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-6 animate-fadeIn">
      <div className="bg-[#E8E4F0] rounded-3xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden border-2 border-[#9B8AC7]/30">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#9B8AC7] to-[#8B7AB7] text-white px-8 py-6 flex items-center justify-between border-b-2 border-[#8B7AB7]">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/30">
              <i className="fa-solid fa-users text-3xl"></i>
            </div>
            <div>
              <h2 className="text-2xl font-black">All Team Members</h2>
              <p className="text-sm opacity-90 font-semibold">{employees.length} Personnel</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-12 h-12 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all flex items-center justify-center group border-2 border-white/20"
          >
            <i className="fa-solid fa-times text-2xl group-hover:rotate-90 transition-transform"></i>
          </button>
        </div>
 
        {/* Modal Body */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-100px)] custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {employees.map((emp) => (
              <GridEmployeeCard
                key={emp.id}
                employee={emp}
                onAction={onAction}
                onViewDetails={() => {
                  onClose();
                  onViewDetails(emp);
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
 
const ManagerDashboard = ({ onOpenImport, onAction, user }) => {
  const { employees: profileEmployees, loading: profilesLoading } = useEmployees();
  const [assignmentLogs, setAssignmentLogs] = useState([]);
  const [selectedEmployeeForDetails, setSelectedEmployeeForDetails] = useState(null);
  const [showAllEmployees, setShowAllEmployees] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [projects, setProjects] = useState([]);
 
  useEffect(() => {
    loadAssignmentLogs();
    loadProjects();
  }, [user, refreshKey]);
 
  const loadProjects = async () => {
    try {
      setProjects([
        {
          id: 1,
          name: 'AI Attendance System',
          memberCount: 4,
          status: 'In Progress',
          members: ['Aniket Baral', 'Magesh', 'Tanishka Singh', 'Viraj Ray']
        },
        {
          id: 2,
          name: 'Web Dashboard',
          memberCount: 3,
          status: 'Active',
          members: ['Aniket Baral', 'Viraj Ray', 'Magesh']
        },
        {
          id: 3,
          name: 'API Development',
          memberCount: 2,
          status: 'Planning',
          members: ['Magesh', 'Tanishka Singh']
        }
      ]);
    } catch (error) {
      console.error("Failed to load projects", error);
    }
  };
 
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
 
  const getPriorityBadge = (priority) => {
    const styles = {
      'Critical': 'bg-red-100 text-red-700 border-red-200',
      'High': 'bg-orange-100 text-orange-700 border-orange-200',
      'Medium': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'Low': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    };
    return styles[priority] || 'bg-gray-100 text-gray-600 border-gray-200';
  };
 
  if (profilesLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#E8E4F0]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-[#9B8AC7]/30 border-t-[#9B8AC7] rounded-full animate-spin"></div>
          <p className="text-gray-700 font-bold text-lg">Loading Personnel Records...</p>
        </div>
      </div>
    );
  }
 
  return (
    <div className="min-h-screen bg-[#E8E4F0] p-8">
      <div className="max-w-[1900px] mx-auto">
       
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
         
          {/* CENTER COLUMN - Main Content (68%) */}
          <div className="xl:col-span-8 space-y-8">
           
            {/* Analytics Dashboard */}
            <div className="bg-white border-2 border-gray-300 rounded-3xl p-8 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-gray-900">Analytics Dashboard</h2>
                <span className="px-4 py-2 bg-gradient-to-r from-[#9B8AC7] to-[#8B7AB7] text-white text-xs font-bold rounded-xl shadow-md border-2 border-[#8B7AB7]">
                  {projects.length} Projects
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-8 font-medium leading-relaxed">
                All the projects under specific manager with options to see the members working in it and button which we can use to see the status of the project.
              </p>
 
              {/* Projects Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="bg-white border-2 border-gray-300 rounded-2xl p-6 hover:border-[#9B8AC7] hover:shadow-xl transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="font-black text-gray-900 text-base flex-1 pr-2 leading-tight">
                        {project.name}
                      </h3>
                      <span className="text-[11px] bg-[#9B8AC7]/10 text-[#9B8AC7] px-3 py-1.5 rounded-lg font-bold border-2 border-[#9B8AC7]/30 whitespace-nowrap">
                        {project.status}
                      </span>
                    </div>
 
                    {/* Member Count */}
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-4 font-semibold">
                      <i className="fa-solid fa-users text-[#9B8AC7]"></i>
                      <span>{project.memberCount} Members Working</span>
                    </div>
 
                    {/* Member Avatars */}
                    <div className="flex items-center gap-2 mb-5">
                      {project.members.slice(0, 3).map((member, idx) => (
                        <div
                          key={idx}
                          className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#9B8AC7] to-[#8B7AB7] text-white text-xs font-bold flex items-center justify-center border-2 border-white shadow-md"
                          title={member}
                        >
                          {member[0]}
                        </div>
                      ))}
                      {project.memberCount > 3 && (
                        <div className="w-9 h-9 rounded-xl bg-gray-200 text-gray-700 text-xs font-bold flex items-center justify-center border-2 border-white shadow-md">
                          +{project.memberCount - 3}
                        </div>
                      )}
                    </div>
 
                    {/* Action Buttons */}
                    <div className="space-y-3">
                      <button className="w-full py-3 text-sm font-bold text-[#9B8AC7] bg-white border-2 border-[#9B8AC7] rounded-xl hover:bg-[#9B8AC7]/10 transition-all">
                        View Members
                      </button>
                      <button className="w-full py-3 text-sm font-bold text-white bg-gradient-to-r from-[#9B8AC7] to-[#8B7AB7] rounded-xl hover:from-[#8B7AB7] hover:to-[#7B6AA7] transition-all shadow-lg border-2 border-[#8B7AB7]">
                        Project Status
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
 
            {/* Team Members Section - HORIZONTAL SCROLL RESTORED */}
            <div className="bg-white border-2 border-gray-300 rounded-3xl p-8 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-gray-900">Team Resource Overview</h2>
                <button
                  onClick={() => setShowAllEmployees(true)}
                  className="px-6 py-3 text-sm font-bold text-[#9B8AC7] bg-white border-2 border-[#9B8AC7] rounded-xl hover:bg-[#9B8AC7]/10 transition-all shadow-md flex items-center gap-3"
                >
                  <i className="fa-solid fa-users"></i>
                  View All ({profileEmployees.length})
                </button>
              </div>
 
              {/* Horizontal Scrollable Member Cards */}
              <div className="overflow-x-auto pb-4 -mx-2 px-2 custom-scrollbar">
                <div className="flex gap-6 min-w-min">
                  {sortedEmployees.map((emp) => (
                    <HorizontalEmployeeCard
                      key={emp.id}
                      employee={emp}
                      onAction={onAction}
                      onViewDetails={() => setSelectedEmployeeForDetails(emp)}
                    />
                  ))}
                </div>
              </div>
 
              {sortedEmployees.length === 0 && (
                <div className="text-center py-20 text-gray-300">
                  <i className="fa-solid fa-users-slash text-6xl mb-4"></i>
                  <p className="text-base font-bold">No team members found</p>
                </div>
              )}
            </div>
          </div>
 
          {/* RIGHT COLUMN - Action Buttons + Activity Log (32%) */}
          <div className="xl:col-span-4 space-y-8">
           
            {/* Action Buttons */}
            <div className="bg-white border-2 border-gray-300 rounded-3xl p-6 shadow-xl space-y-4">
              {/* Excel Upload Button */}
              <button
                onClick={onOpenImport}
                className="w-full py-5 bg-white border-2 border-gray-300 rounded-2xl text-gray-700 font-bold text-base hover:border-[#9B8AC7] hover:bg-[#9B8AC7]/5 transition-all flex items-center justify-center gap-4 shadow-md group"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform border-2 border-emerald-300">
                  <i className="fa-solid fa-file-excel text-emerald-600 text-2xl"></i>
                </div>
                <span className="text-lg">Excel Upload</span>
              </button>
 
              {/* New Task Button */}
              <button
                onClick={() => onAction('NEW_PROJECT')}
                className="w-full py-5 bg-gradient-to-r from-[#9B8AC7] to-[#8B7AB7] text-white font-bold text-base rounded-2xl hover:from-[#8B7AB7] hover:to-[#7B6AA7] transition-all flex items-center justify-center gap-4 shadow-xl group border-2 border-[#8B7AB7]"
              >
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform border-2 border-white/30">
                  <i className="fa-solid fa-plus text-white text-2xl"></i>
                </div>
                <span className="text-lg">New Task</span>
              </button>
            </div>
 
            {/* Activity Log - FIXED HEIGHT, NO OVERFLOW */}
            <div className="bg-white border-2 border-gray-300 rounded-3xl p-6 shadow-xl h-[calc(100vh-28rem)] flex flex-col">
              <div className="flex items-center justify-between mb-6 flex-shrink-0">
                <h3 className="text-xl font-black text-gray-900">Activity Log</h3>
                <button
                  onClick={() => setRefreshKey(k => k + 1)}
                  className="px-3 py-2 text-[#9B8AC7] text-xs font-bold hover:text-[#8B7AB7] flex items-center gap-2 bg-[#9B8AC7]/10 rounded-lg hover:bg-[#9B8AC7]/20 transition-all border-2 border-[#9B8AC7]/30"
                >
                  <i className="fa-solid fa-rotate-right"></i>
                  SYNC
                </button>
              </div>
 
              {/* Scrollable Activity List - Constrained to Container */}
              <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">
                {assignmentLogs.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-300">
                    <div className="text-center">
                      <i className="fa-solid fa-inbox text-6xl mb-4"></i>
                      <p className="text-base font-bold">No recent activity</p>
                    </div>
                  </div>
                ) : (
                  assignmentLogs.map((log) => (
                    <div
                      key={log.id}
                      className="bg-white border-2 border-gray-300 rounded-2xl p-5 hover:border-[#9B8AC7] hover:shadow-lg transition-all flex-shrink-0"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-gray-900 text-sm truncate mb-1.5" title={log.taskName}>
                            {log.taskName}
                          </h4>
                          <p className="text-[11px] text-[#9B8AC7] font-bold uppercase tracking-wide">
                            {log.projectName}
                          </p>
                        </div>
                        <span className="text-[11px] text-gray-500 font-bold bg-gray-100 px-3 py-1.5 rounded-lg border-2 border-gray-200 whitespace-nowrap ml-3 shadow-sm">
                          {formatDate(log.assignedAt)}
                        </span>
                      </div>
 
                      <div className="flex items-center justify-between pt-4 border-t-2 border-gray-200">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-gradient-to-br from-[#9B8AC7] to-[#8B7AB7] text-white rounded-xl flex items-center justify-center text-xs font-bold shadow-md border-2 border-[#8B7AB7]">
                            {log.assignedTo[0]}
                          </div>
                          <span className="text-sm font-bold text-gray-800 truncate max-w-[120px]">
                            {log.assignedTo}
                          </span>
                        </div>
                        <span className={`text-[11px] font-bold px-3 py-1.5 rounded-xl border-2 ${getPriorityBadge(log.priority)} shadow-sm`}>
                          {log.priority}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
 
      {/* View All Employees Modal */}
      {showAllEmployees && (
        <ViewAllEmployeesModal
          employees={sortedEmployees}
          onClose={() => setShowAllEmployees(false)}
          onAction={onAction}
          onViewDetails={setSelectedEmployeeForDetails}
        />
      )}
 
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