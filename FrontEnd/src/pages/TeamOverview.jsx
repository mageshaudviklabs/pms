import React, { useState, useMemo } from 'react';
import { DUMMY_EXCEL_DATA } from '../services/employeeService';

const TeamOverview = ({ onAction }) => {
  const [search, setSearch] = useState('');
  
  const filtered = useMemo(() => {
    return DUMMY_EXCEL_DATA.filter(e => 
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.role.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <div className="space-y-10 animate-slideUp">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h2 className="text-5xl font-black gradient-text tracking-tighter">Asset Topology</h2>
          <p className="text-textSecondary font-medium mt-2">Comprehensive mapping of {DUMMY_EXCEL_DATA.length} enterprise resources.</p>
        </div>
        <div className="relative w-full md:w-96">
          <i className="fa-solid fa-magnifying-glass absolute left-5 top-1/2 -translate-y-1/2 text-primary"></i>
          <input 
            type="text" 
            placeholder="Search by ID or Talent..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-14 pr-6 py-5 bg-white border border-borderDiv rounded-[2rem] text-sm font-bold shadow-sm focus:shadow-xl focus:border-primary/30 outline-none transition-all"
            aria-label="Search employees"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map(emp => (
          <div key={emp.id} className="neo-card p-8 rounded-[3rem] group">
            <div className="flex items-center justify-between mb-8">
              <div className="w-16 h-16 bg-sidebarBg rounded-3xl flex items-center justify-center text-primary font-black text-xl shadow-inner group-hover:bg-primary group-hover:text-white transition-all">
                {emp.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="text-right">
                <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md ${emp.workload > 100 ? 'bg-error/10 text-error' : 'bg-success/10 text-success'}`}>
                  {emp.workload > 100 ? 'Critical' : 'Stable'}
                </span>
                <p className="text-[10px] text-textSecondary font-black uppercase tracking-widest mt-2">{emp.department}</p>
              </div>
            </div>

            <div className="mb-8">
              <h4 className="text-xl font-black text-textPrimary leading-tight group-hover:text-primary transition-colors">{emp.name}</h4>
              <p className="text-xs text-textSecondary font-bold mt-1 uppercase tracking-tighter">{emp.role}</p>
            </div>

            <div className="space-y-5">
              <div className="flex justify-between items-center text-[10px] font-black uppercase text-textSecondary">
                <span>Workload</span>
                <span className={emp.workload > 100 ? 'text-error' : 'text-primary'}>{emp.workload}%</span>
              </div>
              <div className="bg-sidebarBg h-2.5 rounded-full overflow-hidden shadow-inner p-0.5">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${emp.workload > 100 ? 'bg-error pulse-glow' : 'bg-primary'}`} 
                  style={{ width: `${Math.min(emp.workload, 100)}%` }}
                ></div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-borderDiv flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
              <button 
                onClick={() => onAction('ASSIGN_TASK', emp)} 
                className="text-[10px] font-black uppercase text-textSecondary hover:text-primary transition-colors"
                aria-label={`Assign task to ${emp.name}`}
              >
                Assign Objective
              </button>
              <button 
                onClick={() => onAction('ALLOCATION', emp)} 
                className="text-[10px] font-black uppercase text-primary hover:underline"
                aria-label={`Calibrate ${emp.name}`}
              >
                Calibration
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamOverview;