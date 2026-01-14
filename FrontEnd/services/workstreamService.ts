
import * as XLSX from 'xlsx';
import { TaskRecord, Project } from '../types';
import { parseExcelDate } from '../utils/dateUtils';

export const WorkstreamService = {
  async processFileUpload(file: File): Promise<TaskRecord[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const json = XLSX.utils.sheet_to_json(sheet) as any[];
          
          const importedTasks: TaskRecord[] = json.map((row, idx) => ({
            id: row.id || `TASK-XL-${idx}-${Date.now()}`,
            employeeId: row.Employee_ID || row.employeeId || `ALF-${Math.floor(Math.random() * 10000)}`,
            employeeName: row.Employee_Name || row.employeeName || row.Name || row.Lead || 'Unknown',
            role: row.Role || row.role || 'LEAD',
            date: parseExcelDate(row.Date || row.date),
            projectName: row['Project Name'] || row.projectName || row.Project || 'General',
            taskAssigned: row['Task Assigned'] || row.taskAssigned || row.Task || 'No Task',
            taskDescription: row['Task Description'] || row.taskDescription || '-',
            projectAssignedBy: row['Project Assigned By'] || row.projectAssignedBy || row['Assigned By'] || 'System',
            startTime: row['Start Time'] || row.startTime || '09:00',
            endTime: row['End Time'] || row.endTime || '18:00',
            completionDue: parseExcelDate(row['Task Completion Due'] || row.completionDue || row['Completion Due'] || row.Due),
            completionStatus: (row['Task Completion Status'] || row.completionStatus || row.Status || 'Pending') as any,
            remarks: row.Remarks || row.remarks || '-',
            repoUrl: row['Repo / URL'] || row.repoUrl || row.Repo || ''
          }));
          resolve(importedTasks);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('File reading failed'));
      reader.readAsBinaryString(file);
    });
  },

  generateAutoProject(name: string): Project {
    return {
      id: `PRJ-AUTO-${Math.floor(Math.random() * 1000)}`,
      name: name,
      status: 'Active',
      health: 100
    };
  }
};
