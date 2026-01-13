
import React, { useState, useRef, useMemo } from 'react';
import * as XLSX from 'xlsx';
import Sidebar from './components/Sidebar';
import TopHeader from './components/TopHeader';
import TaskTable from './components/TaskTable';
import CapacityTrends from './components/CapacityTrends';
import LeadCard from './components/LeadCard';
import TaskFormModal from './components/TaskFormModal';
import { LEADS } from './constants';
import { Plus, Upload, Trash2 } from 'lucide-react';
import { TaskRecord } from './types';

const App: React.FC = () => {
  const [activeNav, setActiveNav] = useState('command');
  const [tasks, setTasks] = useState<TaskRecord[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Derive Lead data from current task list (Sorted by task count ascending)
  const dynamicLeads = useMemo(() => {
    const mappedLeads = LEADS.map(lead => {
      const leadTasks = tasks.filter(t => 
        t.employeeName.toLowerCase().includes(lead.name.toLowerCase()) ||
        lead.name.toLowerCase().includes(t.employeeName.toLowerCase())
      );
      
      return {
        ...lead,
        availability: leadTasks.length,
        tags: Array.from(new Set(leadTasks.map(t => t.taskAssigned))).slice(0, 3)
      };
    });

    return [...mappedLeads].sort((a, b) => a.availability - b.availability);
  }, [tasks]);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleClearTasks = () => {
    if (confirm('Are you sure you want to clear all current workload records?')) {
      setTasks([]);
    }
  };

  const handleAddTask = (newTask: TaskRecord) => {
    setTasks(prev => [...prev, newTask]);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(sheet) as any[];

        const importedTasks: TaskRecord[] = json.map((row) => ({
          employeeId: row.Employee_ID || row.employeeId || `ALF-${Math.floor(Math.random() * 10000)}`,
          employeeName: row.Employee_Name || row.employeeName || row.Name || row.Lead || 'Unknown',
          role: row.Role || row.role || 'LEAD',
          date: row.Date || row.date || new Date().toISOString().split('T')[0],
          projectName: row['Project Name'] || row.projectName || row.Project || 'General',
          taskAssigned: row['Task Assigned'] || row.taskAssigned || row.Task || 'No Task',
          taskDescription: row['Task Description'] || row.taskDescription || '-',
          projectAssignedBy: row['Project Assigned By'] || row.projectAssignedBy || row['Assigned By'] || 'System',
          startTime: row['Start Time'] || row.startTime || '09:00',
          endTime: row['End Time'] || row.endTime || '18:00',
          completionDue: row['Task Completion Due'] || row.completionDue || row['Completion Due'] || '-',
          completionStatus: (row['Task Completion Status'] || row.completionStatus || row.Status || 'Pending') as any,
          remarks: row.Remarks || row.remarks || '-',
          repoUrl: row['Repo / URL'] || row.repoUrl || row.Repo || ''
        }));

        setTasks(prevTasks => [...prevTasks, ...importedTasks]);
      } catch (error) {
        console.error('Error parsing Excel file:', error);
        alert('Error parsing file. Ensure column names match headers in your template image.');
      } finally {
        setIsImporting(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="flex min-h-screen bg-[#F8F9FD] text-slate-900">
      <Sidebar activeId={activeNav} setActiveId={setActiveNav} />
      
      <main className="flex-1 ml-64 transition-all duration-300">
        <TopHeader />
        
        <div className="p-10 max-w-[1600px] mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <h1 className="text-5xl font-black tracking-tight text-slate-900">Command Center</h1>
              <p className="text-lg text-slate-500 font-medium leading-relaxed">
                Centralized lifecycle hub. Integrated support for Repo links, mission-specific tasks, and full project assignments.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                accept=".xlsx,.xls,.csv" 
                className="hidden" 
              />
              
              {tasks.length > 0 && (
                <button 
                  onClick={handleClearTasks}
                  className="flex items-center gap-3 px-6 py-4 bg-white border-2 border-rose-100 text-rose-500 rounded-2xl text-xs font-black shadow-sm hover:bg-rose-50 transition-all uppercase tracking-widest"
                >
                  <Trash2 size={16} />
                  Reset Hub
                </button>
              )}

              <button 
                onClick={handleImportClick}
                disabled={isImporting}
                className="flex items-center gap-3 px-8 py-4 bg-white border-2 border-slate-100 text-slate-800 rounded-2xl text-xs font-black shadow-sm hover:border-[#8A7AB5]/30 hover:bg-slate-50 transition-all uppercase tracking-widest disabled:opacity-50"
              >
                <Upload size={16} className="text-[#8A7AB5]" />
                {isImporting ? 'Processing...' : 'Upload Stream'}
              </button>

              <button 
                onClick={() => setIsFormOpen(true)}
                className="flex items-center gap-3 px-8 py-4 bg-sky-400 text-white rounded-2xl text-xs font-black shadow-xl shadow-sky-400/20 hover:bg-sky-500 transition-all uppercase tracking-widest active:scale-95"
              >
                <Plus size={18} />
                New Workstream
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
            <div className="xl:col-span-8 space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Lead Assignment Ranking</h3>
                </div>
                <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black rounded-lg uppercase tracking-widest">
                  Capacity Optimized
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {dynamicLeads.map(lead => (
                  <LeadCard key={lead.id} lead={lead} />
                ))}
              </div>
            </div>

            <div className="xl:col-span-4 sticky top-28">
              <CapacityTrends />
            </div>
          </div>

          <div className="space-y-6 pt-12 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-1.5 h-8 bg-[#8A7AB5] rounded-full" />
                <h3 className="text-2xl font-bold text-slate-900">Aggregate Task Stream</h3>
              </div>
              <div className="flex items-center gap-3 text-slate-400 text-xs font-bold uppercase tracking-widest">
                Aggregated {tasks.length} Records
              </div>
            </div>

            <TaskTable tasks={tasks} />
          </div>
        </div>
      </main>

      <TaskFormModal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onAdd={handleAddTask} 
      />
    </div>
  );
};

export default App;
