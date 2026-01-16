import { DUMMY_EXCEL_DATA } from './employeeService';

export const assignTasksFromExcel = (tasks, assignedBy = 'System') => {
  const assignments = [];
  const employees = [...DUMMY_EXCEL_DATA].sort((a, b) => a.projects - b.projects);

  tasks.forEach((task) => {
    const assignedEmployee = employees.find(emp => emp.workload < 100);
    
    if (assignedEmployee) {
      assignments.push({
        id: `ASG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        taskName: task.taskName,
        taskDescription: task.taskDescription,
        projectName: task.projectName,
        assignedTo: assignedEmployee.name,
        assignedToId: assignedEmployee.id,
        assignedBy: assignedBy,
        assignedAt: new Date().toISOString(),
        status: 'Assigned',
        priority: task.priority || 'Medium',
        dueDate: task.dueDate || null,
        source: 'EXCEL_IMPORT'
      });

      assignedEmployee.projects += 1;
      assignedEmployee.workload += 15;
      employees.sort((a, b) => a.projects - b.projects);
    }
  });

  return assignments;
};

export const getAssignmentLogs = () => {
  const logs = JSON.parse(localStorage.getItem('assignmentLogs') || '[]');
  return logs;
};

export const saveAssignmentLogs = (newAssignments) => {
  const existingLogs = getAssignmentLogs();
  const updatedLogs = [...newAssignments, ...existingLogs].slice(0, 100);
  localStorage.setItem('assignmentLogs', JSON.stringify(updatedLogs));
  return updatedLogs;
};