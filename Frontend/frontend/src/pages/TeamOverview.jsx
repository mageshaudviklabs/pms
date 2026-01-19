import React, { useState, useMemo } from 'react';
import useEmployees from '../hooks/useEmployees';

const TeamOverview = ({ onAction }) => {
  const { employees, loading } = useEmployees();
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');

  // Get unique departments
  const departments = useMemo(() => {
    const depts = [...new Set(employees.map(emp => emp.department))].filter(Boolean);
    return ['All', ...depts.sort()];
  }, [employees]);

  // Calculate statistics
  const stats = useMemo(() => {
    return {
      total: employees.length,
      departments: new Set(employees.map(emp => emp.department).filter(Boolean)).size,
    };
  }, [employees]);

  // Filtered employees
  const filtered = useMemo(() => {
    const q = search.toLowerCase();

    return employees.filter(emp => {
      const matchesSearch = 
        (emp.name || '').toLowerCase().includes(q) ||
        (emp.id || '').toLowerCase().includes(q) ||
        (emp.department || '').toLowerCase().includes(q);
      
      const matchesDepartment = 
        departmentFilter === 'All' || emp.department === departmentFilter;

      return matchesSearch && matchesDepartment;
    });
  }, [search, departmentFilter, employees]);

  // Department color mapping
  const getDepartmentColor = (dept) => {
    const colors = {
      'Engineering': 'bg-blue-100 text-blue-600 border-blue-300',
      'Design': 'bg-purple-100 text-purple-600 border-purple-300',
      'Marketing': 'bg-pink-100 text-pink-600 border-pink-300',
      'Sales': 'bg-green-100 text-green-600 border-green-300',
      'HR': 'bg-orange-100 text-orange-600 border-orange-300',
      'Finance': 'bg-yellow-100 text-yellow-600 border-yellow-300',
    };
    return colors[dept] || 'bg-gray-100 text-gray-600 border-gray-300';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-[#9B8AC7]/30 border-t-[#9B8AC7] rounded-full animate-spin"></div>
          <p className="text-gray-700 font-bold text-lg">Loading Team Members...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E8E4F0] p-8">
      <div className="max-w-[1600px] mx-auto space-y-8 animate-slideUp">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#9B8AC7] to-[#8B7AB7] rounded-2xl flex items-center justify-center border-2 border-[#8B7AB7] shadow-lg">
                <i className="fa-solid fa-users text-2xl text-white"></i>
              </div>
              <div>
                <h2 className="text-4xl font-black text-gray-900 tracking-tight">
                  Team Overview
                </h2>
                <p className="text-sm text-gray-600 font-medium mt-1">
                  Managing {employees.length} team members across {stats.departments} departments
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border-2 border-gray-300 rounded-3xl p-6 hover:shadow-lg transition-all shadow-md">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#9B8AC7]/20 to-[#8B7AB7]/20 rounded-2xl flex items-center justify-center border-2 border-[#9B8AC7]/30">
                <i className="fa-solid fa-users text-xl text-[#9B8AC7]"></i>
              </div>
              <span className="text-3xl font-black text-[#9B8AC7]">{stats.total}</span>
            </div>
            <h4 className="text-sm font-bold text-gray-700 opacity-70 uppercase tracking-wide">Total Employees</h4>
          </div>

          <div className="bg-white border-2 border-gray-300 rounded-3xl p-6 hover:shadow-lg transition-all shadow-md">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center border-2 border-emerald-300">
                <i className="fa-solid fa-building text-xl text-emerald-600"></i>
              </div>
              <span className="text-3xl font-black text-emerald-600">{stats.departments}</span>
            </div>
            <h4 className="text-sm font-bold text-gray-700 opacity-70 uppercase tracking-wide">Departments</h4>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white border-2 border-gray-300 rounded-3xl p-6 shadow-md">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search - HIGHLY VISIBLE */}
            <div className="relative flex-1 w-full lg:max-w-lg">
              <i className="fa-solid fa-magnifying-glass absolute left-5 top-1/2 -translate-y-1/2 text-[#9B8AC7] text-lg"></i>
              <input
                type="text"
                placeholder="Search by name, ID, or department..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-white border-2 border-gray-300 rounded-2xl text-sm font-bold shadow-sm focus:shadow-lg focus:border-[#9B8AC7] outline-none transition-all placeholder:text-gray-400"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 items-center">
              {/* Department Filter */}
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="px-5 py-3.5 bg-white border-2 border-gray-300 rounded-xl text-xs font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#9B8AC7]/20 focus:border-[#9B8AC7] cursor-pointer shadow-sm"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept === 'All' ? 'All Departments' : dept}</option>
                ))}
              </select>

              {/* Clear Filters */}
              {(search !== '' || departmentFilter !== 'All') && (
                <button
                  onClick={() => {
                    setSearch('');
                    setDepartmentFilter('All');
                  }}
                  className="px-4 py-3.5 bg-red-50 text-red-600 border-2 border-red-200 rounded-xl text-xs font-bold hover:bg-red-100 transition-all shadow-sm"
                >
                  <i className="fa-solid fa-times mr-2"></i>
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 pt-4 border-t-2 border-gray-200">
            <p className="text-xs font-bold text-gray-600">
              Showing <span className="text-[#9B8AC7] font-black">{filtered.length}</span> of <span className="text-gray-900 font-black">{employees.length}</span> employees
            </p>
          </div>
        </div>

        {/* Employees Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-gray-300 shadow-md">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-gray-300">
              <i className="fa-solid fa-users-slash text-5xl text-gray-300"></i>
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">No employees found</h3>
            <p className="text-sm text-gray-600 font-medium">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((emp, idx) => {
              const initials = (emp.name || '?')
                .split(' ')
                .map(n => n[0])
                .join('');

              return (
                <div 
                  key={emp.id} 
                  className="bg-white border-2 border-gray-300 rounded-[2.5rem] p-7 hover:shadow-xl hover:border-[#9B8AC7] hover:-translate-y-2 transition-all duration-300 group animate-slideUp relative overflow-hidden shadow-md"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  {/* Background Pattern */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#9B8AC7]/5 rounded-full blur-2xl -z-0"></div>

                  {/* Header */}
                  <div className="flex items-center gap-4 mb-6 relative z-10">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#9B8AC7] to-[#8B7AB7] rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg group-hover:scale-110 transition-all duration-500 border-2 border-[#8B7AB7]">
                      {initials}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-lg font-black text-gray-900 truncate mb-1">
                        {emp.name}
                      </h4>
                      <span className={`inline-block text-[9px] px-2.5 py-1 rounded-lg font-bold uppercase tracking-wider border-2 ${getDepartmentColor(emp.department)}`}>
                        {emp.department || 'N/A'}
                      </span>
                    </div>
                  </div>

                  {/* Info Section */}
                  <div className="space-y-3 text-sm mb-6 relative z-10">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border-2 border-gray-200">
                      <div className="flex items-center gap-2 text-gray-600">
                        <i className="fa-solid fa-id-card text-[#9B8AC7]"></i>
                        <span className="font-medium text-xs">Employee ID</span>
                      </div>
                      <span className="font-black text-gray-900 text-xs">{emp.id}</span>
                    </div>
                    
                    {emp.email && (
                      <div className="flex items-center gap-2 text-gray-600 p-3 bg-gray-50 rounded-xl border-2 border-gray-200">
                        <i className="fa-solid fa-envelope text-[#9B8AC7]"></i>
                        <span className="font-medium text-xs truncate">{emp.email}</span>
                      </div>
                    )}
                  </div>

                  {/* Footer Actions */}
                  <div className="mt-auto pt-4 border-t-2 border-gray-200 relative z-10">
                    <button
                      onClick={() => onAction?.('VIEW_PROFILE', emp)}
                      className="w-full px-4 py-3 bg-gradient-to-r from-[#9B8AC7] to-[#8B7AB7] hover:from-[#8B7AB7] hover:to-[#7B6AA7] text-white border-2 border-[#8B7AB7] rounded-xl text-xs font-black uppercase tracking-wide transition-all duration-300 flex items-center justify-center gap-2 shadow-lg group-hover:shadow-xl"
                    >
                      <i className="fa-solid fa-user text-xs"></i>
                      View Profile
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamOverview;