import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import useEmployees from '../../hooks/useEmployees';
import { taskService } from '../../api/taskApi';

const ExcelImportModal = ({ onClose, onAssignmentComplete }) => {
  const { employees } = useEmployees();
  const [step, setStep] = useState('upload');
  const [file, setFile] = useState(null);
  const [parsedTasks, setParsedTasks] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [showTemplateGuide, setShowTemplateGuide] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const parseExcelFile = async () => {
    if (!file) return;

    setIsLoading(true);
    try {
      const response = await taskService.importPreview(file);
      
      if (response.data && response.data.success) {
        const apiTasks = response.data.tasks || [];
        
        // Map API response to UI state structure
        const uiTasks = apiTasks.map(t => ({
          taskName: t.title,
          taskDescription: t.description,
          projectName: t.metadata?.projectName || 'General',
          priority: t.priority,
          dueDate: t.deadline,
          assignedTo: t.employee?.employeeName || 'Unassigned',
          // Store raw object for confirmation step
          _raw: t
        }));

        setParsedTasks(uiTasks);
        setStep('preview');
      } else {
        alert('Failed to preview tasks. Please check the file.');
      }
    } catch (error) {
      console.error("Preview failed:", error);
      alert('Error uploading file. Please check the format.');
    } finally {
      setIsLoading(false);
    }
  };

  const confirmImport = async () => {
    setIsLoading(true);
    try {
      const managerStr = localStorage.getItem('manager');
      const manager = managerStr ? JSON.parse(managerStr) : null;

      if (!manager || !manager.managerId) {
        alert("Manager session missing. Please re-login.");
        setIsLoading(false);
        return;
      }

      // Extract raw tasks for backend
      const tasksPayload = parsedTasks.map(t => t._raw);

      const response = await taskService.confirmImport(manager.managerId, tasksPayload);

      if (response.data && response.data.success) {
        // Prepare assignment summary for success screen
        const summary = parsedTasks.map(t => ({
          taskName: t.taskName,
          assignedTo: t._raw.employee?.employeeName || 'Unassigned'
        }));
        
        setAssignments(summary);
        setStep('success');

        setTimeout(() => {
          if (onAssignmentComplete) onAssignmentComplete();
          onClose();
        }, 2000);
      } else {
        alert('Failed to confirm assignments.');
      }
    } catch (error) {
      console.error("Confirmation failed:", error);
      alert('An error occurred while assigning tasks.');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadTemplate = () => {
    const template = [
      {
        'Task Name': 'Implement Login API',
        'Task Description': 'Create REST API for user authentication',
        'Project Name': 'Auth Service',
        'Due Date': '2026-04-15',
        'Priority': 'High'
      },
      {
        'Task Name': 'Design Dashboard UI',
        'Task Description': 'Create wireframes and mockups',
        'Project Name': 'Frontend',
        'Due Date': '2026-04-20',
        'Priority': 'Medium'
      }
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Tasks');
    XLSX.writeFile(wb, 'PMS_Task_Template.xlsx');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-textPrimary/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden animate-slideUp max-h-[90vh] overflow-y-auto">
        <div className="px-8 py-6 border-b border-borderDiv flex items-center justify-between bg-sidebarBg sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <i className="fa-solid fa-file-excel text-xl"></i>
            </div>
            <div>
              <h2 className="text-xl font-bold text-textPrimary leading-none">Import Tasks from Excel</h2>
              <p className="text-sm text-textSecondary mt-1">Auto-assign based on workload</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-gray-200 transition-colors flex items-center justify-center text-textSecondary">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="p-8">
          {step === 'upload' && (
            <div className="space-y-6">
              <div className="border-2 border-dashed border-borderDiv rounded-2xl p-10 text-center flex flex-col items-center bg-gray-50/50 hover:bg-sidebarBg transition-colors">
                <i className="fa-solid fa-cloud-arrow-up text-5xl text-primary/30 mb-4"></i>
                <p className="text-lg font-bold text-textPrimary">Drag and drop your Task Excel</p>
                <input type="file" id="excelUpload" className="hidden" accept=".xlsx, .xls" onChange={handleFileChange} />
                <label htmlFor="excelUpload" className="mt-6 px-6 py-2.5 bg-white border border-borderDiv rounded-xl font-bold text-primary hover:bg-gray-50 cursor-pointer shadow-sm">
                  Select File
                </label>
                {file && (
                  <div className="mt-4 flex items-center gap-2">
                    <i className="fa-solid fa-file-excel text-success"></i>
                    <p className="text-sm font-bold text-primaryDark">{file.name}</p>
                  </div>
                )}
              </div>

              <div className="border border-borderDiv rounded-xl overflow-hidden">
                <button 
                  onClick={() => setShowTemplateGuide(!showTemplateGuide)}
                  className="w-full px-4 py-3 bg-white flex items-center justify-between text-sm font-bold text-textPrimary hover:bg-gray-50 transition-colors"
                >
                  <span>📋 Required Excel Format</span>
                  <i className={`fa-solid fa-chevron-${showTemplateGuide ? 'up' : 'down'} text-xs text-textSecondary`}></i>
                </button>
                {showTemplateGuide && (
                  <div className="p-4 bg-gray-50 text-xs space-y-4 border-t border-borderDiv">
                    <div>
                      <p className="font-bold text-primary uppercase mb-2">Required Columns:</p>
                      <ul className="list-disc list-inside space-y-1 text-textSecondary">
                        <li><strong>Task Name</strong> - Name of the task</li>
                        <li><strong>Task Description</strong> - Details about the task</li>
                        <li><strong>Project Name</strong> - Which project this belongs to</li>
                        <li><strong>Due Date</strong> (Optional) - Format: YYYY-MM-DD</li>
                        <li><strong>Priority</strong> (Optional) - High/Medium/Low</li>
                      </ul>
                    </div>
                    <button 
                      onClick={downloadTemplate}
                      className="flex items-center gap-2 text-primary font-bold hover:underline"
                    >
                      <i className="fa-solid fa-download"></i>
                      Download Template Excel
                    </button>
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-4 border-t border-borderDiv gap-3">
                <button onClick={onClose} className="px-6 py-3 text-textSecondary font-bold hover:text-slateBrand transition-all">
                  Cancel
                </button>
                <button 
                  onClick={parseExcelFile}
                  disabled={!file || isLoading}
                  className={`px-8 py-3 rounded-xl font-bold transition-all ${file && !isLoading ? 'bg-primary text-white hover:bg-primaryDark' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                >
                  {isLoading ? 'Uploading...' : 'Parse & Preview'}
                </button>
              </div>
            </div>
          )}

          {step === 'preview' && (
            <div className="space-y-6">
              <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl">
                <p className="text-sm font-bold text-primary">
                  <i className="fa-solid fa-info-circle mr-2"></i>
                  {parsedTasks.length} tasks will be assigned to employees with the least workload
                </p>
              </div>

              <div className="border border-borderDiv rounded-xl max-h-96 overflow-y-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-textSecondary sticky top-0">
                    <tr>
                      <th className="p-3 font-bold">Task Name</th>
                      <th className="p-3 font-bold">Project</th>
                      <th className="p-3 font-bold">Priority</th>
                      <th className="p-3 font-bold">Due Date</th>
                      <th className="p-3 font-bold">Assigned To</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedTasks.map((task, index) => (
                      <tr key={index} className="border-b border-borderDiv hover:bg-gray-50">
                        <td className="p-3 font-semibold">{task.taskName}</td>
                        <td className="p-3 text-textSecondary">{task.projectName}</td>
                        <td className="p-3">
                          <span className={`text-xs px-2 py-1 rounded font-bold ${
                            task.priority === 'High' ? 'bg-error/10 text-error' : 
                            task.priority === 'Low' ? 'bg-success/10 text-success' : 
                            'bg-warning/10 text-warning'
                          }`}>
                            {task.priority}
                          </span>
                        </td>
                        <td className="p-3 text-textSecondary">{task.dueDate || 'N/A'}</td>
                        <td className="p-3 text-primary font-bold">{task.assignedTo}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-borderDiv">
                <button onClick={() => setStep('upload')} className="text-textSecondary font-bold text-sm hover:text-slateBrand">
                  ← Back
                </button>
                <button 
                  onClick={confirmImport}
                  disabled={isLoading}
                  className="px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primaryDark transition-all disabled:opacity-50"
                >
                  {isLoading ? 'Assigning...' : 'Auto-Assign Tasks'}
                </button>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="py-12 flex flex-col items-center text-center animate-bounceIn">
              <div className="w-20 h-20 bg-success rounded-full flex items-center justify-center text-white text-4xl mb-6 shadow-lg">
                <i className="fa-solid fa-check"></i>
              </div>
              <h3 className="text-2xl font-bold text-textPrimary">Tasks Assigned Successfully!</h3>
              <p className="text-textSecondary mt-2 mb-6">
                {assignments.length} tasks have been distributed to {new Set(assignments.map(a => a.assignedTo)).size} employees
              </p>
              
              <div className="w-full max-h-64 overflow-y-auto bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-bold text-textSecondary uppercase mb-3">Assignment Summary:</p>
                <div className="space-y-2">
                  {assignments.slice(0, 5).map((assignment, index) => (
                    <div key={index} className="flex items-center justify-between text-sm bg-white p-3 rounded-lg">
                      <span className="font-semibold text-textPrimary">{assignment.taskName}</span>
                      <span className="text-primary font-bold">→ {assignment.assignedTo}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


export default ExcelImportModal;