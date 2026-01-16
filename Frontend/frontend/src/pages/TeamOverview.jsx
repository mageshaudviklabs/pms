import React, { useState, useMemo } from 'react';
import useEmployees from '../hooks/useEmployees';

const TeamOverview = ({ onAction }) => {
  const { employees, loading } = useEmployees();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.toLowerCase();

    return employees.filter(emp =>
      (emp.name || '').toLowerCase().includes(q) ||
      (emp.id || '').toLowerCase().includes(q) ||
      (emp.department || '').toLowerCase().includes(q)
    );
  }, [search, employees]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <i className="fa-solid fa-spinner fa-spin text-3xl text-primary"></i>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-slideUp">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h2 className="text-5xl font-black gradient-text tracking-tighter">
            Team Overview
          </h2>
          <p className="text-textSecondary font-medium mt-2">
            Showing {employees.length} employees
          </p>
        </div>

        <div className="relative w-full md:w-96">
          <i className="fa-solid fa-magnifying-glass absolute left-5 top-1/2 -translate-y-1/2 text-primary"></i>
          <input
            type="text"
            placeholder="Search by name, ID, or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-14 pr-6 py-5 bg-white border border-borderDiv rounded-[2rem] text-sm font-bold shadow-sm focus:shadow-xl focus:border-primary/30 outline-none transition-all"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 opacity-50">
          <i className="fa-solid fa-users-slash text-6xl mb-4"></i>
          <p className="text-xl font-bold">No employees found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map(emp => {
            const initials = (emp.name || '?')
              .split(' ')
              .map(n => n[0])
              .join('');

            return (
              <div key={emp.id} className="neo-card p-8 rounded-[3rem] group">
                <div className="flex items-center gap-5 mb-6">
                  <div className="w-16 h-16 bg-sidebarBg rounded-3xl flex items-center justify-center text-primary font-black text-xl shadow-inner">
                    {initials}
                  </div>

                  <div>
                    <h4 className="text-xl font-black text-textPrimary">
                      {emp.name}
                    </h4>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-bold">Employee ID:</span> {emp.id}
                  </p>
                  <p>
                    <span className="font-bold">Department:</span> {emp.department}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-borderDiv flex justify-end opacity-0 group-hover:opacity-100 transition-all">
                  <button
                    onClick={() => onAction?.('VIEW_PROFILE', emp)}
                    className="text-xs font-black uppercase text-primary hover:underline"
                  >
                    View Profile
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TeamOverview;